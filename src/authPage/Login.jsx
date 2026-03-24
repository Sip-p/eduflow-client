import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";   // ✅ Zustand
import { authService }  from "../services/authService"; // ✅ service layer

const Login = () => {
  const { login } = useAuthStore();
  const navigate  = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState("");

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const data = await authService.login(formData.email, formData.password);
      login(data.user, data.token); // ✅ saves to Zustand + localStorage

      // Redirect based on role
      if (data.user.role === "student") navigate("/student-dashboard");
      else if (data.user.role === "teacher") navigate("/instructor-dashboard");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4  ">
      {error && (
        <div className="bg-red-100 text-red-600 text-sm rounded-lg p-3 border border-red-200">
          {error}
        </div>
      )}

      <input
        type="email" name="email" placeholder="Email Address"
        onChange={handleChange} required
        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-600"
      />

      <input
        type="password" name="password" placeholder="Password"
        onChange={handleChange} required
        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-600"
      />

      <div className="text-right">
        <a href="/reset-request" className="text-sm text-indigo-600 hover:underline">
          Forgot password?
        </a>
      </div>

      <button
        type="submit" disabled={isLoading}
        className={`w-full py-3 rounded-lg text-white transition ${
          isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default Login;