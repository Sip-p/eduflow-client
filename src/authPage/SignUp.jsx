import React, { useState } from 'react';
import { useAuth } from '../redux/useAuth';
import axios from 'axios';

const Signup = () => {
  const { signup, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    picFile: null
  });

  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const token=localStorage.getItem("token")
  // File upload handler for preview & state
  // const handleFileUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) {
  //     alert('Please select your profile pic');
  //     return;
  //   }
  //   if (!file.type.startsWith('image/')) {
  //     alert('Please select a valid image file');
  //     return;
  //   }
  //   if (file.size > 2 * 1024 * 1024) {
  //     alert('File size should be less than 2MB');
  //     return;
  //   }
  //   setFormData({ ...formData, picFile: file });
  //   setImagePreview(URL.createObjectURL(file));
  // };

  const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setFormData(prev => ({ ...prev, picFile: file })); // ✅ save actual file
  setImagePreview(URL.createObjectURL(file));
};


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation
//     if (!formData.name.trim()) return alert('Please enter your name');
//     if (!formData.email.trim()) return alert('Please enter your email');
//     if (!formData.password) return alert('Please enter a password');
//     if (formData.password.length < 6) return alert('Password must be at least 6 characters');
//     if (formData.password !== formData.confirmPassword) return alert('Passwords do not match');
//     if (!formData.role) return alert('Please select your role (Student or Teacher)');
//     if (!formData.picFile) return alert('Please upload your profile picture');

//     setUploading(true);

//     try {
//       const form = new FormData();
//       form.append('name', formData.name.trim());
//       form.append('email', formData.email.trim().toLowerCase());
//       form.append('password', formData.password);
//       form.append('role', formData.role);
// form.append('file', formData.picFile);

//       const res = await axios.post(`${backendUrl}/api/auth/user-signup`, form, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });

//       console.log('Signup success:', res.data);
//       setUploading(false);

//       if (res.data.success) {
//         localStorage.setItem('token', res.data.token);
       
//         localStorage.setItem('user', JSON.stringify(res.data.user));
//         setImagePreview(null);
//         const resj=await signup(res.data.user); // Update auth context
//         console.log("Your Signup data is__________",resj)
//         alert('Signup successful!');
//         // localStorage.getItem('user').role==="student"? window.location.href = '/student-dashboard':window.location.href = '/instructor-dashboard'
//       console.log(res.data.user.role)
//       }

//     } catch (err) {
//       setUploading(false);
//       console.error('Signup failed:', err.response?.data || err.message);
//       alert(err.response?.data?.message || 'Signup failed');
//     }
//   };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name.trim()) return alert('Please enter your name');
  if (!formData.email.trim()) return alert('Please enter your email');
  if (!formData.password) return alert('Please enter a password');
  if (formData.password.length < 6) return alert('Password must be at least 6 characters');
  if (formData.password !== formData.confirmPassword) return alert('Passwords do not match');
  if (!formData.role) return alert('Please select your role (Student or Teacher)');
  if (!formData.picFile) return alert('Please upload your profile picture');

  setUploading(true);

  try {
    const res = await signup(formData); // 🔑 use redux thunk only
    console.log("Your Signup data is__________", res);

    setUploading(false);

    if (res && res.payload && res.payload.success) {
      localStorage.setItem('token', res.payload.token);
      localStorage.setItem('user', JSON.stringify(res.payload.user));
      setImagePreview(null);

      alert('Signup successful!');
      console.log("the user",res.payload.user)
console.log("the role",res.payload.user.role)
      // redirect
        const role = res.payload.user.role;
      if (role === "student") {
        window.location.href = '/student-dashboard';
      } else {
        window.location.href = '/instructor-dashboard';
      }
    }
  } catch (err) {
    setUploading(false);
    console.error('Signup failed:', err);
    alert('Signup failed');
  }
};


  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Create Account
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
            {typeof error === 'object' ? error.message || 'Signup failed' : error}
          </div>
        )}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
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
          placeholder="Password (min 6 characters)"
          value={formData.password}
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
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '20px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
        />

        <div style={{ marginBottom: '20px' }}>
          <h3 className='text-gray-400'>Your Role</h3>
          <label className='text-gray-400'>
            <input 
              type="radio"
              name="role"
              value="student"
              checked={formData.role === "student"}
              onChange={handleChange}
            />
            Student
          </label>

          <label style={{ marginLeft: "20px" }} className='text-gray-400'>
            <input
              type="radio"
              name="role"
              value="teacher"
              checked={formData.role === "teacher"}
              onChange={handleChange}
            />
            Teacher
          </label>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 className='text-gray-400' style={{ marginBottom: '10px' }}>
            Profile Picture (Optional)
          </h3>

          {imagePreview && (
            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
              <img 
                src={imagePreview} 
                alt="Profile Preview" 
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #ddd'
                }}
              />
            </div>
          )}

          <input 
            type='file' 
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box',
              backgroundColor: uploading ? '#f5f5f5' : 'white'
            }}
          />

          {uploading && (
            <p style={{ 
              color: '#007bff', 
              fontSize: '14px', 
              marginTop: '5px',
              textAlign: 'center'
            }}>
              Uploading image...
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || uploading}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: (isLoading || uploading) ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: (isLoading || uploading) ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Creating Account...' : uploading ? 'Uploading...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Signup;
