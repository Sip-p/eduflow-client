import React, { useState, useRef,useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
// import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { courseService } from "../services/courseService";
import { uploadService } from "../services/uploadService";
// ─── STEP INDICATOR ───────────────────────────────────────────────────────────
const StepIndicator = ({ currentStep }) => {
  const steps = [
    { num: 1, label: "Course Info" },
    { num: 2, label: "Chapters" },
    { num: 3, label: "Lessons" },
    { num: 4, label: "Publish" },
  ];
  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((step, i) => (
        <React.Fragment key={step.num}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                currentStep > step.num
                  ? "bg-emerald-500 text-white"
                  : currentStep === step.num
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-300"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {currentStep > step.num ? "✓" : step.num}
            </div>
            <span
              className={`mt-1.5 text-xs font-medium ${
                currentStep === step.num ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-0.5 w-16 mx-2 mb-5 transition-all duration-500 ${
                currentStep > step.num ? "bg-emerald-400" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// ─── STEP 1: COURSE INFO ──────────────────────────────────────────────────────
const Step1CourseInfo = ({ data, onChange }) => {
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [thumbPreview, setThumbPreview] = useState(data.thumbnailPreview || null);

  // const handleThumbChange = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file || !file.type.startsWith("image/")) return;
  //   setThumbPreview(URL.createObjectURL(file));
  //   setUploadingThumb(true);
  //   try {
  //     const fd = new FormData();
  //     fd.append("file", file);
  //     // const res = await axios.post(`${backendUrl}/api/upload/upload-image`, fd);
  //     const url = await uploadService.uploadImage(file);
  //       onChange("thumbnail", url);
  //     if (res.data?.url) {
  //       onChange("thumbnail", res.data.url);
  //       onChange("thumbnailPreview", URL.createObjectURL(file));
  //     }
  //   } catch {
  //     alert("Thumbnail upload failed");
  //   } finally {
  //     setUploadingThumb(false);
  //   }
  // };
const handleThumbChange = async (e) => {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith("image/")) return;

  setThumbPreview(URL.createObjectURL(file));
  setUploadingThumb(true);

  try {
    const url = await uploadService.uploadImage(file);

    onChange("thumbnail", url);
    onChange("thumbnailPreview", URL.createObjectURL(file));

  } catch {
    alert("Thumbnail upload failed");
  } finally {
    setUploadingThumb(false);
  }
};

 
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Course Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Complete Biology for Class 12"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition"
          value={data.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Description <span className="text-red-500">*</span>
        </label>
        <ReactQuill
          theme="snow"
          value={data.description}
          onChange={(v) => onChange("description", v)}
          placeholder="What will students learn in this course?"
          className="bg-white rounded-xl"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Price (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="0 for free"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition"
            value={data.price}
            onChange={(e) => onChange("price", e.target.value)}
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition bg-white"
            value={data.category}
            onChange={(e) => onChange("category", e.target.value)}
          >
            <option value="">Select category</option>
            <option value="web">Web Development</option>
            <option value="math">Mathematics</option>
            <option value="science">Science</option>
            <option value="biology">Biology</option>
            <option value="literature">Literature</option>
            <option value="language">Language</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Level
        </label>
        <div className="flex gap-3">
          {["beginner", "intermediate", "advanced"].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => onChange("level", lvl)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                data.level === lvl
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Course Thumbnail <span className="text-red-500">*</span>
        </label>
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all">
          {thumbPreview ? (
            <img src={thumbPreview} alt="thumbnail" className="h-full w-full object-cover rounded-xl" />
          ) : (
            <div className="text-center">
              <div className="text-4xl mb-2">🖼️</div>
              <p className="text-sm text-gray-500">Click to upload thumbnail</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleThumbChange} className="hidden" />
        </label>
        {uploadingThumb && <p className="text-indigo-500 text-sm mt-2 animate-pulse">Uploading thumbnail...</p>}
        {data.thumbnail && !uploadingThumb && (
          <p className="text-emerald-500 text-sm mt-2 flex items-center gap-1">
            <span>✓</span> Thumbnail uploaded
          </p>
        )}
      </div>
    </div>
  );
};

// ─── STEP 2: CHAPTERS ─────────────────────────────────────────────────────────
const Step2Chapters = ({ chapters, setChapters }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editingIdx, setEditingIdx] = useState(null);

  const addChapter = () => {
    if (!newTitle.trim()) return alert("Enter chapter title");
    const chapter = {
      id: Date.now(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      order: chapters.length + 1,
      lessons: [],
    };
    setChapters([...chapters, chapter]);
    setNewTitle("");
    setNewDesc("");
  };

  const removeChapter = (id) => {
    if (!window.confirm("Remove this chapter and all its lessons?")) return;
    setChapters(chapters.filter((c) => c.id !== id));
  };

  const updateChapter = (id, field, value) => {
    setChapters(chapters.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  return (
    <div className="space-y-6">
      {/* Chapter list */}
      {chapters.length > 0 && (
        <div className="space-y-3">
          {chapters.map((ch, idx) => (
            <div key={ch.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </span>
                  {editingIdx === idx ? (
                    <input
                      autoFocus
                      className="border-b border-indigo-400 outline-none px-1 font-medium"
                      value={ch.title}
                      onChange={(e) => updateChapter(ch.id, "title", e.target.value)}
                      onBlur={() => setEditingIdx(null)}
                    />
                  ) : (
                    <span className="font-medium text-gray-800">{ch.title}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                    {ch.lessons.length} lesson{ch.lessons.length !== 1 ? "s" : ""}
                  </span>
                  <button
                    onClick={() => setEditingIdx(idx)}
                    className="text-gray-400 hover:text-indigo-500 text-sm px-2 py-1 rounded-lg hover:bg-indigo-50 transition"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => removeChapter(ch.id)}
                    className="text-gray-400 hover:text-red-500 text-sm px-2 py-1 rounded-lg hover:bg-red-50 transition"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              {ch.description && (
                <p className="px-4 pb-3 text-sm text-gray-500 border-t border-gray-100 pt-2">{ch.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add chapter form */}
      <div className="bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-indigo-700 mb-3 uppercase tracking-wide">
          + Add New Chapter
        </h3>
        <input
          type="text"
          placeholder="Chapter title (e.g. Chapter 1 – Cell Biology)"
          className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none mb-3 bg-white"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addChapter()}
        />
        <input
          type="text"
          placeholder="Short description (optional)"
          className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none mb-3 bg-white"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addChapter()}
        />
        <button
          onClick={addChapter}
          disabled={!newTitle.trim()}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Add Chapter
        </button>
      </div>

      {chapters.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-4">
          No chapters yet — add at least one chapter to continue
        </p>
      )}
    </div>
  );
};

// ─── STEP 3: LESSONS ─────────────────────────────────────────────────────────
const Step3Lessons = ({ chapters, setChapters }) => {
  const [selectedChapterId, setSelectedChapterId] = useState(chapters[0]?.id || null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDesc, setLessonDesc] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const titleRef = useRef("");
  const descRef = useRef("");

  const selectedChapter = chapters.find((c) => c.id === selectedChapterId);
useEffect(() => {
  if (chapters.length > 0 && !selectedChapterId) {
    setSelectedChapterId(chapters[0].id);
  }
}, [chapters]);
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("video/")) return alert("Select a video file");
    if (file.size > 500 * 1024 * 1024) return alert("Max 500MB");
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  // const uploadVideo = async (file) => {
  //   // Get Cloudinary signature from backend
  //   const sigRes = await axios.get(`${backendUrl}/api/cloudinary/signature`);
  //   const { timestamp, signature, apiKey, cloudName } = sigRes.data;

  //   const fd = new FormData();
  //   fd.append("file", file);
  //   fd.append("api_key", apiKey);
  //   fd.append("timestamp", timestamp);
  //   fd.append("signature", signature);
  //   fd.append("folder", "courses/videos");
  //   fd.append("resource_type", "video");

  //   const res = await axios.post(
  //     `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
  //     fd,
  //     {
  //       onUploadProgress: (e) => {
  //         setUploadProgress(Math.round((e.loaded * 100) / e.total));
  //       },
  //     }
  //   );
  //   return {
  //     videoUrl: res.data.secure_url,
  //     duration: Math.round((res.data.duration || 0) / 60), // convert to minutes
  //     thumbnail: res.data.thumbnail_url || "",
  //   };
  // };

  const addLesson = async () => {
    const title = titleRef.current.trim();
    const desc = descRef.current.trim();
    if (!title) return alert("Enter lesson title");
    if (!videoFile) return alert("Select a video");
    if (!selectedChapterId) return alert("Select a chapter");

    setUploading(true);
    setUploadProgress(0);
    try {
      // const videoData = await uploadVideo(videoFile);
      const videoData = await uploadService.uploadVideo(videoFile, (pct) => setUploadProgress(pct));
      console.log("Uploaded video data:", videoData); // Debug log
      const newLesson = {
        id: Date.now(),
        title,
        description: desc,
 videoUrl: videoData.url,
 duration: Math.round(videoData.duration / 60),
        thumbnail: videoData.thumbnail,
        isFree,
        order: selectedChapter.lessons.length + 1,
      };

      setChapters((prev) =>
        prev.map((ch) =>
          ch.id === selectedChapterId
            ? { ...ch, lessons: [...ch.lessons, newLesson] }
            : ch
        )
      );

      // Reset form
      setLessonTitle("");
      setLessonDesc("");
      titleRef.current = "";
      descRef.current = "";
      setVideoFile(null);
      setVideoPreview(null);
      setIsFree(false);
      setUploadProgress(0);
    } catch (err) {
      alert("Video upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeLesson = (chapterId, lessonId) => {
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId
          ? { ...ch, lessons: ch.lessons.filter((l) => l.id !== lessonId) }
          : ch
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Chapter selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Chapter to Add Lessons To
        </label>
        <div className="flex flex-wrap gap-2">
          {chapters.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => setSelectedChapterId(ch.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedChapterId === ch.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Ch {idx + 1}: {ch.title}
              {ch.lessons.length > 0 && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${selectedChapterId === ch.id ? 'bg-indigo-500' : 'bg-gray-300 text-gray-600'}`}>
                  {ch.lessons.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Existing lessons for selected chapter */}
      {selectedChapter && selectedChapter.lessons.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Lessons in "{selectedChapter.title}"
          </h3>
          {selectedChapter.lessons.map((lesson, idx) => (
            <div key={lesson.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{lesson.title}</p>
                  <p className="text-xs text-gray-400">
                    {lesson.duration > 0 ? `${lesson.duration} min` : "Duration unknown"}
                    {lesson.isFree && <span className="ml-2 text-emerald-500">• Free preview</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-500">✓ Uploaded</span>
                <button
                  onClick={() => removeLesson(selectedChapterId, lesson.id)}
                  className="text-gray-400 hover:text-red-500 text-xs px-2 py-1 rounded-lg hover:bg-red-50 transition"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add lesson form */}
      {selectedChapter && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            + Add Lesson to "{selectedChapter.title}"
          </h3>

          <input
            type="text"
            placeholder="Lesson title (e.g. Lesson 1 – What is a Cell?)"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
            value={lessonTitle}
            onChange={(e) => { setLessonTitle(e.target.value); titleRef.current = e.target.value; }}
            disabled={uploading}
          />

          <textarea
            placeholder="Lesson description (optional)"
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none bg-white resize-none"
            value={lessonDesc}
            onChange={(e) => { setLessonDesc(e.target.value); descRef.current = e.target.value; }}
            disabled={uploading}
          />

          {/* Free preview toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setIsFree(!isFree)}
              className={`w-11 h-6 rounded-full transition-all ${isFree ? "bg-emerald-500" : "bg-gray-300"} relative`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${isFree ? "left-6" : "left-1"}`} />
            </div>
            <span className="text-sm text-gray-600">
              Free preview lesson <span className="text-gray-400">(students can watch without enrolling)</span>
            </span>
          </label>

          {/* Video upload */}
          {!videoPreview ? (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all">
              <div className="text-center">
                <div className="text-3xl mb-1">🎬</div>
                <p className="text-sm text-gray-500">Click to upload lesson video</p>
                <p className="text-xs text-gray-400">MP4, MOV, AVI up to 500MB</p>
              </div>
              <input type="file" accept="video/*" onChange={handleVideoChange} className="hidden" disabled={uploading} />
            </label>
          ) : (
            <div className="relative">
              <video src={videoPreview} controls className="w-full rounded-xl max-h-48 bg-black" />
              {!uploading && (
                <button
                  onClick={() => { setVideoFile(null); setVideoPreview(null); }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Upload progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-indigo-600 font-medium animate-pulse">Uploading video...</span>
                <span className="text-gray-600 font-bold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">Don't close this page while uploading</p>
            </div>
          )}

          <button
            onClick={addLesson}
            disabled={uploading || !lessonTitle.trim() || !videoFile}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Uploading {uploadProgress}%...
              </>
            ) : (
              "Add Lesson"
            )}
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Course Structure</h3>
        <div className="space-y-2">
          {chapters.map((ch, idx) => (
            <div key={ch.id} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Ch {idx + 1}: {ch.title}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                ch.lessons.length > 0 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              }`}>
                {ch.lessons.length > 0 ? `${ch.lessons.length} lesson${ch.lessons.length !== 1 ? "s" : ""}` : "No lessons yet"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── STEP 4: REVIEW & PUBLISH ─────────────────────────────────────────────────
const Step4Review = ({ courseData, chapters, onPublish, loading }) => {
  const totalLessons = chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
  const totalDuration = chapters.reduce(
    (sum, ch) => sum + ch.lessons.reduce((s, l) => s + (l.duration || 0), 0), 0
  );

  return (
    <div className="space-y-6">
      {/* Summary card */}
      <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-6">
        <div className="flex gap-5">
          {courseData.thumbnail && (
            <img
              src={courseData.thumbnail}
              alt="thumbnail"
              className="w-32 h-20 object-cover rounded-xl shadow-md flex-shrink-0"
            />
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900">{courseData.title}</h2>
            <p className="text-sm text-gray-500 mt-1 capitalize">{courseData.category} · {courseData.level}</p>
            <div className="flex gap-3 mt-3">
              <span className="text-sm bg-white border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full font-medium">
                ₹{courseData.price === "0" || courseData.price === 0 ? "Free" : courseData.price}
              </span>
              <span className="text-sm bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full">
                {chapters.length} chapters
              </span>
              <span className="text-sm bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full">
                {totalLessons} lessons
              </span>
              {totalDuration > 0 && (
                <span className="text-sm bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full">
                  ~{totalDuration} min
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chapter breakdown */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Course Curriculum</h3>
        <div className="space-y-3">
          {chapters.map((ch, idx) => (
            <div key={ch.id} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-gray-800">{ch.title}</span>
                </div>
                <span className="text-sm text-gray-500">{ch.lessons.length} lessons</span>
              </div>
              {ch.lessons.map((l, li) => (
                <div key={l.id} className="flex items-center gap-3 px-4 py-2.5 border-t border-gray-100">
                  <span className="text-gray-300 text-sm">└</span>
                  <span className="text-sm text-gray-600 flex-1">{l.title}</span>
                  {l.isFree && <span className="text-xs text-emerald-500 font-medium">Free</span>}
                  {l.duration > 0 && <span className="text-xs text-gray-400">{l.duration} min</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Validation warnings */}
      {chapters.some((ch) => ch.lessons.length === 0) && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <span className="text-amber-500 text-lg">⚠️</span>
          <div>
            <p className="text-sm font-semibold text-amber-800">Some chapters have no lessons</p>
            <p className="text-xs text-amber-600 mt-0.5">
              {chapters.filter((ch) => ch.lessons.length === 0).map((ch) => ch.title).join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* Publish buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => onPublish(false)}
          disabled={loading}
          className="flex-1 py-3.5 border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition disabled:opacity-50"
        >
          {loading === "draft" ? "Saving..." : "Save as Draft"}
        </button>
        <button
          onClick={() => onPublish(true)}
          disabled={loading || totalLessons === 0}
          className="flex-1 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-40 shadow-lg shadow-indigo-200"
        >
          {loading === "publish" ? "Publishing..." : "🚀 Publish Course"}
        </button>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const CourseCreation = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1 data
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    level: "beginner",
    thumbnail: "",
    thumbnailPreview: "",
  });

  // Steps 2 & 3 data — chapters contain lessons
  const [chapters, setChapters] = useState([]);

  const updateCourseData = (field, value) => {
    setCourseData((prev) => ({ ...prev, [field]: value }));
  };

  // ── Validation per step ──
  const canProceed = () => {
    if (step === 1) {
      return courseData.title.trim() && courseData.description.trim() &&
        courseData.price !== "" && courseData.category && courseData.thumbnail;
    }
    if (step === 2) return chapters.length > 0;
    if (step === 3) return chapters.some((ch) => ch.lessons.length > 0);
    return true;
  };

  // ── Final submit ──
  const handlePublish = async (publish) => {
    setLoading(publish ? "publish" : "draft");
    try {
       // Build payload matching your Chapter + Lesson model
      const payload = {
        title: courseData.title.trim(),
        description: courseData.description.trim(),
        price: parseFloat(courseData.price) || 0,
        category: courseData.category,
        level: courseData.level,
        thumbnail: courseData.thumbnail,
        published: publish,
        chapters: chapters.map((ch, ci) => ({
          title: ch.title,
          description: ch.description,
          order: ci + 1,
          lessons: ch.lessons.map((l, li) => ({
            title: l.title,
            description: l.description,
            videoUrl: l.videoUrl,
            duration: l.duration,
            thumbnail: l.thumbnail,
            isFree: l.isFree,
            order: li + 1,
          })),
        })),
      };

      // const res = await axios.post(`${backendUrl}/api/course/create`, payload, {
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      console.log("COURSE PAYLOAD:", payload);
const res=await courseService.create(payload)
      alert(publish ? "Course published successfully! 🎉" : "Course saved as draft!");

      // Reset everything
      setCourseData({ title: "", description: "", price: "", category: "", level: "beginner", thumbnail: "", thumbnailPreview: "" });
      setChapters([]);
      setStep(1);
    } catch (err) {
      alert("Failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create a Course</h1>
          <p className="text-gray-500 mt-1">Build your course step by step</p>
        </div>

        <StepIndicator currentStep={step} />

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Step title */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {step === 1 && "Course Information"}
              {step === 2 && "Add Chapters"}
              {step === 3 && "Add Lessons"}
              {step === 4 && "Review & Publish"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {step === 1 && "Basic details about your course"}
              {step === 2 && "Chapters organize your course (e.g. Chapter 1 – Cell Biology)"}
              {step === 3 && "Upload video lessons under each chapter"}
              {step === 4 && "Review everything before publishing"}
            </p>
          </div>

          {/* Step content */}
          {step === 1 && <Step1CourseInfo data={courseData} onChange={updateCourseData} />}
          {step === 2 && <Step2Chapters chapters={chapters} setChapters={setChapters} />}
          {step === 3 && <Step3Lessons chapters={chapters} setChapters={setChapters} />}
          {step === 4 && (
            <Step4Review
              courseData={courseData}
              chapters={chapters}
              onPublish={handlePublish}
              loading={loading}
            />
          )}

          {/* Navigation */}
          {step < 4 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => setStep((s) => s - 1)}
                disabled={step === 1}
                className="px-6 py-2.5 text-gray-600 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-200"
              >
                Continue →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCreation;