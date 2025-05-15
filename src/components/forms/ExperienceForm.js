import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Grid,
  Typography,
  Divider,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  FormControlLabel,
  Checkbox,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import WorkIcon from '@mui/icons-material/Work';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { generateJobDescription } from '../../services/aiService';

const defaultExperience = {
  title: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
};

// Date formatting helper functions
const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  return dateString;
};

const formatDateFromPicker = (date) => {
  if (!date) return '';
  return dayjs(date).format('MM/YYYY');
};

// Helper to generate a fallback description
const generateFallbackDescription = (title, duration) => {
  return `As a ${
    title || 'professional'
  }, I utilized my skills and experience for ${
    duration || 'the duration of my employment'
  }. I worked on various projects and contributed to the success of the team and organization.`;
};

const ExperienceForm = ({ data, onChange }) => {
  // Local Storage'dan taslak verileri alma
  useEffect(() => {
    const loadDraftData = () => {
      try {
        const savedResumeData = localStorage.getItem('savedResume');
        if (savedResumeData) {
          const parsedData = JSON.parse(savedResumeData);
          console.log('Checking localStorage for experience data:', parsedData);

          // Eğer localStorage'da deneyim verisi varsa ve form boşsa, otomatik doldur
          if (
            parsedData.experience &&
            parsedData.experience.length > 0 &&
            (!data || data.length === 0)
          ) {
            console.log('Loading experience data from localStorage draft');
            setExperienceList(parsedData.experience);
            onChange(parsedData.experience);
          }
        }
      } catch (error) {
        console.error(
          'Error loading draft experience data from localStorage:',
          error
        );
      }
    };

    loadDraftData();
  }, [data, onChange]);

  // States
  const [experienceList, setExperienceList] = useState(data || []);
  const [currentExperience, setCurrentExperience] = useState(defaultExperience);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isAdding, setIsAdding] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Add new work experience
  const handleAddExperience = () => {
    setCurrentExperience(defaultExperience);
    setIsAdding(true);
    setEditingIndex(-1);
  };

  // Edit existing work experience
  const handleEditExperience = (index) => {
    setCurrentExperience(experienceList[index]);
    setEditingIndex(index);
    setIsAdding(true);
  };

  // Delete work experience
  const handleDeleteExperience = (index) => {
    const updatedList = [...experienceList];
    updatedList.splice(index, 1);
    setExperienceList(updatedList);
    onChange(updatedList);
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentExperience((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // If "currently working here" is checked, clear the end date
      ...(name === 'current' && checked ? { endDate: '' } : {}),
    }));
  };

  // Handle date changes
  const handleDateChange = (name, date) => {
    setCurrentExperience((prev) => ({
      ...prev,
      [name]: formatDateFromPicker(date),
    }));
  };

  // Close alert
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  // Generate AI suggestion for description
  const generateAIDescription = async () => {
    setIsGeneratingDescription(true);

    try {
      // Extract needed information
      const { title, company, startDate, endDate, current, description } =
        currentExperience;

      // Calculate duration
      let duration = 'some time';
      if (startDate) {
        const start = dayjs(startDate, 'MM/YYYY');
        const end = current
          ? dayjs()
          : endDate
          ? dayjs(endDate, 'MM/YYYY')
          : null;

        if (end) {
          const years = end.diff(start, 'year');
          const months = end.diff(start, 'month') % 12;

          if (years > 0 && months > 0) {
            duration = `${years} year${
              years > 1 ? 's' : ''
            } and ${months} month${months > 1 ? 's' : ''}`;
          } else if (years > 0) {
            duration = `${years} year${years > 1 ? 's' : ''}`;
          } else if (months > 0) {
            duration = `${months} month${months > 1 ? 's' : ''}`;
          }
        }
      }

      // Log request parameters for debugging
      console.log('AI Job Description Request:', {
        jobTitle: title,
        duration,
        currentDescription: description,
      });

      // Get AI generated description using the imported function from aiService
      const newDescription = await generateJobDescription({
        jobTitle: title,
        duration,
        currentDescription: description,
        companyName: company,
      });

      console.log('AI Job Description Result:', newDescription);

      // Update the experience state with the new description
      setCurrentExperience((prev) => ({
        ...prev,
        description: newDescription,
      }));

      setAlert({
        open: true,
        message: 'AI suggestion applied successfully!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Failed to generate AI description:', error);

      // Use fallback if API fails
      const { title, startDate, endDate, current } = currentExperience;
      let duration = 'some time';

      if (startDate) {
        const start = dayjs(startDate, 'MM/YYYY');
        const end = current
          ? dayjs()
          : endDate
          ? dayjs(endDate, 'MM/YYYY')
          : null;

        if (end) {
          const years = end.diff(start, 'year');
          const months = end.diff(start, 'month') % 12;

          if (years > 0 && months > 0) {
            duration = `${years} year${
              years > 1 ? 's' : ''
            } and ${months} month${months > 1 ? 's' : ''}`;
          } else if (years > 0) {
            duration = `${years} year${years > 1 ? 's' : ''}`;
          } else if (months > 0) {
            duration = `${months} month${months > 1 ? 's' : ''}`;
          }
        }
      }

      const fallbackDescription = generateFallbackDescription(title, duration);

      setCurrentExperience((prev) => ({
        ...prev,
        description: fallbackDescription,
      }));

      setAlert({
        open: true,
        message: 'Using offline AI suggestion due to connectivity issues.',
        severity: 'warning',
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  // Save work experience
  const handleSaveExperience = () => {
    const updatedList = [...experienceList];

    if (editingIndex >= 0) {
      // Update existing experience
      updatedList[editingIndex] = currentExperience;
    } else {
      // Add new experience
      updatedList.push(currentExperience);
    }

    setExperienceList(updatedList);
    setIsAdding(false);
    setEditingIndex(-1);
    setCurrentExperience(defaultExperience);
    onChange(updatedList);
  };

  // Cancel
  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(-1);
    setCurrentExperience(defaultExperience);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Work Experience
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Add your work experiences. List them starting with the most recent
        position.
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* List of existing work experiences */}
      {experienceList.length > 0 ? (
        <Box sx={{ mb: 3 }}>
          {experienceList.map((experience, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="h6" component="div">
                      {experience.title}{' '}
                      {experience.company && `@ ${experience.company}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {experience.location}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {formatDateForDisplay(experience.startDate)} -{' '}
                      {experience.current
                        ? 'Present'
                        : formatDateForDisplay(experience.endDate)}
                    </Typography>
                    {experience.description && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {experience.description}
                      </Typography>
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'flex-start',
                    }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() => handleEditExperience(index)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteExperience(index)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          No work experience added yet.
        </Typography>
      )}

      {!isAdding && (
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddExperience}
          sx={{ mb: 3 }}
        >
          Add Work Experience
        </Button>
      )}

      {/* Work experience add/edit form */}
      {isAdding && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Card sx={{ mb: 3, p: 2, bgcolor: 'background.paper' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WorkIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {editingIndex >= 0
                    ? 'Edit Work Experience'
                    : 'New Work Experience'}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Position/Title"
                    name="title"
                    value={currentExperience.title}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                    helperText="E.g.: Software Developer, Project Manager"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company/Organization"
                    name="company"
                    value={currentExperience.company}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                    helperText="Name of the company or organization"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={currentExperience.location}
                    onChange={handleInputChange}
                    margin="normal"
                    helperText="City, Country"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Start Date"
                    views={['month', 'year']}
                    value={
                      currentExperience.startDate
                        ? dayjs(currentExperience.startDate, 'MM/YYYY')
                        : null
                    }
                    onChange={(date) => handleDateChange('startDate', date)}
                    format="MM/YYYY"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: 'normal',
                        required: true,
                        helperText: 'Select start month and year',
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="End Date"
                    views={['month', 'year']}
                    value={
                      currentExperience.endDate
                        ? dayjs(currentExperience.endDate, 'MM/YYYY')
                        : null
                    }
                    onChange={(date) => handleDateChange('endDate', date)}
                    format="MM/YYYY"
                    disabled={currentExperience.current}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: 'normal',
                        required: !currentExperience.current,
                        helperText: currentExperience.current
                          ? 'Not applicable (current position)'
                          : 'Select end month and year',
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={currentExperience.current || false}
                        onChange={handleInputChange}
                        name="current"
                      />
                    }
                    label="I currently work here"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1">Description</Typography>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={
                          isGeneratingDescription ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <AutoFixHighIcon />
                          )
                        }
                        onClick={generateAIDescription}
                        disabled={
                          isGeneratingDescription ||
                          !currentExperience.title ||
                          !currentExperience.startDate
                        }
                        sx={{
                          textTransform: 'uppercase',
                          fontWeight: 'bold',
                          borderRadius: '4px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          py: 0.5,
                          px: 1.5,
                        }}
                      >
                        AI Suggest
                      </Button>
                    </Box>
                    <TextField
                      fullWidth
                      name="description"
                      value={currentExperience.description}
                      onChange={handleInputChange}
                      margin="normal"
                      multiline
                      rows={4}
                      helperText="Describe your responsibilities, achievements, and skills used"
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSaveExperience}
                disabled={
                  !currentExperience.title ||
                  !currentExperience.company ||
                  !currentExperience.startDate ||
                  (!currentExperience.current && !currentExperience.endDate)
                }
              >
                Save
              </Button>
            </CardActions>
          </Card>
        </LocalizationProvider>
      )}

      {/* Alert for AI suggestions */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExperienceForm;
