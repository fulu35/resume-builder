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
import SchoolIcon from '@mui/icons-material/School';

const defaultEducation = {
  institution: '',
  degree: '',
  field: '',
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
  // Format as MM/YYYY
  return date.format('MM/YYYY');
};

const EducationForm = ({ data, onChange }) => {
  // States
  const [educationList, setEducationList] = useState(data || []);
  const [currentEducation, setCurrentEducation] = useState(defaultEducation);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isAdding, setIsAdding] = useState(false);

  // Local Storage'dan taslak verileri alma - runs only on mount
  useEffect(() => {
    const loadDraftData = () => {
      try {
        const savedResumeData = localStorage.getItem('savedResume');
        if (savedResumeData) {
          const parsedData = JSON.parse(savedResumeData);
          console.log('Checking localStorage for education data:', parsedData);

          // Load education data from localStorage if it exists
          if (parsedData.education && parsedData.education.length > 0) {
            console.log('Loading education data from localStorage draft');
            setEducationList(parsedData.education);
            onChange(parsedData.education);
          }
        }
      } catch (error) {
        console.error(
          'Error loading draft education data from localStorage:',
          error
        );
      }
    };

    loadDraftData();
  }, []); // Empty dependency array - run only on mount

  // Update local state when data prop changes
  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      console.log('Education data changed from parent:', data);
      setEducationList(data);
    }
  }, [data]);

  // Add new education
  const handleAddEducation = () => {
    setCurrentEducation(defaultEducation);
    setIsAdding(true);
    setEditingIndex(-1);
  };

  // Edit existing education
  const handleEditEducation = (index) => {
    setCurrentEducation(educationList[index]);
    setEditingIndex(index);
    setIsAdding(true);
  };

  // Delete education
  const handleDeleteEducation = (index) => {
    const updatedList = [...educationList];
    updatedList.splice(index, 1);
    setEducationList(updatedList);
    onChange(updatedList);
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentEducation((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // If "currently studying here" is checked, clear the end date
      ...(name === 'current' && checked ? { endDate: '' } : {}),
    }));
  };

  // Handle date changes
  const handleDateChange = (name, date) => {
    setCurrentEducation((prev) => ({
      ...prev,
      [name]: formatDateFromPicker(date),
    }));
  };

  // Save education
  const handleSaveEducation = () => {
    const updatedList = [...educationList];

    if (editingIndex >= 0) {
      // Update existing education
      updatedList[editingIndex] = currentEducation;
    } else {
      // Add new education
      updatedList.push(currentEducation);
    }

    setEducationList(updatedList);
    setIsAdding(false);
    setEditingIndex(-1);
    setCurrentEducation(defaultEducation);
    onChange(updatedList);
  };

  // Cancel
  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(-1);
    setCurrentEducation(defaultEducation);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Education
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Add your educational background, including degrees, certificates, or
        courses. List them starting with the most recent qualification.
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* List of existing education entries */}
      {educationList.length > 0 ? (
        <Box sx={{ mb: 3 }}>
          {educationList.map((education, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="h6" component="div">
                      {education.degree}{' '}
                      {education.field && `in ${education.field}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {education.institution}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {formatDateForDisplay(education.startDate)} -{' '}
                      {education.current
                        ? 'Present'
                        : formatDateForDisplay(education.endDate)}
                    </Typography>
                    {education.description && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {education.description}
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
                      onClick={() => handleEditEducation(index)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteEducation(index)}
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
          No education added yet.
        </Typography>
      )}

      {!isAdding && (
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddEducation}
          sx={{ mb: 3 }}
        >
          Add Education
        </Button>
      )}

      {/* Education add/edit form */}
      {isAdding && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Card sx={{ mb: 3, p: 2, bgcolor: 'background.paper' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {editingIndex >= 0 ? 'Edit Education' : 'New Education'}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Institution"
                    name="institution"
                    value={currentEducation.institution}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                    helperText="School, college, or university name"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Degree"
                    name="degree"
                    value={currentEducation.degree}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                    helperText="E.g.: Bachelor's, Master's, Certificate"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Field of Study"
                    name="field"
                    value={currentEducation.field}
                    onChange={handleInputChange}
                    margin="normal"
                    helperText="E.g.: Computer Science, Business"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Start Date"
                    views={['month', 'year']}
                    value={
                      currentEducation.startDate
                        ? dayjs(currentEducation.startDate, 'MM/YYYY')
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
                      currentEducation.endDate
                        ? dayjs(currentEducation.endDate, 'MM/YYYY')
                        : null
                    }
                    onChange={(date) => handleDateChange('endDate', date)}
                    format="MM/YYYY"
                    disabled={currentEducation.current}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: 'normal',
                        required: !currentEducation.current,
                        helperText: currentEducation.current
                          ? 'Not applicable (current studies)'
                          : 'Select end month and year',
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={currentEducation.current || false}
                        onChange={handleInputChange}
                        name="current"
                      />
                    }
                    label="I am currently studying here"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={currentEducation.description}
                    onChange={handleInputChange}
                    margin="normal"
                    multiline
                    rows={4}
                    helperText="Additional information about your education (e.g., achievements, activities)"
                  />
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
                onClick={handleSaveEducation}
                disabled={
                  !currentEducation.institution ||
                  !currentEducation.degree ||
                  !currentEducation.startDate ||
                  (!currentEducation.current && !currentEducation.endDate)
                }
              >
                Save
              </Button>
            </CardActions>
          </Card>
        </LocalizationProvider>
      )}
    </Box>
  );
};

export default EducationForm;
