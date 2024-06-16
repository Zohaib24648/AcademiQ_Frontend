import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WarningIcon from '@mui/icons-material/Warning';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigates back to the previous page
  };

  const handleGoHome = () => {
    navigate('/home'); // Navigates to the home page
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#ffffff',
          boxShadow: 3,
          borderRadius: '8px',
        }}
      >
        <WarningIcon sx={{ fontSize: '60px', color: '#ff9800' }} />
        <Typography variant="h4" gutterBottom sx={{ marginTop: '16px', color: '#333' }}>
          Unauthorized Access
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: '#666' }}>
          You do not have permission to view this page.
        </Typography>
        <Box sx={{ marginTop: '24px' }}>
          <Button variant="contained" color="primary" onClick={handleGoBack} sx={{ marginRight: '8px' }}>
            Go Back
          </Button>
          <Button variant="outlined" color="primary" onClick={handleGoHome}>
            Go to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Unauthorized;
