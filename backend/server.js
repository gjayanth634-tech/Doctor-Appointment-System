import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import videoCallRoutes from './routes/videoCallRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Middleware ----------
app.use(cors()); // allow requests from the React dev server (localhost:5173)
app.use(express.json()); // parse JSON request bodies

// ---------- API Routes ----------
app.get('/', (req, res) => res.json({ message: 'Telehealth API is running' }));
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/video-call', videoCallRoutes);

// ---------- Global error handler ----------
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

// ---------- Connect to MongoDB & start server ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
