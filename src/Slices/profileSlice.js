// src/Slices/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action for fetching user profile
export const fetchProfile = createAsyncThunk('profile/fetchProfile', async () => {
  const response = await axios.get('http://localhost:3001/api/users/getuserprofile', {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
});

// Async action for updating user profile
export const updateProfile = createAsyncThunk('profile/updateProfile', async (profileData) => {
  const formData = new FormData();
  for (const key in profileData) {
    formData.append(key, profileData[key]);
  }
  const response = await axios.patch('http://localhost:3001/api/users/updateProfile', formData, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.user;
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: {
      firstName: '',
      lastName: '',
      email: '',
      erpId: '',
      roles: [],
      profile_picture: null,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default profileSlice.reducer;
