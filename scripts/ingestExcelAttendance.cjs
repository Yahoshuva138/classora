const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
require('dotenv').config();
const mongoose = require('mongoose');

const excelPath = path.join(__dirname, '../Attendance report/instructor-attendance-sheet_total_members.xlsx');
if (!fs.existsSync(excelPath)) {
  console.error('❌ Attendance sheet not found at:', excelPath);
  process.exit(1);
}

const wb = XLSX.readFile(excelPath);
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet);
console.log('📊 Found ' + rows.length + ' student rows in Excel.');

const officialSessions = [
  {
    id: 'SES-101',
    topic: 'English Test_C',
    date: '2026-08-04',
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    faculty: 'Noor Nigar (Course Instructor)',
    batch: 'English C - Term 1',
    mode: 'Offline',
    location: 'Examination Hall 1',
    status: 'Completed',
    notes: 'Diagnostic baseline fluency, syntax, and placement assessment.',
    sessionType: 'Assessment & Mock Interview'
  },
  {
    id: 'SES-102',
    topic: 'Speed Friending',
    date: '2026-08-07',
    startTime: '02:30 PM',
    endTime: '04:00 PM',
    faculty: 'Noor Nigar (Course Instructor)',
    batch: 'English C - Term 1',
    mode: 'Offline',
    location: 'Seminar Hall B',
    status: 'Completed',
    notes: 'Icebreaking, elevator conversations, and spontaneous introduction.',
    sessionType: 'Communication Lab'
  },
  {
    id: 'SES-103',
    topic: 'Tenses and Impromptu Speeches',
    date: '2026-08-12',
    startTime: '09:30 AM',
    endTime: '11:00 AM',
    faculty: 'Noor Nigar (Course Instructor)',
    batch: 'English C - Term 1',
    mode: 'Offline',
    location: 'Language Lab 101',
    status: 'Completed',
    notes: 'Oral fluency drill, impromptu speech delivery, and tense accuracy.',
    sessionType: 'Grammar & Syntax'
  },
  {
    id: 'SES-104',
    topic: 'Tenses and Impromtu Speeches II',
    date: '2026-08-14',
    startTime: '11:30 AM',
    endTime: '01:00 PM',
    faculty: 'Noor Nigar (Course Instructor)',
    batch: 'English C - Term 1',
    mode: 'Offline',
    location: 'Language Lab 102',
    status: 'Completed',
    notes: 'Spontaneous narrative construction and complex tense consistency.',
    sessionType: 'Pronunciation Lab'
  },
  {
    id: 'SES-105',
    topic: 'Tenses-3',
    date: '2026-08-19',
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    faculty: 'Noor Nigar (Course Instructor)',
    batch: 'English C - Term 1',
    mode: 'Offline',
    location: 'Audio Lab 2',
    status: 'Completed',
    notes: 'Compound, perfect, and conditional tenses in formal academic discourse.',
    sessionType: 'Grammar & Syntax'
  },
  {
    id: 'SES-106',
    topic: 'Understanding Everyday English Conversations 1',
    date: '2026-08-21',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    faculty: 'Noor Nigar (Course Instructor)',
    batch: 'English C - Term 1',
    mode: 'Offline',
    location: 'Room 204',
    status: 'Completed',
    notes: 'Listening comprehension from dialogue audio, colloquial expressions, and role-play.',
    sessionType: 'Communication Lab'
  },
  {
    id: 'SES-107',
    topic: 'Understanding Everyday English Conversations 2',
    date: '2026-09-02',
    startTime: '09:30 AM',
    endTime: '11:00 AM',
    faculty: 'Noor Nigar (Course Instructor)',
    batch: 'English C - Term 1',
    mode: 'Offline',
    location: 'Auditorium 3',
    status: 'Completed',
    notes: 'Idiomatic phrasing, register switching (formal vs informal), and active rebuttal.',
    sessionType: 'Communication Lab'
  },
  {
    id: 'SES-108',
    topic: "Students' Presentation",
    date: '2026-09-04',
    startTime: '11:30 AM',
    endTime: '01:00 PM',
    faculty: 'Noor Nigar (Course Instructor)',
    batch: 'English C - Term 1',
    mode: 'Offline',
    location: 'Seminar Hall A',
    status: 'Completed',
    notes: 'Individual presentation delivery, body language, and slide structure critique.',
    sessionType: 'Assessment & Mock Interview'
  },
  {
    id: 'SES-109',
    topic: 'Group Discussion 1',
    date: '2026-09-04',
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    faculty: 'Noor Nigar (Course Instructor)',
    batch: 'English C - Term 1',
    mode: 'Offline',
    location: 'Language Lab 102',
    status: 'Completed',
    notes: 'Moderated team debates, argumentation, consensus building, and turn management.',
    sessionType: 'Group Discussion'
  },
  {
    id: 'SES-110',
    topic: 'Conditionals',
    date: '2026-09-09',
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    faculty: 'Noor Nigar (Course Instructor)',
    batch: 'English C - Term 1',
    mode: 'Offline',
    location: 'Language Lab 102',
    status: 'In Progress',
    notes: 'Zero, first, second, and third conditionals in formal professional discourse.',
    sessionType: 'Grammar & Syntax'
  },
  {
    id: 'SES-111',
    topic: 'Listening for Understanding',
    date: '2026-09-11',
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    faculty: 'Noor Nigar (Course Instructor)',
    batch: 'English C - Term 1',
    mode: 'Offline',
    location: 'Language Lab 102',
    status: 'Upcoming',
    notes: 'Academic lecture note-taking, Cornell method, auditory comprehension.',
    sessionType: 'Communication Lab'
  },
  {
    id: 'SES-112',
    topic: 'Advanced Conditionals & Negotiation Lab',
    date: '2026-09-15',
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    faculty: 'Noor Nigar (Course Instructor)',
    batch: 'English C - Term 1',
    mode: 'Offline',
    location: 'Language Lab 102',
    status: 'Upcoming',
    notes: 'Mixed conditionals, counter-argumentation, and corporate negotiation tactics.',
    sessionType: 'Communication Lab'
  }
];

const colMap = [
  { match: 'Speed Friending', sessionId: 'SES-102', date: '2026-08-07' },
  { match: 'Impromptu Speeches', sessionId: 'SES-103', alt: '12 Aug', date: '2026-08-12' },
  { match: 'Impromtu Speeches II', sessionId: 'SES-104', alt: '14 Aug', date: '2026-08-14' },
  { match: 'Tenses-3', sessionId: 'SES-105', alt: '19 Aug', date: '2026-08-19' },
  { match: 'Conversations 1', sessionId: 'SES-106', alt: '21 Aug', date: '2026-08-21' },
  { match: 'Conversations 2', sessionId: 'SES-107', alt: '02 Sept', date: '2026-09-02' },
  { match: 'Presentation', sessionId: 'SES-108', date: '2026-09-04' },
  { match: 'Group Discussion 1', sessionId: 'SES-109', date: '2026-09-04' }
];

const keys = Object.keys(rows[0]);
const attendanceRecords = [];
let pCount = 0, aCount = 0, lCount = 0;

rows.forEach(r => {
  const rollNo = (r['Roll No'] || '').toString().trim().toLowerCase();
  if (!rollNo) return;

  colMap.forEach(cm => {
    const key = keys.find(k => k.includes(cm.match) || (cm.alt && k.includes(cm.alt)));
    if (!key) return;

    const rawVal = (r[key] || '').toString().trim().toUpperCase();
    if (rawVal === 'P' || rawVal === 'A' || rawVal === 'L') {
      let status = 'Present';
      if (rawVal === 'P') { status = 'Present'; pCount++; }
      else if (rawVal === 'A') { status = 'Absent'; aCount++; }
      else if (rawVal === 'L') { status = 'Late'; lCount++; }

      attendanceRecords.push({
        sessionId: cm.sessionId,
        studentId: rollNo,
        status,
        timestamp: cm.date + 'T10:00:00.000Z',
        remarks: 'Official instructor report mark'
      });
    }
  });
});

colMap.forEach(cm => {
  attendanceRecords.push({
    sessionId: cm.sessionId,
    studentId: '26bcs10718',
    status: 'Excused',
    timestamp: cm.date + 'T10:00:00.000Z',
    remarks: 'Late Admission (Enrolled post-commencement)'
  });
});

console.log('✅ Extracted ' + attendanceRecords.length + ' authentic attendance records.');
console.log('   Present: ' + pCount + ', Absent: ' + aCount + ', Late: ' + lCount + ', Excused: 8');
const cohortPct = ((pCount + 0.5 * lCount) / (pCount + aCount + lCount) * 100).toFixed(1);
console.log('   Cohort Attendance Rate: ' + cohortPct + '%');

// 1. Update server/data/seedData.json
const seedPath = path.join(__dirname, '../server/data/seedData.json');
if (fs.existsSync(seedPath)) {
  const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  seed.initialSessions = officialSessions;
  seed.initialAttendanceRecords = attendanceRecords;
  fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2), 'utf8');
  console.log('✅ Updated server/data/seedData.json');
}

// 2. Update server/data/persistedStore.json
const persistPath = path.join(__dirname, '../server/data/persistedStore.json');
if (fs.existsSync(persistPath)) {
  const store = JSON.parse(fs.readFileSync(persistPath, 'utf8'));
  store.sessions = officialSessions;
  store.attendance = attendanceRecords;
  store.attendancerecords = attendanceRecords;
  fs.writeFileSync(persistPath, JSON.stringify(store, null, 2), 'utf8');
  console.log('✅ Updated server/data/persistedStore.json');
}

// 3. Update src/data/mockData.ts
const mockPath = path.join(__dirname, '../src/data/mockData.ts');
if (fs.existsSync(mockPath)) {
  let mockContent = fs.readFileSync(mockPath, 'utf8');
  const sessionsRegex = /export const initialSessions: Session\[\] = \[[\s\S]*?\];/;
  const sessionsReplacement = 'export const initialSessions: Session[] = ' + JSON.stringify(officialSessions, null, 2) + ';';
  mockContent = mockContent.replace(sessionsRegex, sessionsReplacement);

  const attendanceRegex = /export const initialAttendanceRecords: AttendanceRecord\[\] = \[[\s\S]*?\];/;
  const attendanceReplacement = 'export const initialAttendanceRecords: AttendanceRecord[] = ' + JSON.stringify(attendanceRecords, null, 2) + ';';
  mockContent = mockContent.replace(attendanceRegex, attendanceReplacement);

  fs.writeFileSync(mockPath, mockContent, 'utf8');
  console.log('✅ Updated src/data/mockData.ts');
}

// 4. Update MongoDB Atlas
async function syncToAtlas() {
  if (!process.env.MONGODB_URI) {
    console.warn('⚠️ No MONGODB_URI in environment, skipping Atlas update.');
    return;
  }
  try {
    console.log('🔄 Connecting to MongoDB Atlas to persist attendance...');
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    await db.collection('sessions').deleteMany({});
    await db.collection('sessions').insertMany(officialSessions);
    console.log('✅ MongoDB Atlas: Synced ' + officialSessions.length + ' sessions.');

    await db.collection('attendancerecords').deleteMany({});
    await db.collection('attendancerecords').insertMany(attendanceRecords);
    console.log('✅ MongoDB Atlas: Synced ' + attendanceRecords.length + ' attendance records.');

    await mongoose.disconnect();
    console.log('🔒 Disconnected from MongoDB Atlas.');
  } catch (err) {
    console.error('❌ Atlas sync error:', err.message);
  }
}

syncToAtlas().then(() => {
  console.log('\n🎉 Official Attendance Data Ingestion Complete!');
  process.exit(0);
});
