import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, CircularProgress, Grid, Paper, Avatar, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseDetails } from '../slices/courseSlice';
import { useNavigate } from 'react-router-dom';

const CourseDetailsPage = () => {
  const navigate = useNavigate();

  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { courseDetails, loading } = useSelector(state => state.course);

  useEffect(() => {
    dispatch(fetchCourseDetails(courseId));
  }, [dispatch, courseId]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!courseDetails) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" mt={5}>Course not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h2" align="center" gutterBottom sx={{ fontFamily: 'Playfair Display, serif', color: '#003366' }}>
        {courseDetails.Course_name}
      </Typography>
      <Typography variant="body1" align="center" sx={{ fontFamily: 'Roboto, sans-serif', mb: 3, color: '#333' }}>
        {courseDetails["Course Description"]}
      </Typography>

      {/* Teachers Section */}
      <Typography variant="h4" align="center" mt={5} mb={3} sx={{ fontFamily: 'Playfair Display, serif', color: '#003366' }}>
        Teachers
      </Typography>
      <Grid container spacing={3}>
        {courseDetails.Teachers.map((teacher) => (
          <Grid item xs={12} md={6} key={teacher._id}>
            <Paper
              sx={{
                padding: 2,
                display: 'flex',
                alignItems: 'center',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid #FFD700', // Gold color border
                '&:hover': {
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Hover effect
                },
              }}
            >
              <Avatar src={`data:image/jpeg;base64,${teacher.ImageFile}`} sx={{ width: 60, height: 60, marginRight: 2 }} />
              <div>
                <Typography variant="h6" sx={{ fontFamily: 'Roboto, sans-serif', color: '#003366' }}>
                  {teacher.Name}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontFamily: 'Roboto, sans-serif', color: '#555' }}>
                  {teacher.Title}
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    mt: 1,
                    backgroundColor: '#003366', // Deep Blue
                    '&:hover': {
                      backgroundColor: '#002244', // Darker Blue on hover
                    },
                    color: '#FFFFFF',
                  }}
                  onClick={() => navigate(`/teachers/${teacher._id}`)}
                  >
                  View Profile
                </Button>
              </div>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CourseDetailsPage;
