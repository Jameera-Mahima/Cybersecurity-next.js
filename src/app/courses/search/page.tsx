"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchFilters from '@/components/course/SearchFilters';
import CourseCard from '@/components/ui/CourseCard';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  rating: number;
  enrolledStudents: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  price: number;
  thumbnail: string;
  category: string;
}

interface SearchFilters {
  query: string;
  level: string;
  category: string;
  duration: string;
  minPrice: number;
  maxPrice: number;
}

export default function SearchPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    level: 'all',
    category: 'all',
    duration: 'all',
    minPrice: 0,
    maxPrice: 1000,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async (searchFilters?: SearchFilters) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (searchFilters) {
        Object.entries(searchFilters).forEach(([key, value]) => {
          if (value && value !== 'all') {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(
        `https://localhost:7099/api/Courses/search?${queryParams.toString()}`
      );

      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      setCourses(data.courses);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    fetchCourses(newFilters);
  };

  const handleCourseClick = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Search Courses</h1>

      <div className="mb-8">
        <SearchFilters onSearch={handleSearch} />
      </div>

      {loading ? (
        <div className="text-center p-8">Loading courses...</div>
      ) : error ? (
        <div className="text-red-500 p-4">{error}</div>
      ) : courses.length === 0 ? (
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold mb-2">No courses found</h2>
          <p className="text-gray-600">
            Try adjusting your search filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => handleCourseClick(course.id)}
              className="cursor-pointer"
            >
              <CourseCard
                courseId={course.id}
                title={course.title}
                description={course.description}
                level={course.level}
                thumbnail={course.thumbnail}
                instructor={course.instructor}
                rating={course.rating}
                enrolledStudents={course.enrolledStudents}
              />
            </div>
          ))}
        </div>
      )}

      {courses.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Showing {courses.length} courses matching your criteria
          </p>
        </div>
      )}
    </div>
  );
} 