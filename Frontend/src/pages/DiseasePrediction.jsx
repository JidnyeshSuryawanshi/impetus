import { useState } from 'react';

export default function DiseasePrediction() {
  const [formData, setFormData] = useState({
    symptoms: '',
    age: '',
    gender: '',
    medicalHistory: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle prediction logic here
    console.log('Prediction request:', formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Disease Prediction</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            AI-Powered Health Assessment
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Enter your symptoms and health information to get an AI-powered prediction of potential health conditions.
            Please note that this is for informational purposes only and should not replace professional medical advice.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="symptoms" className="block text-sm font-medium leading-6 text-gray-900">
                Symptoms
              </label>
              <div className="mt-2">
                <textarea
                  id="symptoms"
                  name="symptoms"
                  rows={4}
                  required
                  value={formData.symptoms}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder="Describe your symptoms in detail..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
              <div>
                <label htmlFor="age" className="block text-sm font-medium leading-6 text-gray-900">
                  Age
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="age"
                    id="age"
                    required
                    value={formData.age}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">
                  Gender
                </label>
                <div className="mt-2">
                  <select
                    id="gender"
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="medicalHistory" className="block text-sm font-medium leading-6 text-gray-900">
                Medical History
              </label>
              <div className="mt-2">
                <textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  rows={4}
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder="Any relevant medical history or conditions..."
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="block w-full rounded-md bg-primary-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Get Prediction
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 