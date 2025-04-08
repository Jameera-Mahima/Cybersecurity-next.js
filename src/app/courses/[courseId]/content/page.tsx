"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ContentManager from '@/components/course/ContentManager';
import {
  AcademicCapIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

interface Course {
  id: string;
  title: string;
  instructor: {
    id: string;
    name: string;
  };
}

export default function ContentPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://localhost:7099/api/Courses/${courseId}`
        );
        if (!response.ok) throw new Error('Failed to fetch course');
        
        const courseData = await response.json();
        setCourse(courseData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading course content...</p>
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

  if (!course) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {course.title}
              </h1>
              <p className="text-sm text-gray-600">
                Instructor: {course.instructor.name}
              </p>
            </div>
          </div>
        </div>

        <ContentManager courseId={courseId} />
      </div>
    </div>
  );
} 