import React from 'react';
import { Link } from 'react-router-dom';
import {
  BeakerIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  UserGroupIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';

const services = [
  {
    name: 'Disease Prediction',
    description: 'Advanced AI-powered disease prediction system that analyzes symptoms and medical history to provide accurate diagnoses.',
    icon: BeakerIcon,
    link: '/disease-prediction',
    color: 'bg-blue-500',
  },
  {
    name: 'Hospital Locator',
    description: 'Find nearby hospitals and healthcare facilities with detailed information about services, ratings, and availability.',
    icon: MapPinIcon,
    link: '/hospital-map',
    color: 'bg-green-500',
  },
  {
    name: 'MRI Analysis',
    description: 'AI-powered MRI scan analysis system that helps in detecting abnormalities and providing detailed reports.',
    icon: BeakerIcon,
    link: '/mri-analysis',
    color: 'bg-purple-500',
  },
  {
    name: 'Medical Chatbot',
    description: '24/7 AI-powered medical chatbot that provides instant answers to your health-related queries.',
    icon: ChatBubbleLeftRightIcon,
    link: '/chatbot',
    color: 'bg-yellow-500',
  },
  {
    name: 'Appointment Booking',
    description: 'Easy and convenient appointment booking system with real-time availability and instant confirmation.',
    icon: CalendarIcon,
    link: '/appointment',
    color: 'bg-red-500',
  },
];

export default function Services() {
  return (
    <div className="bg-gradient-to-b from-white to-blue-50">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Our Healthcare Services
          </h2>
          <p className="mt-6 text-xl leading-8 text-gray-600">
            Discover our comprehensive range of healthcare services designed to provide you with the best medical care and support.
          </p>
        </div>

        <div className="mx-auto mt-20 grid max-w-lg gap-12 lg:max-w-none lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.name}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-xl"
            >
              <div className={`${service.color} h-2 w-full absolute top-0`}></div>

              <div className="p-8">
                <div className={`${service.color} rounded-2xl p-4 w-16 h-16 flex items-center justify-center mb-6`}>
                  <service.icon className="h-8 w-8 text-white" aria-hidden="true" />
                </div>

                <h3 className="text-2xl font-bold leading-7 text-gray-900 mb-4">{service.name}</h3>
                <p className="text-lg leading-7 text-gray-600">{service.description}</p>

                <div className="mt-8 flex items-center">
                  <Link
                    to={service.link}
                    className={`inline-flex items-center px-4 py-2 rounded-full text-white font-medium ${service.color}`}
                  >
                    Learn more
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}