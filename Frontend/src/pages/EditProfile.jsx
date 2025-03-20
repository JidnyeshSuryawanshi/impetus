import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            <ArrowLeftIcon className="mr-1 h-4 w-4" />
            Back to Dashboard
          </button>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Edit Profile</h1>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-400">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="p-4 bg-green-50 border-l-4 border-green-400">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                Update your personal details below.
              </p>
              
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone number
                  </label>
                  <div className="mt-1">
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                    Date of birth
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="dob"
                      id="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Health Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                This information will help us provide better healthcare recommendations.
              </p>
              
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                    Height (cm)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="height"
                      id="height"
                      min="0"
                      max="300"
                      value={formData.height}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                    Weight (kg)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="weight"
                      id="weight"
                      min="0"
                      max="500"
                      value={formData.weight}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700">
                    Medical History
                  </label>
                  <div className="mt-1">
                    <div className="flex items-center">
                      <input
                        type="text"
                        name="newCondition"
                        id="newCondition"
                        value={formData.newCondition}
                        onChange={handleChange}
                        placeholder="Add a medical condition"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                      <button
                        type="button"
                        onClick={handleAddCondition}
                        className="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Add
                      </button>
                    </div>
                    
                    {formData.medicalHistory.length > 0 ? (
                      <ul className="mt-3 divide-y divide-gray-200 border-t border-gray-200">
                        {formData.medicalHistory.map((condition, index) => (
                          <li key={index} className="py-3 flex justify-between items-center">
                            <div className="text-sm text-gray-900">{condition}</div>
                            <button
                              type="button"
                              onClick={() => handleRemoveCondition(index)}
                              className="ml-2 text-sm font-medium text-red-600 hover:text-red-500"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-gray-500">No medical conditions listed.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 