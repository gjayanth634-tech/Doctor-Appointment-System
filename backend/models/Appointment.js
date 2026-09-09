import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patientName: { type: String, required: true },
    doctorId: { type: String, required: true }, // matches id from doctorsData
    doctorName: { type: String, required: true },
    specialty: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // e.g. "10:00 AM"
    reason: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },
    // Jitsi room name used for the video consultation
    roomId: { type: String, default: null }
  },
  { timestamps: true }
);

export default mongoose.model('Appointment', appointmentSchema);
