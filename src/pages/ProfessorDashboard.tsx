import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { 
  Plus, 
  BookOpen, 
  Users, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Download,
  Eye
} from 'lucide-react';

const ProfessorDashboard: React.FC = () => {
  // Mock data - replace with actual API calls
  const stats = [
    { label: 'Active Assignments', value: '12', icon: BookOpen, color: 'blue' },
    { label: 'Total Students', value: '156', icon: Users, color: 'green' },
    { label: 'Pending Reviews', value: '23', icon: Clock, color: 'yellow' },
    { label: 'Completed Gradings', value: '89', icon: CheckCircle, color: 'purple' }
  ];

  const recentAssignments = [
    {
      id: 1,
      title: 'Data Structures Final Project',
      course: 'CS 201',
      dueDate: '2024-01-15',
      submissions: 45,
      totalStudents: 50,
      status: 'active'
    },
    {
      id: 2,
      title: 'Algorithm Analysis Essay',
      course: 'CS 301',
      dueDate: '2024-01-20',
      submissions: 32,
      totalStudents: 35,
      status: 'grading'
    },
    {
      id: 3,
      title: 'Machine Learning Lab Report',
      course: 'CS 401',
      dueDate: '2024-01-10',
      submissions: 28,
      totalStudents: 30,
      status: 'completed'
    }
  ];

  const quickActions = [
    {
      title: 'Create Assignment',
      description: 'Set up a new assignment with AI-powered grading',
      href: '/assignment/create',
      icon: Plus,
      color: 'blue'
    },
    {
      title: 'Build Rubric',
      description: 'Design detailed grading criteria for your assignments',
      href: '/rubric/create',
      icon: FileText,
      color: 'purple'
    },
    {
      title: 'Manage Graders',
      description: 'Assign and oversee graders for your courses',
      href: '/graders',
      icon: Users,
      color: 'green'
    },
    {
      title: 'View Reports',
      description: 'Access detailed analytics and performance reports',
      href: '/reports',
      icon: BarChart3,
      color: 'orange'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'grading': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
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

  const getActionColor = (color: string) => {
    switch (color) {
      case 'blue': return 'from-blue-500 to-blue-600';
      case 'purple': return 'from-purple-500 to-purple-600';
      case 'green': return 'from-green-500 to-green-600';
      case 'orange': return 'from-orange-500 to-orange-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <Layout title="Professor Dashboard">
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

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Link
                to={action.href}
                className="block bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className={`bg-gradient-to-r ${getActionColor(action.color)} p-3 rounded-lg w-fit mb-4`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Assignments */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Assignments</h2>
          <Link
            to="/assignments"
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
                    Assignment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submissions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentAssignments.map((assignment) => (
                  <motion.tr
                    key={assignment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                        <div className="text-sm text-gray-500">{assignment.course}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {assignment.submissions}/{assignment.totalStudents}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/assignment/${assignment.id}`}
                          className="text-blue-600 hover:text-blue-500"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/assignment/${assignment.id}/grade`}
                          className="text-green-600 hover:text-green-500"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Link>
                        <button className="text-gray-600 hover:text-gray-500">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Sarah Johnson</span> submitted "Algorithm Analysis Essay"
                </p>
                <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-100 p-2 rounded-full">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  Assignment "Data Structures Final Project" due in 2 days
                </p>
                <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  Grader <span className="font-medium">Mike Chen</span> completed 5 assignments
                </p>
                <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfessorDashboard;