import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const initialState = {
    user: null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('token')
};

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/auth/user-login`,
                credentials,
                { headers: { 'Content-Type': 'application/json' } }
            );
            console.log(response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data
                    ? error.response.data
                    : error.message
            );
        }
    }
);
// export const signUpUser = createAsyncThunk(
//     'auth/signUpUser',
//     async (userData, { rejectWithValue }) => {
//         try {
//             const response = await axios.post(
//                 `${backendUrl}/api/auth/user-signup`,
//                 userData,
//                 { headers: { 'Content-Type': 'application/json' } }
//             );
//             console.log(response)
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(
//                 error.response && error.response.data
//                     ? error.response.data
//                     : error.message
//             );
//         }
//     }
// );

export const signUpUser = createAsyncThunk(
  'auth/signUpUser',
  async (userData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('role', userData.role);
      if (userData.picFile) {
        formData.append('file', userData.picFile);
      }

      const response = await axios.post(
        `${backendUrl}/api/auth/user-signup`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data
          ? error.response.data
          : error.message
      );
    }
  }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user || null;
                state.token = action.payload.token || null;
                state.isAuthenticated = true;
                state.error = null;
                if (action.payload.token) {
                    localStorage.setItem('token', action.payload.token);
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Login failed';
            })
            .addCase(signUpUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user || null;
                state.token = action.payload.token || null;
                state.isAuthenticated = true;
                state.error = null;
                if (action.payload.token) {
                    localStorage.setItem('token', action.payload.token);
                }
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Signup failed';
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;