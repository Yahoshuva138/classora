import mongoose from 'mongoose';

const AppSettingsSchema = new mongoose.Schema({
  singletonKey: { type: String, default: 'GLOBAL_SETTINGS', unique: true },
  onTrackThreshold: { type: Number, default: 85 },
  needsAttentionThreshold: { type: Number, default: 70 },
  atRiskThreshold: { type: Number, default: 70 },
  condonationThreshold: { type: Number, default: 75 },
  lateAttendanceWeight: { type: Number, default: 0.5 },
  scoringScale: { type: String, enum: ['100', '10'], default: '100' },
  batches: [{ type: String }],
  facultyList: [{ type: String }],
  sessionTypes: [{ type: String }],
  notifications: {
    lowAttendanceAlerts: { type: Boolean, default: true },
    followUpReminders: { type: Boolean, default: true },
    sessionReminders: { type: Boolean, default: true },
    taskReminders: { type: Boolean, default: true }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

AppSettingsSchema.virtual('attendanceGoal').get(function() {
  return this.onTrackThreshold;
});

export const AppSettings = mongoose.models.AppSettings || mongoose.model('AppSettings', AppSettingsSchema);
