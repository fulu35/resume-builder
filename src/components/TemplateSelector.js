import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Container,
} from '@mui/material';
import { resumeTemplates } from '../templates';

const TemplateSelector = ({ selectedTemplateId, onSelect }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(
    selectedTemplateId || 'basic'
  );

  useEffect(() => {
    // Update selected template if selectedTemplateId prop changes
    if (selectedTemplateId && selectedTemplateId !== selectedTemplate) {
      setSelectedTemplate(selectedTemplateId);
    }
  }, [selectedTemplateId, selectedTemplate]);

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);

    // Call the parent component's callback
    if (onSelect) {
      onSelect(templateId);
    }

    console.log('Template selected:', templateId);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Choose a Resume Template
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 4 }}>
        Select a design that best showcases your resume. You can change your
        template at any time.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {resumeTemplates.map((template) => (
          <Grid item xs={12} sm={6} md={3} key={template.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border:
                  selectedTemplate === template.id
                    ? '2px solid #1976d2'
                    : '1px solid #e0e0e0',
                boxShadow:
                  selectedTemplate === template.id
                    ? '0 0 10px rgba(25, 118, 210, 0.3)'
                    : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              <CardActionArea
                onClick={() => handleTemplateSelect(template.id)}
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
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
    </Container>
  );
};

export default TemplateSelector;
