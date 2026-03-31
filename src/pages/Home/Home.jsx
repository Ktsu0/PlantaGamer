import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Zap, Clock, CheckCircle2, Lock } from 'lucide-react';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { plant, getSpriteUrl, canPlayToday } = useGame();
  const [leaving, setLeaving] = useState(false);
  const plantCardRef = useRef(null);

  const progressPercent = (plant.level / 50) * 100;
  const isAvailable = canPlayToday();

  const handleStartQuiz = () => {
    if (!isAvailable || !plantCardRef.current) return;

    // FLIP Step 1 — record current position
    const rect = plantCardRef.current.getBoundingClientRect();
    sessionStorage.setItem('plantFlipRect', JSON.stringify({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    }));

    setLeaving(true);
    // Transição curta para o Quiz
    setTimeout(() => navigate('/quiz'), 120);
  };

  return (
    <div className="home-container">

      {/* Level badge */}
      <motion.div
        className="level-badge-closer"
        initial={{ opacity: 0, y: -20 }}
        animate={leaving ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="level-badge-mini">
          <Zap size={12} className="text-[#a1efff]" />
          NÍVEL {plant.level}
        </div>
      </motion.div>

      {/* Plant card */}
      <div
        ref={plantCardRef}
        className="plant-card-home"
      >
        <div className="plant-card-orb-home" />

        <motion.img
          key={getSpriteUrl(plant.level)}
          src={getSpriteUrl(plant.level)}
          alt="Sua Planta"
          className="plant-img-home"
          initial={{ scale: 0.4, opacity: 0, filter: "brightness(2.5) drop-shadow(0 0 40px rgba(0,255,255,1))" }}
          animate={{ 
            scale: 1, 
            opacity: 1, 
            filter: "brightness(1) drop-shadow(0 0 0px rgba(0,255,255,0))",
            y: leaving ? 0 : [0, -8, 0] 
          }}
          transition={{ 
            y: { repeat: leaving ? 0 : Infinity, duration: 4, ease: 'easeInOut' },
            default: { duration: 1.2, type: "spring", bounce: 0.4 } 
          }}
        />

        <div className="progression-home">
          <div className="progress-bar-mini">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="progress-bar-fill"
            />
          </div>
          <span className="progression-percent-mini">{progressPercent.toFixed(0)}% de evolução</span>
        </div>
      </div>

      {/* Daily Status & CTA */}
      <motion.div
        className="home-controls"
        initial={{ opacity: 0, y: 20 }}
        animate={leaving ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {!isAvailable ? (
          <div className="daily-limit-reached">
            <CheckCircle2 size={18} className="text-emerald-500" />
            <span>Meta Diária Concluída</span>
            <p className="limit-subtitle">Nova rodada disponível em 12h</p>
          </div>
        ) : (
          <div className="daily-status">
            <Clock size={14} />
            <span>Rodada disponível (10 questões)</span>
          </div>
        )}

        <button 
          onClick={handleStartQuiz} 
          className={`btn-main ${!isAvailable ? 'disabled' : ''}`}
          disabled={!isAvailable || leaving}
        >
          {!isAvailable ? (
            <><Lock size={18} /> Limite Atingido</>
          ) : (
            'Começar Rodada'
          )}
        </button>
      </motion.div>

    </div>
  );
};

export default Home;
