"use client";
import { useState, useEffect } from 'react';
import { TrophyIcon, AcademicCapIcon, ChatBubbleLeftRightIcon, UserGroupIcon, StarIcon } from '@heroicons/react/24/outline';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: 'trophy' | 'academic' | 'chat' | 'group' | 'star';
  progress?: number;
  unlocked: boolean;
  unlockedAt?: string;
}

interface BadgesProps {
  userId: string;
}

export default function Badges({ userId }: BadgesProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`https://localhost:7099/api/Users/${userId}/badges`);
        if (!response.ok) throw new Error('Failed to fetch badges');
        
        const data = await response.json();
        setBadges(data.badges);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, [userId]);

  const filteredBadges = badges.filter(badge => {
    switch (activeFilter) {
      case 'unlocked':
        return badge.unlocked;
      case 'locked':
        return !badge.unlocked;
      default:
        return true;
    }
  });

  const getBadgeIcon = (icon: Badge['icon']) => {
    switch (icon) {
      case 'trophy':
        return <TrophyIcon className="h-8 w-8" />;
      case 'academic':
        return <AcademicCapIcon className="h-8 w-8" />;
      case 'chat':
        return <ChatBubbleLeftRightIcon className="h-8 w-8" />;
      case 'group':
        return <UserGroupIcon className="h-8 w-8" />;
      case 'star':
        return <StarIcon className="h-8 w-8" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading achievements...</p>
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
          <h2 className="text-2xl font-bold">Achievements & Badges</h2>
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
              onClick={() => setActiveFilter('unlocked')}
              className={`px-4 py-2 rounded-md ${
                activeFilter === 'unlocked'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Unlocked
            </button>
            <button
              onClick={() => setActiveFilter('locked')}
              className={`px-4 py-2 rounded-md ${
                activeFilter === 'locked'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Locked
            </button>
          </div>
        </div>

        {filteredBadges.length === 0 ? (
          <div className="text-center py-8">
            <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600">No badges found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBadges.map((badge) => (
              <div
                key={badge.id}
                className={`bg-white rounded-lg shadow-lg p-6 ${
                  !badge.unlocked ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div
                    className={`p-3 rounded-full ${
                      badge.unlocked ? 'bg-blue-100' : 'bg-gray-100'
                    }`}
                  >
                    {getBadgeIcon(badge.icon)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{badge.name}</h3>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                  </div>
                </div>

                {badge.progress !== undefined && !badge.unlocked && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${badge.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Progress: {badge.progress}%
                    </p>
                  </div>
                )}

                {badge.unlocked && badge.unlockedAt && (
                  <p className="text-sm text-gray-500 mt-4">
                    Unlocked on {new Date(badge.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 