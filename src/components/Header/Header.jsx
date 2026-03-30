import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Bell, Leaf } from 'lucide-react';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const isProfile = location.pathname === '/profile';

  return (
    <header className="header-container">
      <div className="header-content">
        <Link to="/" className="header-logo">
          Planta<span>Gamer</span>
        </Link>
        
        <nav className="header-nav">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Início</Link>
          <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>Perfil</Link>
        </nav>

        <div className="header-actions">
          <button className="icon-button">
            <Bell size={20} />
          </button>
          <Link to="/profile">
            <div className={`profile-avatar-container ${isProfile ? 'active' : ''}`}>
              <img 
                alt="User Profile Avatar" 
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop" 
                className="avatar-img"
              />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
