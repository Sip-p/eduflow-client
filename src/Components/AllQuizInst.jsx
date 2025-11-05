import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Timer, CheckCircle2, Star } from "lucide-react"; // nice icons
import { useNavigate } from "react-router-dom";
const AllQuizInst = () => {
  const [quizzes, setQuizzes] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
const navigate=useNavigate()
  useEffect(() => {
    const getAllQuizzes = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/quiz/instructor-quizzes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuizzes(res.data.quizzes || []);
      } catch (error) {
        console.error("Failed to fetch quizzes", error);
      }
    };
    getAllQuizzes();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 250, damping: 20 },
    },
    exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
        📘 My Created Quizzes
      </h1>

      <motion.div  
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {quizzes && quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <motion.div  onClick={()=>navigate(`/quizstats/${quiz._id}`)}
                layout
                variants={itemVariants}
                exit="exit"
                whileHover={{ y: -5, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                key={quiz._id}
                className="bg-white border border-gray-100 cursor-pointer shadow-lg hover:shadow-xl rounded-2xl p-5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="text-blue-600" size={22} />
                  <h2 className="text-lg font-semibold text-gray-800">
                    {quiz.title?.replace(/<[^>]*>?/gm, "").trim()}
                  </h2>
                </div>

                <p className="text-gray-600 text-sm mb-3">
                  {quiz.description?.replace(/<[^>]*>?/gm, "").trim()}
                </p>

                <div className="space-y-1 text-sm text-gray-700">
                  <p className="flex items-center gap-2">
                    <Star size={16} className="text-yellow-500" />
                    Total Questions:{" "}
                    <span className="font-medium">{quiz.questions.length}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Timer size={16} className="text-blue-500" />
                    Duration: <span className="font-medium">{quiz.duration} mins</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-600" />
                    Passing Score:{" "}
                    <span className="font-medium">{quiz.passingScore}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className={quiz.isPublished ? "text-green-500" : "text-gray-400"}
                    />
                    Published:{" "}
                    <span
                      className={`font-semibold ${
                        quiz.isPublished ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {quiz.isPublished ? "Yes" : "No"}
                    </span>
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-600 text-center col-span-full text-lg mt-12"
            >
              You haven’t created any quizzes yet.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      
    </div>
  );
};

export default AllQuizInst;
