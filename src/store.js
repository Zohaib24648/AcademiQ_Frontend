// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import postReducer from './slices/postSlice'; // Ensure this matches your imports and usage
import profileReducer from './slices/profileSlice';
import teacherReducer from './slices/teacherSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
    post: postReducer, // Should match the key you use in useSelector
    profile: profileReducer,
    teacher: teacherReducer,
  },
});

export default store;
