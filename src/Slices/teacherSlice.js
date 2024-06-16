// src/Slices/teacherSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action for fetching teachers
export const fetchTeachers = createAsyncThunk('teacher/fetchTeachers', async () => {
  const response = await axios.get('http://localhost:3001/api/teachers/getallteachers', {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data.teachers;
});

// Async action for fetching a single teacher by ID
export const fetchTeacherById = createAsyncThunk('teacher/fetchTeacherById', async (teacherId) => {
  const response = await axios.get(`http://localhost:3001/api/teachers/${teacherId}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
});

const teacherSlice = createSlice({
  name: 'teacher',
  initialState: {
    teachers: [],
    selectedTeacher: null,
    courses: [], // Ensure this matches how you expect to use it
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedTeacher: (state) => {
      state.selectedTeacher = null;
      state.courses = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTeacherById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTeacher = action.payload;
      })
      .addCase(fetchTeacherById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSelectedTeacher } = teacherSlice.actions;
export default teacherSlice.reducer;
