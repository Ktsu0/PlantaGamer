import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Crown, Infinity, Shield, Star, TreePine, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import './EternalModal.css';

const plans = [
  {
    id: 'mensal',
    icon: <Zap size={28} />,
    name: 'Planta Viva',
    period: 'por mês',
    price: 'R$ 9,90',
    priceDetail: 'Cobrado mensalmente',
    color: '#00acc3',
    highlight: false,
    perks: [
      'Planta protegida por 30 dias',
      'Questões ilimitadas',
      'Histórico de progresso',
    ],
  },
  {
    id: 'anual',
    icon: <Crown size={28} />,
    name: 'Planta Forte',
    period: 'por ano',
    price: 'R$ 79,90',
    priceDetail: 'Economize 33% vs mensal',
    badge: 'MAIS POPULAR',
    color: '#f59e0b',
    highlight: true,
    perks: [
      'Planta protegida por 365 dias',
      'Questões ilimitadas',
      'Histórico completo',
      'Relatórios de desempenho',
    ],
  },
  {
    id: 'eterna',
    icon: <Infinity size={28} />,
    name: 'Planta Eterna',
    period: 'pagamento único',
    price: 'R$ 197,00',
    priceDetail: 'Para sempre. Sem mensalidades.',
    badge: 'MELHOR VALOR',
    color: '#8b5cf6',
    highlight: false,
    perks: [
      'Planta imortalizada para sempre',
      'Todas as funcionalidades futuras',
      'Suporte prioritário',
      'Badge exclusivo de fundador',
    ],
  },
];

const EternalModal = ({ onClose }) => {
  const { setPlant } = useGame();
  const [selected, setSelected] = useState('anual');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePurchase = () => {
    setIsProcessing(true);
    
    // Simulação de gateway de pagamento (Checkout)
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Atualiza o estado global para ETERNO
      setTimeout(() => {
        setPlant(prev => ({
          ...prev,
          isEternal: true,
          hasSeenEternalModal: true
        }));
        onClose();
      }, 1500);
    }, 2000);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isProcessing && !isSuccess) onClose();
  };

  return (
    <motion.div
      className="eternal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleOverlayClick}
    >
      <motion.div
        className="eternal-modal"
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="eternal-modal-header">
          <span className="eternal-level-badge">
            <Star size={12} />
            NÍVEL 50 ATINGIDO
          </span>
          {!isProcessing && !isSuccess && (
            <button className="eternal-close" onClick={onClose} aria-label="Fechar">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="eternal-modal-body">
          {isSuccess ? (
            <motion.div 
              className="purchase-success-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="success-icon-container">
                <CheckCircle2 size={80} className="text-emerald-500" />
              </div>
              <h2 className="success-title">Sua Planta Está Imortalizada!</h2>
              <p className="success-text">O plano <strong>{plans.find(p => p.id === selected).name}</strong> foi ativado com sucesso. Aproveite o jogo ilimitado.</p>
            </motion.div>
          ) : (
            <>
              <div className="eternal-hero">
                <motion.div
                  className="eternal-icon-ring"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                >
                  <div className="eternal-icon-dot" style={{ '--angle': '0deg' }} />
                  <div className="eternal-icon-dot" style={{ '--angle': '90deg' }} />
                  <div className="eternal-icon-dot" style={{ '--angle': '180deg' }} />
                  <div className="eternal-icon-dot" style={{ '--angle': '270deg' }} />
                </motion.div>
                <TreePine size={52} className="eternal-tree-icon" />
              </div>

              <h2 className="eternal-title">
                Sua Planta Atingiu<br />
                <span className="eternal-highlight">a Fase Adulta!</span>
              </h2>

              <div className="eternal-warning">
                <AlertTriangle size={20} className="eternal-warning-icon" />
                <div>
                  <p className="eternal-warning-title">A batalha pelo crescimento começa agora</p>
                  <p className="eternal-warning-text">
                    Uma planta adulta exige muito mais cuidado. Daqui para frente, errar perguntas
                    vai <strong>enfraquecer sua planta rapidamente</strong>. Você precisará acertar
                    mais do que nunca para mantê-la viva e florescendo.
                  </p>
                </div>
              </div>

              <p className="eternal-sub">Eternize seu progresso e proteja sua planta:</p>

              <div className="eternal-plans">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    className={`eternal-plan-card ${selected === plan.id ? 'selected' : ''} ${plan.highlight ? 'highlighted' : ''}`}
                    onClick={() => !isProcessing && setSelected(plan.id)}
                    style={{ '--plan-color': plan.color }}
                    disabled={isProcessing}
                  >
                    {plan.badge && <div className="plan-badge" style={{ background: plan.color }}>{plan.badge}</div>}
                    <div className="plan-icon" style={{ color: plan.color }}>{plan.icon}</div>
                    <div className="plan-name">{plan.name}</div>
                    <div className="plan-price">{plan.price}</div>
                    <div className="plan-detail">{plan.priceDetail}</div>
                    <ul className="plan-perks">
                      {plan.perks.map((perk, i) => <li key={i}><Shield size={12} />{perk}</li>)}
                    </ul>
                  </button>
                ))}
              </div>

              <button
                className={`eternal-cta ${isProcessing ? 'loading' : ''}`}
                style={{ background: plans.find(p => p.id === selected)?.color || '#00acc3' }}
                onClick={handlePurchase}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><RotateCcw size={20} /></motion.div>
                ) : (
                  <>
                    <Infinity size={20} />
                    Eternizar Minha Planta
                  </>
                )}
              </button>
            </>
          )}
          {!isSuccess && <p className="eternal-footer-note">🔒 Pagamento 100% seguro · Cancele quando quiser</p>}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EternalModal;
