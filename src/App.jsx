import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { GameProvider, useGame } from './context/GameContext';
import Header from './components/Header/Header';
import EternalModal from './components/EternalModal/EternalModal';
import Welcome from './pages/Welcome/Welcome';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import Quiz from './pages/Quiz/Quiz';
import './index.css';

// Componente interno para acessar o Contexto
function AppContent() {
  const { plant, showEternalModal, dismissEternalModal, openEternalModal } = useGame();

  // O botão flutuante só aparece se:
  // 1. Atingiu nível 50
  // 2. Já viu e fechou o modal uma vez
  // 3. AINDA NÃO é eterna (isEternal false)
  // 4. O modal não está aberto agora
  const showFloatingBtn = plant.level >= 50 && 
                          plant.hasSeenEternalModal && 
                          !plant.isEternal && 
                          !showEternalModal;

  return (
    <div className="app-container">
      <Header />

      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Modal Global de Nível 50 / Compra */}
      <AnimatePresence>
        {showEternalModal && (
          <EternalModal onClose={dismissEternalModal} />
        )}
      </AnimatePresence>

      {/* Botão flutuante para reabrir modal de compra */}
      <AnimatePresence>
        {showFloatingBtn && (
          <motion.button
            className="eternal-floating-btn"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onClick={openEternalModal}
            title="Proteja sua planta adulta"
          >
            🌳 Planta Eterna
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <Router>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </Router>
  );
}

export default App;
