import mongoose from 'mongoose';

const StudentSkillScoresSchema = new mongoose.Schema({
  communication: { type: Number, default: 75, min: 0, max: 100 },
  grammar:       { type: Number, default: 75, min: 0, max: 100 },
  vocabulary:    { type: Number, default: 75, min: 0, max: 100 },
  pronunciation: { type: Number, default: 75, min: 0, max: 100 },
  participation: { type: Number, default: 75, min: 0, max: 100 },
  assignments:   { type: Number, default: 75, min: 0, max: 100 },
  assessments:   { type: Number, default: 75, min: 0, max: 100 }
}, { _id: false });

const AssignmentSchema = new mongoose.Schema({
  id:       { type: String, required: true },
  title:    { type: String, required: true },
  dueDate:  { type: String, required: true },
  status:   { type: String, enum: ['Submitted', 'Graded', 'Pending', 'Late'], default: 'Pending' },
  score:    { type: Number, default: null },
  maxScore: { type: Number, default: 100 }
}, { _id: false });

const CRRemarkSchema = new mongoose.Schema({
  id:     { type: String, required: true },
  date:   { type: String, required: true },
  author: { type: String, required: true },
  text:   { type: String, required: true }
}, { _id: false });

const HistoricalScoreSchema = new mongoose.Schema({
  date:          { type: String, required: true },
  overallScore:  { type: Number, required: true },
  communication: { type: Number, required: true },
  grammar:       { type: Number, required: true },
  vocabulary:    { type: Number, required: true }
}, { _id: false });
const StudentSchema = new mongoose.Schema({
  id: { type: String, index: true },
  rollNo: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, index: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  batch: { type: String, required: true, index: true },
  group: { type: String, default: 'Group 1', index: true },
  joiningDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  currentLevel: { type: String, default: 'Intermediate (B1)' },
  initialRemarks: { type: String, default: '' },
  avatar: { type: String, default: '' },
  lastActivity: { type: String, default: 'Just now' },
  skills: { type: StudentSkillScoresSchema, default: () => ({}) },
  previousOverallScore: { type: Number, default: 75 },
  assignments: [AssignmentSchema],
  crRemarks: [CRRemarkSchema],
  historicalScores: [HistoricalScoreSchema],
  status: {
    type: String,
    enum: ['On Track', 'Needs Attention', 'At Risk', 'Active', 'Archived'],
    default: 'On Track'
  },
  isArchived: { type: Boolean, default: false, index: true }
}, {
  timestamps: true,
  id: false,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret.rollNo || ret.id || ret._id?.toString();
      ret.rollNo = ret.rollNo || ret.id;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret.rollNo || ret.id || ret._id?.toString();
      ret.rollNo = ret.rollNo || ret.id;
      return ret;
    }
  }
});

StudentSchema.virtual('canonicalId').get(function() {
  return this.rollNo || this.id;
});

export const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);
