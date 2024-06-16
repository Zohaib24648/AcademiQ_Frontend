import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    TextField, Button, Container, Paper, Typography, Box, Grid,
    FormControl, InputLabel, Select, MenuItem, Modal, Backdrop, Fade
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../slices/authSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required'),
    password: Yup.string().required('Required'),
});

const LoginPage = () => {
    const [error, setError] = useState(null);
    const [role, setRole] = useState('User'); // Default role is User
    const [openModal, setOpenModal] = useState(false); // State to control modal visibility
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Redux dispatch

    const handleModalClose = () => {
        setOpenModal(false);
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            role: []
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setError(null);
            try {
                // Dispatch Redux action to log in the user
                const response = await dispatch(loginUser({
                    loginUsername: values.email,
                    password: values.password,
                    role, // Include the selected role
                })).unwrap();

                // Handle response
                const { user } = response;

                // Role verification
                if (role === 'Admin' && !user.roles.includes('Admin')) {
                    throw new Error('You do not have Admin privileges.');
                } 
                // else if (role === 'User' && user.roles.includes('Admin')) {
                //     throw new Error('Admins cannot log in as User.');
                // }

                // If the login is successful and the role is correct, navigate to the appropriate page
                toast.success('Login successful!');
                navigate(role === 'Admin' ? '/admin/dashboard' : '/home'); // Adjust the admin route as needed

            } catch (err) {
                console.error('Error during login:', err);
                setError(err.message || 'Login failed. Please try again.');
                toast.error(err.message || 'Login failed. Please try again.');
                setOpenModal(true); // Show modal with error message
            }
        },
    });

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: `url('/background.jpeg')`, // Replace with a suitable background image URL
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        >
            <Container maxWidth="md">
                <Grid container justifyContent="center">
                    <Grid item xs={12} sm={8} md={6}>
                        <Paper
                            elevation={10}
                            sx={{
                                padding: '30px',
                                borderRadius: '15px',
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontFamily: 'Playfair Display, serif' }}>
                                Login
                            </Typography>
                            <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <TextField
                                    name="email"
                                    label="Email"
                                    variant="outlined"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                    fullWidth
                                />
                                <TextField
                                    name="password"
                                    label="Password"
                                    type="password"
                                    variant="outlined"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                    fullWidth
                                />
                                {/* Role selection dropdown */}
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel id="role-select-label">Role</InputLabel>
                                    <Select
                                        labelId="role-select-label"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        label="Role"
                                    >
                                        <MenuItem value="User">User</MenuItem>
                                        <MenuItem value="Admin">Admin</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        backgroundColor: '#003366', // Deep Blue
                                        '&:hover': {
                                            backgroundColor: '#002244', // Darker Blue
                                        }
                                    }}
                                >
                                    Login
                                </Button>
                            </form>
                            <Typography variant="body1" sx={{ textAlign: 'center', marginTop: '16px' }}>
                                New User? <a href="/" style={{ color: '#FFD700' }}>Sign Up</a> {/* Gold color for link */}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
            {/* Modal for role-based error */}
            <Modal
                open={openModal}
                onClose={handleModalClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openModal}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: '10px',
                        }}
                    >
                        <Typography variant="h6" component="h2" sx={{ fontFamily: 'Playfair Display, serif' }}>
                            Role Error
                        </Typography>
                        <Typography sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                        <Button onClick={handleModalClose} sx={{ mt: 2 }} variant="contained" color="primary">
                            Close
                        </Button>
                    </Box>
                </Fade>
            </Modal>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </Box>
    );
}

export default LoginPage;
