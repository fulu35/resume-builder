/**
 * Application Configuration
 * This file centralizes access to environment variables
 */

// AI Configuration
export const AI_CONFIG = {
  GEMINI_API_KEY: process.env.REACT_APP_GEMINI_API_KEY,
  // You can add more AI-related config here
};

// Firebase Configuration
export const FIREBASE_CONFIG = {
  API_KEY: process.env.REACT_APP_FIREBASE_API_KEY,
  AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  STORAGE_BUCKET: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  MESSAGING_SENDER_ID: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  APP_ID: process.env.REACT_APP_FIREBASE_APP_ID,
  MEASUREMENT_ID: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// App Configuration
export const APP_CONFIG = {
  ENV: process.env.REACT_APP_ENV || 'development',
  DEBUG: process.env.REACT_APP_DEBUG === 'true',
};

// Utility function to check if API keys are configured
export const checkApiConfig = () => {
  const missingKeys = [];
  const invalidKeys = [];

  // Check Gemini API Key
  if (!AI_CONFIG.GEMINI_API_KEY) {
    missingKeys.push('REACT_APP_GEMINI_API_KEY');
  } else if (
    AI_CONFIG.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY' ||
    AI_CONFIG.GEMINI_API_KEY.length < 10
  ) {
    invalidKeys.push('REACT_APP_GEMINI_API_KEY');
  }

  // Check Firebase API Key
  if (!FIREBASE_CONFIG.API_KEY) {
    missingKeys.push('REACT_APP_FIREBASE_API_KEY');
  } else if (
    FIREBASE_CONFIG.API_KEY === 'YOUR_FIREBASE_API_KEY' ||
    FIREBASE_CONFIG.API_KEY.length < 10
  ) {
    invalidKeys.push('REACT_APP_FIREBASE_API_KEY');
  }

  // Log issues if found
  if (missingKeys.length > 0) {
    console.error('Missing API keys:', missingKeys.join(', '));
  }

  if (invalidKeys.length > 0) {
    console.error('Invalid API keys:', invalidKeys.join(', '));
  }

  return {
    isConfigured: missingKeys.length === 0 && invalidKeys.length === 0,
    missingKeys,
    invalidKeys,
  };
};

// Anonim nesne yerine isimlendirme yaptım
const appConfig = {
  AI_CONFIG,
  FIREBASE_CONFIG,
  APP_CONFIG,
  checkApiConfig,
};

export default appConfig;
