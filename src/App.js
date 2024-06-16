import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import Profile from './components/Profile';
import TeacherList from './components/TeacherList';
import TeacherProfile from './components/TeacherProfile';
import CoursePage from './components/CoursePage';
import CourseDetailsPage from './components/CourseDetailsPage';
import PostPage from './components/PostPage';
import { fetchUser } from './slices/authSlice';
import Sidebar from './common/Sidebar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import './assets/styles/App.css';
import Unauthorized from '../src/components/UnAuthorized'; // Adjust the import path if needed

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => !!state.auth.token);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUser());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <Router>
      <Box sx={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'auto', margin: 0, padding: 0 }}>
        <CssBaseline />
        {isAuthenticated && <Sidebar />}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            margin: 0,
            padding: 0,
          }}
        >
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <RegisterPage />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated} component={Profile} />} />
            <Route path="/teachers" element={<ProtectedRoute isAuthenticated={isAuthenticated} component={TeacherList} />} />
            <Route path="/teachers/:teacherId" element={<ProtectedRoute isAuthenticated={isAuthenticated} component={TeacherProfile} />} />
            <Route path="/courses" element={<ProtectedRoute isAuthenticated={isAuthenticated} component={CoursePage} />} />
            <Route path="/course/:courseId" element={<ProtectedRoute isAuthenticated={isAuthenticated} component={CourseDetailsPage} />} />
            <Route path="/posts/:postId" element={<ProtectedRoute isAuthenticated={isAuthenticated} component={PostPage} />} />
            <Route path="/posts" element={<ProtectedRoute isAuthenticated={isAuthenticated} component={HomePage} />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

// ProtectedRoute Component
const ProtectedRoute = ({ component: Component, requiredRoles, ...rest }) => {
  const { user } = useSelector((state) => state.auth);
  const isAuthenticated = !!user;
  const userHasRequiredRole = requiredRoles ? requiredRoles.some(role => user.roles.includes(role)) : true;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!userHasRequiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return <Component {...rest} />;
};

export default App;
