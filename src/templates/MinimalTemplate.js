import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Grid,
  Paper,
  Chip,
  Link,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WebIcon from '@mui/icons-material/Web';

const MinimalTemplate = ({ resumeData }) => {
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
    <Paper
      elevation={0}
      sx={{
        maxWidth: '21cm',
        margin: '0 auto',
        p: 6,
        background: '#fff',
      }}
    >
      {/* Header with personal info */}
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 300, letterSpacing: 1 }}
        >
          {personalInfo.fullName || 'Full Name'}
        </Typography>

        {personalInfo.title && (
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 300, color: '#666' }}
          >
            {personalInfo.title}
          </Typography>
        )}

        <Grid container spacing={1} justifyContent="center" sx={{ mt: 1 }}>
          {personalInfo.email && (
            <Grid item>
              <Box
                sx={{ display: 'flex', alignItems: 'center', color: '#666' }}
              >
                <EmailIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2">{personalInfo.email}</Typography>
              </Box>
            </Grid>
          )}

          {personalInfo.phone && (
            <Grid item>
              <Box
                sx={{ display: 'flex', alignItems: 'center', color: '#666' }}
              >
                <PhoneIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2">{personalInfo.phone}</Typography>
              </Box>
            </Grid>
          )}

          {personalInfo.location && (
            <Grid item>
              <Box
                sx={{ display: 'flex', alignItems: 'center', color: '#666' }}
              >
                <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2">{personalInfo.location}</Typography>
              </Box>
            </Grid>
          )}

          {personalInfo.linkedin && (
            <Grid item>
              <Box
                sx={{ display: 'flex', alignItems: 'center', color: '#666' }}
              >
                <LinkedInIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2">{personalInfo.linkedin}</Typography>
              </Box>
            </Grid>
          )}

          {personalInfo.website && (
            <Grid item>
              <Box
                sx={{ display: 'flex', alignItems: 'center', color: '#666' }}
              >
                <WebIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2">{personalInfo.website}</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Summary */}
      {personalInfo.summary && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              mb: 1,
              fontWeight: 300,
              borderBottom: '1px solid #eee',
              pb: 1,
            }}
          >
            SUMMARY
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            {personalInfo.summary}
          </Typography>
        </Box>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              mb: 1,
              fontWeight: 300,
              borderBottom: '1px solid #eee',
              pb: 1,
            }}
          >
            WORK EXPERIENCE
          </Typography>

          {experience.map((exp, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                component="h3"
                sx={{ fontWeight: 400, color: '#333' }}
              >
                {exp.title}
                {exp.company && ` at ${exp.company}`}
              </Typography>

              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                {exp.startDate} - {exp.endDate || 'Present'}
                {exp.location && ` | ${exp.location}`}
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
            variant="h5"
            component="h2"
            sx={{
              mb: 1,
              fontWeight: 300,
              borderBottom: '1px solid #eee',
              pb: 1,
            }}
          >
            EDUCATION
          </Typography>

          {education.map((edu, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                component="h3"
                sx={{ fontWeight: 400, color: '#333' }}
              >
                {edu.degree}
                {edu.school && ` at ${edu.school}`}
              </Typography>

              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                {edu.startDate} - {edu.endDate || 'Present'}
                {edu.location && ` | ${edu.location}`}
              </Typography>

              {edu.description && (
                <Typography variant="body2">{edu.description}</Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Skills and Languages */}
      <Grid container spacing={3}>
        {/* Skills */}
        {skillsList.length > 0 && (
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  mb: 1,
                  fontWeight: 300,
                  borderBottom: '1px solid #eee',
                  pb: 1,
                }}
              >
                SKILLS
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {skillsList.map((skill, index) => (
                  <Chip
                    key={index}
                    label={`${skill.name}${
                      skill.level ? ` (${skill.level})` : ''
                    }`}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  mb: 1,
                  fontWeight: 300,
                  borderBottom: '1px solid #eee',
                  pb: 1,
                }}
              >
                LANGUAGES
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {languages.map((language, index) => (
                  <Chip
                    key={index}
                    label={`${language.name}${
                      language.level ? ` (${language.level})` : ''
                    }`}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Projects */}
      {projects.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              mb: 1,
              fontWeight: 300,
              borderBottom: '1px solid #eee',
              pb: 1,
            }}
          >
            PROJECTS
          </Typography>

          {projects.map((project, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                component="h3"
                sx={{ fontWeight: 400, color: '#333' }}
              >
                {project.title}
              </Typography>

              {project.date && (
                <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                  {project.date}
                </Typography>
              )}

              <Typography variant="body2">{project.description}</Typography>

              {project.link && (
                <Link
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ display: 'block', mt: 1, fontSize: '0.875rem' }}
                >
                  View Project
                </Link>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              mb: 1,
              fontWeight: 300,
              borderBottom: '1px solid #eee',
              pb: 1,
            }}
          >
            CERTIFICATIONS
          </Typography>

          {certifications.map((cert, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 400 }}>
                {cert.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                {cert.issuer}
                {cert.date && ` | ${cert.date}`}
              </Typography>
              {cert.link && (
                <Link
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ display: 'block', mt: 0.5, fontSize: '0.875rem' }}
                >
                  View Certificate
                </Link>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* References */}
      {references.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              mb: 1,
              fontWeight: 300,
              borderBottom: '1px solid #eee',
              pb: 1,
            }}
          >
            REFERENCES
          </Typography>

          <Grid container spacing={2}>
            {references.map((reference, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 400 }}>
                    {reference.name}
                  </Typography>
                  {reference.position && (
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {reference.position}
                    </Typography>
                  )}
                  {reference.company && (
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {reference.company}
                    </Typography>
                  )}
                  {reference.contact && (
                    <Typography variant="body2">{reference.contact}</Typography>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default MinimalTemplate;
