import React, { useState } from 'react'
import Calendar from '../Components/Calender'
import DashboardStu from '../Components/DashboardStu'
import StuCourses from '../Components/StuCourses'
import Settings from '../Components/Settings'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import Notification from '../Components/Notification'
const StudentDashBoard = () => {
  const [activePage, setActivePage] = useState("dashboard")
  const user = JSON.parse(localStorage.getItem("user"))

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      
      <div className='flex flex-1 overflow-hidden'>
        {/* Sidebar */}
        <div className='w-64 flex flex-col bg-blue-950'>
          <h1 className='bg-indigo-800 text-white p-4 text-xl font-bold'>EduFlow</h1>
          <ul className='flex flex-col px-4 flex-1'>
            <li
              className={`mx-2 my-3 text-white hover:bg-blue-800 p-2 rounded cursor-pointer transition-colors ${
                activePage === "dashboard" ? "bg-blue-800" : ""
              }`}
              onClick={() => setActivePage("dashboard")}
            >
              💨 Dashboard
            </li>
            <li
              className={`mx-2 my-3 text-white hover:bg-blue-800 p-2 rounded cursor-pointer transition-colors ${
                activePage === "My Courses" ? "bg-blue-800" : ""
              }`}
              onClick={() => setActivePage("My Courses")}
            >
              📚 My Courses
            </li>
            <li
              className={`mx-2 my-3 text-white hover:bg-blue-800 p-2 rounded cursor-pointer transition-colors ${
                activePage === "Notifications" ? "bg-blue-800" : ""
              }`}
              onClick={() => setActivePage("Notifications")}
            >
              🔔 Notifications
            </li>
            <li
              className={`mx-2 my-3 text-white hover:bg-blue-800 p-2 rounded cursor-pointer transition-colors ${
                activePage === "Settings" ? "bg-blue-800" : ""
              }`}
              onClick={() => setActivePage("Settings")}
            >
              ⚙️ Settings
            </li>
          </ul>
        </div>

        {/* Main Content Area */}
        <div className='flex-1 flex flex-col bg-gray-100 overflow-hidden'>
          {/* Top Bar */}
          <div className='flex justify-between p-4 bg-white shadow-sm'>
            <input
              className='bg-gray-100 h-10 rounded-lg w-3/4 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='🔍 Search courses...'
            />
            <button className='h-10 bg-green-600 hover:bg-green-700 px-6 ml-4 rounded-lg text-white font-medium transition-colors'>
              Notifications
            </button>
          </div>

          {/* Main Content with Scroll */}
          <div className='flex-1 overflow-y-auto p-4'>
            <div className='bg-white rounded-lg p-6 mb-4'>
              <h1 className='text-2xl font-bold text-gray-800'>Welcome, {user.name}!</h1>
              <h2 className='text-gray-500'>{new Date().toDateString()}</h2>
            </div>

            {/* Page Content */}
            <div>
              {(() => {
                switch (activePage) {
                  case "dashboard":
                    return <DashboardStu />
                  case "My Courses":
                    return <StuCourses />
                  case "Notifications":
                    return <Notification/>
                    
                  case "Settings":
                    return <Settings />
                  default:
                    return <DashboardStu />
                }
              })()}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className='w-80 bg-gray-100 p-4 flex flex-col overflow-y-auto'>
          {/* User Profile */}
          <div className='flex items-center mb-6 bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg shadow-md'>
            <img
              src={user.pic || "https://via.placeholder.com/40"}
              alt='profile'
              className='h-10 w-10 rounded-full border-2 border-white mr-3'
            />
            <div>
              <h1 className='text-white font-semibold'>{user.name}</h1>
              <p className='text-white text-xs opacity-90'>Student</p>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className='flex-1'>
            <h1 className='text-lg font-bold mb-4 text-blue-600'>Upcoming Events</h1>
            <div className='bg-white rounded-lg p-4 shadow-sm'>
              <Calendar />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default StudentDashBoard