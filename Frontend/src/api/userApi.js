import axios from 'axios';

// User API service
const userApi = {
  // Register a new user
  register: async (userData) => {
    const response = await axios.post('/api/users/register', userData);
    return response.data;
  },
  
  // Login user
  login: async (credentials) => {
    const response = await axios.post('/api/users/login', credentials);
    return response.data;
  },
  
  // Get user profile
  getProfile: async () => {
    const response = await axios.get('/api/users/profile');
    return response.data;
  },
  
  // Update user profile
  updateProfile: async (userData) => {
    const response = await axios.patch('/api/users/profile', userData);
    return response.data;
  },
  
  // Book appointment
  bookAppointment: async (appointmentData) => {
    const response = await axios.post('/api/users/appointments', appointmentData);
    return response.data;
  },
  
  // Get user appointments
  getAppointments: async () => {
    const response = await axios.get('/api/users/appointments');
    return response.data;
  },
  
  // Cancel appointment
  cancelAppointment: async (appointmentId) => {
    const response = await axios.delete(`/api/users/appointments/${appointmentId}`);
    return response.data;
  },
};

export default userApi; 