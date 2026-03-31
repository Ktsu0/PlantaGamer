import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGame } from "../../context/GameContext";
import {
  ArrowRight,
  Trophy,
  RotateCcw,
  Zap,
  BookOpen,
  Layers,
  BarChart,
  HelpCircle,
} from "lucide-react";
import questionsData from "../../Perguntas.json";
import "./Quiz.css";

const Quiz = () => {
  const navigate = useNavigate();
  const { processQuizResult, plant, getSpriteUrl } = useGame();

  const sessionQuestions = useMemo(() => {
    const answeredKey = "planta_gamer_answered_ids";
    let answeredIds = JSON.parse(localStorage.getItem(answeredKey) || "[]");
    let available = questionsData.filter((q) => !answeredIds.includes(q.id));
    if (available.length < 10) {
      answeredIds = [];
      localStorage.setItem(answeredKey, "[]");
      available = [...questionsData];
    }
    const shuffled = available.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
    const newAnsweredIds = [...answeredIds, ...selected.map((q) => q.id)];
    localStorage.setItem(answeredKey, JSON.stringify(newAnsweredIds));
    return selected.map((q) => ({
      ...q,
      text: q.enunciado,
      options: q.alternativas.map((a) => a.texto),
      correct: q.alternativas.findIndex((a) => a.correta),
    }));
  }, []);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleNext = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === sessionQuestions[currentIdx].correct;
    setAnswers([...answers, isCorrect]);
    setSelectedOption(null);
    if (currentIdx < sessionQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowResult(true);
      const correctCount = [...answers, isCorrect].filter((a) => a).length;
      processQuizResult(correctCount);
    }
  };

  const correctCount = answers.filter((a) => a).length;
  const progressPercent = (plant.level / 50) * 100;

  if (showResult) {
    const isWin = correctCount >= 5;
    return (
      <motion.div
        className="quiz-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass result-card"
        >
          <div className="result-band" />
          <div className="result-icon">
            <Trophy
              size={40}
              className={isWin ? "text-amber-500" : "text-[#00343c]/20"}
            />
          </div>
          <div>
            <h2 className="text-4xl font-black text-[#00343c]">
              {correctCount}/10 Acertos
            </h2>
            <p className="text-[#006573]/60 font-bold mt-2">
              {isWin
                ? "Sua planta está florescendo!"
                : "Falta de foco... sua planta murchou."}
            </p>
          </div>
          <div className="space-y-3 px-8">
            <button
              onClick={() => navigate("/home")}
              className="btn-main w-full"
            >
              Voltar ao Jardim
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 text-sm font-bold text-[#006573]/40 hover:text-[#005ab1] transition-colors w-full"
            >
              <RotateCcw size={14} /> Novo Quiz
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const currentQuestion = sessionQuestions[currentIdx];

  return (
    // Entire quiz page fades in smoothly — eliminates any flash from the Home→Quiz swap
    <motion.div
      className="quiz-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="quiz-split-layout">
        {/* Left Panel: Plant — fades in, no position animation */}
        <aside className="quiz-plant-panel">
          <div className="quiz-plant-display">
            <div className="quiz-planet-orb" />

            <div className="quiz-plant-focus">
              <motion.img
                src={getSpriteUrl(plant.level)}
                alt="Plant State"
                className="quiz-plant-sprite"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
              />

              <div className="quiz-plant-status">
                <span className="level-mini-pill">Nível {plant.level}</span>
                <div className="evolution-track-mini">
                  <div
                    className="evolution-fill"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="quiz-encouragement">
              <Zap size={16} className="text-amber-400" />
              <p>Responda para fortalecer a sua planta</p>
            </div>
          </div>
        </aside>

        {/* Right Panel: Question slides in from right after fade */}
        <motion.main
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
          className="quiz-question-panel"
        >
          <div className="quiz-metadata">
            <div className="meta-badge-group">
              <span className="meta-badge area">
                <Layers size={12} /> {currentQuestion.area}
              </span>
              <span className="meta-badge disciplina">
                <BookOpen size={12} /> {currentQuestion.disciplina}
              </span>
              <span
                className="meta-badge dificuldade"
                data-level={currentQuestion.dificuldade}
              >
                <BarChart size={12} /> {currentQuestion.dificuldade}
              </span>
            </div>

            <div className="quiz-progress-tracker">
              <div className="q-dots">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`q-dot ${i === currentIdx ? "active" : i < currentIdx ? "completed" : ""}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="quiz-question-card">
            <div className="question-section-premium">
              <h2 className="premium-enunciado-split">
                {currentQuestion.text}
              </h2>
            </div>

            <div className="quiz-divider-slim">
              <span className="divider-label-slim">
                Escolha uma alternativa
              </span>
              <div className="divider-line-slim" />
            </div>

            <div className="premium-options-split">
              {currentQuestion.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedOption(i)}
                  className={`premium-option-item-split ${selectedOption === i ? "selected" : ""}`}
                >
                  <div className="option-index-split">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div className="option-content-split">{opt}</div>
                </button>
              ))}
            </div>

            <footer className="quiz-split-footer">
              <div className="focus-indicator">
                <HelpCircle size={14} className="text-[#00acc3]" />
                <span>Avaliação diária de progresso</span>
              </div>
              <button
                disabled={selectedOption === null}
                onClick={handleNext}
                className={`btn-next-split ${selectedOption !== null ? "active" : ""}`}
              >
                {currentIdx === 9 ? "Finalizar" : "Próxima"}{" "}
                <ArrowRight size={18} />
              </button>
            </footer>
          </div>
        </motion.main>
      </div>
    </motion.div>
  );
};

export default Quiz;
