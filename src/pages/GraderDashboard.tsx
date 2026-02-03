import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Users, 
  Star,
  Eye,
  Edit3,
  BarChart3
} from 'lucide-react';

const GraderDashboard: React.FC = () => {
  // Mock data
  const stats = [
    { label: 'Assigned Tasks', value: '8', icon: FileText, color: 'blue' },
    { label: 'Completed', value: '15', icon: CheckCircle, color: 'green' },
    { label: 'Pending Review', value: '3', icon: Clock, color: 'yellow' },
    { label: 'Average Rating', value: '4.9', icon: Star, color: 'purple' }
  ];

  const assignedTasks = [
    {
      id: 1,
      title: 'Grade Data Structures Projects',
      professor: 'Dr. Sarah Johnson',
      course: 'CS 201',
      submissions: 12,
      completed: 8,
      dueDate: '2024-01-16',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Review Algorithm Essays',
      professor: 'Dr. Michael Chen',
      course: 'CS 301',
      submissions: 8,
      completed: 5,
      dueDate: '2024-01-18',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Evaluate Lab Reports',
      professor: 'Dr. Emily Rodriguez',
      course: 'CS 401',
      submissions: 6,
      completed: 6,
      dueDate: '2024-01-12',
      priority: 'completed'
    }
  ];

  const recentGradings = [
    {
      student: 'Alex Thompson',
      assignment: 'Binary Tree Implementation',
      grade: 92,
      course: 'CS 201',
      completedAt: '2024-01-12T10:30:00Z'
    },
    {
      student: 'Maria Garcia',
      assignment: 'Sorting Algorithms Analysis',
      grade: 88,
      course: 'CS 301',
      completedAt: '2024-01-12T09:15:00Z'
    },
    {
      student: 'David Kim',
      assignment: 'Neural Network Project',
      grade: 95,
      course: 'CS 401',
      completedAt: '2024-01-11T16:45:00Z'
    }
  ];

  const getStatColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'purple': return 'bg-purple-500';
      default: return 'bg-blue-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Layout title="Grader Dashboard">
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

      {/* Assigned Grading Tasks */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Assigned Grading Tasks</h2>
        <div className="space-y-4">
          {assignedTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <span><Users className="h-4 w-4 inline mr-1" />{task.professor}</span>
                    <span><FileText className="h-4 w-4 inline mr-1" />{task.course}</span>
                    <span><Clock className="h-4 w-4 inline mr-1" />Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {task.completed}/{task.submissions}
                  </div>
                  <div className="text-sm text-gray-500">Completed</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${(task.completed / task.submissions) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round((task.completed / task.submissions) * 100)}% Complete
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Link
                  to={`/assignment/${task.id}/grade`}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Continue Grading</span>
                </Link>
                <Link
                  to={`/assignment/${task.id}`}
                  className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Gradings */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Gradings</h2>
          <Link
            to="/grading-history"
            className="text-blue-600 hover:text-blue-500 font-medium text-sm"
          >
            View All
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentGradings.map((grading, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {grading.student}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {grading.assignment}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {grading.course}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${getGradeColor(grading.grade)}`}>
                        {grading.grade}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(grading.completedAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Insights</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Grading Efficiency</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average time per submission</span>
                <span className="text-sm font-semibold text-gray-900">12 minutes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed this week</span>
                <span className="text-sm font-semibold text-gray-900">23 assignments</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Quality score</span>
                <span className="text-sm font-semibold text-green-600">4.9/5.0</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-lg">
                <Star className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Feedback Quality</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Professor ratings</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Detailed comments</span>
                <span className="text-sm font-semibold text-gray-900">95%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Response time</span>
                <span className="text-sm font-semibold text-blue-600">{"< 24 hours"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GraderDashboard;