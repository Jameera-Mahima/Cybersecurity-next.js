"use client";
import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchFiltersProps {
  onSearch: (filters: {
    query: string;
    level: string;
    category: string;
    duration: string;
    minPrice: number;
    maxPrice: number;
  }) => void;
}

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [filters, setFilters] = useState({
    query: '',
    level: 'all',
    category: 'all',
    duration: 'all',
    minPrice: 0,
    maxPrice: 1000,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            name="query"
            value={filters.query}
            onChange={handleChange}
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Level
          </label>
          <select
            name="level"
            value={filters.level}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Categories</option>
            <option value="network-security">Network Security</option>
            <option value="ethical-hacking">Ethical Hacking</option>
            <option value="cryptography">Cryptography</option>
            <option value="cyber-forensics">Cyber Forensics</option>
            <option value="risk-management">Risk Management</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration
          </label>
          <select
            name="duration"
            value={filters.duration}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">Any Duration</option>
            <option value="short">Short (0-2 hours)</option>
            <option value="medium">Medium (2-5 hours)</option>
            <option value="long">Long (5+ hours)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Range
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
              min="0"
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Min"
            />
            <span>-</span>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              min="0"
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Search Courses
        </button>
      </div>
    </form>
  );
} 