import React, { useState, useEffect } from 'react';
import { Box, TextField, Grid, Typography, Divider } from '@mui/material';

const PersonalInfoForm = ({ data, onChange }) => {
  // Load draft data from localStorage
  useEffect(() => {
    const loadDraftData = () => {
      try {
        const savedResumeData = localStorage.getItem('savedResume');
        if (savedResumeData) {
          const parsedData = JSON.parse(savedResumeData);
          console.log(
            'Checking localStorage for personal info data:',
            parsedData
          );

          // If there is personal info data in localStorage and the form is empty, automatically fill it
          if (
            parsedData.personalInfo &&
            (!data || Object.keys(data).length === 0 || !data.fullName)
          ) {
            console.log('Loading personal info data from localStorage draft');
            onChange(parsedData.personalInfo);
          }
        }
      } catch (error) {
        console.error(
          'Error loading draft personal info data from localStorage:',
          error
        );
      }
    };

    loadDraftData();
  }, [data, onChange]);

  // Create a copy of the data (to prevent mutation)
  const formData = { ...data };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    onChange(updatedData);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Personal Information
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Enter your basic information that will be displayed at the top of your
        resume.
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName || ''}
            onChange={handleChange}
            margin="normal"
            required
            helperText="Enter your full name"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Job Title / Position"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            margin="normal"
            helperText="E.g., Software Developer, Graphic Designer, etc."
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
            margin="normal"
            required
            helperText="Your email address for contact"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            margin="normal"
            helperText="Your phone number for contact"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            margin="normal"
            helperText="City, Country (e.g., New York, USA)"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="LinkedIn"
            name="linkedin"
            value={formData.linkedin || ''}
            onChange={handleChange}
            margin="normal"
            helperText="Your LinkedIn profile (e.g., linkedin.com/in/username)"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Website"
            name="website"
            value={formData.website || ''}
            onChange={handleChange}
            margin="normal"
            helperText="Your personal website (if any)"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonalInfoForm;
