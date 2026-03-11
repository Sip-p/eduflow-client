import { create } from "zustand";
import { persist } from "zustand/middleware";
import {socket} from "../socket.js"
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
      logout: () =>{
        set({ user: null, token: null, isAuthenticated: false })
      },
      updateUser: (updates) =>{
        set((state) => ({ user: { ...state.user, ...updates } }))
   }
   }),
    { name: "eduflow-auth" }
  )
);