import express from 'express';
import { doctorsData } from '../data/doctorsData.js';

const router = express.Router();

// GET /api/doctors  -> returns the ready-made mock doctor list
router.get('/', (req, res) => {
  res.json({ doctors: doctorsData, count: doctorsData.length });
});

// GET /api/doctors/:id -> single doctor (used by dashboards)
router.get('/:id', (req, res) => {
  const doctor = doctorsData.find((d) => d.id === req.params.id);
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  res.json({ doctor });
});

// POST /api/doctors -> admin adds a new doctor (kept in memory for the session)
router.post('/', (req, res) => {
  try {
    const { name, specialization, hospitalName, experience, fee, rating, image, availableSlots } = req.body;
    if (!name || !specialization) {
      return res.status(400).json({ message: 'Name and specialization are required' });
    }
    const newDoctor = {
      id: `doc-${Date.now()}`,
      name,
      specialization,
      hospitalName: hospitalName || 'General Hospital',
      experience: experience || 1,
      fee: fee || 500,
      rating: rating || 4.0,
      image: image || 'https://i.pravatar.cc/150?img=60',
      availableSlots: availableSlots && availableSlots.length ? availableSlots : ['09:00 AM', '11:00 AM']
    };
    doctorsData.push(newDoctor);
    res.status(201).json({ message: 'Doctor added', doctor: newDoctor });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
