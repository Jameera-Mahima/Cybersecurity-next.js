"use client";
import { useState } from 'react';
import { AcademicCapIcon, CreditCardIcon } from '@heroicons/react/24/outline';

interface Course {
  id: string;
  title: string;
  price: number;
  instructor: {
    name: string;
  };
}

interface EnrollmentProps {
  course: Course;
  onEnroll: () => void;
}

export default function Enrollment({ course, onEnroll }: EnrollmentProps) {
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'paypal'>('credit');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create enrollment record
      const response = await fetch(
        `https://localhost:7099/api/Courses/${course.id}/enrollments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to enroll in course');
      }

      onEnroll();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Enroll in Course</h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Course Price</span>
          <span className="text-xl font-bold text-gray-900">
            ${course.price.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Instructor</span>
          <span className="text-gray-900">{course.instructor.name}</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Select Payment Method
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setPaymentMethod('credit')}
            className={`flex items-center justify-center p-4 border rounded-lg ${
              paymentMethod === 'credit'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300'
            }`}
          >
            <CreditCardIcon className="h-6 w-6 mr-2" />
            Credit Card
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('paypal')}
            className={`flex items-center justify-center p-4 border rounded-lg ${
              paymentMethod === 'paypal'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300'
            }`}
          >
            <img
              src="/paypal-logo.png"
              alt="PayPal"
              className="h-6 mr-2"
            />
            PayPal
          </button>
        </div>
      </div>

      {paymentMethod === 'credit' && (
        <form onSubmit={handleEnroll} className="space-y-4">
          <div>
            <label
              htmlFor="cardNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="number"
              value={cardDetails.number}
              onChange={handleCardChange}
              placeholder="1234 5678 9012 3456"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="expiry"
                className="block text-sm font-medium text-gray-700"
              >
                Expiry Date
              </label>
              <input
                type="text"
                id="expiry"
                name="expiry"
                value={cardDetails.expiry}
                onChange={handleCardChange}
                placeholder="MM/YY"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="cvc"
                className="block text-sm font-medium text-gray-700"
              >
                CVC
              </label>
              <input
                type="text"
                id="cvc"
                name="cvc"
                value={cardDetails.cvc}
                onChange={handleCardChange}
                placeholder="123"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="cardName"
              className="block text-sm font-medium text-gray-700"
            >
              Name on Card
            </label>
            <input
              type="text"
              id="cardName"
              name="name"
              value={cardDetails.name}
              onChange={handleCardChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <AcademicCapIcon className="h-5 w-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <AcademicCapIcon className="h-5 w-5 mr-2" />
                Enroll Now
              </>
            )}
          </button>
        </form>
      )}

      {paymentMethod === 'paypal' && (
        <div className="text-center">
          <button
            type="button"
            onClick={handleEnroll}
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <AcademicCapIcon className="h-5 w-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <img
                  src="/paypal-logo.png"
                  alt="PayPal"
                  className="h-6 mr-2"
                />
                Pay with PayPal
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
} 