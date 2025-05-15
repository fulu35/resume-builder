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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaptopIcon from '@mui/icons-material/Laptop';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import PersonIcon from '@mui/icons-material/Person';

// Default project, certification and reference information
const defaultProject = {
  title: '',
  description: '',
  date: '',
  link: '',
};

const defaultCertification = {
  name: '',
  issuer: '',
  date: '',
  link: '',
};

const defaultReference = {
  name: '',
  position: '',
  company: '',
  contact: '',
};

const AdditionalInfoForm = ({ data, onChange }) => {
  // Set initial state
  const [projects, setProjects] = useState(data.projects || []);
  const [certifications, setCertifications] = useState(
    data.certifications || []
  );
  const [references, setReferences] = useState(data.references || []);

  useEffect(() => {
    // Load data from localStorage on component mount
    const loadDraftData = () => {
      try {
        const savedResumeData = localStorage.getItem('savedResume');
        if (savedResumeData) {
          const parsedData = JSON.parse(savedResumeData);
          console.log(
            'Checking localStorage for additional info data:',
            parsedData
          );

          // If localStorage has additional info data and the form is empty, automatically fill it
          if (parsedData.additionalInfo) {
            if (
              parsedData.additionalInfo.projects &&
              parsedData.additionalInfo.projects.length > 0 &&
              projects.length === 0
            ) {
              console.log('Loading projects data from localStorage draft');
              setProjects(parsedData.additionalInfo.projects);
            }

            if (
              parsedData.additionalInfo.certifications &&
              parsedData.additionalInfo.certifications.length > 0 &&
              certifications.length === 0
            ) {
              console.log(
                'Loading certifications data from localStorage draft'
              );
              setCertifications(parsedData.additionalInfo.certifications);
            }

            if (
              parsedData.additionalInfo.references &&
              parsedData.additionalInfo.references.length > 0 &&
              references.length === 0
            ) {
              console.log('Loading references data from localStorage draft');
              setReferences(parsedData.additionalInfo.references);
            }

            // Update form data with loaded values
            onChange({
              projects: parsedData.additionalInfo.projects || [],
              certifications: parsedData.additionalInfo.certifications || [],
              references: parsedData.additionalInfo.references || [],
            });
          }
        }
      } catch (error) {
        console.error(
          'Error loading draft additional info data from localStorage:',
          error
        );
      }
    };

    loadDraftData();
  }, []);

  // Editing states
  const [currentProject, setCurrentProject] = useState(defaultProject);
  const [currentCertification, setCurrentCertification] =
    useState(defaultCertification);
  const [currentReference, setCurrentReference] = useState(defaultReference);

  const [editingProjectIndex, setEditingProjectIndex] = useState(-1);
  const [editingCertificationIndex, setEditingCertificationIndex] =
    useState(-1);
  const [editingReferenceIndex, setEditingReferenceIndex] = useState(-1);

  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isAddingCertification, setIsAddingCertification] = useState(false);
  const [isAddingReference, setIsAddingReference] = useState(false);

  const [activeTab, setActiveTab] = useState(0);

  // Tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Project operations
  const handleAddProject = () => {
    setCurrentProject(defaultProject);
    setIsAddingProject(true);
    setEditingProjectIndex(-1);
  };

  const handleEditProject = (index) => {
    setCurrentProject(projects[index]);
    setIsAddingProject(true);
    setEditingProjectIndex(index);
  };

  const handleDeleteProject = (index) => {
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1);
    setProjects(updatedProjects);
    updateFormData(updatedProjects, certifications, references);
  };

  const handleSaveProject = () => {
    if (!currentProject.title) return;

    const updatedProjects = [...projects];

    if (editingProjectIndex >= 0) {
      updatedProjects[editingProjectIndex] = currentProject;
    } else {
      updatedProjects.push(currentProject);
    }

    setProjects(updatedProjects);
    setIsAddingProject(false);
    setCurrentProject(defaultProject);
    updateFormData(updatedProjects, certifications, references);
  };

  const handleCancelProject = () => {
    setIsAddingProject(false);
    setCurrentProject(defaultProject);
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setCurrentProject((prev) => ({ ...prev, [name]: value }));
  };

  // Certification operations
  const handleAddCertification = () => {
    setCurrentCertification(defaultCertification);
    setIsAddingCertification(true);
    setEditingCertificationIndex(-1);
  };

  const handleEditCertification = (index) => {
    setCurrentCertification(certifications[index]);
    setIsAddingCertification(true);
    setEditingCertificationIndex(index);
  };

  const handleDeleteCertification = (index) => {
    const updatedCertifications = [...certifications];
    updatedCertifications.splice(index, 1);
    setCertifications(updatedCertifications);
    updateFormData(projects, updatedCertifications, references);
  };

  const handleSaveCertification = () => {
    if (!currentCertification.name) return;

    const updatedCertifications = [...certifications];

    if (editingCertificationIndex >= 0) {
      updatedCertifications[editingCertificationIndex] = currentCertification;
    } else {
      updatedCertifications.push(currentCertification);
    }

    setCertifications(updatedCertifications);
    setIsAddingCertification(false);
    setCurrentCertification(defaultCertification);
    updateFormData(projects, updatedCertifications, references);
  };

  const handleCancelCertification = () => {
    setIsAddingCertification(false);
    setCurrentCertification(defaultCertification);
  };

  const handleCertificationChange = (e) => {
    const { name, value } = e.target;
    setCurrentCertification((prev) => ({ ...prev, [name]: value }));
  };

  // Reference operations
  const handleAddReference = () => {
    setCurrentReference(defaultReference);
    setIsAddingReference(true);
    setEditingReferenceIndex(-1);
  };

  const handleEditReference = (index) => {
    setCurrentReference(references[index]);
    setIsAddingReference(true);
    setEditingReferenceIndex(index);
  };

  const handleDeleteReference = (index) => {
    const updatedReferences = [...references];
    updatedReferences.splice(index, 1);
    setReferences(updatedReferences);
    updateFormData(projects, certifications, updatedReferences);
  };

  const handleSaveReference = () => {
    if (!currentReference.name) return;

    const updatedReferences = [...references];

    if (editingReferenceIndex >= 0) {
      updatedReferences[editingReferenceIndex] = currentReference;
    } else {
      updatedReferences.push(currentReference);
    }

    setReferences(updatedReferences);
    setIsAddingReference(false);
    setCurrentReference(defaultReference);
    updateFormData(projects, certifications, updatedReferences);
  };

  const handleCancelReference = () => {
    setIsAddingReference(false);
    setCurrentReference(defaultReference);
  };

  const handleReferenceChange = (e) => {
    const { name, value } = e.target;
    setCurrentReference((prev) => ({ ...prev, [name]: value }));
  };

  // Helper function to update form data and notify parent component
  const updateFormData = (
    updatedProjects,
    updatedCertifications,
    updatedReferences
  ) => {
    const updatedData = {
      projects: updatedProjects,
      certifications: updatedCertifications,
      references: updatedReferences,
    };

    onChange(updatedData);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Additional Information
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Add any additional information such as projects, certifications, and
        references.
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ mb: 3 }}
        centered
      >
        <Tab icon={<LaptopIcon />} label="Projects" />
        <Tab icon={<CardMembershipIcon />} label="Certifications" />
        <Tab icon={<PersonIcon />} label="References" />
      </Tabs>

      {/* Projects */}
      {activeTab === 0 && (
        <>
          {projects.length > 0 ? (
            <Box sx={{ mb: 3 }}>
              {projects.map((project, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container>
                      <Grid item xs={10}>
                        <Typography variant="h6">{project.title}</Typography>
                        {project.date && (
                          <Typography variant="body2" color="text.secondary">
                            {project.date}
                          </Typography>
                        )}
                        {project.link && (
                          <Typography
                            variant="body2"
                            component="a"
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              color: 'primary.main',
                              textDecoration: 'none',
                            }}
                          >
                            {project.link}
                          </Typography>
                        )}
                        {project.description && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {project.description}
                          </Typography>
                        )}
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        sx={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditProject(index)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteProject(index)}
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
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, textAlign: 'center' }}
            >
              No projects added yet.
            </Typography>
          )}

          {!isAddingProject ? (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddProject}
              sx={{ mb: 3 }}
            >
              Add Project
            </Button>
          ) : (
            <Card sx={{ mb: 3, p: 2, bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {editingProjectIndex >= 0
                    ? 'Edit Project'
                    : 'Add New Project'}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Project Title"
                      name="title"
                      value={currentProject.title}
                      onChange={handleProjectChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date"
                      name="date"
                      value={currentProject.date}
                      onChange={handleProjectChange}
                      placeholder="e.g., 2021 or January 2021 - June 2021"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Link"
                      name="link"
                      value={currentProject.link}
                      onChange={handleProjectChange}
                      placeholder="e.g., https://github.com/username/project"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={currentProject.description}
                      onChange={handleProjectChange}
                      multiline
                      rows={3}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelProject}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveProject}
                  disabled={!currentProject.title}
                >
                  Save
                </Button>
              </CardActions>
            </Card>
          )}
        </>
      )}

      {/* Certifications */}
      {activeTab === 1 && (
        <>
          {certifications.length > 0 ? (
            <Box sx={{ mb: 3 }}>
              {certifications.map((certification, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container>
                      <Grid item xs={10}>
                        <Typography variant="h6">
                          {certification.name}
                        </Typography>
                        {certification.issuer && (
                          <Typography variant="body2" color="text.secondary">
                            {certification.issuer}
                          </Typography>
                        )}
                        {certification.date && (
                          <Typography variant="body2" color="text.secondary">
                            {certification.date}
                          </Typography>
                        )}
                        {certification.link && (
                          <Typography
                            variant="body2"
                            component="a"
                            href={certification.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              color: 'primary.main',
                              textDecoration: 'none',
                            }}
                          >
                            {certification.link}
                          </Typography>
                        )}
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        sx={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditCertification(index)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteCertification(index)}
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
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, textAlign: 'center' }}
            >
              No certifications added yet.
            </Typography>
          )}

          {!isAddingCertification ? (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddCertification}
              sx={{ mb: 3 }}
            >
              Add Certification
            </Button>
          ) : (
            <Card sx={{ mb: 3, p: 2, bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {editingCertificationIndex >= 0
                    ? 'Edit Certification'
                    : 'Add New Certification'}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Certification Name"
                      name="name"
                      value={currentCertification.name}
                      onChange={handleCertificationChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Issuer"
                      name="issuer"
                      value={currentCertification.issuer}
                      onChange={handleCertificationChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date"
                      name="date"
                      value={currentCertification.date}
                      onChange={handleCertificationChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Link"
                      name="link"
                      value={currentCertification.link}
                      onChange={handleCertificationChange}
                      placeholder="Link to verify the certification"
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelCertification}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveCertification}
                  disabled={!currentCertification.name}
                >
                  Save
                </Button>
              </CardActions>
            </Card>
          )}
        </>
      )}

      {/* References */}
      {activeTab === 2 && (
        <>
          {references.length > 0 ? (
            <Box sx={{ mb: 3 }}>
              {references.map((reference, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container>
                      <Grid item xs={10}>
                        <Typography variant="h6">{reference.name}</Typography>
                        {reference.position && (
                          <Typography variant="body2" color="text.secondary">
                            {reference.position}
                          </Typography>
                        )}
                        {reference.company && (
                          <Typography variant="body2" color="text.secondary">
                            {reference.company}
                          </Typography>
                        )}
                        {reference.contact && (
                          <Typography variant="body2">
                            {reference.contact}
                          </Typography>
                        )}
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        sx={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditReference(index)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteReference(index)}
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
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, textAlign: 'center' }}
            >
              No references added yet.
            </Typography>
          )}

          {!isAddingReference ? (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddReference}
              sx={{ mb: 3 }}
            >
              Add Reference
            </Button>
          ) : (
            <Card sx={{ mb: 3, p: 2, bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {editingReferenceIndex >= 0
                    ? 'Edit Reference'
                    : 'Add New Reference'}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={currentReference.name}
                      onChange={handleReferenceChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Position"
                      name="position"
                      value={currentReference.position}
                      onChange={handleReferenceChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company"
                      name="company"
                      value={currentReference.company}
                      onChange={handleReferenceChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Contact Information"
                      name="contact"
                      value={currentReference.contact}
                      onChange={handleReferenceChange}
                      placeholder="Email or phone number"
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelReference}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveReference}
                  disabled={!currentReference.name}
                >
                  Save
                </Button>
              </CardActions>
            </Card>
          )}
        </>
      )}
    </Box>
  );
};

export default AdditionalInfoForm;
