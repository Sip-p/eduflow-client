import React from 'react';
import { useAuth } from '../redux/useAuth.js';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return <div>Checking authentication...</div>;
  }

  // If not authenticated, show login message
  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h2>Access Denied</h2>
        <p>Please log in to access this content.</p>
      </div>
    );
  }

  // If authenticated, show the protected content
  return children;
};

export default ProtectedRoute;


// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem("token");

//   // If no token → redirect to signup
//   if (!token) {
//     return <Navigate to="/signUp" replace />;
//   }

//   // If token exists → allow access
//   return children;
// };

// export default ProtectedRoute;
