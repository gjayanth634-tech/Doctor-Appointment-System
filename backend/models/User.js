import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['patient', 'doctor', 'admin'],
      default: 'patient'
    },
    // For doctors, link to a mock doctor profile id from doctorsData
    doctorId: { type: String, default: null }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
