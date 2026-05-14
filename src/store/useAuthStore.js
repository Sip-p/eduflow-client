import { create } from "zustand";
import { persist } from "zustand/middleware";
import { socket } from "../socket.js"
import { authService } from "../services/authService.js";
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        socket.connect();
        socket.once("connect", () => {
          socket.emit("join", user._id);
        });
        set({ user, token, isAuthenticated: true });
      },
      verifyEmail: async (token) => {
        try {
          const data = await authService.verifyEmail(token);
          return { success: true, message: data.message };
        } catch (e) {
          return { success: false, error: e.response?.data?.message || e.message };
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },

      updateUser: (updates) => {
        set((state) => ({ user: { ...state.user, ...updates } }))
      }
    }),
    { name: "eduflow-auth" }
  )
);