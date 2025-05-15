import React from 'react';
import { Box, Typography, Divider, Grid, Paper } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WebIcon from '@mui/icons-material/Web';
import LinkIcon from '@mui/icons-material/Link';
import { Link } from '@mui/material';
import { Chip, LinearProgress } from '@mui/material';

const ModernTemplate = ({ resumeData }) => {
  // Use appropriate default values if data is missing
  const {
    personalInfo = {},
    education = [],
    experience = [],
    skills = { skills: [], languages: [] },
    languages: skillsLanguages = [],
    additionalInfo = { projects: [], certifications: [], references: [] },
  } = resumeData || {};

  // Extract arrays from the data structure
  const { skills: skillsList = [], languages = [] } = skills;
  const {
    projects = [],
    certifications = [],
    references = [],
  } = additionalInfo;

  return (
    <Box
      sx={{
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        color: '#333',
        backgroundColor: '#fff',
        position: 'relative',
        minHeight: '297mm',
        width: '210mm',
        margin: '0 auto',
        boxShadow: '0 0 5mm rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          backgroundColor: '#2c3e50',
          color: 'white',
          padding: '20px 40px',
          position: 'relative',
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
          {personalInfo.fullName || 'Full Name'}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 400, mb: 1 }}>
          {personalInfo.title || 'Professional Title'}
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {personalInfo.email && (
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ mr: 1, fontSize: 18 }} />
                <Typography variant="body2">{personalInfo.email}</Typography>
              </Box>
            </Grid>
          )}

          {personalInfo.phone && (
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ mr: 1, fontSize: 18 }} />
                <Typography variant="body2">{personalInfo.phone}</Typography>
              </Box>
            </Grid>
          )}

          {personalInfo.location && (
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon sx={{ mr: 1, fontSize: 18 }} />
                <Typography variant="body2">{personalInfo.location}</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', padding: '0' }}>
        {/* Left Sidebar */}
        <Box
          sx={{
            width: '35%',
            backgroundColor: '#f5f5f5',
            padding: '30px',
            minHeight: '100%',
          }}
        >
          {/* Profile Photo */}
          {personalInfo.photoURL && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <Box
                component="img"
                src={personalInfo.photoURL}
                alt="Profile"
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid white',
                }}
                onError={(e) => {
                  e.target.src = '/placeholder-profile.png';
                }}
              />
            </Box>
          )}

          {/* Skills Section */}
          {skillsList.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  borderBottom: '2px solid #2c3e50',
                  paddingBottom: '5px',
                }}
              >
                Skills
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {skillsList.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill.name}
                    sx={{
                      background: '#2c3e50',
                      color: 'white',
                      mb: 1,
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Languages Section */}
          {languages.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  borderBottom: '2px solid #2c3e50',
                  paddingBottom: '5px',
                }}
              >
                Languages
              </Typography>

              {languages.map((language, index) => (
                <Box key={index} sx={{ mb: 1.5 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {language.name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 400 }}>
                      {language.level}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(() => {
                      const levels = {
                        Beginner: 20,
                        Elementary: 40,
                        Intermediate: 60,
                        Advanced: 80,
                        Fluent: 100,
                        Native: 100,
                      };
                      return levels[language.level] || 0;
                    })()}
                    sx={{
                      height: 6,
                      borderRadius: 1,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#2c3e50',
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}

          {/* References Section */}
          {references.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  borderBottom: '2px solid #2c3e50',
                  paddingBottom: '5px',
                }}
              >
                References
              </Typography>

              {references.map((reference, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {reference.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555' }}>
                    {reference.position}
                  </Typography>
                  {reference.company && (
                    <Typography variant="body2" sx={{ color: '#555' }}>
                      {reference.company}
                    </Typography>
                  )}
                  {reference.email && (
                    <Typography
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}
                    >
                      <EmailIcon sx={{ mr: 0.5, fontSize: 14 }} />
                      {reference.email}
                    </Typography>
                  )}
                  {reference.phone && (
                    <Typography
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}
                    >
                      <PhoneIcon sx={{ mr: 0.5, fontSize: 14 }} />
                      {reference.phone}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Right Content Area */}
        <Box
          sx={{
            width: '65%',
            padding: '30px',
          }}
        >
          {/* Profile Summary */}
          {personalInfo.summary && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  borderBottom: '2px solid #2c3e50',
                  paddingBottom: '5px',
                }}
              >
                Professional Summary
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {personalInfo.summary}
              </Typography>
            </Box>
          )}

          {/* Work Experience */}
          {experience.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  borderBottom: '2px solid #2c3e50',
                  paddingBottom: '5px',
                }}
              >
                Work Experience
              </Typography>

              {experience.map((exp, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {exp.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555' }}>
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    {exp.company}
                    {exp.location ? `, ${exp.location}` : ''}
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {exp.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Education */}
          {education.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  borderBottom: '2px solid #2c3e50',
                  paddingBottom: '5px',
                }}
              >
                Education
              </Typography>

              {education.map((edu, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {edu.degree}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555' }}>
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    {edu.school}
                    {edu.location ? `, ${edu.location}` : ''}
                  </Typography>
                  {edu.description && (
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                      {edu.description}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  borderBottom: '2px solid #2c3e50',
                  paddingBottom: '5px',
                }}
              >
                Projects
              </Typography>

              {projects.map((project, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {project.title}
                    </Typography>
                    {project.date && (
                      <Typography variant="body2" sx={{ color: '#555' }}>
                        {project.date}
                      </Typography>
                    )}
                  </Box>
                  {project.url && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#3498db',
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <LinkIcon sx={{ mr: 0.5, fontSize: 16 }} />
                      <Link
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: 'inherit', textDecoration: 'none' }}
                      >
                        {project.url}
                      </Link>
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {project.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  borderBottom: '2px solid #2c3e50',
                  paddingBottom: '5px',
                }}
              >
                Certifications
              </Typography>

              {certifications.map((cert, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {cert.name}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {cert.issuer}
                    {cert.date && ` • ${cert.date}`}
                  </Typography>
                  {cert.link && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#3498db',
                        mt: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <LinkIcon sx={{ mr: 0.5, fontSize: 16 }} />
                      <Link
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: 'inherit', textDecoration: 'none' }}
                      >
                        Verify
                      </Link>
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ModernTemplate;
