import express from 'express';
import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';
import { doctorsData } from '../data/doctorsData.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/appointments  -> book an appointment
router.post('/', protect, async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;

    const doctor = doctorsData.find((d) => d.id === doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    if (!date || !time) {
      return res.status(400).json({ message: 'Date and time are required' });
    }

    const roomId = `telehealth-${doctorId}-${Date.now()}`;

    const appointment = await Appointment.create({
      patientId: req.user.id,
      patientName: req.user.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialization,
      date,
      time,
      reason: reason || '',
      roomId
    });

    res.status(201).json({ message: 'Appointment booked', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/appointments
//  - patients see only their own appointments
//  - doctors see appointments booked for their doctorId
//  - admins see everything
router.get('/', protect, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'patient') {
      filter.patientId = req.user.id;
    } else if (req.user.role === 'doctor') {
      // A real doctor account would carry doctorId; fall back to query param.
      const doctorId = req.query.doctorId;
      if (doctorId) filter.doctorId = doctorId;
    }
    const appointments = await Appointment.find(filter).sort({ createdAt: -1 });
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PATCH /api/appointments/:id/status -> update status (doctor/admin)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    if (req.user.role === 'patient') {
      return res.status(403).json({ message: 'Patients cannot change status' });
    }
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Status updated', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/appointments/:id -> cancel/remove (patient or admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (req.user.role === 'patient' && String(appointment.patientId) !== req.user.id) {
      return res.status(403).json({ message: 'Not your appointment' });
    }
    if (req.user.role === 'doctor') {
      return res.status(403).json({ message: 'Doctors cannot delete appointments' });
    }

    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
