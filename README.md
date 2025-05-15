# Resume Builder

A modern, user-friendly resume builder application built with React. Create, customize, and export professional resumes with ease. Powered by Google's Gemini AI to help you create more impactful resumes.

## 🌟 Features

- **AI-Powered Content Generation**: Leverage Google's Gemini AI to:
  - Generate professional summaries
  - Enhance job descriptions
  - Suggest relevant skills
  - Optimize content for ATS systems
- **Multiple Resume Templates**: Choose from various professional templates
- **Real-time Preview**: See changes as you make them
- **Export Options**: Download your resume in PDF and DOCX formats
- **User-friendly Interface**: Material-UI based modern design
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Data Persistence**: Save your progress using Firebase integration

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/fulu35/resume-builder.git
cd resume-builder
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start the development server

```bash
npm start
# or
yarn start
```

The application will open in your default browser at `http://localhost:3000`

## 🛠️ Built With

- [React](https://reactjs.org/) - Frontend framework
- [Material-UI](https://mui.com/) - UI component library
- [Firebase](https://firebase.google.com/) - Backend and authentication
- [React Router](https://reactrouter.com/) - Navigation
- [docx](https://www.npmjs.com/package/docx) - DOCX file generation
- [jsPDF](https://www.npmjs.com/package/jspdf) - PDF generation
- [Google Gemini AI](https://ai.google.dev/) - AI-powered content generation

## 📦 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Main application pages
├── contexts/      # React context providers
├── services/      # API and service integrations
├── templates/     # Resume templates
├── utils/         # Utility functions
└── styles/        # CSS and styling files
```

## 🔧 Configuration

The application uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

## 🚀 Deployment

The application can be built for production using:

```bash
npm run build
# or
yarn build
```

This will create an optimized build in the `build` directory.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter) - email@example.com

Project Link: [https://github.com/your-username/resume-builder](https://github.com/your-username/resume-builder)

## 🙏 Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc
