import React, { useState } from 'react';
import { useAuth } from '../redux/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
const Login = () => {
    const navigate=useNavigate()
  const { login, isLoading, error } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
const handleSendLink=async()=>{
  const res=await axios.post(backendUrl+'/api/auth//request-reset',{email})
  console.log("The response is",res)
}
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      alert('Please enter your email');
      return;
    }
    
    if (!formData.password) {
      alert('Please enter your password');
      return;
    }

    const loginData = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password
    };

    try {
      const result = await login(loginData);
      
      if (result.type === 'auth/loginUser/fulfilled') {
        console.log('Login successful!**');
localStorage.setItem('token',result.payload.token)
localStorage.setItem('user',JSON.stringify(result.payload.user))
        const token=result.payload.token
        const role=result.payload.user.role
        if(token && role==="student"){
          window.location.href='/student-dashboard'
        }else if(token && role==="teacher"){
          window.location.href='/instructor-dashboard'
        }
// console.log(result.payload.token)
      }
    } catch (err) {
        console.log("error here")
      console.error('Login error:', err);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Welcome Back
      </h2>
      
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #f5c6cb'
          }}>
            {typeof error === 'object' ? error.message || 'Login failed' : error}
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '12px',
          
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
        />
<a className='mb-9  text-blue-400 mr-4 hover:text-blue-700 cursor-pointer' onClick={()=>navigate('/reset-request')}>Forgot Password?</a>
        <button className='mt-5'
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
