import axios from 'axios';

// Doctor API service
const doctorApi = {
  // Register a new doctor
  register: async (doctorData) => {
    const response = await axios.post('/api/doctors/register', doctorData);
    return response.data;
  },
  
  // Login doctor
  login: async (credentials) => {
    const response = await axios.post('/api/doctors/login', credentials);
    return response.data;
  },
  
  // Get doctor profile
  getProfile: async () => {
    const response = await axios.get('/api/doctors/profile');
    return response.data;
  },
  
  // Update doctor profile
  updateProfile: async (doctorData) => {
    const response = await axios.patch('/api/doctors/profile', doctorData);
    return response.data;
  },
  
  // Get doctor's appointments
  getAppointments: async () => {
    const response = await axios.get('/api/doctors/appointments');
    return response.data;
  },
  
  // Update appointment status
  updateAppointmentStatus: async (appointmentId, status) => {
    const response = await axios.patch(`/api/doctors/appointments/${appointmentId}`, { status });
    return response.data;
  },
  
  // Update availability
  updateAvailability: async (availabilityData) => {
    const response = await axios.patch('/api/doctors/availability', availabilityData);
    return response.data;
  },
};

export default doctorApi; 