"use client";
import { useState, useEffect } from 'react';
import {
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
}

interface Assessment {
  id: string;
  title: string;
  type: 'quiz' | 'assignment';
  description: string;
  dueDate: string;
  totalPoints: number;
  questions: Question[];
  submissions?: Array<{
    studentId: string;
    studentName: string;
    answers: Array<{
      questionId: string;
      answer: string;
      score?: number;
      feedback?: string;
    }>;
    submittedAt: string;
    totalScore?: number;
  }>;
}

interface AssessmentProps {
  courseId: string;
  assessmentId: string;
  isInstructor?: boolean;
}

export default function Assessment({ courseId, assessmentId, isInstructor = false }: AssessmentProps) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [grading, setGrading] = useState<Record<string, { score: number; feedback: string }>>({});

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://localhost:7099/api/Courses/${courseId}/assessments/${assessmentId}`
        );
        if (!response.ok) throw new Error('Failed to fetch assessment');
        
        const assessmentData = await response.json();
        setAssessment(assessmentData);
        
        // Initialize answers for students
        if (!isInstructor) {
          const initialAnswers: Record<string, string> = {};
          assessmentData.questions.forEach((q: Question) => {
            initialAnswers[q.id] = '';
          });
          setAnswers(initialAnswers);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [courseId, assessmentId, isInstructor]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(
        `https://localhost:7099/api/Courses/${courseId}/assessments/${assessmentId}/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            answers: Object.entries(answers).map(([questionId, answer]) => ({
              questionId,
              answer,
            })),
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to submit assessment');
      
      setSubmitted(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGrade = async (submissionId: string) => {
    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(
        `https://localhost:7099/api/Courses/${courseId}/assessments/${assessmentId}/grade/${submissionId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            grades: Object.entries(grading).map(([questionId, { score, feedback }]) => ({
              questionId,
              score,
              feedback,
            })),
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to grade assessment');
      
      // Refresh assessment data
      const updatedAssessment = await response.json();
      setAssessment(updatedAssessment);
      setGrading({});
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!assessment) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">{assessment.title}</h2>
        <p className="text-gray-600 mb-4">{assessment.description}</p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <ClockIcon className="h-5 w-5 mr-1" />
            <span>Due: {assessment.dueDate}</span>
          </div>
          <div className="flex items-center">
            <AcademicCapIcon className="h-5 w-5 mr-1" />
            <span>Total Points: {assessment.totalPoints}</span>
          </div>
        </div>
      </div>

      {isInstructor ? (
        // Instructor View
        <div>
          <h3 className="text-lg font-semibold mb-4">Submissions</h3>
          {assessment.submissions?.length === 0 ? (
            <p className="text-gray-600">No submissions yet</p>
          ) : (
            <div className="space-y-6">
              {assessment.submissions?.map((submission) => (
                <div key={submission.studentId} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="font-medium">{submission.studentName}</p>
                      <p className="text-sm text-gray-600">
                        Submitted: {submission.submittedAt}
                      </p>
                    </div>
                    {submission.totalScore !== undefined && (
                      <div className="text-lg font-semibold">
                        Score: {submission.totalScore}/{assessment.totalPoints}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {assessment.questions.map((question) => {
                      const answer = submission.answers.find(
                        (a) => a.questionId === question.id
                      );
                      return (
                        <div key={question.id} className="border-t pt-4">
                          <p className="font-medium mb-2">{question.question}</p>
                          <div className="mb-2">
                            <p className="text-sm text-gray-600">Student's Answer:</p>
                            <p className="mt-1">{answer?.answer}</p>
                          </div>
                          
                          {submission.totalScore === undefined && (
                            <div className="mt-2">
                              <input
                                type="number"
                                min="0"
                                max={question.points}
                                value={grading[question.id]?.score || 0}
                                onChange={(e) =>
                                  setGrading((prev) => ({
                                    ...prev,
                                    [question.id]: {
                                      ...prev[question.id],
                                      score: parseInt(e.target.value),
                                    },
                                  }))
                                }
                                className="w-20 px-2 py-1 border rounded"
                                placeholder="Score"
                              />
                              <textarea
                                value={grading[question.id]?.feedback || ''}
                                onChange={(e) =>
                                  setGrading((prev) => ({
                                    ...prev,
                                    [question.id]: {
                                      ...prev[question.id],
                                      feedback: e.target.value,
                                    },
                                  }))
                                }
                                className="w-full mt-2 px-2 py-1 border rounded"
                                placeholder="Feedback"
                                rows={2}
                              />
                            </div>
                          )}
                          
                          {answer?.score !== undefined && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600">
                                Score: {answer.score}/{question.points}
                              </p>
                              {answer.feedback && (
                                <p className="text-sm text-gray-600 mt-1">
                                  Feedback: {answer.feedback}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {submission.totalScore === undefined && (
                    <button
                      onClick={() => handleGrade(submission.studentId)}
                      disabled={submitting}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {submitting ? 'Grading...' : 'Submit Grades'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Student View
        <div>
          {submitted ? (
            <div className="text-center">
              <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg text-gray-600">Assessment submitted successfully!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {assessment.questions.map((question) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium">{question.question}</p>
                    <span className="text-sm text-gray-600">
                      {question.points} points
                    </span>
                  </div>

                  {question.type === 'multiple-choice' && (
                    <div className="space-y-2">
                      {question.options?.map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === 'true-false' && (
                    <div className="space-y-2">
                      {['True', 'False'].map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option}
                            checked={answers[question.id] === option}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {(question.type === 'short-answer' || question.type === 'essay') && (
                    <textarea
                      value={answers[question.id]}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      rows={question.type === 'essay' ? 4 : 2}
                      placeholder={`Enter your ${question.type === 'essay' ? 'essay' : 'answer'} here`}
                    />
                  )}
                </div>
              ))}

              <button
                onClick={handleSubmit}
                disabled={submitting || Object.values(answers).some((a) => !a)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Assessment'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 