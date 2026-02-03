import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { 
  Save, 
  Plus, 
  Trash2, 
  FileText, 
  Clock, 
  Users, 
  Brain,
  Settings,
  Upload,
  X,
  BookOpen
} from 'lucide-react';

const AssignmentCreator: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignment, setAssignment] = useState({
    title: '',
    description: '',
    course: '',
    dueDate: '',
    dueTime: '',
    maxPoints: 100,
    allowLateSubmissions: true,
    lateDeductionPercent: 10,
    instructions: '',
    rubricId: '',
    enableAIGrading: true,
    aiGradingMode: 'assisted', // 'full' or 'assisted'
    allowedFileTypes: ['pdf', 'docx', 'txt'],
    maxFileSize: 10, // MB
    groupAssignment: false,
    maxGroupSize: 3
  });

  const [attachments, setAttachments] = useState<string[]>([]);
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    code: '',
    description: ''
  });

  // Mock courses based on user's institution
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setAssignment(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileTypeToggle = (fileType: string) => {
    setAssignment(prev => ({
      ...prev,
      allowedFileTypes: prev.allowedFileTypes.includes(fileType)
        ? prev.allowedFileTypes.filter(type => type !== fileType)
        : [...prev.allowedFileTypes, fileType]
    }));
  };

  const addAttachment = () => {
    setAttachments([...attachments, '']);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
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

      setAssignment(prev => ({ ...prev, course: courseId }));
      setNewCourse({ name: '', code: '', description: '' });
      setShowCreateCourse(false);
    }
  };

  const handleSave = async (publish: boolean = false) => {
    // Simulate API call
    console.log('Saving assignment:', { ...assignment, publish });
    
    // Show success message or handle errors
    navigate('/dashboard');
  };

  const getAvailableCourses = () => {
    return user?.institution ? courses[user.institution] || [] : [];
  };

  const fileTypes = [
    { key: 'pdf', label: 'PDF' },
    { key: 'docx', label: 'Word Document' },
    { key: 'txt', label: 'Text File' },
    { key: 'zip', label: 'ZIP Archive' },
    { key: 'jpg', label: 'Images (JPG/PNG)' }
  ];

  return (
    <Layout title="Create Assignment">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Create New Assignment</h2>
                <p className="text-blue-100">Set up a new assignment with AI-powered grading</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <form className="space-y-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assignment Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={assignment.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter assignment title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <BookOpen className="h-4 w-4 inline mr-2" />
                      Course
                    </label>
                    <div className="flex space-x-3">
                      <select
                        name="course"
                        value={assignment.course}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select a course</option>
                        {getAvailableCourses().map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowCreateCourse(true)}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        title="Add new course"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Course</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={assignment.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Provide a brief description of the assignment"
                  />
                </div>
              </div>

              {/* Due Date and Grading */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Due Date & Grading</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={assignment.dueDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Time
                    </label>
                    <input
                      type="time"
                      name="dueTime"
                      value={assignment.dueTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Points
                    </label>
                    <input
                      type="number"
                      name="maxPoints"
                      value={assignment.maxPoints}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* AI Grading Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-600" />
                  AI Grading Settings
                </h3>
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="text-sm font-medium text-gray-900">Enable AI Grading</label>
                      <p className="text-sm text-gray-600">Use AI to automatically grade submissions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="enableAIGrading"
                        checked={assignment.enableAIGrading}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {assignment.enableAIGrading && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          AI Grading Mode
                        </label>
                        <select
                          name="aiGradingMode"
                          value={assignment.aiGradingMode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="assisted">Assisted Grading (AI + Human Review)</option>
                          <option value="full">Full AI Grading (Automatic)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Rubric
                        </label>
                        <select
                          name="rubricId"
                          value={assignment.rubricId}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select a rubric</option>
                          <option value="rubric1">Programming Assignment Rubric</option>
                          <option value="rubric2">Essay Writing Rubric</option>
                          <option value="rubric3">Lab Report Rubric</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submission Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Allowed File Types
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {fileTypes.map((type) => (
                        <label
                          key={type.key}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={assignment.allowedFileTypes.includes(type.key)}
                            onChange={() => handleFileTypeToggle(type.key)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{type.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max File Size (MB)
                      </label>
                      <input
                        type="number"
                        name="maxFileSize"
                        value={assignment.maxFileSize}
                        onChange={handleInputChange}
                        min="1"
                        max="100"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Late Deduction (%)
                      </label>
                      <input
                        type="number"
                        name="lateDeductionPercent"
                        value={assignment.lateDeductionPercent}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={!assignment.allowLateSubmissions}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="allowLateSubmissions"
                        checked={assignment.allowLateSubmissions}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Allow Late Submissions</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="groupAssignment"
                        checked={assignment.groupAssignment}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Group Assignment</span>
                    </label>
                  </div>

                  {assignment.groupAssignment && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Group Size
                      </label>
                      <input
                        type="number"
                        name="maxGroupSize"
                        value={assignment.maxGroupSize}
                        onChange={handleInputChange}
                        min="2"
                        max="10"
                        className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
                <textarea
                  name="instructions"
                  value={assignment.instructions}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide detailed instructions for students..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleSave(false)}
                    className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Draft</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Publish Assignment</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>

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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Course
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AssignmentCreator;