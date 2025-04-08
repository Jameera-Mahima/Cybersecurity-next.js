"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PencilIcon } from '@heroicons/react/24/outline';
import Badges from '@/components/user/Badges';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio: string;
  role: 'student' | 'instructor';
  joinDate: string;
  profilePicture: string;
  enrolledCourses: {
    courseId: string;
    title: string;
    progress: number;
    lastAccessed: string;
  }[];
  createdCourses: {
    courseId: string;
    title: string;
    enrolledStudents: number;
    rating: number;
  }[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: '',
    bio: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('https://localhost:7099/api/Users/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data);
      setEditData({
        fullName: data.fullName,
        bio: data.bio,
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:7099/api/Users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleCourseClick = (courseId: string) => {
    router.push(`/courses/${courseId}/learn`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file change
  };

  if (loading) return <div className="text-center p-8">Loading profile...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!profile) return <div className="text-center p-4">Profile not found</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={profile.profilePicture || '/default-avatar.png'}
                  alt={profile.username}
                  className="w-24 h-24 rounded-full object-cover"
                />
                {isEditing && (
                  <button
                    onClick={() => document.getElementById('profilePicture')?.click()}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                )}
                <input
                  type="file"
                  id="profilePicture"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editData.fullName}
                        onChange={(e) =>
                          setEditData({ ...editData, fullName: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <textarea
                        value={editData.bio}
                        onChange={(e) =>
                          setEditData({ ...editData, bio: e.target.value })
                        }
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={handleEdit}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-2xl font-bold">{profile.fullName}</h1>
                    <p className="text-gray-600">@{profile.username}</p>
                    <p className="mt-2 text-gray-700">{profile.bio}</p>
                    <p className="mt-2 text-sm text-gray-500">
                      Joined {new Date(profile.joinDate).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-4 flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <PencilIcon className="h-5 w-5" />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Enrolled Courses</h2>
            <div className="space-y-4">
              {profile.enrolledCourses.map((course) => (
                <div
                  key={course.courseId}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-sm text-gray-600">
                        Progress: {course.progress}%
                      </p>
                    </div>
                    <Link
                      href={`/courses/${course.courseId}/learn`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Continue Learning
                    </Link>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {profile.role === 'instructor' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Created Courses</h2>
              <div className="space-y-4">
                {profile.createdCourses.map((course) => (
                  <div
                    key={course.courseId}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{course.title}</h3>
                        <p className="text-sm text-gray-600">
                          {course.enrolledStudents} students enrolled
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-400">★</span>
                        <span>{course.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Achievements & Badges</h2>
            <Badges userId={profile.id} />
          </div>
        </div>
      </div>
    </div>
  );
} 