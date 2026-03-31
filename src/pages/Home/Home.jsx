import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Zap } from 'lucide-react';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { plant, getSpriteUrl } = useGame();
  // phase: 'idle' | 'moving' | 'fading'
  const [phase, setPhase] = useState('idle');

  const progressPercent = (plant.level / 50) * 100;

  const handleStartQuiz = () => {
    // Step 1: move plant card to quiz position (700ms)
    setPhase('moving');
    // Step 2: fade entire screen out (starts at 700ms, lasts 200ms)
    setTimeout(() => setPhase('fading'), 700);
    // Step 3: navigate when screen is already black (900ms)
    setTimeout(() => navigate('/quiz'), 900);
  };

  return (
    <motion.div
      className="home-container"
      animate={{ opacity: phase === 'fading' ? 0 : 1 }}
      transition={{ duration: 0.2 }}
    >

      {/* Level badge — fades out when plant starts moving */}
      <motion.div
        className="level-badge-closer"
        animate={phase !== 'idle' ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="level-badge-mini">
          <Zap size={12} className="text-[#a1efff]" />
          NÍVEL {plant.level}
        </div>
      </motion.div>

      {/* Plant card — morphs position and style */}
      <motion.div
        className="plant-card-animated"
        animate={phase !== 'idle' ? {
          x: 'calc(-50vw + 21vw)',  // moves to left panel center
          y: '-2vh',
          width: '30vw',
          borderRadius: '4rem',
          background: 'rgba(255,255,255,0.4)',
          boxShadow: '0 40px 100px -20px rgba(0,52,60,0.1)',
        } : {
          x: 0,
          y: 0,
          width: '30vw',
          borderRadius: '3rem',
          background: 'rgba(255,255,255,0.65)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.12)',
        }}
        transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="plant-card-orb" style={{ opacity: phase !== 'idle' ? 1 : 0, transition: 'opacity 0.4s' }} />

        <div className="plant-inner">
          <motion.img
            src={getSpriteUrl(plant.level)}
            alt="Your Plant"
            className="plant-img-animated"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          />

          <div className="progression-animated">
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
      </motion.div>

      {/* Button — fades out when plant starts moving */}
      <motion.div
        animate={phase !== 'idle' ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{ pointerEvents: phase !== 'idle' ? 'none' : 'auto' }}
      >
        <button onClick={handleStartQuiz} className="btn-main">
          Começar Quiz
        </button>
      </motion.div>

    </motion.div>
  );
};

export default Home;
