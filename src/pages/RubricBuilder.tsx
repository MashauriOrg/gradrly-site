import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { 
  Save, 
  Plus, 
  Trash2, 
  GripVertical,
  FileText,
  Star,
  CheckCircle,
  AlertCircle,
  BookOpen,
  X,
  Wand2
} from 'lucide-react';
import { aiGradingService } from '../services/aiGradingService';

interface Criterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  levels: {
    name: string;
    description: string;
    points: number;
  }[];
}

const RubricBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [isGeneratingRubric, setIsGeneratingRubric] = useState(false);
  
  const [rubric, setRubric] = useState({
    title: '',
    description: '',
    totalPoints: 100,
    course: ''
  });

  const [newCourse, setNewCourse] = useState({
    name: '',
    code: '',
    description: ''
  });

  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxPoints: 100
  });

  const [criteria, setCriteria] = useState<Criterion[]>([
    {
      id: '1',
      name: 'Code Quality',
      description: 'Assessment of code structure, readability, and best practices',
      weight: 30,
      levels: [
        { name: 'Excellent', description: 'Clean, well-documented, follows best practices', points: 30 },
        { name: 'Good', description: 'Generally well-structured with minor issues', points: 24 },
        { name: 'Satisfactory', description: 'Adequate structure with some improvements needed', points: 18 },
        { name: 'Needs Improvement', description: 'Poor structure, difficult to read', points: 12 }
      ]
    }
  ]);

  // Mock courses and assignments based on user's institution
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
        maxPoints: 100
      },
      { 
        id: 'cs201-midterm', 
        title: 'Binary Tree Implementation', 
        description: 'Create a binary search tree with insertion, deletion, and traversal methods',
        dueDate: '2024-01-20', 
        maxPoints: 50
      }
    ],
    cs301: [
      { 
        id: 'cs301-algo', 
        title: 'Algorithm Analysis Essay', 
        description: 'Analyze the time and space complexity of sorting algorithms',
        dueDate: '2024-01-18', 
        maxPoints: 75
      }
    ],
    cs401: [
      { 
        id: 'cs401-ml', 
        title: 'Machine Learning Final Project', 
        description: 'Build and evaluate a machine learning model for a real-world problem',
        dueDate: '2024-01-25', 
        maxPoints: 100
      }
    ]
  });

  const handleRubricChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRubric(prev => ({ ...prev, [name]: value }));
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
        maxPoints: newAssignment.maxPoints
      };

      setAssignments(prev => ({
        ...prev,
        [selectedCourse]: [...(prev[selectedCourse] || []), assignment]
      }));

      setSelectedAssignment(assignmentId);
      setNewAssignment({ title: '', description: '', dueDate: '', maxPoints: 100 });
      setShowCreateAssignment(false);
    }
  };

  const handleGenerateRubric = async () => {
    const selectedAssignmentData = getSelectedAssignmentData();
    if (!selectedAssignmentData?.description) {
      alert('Please select an assignment with a description first');
      return;
    }

    setIsGeneratingRubric(true);
    try {
      const generatedCriteria = await aiGradingService.generateRubric(
        selectedAssignmentData.description, 
        selectedAssignmentData.maxPoints
      );
      
      // Convert to our format
      const formattedCriteria: Criterion[] = generatedCriteria.map((criterion, index) => ({
        id: (index + 1).toString(),
        name: criterion.name,
        description: criterion.description,
        weight: criterion.weight,
        levels: [
          { name: 'Excellent', description: 'Exceeds expectations', points: criterion.maxPoints },
          { name: 'Good', description: 'Meets expectations', points: Math.floor(criterion.maxPoints * 0.8) },
          { name: 'Satisfactory', description: 'Partially meets expectations', points: Math.floor(criterion.maxPoints * 0.6) },
          { name: 'Needs Improvement', description: 'Below expectations', points: Math.floor(criterion.maxPoints * 0.4) }
        ]
      }));
      
      setCriteria(formattedCriteria);
      setRubric(prev => ({
        ...prev,
        title: `${selectedAssignmentData.title} Rubric`,
        totalPoints: selectedAssignmentData.maxPoints
      }));
    } catch (error) {
      console.error('Failed to generate rubric:', error);
      alert('Failed to generate rubric. Please try again.');
    } finally {
      setIsGeneratingRubric(false);
    }
  };

  const addCriterion = () => {
    const newId = (criteria.length + 1).toString();
    const newCriterion: Criterion = {
      id: newId,
      name: '',
      description: '',
      weight: 25,
      levels: [
        { name: 'Excellent', description: '', points: 25 },
        { name: 'Good', description: '', points: 20 },
        { name: 'Satisfactory', description: '', points: 15 },
        { name: 'Needs Improvement', description: '', points: 10 }
      ]
    };
    setCriteria([...criteria, newCriterion]);
  };

  const removeCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const updateCriterion = (id: string, field: string, value: any) => {
    setCriteria(criteria.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const updateLevel = (criterionId: string, levelIndex: number, field: string, value: any) => {
    setCriteria(criteria.map(c => 
      c.id === criterionId 
        ? {
            ...c,
            levels: c.levels.map((level, index) =>
              index === levelIndex ? { ...level, [field]: value } : level
            )
          }
        : c
    ));
  };

  const addLevel = (criterionId: string) => {
    setCriteria(criteria.map(c => 
      c.id === criterionId 
        ? {
            ...c,
            levels: [...c.levels, { name: '', description: '', points: 0 }]
          }
        : c
    ));
  };

  const removeLevel = (criterionId: string, levelIndex: number) => {
    setCriteria(criteria.map(c => 
      c.id === criterionId 
        ? {
            ...c,
            levels: c.levels.filter((_, index) => index !== levelIndex)
          }
        : c
    ));
  };

  const handleSave = async () => {
    const rubricData = {
      ...rubric,
      course: selectedCourse,
      assignment: selectedAssignment,
      criteria,
      totalWeight: criteria.reduce((sum, c) => sum + c.weight, 0)
    };
    
    console.log('Saving rubric:', rubricData);
    navigate('/dashboard');
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

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
  const isValidWeight = totalWeight === 100;

  return (
    <Layout title="Rubric Builder">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Rubric Builder</h2>
                <p className="text-purple-100">Create detailed grading criteria for assignments</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Course and Assignment Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Selection</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <BookOpen className="h-4 w-4 inline mr-2" />
                    Course
                  </label>
                  <div className="flex space-x-3">
                    <select
                      value={selectedCourse}
                      onChange={(e) => {
                        setSelectedCourse(e.target.value);
                        setSelectedAssignment(''); // Reset assignment when course changes
                      }}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                        className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Course</span>
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="h-4 w-4 inline mr-2" />
                    Assignment
                  </label>
                  <div className="flex space-x-3">
                    <select
                      value={selectedAssignment}
                      onChange={(e) => setSelectedAssignment(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      disabled={!selectedCourse}
                      required
                    >
                      <option value="">Select an assignment</option>
                      {getAvailableAssignments().map((assignment) => (
                        <option key={assignment.id} value={assignment.id}>
                          {assignment.title} ({assignment.maxPoints} pts)
                        </option>
                      ))}
                    </select>
                    {user?.role === 'professor' && selectedCourse && (
                      <button
                        onClick={() => setShowCreateAssignment(true)}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
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
              </div>

              {/* Assignment Details */}
              {getSelectedAssignmentData() && (
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{getSelectedAssignmentData()?.title}</h4>
                    <button
                      onClick={handleGenerateRubric}
                      disabled={isGeneratingRubric}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGeneratingRubric ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Wand2 className="h-4 w-4" />
                      )}
                      <span>Generate AI Rubric</span>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{getSelectedAssignmentData()?.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Max Points: {getSelectedAssignmentData()?.maxPoints}</span>
                    <span>Due: {new Date(getSelectedAssignmentData()?.dueDate || '').toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Basic Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rubric Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rubric Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={rubric.title}
                    onChange={handleRubricChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter rubric title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Points
                  </label>
                  <input
                    type="number"
                    name="totalPoints"
                    value={rubric.totalPoints}
                    onChange={handleRubricChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={rubric.description}
                  onChange={handleRubricChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Describe what this rubric is used for"
                />
              </div>
            </div>

            {/* Weight Summary */}
            <div className="mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Total Weight</h4>
                    <p className="text-xs text-gray-600">All criteria weights must sum to 100%</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-2xl font-bold ${isValidWeight ? 'text-green-600' : 'text-red-600'}`}>
                      {totalWeight}%
                    </span>
                    {isValidWeight ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Criteria */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Grading Criteria</h3>
                <button
                  onClick={addCriterion}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Criterion</span>
                </button>
              </div>

              <div className="space-y-6">
                {criteria.map((criterion, index) => (
                  <motion.div
                    key={criterion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-6"
                  >
                    {/* Criterion Header */}
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="cursor-move text-gray-400 mt-3">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Criterion Name
                            </label>
                            <input
                              type="text"
                              value={criterion.name}
                              onChange={(e) => updateCriterion(criterion.id, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              placeholder="Enter criterion name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Weight (%)
                            </label>
                            <input
                              type="number"
                              value={criterion.weight}
                              onChange={(e) => updateCriterion(criterion.id, 'weight', Number(e.target.value))}
                              min="0"
                              max="100"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={criterion.description}
                            onChange={(e) => updateCriterion(criterion.id, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Describe what this criterion evaluates"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeCriterion(criterion.id)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Performance Levels */}
                    <div className="ml-9">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-md font-medium text-gray-900">Performance Levels</h4>
                        <button
                          onClick={() => addLevel(criterion.id)}
                          className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                        >
                          + Add Level
                        </button>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {criterion.levels.map((level, levelIndex) => (
                          <div key={levelIndex} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <input
                                type="text"
                                value={level.name}
                                onChange={(e) => updateLevel(criterion.id, levelIndex, 'name', e.target.value)}
                                className="text-sm font-medium bg-transparent border-none focus:ring-0 p-0 text-gray-900"
                                placeholder="Level name"
                              />
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  value={level.points}
                                  onChange={(e) => updateLevel(criterion.id, levelIndex, 'points', Number(e.target.value))}
                                  className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
                                  min="0"
                                />
                                <span className="text-xs text-gray-500">pts</span>
                                {criterion.levels.length > 2 && (
                                  <button
                                    onClick={() => removeLevel(criterion.id, levelIndex)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                            <textarea
                              value={level.description}
                              onChange={(e) => updateLevel(criterion.id, levelIndex, 'description', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                              placeholder="Describe this performance level"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <div className="flex space-x-4">
                <button
                  onClick={handleSave}
                  disabled={!isValidWeight || !selectedCourse || !selectedAssignment}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Rubric</span>
                </button>
              </div>
            </div>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4"
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Title
                  </label>
                  <input
                    type="text"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Final Project"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Assignment description"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                    />
                  </div>
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
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default RubricBuilder;