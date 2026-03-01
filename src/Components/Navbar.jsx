import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/', always: true },
    { label: 'Dashboard', path: role === 'teacher' ? '/instructor-dashboard' : '/student-dashboard', roles: ['teacher', 'student'] },
    { label: 'Courses', path: '/courses', roles: ['student'] },
    { label: 'Quizzes', path: '/quiz', roles: ['student'] },
    { label: 'About', path: '/about', always: true },
    { label: 'Pricing', path: '/pricing', always: true },
    { label: 'Reviews', path: '/review', always: true },
  ].filter(link => link.always || (link.roles && link.roles.includes(role)));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&display=swap');

        .navbar-root {
          font-family: 'DM Mono', monospace;
          background: #0f0e0d;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
          text-decoration: none;
          flex-shrink: 0;
        }
        .brand-logo {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          object-fit: cover;
          filter: grayscale(20%);
        }
        .brand-name {
          font-family: 'DM Serif Display', serif;
          font-size: 1.15rem;
          color: #f5f0e8;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }
        .brand-name span {
          color: #e8a44a;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.1rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-link {
          background: none;
          border: none;
          color: #9e9a94;
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.35rem 0.75rem;
          border-radius: 4px;
          cursor: pointer;
          transition: color 0.15s ease, background 0.15s ease;
          white-space: nowrap;
        }
        .nav-link:hover {
          color: #f5f0e8;
          background: rgba(255,255,255,0.06);
        }
        .nav-link.active {
          color: #e8a44a;
        }
        .nav-cta {
          background: none;
          border: 1px solid rgba(232, 164, 74, 0.5);
          color: #e8a44a;
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.4rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .nav-cta:hover {
          background: #e8a44a;
          color: #0f0e0d;
          border-color: #e8a44a;
        }
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .hamburger span {
          display: block;
          width: 20px;
          height: 2px;
          background: #9e9a94;
          transition: all 0.2s;
        }
        .mobile-menu {
          display: none;
          flex-direction: column;
          background: #0f0e0d;
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 0.75rem 1.5rem 1rem;
          gap: 0.25rem;
        }
        .mobile-menu.open {
          display: flex;
        }
        .mobile-link {
          background: none;
          border: none;
          color: #9e9a94;
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0.6rem 0.5rem;
          text-align: left;
          cursor: pointer;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: color 0.15s;
        }
        .mobile-link:hover { color: #f5f0e8; }
        .mobile-cta {
          margin-top: 0.5rem;
          background: none;
          border: 1px solid rgba(232, 164, 74, 0.5);
          color: #e8a44a;
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.55rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .mobile-cta:hover { background: #e8a44a; color: #0f0e0d; }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-cta { display: none; }
          .hamburger { display: flex; }
        }
      `}</style>

      <nav className="navbar-root">
        <div className="navbar-inner">
          {/* Brand */}
          <div className="navbar-brand" onClick={() => navigate('/')}>
            <img
              src="https://img.freepik.com/free-vector/online-education-concept-illustration_114360-6261.jpg?w=740"
              alt="Logo"
              className="brand-logo"
            />
            <span className="brand-name">Edu<span>Platform</span></span>
          </div>

          {/* Desktop links */}
          <ul className="nav-links">
            {navLinks.map(link => (
              <li key={link.label}>
                <button
                  className="nav-link"
                  onClick={() => navigate(link.path)}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button className="nav-cta" onClick={() => navigate('/home')}>
            {user ? 'Logout' : 'Sign in'}
          </button>

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <button key={link.label} className="mobile-link" onClick={() => { navigate(link.path); setMenuOpen(false); }}>
              {link.label}
            </button>
          ))}
          <button className="mobile-cta" onClick={() => { navigate('/home'); setMenuOpen(false); }}>
            {user ? 'Logout' : 'Sign in'}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;