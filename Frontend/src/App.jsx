import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorLogin from './pages/DoctorLogin';
import DiseasePrediction from './pages/DiseasePrediction';
import HospitalMap from './pages/HospitalMap';
import Appointment from './pages/Appointment';
import MRIAnalysis from './pages/MRIAnalysis';
import Services from './pages/Services';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import { isAuthenticated, setupAxiosInterceptors } from './utils/auth';

// Protected route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  // Set up axios defaults and interceptors
  useEffect(() => {
    // Set base URL for API requests
    axios.defaults.baseURL = 'http://localhost:3000';
    
    // Set up interceptors for authentication
    setupAxiosInterceptors(axios);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/doctor-login" element={<DoctorLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/services" element={<Services />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/edit-profile" element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } />
            <Route path="/disease-prediction" element={
              <ProtectedRoute>
                <DiseasePrediction />
              </ProtectedRoute>
            } />
            <Route path="/hospital-map" element={
              <ProtectedRoute>
                <HospitalMap />
              </ProtectedRoute>
            } />
            <Route path="/appointment" element={
              <ProtectedRoute>
                <Appointment />
              </ProtectedRoute>
            } />
            <Route path="/mri-analysis" element={
              <ProtectedRoute>
                <MRIAnalysis />
              </ProtectedRoute>
            } />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
