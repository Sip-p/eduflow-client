import React, { useEffect, useState } from 'react'
import axios from 'axios'

const backendUrl = import.meta.env.VITE_BACKEND_URL

const InstructorCourses = () => {
  const [courses, setCourses] = useState([])
  const user = JSON.parse(localStorage.getItem("user"))
  const token = localStorage.getItem("token")

  const getAllCourses = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/course/instructor-courses`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.success) {
        setCourses(response.data.courses)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllCourses()
    // eslint-disable-next-line
  }, [])

  const viewCourse = (id) => {
    window.location.href = `/course/${id}`
  }

  return (
    <div className='min-h-screen bg-blue-900 text-white py-10 px-4'>
      <h1 className='text-3xl font-bold mb-8 text-center'>My Courses</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        {courses && courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course._id}
              className='bg-blue-200 text-black p-6 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition'
              onClick={() => viewCourse(course._id)}
            >
              <h2 className='text-xl font-bold mb-2'>{course.title}</h2>
<p className="text-sm text-gray-800 mb-4">
  {course.description.replace(/<[^>]+>/g, '')}
</p>
              <div className='flex justify-between items-center mb-2'>
                <span className='bg-blue-100 px-2 py-1 rounded text-xs'>{course.category}</span>
                <span className='font-semibold text-blue-700'>₹{course.price}</span>
              </div>
              <div className='text-xs text-gray-600'>
                Created: {new Date(course.createdAt).toDateString()}
              </div>
            </div>
          ))
        ) : (
          <h2 className='col-span-full text-center text-xl text-white'>No courses found</h2>
        )}
      </div>
    </div>
  )
}

export default InstructorCourses