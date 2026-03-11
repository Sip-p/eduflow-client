import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore'; // ✅ adjust path if needed

const StuCourses = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { token } = useAuthStore(); // ✅ use the store directly, no localStorage parsing
  const navigate = useNavigate();

  const [mycourses, setMycourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getMyCourses = async () => {
    if (!token) {
      setError("No token found, please login");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${backendUrl}/api/course/mycourses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMycourses(response.data.mycourses || []);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseStatus = async (courseId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'in-progress' : 'completed';
      const response = await axios.put(
        `${backendUrl}/api/course/stsupdate`,
        { courseId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setMycourses((prev) =>
          prev.map((course) =>
            course._id === courseId
              ? { ...course, progressStatus: newStatus }
              : course
          )
        );
      }
    } catch (err) {
      console.error('Error updating course status:', err);
      alert('Failed to update course status');
    }
  };

  useEffect(() => {
    getMyCourses();
  }, []);

  if (loading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "'Outfit', sans-serif", color: "#666" }}>Loading your courses…</p>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#e07070", fontFamily: "'Outfit', sans-serif" }}>{error}</p>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
        :root {
          --bg:       #0c0c10;
          --surface:  #111116;
          --surface2: #18181f;
          --border:   #25252f;
          --border2:  #2e2e3a;
          --text:     #e4e0d8;
          --text2:    #9490a0;
          --muted:    #4a4858;
          --amber:    #e8a87c;
          --amber2:   #d4845a;
          --green:    #6db88a;
          --serif:    'Lora', Georgia, serif;
          --sans:     'Outfit', sans-serif;
        }
        .sc-root { min-height: 100vh; background: var(--bg); color: var(--text); font-family: var(--sans); padding: 40px 32px; }
        .sc-header { margin-bottom: 32px; }
        .sc-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
        .sc-title { font-family: var(--serif); font-size: 30px; font-weight: 600; font-style: italic; color: var(--text); }
        .sc-subtitle { font-size: 13px; color: var(--muted); margin-top: 4px; }
        .sc-empty { text-align: center; padding: 80px 20px; font-family: var(--serif); font-style: italic; color: var(--muted); font-size: 16px; }
        .sc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .sc-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: border-color 0.2s, transform 0.2s;
          cursor: pointer;
        }
        .sc-card:hover { border-color: var(--amber); transform: translateY(-3px); }
        .sc-card-thumb { width: 100%; height: 160px; object-fit: cover; background: var(--surface2); display: block; }
        .sc-card-thumb-placeholder { width: 100%; height: 160px; background: var(--surface2); display: flex; align-items: center; justify-content: center; }
        .sc-card-body { padding: 16px 18px 14px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .sc-card-category {
          font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--amber); 
        }
        .sc-card-title { font-family: var(--serif); font-size: 17px; font-weight: 600; color: var(--text); line-height: 1.3; }
        .sc-card-desc { font-size: 12.5px; color: var(--text2); line-height: 1.6; flex: 1; }
        .sc-progress-row { display: flex; align-items: center; gap: 10px; margin-top: 4px; }
        .sc-progress-track { flex: 1; height: 3px; background: var(--border2); border-radius: 99px; overflow: hidden; }
        .sc-progress-fill { height: 100%; background: var(--amber); border-radius: 99px; transition: width 0.4s; }
        .sc-progress-pct { font-size: 10px; font-weight: 700; color: var(--amber); min-width: 28px; text-align: right; }
        .sc-badge {
          display: inline-block; padding: 3px 9px; border-radius: 3px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase;
        }
        .sc-badge-done    { background: rgba(109,184,138,0.12); color: var(--green);  border: 1px solid rgba(109,184,138,0.2); }
        .sc-badge-prog    { background: rgba(232,168,124,0.10); color: var(--amber);  border: 1px solid rgba(232,168,124,0.2); }
        .sc-badge-none    { background: var(--surface2); color: var(--muted); border: 1px solid var(--border); }
        .sc-card-footer { padding: 0 18px 14px; }
        .sc-status-btn {
          width: 100%; padding: 8px; border-radius: 6px;
          font-family: var(--sans); font-size: 12px; font-weight: 600; letter-spacing: 0.04em;
          cursor: pointer; transition: all 0.15s; border: 1px solid transparent;
        }
        .sc-status-btn-done    { background: rgba(109,184,138,0.12); color: var(--green); border-color: rgba(109,184,138,0.25); }
        .sc-status-btn-done:hover { background: rgba(109,184,138,0.2); }
        .sc-status-btn-mark    { background: none; color: var(--muted); border-color: var(--border2); }
        .sc-status-btn-mark:hover { border-color: var(--amber); color: var(--amber); }
      `}</style>

      <div className="sc-root">
        <div className="sc-header">
          <div className="sc-eyebrow">Student Portal</div>
          <div className="sc-title">My Courses</div>
          <div className="sc-subtitle">{mycourses.length} enrolled course{mycourses.length !== 1 ? "s" : ""}</div>
        </div>

        {mycourses.length === 0 ? (
          <div className="sc-empty">You haven't enrolled in any courses yet.</div>
        ) : (
          <div className="sc-grid">
            {mycourses.map((course) => {
              const isCompleted = course.progressStatus === 'completed';
              const isInProgress = course.progressStatus === 'in-progress';
              const pct = course.progressPercent || 0;

              return (
                <div key={course._id} className="sc-card"
                  onClick={() => navigate(`/lecture/${course._id}`)}>  {/* ✅ /lecture/ not /course/ */}

                  {course.thumbnail
                    ? <img src={course.thumbnail} alt={course.title} className="sc-card-thumb" />
                    : <div className="sc-card-thumb-placeholder">
                        <span style={{ fontSize: 28, opacity: 0.2 }}>📚</span>
                      </div>
                  }

                  <div className="sc-card-body">
                    {course.category && <div className="sc-card-category">{course.category}</div>}
                    <div className="sc-card-title">{course.title}</div>
                    <div className="sc-card-desc">
                      {course.description
                        ? course.description.replace(/<[^>]+>/g, "").slice(0, 80) + "…"
                        : "No description available"}
                    </div>

                    {/* progress bar */}
                    <div className="sc-progress-row">
                      <div className="sc-progress-track">
                        <div className="sc-progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="sc-progress-pct">{pct}%</span>
                    </div>

                    {/* status badge */}
                    <div>
                      {isCompleted && <span className="sc-badge sc-badge-done">✓ Completed</span>}
                      {isInProgress && <span className="sc-badge sc-badge-prog">In Progress</span>}
                      {!isCompleted && !isInProgress && <span className="sc-badge sc-badge-none">Not Started</span>}
                    </div>
                  </div>

                  {/* stop propagation so button click doesn't navigate */}
                  <div className="sc-card-footer" onClick={(e) => e.stopPropagation()}>
                    <button
                      className={`sc-status-btn ${isCompleted ? "sc-status-btn-done" : "sc-status-btn-mark"}`}
                      onClick={() => handleCourseStatus(course._id, course.progressStatus)}>
                      {isCompleted ? "✓ Completed" : "Mark as Completed"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default StuCourses;