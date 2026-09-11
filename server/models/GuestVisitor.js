import mongoose from 'mongoose';

const GuestVisitorSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  guestName: { type: String, required: true },
  guestEmail: { type: String, required: true },
  ipAddress: { type: String, default: '127.0.0.1' },
  userAgent: { type: String, default: 'Web Browser' },
  deviceType: { type: String, enum: ['Desktop', 'Mobile', 'Tablet'], default: 'Desktop' },
  loginTime: { type: String, default: () => new Date().toISOString() },
  lastActiveTime: { type: String, default: () => new Date().toISOString() },
  pageViewsCount: { type: Number, default: 1 },
  attemptedMutationsCount: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Ended'], default: 'Active' }
}, {
  timestamps: true
});

export const GuestVisitor = mongoose.models.GuestVisitor || mongoose.model('GuestVisitor', GuestVisitorSchema);
