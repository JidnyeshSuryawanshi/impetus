import { useState } from 'react';

export default function Appointment() {
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

  const departments = [
    'General Medicine',
    'Cardiology',
    'Orthopedics',
    'Pediatrics',
    'Dermatology',
    'Neurology',
    'Ophthalmology',
    'Dental',
  ];

  const doctors = [
    'Dr. John Smith',
    'Dr. Sarah Johnson',
    'Dr. Michael Brown',
    'Dr. Emily Davis',
    'Dr. Robert Wilson',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle appointment scheduling logic here
    console.log('Appointment request:', formData);
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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
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
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  >
                    <option value="">Select doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor} value={doctor}>
                        {doctor}
                      </option>
                    ))}
                  </select>
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
                className="block w-full rounded-md bg-primary-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Schedule Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 