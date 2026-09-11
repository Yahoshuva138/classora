const fs = require('fs');
const path = require('path');

const officialRoster = [
  { name: "Abhiram Wayakar", email: "abhiram.26bcs10535@sst.scaler.com", rollNo: "26bcs10535", group: "Group 2", phone: "+91 98451 10535" },
  { name: "Adapa Ramcharan Tej", email: "adapa.26bcs10283@sst.scaler.com", rollNo: "26bcs10283", group: "Group 6", phone: "+91 98451 10283" },
  { name: "Aditya Mohite", email: "aditya.26bcs10438@sst.scaler.com", rollNo: "26bcs10438", group: "Group 3", phone: "+91 98451 10438" },
  { name: "Aditya Shaw", email: "aditya.26bcs10424@sst.scaler.com", rollNo: "26bcs10424", group: "Group 1", phone: "+91 98451 10424" },
  { name: "Aditya sinh Upendrasinh Gohil", email: "adityasinh.26bcs10624@sst.scaler.com", rollNo: "26bcs10624", group: "Group 7", phone: "+91 98451 10624" },
  { name: "Anmol Kumar", email: "anmol.26bcs10068@sst.scaler.com", rollNo: "26bcs10068", group: "Group 1", phone: "+91 98451 10068" },
  { name: "Ashirvad Srivastava", email: "ashirvad.26bcs10462@sst.scaler.com", rollNo: "26bcs10462", group: "Group 2", phone: "+91 98451 10462" },
  { name: "Ashuvardhan Parsha", email: "ashuvardhan.26bcs10477@sst.scaler.com", rollNo: "26bcs10477", group: "Group 1", phone: "+91 98451 10477" },
  { name: "Bhavya Jain", email: "bhavya.26bcs10565@sst.scaler.com", rollNo: "26bcs10565", group: "Group 7", phone: "+91 98451 10565" },
  { name: "Bhupen Yadav", email: "bhupen.26bcs10647@sst.scaler.com", rollNo: "26bcs10647", group: "Group 3", phone: "+91 98451 10647" },
  { name: "Dheeraj Choudhary", email: "dheeraj.26bcs10311@sst.scaler.com", rollNo: "26bcs10311", group: "Group 3", phone: "+91 98451 10311" },
  { name: "Divyanshika Sharma", email: "divyanshika.26bcs10093@sst.scaler.com", rollNo: "26bcs10093", group: "Group 6", phone: "+91 98451 10093" },
  { name: "Gongati Naga Varun Kumar", email: "gongati.26bcs10483@sst.scaler.com", rollNo: "26bcs10483", group: "Group 6", phone: "+91 98451 10483" },
  { name: "Govardhan Reddy Vangala", email: "govardhan.26bcs10036@sst.scaler.com", rollNo: "26bcs10036", group: "Group 2", phone: "+91 98451 10036" },
  { name: "Guruprasad Revannath Yadav", email: "guruprasad.26bcs10437@sst.scaler.com", rollNo: "26bcs10437", group: "Group 1", phone: "+91 98451 10437" },
  { name: "Ishan Kirpekar", email: "ishan.26bcs10269@sst.scaler.com", rollNo: "26bcs10269", group: "Group 5", phone: "+91 98451 10269" },
  { name: "Janani S", email: "janani.26bcs10409@sst.scaler.com", rollNo: "26bcs10409", group: "Group 3", phone: "+91 98451 10409" },
  { name: "Kabir Kwatra", email: "kabir.26bcs10443@sst.scaler.com", rollNo: "26bcs10443", group: "Group 7", phone: "+91 98451 10443" },
  { name: "Karpurapu Gokul", email: "karpurapu.26bcs10065@sst.scaler.com", rollNo: "26bcs10065", group: "Group 5", phone: "+91 98451 10065" },
  { name: "Madhira Nanda Kishore Reddy", email: "madhira.26bcs10478@sst.scaler.com", rollNo: "26bcs10478", group: "Group 5", phone: "+91 98451 10478" },
  { name: "Madireddy Vivekvardhan Reddy", email: "madireddy.26bcs10525@sst.scaler.com", rollNo: "26bcs10525", group: "Group 7", phone: "+91 98451 10525" },
  { name: "Majeti Vinayaka Subramanya Srinivasa", email: "majeti.26bcs10410@sst.scaler.com", rollNo: "26bcs10410", group: "Group 2", phone: "+91 98451 10410" },
  { name: "Pabbula Pranathi", email: "pabbula.26bcs10472@sst.scaler.com", rollNo: "26bcs10472", group: "Group 2", phone: "+91 98451 10472" },
  { name: "Panuganti Sricharan", email: "panuganti.26bcs10452@sst.scaler.com", rollNo: "26bcs10452", group: "Group 3", phone: "+91 98451 10452" },
  { name: "Pendyala Sri Vaishnav", email: "sri.26bcs10412@sst.scaler.com", rollNo: "26bcs10412", group: "Group 4", phone: "+91 98451 10412" },
  { name: "Piyush Mondal", email: "piyush.26bcs10401@sst.scaler.com", rollNo: "26bcs10401", group: "Group 7", phone: "+91 98451 10401" },
  { name: "Pradeep Dasari", email: "pradeep.26bcs10347@sst.scaler.com", rollNo: "26bcs10347", group: "Group 6", phone: "+91 98451 10347" },
  { name: "Prajjwal Pandey", email: "prajjwal.26bcs10457@sst.scaler.com", rollNo: "26bcs10457", group: "Group 6", phone: "+91 98451 10457" },
  { name: "Rahamtulla Mohammad", email: "rahamtulla.26bcs10323@sst.scaler.com", rollNo: "26bcs10323", group: "Group 6", phone: "+91 98451 10323" },
  { name: "Sai Pragneshwar Amani", email: "sai.26bcs10458@sst.scaler.com", rollNo: "26bcs10458", group: "Group 3", phone: "+91 98451 10458" },
  { name: "Satya Mukhesh Aravind Balla Balla", email: "satya.26bcs10121@sst.scaler.com", rollNo: "26bcs10121", group: "Group 5", phone: "+91 98451 10121" },
  { name: "Shashwat Mishra", email: "shashwat.26bcs10189@sst.scaler.com", rollNo: "26bcs10189", group: "Group 7", phone: "+91 98451 10189" },
  { name: "Shiwang Gupta", email: "shiwang.26bcs10648@sst.scaler.com", rollNo: "26bcs10648", group: "Group 4", phone: "+91 98451 10648" },
  { name: "Shreyansh Bhawsar Bhawsar", email: "shreyansh.26bcs10292@sst.scaler.com", rollNo: "26bcs10292", group: "Group 1", phone: "+91 98451 10292" },
  { name: "Shubh Soni", email: "shubh.26bcs10318@sst.scaler.com", rollNo: "26bcs10318", group: "Group 2", phone: "+91 98451 10318" },
  { name: "Siddhant Dubey", email: "siddhant.26bcs10516@sst.scaler.com", rollNo: "26bcs10516", group: "Group 4", phone: "+91 98451 10516" },
  { name: "Subhramanya Trivikrama Abhinav Devisetti", email: "subhramanya.26bcs10238@sst.scaler.com", rollNo: "26bcs10238", group: "Group 5", phone: "+91 98451 10238" },
  { name: "Tumati Jai Charan", email: "tumati.26bcs10404@sst.scaler.com", rollNo: "26bcs10404", group: "Group 4", phone: "+91 98451 10404" },
  { name: "Utkarsh Tiwari", email: "utkarsh.26bcs10512@sst.scaler.com", rollNo: "26bcs10512", group: "Group 6", phone: "+91 98451 10512" },
  { name: "Vinit Chauhan", email: "vinit.26bcs10521@sst.scaler.com", rollNo: "26bcs10521", group: "Group 4", phone: "+91 98451 10521" },
  { name: "Yahoshuva Kesaboyina", email: "yahoshuva.26bcs10296@sst.scaler.com", rollNo: "26bcs10296", group: "Group 5", phone: "+91 98451 10296" },
  { name: "Yashaswin Ankennapalli", email: "yashaswin.26bcs10450@sst.scaler.com", rollNo: "26bcs10450", group: "Group 5", phone: "+91 98451 10450" },
  { name: "Yugandhar Bhatlawande", email: "yugandhar.26bcs10664@sst.scaler.com", rollNo: "26bcs10664", group: "Group 4", phone: "+91 98451 10664" },
  { name: "Satwinderjeet Singh Sidhu", email: "satwinderjeet.26bcs10718@sst.scaler.com", rollNo: "26bcs10718", group: "Group 1", phone: "+91 98451 10718" }
];

const sessions = [
  {
    id: "SES-101",
    topic: "English Test_C",
    date: "2026-08-04",
    startTime: "11:00 AM",
    endTime: "12:30 PM",
    faculty: "Noor Nigar (Course Instructor)",
    batch: "English C - Term 1",
    mode: "Offline",
    location: "Examination Hall 1",
    status: "Upcoming",
    notes: "Diagnostic baseline fluency & grammar assessment.",
    sessionType: "Assessment & Mock Interview"
  },
  {
    id: "SES-102",
    topic: "Speed Friending",
    date: "2026-08-07",
    startTime: "02:30 PM",
    endTime: "04:00 PM",
    faculty: "Prof. Vikram Malhotra (Corporate Communication)",
    batch: "English C - Term 1",
    mode: "Offline",
    location: "Seminar Hall B",
    status: "Upcoming",
    notes: "Icebreaking & elevator conversations.",
    sessionType: "Communication Lab"
  },
  {
    id: "SES-103",
    topic: "Sentence Construction & Word Forms",
    date: "2026-08-11",
    startTime: "09:30 AM",
    endTime: "11:00 AM",
    faculty: "Ms. Ananya Roy (IELTS & Business English)",
    batch: "English C - Term 1",
    mode: "Offline",
    location: "Language Lab 101",
    status: "Upcoming",
    notes: "Syntax mapping, clause combination.",
    sessionType: "Grammar & Syntax"
  },
  {
    id: "SES-104",
    topic: "Introduction to Phonetics & IPA Symbols",
    date: "2026-08-14",
    startTime: "11:30 AM",
    endTime: "01:00 PM",
    faculty: "Noor Nigar (Course Instructor)",
    batch: "English C - Term 1",
    mode: "Offline",
    location: "Language Lab 102",
    status: "Upcoming",
    notes: "Vowel and consonant chart exploration.",
    sessionType: "Pronunciation Lab"
  },
  {
    id: "SES-105",
    topic: "Listening Comprehension Lab",
    date: "2026-08-18",
    startTime: "02:00 PM",
    endTime: "03:30 PM",
    faculty: "Mr. Arjun Das (Grammar & Syntax Expert)",
    batch: "English C - Term 1",
    mode: "Offline",
    location: "Audio Lab 2",
    status: "Upcoming",
    notes: "Note-taking from academic lecture audio.",
    sessionType: "Communication Lab"
  },
  {
    id: "SES-106",
    topic: "Tenses in Context & Time Markers",
    date: "2026-08-21",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    faculty: "Ms. Ananya Roy (IELTS & Business English)",
    batch: "English C - Term 1",
    mode: "Offline",
    location: "Room 204",
    status: "Upcoming",
    notes: "Past simple vs. present perfect.",
    sessionType: "Grammar & Syntax"
  },
  {
    id: "SES-107",
    topic: "Elevator Pitch & Self Introduction",
    date: "2026-08-25",
    startTime: "09:30 AM",
    endTime: "11:00 AM",
    faculty: "Prof. Vikram Malhotra (Corporate Communication)",
    batch: "English C - Term 1",
    mode: "Offline",
    location: "Auditorium 3",
    status: "Upcoming",
    notes: "Individual 60-second video introductions.",
    sessionType: "Assessment & Mock Interview"
  },
  {
    id: "SES-108",
    topic: "Active Listening & Note-Taking",
    date: "2026-08-28",
    startTime: "11:30 AM",
    endTime: "01:00 PM",
    faculty: "Mr. Arjun Das (Grammar & Syntax Expert)",
    batch: "English C - Term 1",
    mode: "Offline",
    location: "Room 204",
    status: "Upcoming",
    notes: "Cornell note-taking method.",
    sessionType: "Vocabulary Building"
  },
  {
    id: "SES-109",
    topic: "Email Etiquette & Professional Correspondence",
    date: "2026-09-01",
    startTime: "02:00 PM",
    endTime: "03:30 PM",
    faculty: "Ms. Ananya Roy (IELTS & Business English)",
    batch: "English C - Term 1",
    mode: "Offline",
    location: "Computer Lab 4",
    status: "Upcoming",
    notes: "Formal vs. informal registers.",
    sessionType: "Communication Lab"
  },
  {
    id: "SES-110",
    topic: "Group Discussion 1 & Debate",
    date: "2026-09-04",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    faculty: "Noor Nigar (Course Instructor)",
    batch: "English C - Term 1",
    mode: "Offline",
    location: "Seminar Hall A",
    status: "Upcoming",
    notes: "Group discussion moderation, turn management, and active rebuttal.",
    sessionType: "Group Discussion"
  },
  {
    id: "SES-111",
    topic: "Conditionals",
    date: "2026-09-09",
    startTime: "02:00 PM",
    endTime: "03:30 PM",
    faculty: "Noor Nigar (Course Instructor)",
    batch: "English C - Term 1",
    mode: "Offline",
    location: "Language Lab 102",
    status: "Upcoming",
    notes: "Zero, first, second, and third conditionals in formal discourse.",
    sessionType: "Grammar & Syntax"
  },
  {
    id: "SES-112",
    topic: "Advanced Conditionals & Negotiation Lab",
    date: "2026-09-11",
    startTime: "02:00 PM",
    endTime: "03:30 PM",
    faculty: "Prof. Vikram Malhotra (Corporate Communication)",
    batch: "English C - Term 1",
    mode: "Offline",
    location: "Language Lab 102",
    status: "Upcoming",
    notes: "Mixed conditionals & real-time counter-arguments.",
    sessionType: "Communication Lab"
  }
];

const settings = {
  onTrackThreshold: 85,
  needsAttentionThreshold: 70,
  atRiskThreshold: 70,
  lateAttendanceWeight: 0.5,
  scoringScale: "100",
  batches: [
    "English C - Term 1",
    "Batch A - Morning",
    "Batch B - Afternoon"
  ],
  facultyList: [
    "Noor Nigar (Course Instructor)",
    "Prof. Vikram Malhotra (Corporate Communication)",
    "Ms. Ananya Roy (IELTS & Business English)",
    "Mr. Arjun Das (Grammar & Syntax Expert)"
  ],
  sessionTypes: [
    "Communication Lab",
    "Grammar & Syntax",
    "Vocabulary Building",
    "Pronunciation Lab",
    "Group Discussion",
    "Assessment & Mock Interview"
  ],
  notifications: {
    lowAttendanceAlerts: true,
    followUpReminders: true,
    sessionReminders: true,
    taskReminders: true
  },
  groups: [
    "Group 1",
    "Group 2",
    "Group 3",
    "Group 4",
    "Group 5",
    "Group 6",
    "Group 7"
  ]
};

// Generate clean real-time student objects (NO demo scores!)
const students = officialRoster.map(item => {
  return {
    id: item.rollNo,
    rollNo: item.rollNo,
    name: item.name,
    email: item.email,
    phone: item.phone,
    batch: "English C - Term 1",
    discussionGroup: item.group,
    group: item.group,
    avatar: "",
    joiningDate: "2026-08-01",
    currentLevel: "Intermediate (B1)",
    initialRemarks: "",
    lastActivity: "Ready for live attendance",
    skills: {
      communication: 0,
      grammar: 0,
      vocabulary: 0,
      pronunciation: 0,
      participation: 0,
      assignments: 0,
      assessments: 0
    },
    previousOverallScore: 0,
    assignments: [
      {
        id: "ASG-101",
        title: "Diagnostic Baseline Fluency Assessment",
        dueDate: "2026-08-06",
        status: "Pending",
        score: null,
        maxScore: 25
      },
      {
        id: "ASG-102",
        title: "Tenses Mastery & Sentence Construction Quiz",
        dueDate: "2026-08-20",
        status: "Pending",
        score: null,
        maxScore: 20
      },
      {
        id: "ASG-103",
        title: "Elevator Pitch & Self-Introduction Video",
        dueDate: "2026-09-01",
        status: "Pending",
        score: null,
        maxScore: 25
      },
      {
        id: "ASG-104",
        title: "Group Discussion 1 Synthesis & Rebuttal Memo",
        dueDate: "2026-09-08",
        status: "Pending",
        score: null,
        maxScore: 30
      }
    ],
    crRemarks: [],
    historicalScores: []
  };
});

const DEFAULT_COHORT_PASSWORD = 'SST@2026';

const users = [
  {
    id: 'goog-admin',
    name: 'Course Administrator',
    email: 'admin@sst.scaler.com',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    personaKey: 'super_admin',
    isGoogleAuthenticated: true,
    password: DEFAULT_COHORT_PASSWORD,
    isRegistered: true,
    mustChangePassword: true
  },
  {
    id: 'goog-faculty',
    name: 'Noor Nigar',
    email: 'noor.nigar@scaler.com',
    role: 'Teacher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    personaKey: 'coordinator_faculty',
    isGoogleAuthenticated: true,
    password: DEFAULT_COHORT_PASSWORD,
    isRegistered: true,
    mustChangePassword: true
  },
  {
    id: 'goog-faculty-sst',
    name: 'Noor Nigar',
    email: 'noor.nigar@sst.scaler.com',
    role: 'Teacher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    personaKey: 'coordinator_faculty_sst',
    isGoogleAuthenticated: true,
    password: DEFAULT_COHORT_PASSWORD,
    isRegistered: true,
    mustChangePassword: true
  },
  {
    id: 'goog-cr',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@sst.scaler.com',
    role: 'CR',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    personaKey: 'lead_cr',
    isGoogleAuthenticated: true,
    password: DEFAULT_COHORT_PASSWORD,
    isRegistered: true,
    mustChangePassword: true
  },
  {
    id: 'goog-26bcs10296',
    name: 'Yahoshuva Kesaboyina',
    email: 'yahoshuva.26bcs10296@sst.scaler.com',
    role: 'Admin',
    studentId: '26bcs10296',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    personaKey: 'primary_admin_yahoshuva',
    isGoogleAuthenticated: true,
    password: DEFAULT_COHORT_PASSWORD,
    isRegistered: true,
    mustChangePassword: true
  },
  ...students.filter(s => s.id !== '26bcs10296').map(s => ({
    id: `usr_${s.id}`,
    name: s.name,
    email: s.email,
    role: 'Student',
    studentId: s.id,
    avatar: '',
    personaKey: `student_${s.id}`,
    isGoogleAuthenticated: true,
    password: DEFAULT_COHORT_PASSWORD,
    isRegistered: true,
    registeredAt: new Date().toISOString(),
    mustChangePassword: true
  }))
];

const activityLogs = [
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

// Write seedData.json
const seedData = {
  initialSettings: settings,
  initialSessions: sessions,
  initialStudents: students,
  initialAttendanceRecords: [], // NO DEMO ATTENDANCE
  initialFollowUps: [],         // NO DEMO FOLLOWUPS
  initialTasks: [],             // NO DEMO TASKS
  initialStudentRequests: []    // NO DEMO REQUESTS
};

const seedPath = path.join(__dirname, '../server/data/seedData.json');
fs.writeFileSync(seedPath, JSON.stringify(seedData, null, 2), 'utf8');

// Write persistedStore.json
const storeData = {
  settings: [{ singletonKey: 'GLOBAL_SETTINGS', ...settings }],
  sessions,
  students,
  attendance: [],               // NO DEMO ATTENDANCE
  followups: [],                // NO DEMO FOLLOWUPS
  tasks: [],                    // NO DEMO TASKS
  requests: [],                 // NO DEMO REQUESTS
  users,
  activitylogs: activityLogs
};

const storePath = path.join(__dirname, '../server/data/persistedStore.json');
fs.writeFileSync(storePath, JSON.stringify(storeData, null, 2), 'utf8');

// Write src/data/mockData.ts
const mockDataTs = `import { Student, Session, AttendanceRecord, FollowUp, CRTask, AppSettings, StudentRequest } from '../types';

export const initialSettings: AppSettings = ${JSON.stringify(settings, null, 2)};

export const initialSessions: Session[] = ${JSON.stringify(sessions, null, 2)};

export const initialStudents: Student[] = ${JSON.stringify(students, null, 2)};

export const initialAttendanceRecords: AttendanceRecord[] = [];

export const initialFollowUps: FollowUp[] = [];

export const initialTasks: CRTask[] = [];

export const initialStudentRequests: StudentRequest[] = [];
`;

const mockDataPath = path.join(__dirname, '../src/data/mockData.ts');
fs.writeFileSync(mockDataPath, mockDataTs, 'utf8');

console.log('✅ Demo data successfully removed! Real-time clean state initialized.');
console.log('Students:', students.length);
console.log('Sessions:', sessions.length);
console.log('Users:', users.length);
console.log('Attendance records: 0 (Pure Real-Time)');
console.log('Tasks: 0');
console.log('Followups: 0');
console.log('Requests: 0');
