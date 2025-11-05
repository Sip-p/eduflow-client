import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const AttemptQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quiz } = location.state;

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(Array(quiz.questions.length).fill(""));
  const [isStarted, setIsStarted] = useState(false);

  // Set initial timer safely
  const [timer, setTimer] = useState(() => {
    const duration = Number(quiz.duration);
    return duration > 0 ? duration : 60; // default to 60 seconds if invalid
  });

  // Handle countdown
  useEffect(() => {
    if (!isStarted) return; // run only when quiz started
    if (timer <= 0) return;

    const id = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isStarted, timer]);

  // Auto submit when timer reaches 0
  useEffect(() => {
    if (isStarted && timer === 0) {
      alert("⏱ Time's up! Submitting your quiz...");
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, isStarted]);

  // Handle option change
  const handleOptionChange = (idx, value) => {
    const updated = [...answers];
    updated[idx] = value;
    setAnswers(updated);
  };

  // Navigation between questions
  const handleNext = () => {
    if (currentQ < quiz.questions.length - 1) setCurrentQ((c) => c + 1);
  };

  const handlePrev = () => {
    if (currentQ > 0) setCurrentQ((c) => c - 1);
  };

  // Submit quiz
  const handleSubmit = async () => {
    try {
      setIsStarted(false); // stop timer
      const token = localStorage.getItem("token");
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const res = await axios.post(
        `${backendUrl}/api/quiz/submit`,
        {
          quizId: quiz._id,
          answers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`✅ Quiz submitted successfully! Your score: ${res.data.score}`);

      navigate("/quiz/result", {
        state: {
          quizId: quiz._id,
          score: res.data.score,
        },
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("❌ Failed to submit quiz. Please try again.");
    }
  };

  // Helper: format seconds → mm:ss
  const formatTime = (s) => {
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const q = quiz.questions[currentQ];

  return (
    <>
      {isStarted ? (
        <div className="relative min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-10 px-6">
          {/* Timer Display */}
          <div className="absolute top-4 right-4 bg-green-500 text-black text-lg font-bold px-3 py-1 rounded">
            ⏱ {formatTime(timer)}
          </div>

          <h1 className="text-3xl font-bold text-center mb-8 text-green-800">
            Attempt Quiz: {quiz.title.replace(/<[^>]*>?/gm, "").trim()}
          </h1>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Question {currentQ + 1} of {quiz.questions.length}
            </h2>

            <div
              className="text-gray-700 mb-4"
              dangerouslySetInnerHTML={{ __html: q.question }}
            ></div>

            <div className="space-y-3 grid grid-cols-2 max-md:grid-cols-1">
              {q.options.map((option, optionIdx) => (
                <label
                  key={optionIdx}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`question-${currentQ}`}
                    value={option}
                    checked={answers[currentQ] === option}
                    onChange={() => handleOptionChange(currentQ, option)}
                    className="mr-3"
                  />
                  <span
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ __html: option }}
                  ></span>
                </label>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              {currentQ > 0 && (
                <button
                  onClick={handlePrev}
                  className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-700 transition"
                >
                  Previous
                </button>
              )}

              {currentQ === quiz.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-green-700 transition"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-700 transition"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Start Screen
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
            <h1 className="text-3xl font-bold text-green-800 mb-6">
              Ready to Start?
            </h1>
            <p className="text-gray-700 mb-8">
              You are about to start the quiz:{" "}
              <strong>
                {quiz.title.replace(/<[^>]*>?/gm, "").trim()}
              </strong>
            </p>
            <button
              onClick={() => {
                const duration = Number(quiz.duration);
                setTimer(duration > 0 ? duration : 60); // reset timer safely
                setIsStarted(true);
              }}
              className="bg-green-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-green-700 transition"
            >
              Start Quiz
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AttemptQuiz;
