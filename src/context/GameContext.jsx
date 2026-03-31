import React, { createContext, useState, useContext, useEffect } from 'react';

const GameContext = createContext();

const STORAGE_KEY = 'planta_gamer_state';

const defaultState = {
  level: 1,
  maxLevel: 50,
  name: 'Sprout',
  xp: 0,
  records: {
    maxStreak: 0,
    totalCorrect: 0,
    totalSolved: 0,
    quizzesCompleted: 0,
  },
  dailyProgress: {
    date: null,          // ISO date string (YYYY-MM-DD) of last quiz day
    questionsToday: 0,   // questions answered today
    quizzesToday: 0,     // full quizzes completed today
  }
};

// Load saved state from localStorage, merging with defaults to handle new fields
const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultState;
    const parsed = JSON.parse(saved);
    return {
      ...defaultState,
      ...parsed,
      records: { ...defaultState.records, ...parsed.records },
      dailyProgress: { ...defaultState.dailyProgress, ...parsed.dailyProgress },
    };
  } catch {
    return defaultState;
  }
};

// Get today's date as YYYY-MM-DD string
const todayStr = () => new Date().toISOString().slice(0, 10);

export const GameProvider = ({ children }) => {
  const [plant, setPlant] = useState(loadState);

  // Persist every state change to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plant));
  }, [plant]);

  // Reset daily counters if it's a new day
  useEffect(() => {
    const today = todayStr();
    if (plant.dailyProgress.date !== today) {
      setPlant(prev => ({
        ...prev,
        dailyProgress: {
          date: today,
          questionsToday: 0,
          quizzesToday: 0,
        }
      }));
    }
  }, []);

  const getSpriteUrl = (level) => {
    const stage = Math.floor((level - 1) / 10);
    const sprites = [
      "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=80&w=400&auto=format&fit=crop", // 1-10
      "https://images.unsplash.com/photo-1521334884684-d80222895322?q=80&w=400&auto=format&fit=crop", // 11-20
      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?q=80&w=400&auto=format&fit=crop", // 21-30
      "https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?q=80&w=400&auto=format&fit=crop", // 31-40
      "https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=400&auto=format&fit=crop", // 41-50
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
        records: {
          ...prev.records,
          totalCorrect: prev.records.totalCorrect + correctCount,
          totalSolved: prev.records.totalSolved + 10,
          quizzesCompleted: prev.records.quizzesCompleted + 1,
        },
        dailyProgress: {
          ...prev.dailyProgress,
          date: todayStr(),
          questionsToday: prev.dailyProgress.questionsToday + 10,
          quizzesToday: prev.dailyProgress.quizzesToday + 1,
        }
      };
    });
  };

  // Helper to check if user has reached the daily quiz limit
  const canPlayToday = () => {
    const today = todayStr();
    if (plant.dailyProgress.date !== today) return true;
    return plant.dailyProgress.quizzesToday < 1; // 1 quiz (10 questions) per day
  };

  return (
    <GameContext.Provider value={{ plant, setPlant, processQuizResult, getSpriteUrl, canPlayToday }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
