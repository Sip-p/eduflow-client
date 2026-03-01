import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const LINKS = {
  Learn: ['Browse Courses', 'Quizzes', 'Pricing', 'Certificates'],
  Company: ['About', 'Careers', 'Blog', 'Press'],
  Support: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'],
}

const Footer = () => {
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

        .ft-root {
          background: #080706;
          border-top: 1px solid #1c1a18;
          font-family: 'DM Sans', sans-serif;
          color: #f0ece4;
          padding: 4rem 6vw 2rem;
        }
        .ft-inner { max-width: 1200px; margin: 0 auto; }

        /* Top row */
        .ft-top {
          display: grid;
          grid-template-columns: 1.4fr repeat(3, 1fr);
          gap: 3rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #1c1a18;
        }
        @media(max-width: 860px) {
          .ft-top { grid-template-columns: 1fr 1fr; }
          .ft-brand-col { grid-column: 1 / -1; }
        }
        @media(max-width: 480px) {
          .ft-top { grid-template-columns: 1fr; }
        }

        /* Brand col */
        .ft-brand { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1rem; cursor: pointer; }
        .ft-brand-icon {
          width: 28px; height: 28px;
          background: #da771e;
          border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ft-brand-icon svg { fill: #080706; }
        .ft-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #f0ece4;
          letter-spacing: -0.01em;
        }
        .ft-brand-name span { font-style: italic; color: #da771e; }
        .ft-tagline {
          font-size: 0.82rem;
          font-weight: 300;
          color: #4a4540;
          line-height: 1.6;
          max-width: 220px;
          margin-bottom: 1.5rem;
        }

        /* Socials */
        .ft-socials { display: flex; gap: 0.6rem; }
        .ft-social {
          width: 32px; height: 32px;
          border: 1px solid #2a2825;
          border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          color: #4a4540;
          text-decoration: none;
          transition: all 0.18s;
          font-size: 0.85rem;
        }
        .ft-social:hover { border-color: #da771e; color: #da771e; background: rgba(218,119,30,0.06); }

        /* Link columns */
        .ft-col-title {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #da771e;
          margin-bottom: 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .ft-col-title::before { content: ''; display: block; width: 16px; height: 1px; background: #da771e; }
        .ft-col-links { display: flex; flex-direction: column; gap: 0.55rem; }
        .ft-link {
          background: none; border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 300;
          color: #4a4540;
          cursor: pointer;
          text-align: left;
          padding: 0;
          transition: color 0.15s;
          width: fit-content;
        }
        .ft-link:hover { color: #f0ece4; }

        /* Bottom row */
        .ft-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          padding-top: 2rem;
        }
        .ft-copy {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #3a3835;
        }
        .ft-copy span { color: #da771e; }
        .ft-bottom-links { display: flex; gap: 1.5rem; }
        .ft-bottom-link {
          background: none; border: none;
          font-family: 'DM Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #3a3835;
          cursor: pointer;
          padding: 0;
          transition: color 0.15s;
        }
        .ft-bottom-link:hover { color: #7a756d; }
      `}</style>

      <footer className="ft-root">
        <div className="ft-inner">
          <div className="ft-top">
            {/* Brand */}
            <div className="ft-brand-col">
              <div className="ft-brand" onClick={() => navigate('/')}>
                <div className="ft-brand-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24">
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9 12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                  </svg>
                </div>
                <span className="ft-brand-name">Edu<span>Platform</span></span>
              </div>
              <p className="ft-tagline">
                Helping curious minds grow — one lesson at a time.
              </p>
              <div className="ft-socials">
                {[
                  { href: 'https://facebook.com', icon: <FaFacebook />, label: 'Facebook' },
                  { href: 'https://twitter.com', icon: <FaTwitter />, label: 'Twitter' },
                  { href: 'https://instagram.com', icon: <FaInstagram />, label: 'Instagram' },
                  { href: 'https://linkedin.com', icon: <FaLinkedin />, label: 'LinkedIn' },
                ].map(({ href, icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="ft-social">
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link cols */}
            {Object.entries(LINKS).map(([section, links]) => (
              <div key={section}>
                <div className="ft-col-title">{section}</div>
                <div className="ft-col-links">
                  {links.map((link) => (
                    <button key={link} className="ft-link">{link}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div className="ft-bottom">
            <p className="ft-copy">
              © {new Date().getFullYear()} <span>EduPlatform</span>. All rights reserved.
            </p>
            <div className="ft-bottom-links">
              <button className="ft-bottom-link">Privacy</button>
              <button className="ft-bottom-link">Terms</button>
              <button className="ft-bottom-link">Cookies</button>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer