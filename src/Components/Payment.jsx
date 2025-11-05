import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, verifyPayment, resetPayment } from "../redux/paymentSlice";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const course = location?.state?.course;
  const courseId = course?._id;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { loading, paymentSuccess, error } = useSelector((state) => state.payment);

  const token = localStorage.getItem("token"); // ✅ get JWT token for API calls

  // ✅ Add course after successful payment
  const addMyCourse = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/course/addmycourse`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        console.log("✅ Course added to My Courses");
      } else {
        console.warn("⚠️ Failed to add course");
      }
    } catch (error) {
      console.error("❌ Error adding course:", error.message);
    }
  };

  // ✅ Fetch course details
  useEffect(() => {
    const getCourseDetails = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/course/${courseId}`);
        if (res.data.success) {
          console.log("📘 Course details:", res.data);
        }
      } catch (error) {
        console.error("❌ Error fetching course details:", error.message);
      }
    };

    if (courseId) getCourseDetails();
  }, [courseId]);

  // ✅ Handle post-payment success
  useEffect(() => {
    if (paymentSuccess) {
      alert("✅ Payment Successful!");
      addMyCourse();
      dispatch(resetPayment());
      navigate("/student-dashboard");
    }
  }, [paymentSuccess, dispatch, navigate]);

  // ✅ Simulate payment handler
  const handlePayment = async () => {
    if (!courseId) return alert("❌ Missing course ID!");

    const amount = course?.price || 500;

    const orderRes = await dispatch(createOrder({ courseId, amount }));

    if (orderRes.meta.requestStatus === "fulfilled") {
      await dispatch(
        verifyPayment({
          orderId: orderRes.payload.orderId,
          courseId,
        })
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-lg text-center w-96">
        <h1 className="text-2xl font-bold mb-4">Complete Your Payment</h1>
        <p className="mb-6 text-gray-600">
          Course Fee: ₹{course?.price || 500}
        </p>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Payment;
