import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import GroupChat from "./GroupChat";

const VideoCourse = () => {
  const courseId = window.location.pathname.split("/")[2];
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [activeTab, setActiveTab] = useState("playlist"); // playlist | assignments | chat
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
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.status === 200) setAssignments(res.data.assignments);
    } catch (err) {
      console.log("Assignments error:", err.message);
    }
  };

  useEffect(() => {
    getCurriculum();
    getAssignments();
  }, []);

  const toggleChapter = (id) =>
    setExpandedChapters((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleLessonClick = (lesson) => {
    setCurrentVideo(lesson);
    if (window.innerWidth < 1024) setActiveTab("playlist");
  };

  const markComplete = (lessonId) => {
    setCompletedLessons((prev) => new Set([...prev, lessonId]));
  };

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
      if (u.hostname.includes("youtube.com")) return `https://www.youtube.com/embed/${u.searchParams.get("v")}?autoplay=1&rel=0`;
      if (u.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1&rel=0`;
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

  const progressPct = totalLessons > 0 ? Math.round((completedLessons.size / totalLessons) * 100) : 0;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 48, height: 48, border: "3px solid #1e293b", borderTop: "3px solid #6366f1",
            borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite"
          }} />
          <p style={{ color: "#64748b", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em" }}>Loading course...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const ytUrl = currentVideo ? getYouTubeEmbedUrl(currentVideo.videoUrl) : null;
  const isDirectVideo = currentVideo && !ytUrl;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .vc-root {
          min-height: 100vh;
          background: #080810;
          color: #e2e8f0;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* Top bar */
        .vc-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 24px;
          background: rgba(10,10,20,0.95);
          border-bottom: 1px solid #1e293b;
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .vc-back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #1e293b;
          border: 1px solid #334155;
          color: #94a3b8;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }
        .vc-back-btn:hover { background: #293548; color: #e2e8f0; transform: translateX(-2px); }

        .vc-course-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #f1f5f9;
          max-width: 400px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .vc-progress-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #0f172a;
          border: 1px solid #1e293b;
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 12px;
          color: #64748b;
        }
        .vc-progress-bar-wrap {
          width: 80px; height: 4px; background: #1e293b; border-radius: 99px; overflow: hidden;
        }
        .vc-progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          border-radius: 99px;
          transition: width 0.4s ease;
        }

        /* Body layout */
        .vc-body {
          display: flex;
          flex: 1;
          overflow: hidden;
          min-height: calc(100vh - 57px);
        }

        /* Main area */
        .vc-main {
          flex: 1;
          overflow-y: auto;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Video card */
        .vc-video-card {
          background: #0d1117;
          border: 1px solid #1e293b;
          border-radius: 16px;
          overflow: hidden;
        }

        .vc-video-wrapper {
          position: relative;
          width: 100%;
          background: #000;
        }

        .vc-video-meta {
          padding: 20px 24px;
          border-top: 1px solid #1e293b;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .vc-video-meta-left h2 {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 6px;
        }

        .vc-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 10px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
        }
        .vc-badge-free { background: #052e16; color: #4ade80; border: 1px solid #166534; }
        .vc-badge-paid { background: #1e1b4b; color: #818cf8; border: 1px solid #3730a3; }
        .vc-badge-lesson { background: #0f172a; color: #64748b; border: 1px solid #1e293b; }

        .vc-nav-btns {
          display: flex;
          gap: 8px;
        }
        .vc-nav-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .vc-nav-btn-prev { background: #1e293b; color: #94a3b8; }
        .vc-nav-btn-prev:hover { background: #293548; color: #e2e8f0; }
        .vc-nav-btn-next { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; }
        .vc-nav-btn-next:hover { opacity: 0.9; transform: translateX(2px); }
        .vc-nav-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none !important; }

        .vc-complete-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .vc-complete-btn-done { background: #052e16; color: #4ade80; border: 1px solid #166534; cursor: default; }
        .vc-complete-btn-mark { background: #0f172a; color: #64748b; border: 1px solid #1e293b; }
        .vc-complete-btn-mark:hover { border-color: #4ade80; color: #4ade80; background: #052e16; }

        .vc-description {
          padding: 0 24px 20px;
          color: #64748b;
          font-size: 14px;
          line-height: 1.7;
        }

        /* Tabs */
        .vc-tabs {
          display: flex;
          gap: 4px;
          background: #0d1117;
          border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 4px;
        }
        .vc-tab {
          flex: 1;
          padding: 9px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #64748b;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .vc-tab-active { background: #1e293b; color: #f1f5f9; }

        /* Assignments */
        .vc-assignment-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }
        .vc-assignment-card {
          background: #0d1117;
          border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 18px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .vc-assignment-card:hover { border-color: #6366f1; transform: translateY(-2px); }
        .vc-assignment-card h3 { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #f1f5f9; margin-bottom: 8px; }
        .vc-assignment-card p { font-size: 13px; color: #64748b; line-height: 1.5; }
        .vc-assignment-meta { display: flex; gap: 12px; margin-top: 12px; flex-wrap: wrap; }
        .vc-assignment-meta span { font-size: 12px; color: #475569; }
        .vc-assignment-link { margin-top: 12px; font-size: 12px; color: #6366f1; font-weight: 600; display: flex; align-items: center; gap: 4px; }

        /* Chat wrapper */
        .vc-chat-wrapper { background: #0d1117; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; }

        /* Sidebar */
        .vc-sidebar {
          width: 340px;
          min-width: 340px;
          background: #09090f;
          border-left: 1px solid #1e293b;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .vc-sidebar-header {
          padding: 20px;
          border-bottom: 1px solid #1e293b;
          background: #0a0a15;
        }
        .vc-sidebar-header h2 {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 4px;
        }
        .vc-sidebar-meta { font-size: 12px; color: #334155; }

        .vc-sidebar-scroll { flex: 1; overflow-y: auto; padding: 12px; }
        .vc-sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .vc-sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .vc-sidebar-scroll::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 99px; }

        /* Chapter */
        .vc-chapter { border: 1px solid #1a2234; border-radius: 10px; overflow: hidden; margin-bottom: 8px; }
        .vc-chapter-hdr {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 14px;
          background: #0f1729;
          border: none;
          cursor: pointer;
          transition: background 0.15s;
          text-align: left;
          gap: 10px;
        }
        .vc-chapter-hdr:hover { background: #131e35; }
        .vc-chapter-num {
          width: 22px; height: 22px; min-width: 22px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 11px; font-weight: 800; color: white;
        }
        .vc-chapter-title {
          flex: 1;
          font-size: 13px;
          font-weight: 600;
          color: #cbd5e1;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .vc-chapter-count { font-size: 11px; color: #334155; white-space: nowrap; }

        /* Lesson */
        .vc-lesson {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          cursor: pointer;
          transition: background 0.15s;
          border-left: 3px solid transparent;
        }
        .vc-lesson:hover { background: #0f172a; }
        .vc-lesson-active {
          background: #160f2e !important;
          border-left-color: #6366f1;
        }
        .vc-lesson-icon {
          width: 28px; height: 28px; min-width: 28px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px;
          transition: all 0.2s;
        }
        .vc-lesson-icon-active { background: #6366f1; color: white; }
        .vc-lesson-icon-done { background: #052e16; color: #4ade80; }
        .vc-lesson-icon-default { background: #1e293b; color: #475569; }
        .vc-lesson-info { flex: 1; min-width: 0; }
        .vc-lesson-name {
          font-size: 13px;
          font-weight: 500;
          color: #94a3b8;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 1.3;
          font-family: 'DM Sans', sans-serif;
        }
        .vc-lesson-name-active { color: #e2e8f0; font-weight: 600; }
        .vc-lesson-sub { display: flex; gap: 6px; margin-top: 3px; align-items: center; }
        .vc-lesson-dur { font-size: 11px; color: #334155; }

        @media (max-width: 1024px) {
          .vc-body { flex-direction: column; }
          .vc-sidebar { width: 100%; min-width: unset; border-left: none; border-top: 1px solid #1e293b; max-height: 420px; }
          .vc-course-title { display: none; }
        }
      `}</style>

      <div className="vc-root">

        {/* ── Top bar ── */}
        <div className="vc-topbar">
          <button className="vc-back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>

          {course && <div className="vc-course-title">{course.title}</div>}

          <div className="vc-progress-pill">
            <span>{completedLessons.size}/{totalLessons}</span>
            <div className="vc-progress-bar-wrap">
              <div className="vc-progress-bar-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <span style={{ color: "#6366f1", fontWeight: 600 }}>{progressPct}%</span>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="vc-body">

          {/* ── Main column ── */}
          <div className="vc-main">

            {/* Video card */}
            <motion.div className="vc-video-card"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

              <div className="vc-video-wrapper">
                <AnimatePresence mode="wait">
                  {currentVideo ? (
                    <motion.div key={currentVideo._id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                      {ytUrl ? (
                        <iframe
                          width="100%" height="480" src={ytUrl}
                          title={currentVideo.title} frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen style={{ display: "block" }}
                        />
                      ) : isDirectVideo ? (
                        <video src={currentVideo.videoUrl} controls autoPlay
                          style={{ width: "100%", height: 480, background: "#000", display: "block" }} />
                      ) : (
                        <div style={{ height: 480, background: "#050510", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <p style={{ color: "#334155" }}>No video available</p>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div style={{ height: 480, background: "#050510", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {course?.thumbnail
                        ? <img src={course.thumbnail} alt="" style={{ maxHeight: 480, maxWidth: "100%", opacity: 0.5 }} />
                        : <p style={{ color: "#334155" }}>Select a lesson to start</p>}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {currentVideo && (
                <>
                  <div className="vc-video-meta">
                    <div className="vc-video-meta-left">
                      <h2>{currentVideo.title}</h2>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <span className="vc-badge vc-badge-lesson">Lesson {currentLessonIndex} of {totalLessons}</span>
                        <span className={`vc-badge ${currentVideo.isFree ? "vc-badge-free" : "vc-badge-paid"}`}>
                          {currentVideo.isFree ? "✦ Free" : "✦ Enrolled"}
                        </span>
                      </div>
                    </div>
                    <div className="vc-nav-btns">
                      <button
                        className="vc-complete-btn"
                        style={{ ...(completedLessons.has(currentVideo._id) ? {} : {}) }}
                        onClick={() => markComplete(currentVideo._id)}
                        disabled={completedLessons.has(currentVideo._id)}
                      >
                        {completedLessons.has(currentVideo._id)
                          ? <span className="vc-complete-btn vc-complete-btn-done">✓ Completed</span>
                          : <span className="vc-complete-btn vc-complete-btn-mark">Mark Complete</span>}
                      </button>
                      <button className="vc-nav-btn vc-nav-btn-prev"
                        disabled={!getPrevLesson()}
                        onClick={() => { const p = getPrevLesson(); if (p) setCurrentVideo(p); }}>
                        ← Prev
                      </button>
                      <button className="vc-nav-btn vc-nav-btn-next"
                        disabled={!getNextLesson()}
                        onClick={() => { const n = getNextLesson(); if (n) setCurrentVideo(n); }}>
                        Next →
                      </button>
                    </div>
                  </div>

                  {currentVideo.description && (
                    <div className="vc-description"
                      dangerouslySetInnerHTML={{ __html: currentVideo.description }} />
                  )}
                </>
              )}
            </motion.div>

            {/* Tabs */}
            <div className="vc-tabs">
              <button className={`vc-tab ${activeTab === "playlist" ? "vc-tab-active" : ""}`}
                onClick={() => setActiveTab("playlist")}>
                📚 Curriculum
              </button>
              {assignments.length > 0 && (
                <button className={`vc-tab ${activeTab === "assignments" ? "vc-tab-active" : ""}`}
                  onClick={() => setActiveTab("assignments")}>
                  📝 Assignments <span style={{ background: "#6366f1", color: "white", borderRadius: 99, padding: "1px 7px", fontSize: 11 }}>{assignments.length}</span>
                </button>
              )}
              <button className={`vc-tab ${activeTab === "chat" ? "vc-tab-active" : ""}`}
                onClick={() => setActiveTab("chat")}>
                💬 Discussion
              </button>
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              {activeTab === "assignments" && (
                <motion.div key="assignments"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="vc-assignment-grid">
                    {assignments.map((a, idx) => (
                      <motion.div key={a._id} className="vc-assignment-card"
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
                        onClick={() => navigate(`/assignment/byId`, {
                          state: { assignmentUrl: a.attachments, assignmentTitle: a.assignmentNumber, assignmentDescription: a.description }
                        })}>
                        <h3>{a.assignmentNumber}</h3>
                        <p>{a.description}</p>
                        <div className="vc-assignment-meta">
                          <span>📅 Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                          <span>⭐ {a.totalPoints} pts</span>
                        </div>
                        <div className="vc-assignment-link">View Assignment →</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "chat" && (
                <motion.div key="chat"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="vc-chat-wrapper">
                    <GroupChat courseId={courseId} />
                  </div>
                </motion.div>
              )}

              {activeTab === "playlist" && (
                <motion.div key="playlist-mobile"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: "none" }} className="vc-mobile-playlist">
                  {/* Mobile: curriculum shown in main area */}
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* ── Sidebar ── */}
          <div className="vc-sidebar">
            <div className="vc-sidebar-header">
              <h2>Course Content</h2>
              <div className="vc-sidebar-meta">
                {curriculum.length} chapters · {totalLessons} lessons
              </div>
            </div>

            <div className="vc-sidebar-scroll">
              {curriculum.length > 0 ? curriculum.map((chapter, chIdx) => (
                <div key={chapter._id} className="vc-chapter">
                  <button className="vc-chapter-hdr" onClick={() => toggleChapter(chapter._id)}>
                    <div className="vc-chapter-num">{chIdx + 1}</div>
                    <span className="vc-chapter-title">{chapter.title}</span>
                    <span className="vc-chapter-count">{chapter.lessons?.length || 0} lessons</span>
                    <span style={{ color: "#334155", fontSize: 10 }}>{expandedChapters[chapter._id] ? "▲" : "▼"}</span>
                  </button>

                  <AnimatePresence>
                    {expandedChapters[chapter._id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: "hidden" }}>
                        {(chapter.lessons || []).map((lesson) => {
                          const isActive = currentVideo?._id === lesson._id;
                          const isDone = completedLessons.has(lesson._id);
                          return (
                            <div key={lesson._id}
                              className={`vc-lesson ${isActive ? "vc-lesson-active" : ""}`}
                              onClick={() => handleLessonClick(lesson)}>
                              <div className={`vc-lesson-icon ${isActive ? "vc-lesson-icon-active" : isDone ? "vc-lesson-icon-done" : "vc-lesson-icon-default"}`}>
                                {isActive ? "▶" : isDone ? "✓" : "○"}
                              </div>
                              <div className="vc-lesson-info">
                                <div className={`vc-lesson-name ${isActive ? "vc-lesson-name-active" : ""}`}>{lesson.title}</div>
                                <div className="vc-lesson-sub">
                                  {lesson.duration > 0 && (
                                    <span className="vc-lesson-dur">
                                      {Math.floor(lesson.duration / 60)}:{String(lesson.duration % 60).padStart(2, "0")}
                                    </span>
                                  )}
                                  {lesson.isFree && (
                                    <span style={{ fontSize: 10, background: "#052e16", color: "#4ade80", padding: "1px 6px", borderRadius: 99, fontWeight: 600 }}>FREE</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )) : (
                <p style={{ textAlign: "center", color: "#334155", marginTop: 40, fontSize: 14 }}>No lessons available</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default VideoCourse;