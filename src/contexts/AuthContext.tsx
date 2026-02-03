import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'professor' | 'student' | 'grader';
  institution: string;
  professorId?: string; // For graders - links to their professor
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  universities: University[];
  professors: Professor[];
  addUniversity: (name: string) => void;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'professor' | 'student' | 'grader';
  institution: string;
  professorEmail?: string; // For graders
}

interface University {
  id: string;
  name: string;
}

interface Professor {
  id: string;
  name: string;
  email: string;
  institution: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Global data that persists across the app
  const [universities, setUniversities] = useState<University[]>([
    { id: 'stanford', name: 'Stanford University' },
    { id: 'mit', name: 'Massachusetts Institute of Technology' },
    { id: 'harvard', name: 'Harvard University' },
    { id: 'berkeley', name: 'UC Berkeley' },
    { id: 'caltech', name: 'California Institute of Technology' }
  ]);

  const [professors, setProfessors] = useState<Professor[]>([
    { id: 'prof1', name: 'Dr. Sarah Johnson', email: 'sarah.johnson@stanford.edu', institution: 'stanford' },
    { id: 'prof2', name: 'Dr. Michael Chen', email: 'michael.chen@mit.edu', institution: 'mit' },
    { id: 'prof3', name: 'Dr. Emily Rodriguez', email: 'emily.rodriguez@harvard.edu', institution: 'harvard' }
  ]);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('gradrly_user');
    const storedUniversities = localStorage.getItem('gradrly_universities');
    const storedProfessors = localStorage.getItem('gradrly_professors');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('gradrly_user');
      }
    }
    
    if (storedUniversities) {
      try {
        setUniversities(JSON.parse(storedUniversities));
      } catch (error) {
        localStorage.removeItem('gradrly_universities');
      }
    }
    
    if (storedProfessors) {
      try {
        setProfessors(JSON.parse(storedProfessors));
      } catch (error) {
        localStorage.removeItem('gradrly_professors');
      }
    }
    
    setLoading(false);
  }, []);

  // Save universities and professors to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gradrly_universities', JSON.stringify(universities));
  }, [universities]);

  useEffect(() => {
    localStorage.setItem('gradrly_professors', JSON.stringify(professors));
  }, [professors]);

  const addUniversity = (name: string) => {
    const newId = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newUniversity = { id: newId, name: name.trim() };
    setUniversities(prev => [...prev, newUniversity]);
    return newId;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call - replace with actual authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user is a professor first
    const existingProfessor = professors.find(p => p.email === email);
    
    // Mock user data based on email domain and existing data
    const mockUser: User = {
      id: Math.random().toString(36),
      email,
      name: existingProfessor?.name || email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      role: email.includes('student') ? 'student' : email.includes('grader') ? 'grader' : 'professor',
      institution: existingProfessor?.institution || email.split('@')[1] || 'University',
    };
    
    setUser(mockUser);
    localStorage.setItem('gradrly_user', JSON.stringify(mockUser));
    setLoading(false);
    return true;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let institutionId = userData.institution;
    let professorId: string | undefined;

    // Handle different registration flows
    if (userData.role === 'professor') {
      // For professors, add university if it doesn't exist
      const existingUniversity = universities.find(u => 
        u.name.toLowerCase() === userData.institution.toLowerCase()
      );
      
      if (!existingUniversity) {
        institutionId = addUniversity(userData.institution);
      } else {
        institutionId = existingUniversity.id;
      }
      
      // Add professor to the list
      const newProfessor: Professor = {
        id: Math.random().toString(36),
        name: userData.name,
        email: userData.email,
        institution: institutionId
      };
      setProfessors(prev => [...prev, newProfessor]);
      
    } else if (userData.role === 'grader' && userData.professorEmail) {
      // For graders, find their professor and inherit institution
      const professor = professors.find(p => p.email === userData.professorEmail);
      if (professor) {
        institutionId = professor.institution;
        professorId = professor.id;
      }
    }
    
    const newUser: User = {
      id: Math.random().toString(36),
      email: userData.email,
      name: userData.name,
      role: userData.role,
      institution: institutionId,
      professorId,
    };
    
    setUser(newUser);
    localStorage.setItem('gradrly_user', JSON.stringify(newUser));
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gradrly_user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
    universities,
    professors,
    addUniversity,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};