import { create } from "zustand";
import { assignmentService } from "../services/assignmentService";

export const useAssignmentStore = create((set) => ({
  // ── State ──
  assignments:       [],   // for current course
  allAssignments:    [],   // instructor's all assignments
  loading:           false,
  error:             null,

  // ── Actions ──
  fetchCourseAssignments: async (courseId) => {
    set({ loading: true, error: null });
    try {
      const data = await assignmentService.getByCourse(courseId);
      set({ assignments: data.assignments, loading: false });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  createAssignment: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await assignmentService.create(payload);
      set((state) => ({
        allAssignments: [data.assignment, ...state.allAssignments],
        loading: false,
      }));
      return { success: true, assignment: data.assignment };
    } catch (e) {
      set({ error: e.message, loading: false });
      return { success: false, error: e.response?.data?.message || e.message };
    }
  },

  uploadAttachment: async (file) => {
    try {
      const url = await assignmentService.uploadFile(file);
      return { success: true, url };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  clearAssignments: () => set({ assignments: [] }),
  clearError:       () => set({ error: null }),
}));