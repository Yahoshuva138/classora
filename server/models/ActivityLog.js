import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  timestamp: { type: String, default: () => new Date().toISOString() },
  actorName: { type: String, required: true },
  actorRole: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['attendance', 'academic', 'system', 'communication'], 
    default: 'academic' 
  },
  targetId: { type: String, default: null },
  targetName: { type: String, default: null }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const ActivityLog = mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);
