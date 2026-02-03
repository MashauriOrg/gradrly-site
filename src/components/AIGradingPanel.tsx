import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Loader, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Clock
} from 'lucide-react';
import { aiGradingService, AIGradingResult, GradingRequest } from '../services/aiGradingService';

interface AIGradingPanelProps {
  gradingRequest: GradingRequest;
  onGradingComplete: (result: AIGradingResult) => void;
  isVisible: boolean;
}

const AIGradingPanel: React.FC<AIGradingPanelProps> = ({
  gradingRequest,
  onGradingComplete,
  isVisible
}) => {
  const [isGrading, setIsGrading] = useState(false);
  const [gradingResult, setGradingResult] = useState<AIGradingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartGrading = async () => {
    setIsGrading(true);
    setError(null);
    
    try {
      const result = await aiGradingService.gradeSubmission(gradingRequest);
      setGradingResult(result);
      onGradingComplete(result);
    } catch (err) {
      setError('Failed to grade submission. Please try again.');
      console.error('Grading error:', err);
    } finally {
      setIsGrading(false);
    }
  };

  const handleRetryGrading = () => {
    setGradingResult(null);
    setError(null);
    handleStartGrading();
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Grading Assistant</h3>
          <p className="text-sm text-gray-600">Powered by GPT-4</p>
        </div>
      </div>

      {!gradingResult && !isGrading && !error && (
        <div className="text-center py-8">
          <Brain className="h-16 w-16 text-purple-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Ready to Grade</h4>
          <p className="text-gray-600 mb-6">
            AI will analyze the submission against your grading criteria and provide detailed feedback.
          </p>
          <button
            onClick={handleStartGrading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
          >
            Start AI Grading
          </button>
        </div>
      )}

      {isGrading && (
        <div className="text-center py-8">
          <div className="relative">
            <Loader className="h-16 w-16 text-purple-500 mx-auto mb-4 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">AI is Grading...</h4>
          <p className="text-gray-600">
            Analyzing submission content and applying grading criteria
          </p>
          <div className="mt-4 bg-purple-100 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Grading Failed</h4>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={handleRetryGrading}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry Grading</span>
          </button>
        </div>
      )}

      {gradingResult && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Overall Grade</h4>
                <p className="text-sm text-gray-600">
                  AI Confidence: <span className={`font-medium ${getConfidenceColor(gradingResult.confidence)}`}>
                    {gradingResult.confidence}%
                  </span>
                </p>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${getGradeColor((gradingResult.overallScore / gradingRequest.maxPoints) * 100)}`}>
                  {gradingResult.overallGrade}
                </div>
                <div className="text-lg text-gray-700">
                  {gradingResult.overallScore}/{gradingRequest.maxPoints}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Processed in {(gradingResult.processingTime / 1000).toFixed(1)}s
                </span>
              </div>
            </div>
          </div>

          {/* Criteria Breakdown */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Criteria Breakdown</h4>
            <div className="space-y-4">
              {gradingRequest.criteria.map((criterion) => (
                <div key={criterion.name} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{criterion.name}</h5>
                    <span className="text-lg font-semibold text-purple-600">
                      {gradingResult.criteriaScores[criterion.name]}/{criterion.maxPoints}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    {gradingResult.criteriaFeedback[criterion.name]}
                  </p>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ 
                        width: `${(gradingResult.criteriaScores[criterion.name] / criterion.maxPoints) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths and Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-gray-900">Strengths</h4>
              </div>
              <ul className="space-y-2">
                {gradingResult.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-3">
                <TrendingDown className="h-5 w-5 text-orange-600" />
                <h4 className="font-semibold text-gray-900">Areas for Improvement</h4>
              </div>
              <ul className="space-y-2">
                {gradingResult.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Lightbulb className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Detailed Feedback */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Detailed Feedback</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{gradingResult.detailedFeedback}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleRetryGrading}
              className="flex items-center space-x-2 px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Re-grade</span>
            </button>
            <button
              onClick={() => {
                // Copy detailed feedback to clipboard
                navigator.clipboard.writeText(gradingResult.detailedFeedback);
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Copy Feedback
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AIGradingPanel;