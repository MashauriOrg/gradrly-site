import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
});

export interface GradingCriteria {
  name: string;
  description: string;
  maxPoints: number;
  weight: number;
}

export interface AIGradingResult {
  overallScore: number;
  overallGrade: string;
  criteriaScores: { [key: string]: number };
  criteriaFeedback: { [key: string]: string };
  strengths: string[];
  improvements: string[];
  detailedFeedback: string;
  confidence: number;
  processingTime: number;
}

export interface GradingRequest {
  assignmentTitle: string;
  assignmentDescription: string;
  submissionContent: string;
  criteria: GradingCriteria[];
  maxPoints: number;
  additionalInstructions?: string;
}

class AIGradingService {
  private async callOpenAI(prompt: string, maxTokens: number = 1500): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert academic grader with years of experience in evaluating student work. You provide fair, constructive, and detailed feedback while maintaining high academic standards."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.3, // Lower temperature for more consistent grading
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to get AI grading response');
    }
  }

  private buildGradingPrompt(request: GradingRequest): string {
    const criteriaText = request.criteria.map(c => 
      `- ${c.name} (${c.maxPoints} points, ${c.weight}% weight): ${c.description}`
    ).join('\n');

    return `
Please grade the following student submission with detailed analysis:

ASSIGNMENT: ${request.assignmentTitle}
DESCRIPTION: ${request.assignmentDescription}
TOTAL POINTS: ${request.maxPoints}

GRADING CRITERIA:
${criteriaText}

STUDENT SUBMISSION:
${request.submissionContent}

${request.additionalInstructions ? `ADDITIONAL INSTRUCTIONS: ${request.additionalInstructions}` : ''}

Please provide your response in the following JSON format:
{
  "overallScore": <total points earned>,
  "overallGrade": "<letter grade>",
  "criteriaScores": {
    ${request.criteria.map(c => `"${c.name}": <points earned for this criterion>`).join(',\n    ')}
  },
  "criteriaFeedback": {
    ${request.criteria.map(c => `"${c.name}": "<specific feedback for this criterion>"`).join(',\n    ')}
  },
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "detailedFeedback": "<comprehensive feedback paragraph>",
  "confidence": <confidence level 0-100>
}

Be thorough, fair, and constructive in your evaluation. Focus on both what the student did well and areas for improvement.
`;
  }

  async gradeSubmission(request: GradingRequest): Promise<AIGradingResult> {
    const startTime = Date.now();
    
    try {
      const prompt = this.buildGradingPrompt(request);
      const response = await this.callOpenAI(prompt, 2000);
      
      // Parse the JSON response
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      const gradingData = JSON.parse(cleanResponse);
      
      const processingTime = Date.now() - startTime;
      
      // Validate and sanitize the response
      const result: AIGradingResult = {
        overallScore: Math.min(Math.max(gradingData.overallScore || 0, 0), request.maxPoints),
        overallGrade: gradingData.overallGrade || this.calculateLetterGrade(gradingData.overallScore, request.maxPoints),
        criteriaScores: {},
        criteriaFeedback: {},
        strengths: Array.isArray(gradingData.strengths) ? gradingData.strengths.slice(0, 5) : [],
        improvements: Array.isArray(gradingData.improvements) ? gradingData.improvements.slice(0, 5) : [],
        detailedFeedback: gradingData.detailedFeedback || 'No detailed feedback provided.',
        confidence: Math.min(Math.max(gradingData.confidence || 85, 0), 100),
        processingTime
      };

      // Validate criteria scores
      request.criteria.forEach(criterion => {
        const score = gradingData.criteriaScores?.[criterion.name] || 0;
        result.criteriaScores[criterion.name] = Math.min(Math.max(score, 0), criterion.maxPoints);
        result.criteriaFeedback[criterion.name] = gradingData.criteriaFeedback?.[criterion.name] || 'No feedback provided for this criterion.';
      });

      return result;
    } catch (error) {
      console.error('AI Grading Error:', error);
      
      // Return a fallback result if AI grading fails
      return this.getFallbackGrading(request, Date.now() - startTime);
    }
  }

  private calculateLetterGrade(score: number, maxPoints: number): string {
    const percentage = (score / maxPoints) * 100;
    
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 63) return 'D';
    if (percentage >= 60) return 'D-';
    return 'F';
  }

  private getFallbackGrading(request: GradingRequest, processingTime: number): AIGradingResult {
    // Provide a basic fallback grading when AI fails
    const fallbackScore = Math.floor(request.maxPoints * 0.75); // 75% as fallback
    
    const criteriaScores: { [key: string]: number } = {};
    const criteriaFeedback: { [key: string]: string } = {};
    
    request.criteria.forEach(criterion => {
      criteriaScores[criterion.name] = Math.floor(criterion.maxPoints * 0.75);
      criteriaFeedback[criterion.name] = 'AI grading temporarily unavailable. Please review manually.';
    });

    return {
      overallScore: fallbackScore,
      overallGrade: this.calculateLetterGrade(fallbackScore, request.maxPoints),
      criteriaScores,
      criteriaFeedback,
      strengths: ['Submission received and processed'],
      improvements: ['Manual review recommended'],
      detailedFeedback: 'AI grading service is temporarily unavailable. This submission requires manual review.',
      confidence: 0,
      processingTime
    };
  }

  async generateRubric(assignmentDescription: string, maxPoints: number = 100): Promise<GradingCriteria[]> {
    const prompt = `
Create a detailed grading rubric for the following assignment:

ASSIGNMENT DESCRIPTION: ${assignmentDescription}
TOTAL POINTS: ${maxPoints}

Please provide a JSON response with 4-6 grading criteria in this format:
{
  "criteria": [
    {
      "name": "<criterion name>",
      "description": "<detailed description of what this criterion evaluates>",
      "maxPoints": <points for this criterion>,
      "weight": <percentage weight>
    }
  ]
}

Ensure the weights add up to 100% and the maxPoints add up to ${maxPoints}.
Make the criteria comprehensive and appropriate for the assignment type.
`;

    try {
      const response = await this.callOpenAI(prompt, 1000);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      const rubricData = JSON.parse(cleanResponse);
      
      return rubricData.criteria || this.getDefaultCriteria(maxPoints);
    } catch (error) {
      console.error('Rubric generation error:', error);
      return this.getDefaultCriteria(maxPoints);
    }
  }

  private getDefaultCriteria(maxPoints: number): GradingCriteria[] {
    return [
      {
        name: 'Content Quality',
        description: 'Accuracy, completeness, and depth of content',
        maxPoints: Math.floor(maxPoints * 0.4),
        weight: 40
      },
      {
        name: 'Organization & Structure',
        description: 'Logical flow, clear structure, and presentation',
        maxPoints: Math.floor(maxPoints * 0.25),
        weight: 25
      },
      {
        name: 'Technical Implementation',
        description: 'Technical accuracy and implementation quality',
        maxPoints: Math.floor(maxPoints * 0.25),
        weight: 25
      },
      {
        name: 'Documentation & Clarity',
        description: 'Clear documentation, comments, and explanations',
        maxPoints: maxPoints - Math.floor(maxPoints * 0.9),
        weight: 10
      }
    ];
  }

  async provideFeedbackSuggestions(submissionContent: string, currentFeedback: string): Promise<string[]> {
    const prompt = `
Based on this student submission and current feedback, suggest 3-5 additional constructive feedback points:

SUBMISSION: ${submissionContent}
CURRENT FEEDBACK: ${currentFeedback}

Provide suggestions as a JSON array of strings:
["suggestion 1", "suggestion 2", "suggestion 3"]

Focus on actionable, specific, and constructive feedback that helps the student improve.
`;

    try {
      const response = await this.callOpenAI(prompt, 500);
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Feedback suggestions error:', error);
      return [
        'Consider providing more detailed explanations',
        'Review the assignment requirements carefully',
        'Add more examples to support your points'
      ];
    }
  }
}

export const aiGradingService = new AIGradingService();