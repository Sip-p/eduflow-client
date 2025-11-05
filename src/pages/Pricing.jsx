import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const Pricing = () => {
  const location = useLocation();
  const course = location?.state?.course; // ✅ Safe access to avoid crash
  const navigate = useNavigate();

  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-lg font-semibold">
        ⚠️ No course details found. Please go back.
      </div>
    );
  }

  const handleBuyNow = () => {
    if (course.price === 0) {
      navigate(`/course/${course._id}`);
    } else {
      navigate("/payment", { state: { course } }); // ✅ Correct navigation
    }
  };

  return (
    <div className="min-h-screen bg-green-100 py-10 px-4">
      <h1 className="font-bold text-green-900 text-4xl text-center mb-8 border-b-4 border-green-800 pb-4">
        {course.title} - {course.price === 0 ? "Free Access" : "Purchase Course"}
      </h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-10">
        <div className="bg-white border-2 border-green-400 rounded-xl shadow-lg w-full max-w-md p-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            {course.title}
          </h2>

          <p
            className="text-gray-600 mb-6 text-center"
            dangerouslySetInnerHTML={{ __html: course.description }}
          ></p>

          <ul className="mb-6 space-y-2 text-left w-full">
            {course.lessons?.map((lesson, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <FaCheckCircle className="text-green-400" /> {lesson.title}
              </li>
            ))}
          </ul>

          <div className="text-3xl font-bold text-green-700 mb-4">
            {course.price === 0 ? "Free" : `₹${course.price}`}
          </div>

          <button
            onClick={handleBuyNow}
            className={`${
              course.price === 0
                ? "bg-green-500 hover:bg-green-600"
                : "bg-yellow-500 hover:bg-yellow-600"
            } text-white font-semibold px-6 py-2 rounded-lg transition`}
          >
            {course.price === 0 ? "Start Learning" : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
