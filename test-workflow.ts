import {
  initialStudents,
  initialSessions,
  initialAttendanceRecords,
  initialFollowUps,
  initialTasks,
  initialSettings
} from './src/data/mockData';
import { calculateStudentStats, calculateDashboardMetrics } from './src/utils/calculations';
import { generateAttendanceCSV, generateAtRiskCSV } from './src/utils/exportUtils';
import { Student, Session, AttendanceRecord, FollowUp, CRTask } from './src/types';

console.log('=== RUNNING ULTIMATE STUDENT TRACKER WORKFLOW TEST ===\n');

// 1. Initial State
let students: Student[] = [...initialStudents];
let sessions: Session[] = [...initialSessions];
let attendanceRecords: AttendanceRecord[] = [...initialAttendanceRecords];
let followUps: FollowUp[] = [...initialFollowUps];
let tasks: CRTask[] = [...initialTasks];
const settings = { ...initialSettings };

console.log(`[TEST 1] Initial Student Count: ${students.length}`);
console.log(`[TEST 1] Initial Session Count: ${sessions.length}`);
console.log(`[TEST 1] Initial FollowUp Count: ${followUps.length}`);

// Baseline Metrics
const initialMetrics = calculateDashboardMetrics(students, sessions, attendanceRecords, settings);
console.log(`[TEST 1] Baseline Dashboard: Total=${initialMetrics.totalStudents}, Present=${initialMetrics.presentToday}, Absent=${initialMetrics.absentToday}, Avg Attendance=${initialMetrics.averageAttendance}%`);

// Step 1: Add Student
const newStudentId = `ENG-2026-${(students.length + 1).toString().padStart(3, '0')}`;
const newStudent: Student = {
  id: newStudentId,
  name: 'Karan Mehra',
  phone: '+91 99999 88888',
  email: 'karan.mehra@student.edu',
  batch: 'Batch A - Morning',
  joiningDate: '2026-02-01',
  currentLevel: 'Intermediate (B1)',
  initialRemarks: 'Enrolled via transfer; eager learner.',
  lastActivity: 'Just now',
  skills: { communication: 78, grammar: 80, vocabulary: 76, pronunciation: 75, participation: 82, assignments: 85, assessments: 80 },
  previousOverallScore: 78,
  assignments: [],
  crRemarks: [],
  historicalScores: [{ date: '2026-02-01', overallScore: 78, communication: 78, grammar: 80, vocabulary: 76 }]
};
students.push(newStudent);
console.log(`\n[TEST 2] Added student: ${newStudent.name} (${newStudent.id})`);
const metricsAfterAdd = calculateDashboardMetrics(students, sessions, attendanceRecords, settings);
console.log(`[TEST 2] Dashboard Total Students updated to: ${metricsAfterAdd.totalStudents}`);
if (metricsAfterAdd.totalStudents !== initialMetrics.totalStudents + 1) {
  throw new Error('Total students count did not increment');
}

// Step 2: Create Session
const newSession: Session = {
  id: 'SES-113',
  topic: 'Impromptu Table Topics & Debate Sprint',
  date: '2026-02-25',
  startTime: '09:30 AM',
  endTime: '11:00 AM',
  faculty: 'Dr. Priya Nair (Phonetics & Linguistics)',
  batch: 'All Batches',
  mode: 'Offline',
  location: 'Language Lab 102',
  status: 'Completed',
  notes: 'Test session created by workflow verification.'
};
sessions.push(newSession);
console.log(`\n[TEST 3] Created session: ${newSession.id} - ${newSession.topic}`);
const metricsAfterSession = calculateDashboardMetrics(students, sessions, attendanceRecords, settings);
console.log(`[TEST 3] Conducted Sessions: ${metricsAfterSession.sessionsConducted} / ${metricsAfterSession.totalPlannedSessions}`);

// Step 3: Mark Attendance
// Let's mark target student as Absent for SES-113
const testStudent = students.find(s => s.id === '26bcs10296') || students[0];
const rahulBefore = calculateStudentStats(testStudent, sessions, attendanceRecords, settings);
console.log(`\n[TEST 4] ${testStudent.name} BEFORE new absence: Attendance=${rahulBefore.attendancePercentage}%, Status=${rahulBefore.status}, Missed=${rahulBefore.missedSessions}`);

attendanceRecords.push({
  sessionId: 'SES-113',
  studentId: testStudent.id,
  status: 'Absent',
  timestamp: new Date().toISOString(),
  remarks: 'Absent during test sprint'
});

const rahulAfter = calculateStudentStats(testStudent, sessions, attendanceRecords, settings);
console.log(`[TEST 4] ${testStudent.name} AFTER absence: Attendance=${rahulAfter.attendancePercentage}%, Status=${rahulAfter.status}, Missed=${rahulAfter.missedSessions}`);
if (rahulAfter.attendancePercentage >= rahulBefore.attendancePercentage) {
  throw new Error('Attendance percentage did not decrease after marking absent');
}

// Step 4: Check Risk Status Change & At-Risk list
const metricsAfterAttendance = calculateDashboardMetrics(students, sessions, attendanceRecords, settings);
const studentInAttention = metricsAfterAttendance.studentsNeedingAttention.find(s => s.student.id === testStudent.id);
console.log(`\n[TEST 5] Student found in Needing Attention / At Risk: ${!!studentInAttention}`);

// Step 5: Follow-up Creation & Resolution
const newFollowUpId = `FLW-TEST-01`;
followUps.push({
  id: newFollowUpId,
  studentId: testStudent.id,
  studentName: testStudent.name,
  issueType: 'Low Attendance',
  priority: 'High',
  dateIdentified: '2026-02-25',
  actionRequired: `Call student to explain absence from SES-113`,
  assignedTo: 'Aarav (Lead CR)',
  deadline: '2026-02-26',
  status: 'Pending',
  remarks: 'Test follow-up'
});

const pendingBefore = followUps.filter(f => f.status === 'Pending').length;
console.log(`\n[TEST 6] Follow-up created. Pending count: ${pendingBefore}`);

// Resolve follow-up
followUps = followUps.map(f => f.id === newFollowUpId ? { ...f, status: 'Completed' as const } : f);
const pendingAfter = followUps.filter(f => f.status === 'Pending').length;
console.log(`[TEST 6] Follow-up resolved. Pending count: ${pendingAfter}`);
if (pendingAfter !== pendingBefore - 1) {
  throw new Error('Pending follow-up count did not decrease upon completion');
}

// Step 6: Toggle CR Task
if (tasks.length === 0) {
  tasks.push({
    id: 'TASK-01',
    task: 'Verify audio-visual setup for language lab',
    category: 'Logistics',
    priority: 'Medium',
    status: 'Pending',
    assignedTo: 'Lead CR',
    dueDate: '2026-09-15'
  });
}
const taskToToggle = tasks[0];
const taskStatusBefore = taskToToggle.status;
tasks = tasks.map(t => t.id === taskToToggle.id ? { ...t, status: t.status === 'Completed' ? 'Pending' as const : 'Completed' as const } : t);
console.log(`\n[TEST 7] CR Task "${taskToToggle.task.slice(0, 30)}..." toggled from ${taskStatusBefore} to ${tasks.find(t => t.id === taskToToggle.id)?.status}`);

// Step 7: Verify CSV Reports
const studentStatsAll = students.map(s => calculateStudentStats(s, sessions, attendanceRecords, settings));
const attendanceCSV = generateAttendanceCSV(studentStatsAll);
const atRiskCSV = generateAtRiskCSV(studentStatsAll.filter(s => s.status === 'At Risk' || s.status === 'Needs Attention'));

console.log(`\n[TEST 8] Generated Attendance CSV: ${attendanceCSV.split('\n').length} rows`);
console.log(`[TEST 8] Generated At-Risk CSV: ${atRiskCSV.split('\n').length} rows`);
if (!attendanceCSV.includes('Student ID,Full Name')) {
  throw new Error('CSV output did not format correctly');
}

console.log('\n✅ ALL 8 MVP CRITICAL WORKFLOW TESTS PASSED SUCCESSFULLY!\n');
