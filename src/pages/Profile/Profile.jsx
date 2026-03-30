import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Medal, Map, Zap, Star, Sparkles, Calendar, Trophy } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { plant } = useGame();

  const stats = [
    { icon: <Trophy size={18} />, label: 'Maior Sequência', value: `${plant.records.maxStreak} Dias` },
    { icon: <Star size={18} />, label: 'Total Acertos', value: plant.records.totalCorrect },
    { icon: <Medal size={18} />, label: 'Total Questões', value: plant.records.totalSolved },
    { icon: <Map size={18} />, label: 'Nível Atual', value: plant.level },
  ];

  return (
    <div className="profile-container">
      <div className="profile-grid">
        
        {/* Left Card: Profile Overview */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass profile-card-left"
        >
          <div className="profile-avatar-large">
            <img 
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop" 
              alt="UserAvatar" 
              className="avatar-large-img"
            />
            <div className="absolute -bottom-2 -right-2 bg-[#323b52] text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#e6faff] shadow-lg">
              <Star size={18} className="text-[#a1efff]" />
            </div>
          </div>
          
          <div>
            <h2 className="profile-name">GreenMaster_88</h2>
            <p className="profile-title">JARDINEIRO LENDÁRIO</p>
          </div>

          <div className="xp-container">
            <div className="xp-header">
              <span className="xp-label">XP Total</span>
              <span className="xp-value">124,500</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: '75%' }} />
            </div>
            <div className="level-up-badge">
              <div className="flex items-center gap-2 text-xs font-bold text-[#005ab1]">
                <Zap size={14} /> LEVEL UP
              </div>
              <span className="text-[10px] font-black text-[#00343c]/40">75%</span>
            </div>
          </div>
        </motion.div>

        {/* Right Area: Stats & Progression */}
        <div className="md:col-span-2 space-y-[2vw]">
          
          {/* Stats Grid */}
          <div className="stats-grid">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="glass stat-card"
              >
                <div className="stat-header">
                  <div className="stat-icon">
                    {stat.icon}
                  </div>
                  <span className="stat-label">{stat.label}</span>
                </div>
                <div className="stat-value">{stat.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Activity Timeline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass timeline-card"
          >
            <div className="timeline-header">
              <div className="timeline-icon">
                <Calendar size={20} />
              </div>
              <h3 className="timeline-title">Timeline de Crescimento</h3>
            </div>
            
            <div className="timeline-placeholder">
              {[60, 40, 85, 50, 90, 70, 45].map((h, i) => (
                <div key={i} className="timeline-bar" style={{ height: `${h}%` }}>
                  <span className="timeline-label">S{i+1}</span>
                </div>
              ))}
            </div>

            <div className="timeline-alert">
              <Sparkles size={16} className="text-[#005ab1]" />
              <span>Parabéns! Na última semana você superou sua meta em <b>15%</b>.</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
