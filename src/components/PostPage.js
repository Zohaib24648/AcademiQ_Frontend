import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostById, postComment, fetchComments, upvotePost, downvotePost } from '../slices/postSlice';
import {
  Box, Container, Paper, Typography, List, ListItem, ListItemText, ListItemSecondaryAction,
  IconButton, Avatar, TextField, Button, FormControlLabel, Checkbox, CircularProgress, Alert
} from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PostPage = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const { post, loading, error } = useSelector(state => state.post);
  const [commentText, setCommentText] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [isCommentLoading, setIsCommentLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    dispatch(fetchPostById(postId));
    dispatch(fetchComments(postId));
  }, [dispatch, postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setIsCommentLoading(true);
    try {
      await dispatch(postComment({ postId, commentText, anonymous })).unwrap();
      setCommentText('');
      setAnonymous(false);
      toast.success('Comment posted successfully');
      dispatch(fetchComments(postId));
    } catch (err) {
      toast.error('Failed to post comment');
    } finally {
      setIsCommentLoading(false);
    }
  };

  const handleVote = async (voteType) => {
    try {
      if (voteType === 'upvote') {
        await dispatch(upvotePost(postId)).unwrap();
      } else if (voteType === 'downvote') {
        await dispatch(downvotePost(postId)).unwrap();
      }
    } catch (error) {
      toast.error(`Failed to ${voteType} post`);
    }
  };

  const handleDeleteComment = (commentId) => {
    // Implement delete comment functionality here
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{
      marginTop: '20px',
      backgroundImage: 'url("/background.jpeg")', // Replace with your academic-themed background image
      backgroundSize: 'cover',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Light overlay for readability
    }}>
      <Container maxWidth="lg">
        <ToastContainer />
        {post && (
          <Paper elevation={3} sx={{
            marginBottom: '20px',
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #FFD700', // Gold color border
          }}>
            <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Playfair Display, serif' }}>
              <strong>{post.title}</strong>
            </Typography>
            <List>
              <ListItem alignItems="flex-start">
                <Avatar alt={post.createdBy} src="/static/images/avatar/1.jpg" sx={{ marginRight: '10px' }} />
                <ListItemText
                  primary={<Typography variant="body1" sx={{ fontFamily: 'Roboto, sans-serif' }}>{post.title}</Typography>}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="textPrimary" sx={{ fontFamily: 'Roboto, sans-serif' }}>
                        {post.content}
                      </Typography>
                      <Typography variant="caption" display="block" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif' }}>
                        Posted by {post.createdBy} • {new Date(post.createdAt).toLocaleString()}
                      </Typography>
                      <Typography variant="caption" display="block" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif' }}>
                        {post.upvotes} upvotes • {post.downvotes} downvotes
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="upvote" onClick={() => handleVote('upvote')}>
                    <ThumbUpAltIcon sx={{ color: '#003366' }} /> {/* Deep Blue icon */}
                  </IconButton>
                  <IconButton edge="end" aria-label="downvote" onClick={() => handleVote('downvote')}>
                    <ThumbDownAltIcon sx={{ color: '#B22222' }} /> {/* Firebrick color icon */}
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        )}
        <Paper elevation={3} sx={{
          marginBottom: '20px',
          padding: '20px',
          borderRadius: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #FFD700', // Gold color border
        }}>
          <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Playfair Display, serif' }}>
            Add a comment
          </Typography>
          <form onSubmit={handleCommentSubmit}>
            <TextField
              name="commentText"
              label="Add a comment"
              variant="outlined"
              fullWidth
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              margin="normal"
              sx={{ marginBottom: '20px' }}
              disabled={isCommentLoading}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={anonymous}
                  onChange={() => setAnonymous(!anonymous)}
                  color="primary"
                  disabled={isCommentLoading}
                />
              }
              label="Post Anonymously"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isCommentLoading}
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
              {isCommentLoading ? <CircularProgress size={24} color="inherit" /> : 'Comment'}
            </Button>
          </form>
        </Paper>
        {post && post.comments && post.comments.length > 0 ? (
          post.comments.slice().reverse().map(comment => (
            <Paper key={comment._id} elevation={3} sx={{
              marginBottom: '20px',
              padding: '20px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #FFD700', // Gold color border
            }}>
              <ListItem alignItems="flex-start">
                <Avatar alt={comment.name} src="/static/images/avatar/1.jpg" sx={{ marginRight: '10px' }} />
                <ListItemText
                  primary={comment.comment}
                  secondary={
                    <>
                      <Typography variant="caption" display="block" gutterBottom sx={{ fontFamily: 'Roboto, sans-serif' }}>
                        Comment by {comment.anonymous ? 'Anonymous' : comment.name} • {new Date(comment.createdat).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
                {(user && (user.role === 'Admin' || user.erp === comment.erp)) && (
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteComment(comment._id)}>
                      <DeleteIcon sx={{ color: '#B22222' }} /> {/* Firebrick color for delete icon */}
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            </Paper>
          ))
        ) : (
          <Typography>No comments yet.</Typography>
        )}
      </Container>
    </Box>
  );
};

export default PostPage;
