import { useState } from 'react';
import { BeakerIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

export default function MRIAnalysis() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setAnalysis(null);
    setError(null);

    // Create preview URL
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(droppedFile);
    } else {
      setError('Please upload an image file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image file');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze MRI');
      }

      setAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Brain Tumor Detection
          </h1>
          <p className="text-lg text-gray-600">
            Upload your MRI scan for instant AI-powered analysis
          </p>
        </div>

        {!analysis ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-indigo-500'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="mx-auto h-64 w-64 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600">
                        Drag and drop your MRI image or{' '}
                        <label
                          htmlFor="file-upload"
                          className="text-indigo-600 hover:text-indigo-500 cursor-pointer"
                        >
                          click to browse
                        </label>
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        PNG, JPG, JPEG up to 16MB
                      </p>
                    </div>
                  )}
                  {file && (
                    <p className="text-sm text-gray-600">
                      Selected file: {file.name}
                    </p>
                  )}
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !file}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white ${
                  loading || !file
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BeakerIcon className="h-5 w-5 mr-2" />
                    Analyze Image
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Analysis Results
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BeakerIcon className="h-5 w-5 mr-2 text-indigo-600" />
                    Uploaded MRI Image
                  </h3>
                  <img
                    src={preview}
                    alt="MRI scan"
                    className="w-full h-64 object-contain rounded-lg bg-gray-50"
                  />
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                      <BeakerIcon className="h-5 w-5 mr-2 text-indigo-600" />
                      Prediction
                    </h3>
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <p className="text-xl font-medium text-indigo-700">
                        {analysis.prediction}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                      <BeakerIcon className="h-5 w-5 mr-2 text-indigo-600" />
                      Confidence Scores
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(analysis.confidence_scores).map(
                        ([class_name, score]) => (
                          <div key={class_name}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-gray-700">
                                {class_name}
                              </span>
                              <span className="text-gray-500">
                                {score.toFixed(2)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    setAnalysis(null);
                    setError(null);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                  Analyze Another Image
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 