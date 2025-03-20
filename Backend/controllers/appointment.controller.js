const Appointment = require('../models/appointment.model');
const TimeSlot = require('../models/timeSlot.model');
const Doctor = require('../models/doctor.model');

const appointmentController = {
  // Check doctor's availability for a specific date
  checkAvailability: async (req, res) => {
    try {
      const { doctor_id, date } = req.query;

      // Find doctor 
      console.log(doctor_id,date)
      const doctor = await Doctor.findOne({ doctor_id:doctor_id });
      console.log(doctor)
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      // Get all slots for the date
      const slots = await TimeSlot.find({
        doctor_id,
        date: new Date(date),
        isAvailable: true
      }).sort({ startTime: 1 });

      res.json(slots);
    } catch (error) {
      res.status(500).json({ message: 'Error checking availability', error: error.message });
    }
  },

  // Book an appointment
  bookAppointment: async (req, res) => {
    try {
      const { doctor_id, date, time, type, notes } = req.body;
      const user_id = req.user._id;

      // Find doctor
      const doctor = await Doctor.findOne({ doctor_id });
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      // Check if slot is available
      const slot = await TimeSlot.findOne({
        doctor_id,
        date: new Date(date),
        startTime: time,
        isAvailable: true
      });

      if (!slot) {
        return res.status(400).json({ message: 'Time slot is not available' });
      }

      // Create appointment
      const appointment = new Appointment({
        doctor_id,
        user_id,
        date: new Date(date),
        time,
        type,
        notes,
        amount: doctor.consultationFee
      });

      await appointment.save();

      // Update slot availability
      slot.isAvailable = false;
      await slot.save();

      res.status(201).json({
        message: 'Appointment booked successfully',
        appointment: {
          appointment_id: appointment.appointment_id,
          doctor_id: appointment.doctor_id,
          date: appointment.date,
          time: appointment.time,
          type: appointment.type,
          status: appointment.status,
          amount: appointment.amount
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error booking appointment', error: error.message });
    }
  },

  // Cancel an appointment
  cancelAppointment: async (req, res) => {
    try {
      const { appointment_id } = req.params;
      const user_id = req.user._id;

      const appointment = await Appointment.findOne({
        appointment_id,
        user_id,
        status: 'scheduled'
      });

      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found or cannot be cancelled' });
      }

      // Update appointment status
      appointment.status = 'cancelled';
      await appointment.save();

      // Make slot available again
      await TimeSlot.findOneAndUpdate(
        {
          doctor_id: appointment.doctor_id,
          date: appointment.date,
          startTime: appointment.time
        },
        { isAvailable: true }
      );

      res.json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error cancelling appointment', error: error.message });
    }
  },

  // Get doctor's free slots for a specific date
  getDoctorFreeSlots: async (req, res) => {
    try {
      const { doctor_id } = req.params;
      const { date } = req.query;

      const slots = await TimeSlot.find({
        doctor_id,
        date: new Date(date),
        isAvailable: true
      }).sort({ startTime: 1 });

      res.json(slots);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching free slots', error: error.message });
    }
  }
};

module.exports = appointmentController; 