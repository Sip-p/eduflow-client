import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home               from './Home.jsx'
import LandingPage        from './pages/LandingPage.jsx'
import About              from './pages/About.jsx'
import Pricing            from './pages/Pricing.jsx'
import Courses            from './pages/Courses.jsx'
import ResetPassword      from './authPage/ResetPassword.jsx'
import ResetrequestPage   from './authPage/ResetrequestPage.jsx'
import VerifyEmail        from './authPage/VerifyEmail.jsx'
import StudentDashBoard   from './pages/StudentDashBoard.jsx'
import InstructorDashBoard from './pages/InstructorDashBoard.jsx'
import StuCourses         from './Components/StuCourses.jsx'
import VideoCourse        from './Components/VideoCourse.jsx'
import Payment            from './Components/Payment.jsx'
import Review             from './Components/Review.jsx'
import Login from './authPage/Login.jsx'
import Quizzes            from './pages/Quizzes.jsx'
import AttemptQuiz        from './pages/AttemptQuiz.jsx'
import QuizResult         from './pages/QuizResult.jsx'
import Quizstats          from './pages/Quizstats.jsx'
import OpenAssignmentpdf  from './pages/OpenAssignmentpdf.jsx'

import ProtectedRoute     from './Components/ProtectedRoute.jsx'
// import Lecture from './Components/lecture.jsx'
// ✅ No Redux Provider — Zustand needs nothing here

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public ───────────────────────────────────────────── */}
        <Route path="/"                        element={<LandingPage />} />
        <Route path="/home"                    element={<Home />} />
        <Route path="/login"                   element={<Home />} />
        <Route path="/about"                   element={<About />} />
        <Route path="/reset-password/:token"   element={<ResetPassword />} />
        <Route path="/reset-request"           element={<ResetrequestPage />} />
        <Route path="/review"                  element={<Review />} />
<Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* ── Student protected ─────────────────────────────────── */}
        <Route path="/student-dashboard" element={
          <ProtectedRoute role="student">
            <StudentDashBoard />
          </ProtectedRoute>
        } />

        <Route path="/student-courses" element={
          <ProtectedRoute role="student">
            <StuCourses />
          </ProtectedRoute>
        } />

        <Route path="/course/:id" element={
          <ProtectedRoute>
            <VideoCourse />
            {/* <Lecture/> */}
          </ProtectedRoute>
        } />

        <Route path="/courses" element={
          <ProtectedRoute>
            <Courses />
          </ProtectedRoute>
        } />

        <Route path="/courses/:id/pricing"     element={<Pricing />} />
        <Route path="/payment"                 element={<Payment />} />

        {/* ── Instructor protected ──────────────────────────────── */}
        <Route path="/instructor-dashboard" element={
          <ProtectedRoute role="teacher">
            <InstructorDashBoard />
          </ProtectedRoute>
        } />

        {/* ── Quiz (any logged-in user) ─────────────────────────── */}
        <Route path="/quiz" element={
          <ProtectedRoute>
            <Quizzes />
          </ProtectedRoute>
        } />

        <Route path="/attemptquiz" element={
          <ProtectedRoute>
            <AttemptQuiz />
          </ProtectedRoute>
        } />

        <Route path="/quiz/result"             element={<QuizResult />} />
        <Route path="/quizstats/:id"           element={<Quizstats />} />
        <Route path="/assignment/byId"         element={<OpenAssignmentpdf />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;