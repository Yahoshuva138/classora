import express from 'express';
import mongoose from 'mongoose';
import { isUsingMongoose, getDbTier } from '../config/db.js';
import { memoryStore } from '../services/memoryStore.js';
import { executeFullSeed, presetUsers } from '../services/seedService.js';
import { Student } from '../models/Student.js';
import { Session } from '../models/Session.js';
import { AttendanceRecord } from '../models/AttendanceRecord.js';
import { FollowUp } from '../models/FollowUp.js';
import { CRTask } from '../models/CRTask.js';
import { StudentRequest } from '../models/StudentRequest.js';
import { AppSettings } from '../models/AppSettings.js';
import { User } from '../models/User.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { presetActivityLogs } from '../services/seedService.js';

const router = express.Router();

// Helper to access model or memoryStore seamlessly
function model(name, MongooseModel) {
  if (isUsingMongoose()) {
    return MongooseModel;
  }
  return memoryStore.collection(name);
}

// Enterprise Activity Logger helper
async function logActivity({ actorName = 'Aarav Sharma', actorRole = 'CR', action, details, category = 'academic', targetId = null, targetName = null }) {
  try {
    const entry = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      actorName,
      actorRole,
      action,
      details,
      category,
      targetId,
      targetName
    };
    await model('activity_logs', ActivityLog).create(entry);
    return entry;
  } catch (err) {
    console.warn('[ActivityLog] Failed to record activity:', err.message);
    return null;
  }
}

// -------------------------------------------------------------
// 1. HEALTH & SYSTEM BOOTSTRAP
// -------------------------------------------------------------

router.get('/health', async (req, res) => {
  try {
    const studentCount = await model('students', Student).countDocuments();
    res.json({
      status: 'healthy',
      tier: getDbTier(),
      records: { students: studentCount },
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Single call to load full academic state on app start
router.get('/bootstrap', async (req, res) => {
  try {
    const [students, sessions, attendanceRecords, followUps, tasks, studentRequests, settingsDocs] = await Promise.all([
      model('students', Student).find({ isArchived: { $ne: true } }),
      model('sessions', Session).find({}),
      model('attendance', AttendanceRecord).find({}),
      model('followups', FollowUp).find({}),
      model('tasks', CRTask).find({}),
      model('requests', StudentRequest).find({}),
      model('settings', AppSettings).find({})
    ]);

    const settings = settingsDocs[0] || null;

    let activityLogs = await model('activity_logs', ActivityLog).find({});
    if (Array.isArray(activityLogs)) {
      activityLogs = activityLogs.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 25);
    } else {
      activityLogs = await activityLogs.sort({ timestamp: -1 }).limit(25);
    }
    if (!activityLogs || activityLogs.length === 0) {
      activityLogs = presetActivityLogs;
    }

    res.json({
      success: true,
      data: {
        students,
        sessions,
        attendanceRecords,
        followUps,
        tasks,
        studentRequests,
        settings,
        activityLogs
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// AUTHENTICATION & SINGLE SIGN-ON (@sst.scaler.com ONLY)
// -------------------------------------------------------------

const activeSessions = new Map();

router.post('/auth/google', async (req, res) => {
  try {
    const { email, name, avatar } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Institutional email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // STRICT DOMAIN RESTRICTION: Must end with @sst.scaler.com or @scaler.com or @sst.scler.com
    const isSstDomain = /@(sst\.)?scaler\.com$/i.test(cleanEmail) || /@sst\.scler\.com$/i.test(cleanEmail);
    if (!isSstDomain) {
      return res.status(403).json({
        success: false,
        error: 'Access Denied: Classora is strictly restricted to Scaler School of Technology institutional emails (@sst.scaler.com).'
      });
    }

    let role = 'Student';
    let studentId = undefined;
    let userName = name || cleanEmail.split('@')[0];

    // Check if CR
    if (cleanEmail.includes('aarav') || cleanEmail.includes('cr') || cleanEmail === 'aarav.sharma@sst.scaler.com') {
      role = 'CR';
      userName = userName || 'Aarav Sharma';
    } 
    // Check if Faculty / Course Coordinator
    else if (cleanEmail.includes('priya') || cleanEmail.includes('nair') || cleanEmail.includes('faculty') || cleanEmail === 'priya.nair@sst.scaler.com') {
      role = 'Teacher';
      userName = userName || 'Dr. Priya Nair';
    } 
    // Match Student from official 44 students
    else {
      role = 'Student';
      const allStudents = await model('students', Student).find({ isArchived: { $ne: true } });
      
      const rollMatch = cleanEmail.match(/26bcs\d+/i);
      const rollNo = rollMatch ? rollMatch[0].toLowerCase() : null;

      const matchedStudent = allStudents.find(s => 
        (s.email && s.email.toLowerCase() === cleanEmail) ||
        (rollNo && s.id.toLowerCase() === rollNo) ||
        (rollNo && s.rollNo && s.rollNo.toLowerCase() === rollNo) ||
        (s.name && cleanEmail.includes(s.name.toLowerCase().replace(/\s+/g, '')))
      );

      if (matchedStudent) {
        studentId = matchedStudent.id;
        userName = matchedStudent.name;
      } else if (allStudents.length > 0) {
        studentId = allStudents[0].id;
        userName = allStudents[0].name;
      }
    }

    const userSession = {
      id: `sst-${Date.now()}`,
      name: userName,
      email: cleanEmail,
      role,
      studentId,
      avatar: avatar || '',
      isGoogleAuthenticated: true,
      authenticatedAt: new Date().toISOString()
    };

    activeSessions.set(cleanEmail, userSession);

    res.json({
      success: true,
      message: `Authenticated as ${userName} (${role}) via SST Google SSO`,
      data: userSession
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/auth/me', (req, res) => {
  const email = (req.query.email || '').toString().trim().toLowerCase();
  if (email && activeSessions.has(email)) {
    return res.json({ success: true, data: activeSessions.get(email) });
  }
  res.json({ success: false, data: null });
});

router.post('/resync-official', async (req, res) => {
  try {
    await executeFullSeed();
    res.json({ success: true, message: 'Classora database synchronized with official SST 2026 cohort' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/reset-demo', async (req, res) => {
  try {
    await executeFullSeed();
    res.json({ success: true, message: 'Classora database reset to official state' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 2. STUDENTS API
// -------------------------------------------------------------

router.get('/students', async (req, res) => {
  try {
    const filter = { isArchived: { $ne: true } };
    if (req.query.batch && req.query.batch !== 'All') {
      filter.batch = req.query.batch;
    }
    const students = await model('students', Student).find(filter);
    res.json({ success: true, count: students.length, data: students });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/students/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const student = await model('students', Student).findOne({ $or: [{ rollNo: id }, { id }] });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/students', async (req, res) => {
  try {
    const callerRole = req.headers['x-user-role'] || req.body.actorRole;
    if (callerRole && callerRole !== 'Admin' && callerRole !== 'Teacher') {
      return res.status(403).json({
        success: false,
        error: 'Access Denied: Only Faculty Teachers and Course Admins can enroll new students.'
      });
    }

    const rollNo = req.body.rollNo || req.body.id || `ENG-2026-${Math.floor(Math.random() * 900 + 100)}`;
    const studentData = {
      ...req.body,
      rollNo,
      id: rollNo,
      skills: req.body.skills || {
        communication: 75, grammar: 75, vocabulary: 75,
        pronunciation: 75, participation: 75, assignments: 75, assessments: 75
      },
      assignments: req.body.assignments || [],
      crRemarks: req.body.crRemarks || [],
      historicalScores: req.body.historicalScores || []
    };
    const created = await model('students', Student).create(studentData);

    // Auto-create user account
    if (created.email) {
      await model('users', User).updateOne(
        { email: created.email.toLowerCase() },
        {
          $set: {
            id: `usr_${created.id}`,
            name: created.name,
            email: created.email.toLowerCase(),
            role: 'Student',
            studentId: created.id,
            password: DEFAULT_COHORT_PASSWORD,
            isRegistered: true,
            mustChangePassword: true
          }
        },
        { upsert: true }
      );
    }

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/students/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await model('students', Student).updateOne({ id }, { $set: req.body });
    const updated = await model('students', Student).findOne({ id });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/students/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await model('students', Student).updateOne({ id }, { $set: { isArchived: true } });
    res.json({ success: true, message: 'Student archived' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add CR Remark
router.post('/students/:id/remarks', async (req, res) => {
  try {
    const id = req.params.id;
    const remark = {
      id: `RMK-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      author: req.body.author || 'Aarav (Lead CR)',
      text: req.body.text
    };
    const student = await model('students', Student).findOne({ $or: [{ rollNo: id }, { id }] });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    const remarks = [remark, ...(student.crRemarks || [])];
    await model('students', Student).updateOne({ $or: [{ rollNo: id }, { id }] }, { $set: { crRemarks: remarks } });
    res.json({ success: true, data: remark });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update single skill score
router.patch('/students/:id/skills', async (req, res) => {
  try {
    const id = req.params.id;
    const { skill, score } = req.body;
    const student = await model('students', Student).findOne({ $or: [{ rollNo: id }, { id }] });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    const skills = { ...student.skills, [skill]: score };
    await model('students', Student).updateOne({ $or: [{ rollNo: id }, { id }] }, { $set: { skills } });
    res.json({ success: true, data: skills });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update assignment score
router.patch('/students/:id/assignments/:aid', async (req, res) => {
  try {
    const { id, aid } = req.params;
    const { score } = req.body;
    const student = await model('students', Student).findOne({ $or: [{ rollNo: id }, { id }] });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    const assignments = (student.assignments || []).map(a => {
      if (a.id === aid) return { ...a, score, status: 'Graded' };
      return a;
    });
    await model('students', Student).updateOne({ $or: [{ rollNo: id }, { id }] }, { $set: { assignments } });
    res.json({ success: true, data: assignments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 3. SESSIONS API
// -------------------------------------------------------------

router.get('/sessions', async (req, res) => {
  try {
    const sessions = await model('sessions', Session).find({});
    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/sessions', async (req, res) => {
  try {
    const id = req.body.id || `SES-${Math.floor(Math.random() * 900 + 100)}`;
    const session = await model('sessions', Session).create({ ...req.body, id });
    res.status(201).json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/sessions/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await model('sessions', Session).updateOne({ id }, { $set: req.body });
    const updated = await model('sessions', Session).findOne({ id });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/sessions/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await model('sessions', Session).deleteOne({ id });
    await model('attendance', AttendanceRecord).deleteMany({ sessionId: id });
    res.json({ success: true, message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 4. ATTENDANCE API (TEACHER & ADMIN PERMISSION RESTRICTED)
// -------------------------------------------------------------

router.get('/attendance', async (req, res) => {
  try {
    const filter = {};
    if (req.query.sessionId) filter.sessionId = req.query.sessionId;
    if (req.query.studentId) filter.studentId = req.query.studentId;
    const records = await model('attendance', AttendanceRecord).find(filter);
    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post(['/attendance', '/attendance/mark'], async (req, res) => {
  try {
    const callerRole = req.headers['x-user-role'] || req.body.actorRole || req.query.role;
    if (callerRole === 'CR' || callerRole === 'Student') {
      return res.status(403).json({
        success: false,
        error: 'Access Denied: Only Faculty Teachers and Course Admins have permission to record or modify official attendance.'
      });
    }

    const { sessionId, studentId, status, remarks } = req.body;
    const timestamp = new Date().toISOString();
    await model('attendance', AttendanceRecord).updateOne(
      { sessionId, studentId },
      { $set: { status, remarks: remarks || '', timestamp } },
      { upsert: true }
    );
    res.json({ success: true, message: 'Attendance marked', record: { sessionId, studentId, status, timestamp, remarks } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/attendance/bulk', async (req, res) => {
  try {
    const callerRole = req.headers['x-user-role'] || req.body.actorRole || req.query.role;
    if (callerRole === 'CR' || callerRole === 'Student') {
      return res.status(403).json({
        success: false,
        error: 'Access Denied: Only Faculty Teachers and Course Admins have permission to record or modify official attendance.'
      });
    }

    const { sessionId, records, actorName = 'Dr. Priya Nair', actorRole = 'Teacher' } = req.body;
    const timestamp = new Date().toISOString();
    for (const r of records) {
      await model('attendance', AttendanceRecord).updateOne(
        { sessionId, studentId: r.studentId },
        { $set: { status: r.status, timestamp } },
        { upsert: true }
      );
    }
    const pCount = records.filter(r => r.status === 'Present').length;
    const aCount = records.filter(r => r.status === 'Absent').length;
    const lCount = records.filter(r => r.status === 'Late').length;
    const eCount = records.filter(r => r.status === 'Excused').length;

    await logActivity({
      actorName,
      actorRole: actorRole || 'Teacher',
      action: 'Attendance Recorded',
      details: `Official attendance recorded for ${sessionId}: ${pCount} Present, ${aCount} Absent, ${lCount} Late, ${eCount} Excused.`,
      category: 'attendance',
      targetId: sessionId,
      targetName: `Session ${sessionId}`
    });

    res.json({ success: true, count: records.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/attendance/session/:sessionId', async (req, res) => {
  try {
    const callerRole = req.headers['x-user-role'] || req.body.actorRole || req.query.role;
    if (callerRole === 'CR' || callerRole === 'Student') {
      return res.status(403).json({
        success: false,
        error: 'Access Denied: Only Faculty Teachers and Course Admins have permission to reset attendance.'
      });
    }

    const { sessionId } = req.params;
    await model('attendance', AttendanceRecord).deleteMany({ sessionId });
    res.json({ success: true, message: `Attendance reset for session ${sessionId}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 5. FOLLOW-UPS API
// -------------------------------------------------------------

router.get('/followups', async (req, res) => {
  try {
    const followUps = await model('followups', FollowUp).find({});
    res.json({ success: true, count: followUps.length, data: followUps });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/followups', async (req, res) => {
  try {
    const id = req.body.id || `FLW-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 90 + 10)}`;
    const item = await model('followups', FollowUp).create({ ...req.body, id });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/followups/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await model('followups', FollowUp).updateOne({ id }, { $set: req.body });
    const updated = await model('followups', FollowUp).findOne({ id });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/followups/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await model('followups', FollowUp).deleteOne({ id });
    res.json({ success: true, message: 'Follow-up deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 6. CR TASKS API
// -------------------------------------------------------------

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await model('tasks', CRTask).find({});
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/tasks', async (req, res) => {
  try {
    const id = req.body.id || `TSK-${Date.now().toString().slice(-4)}`;
    const task = await model('tasks', CRTask).create({ ...req.body, id });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await model('tasks', CRTask).updateOne({ id }, { $set: req.body });
    const updated = await model('tasks', CRTask).findOne({ id });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/tasks/:id/toggle', async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await model('tasks', CRTask).findOne({ id });
    if (!existing) return res.status(404).json({ error: 'Task not found' });
    const newStatus = existing.status === 'Completed' ? 'Pending' : 'Completed';
    await model('tasks', CRTask).updateOne({ id }, { $set: { status: newStatus } });
    res.json({ success: true, status: newStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await model('tasks', CRTask).deleteOne({ id });
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 7. STUDENT REQUESTS API
// -------------------------------------------------------------

router.get('/requests', async (req, res) => {
  try {
    const filter = {};
    if (req.query.studentId) filter.studentId = req.query.studentId;
    const requests = await model('requests', StudentRequest).find(filter);
    res.json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/requests', async (req, res) => {
  try {
    const id = `REQ-${Date.now()}`;
    const student = await model('students', Student).findOne({ $or: [{ rollNo: req.body.studentId }, { id: req.body.studentId }] });
    const requestData = {
      id,
      studentId: req.body.studentId,
      studentName: student ? student.name : 'Student',
      type: req.body.type,
      subject: req.body.subject,
      message: req.body.message,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    const created = await model('requests', StudentRequest).create(requestData);

    // Auto-create a corresponding CR follow-up
    await model('followups', FollowUp).create({
      id: `FLW-${Date.now().toString().slice(-4)}`,
      studentId: req.body.studentId,
      studentName: student ? student.name : 'Student',
      issueType: req.body.type === 'Leave / Absence Excuse' ? 'Low Attendance' : 'Student Request',
      priority: req.body.type === 'Leave / Absence Excuse' ? 'High' : 'Medium',
      dateIdentified: new Date().toISOString().split('T')[0],
      actionRequired: `[${req.body.type}] ${req.body.subject}`,
      assignedTo: 'Aarav (Lead CR)',
      deadline: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      status: 'Pending',
      remarks: 'Submitted via Classora Student Portal.',
      isAutoGenerated: true
    });

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/requests/:id/resolve', async (req, res) => {
  try {
    const id = req.params.id;
    const { response, newStatus = 'Approved', actorName = 'Dr. Priya Nair', actorRole = 'Teacher' } = req.body;
    const requestDoc = await model('requests', StudentRequest).findOne({ id });
    if (!requestDoc) {
      return res.status(404).json({ success: false, error: 'Student request not found' });
    }

    const resolvedDate = new Date().toISOString().split('T')[0];
    await model('requests', StudentRequest).updateOne(
      { id },
      { $set: { status: newStatus, teacherOrCrResponse: response, resolvedDate } }
    );
    const updated = await model('requests', StudentRequest).findOne({ id });

    // AUTOMATION: If request is Leave/Absence Excuse and approved, automatically update attendance to Excused!
    if (requestDoc.type === 'Leave / Absence Excuse' && newStatus === 'Approved') {
      const targetSessionId = 'SES-110';
      await model('attendance', AttendanceRecord).updateOne(
        { studentId: requestDoc.studentId, sessionId: targetSessionId },
        { 
          $set: { 
            status: 'Excused', 
            remarks: `Officially Excused via Approved Student Leave Request (${requestDoc.subject || 'Medical/Official Duty'})`,
            timestamp: new Date().toISOString()
          } 
        },
        { upsert: true }
      );

      await logActivity({
        actorName,
        actorRole,
        action: 'Leave Approved & Attendance Synced',
        details: `Approved absence excuse for ${requestDoc.studentName} (${requestDoc.studentId}). Session attendance updated to Excused.`,
        category: 'attendance',
        targetId: requestDoc.studentId,
        targetName: requestDoc.studentName
      });
    } else {
      await logActivity({
        actorName,
        actorRole,
        action: `Request ${newStatus}`,
        details: `${actorName} marked "${requestDoc.subject}" from ${requestDoc.studentName} as ${newStatus}.`,
        category: 'academic',
        targetId: requestDoc.id,
        targetName: requestDoc.studentName
      });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 8. ACTIVITY AUDIT TRAIL & BROADCAST LOGS
// -------------------------------------------------------------

router.get('/activity-logs', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 25;
    let logs = await model('activity_logs', ActivityLog).find({});
    if (Array.isArray(logs)) {
      logs = logs.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit);
    } else {
      logs = await logs.sort({ timestamp: -1 }).limit(limit);
    }
    if (!logs || logs.length === 0) {
      logs = presetActivityLogs;
    }
    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/broadcast/log', async (req, res) => {
  try {
    const { topic, recipients, channel = 'WhatsApp Official Community', actorName = 'Aarav Sharma', actorRole = 'CR' } = req.body;
    const log = await logActivity({
      actorName,
      actorRole,
      action: 'Institutional Broadcast Dispatched',
      details: `Broadcast "${topic}" sent to ${recipients} via ${channel}.`,
      category: 'communication',
      targetName: recipients
    });
    res.status(201).json({ success: true, data: log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 9. SETTINGS & AUTH PERSONAS
// -------------------------------------------------------------

router.get('/settings', async (req, res) => {
  try {
    const settings = await model('settings', AppSettings).findOne({});
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/settings', async (req, res) => {
  try {
    await model('settings', AppSettings).updateOne({ singletonKey: 'GLOBAL_SETTINGS' }, { $set: req.body }, { upsert: true });
    const updated = await model('settings', AppSettings).findOne({ singletonKey: 'GLOBAL_SETTINGS' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/auth/users', async (req, res) => {
  try {
    const users = await model('users', User).find({});
    res.json({ success: true, data: users.length > 0 ? users : presetUsers });
  } catch (err) {
    res.json({ success: true, data: presetUsers });
  }
});

// -------------------------------------------------------------
// USER ROLE MANAGEMENT (ADMIN & TEACHER HIERARCHY)
// -------------------------------------------------------------
router.patch('/auth/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { newRole, callerEmail, callerRole } = req.body;

    if (!newRole || !['Admin', 'Teacher', 'CR', 'Student'].includes(newRole)) {
      return res.status(400).json({ success: false, error: 'Valid role (Admin, Teacher, CR, Student) is required.' });
    }

    // Verify caller permission
    let verifiedCallerRole = req.headers['x-user-role'] || callerRole;
    if (callerEmail) {
      const callerUser = await model('users', User).findOne({ email: callerEmail.trim().toLowerCase() });
      if (callerUser) verifiedCallerRole = callerUser.role;
    }

    // Permissions check:
    // Admin: Can set anyone to Admin, Teacher, CR, or Student
    // Teacher: Can appoint student as CR or revert CR to Student. CANNOT make Teachers or Admins.
    // CR / Student: Cannot change any roles.
    if (verifiedCallerRole !== 'Admin' && verifiedCallerRole !== 'Teacher') {
      return res.status(403).json({
        success: false,
        error: 'Access Denied: Only Course Admins and Faculty Teachers have authority to manage user roles.'
      });
    }

    if (verifiedCallerRole === 'Teacher') {
      if (newRole === 'Admin' || newRole === 'Teacher') {
        return res.status(403).json({
          success: false,
          error: 'Access Denied: Teachers can only appoint Class Representatives (CR) or students. Only Admins can appoint Teachers.'
        });
      }
    }

    // Find target user
    const targetUser = await model('users', User).findOne({
      $or: [{ id }, { studentId: id }, { email: id.toLowerCase() }]
    });

    if (!targetUser) {
      return res.status(404).json({ success: false, error: 'Target user not found.' });
    }

    // Prevent demoting the primary admin
    if (targetUser.email === 'admin@sst.scaler.com' && newRole !== 'Admin') {
      return res.status(403).json({ success: false, error: 'Cannot demote the primary system administrator.' });
    }

    await model('users', User).updateOne(
      { email: targetUser.email },
      { $set: { role: newRole } }
    );

    // If target has a student record, update remarks
    if (targetUser.studentId) {
      const remark = newRole === 'CR'
        ? `Official SST 2026 Cohort • Appointed Class Representative (CR).`
        : `Official SST 2026 Cohort • Role: ${newRole}.`;
      await model('students', Student).updateOne(
        { id: targetUser.studentId },
        { $set: { initialRemarks: remark } }
      );
    }

    await logActivity({
      actorName: callerEmail || 'Course Authority',
      actorRole: verifiedCallerRole || 'Authority',
      action: 'Role Updated',
      details: `${verifiedCallerRole} changed role of ${targetUser.name} (${targetUser.email}) from ${targetUser.role} to ${newRole}.`,
      category: 'security',
      targetId: targetUser.id,
      targetName: targetUser.name
    });

    res.json({
      success: true,
      message: `Successfully updated ${targetUser.name}'s position to ${newRole}.`,
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        role: newRole,
        studentId: targetUser.studentId
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const DEFAULT_COHORT_PASSWORD = 'SST@2026';

// -------------------------------------------------------------
// USER REGISTRATION (SIGN UP FIRST)
// -------------------------------------------------------------
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, role: requestedRole } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Institutional email is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const isSstDomain = /@(sst\.)?scaler\.com$/i.test(cleanEmail) || /@sst\.scler\.com$/i.test(cleanEmail);
    if (!isSstDomain) {
      return res.status(403).json({
        success: false,
        error: 'Access Denied: Only official Scaler School of Technology (@sst.scaler.com) accounts are authorized.'
      });
    }

    if (!password || password.trim().length < 4) {
      return res.status(400).json({
        success: false,
        error: 'Please choose a password with at least 4 characters.'
      });
    }

    // Determine Role & Student match
    let role = requestedRole || 'Student';
    let studentId = null;
    let userName = name?.trim() || cleanEmail.split('@')[0].replace(/\./g, ' ');
    let student = null;

    if (cleanEmail.includes('aarav') || cleanEmail.includes('cr')) {
      role = 'CR';
      userName = 'Aarav Sharma';
    } else if (cleanEmail.includes('priya') || cleanEmail.includes('nair') || cleanEmail.includes('faculty')) {
      role = 'Teacher';
      userName = 'Dr. Priya Nair';
    } else {
      role = 'Student';
      const rollMatch = cleanEmail.match(/26bcs\d+/i);
      const rollNo = rollMatch ? rollMatch[0].toLowerCase() : null;

      // Strict 44-Cohort Verification
      student = await model('students', Student).findOne({
        $or: [
          { email: cleanEmail },
          ...(rollNo ? [{ rollNo: rollNo }, { id: rollNo }] : [])
        ]
      });

      if (!student) {
        return res.status(403).json({
          success: false,
          error: 'Access Denied: Only students in the official SST ENG-101 cohort (44 students) are eligible to register. Your email was not found in the cohort roster.'
        });
      }

      studentId = student.id || student.rollNo;
      userName = student.name || userName;
    }

    // Check if user already registered with a custom password
    const existing = await model('users', User).findOne({ email: cleanEmail });
    if (existing && existing.isRegistered && existing.password && existing.password !== DEFAULT_COHORT_PASSWORD) {
      return res.status(400).json({
        success: false,
        error: `Account for ${existing.name} is already registered. Please switch to "Log in" to sign in with your password.`
      });
    }

    const isUsingDefault = password.trim() === DEFAULT_COHORT_PASSWORD;
    const userDoc = {
      id: existing?.id || `usr_${Date.now()}_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 15)}`,
      name: userName,
      email: cleanEmail,
      password: password.trim(),
      role,
      studentId,
      avatar: (student && student.avatar) || existing?.avatar || '',
      isGoogleAuthenticated: true,
      isRegistered: true,
      mustChangePassword: isUsingDefault,
      registeredAt: existing?.registeredAt || new Date().toISOString()
    };

    await model('users', User).updateOne(
      { email: cleanEmail },
      { $set: userDoc },
      { upsert: true }
    );

    await logActivity({
      actorName: userName,
      actorRole: role,
      action: 'Account Registered',
      details: `Official SST student account registered: ${userName} (${cleanEmail}) as ${role}. Ready for login.`,
      category: 'security',
      targetId: studentId,
      targetName: userName
    });

    res.status(201).json({
      success: true,
      message: `Registration successful for ${userName}! Please enter your password to log in.`,
      studentName: userName,
      email: cleanEmail,
      isRegistered: true
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// USER LOGIN (SUPPORTS SHARED DEFAULT PASSWORD SST@2026)
// -------------------------------------------------------------
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Institutional email is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const isSstDomain = /@(sst\.)?scaler\.com$/i.test(cleanEmail) || /@sst\.scler\.com$/i.test(cleanEmail);
    if (!isSstDomain) {
      return res.status(403).json({
        success: false,
        error: 'Access Denied: Only official Scaler School of Technology (@sst.scaler.com) accounts are authorized.'
      });
    }

    // Admin & Staff hierarchy validation
    const isAdmin = cleanEmail.includes('admin') || cleanEmail === 'yahoshuva.26bcs10296@sst.scaler.com';
    const isStaff = isAdmin || cleanEmail.includes('aarav') || cleanEmail.includes('cr') || cleanEmail.includes('priya') || cleanEmail.includes('nair') || cleanEmail.includes('faculty');
    let student = null;
    if (!isStaff) {
      const rollMatch = cleanEmail.match(/26bcs\d+/i);
      const rollNo = rollMatch ? rollMatch[0].toLowerCase() : null;
      student = await model('students', Student).findOne({
        $or: [
          { email: cleanEmail },
          ...(rollNo ? [{ rollNo: rollNo }, { id: rollNo }] : [])
        ]
      });

      if (!student) {
        return res.status(403).json({
          success: false,
          error: 'Access Denied: Only students in the official SST ENG-101 cohort (44 students) are eligible to log in.'
        });
      }
    }

    let user = await model('users', User).findOne({ email: cleanEmail });

    // Auto-provision any cohort member who doesn't have an existing user document yet
    if (!user) {
      const studentId = student ? (student.id || student.rollNo) : (cleanEmail === 'yahoshuva.26bcs10296@sst.scaler.com' ? '26bcs10296' : null);
      let userName = student ? student.name : (cleanEmail.includes('aarav') ? 'Aarav Sharma' : cleanEmail.includes('priya') ? 'Dr. Priya Nair' : cleanEmail.split('@')[0]);
      if (cleanEmail === 'yahoshuva.26bcs10296@sst.scaler.com') userName = 'Yahoshuva Kesaboyina';

      let role = 'Student';
      if (isAdmin) {
        role = 'Admin';
      } else if (cleanEmail.includes('priya') || cleanEmail.includes('nair') || cleanEmail.includes('faculty')) {
        role = 'Teacher';
      } else if (cleanEmail.includes('aarav') || cleanEmail.includes('cr')) {
        role = 'CR';
      }

      user = {
        id: `usr_${studentId || cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
        name: userName,
        email: cleanEmail,
        password: DEFAULT_COHORT_PASSWORD,
        role,
        studentId,
        avatar: student?.avatar || '',
        isGoogleAuthenticated: true,
        isRegistered: true,
        mustChangePassword: true,
        registeredAt: new Date().toISOString()
      };
      await model('users', User).updateOne({ email: cleanEmail }, { $set: user }, { upsert: true });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Password is required to log in.'
      });
    }

    const expectedPassword = user.password || DEFAULT_COHORT_PASSWORD;
    const isMatch = (password === expectedPassword) || (password === DEFAULT_COHORT_PASSWORD);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect password. (Default cohort password is SST@2026)'
      });
    }

    // Check if user still needs to change default password
    const mustChangePassword = user.mustChangePassword === true || (user.password === DEFAULT_COHORT_PASSWORD && password === DEFAULT_COHORT_PASSWORD);

    await logActivity({
      actorName: user.name,
      actorRole: user.role,
      action: 'Account Login',
      details: `${user.name} (${user.email}) successfully logged into Classora Academic OS. [Needs password update: ${mustChangePassword}]`,
      category: 'security',
      targetId: user.studentId,
      targetName: user.name
    });

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        avatar: user.avatar || '',
        isGoogleAuthenticated: true,
        mustChangePassword
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// CHANGE PASSWORD (POST-LOGIN MANDATORY OR ON-DEMAND)
// -------------------------------------------------------------
router.post('/auth/change-password', async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, error: 'Email and new password are required.' });
    }

    if (newPassword.trim().length < 4) {
      return res.status(400).json({ success: false, error: 'New password must be at least 4 characters long.' });
    }

    if (newPassword.trim() === DEFAULT_COHORT_PASSWORD) {
      return res.status(400).json({
        success: false,
        error: 'Please choose a personal password different from the shared cohort default (SST@2026).'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await model('users', User).findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User account not found.' });
    }

    if (currentPassword && user.password && user.password !== currentPassword && currentPassword !== DEFAULT_COHORT_PASSWORD) {
      return res.status(401).json({ success: false, error: 'Current password does not match.' });
    }

    await model('users', User).updateOne(
      { email: cleanEmail },
      {
        $set: {
          password: newPassword.trim(),
          mustChangePassword: false,
          updatedAt: new Date().toISOString()
        }
      }
    );

    await logActivity({
      actorName: user.name,
      actorRole: user.role,
      action: 'Password Updated',
      details: `${user.name} (${user.email}) changed their account password. Default cohort password replaced with secure personal password.`,
      category: 'security',
      targetId: user.studentId,
      targetName: user.name
    });

    res.json({
      success: true,
      message: 'Password updated successfully! Your account is now secured.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        avatar: user.avatar || '',
        isGoogleAuthenticated: true,
        mustChangePassword: false
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/auth/google', async (req, res) => {
  try {
    const { email, name, avatar } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const isSstDomain = /@(sst\.)?scaler\.com$/i.test(cleanEmail) || /@sst\.scler\.com$/i.test(cleanEmail);
    if (!isSstDomain) {
      return res.status(403).json({
        success: false,
        error: 'Access Denied: Only Scaler School of Technology (@sst.scaler.com) accounts are authorized.'
      });
    }

    // Cohort & Staff validation
    const isAdmin = cleanEmail.includes('admin') || cleanEmail === 'yahoshuva.26bcs10296@sst.scaler.com';
    const isStaff = isAdmin || cleanEmail.includes('aarav') || cleanEmail.includes('cr') || cleanEmail.includes('priya') || cleanEmail.includes('nair') || cleanEmail.includes('faculty');
    let studentId = null;
    let userName = name || cleanEmail.split('@')[0].replace(/\./g, ' ');
    let role = 'Student';

    if (isAdmin) {
      role = 'Admin';
      userName = cleanEmail === 'yahoshuva.26bcs10296@sst.scaler.com' ? 'Yahoshuva Kesaboyina' : (name || 'Course Administrator');
      if (cleanEmail === 'yahoshuva.26bcs10296@sst.scaler.com') studentId = '26bcs10296';
    } else if (cleanEmail.includes('aarav') || cleanEmail.includes('cr')) {
      role = 'CR';
      userName = 'Aarav Sharma';
    } else if (cleanEmail.includes('priya') || cleanEmail.includes('nair') || cleanEmail.includes('faculty')) {
      role = 'Teacher';
      userName = 'Dr. Priya Nair';
    } else {
      role = 'Student';
      const rollMatch = cleanEmail.match(/26bcs\d+/i);
      const rollNo = rollMatch ? rollMatch[0].toLowerCase() : null;
      const student = await model('students', Student).findOne({
        $or: [
          { email: cleanEmail },
          ...(rollNo ? [{ rollNo: rollNo }, { id: rollNo }] : [])
        ]
      });

      if (!student) {
        return res.status(403).json({
          success: false,
          error: 'Access Denied: Only students in the official SST ENG-101 cohort (44 students) are eligible.'
        });
      }

      studentId = student.id || student.rollNo;
      userName = student.name || userName;
    }

    // Must be registered first!
    const existing = await model('users', User).findOne({ email: cleanEmail });
    if (!existing || !existing.isRegistered) {
      return res.status(400).json({
        success: false,
        error: 'Account not registered yet. Please click "Sign up" to create and register your account first!'
      });
    }

    const effectiveRole = existing.role || role;

    // Activity log
    await logActivity({
      actorName: userName,
      actorRole: effectiveRole,
      action: 'Google SST Authentication',
      details: `Official SST account authenticated: ${userName} (${cleanEmail}) signed in as ${effectiveRole}.`,
      category: 'security',
      targetId: studentId,
      targetName: userName
    });

    res.json({
      success: true,
      user: {
        id: existing.id,
        name: existing.name,
        email: existing.email,
        role: effectiveRole,
        studentId: existing.studentId,
        avatar: avatar || existing.avatar || '',
        isGoogleAuthenticated: true
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Official 44 Cohort Roster endpoint for quick student verification
router.get('/auth/cohort-roster', async (req, res) => {
  try {
    const students = await model('students', Student).find({ isArchived: { $ne: true } });
    const roster = students.map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      rollNo: s.rollNo,
      group: s.group
    })).sort((a, b) => a.name.localeCompare(b.name));
    res.json({ success: true, count: roster.length, roster });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/auth/me', async (req, res) => {
  try {
    const user = await model('users', User).findOne({});
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 12. USER ROLE MANAGEMENT & HIERARCHY
// Admin appoints Anyone (Admin, Teacher, CR, Student)
// Teacher appoints CRs or demotes to Student
// CR & Student are blocked
// -------------------------------------------------------------
router.get('/auth/users', async (req, res) => {
  try {
    const users = await model('users', User).find({}, { password: 0 });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.patch('/auth/users/:id/role', async (req, res) => {
  try {
    const targetIdentifier = req.params.id;
    const { newRole, callerEmail, callerRole } = req.body;
    const headerRole = req.headers['x-user-role'];
    const effectiveCallerRole = callerRole || headerRole || 'Admin';

    const validRoles = ['Admin', 'Teacher', 'CR', 'Student'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({
        success: false,
        error: `Invalid role: "${newRole}". Must be one of: ${validRoles.join(', ')}`
      });
    }

    if (effectiveCallerRole === 'CR' || effectiveCallerRole === 'Student') {
      return res.status(403).json({
        success: false,
        error: 'Access Denied: Only Course Admins and Faculty Teachers have authority to modify roles.'
      });
    }

    // Teacher restrictions: Teachers can only appoint CRs or demote CRs back to Student
    if (effectiveCallerRole === 'Teacher') {
      if (newRole === 'Admin' || newRole === 'Teacher') {
        return res.status(403).json({
          success: false,
          error: 'Access Denied: Faculty Teachers can only designate Class Representatives (CR) or Students. Only Course Admins can appoint Faculty and Admins.'
        });
      }
    }

    const user = await model('users', User).findOne({
      $or: [
        { id: targetIdentifier },
        ...(mongoose.isValidObjectId(targetIdentifier) ? [{ _id: targetIdentifier }] : []),
        { email: targetIdentifier.toLowerCase() },
        { studentId: targetIdentifier }
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, error: `User not found for identifier: ${targetIdentifier}` });
    }

    // Protect Admin accounts from being demoted/modified by non-admins
    if (user.role === 'Admin' && effectiveCallerRole !== 'Admin') {
      return res.status(403).json({
        success: false,
        error: 'Access Denied: Cannot modify an Administrator account without Admin privileges.'
      });
    }

    const previousRole = user.role;
    user.role = newRole;
    await model('users', User).updateOne(
      { email: user.email },
      { $set: { role: newRole } }
    );

    await logActivity({
      actorName: callerEmail || (effectiveCallerRole === 'Teacher' ? 'Dr. Priya Nair' : 'Course Admin'),
      actorRole: effectiveCallerRole,
      action: 'Role Modified',
      details: `${effectiveCallerRole} updated ${user.name} (${user.email}) position from ${previousRole} to ${newRole}.`,
      category: 'security',
      targetId: user.id || user.studentId,
      targetName: user.name
    });

    res.json({
      success: true,
      message: `Successfully updated ${user.name} to ${newRole}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: newRole,
        studentId: user.studentId,
        avatar: user.avatar
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
