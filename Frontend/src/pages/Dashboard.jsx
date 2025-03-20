import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  CalendarIcon, 
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import userApi from '../api/userApi';
import { getCurrentUser, logout } from '../utils/auth';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch latest user data from API
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(''); // Clear any previous errors
        
        // First try to load from API
        try {
          const userData = await userApi.getProfile();
          console.log('User data from API:', userData);
          if (userData && Object.keys(userData).length > 0) {
            setUser(userData);
            // Update local storage with latest data
            localStorage.setItem('user', JSON.stringify(userData));
            return;
          }
        } catch (apiErr) {
          console.error('Error fetching from API:', apiErr);
        }
        
        // If API fails, fall back to stored user
        const storedUser = getCurrentUser();
        console.log('Falling back to stored user:', storedUser);
        if (storedUser) {
          setUser(storedUser);
        } else {
          throw new Error('No user data available');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile data. Please try logging in again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user?.firstName || 'User'}!
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'profile' 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <UserIcon className="mr-3 flex-shrink-0 h-5 w-5" />
                    <span>Profile</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'appointments' 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <CalendarIcon className="mr-3 flex-shrink-0 h-5 w-5" />
                    <span>Appointments</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('medicalHistory')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'medicalHistory' 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <ClipboardDocumentListIcon className="mr-3 flex-shrink-0 h-5 w-5" />
                    <span>Medical History</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('healthMetrics')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'healthMetrics' 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <ChartBarIcon className="mr-3 flex-shrink-0 h-5 w-5" />
                    <span>Health Metrics</span>
                  </button>
                </li>
                <li className="pt-4 mt-4 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
                  >
                    <ArrowRightOnRectangleIcon className="mr-3 flex-shrink-0 h-5 w-5" />
                    <span>Log out</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 bg-white rounded-lg shadow p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                {error && (
                  <div className="mb-4 p-4 rounded-md bg-red-50 border border-red-200">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                      <p className="mt-1 text-sm text-gray-900">{user?.firstName} {user?.lastName}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                      <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {user?.dob ? new Date(user.dob).toLocaleDateString() : 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                      <p className="mt-1 text-sm text-gray-900">{user?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Health Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Height</h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {user?.height ? `${user.height} cm` : 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Weight</h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {user?.weight ? `${user.weight} kg` : 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-medium text-gray-500">Medical History</h3>
                      <button 
                        className="text-xs font-medium text-primary-600 hover:text-primary-500"
                        onClick={() => setActiveTab('medicalHistory')}
                      >
                        View All
                      </button>
                    </div>
                    {user?.medicalHistory && user.medicalHistory.length > 0 ? (
                      <ul className="list-disc list-inside text-sm text-gray-900 space-y-1">
                        {user.medicalHistory.slice(0, 3).map((condition, index) => (
                          <li key={index}>{condition}</li>
                        ))}
                        {user.medicalHistory.length > 3 && (
                          <li className="text-gray-500">
                            And {user.medicalHistory.length - 3} more...
                          </li>
                        )}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No medical history recorded</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      onClick={() => navigate('/edit-profile')}
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Your Appointments</h2>
                  <button
                    className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    onClick={() => navigate('/appointment')}
                  >
                    Book New Appointment
                  </button>
                </div>
                
                <div className="text-center py-12">
                  <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You don't have any upcoming appointments.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      onClick={() => navigate('/appointment')}
                    >
                      Book an appointment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Medical History Tab */}
            {activeTab === 'medicalHistory' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Medical History</h2>
                
                {user?.medicalHistory && user.medicalHistory.length > 0 ? (
                  <div className="bg-white rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {user.medicalHistory.map((condition, index) => (
                        <li key={index} className="py-4">
                          <div className="flex items-start">
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{condition}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No medical history</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Your medical history will appear here when available.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Health Metrics Tab */}
            {activeTab === 'healthMetrics' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Health Metrics</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Body Measurements</h3>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Height</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {user?.height ? `${user.height} cm` : 'Not provided'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Weight</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {user?.weight ? `${user.weight} kg` : 'Not provided'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">BMI</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {user?.height && user?.weight 
                            ? (user.weight / ((user.height/100) * (user.height/100))).toFixed(1)
                            : 'Not available'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 