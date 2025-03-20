const Doctor = require('../models/doctor.model');

// Function to generate unique doctor ID from email
const generateDoctorId = (email) => {
  // Take first 3 letters of email username
  const emailPrefix = email.split('@')[0].slice(0, 3).toUpperCase();
  // Get current year
  const year = new Date().getFullYear().toString().slice(-2);
  // Generate random 3 digits
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `DR${emailPrefix}${year}${randomNum}`;
};

// Register a new doctor
const registerDoctor = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      specialization,
      experience,
      qualification,
      license,
      hospital,
      address,
      phone,
      availability
    } = req.body;

    console.log(firstName,
      lastName,
      email,
      password,
      specialization,
      experience,
      qualification,
      license,
      hospital,
      address,
      phone,
      availability)
    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ 
      $or: [{ email }, { license }] 
    });
    
    if (existingDoctor) {
      return res.status(400).json({ 
        message: 'Doctor with this email or license already exists' 
      });
    }

    // Generate doctor_id
    const doctor_id = generateDoctorId(email);

    // Create new doctor
    const doctor = new Doctor({
      doctor_id,
      firstName,
      lastName,
      email,
      password,
      specialization,
      experience,
      qualification,
      license,
      hospital,
      address,
      phone,
      availability
    });

    await doctor.save();

    // Generate token
    const token = await doctor.generateAuthToken();

    res.status(201).json({
      message: 'Doctor registered successfully',
      doctor: {
        id: doctor._id,
        doctor_id: doctor.doctor_id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        specialization: doctor.specialization,
        experience: doctor.experience,
        qualification: doctor.qualification,
        license: doctor.license,
        hospital: doctor.hospital,
        address: doctor.address,
        phone: doctor.phone,
        availability: doctor.availability
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering doctor', error: error.message });
  }
};

// Login doctor
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find doctor by email
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await doctor.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = await doctor.generateAuthToken();

    res.json({
      message: 'Login successful',
      doctor: {
        id: doctor._id,
        doctor_id: doctor.doctor_id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        specialization: doctor.specialization,
        experience: doctor.experience,
        qualification: doctor.qualification,
        license: doctor.license,
        hospital: doctor.hospital,
        address: doctor.address,
        phone: doctor.phone,
        availability: doctor.availability
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Logout doctor
const logoutDoctor = async (req, res) => {
  try {
    req.doctor.tokens = req.doctor.tokens.filter(token => token.token !== req.token);
    await req.doctor.save();
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging out', error: error.message });
  }
};

// Get doctor profile
const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id).select('-password -tokens');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({
      ...doctor.toObject(),
      doctor_id: doctor.doctor_id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor profile', error: error.message });
  }
};

// Update doctor profile
const updateDoctorProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'firstName',
    'lastName',
    'password',
    'specialization',
    'experience',
    'qualification',
    'hospital',
    'address',
    'phone',
    'availability'
  ];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  // Check if email or license is being updated
  if (req.body.email || req.body.license) {
    return res.status(400).json({ 
      message: 'Email and license cannot be updated' 
    });
  }

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    updates.forEach(update => req.doctor[update] = req.body[update]);
    await req.doctor.save();

    res.json({
      message: 'Profile updated successfully',
      doctor: {
        id: req.doctor._id,
        doctor_id: req.doctor.doctor_id,
        firstName: req.doctor.firstName,
        lastName: req.doctor.lastName,
        email: req.doctor.email,
        specialization: req.doctor.specialization,
        experience: req.doctor.experience,
        qualification: req.doctor.qualification,
        license: req.doctor.license,
        hospital: req.doctor.hospital,
        address: req.doctor.address,
        phone: req.doctor.phone,
        availability: req.doctor.availability
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

module.exports = {
  registerDoctor,
  loginDoctor,
  logoutDoctor,
  getDoctorProfile,
  updateDoctorProfile
}; 