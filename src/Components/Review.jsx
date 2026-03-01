import { useEffect, useState } from 'react';
import axios from 'axios';

const STAR = '★';
const EMPTY_STAR = '☆';

function StarRow({ rating }) {
  return (
    <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{
          fontSize: '0.9rem',
          color: i <= rating ? '#e8a44a' : '#2e2c29',
          transition: 'color 0.1s'
        }}>{STAR}</span>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(0); // 0 = all
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/review`);
        if (data.success) setReviews(data.reviews);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const filtered = filter === 0 ? reviews : reviews.filter(r => r.rating === filter);
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: reviews.length ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100) : 0
  }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');

        .reviews-page {
          min-height: 100vh;
          background: #0f0e0d;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
          padding: 3rem 1.5rem 5rem;
          color: #f5f0e8;
          font-family: 'Lora', serif;
        }
        .reviews-container {
          max-width: 1160px;
          margin: 0 auto;
        }

        /* Header */
        .reviews-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        .reviews-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2rem, 5vw, 3.2rem);
          color: #f5f0e8;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .reviews-title em {
          color: #e8a44a;
          font-style: italic;
        }
        .reviews-subtitle {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          color: #6b6760;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 0.5rem;
        }

        /* Summary */
        .reviews-summary {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-shrink: 0;
        }
        .avg-score {
          font-family: 'DM Serif Display', serif;
          font-size: 3.5rem;
          color: #e8a44a;
          line-height: 1;
        }
        .avg-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          color: #6b6760;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 4px;
        }
        .rating-bars {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 140px;
        }
        .bar-row {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .bar-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          color: #6b6760;
          width: 16px;
          text-align: right;
        }
        .bar-track {
          flex: 1;
          height: 4px;
          background: #1f1e1c;
          border-radius: 2px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          background: #e8a44a;
          border-radius: 2px;
          transition: width 0.6s ease;
        }
        .bar-count {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          color: #4a4845;
          width: 20px;
        }
        .bar-row:hover .bar-label,
        .bar-row:hover .bar-count { color: #f5f0e8; }

        /* Filter strip */
        .filter-strip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .filter-btn {
          background: none;
          border: 1px solid #2a2926;
          color: #6b6760;
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.3rem 0.75rem;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .filter-btn:hover {
          border-color: #4a4845;
          color: #f5f0e8;
        }
        .filter-btn.active {
          border-color: #e8a44a;
          color: #e8a44a;
          background: rgba(232, 164, 74, 0.06);
        }
        .filter-count {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          color: #4a4845;
          margin-left: auto;
        }

        /* Divider */
        .divider {
          height: 1px;
          background: linear-gradient(90deg, #2a2926 0%, transparent 100%);
          margin-bottom: 2rem;
        }

        /* Grid */
        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1px;
          background: #1a1917;
          border: 1px solid #1a1917;
          border-radius: 2px;
          overflow: hidden;
        }
        .review-card {
          background: #0f0e0d;
          padding: 1.5rem;
          transition: background 0.2s;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .review-card:hover {
          background: #131211;
        }
        .card-corner {
          position: absolute;
          top: 0;
          right: 0;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 24px 24px 0;
          border-color: transparent #1a1917 transparent transparent;
          transition: border-color 0.2s;
        }
        .review-card:hover .card-corner {
          border-color: transparent #e8a44a22 transparent transparent;
        }

        /* Card parts */
        .card-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .user-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid #2a2926;
          filter: grayscale(20%);
          flex-shrink: 0;
        }
        .user-name {
          font-family: 'DM Serif Display', serif;
          font-size: 1rem;
          color: #f5f0e8;
          line-height: 1;
        }
        .user-date {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          color: #4a4845;
          margin-top: 3px;
          letter-spacing: 0.04em;
        }
        .card-comment {
          font-size: 0.88rem;
          color: #9e9a94;
          line-height: 1.6;
          font-style: italic;
          flex: 1;
        }
        .card-comment::before {
          content: '"';
          color: #e8a44a;
          font-family: 'DM Serif Display', serif;
          font-size: 1.8rem;
          line-height: 0;
          vertical-align: -0.5rem;
          margin-right: 2px;
          opacity: 0.6;
        }

        /* Empty state */
        .empty-state {
          grid-column: 1 / -1;
          padding: 4rem 2rem;
          text-align: center;
          color: #4a4845;
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* Loading */
        .loading-screen {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          background: #0f0e0d;
          color: #4a4845;
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .loading-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #e8a44a;
          animation: pulse 1.2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {loading ? (
        <div className="loading-screen">
          <div className="loading-dot" />
          <span>Loading reviews</span>
        </div>
      ) : (
        <div className="reviews-page">
          <div className="reviews-container">

            {/* Header */}
            <div className="reviews-header">
              <div>
                <h1 className="reviews-title">What people<br />are <em>saying</em></h1>
                <p className="reviews-subtitle">{reviews.length} review{reviews.length !== 1 ? 's' : ''} · EduPlatform</p>
              </div>
              {reviews.length > 0 && (
                <div className="reviews-summary">
                  <div>
                    <div className="avg-score">{avgRating}</div>
                    <div className="avg-label">avg rating</div>
                  </div>
                  <div className="rating-bars">
                    {ratingCounts.map(({ star, count, pct }) => (
                      <div
                        key={star}
                        className="bar-row"
                        onClick={() => setFilter(f => f === star ? 0 : star)}
                      >
                        <span className="bar-label">{star}</span>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="bar-count">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="divider" />

            {/* Filter strip */}
            <div className="filter-strip">
              <button className={`filter-btn ${filter === 0 ? 'active' : ''}`} onClick={() => setFilter(0)}>All</button>
              {[5, 4, 3, 2, 1].map(s => (
                <button
                  key={s}
                  className={`filter-btn ${filter === s ? 'active' : ''}`}
                  onClick={() => setFilter(f => f === s ? 0 : s)}
                >
                  {s}★
                </button>
              ))}
              <span className="filter-count">
                {filter === 0 ? `${reviews.length} total` : `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`}
              </span>
            </div>

            {/* Grid */}
            <div className="reviews-grid">
              {filtered.length === 0 ? (
                <div className="empty-state">No reviews found</div>
              ) : filtered.map((review, i) => (
                <div key={review._id} className="review-card">
                  <div className="card-corner" />
                  <div className="card-user">
                    <img
                      src={review.user?.pic || `https://api.dicebear.com/7.x/initials/svg?seed=${review.user?.name || 'U'}`}
                      alt={review.user?.name}
                      className="user-avatar"
                    />
                    <div>
                      <div className="user-name">{review.user?.name || 'Anonymous'}</div>
                      <div className="user-date">
                        {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <StarRow rating={review.rating} />
                  {review.comment && (
                    <p className="card-comment">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      )}
    </>
  );
}