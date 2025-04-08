"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProgressTracker from '@/components/course/ProgressTracker';
import { AcademicCapIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentDate: string;
  lastAccessed: string;
}

export default function ProgressPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://localhost:7099/api/Courses/${courseId}/students`
        );
        if (!response.ok) throw new Error('Failed to fetch students');
        
        const studentsData = await response.json();
        setStudents(studentsData);
        if (studentsData.length > 0) {
          setSelectedStudent(studentsData[0].id);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading student data...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Student Progress</h1>
          <p className="mt-2 text-sm text-gray-600">
            Track and monitor student performance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Student List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Students</h2>
              <div className="space-y-4">
                {students.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student.id)}
                    className={`w-full text-left p-4 rounded-lg ${
                      selectedStudent === student.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <AcademicCapIcon className="h-6 w-6 text-gray-400" />
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-600">
                          Last accessed: {student.lastAccessed}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Details */}
          <div className="lg:col-span-3">
            {selectedStudent ? (
              <ProgressTracker
                courseId={courseId}
                isInstructor={true}
                studentId={selectedStudent}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-center">
                  <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-600">
                    Select a student to view their progress
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 