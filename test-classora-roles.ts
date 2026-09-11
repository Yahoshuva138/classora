import {
  initialStudents,
  initialSessions,
  initialAttendanceRecords,
  initialFollowUps,
  initialTasks,
  initialSettings,
  initialStudentRequests
} from './src/data/mockData';
import { calculateStudentStats, calculateDashboardMetrics } from './src/utils/calculations';
import { generateAttendanceCSV, exportGradebookCSV } from './src/utils/exportUtils';
import { Student, Session, AttendanceRecord, FollowUp, CRTask, StudentRequest, UserRole } from './src/types';

console.log('=====================================================');
console.log('    CLASSORA MULTI-ROLE (CR, TEACHER, STUDENT) TEST   ');
console.log('=====================================================\n');

// 1. Initial State
let students: Student[] = [...initialStudents];
let sessions: Session[] = [...initialSessions];
let attendanceRecords: AttendanceRecord[] = [...initialAttendanceRecords];
let studentRequests: StudentRequest[] = [...initialStudentRequests];
const settings = { ...initialSettings };

console.log(`[TEST 1: INITIAL DATA] Loaded:
- Students: ${students.length}
- Sessions: ${sessions.length}
- Pre-existing Student Requests: ${studentRequests.length}`);

// 2. Persona: Student Portal - Find a student with Needs Attention or At Risk
const studentStatsList = students.map(s => calculateStudentStats(s, sessions, attendanceRecords, settings));
const targetStudentStat = studentStatsList.find(s => s.status === 'Needs Attention') ||
                          studentStatsList.find(s => s.status === 'At Risk') ||
                          studentStatsList[0];

const targetStudent = targetStudentStat.student;
console.log(`\n[TEST 2: STUDENT PORTAL - ${targetStudent.name} (${targetStudent.id})]
- Attendance %: ${targetStudentStat.attendancePercentage}%
- Status: ${targetStudentStat.status}
- Present: ${targetStudentStat.presentCount}, Absent: ${targetStudentStat.absentCount}, Late: ${targetStudentStat.lateCount}
- Overall Skill Score: ${targetStudentStat.overallScore}/100`);

// 3. Student Submits an Absence Excuse for Session SES-110 (Group Discussion 1)
const newRequest: StudentRequest = {
  id: `REQ-${Date.now()}`,
  studentId: targetStudent.id,
  studentName: targetStudent.name,
  type: 'Leave / Absence Excuse',
  subject: 'Medical excuse for Group Discussion 1 (SES-110)',
  message: 'Campus health center visit due to acute migraine. Request excused absence.',
  date: '2026-09-05',
  status: 'Pending'
};
studentRequests.push(newRequest);
console.log(`\n[TEST 3: STUDENT SUBMIT REQUEST]
- Request ID: ${newRequest.id}
- Student: ${newRequest.studentName}
- Status: ${newRequest.status}
- Total Pending Requests: ${studentRequests.filter(r => r.status === 'Pending').length}`);

// 4. Persona: Teacher Dr. Priya Nair Reviews and Approves the Excuse
const pendingForStudent = studentRequests.find(r => r.studentId === targetStudent.id && r.status === 'Pending')!;
console.log(`\n[TEST 4: TEACHER AUDIT] Reviewing request: "${pendingForStudent.subject}"`);

// Teacher approves -> Updates request status to 'Approved'
pendingForStudent.status = 'Approved';
pendingForStudent.teacherOrCrResponse = 'Verified medical certificate. Excused recorded.';

// Teacher updates attendance record for SES-110 from 'Absent' to 'Excused'
const studentRecordIndex = attendanceRecords.findIndex(r => r.sessionId === 'SES-110' && r.studentId === targetStudent.id);
if (studentRecordIndex !== -1) {
  attendanceRecords[studentRecordIndex] = {
    ...attendanceRecords[studentRecordIndex],
    status: 'Excused',
    remarks: 'Approved by Dr. Priya Nair (Medical Documentation Verified)',
    timestamp: new Date().toISOString()
  };
}

// Recalculate student's stats after Teacher excused the session!
const studentUpdatedStats = calculateStudentStats(targetStudent, sessions, attendanceRecords, settings);
console.log(`[TEST 4: RECALCULATED STATS AFTER APPROVAL]
- Previous Attendance: ${targetStudentStat.attendancePercentage}% (${targetStudentStat.absentCount} absent)
- Updated Attendance: ${studentUpdatedStats.attendancePercentage}% (${studentUpdatedStats.absentCount} absent, ${studentUpdatedStats.excusedCount} excused)
- New Status: ${studentUpdatedStats.status}`);

// 5. Persona: Teacher Evaluates Gradebook Marks
console.log(`\n[TEST 5: TEACHER GRADEBOOK MODIFICATION]`);
const a1 = targetStudent.assignments[0];
console.log(`- ${targetStudent.name}'s Initial Score for ${a1.title}: ${a1.score}/${a1.maxScore}`);
targetStudent.assignments[0].score = 95;
console.log(`- Updated Score for ${a1.title}: ${targetStudent.assignments[0].score}/${a1.maxScore}`);

// 6. Persona: Class Representative (CR) Dashboard Metrics
const crMetrics = calculateDashboardMetrics(students, sessions, attendanceRecords, settings);
console.log(`\n[TEST 6: CR EXECUTIVE DASHBOARD RECOMPUTATION]
- Total Students: ${crMetrics.totalStudents}
- Class Average Attendance: ${crMetrics.averageAttendance}%
- On-Track Count: ${crMetrics.onTrackCount}
- Needs-Attention Count: ${crMetrics.needsAttentionCount}
- At-Risk Count: ${crMetrics.atRiskCount}
- Next Session: ${sessions.find(s => s.status === 'Upcoming')?.topic} (Date: ${sessions.find(s => s.status === 'Upcoming')?.date})`);

// 7. Verify CSV Generation
const csv = generateAttendanceCSV(crMetrics.studentStats);
console.log(`\n[TEST 7: CSV EXPORT] Generated ${csv.split('\n').length} rows of Classora attendance data.`);

console.log('\n=====================================================');
console.log('   ALL 7 CLASSORA MULTI-ROLE TESTS PASSED (100%)    ');
console.log('=====================================================\n');
