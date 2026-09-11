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

// Load existing seed data to preserve settings and sessions
const seedDataPath = path.join(__dirname, '..', 'server', 'data', 'seedData.json');
const existing = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));

// Generate official 44 students
const students = officialRoster.map((item, idx) => {
  // Deterministic realistic scores based on index
  const base = 75 + ((idx * 7) % 20); // between 75 and 94
  const comm = Math.min(98, Math.max(65, base + ((idx % 3) * 4) - 2));
  const gram = Math.min(96, Math.max(62, base - ((idx % 4) * 3) + 3));
  const voc = Math.min(98, Math.max(68, base + ((idx % 2) * 5) - 1));
  const pron = Math.min(95, Math.max(66, base + ((idx % 5) * 2) - 3));
  const part = Math.min(100, Math.max(70, base + ((idx % 3) * 6) - 4));
  const asg = Math.min(100, Math.max(72, base + ((idx % 4) * 3)));
  const assess = Math.min(98, Math.max(64, base - ((idx % 3) * 3) + 2));

  let level = 'Upper-Intermediate (B2)';
  if (base >= 88) level = 'Advanced (C1)';
  else if (base < 78) level = 'Intermediate (B1)';

  return {
    id: item.rollNo,
    rollNo: item.rollNo,
    name: item.name,
    phone: item.phone,
    email: item.email,
    batch: "English C - Term 1",
    group: item.group,
    joiningDate: "2026-08-01",
    currentLevel: level,
    initialRemarks: `Official SST 2026 Cohort • ${item.group} Member.`,
    avatar: "",
    lastActivity: "Just now",
    skills: {
      communication: comm,
      grammar: gram,
      vocabulary: voc,
      pronunciation: pron,
      participation: part,
      assignments: asg,
      assessments: assess
    },
    previousOverallScore: base - 2,
    assignments: [
      {
        id: "ASG-101",
        title: "Diagnostic Baseline Fluency Assessment",
        dueDate: "2026-08-06",
        status: "Graded",
        score: Math.min(100, base - 3),
        maxScore: 100
      },
      {
        id: "ASG-102",
        title: "Tenses Mastery & Sentence Construction Quiz",
        dueDate: "2026-08-20",
        status: "Graded",
        score: Math.min(100, gram + 2),
        maxScore: 100
      },
      {
        id: "ASG-103",
        title: "Elevator Pitch & Self-Introduction Video",
        dueDate: "2026-09-01",
        status: "Graded",
        score: Math.min(100, comm + 1),
        maxScore: 100
      },
      {
        id: "ASG-104",
        title: "Group Discussion 1 Synthesis & Rebuttal Memo",
        dueDate: "2026-09-08",
        status: idx % 5 === 0 ? "Submitted" : "Graded",
        score: idx % 5 === 0 ? null : Math.min(100, base + 1),
        maxScore: 100
      }
    ],
    crRemarks: [
      {
        id: `RMK-10${idx}`,
        date: "2026-08-15",
        author: "Aarav (Lead CR)",
        text: `Active participant in ${item.group} collaborative discussions.`
      }
    ],
    historicalScores: [
      { date: "2026-08-07", overallScore: base - 4, communication: comm - 3, grammar: gram - 4, vocabulary: voc - 3 },
      { date: "2026-08-21", overallScore: base - 2, communication: comm - 1, grammar: gram - 2, vocabulary: voc - 1 },
      { date: "2026-09-04", overallScore: base, communication: comm, grammar: gram, vocabulary: voc }
    ],
    isArchived: false
  };
});

// Update settings batches & groups
const settings = {
  ...existing.initialSettings,
  batches: [
    "English C - Term 1",
    "Batch A - Morning",
    "Batch B - Afternoon"
  ],
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

// Sessions: update batch name to match "English C - Term 1"
const sessions = existing.initialSessions.map(s => ({
  ...s,
  batch: "English C - Term 1"
}));

// Generate attendance records for all 44 students across all conducted sessions
const attendanceRecords = [];
const conductedSessions = sessions.filter(s => s.status === 'Completed');

conductedSessions.forEach(session => {
  students.forEach((student, sIdx) => {
    // Generate realistic attendance pattern:
    // ~88% present, a few students have specific attendance patterns to provide realistic CR tracking
    let status = 'Present';
    let remarks = '';

    // Student specific realism:
    // Divyanshika Sharma (at risk scenario: missed 3 sessions)
    if (student.name === 'Divyanshika Sharma' && ['SES-103', 'SES-106', 'SES-109'].includes(session.id)) {
      status = 'Absent';
      remarks = 'Family function out of station';
    }
    // Anmol Kumar (needs attention scenario: missed 2 sessions)
    else if (student.name === 'Anmol Kumar' && ['SES-102', 'SES-107'].includes(session.id)) {
      status = 'Absent';
      remarks = 'Medical appointment';
    }
    // Yahoshuva Kesaboyina (stellar attendance, present with 1 late)
    else if (student.name === 'Yahoshuva Kesaboyina') {
      if (session.id === 'SES-105') {
        status = 'Late';
        remarks = 'Arrived 10 mins late due to lab transport delay';
      } else {
        status = 'Present';
      }
    }
    // Occasional late or absent for natural distribution
    else {
      const hash = (sIdx * 37 + parseInt(session.id.replace('SES-', '')) * 13) % 100;
      if (hash < 6) {
        status = 'Absent';
      } else if (hash < 12) {
        status = 'Late';
        remarks = 'Transit / bus delay';
      } else if (hash === 13) {
        status = 'Excused';
        remarks = 'On-duty event';
      }
    }

    attendanceRecords.push({
      sessionId: session.id,
      studentId: student.id,
      status,
      remarks,
      timestamp: `${session.date}T${session.startTime.includes('AM') ? '09:45:00.000Z' : '14:45:00.000Z'}`
    });
  });
});

// Follow-ups targeting realistic cases from the official roster
const followUps = [
  {
    id: "FLW-1001",
    studentId: "26bcs10093", // Divyanshika Sharma
    studentName: "Divyanshika Sharma",
    issueType: "Low Attendance",
    priority: "Urgent",
    dateIdentified: "2026-09-05",
    actionRequired: "Call student regarding 3 missed sessions (Attendance 70.0%). Coordinate extra doubt clearance with Dr. Priya Nair.",
    assignedTo: "Aarav (Lead CR)",
    deadline: "2026-09-12",
    status: "Pending",
    remarks: "Auto-rule threshold alert: Attendance below 75%.",
    isAutoGenerated: true
  },
  {
    id: "FLW-1002",
    studentId: "26bcs10068", // Anmol Kumar
    studentName: "Anmol Kumar",
    issueType: "Low Attendance",
    priority: "High",
    dateIdentified: "2026-09-04",
    actionRequired: "Verify missed session reason for SES-107 and collect excuse note.",
    assignedTo: "Aarav (Lead CR)",
    deadline: "2026-09-11",
    status: "In Progress",
    remarks: "Reached out on WhatsApp, awaiting medical slip.",
    isAutoGenerated: true
  },
  {
    id: "FLW-1003",
    studentId: "26bcs10296", // Yahoshuva Kesaboyina
    studentName: "Yahoshuva Kesaboyina",
    issueType: "Participation",
    priority: "Low",
    dateIdentified: "2026-09-06",
    actionRequired: "Invite as Group 5 Lead Speaker for Mock Interview panel.",
    assignedTo: "Aarav (Lead CR)",
    deadline: "2026-09-14",
    status: "Pending",
    remarks: "Top performer in Group Discussion 1.",
    isAutoGenerated: false
  }
];

// Student Requests
const studentRequests = [
  {
    id: "REQ-2001",
    studentId: "26bcs10093",
    studentName: "Divyanshika Sharma",
    type: "Leave / Absence Excuse",
    subject: "Medical Excuse for Lecture 9 (SES-109)",
    message: "Respected Ma'am, I had a severe migraine and visited the campus clinic on Sep 4th. Attached is my prescription from the health centre. Kindly excuse my absence.",
    date: "2026-09-05",
    status: "Pending"
  },
  {
    id: "REQ-2002",
    studentId: "26bcs10296",
    studentName: "Yahoshuva Kesaboyina",
    type: "Doubt / Query",
    subject: "Clarification on Conditionals Type 3 Worksheet",
    message: "Dear Dr. Priya Nair, I had a question on mixed conditionals in exercise 4. Could I clarify during office hours tomorrow?",
    date: "2026-09-08",
    status: "Approved",
    teacherOrCrResponse: "Certainly Yahoshuva, drop by Faculty Block 3 Room 304 between 3:30 and 4:30 PM tomorrow.",
    resolvedDate: "2026-09-08"
  },
  {
    id: "REQ-2003",
    studentId: "26bcs10424",
    studentName: "Aditya Shaw",
    type: "Assignment Extension",
    subject: "GD-1 Synthesis Submission Extension Request",
    message: "Requesting a 24-hour extension due to college hackathon participation.",
    date: "2026-09-07",
    status: "Pending"
  }
];

const newSeedData = {
  initialSettings: settings,
  initialSessions: sessions,
  initialStudents: students,
  initialAttendanceRecords: attendanceRecords,
  initialFollowUps: followUps,
  initialTasks: existing.initialTasks,
  initialStudentRequests: studentRequests
};

fs.writeFileSync(seedDataPath, JSON.stringify(newSeedData, null, 2), 'utf8');
console.log(`[Success] server/data/seedData.json updated with ${students.length} official students and ${attendanceRecords.length} attendance records across ${sessions.length} sessions.`);
