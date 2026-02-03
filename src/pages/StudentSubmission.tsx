import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { 
  Upload, 
  FileText, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Info,
  Send
} from 'lucide-react';

const StudentSubmission: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock assignment data
  const assignment = {
    title: 'Data Structures Final Project',
    course: 'CS 201',
    dueDate: '2024-01-15T23:59:00Z',
    maxPoints: 100,
    description: 'Implement a binary search tree with full CRUD operations and comprehensive testing.',
    instructions: `
      Your submission should include:
      1. Complete implementation of a binary search tree
      2. Unit tests covering all functionality
      3. Documentation explaining your approach
      4. Performance analysis of your implementation
      
      Make sure to follow the coding standards discussed in class and include proper error handling.
    `,
    allowedFileTypes: ['py', 'pdf', 'txt', 'md'],
    maxFileSize: 10, // MB
    allowLateSubmissions: true,
    lateDeductionPercent: 10
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
    const validFiles = newFiles.filter(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const isValidType = assignment.allowedFileTypes.includes(extension || '');
      const isValidSize = file.size <= assignment.maxFileSize * 1024 * 1024;
      return isValidType && isValidSize;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Submitting:', { files, submissionText });
    setIsSubmitting(false);
    navigate('/dashboard');
  };

  const isOverdue = new Date() > new Date(assignment.dueDate);
  const timeUntilDue = new Date(assignment.dueDate).getTime() - new Date().getTime();
  const daysUntilDue = Math.ceil(timeUntilDue / (1000 * 60 * 60 * 24));

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Layout title="Submit Assignment">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{assignment.title}</h2>
                <p className="text-green-100">{assignment.course} • {assignment.maxPoints} points</p>
              </div>
              <div className="text-right">
                <div className="text-white">
                  <div className="text-sm opacity-90">Due Date</div>
                  <div className="text-lg font-semibold">
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm">
                    {new Date(assignment.dueDate).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Due Date Warning */}
            {isOverdue ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-red-800 font-medium">This assignment is overdue</p>
                  <p className="text-red-600 text-sm">
                    Late submissions will receive a {assignment.lateDeductionPercent}% deduction
                  </p>
                </div>
              </div>
            ) : daysUntilDue <= 3 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center space-x-3">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-yellow-800 font-medium">
                    Due in {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}
                  </p>
                  <p className="text-yellow-600 text-sm">Don't forget to submit before the deadline</p>
                </div>
              </div>
            ) : null}

            {/* Assignment Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Description</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">{assignment.description}</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="text-blue-900 font-medium mb-2">Instructions</h4>
                      <div className="text-blue-800 text-sm whitespace-pre-line">
                        {assignment.instructions}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">File Upload</h3>
              
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
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
                  <label className="text-blue-600 hover:text-blue-500 cursor-pointer">
                    browse
                    <input
                      type="file"
                      multiple
                      onChange={handleFileInput}
                      className="hidden"
                      accept={assignment.allowedFileTypes.map(type => `.${type}`).join(',')}
                    />
                  </label>
                </p>
                <p className="text-sm text-gray-500">
                  Allowed types: {assignment.allowedFileTypes.join(', ')} • Max size: {assignment.maxFileSize}MB per file
                </p>
              </div>

              {/* Uploaded Files */}
              {files.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Uploaded Files</h4>
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
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Text Submission */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Comments (Optional)</h3>
              <textarea
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add any additional comments, explanations, or notes about your submission..."
              />
            </div>

            {/* Submission Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Files to Submit</h4>
                  <p className="text-sm text-gray-600">
                    {files.length} file{files.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Total Size</h4>
                  <p className="text-sm text-gray-600">
                    {formatFileSize(files.reduce((total, file) => total + file.size, 0))}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Due Date</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(assignment.dueDate).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                  <p className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-green-600'}`}>
                    {isOverdue ? 'Late Submission' : 'On Time'}
                  </p>
                </div>
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
              <button
                onClick={handleSubmit}
                disabled={files.length === 0 || isSubmitting}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Assignment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default StudentSubmission;