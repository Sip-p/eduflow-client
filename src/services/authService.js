import api from "./api";

export const authService = {
  // ✅ /user-login
  login: (email, password) =>
    api.post("/auth/user-login", { email, password }).then((r) => r.data),

  // ✅ /user-signup — accepts pre-built FormData (with file inside)
  registerWithForm: (formData) =>
    api.post("/auth/user-signup", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((r) => r.data),

// ✅ /Verify token
   verifyEmail:(token)=>
    api.get(`/auth/verify-email/${token}`).then((r) => r.data),
  
  // ✅ /reset-request
  requestReset: (email) =>
    api.post("/auth/reset-request", { email }).then((r) => r.data),

  // ✅ /reset-password/:token
  resetPassword: (token, newPassword) =>
    api.post(`/auth/reset-password/${token}`, { newPassword }).then((r) => r.data),

  // ✅ /reset-setting-password
  resetFromSettings: (oldPassword, newPassword) =>
    api.post("/auth/reset-setting-password", { oldPassword, newPassword }).then((r) => r.data),
};