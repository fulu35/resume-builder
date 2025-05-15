# Environment Variables Guide / Ortam Değişkenleri Kılavuzu

## English

### Setting Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and enter your project name (e.g., "resume-builder")
3. Enable or disable Google Analytics as needed, then click "Create project"
4. After project creation is complete, click "Continue"
5. In the Project Overview, click the web icon (</>) to add a web app
6. Register your app with a nickname (e.g., "resume-builder-web"), then click "Register app"
7. Firebase will show you configuration details. Copy these values to your `.env.local` file:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```
8. Enable Authentication (if needed):
   - Click "Authentication" in the left sidebar
   - Click "Get started"
   - Select sign-in methods (e.g., Email/Password, Google)
   - Click "Enable" and configure each method
9. Set up Firestore Database (if needed):
   - Click "Firestore Database" in the left sidebar
   - Click "Create database"
   - Choose mode (Production or Test)
   - Select a location for your database
   - Click "Enable"
10. Set up Storage (if needed):
    - Click "Storage" in the left sidebar
    - Click "Get started"
    - Review and accept the default security rules
    - Select a location for your storage bucket
    - Click "Done"

### Setting Up Gemini API

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API key" in the left sidebar
4. If you don't have an existing key, click "Create API key"
5. Copy the generated API key
6. Add the key to your `.env.local` file:
   ```
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key
   ```
7. For higher usage limits:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to "APIs & Services" > "Library"
   - Search for "Gemini API" and enable it
   - Go to "APIs & Services" > "Credentials"
   - Click "Create credentials" > "API key"
   - Copy the new API key to your `.env.local` file
   ```