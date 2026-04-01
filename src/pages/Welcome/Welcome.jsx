import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Leaf,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  Zap,
  Shield,
} from "lucide-react";
import "./Welcome.css";

import planta01 from "../../assets/sprite/planta01.png";
import planta02 from "../../assets/sprite/planta02.png";
import planta03 from "../../assets/sprite/planta03.png";
import planta05 from "../../assets/sprite/planta05.png";
import plantaGod from "../../assets/sprite/plantaGod.png";

const PLANT_LEVELS = [
  {
    img: planta01,
    name: "Semente",
    range: "Nível 1–10",
    desc: "O começo de tudo. Cada questão correta é um raio de sol que alimenta sua semente.",
    color: "#7fba6a",
    glowColor: "rgba(127, 186, 106, 0.35)",
  },
  {
    img: planta02,
    name: "Broto",
    range: "Nível 11–20",
    desc: "Você está crescendo! Consistência diária começa a moldar seu caminho.",
    warning: "A partir do nível 15, não deixe de estudar — sua planta pode murchar!",
    color: "#4caf50",
    glowColor: "rgba(76, 175, 80, 0.35)",
  },
  {
    img: planta03,
    name: "Planta Jovem",
    range: "Nível 21–30",
    desc: "Raízes profundas. Seu conhecimento está ficando sólido e bem estruturado.",
    color: "#00acc3",
    glowColor: "rgba(0, 172, 195, 0.35)",
  },
  {
    img: planta05,
    name: "Planta Adulta",
    range: "Nível 31–40",
    desc: "Maturidade em pleno crescimento. Cada acerto solidifica seu domínio do conhecimento.",
    color: "#0891b2",
    glowColor: "rgba(8, 145, 178, 0.35)",
  },
  {
    img: plantaGod,
    name: "Eternizada",
    range: "Nível 50",
    desc: "A forma suprema. Você chegou ao topo — é uma lenda viva do conhecimento!",
    color: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.45)",
  },
];


const HOW_IT_WORKS = [
  {
    icon: <Target size={22} />,
    step: "01",
    title: "10 Questões por Dia",
    desc: "Todo dia um novo desafio de 10 perguntas te espera. Você tem 12 horas para completar.",
    color: "#005ab1",
  },
  {
    icon: <TrendingUp size={22} />,
    step: "02",
    title: "Ganhe ou Perca Níveis",
    desc: "Mais de 7 acertos = sobe de nível. Menos de 7 = perde nível. Mecânica RPG real.",
    color: "#00acc3",
  },
  {
    icon: <Leaf size={22} />,
    step: "03",
    title: "Planta em Evolução",
    desc: "A cada 5 níveis sua planta muda de aparência — do broto até a forma eternizada.",
    color: "#4caf50",
  },
  {
    icon: <Shield size={22} />,
    step: "04",
    title: "Proteja Seu Progresso",
    desc: "A regularidade é sua armadura. Saltar dias vai fazer sua planta regredir.",
    color: "#8b5cf6",
  },
];

const SLIDE_LABELS = ["Início", "Como Funciona", "Evolução", "Destaques"];

const Welcome = () => {
  const navigate = useNavigate();
  const [activePlant, setActivePlant] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const containerRef = useRef(null);
  const slideRefs = useRef([]);

  /* ── Auto-play carousel ── */
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setActivePlant((prev) => (prev + 1) % PLANT_LEVELS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  /* ── IntersectionObserver: track active slide ── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idx = slideRefs.current.findIndex((r) => r === entry.target);
            if (idx !== -1) setActiveSlide(idx);
          }
        });
      },
      { root: container, threshold: 0.5 }
    );

    slideRefs.current.forEach((ref) => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, []);

  const goPrev = () => {
    setAutoPlay(false);
    setActivePlant((prev) => (prev - 1 + PLANT_LEVELS.length) % PLANT_LEVELS.length);
  };

  const goNext = () => {
    setAutoPlay(false);
    setActivePlant((prev) => (prev + 1) % PLANT_LEVELS.length);
  };

  const scrollToSlide = (idx) => {
    slideRefs.current[idx]?.scrollIntoView({ behavior: "smooth" });
  };

  const current = PLANT_LEVELS[activePlant];

  return (
    <div className="welcome-wrapper" ref={containerRef}>

      {/* ── Side navigation dots ── */}
      <nav className="wc-side-nav">
        {SLIDE_LABELS.map((label, i) => (
          <button
            key={i}
            className={`wc-side-dot ${activeSlide === i ? "active" : ""}`}
            onClick={() => scrollToSlide(i)}
            title={label}
          />
        ))}
      </nav>

      {/* ══════════════════════════════════════
          SLIDE 1 — HERO
      ══════════════════════════════════════ */}
      <section
        className="wc-slide wc-hero"
        ref={(el) => (slideRefs.current[0] = el)}
      >
        <motion.div
          className="wc-hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.div
            className="welcome-badge"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles size={13} style={{ display: "inline", marginRight: 6 }} />
            BEM-VINDO AO PLANTA GAMER
          </motion.div>

          <h1 className="title-xl wc-title">
            Seu foco faz o seu <br />
            <span className="text-gradient">conhecimento florescer</span>.
          </h1>

          <p className="welcome-text">
            Cultive o hábito do estudo diário. <br />
            Responda 10 perguntas por dia e veja sua planta evoluir em tempo real.
          </p>

          <motion.button
            onClick={() => navigate("/home")}
            className="btn-main wc-hero-btn"
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Começar Jornada{" "}
            <Sparkles size={18} style={{ display: "inline", marginLeft: 8 }} />
          </motion.button>

          {/* Scroll hint */}
          <motion.div
            className="wc-scroll-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className="wc-scroll-arrow" />
            <span>Deslize para explorar</span>
          </motion.div>
        </motion.div>

        <div className="wc-orb wc-orb-1" />
        <div className="wc-orb wc-orb-2" />
        <div className="wc-orb wc-orb-3" />
      </section>

      {/* ══════════════════════════════════════
          SLIDE 2 — COMO FUNCIONA
      ══════════════════════════════════════ */}
      <section
        className="wc-slide wc-section wc-how"
        ref={(el) => (slideRefs.current[1] = el)}
      >
        <motion.div
          className="wc-section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="wc-section-tag">COMO FUNCIONA</div>
          <h2 className="wc-section-title">Simples. Viciante. Eficaz.</h2>
        </motion.div>

        <div className="wc-steps-grid">
          {HOW_IT_WORKS.map((item, idx) => (
            <motion.div
              key={idx}
              className="wc-step-card glass"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.5 }}
              whileHover={{ y: -6, boxShadow: "0 20px 50px rgba(0,52,60,0.12)" }}
            >
              <div
                className="wc-step-icon"
                style={{
                  background: `${item.color}18`,
                  color: item.color,
                  border: `1px solid ${item.color}30`,
                }}
              >
                {item.icon}
              </div>
              <div className="wc-step-text">
                <div className="wc-step-num" style={{ color: item.color }}>
                  {item.step}
                </div>
                <h3 className="wc-step-title">{item.title}</h3>
                <p className="wc-step-desc">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          SLIDE 3 — EVOLUÇÃO DAS PLANTAS
      ══════════════════════════════════════ */}
      <section
        className="wc-slide wc-section wc-evolution"
        ref={(el) => (slideRefs.current[2] = el)}
      >
        <motion.div
          className="wc-section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="wc-section-tag">EVOLUÇÃO DA PLANTA</div>
          <h2 className="wc-section-title">Da semente à eternidade</h2>
          <p className="wc-section-sub">
            Sua planta muda de forma a cada 5 níveis conquistados. Quanto mais
            você estuda, mais ela floresce.
          </p>
        </motion.div>

        <div className="wc-carousel">
          {/* Thumbnails */}
          <div className="wc-thumbs">
            {PLANT_LEVELS.map((p, i) => (
              <button
                key={i}
                className={`wc-thumb ${i === activePlant ? "wc-thumb-active" : ""}`}
                onClick={() => { setAutoPlay(false); setActivePlant(i); }}
                style={i === activePlant ? { borderColor: p.color, background: `${p.color}18` } : {}}
              >
                <img src={p.img} alt={p.name} className="wc-thumb-img" />
              </button>
            ))}
          </div>

          {/* Main display */}
          <div className="wc-carousel-main">
            <button className="wc-nav-btn" onClick={goPrev}>
              <ChevronLeft size={20} />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={activePlant}
                className="wc-plant-showcase"
                initial={{ opacity: 0, scale: 0.85, rotateY: 15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.85, rotateY: -15 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
              >
                <div className="wc-plant-glow" style={{ background: current.glowColor }} />
                <motion.img
                  src={current.img}
                  alt={current.name}
                  className="wc-plant-img"
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                />
                <div className="wc-plant-info">
                  <div
                    className="wc-plant-badge"
                    style={{
                      color: current.color,
                      background: `${current.color}18`,
                      border: `1px solid ${current.color}40`,
                    }}
                  >
                    <Star size={13} style={{ display: "inline", marginRight: 5 }} />
                    {current.range}
                  </div>
                  <h3 className="wc-plant-name" style={{ color: current.color }}>
                    {current.name}
                  </h3>
                  <p className="wc-plant-desc">{current.desc}</p>
                  {current.warning && (
                    <div className="wc-plant-warning">
                      <span className="wc-warning-icon">⚠️</span>
                      {current.warning}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <button className="wc-nav-btn" onClick={goNext}>
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Dots */}
          <div className="wc-dots">
            {PLANT_LEVELS.map((p, i) => (
              <button
                key={i}
                className={`wc-dot ${i === activePlant ? "wc-dot-active" : ""}`}
                onClick={() => { setAutoPlay(false); setActivePlant(i); }}
                style={i === activePlant ? { background: p.color } : {}}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SLIDE 4 — STATS + CTA
      ══════════════════════════════════════ */}
      <section
        className="wc-slide wc-slide-stats"
        ref={(el) => (slideRefs.current[3] = el)}
      >
        <motion.div
          className="wc-section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="wc-section-tag">DESTAQUES</div>
          <h2 className="wc-section-title">Números que motivam</h2>
        </motion.div>

        <div className="wc-stats-row">
          {[
            { icon: <Zap size={20} />, value: "10", label: "questões por dia", color: "#005ab1" },
            { icon: <TrendingUp size={20} />, value: "50", label: "níveis para conquistar", color: "#00acc3" },
            { icon: <Leaf size={20} />, value: "9", label: "formas de planta", color: "#4caf50" },
            { icon: <Star size={20} />, value: "∞", label: "conhecimento acumulado", color: "#f59e0b" },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="wc-stat-card glass"
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className="wc-stat-icon" style={{ color: s.color }}>{s.icon}</div>
              <div className="wc-stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="wc-stat-label">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="wc-final-inner glass"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="wc-final-orb" />
          <h2 className="wc-final-title">
            Pronto para <span className="text-gradient">florescer</span>?
          </h2>
          <p className="wc-final-sub">
            Sua planta está esperando. Comece hoje e nunca mais perca o ritmo.
          </p>
          <motion.button
            onClick={() => navigate("/home")}
            className="btn-main wc-final-btn"
            whileHover={{ scale: 1.06, y: -5 }}
            whileTap={{ scale: 0.97 }}
          >
            Iniciar Agora{" "}
            <Sparkles size={18} style={{ display: "inline", marginLeft: 8 }} />
          </motion.button>
        </motion.div>
      </section>

    </div>
  );
};

export default Welcome;
