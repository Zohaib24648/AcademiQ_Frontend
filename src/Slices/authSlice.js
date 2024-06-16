// src/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action to handle user login
export const loginUser = createAsyncThunk('auth/loginUser', async ({ loginUsername, password, role }, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:3001/api/users/login', {
      loginUsername,
      password,
      role  
    });
    return response.data; // Contains token and user details
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});


// Async action to fetch the user data from the server
export const fetchUser = createAsyncThunk('auth/fetchUser', async () => {
  const response = await axios.get('http://localhost:3001/api/users/getuserprofile', {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'), // Initialize with token from localStorage
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token'); // Remove token from localStorage on logout
      localStorage.removeItem('user');

    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token); // Store token in localStorage
localStorage.setItem('user', JSON.stringify(action.payload.user));

      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : action.error.message;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
