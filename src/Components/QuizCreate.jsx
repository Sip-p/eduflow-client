import React, { useState, useEffect } from 'react';
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const TOGGLE_OPTIONS = ["allowReview", "showCorrectAnswers", "shuffleQuestions", "shuffleOptions", "isPublished"];

const defaultMeta = {
  title: "", description: "", course: "", duration: "",
  totalPoints: "", passingScore: "", isPublished: "No",
  startDate: "", endDate: "", maxAttempts: "",
  allowReview: "Yes", showCorrectAnswers: "No",
  shuffleQuestions: "Yes", shuffleOptions: "Yes", gradingType: "automatic"
};

const defaultQuestion = () => ({ question: "", options: ["", "", "", ""], correctAns: "" });

const Toggle = ({ label, value, onChange }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1a2234" }}>
    <span style={{ fontSize: 13, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
    <button type="button" onClick={() => onChange(value === "Yes" ? "No" : "Yes")}
      style={{
        width: 44, height: 24, borderRadius: 99, border: "none", cursor: "pointer", position: "relative",
        background: value === "Yes" ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#1e293b",
        transition: "background 0.2s"
      }}>
      <span style={{
        position: "absolute", top: 3, width: 18, height: 18, borderRadius: "50%", background: "white",
        transition: "left 0.2s", left: value === "Yes" ? 23 : 3
      }} />
    </button>
  </div>
);

const QuizCreate = () => {
  const [questions, setQuestions] = useState([defaultQuestion()]);
  const [metaData, setMetaData] = useState(defaultMeta);
  const [courses, setCourses] = useState([]);
  const [formKey, setFormKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("questions"); // questions | settings
const {   token  } = useAuthStore();
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/course/instructor/courses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) setCourses(res.data.courses);
      } catch (e) { console.error("Courses fetch error:", e.message); }
    };
    fetchCourses();
  }, []);

  const updateMeta = (key, val) => setMetaData(prev => ({ ...prev, [key]: val }));
  const updateQuestion = (qidx, key, val) => {
    setQuestions(prev => { const u = [...prev]; u[qidx] = { ...u[qidx], [key]: val }; return u; });
  };
  const updateOption = (qidx, oidx, val) => {
    setQuestions(prev => {
      const u = [...prev];
      u[qidx] = { ...u[qidx], options: u[qidx].options.map((o, i) => i === oidx ? val : o) };
      return u;
    });
  };
  const removeQuestion = (idx) => setQuestions(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    if (!metaData.course) { setError("Please select a course"); return; }
    if (!metaData.title.replace(/<[^>]+>/g, "").trim()) { setError("Quiz title is required"); return; }
    setLoading(true); setError("");
    try {
      const formatted = { ...metaData,
        allowReview: metaData.allowReview === "Yes", showCorrectAnswers: metaData.showCorrectAnswers === "Yes",
        shuffleQuestions: metaData.shuffleQuestions === "Yes", shuffleOptions: metaData.shuffleOptions === "Yes",
        isPublished: metaData.isPublished === "Yes",
      };
      await axios.post(`${backendUrl}/api/quiz/create`,
        { questionsData: questions, metaData: formatted },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setMetaData(defaultMeta);
      setQuestions([defaultQuestion()]);
      setFormKey(k => k + 1);
      setTimeout(() => setSuccess(false), 3500);
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Failed to create quiz");
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .qc-wrap { min-height: 100vh; background: #080810; font-family: 'DM Sans', sans-serif; }

        /* Top bar */
        .qc-topbar {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 32px;
          background: rgba(8,8,16,0.95); backdrop-filter: blur(12px);
          border-bottom: 1px solid #1e293b;
        }
        .qc-topbar-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #f1f5f9; }
        .qc-topbar-actions { display: flex; gap: 10px; }

        .qc-btn {
          padding: 9px 20px; border-radius: 9px; font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s;
          display: flex; align-items: center; gap: 6px;
        }
        .qc-btn-ghost { background: #1e293b; color: #94a3b8; }
        .qc-btn-ghost:hover { background: #293548; color: #f1f5f9; }
        .qc-btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; }
        .qc-btn-primary:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .qc-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

        /* Layout */
        .qc-body { display: flex; gap: 0; max-width: 1200px; margin: 0 auto; padding: 32px 24px; gap: 24px; }
        .qc-main { flex: 1; display: flex; flex-direction: column; gap: 20px; }
        .qc-side { width: 320px; min-width: 320px; display: flex; flex-direction: column; gap: 16px; }

        /* Cards */
        .qc-card {
          background: #0d1117; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden;
        }
        .qc-card-header {
          padding: 16px 20px; border-bottom: 1px solid #1e293b; background: #0a0f1a;
          display: flex; align-items: center; justify-content: space-between;
        }
        .qc-card-header h2 { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #f1f5f9; }
        .qc-card-body { padding: 20px; }

        /* Labels & inputs */
        .qc-label { font-size: 11px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; color: #475569; margin-bottom: 7px; display: block; }
        .qc-input, .qc-select {
          background: #080810; border: 1px solid #1e293b; border-radius: 9px;
          padding: 10px 14px; color: #e2e8f0; font-size: 13.5px;
          font-family: 'DM Sans', sans-serif; outline: none; width: 100%;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .qc-input:focus, .qc-select:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
        .qc-input::placeholder { color: #334155; }
        .qc-select { cursor: pointer; appearance: none; padding-right: 36px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 14px center; background-color: #080810;
        }
        .qc-select option { background: #0d1117; }
        .qc-field { margin-bottom: 16px; }
        .qc-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        /* Quill dark override */
        .qc-quill .ql-toolbar { background: #0a0f1a !important; border-color: #1e293b !important; border-radius: 9px 9px 0 0; }
        .qc-quill .ql-container { background: #080810 !important; border-color: #1e293b !important; border-radius: 0 0 9px 9px; min-height: 80px; }
        .qc-quill .ql-editor { color: #e2e8f0 !important; font-family: 'DM Sans', sans-serif !important; font-size: 14px; }
        .qc-quill .ql-editor.ql-blank::before { color: #334155 !important; font-style: normal; }
        .qc-quill .ql-stroke { stroke: #64748b !important; }
        .qc-quill .ql-fill { fill: #64748b !important; }
        .qc-quill .ql-picker-label { color: #64748b !important; }

        /* Question card */
        .qc-q-card {
          background: #0d1117; border: 1px solid #1e293b; border-radius: 14px;
          overflow: hidden; margin-bottom: 16px;
        }
        .qc-q-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 18px; background: #0a0f1a; border-bottom: 1px solid #1e293b;
        }
        .qc-q-num {
          width: 26px; height: 26px; border-radius: 7px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 800; color: white;
        }
        .qc-q-title { font-size: 13px; font-weight: 600; color: #94a3b8; }
        .qc-q-del { background: #1c0a0a; border: 1px solid #7f1d1d; color: #fca5a5; border-radius: 7px; padding: 4px 10px; font-size: 12px; cursor: pointer; transition: all 0.15s; }
        .qc-q-del:hover { background: #7f1d1d; color: white; }

        .qc-q-body { padding: 18px; }
        .qc-options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
        .qc-opt-wrap { position: relative; }
        .qc-opt-label {
          position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
          width: 20px; height: 20px; border-radius: 50%;
          background: #1e293b; color: #64748b;
          font-size: 10px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }
        .qc-opt-input {
          background: #080810; border: 1px solid #1e293b; border-radius: 9px;
          padding: 9px 12px 9px 38px; color: #e2e8f0; font-size: 13px;
          font-family: 'DM Sans', sans-serif; outline: none; width: 100%;
          transition: border-color 0.2s;
        }
        .qc-opt-input:focus { border-color: #4f46e5; }
        .qc-opt-input::placeholder { color: #334155; }

        .qc-correct-wrap { display: flex; align-items: center; gap: 10px; }
        .qc-correct-icon { font-size: 16px; }
        .qc-correct-input {
          flex: 1; background: rgba(5,46,22,0.5); border: 1px solid #166534; border-radius: 9px;
          padding: 9px 14px; color: #4ade80; font-size: 13px;
          font-family: 'DM Sans', sans-serif; outline: none;
        }
        .qc-correct-input::placeholder { color: #166534; }

        /* Add question btn */
        .qc-add-btn {
          width: 100%; padding: 14px;
          background: transparent; border: 1.5px dashed #1e293b;
          border-radius: 12px; color: #475569; font-family: 'DM Sans', sans-serif;
          font-size: 14px; cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .qc-add-btn:hover { border-color: #6366f1; color: #6366f1; background: rgba(99,102,241,0.04); }

        /* Settings section tabs */
        .qc-stabs { display: flex; gap: 4px; margin-bottom: 16px; }
        .qc-stab { flex: 1; padding: 8px; border-radius: 8px; border: none; background: transparent; color: #475569; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; text-transform: uppercase; letter-spacing: 0.04em; }
        .qc-stab-active { background: #1e293b; color: #f1f5f9; }

        /* Feedback */
        .qc-error { background: #1c0a0a; border: 1px solid #7f1d1d; border-radius: 9px; padding: 10px 14px; font-size: 13px; color: #fca5a5; margin-bottom: 12px; }
        .qc-success { background: #052e16; border: 1px solid #166534; border-radius: 9px; padding: 10px 14px; font-size: 13px; color: #4ade80; margin-bottom: 12px; }

        .qc-spinner { width: 15px; height: 15px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: qc-spin 0.7s linear infinite; }
        @keyframes qc-spin { to { transform: rotate(360deg); } }

        @media (max-width: 900px) {
          .qc-body { flex-direction: column; }
          .qc-side { width: 100%; min-width: unset; }
        }
      `}</style>

      <div className="qc-wrap">

        {/* Top bar */}
        <div className="qc-topbar">
          <div className="qc-topbar-title">🧠 Create Quiz</div>
          <div className="qc-topbar-actions">
            <button className="qc-btn qc-btn-ghost" onClick={() => window.history.back()}>← Back</button>
            <button className="qc-btn qc-btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? <><div className="qc-spinner" /> Saving...</> : "Publish Quiz"}
            </button>
          </div>
        </div>

        <div className="qc-body">

          {/* ── Left: Questions ── */}
          <div className="qc-main">

            {/* Feedback */}
            {error && <div className="qc-error">⚠ {error}</div>}
            {success && <div className="qc-success">✓ Quiz created successfully!</div>}

            {/* Quiz meta card */}
            <div className="qc-card">
              <div className="qc-card-header">
                <h2>Quiz Details</h2>
              </div>
              <div className="qc-card-body">
                <div className="qc-field">
                  <label className="qc-label">Course</label>
                  <select className="qc-select" value={metaData.course}
                    onChange={e => updateMeta("course", e.target.value)}>
                    <option value="">— Select a course —</option>
                    {courses.map(c => <option key={c._id} value={c.title}>{c.title}</option>)}
                  </select>
                </div>

                <div className="qc-field">
                  <label className="qc-label">Quiz Title</label>
                  <div className="qc-quill">
                    <ReactQuill key={formKey + "-title"} theme="snow" value={metaData.title}
                      onChange={v => updateMeta("title", v)} placeholder="Enter quiz title" />
                  </div>
                </div>

                <div className="qc-field" style={{ marginBottom: 0 }}>
                  <label className="qc-label">Description</label>
                  <div className="qc-quill">
                    <ReactQuill key={formKey + "-desc"} theme="snow" value={metaData.description}
                      onChange={v => updateMeta("description", v)} placeholder="What is this quiz about?" />
                  </div>
                </div>
              </div>
            </div>

            {/* Questions */}
            {questions.map((q, qidx) => (
              <div className="qc-q-card" key={qidx}>
                <div className="qc-q-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="qc-q-num">{qidx + 1}</div>
                    <span className="qc-q-title">Question {qidx + 1}</span>
                  </div>
                  {questions.length > 1 && (
                    <button className="qc-q-del" onClick={() => removeQuestion(qidx)}>✕ Remove</button>
                  )}
                </div>

                <div className="qc-q-body">
                  <div style={{ marginBottom: 16 }}>
                    <label className="qc-label">Question</label>
                    <div className="qc-quill">
                      <ReactQuill key={formKey + "-q-" + qidx} theme="snow" value={q.question}
                        onChange={v => updateQuestion(qidx, "question", v)}
                        placeholder="Enter your question here..." />
                    </div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label className="qc-label">Answer Options</label>
                    <div className="qc-options-grid">
                      {q.options.map((opt, oidx) => (
                        <div className="qc-opt-wrap" key={oidx}>
                          <div className="qc-opt-label">{String.fromCharCode(65 + oidx)}</div>
                          <input className="qc-opt-input" type="text" value={opt}
                            placeholder={`Option ${oidx + 1}`}
                            onChange={e => updateOption(qidx, oidx, e.target.value)} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="qc-label">Correct Answer</label>
                    <div className="qc-correct-wrap">
                      <span className="qc-correct-icon">✓</span>
                      <input className="qc-correct-input" type="text" value={q.correctAns}
                        placeholder="Type the correct answer exactly as written above"
                        onChange={e => updateQuestion(qidx, "correctAns", e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add question */}
            <button className="qc-add-btn"
              onClick={() => setQuestions(prev => [...prev, defaultQuestion()])}>
              + Add Question
            </button>
          </div>

          {/* ── Right: Settings ── */}
          <div className="qc-side">
            <div className="qc-card">
              <div className="qc-card-header"><h2>⚙ Quiz Settings</h2></div>
              <div className="qc-card-body">

                <div className="qc-row2" style={{ marginBottom: 14 }}>
                  <div>
                    <label className="qc-label">Duration</label>
                    <input className="qc-input" type="time" value={metaData.duration}
                      onChange={e => updateMeta("duration", e.target.value)} />
                  </div>
                  <div>
                    <label className="qc-label">Max Attempts</label>
                    <input className="qc-input" type="number" min="1" placeholder="∞"
                      value={metaData.maxAttempts} onChange={e => updateMeta("maxAttempts", e.target.value)} />
                  </div>
                </div>

                <div className="qc-row2" style={{ marginBottom: 14 }}>
                  <div>
                    <label className="qc-label">Total Points</label>
                    <input className="qc-input" type="number" value={metaData.totalPoints}
                      onChange={e => updateMeta("totalPoints", e.target.value)} />
                  </div>
                  <div>
                    <label className="qc-label">Passing Score</label>
                    <input className="qc-input" type="number" value={metaData.passingScore}
                      onChange={e => updateMeta("passingScore", e.target.value)} />
                  </div>
                </div>

                <div className="qc-field">
                  <label className="qc-label">Start Date</label>
                  <input className="qc-input" type="date" value={metaData.startDate}
                    onChange={e => updateMeta("startDate", e.target.value)} />
                </div>
                <div className="qc-field">
                  <label className="qc-label">End Date</label>
                  <input className="qc-input" type="date" value={metaData.endDate}
                    onChange={e => updateMeta("endDate", e.target.value)} />
                </div>

                <div className="qc-field">
                  <label className="qc-label">Grading Type</label>
                  <select className="qc-select" value={metaData.gradingType}
                    onChange={e => updateMeta("gradingType", e.target.value)}>
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>

                {/* Toggles */}
                <div style={{ marginTop: 8 }}>
                  {[
                    { key: "isPublished", label: "Publish Quiz" },
                    { key: "allowReview", label: "Allow Review" },
                    { key: "showCorrectAnswers", label: "Show Correct Answers" },
                    { key: "shuffleQuestions", label: "Shuffle Questions" },
                    { key: "shuffleOptions", label: "Shuffle Options" },
                  ].map(({ key, label }) => (
                    <Toggle key={key} label={label} value={metaData[key]}
                      onChange={v => updateMeta(key, v)} />
                  ))}
                </div>

              </div>
            </div>

            {/* Summary */}
            <div className="qc-card">
              <div className="qc-card-header"><h2>📊 Summary</h2></div>
              <div className="qc-card-body">
                {[
                  { label: "Questions", value: questions.length },
                  { label: "Course", value: metaData.course || "—" },
                  { label: "Total Points", value: metaData.totalPoints || "—" },
                  { label: "Duration", value: metaData.duration || "—" },
                  { label: "Status", value: metaData.isPublished === "Yes" ? "Published" : "Draft" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1a2234" }}>
                    <span style={{ fontSize: 12, color: "#64748b" }}>{label}</span>
                    <span style={{ fontSize: 13, color: value === "Published" ? "#4ade80" : value === "Draft" ? "#f59e0b" : "#e2e8f0", fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default QuizCreate;