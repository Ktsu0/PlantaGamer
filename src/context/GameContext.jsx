import React, { createContext, useState, useContext, useEffect } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [plant, setPlant] = useState({
    level: 1,
    maxLevel: 50,
    dailyQuestions: 10,
    questionsAnsweredToday: 0,
    name: 'Sprout',
    xp: 0,
    records: {
      maxStreak: 0,
      totalCorrect: 0,
      totalSolved: 0
    }
  });

  const getSpriteUrl = (level) => {
    // Every 5 levels the sprite changes stage visually in the UI description,
    // but for the illustrative mockup, we'll swap the image every 10 levels for distinct stages.
    const stage = Math.floor((level - 1) / 10);
    const sprites = [
      "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=80&w=400&auto=format&fit=crop", // Level 1-10: Small Seedling
      "https://images.unsplash.com/photo-1521334884684-d80222895322?q=80&w=400&auto=format&fit=crop", // Level 11-20: Sprout
      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?q=80&w=400&auto=format&fit=crop", // Level 21-30: Small Potted
      "https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?q=80&w=400&auto=format&fit=crop", // Level 31-40: Healthy Bush
      "https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=400&auto=format&fit=crop"  // Level 41-50: Full Mature Tree
    ];
    return sprites[Math.min(stage, sprites.length - 1)];
  };

  const processQuizResult = (correctCount) => {
    let levelChange = 0;
    if (correctCount >= 10) levelChange = 3;
    else if (correctCount >= 7) levelChange = 2;
    else if (correctCount >= 5) levelChange = 1;
    else if (correctCount < 3) levelChange = -1;
    
    setPlant(prev => {
      const newLevel = Math.max(1, Math.min(50, prev.level + levelChange));
      return {
        ...prev,
        level: newLevel,
        questionsAnsweredToday: prev.questionsAnsweredToday + 10,
        records: {
          ...prev.records,
          totalCorrect: prev.records.totalCorrect + correctCount,
          totalSolved: prev.records.totalSolved + 10
        }
      };
    });
  };

  return (
    <GameContext.Provider value={{ plant, setPlant, processQuizResult, getSpriteUrl }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
