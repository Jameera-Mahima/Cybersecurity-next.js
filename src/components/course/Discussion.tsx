"use client";
import { useState, useEffect } from 'react';
import { ChatBubbleLeftIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

interface DiscussionThread {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    role: 'student' | 'instructor';
  };
  createdAt: string;
  replies: Reply[];
}

interface Reply {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    role: 'student' | 'instructor';
  };
  createdAt: string;
}

interface DiscussionProps {
  courseId: string;
  isInstructor: boolean;
}

export default function Discussion({ courseId, isInstructor }: DiscussionProps) {
  const [threads, setThreads] = useState<DiscussionThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newThread, setNewThread] = useState({
    title: '',
    content: '',
  });
  const [selectedThread, setSelectedThread] = useState<DiscussionThread | null>(null);
  const [newReply, setNewReply] = useState('');

  useEffect(() => {
    fetchThreads();
  }, [courseId]);

  const fetchThreads = async () => {
    try {
      const response = await fetch(`https://localhost:7099/api/Courses/${courseId}/discussions`);
      if (!response.ok) throw new Error('Failed to fetch discussions');
      const data = await response.json();
      setThreads(data.threads);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThread.title || !newThread.content) {
      setError('Please provide both title and content');
      return;
    }

    try {
      const response = await fetch(`https://localhost:7099/api/Courses/${courseId}/discussions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newThread),
      });

      if (!response.ok) throw new Error('Failed to create thread');
      
      const thread = await response.json();
      setThreads(prev => [thread, ...prev]);
      setNewThread({ title: '', content: '' });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleAddReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThread || !newReply) return;

    try {
      const response = await fetch(
        `https://localhost:7099/api/Courses/${courseId}/discussions/${selectedThread.id}/replies`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: newReply }),
        }
      );

      if (!response.ok) throw new Error('Failed to add reply');
      
      const reply = await response.json();
      setThreads(prev =>
        prev.map(thread =>
          thread.id === selectedThread.id
            ? { ...thread, replies: [...thread.replies, reply] }
            : thread
        )
      );
      setNewReply('');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <div className="text-center p-4">Loading discussions...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="space-y-6">
      {!selectedThread ? (
        <>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Start a Discussion</h2>
            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newThread.title}
                  onChange={(e) => setNewThread(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="What's your question?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={newThread.content}
                  onChange={(e) => setNewThread(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={4}
                  placeholder="Describe your question in detail..."
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Post Discussion
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold">Recent Discussions</h2>
            {threads.length === 0 ? (
              <p className="text-gray-600">No discussions yet. Start one above!</p>
            ) : (
              threads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThread(thread)}
                  className="bg-white rounded-lg shadow p-4 cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{thread.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{thread.content}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ChatBubbleLeftIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{thread.replies.length}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                    <span>{thread.author.name}</span>
                    <span>{formatDate(thread.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedThread(null)}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowUturnLeftIcon className="h-4 w-4 mr-1" />
              Back to Discussions
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">{selectedThread.title}</h2>
            <p className="text-gray-600 mb-4">{selectedThread.content}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{selectedThread.author.name}</span>
              <span>{formatDate(selectedThread.createdAt)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Replies ({selectedThread.replies.length})</h3>
            {selectedThread.replies.map((reply) => (
              <div key={reply.id} className="border-l-4 border-gray-200 pl-4">
                <p className="text-gray-600">{reply.content}</p>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                  <span>{reply.author.name}</span>
                  <span>{formatDate(reply.createdAt)}</span>
                </div>
              </div>
            ))}

            <form onSubmit={handleAddReply} className="mt-6">
              <textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Write your reply..."
              />
              <button
                type="submit"
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Post Reply
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 