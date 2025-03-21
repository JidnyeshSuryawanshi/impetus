import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userApi from '../api/userApi';
import { getCurrentUser } from '../utils/auth';
import { toast } from 'react-hot-toast';

export default function Appointment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);
  const [departments, setDepartments] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    doctor: '',
    date: '',
    time: '',
    reason: '',
  });

  useEffect(() => {
    // Get current user data and prefill the form
    const user = getCurrentUser();
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
    
    // Fetch doctors from API
    const fetchDoctors = async () => {
      try {
        setFetchingDoctors(true);
        
        // Use the new getDoctors method from userApi
        const doctorsData = await userApi.getDoctors();
        setDoctors(doctorsData);
        
        // Extract unique departments from doctors' specializations
        const uniqueDepartments = Array.from(
          new Set(doctorsData.map(doctor => doctor.specialization))
        ).sort();
        
        setDepartments(uniqueDepartments);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast.error('Failed to load doctors. Using fallback data.');
        // Fallback to hardcoded doctors if API fails
        const fallbackDoctors = [
          {
            firstName: "John",
            lastName: "Smith",
            specialization: "General Medicine",
            doctor_id: "DRJOH25693"
          },
          {
            firstName: "Sarah",
            lastName: "Johnson",
            specialization: "Cardiology",
            doctor_id: "DRSAR25732"
          },
          {
            firstName: "Michael",
            lastName: "Brown",
            specialization: "Orthopedics",
            doctor_id: "DRMIC25131"
          },
          {
            firstName: "Emily",
            lastName: "Davis",
            specialization: "Pediatrics",
            doctor_id: "DREMI25784"
          },
          {
            firstName: "Robert",
            lastName: "Wilson",
            specialization: "Dermatology",
            doctor_id: "DRROB25800"
          }
        ];
        
        setDoctors(fallbackDoctors);
        
        // Extract departments from fallback doctors
        const fallbackDepartments = Array.from(
          new Set(fallbackDoctors.map(doctor => doctor.specialization))
        ).sort();
        
        setDepartments(fallbackDepartments);
      } finally {
        setFetchingDoctors(false);
      }
    };
    
    fetchDoctors();
  }, []);

  // Filter doctors based on selected department
  const filteredDoctors = formData.department 
    ? doctors.filter(doctor => doctor.specialization === formData.department)
    : doctors;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Get user info
      const user = getCurrentUser();
      if (!user) {
        toast.error('You must be logged in to book an appointment');
        navigate('/login');
        return;
      }
      
      // Prepare appointment data
      const appointmentData = {
        doctor_id: formData.doctor, // Now using the real doctor_id from the database
        date: formData.date,
        time: formData.time,
        type: 'regular',
        notes: formData.reason
      };
      
      // Use userApi to book appointment
      await userApi.bookAppointment(appointmentData);
      
      // Show success toast
      toast.success('Appointment booked successfully!');
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to book appointment:', error);
      toast.error(error.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-base font-semibold leading-7 text-primary-600">Schedule Appointment</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Book Your Medical Visit
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Schedule an appointment with our healthcare professionals. Fill out the form below and we'll confirm your appointment shortly.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  Full Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                  Phone Number
                </label>
                <div className="mt-2">
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium leading-6 text-gray-900">
                  Department
                </label>
                <div className="mt-2">
                  <select
                    id="department"
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    disabled={fetchingDoctors}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 disabled:bg-gray-100"
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {fetchingDoctors && <p className="mt-1 text-xs text-gray-500">Loading departments...</p>}
                </div>
              </div>

              <div>
                <label htmlFor="doctor" className="block text-sm font-medium leading-6 text-gray-900">
                  Preferred Doctor
                </label>
                <div className="mt-2">
                  <select
                    id="doctor"
                    name="doctor"
                    required
                    value={formData.doctor}
                    onChange={handleChange}
                    disabled={fetchingDoctors || !formData.department}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 disabled:bg-gray-100"
                  >
                    <option value="">Select doctor</option>
                    {filteredDoctors.map((doctor) => (
                      <option key={doctor.doctor_id} value={doctor.doctor_id}>
                        Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                  {fetchingDoctors && <p className="mt-1 text-xs text-gray-500">Loading doctors...</p>}
                  {!fetchingDoctors && formData.department && filteredDoctors.length === 0 && (
                    <p className="mt-1 text-xs text-red-500">No doctors available in this department</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">
                  Preferred Date
                </label>
                <div className="mt-2">
                  <input
                    type="date"
                    name="date"
                    id="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium leading-6 text-gray-900">
                  Preferred Time
                </label>
                <div className="mt-2">
                  <input
                    type="time"
                    name="time"
                    id="time"
                    required
                    value={formData.time}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">
                Reason for Visit
              </label>
              <div className="mt-2">
                <textarea
                  id="reason"
                  name="reason"
                  rows={4}
                  required
                  value={formData.reason}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder="Please describe the reason for your visit..."
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || fetchingDoctors}
                className="block w-full rounded-md bg-primary-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Schedule Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 