import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const DashboardStu = () => {
  const [allCourses, setAllCourses] = useState([])
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("token")
  const backendurl = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()

  const getAllCourses = async () => {
    try {
      const response = await axios.get(`${backendurl}/api/course`)
      setAllCourses(response.data.courses || [])
    } catch (error) {
      console.error("Error fetching all courses:", error)
    }
  }

  const getEnrolledCourses = async () => {
    try {
      const response = await axios.get(`${backendurl}/api/course/mycourses`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setEnrolledCourses(response.data.mycourses || [])
    } catch (error) {
      console.error("Error fetching enrolled courses:", error)
    }
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([getAllCourses(), getEnrolledCourses()])
      .finally(() => setLoading(false))
  }, [])

  const completedCourses = enrolledCourses.filter(c => c.progressStatus === 'completed')
  const inProgressCourses = enrolledCourses.filter(c => c.progressStatus === 'in-progress')
  const exploreCourses = allCourses.filter(
    c => !enrolledCourses.some(ec => ec._id === c._id)
  )

  const handleCourseClick = (course) => {
    if (course.price === 0) {
      navigate(`/course/${course._id}`)
    } else {
      navigate('/pricing', { state: { course } })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-3xl font-bold mb-1">{enrolledCourses.length}</div>
          <p className="text-blue-100">Enrolled Courses</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-3xl font-bold mb-1">{completedCourses.length}</div>
          <p className="text-green-100">Completed</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-3xl font-bold mb-1">{inProgressCourses.length}</div>
          <p className="text-yellow-100">In Progress</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="text-3xl font-bold mb-1">{exploreCourses.length}</div>
          <p className="text-purple-100">Available</p>
        </div>
      </div>

      {/* Continue Learning */}
      {inProgressCourses.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Continue Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgressCourses.slice(0, 2).map(course => (
              <div
                key={course._id}
                onClick={() => navigate(`/course/${course._id}`)}
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <h3 className="font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {course.category}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">45% complete</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explore Courses */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Explore New Courses</h2>
        {exploreCourses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No new courses available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exploreCourses.slice(0, 3).map(course => (
              <div
                key={course._id}
                onClick={() => handleCourseClick(course)}
                className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded">
                    {course.category}
                  </span>
                  <span className="font-bold text-purple-600">₹{course.price}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {course.description?.replace(/<[^>]+>/g, "").slice(0, 60)}...
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardStu