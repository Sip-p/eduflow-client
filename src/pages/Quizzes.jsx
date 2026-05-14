import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { QuizCard } from "../Components/QuizCard";
import Navbar from "../Components/Navbar.jsx";

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [activeTab, setActiveTab] = useState("new");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { token } = useAuthStore();

  const getQuizzes = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/quiz/allquizzes?page=${page}&limit=6&type=${activeTab}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setQuizzes(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setHasNextPage(res.data.hasNextPage);
      setHasPrevPage(res.data.hasPrevPage);
    } catch (error) {
      console.log("Error fetching quizzes:", error);
    }
  };

  useEffect(() => {
    if (token) getQuizzes();
  }, [token, page, activeTab]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-6">

        {/* TITLE */}
        <h1 className="text-4xl font-extrabold text-center text-green-800 mb-8">
          📚 Available Quizzes
        </h1>

        {/* 🔘 TOGGLE BUTTONS */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => {
              setActiveTab("new");
              setPage(1);
            }}
            className={`px-6 py-2 rounded-lg font-semibold transition ${activeTab === "new"
                ? "bg-green-600 text-white"
                : "bg-white text-green-700 border"
              }`}
          >
            New Quizzes
          </button>

          <button
            onClick={() => {
              setActiveTab("attempted");
              setPage(1);
            }}
            className={`px-6 py-2 rounded-lg font-semibold transition ${activeTab === "attempted"
                ? "bg-green-600 text-white"
                : "bg-white text-green-700 border"
              }`}
          >
            Attempted
          </button>
        </div>

        {/* 📦 QUIZ GRID */}
        {quizzes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {quizzes.map((quiz) => (
                <QuizCard
                  key={quiz._id}
                  quiz={quiz}
                  type={activeTab === "new" ? "new" : "attempted"}
                />
              ))}

            </div>

            {/* 🔥 PAGINATION */}
            <div className="flex justify-center items-center gap-4 mt-10">

              <button
                disabled={!hasPrevPage}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span className="font-semibold">
                Page {page} / {totalPages}
              </span>

              <button
                disabled={!hasNextPage}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>

            </div>
          </>
        ) : (
          <p className="text-center mt-6">
            No quizzes available.
          </p>
        )}

      </div>
    </>
  );
};

export default Quizzes;