import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// Component for public routes that should redirect to dashboard if user is authenticated
export default function PublicRoute({ children }) {
  const { currentUser, loading } = useFirebase();

  // Show loading while checking Firebase user
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

  // If user is authenticated, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }

  // If user is not authenticated, show the public content
  return children;
}
