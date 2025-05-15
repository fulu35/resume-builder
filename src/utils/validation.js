export const validateFormData = (data, step) => {
  const errors = [];

  switch (step) {
    case 0: // Personal Info
      if (!data.fullName?.trim()) {
        errors.push('Full Name is required.');
      }
      if (!data.email?.trim()) {
        errors.push('Email is required.');
      } else if (!isValidEmail(data.email)) {
        errors.push('Please enter a valid email address.');
      }
      if (!data.phone?.trim()) {
        errors.push('Phone number is required.');
      }
      break;

    case 1: // Education
      // Education is now optional
      if (Array.isArray(data) && data.length > 0) {
        data.forEach((edu, index) => {
          if (!edu.institution?.trim()) {
            errors.push(`School name is required for education #${index + 1}.`);
          }
          if (!edu.degree?.trim()) {
            errors.push(`Degree is required for education #${index + 1}.`);
          }
          if (!edu.startDate) {
            errors.push(`Start date is required for education #${index + 1}.`);
          }
        });
      }
      break;

    case 2: // Experience
      if (!Array.isArray(data)) {
        errors.push('Experience data is not in a valid format.');
      } else if (data.length > 0) {
        console.log('Validating experience data:', data);
        data.forEach((exp, index) => {
          if (!exp.company?.trim()) {
            errors.push(
              `Company name is required for experience #${index + 1}.`
            );
          }
          if (!exp.title?.trim()) {
            console.log(`Title is missing for experience index ${index}:`, exp);
            errors.push(
              `Position/title is required for experience #${index + 1}.`
            );
          }
          if (!exp.startDate) {
            errors.push(`Start date is required for experience #${index + 1}.`);
          }
        });
      }
      break;

    case 3: // Skills
      if (
        !data.skills ||
        !Array.isArray(data.skills) ||
        data.skills.length === 0
      ) {
        errors.push('At least one skill is required.');
      }
      if (!data.languages || !Array.isArray(data.languages)) {
        errors.push('Language information is not in a valid format.');
      }
      break;

    case 4: // Additional Info
      if (!data) {
        errors.push('Additional information is not in a valid format.');
      }
      // Projects, certifications, and references are optional
      break;

    case 5: // Template Selection
      if (!data) {
        errors.push('Please select a template.');
      }
      break;

    default:
      break;
  }

  return errors;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
