"use client";
import { useState, useEffect } from 'react';
import {
  PlayIcon,
  DocumentTextIcon,
  LinkIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

interface ContentItem {
  id: string;
  type: 'text' | 'video' | 'pdf' | 'image' | 'link';
  title: string;
  content: string;
  order: number;
  completed?: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  contentItems: ContentItem[];
}

interface CourseContentProps {
  courseId: string;
}

export default function CourseContent({ courseId }: CourseContentProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Not authenticated');
        }

        const response = await fetch(
          `https://localhost:7099/api/Courses/${courseId}/modules`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch course modules');
        }

        const data = await response.json();
        setModules(data.modules || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [courseId]);

  const handleContentComplete = async (contentId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `https://localhost:7099/api/Courses/${courseId}/content/${contentId}/complete`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark content as complete');
      }

      setModules(prevModules => 
        prevModules.map(module => ({
          ...module,
          contentItems: module.contentItems.map(item =>
            item.id === contentId ? { ...item, completed: true } : item
          ),
        }))
      );
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleNextContent = () => {
    const currentModule = modules[currentModuleIndex];
    if (currentContentIndex < currentModule.contentItems.length - 1) {
      setCurrentContentIndex(prev => prev + 1);
    } else if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex(prev => prev + 1);
      setCurrentContentIndex(0);
    }
  };

  const handlePreviousContent = () => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex(prev => prev - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(prev => prev - 1);
      const previousModule = modules[currentModuleIndex - 1];
      setCurrentContentIndex(previousModule.contentItems.length - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600">No content available for this course.</p>
        </div>
      </div>
    );
  }

  const currentModule = modules[currentModuleIndex];
  const currentContent = currentModule.contentItems[currentContentIndex];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Course Content</h2>
          <div className="space-y-2">
            {modules.map((module, moduleIndex) => (
              <div key={module.id} className="space-y-2">
                <div className="font-medium text-gray-900">
                  Module {module.order}: {module.title}
                </div>
                <div className="space-y-1 pl-4">
                  {module.contentItems.map((item, itemIndex) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentModuleIndex(moduleIndex);
                        setCurrentContentIndex(itemIndex);
                      }}
                      className={`w-full text-left p-2 rounded-md ${
                        currentContent.id === item.id
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          {item.order}. {item.title}
                        </span>
                        {item.completed && (
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Module {currentModule.order}: {currentModule.title}
            </h2>
            <p className="text-gray-600 mt-2">{currentModule.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {currentContent.order}. {currentContent.title}
            </h3>

            <div className="prose max-w-none">
              {currentContent.type === 'text' && (
                <div dangerouslySetInnerHTML={{ __html: currentContent.content }} />
              )}
              
              {currentContent.type === 'video' && (
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={currentContent.content}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                  />
                </div>
              )}
              
              {currentContent.type === 'pdf' && (
                <iframe
                  src={currentContent.content}
                  className="w-full h-[600px] rounded-lg"
                />
              )}
              
              {currentContent.type === 'image' && (
                <img
                  src={currentContent.content}
                  alt={currentContent.title}
                  className="w-full rounded-lg"
                />
              )}
              
              {currentContent.type === 'link' && (
                <a
                  href={currentContent.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Open External Resource
                </a>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePreviousContent}
              disabled={currentModuleIndex === 0 && currentContentIndex === 0}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Previous
            </button>

            {!currentContent.completed && (
              <button
                onClick={() => handleContentComplete(currentContent.id)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Mark as Complete
                <CheckCircleIcon className="h-5 w-5 ml-2" />
              </button>
            )}

            <button
              onClick={handleNextContent}
              disabled={
                currentModuleIndex === modules.length - 1 &&
                currentContentIndex === currentModule.contentItems.length - 1
              }
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 