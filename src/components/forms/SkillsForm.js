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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  Code as CodeIcon,
  Translate as TranslateIcon,
  Add as AddIcon,
  AutoFixHigh as AutoFixHighIcon,
} from '@mui/icons-material';
import { generateSkillsSuggestions } from '../../services/aiService';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

// Keep language levels
const languageLevels = [
  { value: 'Basic', label: 'Basic' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Fluent', label: 'Fluent' },
  { value: 'Native', label: 'Native' },
];

// Maximum number of skills allowed
const MAX_SKILLS = 15;
// Maximum number of skills to add at once from AI suggestions
const MAX_AI_SKILLS_TO_ADD = 4;

const SkillsForm = ({ data, onChange }) => {
  // Set initial state from data, filtering out any empty or invalid skills
  const [skills, setSkills] = useState(() => {
    // Filter out any empty/invalid skills from the initial data
    const initialSkills = data.skills || [];
    const validSkills = initialSkills.filter(
      (skill) => skill && skill.name && skill.name.trim() !== ''
    );
    console.log(
      'Initial skills count:',
      initialSkills.length,
      'Valid skills count:',
      validSkills.length
    );
    return validSkills;
  });
  const [languages, setLanguages] = useState(data.languages || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiStatus, setAiStatus] = useState('');

  // Load resume data from localStorage if needed
  const getResumeDataFromStorage = () => {
    try {
      // Get real-time data from localStorage
      const savedResumeData = localStorage.getItem('savedResume');
      if (savedResumeData) {
        const parsedData = JSON.parse(savedResumeData);
        console.log('Successfully loaded data from localStorage:', parsedData);

        // If current form data has job titles but localStorage doesn't, merge them
        if (
          data &&
          (!parsedData.personalInfo || !parsedData.personalInfo.title)
        ) {
          if (data.personalInfo && data.personalInfo.title) {
            console.log('Merging personalInfo.title from form data');
            if (!parsedData.personalInfo) parsedData.personalInfo = {};
            parsedData.personalInfo.title = data.personalInfo.title;
          }
        }

        // If current form data has experience but localStorage doesn't, merge them
        if (data && data.experience && data.experience.length > 0) {
          if (!parsedData.experience || parsedData.experience.length === 0) {
            console.log('Merging experience data from form data');
            parsedData.experience = data.experience;
          }
        }

        return parsedData;
      }
    } catch (error) {
      console.error('Error loading resume data from storage:', error);
    }

    // If localStorage is empty but we have form data, use that
    if (data && (data.personalInfo || data.experience)) {
      console.log('Using current form data as fallback');
      return data;
    }

    return null;
  };

  // Get job title from localStorage saved resume data
  const getJobTitleFromStorage = () => {
    const resumeData = getResumeDataFromStorage();
    if (!resumeData) return '';

    // First try to get job title from personal info
    if (resumeData.personalInfo && resumeData.personalInfo.title) {
      return resumeData.personalInfo.title.trim();
    }

    // Then try to get from experience - prefer current position
    if (resumeData.experience && resumeData.experience.length > 0) {
      // Try to find current position first
      const currentJob = resumeData.experience.find(
        (job) => job.current === true
      );
      if (currentJob && currentJob.jobTitle) {
        return currentJob.jobTitle.trim();
      }

      // Otherwise use the first position
      if (resumeData.experience[0].jobTitle) {
        return resumeData.experience[0].jobTitle.trim();
      }
    }

    return '';
  };

  // Get all job titles from localStorage saved resume data
  const getAllJobTitlesFromStorage = () => {
    const resumeData = getResumeDataFromStorage();
    if (!resumeData) return [];

    const titles = [];

    // Add title from personal info
    if (resumeData.personalInfo && resumeData.personalInfo.title) {
      titles.push(resumeData.personalInfo.title.trim());
    }

    // Add titles from experience
    if (resumeData.experience && resumeData.experience.length > 0) {
      resumeData.experience.forEach((job) => {
        if (job.jobTitle && job.jobTitle.trim() !== '') {
          titles.push(job.jobTitle.trim());
        }
      });
    }

    // Remove duplicates
    return [...new Set(titles)];
  };

  // Add debug logging for skills changes
  useEffect(() => {
    console.log('Current skills count:', skills.length, 'Skills:', skills);
  }, [skills]);

  // Form states for new skill and language
  const [newSkill, setNewSkill] = useState({ name: '' });
  const [newLanguage, setNewLanguage] = useState({ name: '', level: '' });

  // Add a manual job title input field for generating skills
  const [manualJobTitle, setManualJobTitle] = useState('');

  // Add skill - ensure validation
  const handleAddSkill = () => {
    if (!newSkill.name || newSkill.name.trim() === '') return;

    // Check if at the maximum limit with valid skills only
    const validSkills = skills.filter(
      (skill) => skill && skill.name && skill.name.trim() !== ''
    );
    if (validSkills.length >= MAX_SKILLS) {
      toast.warning(
        `You've reached the maximum limit of ${MAX_SKILLS} skills. Please remove some before adding more.`
      );
      return;
    }

    const updatedSkills = [
      ...validSkills,
      { id: uuidv4(), name: newSkill.name.trim() },
    ];
    setSkills(updatedSkills);
    setNewSkill({ name: '' });

    // Notify parent component
    onChange({ skills: updatedSkills, languages });
  };

  // Add language
  const handleAddLanguage = () => {
    if (!newLanguage.name) return;

    const updatedLanguages = [...languages, newLanguage];
    setLanguages(updatedLanguages);
    setNewLanguage({ name: '', level: '' });

    // Notify parent component
    onChange({ skills, languages: updatedLanguages });
  };

  // Delete skill
  const handleDeleteSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);

    // Notify parent component
    onChange({ skills: updatedSkills, languages });
  };

  // Delete language
  const handleDeleteLanguage = (index) => {
    const updatedLanguages = [...languages];
    updatedLanguages.splice(index, 1);
    setLanguages(updatedLanguages);

    // Notify parent component
    onChange({ skills, languages: updatedLanguages });
  };

  // Handle skill form change
  const handleSkillChange = (e) => {
    const { name, value } = e.target;
    setNewSkill((prev) => ({ ...prev, [name]: value }));
  };

  // Handle language form change
  const handleLanguageChange = (e) => {
    const { name, value } = e.target;
    setNewLanguage((prev) => ({ ...prev, [name]: value }));
  };

  // Modify the function to use manual job title input
  const handleGenerateSkills = async () => {
    setIsGenerating(true);
    setAiStatus('Finding job title from your resume...');
    try {
      // Filter out invalid skills first
      const validSkills = skills.filter(
        (skill) => skill && skill.name && skill.name.trim() !== ''
      );
      console.log('Valid skills before generating:', validSkills.length);

      // Check if at the maximum limit
      if (validSkills.length >= MAX_SKILLS) {
        setIsGenerating(false);
        setAiStatus('');
        toast.warning(
          `You've reached the maximum limit of ${MAX_SKILLS} skills.`
        );
        return;
      }

      // Calculate how many skills can still be added
      const availableSlots = MAX_SKILLS - validSkills.length;

      // Get job title from localStorage
      const jobTitle = getJobTitleFromStorage();
      const allJobTitles = getAllJobTitlesFromStorage();

      console.log('Job title from storage:', jobTitle);
      console.log('All job titles from storage:', allJobTitles);

      // If no job title found, show a message
      if (!jobTitle) {
        toast.info(
          'No job title found. Please add a job title in Personal Info or Work Experience sections first.'
        );
        setIsGenerating(false);
        setAiStatus('');
        return;
      }

      // Prepare existing skills list to pass to AI
      const existingSkillNames = validSkills.map((skill) => skill.name);

      // Request skills suggestions
      setAiStatus(`Generating skills for "${jobTitle}"...`);
      console.log('Requesting skills for:', jobTitle);

      // Pass the job title, all titles, and existing skills for context
      const suggestedSkills = await generateSkillsSuggestions(
        jobTitle,
        allJobTitles,
        existingSkillNames
      );

      console.log('Received suggested skills:', suggestedSkills);

      // Don't proceed if no skills were returned
      if (!Array.isArray(suggestedSkills) || suggestedSkills.length === 0) {
        toast.error(
          'Could not generate skills for your job title. Please add job information in personal info or experience sections.'
        );
        setIsGenerating(false);
        setAiStatus('');
        return;
      }

      setAiStatus('Processing skills suggestions...');

      // Filter out skills that are already in the list
      const existingSkills = validSkills.map((s) => s.name.toLowerCase());
      const newSkills = suggestedSkills.filter(
        (skill) => !existingSkills.includes(skill.toLowerCase())
      );

      // Add new skills to the list, limited by both available slots and MAX_AI_SKILLS_TO_ADD
      if (newSkills.length > 0) {
        const skillsToAdd = newSkills
          .slice(0, Math.min(availableSlots, MAX_AI_SKILLS_TO_ADD))
          .map((skill) => ({ id: uuidv4(), name: skill }));

        const updatedSkills = [...validSkills, ...skillsToAdd];

        setSkills(updatedSkills);
        onChange({ skills: updatedSkills, languages });
      } else {
        // toast.info('All suggested skills are already in your list. Try removing some existing skills for new suggestions.');
      }
    } catch (error) {
      console.error('Error generating skills:', error);
      toast.error('Failed to generate skills.');
    } finally {
      setIsGenerating(false);
      setAiStatus('');
    }
  };

  // Add a handleManualJobTitleChange function
  const handleManualJobTitleChange = (e) => {
    setManualJobTitle(e.target.value);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Skills and Languages
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Add your technical skills and languages.
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Skills Section */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CodeIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Skills</Typography>
            {(() => {
              const validSkillsCount = skills.filter(
                (skill) => skill && skill.name && skill.name.trim() !== ''
              ).length;
              return (
                <Typography
                  variant="subtitle2"
                  sx={{
                    ml: 2,
                    fontWeight: 'bold',
                    color:
                      validSkillsCount >= MAX_SKILLS
                        ? 'error.main'
                        : validSkillsCount >= MAX_SKILLS - 3
                        ? 'warning.main'
                        : 'text.secondary',
                    border:
                      validSkillsCount >= MAX_SKILLS ? '1px solid' : 'none',
                    borderColor: 'error.main',
                    borderRadius: '4px',
                    px: validSkillsCount >= MAX_SKILLS ? 1 : 0,
                    py: validSkillsCount >= MAX_SKILLS ? 0.5 : 0,
                  }}
                >
                  {validSkillsCount}/{MAX_SKILLS}
                </Typography>
              );
            })()}
          </Box>

          <Button
            variant="outlined"
            size="medium"
            startIcon={
              isGenerating ? (
                <CircularProgress size={20} />
              ) : (
                <AutoFixHighIcon />
              )
            }
            onClick={handleGenerateSkills}
            disabled={
              isGenerating ||
              skills.filter(
                (skill) => skill && skill.name && skill.name.trim() !== ''
              ).length >= MAX_SKILLS
            }
            color={
              isGenerating
                ? 'secondary'
                : skills.filter(
                    (skill) => skill && skill.name && skill.name.trim() !== ''
                  ).length >= MAX_SKILLS
                ? 'error'
                : 'primary'
            }
          >
            {isGenerating
              ? 'Generating...'
              : skills.filter(
                  (skill) => skill && skill.name && skill.name.trim() !== ''
                ).length >= MAX_SKILLS
              ? 'Max Skills Reached'
              : 'AI Suggest Technical Skills'}
          </Button>
        </Box>

        {aiStatus && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mb: 2 }}
          >
            {aiStatus}
          </Typography>
        )}

        {/* Skills list */}
        <Box sx={{ mb: 2 }}>
          {skills.filter(
            (skill) => skill && skill.name && skill.name.trim() !== ''
          ).length > 0 ? (
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              sx={{ mb: 2 }}
            >
              {skills.map((skill, index) =>
                skill && skill.name && skill.name.trim() !== '' ? (
                  <Chip
                    key={index}
                    label={skill.name}
                    onDelete={() => handleDeleteSkill(index)}
                    sx={{ m: 0.5 }}
                    color="primary"
                    variant="outlined"
                  />
                ) : null
              )}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No skills added yet.
            </Typography>
          )}
        </Box>

        {/* New skill form - disabled when at limit */}
        <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
          <CardContent>
            <TextField
              fullWidth
              label="Skill Name"
              name="name"
              value={newSkill.name}
              onChange={handleSkillChange}
              placeholder="Ex: JavaScript, Photoshop, Project Management"
              disabled={
                skills.filter(
                  (skill) => skill && skill.name && skill.name.trim() !== ''
                ).length >= MAX_SKILLS
              }
            />
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddSkill}
              disabled={
                !newSkill.name ||
                skills.filter(
                  (skill) => skill && skill.name && skill.name.trim() !== ''
                ).length >= MAX_SKILLS
              }
            >
              Add Skill
            </Button>
          </CardActions>
        </Card>
      </Box>

      {/* Languages Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TranslateIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Languages</Typography>
        </Box>

        {/* Languages list */}
        <Box sx={{ mb: 2 }}>
          {languages.length > 0 ? (
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              sx={{ mb: 2 }}
            >
              {languages.map((language, index) => (
                <Chip
                  key={index}
                  label={`${language.name}${
                    language.level ? ` (${language.level})` : ''
                  }`}
                  onDelete={() => handleDeleteLanguage(index)}
                  sx={{ m: 0.5 }}
                  color="secondary"
                  variant="outlined"
                />
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No languages added yet.
            </Typography>
          )}
        </Box>

        {/* New language form */}
        <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Language"
                  name="name"
                  value={newLanguage.name}
                  onChange={handleLanguageChange}
                  placeholder="Ex: English, Spanish, French"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="language-level-label">Level</InputLabel>
                  <Select
                    labelId="language-level-label"
                    name="level"
                    value={newLanguage.level}
                    onChange={handleLanguageChange}
                    label="Level"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {languageLevels.map((level) => (
                      <MenuItem key={level.value} value={level.value}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={handleAddLanguage}
              disabled={!newLanguage.name}
            >
              Add Language
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Box>
  );
};

export default SkillsForm;
