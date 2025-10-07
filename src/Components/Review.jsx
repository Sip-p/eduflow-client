// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Review = () => {
//   const [reviews, setReviews] = useState([]);
//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const user = JSON.parse(localStorage.getItem("user"));
// // const token=localStorage.getItem(token)
//   const fetchReviews = async () => {
//     try {
//       const res = await axios.get(`${backendUrl}/api/review`);
//       setReviews(res.data.reviews);
//     } catch (err) {
//       console.error(err);
//     }
//   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!user) return alert("Login to submit a review");

// //     try {
// //       const res = await axios.post(
// //         `${backendUrl}/api/review`,
// //         { rating, comment },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       setReviews([res.data.review, ...reviews]);
// //       setRating(5);
// //       setComment("");
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

//   useEffect(() => {
//     fetchReviews();
//   }, []);

//   return (
//     <div className="mt-6">
//       <h3 className="text-xl font-bold mb-3">App Reviews</h3>

//       {/* Submit review */}
//       <form onSubmit={handleSubmit} className="mb-4">
//         <div className="flex items-center mb-2">
//           <span className="mr-2 font-semibold">Rating:</span>
//           <select
//             value={rating}
//             onChange={(e) => setRating(Number(e.target.value))}
//             className="border px-2 py-1 rounded"
//           >
//             {[1, 2, 3, 4, 5].map((n) => (
//               <option key={n} value={n}>{n}</option>
//             ))}
//           </select>
//         </div>
//         <textarea
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           placeholder="Write your review..."
//           className="w-full border p-2 rounded mb-2"
//           rows={3}
//         />
//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Submit Review
//         </button>
//       </form>

//       {/* List reviews */}
//       {reviews.length === 0 ? (
//         <p className="text-gray-500">No reviews yet</p>
//       ) : (
//         <div className="space-y-4">
//           {reviews.map((r) => (
//             <div key={r._id} className="border p-3 rounded shadow-sm bg-white">
//               <div className="flex items-center mb-1">
//                 <img
//                   src={r.user.pic || "https://via.placeholder.com/40"}
//                   alt={r.user.name}
//                   className="w-8 h-8 rounded-full mr-2"
//                 />
//                 <span className="font-semibold">{r.user.name}</span>
//                 <span className="ml-auto text-sm text-gray-500">{r.rating} ⭐</span>
//               </div>
//               <p>{r.comment}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Review;


import React from 'react'
// ReviewPage.jsx
import { useState } from "react";
import axios from "axios";
import Navbar from './Navbar';
export default function ReviewPage() {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
const backendUrl=import.meta.env.VITE_BACKEND_URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token"); // assuming you store JWT here
      if (!token) {
        setMessage("You must be logged in to add a review.");
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/api/review/add`, // adjust to your backend route
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setMessage("✅ Review submitted successfully!");
        setRating("");
        setComment("");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to submit review.");
    }
  };

  return (
    <div className=" ">
        <Navbar/>
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Add Review</h2>

        {message && (
          <p className="mb-3 text-center font-medium text-sm text-red-500">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Input */}
          <div>
            <label className="block font-semibold mb-1">Rating (1–5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Comment Input */}
          <div>
            <label className="block font-semibold mb-1">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Write your feedback..."
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}
