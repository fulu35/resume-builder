import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// Component for protected routes
export default function PrivateRoute({ children }) {
  const { currentUser, loading } = useFirebase();

  // If Firebase user is loading, show loading
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // If user is not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/" />;
  }

  // If user is logged in, show the content
  return children;
}
