import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  UserCircleIcon, 
  UserIcon, 
  PhoneIcon, 
  CalendarIcon, 
  ScaleIcon, 
  HeartIcon, 
  PlusCircleIcon, 
  XCircleIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';
import userApi from '../api/userApi';
import { getCurrentUser } from '../utils/auth';

export default function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dob: '',
    height: '',
    weight: '',
    medicalHistory: [],
    newCondition: '', // For adding new medical conditions
  });

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Try to get data from API first
        const userData = await userApi.getProfile();
        
        // Format date for input
        let formattedDate = '';
        if (userData.dob) {
          const date = new Date(userData.dob);
          formattedDate = date.toISOString().split('T')[0];
        }
        
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          phone: userData.phone || '',
          dob: formattedDate,
          height: userData.height || '',
          weight: userData.weight || '',
          medicalHistory: userData.medicalHistory || [],
          newCondition: '',
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        
        // Fallback to stored user data
        const storedUser = getCurrentUser();
        if (storedUser) {
          // Format date for input
          let formattedDate = '';
          if (storedUser.dob) {
            const date = new Date(storedUser.dob);
            formattedDate = date.toISOString().split('T')[0];
          }
          
          setFormData({
            firstName: storedUser.firstName || '',
            lastName: storedUser.lastName || '',
            phone: storedUser.phone || '',
            dob: formattedDate,
            height: storedUser.height || '',
            weight: storedUser.weight || '',
            medicalHistory: storedUser.medicalHistory || [],
            newCondition: '',
          });
        } else {
          setError('Failed to load user data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCondition = () => {
    if (formData.newCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        medicalHistory: [...prev.medicalHistory, prev.newCondition.trim()],
        newCondition: ''
      }));
    }
  };

  const handleRemoveCondition = (index) => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      // Prepare data for API
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dob: formData.dob || undefined,
        height: formData.height ? Number(formData.height) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        medicalHistory: formData.medicalHistory,
      };
      
      // Update profile via API
      await userApi.updateProfile(userData);
      
      setSuccess('Profile updated successfully!');
      
      // After a short delay, navigate back to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'An error occurred while updating your profile'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-16 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              <ArrowLeftIcon className="mr-1 h-4 w-4" />
              Back to Dashboard
            </button>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Edit Profile</h1>
          </div>
          <div className="hidden sm:block">
            <UserCircleIcon className="h-20 w-20 text-blue-500 opacity-80" />
          </div>
        </div>

        <div className="bg-white shadow-md overflow-hidden rounded-xl border border-gray-100">
          {error && (
            <div className="p-4 bg-red-50 border-b border-red-100 flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="p-4 bg-green-50 border-b border-green-100 flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            <div className="border-b border-gray-100 pb-6">
              <div className="flex items-center mb-4">
                <UserIcon className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
              </div>
              <p className="mt-1 text-sm text-gray-500 mb-6">
                Update your personal details below.
              </p>
              
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="block w-full pr-10 focus:ring-blue-500 focus:border-blue-500 rounded-md border-gray-300 text-gray-900 placeholder-gray-400 sm:text-sm transition-colors"
                      placeholder="Your first name"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="block w-full pr-10 focus:ring-blue-500 focus:border-blue-500 rounded-md border-gray-300 text-gray-900 placeholder-gray-400 sm:text-sm transition-colors"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full pl-10 focus:ring-blue-500 focus:border-blue-500 rounded-md border-gray-300 text-gray-900 placeholder-gray-400 sm:text-sm transition-colors"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                    Date of birth
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="dob"
                      id="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="block w-full pl-10 focus:ring-blue-500 focus:border-blue-500 rounded-md border-gray-300 text-gray-900 placeholder-gray-400 sm:text-sm transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-100 pb-6">
              <div className="flex items-center mb-4">
                <HeartIcon className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-lg font-medium leading-6 text-gray-900">Health Information</h3>
              </div>
              <p className="mt-1 text-sm text-gray-500 mb-6">
                This information will help us provide better healthcare recommendations.
              </p>
              
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                    Height (cm)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      name="height"
                      id="height"
                      min="0"
                      max="300"
                      value={formData.height}
                      onChange={handleChange}
                      className="block w-full pr-10 focus:ring-blue-500 focus:border-blue-500 rounded-md border-gray-300 text-gray-900 placeholder-gray-400 sm:text-sm transition-colors"
                      placeholder="Your height in cm"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 sm:text-sm">cm</span>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                    Weight (kg)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ScaleIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="weight"
                      id="weight"
                      min="0"
                      max="500"
                      value={formData.weight}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-10 focus:ring-blue-500 focus:border-blue-500 rounded-md border-gray-300 text-gray-900 placeholder-gray-400 sm:text-sm transition-colors"
                      placeholder="Your weight in kg"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 sm:text-sm">kg</span>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700">
                    Medical History
                  </label>
                  <div className="mt-1">
                    <div className="flex items-center">
                      <div className="relative rounded-md shadow-sm flex-grow">
                        <input
                          type="text"
                          name="newCondition"
                          id="newCondition"
                          value={formData.newCondition}
                          onChange={handleChange}
                          placeholder="Add a medical condition"
                          className="block w-full focus:ring-blue-500 focus:border-blue-500 rounded-md border-gray-300 text-gray-900 placeholder-gray-400 sm:text-sm transition-colors"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCondition())}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddCondition}
                        className="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <PlusCircleIcon className="h-4 w-4 mr-1" />
                        Add
                      </button>
                    </div>
                    
                    {formData.medicalHistory.length > 0 ? (
                      <div className="mt-3 bg-gray-50 rounded-lg overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                          {formData.medicalHistory.map((condition, index) => (
                            <li key={index} className="py-3 px-4 flex justify-between items-center hover:bg-gray-100 transition-colors">
                              <div className="text-sm text-gray-900 flex items-center">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                {condition}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveCondition(index)}
                                className="ml-2 flex items-center text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                              >
                                <XCircleIcon className="h-4 w-4 mr-1" />
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
                        No medical conditions listed. Add your medical conditions to help us provide better care.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex justify-center items-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <>
                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 