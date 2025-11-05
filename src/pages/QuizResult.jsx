import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const QuizResult = () => {
  const location = useLocation();
  const { quizId, score } = location.state;
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      const token = localStorage.getItem("token");
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.get(`${backendUrl}/api/quiz/result/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResult(res.data);
    };
    fetchResult();
  }, [quizId]);

  if (!result) return <p>Loading result...</p>;

  const { attempt, rank, totalStudents } = result;

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-[90%] md:w-[600px]">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Quiz Result
        </h1>
        <p className="text-xl mb-2">Score: <b>{score}</b></p>
        <p className="text-lg mb-2">Rank: <b>{rank}</b> / {totalStudents}</p>
        <p className="text-gray-600">
          Attempted on: {new Date(attempt.attemptedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default QuizResult;
