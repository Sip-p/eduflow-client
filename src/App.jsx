import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignUp from './authPage/SignUp.jsx'
import Home from './Home.jsx'
import ResetPassword from './authPage/ResetPassword.jsx'
import ResetrequestPage from './authPage/ResetrequestPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import StudentDashBoard from './pages/StudentDashBoard.jsx'
import StuCourses from './Components/StuCourses.jsx'
import InstructorDashBoard from './pages/InstructorDashBoard.jsx'
import VideoCourse from './Components/VideoCourse.jsx'
import Courses from './pages/Courses.jsx'
import About from './pages/About.jsx'
import Pricing from './pages/Pricing.jsx'
import ProtectedRoute  from './Components/ProtectedRoute.js'
import Payment from './Components/Payment.jsx'
import Review from './Components/Review.jsx'
 
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/home' element={<Home />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path='/reset-request' element={<ResetrequestPage />} />
          <Route path='/payment' element={<Payment/>}/>
          {/* Protected routes */}
          <Route path='/student-dashboard' element={
            <ProtectedRoute>
              <StudentDashBoard />
            </ProtectedRoute>
          } />
          <Route path='/instructor-dashboard' element={
            <ProtectedRoute>
              <InstructorDashBoard />
            </ProtectedRoute>
          } />
          <Route path='/student-courses' element={
            <ProtectedRoute>
              <StuCourses />

            </ProtectedRoute>
          } />
          <Route path='/course/:id' element={
            <ProtectedRoute>
              <VideoCourse />
            </ProtectedRoute>
          } />
          {/* Public routes */}
          <Route path='/courses' element={
<ProtectedRoute>
  <Courses/>
</ProtectedRoute>
          }/>
           <Route path='/about' element={<About />} />
          <Route path='/pricing' element={<Pricing />} />
          <Route path='/review' element={<Review/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App