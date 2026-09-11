import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isUsingMongoose } from '../config/db.js';
import { memoryStore } from './memoryStore.js';
import { Student } from '../models/Student.js';
import { Session } from '../models/Session.js';
import { AttendanceRecord } from '../models/AttendanceRecord.js';
import { FollowUp } from '../models/FollowUp.js';
import { CRTask } from '../models/CRTask.js';
import { StudentRequest } from '../models/StudentRequest.js';
import { AppSettings } from '../models/AppSettings.js';
import { User } from '../models/User.js';
import { ActivityLog } from '../models/ActivityLog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seedFilePath = path.join(__dirname, '../data/seedData.json');

export const presetActivityLogs = [
  {
    id: 'act-live-init',
    timestamp: new Date().toISOString(),
    actorName: 'Classora OS',
    actorRole: 'System',
    action: 'Real-Time Database Active',
    details: 'Institutional cohort connected: 44 SST students, 12 syllabus modules, Teacher Noor Nigar active.',
    category: 'system',
    targetId: 'ENG-101',
    targetName: 'English Language & Communication Skills'
  }
];

export const presetUsers = [
  {
    id: 'goog-admin',
    name: 'Course Administrator',
    email: 'admin@sst.scaler.com',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    personaKey: 'super_admin',
    isGoogleAuthenticated: true
  },
  {
    id: 'goog-faculty',
    name: 'Noor Nigar',
    email: 'noor.nigar@scaler.com',
    role: 'Teacher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    personaKey: 'coordinator_faculty',
    isGoogleAuthenticated: true
  },
  {
    id: 'goog-cr',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@sst.scaler.com',
    role: 'CR',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    personaKey: 'lead_cr',
    isGoogleAuthenticated: true
  },
  {
    id: 'goog-26bcs10296',
    name: 'Yahoshuva Kesaboyina',
    email: 'yahoshuva.26bcs10296@sst.scaler.com',
    role: 'Admin',
    studentId: '26bcs10296',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    personaKey: 'course_owner_admin',
    isGoogleAuthenticated: true
  },
  {
    id: 'goog-26bcs10093',
    name: 'Divyanshika Sharma',
    email: 'divyanshika.26bcs10093@sst.scaler.com',
    role: 'Student',
    studentId: '26bcs10093',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    personaKey: 'sst_student_group6',
    isGoogleAuthenticated: true
  },
  {
    id: 'goog-26bcs10424',
    name: 'Aditya Shaw',
    email: 'aditya.26bcs10424@sst.scaler.com',
    role: 'Student',
    studentId: '26bcs10424',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    personaKey: 'sst_student_group1',
    isGoogleAuthenticated: true
  }
];

export async function checkAndAutoSeed() {
  try {
    const raw = fs.readFileSync(seedFilePath, 'utf8');
    const seedData = JSON.parse(raw);

    if (isUsingMongoose()) {
      const studentCount = await Student.countDocuments();
      if (studentCount > 0) {
        console.log(`[Seeder] Database already populated (${studentCount} students). Skipping auto-seed.`);
        return { seeded: false, count: studentCount };
      }
      return await executeFullSeed(seedData);
    } else {
      // Memory store tier
      const studentCol = memoryStore.collection('students');
      const count = await studentCol.countDocuments();
      if (count === 0) {
        return await executeFullSeed(seedData);
      }
      return { seeded: false, count };
    }
  } catch (err) {
    console.error('[Seeder] Seeding check error:', err.message);
  }
}

export async function executeFullSeed(seedData) {
  if (!seedData) {
    const raw = fs.readFileSync(seedFilePath, 'utf8');
    seedData = JSON.parse(raw);
  }

  const studentsWithRollNo = seedData.initialStudents.map(s => ({
    ...s,
    rollNo: s.id,
    id: s.id,
    status: s.status || 'On Track'
  }));

  if (isUsingMongoose()) {
    await Promise.all([
      Student.deleteMany({}),
      Session.deleteMany({}),
      AttendanceRecord.deleteMany({}),
      FollowUp.deleteMany({}),
      CRTask.deleteMany({}),
      StudentRequest.deleteMany({}),
      AppSettings.deleteMany({}),
      User.deleteMany({}),
      ActivityLog.deleteMany({})
    ]);

    const DEFAULT_COHORT_PASSWORD = 'SST@2026';
    const allCohortUsers = [
      ...presetUsers.map(u => ({
        ...u,
        password: u.password || DEFAULT_COHORT_PASSWORD,
        isRegistered: true,
        mustChangePassword: true
      })),
      ...studentsWithRollNo.map(s => ({
        id: `usr_${s.id}`,
        name: s.name,
        email: s.email,
        role: 'Student',
        studentId: s.id,
        avatar: s.avatar || '',
        personaKey: `student_${s.id}`,
        isGoogleAuthenticated: true,
        password: DEFAULT_COHORT_PASSWORD,
        isRegistered: true,
        registeredAt: new Date().toISOString(),
        mustChangePassword: true
      }))
    ];

    const seenEmails = new Set();
    const uniqueUsers = [];
    for (const u of allCohortUsers) {
      const em = u.email.toLowerCase();
      if (!seenEmails.has(em)) {
        seenEmails.add(em);
        uniqueUsers.push(u);
      }
    }

    await Student.insertMany(studentsWithRollNo);
    await Session.insertMany(seedData.initialSessions);
    await AttendanceRecord.insertMany(seedData.initialAttendanceRecords);
    await FollowUp.insertMany(seedData.initialFollowUps);
    await CRTask.insertMany(seedData.initialTasks);
    await StudentRequest.insertMany(seedData.initialStudentRequests);
    await AppSettings.create(seedData.initialSettings);
    await User.insertMany(uniqueUsers);
    await ActivityLog.insertMany(presetActivityLogs);
  } else {
    // Memory Store
    memoryStore.clear();
    const DEFAULT_COHORT_PASSWORD = 'SST@2026';
    const allCohortUsers = [
      ...presetUsers.map(u => ({
        ...u,
        password: u.password || DEFAULT_COHORT_PASSWORD,
        isRegistered: true,
        mustChangePassword: true
      })),
      ...studentsWithRollNo.map(s => ({
        id: `usr_${s.id}`,
        name: s.name,
        email: s.email,
        role: 'Student',
        studentId: s.id,
        avatar: s.avatar || '',
        personaKey: `student_${s.id}`,
        isGoogleAuthenticated: true,
        password: DEFAULT_COHORT_PASSWORD,
        isRegistered: true,
        registeredAt: new Date().toISOString(),
        mustChangePassword: true
      }))
    ];

    const seenEmails = new Set();
    const uniqueUsers = [];
    for (const u of allCohortUsers) {
      const em = u.email.toLowerCase();
      if (!seenEmails.has(em)) {
        seenEmails.add(em);
        uniqueUsers.push(u);
      }
    }

    await memoryStore.collection('students').insertMany(studentsWithRollNo);
    await memoryStore.collection('sessions').insertMany(seedData.initialSessions);
    await memoryStore.collection('attendance').insertMany(seedData.initialAttendanceRecords);
    await memoryStore.collection('followups').insertMany(seedData.initialFollowUps);
    await memoryStore.collection('tasks').insertMany(seedData.initialTasks);
    await memoryStore.collection('requests').insertMany(seedData.initialStudentRequests);
    await memoryStore.collection('settings').insertMany([{ singletonKey: 'GLOBAL_SETTINGS', ...seedData.initialSettings }]);
    await memoryStore.collection('users').insertMany(uniqueUsers);
    await memoryStore.collection('activity_logs').insertMany(presetActivityLogs);
    memoryStore.flushSync();
  }

  console.log(`✨ [Seeder] Full initial database seed complete:`);
  console.log(`   - ${studentsWithRollNo.length} Students hydrated`);
  console.log(`   - ${seedData.initialSessions.length} Sessions hydrated`);
  console.log(`   - ${seedData.initialAttendanceRecords.length} Attendance records`);
  console.log(`   - ${presetUsers.length} Auth personas active`);
  return { seeded: true, count: studentsWithRollNo.length };
}
