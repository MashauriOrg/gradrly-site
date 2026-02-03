import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { 
  Brain, 
  User, 
  FileText, 
  Star, 
  Save, 
  Send,
  Download,
  Eye,
  MessageSquare,
  CheckCircle,
  Clock,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

const AssignmentGrading: React.FC = () => {
  const { id } = useParams();
  const [currentSubmission, setCurrentSubmission] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [grades, setGrades] = useState<{[key: string]: number}>({});
  const [feedback, setFeedback] = useState<{[key: string]: string}>({});

  // Mock data
  const assignment = {
    title: 'Data Structures Final Project',
    course: 'CS 201',
    totalPoints: 100,
    rubric: {
      criteria: [
        { name: 'Code Quality', weight: 30, maxPoints: 30 },
        { name: 'Functionality', weight: 40, maxPoints: 40 },
        { name: 'Documentation', weight: 20, maxPoints: 20 },
        { name: 'Testing', weight: 10, maxPoints: 10 }
      ]
    }
  };

  const submissions = [
    {
      id: 1,
      student: 'Alex Thompson',
      submittedAt: '2024-01-12T14:30:00Z',
      files: ['binary_tree.py', 'test_cases.py', 'README.md'],
      status: 'pending',
      aiAnalysis: {
        overallScore: 87,
        strengths: ['Clean code structure', 'Comprehensive test cases', 'Good documentation'],
        improvements: ['Error handling could be improved', 'Some edge cases not covered'],
        criteriaScores: {
          'Code Quality': 26,
          'Functionality': 35,
          'Documentation': 18,
          'Testing': 8
        }
      }
    },
    {
      id: 2,
      student: 'Maria Garcia',
      submittedAt: '2024-01-12T16:45:00Z',
      files: ['tree_implementation.py', 'utils.py', 'documentation.pdf'],
      status: 'pending',
      aiAnalysis: {
        overallScore: 92,
        strengths: ['Excellent algorithm implementation', 'Thorough documentation', 'Efficient code'],
        improvements: ['Could add more comments in complex functions'],
        criteriaScores: {
          'Code Quality': 28,
          'Functionality': 38,
          'Documentation': 19,
          'Testing': 7
        }
      }
    }
  ];

  const currentSub = submissions[currentSubmission];

  const handleGradeChange = (criterion: string, value: number) => {
    setGrades(prev => ({
      ...prev,
      [`${currentSub.id}-${criterion}`]: value
    }));
  };

  const handleFeedbackChange = (criterion: string, value: string) => {
    setFeedback(prev => ({
      ...prev,
      [`${currentSub.id}-${criterion}`]: value
    }));
  };

  const getGrade = (criterion: string) => {
    return grades[`${currentSub.id}-${criterion}`] || currentSub.aiAnalysis.criteriaScores[criterion] || 0;
  };

  const getFeedback = (criterion: string) => {
    return feedback[`${currentSub.id}-${criterion}`] || '';
  };

  const getTotalGrade = () => {
    return assignment.rubric.criteria.reduce((total, criterion) => {
      return total + getGrade(criterion.name);
    }, 0);
  };

  const nextSubmission = () => {
    if (currentSubmission < submissions.length - 1) {
      setCurrentSubmission(currentSubmission + 1);
    }
  };

  const prevSubmission = () => {
    if (currentSubmission > 0) {
      setCurrentSubmission(currentSubmission - 1);
    }
  };

  const saveGrade = () => {
    console.log('Saving grade for submission:', currentSub.id);
    // API call to save grade
  };

  const submitGrade = () => {
    console.log('Submitting final grade for submission:', currentSub.id);
    // API call to submit final grade
  };

  return (
    <Layout title="Grade Assignment">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{assignment.title}</h2>
              <p className="text-gray-600">{assignment.course} • {submissions.length} submissions</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Submission</div>
                <div className="text-lg font-semibold text-gray-900">
                  {currentSubmission + 1} of {submissions.length}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={prevSubmission}
                  disabled={currentSubmission === 0}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextSubmission}
                  disabled={currentSubmission === submissions.length - 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submission Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{currentSub.student}</h3>
                  <p className="text-sm text-gray-600">
                    Submitted: {new Date(currentSub.submittedAt).toLocaleString()}
                  </p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    <Clock className="h-4 w-4 mr-1" />
                    Pending Review
                  </span>
                </div>
              </div>

              {/* Files */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Submitted Files</h4>
                <div className="space-y-2">
                  {currentSub.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-900">{file}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-700">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">AI Analysis</h3>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {currentSub.aiAnalysis.overallScore}%
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3 text-green-600">Strengths</h4>
                  <ul className="space-y-2">
                    {currentSub.aiAnalysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3 text-orange-600">Areas for Improvement</h4>
                  <ul className="space-y-2">
                    {currentSub.aiAnalysis.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <MessageSquare className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Grading Criteria */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Grading Criteria</h3>
              <div className="space-y-6">
                {assignment.rubric.criteria.map((criterion) => (
                  <div key={criterion.name} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-md font-medium text-gray-900">{criterion.name}</h4>
                        <p className="text-sm text-gray-600">Weight: {criterion.weight}% • Max: {criterion.maxPoints} points</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={getGrade(criterion.name)}
                          onChange={(e) => handleGradeChange(criterion.name, Number(e.target.value))}
                          max={criterion.maxPoints}
                          min="0"
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                        />
                        <span className="text-sm text-gray-500">/ {criterion.maxPoints}</span>
                      </div>
                    </div>
                    
                    {aiSuggestions && (
                      <div className="bg-purple-50 rounded-lg p-3 mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Brain className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-900">AI Suggestion</span>
                          <span className="text-sm text-purple-700">
                            {currentSub.aiAnalysis.criteriaScores[criterion.name]} points
                          </span>
                        </div>
                      </div>
                    )}

                    <textarea
                      value={getFeedback(criterion.name)}
                      onChange={(e) => handleFeedbackChange(criterion.name, e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Provide specific feedback for this criterion..."
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Grading Summary */}
          <div className="space-y-6">
            {/* Grade Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Summary</h3>
              <div className="space-y-3">
                {assignment.rubric.criteria.map((criterion) => (
                  <div key={criterion.name} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{criterion.name}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {getGrade(criterion.name)} / {criterion.maxPoints}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-3 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {getTotalGrade()} / {assignment.totalPoints}
                    </span>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-lg font-semibold text-gray-700">
                      {Math.round((getTotalGrade() / assignment.totalPoints) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Toggle */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-md font-medium text-gray-900">AI Suggestions</h4>
                  <p className="text-sm text-gray-600">Show AI-generated feedback</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aiSuggestions}
                    onChange={(e) => setAiSuggestions(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="space-y-3">
                <button
                  onClick={saveGrade}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Progress</span>
                </button>
                <button
                  onClick={submitGrade}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  <Send className="h-4 w-4" />
                  <span>Submit Grade</span>
                </button>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Grading Progress</h4>
              <div className="space-y-3">
                {submissions.map((sub, index) => (
                  <div
                    key={sub.id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      index === currentSubmission ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setCurrentSubmission(index)}
                  >
                    <span className="text-sm font-medium text-gray-900">{sub.student}</span>
                    <div className="flex items-center space-x-2">
                      {sub.status === 'graded' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AssignmentGrading;