import React, { useEffect, useState } from "react";
import axios from "axios";

const Quizstats = () => {
  const [attempts, setAttempts] = useState([]);
  const token = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const quizId = window.location.pathname.split("/")[2];

  const getQuizResult = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/quiz/quizstats?quizId=${quizId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Sort by score (highest first)
      const sortedAttempts = response.data.attempts.sort((a,b)=>b.score-a.score)
      console.log("Quiz attempts data:", sortedAttempts);
      setAttempts(sortedAttempts);
    } catch (error) {
      console.log("Error fetching quiz stats:", error.message);
    }
  };

  useEffect(() => {
    getQuizResult();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">
        Quiz Leaderboard 🏆
      </h1>

      {attempts.length > 0 ? (
        <div className="w-full max-w-4xl bg-white shadow-md rounded-2xl overflow-hidden">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-indigo-500 text-white">
                <th className="px-6 py-3 text-left">Rank</th>
                <th className="px-6 py-3 text-left">Student Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Score</th>
                <th className="px-6 py-3 text-left">Attempted At</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt, index) => (
                <tr
                  key={attempt._id}
                  className={`border-b hover:bg-gray-50 ${
                    index === 0 ? "bg-yellow-100" : ""
                  }`}
                >
                  <td className="px-6 py-3 font-semibold text-gray-700">
                    #{index + 1}
                  </td>
                  <td className="px-6 py-3 text-gray-800">
                    {attempt.studentId?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    {attempt.studentId?.email}
                  </td>
                  <td className="px-6 py-3 font-bold text-indigo-600">
                    {attempt.score}
                  </td>
                  <td className="px-6 py-3 text-gray-500">
                    {new Date(attempt.attemptedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 mt-10 text-lg">
          No one has attempted this quiz yet 😅
        </p>
      )}
    </div>
  );
};

export default Quizstats;
