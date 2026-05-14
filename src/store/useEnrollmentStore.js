// import { create } from "zustand";
// import { courseService } from "../services/courseService";

// export const useEnrollmentStore = create((set, get) => ({
//   // ── State ──
//   enrolledCourses: [],
//   loading:         false,
//   error:           null,

//   // ── Actions ──
//   fetchEnrolled: async () => {
//     set({ loading: true, error: null });
//     try {
//       const data = await courseService.getMyCourses();
//       set({ enrolledCourses: data.mycourses, loading: false });
//     } catch (e) {
//       set({ error: e.message, loading: false });
//     }
//   },

//   enroll: async (courseId) => {
//     try {
//       await courseService.enroll(courseId);
//       // Refetch to get updated progress data
//       const data = await courseService.getMyCourses();
//       set({ enrolledCourses: data.mycourses });
//       return { success: true };
//     } catch (e) {
//       return { success: false, error: e.response?.data?.message || e.message };
//     }
//   },

//   isEnrolled: (courseId) =>
//     get().enrolledCourses.some((c) => c._id === courseId),

//   updateProgress: (courseId, progressData) =>
//     set((state) => ({
//       enrolledCourses: state.enrolledCourses.map((c) =>
//         c._id === courseId ? { ...c, ...progressData } : c
//       ),
//     })),

//   clearError: () => set({ error: null }),
// }));\




import { create } from "zustand";
import axios from "axios";

export const useEnrollmentStore = create((set, get) => ({
  enrolledCourses: [],
  loading: false,
  error: null,

  // ✅ Fetch courses
  fetchEnrolled: async (token, backendUrl) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${backendUrl}/api/course/mycourses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({
        enrolledCourses: res.data.mycourses || [],
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  // ✅ Update status
  updateCourseStatus: async (courseId, currentStatus, token, backendUrl) => {
    try {
      const newStatus =
        currentStatus === "completed" ? "in-progress" : "completed";

      const res = await axios.put(
        `${backendUrl}/api/course/stsupdate`,
        { courseId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // 🔥 Update local state (NO refetch needed)
        set((state) => ({
          enrolledCourses: state.enrolledCourses.map((course) =>
            course._id === courseId
              ? { ...course, progressStatus: newStatus }
              : course
          ),
        }));
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || err.message,
      };
    }
  },

  clearError: () => set({ error: null }),
}));