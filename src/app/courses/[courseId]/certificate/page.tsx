"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Certificate from '@/components/course/Certificate';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface CertificateData {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  completionDate: string;
  instructorName: string;
  certificateId: string;
}

export default function CertificatePage() {
  const params = useParams();
  const router = useRouter();
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if course is completed
        const completionResponse = await fetch(
          `https://localhost:7099/api/Courses/${params.courseId}/completion`
        );
        
        if (!completionResponse.ok) {
          throw new Error('Course not completed yet');
        }

        // Fetch certificate data
        const certificateResponse = await fetch(
          `https://localhost:7099/api/Courses/${params.courseId}/certificate`
        );

        if (!certificateResponse.ok) {
          throw new Error('Failed to fetch certificate');
        }

        const data = await certificateResponse.json();
        setCertificate(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [params.courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <DocumentTextIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Certificate Not Available</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.push(`/courses/${params.courseId}/learn`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Return to Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return null;
  }

  return (
    <Certificate
      courseId={certificate.courseId}
      courseTitle={certificate.courseTitle}
      studentName={certificate.studentName}
      completionDate={certificate.completionDate}
      instructorName={certificate.instructorName}
      certificateId={certificate.certificateId}
    />
  );
} 