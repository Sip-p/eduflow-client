import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const OpenAssignmentpdf = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { assignmentUrl, assignmentTitle, assignmentDescription } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Clean the URL - remove any query parameters that might cause issues
  const getPdfUrl = (url) => {
    if (!url) return null;
    
    // Remove query parameters for embedding (they can cause issues)
    // But keep them for download links
    const cleanUrl = url.split('?')[0];
    return cleanUrl;
  };

  const pdfUrl = getPdfUrl(assignmentUrl);
  const downloadUrl = assignmentUrl; // Use original URL with parameters for download

  if (!assignmentUrl) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 text-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            No Assignment Found
          </h2>
          <p className="text-gray-500 mb-6">
            It seems you accessed this page without a valid assignment link.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg"
          >
            ← Go Back
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-6xl h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b bg-gradient-to-r from-blue-50 to-white gap-3">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800">
              {assignmentTitle || "Assignment PDF Viewer"}
            </h2>
            {assignmentDescription && (
              <p className="text-sm text-gray-600 mt-1">{assignmentDescription}</p>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <a
              href={downloadUrl}
              download
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all hover:shadow-md text-sm font-medium"
            >
              📥 Download
            </a>

            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all hover:shadow-md text-sm font-medium"
            >
              🔗 Open in Tab
            </a>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:shadow-md text-sm font-medium"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="relative h-[calc(100%-73px)]">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading PDF...</p>
              </div>
            </div>
          )}
          
          {/* Use Google Docs Viewer for better compatibility */}
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(downloadUrl)}&embedded=true`}
            className="w-full h-full"
            title="Assignment PDF"
            onLoad={() => {
              console.log("PDF loaded successfully");
              setLoading(false);
            }}
            onError={(e) => {
              console.error("Failed to load PDF:", e);
              setError(true);
              setLoading(false);
            }}
          />

          {error && !loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
                <div className="text-6xl mb-4">⚠️</div>
                <p className="text-red-600 mb-4 font-semibold">
                  Unable to display PDF in browser
                </p>
                <p className="text-gray-600 mb-6 text-sm">
                  Your browser might not support embedded PDFs. Please download the file or open in a new tab.
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <a
                    href={downloadUrl}
                    download
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all inline-block hover:shadow-lg"
                  >
                    📥 Download PDF
                  </a>
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all inline-block hover:shadow-lg"
                  >
                    🔗 Open in New Tab
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OpenAssignmentpdf;