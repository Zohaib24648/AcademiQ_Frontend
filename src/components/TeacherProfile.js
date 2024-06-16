import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Avatar, Button, Grid, Card, CardContent, CircularProgress,Box } from '@mui/material';
import { fetchTeacherById, clearSelectedTeacher } from '../slices/teacherSlice';
import axios from 'axios';

const TeacherProfile = () => {
    const { teacherId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const selectedTeacher = useSelector(state => state.teacher.selectedTeacher);
    const loading = useSelector(state => state.teacher.loading);
    const error = useSelector(state => state.teacher.error);

    useEffect(() => {
        dispatch(fetchTeacherById(teacherId));

        return () => {
            dispatch(clearSelectedTeacher()); // Clear selected teacher on unmount
        };
    }, [dispatch, teacherId]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    if (!selectedTeacher) {
        return (
            <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Typography>No teacher data available</Typography>
            </Container>
        );
    }

    // Ensure CoursesTaught and CoursesTaughtIDs are arrays before mapping over them
    const courses = selectedTeacher["Courses Taught"] || [];
    const courseIDs = selectedTeacher.CoursesTaughtIDs || [];

    const handleDelete = async () => {
        try {
            await axios.delete('http://localhost:3001/api/teachers/deleteteacher', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                data: { objectId: selectedTeacher._id },
            });
            navigate('/teachers');
        } catch (error) {
            console.error("Error deleting teacher", error);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Paper sx={{
                padding: 4,
                borderRadius: '15px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid #FFD700', // Gold color border
            }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4} md={3}>
                        <Avatar 
                            src={`data:image/jpeg;base64,${selectedTeacher.ImageFile}`} 
                            sx={{ width: 120, height: 120, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }} 
                        />
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Playfair Display, serif', color: '#003366' }}>
                            {selectedTeacher.Name}
                        </Typography>
                        <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif', color: '#555' }}>
                            {selectedTeacher.Title}
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif', color: '#333' }}>
                            {selectedTeacher.Overview}
                        </Typography>
                        <Typography variant="body1" sx={{ fontFamily: 'Roboto, sans-serif', color: '#333' }}>
                            <strong>Department:</strong> {selectedTeacher.Department}
                        </Typography>
                        <Typography variant="body1" sx={{ fontFamily: 'Roboto, sans-serif', color: '#333' }}>
                            <strong>Specialization:</strong> {selectedTeacher.Specialization}
                        </Typography>
                        <Typography variant="body1" sx={{ fontFamily: 'Roboto, sans-serif', color: '#333' }}>
                            <strong>Onboard Status:</strong> {selectedTeacher.OnboardStatus}
                        </Typography>
                    </Grid>
                </Grid>

                {/* Display Courses as Clickable Tiles */}
                <Typography variant="h5" sx={{ marginTop: 4, fontFamily: 'Playfair Display, serif', color: '#003366' }}>
                    Courses Taught:
                </Typography>
                {courses.length > 0 ? (
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        {courses.map((courseName, index) => (
                            <Grid item xs={12} sm={6} md={4} key={courseIDs[index]}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        border: '1px solid #FFD700', // Gold color border
                                        cursor: 'pointer',
                                        '&:hover': {
                                            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Hover effect
                                        },
                                    }}
                                    onClick={() => navigate(`/course/${courseIDs[index]}`)}
                                >
                                    <CardContent>
                                        <Typography variant="h6" align="center" sx={{ fontFamily: 'Roboto, sans-serif', color: '#003366' }}>
                                            {courseName}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography>No courses available.</Typography>
                )}

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#003366', // Deep Blue
                            '&:hover': {
                                backgroundColor: '#002244', // Darker Blue on hover
                            },
                            color: '#FFFFFF',
                            mr: 2,
                        }}
                        onClick={() => navigate(`/teachers/edit/${selectedTeacher._id}`)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        sx={{
                            backgroundColor: '#B22222', // Firebrick Red
                            '&:hover': {
                                backgroundColor: '#8B0000', // Darker Red on hover
                            },
                        }}
                    >
                        Delete
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default TeacherProfile;
