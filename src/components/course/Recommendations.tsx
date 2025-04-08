"use client";
import { useState, useEffect } from 'react';
import CourseCard from '@/components/ui/CourseCard';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface RecommendedCourse {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  thumbnail: string;
  instructor: string;
  rating: number;
  enrolledStudents: number;
  category: string;
  tags: string[];
  similarityScore?: number;
}

interface RecommendationsProps {
  currentCourseId?: string;
}

export default function Recommendations({ currentCourseId }: RecommendationsProps) {
  const [recommendedCourses, setRecommendedCourses] = useState<RecommendedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'similar' | 'popular' | 'new'>('all');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        let url = 'https://localhost:7099/api/Courses/recommendations';
        if (currentCourseId) {
          url += `?currentCourseId=${currentCourseId}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch recommendations');
        
        const data = await response.json();
        setRecommendedCourses(data.courses);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentCourseId]);

  const filteredCourses = recommendedCourses.filter(course => {
    switch (activeFilter) {
      case 'similar':
        return course.similarityScore && course.similarityScore > 0.7;
      case 'popular':
        return course.enrolledStudents > 100;
      case 'new':
        return course.enrolledStudents < 50;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <SparklesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Finding recommendations...</p>
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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Recommended Courses</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-md ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('similar')}
              className={`px-4 py-2 rounded-md ${
                activeFilter === 'similar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Similar
            </button>
            <button
              onClick={() => setActiveFilter('popular')}
              className={`px-4 py-2 rounded-md ${
                activeFilter === 'popular'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => setActiveFilter('new')}
              className={`px-4 py-2 rounded-md ${
                activeFilter === 'new'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              New
            </button>
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-8">
            <SparklesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600">No recommendations found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                courseId={course.id}
                title={course.title}
                description={course.description}
                level={course.level}
                thumbnail={course.thumbnail}
                instructor={course.instructor}
                rating={course.rating}
                enrolledStudents={course.enrolledStudents}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 