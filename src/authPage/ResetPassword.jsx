import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { token } = useParams();
  const navigate = useNavigate();
  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      setPassword("")
      setConfirmPassword("")
      return;
    }
    try {
      const res = await axios.post(`${backendUrl}/api/auth/reset-password/${token}`, { password });

      console.log("The response for data reset", res);
      if (res.status===200) {
navigate('/')
localStorage.removeItem("token"); // or the key you use

        alert("Password reset successful");
      } else {
        setPassword("")
      setConfirmPassword("")
        alert("Error resetting password1");
      }
    } catch (error) {
      console.log(error);
      setPassword("")
      setConfirmPassword("")
      alert("Error resetting password2");
    }
  };

  return (
    <div className='flex justify-center items-center h-screen'> 
      <form onSubmit={(e)=>{e.preventDefault(); handleSubmit();}} className="flex flex-col gap-4">
        <div>Enter New password</div>
        <input 
          type='password' 
          value={password} 
          onChange={(e)=>setPassword(e.target.value)}
          className="border p-2"
        />
        <div>Confirm Password</div>
        <input 
          type='password' 
          value={confirmPassword} 
          onChange={(e)=>setConfirmPassword(e.target.value)}
          className="border p-2"
        />
        <button type='submit' className="bg-blue-500 text-white p-2 rounded">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
