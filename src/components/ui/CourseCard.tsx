"use client";
import Link from 'next/link';
import { Star } from 'lucide-react';

interface CourseCardProps {
  courseId: string;
  title: string;
  description: string;
  level: string;
  thumbnail: string;
  instructor: string;
  rating: number;
  enrolledStudents: number;
}

export default function CourseCard({
  courseId,
  title,
  description,
  level,
  thumbnail,
  instructor,
  rating,
  enrolledStudents,
}: CourseCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">
          {level}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-sm">{rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-gray-500">{enrolledStudents} enrolled</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">By {instructor}</span>
          <Link
            href={`/courses/${courseId}`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
} 