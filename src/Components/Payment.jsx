import React from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
const Payment = () => {
  const { state } = useLocation();
const navigate=useNavigate()
  // console.log(state.course)
  const course=state.course
 const token=localStorage.getItem('token')
const backendUrl=import.meta.env.VITE_BACKEND_URL
  const handlePayment = async() => {
    try {
        
    
    const response=await axios.post(backendUrl+'/api/payment',{course},{
        headers:{Authorization:`bearer ${token}`}
    })
    if(response.status===200){
      navigate('/student-dashboard')
    }
    console.log("Payment response",response);
     } catch (error) {
        console.log(error)
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p className="mb-4">Price: ₹{course.price}</p>
      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Pay Now
      </button>
    </div>
  );
};

export default Payment;
