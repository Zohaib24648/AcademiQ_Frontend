import React, { useEffect, useState, useCallback } from 'react';
import {
  Container, Typography, Grid, Paper, Avatar, Button, Box, TextField, InputAdornment, CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash.debounce';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(''); // For instant UI updates
  const [searchTerm, setSearchTerm] = useState(''); // For debounced API call
  const navigate = useNavigate();

  // Fetch teachers with debouncing
  const fetchTeachers = useCallback(debounce(async (page, search) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:3001/api/teachers/getallteachers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          page,
          limit: 10,
          search,
        },
      });

      const { teachers, currentPage, totalPages } = response.data;

      setTeachers(teachers);
      setCurrentPage(currentPage);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching teachers", error);
      setLoading(false);
    }
  }, 500), []); // 500ms debounce delay

  // Use useEffect to trigger the fetch when searchTerm or currentPage changes
  useEffect(() => {
    fetchTeachers(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchTeachers]);

  // Update search term with debouncing
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "contained" : "outlined"}
          onClick={() => handlePageChange(i)}
          sx={{
            margin: '0 5px',
            backgroundColor: i === currentPage ? '#003366' : 'transparent',
            color: i === currentPage ? '#FFFFFF' : '#003366',
            borderColor: '#003366',
            '&:hover': {
              backgroundColor: i === currentPage ? '#002244' : 'rgba(0, 51, 102, 0.1)',
            },
          }}
        >
          {i}
        </Button>
      );
    }
    return pages;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h2" align="center" gutterBottom sx={{ fontFamily: 'Playfair Display, serif', color: '#003366' }}>
        Teachers
      </Typography>

      {/* Search Bar */}
      <Box mb={3} display="flex" justifyContent="center">
        <TextField
          placeholder="Search Teachers"
          value={searchInput}
          onChange={handleSearchChange}
          variant="outlined"
          sx={{
            width: '60%',
            borderColor: '#FFD700', // Gold color border
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#FFD700', // Gold color border
              },
              '&:hover fieldset': {
                borderColor: '#FFD700', // Gold color on hover
              },
              '&.Mui-focused fieldset': {
                borderColor: '#FFD700', // Gold color on focus
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {teachers.length > 0 ? (
          teachers.map((teacher) => (
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
          ))
        ) : (
          <Typography variant="h6" align="center" sx={{ width: '100%', marginTop: 2 }}>
            No teachers found.
          </Typography>
        )}
      </Grid>

      <Box sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        {renderPagination()}
      </Box>
    </Container>
  );
};

export default TeacherList;
