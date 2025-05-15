import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Language as WebsiteIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';

const ProfessionalTemplate = ({ resumeData }) => {
  // Ensure we have proper default values
  const {
    personalInfo = {},
    education = [],
    experience = [],
    skills = { skills: [], languages: [] },
    additionalInfo = {}, // Ensure additionalInfo exists with default empty object
  } = resumeData || {};

  // Extract skills and languages lists
  const { skills: skillsList = [], languages = [] } = skills;

  // Extract projects, certifications, and references
  const {
    projects = [],
    certifications = [],
    references = [],
  } = additionalInfo;

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        height: '100%',
        background: '#fff',
        color: '#333',
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      }}
    >
      <Grid container>
        {/* Left sidebar */}
        <Grid
          item
          xs={4}
          sx={{
            bgcolor: '#34495e',
            color: 'white',
            position: 'relative',
            height: '100%',
          }}
        >
          {/* Profile Photo & Name Section */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 3,
              pb: 5,
              bgcolor: '#2c3e50',
            }}
          >
            {personalInfo.photoURL && (
              <Avatar
                src={personalInfo.photoURL}
                alt={personalInfo.fullName}
                sx={{
                  width: 150,
                  height: 150,
                  mb: 2,
                  border: '4px solid #3498db',
                }}
              />
            )}
            <Typography
              variant="h4"
              component="h1"
              align="center"
              sx={{ fontWeight: 'bold', letterSpacing: 1 }}
            >
              {personalInfo.fullName || 'Your Name'}
            </Typography>
            <Typography variant="h6" align="center">
              {personalInfo.title || 'Professional Title'}
            </Typography>
          </Box>

          {/* Contact Information */}
          <Box sx={{ p: 3 }}>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{ color: '#3498db', fontWeight: 'bold' }}
            >
              CONTACT
            </Typography>
            <Divider sx={{ mb: 2, borderColor: '#3498db', borderWidth: 2 }} />

            <List dense disablePadding>
              {personalInfo.phone && (
                <ListItem disableGutters sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36, color: '#3498db' }}>
                    <PhoneIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={personalInfo.phone} />
                </ListItem>
              )}
              {personalInfo.email && (
                <ListItem disableGutters sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36, color: '#3498db' }}>
                    <EmailIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={personalInfo.email} />
                </ListItem>
              )}
              {personalInfo.location && (
                <ListItem disableGutters sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36, color: '#3498db' }}>
                    <LocationIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={personalInfo.location} />
                </ListItem>
              )}
              {personalInfo.website && (
                <ListItem disableGutters sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36, color: '#3498db' }}>
                    <WebsiteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={personalInfo.website} />
                </ListItem>
              )}
              {personalInfo.linkedin && (
                <ListItem disableGutters sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36, color: '#3498db' }}>
                    <LinkedInIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={personalInfo.linkedin} />
                </ListItem>
              )}
            </List>
          </Box>

          {/* Skills */}
          {skillsList && skillsList.length > 0 && (
            <Box sx={{ p: 3 }}>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ color: '#3498db', fontWeight: 'bold' }}
              >
                SKILLS
              </Typography>
              <Divider sx={{ mb: 2, borderColor: '#3498db', borderWidth: 2 }} />

              {skillsList.map((skill, index) => (
                <Box key={index} sx={{ mb: 1.5 }}>
                  <Typography
                    variant="body2"
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                  >
                    {skill.name}
                    {skill.level && ` - ${skill.level}`}
                  </Typography>
                  <Box sx={{ width: '100%', bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <Box
                      sx={{
                        height: 5,
                        bgcolor: '#3498db',
                        width: skill.level
                          ? skill.level === 'Beginner'
                            ? '25%'
                            : skill.level === 'Intermediate'
                            ? '50%'
                            : skill.level === 'Advanced'
                            ? '75%'
                            : skill.level === 'Expert'
                            ? '100%'
                            : '60%'
                          : '60%',
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <Box sx={{ mb: 4, p: 3 }}>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ color: '#3498db', fontWeight: 'bold' }}
              >
                LANGUAGES
              </Typography>
              <Divider sx={{ mb: 2, borderColor: '#3498db', borderWidth: 2 }} />

              {languages.map((language, index) => (
                <Box key={index} sx={{ mb: 1.5 }}>
                  <Typography
                    variant="body2"
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                  >
                    {language.name}
                    {language.level && ` - ${language.level}`}
                  </Typography>
                  <Box sx={{ width: '100%', bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <Box
                      sx={{
                        height: 5,
                        bgcolor: '#3498db',
                        width: language.level
                          ? language.level === 'Beginner'
                            ? '25%'
                            : language.level === 'Intermediate'
                            ? '50%'
                            : language.level === 'Advanced'
                            ? '75%'
                            : language.level === 'Expert'
                            ? '100%'
                            : '60%'
                          : '60%',
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Grid>

        {/* Right content area */}
        <Grid item xs={8} sx={{ p: 3 }}>
          {/* Profile Summary */}
          {personalInfo.summary && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ color: '#2c3e50', fontWeight: 'bold' }}
              >
                PROFILE
              </Typography>
              <Divider sx={{ mb: 2, borderColor: '#2c3e50', borderWidth: 2 }} />
              <Typography variant="body1">{personalInfo.summary}</Typography>
            </Box>
          )}

          {/* Work Experience */}
          {experience.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ color: '#2c3e50', fontWeight: 'bold' }}
              >
                WORK EXPERIENCE
              </Typography>
              <Divider sx={{ mb: 2, borderColor: '#2c3e50', borderWidth: 2 }} />

              {experience.map((exp, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {exp.title}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: '#3498db', fontWeight: 'bold' }}
                  >
                    {exp.company}
                    {exp.location ? ` | ${exp.location}` : ''}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontStyle: 'italic', mb: 1 }}
                  >
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </Typography>
                  <Typography variant="body2">{exp.description}</Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Education */}
          {education.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ color: '#2c3e50', fontWeight: 'bold' }}
              >
                EDUCATION
              </Typography>
              <Divider sx={{ mb: 2, borderColor: '#2c3e50', borderWidth: 2 }} />

              {education.map((edu, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {edu.degree}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: '#3498db', fontWeight: 'bold' }}
                  >
                    {edu.school}
                    {edu.location ? ` | ${edu.location}` : ''}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontStyle: 'italic', mb: 1 }}
                  >
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </Typography>
                  {edu.description && (
                    <Typography variant="body2">{edu.description}</Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ color: '#2c3e50', fontWeight: 'bold' }}
              >
                PROJECTS
              </Typography>
              <Divider sx={{ mb: 2, borderColor: '#2c3e50', borderWidth: 2 }} />

              {projects.map((project, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {project.title}
                  </Typography>
                  {project.date && (
                    <Typography
                      variant="body2"
                      sx={{ fontStyle: 'italic', mb: 1 }}
                    >
                      {project.date}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {project.description}
                  </Typography>
                  {project.link && (
                    <Typography
                      variant="body2"
                      component="a"
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: '#3498db', textDecoration: 'none' }}
                    >
                      View Project
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ color: '#2c3e50', fontWeight: 'bold' }}
              >
                CERTIFICATIONS
              </Typography>
              <Divider sx={{ mb: 2, borderColor: '#2c3e50', borderWidth: 2 }} />

              {certifications.map((cert, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {cert.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {cert.issuer}
                    {cert.date ? ` | ${cert.date}` : ''}
                  </Typography>
                  {cert.link && (
                    <Typography
                      variant="body2"
                      component="a"
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: '#3498db', textDecoration: 'none' }}
                    >
                      View Certificate
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}

          {/* References */}
          {references && references.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ color: '#2c3e50', fontWeight: 'bold' }}
              >
                REFERENCES
              </Typography>
              <Divider sx={{ mb: 2, borderColor: '#2c3e50', borderWidth: 2 }} />

              {references.map((reference, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {reference.name}
                  </Typography>
                  {reference.position && (
                    <Typography
                      variant="subtitle2"
                      sx={{ color: '#3498db', fontWeight: 'bold' }}
                    >
                      {reference.position}
                      {reference.company ? ` at ${reference.company}` : ''}
                    </Typography>
                  )}
                  {reference.contact && (
                    <Typography variant="body2">{reference.contact}</Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProfessionalTemplate;
