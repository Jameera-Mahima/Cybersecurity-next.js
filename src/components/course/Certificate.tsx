"use client";
import { useState, useEffect } from 'react';
import { DocumentTextIcon, DownloadIcon } from '@heroicons/react/24/outline';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface CertificateProps {
  courseId: string;
  courseTitle: string;
  studentName: string;
  completionDate: string;
  instructorName: string;
  certificateId: string;
}

export default function Certificate({
  courseId,
  courseTitle,
  studentName,
  completionDate,
  instructorName,
  certificateId,
}: CertificateProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Get the certificate element
      const certificateElement = document.getElementById('certificate');
      if (!certificateElement) throw new Error('Certificate element not found');

      // Create canvas from the certificate
      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // Add the canvas to the PDF
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = (pdfHeight - imgHeight * ratio) / 2;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Save the PDF
      pdf.save(`Certificate-${courseTitle.replace(/\s+/g, '-')}-${certificateId}.pdf`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Course Completion Certificate</h2>
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <DownloadIcon className="h-5 w-5" />
              <span>{isGenerating ? 'Generating...' : 'Download Certificate'}</span>
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div
            id="certificate"
            className="bg-white border-2 border-gray-800 p-8 text-center"
            style={{
              backgroundImage: 'url("/certificate-bg.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '500px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Certificate of Completion</h1>
              <p className="text-xl text-gray-600">This is to certify that</p>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">{studentName}</h2>
              <p className="text-xl text-gray-600">has successfully completed the course</p>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">{courseTitle}</h3>
              <p className="text-lg text-gray-600">on {new Date(completionDate).toLocaleDateString()}</p>
            </div>

            <div className="mt-8">
              <div className="border-t-2 border-gray-800 pt-4">
                <p className="text-lg font-semibold">{instructorName}</p>
                <p className="text-gray-600">Course Instructor</p>
              </div>
            </div>

            <div className="mt-8 text-sm text-gray-500">
              <p>Certificate ID: {certificateId}</p>
              <p>Issued on: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 