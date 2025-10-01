import React from 'react'
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const navigate=useNavigate()
  const user=JSON.parse(localStorage.getItem("user"))
  const role=user?.role
  return (

     <div className=' flex'>
      <img  src="https://img.freepik.com/free-vector/online-education-concept-illustration_114360-6261.jpg?w=740&t=st=1696117203~exp=1696117803~hmac=1e2a5a3f0e4f0e2e4c3b5f5c5e6f7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4" alt="Logo" className='w-16 h-16 rounded-4xl'/>
    <div className='   w-full flex justify-end items-center gap-6 bg-blue-500 text-white h-16'> 
     {role==="teacher" && <button className='hover:border-b-2 hover: border-white cursor-pointer'onClick={()=>navigate('/instructor-dashboard')}>Dashboard</button>}
     {role==="student" && <button className='hover:border-b-2 hover: border-white cursor-pointer'onClick={()=>navigate('/student-dashboard')}>Dashboard</button>}
     <button className='hover:border-b-2 hover: border-white cursor-pointer'onClick={()=>navigate('/')}>Home</button>
{role==="student" &&     <button className='hover:border-b-2 hover: border-white' onClick={()=>navigate('/courses')}>Courses</button>
}      <button className='hover:border-b-2 border-white' onClick={()=>navigate('/about')}>About</button>
      <button className='hover:border-b-2 border-white' onClick={()=>navigate('/pricing')}>Pricing</button>
      <button className='border-white border-2 px-2 py-1 text-white rounded-2xl hover:bg-white hover:text-black hover:border-blue-500 hover:border-3' onClick={()=>navigate('/home')}>{user ? "Logout":"Login/Register"}</button>
</div>
    </div>
  )
}

export default Navbar