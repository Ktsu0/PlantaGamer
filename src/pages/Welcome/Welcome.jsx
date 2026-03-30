import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Leaf, History, Sparkles } from 'lucide-react';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="welcome-hero"
        >
          <div className="welcome-badge">
            BEM-VINDO AO PLANTA GAMER
          </div>
          <h1 className="title-xl">
            O seu foco agora <br/>
            <span className="text-gradient">faz o seu progresso florescer</span>.
          </h1>
          <p className="welcome-text">
            Cultive o hábito do estudo diário. 10 perguntas por dia para transformar seu conhecimento em uma planta de nível 50. 
          </p>
        </motion.div>

        <div className="feature-grid">
          {[
            { icon: <Target size={20} className="text-[#005ab1]" />, title: 'Desafio Diário', desc: 'Responda 10 questões por dia para manter o foco.' },
            { icon: <Leaf size={20} className="text-emerald-600" />, title: 'Evolução Visual', desc: 'Cada 5 níveis sua planta muda de forma e sprinte.' },
            { icon: <History size={20} className="text-amber-600" />, title: 'Mecânica RPG', desc: 'Ganhe ou perca níveis baseando-se no seu desempenho.' }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="glass feature-card"
            >
              <div className="feature-icon-wrapper">
                {item.icon}
              </div>
              <h3 className="feature-title">{item.title}</h3>
              <p className="feature-desc">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="welcome-cta"
        >
          <button 
            onClick={() => navigate('/home')}
            className="btn-main"
          >
            Começar Jornada <Sparkles size={20} style={{display:'inline', marginLeft:'8px'}} />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;
