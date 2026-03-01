import { useEffect, useState } from "react";
import axios from "axios";

function StarRow({ rating }) {
  return (
    <div style={{ display: "flex", gap: "3px", marginBottom: "12px" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i <= rating ? "#da771e" : "#2a2825"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(0);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/review`);
        if (data.success) setReviews(data.reviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const filtered = filter === 0 ? reviews : reviews.filter((r) => r.rating === filter);
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length
      ? Math.round((reviews.filter((r) => r.rating === star).length / reviews.length) * 100)
      : 0,
  }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

        .rp-root {
          min-height: 100vh;
          background: #0b0a09;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.03'/%3E%3C/svg%3E");
          color: #f0ece4;
          font-family: 'DM Sans', sans-serif;
          padding: 4rem 6vw 6rem;
        }
        .rp-container { max-width: 1200px; margin: 0 auto; }

        .rp-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }
        .rp-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #da771e;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.9rem;
        }
        .rp-eyebrow::before { content: ''; display: block; width: 24px; height: 1px; background: #da771e; }
        .rp-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.02em;
        }
        .rp-title em { font-style: italic; color: #da771e; }
        .rp-count {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4a4540;
          margin-top: 0.5rem;
        }

        .rp-summary { display: flex; align-items: center; gap: 1.5rem; flex-shrink: 0; }
        .rp-avg { font-family: 'Playfair Display', serif; font-size: 3.2rem; color: #da771e; line-height: 1; }
        .rp-avg-label { font-family: 'DM Mono', monospace; font-size: 0.6rem; color: #4a4540; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px; }
        .rp-bars { display: flex; flex-direction: column; gap: 5px; min-width: 150px; }
        .rp-bar-row { display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .rp-bar-row:hover .rp-bar-label, .rp-bar-row:hover .rp-bar-cnt { color: #f0ece4; }
        .rp-bar-label { font-family: 'DM Mono', monospace; font-size: 0.6rem; color: #4a4540; width: 14px; text-align: right; }
        .rp-bar-track { flex: 1; height: 3px; background: #1c1a18; border-radius: 2px; overflow: hidden; }
        .rp-bar-fill { height: 100%; background: #da771e; border-radius: 2px; transition: width 0.6s ease; }
        .rp-bar-cnt { font-family: 'DM Mono', monospace; font-size: 0.58rem; color: #4a4540; width: 18px; }

        .rp-divider { height: 1px; background: linear-gradient(90deg, #2a2825 0%, transparent 100%); margin: 2rem 0; }

        .rp-filters { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 2rem; }
        .rp-fbtn {
          background: none;
          border: 1px solid #2a2825;
          color: #4a4540;
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.3rem 0.7rem;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .rp-fbtn:hover { border-color: #4a4540; color: #f0ece4; }
        .rp-fbtn.active { border-color: #da771e; color: #da771e; background: rgba(218,119,30,0.06); }
        .rp-fcount { font-family: 'DM Mono', monospace; font-size: 0.6rem; color: #3a3835; margin-left: auto; }

        .rp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 1px;
          background: #1c1a18;
          border: 1px solid #1c1a18;
          border-radius: 2px;
          overflow: hidden;
        }
        .rp-card {
          background: #0b0a09;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          position: relative;
          transition: background 0.2s;
        }
        .rp-card:hover { background: #111009; }
        .rp-corner {
          position: absolute; top: 0; right: 0;
          width: 0; height: 0;
          border-style: solid;
          border-width: 0 20px 20px 0;
          border-color: transparent #1c1a18 transparent transparent;
          transition: border-color 0.2s;
        }
        .rp-card:hover .rp-corner { border-color: transparent rgba(218,119,30,0.3) transparent transparent; }

        .rp-user { display: flex; align-items: center; gap: 0.75rem; }
        .rp-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1px solid #2a2825; filter: grayscale(20%); flex-shrink: 0; }
        .rp-name { font-family: 'Playfair Display', serif; font-size: 0.95rem; color: #f0ece4; line-height: 1; }
        .rp-date { font-family: 'DM Mono', monospace; font-size: 0.58rem; color: #3a3835; margin-top: 3px; letter-spacing: 0.04em; }
        .rp-comment { font-size: 0.875rem; font-weight: 300; color: #7a756d; line-height: 1.65; font-style: italic; flex: 1; }
        .rp-comment::before {
          content: '"';
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          color: #da771e;
          line-height: 0;
          vertical-align: -0.45rem;
          margin-right: 2px;
          opacity: 0.55;
        }

        .rp-empty {
          grid-column: 1 / -1;
          padding: 5rem 2rem;
          text-align: center;
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #3a3835;
        }

        .rp-loading {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          background: #0b0a09;
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #3a3835;
        }
        .rp-spinner {
          width: 22px; height: 22px;
          border: 2px solid #2a2825;
          border-top-color: #da771e;
          border-radius: 50%;
          animation: rp-spin 0.8s linear infinite;
        }
        @keyframes rp-spin { to { transform: rotate(360deg); } }
      `}</style>

      {loading ? (
        <div className="rp-loading">
          <div className="rp-spinner" />
          <span>Loading reviews</span>
        </div>
      ) : (
        <div className="rp-root">
          <div className="rp-container">
            <div className="rp-header">
              <div>
                <div className="rp-eyebrow">Student feedback</div>
                <h1 className="rp-title">What people<br />are <em>saying</em></h1>
                <p className="rp-count">{reviews.length} review{reviews.length !== 1 ? "s" : ""} · EduPlatform</p>
              </div>
              {reviews.length > 0 && (
                <div className="rp-summary">
                  <div>
                    <div className="rp-avg">{avgRating}</div>
                    <div className="rp-avg-label">avg rating</div>
                  </div>
                  <div className="rp-bars">
                    {ratingCounts.map(({ star, count, pct }) => (
                      <div key={star} className="rp-bar-row" onClick={() => setFilter((f) => (f === star ? 0 : star))}>
                        <span className="rp-bar-label">{star}</span>
                        <div className="rp-bar-track">
                          <div className="rp-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="rp-bar-cnt">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="rp-divider" />

            <div className="rp-filters">
              <button className={`rp-fbtn ${filter === 0 ? "active" : ""}`} onClick={() => setFilter(0)}>All</button>
              {[5, 4, 3, 2, 1].map((s) => (
                <button key={s} className={`rp-fbtn ${filter === s ? "active" : ""}`} onClick={() => setFilter((f) => (f === s ? 0 : s))}>
                  {s}★
                </button>
              ))}
              <span className="rp-fcount">{filter === 0 ? `${reviews.length} total` : `${filtered.length} shown`}</span>
            </div>

            <div className="rp-grid">
              {filtered.length === 0 ? (
                <div className="rp-empty">No reviews found</div>
              ) : (
                filtered.map((review) => (
                  <div key={review._id} className="rp-card">
                    <div className="rp-corner" />
                    <div className="rp-user">
                      <img
                        src={review.user?.pic || `https://api.dicebear.com/7.x/initials/svg?seed=${review.user?.name || "U"}&backgroundColor=1c1a18&textColor=da771e`}
                        alt={review.user?.name}
                        className="rp-avatar"
                      />
                      <div>
                        <div className="rp-name">{review.user?.name || "Anonymous"}</div>
                        <div className="rp-date">
                          {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </div>
                      </div>
                    </div>
                    <StarRow rating={review.rating} />
                    {review.comment && <p className="rp-comment">{review.comment}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}