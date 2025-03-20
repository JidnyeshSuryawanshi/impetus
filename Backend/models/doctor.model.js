const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  specialization: {
    type: String,
    required: true,
    trim: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
    trim: true,
  },
  license: {
    type: String,
    required: true,
    unique: true,
  },
  hospital: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
  },
  phone: {
    type: String,
    required: true,
  },
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String,
    endTime: String,
  }]
}, {
  timestamps: true,
});

// Hash the password before saving
doctorSchema.pre('save', async function (next) {
  const doctor = this;
  if (doctor.isModified('password')) {
    doctor.password = await bcrypt.hash(doctor.password, 8);
  }
  next();
});

// Generate authentication token
doctorSchema.methods.generateAuthToken = async function () {
  const doctor = this;
  return jwt.sign({ _id: doctor._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Compare password method
doctorSchema.methods.comparePassword = async function (password) {
  const doctor = this;
  return bcrypt.compare(password, doctor.password);
};

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor; 