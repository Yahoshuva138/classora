import mongoose from 'mongoose';

const CRTaskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  task: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    enum: ['Attendance', 'Session', 'Student Support', 'Communication', 'Faculty Coordination', 'Reporting', 'General'], 
    default: 'General' 
  },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  dueDate: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending', index: true },
  assignedTo: { type: String, default: 'Aarav (Lead CR)' },
  notes: { type: String, default: '' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

CRTaskSchema.virtual('deadline').get(function() {
  return this.dueDate;
});
CRTaskSchema.virtual('deadline').set(function(v) {
  this.dueDate = v;
});

export const CRTask = mongoose.models.CRTask || mongoose.model('CRTask', CRTaskSchema);
