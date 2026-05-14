// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "../store/useAuthStore";
// import { useEnrollmentStore } from "../store/useEnrollmentStore";

// const StuCourses = () => {
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const { token } = useAuthStore();
//   const navigate = useNavigate();

//   // ✅ Zustand inside component
//   const {
//     enrolledCourses,
//     loading,
//     error,
//     fetchEnrolled,
//     updateCourseStatus,
//   } = useEnrollmentStore();

//   // ✅ Fetch courses
//   useEffect(() => {
//     if (token) {
//       fetchEnrolled(token, backendUrl);
//     }
//   }, [token]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh]">
//         <p className="text-gray-500">Loading your courses…</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh]">
//         <p className="text-red-400">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white p-10">

//       <h1 className="text-3xl font-bold mb-6">My Courses</h1>

//       {enrolledCourses.length === 0 ? (
//         <p>No courses enrolled</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//           {enrolledCourses.map((course) => {
//             const isCompleted = course.progressStatus === "completed";
//             const isInProgress = course.progressStatus === "in-progress";

//             return (
//               <div
//                 key={course._id}
//                 className="bg-gray-900 p-4 rounded-lg cursor-pointer"
//                 onClick={() => navigate(`/course/${course._id}`)}
//               >
//                 <h2 className="text-lg font-semibold">{course.title}</h2>

//                 <p className="text-sm text-gray-400 mb-2">
//                   {course.description
//                     ?.replace(/<[^>]+>/g, "")
//                     .slice(0, 80)}
//                 </p>

//                 {/* Progress */}
//                 <div className="mb-2 text-sm">
//                   Status:{" "}
//                   {isCompleted
//                     ? "Completed"
//                     : isInProgress
//                       ? "In Progress"
//                       : "Not Started"}
//                 </div>

//                 {/* Button */}
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation(); // prevent navigation
//                     updateCourseStatus(
//                       course._id,
//                       course.progressStatus,
//                       token,
//                       backendUrl
//                     );
//                   }}
//                   className="mt-2 px-3 py-1 bg-green-600 rounded"
//                 >
//                   {isCompleted ? "✓ Completed" : "Mark as Completed"}
//                 </button>
//               </div>
//             );
//           })}

//         </div>
//       )}
//     </div>
//   );
// };

// export default StuCourses;

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useEnrollmentStore } from "../store/useEnrollmentStore";

const StuCourses = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const {
    enrolledCourses,
    loading,
    error,
    fetchEnrolled,
    updateCourseStatus,
  } = useEnrollmentStore();

  // ✅ Fetch courses (store handles API internally)
  useEffect(() => {
    if (token) {
      fetchEnrolled();
    }
  }, [token]);

  // ✅ Loading UI
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500">Loading your courses…</p>
      </div>
    );
  }

  // ✅ Error UI
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      {enrolledCourses.length === 0 ? (
        <p>No courses enrolled</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => {
            const isCompleted = course.progressStatus === "completed";
            const isInProgress = course.progressStatus === "in-progress";

            return (
              <div
                key={course._id}
                className="bg-gray-900 p-4 rounded-lg cursor-pointer hover:scale-105 transition"
                onClick={() => navigate(`/course/${course._id}`)}
              >
                <h2 className="text-lg font-semibold">{course.title}</h2>

                <p className="text-sm text-gray-400 mb-2">
                  {course.description
                    ?.replace(/<[^>]+>/g, "")
                    .slice(0, 80)}
                </p>

                {/* Progress */}
                <div className="mb-2 text-sm">
                  Status:{" "}
                  <span
                    className={
                      isCompleted
                        ? "text-green-400"
                        : isInProgress
                          ? "text-yellow-400"
                          : "text-gray-400"
                    }
                  >
                    {isCompleted
                      ? "Completed"
                      : isInProgress
                        ? "In Progress"
                        : "Not Started"}
                  </span>
                </div>

                {/* Button */}
                <button
                  onClick={async (e) => {
                    e.stopPropagation();

                    if (isCompleted) return;

                    await updateCourseStatus(course._id);
                  }}
                  disabled={isCompleted}
                  className={`mt-2 px-3 py-1 rounded ${isCompleted
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                    }`}
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