import React, { useState } from 'react';

export default function DiseasePrediction() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Sample response - in a real app, this would come from your backend
      setResult({
        potentialConditions: [
          { name: 'Common Cold', probability: 78 },
          { name: 'Seasonal Allergies', probability: 65 },
          { name: 'Sinusitis', probability: 42 }
        ],
        recommendedAction: 'Rest and stay hydrated. If symptoms persist for more than 3 days, consult a doctor.'
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen mt-16">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Disease Prediction</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Describe your symptoms in detail and our AI will analyze potential conditions.
          </p>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {!result ? (
            <div className="p-8">
              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <label htmlFor="symptoms" className="block text-lg font-medium text-gray-700 mb-2">
                    What symptoms are you experiencing?
                  </label>
                  <textarea
                    id="symptoms"
                    rows={6}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="Example: I've had a headache for 2 days, along with a runny nose and sore throat. My temperature is slightly elevated..."
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Please be as detailed as possible for the most accurate prediction.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !symptoms.trim()}
                  className={`w-full py-4 px-6 rounded-xl text-white font-medium text-lg flex items-center justify-center
                    ${loading || !symptoms.trim() ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    'Get Prediction'
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Potential Conditions</h2>
                <div className="space-y-4">
                  {result.potentialConditions.map((condition, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{condition.name}</span>
                      <div className="flex items-center">
                        <div className="w-36 bg-gray-200 rounded-full h-2.5 mr-2">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${condition.probability}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{condition.probability}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Recommended Action</h2>
                <p className="p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-100">
                  {result.recommendedAction}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500 mb-4">
                  This prediction is based on the symptoms you provided and is not a substitute for professional medical advice.
                </p>
                <button
                  onClick={() => {
                    setResult(null);
                    setSymptoms('');
                  }}
                  className="w-full py-3 px-4 border border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50"
                >
                  Start New Prediction
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            This tool is for informational purposes only and should not replace professional medical advice.
            Always consult with a healthcare provider for medical concerns.
          </p>
        </div>
      </div>
    </div>
  );
}