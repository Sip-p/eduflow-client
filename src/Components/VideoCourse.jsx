import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import GroupChat from "./GroupChat";
import { useAuthStore } from "../store/useAuthStore";
const VideoCourse = () => {
  // ✅ FIX: useParams instead of window.location.pathname
  const { id: courseId } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  // ✅ FIX: read token from zustand-persisted store, not bare localStorage
 const { user, token, isAuthenticated } = useAuthStore();

  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [activeTab, setActiveTab] = useState("chat");
  const [completedLessons, setCompletedLessons] = useState(new Set());

  const getCurriculum = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/course/${courseId}/curriculum`);
      if (res.data.success) {
        setCourse(res.data.course);
        setCurriculum(res.data.curriculum);
        const expanded = {};
        let firstLesson = null;
        res.data.curriculum.forEach((chapter) => {
          expanded[chapter._id] = true;
          if (!firstLesson && chapter.lessons?.length > 0) firstLesson = chapter.lessons[0];
        });
        setExpandedChapters(expanded);
        if (firstLesson) setCurrentVideo(firstLesson);
      }
    } catch (err) {
      console.error("Curriculum fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getAssignments = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/assignments/courseassignments/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) setAssignments(res.data.assignments);
    } catch (err) {
      console.log("Assignments error:", err.message);
    }
  };

  // ✅ FIX: courseId in dependency array so re-fetches if route changes
  useEffect(() => {
    getCurriculum();
    getAssignments();
  }, [courseId]);

  const toggleChapter = (id) =>
    setExpandedChapters((prev) => ({ ...prev, [id]: !prev[id] }));

  const markComplete = (lessonId) =>
    setCompletedLessons((prev) => new Set([...prev, lessonId]));

  const getNextLesson = () => {
    let found = false;
    for (const chapter of curriculum) {
      for (const lesson of chapter.lessons || []) {
        if (found) return lesson;
        if (lesson._id === currentVideo?._id) found = true;
      }
    }
    return null;
  };

  const getPrevLesson = () => {
    let prev = null;
    for (const chapter of curriculum) {
      for (const lesson of chapter.lessons || []) {
        if (lesson._id === currentVideo?._id) return prev;
        prev = lesson;
      }
    }
    return null;
  };

  const getYouTubeEmbedUrl = (url) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com"))
        return `https://www.youtube.com/embed/${u.searchParams.get("v")}?autoplay=1&rel=0`;
      if (u.hostname.includes("youtu.be"))
        return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1&rel=0`;
      return null;
    } catch { return null; }
  };

  const totalLessons = curriculum.reduce((s, c) => s + (c.lessons?.length || 0), 0);

  const currentLessonIndex = (() => {
    let idx = 0;
    for (const ch of curriculum) {
      for (const l of ch.lessons || []) {
        idx++;
        if (l._id === currentVideo?._id) return idx;
      }
    }
    return 0;
  })();

  const progressPct = totalLessons > 0
    ? Math.round((completedLessons.size / totalLessons) * 100)
    : 0;

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0c0c10", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 40, height: 40, border: "2px solid #222",
          borderTop: "2px solid #e8a87c", borderRadius: "50%",
          margin: "0 auto 14px", animation: "spin 0.7s linear infinite"
        }} />
        <p style={{ fontFamily: "'Lora', serif", color: "#555", fontSize: 15, letterSpacing: "0.04em" }}>
          Loading course…
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  const ytUrl = currentVideo ? getYouTubeEmbedUrl(currentVideo.videoUrl) : null;
  const isDirectVideo = currentVideo && !ytUrl;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:        #0c0c10;
          --surface:   #111116;
          --surface2:  #18181f;
          --border:    #25252f;
          --border2:   #2e2e3a;
          --text:      #e4e0d8;
          --text2:     #9490a0;
          --muted:     #4a4858;
          --amber:     #e8a87c;
          --amber2:    #d4845a;
          --green:     #6db88a;
          --serif:     'Lora', Georgia, serif;
          --sans:      'Outfit', sans-serif;
        }

        .vc-root {
          height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: var(--sans);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* ── TOPBAR ── */
        .vc-topbar {
          height: 52px;
          min-height: 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 100;
          gap: 16px;
        }

        .vc-back {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: 1px solid var(--border2);
          color: var(--text2);
          padding: 6px 14px;
          border-radius: 6px;
          font-family: var(--sans);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .vc-back:hover { border-color: var(--amber); color: var(--amber); }

        .vc-course-name {
          font-family: var(--serif);
          font-style: italic;
          font-size: 15px;
          color: var(--text);
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          opacity: 0.8;
          text-align: center;
        }

        .vc-progress-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .vc-progress-count {
          font-family: var(--sans);
          font-size: 11px;
          color: var(--muted);
          font-weight: 500;
        }
        .vc-progress-track {
          width: 88px;
          height: 3px;
          background: var(--border2);
          border-radius: 99px;
          overflow: hidden;
        }
        .vc-progress-fill {
          height: 100%;
          background: var(--amber);
          border-radius: 99px;
          transition: width 0.5s ease;
        }
        .vc-progress-pct {
          font-family: var(--sans);
          font-size: 11px;
          font-weight: 700;
          color: var(--amber);
          min-width: 30px;
          text-align: right;
        }

        /* ── BODY ── */
        .vc-body {
          display: flex;
          flex: 1;
          overflow: hidden;
          height: calc(100vh - 52px);
        }

        /* ── MAIN ── */
        .vc-main {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        .vc-main::-webkit-scrollbar { width: 4px; }
        .vc-main::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 99px; }

        /* VIDEO */
        .vc-video-wrap {
          background: #000;
          width: 100%;
          flex-shrink: 0;
        }
        .vc-video-placeholder {
          width: 100%;
          height: 440px;
          background: #080810;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* LESSON META */
        .vc-meta {
          padding: 18px 24px;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          flex-shrink: 0;
        }
        .vc-meta-left { flex: 1; min-width: 0; }
        .vc-lesson-eyebrow {
          font-family: var(--sans);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 5px;
        }
        .vc-lesson-title {
          font-family: var(--serif);
          font-size: 22px;
          font-weight: 600;
          color: var(--text);
          line-height: 1.25;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .vc-tags { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
        .vc-tag {
          font-family: var(--sans);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 9px;
          border-radius: 3px;
        }
        .vc-tag-free    { background: rgba(109,184,138,0.12); color: var(--green);  border: 1px solid rgba(109,184,138,0.2); }
        .vc-tag-enrolled { background: rgba(232,168,124,0.10); color: var(--amber); border: 1px solid rgba(232,168,124,0.2); }
        .vc-tag-meta    { background: var(--surface2); color: var(--muted); border: 1px solid var(--border); }

        .vc-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          flex-wrap: wrap;
        }
        .vc-btn {
          padding: 7px 16px;
          border-radius: 6px;
          font-family: var(--sans);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: all 0.15s;
          border: 1px solid transparent;
          white-space: nowrap;
        }
        .vc-btn-outline {
          background: none;
          border-color: var(--border2);
          color: var(--text2);
        }
        .vc-btn-outline:hover:not(:disabled) { border-color: var(--text2); color: var(--text); }
        .vc-btn-outline:disabled { opacity: 0.28; cursor: not-allowed; }
        .vc-btn-solid {
          background: var(--amber);
          color: #1a0e06;
          border-color: var(--amber);
        }
        .vc-btn-solid:hover:not(:disabled) { background: var(--amber2); border-color: var(--amber2); }
        .vc-btn-solid:disabled { opacity: 0.28; cursor: not-allowed; }
        .vc-btn-done {
          background: rgba(109,184,138,0.12);
          color: var(--green);
          border-color: rgba(109,184,138,0.25);
          cursor: default;
        }

        /* DESCRIPTION */
        .vc-desc {
          padding: 20px 24px 24px;
          font-family: var(--serif);
          font-size: 15px;
          line-height: 1.85;
          color: var(--text2);
          border-bottom: 1px solid var(--border);
          background: var(--bg);
          flex-shrink: 0;
        }
        .vc-desc p { margin-bottom: 0.5em; }

        /* TABS */
        .vc-tabs {
          display: flex;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 0 24px;
          flex-shrink: 0;
        }
        .vc-tab {
          padding: 13px 20px;
          font-family: var(--sans);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .vc-tab:hover { color: var(--text2); }
        .vc-tab-active { color: var(--amber); border-bottom-color: var(--amber); }
        .vc-tab-badge {
          background: var(--amber);
          color: #1a0e06;
          font-size: 9px;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: 99px;
        }

        /* TAB BODY */
        .vc-tab-body { padding: 28px 24px; background: var(--bg); }

        /* ASSIGNMENTS */
        .vc-assign-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 14px;
        }
        .vc-assign-card {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 20px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .vc-assign-card:hover { border-color: var(--amber); transform: translateX(4px); }
        .vc-assign-label {
          font-family: var(--sans);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--amber);
          margin-bottom: 4px;
        }
        .vc-assign-title {
          font-family: var(--serif);
          font-size: 17px;
          color: var(--text);
          line-height: 1.3;
        }
        .vc-assign-meta { display: flex; gap: 16px; margin-top: 8px; flex-wrap: wrap; }
        .vc-assign-meta span { font-size: 12px; color: var(--muted); }
        .vc-assign-arrow { font-size: 16px; color: var(--border2); align-self: center; flex-shrink: 0; }

        /* CHAT */
        .vc-chat-wrap {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          min-height: 400px;
        }

        /* ── SIDEBAR ── */
        .vc-sidebar {
          width: 320px;
          min-width: 320px;
          background: var(--surface);
          border-left: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .vc-sidebar-hdr {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
          background: var(--surface2);
          flex-shrink: 0;
        }
        .vc-sidebar-eyebrow {
          font-family: var(--sans);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 3px;
        }
        .vc-sidebar-course {
          font-family: var(--serif);
          font-size: 14px;
          font-style: italic;
          color: var(--text);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .vc-sidebar-stats {
          font-family: var(--sans);
          font-size: 11px;
          color: var(--muted);
          margin-top: 4px;
        }

        .vc-sidebar-scroll { flex: 1; overflow-y: auto; }
        .vc-sidebar-scroll::-webkit-scrollbar { width: 3px; }
        .vc-sidebar-scroll::-webkit-scrollbar-thumb { background: var(--border); }

        /* CHAPTER */
        .vc-chapter { border-bottom: 1px solid var(--border); }
        .vc-chapter-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background 0.12s;
        }
        .vc-chapter-btn:hover { background: rgba(255,255,255,0.025); }
        .vc-chapter-num {
          font-family: var(--serif);
          font-size: 20px;
          font-weight: 400;
          color: var(--border2);
          line-height: 1;
          min-width: 28px;
        }
        .vc-chapter-info { flex: 1; min-width: 0; }
        .vc-chapter-name {
          font-family: var(--sans);
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .vc-chapter-sub { font-size: 11px; color: var(--muted); margin-top: 1px; }
        .vc-chevron {
          font-size: 9px;
          color: var(--muted);
          transition: transform 0.2s;
          flex-shrink: 0;
        }
        .vc-chevron-open { transform: rotate(180deg); }

        /* LESSON ROW */
        .vc-lesson {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 9px 20px 9px 24px;
          cursor: pointer;
          border-left: 3px solid transparent;
          transition: all 0.12s;
          background: var(--bg);
          border-bottom: 1px solid rgba(255,255,255,0.025);
        }
        .vc-lesson:hover { background: rgba(255,255,255,0.025); }
        .vc-lesson-active {
          background: rgba(232,168,124,0.07) !important;
          border-left-color: var(--amber);
        }
        .vc-lesson-icon {
          width: 24px; height: 24px; min-width: 24px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px;
          font-weight: 700;
          transition: all 0.15s;
        }
        .vc-icon-active  { background: var(--amber); color: #1a0e06; }
        .vc-icon-done    { background: rgba(109,184,138,0.15); color: var(--green); }
        .vc-icon-default { background: var(--surface2); color: var(--muted); font-size: 10px; }
        .vc-lesson-info { flex: 1; min-width: 0; }
        .vc-lesson-name {
          font-family: var(--sans);
          font-size: 12.5px;
          color: var(--text2);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 1.3;
          font-weight: 400;
        }
        .vc-lesson-name-active { color: var(--text); font-weight: 600; }
        .vc-lesson-dur { font-size: 10px; color: var(--muted); margin-top: 2px; }
        .vc-free-pill {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: rgba(109,184,138,0.12);
          color: var(--green);
          padding: 2px 6px;
          border-radius: 3px;
          flex-shrink: 0;
        }

        @media (max-width: 1024px) {
          .vc-root { height: auto; overflow: visible; }
          .vc-body { flex-direction: column; height: auto; overflow: visible; }
          .vc-main { overflow: visible; }
          .vc-sidebar { width: 100%; min-width: unset; max-height: 380px; border-left: none; border-top: 1px solid var(--border); }
          .vc-course-name { display: none; }
        }
      `}</style>

      <div className="vc-root">

        {/* ── TOPBAR ── */}
        <div className="vc-topbar">
          <button className="vc-back" onClick={() => navigate(-1)}>← Back</button>

          {course && <div className="vc-course-name">{course.title}</div>}

          <div className="vc-progress-row">
            <span className="vc-progress-count">{completedLessons.size}/{totalLessons}</span>
            <div className="vc-progress-track">
              <div className="vc-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="vc-progress-pct">{progressPct}%</span>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="vc-body">

          {/* ── MAIN ── */}
          <div className="vc-main">

            {/* VIDEO */}
            <div className="vc-video-wrap">
              <AnimatePresence mode="wait">
                {currentVideo ? (
                  <motion.div key={currentVideo._id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}>
                    {ytUrl ? (
                      <iframe
                        width="100%" height="440" src={ytUrl}
                        title={currentVideo.title} frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen style={{ display: "block" }}
                      />
                    ) : isDirectVideo ? (
                      // ✅ FIX: key prop forces remount on lesson change
                      <video
                        key={currentVideo._id}
                        src={currentVideo.videoUrl}
                        controls autoPlay
                        style={{ width: "100%", height: 440, background: "#000", display: "block" }}
                      />
                    ) : (
                      <div className="vc-video-placeholder">
                        <p style={{ color: "var(--muted)", fontFamily: "var(--serif)", fontStyle: "italic" }}>
                          No video available
                        </p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="vc-video-placeholder">
                    {course?.thumbnail ? (
                      <img src={course.thumbnail} alt=""
                        style={{ maxHeight: 440, maxWidth: "100%", opacity: 0.2, objectFit: "cover" }} />
                    ) : (
                      <p style={{ color: "var(--muted)", fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 15 }}>
                        Select a lesson to begin
                      </p>
                    )}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* LESSON META */}
            {currentVideo && (
              <div className="vc-meta">
                <div className="vc-meta-left">
                  <div className="vc-lesson-eyebrow">
                    Lesson {currentLessonIndex} of {totalLessons}
                  </div>
                  <div className="vc-lesson-title">{currentVideo.title}</div>
                  <div className="vc-tags">
                    <span className={`vc-tag ${currentVideo.isFree ? "vc-tag-free" : "vc-tag-enrolled"}`}>
                      {currentVideo.isFree ? "Free" : "Enrolled"}
                    </span>
                    {currentVideo.duration > 0 && (
                      <span className="vc-tag vc-tag-meta">
                        {Math.floor(currentVideo.duration / 60)}:{String(currentVideo.duration % 60).padStart(2, "0")} min
                      </span>
                    )}
                  </div>
                </div>

                <div className="vc-controls">
                  {completedLessons.has(currentVideo._id) ? (
                    <button className="vc-btn vc-btn-done">✓ Completed</button>
                  ) : (
                    <button className="vc-btn vc-btn-outline"
                      onClick={() => markComplete(currentVideo._id)}>
                      Mark Complete
                    </button>
                  )}
                  <button className="vc-btn vc-btn-outline"
                    disabled={!getPrevLesson()}
                    onClick={() => { const p = getPrevLesson(); if (p) setCurrentVideo(p); }}>
                    ← Prev
                  </button>
                  <button className="vc-btn vc-btn-solid"
                    disabled={!getNextLesson()}
                    onClick={() => { const n = getNextLesson(); if (n) setCurrentVideo(n); }}>
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* DESCRIPTION */}
            {currentVideo?.description && (
              <div className="vc-desc"
                dangerouslySetInnerHTML={{ __html: currentVideo.description }} />
            )}

            {/* TABS */}
            <div className="vc-tabs">
              <button
                className={`vc-tab ${activeTab === "chat" ? "vc-tab-active" : ""}`}
                onClick={() => setActiveTab("chat")}>
                💬 Discussion
              </button>
              {assignments.length > 0 && (
                <button
                  className={`vc-tab ${activeTab === "assignments" ? "vc-tab-active" : ""}`}
                  onClick={() => setActiveTab("assignments")}>
                  📝 Assignments
                  <span className="vc-tab-badge">{assignments.length}</span>
                </button>
              )}
            </div>

            {/* TAB CONTENT */}
            <AnimatePresence mode="wait">
              {activeTab === "chat" && (
                <motion.div key="chat" className="vc-tab-body"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="vc-chat-wrap">
                    <GroupChat courseId={courseId} />
                  </div>
                </motion.div>
              )}

              {activeTab === "assignments" && (
                <motion.div key="assignments" className="vc-tab-body"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="vc-assign-grid">
                    {assignments.map((a, idx) => (
                      <motion.div
                        key={a._id}
                        className="vc-assign-card"
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => navigate("/assignment/byId", {
                          state: {
                            assignmentUrl: a.attachments,
                            assignmentTitle: a.assignmentNumber,
                            assignmentDescription: a.description,
                          }
                        })}>
                        <div>
                          <div className="vc-assign-label">{a.assignmentNumber}</div>
                          <div className="vc-assign-title">{a.description}</div>
                          <div className="vc-assign-meta">
                            <span>📅 Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                            <span>⭐ {a.totalPoints} pts</span>
                          </div>
                        </div>
                        <div className="vc-assign-arrow">→</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* ── SIDEBAR ── */}
          <div className="vc-sidebar">
            <div className="vc-sidebar-hdr">
              <div className="vc-sidebar-eyebrow">Course Content</div>
              <div className="vc-sidebar-course">{course?.title}</div>
              <div className="vc-sidebar-stats">
                {curriculum.length} chapters · {totalLessons} lessons ·{" "}
                <span style={{ color: "var(--amber)" }}>{completedLessons.size} done</span>
              </div>
            </div>

            <div className="vc-sidebar-scroll">
              {curriculum.length > 0 ? curriculum.map((chapter, ci) => (
                <div key={chapter._id} className="vc-chapter">
                  <button className="vc-chapter-btn" onClick={() => toggleChapter(chapter._id)}>
                    <span className="vc-chapter-num">{String(ci + 1).padStart(2, "0")}</span>
                    <div className="vc-chapter-info">
                      <div className="vc-chapter-name">{chapter.title}</div>
                      <div className="vc-chapter-sub">{chapter.lessons?.length || 0} lessons</div>
                    </div>
                    <span className={`vc-chevron ${expandedChapters[chapter._id] ? "vc-chevron-open" : ""}`}>▼</span>
                  </button>

                  <AnimatePresence>
                    {expandedChapters[chapter._id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        style={{ overflow: "hidden" }}>
                        {(chapter.lessons || []).map((lesson, li) => {
                          const isActive = currentVideo?._id === lesson._id;
                          const isDone = completedLessons.has(lesson._id);
                          return (
                            <div
                              key={lesson._id}
                              className={`vc-lesson ${isActive ? "vc-lesson-active" : ""}`}
                              onClick={() => setCurrentVideo(lesson)}>
                              <div className={`vc-lesson-icon ${isActive ? "vc-icon-active" : isDone ? "vc-icon-done" : "vc-icon-default"}`}>
                                {isActive ? "▶" : isDone ? "✓" : li + 1}
                              </div>
                              <div className="vc-lesson-info">
                                <div className={`vc-lesson-name ${isActive ? "vc-lesson-name-active" : ""}`}>
                                  {lesson.title}
                                </div>
                                {lesson.duration > 0 && (
                                  <div className="vc-lesson-dur">
                                    {Math.floor(lesson.duration / 60)}:{String(lesson.duration % 60).padStart(2, "0")}
                                  </div>
                                )}
                              </div>
                              {lesson.isFree && <span className="vc-free-pill">Free</span>}
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )) : (
                <p style={{
                  textAlign: "center", color: "var(--muted)", marginTop: 48,
                  fontSize: 14, fontFamily: "var(--serif)", fontStyle: "italic"
                }}>
                  No lessons available
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default VideoCourse;