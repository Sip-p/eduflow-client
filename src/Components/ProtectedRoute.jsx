import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore"; // ✅ Zustand

// Usage:
// <ProtectedRoute>                          → any logged-in user
// <ProtectedRoute role="teacher">          → instructor only
// <ProtectedRoute role="student">          → student only

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useAuthStore();

  // Not logged in → go to login page
  if (!isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // Wrong role → go to their own dashboard
  if (role && user?.role !== role) {
    if (user?.role === "student")  return <Navigate to="/student-dashboard" replace />;
    if (user?.role === "teacher")  return <Navigate to="/instructor-dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;