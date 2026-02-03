import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Upload,
  Download,
  Eye,
  BarChart3
} from 'lucide-react';

const StudentDashboard: React.FC = () => {
  // Mock data
  const stats = [
    { label: 'Active Assignments', value: '5', icon: BookOpen, color: 'blue' },
    { label: 'Completed', value: '12', icon: CheckCircle, color: 'green' },
    { label: 'Pending Review', value: '3', icon: Clock, color: 'yellow' },
    { label: 'Average Grade', value: '87%', icon: BarChart3, color: 'purple' }
  ];

  const assignments = [
    {
      id: 1,
      title: 'Data Structures Final Project',
      course: 'CS 201',
      dueDate: '2024-01-15',
      status: 'submitted',
      grade: null,
      submittedAt: '2024-01-12'
    },
    {
      id: 2,
      title: 'Algorithm Analysis Essay',
      course: 'CS 301',
      dueDate: '2024-01-20',
      status: 'pending',
      grade: null,
      submittedAt: null
    },
    {
      id: 3,
      title: 'Machine Learning Lab Report',
      course: 'CS 401',
      dueDate: '2024-01-10',
      status: 'graded',
      grade: 92,
      submittedAt: '2024-01-08'
    },
    {
      id: 4,
      title: 'Database Design Project',
      course: 'CS 351',
      dueDate: '2024-01-25',
      status: 'not_submitted',
      grade: null,
      submittedAt: null
    }
  ];

  const recentFeedback = [
    {
      assignment: 'Machine Learning Lab Report',
      grade: 92,
      feedback: 'Excellent analysis of the clustering algorithms. Your implementation was clean and well-documented.',
      date: '2024-01-11'
    },
    {
      assignment: 'Computer Graphics Assignment',
      grade: 85,
      feedback: 'Good understanding of 3D transformations. Consider optimizing your rendering pipeline for better performance.',
      date: '2024-01-08'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'graded': return 'bg-green-100 text-green-800';
      case 'not_submitted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'purple': return 'bg-purple-500';
      default: return 'bg-blue-500';
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status === 'not_submitted';
  };

  return (
    <Layout title="Student Dashboard">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${getStatColor(stat.color)}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Assignments */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Assignments</h2>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments.map((assignment) => (
                  <motion.tr
                    key={assignment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`hover:bg-gray-50 transition-colors ${isOverdue(assignment.dueDate, assignment.status) ? 'bg-red-50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                        <div className="text-sm text-gray-500">{assignment.course}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                      {isOverdue(assignment.dueDate, assignment.status) && (
                        <div className="text-xs text-red-600 font-medium">Overdue</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
                        {assignment.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {assignment.grade ? (
                        <span className={`text-sm font-semibold ${getGradeColor(assignment.grade)}`}>
                          {assignment.grade}%
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/assignment/${assignment.id}`}
                          className="text-blue-600 hover:text-blue-500"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {assignment.status === 'not_submitted' || assignment.status === 'pending' ? (
                          <Link
                            to={`/assignment/${assignment.id}/submit`}
                            className="text-green-600 hover:text-green-500"
                            title="Submit Assignment"
                          >
                            <Upload className="h-4 w-4" />
                          </Link>
                        ) : null}
                        {assignment.status === 'graded' && (
                          <button 
                            className="text-purple-600 hover:text-purple-500"
                            title="Download Feedback"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Feedback</h2>
        <div className="space-y-4">
          {recentFeedback.map((feedback, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{feedback.assignment}</h3>
                  <p className="text-sm text-gray-500">{new Date(feedback.date).toLocaleDateString()}</p>
                </div>
                <div className={`text-2xl font-bold ${getGradeColor(feedback.grade)}`}>
                  {feedback.grade}%
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{feedback.feedback}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/assignments/upcoming"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg w-fit mb-4">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Deadlines</h3>
            <p className="text-gray-600 text-sm">View all assignments due soon</p>
          </Link>

          <Link
            to="/grades"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-lg w-fit mb-4">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Grade Report</h3>
            <p className="text-gray-600 text-sm">View detailed grade breakdown</p>
          </Link>

          <Link
            to="/courses"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-lg w-fit mb-4">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">My Courses</h3>
            <p className="text-gray-600 text-sm">Access course materials and info</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;