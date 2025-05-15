import BasicTemplate from './BasicTemplate';
import ModernTemplate from './ModernTemplate';
import MinimalTemplate from './MinimalTemplate';
import ProfessionalTemplate from './ProfessionalTemplate';

// Export templates
export { BasicTemplate, ModernTemplate, MinimalTemplate, ProfessionalTemplate };

// List of all templates
export const resumeTemplates = [
  {
    id: 'basic',
    name: 'Basic',
    component: BasicTemplate,
    image: '/templates/basic.png',
    description: 'Clean and organized, a classic resume design',
  },
  {
    id: 'modern',
    name: 'Modern',
    component: ModernTemplate,
    image: '/templates/modern.png',
    description: 'Contemporary design with a focus on skills and experience',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    component: MinimalTemplate,
    image: '/templates/minimal.png',
    description: 'Simple and elegant design with minimal distractions',
  },
  {
    id: 'professional',
    name: 'Professional',
    component: ProfessionalTemplate,
    image: '/templates/professional.png',
    description: 'Formal corporate resume design for professional settings',
  },
];

// Find template by ID
export const getTemplateById = (id) => {
  return resumeTemplates.find((template) => template.id === id);
};
