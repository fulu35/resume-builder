import React from 'react';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

export default function NotFound() {
  return (
    <Container maxWidth="md">
      <Box
        my={8}
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
      >
        <SentimentDissatisfiedIcon
          color="primary"
          sx={{ fontSize: 100, mb: 2 }}
        />
        <Typography variant="h2" component="h1" gutterBottom>
          404 - Page Not Found
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          The page you are looking for does not exist. It may have been moved or deleted.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          startIcon={<HomeIcon />}
          sx={{ mt: 3 }}
        >
          Go to Home Page
        </Button>
      </Box>
    </Container>
  );
}
