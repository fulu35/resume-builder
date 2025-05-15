import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';
import { resumeTemplates, getTemplateById } from '../templates';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { validateFormData } from '../utils/validation';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// MUI bileşenleri
import {
  Container,
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from '@mui/material';

// MUI ikonları
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import GetAppIcon from '@mui/icons-material/GetApp';

// Form bileşenleri (daha sonra oluşturulacak)
import PersonalInfoForm from '../components/forms/PersonalInfoForm';
import EducationForm from '../components/forms/EducationForm';
import ExperienceForm from '../components/forms/ExperienceForm';
import SkillsForm from '../components/forms/SkillsForm';
import AdditionalInfoForm from '../components/forms/AdditionalInfoForm';
import SummaryForm from '../components/forms/SummaryForm';
import TemplateSelector from '../components/TemplateSelector';

// Form adımları
const steps = [
  'Personal Information',
  'Education',
  'Experience',
  'Skills',
  'Additional Information',
  'Professional Summary',
  'Template Selection',
];

export default function ResumeBuilder() {
  // const { currentUser } = useAuth();
  const { currentUser } = useFirebase();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const resumeId = queryParams.get('id');
  const stepParam = queryParams.get('step');

  const { saveResume, updateResume, getUserProfile } = useFirebase();

  // Initialize step from URL parameter or default to 0
  const initialStep = stepParam ? parseInt(stepParam, 10) : 0;
  const [activeStep, setActiveStep] = useState(initialStep);

  // Update localStorage when active step changes
  useEffect(() => {
    localStorage.setItem('builderState', JSON.stringify({ activeStep }));
  }, [activeStep]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    personalInfo: {},
    education: [],
    experience: [],
    skills: { skills: [], languages: [] },
    additionalInfo: { projects: [], certifications: [], references: [] },
    selectedTemplateId: null,
  });
  const resumeRef = useRef(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Sayfa yüklendiğinde localStorage'dan taslak verileri alma
  useEffect(() => {
    const loadDraftFromLocalStorage = () => {
      try {
        const savedResumeData = localStorage.getItem('savedResume');
        if (savedResumeData) {
          const parsedData = JSON.parse(savedResumeData);
          console.log('Found saved resume draft in localStorage:', parsedData);

          // Always use localStorage data as the source of truth
          setFormData((prevData) => {
            // Create a complete merged object with localStorage data taking priority
            const mergedData = {
              ...prevData, // Start with current formData as base
              ...parsedData, // Override with localStorage data
              // Ensure all arrays are properly copied from localStorage if they exist
              education: parsedData.education || prevData.education || [],
              experience: parsedData.experience || prevData.experience || [],
              skills: parsedData.skills ||
                prevData.skills || { skills: [], languages: [] },
              additionalInfo: parsedData.additionalInfo ||
                prevData.additionalInfo || {
                  projects: [],
                  certifications: [],
                  references: [],
                },
              personalInfo: {
                ...(prevData.personalInfo || {}),
                ...(parsedData.personalInfo || {}),
              },
            };

            console.log('Using merged data from localStorage:', mergedData);
            return mergedData;
          });
        }
      } catch (error) {
        console.error('Error loading resume draft from localStorage:', error);
      }
    };

    loadDraftFromLocalStorage();
  }, []);

  useEffect(() => {
    console.log('Current User:', currentUser);
    const fetchResumeData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const resumeDoc = await getDoc(doc(db, 'resumes', currentUser.uid));
        if (resumeDoc.exists()) {
          console.log('Fetched Resume Data:', resumeDoc.data());
          setFormData(resumeDoc.data());
        }
      } catch (err) {
        console.error('Error loading resume data:', err);
        setError('An error occurred while loading your resume data.');
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [currentUser]);

  const handleNext = () => {
    const currentStepData = getCurrentStepData();
    const validationErrors = validateFormData(currentStepData, activeStep);

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    if (activeStep === steps.length - 1) {
      handleSaveResume();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleDataChange = (data, step) => {
    console.log('Data Change:', data, 'Step:', step);
    setFormData((prevData) => {
      const newData = { ...prevData };
      switch (step) {
        case 0:
          newData.personalInfo = data;
          break;
        case 1:
          newData.education = data;
          break;
        case 2:
          newData.experience = data;
          break;
        case 3:
          newData.skills = data;
          break;
        case 4:
          newData.additionalInfo = data;
          break;
        case 5:
          // Summary formu için özel işlem - summary bilgisi personalInfo içinde bulunuyor
          return data; // SummaryForm tüm formData'yı güncelleyip geri döndürüyor
        case 6:
          newData.selectedTemplateId = data;
          break;
        default:
          break;
      }
      console.log('Updated Form Data:', newData);

      // Update localStorage with latest data
      try {
        const dataToSave = {
          ...newData,
          id: resumeId || currentUser?.uid || `temp-${Date.now()}`,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('savedResume', JSON.stringify(dataToSave));
        console.log('Real-time localStorage update successful');
      } catch (error) {
        console.error('Error updating localStorage:', error);
      }

      return newData;
    });
  };

  const getCurrentStepData = () => {
    switch (activeStep) {
      case 0:
        return formData.personalInfo;
      case 1:
        return formData.education;
      case 2:
        return formData.experience;
      case 3:
        return formData.skills;
      case 4:
        return formData.additionalInfo;
      case 5:
        return formData; // For the Summary Form, we need the entire formData
      case 6:
        return formData.selectedTemplateId;
      default:
        return null;
    }
  };

  const handleSaveResume = async () => {
    console.log('Save Resume - Current User:', currentUser);

    if (!currentUser || !currentUser.uid) {
      setError('Please log in first.');
      return;
    }

    if (!formData.selectedTemplateId) {
      setError('Please select a template.');
      return;
    }

    try {
      setSaving(true);
      console.log('Saving resume data:', formData);

      // Save to Firebase database
      const userId = currentUser.uid;
      console.log('User ID for save:', userId);

      // Prepare complete resume data for saving (add id and title)
      const resumeToSave = {
        ...formData,
        id: resumeId || userId, // Use existing resumeId or user ID
        title: formData.personalInfo?.fullName || 'Resume',
        updatedAt: new Date().toISOString(),
        userId: userId,
      };

      // Save to Firebase
      await setDoc(doc(db, 'resumes', resumeToSave.id), resumeToSave);

      // Also save to localStorage for preview
      localStorage.setItem('savedResume', JSON.stringify(resumeToSave));

      console.log('Resume saved to Firebase and localStorage');
      toast.success('Resume saved successfully!');
      navigate(`/preview?id=${resumeToSave.id}`);
    } catch (err) {
      console.error('Error saving resume:', err);
      setError('An error occurred while saving your resume. ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    try {
      // First save the current state to localStorage
      const resumeToPreview = {
        ...formData,
        id: resumeId || `temp-${Date.now()}`, // Use existing ID or create a temporary one
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem('savedResume', JSON.stringify(resumeToPreview));

      // Navigate to preview with the ID
      navigate(`/preview?id=${resumeToPreview.id}`);
    } catch (err) {
      console.error('Error preparing preview:', err);
      toast.error('Could not preview resume: ' + err.message);
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  const generatePDF = async () => {
    // First open the preview
    if (!previewOpen) {
      setPreviewOpen(true);
      // Wait for the preview content to render
      toast.info('Preparing preview...');
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    if (!resumeRef.current) {
      toast.error('Could not generate PDF. Content preparation failed.');
      return;
    }

    try {
      setSaving(true);
      toast.info('Generating PDF, please wait...');

      // Wait longer to ensure content is fully rendered
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('Resume Ref content:', resumeRef.current.innerHTML);

      // Check if template component is fully rendered
      if (
        !resumeRef.current.querySelector('.resume-content') ||
        resumeRef.current.querySelector('.resume-content').children.length === 0
      ) {
        toast.error(
          'Could not prepare PDF content. Template content is empty.'
        );
        setSaving(false);
        return;
      }

      const canvas = await html2canvas(resumeRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          console.log('DOM cloned');
          const clonedContent = clonedDoc.querySelector('.resume-content');
          if (clonedContent) {
            console.log('Cloned content:', clonedContent.innerHTML);
          } else {
            console.error('Cloned content not found!');
          }
        },
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(
        imgData,
        'PNG',
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );

      pdf.save(`resume_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success('PDF successfully created!');
    } catch (error) {
      console.error('Error creating PDF:', error);
      toast.error('An error occurred while creating the PDF: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const renderSelectedTemplate = () => {
    if (!formData.selectedTemplateId) {
      return (
        <Box
          sx={{
            p: 4,
            textAlign: 'center',
            border: '1px dashed gray',
            borderRadius: 2,
            bgcolor: '#f5f5f5',
            minHeight: '500px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Please select a template
          </Typography>
          <Typography variant="body1" color="text.secondary">
            To see a preview, you need to select a template in the Template
            Selection step.
          </Typography>
        </Box>
      );
    }

    const template = getTemplateById(formData.selectedTemplateId);
    console.log('Template info:', template);

    if (!template || !template.component) {
      return (
        <Box sx={{ p: 4, textAlign: 'center', color: 'error.main' }}>
          <Typography variant="h5" gutterBottom>
            Template could not be loaded
          </Typography>
          <Typography variant="body1">
            The selected template could not be found or loaded. Please select
            another template.
          </Typography>
        </Box>
      );
    }

    const TemplateComponent = template.component;
    console.log('Template component:', TemplateComponent);
    console.log('Form data for preview:', formData);

    // Now render the template with resumeData prop
    return (
      <Box
        className="resume-content"
        sx={{ p: 1, bgcolor: 'white', minHeight: '297mm' }}
      >
        <TemplateComponent resumeData={formData} />
      </Box>
    );
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <PersonalInfoForm
            data={formData.personalInfo}
            onChange={(data) => handleDataChange(data, step)}
          />
        );
      case 1:
        return (
          <EducationForm
            data={formData.education}
            onChange={(data) => handleDataChange(data, step)}
          />
        );
      case 2:
        return (
          <ExperienceForm
            data={formData.experience}
            onChange={(data) => handleDataChange(data, step)}
          />
        );
      case 3:
        return (
          <SkillsForm
            data={formData.skills}
            onChange={(data) => handleDataChange(data, step)}
          />
        );
      case 4:
        return (
          <AdditionalInfoForm
            data={formData.additionalInfo}
            onChange={(data) => handleDataChange(data, step)}
          />
        );
      case 5:
        return (
          <SummaryForm
            data={formData}
            onChange={(data) => handleDataChange(data, step)}
          />
        );
      case 6:
        return (
          <TemplateSelector
            selectedTemplateId={formData.selectedTemplateId}
            onSelect={(id) => handleDataChange(id, step)}
          />
        );
      default:
        return 'Unknown Step';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mb: 8 }}>
      {error && <Alert severity="error">{error}</Alert>}

      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box
            component="img"
            src="/logo/logo_no_bg.png"
            alt="CareeBootsy Logo"
            sx={{
              height: 48,
              width: 'auto',
              mx: { xs: 'auto', sm: 0 },
              mb: 1,
            }}
          />
          <Box>
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{ mr: 2 }}
            >
              Dashboard
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveResume}
              disabled={saving}
            >
              Save Resume
            </Button>
          </Box>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4 }}>
          {getStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="contained"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>

            <Box>
              {/* Preview butonunu sadece son iki adımda göster */}
              {activeStep >= steps.length - 2 && (
                <Button
                  startIcon={<VisibilityIcon />}
                  onClick={handlePreview}
                  sx={{ mr: 1 }}
                >
                  Preview
                </Button>
              )}

              {/* Download PDF butonunu kaldırdık */}

              <Button
                variant="contained"
                endIcon={
                  saving ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : activeStep === steps.length - 1 ? (
                    <SaveIcon />
                  ) : (
                    <ArrowForwardIcon />
                  )
                }
                onClick={handleNext}
                disabled={saving}
              >
                {activeStep === steps.length - 1 ? 'Save' : 'Next'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Preview Modal */}
      <Dialog
        fullScreen
        open={previewOpen}
        onClose={handleClosePreview}
        aria-labelledby="preview-dialog"
      >
        <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClosePreview}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogContent>
          <Box
            ref={resumeRef}
            sx={{ width: '210mm', margin: '0 auto', bgcolor: 'white' }}
          >
            {renderSelectedTemplate()}
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
