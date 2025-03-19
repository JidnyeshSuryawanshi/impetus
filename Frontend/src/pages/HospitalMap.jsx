import { useState } from 'react';

export default function HospitalMap() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Hospital Locator</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Find Hospitals Near You
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Search for hospitals in your area and get detailed information about their services and facilities.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20">
          <form onSubmit={handleSearch} className="flex gap-x-4">
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">
                Search hospitals
              </label>
              <input
                type="text"
                name="search"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                placeholder="Enter your location or hospital name..."
              />
            </div>
            <button
              type="submit"
              className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Search
            </button>
          </form>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col">
            <div className="aspect-[4/3] w-full rounded-2xl bg-gray-100">
              {/* Map component will be integrated here */}
              <div className="flex h-full items-center justify-center text-gray-500">
                Map will be displayed here
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="text-lg font-semibold leading-8 text-gray-900">Nearby Hospitals</h3>
            <div className="mt-8 space-y-6">
              {/* Sample hospital cards - will be populated dynamically */}
              <div className="rounded-lg border border-gray-200 p-6">
                <h4 className="text-base font-semibold text-gray-900">City General Hospital</h4>
                <p className="mt-2 text-sm text-gray-600">123 Healthcare Ave, Medical District</p>
                <div className="mt-4 flex items-center gap-x-4">
                  <span className="text-sm text-gray-500">Emergency: 24/7</span>
                  <span className="text-sm text-gray-500">Distance: 2.5 km</span>
                </div>
                <button
                  type="button"
                  className="mt-4 text-sm font-semibold text-primary-600 hover:text-primary-500"
                  onClick={() => setSelectedHospital('City General Hospital')}
                >
                  View Details
                </button>
              </div>

              <div className="rounded-lg border border-gray-200 p-6">
                <h4 className="text-base font-semibold text-gray-900">Medical Center</h4>
                <p className="mt-2 text-sm text-gray-600">456 Health Street, Downtown</p>
                <div className="mt-4 flex items-center gap-x-4">
                  <span className="text-sm text-gray-500">Emergency: 24/7</span>
                  <span className="text-sm text-gray-500">Distance: 3.8 km</span>
                </div>
                <button
                  type="button"
                  className="mt-4 text-sm font-semibold text-primary-600 hover:text-primary-500"
                  onClick={() => setSelectedHospital('Medical Center')}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 