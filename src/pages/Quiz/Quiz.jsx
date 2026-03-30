import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { ArrowRight, Trophy, RotateCcw, Zap, Calendar } from 'lucide-react';
import './Quiz.css';

const QUESTIONS = [
  { id: 1, text: "Qual parte da planta é responsável pela fotossíntese?", options: ["Raiz", "Folha", "Caule", "Flor"], correct: 1 },
  { id: 2, text: "O que as plantas precisam para crescer?", options: ["Luz, água e solo", "Apenas água", "Luz e escuridão", "Ar e fogo"], correct: 0 },
  { id: 3, text: "Qual o processo de transformação da semente em planta?", options: ["Polinização", "Transpiração", "Germinação", "Fertilização"], correct: 2 },
  { id: 4, text: "O que é clorofila?", options: ["Um tipo de flor", "O pigmento verde", "A raiz principal", "O fruto"], correct: 1 },
  { id: 5, text: "Qual planta é conhecida por armazenar muita água?", options: ["Samambaia", "Cacto", "Rosa", "Orquídea"], correct: 1 },
  { id: 6, text: "Como as plantas 'bebem' água?", options: ["Pelas folhas", "Pelas flores", "Pelas raízes", "Pelo vento"], correct: 2 },
  { id: 7, text: "As plantas transformam gás carbônico em...", options: ["Nitrogênio", "Oxigênio", "Hélio", "Argônio"], correct: 1 },
  { id: 8, text: "Qual o nome da estrutura que protege a semente?", options: ["Casca", "Fruto", "Pétala", "Espinho"], correct: 1 },
  { id: 9, text: "Plantas que vivem na água são chamadas de:", options: ["Terrestres", "Aéreas", "Aquáticas", "Sterradas"], correct: 2 },
  { id: 10, text: "A polinização é feita principalmente por:", options: ["Pedras", "Insetos e vento", "Fogo", "Sombra"], correct: 1 }
];

const Quiz = () => {
  const navigate = useNavigate();
  const { processQuizResult } = useGame();
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleNext = () => {
    if (selectedOption === null) return;
    
    const isCorrect = selectedOption === QUESTIONS[currentIdx].correct;
    setAnswers([...answers, isCorrect]);
    setSelectedOption(null);
    
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowResult(true);
      const correctCount = [...answers, isCorrect].filter(a => a).length;
      processQuizResult(correctCount);
    }
  };

  const correctCount = answers.filter(a => a).length;
  const progress = ((currentIdx + 1) / QUESTIONS.length) * 100;

  if (showResult) {
    const isWin = correctCount >= 5;
    return (
      <div className="quiz-container">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass result-card"
        >
          <div className="result-band" />
          
          <div className="result-icon">
            <Trophy size={40} className={isWin ? "text-amber-500" : "text-[#00343c]/20"} />
          </div>

          <div>
            <h2 className="text-4xl font-black text-[#00343c]">
              {correctCount}/10 Acertos
            </h2>
            <p className="text-[#006573]/60 font-bold mt-2">
              {isWin ? "Sua planta está florescendo!" : "Falte de foco... sua planta murchou."}
            </p>
          </div>

          <div className="space-y-3 px-8">
            <button 
              onClick={() => navigate('/home')}
              className="btn-main w-full"
            >
              Voltar ao Jardim
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="flex items-center justify-center gap-2 text-sm font-bold text-[#006573]/40 hover:text-[#005ab1] transition-colors w-full"
            >
              <RotateCcw size={14} /> Tentar Novamente
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentIdx];

  return (
    <div className="quiz-container">
      <div className="quiz-main">
        
        <div className="quiz-header">
          <div className="quiz-progress-info">
            <span className="quiz-question-count">
              Questão {currentIdx + 1} de 10
            </span>
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`w-3 h-1 rounded-full ${i <= currentIdx ? 'bg-[#00acc3]' : 'bg-[#00acc3]/10'}`} />
              ))}
            </div>
          </div>
          <h2 className="quiz-question-text">
            {currentQuestion.text}
          </h2>
        </div>

        <div className="options-grid">
           {currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelectedOption(i)}
                className={`option-button ${selectedOption === i ? 'bg-[#323b52] border-[#323b52] text-white shadow-xl' : ''}`}
              >
                <span className={`option-text ${selectedOption === i ? 'text-white' : ''}`}>{opt}</span>
                <div className={`option-check ${selectedOption === i ? 'bg-white border-white scale-125' : ''}`} />
              </button>
            ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#006573]/40">
            <Zap size={14} /> GANHE ATÉ +3 NÍVEIS HOJE
          </div>
          <button 
            disabled={selectedOption === null}
            onClick={handleNext}
            className={`flex items-center gap-2 font-black py-4 px-8 rounded-2xl transition-all ${
              selectedOption !== null 
              ? 'bg-[#323b52] text-white shadow-lg cursor-pointer transform hover:-translate-y-1' 
              : 'bg-black/5 text-[#00343c]/20 cursor-not-allowed'
            }`}
          >
            Próxima <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
