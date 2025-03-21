import React from 'react';

const DoctorCard = ({ doctor, onSelect }) => {
  return (
    <div
      className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={onSelect}
    >
      <img
        src={doctor.image || 'https://i.pinimg.com/736x/21/fe/40/21fe40515f20276139fa2743372d33f5.jpg'}
        alt={doctor.firstName}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">{doctor.firstName}</h2>
        <p className="text-gray-600 text-sm">{doctor.specialization}</p>
        <p className="text-gray-500 text-sm mt-2">
          Experience: {doctor.experience} years
        </p>
        <p className="text-gray-500 text-sm">Contact: {doctor.phone}</p>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
          onClick={onSelect}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;