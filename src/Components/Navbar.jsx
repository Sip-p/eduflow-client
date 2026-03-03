import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const role = user?.role;
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home',      path: '/',                  always: true },
    { label: 'Dashboard', path: role === 'teacher' ? '/instructor-dashboard' : '/student-dashboard', roles: ['teacher', 'student'] },
    { label: 'Courses',   path: '/courses',            roles: ['student'] },
    { label: 'Quizzes',   path: '/quiz',               roles: ['student'] },
    { label: 'About',     path: '/about',              always: true },
    { label: 'Pricing',   path: '/pricing',            always: true },
    { label: 'Reviews',   path: '/review',             always: true },
  ].filter(link => link.always || (link.roles && link.roles.includes(role)));

  const handleAuthClick = () => {
    if (user) {
      logout();
      navigate('/home');
    } else {
      navigate('/home');
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .nb-root {
          font-family: 'DM Sans', sans-serif;
          background: #080810;
          border-bottom: 1px solid #1e293b;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .nb-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 62px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        /* Brand */
        .nb-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          flex-shrink: 0;
          text-decoration: none;
        }
        .nb-brand-icon {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }
        .nb-brand-name {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem;
          font-weight: 800;
          color: #f1f5f9;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }
        .nb-brand-name span {
          background: linear-gradient(135deg, #6366f1, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Links */
        .nb-links {
          display: flex;
          align-items: center;
          gap: 2px;
          list-style: none;
          margin: 0; padding: 0;
        }
        .nb-link {
          background: none; border: none;
          color: #475569;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.01em;
          padding: 6px 12px;
          border-radius: 7px;
          cursor: pointer;
          transition: color 0.15s, background 0.15s;
          white-space: nowrap;
        }
        .nb-link:hover {
          color: #f1f5f9;
          background: rgba(255,255,255,0.05);
        }

        /* CTA */
        .nb-cta {
          padding: 7px 18px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .nb-cta:hover { opacity: 0.88; transform: translateY(-1px); }

        /* Avatar */
        .nb-avatar {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .nb-avatar-img {
          width: 32px; height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #1e293b;
        }
        .nb-avatar-name {
          font-size: 13px;
          font-weight: 500;
          color: #94a3b8;
        }
        .nb-logout {
          background: transparent;
          border: 1px solid #1e293b;
          color: #475569;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          padding: 5px 12px;
          border-radius: 7px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .nb-logout:hover { border-color: #ef4444; color: #ef4444; }

        /* Hamburger */
        .nb-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .nb-hamburger span {
          display: block;
          width: 20px; height: 2px;
          background: #475569;
          border-radius: 2px;
          transition: all 0.2s;
        }

        /* Mobile menu */
        .nb-mobile {
          display: none;
          flex-direction: column;
          background: #0d1117;
          border-top: 1px solid #1e293b;
          padding: 12px 20px 16px;
          gap: 4px;
        }
        .nb-mobile.open { display: flex; }
        .nb-mobile-link {
          background: none; border: none;
          color: #475569;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 10px 8px;
          text-align: left;
          cursor: pointer;
          border-bottom: 1px solid #1e293b;
          transition: color 0.15s;
        }
        .nb-mobile-link:hover { color: #f1f5f9; }
        .nb-mobile-cta {
          margin-top: 8px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          padding: 10px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          text-align: center;
        }

        @media (max-width: 768px) {
          .nb-links { display: none; }
          .nb-cta { display: none; }
          .nb-avatar { display: none; }
          .nb-logout { display: none; }
          .nb-hamburger { display: flex; }
        }
      `}</style>

      <nav className="nb-root">
        <div className="nb-inner">

          {/* Brand */}
          <div className="nb-brand" onClick={() => navigate('/')}>
            <div className="nb-brand-icon">🎓</div>
            <span className="nb-brand-name">Edu<span>Flow</span></span>
          </div>

          {/* Desktop links */}
          <ul className="nb-links">
            {navLinks.map(link => (
              <li key={link.label}>
                <button className="nb-link" onClick={() => navigate(link.path)}>
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Right side */}
          {user ? (
            <div className="nb-avatar">
              <img
                src={user.pic || "https://via.placeholder.com/32"}
                alt={user.name}
                className="nb-avatar-img"
              />
              <span className="nb-avatar-name">{user.name}</span>
              <button className="nb-logout" onClick={handleAuthClick}>
                Logout
              </button>
            </div>
          ) : (
            <button className="nb-cta" onClick={handleAuthClick}>
              Sign In
            </button>
          )}

          {/* Hamburger */}
          <button className="nb-hamburger" onClick={() => setMenuOpen(o => !o)}>
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`nb-mobile ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <button key={link.label} className="nb-mobile-link"
              onClick={() => { navigate(link.path); setMenuOpen(false); }}>
              {link.label}
            </button>
          ))}
          <button className="nb-mobile-cta"
            onClick={() => { handleAuthClick(); setMenuOpen(false); }}>
            {user ? 'Logout' : 'Sign In'}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;