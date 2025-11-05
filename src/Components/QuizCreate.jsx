import React, { useState } from 'react';
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from 'axios';

const QuizCreate = () => {
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctAns: ""
    }
  ]);

  const [formKey, setFormKey] = useState(0); // 👈 used to reset ReactQuill

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const [metaData, setMetaData] = useState({
    title: "",
    description: "",
    course: "",
    duration: "",
    totalPoints: "",
    passingScore: "",
    isPublished: "No",
    startDate: "",
    endDate: "",
    maxAttempts: "",
    allowReview: "Yes",
    showCorrectAnswers: "No",
    shuffleQuestions: "Yes",
    shuffleOptions: "Yes",
    gradingType: "automatic"
  });

  // 🟢 Add new question
  const addMoreQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAns: "" }
    ]);
  };

  // 🟢 Submit quiz
  const handleSubmit = async () => {
    try {
      const formattedMetaData = {
        ...metaData,
        allowReview: metaData.allowReview === "Yes",
        showCorrectAnswers: metaData.showCorrectAnswers === "Yes",
        shuffleQuestions: metaData.shuffleQuestions === "Yes",
        shuffleOptions: metaData.shuffleOptions === "Yes",
        isPublished: metaData.isPublished === "Yes",
      };

      const res = await axios.post(
        `${backendUrl}/api/quiz/create`,
        { questionsData: questions, metaData: formattedMetaData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res) {
        console.log("Quiz created successfully");

        // Reset all fields
        setMetaData({
          title: "",
          description: "",
          course: "",
          duration: "",
          totalPoints: "",
          passingScore: "",
          isPublished: "No",
          startDate: "",
          endDate: "",
          maxAttempts: "",
          allowReview: "Yes",
          showCorrectAnswers: "No",
          shuffleQuestions: "Yes",
          shuffleOptions: "Yes",
          gradingType: "automatic"
        });

        setQuestions([
          {
            question: "",
            options: ["", "", "", ""],
            correctAns: ""
          }
        ]);

        setFormKey(prev => prev + 1); // 👈 forces all ReactQuill editors to clear
      } else {
        console.log("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-sky-100 min-h-screen w-full p-6">
      {/* Quiz Title */}
      <h2 className="font-bold mb-2 text-lg">Quiz Title</h2>
      <ReactQuill
        key={formKey + "-title"}
        theme="snow"
        value={metaData.title}
        onChange={(value) => setMetaData({ ...metaData, title: value })}
        placeholder="Enter your quiz title"
        className="bg-white text-black mb-4"
      />

      {/* Quiz Description */}
      <h2 className="font-bold mb-2 text-lg">Quiz Description</h2>
      <ReactQuill
        key={formKey + "-description"}
        theme="snow"
        value={metaData.description}
        onChange={(value) => setMetaData({ ...metaData, description: value })}
        placeholder="Enter your quiz description"
        className="bg-white text-black mb-4"
      />

      {/* Course */}
      <h2 className="font-bold mb-2 text-lg">Course</h2>
      <ReactQuill
        key={formKey + "-course"}
        theme="snow"
        value={metaData.course}
        onChange={(value) => setMetaData({ ...metaData, course: value })}
        placeholder="Enter the course for this quiz"
        className="bg-white text-black mb-4"
      />

      {/* 🟡 Questions */}
      {questions.map((q, qidx) => (
        <div key={qidx} className="mb-6 bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold mb-2 text-lg">Question {qidx + 1}</h2>
          <ReactQuill
            key={formKey + "-question-" + qidx}
            theme="snow"
            value={q.question}
            onChange={(value) => {
              const updated = [...questions];
              updated[qidx].question = value;
              setQuestions(updated);
            }}
            placeholder="Enter your question"
            className="bg-white text-black mb-4"
          />

          <div className="grid grid-cols-2 gap-2">
            {q.options.map((opt, optidx) => (
              <input
                key={optidx}
                type="text"
                className="bg-sky-50 p-3 m-2 text-black rounded w-full border border-gray-300"
                value={opt}
                placeholder={`Option ${optidx + 1}`}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[qidx].options[optidx] = e.target.value;
                  setQuestions(updated);
                }}
              />
            ))}
          </div>

          <div className="mt-3">
            <label className="block font-semibold mb-1 text-gray-700">
              Correct Answer:
            </label>
            <input
              type="text"
              className="bg-green-50 p-2 rounded border border-gray-300 w-full"
              value={q.correctAns}
              placeholder="Enter correct answer"
              onChange={(e) => {
                const updated = [...questions];
                updated[qidx].correctAns = e.target.value;
                setQuestions(updated);
              }}
            />
          </div>
        </div>
      ))}

      {/* 🟣 Extra Info Section */}
      <div className="p-3 m-3 bg-white rounded-lg shadow">
        <h1 className="font-bold text-lg mb-4">Extra Information</h1>

        {/* Duration */}
        <div className="m-3">
          <label className="block font-semibold mb-1">Time Duration</label>
          <input
            type="time"
            className="font-bold border rounded p-2 w-full"
            value={metaData.duration}
            onChange={(e) => setMetaData({ ...metaData, duration: e.target.value })}
          />
        </div>

        {/* Total Score */}
        <div className="m-3">
          <label className="block font-semibold mb-1">Total Score</label>
          <input
            type="number"
            className="bg-red-200 border rounded p-2 w-full"
            value={metaData.totalPoints}
            onChange={(e) => setMetaData({ ...metaData, totalPoints: e.target.value })}
          />
        </div>

        {/* Passing Score */}
        <div className="m-3">
          <label className="block font-semibold mb-1">Passing Score</label>
          <input
            type="number"
            className="bg-red-200 border rounded p-2 w-full"
            value={metaData.passingScore}
            onChange={(e) => setMetaData({ ...metaData, passingScore: e.target.value })}
          />
        </div>

        {/* isPublished */}
        <div className="m-3">
          <label className="block font-semibold mb-1">Is Published</label>
          <select
            value={metaData.isPublished}
            onChange={(e) => setMetaData({ ...metaData, isPublished: e.target.value })}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Dates */}
        <div className="m-3">
          <label className="block font-semibold mb-1">Start Date</label>
          <input
            type="date"
            className="bg-red-200 border rounded p-2 w-full"
            value={metaData.startDate}
            onChange={(e) => setMetaData({ ...metaData, startDate: e.target.value })}
          />
        </div>

        <div className="m-3">
          <label className="block font-semibold mb-1">End Date</label>
          <input
            type="date"
            className="bg-red-200 border rounded p-2 w-full"
            value={metaData.endDate}
            onChange={(e) => setMetaData({ ...metaData, endDate: e.target.value })}
          />
        </div>

        {/* Max Attempts */}
        <div className="m-3">
          <label className="block font-semibold mb-1">Max Attempts</label>
          <input
            type="number"
            className="bg-red-200 border rounded p-2 w-full"
            value={metaData.maxAttempts}
            onChange={(e) => setMetaData({ ...metaData, maxAttempts: e.target.value })}
          />
        </div>

        {/* Select fields */}
        <div className="m-3">
          <label className="block font-semibold mb-1">Allow Review</label>
          <select
            value={metaData.allowReview}
            onChange={(e) => setMetaData({ ...metaData, allowReview: e.target.value })}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="m-3">
          <label className="block font-semibold mb-1">Show Correct Answers</label>
          <select
            value={metaData.showCorrectAnswers}
            onChange={(e) => setMetaData({ ...metaData, showCorrectAnswers: e.target.value })}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="m-3">
          <label className="block font-semibold mb-1">Shuffle Questions</label>
          <select
            value={metaData.shuffleQuestions}
            onChange={(e) => setMetaData({ ...metaData, shuffleQuestions: e.target.value })}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="m-3">
          <label className="block font-semibold mb-1">Shuffle Options</label>
          <select
            value={metaData.shuffleOptions}
            onChange={(e) => setMetaData({ ...metaData, shuffleOptions: e.target.value })}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="m-3">
          <label className="block font-semibold mb-1">Grading Type</label>
          <select
            value={metaData.gradingType}
            onChange={(e) => setMetaData({ ...metaData, gradingType: e.target.value })}
          >
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={addMoreQuestion}
            className="bg-green-500 px-6 py-2 text-white font-bold text-lg rounded-lg hover:bg-green-600 transition"
          >
            Add More
          </button>

          <button
            onClick={handleSubmit}
            className="bg-purple-700 px-6 py-2 text-white font-bold text-lg rounded-lg hover:bg-purple-800 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCreate;
