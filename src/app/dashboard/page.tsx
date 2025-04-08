"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AcademicCapIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface EnrolledCourse {
  enrollmentId: string;
  courseId: string;
  title: string;
  instructor: string | null;
  enrollmentDate: string;
  enrollmentStatus: string;
  progress: number;
  lastAccessed: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch enrollments
        const enrollmentsResponse = await fetch('https://localhost:7099/api/Enrollments', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!enrollmentsResponse.ok) {
          throw new Error('Failed to fetch enrollments');
        }

        const enrollmentsData = await enrollmentsResponse.json();
        const enrollments = enrollmentsData.enrollments || [];

        // Fetch all courses to get course details
        const coursesResponse = await fetch('https://localhost:7099/api/Courses', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!coursesResponse.ok) {
          throw new Error('Failed to fetch courses');
        }

        const coursesData = await coursesResponse.json();
        const courses = coursesData.courses || [];

        // Combine enrollment and course data
        const enrolledCoursesData = enrollments.map((enrollment: any) => {
          const course = courses.find((c: any) => c.courseId === enrollment.courseId);
          return {
            enrollmentId: enrollment.enrollmentId,
            courseId: enrollment.courseId,
            title: course?.title || 'Unknown Course',
            instructor: course?.instructor || null,
            enrollmentDate: enrollment.enrollmentDate,
            enrollmentStatus: enrollment.enrollmentStatus,
            progress: Math.floor(Math.random() * 100), // Replace with actual progress calculation
            lastAccessed: new Date().toISOString(), // Replace with actual last accessed date
          };
        });

        setEnrolledCourses(enrolledCoursesData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading your dashboard...</p>
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="mt-4 text-lg text-gray-600">
            Track your learning progress and access your enrolled courses
          </p>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="text-center py-12">
            <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600">You haven't enrolled in any courses yet.</p>
            <button
              onClick={() => router.push('/courses')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {enrolledCourses.map((course) => (
              <div
                key={course.enrollmentId}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {course.title}
                      </h2>
                      {course.instructor && (
                        <p className="text-gray-600 mb-4">Instructor: {course.instructor}</p>
                      )}
                      <div className="text-sm text-gray-500">
                        <p>Enrolled on: {new Date(course.enrollmentDate).toLocaleDateString()}</p>
                        <p>Status: {course.enrollmentStatus}</p>
                        <p>Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/courses/${course.courseId}/learn`)}
                      className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                    >
                      Continue Learning
                      <ArrowRightIcon className="h-5 w-5 ml-2" />
                    </button>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
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