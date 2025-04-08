"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface Assessment {
  id: string;
  title: string;
  type: 'quiz' | 'assignment';
  description: string;
  dueDate: string;
  totalPoints: number;
  submissionsCount: number;
  averageScore?: number;
}

export default function AssessmentsPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    title: '',
    type: 'quiz' as 'quiz' | 'assignment',
    description: '',
    dueDate: '',
    totalPoints: 100,
  });

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://localhost:7099/api/Courses/${courseId}/assessments`
        );
        if (!response.ok) throw new Error('Failed to fetch assessments');
        
        const assessmentsData = await response.json();
        setAssessments(assessmentsData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [courseId]);

  const handleCreateAssessment = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://localhost:7099/api/Courses/${courseId}/assessments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAssessment),
        }
      );

      if (!response.ok) throw new Error('Failed to create assessment');
      
      const createdAssessment = await response.json();
      setAssessments((prev) => [...prev, createdAssessment]);
      setShowCreateForm(false);
      setNewAssessment({
        title: '',
        type: 'quiz',
        description: '',
        dueDate: '',
        totalPoints: 100,
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssessment = async (assessmentId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://localhost:7099/api/Courses/${courseId}/assessments/${assessmentId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('Failed to delete assessment');
      
      setAssessments((prev) =>
        prev.filter((assessment) => assessment.id !== assessmentId)
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading assessments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Course Assessments</h1>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Assessment
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Manage quizzes and assignments for your course
          </p>
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Create New Assessment</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={newAssessment.title}
                  onChange={(e) =>
                    setNewAssessment((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  value={newAssessment.type}
                  onChange={(e) =>
                    setNewAssessment((prev) => ({
                      ...prev,
                      type: e.target.value as 'quiz' | 'assignment',
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="quiz">Quiz</option>
                  <option value="assignment">Assignment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={newAssessment.description}
                  onChange={(e) =>
                    setNewAssessment((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  value={newAssessment.dueDate}
                  onChange={(e) =>
                    setNewAssessment((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Points
                </label>
                <input
                  type="number"
                  value={newAssessment.totalPoints}
                  onChange={(e) =>
                    setNewAssessment((prev) => ({
                      ...prev,
                      totalPoints: parseInt(e.target.value),
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAssessment}
                  disabled={!newAssessment.title || !newAssessment.dueDate}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {assessments.map((assessment) => (
            <div
              key={assessment.id}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{assessment.title}</h2>
                  <p className="text-gray-600 mt-1">{assessment.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <AcademicCapIcon className="h-4 w-4 mr-1" />
                      <span>{assessment.type}</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>Due: {assessment.dueDate}</span>
                    </div>
                    <div className="flex items-center">
                      <span>{assessment.totalPoints} points</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/courses/${courseId}/assessments/${assessment.id}`}
                    className="p-2 text-gray-600 hover:text-blue-600"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDeleteAssessment(assessment.id)}
                    className="p-2 text-gray-600 hover:text-red-600"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">{assessment.submissionsCount}</span>{' '}
                  submissions
                </div>
                {assessment.averageScore !== undefined && (
                  <div>
                    Average score:{' '}
                    <span className="font-medium">
                      {assessment.averageScore}/{assessment.totalPoints}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 