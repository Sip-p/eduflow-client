import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
 const stats = [
  { value: "12K+", label: "Students Enrolled" },
  { value: "340+", label: "Courses Published" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "60+", label: "Expert Instructors" },
]

const team = [
  { name: "Aryan Mehta", role: "Founder & CEO", emoji: "🧠", color: "#6366f1" },
  { name: "Priya Sharma", role: "Head of Curriculum", emoji: "📚", color: "#8b5cf6" },
  { name: "Rohan Das", role: "Lead Engineer", emoji: "⚙️", color: "#06b6d4" },
  { name: "Neha Kapoor", role: "Student Success", emoji: "🎯", color: "#f59e0b" },
]

const values = [
  { icon: "🔬", title: "Deep Learning", desc: "We believe real mastery comes from understanding concepts, not memorising syntax. Every course is built around first principles." },
  { icon: "🌍", title: "Accessible Education", desc: "Quality education shouldn't cost a fortune. We offer free previews, flexible pricing, and scholarships for deserving students." },
  { icon: "⚡", title: "Practical First", desc: "Every lesson connects to something you can build. Theory without practice is just trivia. We make sure you ship real projects." },
  { icon: "🤝", title: "Community Driven", desc: "Learning alone is hard. Our live chat, group discussions, and peer reviews make sure no student gets left behind." },
]

const timeline = [
  { year: "2021", event: "EduFlow founded in a small apartment with 3 courses and 50 students." },
  { year: "2022", event: "Reached 1,000 students. Launched our live chat and assignment system." },
  { year: "2023", event: "500+ courses. Partnered with 20 industry instructors. Quiz engine launched." },
  { year: "2024", event: "12,000+ students across 40 countries. Mobile app in development." },
]

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

const FadeIn = ({ children, delay = 0, direction = "up" }) => {
  const [ref, inView] = useInView()
  const transforms = { up: "translateY(32px)", left: "translateX(-32px)", right: "translateX(32px)", none: "none" }
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "none" : transforms[direction],
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`
    }}>
      {children}
    </div>
  )
}

const About = () => {
  const [count, setCount] = useState({ s: 0, c: 0, r: 0, i: 0 })
  const [statsRef, statsInView] = useInView(0.3)
const navigate=useNavigate()
const user = localStorage.getItem("user")
  useEffect(() => {
    if (!statsInView) return
    const targets = { s: 12000, c: 340, r: 98, i: 60 }
    const duration = 1800
    const steps = 60
    const interval = duration / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      const p = step / steps
      const ease = 1 - Math.pow(1 - p, 3)
      setCount({
        s: Math.floor(ease * targets.s),
        c: Math.floor(ease * targets.c),
        r: Math.floor(ease * targets.r),
        i: Math.floor(ease * targets.i),
      })
      if (step >= steps) clearInterval(timer)
    }, interval)
    return () => clearInterval(timer)
  }, [statsInView])

  const displayStats = [
    { value: count.s >= 12000 ? "12K+" : count.s.toLocaleString(), label: "Students Enrolled" },
    { value: count.c >= 340 ? "340+" : count.c + "+", label: "Courses Published" },
    { value: count.r >= 98 ? "98%" : count.r + "%", label: "Satisfaction Rate" },
    { value: count.i >= 60 ? "60+" : count.i + "+", label: "Expert Instructors" },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Mulish:wght@300;400;500;600&display=swap');

        :root {
          --bg: #06080f;
          --surface: #0c0f1a;
          --border: #151c2e;
          --accent: #6366f1;
          --accent2: #f59e0b;
          --text: #e8eaf0;
          --muted: #4a5568;
          --subtle: #1a2035;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .ab-root {
          background: var(--bg);
          color: var(--text);
          font-family: 'Mulish', sans-serif;
          overflow-x: hidden;
        }

        /* ── HERO ── */
        .ab-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 80px 24px;
          overflow: hidden;
        }

        .ab-hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent);
        }

        .ab-hero-glow {
          position: absolute;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .ab-hero-glow2 {
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%);
          bottom: 10%; right: 10%;
          pointer-events: none;
        }

        .ab-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 99px;
          padding: 6px 16px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #818cf8;
          margin-bottom: 28px;
          animation: fadeDown 0.8s ease both;
        }

        .ab-hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(48px, 8vw, 96px);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -0.02em;
          color: #f0f2f8;
          max-width: 900px;
          margin-bottom: 24px;
          animation: fadeDown 0.8s ease 0.1s both;
        }

        .ab-hero h1 em {
          font-style: italic;
          color: var(--accent);
          background: linear-gradient(135deg, #6366f1, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .ab-hero-sub {
          font-size: 18px;
          font-weight: 300;
          color: var(--muted);
          max-width: 560px;
          line-height: 1.8;
          margin-bottom: 48px;
          animation: fadeDown 0.8s ease 0.2s both;
        }

        .ab-hero-cta {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
          animation: fadeDown 0.8s ease 0.3s both;
        }

        .ab-btn-primary {
          padding: 14px 32px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 10px;
          font-family: 'Mulish', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .ab-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(99,102,241,0.35); }

        .ab-btn-ghost {
          padding: 14px 32px;
          background: transparent;
          color: var(--muted);
          border: 1px solid var(--border);
          border-radius: 10px;
          font-family: 'Mulish', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .ab-btn-ghost:hover { border-color: #6366f1; color: #818cf8; }

        /* ── STATS ── */
        .ab-stats {
          padding: 80px 24px;
          background: var(--surface);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }

        .ab-stats-inner {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }

        .ab-stat {
          text-align: center;
          padding: 32px 24px;
          border-right: 1px solid var(--border);
        }
        .ab-stat:last-child { border-right: none; }

        .ab-stat-val {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 900;
          color: #f0f2f8;
          line-height: 1;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #e0e2ff, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .ab-stat-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* ── SECTION WRAPPER ── */
        .ab-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 100px 24px;
        }

        .ab-section-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--accent2);
          margin-bottom: 16px;
        }
        .ab-section-tag::before { content: ""; width: 20px; height: 2px; background: var(--accent2); display: inline-block; }

        .ab-section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 900;
          color: #f0f2f8;
          line-height: 1.1;
          margin-bottom: 16px;
        }

        .ab-section-desc {
          font-size: 16px;
          color: var(--muted);
          font-weight: 300;
          line-height: 1.8;
          max-width: 580px;
        }

        /* ── MISSION ── */
        .ab-mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
          margin-top: 64px;
        }

        .ab-mission-visual {
          position: relative;
          height: 400px;
        }

        .ab-mission-card {
          position: absolute;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px;
        }

        .ab-mission-card-main {
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 72px;
          background: linear-gradient(135deg, #0c0f1a, #12163a);
          border-color: rgba(99,102,241,0.3);
        }

        .ab-mission-card-float1 {
          top: -20px; right: -20px;
          width: 160px;
          background: rgba(99,102,241,0.1);
          border-color: rgba(99,102,241,0.2);
          text-align: center;
        }

        .ab-mission-card-float2 {
          bottom: -20px; left: -20px;
          width: 180px;
          background: rgba(245,158,11,0.08);
          border-color: rgba(245,158,11,0.2);
        }

        .ab-fc-val { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 900; color: #818cf8; }
        .ab-fc-label { font-size: 11px; color: var(--muted); margin-top: 4px; }
        .ab-fc-val2 { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 900; color: var(--accent2); }

        .ab-mission-text p {
          font-size: 16px;
          color: #94a3b8;
          line-height: 1.9;
          font-weight: 300;
          margin-bottom: 20px;
        }

        /* ── VALUES ── */
        .ab-values-bg {
          background: var(--surface);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }

        .ab-values-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2px;
          margin-top: 64px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
        }

        .ab-value-card {
          background: var(--surface);
          padding: 40px;
          transition: background 0.2s;
        }
        .ab-value-card:hover { background: #0f1424; }

        .ab-value-icon {
          font-size: 36px;
          margin-bottom: 20px;
          display: block;
        }

        .ab-value-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: #f0f2f8;
          margin-bottom: 12px;
        }

        .ab-value-desc {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.8;
          font-weight: 300;
        }

        /* ── TIMELINE ── */
        .ab-timeline {
          position: relative;
          margin-top: 64px;
          padding-left: 40px;
        }

        .ab-timeline::before {
          content: "";
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 1px;
          background: linear-gradient(to bottom, transparent, var(--accent), var(--accent), transparent);
        }

        .ab-tl-item {
          position: relative;
          padding-bottom: 48px;
        }
        .ab-tl-item:last-child { padding-bottom: 0; }

        .ab-tl-dot {
          position: absolute;
          left: -48px;
          top: 4px;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: var(--bg);
          border: 2px solid var(--accent);
          box-shadow: 0 0 12px rgba(99,102,241,0.5);
        }

        .ab-tl-year {
          font-family: 'Playfair Display', serif;
          font-size: 13px;
          font-weight: 700;
          color: var(--accent);
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }

        .ab-tl-event {
          font-size: 15px;
          color: #94a3b8;
          font-weight: 300;
          line-height: 1.7;
        }

        /* ── TEAM ── */
        .ab-team-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-top: 64px;
        }

        .ab-team-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 32px 24px;
          text-align: center;
          transition: all 0.25s;
          cursor: default;
        }
        .ab-team-card:hover {
          transform: translateY(-6px);
          border-color: rgba(99,102,241,0.3);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .ab-team-avatar {
          width: 72px; height: 72px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 32px;
          margin: 0 auto 18px;
          border: 2px solid var(--border);
        }

        .ab-team-name {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 700;
          color: #f0f2f8;
          margin-bottom: 6px;
        }

        .ab-team-role {
          font-size: 12px;
          color: var(--muted);
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* ── CTA BANNER ── */
        .ab-cta {
          margin: 0 24px 100px;
          background: linear-gradient(135deg, #12163a 0%, #1a0d2e 100%);
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 24px;
          padding: 80px 48px;
          text-align: center;
          position: relative;
          overflow: hidden;
          max-width: 1052px;
          margin-left: auto;
          margin-right: auto;
        }

        .ab-cta-glow {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .ab-cta h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 900;
          color: #f0f2f8;
          margin-bottom: 16px;
          position: relative;
        }

        .ab-cta p {
          font-size: 16px;
          color: var(--muted);
          font-weight: 300;
          margin-bottom: 40px;
          position: relative;
        }

        /* ── ANIMATIONS ── */
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .ab-stats-inner { grid-template-columns: repeat(2, 1fr); }
          .ab-stat { border-right: none; border-bottom: 1px solid var(--border); }
          .ab-mission-grid { grid-template-columns: 1fr; }
          .ab-mission-visual { display: none; }
          .ab-values-grid { grid-template-columns: 1fr; }
          .ab-team-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="ab-root">

        {/* ── HERO ── */}
        <section className="ab-hero">
          <div className="ab-hero-grid" />
          <div className="ab-hero-glow" />
          <div className="ab-hero-glow2" />

          <div className="ab-eyebrow">✦ Our Story</div>

          <h1>
            We teach the world<br />
            to <em>build things</em>
          </h1>

          <p className="ab-hero-sub">
            EduFlow is an online learning platform built by engineers and educators
            who believe great education changes lives — not just careers.
          </p>

          <div className="ab-hero-cta">
            <button className="ab-btn-primary" onClick={() => navigate(user?"/courses":"/home")}>Browse Courses</button>
            <a href="/signup" className="ab-btn-ghost">Join for Free</a>
          </div>
        </section>

        {/* ── STATS ── */}s
        <section className="ab-stats">
          <div className="ab-stats-inner" ref={statsRef}>
            {displayStats.map((s, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="ab-stat">
                  <div className="ab-stat-val">{s.value}</div>
                  <div className="ab-stat-label">{s.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ── MISSION ── */}
        <section className="ab-section">
          <FadeIn>
            <div className="ab-section-tag">Our Mission</div>
            <h2 className="ab-section-title">Education that<br />respects your intelligence</h2>
          </FadeIn>

          <div className="ab-mission-grid">
            <FadeIn direction="left" delay={0.1}>
              <div className="ab-mission-visual">
                <div className="ab-mission-card ab-mission-card-main">🎓</div>
                <div className="ab-mission-card ab-mission-card-float1">
                  <div className="ab-fc-val">98%</div>
                  <div className="ab-fc-label">Complete their first course</div>
                </div>
                <div className="ab-mission-card ab-mission-card-float2">
                  <div className="ab-fc-val2">4.9★</div>
                  <div className="ab-fc-label">Average instructor rating</div>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.2}>
              <div className="ab-mission-text">
                <p>
                  EduFlow was born from frustration. We were tired of courses that pad 2 hours of content
                  into 20, instructors who read from slides, and platforms that care more about subscription
                  revenue than student outcomes.
                </p>
                <p>
                  So we built something different. Every course on EduFlow is reviewed for depth,
                  accuracy, and practical value. Every instructor is vetted. Every lesson has a purpose.
                </p>
                <p>
                  We're not the biggest platform. We're working on being the best one.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── VALUES ── */}
        <div className="ab-values-bg">
          <section className="ab-section">
            <FadeIn>
              <div className="ab-section-tag">What We Stand For</div>
              <h2 className="ab-section-title">Built on four<br />non-negotiables</h2>
            </FadeIn>

            <div className="ab-values-grid">
              {values.map((v, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="ab-value-card">
                    <span className="ab-value-icon">{v.icon}</span>
                    <div className="ab-value-title">{v.title}</div>
                    <div className="ab-value-desc">{v.desc}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>
        </div>

        {/* ── TIMELINE ── */}
        <section className="ab-section">
          <FadeIn>
            <div className="ab-section-tag">Our Journey</div>
            <h2 className="ab-section-title">From idea to<br />12,000 students</h2>
          </FadeIn>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", marginTop: "64px", alignItems: "start" }}>
            <FadeIn direction="left" delay={0.1}>
              <div className="ab-timeline">
                {timeline.map((t, i) => (
                  <div className="ab-tl-item" key={i}>
                    <div className="ab-tl-dot" />
                    <div className="ab-tl-year">{t.year}</div>
                    <div className="ab-tl-event">{t.event}</div>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.2}>
              <div style={{ paddingTop: 8 }}>
                <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.9, fontWeight: 300, marginBottom: 24 }}>
                  Three years ago, EduFlow was a weekend project. Today it's a platform used by
                  students in 40 countries — from first-year engineering students to senior developers
                  looking to switch domains.
                </p>
                <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.9, fontWeight: 300, marginBottom: 24 }}>
                  We're still small enough to care about every student. We read every review,
                  respond to every complaint, and ship improvements every week.
                </p>
                <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.9, fontWeight: 300 }}>
                  The roadmap ahead: mobile apps, AI-powered learning paths, and mentorship
                  programmes. We're just getting started.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── TEAM ── */}
        <div className="ab-values-bg">
          <section className="ab-section">
            <FadeIn>
              <div className="ab-section-tag">The Team</div>
              <h2 className="ab-section-title">People behind<br />the platform</h2>
              <p className="ab-section-desc" style={{ marginTop: 12 }}>
                A small, focused team of engineers, educators, and designers who care deeply
                about how people learn.
              </p>
            </FadeIn>

            <div className="ab-team-grid">
              {team.map((member, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="ab-team-card">
                    <div className="ab-team-avatar" style={{ background: member.color + "18", borderColor: member.color + "40" }}>
                      {member.emoji}
                    </div>
                    <div className="ab-team-name">{member.name}</div>
                    <div className="ab-team-role">{member.role}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>
        </div>

        {/* ── CTA ── */}
        <div style={{ padding: "100px 24px 0" }}>
          <FadeIn>
            <div className="ab-cta">
              <div className="ab-cta-glow" />
              <h2>Ready to start learning?</h2>
              <p>Join 12,000+ students already building skills that matter.</p>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
                <a href="/courses" className="ab-btn-primary">Explore Courses</a>
                <a href="/signup" className="ab-btn-ghost">Create Free Account</a>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Footer spacer */}
        <div style={{ height: 80 }} />

      </div>
    </>
  )
}

export default About