import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Zap, Activity, Info } from 'lucide-react';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { plant, getSpriteUrl } = useGame();

  const progressPercent = (plant.level / 50) * 100;

  return (
    <div className="home-container">
      <div className="home-aura" />

      <main className="home-content">
        
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="level-badge-container"
        >
          <div className="level-badge">
            <Zap size={14} className="text-[#a1efff]" />
            NÍVEL {plant.level}
          </div>
        </motion.div>

        <div className="plant-display-card">
          <div className="plant-glass-backdrop" />
          
          <div className="plant-card-inner">
            <motion.div 
              className="plant-image-wrapper"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <img 
                src={getSpriteUrl(plant.level)} 
                alt="Your Plant" 
                className="plant-img"
              />
              {/* Particle Effects */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [-10, -50], opacity: [0, 0.5, 0], scale: [0.5, 1.2, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 + i * 0.5, delay: i * 0.3 }}
                    className="absolute bg-[#58e6ff]/40 rounded-full blur-[2px]"
                    style={{ 
                      width: 5 + i * 2, 
                      height: 5 + i * 2,
                      left: `${20 + i * 15}%`,
                      top: '80%'
                    }}
                  />
                ))}
              </div>
            </motion.div>

            <div className="progression-card">
              <div className="progression-header">
                <span className="progression-label">
                  <Activity size={14} /> Progresso Evolutivo
                </span>
                <span className="progression-value">{progressPercent.toFixed(0)}%</span>
              </div>
              <div className="progress-bar">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="progress-bar-fill"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-[2vh]">
          <h2 className="text-3xl font-black text-[#00343c]">
            O seu foco diário <span className="italic text-[#005ab1]">floresce</span> agora.
          </h2>
          
          <button 
            onClick={() => navigate('/quiz')}
            className="btn-main w-full"
          >
            Começar Quiz do Dia
          </button>
          
          <div className="home-footer-info">
            <Info size={12} /> Sugestão de hoje: Biologia celular
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
