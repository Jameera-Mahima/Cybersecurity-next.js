"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CourseFormData {
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  thumbnail: File | null;
  learningOutcomes: string[];
  tags: string[];
}

export default function CreateCoursePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    level: 'beginner',
    category: '',
    thumbnail: null,
    learningOutcomes: [''],
    tags: [''],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, thumbnail: e.target.files![0] }));
    }
  };

  const handleOutcomeChange = (index: number, value: string) => {
    const newOutcomes = [...formData.learningOutcomes];
    newOutcomes[index] = value;
    setFormData(prev => ({ ...prev, learningOutcomes: newOutcomes }));
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'learningOutcomes' || key === 'tags') {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (key === 'thumbnail' && value) {
          formDataToSend.append(key, value);
        } else {
          formDataToSend.append(key, value as string);
        }
      });

      const response = await fetch('https://localhost:7099/api/Courses', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to create course');
      }

      router.push('/courses');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create New Course</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Level
          </label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Learning Outcomes
          </label>
          {formData.learningOutcomes.map((outcome, index) => (
            <input
              key={index}
              type="text"
              value={outcome}
              onChange={(e) => handleOutcomeChange(index, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
              placeholder={`Learning outcome ${index + 1}`}
            />
          ))}
          <button
            type="button"
            onClick={() => setFormData(prev => ({
              ...prev,
              learningOutcomes: [...prev.learningOutcomes, '']
            }))}
            className="text-blue-600 hover:text-blue-800"
          >
            Add Outcome
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          {formData.tags.map((tag, index) => (
            <input
              key={index}
              type="text"
              value={tag}
              onChange={(e) => handleTagChange(index, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
              placeholder={`Tag ${index + 1}`}
            />
          ))}
          <button
            type="button"
            onClick={() => setFormData(prev => ({
              ...prev,
              tags: [...prev.tags, '']
            }))}
            className="text-blue-600 hover:text-blue-800"
          >
            Add Tag
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating Course...' : 'Create Course'}
        </button>
      </form>
    </div>
  );
} 