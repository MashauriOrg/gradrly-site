import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import AIGradingPanel from '../components/AIGradingPanel';
import { useAuth } from '../contexts/AuthContext';
import { aiGradingService, AIGradingResult, GradingRequest } from '../services/aiGradingService';
import { 
  Upload, 
  FileText, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  Search,
  BookOpen,
  User,
  Send,
  Eye,
  Plus,
  X,
  Brain,
  Settings,
  Wand2
} from 'lucide-react';

const GradingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [submissionText, setSubmissionText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiGradingResult, setAiGradingResult] = useState<AIGradingResult | null>(null);
  const [useAIGrading, setUseAIGrading] = useState(true);
  const [isGeneratingRubric, setIsGeneratingRubric] = useState(false);
  
  // Modal states
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    code: '',
    description: ''
  });
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxPoints: 100,
    useAIGrading: true,
    gradingCriteria: [
      { name: 'Content Quality', description: 'Accuracy and completeness of content', maxPoints: 40, weight: 40 },
      { name: 'Organization', description: 'Structure and logical flow', maxPoints: 30, weight: 30 },
      { name: 'Technical Implementation', description: 'Technical accuracy and implementation', maxPoints: 20, weight: 20 },
      { name: 'Documentation', description: 'Clear documentation and explanations', maxPoints: 10, weight: 10 }
    ]
  });

  // State for dynamic data based on user's institution
  const [courses, setCourses] = useState<{[key: string]: any[]}>({
    stanford: [
      { id: 'cs201', name: 'CS 201 - Data Structures', code: 'CS 201' },
      { id: 'cs301', name: 'CS 301 - Algorithms', code: 'CS 301' },
      { id: 'cs401', name: 'CS 401 - Machine Learning', code: 'CS 401' }
    ],
    mit: [
      { id: 'cs6034', name: 'CS 6.034 - Artificial Intelligence', code: 'CS 6.034' },
      { id: 'cs6824', name: 'CS 6.824 - Distributed Systems', code: 'CS 6.824' }
    ],
    harvard: [
      { id: 'cs181', name: 'CS 181 - Machine Learning', code: 'CS 181' },
      { id: 'cs121', name: 'CS 121 - Computational Theory', code: 'CS 121' }
    ]
  });

  const [assignments, setAssignments] = useState<{[key: string]: any[]}>({
    cs201: [
      { 
        id: 'cs201-final', 
        title: 'Data Structures Final Project', 
        description: 'Implement a comprehensive data structure with full CRUD operations',
        dueDate: '2024-01-15', 
        maxPoints: 100,
        useAIGrading: true,
        gradingCriteria: [
          { name: 'Implementation', description: 'Correct implementation of data structure', maxPoints: 40, weight: 40 },
          { name: 'Testing', description: 'Comprehensive test coverage', maxPoints: 25, weight: 25 },
          { name: 'Documentation', description: 'Clear code documentation', maxPoints: 20, weight: 20 },
          { name: 'Performance', description: 'Efficiency and optimization', maxPoints: 15, weight: 15 }
        ]
      },
      { 
        id: 'cs201-midterm', 
        title: 'Binary Tree Implementation', 
        description: 'Create a binary search tree with insertion, deletion, and traversal methods',
        dueDate: '2024-01-20', 
        maxPoints: 50,
        useAIGrading: true,
        gradingCriteria: [
          { name: 'Correctness', description: 'Correct implementation of BST operations', maxPoints: 30, weight: 60 },
          { name: 'Code Quality', description: 'Clean, readable code', maxPoints: 15, weight: 30 },
          { name: 'Testing', description: 'Test cases and validation', maxPoints: 5, weight: 10 }
        ]
      }
    ],
    cs301: [
      { 
        id: 'cs301-algo', 
        title: 'Algorithm Analysis Essay', 
        description: 'Analyze the time and space complexity of sorting algorithms',
        dueDate: '2024-01-18', 
        maxPoints: 75,
        useAIGrading: true,
        gradingCriteria: [
          { name: 'Analysis Depth', description: 'Thorough complexity analysis', maxPoints: 35, weight: 47 },
          { name: 'Writing Quality', description: 'Clear and coherent writing', maxPoints: 25, weight: 33 },
          { name: 'Examples', description: 'Relevant examples and illustrations', maxPoints: 15, weight: 20 }
        ]
      }
    ],
    cs401: [
      { 
        id: 'cs401-ml', 
        title: 'Machine Learning Final Project', 
        description: 'Build and evaluate a machine learning model for a real-world problem',
        dueDate: '2024-01-25', 
        maxPoints: 100,
        useAIGrading: true,
        gradingCriteria: [
          { name: 'Model Implementation', description: 'Correct ML model implementation', maxPoints: 40, weight: 40 },
          { name: 'Data Analysis', description: 'Thorough data exploration and preprocessing', maxPoints: 25, weight: 25 },
          { name: 'Evaluation', description: 'Proper model evaluation and metrics', maxPoints: 20, weight: 20 },
          { name: 'Report Quality', description: 'Clear documentation and insights', maxPoints: 15, weight: 15 }
        ]
      }
    ]
  });

  const mockStudents = [
    { email: 'john.doe@stanford.edu', name: 'John Doe', institution: 'stanford' },
    { email: 'jane.smith@mit.edu', name: 'Jane Smith', institution: 'mit' },
    { email: 'alex.johnson@harvard.edu', name: 'Alex Johnson', institution: 'harvard' },
    { email: 'maria.garcia@berkeley.edu', name: 'Maria Garcia', institution: 'berkeley' }
  ];

  const handleGenerateRubric = async () => {
    if (!newAssignment.description.trim()) {
      alert('Please enter an assignment description first');
      return;
    }

    setIsGeneratingRubric(true);
    try {
      const criteria = await aiGradingService.generateRubric(
        newAssignment.description, 
        newAssignment.maxPoints
      );
      setNewAssignment(prev => ({ ...prev, gradingCriteria: criteria }));
    } catch (error) {
      console.error('Failed to generate rubric:', error);
      alert('Failed to generate rubric. Please try again.');
    } finally {
      setIsGeneratingRubric(false);
    }
  };

  const handleCreateCourse = () => {
    if (newCourse.name.trim() && newCourse.code.trim() && user?.institution) {
      const courseId = `${newCourse.code.toLowerCase().replace(/\s+/g, '')}-${Date.now()}`;
      const course = {
        id: courseId,
        name: `${newCourse.code} - ${newCourse.name}`,
        code: newCourse.code,
        description: newCourse.description
      };

      setCourses(prev => ({
        ...prev,
        [user.institution]: [...(prev[user.institution] || []), course]
      }));

      setAssignments(prev => ({
        ...prev,
        [courseId]: []
      }));

      setSelectedCourse(courseId);
      setNewCourse({ name: '', code: '', description: '' });
      setShowCreateCourse(false);
    }
  };

  const handleCreateAssignment = () => {
    if (newAssignment.title.trim() && selectedCourse) {
      const assignmentId = `${selectedCourse}-${Date.now()}`;
      const assignment = {
        id: assignmentId,
        title: newAssignment.title,
        description: newAssignment.description,
        dueDate: newAssignment.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        maxPoints: newAssignment.maxPoints,
        useAIGrading: newAssignment.useAIGrading,
        gradingCriteria: newAssignment.gradingCriteria
      };

      setAssignments(prev => ({
        ...prev,
        [selectedCourse]: [...(prev[selectedCourse] || []), assignment]
      }));

      setSelectedAssignment(assignmentId);
      setNewAssignment({ 
        title: '', 
        description: '', 
        dueDate: '', 
        maxPoints: 100,
        useAIGrading: true,
        gradingCriteria: [
          { name: 'Content Quality', description: 'Accuracy and completeness of content', maxPoints: 40, weight: 40 },
          { name: 'Organization', description: 'Structure and logical flow', maxPoints: 30, weight: 30 },
          { name: 'Technical Implementation', description: 'Technical accuracy and implementation', maxPoints: 20, weight: 20 },
          { name: 'Documentation', description: 'Clear documentation and explanations', maxPoints: 10, weight: 10 }
        ]
      });
      setShowCreateAssignment(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleStudentEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setStudentEmail(email);
    
    if (email.length > 2) {
      const filtered = mockStudents.filter(student => 
        student.email.toLowerCase().includes(email.toLowerCase()) ||
        student.name.toLowerCase().includes(email.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const selectStudent = (student: any) => {
    setStudentEmail(student.email);
    setSearchResults([]);
  };

  const handleAIGradingComplete = (result: AIGradingResult) => {
    setAiGradingResult(result);
  };

  const getSubmissionContent = async (): Promise<string> => {
    let content = submissionText;
    
    // For demo purposes, we'll extract text from files or use placeholder content
    if (files.length > 0) {
      const fileContents = files.map(file => `File: ${file.name}\n[File content would be extracted here]`);
      content += '\n\n' + fileContents.join('\n\n');
    }
    
    // If no content, provide a sample for demo
    if (!content.trim()) {
      content = `Sample submission content for demonstration:
      
This is a binary search tree implementation with the following features:
- Insert operation with O(log n) average time complexity
- Delete operation handling all three cases (leaf, one child, two children)
- In-order, pre-order, and post-order traversal methods
- Search functionality with early termination
- Proper error handling for edge cases

The implementation uses a recursive approach for most operations and includes comprehensive test cases covering normal operations, edge cases, and error conditions.`;
    }
    
    return content;
  };

  const handleSubmit = async () => {
    if (!selectedCourse || !selectedAssignment || !studentEmail || (files.length === 0 && !submissionText.trim())) {
      alert('Please fill in all required fields and upload files or enter submission text');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const assignment = getSelectedAssignmentData();
      
      if (useAIGrading && assignment?.useAIGrading) {
        const submissionContent = await getSubmissionContent();
        
        const gradingRequest: GradingRequest = {
          assignmentTitle: assignment.title,
          assignmentDescription: assignment.description,
          submissionContent,
          criteria: assignment.gradingCriteria,
          maxPoints: assignment.maxPoints
        };
        
        setShowAIPanel(true);
        // AI grading will be handled by the AIGradingPanel component
      } else {
        // Traditional grading workflow
        console.log('Submitting for manual grading:', {
          course: selectedCourse,
          assignment: selectedAssignment,
          student: studentEmail,
          files: files.map(f => f.name),
          submissionText,
          submittedBy: user?.email
        });
        
        // Simulate submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAvailableCourses = () => {
    return user?.institution ? courses[user.institution] || [] : [];
  };

  const getAvailableAssignments = () => {
    return selectedCourse ? assignments[selectedCourse] || [] : [];
  };

  const getSelectedAssignmentData = () => {
    const courseAssignments = getAvailableAssignments();
    return courseAssignments.find(a => a.id === selectedAssignment);
  };

  const canSubmit = selectedCourse && selectedAssignment && studentEmail && (files.length > 0 || submissionText.trim());
  const selectedAssignmentData = getSelectedAssignmentData();

  const buildGradingRequest = async (): Promise<GradingRequest | null> => {
    if (!selectedAssignmentData) return null;
    
    const submissionContent = await getSubmissionContent();
    
    return {
      assignmentTitle: selectedAssignmentData.title,
      assignmentDescription: selectedAssignmentData.description,
      submissionContent,
      criteria: selectedAssignmentData.gradingCriteria,
      maxPoints: selectedAssignmentData.maxPoints
    };
  };

  return (
    <Layout title="Grade Assignment">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Grade Assignment</h2>
                      <p className="text-indigo-100">Submit work for AI-powered grading and feedback</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAISettings(true)}
                    className="bg-white bg-opacity-20 p-2 rounded-lg hover:bg-opacity-30 transition-colors"
                  >
                    <Settings className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-8">
                {/* AI Grading Toggle */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <div>
                        <h4 className="text-purple-900 font-medium">AI-Powered Grading</h4>
                        <p className="text-purple-800 text-sm">Get instant, detailed feedback using GPT-4</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useAIGrading}
                        onChange={(e) => setUseAIGrading(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>

                {/* Course Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <BookOpen className="h-4 w-4 inline mr-2" />
                    Course
                  </label>
                  <div className="flex space-x-3">
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select a course</option>
                      {getAvailableCourses().map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                    {user?.role === 'professor' && (
                      <button
                        onClick={() => setShowCreateCourse(true)}
                        className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Course</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Assignment Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="h-4 w-4 inline mr-2" />
                    Assignment
                  </label>
                  <div className="flex space-x-3">
                    <select
                      value={selectedAssignment}
                      onChange={(e) => setSelectedAssignment(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={!selectedCourse}
                      required
                    >
                      <option value="">Select an assignment</option>
                      {getAvailableAssignments().map((assignment) => (
                        <option key={assignment.id} value={assignment.id}>
                          {assignment.title} (Due: {new Date(assignment.dueDate).toLocaleDateString()}) - {assignment.maxPoints} pts
                          {assignment.useAIGrading && ' 🤖'}
                        </option>
                      ))}
                    </select>
                    {user?.role === 'professor' && selectedCourse && (
                      <button
                        onClick={() => setShowCreateAssignment(true)}
                        className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Assignment</span>
                      </button>
                    )}
                  </div>
                  {!selectedCourse && (
                    <p className="text-sm text-gray-500 mt-1">Please select a course first</p>
                  )}
                </div>

                {/* Assignment Details */}
                {selectedAssignmentData && (
                  <div className="mb-6 bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{selectedAssignmentData.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{selectedAssignmentData.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Max Points: {selectedAssignmentData.maxPoints}</span>
                      <span>Due: {new Date(selectedAssignmentData.dueDate).toLocaleDateString()}</span>
                      {selectedAssignmentData.useAIGrading && (
                        <span className="flex items-center space-x-1">
                          <Brain className="h-3 w-3" />
                          <span>AI Grading Enabled</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Student Email */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    Student Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={studentEmail}
                      onChange={handleStudentEmailChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter student email address"
                      required
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    
                    {/* Search Results */}
                    {searchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {searchResults.map((student, index) => (
                          <button
                            key={index}
                            onClick={() => selectStudent(student)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-600">{student.email}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submission Text */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submission Text (Optional)
                  </label>
                  <textarea
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter or paste submission content here..."
                  />
                </div>

                {/* File Upload */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    <Upload className="h-4 w-4 inline mr-2" />
                    Upload Assignment Files
                  </label>
                  
                  {/* Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 mb-2">
                      Drag and drop files here, or{' '}
                      <label className="text-indigo-600 hover:text-indigo-500 cursor-pointer">
                        browse
                        <input
                          type="file"
                          multiple
                          onChange={handleFileInput}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.txt,.py,.java,.cpp,.c,.js,.html,.css"
                        />
                      </label>
                    </p>
                    <p className="text-sm text-gray-500">
                      Supported formats: PDF, DOC, DOCX, TXT, code files • Max 50MB per file
                    </p>
                  </div>

                  {/* Uploaded Files */}
                  {files.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Uploaded Files ({files.length})</h4>
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-gray-500" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-700 p-1">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => removeFile(index)}
                                className="text-red-600 hover:text-red-700 p-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit || isSubmitting}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : useAIGrading && selectedAssignmentData?.useAIGrading ? (
                      <>
                        <Brain className="h-4 w-4" />
                        <span>Grade with AI</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Submit for Grading</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* AI Grading Panel */}
          <div className="lg:col-span-1">
            {showAIPanel && selectedAssignmentData && (
              <AIGradingPanel
                gradingRequest={{
                  assignmentTitle: selectedAssignmentData.title,
                  assignmentDescription: selectedAssignmentData.description,
                  submissionContent: submissionText || 'Sample submission content for demonstration',
                  criteria: selectedAssignmentData.gradingCriteria,
                  maxPoints: selectedAssignmentData.maxPoints
                }}
                onGradingComplete={handleAIGradingComplete}
                isVisible={showAIPanel}
              />
            )}
          </div>
        </div>

        {/* Create Course Modal */}
        {showCreateCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add New Course</h3>
                <button
                  onClick={() => setShowCreateCourse(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={newCourse.code}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, code: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., CS 101"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Name
                  </label>
                  <input
                    type="text"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Introduction to Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Brief course description"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateCourse(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCourse}
                  disabled={!newCourse.name.trim() || !newCourse.code.trim()}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Course
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Create Assignment Modal */}
        {showCreateAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add New Assignment</h3>
                <button
                  onClick={() => setShowCreateAssignment(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assignment Title
                    </label>
                    <input
                      type="text"
                      value={newAssignment.title}
                      onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., Final Project"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={newAssignment.dueDate}
                        onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Points
                      </label>
                      <input
                        type="number"
                        value={newAssignment.maxPoints}
                        onChange={(e) => setNewAssignment(prev => ({ ...prev, maxPoints: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <div className="flex space-x-2">
                    <textarea
                      value={newAssignment.description}
                      onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Assignment description"
                    />
                    <button
                      onClick={handleGenerateRubric}
                      disabled={isGeneratingRubric || !newAssignment.description.trim()}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isGeneratingRubric ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Wand2 className="h-4 w-4" />
                      )}
                      <span>Generate Rubric</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="useAIGrading"
                    checked={newAssignment.useAIGrading}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, useAIGrading: e.target.checked }))}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="useAIGrading" className="text-sm font-medium text-gray-700">
                    Enable AI Grading for this assignment
                  </label>
                </div>

                {/* Grading Criteria */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Grading Criteria</h4>
                  <div className="space-y-3">
                    {newAssignment.gradingCriteria.map((criterion, index) => (
                      <div key={index} className="grid grid-cols-12 gap-3 items-center">
                        <div className="col-span-4">
                          <input
                            type="text"
                            value={criterion.name}
                            onChange={(e) => {
                              const updated = [...newAssignment.gradingCriteria];
                              updated[index].name = e.target.value;
                              setNewAssignment(prev => ({ ...prev, gradingCriteria: updated }));
                            }}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            placeholder="Criterion name"
                          />
                        </div>
                        <div className="col-span-5">
                          <input
                            type="text"
                            value={criterion.description}
                            onChange={(e) => {
                              const updated = [...newAssignment.gradingCriteria];
                              updated[index].description = e.target.value;
                              setNewAssignment(prev => ({ ...prev, gradingCriteria: updated }));
                            }}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            placeholder="Description"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            value={criterion.maxPoints}
                            onChange={(e) => {
                              const updated = [...newAssignment.gradingCriteria];
                              updated[index].maxPoints = Number(e.target.value);
                              setNewAssignment(prev => ({ ...prev, gradingCriteria: updated }));
                            }}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            min="1"
                          />
                        </div>
                        <div className="col-span-1">
                          <button
                            onClick={() => {
                              const updated = newAssignment.gradingCriteria.filter((_, i) => i !== index);
                              setNewAssignment(prev => ({ ...prev, gradingCriteria: updated }));
                            }}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const updated = [...newAssignment.gradingCriteria, {
                        name: '',
                        description: '',
                        maxPoints: 10,
                        weight: 10
                      }];
                      setNewAssignment(prev => ({ ...prev, gradingCriteria: updated }));
                    }}
                    className="mt-3 text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Criterion</span>
                  </button>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateAssignment(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAssignment}
                  disabled={!newAssignment.title.trim()}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Assignment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GradingPage;