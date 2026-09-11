import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  role: { type: String, enum: ['CR', 'Teacher', 'Student'], required: true },
  password: { type: String, default: '' },
  avatar: { type: String, default: '' },
  studentId: { type: String, default: null },
  isGoogleAuthenticated: { type: Boolean, default: true },
  personaKey: { type: String, default: '' },
  isRegistered: { type: Boolean, default: false },
  registeredAt: { type: String, default: null },
  mustChangePassword: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
