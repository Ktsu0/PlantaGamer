import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../../context/GameContext";
import {
  ArrowRight,
  Trophy,
  RotateCcw,
  Zap,
  BookOpen,
  HelpCircle,
  Shapes,
  LibraryBig,
} from "lucide-react";
import questionsData from "../../Perguntas.json";
import "./Quiz.css";

const Quiz = () => {
  const navigate = useNavigate();
  const { processQuizResult, plant, getSpriteUrl } = useGame();
  const [ready, setReady] = useState(false);
  const plantPanelRef = useRef(null);

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
      status: {
        dificuldade: q.dificuldade || "Média",
        area: q.area || "Geral",
        disciplina: q.disciplina || "Geral",
      },
    }));
  }, []);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("plantFlipRect");
    if (!stored || !plantPanelRef.current) {
      setReady(true);
      return;
    }
    sessionStorage.removeItem("plantFlipRect");

    const from = JSON.parse(stored);
    const panel = plantPanelRef.current;
    const to = panel.getBoundingClientRect();

    const dx = from.left - to.left;
    const dy = from.top - to.top;
    const scaleX = from.width / to.width;
    const scaleY = from.height / to.height;

    panel.style.transition = "none";
    panel.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
    panel.style.transformOrigin = "center center";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        panel.style.transition =
          "transform 0.8s cubic-bezier(0.2, 0, 0, 1), border-radius 0.8s ease";
        panel.style.transform = "";
        setTimeout(() => setReady(true), 600);
      });
    });
  }, []);

  const handleNext = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === sessionQuestions[currentIdx].correct;
    setAnswers([...answers, isCorrect]);

    if (currentIdx < sessionQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
    } else {
      const correctCount = [...answers, isCorrect].filter(Boolean).length;
      processQuizResult(correctCount);
      setShowResult(true);
    }
  };

  const currentQ = sessionQuestions[currentIdx];

  if (showResult) {
    const correctCount = answers.filter(Boolean).length;
    return (
      <div className="quiz-container">
        <motion.div
          className="glass result-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Trophy size={64} className="result-icon" />
          <h2 className="result-title">Rodada Concluída!</h2>
          <p className="result-text">
            Você acertou <strong>{correctCount} de 10</strong>.
          </p>
          <button onClick={() => navigate("/home")} className="btn-main">
            Voltar para Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-split-layout">
        <aside className="quiz-plant-panel">
          <div ref={plantPanelRef} className="quiz-plant-display">
            <div className="quiz-planet-orb" />
            <div className="quiz-plant-focus">
              <img
                src={getSpriteUrl(plant.level)}
                className="quiz-plant-sprite"
                alt="Plant"
              />
              <div className="quiz-plant-status">
                <div className="level-mini-pill">LVL {plant.level}</div>
                <div className="evolution-track-mini">
                  <div
                    className="evolution-fill"
                    style={{ width: `${(plant.level / 50) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="quiz-encouragement">
              <Zap size={14} /> Foco na meta!
            </div>
          </div>
        </aside>

        <main className="quiz-question-panel">
          <AnimatePresence mode="wait">
            {ready && (
              <motion.div
                key="q-area"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: "100%" }}
              >
                {/* Meta Header - Agora com Área e Disciplina */}
                <div className="quiz-metadata">
                  <div className="meta-badge-group">
                    <div className="meta-badge area">
                      <Shapes size={12} />
                      {currentQ.status.area}
                    </div>
                    <div className="meta-badge disciplina">
                      <LibraryBig size={12} />
                      {currentQ.status.disciplina}
                    </div>
                    <div
                      className="meta-badge dificuldade"
                      data-level={currentQ.status.dificuldade}
                    >
                      <Zap size={12} />
                      {currentQ.status.dificuldade}
                    </div>
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
                  <h1 className="premium-enunciado-split">{currentQ.text}</h1>

                  <div className="quiz-divider-slim">
                    <span className="divider-label-slim">ALTERNATIVAS</span>
                    <div className="divider-line-slim" />
                  </div>

                  <div className="premium-options-split">
                    {currentQ.options.map((opt, i) => (
                      <button
                        key={i}
                        className={`premium-option-item-split ${selectedOption === i ? "selected" : ""}`}
                        onClick={() => setSelectedOption(i)}
                      >
                        <div className="option-index-split">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <div className="option-content-split">{opt}</div>
                      </button>
                    ))}
                  </div>

                  <div className="quiz-split-footer">
                    <div className="focus-indicator">
                      <HelpCircle size={14} /> Selecione sua resposta
                    </div>
                    <button
                      className={`btn-next-split ${selectedOption !== null ? "active" : ""}`}
                      disabled={selectedOption === null}
                      onClick={handleNext}
                    >
                      <span>{currentIdx === 9 ? "Finalizar" : "Próxima"}</span>
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Quiz;
