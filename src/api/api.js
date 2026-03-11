import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api",
});

api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem("eduflow-auth"));
  const token = auth?.state?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;