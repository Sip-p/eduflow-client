// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const StuCourses = () => {
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const [mycourses, setMycourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//    const token = localStorage.getItem("token");
//   const navigate = useNavigate();

//  const handleCourseStatus = async (courseId, status) => {
//   try {
//     const response = await axios.put(
//       `${backendUrl}/api/course/stsupdate`,
//       { courseId, status }, // send both courseId and status
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     console.log(response.data);
//     if(response.data){
//      }
//     // Optionally refresh courses or show a message
//   } catch (error) {
//     console.log(error);
//   }
// };

//   const getMyCourses = async () => {
//     if (!token) {
//       setError("No token found, please login");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.get(`${backendUrl}/api/course/mycourses`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       console.log("my",response.data.mycourses)
//       setMycourses(response.data.mycourses || []);
//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getMyCourses();
//    }, []);

//   if (loading) return <p>Loading courses...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className='p-4'>
//       <h1 className='text-2xl font-bold mb-4'>My Courses</h1>
//       {mycourses.length === 0 ? (
//         <p>You have not enrolled in any courses yet.</p>
//       ) : (
//         <div className='grid gap-4 grid-cols-3'>
//           {mycourses.map((course, idx) => (
//             <div key={course._id || idx}>
//               <div className='bg-blue-900 p-4 rounded text-white border-4 border-sky-300 hover:scale-105 transition-transform duration-300 cursor-pointer'>
//                 <div className='text-2xl font-bold text-white'>
//                   {course.title}
//                 </div>
//                <div className='rounded-lg text-gray-200 text-sm'>
//   {course.description 
//     ? course.description.replace(/<[^>]+>/g, "").slice(0, 30) + "..." 
//     : "No description available"}
// </div>

//                 <div className='bg-gray-400 rounded-lg pl-3 my-2 w-auto text-white'>
//                   {course.category}
//                 </div>
//               </div>
//              {/* <button
//   className={`p-2 mt-1 rounded-md 
//     ${copmleted ? "bg-green-500 text-white" : "bg-gray-300 text-black"}`}
//   onClick={() => handleCourseStatus(course._id, "completed")}
// >
//   {copmleted ? "Completed" : "Mark as Completed"}
// </button> */}

// <button>Completed</button>

//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default StuCourses;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StuCourses = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [mycourses, setMycourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleCourseStatus = async (courseId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'in-progress' : 'completed';
      
      const response = await axios.put(
        `${backendUrl}/api/course/stsupdate`,
        { courseId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        // Update local state
        setMycourses(prevCourses => 
          prevCourses.map(course => 
            course._id === courseId 
              ? { ...course, progressStatus: newStatus }
              : course
          )
        );
      }
    } catch (error) {
      console.error('Error updating course status:', error);
      alert('Failed to update course status');
    }
  };

  const getMyCourses = async () => {
    if (!token) {
      setError("No token found, please login");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${backendUrl}/api/course/mycourses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Courses:", response.data.mycourses);
      setMycourses(response.data.mycourses || []);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyCourses();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading courses...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>My Courses</h1>
      {mycourses.length === 0 ? (
        <p>You have not enrolled in any courses yet.</p>
      ) : (
        <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {mycourses.map((course) => {
            const isCompleted = course.progressStatus === 'completed';
            const isInProgress = course.progressStatus === 'in-progress';
            
            return (
              <div key={course._id} className="flex flex-col">
                <div 
                  className='bg-blue-900 p-4 rounded text-white border-4 border-sky-300 hover:scale-105 transition-transform duration-300 cursor-pointer'
                  onClick={() => navigate(`/course/${course._id}`)}
                >
                  <div className='text-2xl font-bold text-white'>
                    {course.title}
                  </div>
                  <div className='rounded-lg text-gray-200 text-sm my-2'>
                    {course.description 
                      ? course.description.replace(/<[^>]+>/g, "").slice(0, 50) + "..." 
                      : "No description available"}
                  </div>
                  <div className='bg-gray-400 rounded-lg pl-3 my-2 w-fit px-3 py-1 text-white text-sm'>
                    {course.category}
                  </div>
                  
                  {/* Progress Badge */}
                  <div className="mt-2">
                    {isCompleted && (
                      <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                        ✓ Completed
                      </span>
                    )}
                    {isInProgress && (
                      <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full">
                        In Progress
                      </span>
                    )}
                    {!isCompleted && !isInProgress && (
                      <span className="bg-gray-500 text-white text-xs px-3 py-1 rounded-full">
                        Not Started
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Status Button */}
                <button
                  className={`p-2 mt-2 rounded-md font-semibold transition-colors ${
                    isCompleted 
                      ? "bg-green-500 hover:bg-green-600 text-white" 
                      : "bg-gray-300 hover:bg-gray-400 text-black"
                  }`}
                  onClick={() => handleCourseStatus(course._id, course.progressStatus)}
                >
                  {isCompleted ? "✓ Completed" : "Mark as Completed"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StuCourses;