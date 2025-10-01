import React, { useState } from 'react'
import Calendar from '../Components/Calender'
import DashboardStu from '../Components/DashboardStu'
import StuCourses from '../Components/StuCourses'
import Settings from '../Components/Settings'
import Navbar from '../Components/Navbar'
import CourseCreation from '../Components/CourseCreation'
import DashboardInst from '../Components/DashboardInst'
import InstructorCourses from '../Components/InstructorCourses'
import Footer from '../Components/Footer'
const InstructorDashBoard = () => {
    const [activePage,setActivePage]=useState("dashboard")
    const user=JSON.parse(localStorage.getItem("user"))
 
 

 


    // {console.log(user)}
  return (
    <div className='min-h-screen flex flex-col'>
    <div> 
       <Navbar/>
    <div className='  flex  '> 
    
      {/* Sidebar */}
      <div className='  w-1/4 flex flex-col'>
        <h1 className='bg-indigo-800 text-white p-4 text-xl font-bold'>EduFlow</h1>
        <ul className='bg-blue-950 flex flex-col px-4 flex-1'>
          <li
            className={`mx-2 my-3 text-white hover:bg-blue-800 p-2 rounded cursor-pointer ${activePage === "dashboard" ? "bg-blue-800" : ""}`}
            onClick={() => setActivePage("dashboard")}
          >
            💨Dashboard
          </li>
          <li className={`mx-2 my-3 text-white hover:bg-blue-800 p-2 rounded cursor-pointer ${activePage === "My Courses" ? "bg-blue-800" : ""}`}
            onClick={() => setActivePage("My Courses")}>📚My Courses</li>
          <li className={`mx-2 my-3 text-white hover:bg-blue-800 p-2 rounded cursor-pointer ${activePage === "Create Courses" ? "bg-blue-800" : ""}`}
            onClick={() => setActivePage("Create Courses")}>📽️Create Course</li>
          <li className={`mx-2 my-3 text-white hover:bg-blue-800 p-2 rounded cursor-pointer ${activePage === "Settings" ? "bg-blue-800" : ""}`}
            onClick={() => setActivePage("Settings")}>⚙️Settings</li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className='w-2/4 bg-gray-100 flex flex-col'> 
        {/* Top Bar */}
        <div className='flex justify-between p-4'>
          <input className='bg-gray-600 h-10 rounded-md w-3/4 flex items-center px-3 text-white' placeholder='🔍Search'/>
          
          
          <div className='h-10 bg-green-600 w-1/4 ml-4 p-2 px-3 rounded text-white flex items-center'>
            Notification
          </div>
        </div>
        
        {/* Main Content */}
        <div className='flex-1 p-4 bg-white m-4 rounded-lg'>
<h1 className='text-2xl font-bold '>Welcome, {user.name}</h1>
<h2 className='text-gray-400'>{new Date().toDateString()}</h2>
{
  (() => {
    switch (activePage) {
      case "dashboard":
        return <DashboardInst />;
      case "My Courses":
        return   <InstructorCourses/>;
      case "Create Courses":
        return   <CourseCreation/>;
      case "Settings":
        return  <Settings/>;
      default:
        return <DashboardInst />;
    }
  })()
}
        </div>
      </div>

      {/* Right Panel */}
      <div className='w-1/4  bg-gray-100 p-4 flex flex-col'>
        {/* User Profile */}
        <div className='flex items-center mb-6 bg-blue-400 p-2'>
          <img src={user.pic} alt='profile' className='h-8 w-8 rounded-full bg-black mr-3'/>
          <h1 className='text-white font-semibold'> {user.name}</h1>
           
        </div> 
        
        {/* Upcoming Events */}
        <div className='flex-1'>
          <h1 className='  font-bold mb-4 text-blue-400'>Upcoming Events</h1>
          <div className='bg-white rounded-lg p-2'>
            <Calendar/>
          </div>
        </div>
      </div>
      </div>
     
    </div>
      <div className='  w-full'>
      <Footer/>
      </div>
        </div>
  )
}

export default InstructorDashBoard