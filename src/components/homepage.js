import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
  Box, Container, Grid, Paper, Typography, Button, IconButton,
  TextField, ListItem, ListItemText, ListItemSecondaryAction,
  Badge, Avatar, CircularProgress, Alert, Snackbar, FormControlLabel, Checkbox
} from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchPosts, addPost, upvotePost, downvotePost } from '../slices/postSlice';
import { fetchUser } from '../slices/authSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const posts = useSelector((state) => state.post.posts);
  const loading = useSelector((state) => state.post.loading);
  const error = useSelector((state) => state.post.error);
  const user = useSelector((state) => state.auth.user);
  const [anonymous, setAnonymous] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchPosts());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      title: '',
      content: ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      content: Yup.string().required('Content is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const postPayload = {
          title: values.title,
          content: values.content,
          visibility: 'Public',
          anonymous: anonymous
        };

        await dispatch(addPost(postPayload)).unwrap();

        resetForm();
        setAnonymous(false);
        toast.success('Post created successfully!');

        // Fetch the latest posts after creating a new post
        dispatch(fetchPosts());
      } catch (error) {
        console.error("Error creating post", error);
        toast.error('Failed to create post');
      }
    }
  });

  const handleDelete = async (postId) => {
    try {
      await axios.delete('http://localhost:3001/api/posts/deletepost', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        data: { postId }
      });
      dispatch(fetchPosts());
      toast.success('Post deleted successfully!');
    } catch (error) {
      console.error("Error deleting post", error);
      toast.error('Failed to delete post');
    }
  };

  const handleVote = async (postId, type) => {
    try {
      if (type === 'upvote') {
        await dispatch(upvotePost(postId)).unwrap();
        toast.success('Post upvoted');
      } else {
        await dispatch(downvotePost(postId)).unwrap();
        toast.success('Post downvoted');
      }
    } catch (error) {
      console.error(`Error handling ${type} vote`, error);
      toast.error(`Failed to ${type} post`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
  };

  const getCreatedByText = (createdBy) => {
    if (typeof createdBy === 'object' && createdBy !== null) {
      return `${createdBy.firstname} ${createdBy.lastname}`;
    }
    return createdBy;
  };

  return (
    <Box sx={{
      backgroundImage: 'url("background.jpeg")',
      backgroundSize: 'cover',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    }}>
      <Container maxWidth="lg">
        <ToastContainer />
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Paper elevation={3} sx={{
              marginBottom: '20px',
              padding: '20px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #FFD700', // Gold color border for the paper
            }}>
              <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Playfair Display, serif' }}>
                What's on your mind?
              </Typography>
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  id="title"
                  name="title"
                  label="Title"
                  variant="outlined"
                  fullWidth
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  margin="normal"
                  sx={{ marginBottom: '20px' }}
                />
                <TextField
                  id="content"
                  name="content"
                  label="Content"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={formik.values.content}
                  onChange={formik.handleChange}
                  error={formik.touched.content && Boolean(formik.errors.content)}
                  helperText={formik.touched.content && formik.errors.content}
                  margin="normal"
                  sx={{ marginBottom: '20px' }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={anonymous}
                      onChange={(e) => setAnonymous(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Post anonymously"
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  sx={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: '#003366', // Deep Blue
                    '&:hover': {
                      backgroundColor: '#002244', // Darker Blue on hover
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Post'}
                </Button>
              </form>
            </Paper>
            {error && <Alert severity="error">{error}</Alert>}
            {!loading && !error && posts.slice().reverse().map(post => (
              post && post.title && post.content && (
                <Paper key={post._id} elevation={3} sx={{
                  marginBottom: '20px',
                  padding: '20px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #FFD700', // Gold color border for the posts
                }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    onClick={() => navigate(`/posts/${post._id}`)}
                    sx={{ cursor: 'pointer', fontFamily: 'Playfair Display, serif' }}
                  >
                    <strong>{post.title}</strong>
                  </Typography>
                  <ListItem alignItems="flex-start">
                    <Avatar alt={getCreatedByText(post.createdBy)} src="/static/images/avatar/1.jpg" sx={{ marginRight: '10px' }} />
                    <ListItemText
                      primary={<Typography variant="body1" sx={{ fontFamily: 'Roboto, sans-serif' }}>{post.title}</Typography>}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="textPrimary" sx={{ fontFamily: 'Roboto, sans-serif' }}>
                            {post.content}
                          </Typography>
                          <Typography variant="caption" display="block" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif' }}>
                            Posted by {getCreatedByText(post.createdBy)} • {formatDate(post.createdAt)}
                          </Typography>
                          <Typography variant="caption" display="block" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif' }}>
                            {post.upvotes} upvotes • {post.downvotes} downvotes
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="upvote" onClick={() => handleVote(post._id, 'upvote')}>
                        <Badge badgeContent={post.upvotes} color="primary">
                          <ThumbUpAltIcon />
                        </Badge>
                      </IconButton>
                      <IconButton edge="end" aria-label="downvote" onClick={() => handleVote(post._id, 'downvote')}>
                        <Badge badgeContent={post.downvotes} color="error">
                          <ThumbDownAltIcon />
                        </Badge>
                      </IconButton>
                      {user && user.roles.includes('Admin') && (
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(post._id)}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                </Paper>
              )
            ))}
          </Grid>
        </Grid>
        <Snackbar
          open={!!notification}
          autoHideDuration={6000}
          onClose={() => setNotification('')}
          message={notification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        />
      </Container>
    </Box>
  );
};

export default HomePage;
