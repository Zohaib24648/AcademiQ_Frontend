import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Paper, Typography } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const TeacherForm = () => {
    const [initialValues, setInitialValues] = useState({
        Name: '',
        Title: '',
        Email: '',
        Overview: '',
        CoursesTaught: [],
        Department: '',
        Specialization: '',
        OnboardStatus: '',
        ImageFile: ''
    });

    const { teacherId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (teacherId) {
            const fetchTeacher = async () => {
                try {
                    const response = await axios.get(`/api/teachers/${teacherId}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    setInitialValues({
                        ...response.data,
                        CoursesTaught: response.data['Courses Taught'].join(', ')
                    });
                } catch (error) {
                    console.error("Error fetching teacher", error);
                }
            };

            fetchTeacher();
        }
    }, [teacherId]);

    return (
        <Container>
            <Paper sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom>{teacherId ? 'Edit Teacher' : 'Add Teacher'}</Typography>
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={Yup.object({
                        Name: Yup.string().required('Required'),
                        Email: Yup.string().email('Invalid email address').required('Required'),
                        CoursesTaught: Yup.string().required('Required')
                    })}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            const payload = {
                                ...values,
                                CoursesTaught: values.CoursesTaught.split(',').map(course => course.trim())
                            };

                            if (teacherId) {
                                await axios.patch('/api/teachers/updateTeacher', { id: teacherId, ...payload }, {
                                    headers: {
                                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                    },
                                });
                            } else {
                                await axios.post('/api/teachers/createTeacher', payload, {
                                    headers: {
                                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                    },
                                });
                            }
                            navigate('/teachers');
                        } catch (error) {
                            console.error("Error saving teacher", error);
                        }
                        setSubmitting(false);
                    }}
                >
                    {({ values, handleChange, handleSubmit, isSubmitting, touched, errors }) => (
                        <Form onSubmit={handleSubmit}>
                            <TextField
                                name="Name"
                                label="Name"
                                fullWidth
                                margin="dense"
                                value={values.Name}
                                onChange={handleChange}
                                error={touched.Name && Boolean(errors.Name)}
                                helperText={touched.Name && errors.Name}
                            />
                            <TextField
                                name="Title"
                                label="Title"
                                fullWidth
                                margin="dense"
                                value={values.Title}
                                onChange={handleChange}
                                error={touched.Title && Boolean(errors.Title)}
                                helperText={touched.Title && errors.Title}
                            />
                            <TextField
                                name="Email"
                                label="Email"
                                fullWidth
                                margin="dense"
                                value={values.Email}
                                onChange={handleChange}
                                error={touched.Email && Boolean(errors.Email)}
                                helperText={touched.Email && errors.Email}
                            />
                            <TextField
                                name="Overview"
                                label="Overview"
                                fullWidth
                                margin="dense"
                                value={values.Overview}
                                onChange={handleChange}
                                error={touched.Overview && Boolean(errors.Overview)}
                                helperText={touched.Overview && errors.Overview}
                            />
                            <TextField
                                name="CoursesTaught"
                                label="Courses Taught (comma separated)"
                                fullWidth
                                margin="dense"
                                value={values.CoursesTaught}
                                onChange={handleChange}
                                error={touched.CoursesTaught && Boolean(errors.CoursesTaught)}
                                helperText={touched.CoursesTaught && errors.CoursesTaught}
                            />
                            <TextField
                                name="Department"
                                label="Department"
                                fullWidth
                                margin="dense"
                                value={values.Department}
                                onChange={handleChange}
                                error={touched.Department && Boolean(errors.Department)}
                                helperText={touched.Department && errors.Department}
                            />
                            <TextField
                                name="Specialization"
                                label="Specialization"
                                fullWidth
                                margin="dense"
                                value={values.Specialization}
                                onChange={handleChange}
                                error={touched.Specialization && Boolean(errors.Specialization)}
                                helperText={touched.Specialization && errors.Specialization}
                            />
                            <TextField
                                name="OnboardStatus"
                                label="Onboard Status"
                                fullWidth
                                margin="dense"
                                value={values.OnboardStatus}
                                onChange={handleChange}
                                error={touched.OnboardStatus && Boolean(errors.OnboardStatus)}
                                helperText={touched.OnboardStatus && errors.OnboardStatus}
                            />
                            <TextField
                                name="ImageFile"
                                label="Image File"
                                fullWidth
                                margin="dense"
                                value={values.ImageFile}
                                onChange={handleChange}
                                error={touched.ImageFile && Boolean(errors.ImageFile)}
                                helperText={touched.ImageFile && errors.ImageFile}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                                sx={{ marginTop: 2 }}
                            >
                                {teacherId ? 'Update Teacher' : 'Add Teacher'}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Container>
    );
};

export default TeacherForm;
