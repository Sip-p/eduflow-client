import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// 🔹 Async thunk: create dummy order
export const createOrder = createAsyncThunk(
  'payment/createOrder',
  async ({ courseId, amount }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${backendUrl}/api/payment/create-order`,
        { courseId, amount },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data; // { orderId, courseId, amount, message }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

// 🔹 Async thunk: verify dummy payment
export const verifyPayment = createAsyncThunk(
  'payment/verifyPayment',
  async ({ orderId, courseId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${backendUrl}/api/payment/verify-payment`,
        { orderId, courseId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data; // { message, orderId, courseId }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Payment verification failed');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    order: null,          // holds dummy order { orderId, courseId, amount }
    loading: false,
    error: null,
    paymentSuccess: false
  },
  reducers: {
    resetPayment: (state) => {
      state.order = null;
      state.loading = false;
      state.error = null;
      state.paymentSuccess = false;
    },
    setPaymentSuccess: (state, action) => {
      state.paymentSuccess = action.payload;
    }
  },
  extraReducers: (builder) => {
    // 🔹 Create Order
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload; // store full response
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // 🔹 Verify Payment
    builder.addCase(verifyPayment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyPayment.fulfilled, (state) => {
      state.loading = false;
      state.paymentSuccess = true;
      state.order = null; // reset order after success
    });
    builder.addCase(verifyPayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.paymentSuccess = false;
    });
  }
});

export const { resetPayment, setPaymentSuccess } = paymentSlice.actions;
export default paymentSlice.reducer;
