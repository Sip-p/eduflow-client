import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const LINKS = {
  Learn:   ['Browse Courses', 'Quizzes', 'Pricing', 'Certificates'],
  Company: ['About', 'Careers', 'Blog', 'Press'],
  Support: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'],
}

const Footer = () => {
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .ft-root {
          background: #06080f;
          border-top: 1px solid #1e293b;
          font-family: 'DM Sans', sans-serif;
          color: #f1f5f9;
          padding: 64px 6vw 28px;
        }
        .ft-inner { max-width: 1200px; margin: 0 auto; }

        .ft-top {
          display: grid;
          grid-template-columns: 1.4fr repeat(3, 1fr);
          gap: 3rem;
          padding-bottom: 48px;
          border-bottom: 1px solid #1e293b;
        }

        /* Brand */
        .ft-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; cursor: pointer; }
        .ft-brand-icon {
          width: 30px; height: 30px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; flex-shrink: 0;
        }
        .ft-brand-name {
          font-family: 'Syne', sans-serif;
          font-size: 1.05rem;
          font-weight: 800;
          color: #f1f5f9;
        }
        .ft-brand-name span {
          background: linear-gradient(135deg, #6366f1, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .ft-tagline {
          font-size: 13px;
          font-weight: 300;
          color: #334155;
          line-height: 1.7;
          max-width: 220px;
          margin-bottom: 20px;
        }

        /* Socials */
        .ft-socials { display: flex; gap: 8px; }
        .ft-social {
          width: 32px; height: 32px;
          border: 1px solid #1e293b;
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          color: #334155;
          text-decoration: none;
          transition: all 0.18s;
          font-size: 13px;
        }
        .ft-social:hover {
          border-color: #6366f1;
          color: #818cf8;
          background: rgba(99,102,241,0.08);
        }

        /* Columns */
        .ft-col-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6366f1;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ft-col-title::before {
          content: '';
          display: block;
          width: 16px; height: 1px;
          background: #6366f1;
        }
        .ft-col-links { display: flex; flex-direction: column; gap: 10px; }
        .ft-link {
          background: none; border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 300;
          color: #334155;
          cursor: pointer;
          text-align: left;
          padding: 0;
          transition: color 0.15s;
          width: fit-content;
        }
        .ft-link:hover { color: #94a3b8; }

        /* Bottom */
        .ft-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding-top: 28px;
        }
        .ft-copy {
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.05em;
          color: #1e293b;
        }
        .ft-copy span { color: #6366f1; }
        .ft-bottom-links { display: flex; gap: 20px; }
        .ft-bottom-link {
          background: none; border: none;
          font-size: 11px;
          letter-spacing: 0.05em;
          color: #1e293b;
          cursor: pointer;
          padding: 0;
          transition: color 0.15s;
        }
        .ft-bottom-link:hover { color: #475569; }

        @media(max-width: 860px) {
          .ft-top { grid-template-columns: 1fr 1fr; }
          .ft-brand-col { grid-column: 1 / -1; }
        }
        @media(max-width: 480px) {
          .ft-top { grid-template-columns: 1fr; }
        }
      `}</style>

      <footer className="ft-root">
        <div className="ft-inner">
          <div className="ft-top">

            {/* Brand */}
            <div className="ft-brand-col">
              <div className="ft-brand" onClick={() => navigate('/')}>
                <div className="ft-brand-icon">🎓</div>
                <span className="ft-brand-name">Edu<span>Flow</span></span>
              </div>
              <p className="ft-tagline">
                Helping curious minds grow — one lesson at a time.
              </p>
              <div className="ft-socials">
                {[
                  { href: 'https://facebook.com',  icon: <FaFacebook />,  label: 'Facebook'  },
                  { href: 'https://twitter.com',   icon: <FaTwitter />,   label: 'Twitter'   },
                  { href: 'https://instagram.com', icon: <FaInstagram />, label: 'Instagram' },
                  { href: 'https://linkedin.com',  icon: <FaLinkedin />,  label: 'LinkedIn'  },
                ].map(({ href, icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    aria-label={label} className="ft-social">
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(LINKS).map(([section, links]) => (
              <div key={section}>
                <div className="ft-col-title">{section}</div>
                <div className="ft-col-links">
                  {links.map(link => (
                    <button key={link} className="ft-link">{link}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="ft-bottom">
            <p className="ft-copy">
              © {new Date().getFullYear()} <span>EduFlow</span>. All rights reserved.
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