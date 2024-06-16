// src/slices/postSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define initial state
const initialState = {
  posts: [],
  post: null, // Added to store a single post
  loading: false,
  error: null,
};

// Async actions

// Fetch all posts
export const fetchPosts = createAsyncThunk('post/fetchPosts', async () => {
  const response = await axios.get('http://localhost:3001/api/posts/getposts', {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
});

// Fetch a single post by ID
export const fetchPostById = createAsyncThunk('post/fetchPostById', async (postId) => {
  const response = await axios.post('http://localhost:3001/api/posts/getpostbyid', 
    { postId },
    {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }
  );
  return response.data;
});

// Add a new post
export const addPost = createAsyncThunk('post/addPost', async (postData) => {
  const response = await axios.post('http://localhost:3001/api/posts/createpost', postData, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data.post;
});

// Post a comment
export const postComment = createAsyncThunk(
  'post/postComment',
  async ({ postId, commentText, anonymous }) => {
    await axios.post(
      `http://localhost:3001/api/comments/postCommentOnPost`,
      {
        post_id: postId,
        commentText,
        anonymous,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );
  }
);
// Fetch comments for a specific post
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:3001/api/comments/getcommentsofpost',
        { post_id: postId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If no comments are found, return an empty array
        return [];
      }
      return rejectWithValue(error.message);
    }
  }
);

// Upvote a post
export const upvotePost = createAsyncThunk('post/upvotePost', async (postId) => {
  await axios.post(`http://localhost:3001/api/posts/upvotepost`, { postId }, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return { postId, type: 'upvote' };
});

// Downvote a post
export const downvotePost = createAsyncThunk('post/downvotePost', async (postId) => {
  await axios.post(`http://localhost:3001/api/posts/downvotepost`, { postId }, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return { postId, type: 'downvote' };
});

// Create slice
const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload || [];
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch a single post by ID
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.post = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add a new post
      .addCase(addPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.loading = false;
        const newPost = action.payload;
        if (newPost && newPost.title && newPost.content) {
          // Insert new post at the beginning
          state.posts.unshift(newPost);
        }
      })
      .addCase(addPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Post a comment
      .addCase(postComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postComment.fulfilled, (state) => {
        state.loading = false;
        // No need to update the state here; comments will be fetched separately
      })
      .addCase(postComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch comments for a post
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        if (state.post && state.post._id === action.meta.arg) {
          state.post.comments = action.payload;
        }
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Upvote a post
      .addCase(upvotePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const post = state.posts.find((post) => post._id === postId);
        if (post) {
          post.upvotes += 1;
        }
      })
      .addCase(upvotePost.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // Downvote a post
      .addCase(downvotePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const post = state.posts.find((post) => post._id === postId);
        if (post) {
          post.downvotes += 1;
        }
      })
      .addCase(downvotePost.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default postSlice.reducer;
