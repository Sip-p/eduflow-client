// import api from "./api";

// export const courseService = {
//   // ── Public ──────────────────────────────────────────────────────────────
 

//   // ── Instructor ───────────────────────────────────────────────────────────
//   getInstructor: () =>
//     api.get("/course/instructor/courses").then((r) => r.data),

//   getDashboard: () =>
//     api.get("/course/instructor/dashboard").then((r) => r.data),

//   create: (courseData) =>
//     api.post("/course/create", courseData).then((r) => r.data),

//   delete: (id) =>
//     api.delete(`/course/${id}`).then((r) => r.data),

//   togglePublish: (id) =>
//     api.patch(`/course/${id}/publish`).then((r) => r.data),

//   // ── Student ──────────────────────────────────────────────────────────────
//   getMyCourses: () =>
//     api.get("/course/mycourses").then((r) => r.data),

//   enroll: (courseId) =>
//     api.post("/course/addmycourse", { courseId }).then((r) => r.data),

//   updateProgress: (courseId, status) =>
//     api.put("/course/stsupdate", { courseId, status }).then((r) => r.data),

//   // ── Lessons ──────────────────────────────────────────────────────────────
//   getLessonVideo: (courseId, lessonId) =>
//     api.get(`/course/${courseId}/lesson/${lessonId}/video`).then((r) => r.data),

//   markLessonComplete: (courseId, lessonId) =>
//     api.patch(`/course/${courseId}/lesson/${lessonId}/complete`).then((r) => r.data),
// };

import api from "../api/api";
export const courseService = {
  // Public
  getAll: (params = {}) =>
    api.get("/course", { params }).then((r) => r.data),

  // getInstructor: () =>
  //   api.get("/course/instructor/courses").then((r) => r.data),

  // getDashboard: () =>
  //   api.get("/course/instructor-dashboard").then((r) => r.data),

  create: (courseData) =>
    api.post("/course/create", courseData).then((r) => r.data),

  delete: (id) =>
    api.delete(`/course/${id}`).then((r) => r.data),

  togglePublish: (id) =>
    api.patch(`/course/${id}/publish`).then((r) => r.data),

  getMyCourses: () =>
    api.get("/course/mycourses").then((r) => r.data),

  enroll: (courseId) =>
    api.post("/course/addmycourse", { courseId }).then((r) => r.data),
};