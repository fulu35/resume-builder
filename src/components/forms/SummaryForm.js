import React, { useState } from 'react';
import {
  Box,
  TextField,
  Grid,
  Typography,
  Divider,
  Button,
  CircularProgress,
  Paper,
  Alert,
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { generateResumeSummary } from '../../services/aiService';

const SummaryForm = ({ data, onChange }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Extract relevant data
  const personalInfo = data.personalInfo || {};
  const skills = data.skills?.skills || [];
  const experiences = data.experience || [];

  // Keep a local copy of the summary
  const [summary, setSummary] = useState(personalInfo.summary || '');

  const handleChange = (e) => {
    const { value } = e.target;
    setSummary(value);

    // Update the summary in personalInfo
    const updatedPersonalInfo = { ...personalInfo, summary: value };
    onChange({ ...data, personalInfo: updatedPersonalInfo });
  };

  const handleGenerateSummary = async () => {
    // Validate if we have enough information to generate a summary
    if (!personalInfo.title) {
      alert(
        'Please add your job title in the Personal Information section first'
      );
      return;
    }

    setIsGenerating(true);
    try {
      // Use the AI service to generate summary, passing current summary and skills
      const generatedSummary = await generateResumeSummary({
        title: personalInfo.title,
        currentSummary: summary,
        skills: skills,
      });

      // Update local state and form data
      setSummary(generatedSummary);

      // Update the summary in personalInfo
      const updatedPersonalInfo = {
        ...personalInfo,
        summary: generatedSummary,
      };
      onChange({ ...data, personalInfo: updatedPersonalInfo });
    } catch (error) {
      console.error('Error generating summary:', error);
      alert(`Failed to generate summary: ${error.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Professional Summary
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Create a compelling professional summary that highlights your expertise
        and career objectives. This appears at the top of your resume and makes
        a strong first impression.
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {(!personalInfo.fullName || !personalInfo.title) && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Complete your personal information first with at least your name and
          job title to get better summary suggestions.
        </Alert>
      )}

      {experiences.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Adding your work experiences will help us generate a more tailored
          professional summary.
        </Alert>
      )}

      <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6">Professional Summary</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGenerateSummary}
                  disabled={isGenerating || !personalInfo.title}
                  startIcon={
                    isGenerating ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <AutoFixHighIcon />
                    )
                  }
                >
                  {isGenerating
                    ? 'Generating...'
                    : summary
                    ? 'Improve Summary'
                    : 'AI Suggest'}
                </Button>
              </Box>

              <TextField
                fullWidth
                name="summary"
                value={summary}
                onChange={handleChange}
                multiline
                rows={5}
                placeholder="Write a professional summary that highlights your skills, experience, and career achievements..."
                helperText="A strong summary should be 2-3 sentences that highlight your professional identity and value proposition."
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Tips for a Great Professional Summary
        </Typography>
        <ul>
          <li>Keep it concise (2-3 sentences)</li>
          <li>Highlight your years of experience and key specialties</li>
          <li>Mention your biggest achievements</li>
          <li>Tailor it to the job you're applying for</li>
          <li>Avoid clichés and focus on specific value you bring</li>
        </ul>
      </Box>
    </Box>
  );
};

export default SummaryForm;
