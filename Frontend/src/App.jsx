import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import DiseasePrediction from './pages/DiseasePrediction';
import HospitalMap from './pages/HospitalMap';
import Appointment from './pages/Appointment';
import MRIAnalysis from './pages/MRIAnalysis';
import Services from './pages/Services';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/disease-prediction" element={<DiseasePrediction />} />
            <Route path="/hospital-map" element={<HospitalMap />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/mri-analysis" element={<MRIAnalysis />} />
            <Route path="/services" element={<Services />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
