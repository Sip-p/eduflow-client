import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaClock, FaClipboardList, FaAward, FaCheckCircle } from "react-icons/fa";
import { Navigate, useNavigate } from "react-router-dom";
const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [newQuizzes, setNewQuizzes] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
const navigate=useNavigate()
  const getAllQuizzes = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/quiz/allquizzes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data.notattemptedQuizzes);
      setQuizzes(res.data.notattemptedQuizzes);
      console.log(res.data.attemptedQuizzes)
      setNewQuizzes(res.data.attemptedQuizzes);
    } catch (error) {
      console.log("Error fetching quizzes:", error);
    }
  };

  useEffect(() => {
    getAllQuizzes();
  }, []);

 return (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-6">
    <h1 className="text-4xl font-extrabold text-center text-green-800 mb-10 drop-shadow-sm">
      📚 Available Quizzes
    </h1>

    {quizzes.length > 0 || newQuizzes.length > 0 ? (
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[...quizzes.map(q => ({ ...q, attempted: false })), 
          ...newQuizzes.map(a => ({
            ...a.quizId, // Use the populated quiz object if your backend populates it
            attempted: true
          }))
        ].map((quiz) => (
          <div
            key={quiz._id}
            className={`rounded-2xl p-6 shadow-lg transition-all duration-300 border 
              ${quiz.attempted 
                ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-80" 
                : "bg-white border-green-200 hover:shadow-2xl hover:scale-[1.02]"
              }`}
          >
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              {quiz.title.replace(/<[^>]*>?/gm, "").trim()}
            </h2>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {quiz.description}
            </p>

            <div className="space-y-2 text-gray-700 text-sm">
              <p className="flex items-center gap-2">
                <FaClipboardList className="text-green-500" /> 
                <span>Course: {quiz.course?.title || "N/A"}</span>
              </p>
              <p className="flex items-center gap-2">
                <FaClock className="text-green-500" /> 
                <span>Duration: {quiz.duration} minutes</span>
              </p>
              <p className="flex items-center gap-2">
                <FaAward className="text-yellow-500" /> 
                <span>Total Points: {quiz.totalPoints}</span>
              </p>
              <p className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" /> 
                <span>
                  Passing Score: {quiz.passingScore} | Published:{" "}
                  {quiz.isPublished ? "✅" : "❌"}
                </span>
              </p>
            </div>

            <div className="border-t border-gray-200 mt-4 pt-3 text-gray-600 text-xs">
              <p>📅 Start: {new Date(quiz.startDate).toLocaleDateString()}</p>
              <p>⏳ End: {new Date(quiz.endDate).toLocaleDateString()}</p>
              <p>🔀 Shuffle: {quiz.shuffleOptions ? "Yes" : "No"}</p>
              <p>📝 Questions: {quiz.questions?.length || 0}</p>
            </div>

            <div className="mt-5 text-center">
              {quiz.attempted ? (
                <button
                  className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-full cursor-not-allowed"
                  disabled
                >
                  Attempted
                </button>
              ) : (
                <button
                  className="bg-green-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-green-700 transition"
                  onClick={() => navigate("/attemptquiz", { state: { quiz } })}
                >
                  View Quiz
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center mt-20 text-lg text-gray-600">
        No quizzes available. Please create one.
      </p>
    )}
  </div>
);

};

export default Quizzes;
