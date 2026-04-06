import React, { createContext, useState, useContext, useEffect } from "react";
import planta01 from "../assets/sprite/planta01.png";
import planta02 from "../assets/sprite/planta02.png";
import planta03 from "../assets/sprite/planta03.png";
import planta04 from "../assets/sprite/planta04.png";
import planta05 from "../assets/sprite/planta05.png";
import plantaF06 from "../assets/sprite/plantaF06.png";
import plantaF07 from "../assets/sprite/plantaF07.png";
import plantaF08 from "../assets/sprite/plantaF08.png";
import plantaGod from "../assets/sprite/plantaGod.png";

const GameContext = createContext();

const STORAGE_KEY = "planta_gamer_state";

const defaultState = {
  level: 1,
  witherStage: 0, // 0: Saudável, 1-3: Murchando/Morrendo
  lastCheckDate: null,
  maxLevel: 50,
  name: "Sprout",
  xp: 0,
  hasSeenEternalModal: false,
  isEternal: false, // Se o usuário comprou o plano eterno
  records: {
    maxStreak: 0,
    totalCorrect: 0,
    totalSolved: 0,
    quizzesCompleted: 0,
  },
  dailyProgress: {
    date: null,
    questionsToday: 0,
    quizzesToday: 0,
  },
};

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

const todayStr = () => new Date().toISOString().slice(0, 10);

export const GameProvider = ({ children }) => {
  const [plant, setPlant] = useState(loadState);
  const [showEternalModal, setShowEternalModal] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plant));
  }, [plant]);

  useEffect(() => {
    const today = todayStr();
    setPlant((prev) => {
      const newState = { ...prev };
      let changed = false;

      // 1. Verificação de dias faltados para aplicar a mecânica de murcha
      const lastCheck = prev.lastCheckDate || today;
      if (lastCheck !== today) {
        const d1 = new Date(lastCheck);
        const d2 = new Date(today);
        const diffDays = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
          // Jogador logou no lastCheckDate e completou o quiz?
          const playedLastCheck =
            prev.dailyProgress.date === lastCheck &&
            prev.dailyProgress.quizzesToday > 0;

          let missedDays = 0;
          // Se não jogou no último dia aberto, conta como falta
          if (!playedLastCheck) missedDays += 1;
          // Soma os dias vazios no meio (em que o app nem foi aberto)
          if (diffDays > 1) missedDays += diffDays - 1;

          // Punição: Murchar as plantas da fase >= 15
          if (missedDays > 0 && prev.level >= 15 && !prev.isEternal) {
            newState.witherStage = Math.min(
              3,
              (prev.witherStage || 0) + missedDays,
            );
          }
        }
        newState.lastCheckDate = today;
        changed = true;
      }

      // 2. Resetar o progresso diário se virou a noite
      if (prev.dailyProgress.date !== today) {
        newState.dailyProgress = {
          date: today,
          questionsToday: 0,
          quizzesToday: 0,
        };
        changed = true;
      }

      return changed ? newState : prev;
    });
  }, []);

  useEffect(() => {
    if (plant.level >= 50 && !plant.hasSeenEternalModal) {
      const t = setTimeout(() => setShowEternalModal(true), 1200);
      return () => clearTimeout(t);
    }
  }, [plant.level, plant.hasSeenEternalModal]);

  const getSpriteUrl = (lvl) => {
    // Se o usuário tem o plano eterno, a planta vira o Deus Planta Imortal
    if (plant.isEternal) return plantaGod;

    // Lógica padrão para plantas saudáveis
    const stage = Math.floor((lvl - 1) / 5);
    const sprites = [planta01, planta02, planta03, planta04, planta05];

    let sprite = sprites[Math.min(stage, sprites.length - 1)];

    // Mecânica de Murchar: Sobrepõe o sprite se lvl >= 15, sem plano eterno e não cuidou bem
    if (lvl >= 15 && plant.witherStage > 0 && !plant.isEternal) {
      if (plant.witherStage === 1) sprite = plantaF06;
      else if (plant.witherStage === 2) sprite = plantaF07;
      else sprite = plantaF08;
    }

    return sprite;
  };

  const processQuizResult = (correctCount) => {
    let levelChange = 0;
    // Punição mais severa se for adulta (Level 50)
    const isAdult = plant.level >= 50;

    if (correctCount >= 10) levelChange = 3;
    else if (correctCount >= 7) levelChange = 2;
    else if (correctCount >= 5) levelChange = 1;
    else if (correctCount < 5) {
      levelChange = isAdult ? -3 : -1; // Se for adulta e errar metade/mais, cai muito
    }

    setPlant((prev) => {
      // Mecânica de cuidar/murchar da planta (a partir do nível 15) se acertar menos de 3.
      let newWither = prev.witherStage || 0;
      if (prev.level >= 15 && !prev.isEternal) {
        if (correctCount < 3) {
          // Menos de 3 acertos: Piora a saúde da planta murchando!
          newWither = Math.min(3, newWither + 1);
        } else if (correctCount >= 3) {
          // Se se cuidou com pelo menos 3 acertos: Planta se recupera e volta a ficar saudável.
          newWither = 0;
        }
      }

      const newLevel = Math.max(1, Math.min(50, prev.level + levelChange));
      return {
        ...prev,
        level: newLevel,
        witherStage: newWither,
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
        },
      };
    });
  };

  const dismissEternalModal = () => {
    setShowEternalModal(false);
    setPlant((prev) => ({ ...prev, hasSeenEternalModal: true }));
  };

  const openEternalModal = () => setShowEternalModal(true);

  const canPlayToday = () => {
    if (plant.isEternal) return true; // Upgrade eterno remove o limite
    const today = todayStr();
    if (plant.dailyProgress.date !== today) return true;
    return plant.dailyProgress.quizzesToday < 1; // 1 quiz por dia
  };

  return (
    <GameContext.Provider
      value={{
        plant,
        setPlant,
        processQuizResult,
        getSpriteUrl,
        canPlayToday,
        showEternalModal,
        openEternalModal,
        dismissEternalModal,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
