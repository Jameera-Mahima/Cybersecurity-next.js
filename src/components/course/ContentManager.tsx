"use client";
import { useState, useEffect } from 'react';
import {
  AcademicCapIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';

interface ContentItem {
  id: string;
  type: 'video' | 'text' | 'file' | 'link';
  title: string;
  description: string;
  url?: string;
  content?: string;
  duration?: string;
  order: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  contentItems: ContentItem[];
}

interface ContentManagerProps {
  courseId: string;
}

export default function ContentManager({ courseId }: ContentManagerProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModule, setShowCreateModule] = useState(false);
  const [showCreateContent, setShowCreateContent] = useState<string | null>(null);
  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
  });
  const [newContent, setNewContent] = useState({
    type: 'text' as 'video' | 'text' | 'file' | 'link',
    title: '',
    description: '',
    url: '',
    content: '',
    duration: '',
  });

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://localhost:7099/api/Courses/${courseId}/modules`
        );
        if (!response.ok) throw new Error('Failed to fetch modules');
        
        const modulesData = await response.json();
        setModules(modulesData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [courseId]);

  const handleCreateModule = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://localhost:7099/api/Courses/${courseId}/modules`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...newModule,
            order: modules.length + 1,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to create module');
      
      const createdModule = await response.json();
      setModules((prev) => [...prev, createdModule]);
      setShowCreateModule(false);
      setNewModule({
        title: '',
        description: '',
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContent = async (moduleId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://localhost:7099/api/Courses/${courseId}/modules/${moduleId}/content`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...newContent,
            order: modules.find(m => m.id === moduleId)?.contentItems.length || 0,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to create content');
      
      const createdContent = await response.json();
      setModules((prev) =>
        prev.map((module) =>
          module.id === moduleId
            ? {
                ...module,
                contentItems: [...module.contentItems, createdContent],
              }
            : module
        )
      );
      setShowCreateContent(null);
      setNewContent({
        type: 'text',
        title: '',
        description: '',
        url: '',
        content: '',
        duration: '',
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://localhost:7099/api/Courses/${courseId}/modules/${moduleId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('Failed to delete module');
      
      setModules((prev) => prev.filter((module) => module.id !== moduleId));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = async (moduleId: string, contentId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://localhost:7099/api/Courses/${courseId}/modules/${moduleId}/content/${contentId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('Failed to delete content');
      
      setModules((prev) =>
        prev.map((module) =>
          module.id === moduleId
            ? {
                ...module,
                contentItems: module.contentItems.filter(
                  (item) => item.id !== contentId
                ),
              }
            : module
        )
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleReorderModule = async (moduleId: string, direction: 'up' | 'down') => {
    try {
      setLoading(true);
      setError(null);

      const module = modules.find((m) => m.id === moduleId);
      if (!module) return;

      const newOrder = direction === 'up' ? module.order - 1 : module.order + 1;
      const swapModule = modules.find((m) => m.order === newOrder);
      if (!swapModule) return;

      const response = await fetch(
        `https://localhost:7099/api/Courses/${courseId}/modules/reorder`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([
            { id: moduleId, order: newOrder },
            { id: swapModule.id, order: module.order },
          ]),
        }
      );

      if (!response.ok) throw new Error('Failed to reorder modules');
      
      setModules((prev) =>
        prev.map((m) =>
          m.id === moduleId
            ? { ...m, order: newOrder }
            : m.id === swapModule.id
            ? { ...m, order: module.order }
            : m
        )
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading content...</p>
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
        <button
          onClick={() => setShowCreateModule(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Module
        </button>
      </div>

      {showCreateModule && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Create New Module</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={newModule.title}
                onChange={(e) =>
                  setNewModule((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={newModule.description}
                onChange={(e) =>
                  setNewModule((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCreateModule(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateModule}
                disabled={!newModule.title}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {modules
          .sort((a, b) => a.order - b.order)
          .map((module) => (
            <div key={module.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{module.title}</h3>
                  <p className="text-gray-600 mt-1">{module.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleReorderModule(module.id, 'up')}
                    disabled={module.order === 1}
                    className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-50"
                  >
                    <ArrowUpIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleReorderModule(module.id, 'down')}
                    disabled={module.order === modules.length}
                    className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-50"
                  >
                    <ArrowDownIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setShowCreateContent(module.id)}
                    className="p-2 text-gray-600 hover:text-blue-600"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteModule(module.id)}
                    className="p-2 text-gray-600 hover:text-red-600"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {showCreateContent === module.id && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-4">Add Content</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Type
                      </label>
                      <select
                        value={newContent.type}
                        onChange={(e) =>
                          setNewContent((prev) => ({
                            ...prev,
                            type: e.target.value as 'video' | 'text' | 'file' | 'link',
                          }))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="video">Video</option>
                        <option value="text">Text</option>
                        <option value="file">File</option>
                        <option value="link">Link</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        type="text"
                        value={newContent.title}
                        onChange={(e) =>
                          setNewContent((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={newContent.description}
                        onChange={(e) =>
                          setNewContent((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    {newContent.type === 'video' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Video URL
                        </label>
                        <input
                          type="text"
                          value={newContent.url}
                          onChange={(e) =>
                            setNewContent((prev) => ({
                              ...prev,
                              url: e.target.value,
                            }))
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {newContent.type === 'text' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Content
                        </label>
                        <textarea
                          value={newContent.content}
                          onChange={(e) =>
                            setNewContent((prev) => ({
                              ...prev,
                              content: e.target.value,
                            }))
                          }
                          rows={4}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {newContent.type === 'file' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          File URL
                        </label>
                        <input
                          type="text"
                          value={newContent.url}
                          onChange={(e) =>
                            setNewContent((prev) => ({
                              ...prev,
                              url: e.target.value,
                            }))
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {newContent.type === 'link' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Link URL
                        </label>
                        <input
                          type="text"
                          value={newContent.url}
                          onChange={(e) =>
                            setNewContent((prev) => ({
                              ...prev,
                              url: e.target.value,
                            }))
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setShowCreateContent(null)}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleCreateContent(module.id)}
                        disabled={!newContent.title}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-4">
                {module.contentItems
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-start space-x-4">
                        {item.type === 'video' && (
                          <VideoCameraIcon className="h-6 w-6 text-blue-600" />
                        )}
                        {item.type === 'text' && (
                          <DocumentTextIcon className="h-6 w-6 text-green-600" />
                        )}
                        {item.type === 'file' && (
                          <DocumentTextIcon className="h-6 w-6 text-gray-600" />
                        )}
                        {item.type === 'link' && (
                          <LinkIcon className="h-6 w-6 text-purple-600" />
                        )}
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                          {item.duration && (
                            <p className="text-sm text-gray-500">
                              Duration: {item.duration}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteContent(module.id, item.id)}
                          className="p-2 text-gray-600 hover:text-red-600"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
} 