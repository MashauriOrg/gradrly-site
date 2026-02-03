import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import StudentPortal from './pages/StudentPortal';
import GraderPortal from './pages/GraderPortal';
import About from './pages/About';
import Pricing from './pages/Pricing';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/student-portal" element={<StudentPortal />} />
            <Route path="/grader-portal" element={<GraderPortal />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;