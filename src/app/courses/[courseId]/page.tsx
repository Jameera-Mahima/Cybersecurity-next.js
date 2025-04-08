"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Reviews from '@/components/course/Reviews';
import Recommendations from '@/components/course/Recommendations';
import { Link } from 'react-router-dom';
import { StarIcon, ChartBarIcon, AcademicCapIcon, ClipboardDocumentListIcon, DocumentTextIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: {
    id: string;
    name: string;
  };
  enrolled: boolean;
  rating: number;
  enrolledStudents: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  price: number;
  thumbnail: string;
  lastUpdated: string;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInstructor, setIsInstructor] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://localhost:7099/api/Courses/${params.courseId}`
        );
        if (!response.ok) throw new Error('Failed to fetch course');
        
        const courseData = await response.json();
        setCourse(courseData);
        setIsInstructor(courseData.instructor.id === 'current-user-id'); // Replace with actual user ID check
        setIsEnrolled(courseData.enrolled); // Replace with actual enrollment check
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [params.courseId]);

  const handleEnroll = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://localhost:7099/api/Enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId: params.courseId }),
      });

      if (!response.ok) throw new Error('Failed to enroll in course');
      setIsEnrolled(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4">Loading course details...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!course) return <div className="text-center p-4">Course not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    {course.level}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                <p className="text-gray-600 mb-6">{course.description}</p>

                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1">{course.rating.toFixed(1)}</span>
                  </div>
                  <div className="text-gray-600">
                    {course.enrolledStudents} students enrolled
                  </div>
                  <div className="text-gray-600">
                    Instructor: {course.instructor.name}
                  </div>
                </div>

                <div className="mt-8">
                  {isInstructor ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Link
                        href={`/courses/${params.courseId}/analytics`}
                        className="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                      >
                        <ChartBarIcon className="h-6 w-6 text-gray-600 mr-2" />
                        <span>View Analytics</span>
                      </Link>
                      <Link
                        href={`/courses/${params.courseId}/progress`}
                        className="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                      >
                        <UserGroupIcon className="h-6 w-6 text-gray-600 mr-2" />
                        <span>View Progress</span>
                      </Link>
                      <Link
                        href={`/courses/${params.courseId}/assessments`}
                        className="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                      >
                        <ClipboardDocumentListIcon className="h-6 w-6 text-gray-600 mr-2" />
                        <span>Manage Assessments</span>
                      </Link>
                      <Link
                        href={`/courses/${params.courseId}/content`}
                        className="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                      >
                        <DocumentTextIcon className="h-6 w-6 text-gray-600 mr-2" />
                        <span>Manage Content</span>
                      </Link>
                    </div>
                  ) : isEnrolled ? (
                    <Link
                      href={`/courses/${params.courseId}/learn`}
                      className="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                      <AcademicCapIcon className="h-6 w-6 text-gray-600 mr-2" />
                      <span>Continue Learning</span>
                    </Link>
                  ) : (
                    <Link
                      href={`/courses/${params.courseId}/enroll`}
                      className="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                      <AcademicCapIcon className="h-6 w-6 text-gray-600 mr-2" />
                      <span>Enroll in Course</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Reviews courseId={params.courseId as string} canReview={isEnrolled} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Course Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Duration</h3>
                  <p className="text-gray-600">{course.duration}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Level</h3>
                  <p className="text-gray-600 capitalize">{course.level}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Price</h3>
                  <p className="text-gray-600">
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Last Updated</h3>
                  <p className="text-gray-600">
                    {new Date(course.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Recommendations currentCourseId={params.courseId as string} />
        </div>
      </div>
    </div>
  );
} 