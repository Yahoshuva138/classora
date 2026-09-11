import mongoose from 'mongoose';

const AttendanceRecordSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  studentId: { type: String, required: true, index: true },
  status: { type: String, enum: ['Present', 'Absent', 'Late', 'Excused'], required: true },
  timestamp: { type: String, default: () => new Date().toISOString() },
  remarks: { type: String, default: '' }
}, {
  timestamps: true
});

AttendanceRecordSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });

export const AttendanceRecord = mongoose.models.AttendanceRecord || mongoose.model('AttendanceRecord', AttendanceRecordSchema);
