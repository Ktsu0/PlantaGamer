import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Header from './components/Header/Header';
import Welcome from './pages/Welcome/Welcome';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import Quiz from './pages/Quiz/Quiz';
import './index.css';

function App() {
  return (
    <Router>
      <GameProvider>
        <div className="app-container">
          <Header />
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </GameProvider>
    </Router>
  );
}

export default App;
