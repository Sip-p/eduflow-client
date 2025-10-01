import React from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const navigate=useNavigate();
  const user = localStorage.getItem("user");
  return user ? children :   navigate("/signUp");
};

export default ProtectedRoute;