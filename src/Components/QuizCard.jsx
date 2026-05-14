import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
export const QuizCard = ({ quiz, type }) => {
    const navigate = useNavigate();

    return (

        <div className="bg-white shadow-md rounded-xl p-5 hover:shadow-xl transition min-h-[150px] flex flex-col justify-between">

            {/* 🟢 QUIZ INFO */}
            <div>

                <h2 className="text-lg font-bold text-gray-800 mb-2">
                    {quiz.title || "Untitled Quiz"}
                </h2>

                <p className="text-sm text-gray-600 mb-3">
                    {quiz.description || "No description available"}
                </p>
            </div>

            {/* 🟢 BUTTON */}
            <div>
                {type === "new" ? (
                    <button
                        onClick={() => navigate("/attemptquiz", { state: { quiz } })}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        Attempt Quiz
                    </button>
                ) : (
                    <p className="text-sm text-gray-600 font-bold bg-green-600  text-white px-4 py-2 rounded">Your Score: {quiz.score}</p>
                )}
            </div>

        </div>

    );
};