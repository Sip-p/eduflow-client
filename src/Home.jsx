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
    <div className='flex justify-center align-center bg-gray-300 '> 
    <div className="     flex flex-col items-center justify-center min-h-screen">
      <div className="p-5 w-full max-w-md mx-auto bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-semibold mb-4 text-center">
          {showSignup ? 'Sign Up' : 'Login'}
        </h1>

        {showSignup ? <Signup /> : <Login />}

        <p className="text-center mt-5 text-sm">
          {showSignup ? (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setShowSignup(false)}
                className="text-blue-600 hover:underline"
              >
                Login here
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => setShowSignup(true)}
                className="text-blue-600 hover:underline"
              >
                Sign up here
              </button>
            </>
          )}
        </p>
      </div>
    </div>
    </div>
  );
};

export default Home;
