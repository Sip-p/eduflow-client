import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";  // ✅ Zustand
import Login from "./authPage/Login";
import Signup from "./authPage/SignUp";

const Home = () => {
  const { user, isAuthenticated } = useAuthStore();  // ✅ replaces useAuth()
  const navigate = useNavigate();
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "student") navigate("/student-dashboard");
      else if (user.role === "teacher") navigate("/instructor-dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-blue-900 text-white">
        <h1 className="text-2xl font-semibold">Redirecting...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 transition-all duration-300">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {showSignup ? "Create Account" : "Welcome Back"}
        </h2>

        {showSignup ? <Signup /> : <Login />}

        <p className="text-center text-sm text-gray-600 mt-6">
          {showSignup ? (
            <>
              Already have an account?{" "}
              <button onClick={() => setShowSignup(false)} className="text-indigo-600 font-medium hover:underline">
                Login here
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button onClick={() => setShowSignup(true)} className="text-indigo-600 font-medium hover:underline">
                Sign up here
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Home;