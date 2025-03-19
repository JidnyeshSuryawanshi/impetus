import { useState } from 'react';
import { BeakerIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

export default function MRIAnalysis() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setAnalysis({
        prediction: data.prediction,
        confidenceScores: data.confidence_scores,
        imageUrl: data.image_url
      });
    } catch (err) {
      setError('Failed to analyze the MRI scan. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MRI Scan Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your MRI scan for instant AI-powered analysis. Our advanced algorithms will help identify potential abnormalities and provide detailed insights.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-md">
                  <label
                    htmlFor="mri-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ArrowUpTrayIcon className="w-10 h-10 mb-3 text-gray-500" />
                      <p className="mb-2 text-base font-medium text-gray-700">
                        <span className="text-primary-600">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-sm text-gray-500 mb-2">Your MRI scan image</p>
                      <p className="text-xs text-gray-400">PNG, JPG or JPEG (MAX. 16MB)</p>
                    </div>
                    <input
                      id="mri-file"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      required
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                {file && (
                  <div className="mt-4 flex items-center justify-center space-x-2">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm font-medium text-gray-700">
                      Selected file: {file.name}
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!file || loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                  !file || loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </div>
                ) : (
                  'Analyze Scan'
                )}
              </button>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          {analysis && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                {/* Image Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BeakerIcon className="h-6 w-6 text-primary-600 mr-2" />
                    MRI Scan
                  </h3>
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={analysis.imageUrl}
                      alt="MRI scan"
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>

                {/* Analysis Results */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <BeakerIcon className="h-6 w-6 text-primary-600 mr-2" />
                      Analysis Result
                    </h3>
                    <div className="bg-primary-50 rounded-lg p-4">
                      <p className="text-lg font-medium text-primary-700">
                        {analysis.prediction}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Confidence Scores
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(analysis.confidenceScores).map(([className, score]) => (
                        <div key={className}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{className}</span>
                            <span className="text-gray-500">{score.toFixed(2)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-gray-50 border-t border-gray-100 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">
                      This is an AI-powered analysis and should be reviewed by a medical professional. The results are for informational purposes only and should not be used as a substitute for professional medical advice.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 