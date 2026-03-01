import React, { useState } from 'react';
import { useAuth } from './redux/useAuth';
import Login from './authPage/Login';
import Signup from './authPage/SignUp';

const Home = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  // If user is logged in, show dashboard
  // if (isAuthenticated) {
  //   return (
  //     <div className="p-5">
  //       <h1 className="text-2xl font-bold mb-2">Welcome to Dashboard!</h1>
  //       <p className="mb-1">Hello, {user?.name || user?.email || 'User'}!</p>
  //       <p className="mb-4">You are successfully logged in.</p>
  //       <button
  //         onClick={logout}
  //         className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
  //       >
  //         Logout
  //       </button>
  //     </div>
  //   );
  // }

  // If not logged in, show login or signup form
  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
  <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">

    {showSignup ? <Signup /> : <Login />}

    <p className="text-center text-sm text-gray-600 mt-6">
      {showSignup ? (
        <>
          Already have an account?{" "}
          <button
            onClick={() => setShowSignup(false)}
            className="text-amber-600 font-medium hover:underline"
          >
            Login here
          </button>
        </>
      ) : (
        <>
          Don't have an account?{" "}
          <button
            onClick={() => setShowSignup(true)}
            className="text-amber-600 font-medium hover:underline"
          >
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
