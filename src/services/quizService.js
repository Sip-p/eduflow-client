import api from "./api";

export const quizService = {
  getAll: () =>
    api.get("/quiz").then((r) => r.data),

  getById: (quizId) =>
    api.get(`/quiz/${quizId}`).then((r) => r.data),

  getByCourse: (courseId) =>
    api.get(`/quiz/course/${courseId}`).then((r) => r.data),

  getStats: (quizId) =>
    api.get(`/quiz/${quizId}/stats`).then((r) => r.data),

  getMyQuizzes: () =>
    api.get("/quiz/instructor/myquizzes").then((r) => r.data),

  create: (payload) =>
    api.post("/quiz/create", payload).then((r) => r.data),

  submit: (quizId, answers) =>
    api.post(`/quiz/${quizId}/attempt`, { answers }).then((r) => r.data),

  getAttemptResult: (quizId) =>
    api.get(`/quiz/${quizId}/result`).then((r) => r.data),

  delete: (quizId) =>
    api.delete(`/quiz/${quizId}`).then((r) => r.data),
};