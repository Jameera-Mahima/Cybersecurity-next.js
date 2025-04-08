"use client";
import { useState, useEffect } from 'react';
import {
  AcademicCapIcon,
  ClockIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface ProgressData {
  overallProgress: number;
  completedModules: number;
  totalModules: number;
  timeSpent: string;
  lastAccessed: string;
  assessmentScores: Array<{
    assessmentId: string;
    title: string;
    score: number;
    maxScore: number;
    completed: boolean;
  }>;
  moduleProgress: Array<{
    moduleId: string;
    title: string;
    progress: number;
    completed: boolean;
    lastAccessed: string;
  }>;
}

interface ProgressTrackerProps {
  courseId: string;
  isInstructor?: boolean;
  studentId?: string;
}

export default function ProgressTracker({ courseId, isInstructor = false, studentId }: ProgressTrackerProps) {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = isInstructor && studentId
          ? `https://localhost:7099/api/Courses/${courseId}/progress/${studentId}`
          : `https://localhost:7099/api/Courses/${courseId}/progress`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch progress data');
        
        const progressData = await response.json();
        setProgress(progressData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [courseId, isInstructor, studentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading progress data...</p>
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

  if (!progress) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Course Progress</h2>
        
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <AcademicCapIcon className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold">{progress.overallProgress}%</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Completed Modules</p>
                <p className="text-2xl font-bold">
                  {progress.completedModules}/{progress.totalModules}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Time Spent</p>
                <p className="text-2xl font-bold">{progress.timeSpent}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Last Accessed</p>
                <p className="text-2xl font-bold">{progress.lastAccessed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Module Progress */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Module Progress</h3>
          <div className="space-y-4">
            {progress.moduleProgress.map((module) => (
              <div key={module.moduleId} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{module.title}</h4>
                  <span className="text-sm text-gray-600">
                    Last accessed: {module.lastAccessed}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${module.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">
                    {module.progress}% complete
                  </span>
                  {module.completed ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment Scores */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Assessment Scores</h3>
          <div className="space-y-4">
            {progress.assessmentScores.map((assessment) => (
              <div key={assessment.assessmentId} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{assessment.title}</h4>
                  <span className="text-sm text-gray-600">
                    {assessment.score}/{assessment.maxScore}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{
                      width: `${(assessment.score / assessment.maxScore) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">
                    {((assessment.score / assessment.maxScore) * 100).toFixed(1)}%
                  </span>
                  {assessment.completed ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 