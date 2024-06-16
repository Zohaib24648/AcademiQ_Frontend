// src/Slices/courseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../common/constanturl'

// Async action to fetch all courses with pagination and search
export const fetchCourses = createAsyncThunk('course/fetchCourses', async ({ page, limit, search }) => {
  console.log(`${API_BASE_URL}/api/courses/getallcourses`)
  const response = await axios.get(`${API_BASE_URL}/courses/getallcourses`, {
       

    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    params: { page, limit, search }
  });

  return { 
    courses: response.data.courses, 
    totalCourses: response.data.totalCourses, 
    totalPages: response.data.totalPages 
  };
});

// Async action to fetch a single course's details
export const fetchCourseDetails = createAsyncThunk('course/fetchCourseDetails', async (courseId) => {
  const response = await axios.get(`http://localhost:3001/api/courses/getcourse/${courseId}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
});

const courseSlice = createSlice({
  name: 'course',
  initialState: {
    courses: [],
    courseDetails: null,
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    limit: 9, // Default number of courses per page
  },
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCourseDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.courseDetails = null;
      })
      .addCase(fetchCourseDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.courseDetails = action.payload;
      })
      .addCase(fetchCourseDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setPage } = courseSlice.actions;

export default courseSlice.reducer;
