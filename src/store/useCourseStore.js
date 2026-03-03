import { create } from "zustand";
import { courseService } from "../services/courseService";

export const useCourseStore = create((set) => ({
  // ── State ──
  allCourses:       [],
  instructorCourses:[],
  curriculum:       null,   // { course, curriculum: [{chapter, lessons}] }
  dashboardStats:   null,
  loading:          false,
  error:            null,

  // ── Actions ──
  fetchAllCourses: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const data = await courseService.getAll(filters);
      set({ allCourses: data.courses, loading: false });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  fetchInstructorCourses: async () => {
    set({ loading: true, error: null });
    try {
      const data = await courseService.getInstructor();
      set({ instructorCourses: data.courses, loading: false });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  fetchCurriculum: async (courseId) => {
    set({ loading: true, error: null });
    try {
      const data = await courseService.getCurriculum(courseId);
      set({ curriculum: data, loading: false });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  fetchDashboardStats: async () => {
    set({ loading: true, error: null });
    try {
      const data = await courseService.getDashboard();
      set({ dashboardStats: data.data, loading: false });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  createCourse: async (courseData) => {
    set({ loading: true, error: null });
    try {
      const data = await courseService.create(courseData);
      // Add new course to instructorCourses list
      set((state) => ({
        instructorCourses: [data.course, ...state.instructorCourses],
        loading: false,
      }));
      return { success: true, course: data.course };
    } catch (e) {
      set({ error: e.message, loading: false });
      return { success: false, error: e.message };
    }
  },

  deleteCourse: async (courseId) => {
    try {
      await courseService.delete(courseId);
      set((state) => ({
        instructorCourses: state.instructorCourses.filter((c) => c._id !== courseId),
        allCourses: state.allCourses.filter((c) => c._id !== courseId),
      }));
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  togglePublish: async (courseId) => {
    try {
      const data = await courseService.togglePublish(courseId);
      set((state) => ({
        instructorCourses: state.instructorCourses.map((c) =>
          c._id === courseId ? { ...c, published: data.course.published } : c
        ),
      }));
      return { success: true, published: data.course.published };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  clearCurriculum: () => set({ curriculum: null }),
  clearError:      () => set({ error: null }),
}));