import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import AllReviews from '../Components/AllReviews'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = ['Design', 'Development', 'Business', 'Data Science', 'Marketing']

const STATS = [
  { value: '40K+', label: 'Active learners' },
  { value: '1,200+', label: 'Courses offered' },
  { value: '98%', label: 'Satisfaction rate' },
  { value: '180+', label: 'Countries reached' },
]

const LandingPage = () => {
  const navigate = useNavigate()
  const user = localStorage.getItem('user')
  const [activeCat, setActiveCat] = useState(0)
  const [visible, setVisible] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  const handleBrowse = () => {
    if (user) navigate('/course')
    else navigate('/home')
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #0b0a09;
          color: #f0ece4;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        /* ── HERO ── */
        .hero {
          position: relative;
          min-height: 92vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 6rem 6vw 4rem;
          gap: 3rem;
          overflow: hidden;
        }
        @media(max-width:820px){
          .hero { grid-template-columns:1fr; padding:5rem 6vw 3rem; min-height:auto; }
          .hero-visual { display:none; }
        }

        /* bg orbs */
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 55% at 70% 40%, rgba(218,119,30,0.13) 0%, transparent 65%),
            radial-gradient(ellipse 40% 40% at 20% 80%, rgba(99,160,210,0.09) 0%, transparent 60%);
          pointer-events: none;
        }
        .hero-grain {
          position: absolute;
          inset: 0;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        /* left copy */
        .hero-copy {
          position: relative;
          z-index: 2;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .hero-copy.in { opacity: 1; transform: translateY(0); }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #da771e;
          margin-bottom: 1.4rem;
        }
        .hero-eyebrow::before {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: #da771e;
        }

        .hero-h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.6rem, 5.5vw, 4.4rem);
          font-weight: 900;
          line-height: 1.04;
          letter-spacing: -0.025em;
          color: #f0ece4;
        }
        .hero-h1 em {
          font-style: italic;
          color: #da771e;
        }

        .hero-sub {
          margin-top: 1.4rem;
          font-size: 1rem;
          font-weight: 300;
          color: #7a756d;
          max-width: 420px;
          line-height: 1.7;
        }

        .hero-actions {
          margin-top: 2.4rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .btn-primary {
          background: #da771e;
          color: #0b0a09;
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.85rem 1.8rem;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          transition: background 0.18s, transform 0.18s;
        }
        .btn-primary:hover { background: #c9690f; transform: translateY(-1px); }

        .btn-ghost {
          background: none;
          color: #7a756d;
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.85rem 1.4rem;
          border: 1px solid #2a2825;
          border-radius: 3px;
          cursor: pointer;
          transition: color 0.18s, border-color 0.18s;
        }
        .btn-ghost:hover { color: #f0ece4; border-color: #4a4540; }

        /* category pills */
        .cat-strip {
          display: flex;
          gap: 0.5rem;
          margin-top: 2.8rem;
          flex-wrap: wrap;
        }
        .cat-pill {
          background: none;
          border: 1px solid #2a2825;
          color: #4a4540;
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          padding: 0.28rem 0.7rem;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .cat-pill:hover, .cat-pill.active {
          border-color: #da771e;
          color: #da771e;
        }

        /* right visual */
        .hero-visual {
          position: relative;
          z-index: 2;
          opacity: 0;
          transform: translateX(24px);
          transition: opacity 1s ease 0.2s, transform 1s ease 0.2s;
        }
        .hero-visual.in { opacity: 1; transform: translateX(0); }

        .visual-frame {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: 4px;
          overflow: hidden;
          background: #181614;
        }
        .visual-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(25%) brightness(0.85);
          transition: filter 0.4s;
        }
        .visual-frame:hover img { filter: grayscale(0%) brightness(0.95); }

        .visual-badge {
          position: absolute;
          bottom: -1px;
          left: -1px;
          background: #da771e;
          color: #0b0a09;
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.5rem 1rem;
        }
        .visual-dot-grid {
          position: absolute;
          top: -18px;
          right: -18px;
          width: 80px;
          height: 80px;
          background-image: radial-gradient(circle, #da771e 1px, transparent 1px);
          background-size: 10px 10px;
          opacity: 0.3;
        }

        /* ── STATS BAND ── */
        .stats-band {
          border-top: 1px solid #1c1a18;
          border-bottom: 1px solid #1c1a18;
          display: grid;
          grid-template-columns: repeat(4,1fr);
          padding: 2.5rem 6vw;
        }
        @media(max-width:600px){ .stats-band { grid-template-columns:repeat(2,1fr); gap:1.5rem 0; } }

        .stat-item {
          text-align: center;
          border-right: 1px solid #1c1a18;
          padding: 0 1rem;
        }
        .stat-item:last-child { border-right: none; }
        @media(max-width:600px){
          .stat-item:nth-child(2){ border-right:none; }
          .stat-item:nth-child(3){ border-right:1px solid #1c1a18; }
        }

        .stat-value {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          color: #f0ece4;
          line-height: 1;
        }
        .stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4a4540;
          margin-top: 0.4rem;
        }

        /* ── REVIEWS SECTION ── */
        .reviews-wrapper {
          padding: 4rem 0 2rem;
        }
        .section-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0 6vw;
          margin-bottom: 2rem;
        }
        .section-label span {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #4a4540;
        }
        .section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #1c1a18;
        }
      `}</style>

      <div className="lp-root">
        <Navbar />

        {/* ── Hero ── */}
        <section className="hero" ref={heroRef}>
          <div className="hero-grain" />

          {/* Copy */}
          <div className={`hero-copy ${visible ? 'in' : ''}`}>
            <div className="hero-eyebrow">Online Learning Platform</div>

            <h1 className="hero-h1">
              Learn<br />
              without<br />
              <em>limits.</em>
            </h1>

            <p className="hero-sub">
              Join thousands of learners already building real skills — on their schedule, at their pace.
            </p>

            <div className="hero-actions">
              <button className="btn-primary" onClick={handleBrowse}>
                Browse Courses
              </button>
              <button className="btn-ghost" onClick={() => navigate('/home')}>
                {user ? 'Go to dashboard' : 'Sign up free'}
              </button>
            </div>

            <div className="cat-strip">
              {CATEGORIES.map((c, i) => (
                <button
                  key={c}
                  className={`cat-pill ${activeCat === i ? 'active' : ''}`}
                  onClick={() => setActiveCat(i)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className={`hero-visual ${visible ? 'in' : ''}`}>
            <div className="visual-dot-grid" />
            <div className="visual-frame">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80"
                alt="Students learning"
              />
              <div className="visual-badge">40,000+ learners</div>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <div className="stats-band">
          {STATS.map(s => (
            <div key={s.label} className="stat-item">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Reviews ── */}
        <div className="reviews-wrapper">
          <div className="section-label">
            <span>What our learners say</span>
          </div>
          <AllReviews />
        </div>

        <Footer />
      </div>
    </>
  )
}

export default LandingPage