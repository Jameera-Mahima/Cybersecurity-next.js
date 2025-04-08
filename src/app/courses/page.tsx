"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

interface Course {
  courseId: string;
  title: string;
  description: string;
  instructor: string | null;
  courseDuration: string | null;
  thumbnail: string | null;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Not authenticated');
        }

        const response = await fetch('https://localhost:7099/api/Courses', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        setCourses(data.courses || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400 animate-pulse" />
            <p className="mt-2 text-lg text-gray-600">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Available Courses</h1>
          <p className="mt-2 text-lg text-gray-600">
            Browse and enroll in our computer science courses
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center">
            <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-lg text-gray-600">No courses available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.courseId}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                {course.thumbnail && (
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="object-cover w-full h-48"
                    />
                  </div>
                )}
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {course.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {course.description}
                  </p>
                  {course.instructor && (
                    <p className="mt-2 text-sm text-gray-500">
                      Instructor: {course.instructor}
                    </p>
                  )}
                  {course.courseDuration && (
                    <p className="mt-1 text-sm text-gray-500">
                      Duration: {course.courseDuration}
                    </p>
                  )}
                  <div className="mt-4">
                    <Link
                      href={`/courses/${course.courseId}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}