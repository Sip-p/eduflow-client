// ReviewsPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
const backendUrl=import.meta.env.VITE_BACKEND_URL
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/review`); // adjust route
        if (data.success) {
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error("❌ Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg">
        Loading reviews...
      </div>
    );
  }

return (
  <div className="bg-gray-100 p-6  ">
    <h2 className="text-2xl font-bold text-center mb-6">User Reviews</h2>

    {/* Make this full width instead of max-w-xl */}
    <div className="w-full mx-auto bg-white shadow-lg rounded-2xl p-6">

      {reviews.length === 0 ? (
        <p className="text-center text-gray-600">No reviews yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border rounded-lg p-4 shadow-sm bg-gray-50"
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={review.user?.pic || "https://via.placeholder.com/40"}
                  alt={review.user?.name || "User"}
                  className="w-10 h-10 rounded-full border"
                />
                <div>
                  <h3 className="font-semibold">{review.user?.name || "Anonymous"}</h3>
                  <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <p className="text-yellow-500 mb-1">{"⭐".repeat(review.rating)}</p>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

}
