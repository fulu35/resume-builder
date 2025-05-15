import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Grid,
  Paper,
  Container,
  List,
  ListItem,
  ListItemText,
  Link,
  Chip,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WebIcon from '@mui/icons-material/Web';
import LinkIcon from '@mui/icons-material/Link';

const BasicTemplate = ({ resumeData }) => {
  // Use appropriate default values if data is missing
  const {
    personalInfo = {},
    education = [],
    experience = [],
    skills = { skills: [], languages: [] },
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
    <Container
      sx={{ p: 4, fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}
    >
      {/* Header */}
      <Box component="header" sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {personalInfo.fullName || 'Full Name'}
        </Typography>

        {personalInfo.title && (
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: 'text.secondary' }}
          >
            {personalInfo.title}
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 2,
            mt: 2,
          }}
        >
          {personalInfo.email && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon sx={{ mr: 0.5, fontSize: 18 }} />
              <Typography variant="body2">{personalInfo.email}</Typography>
            </Box>
          )}

          {personalInfo.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PhoneIcon sx={{ mr: 0.5, fontSize: 18 }} />
              <Typography variant="body2">{personalInfo.phone}</Typography>
            </Box>
          )}

          {personalInfo.location && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOnIcon sx={{ mr: 0.5, fontSize: 18 }} />
              <Typography variant="body2">{personalInfo.location}</Typography>
            </Box>
          )}

          {personalInfo.linkedin && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LinkedInIcon sx={{ mr: 0.5, fontSize: 18 }} />
              <Typography variant="body2">{personalInfo.linkedin}</Typography>
            </Box>
          )}

          {personalInfo.website && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WebIcon sx={{ mr: 0.5, fontSize: 18 }} />
              <Typography variant="body2">{personalInfo.website}</Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Summary */}
      {personalInfo.summary && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              borderBottom: '1px solid #ddd',
              pb: 1,
            }}
          >
            SUMMARY
          </Typography>
          <Typography variant="body1" paragraph>
            {personalInfo.summary}
          </Typography>
        </Box>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              borderBottom: '1px solid #ddd',
              pb: 1,
            }}
          >
            WORK EXPERIENCE
          </Typography>

          {experience.map((exp, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="h6" component="h3">
                {exp.position}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {exp.company}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 1, color: 'text.secondary' }}
              >
                {exp.startDate} - {exp.endDate || 'Present'} | {exp.location}
              </Typography>
              <Typography variant="body2" paragraph>
                {exp.description}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              borderBottom: '1px solid #ddd',
              pb: 1,
            }}
          >
            EDUCATION
          </Typography>

          {education.map((edu, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="h6" component="h3">
                {edu.degree}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {edu.institution}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 1, color: 'text.secondary' }}
              >
                {edu.startDate} - {edu.endDate || 'Present'} | {edu.location}
              </Typography>
              {edu.description && (
                <Typography variant="body2" paragraph>
                  {edu.description}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Skills and Languages */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Skills */}
        {skillsList.length > 0 && (
          <Grid item xs={12} md={6}>
            <Box>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                  borderBottom: '1px solid #ddd',
                  pb: 1,
                }}
              >
                SKILLS
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {skillsList.map((skill, index) => (
                  <Chip
                    key={index}
                    label={
                      skill.name + (skill.level ? ` (${skill.level})` : '')
                    }
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <Grid item xs={12} md={6}>
            <Box>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                  borderBottom: '1px solid #ddd',
                  pb: 1,
                }}
              >
                LANGUAGES
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {languages.map((language, index) => (
                  <Chip
                    key={index}
                    label={
                      language.name +
                      (language.level ? ` (${language.level})` : '')
                    }
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Projects */}
      {projects.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              borderBottom: '1px solid #ddd',
              pb: 1,
            }}
          >
            PROJECTS
          </Typography>

          {projects.map((project, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="h6" component="h3">
                {project.title}
              </Typography>
              {project.date && (
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 1 }}
                >
                  {project.date}
                </Typography>
              )}
              <Typography variant="body2" paragraph>
                {project.description}
              </Typography>
              {project.url && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LinkIcon sx={{ mr: 0.5, fontSize: 16 }} />
                  <Link
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ fontSize: '0.875rem' }}
                  >
                    View Project
                  </Link>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              borderBottom: '1px solid #ddd',
              pb: 1,
            }}
          >
            CERTIFICATIONS
          </Typography>

          {certifications.map((cert, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="h6" component="h3">
                {cert.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', mb: 1 }}
              >
                {cert.issuer} {cert.date && `| ${cert.date}`}
              </Typography>
              {cert.url && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LinkIcon sx={{ mr: 0.5, fontSize: 16 }} />
                  <Link
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ fontSize: '0.875rem' }}
                  >
                    View Certificate
                  </Link>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* References */}
      {references.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              borderBottom: '1px solid #ddd',
              pb: 1,
            }}
          >
            REFERENCES
          </Typography>

          <Grid container spacing={3}>
            {references.map((reference, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" component="h3">
                    {reference.name}
                  </Typography>
                  {reference.position && (
                    <Typography variant="body2">
                      {reference.position}
                    </Typography>
                  )}
                  {reference.company && (
                    <Typography variant="body2">{reference.company}</Typography>
                  )}
                  {reference.email && (
                    <Typography
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <EmailIcon sx={{ mr: 0.5, fontSize: 14 }} />
                      {reference.email}
                    </Typography>
                  )}
                  {reference.phone && (
                    <Typography
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <PhoneIcon sx={{ mr: 0.5, fontSize: 14 }} />
                      {reference.phone}
                    </Typography>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default BasicTemplate;
