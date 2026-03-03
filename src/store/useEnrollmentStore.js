import { create } from "zustand";
import { courseService } from "../services/courseService";

export const useEnrollmentStore = create((set, get) => ({
  // ── State ──
  enrolledCourses: [],
  loading:         false,
  error:           null,

  // ── Actions ──
  fetchEnrolled: async () => {
    set({ loading: true, error: null });
    try {
      const data = await courseService.getMyCourses();
      set({ enrolledCourses: data.mycourses, loading: false });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  enroll: async (courseId) => {
    try {
      await courseService.enroll(courseId);
      // Refetch to get updated progress data
      const data = await courseService.getMyCourses();
      set({ enrolledCourses: data.mycourses });
      return { success: true };
    } catch (e) {
      return { success: false, error: e.response?.data?.message || e.message };
    }
  },

  isEnrolled: (courseId) =>
    get().enrolledCourses.some((c) => c._id === courseId),

  updateProgress: (courseId, progressData) =>
    set((state) => ({
      enrolledCourses: state.enrolledCourses.map((c) =>
        c._id === courseId ? { ...c, ...progressData } : c
      ),
    })),

  clearError: () => set({ error: null }),
}));