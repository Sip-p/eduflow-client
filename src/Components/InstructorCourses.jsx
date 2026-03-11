import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuthStore } from '../store/useAuthStore'
const backendUrl = import.meta.env.VITE_BACKEND_URL

const InstructorCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
const { user, token, isAuthenticated } = useAuthStore();
  const getAllCourses = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.get(
        `${backendUrl}/api/course/instructor/courses`, // ✅ fixed — was /instructor-courses
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        setCourses(response.data.courses)
      }
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message)
      setError(err.response?.data?.message || "Failed to load courses")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllCourses()
  }, [])

  const viewCourse = (id) => {
    window.location.href = `/course/${id}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading your courses...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-900 flex flex-col items-center justify-center gap-4">
        <p className="text-red-300 text-lg">{error}</p>
        <button
          onClick={getAllCourses}
          className="px-4 py-2 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-100"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-900 text-white py-10 px-4">
      <h1 className="text-3xl font-bold mb-2 text-center">My Courses</h1>
      <p className="text-center text-blue-300 mb-8">
        {courses.length} course{courses.length !== 1 ? "s" : ""} created
      </p>

      {courses.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-2xl mb-4">📚</p>
          <p className="text-xl text-blue-200">No courses yet</p>
          <p className="text-blue-400 mt-2">Create your first course to see it here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {courses.map((course) => (
            <div
              key={course._id}
              onClick={() => viewCourse(course._id)}
              className="bg-white text-black p-5 rounded-xl shadow-lg cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-200"
            >
              {/* Thumbnail */}
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-36 object-cover rounded-lg mb-3"
                />
              )}

              {/* Title */}
              <h2 className="text-lg font-bold mb-1 line-clamp-2">{course.title}</h2>

              {/* Description — strip HTML tags */}
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                {course.description.replace(/<[^>]+>/g, '')}
              </p>

              {/* Category + Price */}
              <div className="flex justify-between items-center mb-3">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium capitalize">
                  {course.category}
                </span>
                <span className="font-bold text-blue-700 text-sm">
                  {course.price === 0 ? "Free" : `₹${course.price}`}
                </span>
              </div>

              {/* Stats row */}
              <div className="flex justify-between text-xs text-gray-500 border-t pt-2">
                <span>📚 {course.totalChapters || 0} chapters</span>
                <span>🎬 {course.totalLessons || 0} lessons</span>
                <span className={`font-semibold ${course.published ? "text-green-600" : "text-amber-500"}`}>
                  {course.published ? "● Published" : "○ Draft"}
                </span>
              </div>

              <div className="text-xs text-gray-400 mt-2">
                {new Date(course.createdAt).toDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default InstructorCourses