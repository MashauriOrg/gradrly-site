# Gradrly - AI-Powered Academic Grading Platform

A modern, intelligent grading platform that transforms how educators assess and provide feedback on student work using advanced AI technology.

## 🚀 Features

### For Professors
- **AI-Powered Grading**: Automated grading with GPT-4 integration
- **Smart Rubric Builder**: Create detailed grading criteria with AI assistance
- **Assignment Management**: Streamlined assignment creation and distribution
- **Analytics Dashboard**: Comprehensive performance tracking and insights
- **Multi-Course Support**: Manage multiple courses and assignments

### For Students
- **Instant Feedback**: Get detailed AI-generated feedback immediately
- **Progress Tracking**: Monitor your academic performance over time
- **Easy Submission**: Drag-and-drop file uploads with multiple format support
- **Grade Analytics**: Detailed breakdowns of your performance
- **Assignment Calendar**: Never miss a deadline with integrated reminders

### For Graders
- **AI Assistance**: Get AI suggestions for consistent grading
- **Efficiency Tools**: Streamlined grading workflow with bulk operations
- **Quality Metrics**: Track your grading performance and consistency
- **Collaboration**: Seamless coordination with professors and teams

## 🛠 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **AI Integration**: OpenAI GPT-4
- **Build Tool**: Vite
- **Deployment**: Bolt Hosting

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout wrapper
│   └── AIGradingPanel.tsx # AI grading interface
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── pages/              # Page components
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ProfessorDashboard.tsx
│   ├── StudentDashboard.tsx
│   ├── GraderDashboard.tsx
│   ├── AssignmentCreator.tsx
│   ├── RubricBuilder.tsx
│   ├── GradingPage.tsx
│   ├── StudentPortal.tsx
│   ├── GraderPortal.tsx
│   ├── About.tsx
│   └── Pricing.tsx
├── services/           # API and external services
│   └── aiGradingService.ts # OpenAI integration
└── main.tsx           # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key (for AI grading features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gradrly.git
cd gradrly
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Add your OpenAI API key to the `.env` file:
```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Key Features

### AI-Powered Grading
- **GPT-4 Integration**: Advanced natural language processing for accurate assessment
- **Rubric-Based Evaluation**: Consistent grading against predefined criteria
- **Detailed Feedback**: Comprehensive comments on strengths and improvements
- **Confidence Scoring**: AI provides confidence levels for its assessments

### User Management
- **Multi-Role Support**: Professors, students, and graders with role-specific features
- **Institution Management**: Support for multiple universities and courses
- **Secure Authentication**: Protected routes and user session management

### Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Smooth Animations**: Engaging user experience with Framer Motion
- **Accessible**: Built with accessibility best practices
- **Dark Mode Ready**: Prepared for theme switching

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

## 📝 Demo Credentials

For testing purposes, you can use these demo credentials:

- **Professor**: professor@university.edu (any password)
- **Student**: student@university.edu (any password)  
- **Grader**: grader@university.edu (any password)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT-4 API
- The React and TypeScript communities
- All contributors and testers

## 📞 Support

For support, email support@gradrly.com or join our Slack channel.

---

Built with ❤️ by the Gradrly team