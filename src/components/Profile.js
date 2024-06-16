import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Grid, Avatar, Paper, Button,
    Snackbar, TextField
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const Profile = () => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [userImage, setUserImage] = useState(null);
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        erpId: '',
        roles: [],
        profile_picture: null,
    });

    const [initialValues, setInitialValues] = useState(profileData);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setSnackbarMessage("No token found. Please log in.");
                    setOpenSnackbar(true);
                    return;
                }

                const response = await axios.get('http://localhost:3001/api/users/getuserprofile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = response.data;
                const updatedProfileData = {
                    firstName: data.firstname,
                    lastName: data.lastname,
                    email: data.email,
                    erpId: data.erp,
                    roles: data.roles || [], // Ensure roles is an array
                    profile_picture: null,
                };

                setProfileData(updatedProfileData);
                setInitialValues(updatedProfileData);

                if (data.profile_picture) {
                    setUserImage(data.profile_picture);
                }

            } catch (error) {
                console.error("Error fetching profile data:", error);
                setSnackbarMessage(error.response?.data?.msg || "Error fetching profile data");
                setOpenSnackbar(true);
            }
        };

        fetchProfileData();
    }, []);

    const handleProfileSubmit = async (values, { setSubmitting }) => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('updated_firstname', values.firstName);
            formData.append('updated_lastname', values.lastName);
            if (values.profile_picture) {
                formData.append('profile_picture', values.profile_picture);
            }

            const response = await axios.patch('http://localhost:3001/api/users/updateProfile', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = response.data.user;
            const updatedProfileData = {
                firstName: data.firstname,
                lastName: data.lastname,
                email: data.email,
                erpId: data.erp,
                roles: data.roles || [], // Ensure roles is an array
                profile_picture: null,
            };

            setProfileData(updatedProfileData);
            setInitialValues(updatedProfileData);

            if (data.profile_picture) {
                setUserImage(data.profile_picture);
            }

            setSnackbarMessage(response.data.msg);
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Error updating profile:", error);
            setSnackbarMessage(error.response?.data?.msg || "Error updating profile");
            setOpenSnackbar(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleFileChange = (event, setFieldValue) => {
        const file = event.target.files[0];
        if (file) {
            // Use Formik's setFieldValue to update the field in the form state
            setFieldValue("profile_picture", file);

            // Set the user image preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const profileValidationSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
    });

    return (
        <Container maxWidth="md" sx={{ marginTop: '40px' }}>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                sx={{ bgcolor: '#003366', color: '#FFFFFF' }} // Custom styling for Snackbar
            />
            <Paper
                sx={{
                    padding: 4,
                    marginTop: 5,
                    borderRadius: '15px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #FFD700', // Gold color border
                }}
            >
                <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Playfair Display, serif', textAlign: 'center' }}>
                    My Profile
                </Typography>
                <Formik
                    initialValues={initialValues}
                    validationSchema={profileValidationSchema}
                    onSubmit={handleProfileSubmit}
                    enableReinitialize
                >
                    {({ values, errors, touched, handleChange, setFieldValue }) => (
                        <Form>
                            <Grid container spacing={3} justifyContent="center">
                                <Grid item xs={12} textAlign="center">
                                    <Avatar sx={{ width: 120, height: 120, margin: 'auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                                        <img src={userImage || "/default-profile.png"} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                    </Avatar>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => handleFileChange(event, setFieldValue)}
                                        style={{ display: 'none' }}
                                        id="profile-picture-upload"
                                    />
                                    <label htmlFor="profile-picture-upload">
                                        <Button variant="contained" component="span" sx={{
                                            marginTop: 2,
                                            backgroundColor: '#003366', // Deep Blue
                                            '&:hover': {
                                                backgroundColor: '#002244', // Darker Blue on hover
                                            },
                                            color: '#FFFFFF',
                                        }}>
                                            Change Profile Picture
                                        </Button>
                                    </label>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="firstName"
                                        label="First Name"
                                        fullWidth
                                        value={values.firstName}
                                        onChange={handleChange}
                                        error={touched.firstName && Boolean(errors.firstName)}
                                        helperText={touched.firstName && errors.firstName}
                                        sx={{ marginBottom: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="lastName"
                                        label="Last Name"
                                        fullWidth
                                        value={values.lastName}
                                        onChange={handleChange}
                                        error={touched.lastName && Boolean(errors.lastName)}
                                        helperText={touched.lastName && errors.lastName}
                                        sx={{ marginBottom: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle1"><strong>Email:</strong> {values.email}</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle1"><strong>ERP ID:</strong> {values.erpId}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1"><strong>Roles:</strong> {Array.isArray(values.roles) ? values.roles.join(', ') : ''}</Typography>
                                </Grid>
                                <Grid item xs={12} textAlign="center">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#003366', // Deep Blue
                                            '&:hover': {
                                                backgroundColor: '#002244', // Darker Blue on hover
                                            },
                                            color: '#FFFFFF',
                                            padding: '10px 20px',
                                            borderRadius: '8px',
                                        }}
                                    >
                                        Save
                                    </Button>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Container>
    );
};

export default Profile;
