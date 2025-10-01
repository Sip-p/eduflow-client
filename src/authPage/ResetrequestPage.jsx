import React, { useState } from 'react';
import axios from 'axios'
const ResetrequestPage = () => {
  const [email, setEmail] = useState("");
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const handleSubmit=async(e)=>{
 try {
     e.preventDefault();
 
   const res=await axios.post(backendUrl+'/api/auth/reset-request',{email})
   setEmail("")
   console.log("Tour data is ",res.data)
 } catch (error) {
    console.log("The error is",error)
 }
}
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 border-4 border-gray-300 bg-white rounded-lg shadow-md">
        <form onSubmit={(e)=>handleSubmit(e)}>
          <h1 className="text-xl font-semibold mb-4 text-center">Enter Your Email for Reset Link</h1>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
              <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition mt-4"
          >
            Submit
          </button>

        </form>
       </div>
    </div>
  );
};

export default ResetrequestPage;