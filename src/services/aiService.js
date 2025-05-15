/**
 * AI Service for Gemini API interactions
 * This service centralizes all AI-related functionality
 */
import { AI_CONFIG, checkApiConfig } from './config';

// Check if API key is available
const getApiKey = () => {
  const { isConfigured, missingKeys } = checkApiConfig();
  if (!isConfigured) {
    throw new Error(
      `Missing required API configuration: ${missingKeys.join(', ')}`
    );
  }
  return AI_CONFIG.GEMINI_API_KEY;
};

/**
 * Generate a resume summary using Gemini AI
 * @param {Object} params - Parameters for summary generation
 * @param {string} params.title - User's job title
 * @param {string} [params.currentSummary] - Existing summary if any
 * @param {Array} [params.skills] - User's skills if any
 * @returns {Promise<string>} - The generated summary
 */
export const generateResumeSummary = async ({
  title,
  currentSummary = '',
  skills = [],
}) => {
  try {
    const apiKey = getApiKey();
    // Güncellenmiş API endpoint (v1 versiyonu)
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // Yetenekleri string formatına dönüştür
    const skillsText =
      skills && skills.length > 0
        ? `Incorporate the following skills in the summary: ${skills
            .map((skill) => skill.name)
            .join(', ')}.`
        : 'Focus on general skills relevant to this position.';

    // Prompt oluştur - mevcut özet varsa geliştir, yoksa yeni oluştur
    const promptType = currentSummary
      ? `Improve the following resume summary for a ${title}. Make it more professional, engaging, and impactful: "${currentSummary}". Keep it to 2-3 sentences.`
      : `Write a professional and 2-3 sentence resume summary for a ${title}. Focus on key skills and experience relevant to the role. The summary should be engaging, professional, and highlight strengths.`;

    const prompt = `${promptType}
    
    ${skillsText}
    
    Do not use placeholder text or mention AI in the response. Do not include the person's name in the summary.`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 150,
          topP: 0.8,
          topK: 40,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('AI result generateResumeSummary', result);
    const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No text generated from AI');
    }

    return generatedText.trim();
  } catch (error) {
    console.error('Error in AI service:', error);
    throw error;
  }
};

/**
 * Generate job experience description using Gemini AI
 * @param {Object} params - Parameters for description generation
 * @param {string} params.jobTitle - User's job title
 * @param {string} params.duration - How long the user worked in this position
 * @param {string} [params.currentDescription] - Existing description if any
 * @returns {Promise<string>} - The generated job description
 */
export const generateJobDescription = async ({
  jobTitle,
  duration,
  currentDescription = '',
  companyName,
}) => {
  try {
    const apiKey = getApiKey();
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // Create prompt based on whether there's an existing description
    const promptType = currentDescription
      ? `I have a job description for a ${jobTitle} position that I've worked for ${duration}. 
         Here's my current description: "${currentDescription}"
         Please improve this description to make it more, professional, and impactful. Clear and understanable for a non-technical audience.`

      : `Generate me a professional job description for my ${jobTitle} position that I've worked for ${duration} at ${companyName} by giving long and more detailed statements and make those responsibilities done by me.`


    const prompt =`${promptType}
    It is used on resumse.
    It will be like user's job description.
    Focus on quality over quantity. Be but impactful.
    Do not include generic phrases, fluff, or filler text.
    Do not use bullet points or numbered lists.
    Do not mention AI in the response.`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 100,
          topP: 0.8,
          topK: 40,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('AI result generateJobDescription', result);
    const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No text generated from AI');
    }

    // Additional safety check to ensure the response is not too long
    let finalText = generatedText.trim();

    // Count sentences - simple approach
    const sentenceCount = (finalText.match(/[.!?]+/g) || []).length;

    // If more than 3 sentences, try to truncate
    if (sentenceCount > 3) {
      const sentences = finalText.split(/[.!?]+\s+/);
      finalText = sentences.slice(0, 3).join('. ') + '.';
    }

    return finalText;
  } catch (error) {
    console.error('Error generating job description:', error);
    throw error;
  }
};

/**
 * Generate skills suggestions based on job title
 * @param {string} jobTitle - The primary job title to generate skills for
 * @param {string[]} [allJobTitles=[]] - All job titles for additional context
 * @param {string[]} [existingSkills=[]] - Skills already added by the user
 * @returns {Promise<string[]>} - Array of suggested skills
 */
export const generateSkillsSuggestions = async (
  jobTitle,
  allJobTitles = [],
  existingSkills = []
) => {
  try {
    if (!jobTitle || typeof jobTitle !== 'string' || jobTitle.trim() === '') {
      console.error('Invalid job title provided:', jobTitle);

      // For frontend developer, provide default frontend skills as an emergency fallback
      // This is a temporary solution until the form state management is fixed
      if (
        allJobTitles &&
        allJobTitles.some(
          (title) =>
            title.toLowerCase().includes('frontend') ||
            title.toLowerCase().includes('front-end') ||
            title.toLowerCase().includes('front end')
        )
      ) {
        console.log('Emergency fallback for frontend developer');
        return [
          'HTML',
          'CSS',
          'JavaScript',
          'React',
          'Vue.js',
          'TypeScript',
          'Responsive Design',
          'Webpack',
          'Redux',
          'UI/UX',
          'SASS/SCSS',
          'REST APIs',
        ];
      }

      // Return empty array instead of default skills
      return [];
    }

    const cleanJobTitle = jobTitle.trim();
    console.log('Generating skills for job title:', cleanJobTitle);

    try {
      const apiKey = getApiKey();
      console.log('API key available:', apiKey ? 'Yes' : 'No');

      // Updated API endpoint (v1 version)
      const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      // Create context from all job titles if available
      const jobContext =
        allJobTitles && allJobTitles.length > 0
          ? `The person has experience in the following roles: ${allJobTitles.join(
              ', '
            )}.`
          : '';

      // Create context of existing skills to avoid duplicates and encourage diversity
      const existingSkillsContext =
        existingSkills && existingSkills.length > 0
          ? `The user already has the following skills: ${existingSkills.join(
              ', '
            )}. DO NOT suggest any of these.`
          : '';

      const prompt = `Generate a list of 12 technical skills that are CORE and ESSENTIAL specifically for a "${cleanJobTitle}" role.
      ${jobContext}
      ${existingSkillsContext}
      
      EXTREMELY IMPORTANT INSTRUCTIONS:
      1. ONLY include skills that are considered PRIMARY and CORE for this EXACT job title.
      2. DO NOT make assumptions about related fields - focus ONLY on what this specific role typically requires.
      3. DO NOT include skills from adjacent specialties unless they are truly essential for this exact role.
      4. DO NOT include general professional skills or soft skills.
      5. DO NOT duplicate any skills the user already has.
      6. Return skills in order of importance/relevance to this specific job title.
      
      For example:
      - For a "Frontend Developer": HTML, CSS, JavaScript, React, Vue.js, responsive design, etc.
      - For a "Database Administrator": SQL, database optimization, backup procedures, etc.
      - For a "Pediatrician": pediatric assessment, growth monitoring, vaccination protocols, etc.
      
      Return only the list of skills separated by commas, without numbering or bullet points.`;

      console.log('Sending request to Gemini API for technical skills...');
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3, // Lower temperature for precision
            maxOutputTokens: 200,
            topP: 0.9,
            topK: 40,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Failed to parse error response' }));
        console.error('Gemini API Error:', errorData);
        console.error('Status:', response.status, response.statusText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('AI Result for skills:', result);
      const skillsText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!skillsText) {
        console.error('Empty response from Gemini API');
        throw new Error('No skills generated from API');
      }

      // Parse the comma-separated list into an array and clean up results
      const skillsArray = skillsText
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill);
      console.log('Successfully generated technical skills:', skillsArray);

      // If we didn't get enough unique skills, just return what we have without fallback
      if (skillsArray.length < 5) {
        console.log('Not enough skills generated, but returning what we have');
        return skillsArray; // Just return what we have, no fallback
      }

      return skillsArray;
    } catch (apiError) {
      console.error('API Error in generateSkillsSuggestions:', apiError);
      // Check if the error is related to API key
      if (apiError.message && apiError.message.includes('API key')) {
        console.error(
          'API key issue detected, check your environment variables'
        );
      }
      // Return empty array instead of falling back to default skills
      return [];
    }
  } catch (error) {
    console.error('Error generating skills:', error);
    return []; // Return empty array instead of generic default skills
  }
};

// Anonim nesne yerine isimlendirme yaptım
const aiService = {
  generateResumeSummary,
  generateSkillsSuggestions,
  generateJobDescription,
};

export default aiService;
