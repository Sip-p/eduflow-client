import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AssignmentCreate = () => {
  const [form, setForm] = useState({
    course: "",
    assignmentNumber: "",
    description: "",
    totalPoints: 100,
    dueDate: "",
  });
  const [attachment, setAttachment] = useState(null);
  const [attachmentName, setAttachmentName] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { token } = useAuthStore();

  // Fetch instructor's courses for the dropdown
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/course/instructor/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setCourses(res.data.courses);
      } catch (err) {
        console.error("Failed to fetch courses:", err.message);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAttachment(file);
    setAttachmentName(file.name);
  };

  const uploadFile = async () => {
    if (!attachment) return "";
    const formData = new FormData();
    formData.append("file", attachment);
    const res = await axios.post(`${backendUrl}/api/upload/upload-assignment`, formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    if (res.data?.url) return res.data.url;
    throw new Error("Upload failed: no URL returned");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.course) { setError("Please select a course"); return; }
    setLoading(true);
    setError("");
    try {
      const attachmentsUrl = await uploadFile();
      const selectedCourse = courses.find((c) => c._id === form.course);
      await axios.post(
        `${backendUrl}/api/assignments/createassignment`,
        {
          course: selectedCourse?.title,   // backend looks up by title
          description: form.description,
          assignmentNumber: form.assignmentNumber,
          totalPoints: Number(form.totalPoints),
          dueDate: form.dueDate,
          attachments: attachmentsUrl,
        },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setSuccess(true);
      setForm({ course: "", assignmentNumber: "", description: "", totalPoints: 100, dueDate: "" });
      setAttachment(null);
      setAttachmentName("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .ac-wrap {
          min-height: 100vh;
          background: #080810;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 48px 20px;
          font-family: 'DM Sans', sans-serif;
        }

        .ac-card {
          width: 100%;
          max-width: 520px;
          background: #0d1117;
          border: 1px solid #1e293b;
          border-radius: 20px;
          overflow: hidden;
        }

        .ac-card-header {
          padding: 28px 32px 24px;
          border-bottom: 1px solid #1e293b;
          background: #0a0f1a;
        }

        .ac-card-header h1 {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #f1f5f9;
          margin-bottom: 4px;
        }

        .ac-card-header p {
          font-size: 13px;
          color: #475569;
        }

        .ac-body { padding: 28px 32px; display: flex; flex-direction: column; gap: 20px; }

        .ac-field { display: flex; flex-direction: column; gap: 7px; }

        .ac-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #64748b;
        }

        .ac-input, .ac-select, .ac-textarea {
          background: #080810;
          border: 1px solid #1e293b;
          border-radius: 10px;
          padding: 11px 14px;
          color: #e2e8f0;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
        }
        .ac-input:focus, .ac-select:focus, .ac-textarea:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.12);
        }
        .ac-input::placeholder, .ac-textarea::placeholder { color: #334155; }
        .ac-select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }
        .ac-select option { background: #0d1117; color: #e2e8f0; }
        .ac-textarea { resize: vertical; min-height: 88px; line-height: 1.6; }

        .ac-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        /* File upload */
        .ac-file-zone {
          border: 1.5px dashed #1e293b;
          border-radius: 10px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          position: relative;
          text-align: center;
        }
        .ac-file-zone:hover { border-color: #4f46e5; background: rgba(79,70,229,0.04); }
        .ac-file-zone input[type="file"] {
          position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
        }
        .ac-file-icon { font-size: 28px; }
        .ac-file-label { font-size: 13px; color: #64748b; }
        .ac-file-label span { color: #6366f1; font-weight: 600; }
        .ac-file-name {
          font-size: 12px;
          color: #4ade80;
          background: #052e16;
          border: 1px solid #166534;
          border-radius: 6px;
          padding: 4px 10px;
          margin-top: 4px;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Error / Success */
        .ac-error {
          background: #1c0a0a;
          border: 1px solid #7f1d1d;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #fca5a5;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ac-success {
          background: #052e16;
          border: 1px solid #166534;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #4ade80;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Submit */
        .ac-submit {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .ac-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .ac-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .ac-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="ac-wrap">
        <div className="ac-card">

          <div className="ac-card-header">
            <h1>📝 Create Assignment</h1>
            <p>Add an assignment to one of your courses</p>
          </div>

          <form className="ac-body" onSubmit={handleSubmit}>

            {/* Course dropdown */}
            <div className="ac-field">
              <label className="ac-label">Course</label>
              <select
                className="ac-select"
                name="course"
                value={form.course}
                onChange={handleChange}
                required
              >
                <option value="">— Select a course —</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>
            </div>

            {/* Assignment number + points */}
            <div className="ac-row">
              <div className="ac-field">
                <label className="ac-label">Assignment Title</label>
                <input
                  className="ac-input"
                  type="text"
                  name="assignmentNumber"
                  placeholder="e.g. Assignment 1"
                  value={form.assignmentNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="ac-field">
                <label className="ac-label">Total Points</label>
                <input
                  className="ac-input"
                  type="number"
                  name="totalPoints"
                  min="0"
                  value={form.totalPoints}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Description */}
            <div className="ac-field">
              <label className="ac-label">Description</label>
              <textarea
                className="ac-textarea"
                name="description"
                placeholder="Describe what students need to do..."
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Due date */}
            <div className="ac-field">
              <label className="ac-label">Due Date</label>
              <input
                className="ac-input"
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* File upload */}
            <div className="ac-field">
              <label className="ac-label">Attachment (optional)</label>
              <div className="ac-file-zone">
                <input type="file" onChange={handleFileChange} />
                <div className="ac-file-icon">📎</div>
                <p className="ac-file-label">
                  Drop file here or <span>browse</span>
                </p>
                <p style={{ fontSize: 11, color: "#334155" }}>PDF, DOC, DOCX, PNG — any format</p>
                {attachmentName && (
                  <div className="ac-file-name">✓ {attachmentName}</div>
                )}
              </div>
            </div>

            {/* Feedback */}
            {error && <div className="ac-error">⚠ {error}</div>}
            {success && <div className="ac-success">✓ Assignment created successfully!</div>}

            {/* Submit */}
            <button className="ac-submit" type="submit" disabled={loading}>
              {loading ? (
                <><div className="ac-spinner" /> Uploading & Creating...</>
              ) : (
                "Create Assignment"
              )}
            </button>

          </form>
        </div>
      </div>
    </>
  );
};

export default AssignmentCreate;