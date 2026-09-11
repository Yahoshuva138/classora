import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  topic: { type: String, required: true, trim: true },
  date: { type: String, required: true, index: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  faculty: { type: String, required: true, index: true },
  batch: { type: String, required: true, index: true },
  mode: { type: String, enum: ['Offline', 'Online', 'Hybrid'], default: 'Offline' },
  location: { type: String, required: true },
  status: { type: String, enum: ['Upcoming', 'In Progress', 'Completed', 'Cancelled'], default: 'Upcoming', index: true },
  notes: { type: String, default: '' },
  sessionType: { type: String, default: 'Communication Lab' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

SessionSchema.virtual('time').get(function() {
  return `${this.startTime} - ${this.endTime}`;
});

export const Session = mongoose.models.Session || mongoose.model('Session', SessionSchema);
