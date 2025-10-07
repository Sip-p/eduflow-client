// src/Components/Payment.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, verifyPayment, resetPayment } from "../redux/paymentSlice";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, paymentSuccess, error, order } = useSelector((state) => state.payment);

  // Redirect after success
  useEffect(() => {
    if (paymentSuccess) {
      alert("✅ Payment Successful!");
      navigate("/student-dashboard");
      dispatch(resetPayment());
    }
  }, [paymentSuccess, navigate, dispatch]);

  const handlePayment = async () => {
    // Example: You can pass courseId dynamically from props or params
    const courseId = "demoCourse123";
    const amount = 500;

    // Step 1: Create order
    const orderRes = await dispatch(createOrder({ courseId, amount }));

    if (orderRes.meta.requestStatus === "fulfilled") {
      // Step 2: Verify payment (dummy verify for now)
      await dispatch(verifyPayment({ orderId: orderRes.payload.orderId, courseId }));
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-lg text-center w-96">
        <h1 className="text-2xl font-bold mb-4">Complete Your Payment</h1>
        <p className="mb-6 text-gray-600">Course Fee: ₹500</p>

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
