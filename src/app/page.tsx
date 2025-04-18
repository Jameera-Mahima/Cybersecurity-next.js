"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

interface Course {
  courseId: string;
  title: string;
  description: string;
  instructor: string | null;
  courseDuration: string | null;
  thumbnail: string | null;
}

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('https://localhost:7099/api/Courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        const coursesList = data.courses || [];
        setCourses(coursesList);
        setFilteredCourses(coursesList);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course => 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.instructor?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );
    setFilteredCourses(filtered);
  }, [searchQuery, courses]);

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Welcome to CS Platform
            </h1>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Discover and learn from our collection of computer science courses
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses by title, description, or instructor..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            {searchQuery ? 'Search Results' : 'Available Courses'}
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            {filteredCourses.length} courses found
          </p>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center">
            <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-lg text-gray-600">
              {searchQuery
                ? 'No courses found matching your search.'
                : 'No courses available at the moment.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <div
                key={course.courseId}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300"
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
