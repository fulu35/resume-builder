import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';
import { resumeTemplates } from '../templates';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { toast } from 'react-toastify';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getTemplateById } from '../templates';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { saveAs } from 'file-saver';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
} from 'docx';
import DescriptionIcon from '@mui/icons-material/Description';

export default function Dashboard() {
  const { currentUser, getUserResumes, logout } = useFirebase();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [changingTemplate, setChangingTemplate] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [downloadMenuAnchor, setDownloadMenuAnchor] = useState(null);
  const [resumeToDownload, setResumeToDownload] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const userResumes = await getUserResumes();
        setResumes(userResumes);
      } catch (error) {
        console.error('Error loading resumes:', error);
        setError('An error occurred while loading your resumes.');
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [getUserResumes]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      setError('An error occurred while logging out.');
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenTemplateDialog = (resumeId) => {
    setSelectedResumeId(resumeId);
    setTemplateDialogOpen(true);
  };

  const handleCloseTemplateDialog = () => {
    setTemplateDialogOpen(false);
    setSelectedResumeId(null);
  };

  const handleTemplateChange = async (templateId) => {
    if (!selectedResumeId) return;

    try {
      setChangingTemplate(true);

      // Find the resume to update
      const resumeToUpdate = resumes.find((r) => r.id === selectedResumeId);
      if (!resumeToUpdate) {
        throw new Error('Resume not found');
      }

      // Update resume data with new template
      const updatedResumeData = {
        ...resumeToUpdate,
        selectedTemplateId: templateId,
        updatedAt: new Date().toISOString(),
      };

      // Save to Firebase
      await setDoc(doc(db, 'resumes', selectedResumeId), updatedResumeData);

      // Update local state
      setResumes(
        resumes.map((r) => (r.id === selectedResumeId ? updatedResumeData : r))
      );

      // Also save to localStorage for immediate persistence
      const savedResumeData = localStorage.getItem('savedResume');
      if (savedResumeData) {
        try {
          const savedResume = JSON.parse(savedResumeData);
          if (savedResume.id === selectedResumeId) {
            localStorage.setItem(
              'savedResume',
              JSON.stringify(updatedResumeData)
            );
            console.log('Updated template in localStorage');
          }
        } catch (e) {
          console.error('Error updating localStorage:', e);
        }
      }

      setTemplateDialogOpen(false);
      toast.success('Template updated successfully!');
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Failed to update template: ' + error.message);
    } finally {
      setChangingTemplate(false);
    }
  };

  const handleDeleteClick = (resume) => {
    setResumeToDelete(resume);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setResumeToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!resumeToDelete) return;

    try {
      await deleteDoc(doc(db, 'resumes', resumeToDelete.id));

      // Remove from local state
      setResumes(resumes.filter((r) => r.id !== resumeToDelete.id));

      // Remove from localStorage if it's the current resume
      const savedResumeData = localStorage.getItem('savedResume');
      if (savedResumeData) {
        const savedResume = JSON.parse(savedResumeData);
        if (savedResume.id === resumeToDelete.id) {
          localStorage.removeItem('savedResume');
        }
      }

      toast.success('Resume deleted successfully');
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete resume');
    } finally {
      setDeleteDialogOpen(false);
      setResumeToDelete(null);
    }
  };

  const handleDownloadMenuOpen = (event, resume) => {
    setDownloadMenuAnchor(event.currentTarget);
    setResumeToDownload(resume);
  };

  const handleDownloadMenuClose = () => {
    setDownloadMenuAnchor(null);
    setResumeToDownload(null);
  };

  const handleDownloadPDF = async () => {
    if (!resumeToDownload) return;
    setDownloading(true);
    handleDownloadMenuClose();

    let tempContainer;
    try {
      toast.info('Generating PDF...');

      // Create a temporary container for the resume
      tempContainer = document.createElement('div');
      tempContainer.id = `pdf-render-container-${Date.now()}`;
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '210mm';
      tempContainer.style.background = 'white';
      document.body.appendChild(tempContainer);

      // Get the template component
      const templateId = resumeToDownload.selectedTemplateId;
      const template = getTemplateById(templateId);

      if (!template || !template.component) {
        throw new Error('Template component not found for PDF generation.');
      }

      // Render the component to the DOM temporarily
      const TemplateComponent = template.component;

      // Use ReactDOM to render
      const ReactDOM = require('react-dom');
      ReactDOM.render(
        <Box sx={{ p: 2, fontFamily: 'Arial, sans-serif', fontSize: '10pt' }}>
          <TemplateComponent resumeData={resumeToDownload} />
        </Box>,
        tempContainer
      );

      // Wait briefly for rendering and potential image loading
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate PDF
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
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

      // Generate filename
      const fileName = `${
        resumeToDownload.personalInfo?.fullName?.replace(/\s+/g, '_') ||
        'resume'
      }.pdf`;

      pdf.save(fileName);
      toast.success('PDF downloaded successfully!');

      // Clean up the temporary container
      ReactDOM.unmountComponentAtNode(tempContainer);
      document.body.removeChild(tempContainer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error(`Failed to generate PDF: ${error.message}`);
      // Ensure cleanup even on error
      tempContainer = document.getElementById(tempContainer.id);
      if (tempContainer) {
        try {
          const ReactDOM = require('react-dom');
          ReactDOM.unmountComponentAtNode(tempContainer);
          document.body.removeChild(tempContainer);
        } catch (cleanupError) {
          console.error('Error cleaning up temp container:', cleanupError);
        }
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadWord = async () => {
    if (!resumeToDownload) return;
    setDownloading(true);

    try {
      toast.info('Generating Word document...');

      // Create a new Document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: generateDocxContent(resumeToDownload),
          },
        ],
      });

      // Generate a blob from the document
      const blob = await Packer.toBlob(doc);

      // Generate filename
      const fileName = `${
        resumeToDownload.personalInfo?.fullName?.replace(/\s+/g, '_') ||
        'resume'
      }.docx`;

      // Save the blob using file-saver
      saveAs(blob, fileName);
      toast.success('Word document downloaded successfully!');
    } catch (error) {
      console.error('Error generating Word document:', error);
      toast.error(`Failed to generate Word document: ${error.message}`);
    } finally {
      setDownloading(false);
    }
  };

  // Helper function to create a section header with standardized spacing
  const createSectionHeader = (text) => {
    return new Paragraph({
      children: [
        new TextRun({
          text: text,
          bold: true,
          size: 28, // Increased size for better visibility
          font: 'Calibri',
          color: '2b579a', // Professional blue color
        }),
      ],
      spacing: {
        before: 1800, // Increased space before section (between sections)
        after: 180, // Reduced space after heading (between heading and content)
        line: 340, // Line spacing
      },
      pageBreakBefore: false,
    });
  };

  // Helper function to add empty lines (like <br> in HTML)
  const addEmptyLines = (count = 1) => {
    const lines = [];
    for (let i = 0; i < count; i++) {
      lines.push(
        new Paragraph({
          text: '',
          spacing: {
            before: 120,
            after: 120,
            line: 240,
          },
        })
      );
    }
    return lines;
  };

  // Helper function to generate docx content from resume data
  const generateDocxContent = (resumeData) => {
    const children = [];
    const {
      personalInfo = {},
      education = [],
      experience = [],
      skills = { skills: [], languages: [] },
      additionalInfo = { projects: [], certifications: [], references: [] },
    } = resumeData;

    // --- HEADER SECTION ---
    // Full name (large, centered)
    if (personalInfo?.fullName) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: personalInfo.fullName,
              bold: true,
              size: 36,
              color: '2b579a', // Professional blue color
              font: 'Calibri',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 120,
          },
        })
      );
    }

    // Job title (medium, centered)
    if (personalInfo?.title) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: personalInfo.title,
              size: 24,
              color: '2b579a', // Professional blue color
              font: 'Calibri',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 240,
          },
        })
      );
    }

    // Horizontal line separator
    children.push(
      new Paragraph({
        border: {
          bottom: {
            color: '2b579a',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 8,
          },
        },
        spacing: {
          before: 200,
          after: 800, // Increased for better Pages compatibility
          line: 340,
        },
      })
    );

    // --- CONTACT INFORMATION ---
    const hasContactInfo =
      personalInfo?.email ||
      personalInfo?.phone ||
      personalInfo?.location ||
      personalInfo?.linkedin ||
      personalInfo?.website;

    if (hasContactInfo) {
      // Use the standardized section header
      children.push(createSectionHeader('CONTACT INFORMATION'));

      // Create a two-column layout for contact info
      const contactItems = [];

      if (personalInfo?.email) {
        contactItems.push({ label: 'Email', value: personalInfo.email });
      }

      if (personalInfo?.phone) {
        contactItems.push({ label: 'Phone', value: personalInfo.phone });
      }

      if (personalInfo?.location) {
        contactItems.push({ label: 'Location', value: personalInfo.location });
      }

      if (personalInfo?.linkedin) {
        contactItems.push({ label: 'LinkedIn', value: personalInfo.linkedin });
      }

      if (personalInfo?.website) {
        contactItems.push({ label: 'Website', value: personalInfo.website });
      }

      // Create nicely formatted contact info paragraphs
      contactItems.forEach((item) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${item.label}: `,
                bold: true,
                font: 'Calibri',
              }),
              new TextRun({
                text: item.value,
                font: 'Calibri',
              }),
            ],
            spacing: {
              line: 340, // Line spacing
              before: 60, // Reduced spacing before
              after: 60, // Reduced spacing after
            },
          })
        );
      });

      // Add space after contact section - standardize to 2 empty lines
      addEmptyLines(2).forEach((line) => children.push(line));
    }

    // --- SUMMARY SECTION ---
    if (personalInfo?.summary) {
      // Use the standardized section header
      children.push(createSectionHeader('PROFESSIONAL SUMMARY'));

      // Add summary text with proper line spacing
      children.push(
        new Paragraph({
          text: personalInfo.summary,
          spacing: {
            line: 340, // Consistent line spacing
            before: 60,
            after: 60,
          },
        })
      );

      // Add space after summary section - standardize to 2 empty lines
      addEmptyLines(2).forEach((line) => children.push(line));
    }

    // --- EXPERIENCE SECTION ---
    if (experience && experience.length > 0) {
      // Use the standardized section header
      children.push(createSectionHeader('WORK EXPERIENCE'));

      experience.forEach((exp, index) => {
        // Job title and company on the same line
        const titleCompany = [];
        if (exp.title) {
          titleCompany.push(
            new TextRun({
              text: exp.title,
              bold: true,
              font: 'Calibri',
            })
          );
        }

        if (exp.title && exp.company) {
          titleCompany.push(
            new TextRun({
              text: ' at ',
              font: 'Calibri',
            })
          );
        }

        if (exp.company) {
          titleCompany.push(
            new TextRun({
              text: exp.company,
              bold: true,
              font: 'Calibri',
            })
          );
        }

        if (titleCompany.length > 0) {
          children.push(
            new Paragraph({
              children: titleCompany,
              spacing: {
                after: 60,
                before: 60,
              },
            })
          );
        }

        // Date range and location
        const dateLocation = [];
        const hasStartDate = !!exp.startDate;
        const hasEndDate = !!exp.endDate;
        const hasLocation = !!exp.location;

        if (hasStartDate || hasEndDate) {
          dateLocation.push(
            new TextRun({
              text: `${exp.startDate || ''} - ${
                exp.current ? 'Present' : exp.endDate || ''
              }`,
              italics: true,
              font: 'Calibri',
            })
          );
        }

        if ((hasStartDate || hasEndDate) && hasLocation) {
          dateLocation.push(
            new TextRun({
              text: ' | ',
              font: 'Calibri',
            })
          );
        }

        if (hasLocation) {
          dateLocation.push(
            new TextRun({
              text: exp.location,
              italics: true,
              font: 'Calibri',
            })
          );
        }

        if (dateLocation.length > 0) {
          children.push(
            new Paragraph({
              children: dateLocation,
              spacing: {
                after: 60,
                before: 0,
              },
            })
          );
        }

        // Job description with bullet points
        if (exp.description) {
          const descLines = exp.description
            .split('. ')
            .filter((line) => line.trim().length > 0);

          if (descLines.length === 1) {
            // Single paragraph description
            children.push(
              new Paragraph({
                text: exp.description,
                spacing: {
                  line: 340, // Consistent line spacing
                  before: 60,
                  after: 60,
                },
              })
            );
          } else {
            // Multiple bullet points
            descLines.forEach((line) => {
              if (line.trim()) {
                children.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `• ${line.trim()}${
                          !line.trim().endsWith('.') ? '.' : ''
                        }`,
                        font: 'Calibri',
                      }),
                    ],
                    spacing: {
                      line: 340,
                      before: 30,
                      after: 30,
                    },
                    indent: {
                      left: 360,
                    },
                  })
                );
              }
            });
          }
        }

        // Add spacing after each experience except the last one
        if (index < experience.length - 1) {
          // Add empty lines between items
          addEmptyLines(1).forEach((line) => children.push(line));
        }
      });

      // Add space after experience section - standardize to 2 empty lines
      addEmptyLines(2).forEach((line) => children.push(line));
    }

    // --- EDUCATION SECTION ---
    if (education && education.length > 0) {
      // Use the standardized section header
      children.push(createSectionHeader('EDUCATION'));

      education.forEach((edu, index) => {
        // School name
        if (edu.school) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.school,
                  bold: true,
                  font: 'Calibri',
                }),
              ],
              spacing: {
                after: 60,
                before: 60,
              },
            })
          );
        }

        // Degree and field
        const degreeField = [];
        if (edu.degree) {
          degreeField.push(
            new TextRun({
              text: edu.degree,
              italics: true,
              font: 'Calibri',
            })
          );
        }

        if (degreeField.length > 0) {
          children.push(
            new Paragraph({
              children: degreeField,
              spacing: {
                after: 60,
                before: 0,
              },
            })
          );
        }

        // Date range and location
        const dateLocation = [];
        const hasStartDate = !!edu.startDate;
        const hasEndDate = !!edu.endDate;
        const hasLocation = !!edu.location;

        if (hasStartDate || hasEndDate) {
          dateLocation.push(
            new TextRun({
              text: `${edu.startDate || ''} - ${
                edu.current ? 'Present' : edu.endDate || ''
              }`,
              italics: true,
              font: 'Calibri',
            })
          );
        }

        if ((hasStartDate || hasEndDate) && hasLocation) {
          dateLocation.push(
            new TextRun({
              text: ' | ',
              font: 'Calibri',
            })
          );
        }

        if (hasLocation) {
          dateLocation.push(
            new TextRun({
              text: edu.location,
              italics: true,
              font: 'Calibri',
            })
          );
        }

        if (dateLocation.length > 0) {
          children.push(
            new Paragraph({
              children: dateLocation,
              spacing: {
                after: 60,
                before: 0,
              },
            })
          );
        }

        // Description
        if (edu.description) {
          children.push(
            new Paragraph({
              text: edu.description,
              spacing: {
                line: 340, // Consistent line spacing
                before: 60,
                after: 60,
              },
            })
          );
        }

        // Add spacing after each education except the last one
        if (index < education.length - 1) {
          // Add empty lines between items
          addEmptyLines(1).forEach((line) => children.push(line));
        }
      });

      // Add space after education section - standardize to 2 empty lines
      addEmptyLines(2).forEach((line) => children.push(line));
    }

    // --- SKILLS SECTION ---
    const hasSkills = skills?.skills?.length > 0;
    const hasLanguages = skills?.languages?.length > 0;

    if (hasSkills || hasLanguages) {
      // Use the standardized section header
      children.push(createSectionHeader('SKILLS'));

      // Technical skills
      if (hasSkills) {
        // Format skills as a clean list with commas
        const skillNames = skills.skills
          .map((skill) => skill.name || skill)
          .filter(Boolean);
        if (skillNames.length > 0) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: skillNames.join(', '),
                  font: 'Calibri',
                }),
              ],
              spacing: {
                after: hasLanguages ? 60 : 0,
                before: 60,
                line: 340, // Consistent line spacing
              },
            })
          );
        }
      }

      // Languages
      if (hasLanguages) {
        const languageNames = skills.languages
          .map((lang) => lang.name || lang)
          .filter(Boolean);
        if (languageNames.length > 0) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: languageNames.join(', '),
                  font: 'Calibri',
                }),
              ],
              spacing: {
                line: 340, // Consistent line spacing
                before: 60,
                after: 60,
              },
            })
          );
        }
      }

      // Add space after skills section - standardize to 2 empty lines
      addEmptyLines(2).forEach((line) => children.push(line));
    }

    // --- PROJECTS SECTION ---
    if (additionalInfo?.projects && additionalInfo.projects.length > 0) {
      // Use the standardized section header
      children.push(createSectionHeader('PROJECTS'));

      additionalInfo.projects.forEach((project, index) => {
        if (project.title) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: project.title,
                  bold: true,
                  font: 'Calibri',
                }),
              ],
              spacing: {
                after: 60,
                before: 60,
              },
            })
          );
        }

        if (project.description) {
          children.push(
            new Paragraph({
              text: project.description,
              spacing: {
                line: 340, // Consistent line spacing
                before: 60,
                after: 60,
              },
            })
          );
        }

        // Add spacing after each project except the last one
        if (index < additionalInfo.projects.length - 1) {
          // Add empty lines between items
          addEmptyLines(1).forEach((line) => children.push(line));
        }
      });

      // Add space after projects section - standardize to 2 empty lines
      addEmptyLines(2).forEach((line) => children.push(line));
    }

    // --- CERTIFICATIONS SECTION ---
    if (
      additionalInfo?.certifications &&
      additionalInfo.certifications.length > 0
    ) {
      // Use the standardized section header
      children.push(createSectionHeader('CERTIFICATIONS'));

      additionalInfo.certifications.forEach((cert, index) => {
        if (cert.title) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: cert.title,
                  bold: true,
                  font: 'Calibri',
                }),
              ],
              spacing: {
                after: 60,
                before: 60,
              },
            })
          );
        }

        // Issuer and date
        const issuerDate = [];

        if (cert.issuer) {
          issuerDate.push(
            new TextRun({
              text: `Issued by: ${cert.issuer}`,
              font: 'Calibri',
            })
          );
        }

        if (cert.issuer && cert.date) {
          issuerDate.push(
            new TextRun({
              text: ' | ',
              font: 'Calibri',
            })
          );
        }

        if (cert.date) {
          issuerDate.push(
            new TextRun({
              text: `Date: ${cert.date}`,
              font: 'Calibri',
            })
          );
        }

        if (issuerDate.length > 0) {
          children.push(
            new Paragraph({
              children: issuerDate,
              spacing: {
                after: 60,
                before: 0,
                line: 340, // Consistent line spacing
              },
            })
          );
        }

        // Add spacing after each certification except the last one
        if (index < additionalInfo.certifications.length - 1) {
          // Add empty lines between items
          addEmptyLines(1).forEach((line) => children.push(line));
        }
      });

      // Add space after certifications section - standardize to 2 empty lines
      addEmptyLines(2).forEach((line) => children.push(line));
    }

    // --- REFERENCES SECTION ---
    if (additionalInfo?.references && additionalInfo.references.length > 0) {
      // Use the standardized section header
      children.push(createSectionHeader('REFERENCES'));

      additionalInfo.references.forEach((reference, index) => {
        // Reference name
        if (reference.name) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: reference.name,
                  bold: true,
                  font: 'Calibri',
                }),
              ],
              spacing: {
                after: 60,
                before: 60,
              },
            })
          );
        }

        // Position and company
        const positionCompany = [];

        if (reference.position) {
          positionCompany.push(
            new TextRun({
              text: reference.position,
              italics: true,
              font: 'Calibri',
            })
          );
        }

        if (reference.position && reference.company) {
          positionCompany.push(
            new TextRun({
              text: ' at ',
              font: 'Calibri',
            })
          );
        }

        if (reference.company) {
          positionCompany.push(
            new TextRun({
              text: reference.company,
              italics: true,
              font: 'Calibri',
            })
          );
        }

        if (positionCompany.length > 0) {
          children.push(
            new Paragraph({
              children: positionCompany,
              spacing: {
                after: 60,
                before: 0,
              },
            })
          );
        }

        // Contact info (phone and email)
        if (reference.email) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `Email: `,
                  bold: true,
                  font: 'Calibri',
                }),
                new TextRun({
                  text: reference.email,
                  font: 'Calibri',
                }),
              ],
              spacing: {
                after: reference.phone ? 0 : 60,
                before: 0,
                line: 340, // Consistent line spacing
              },
            })
          );
        }

        if (reference.phone) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `Phone: `,
                  bold: true,
                  font: 'Calibri',
                }),
                new TextRun({
                  text: reference.phone,
                  font: 'Calibri',
                }),
              ],
              spacing: {
                after: 60,
                before: 0,
                line: 340, // Consistent line spacing
              },
            })
          );
        }

        // Add spacing after each reference except the last one
        if (index < additionalInfo.references.length - 1) {
          // Add empty lines between items
          addEmptyLines(1).forEach((line) => children.push(line));
        }
      });
    }

    return children;
  };

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

  const selectedResume = resumes.find((r) => r.id === selectedResumeId);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <Box
              component="img"
              src="/logo/logo_white.png"
              alt="CareeBootsy Logo"
              sx={{
                // height: 32,
                width: 'auto',
                maxWidth: { xs: 90, sm: 130 },
              }}
            />
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              aria-controls="menu-appbar"
              aria-haspopup="true"
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  handleLogout();
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome, {currentUser.displayName}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage your resume and customize it with different templates
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {resumes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="textSecondary" gutterBottom>
              You don't have any resumes yet
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              Click below to create your resume
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/builder"
              startIcon={<AddIcon />}
              size="large"
              sx={{ mt: 2 }}
            >
              Create Resume
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {resumes.map((resume) => (
              <Grid item xs={12} key={resume.id}>
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    '&:hover': {
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 500 }}>
                          {resume.title || 'My Resume'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Last updated:{' '}
                          {new Date(resume.updatedAt).toLocaleDateString(
                            'en-US'
                          )}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ mt: 1 }}
                        >
                          Template:{' '}
                          {resume.selectedTemplateId.charAt(0).toUpperCase() +
                            resume.selectedTemplateId.slice(1)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<EditIcon />}
                          component={Link}
                          to={`/builder?id=${resume.id}`}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          component={Link}
                          to={`/preview?id=${resume.id}`}
                        >
                          Preview
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<DownloadIcon />}
                          onClick={(e) => handleDownloadMenuOpen(e, resume)}
                          disabled={
                            downloading && resumeToDownload?.id === resume.id
                          }
                        >
                          {downloading && resumeToDownload?.id === resume.id ? (
                            <CircularProgress size={16} sx={{ mr: 1 }} />
                          ) : null}
                          Download
                        </Button>
                        <Menu
                          anchorEl={downloadMenuAnchor}
                          open={
                            Boolean(downloadMenuAnchor) &&
                            resumeToDownload?.id === resume.id
                          }
                          onClose={handleDownloadMenuClose}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                        >
                          <MenuItem onClick={handleDownloadPDF}>
                            <ListItemIcon>
                              <PictureAsPdfIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Download as PDF</ListItemText>
                          </MenuItem>
                          <MenuItem onClick={handleDownloadWord}>
                            <ListItemIcon>
                              <DescriptionIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Download as Word</ListItemText>
                          </MenuItem>
                        </Menu>
                        <Button
                          variant="outlined"
                          startIcon={<ColorLensIcon />}
                          onClick={() => handleOpenTemplateDialog(resume.id)}
                        >
                          Template
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteClick(resume)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Resume</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this resume? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Template Selection Dialog */}
      <Dialog
        open={templateDialogOpen}
        onClose={handleCloseTemplateDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">Choose a Template</Typography>
            <IconButton onClick={handleCloseTemplateDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
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
                        selectedResume?.selectedTemplateId === template.id
                          ? '2px solid #1976d2'
                          : '1px solid #e0e0e0',
                      boxShadow:
                        selectedResume?.selectedTemplateId === template.id
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
                      disabled={changingTemplate}
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
    </>
  );
}
