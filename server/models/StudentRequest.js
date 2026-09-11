import mongoose from 'mongoose';

const StudentRequestSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  studentId: { type: String, required: true, index: true },
  studentName: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Leave / Absence Excuse', 'Doubt in Lecture', 'Assignment Help', 'CR Notes Request'], 
    required: true 
  },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  dateSubmitted: { type: String, default: () => new Date().toISOString().split('T')[0] },
  status: { type: String, enum: ['Pending', 'Approved', 'Resolved'], default: 'Pending', index: true },
  teacherOrCrResponse: { type: String, default: '' },
  resolvedDate: { type: String, default: null }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

StudentRequestSchema.virtual('date').get(function() {
  return this.dateSubmitted;
});
StudentRequestSchema.virtual('response').get(function() {
  return this.teacherOrCrResponse;
});
StudentRequestSchema.virtual('response').set(function(v) {
  this.teacherOrCrResponse = v;
});

export const StudentRequest = mongoose.models.StudentRequest || mongoose.model('StudentRequest', StudentRequestSchema);
