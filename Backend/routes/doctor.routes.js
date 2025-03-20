const express = require('express');
const router = express.Router();
const { 
  registerDoctor, 
  loginDoctor,
  getDoctorProfile, 
  updateDoctorProfile 
} = require('../controllers/doctor.controller');
const doctorAuth = require('../middleware/doctorAuth');

// Public routes
router.post('/register', registerDoctor);
router.post('/login', loginDoctor);

// Protected routes (require authentication)
router.get('/profile', doctorAuth, getDoctorProfile);
router.patch('/profile', doctorAuth, updateDoctorProfile);

module.exports = router; 