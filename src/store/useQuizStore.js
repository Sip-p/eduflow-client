import { create } from "zustand";
import { quizService } from "../services/quizService";

export const useQuizStore = create((set) => ({
  // ── State ──
  quizzes:     [],
  activeQuiz:  null,   // quiz being attempted
  result:      null,   // last attempt result
  stats:       null,   // quiz statistics
  loading:     false,
  error:       null,

  // ── Actions ──
  fetchQuizzes: async () => {
    set({ loading: true, error: null });
    try {
      const data = await quizService.getAll();
      set({ quizzes: data.quizzes, loading: false });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  fetchQuizById: async (quizId) => {
    set({ loading: true, error: null });
    try {
      const data = await quizService.getById(quizId);
      set({ activeQuiz: data.quiz, loading: false });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  fetchQuizStats: async (quizId) => {
    set({ loading: true });
    try {
      const data = await quizService.getStats(quizId);
      set({ stats: data.stats, loading: false });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  createQuiz: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await quizService.create(payload);
      set((state) => ({
        quizzes: [data.quiz, ...state.quizzes],
        loading: false,
      }));
      return { success: true, quiz: data.quiz };
    } catch (e) {
      set({ error: e.message, loading: false });
      return { success: false, error: e.response?.data?.message || e.message };
    }
  },

  submitAttempt: async (quizId, answers) => {
    set({ loading: true });
    try {
      const data = await quizService.submit(quizId, answers);
      set({ result: data.result, loading: false });
      return { success: true, result: data.result };
    } catch (e) {
      set({ error: e.message, loading: false });
      return { success: false, error: e.message };
    }
  },

  clearActiveQuiz: () => set({ activeQuiz: null, result: null }),
  clearError:      () => set({ error: null }),
}));