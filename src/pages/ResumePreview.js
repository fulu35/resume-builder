import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';
import { getTemplateById, resumeTemplates } from '../templates';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import TemplateSelector from '../components/TemplateSelector';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';

// MUI components
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Tabs,
  Tab,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from '@mui/material';

// MUI icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloseIcon from '@mui/icons-material/Close';
import ColorLensIcon from '@mui/icons-material/ColorLens';

export default function ResumePreview() {
  // URL parameters
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const resumeId = queryParams.get('id');

  // References
  const resumeRef = useRef(null);

  // Firebase hook
  const { currentUser } = useFirebase();

  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resumeData, setResumeData] = useState(null);
  const [downloadMenuAnchor, setDownloadMenuAnchor] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState('');
  const [pdfMessage, setPdfMessage] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load resume data when the page loads
  useEffect(() => {
    const loadResumeData = async () => {
      try {
        setLoading(true);
        console.log('Resume data is being loaded...', resumeId);

        if (!resumeId) {
          throw new Error(
            'No resume ID specified. Please select a resume to preview.'
          );
        }

        let data = null;

        // Check for saved data in localStorage first
        const localData = localStorage.getItem('savedResume');
        if (localData) {
          console.log('Local storage data found');
          try {
            const parsedData = JSON.parse(localData);
            console.log('Local storage retrieved data:', parsedData);

            // Use localStorage data if the ID matches
            if (parsedData.id === resumeId) {
              data = parsedData;
              console.log('Using matching localStorage data for ID:', resumeId);
            }
          } catch (e) {
            console.error('Local storage data parse error:', e);
          }
        }

        // If still no data, try Firebase or throw error
        if (!data) {
          console.log(
            'No matching data in localStorage, checking Firebase for ID:',
            resumeId
          );
          // Firebase implementation would go here
          // For now, we'll throw an error
          throw new Error(
            'Resume data not found. Please create the resume first.'
          );
        }

        console.log('Resume data to be loaded:', data);
        setResumeData(data);
      } catch (error) {
        console.error('Resume data loading error:', error);
        setError(
          'An error occurred while loading the resume: ' + error.message
        );
      } finally {
        setLoading(false);
      }
    };

    loadResumeData();
  }, [resumeId]);

  // Open menu
  const handleDownloadMenuOpen = (event) => {
    setDownloadMenuAnchor(event.currentTarget);
  };

  // Close menu
  const handleDownloadMenuClose = () => {
    setDownloadMenuAnchor(null);
  };

  // PDF download function
  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      setPdfMessage('Preparing preview...');

      const resumeElement = resumeRef.current;
      if (!resumeElement) {
        throw new Error('Resume element not found');
      }

      // Configure html2canvas options
      const html2CanvasOptions = {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
      };

      setPdfMessage('Generating PDF...');
      const canvas = await html2canvas(resumeElement, html2CanvasOptions);

      // Calculate dimensions and orientation
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Calculate the proper scaling to fit the a4 size
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(
        `${resumeData?.personalInfo?.fullName || 'resume'}_${new Date()
          .toISOString()
          .slice(0, 10)}.pdf`
      );

      setDownloading(false);
      setPdfMessage('');
      toast.success('PDF downloaded successfully!');
      handleDownloadMenuClose();
    } catch (error) {
      console.error('Error generating PDF:', error);
      setDownloading(false);
      setPdfMessage('');
      setError('An error occurred while generating the PDF. Please try again.');
      handleDownloadMenuClose();
    }
  };

  // Navigate to edit page
  const handleEdit = () => {
    if (resumeId) {
      navigate(`/builder?id=${resumeId}`);
    } else {
      navigate('/builder');
    }
  };

  // Continue editing
  const handleContinueEditing = () => {
    if (resumeId) {
      // Get the last active step from localStorage if available
      const builderState = localStorage.getItem('builderState');
      let activeStep = 0;

      if (builderState) {
        try {
          const parsedState = JSON.parse(builderState);
          if (parsedState.activeStep !== undefined) {
            activeStep = parsedState.activeStep;
          }
        } catch (e) {
          console.error('Failed to parse builder state', e);
        }
      }

      navigate(`/builder?id=${resumeId}&step=${activeStep}`);
    } else {
      navigate('/builder');
    }
  };

  // Open template selection dialog
  const handleOpenTemplateDialog = () => {
    setTemplateDialogOpen(true);
  };

  // Close template selection dialog
  const handleCloseTemplateDialog = () => {
    setTemplateDialogOpen(false);
  };

  // Handle template selection
  const handleTemplateChange = async (templateId) => {
    if (!resumeData || !resumeId) return;

    try {
      setSaving(true);

      // Update resume data with new template
      const updatedResumeData = {
        ...resumeData,
        selectedTemplateId: templateId,
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem('savedResume', JSON.stringify(updatedResumeData));

      // Update Firestore if needed
      if (currentUser && currentUser.uid) {
        await setDoc(doc(db, 'resumes', resumeId), updatedResumeData);
      }

      // Update state
      setResumeData(updatedResumeData);
      setTemplateDialogOpen(false);
      toast.success('Template updated successfully!');
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Failed to update template: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!resumeId) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          No resume ID specified. Please select a resume to preview.
        </Alert>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/dashboard"
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading preview...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/dashboard"
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (!resumeData || !resumeData.personalInfo) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This resume doesn't have any data yet. Please add some information
          first.
        </Alert>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={`/builder?id=${resumeId}`}
        >
          Edit Resume
        </Button>
      </Container>
    );
  }

  const selectedTemplateId = resumeData.selectedTemplateId;

  if (!selectedTemplateId) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          No template selected. Please select a template first.
        </Alert>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={`/builder?id=${resumeId}`}
        >
          Select Template
        </Button>
      </Container>
    );
  }

  // Select and render template
  console.log('Data for rendering:', resumeData);
  console.log('Template ID:', resumeData.selectedTemplateId);

  const selectedTemplate = getTemplateById(resumeData.selectedTemplateId);
  console.log('Selected template:', selectedTemplate);

  if (!selectedTemplate || !selectedTemplate.component) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Selected template not found: "
          {resumeData.selectedTemplateId || 'unknown'}"
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  const TemplateComponent = selectedTemplate.component;
  console.log('Template component:', TemplateComponent);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {pdfMessage && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {pdfMessage}
        </Alert>
      )}

      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, gap: 2 }}
      >
        <Button
          component={Link}
          to="/dashboard"
          startIcon={<ArrowBackIcon />}
          color="primary"
        >
          BACK TO DASHBOARD
        </Button>

        <Box>
          <Button
            startIcon={<EditIcon />}
            variant="outlined"
            onClick={handleContinueEditing}
          >
            CONTINUE EDITING
          </Button>
        </Box>
      </Box>

      <Paper
        elevation={1}
        ref={resumeRef}
        sx={{
          width: '210mm',
          minHeight: '297mm',
          margin: '0 auto',
          bgcolor: 'white',
          overflow: 'hidden',
        }}
      >
        <TemplateComponent resumeData={resumeData} />
      </Paper>

      {/* Template Selection Dialog */}
      <Dialog
        open={templateDialogOpen}
        onClose={handleCloseTemplateDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pt: 2 }}>
          <Typography variant="h6">Choose a Template</Typography>
          <IconButton onClick={handleCloseTemplateDialog}>
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
              {resumeTemplates.map((template) => (
                <Grid item xs={12} sm={6} md={3} key={template.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      border:
                        resumeData.selectedTemplateId === template.id
                          ? '2px solid #1976d2'
                          : '1px solid #e0e0e0',
                      boxShadow:
                        resumeData.selectedTemplateId === template.id
                          ? '0 0 10px rgba(25, 118, 210, 0.3)'
                          : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <CardActionArea
                      onClick={() => handleTemplateChange(template.id)}
                      sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                      }}
                      disabled={saving}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={template.image}
                        alt={template.name}
                        sx={{ objectFit: 'contain', p: 1 }}
                        onError={(e) => {
                          console.error(
                            `Failed to load template image: ${template.image}`
                          );
                          e.target.src = '/placeholder-template.png';
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="div" gutterBottom>
                          {template.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {template.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Download Menu */}
      <Menu
        anchorEl={downloadMenuAnchor}
        open={Boolean(downloadMenuAnchor)}
        onClose={handleDownloadMenuClose}
      >
        <MenuItem onClick={handleDownloadPdf}>
          <ListItemIcon>
            <PictureAsPdfIcon />
          </ListItemIcon>
          <ListItemText>Download as PDF</ListItemText>
        </MenuItem>
      </Menu>
    </Container>
  );
}
