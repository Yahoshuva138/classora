import {
  Student,
  Session,
  AttendanceRecord,
  FollowUp,
  CRTask,
  AppSettings,
  StudentRequest
} from '../types';

export const initialSettings: AppSettings = {
  "onTrackThreshold": 85,
  "needsAttentionThreshold": 70,
  "atRiskThreshold": 70,
  "lateAttendanceWeight": 0.5,
  "scoringScale": "100",
  "batches": [
    "English C - Term 1",
    "Batch A - Morning",
    "Batch B - Afternoon"
  ],
  "facultyList": [
    "Dr. Priya Nair (Phonetics & Linguistics)",
    "Prof. Vikram Malhotra (Corporate Communication)",
    "Ms. Ananya Roy (IELTS & Business English)",
    "Mr. Arjun Das (Grammar & Syntax Expert)"
  ],
  "sessionTypes": [
    "Communication Lab",
    "Grammar & Syntax",
    "Vocabulary Building",
    "Pronunciation Lab",
    "Group Discussion",
    "Assessment & Mock Interview"
  ],
  "notifications": {
    "lowAttendanceAlerts": true,
    "followUpReminders": true,
    "sessionReminders": true,
    "taskReminders": true
  },
  "groups": [
    "Group 1",
    "Group 2",
    "Group 3",
    "Group 4",
    "Group 5",
    "Group 6",
    "Group 7"
  ]
};

export const initialSessions: Session[] = [
  {
    "id": "SES-101",
    "topic": "English Test_C",
    "date": "2026-08-04",
    "startTime": "11:00 AM",
    "endTime": "12:30 PM",
    "faculty": "Dr. Priya Nair (Phonetics & Linguistics)",
    "batch": "English C - Term 1",
    "mode": "Offline",
    "location": "Examination Hall 1",
    "status": "Completed",
    "notes": "Diagnostic baseline fluency & grammar assessment (Score - 0/100).",
    "sessionType": "Assessment & Mock Interview"
  },
  {
    "id": "SES-102",
    "topic": "Speed Friending",
    "date": "2026-08-07",
    "startTime": "02:30 PM",
    "endTime": "04:00 PM",
    "faculty": "Prof. Vikram Malhotra (Corporate Communication)",
    "batch": "English C - Term 1",
    "mode": "Offline",
    "location": "Language Lab 102",
    "status": "Completed",
    "notes": "Conversational icebreaker activity. Lecture attendance 58.8%.",
    "sessionType": "Communication Lab"
  },
  {
    "id": "SES-103",
    "topic": "Tenses and Impromptu Speeches",
    "date": "2026-08-12",
    "startTime": "03:00 PM",
    "endTime": "04:30 PM",
    "faculty": "Mr. Arjun Das (Grammar & Syntax Expert)",
    "batch": "English C - Term 1",
    "mode": "Offline",
    "location": "Seminar Hall B",
    "status": "Completed",
    "notes": "Present and past tense dynamics with 60-second table topics.",
    "sessionType": "Grammar & Syntax"
  },
  {
    "id": "SES-104",
    "topic": "Tenses and Impromptu Speeches II",
    "date": "2026-08-14",
    "startTime": "02:00 PM",
    "endTime": "03:30 PM",
    "faculty": "Mr. Arjun Das (Grammar & Syntax Expert)",
    "batch": "English C - Term 1",
    "mode": "Offline",
    "location": "Language Lab 102",
    "status": "Completed",
    "notes": "Perfect and continuous tenses in formal speeches. 100.0% attendance.",
    "sessionType": "Grammar & Syntax"
  },
  {
    "id": "SES-105",
    "topic": "Tenses-3",
    "date": "2026-08-19",
    "startTime": "03:00 PM",
    "endTime": "04:30 PM",
    "faculty": "Mr. Arjun Das (Grammar & Syntax Expert)",
    "batch": "English C - Term 1",
    "mode": "Offline",
    "location": "Language Lab 102",
    "status": "Completed",
    "notes": "Advanced temporal structures and conditional clauses.",
    "sessionType": "Grammar & Syntax"
  },
  {
    "id": "SES-106",
    "topic": "Understanding Everyday English Conversations 1",
    "date": "2026-08-21",
    "startTime": "02:00 PM",
    "endTime": "03:30 PM",
    "faculty": "Ms. Ananya Roy (IELTS & Business English)",
    "batch": "English C - Term 1",
    "mode": "Hybrid",
    "location": "Language Lab 102 & Zoom",
    "status": "Completed",
    "notes": "Listening comprehension, colloquial nuances, and conversational turn-taking.",
    "sessionType": "Communication Lab"
  },
  {
    "id": "SES-107",
    "topic": "Understanding Everyday English Conversations 2",
    "date": "2026-09-02",
    "startTime": "03:00 PM",
    "endTime": "04:30 PM",
    "faculty": "Ms. Ananya Roy (IELTS & Business English)",
    "batch": "English C - Term 1",
    "mode": "Offline",
    "location": "Language Lab 102",
    "status": "Completed",
    "notes": "Advanced audio dialogue analysis and role-play drills. 84.8% attendance.",
    "sessionType": "Communication Lab"
  },
  {
    "id": "SES-108",
    "topic": "Tenses Quiz_C",
    "date": "2026-09-02",
    "startTime": "03:05 PM",
    "endTime": "04:00 PM",
    "faculty": "Mr. Arjun Das (Grammar & Syntax Expert)",
    "batch": "English C - Term 1",
    "mode": "Offline",
    "location": "Language Lab 102",
    "status": "Completed",
    "notes": "Timed online grammar quiz on all tense forms (Score - 0/100).",
    "sessionType": "Assessment & Mock Interview"
  },
  {
    "id": "SES-109",
    "topic": "Students' Presentation",
    "date": "2026-09-04",
    "startTime": "12:00 PM",
    "endTime": "01:30 PM",
    "faculty": "Prof. Vikram Malhotra (Corporate Communication)",
    "batch": "English C - Term 1",
    "mode": "Offline",
    "location": "Seminar Hall B",
    "status": "Completed",
    "notes": "Individual student presentations with slide delivery evaluation.",
    "sessionType": "Communication Lab"
  },
  {
    "id": "SES-110",
    "topic": "Group Discussion 1",
    "date": "2026-09-04",
    "startTime": "02:00 PM",
    "endTime": "03:30 PM",
    "faculty": "Prof. Vikram Malhotra (Corporate Communication)",
    "batch": "English C - Term 1",
    "mode": "Offline",
    "location": "Amphitheatre 1",
    "status": "Completed",
    "notes": "Group discussion moderation, turn management, and active rebuttal. 76.7% attendance.",
    "sessionType": "Group Discussion"
  },
  {
    "id": "SES-111",
    "topic": "Conditionals",
    "date": "2026-09-09",
    "startTime": "02:00 PM",
    "endTime": "03:30 PM",
    "faculty": "Dr. Priya Nair (Phonetics & Linguistics)",
    "batch": "English C - Term 1",
    "mode": "Offline",
    "location": "Language Lab 102",
    "status": "Upcoming",
    "notes": "Zero, first, second, and third conditionals in formal discourse.",
    "sessionType": "Grammar & Syntax"
  },
  {
    "id": "SES-112",
    "topic": "Advanced Conditionals & Negotiation Lab",
    "date": "2026-09-11",
    "startTime": "02:00 PM",
    "endTime": "03:30 PM",
    "faculty": "Prof. Vikram Malhotra (Corporate Communication)",
    "batch": "English C - Term 1",
    "mode": "Offline",
    "location": "Seminar Hall B",
    "status": "Upcoming",
    "notes": "Application of mixed conditionals in corporate business negotiation.",
    "sessionType": "Communication Lab"
  }
];

export const initialStudents: Student[] = [
  {
    "id": "26bcs10535",
    "rollNo": "26bcs10535",
    "name": "Abhiram Wayakar",
    "phone": "+91 98451 10535",
    "email": "abhiram.26bcs10535@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 2",
    "joiningDate": "2026-08-01",
    "currentLevel": "Intermediate (B1)",
    "initialRemarks": "Official SST 2026 Cohort • Group 2 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 73,
      "grammar": 78,
      "vocabulary": 74,
      "pronunciation": 72,
      "participation": 71,
      "assignments": 75,
      "assessments": 77
    },
    "previousOverallScore": 73,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 18,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 16,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 19,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Submitted",
        "score": null,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-100",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 2 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 71,
        "communication": 70,
        "grammar": 74,
        "vocabulary": 71
      },
      {
        "date": "2026-08-21",
        "overallScore": 73,
        "communication": 72,
        "grammar": 76,
        "vocabulary": 73
      },
      {
        "date": "2026-09-04",
        "overallScore": 75,
        "communication": 73,
        "grammar": 78,
        "vocabulary": 74
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10283",
    "rollNo": "26bcs10283",
    "name": "Adapa Ramcharan Tej",
    "phone": "+91 98451 10283",
    "email": "adapa.26bcs10283@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 6",
    "joiningDate": "2026-08-01",
    "currentLevel": "Upper-Intermediate (B2)",
    "initialRemarks": "Official SST 2026 Cohort • Group 6 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 84,
      "grammar": 82,
      "vocabulary": 86,
      "pronunciation": 81,
      "participation": 84,
      "assignments": 85,
      "assessments": 81
    },
    "previousOverallScore": 80,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 20,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 17,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 21,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 25,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-101",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 6 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 78,
        "communication": 81,
        "grammar": 78,
        "vocabulary": 83
      },
      {
        "date": "2026-08-21",
        "overallScore": 80,
        "communication": 83,
        "grammar": 80,
        "vocabulary": 85
      },
      {
        "date": "2026-09-04",
        "overallScore": 82,
        "communication": 84,
        "grammar": 82,
        "vocabulary": 86
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10438",
    "rollNo": "26bcs10438",
    "name": "Aditya Mohite",
    "phone": "+91 98451 10438",
    "email": "aditya.26bcs10438@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 3",
    "joiningDate": "2026-08-01",
    "currentLevel": "Advanced (C1)",
    "initialRemarks": "Official SST 2026 Cohort • Group 3 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 95,
      "grammar": 86,
      "vocabulary": 88,
      "pronunciation": 90,
      "participation": 97,
      "assignments": 95,
      "assessments": 85
    },
    "previousOverallScore": 87,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 22,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 18,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 24,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 27,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-102",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 3 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 85,
        "communication": 92,
        "grammar": 82,
        "vocabulary": 85
      },
      {
        "date": "2026-08-21",
        "overallScore": 87,
        "communication": 94,
        "grammar": 84,
        "vocabulary": 87
      },
      {
        "date": "2026-09-04",
        "overallScore": 89,
        "communication": 95,
        "grammar": 86,
        "vocabulary": 88
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10424",
    "rollNo": "26bcs10424",
    "name": "Aditya Shaw",
    "phone": "+91 98451 10424",
    "email": "aditya.26bcs10424@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 1",
    "joiningDate": "2026-08-01",
    "currentLevel": "Intermediate (B1)",
    "initialRemarks": "Official SST 2026 Cohort • Group 1 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 74,
      "grammar": 70,
      "vocabulary": 80,
      "pronunciation": 79,
      "participation": 72,
      "assignments": 85,
      "assessments": 78
    },
    "previousOverallScore": 74,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 18,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 14,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 19,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 23,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-103",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 1 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 72,
        "communication": 71,
        "grammar": 66,
        "vocabulary": 77
      },
      {
        "date": "2026-08-21",
        "overallScore": 74,
        "communication": 73,
        "grammar": 68,
        "vocabulary": 79
      },
      {
        "date": "2026-09-04",
        "overallScore": 76,
        "communication": 74,
        "grammar": 70,
        "vocabulary": 80
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10624",
    "rollNo": "26bcs10624",
    "name": "Aditya sinh Upendrasinh Gohil",
    "phone": "+91 98451 10624",
    "email": "adityasinh.26bcs10624@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 7",
    "joiningDate": "2026-08-01",
    "currentLevel": "Upper-Intermediate (B2)",
    "initialRemarks": "Official SST 2026 Cohort • Group 7 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 85,
      "grammar": 86,
      "vocabulary": 82,
      "pronunciation": 88,
      "participation": 85,
      "assignments": 83,
      "assessments": 82
    },
    "previousOverallScore": 81,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 20,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 18,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 22,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 25,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-104",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 7 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 79,
        "communication": 82,
        "grammar": 82,
        "vocabulary": 79
      },
      {
        "date": "2026-08-21",
        "overallScore": 81,
        "communication": 84,
        "grammar": 84,
        "vocabulary": 81
      },
      {
        "date": "2026-09-04",
        "overallScore": 83,
        "communication": 85,
        "grammar": 86,
        "vocabulary": 82
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10068",
    "rollNo": "26bcs10068",
    "name": "Anmol Kumar",
    "phone": "+91 98451 10068",
    "email": "anmol.26bcs10068@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 1",
    "joiningDate": "2026-08-01",
    "currentLevel": "Advanced (C1)",
    "initialRemarks": "Official SST 2026 Cohort • Group 1 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 96,
      "grammar": 90,
      "vocabulary": 94,
      "pronunciation": 87,
      "participation": 98,
      "assignments": 93,
      "assessments": 86
    },
    "previousOverallScore": 88,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 22,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 18,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 24,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Submitted",
        "score": null,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-105",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 1 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 86,
        "communication": 93,
        "grammar": 86,
        "vocabulary": 91
      },
      {
        "date": "2026-08-21",
        "overallScore": 88,
        "communication": 95,
        "grammar": 88,
        "vocabulary": 93
      },
      {
        "date": "2026-09-04",
        "overallScore": 90,
        "communication": 96,
        "grammar": 90,
        "vocabulary": 94
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10462",
    "rollNo": "26bcs10462",
    "name": "Ashirvad Srivastava",
    "phone": "+91 98451 10462",
    "email": "ashirvad.26bcs10462@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 2",
    "joiningDate": "2026-08-01",
    "currentLevel": "Intermediate (B1)",
    "initialRemarks": "Official SST 2026 Cohort • Group 2 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 75,
      "grammar": 74,
      "vocabulary": 76,
      "pronunciation": 76,
      "participation": 73,
      "assignments": 83,
      "assessments": 79
    },
    "previousOverallScore": 75,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 19,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 15,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 19,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 23,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-106",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 2 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 73,
        "communication": 72,
        "grammar": 70,
        "vocabulary": 73
      },
      {
        "date": "2026-08-21",
        "overallScore": 75,
        "communication": 74,
        "grammar": 72,
        "vocabulary": 75
      },
      {
        "date": "2026-09-04",
        "overallScore": 77,
        "communication": 75,
        "grammar": 74,
        "vocabulary": 76
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10477",
    "rollNo": "26bcs10477",
    "name": "Ashuvardhan Parsha",
    "phone": "+91 98451 10477",
    "email": "ashuvardhan.26bcs10477@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 1",
    "joiningDate": "2026-08-01",
    "currentLevel": "Upper-Intermediate (B2)",
    "initialRemarks": "Official SST 2026 Cohort • Group 1 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 86,
      "grammar": 78,
      "vocabulary": 88,
      "pronunciation": 85,
      "participation": 86,
      "assignments": 93,
      "assessments": 83
    },
    "previousOverallScore": 82,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 20,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 16,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 22,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 26,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-107",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 1 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 80,
        "communication": 83,
        "grammar": 74,
        "vocabulary": 85
      },
      {
        "date": "2026-08-21",
        "overallScore": 82,
        "communication": 85,
        "grammar": 76,
        "vocabulary": 87
      },
      {
        "date": "2026-09-04",
        "overallScore": 84,
        "communication": 86,
        "grammar": 78,
        "vocabulary": 88
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10565",
    "rollNo": "26bcs10565",
    "name": "Bhavya Jain",
    "phone": "+91 98451 10565",
    "email": "bhavya.26bcs10565@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 7",
    "joiningDate": "2026-08-01",
    "currentLevel": "Advanced (C1)",
    "initialRemarks": "Official SST 2026 Cohort • Group 7 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 97,
      "grammar": 94,
      "vocabulary": 90,
      "pronunciation": 94,
      "participation": 99,
      "assignments": 91,
      "assessments": 87
    },
    "previousOverallScore": 89,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 22,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 19,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 25,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 28,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-108",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 7 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 87,
        "communication": 94,
        "grammar": 90,
        "vocabulary": 87
      },
      {
        "date": "2026-08-21",
        "overallScore": 89,
        "communication": 96,
        "grammar": 92,
        "vocabulary": 89
      },
      {
        "date": "2026-09-04",
        "overallScore": 91,
        "communication": 97,
        "grammar": 94,
        "vocabulary": 90
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10647",
    "rollNo": "26bcs10647",
    "name": "Bhupen Yadav",
    "phone": "+91 98451 10647",
    "email": "bhupen.26bcs10647@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 3",
    "joiningDate": "2026-08-01",
    "currentLevel": "Upper-Intermediate (B2)",
    "initialRemarks": "Official SST 2026 Cohort • Group 3 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 76,
      "grammar": 78,
      "vocabulary": 82,
      "pronunciation": 83,
      "participation": 74,
      "assignments": 81,
      "assessments": 80
    },
    "previousOverallScore": 76,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 19,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 16,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 19,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 24,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-109",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 3 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 74,
        "communication": 73,
        "grammar": 74,
        "vocabulary": 79
      },
      {
        "date": "2026-08-21",
        "overallScore": 76,
        "communication": 75,
        "grammar": 76,
        "vocabulary": 81
      },
      {
        "date": "2026-09-04",
        "overallScore": 78,
        "communication": 76,
        "grammar": 78,
        "vocabulary": 82
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10311",
    "rollNo": "26bcs10311",
    "name": "Dheeraj Choudhary",
    "phone": "+91 98451 10311",
    "email": "dheeraj.26bcs10311@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 3",
    "joiningDate": "2026-08-01",
    "currentLevel": "Upper-Intermediate (B2)",
    "initialRemarks": "Official SST 2026 Cohort • Group 3 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 87,
      "grammar": 82,
      "vocabulary": 84,
      "pronunciation": 82,
      "participation": 87,
      "assignments": 91,
      "assessments": 84
    },
    "previousOverallScore": 83,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 21,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 17,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 22,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Submitted",
        "score": null,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1010",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 3 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 81,
        "communication": 84,
        "grammar": 78,
        "vocabulary": 81
      },
      {
        "date": "2026-08-21",
        "overallScore": 83,
        "communication": 86,
        "grammar": 80,
        "vocabulary": 83
      },
      {
        "date": "2026-09-04",
        "overallScore": 85,
        "communication": 87,
        "grammar": 82,
        "vocabulary": 84
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10093",
    "rollNo": "26bcs10093",
    "name": "Divyanshika Sharma",
    "phone": "+91 98451 10093",
    "email": "divyanshika.26bcs10093@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 6",
    "joiningDate": "2026-08-01",
    "currentLevel": "Advanced (C1)",
    "initialRemarks": "Official SST 2026 Cohort • Group 6 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 98,
      "grammar": 86,
      "vocabulary": 96,
      "pronunciation": 91,
      "participation": 100,
      "assignments": 100,
      "assessments": 88
    },
    "previousOverallScore": 90,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 22,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 18,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 25,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 28,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1011",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 6 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 88,
        "communication": 95,
        "grammar": 82,
        "vocabulary": 93
      },
      {
        "date": "2026-08-21",
        "overallScore": 90,
        "communication": 97,
        "grammar": 84,
        "vocabulary": 95
      },
      {
        "date": "2026-09-04",
        "overallScore": 92,
        "communication": 98,
        "grammar": 86,
        "vocabulary": 96
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10483",
    "rollNo": "26bcs10483",
    "name": "Gongati Naga Varun Kumar",
    "phone": "+91 98451 10483",
    "email": "gongati.26bcs10483@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 6",
    "joiningDate": "2026-08-01",
    "currentLevel": "Upper-Intermediate (B2)",
    "initialRemarks": "Official SST 2026 Cohort • Group 6 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 77,
      "grammar": 82,
      "vocabulary": 78,
      "pronunciation": 80,
      "participation": 75,
      "assignments": 79,
      "assessments": 81
    },
    "previousOverallScore": 77,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 19,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 17,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 20,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 24,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1012",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 6 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 75,
        "communication": 74,
        "grammar": 78,
        "vocabulary": 75
      },
      {
        "date": "2026-08-21",
        "overallScore": 77,
        "communication": 76,
        "grammar": 80,
        "vocabulary": 77
      },
      {
        "date": "2026-09-04",
        "overallScore": 79,
        "communication": 77,
        "grammar": 82,
        "vocabulary": 78
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10036",
    "rollNo": "26bcs10036",
    "name": "Govardhan Reddy Vangala",
    "phone": "+91 98451 10036",
    "email": "govardhan.26bcs10036@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 2",
    "joiningDate": "2026-08-01",
    "currentLevel": "Upper-Intermediate (B2)",
    "initialRemarks": "Official SST 2026 Cohort • Group 2 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 88,
      "grammar": 86,
      "vocabulary": 90,
      "pronunciation": 89,
      "participation": 88,
      "assignments": 89,
      "assessments": 85
    },
    "previousOverallScore": 84,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 21,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 18,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 22,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 26,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1013",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 2 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 82,
        "communication": 85,
        "grammar": 82,
        "vocabulary": 87
      },
      {
        "date": "2026-08-21",
        "overallScore": 84,
        "communication": 87,
        "grammar": 84,
        "vocabulary": 89
      },
      {
        "date": "2026-09-04",
        "overallScore": 86,
        "communication": 88,
        "grammar": 86,
        "vocabulary": 90
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10437",
    "rollNo": "26bcs10437",
    "name": "Guruprasad Revannath Yadav",
    "phone": "+91 98451 10437",
    "email": "guruprasad.26bcs10437@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 1",
    "joiningDate": "2026-08-01",
    "currentLevel": "Advanced (C1)",
    "initialRemarks": "Official SST 2026 Cohort • Group 1 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 98,
      "grammar": 90,
      "vocabulary": 92,
      "pronunciation": 95,
      "participation": 100,
      "assignments": 99,
      "assessments": 89
    },
    "previousOverallScore": 91,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 23,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 18,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 25,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 28,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1014",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 1 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 89,
        "communication": 95,
        "grammar": 86,
        "vocabulary": 89
      },
      {
        "date": "2026-08-21",
        "overallScore": 91,
        "communication": 97,
        "grammar": 88,
        "vocabulary": 91
      },
      {
        "date": "2026-09-04",
        "overallScore": 93,
        "communication": 98,
        "grammar": 90,
        "vocabulary": 92
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10269",
    "rollNo": "26bcs10269",
    "name": "Ishan Kirpekar",
    "phone": "+91 98451 10269",
    "email": "ishan.26bcs10269@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 5",
    "joiningDate": "2026-08-01",
    "currentLevel": "Upper-Intermediate (B2)",
    "initialRemarks": "Official SST 2026 Cohort • Group 5 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 78,
      "grammar": 74,
      "vocabulary": 84,
      "pronunciation": 77,
      "participation": 76,
      "assignments": 89,
      "assessments": 82
    },
    "previousOverallScore": 78,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 19,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 15,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 20,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Submitted",
        "score": null,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1015",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 5 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 76,
        "communication": 75,
        "grammar": 70,
        "vocabulary": 81
      },
      {
        "date": "2026-08-21",
        "overallScore": 78,
        "communication": 77,
        "grammar": 72,
        "vocabulary": 83
      },
      {
        "date": "2026-09-04",
        "overallScore": 80,
        "communication": 78,
        "grammar": 74,
        "vocabulary": 84
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10409",
    "rollNo": "26bcs10409",
    "name": "Janani S",
    "phone": "+91 98451 10409",
    "email": "janani.26bcs10409@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 3",
    "joiningDate": "2026-08-01",
    "currentLevel": "Upper-Intermediate (B2)",
    "initialRemarks": "Official SST 2026 Cohort • Group 3 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 89,
      "grammar": 90,
      "vocabulary": 86,
      "pronunciation": 86,
      "participation": 89,
      "assignments": 87,
      "assessments": 86
    },
    "previousOverallScore": 85,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 21,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 18,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 23,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 26,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1016",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 3 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 83,
        "communication": 86,
        "grammar": 86,
        "vocabulary": 83
      },
      {
        "date": "2026-08-21",
        "overallScore": 85,
        "communication": 88,
        "grammar": 88,
        "vocabulary": 85
      },
      {
        "date": "2026-09-04",
        "overallScore": 87,
        "communication": 89,
        "grammar": 90,
        "vocabulary": 86
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10443",
    "rollNo": "26bcs10443",
    "name": "Kabir Kwatra",
    "phone": "+91 98451 10443",
    "email": "kabir.26bcs10443@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 7",
    "joiningDate": "2026-08-01",
    "currentLevel": "Advanced (C1)",
    "initialRemarks": "Official SST 2026 Cohort • Group 7 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 98,
      "grammar": 94,
      "vocabulary": 98,
      "pronunciation": 95,
      "participation": 100,
      "assignments": 97,
      "assessments": 90
    },
    "previousOverallScore": 92,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 23,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 19,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 25,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 29,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1017",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 7 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 90,
        "communication": 95,
        "grammar": 90,
        "vocabulary": 95
      },
      {
        "date": "2026-08-21",
        "overallScore": 92,
        "communication": 97,
        "grammar": 92,
        "vocabulary": 97
      },
      {
        "date": "2026-09-04",
        "overallScore": 94,
        "communication": 98,
        "grammar": 94,
        "vocabulary": 98
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10065",
    "rollNo": "26bcs10065",
    "name": "Karpurapu Gokul",
    "phone": "+91 98451 10065",
    "email": "karpurapu.26bcs10065@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 5",
    "joiningDate": "2026-08-01",
    "currentLevel": "Upper-Intermediate (B2)",
    "initialRemarks": "Official SST 2026 Cohort • Group 5 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 79,
      "grammar": 78,
      "vocabulary": 80,
      "pronunciation": 84,
      "participation": 77,
      "assignments": 87,
      "assessments": 83
    },
    "previousOverallScore": 79,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 20,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 16,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 20,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 25,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1018",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 5 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 77,
        "communication": 76,
        "grammar": 74,
        "vocabulary": 77
      },
      {
        "date": "2026-08-21",
        "overallScore": 79,
        "communication": 78,
        "grammar": 76,
        "vocabulary": 79
      },
      {
        "date": "2026-09-04",
        "overallScore": 81,
        "communication": 79,
        "grammar": 78,
        "vocabulary": 80
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10478",
    "rollNo": "26bcs10478",
    "name": "Madhira Nanda Kishore Reddy",
    "phone": "+91 98451 10478",
    "email": "madhira.26bcs10478@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 5",
    "joiningDate": "2026-08-01",
    "currentLevel": "Advanced (C1)",
    "initialRemarks": "Official SST 2026 Cohort • Group 5 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 90,
      "grammar": 82,
      "vocabulary": 92,
      "pronunciation": 93,
      "participation": 90,
      "assignments": 97,
      "assessments": 87
    },
    "previousOverallScore": 86,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 21,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 17,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 23,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 27,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1019",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 5 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 84,
        "communication": 87,
        "grammar": 78,
        "vocabulary": 89
      },
      {
        "date": "2026-08-21",
        "overallScore": 86,
        "communication": 89,
        "grammar": 80,
        "vocabulary": 91
      },
      {
        "date": "2026-09-04",
        "overallScore": 88,
        "communication": 90,
        "grammar": 82,
        "vocabulary": 92
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10525",
    "rollNo": "26bcs10525",
    "name": "Madireddy Vivekvardhan Reddy",
    "phone": "+91 98451 10525",
    "email": "madireddy.26bcs10525@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 7",
    "joiningDate": "2026-08-01",
    "currentLevel": "Intermediate (B1)",
    "initialRemarks": "Official SST 2026 Cohort • Group 7 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 81,
      "grammar": 78,
      "vocabulary": 74,
      "pronunciation": 72,
      "participation": 83,
      "assignments": 75,
      "assessments": 71
    },
    "previousOverallScore": 73,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 18,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 16,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 21,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Submitted",
        "score": null,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1020",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 7 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 71,
        "communication": 78,
        "grammar": 74,
        "vocabulary": 71
      },
      {
        "date": "2026-08-21",
        "overallScore": 73,
        "communication": 80,
        "grammar": 76,
        "vocabulary": 73
      },
      {
        "date": "2026-09-04",
        "overallScore": 75,
        "communication": 81,
        "grammar": 78,
        "vocabulary": 74
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10410",
    "rollNo": "26bcs10410",
    "name": "Majeti Vinayaka Subramanya Srinivasa",
    "phone": "+91 98451 10410",
    "email": "majeti.26bcs10410@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 2",
    "joiningDate": "2026-08-01",
    "currentLevel": "Upper-Intermediate (B2)",
    "initialRemarks": "Official SST 2026 Cohort • Group 2 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 80,
      "grammar": 82,
      "vocabulary": 86,
      "pronunciation": 81,
      "participation": 78,
      "assignments": 85,
      "assessments": 84
    },
    "previousOverallScore": 80,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 20,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 17,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 20,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 25,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1021",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 2 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 78,
        "communication": 77,
        "grammar": 78,
        "vocabulary": 83
      },
      {
        "date": "2026-08-21",
        "overallScore": 80,
        "communication": 79,
        "grammar": 80,
        "vocabulary": 85
      },
      {
        "date": "2026-09-04",
        "overallScore": 82,
        "communication": 80,
        "grammar": 82,
        "vocabulary": 86
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10472",
    "rollNo": "26bcs10472",
    "name": "Pabbula Pranathi",
    "phone": "+91 98451 10472",
    "email": "pabbula.26bcs10472@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 2",
    "joiningDate": "2026-08-01",
    "currentLevel": "Advanced (C1)",
    "initialRemarks": "Official SST 2026 Cohort • Group 2 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 91,
      "grammar": 86,
      "vocabulary": 88,
      "pronunciation": 90,
      "participation": 91,
      "assignments": 95,
      "assessments": 88
    },
    "previousOverallScore": 87,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 22,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 18,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 23,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 27,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1022",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 2 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 85,
        "communication": 88,
        "grammar": 82,
        "vocabulary": 85
      },
      {
        "date": "2026-08-21",
        "overallScore": 87,
        "communication": 90,
        "grammar": 84,
        "vocabulary": 87
      },
      {
        "date": "2026-09-04",
        "overallScore": 89,
        "communication": 91,
        "grammar": 86,
        "vocabulary": 88
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10452",
    "rollNo": "26bcs10452",
    "name": "Panuganti Sricharan",
    "phone": "+91 98451 10452",
    "email": "panuganti.26bcs10452@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 3",
    "joiningDate": "2026-08-01",
    "currentLevel": "Intermediate (B1)",
    "initialRemarks": "Official SST 2026 Cohort • Group 3 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 82,
      "grammar": 70,
      "vocabulary": 80,
      "pronunciation": 79,
      "participation": 84,
      "assignments": 85,
      "assessments": 72
    },
    "previousOverallScore": 74,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 18,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 14,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 21,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 23,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1023",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 3 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 72,
        "communication": 79,
        "grammar": 66,
        "vocabulary": 77
      },
      {
        "date": "2026-08-21",
        "overallScore": 74,
        "communication": 81,
        "grammar": 68,
        "vocabulary": 79
      },
      {
        "date": "2026-09-04",
        "overallScore": 76,
        "communication": 82,
        "grammar": 70,
        "vocabulary": 80
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10412",
    "rollNo": "26bcs10412",
    "name": "Pendyala Sri Vaishnav",
    "phone": "+91 98451 10412",
    "email": "sri.26bcs10412@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 4",
    "joiningDate": "2026-08-01",
    "currentLevel": "Upper-Intermediate (B2)",
    "initialRemarks": "Official SST 2026 Cohort • Group 4 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 81,
      "grammar": 86,
      "vocabulary": 82,
      "pronunciation": 88,
      "participation": 79,
      "assignments": 83,
      "assessments": 85
    },
    "previousOverallScore": 81,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 20,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 18,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 21,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 25,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1024",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 4 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 79,
        "communication": 78,
        "grammar": 82,
        "vocabulary": 79
      },
      {
        "date": "2026-08-21",
        "overallScore": 81,
        "communication": 80,
        "grammar": 84,
        "vocabulary": 81
      },
      {
        "date": "2026-09-04",
        "overallScore": 83,
        "communication": 81,
        "grammar": 86,
        "vocabulary": 82
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10401",
    "rollNo": "26bcs10401",
    "name": "Piyush Mondal",
    "phone": "+91 98451 10401",
    "email": "piyush.26bcs10401@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 7",
    "joiningDate": "2026-08-01",
    "currentLevel": "Advanced (C1)",
    "initialRemarks": "Official SST 2026 Cohort • Group 7 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 92,
      "grammar": 90,
      "vocabulary": 94,
      "pronunciation": 87,
      "participation": 92,
      "assignments": 93,
      "assessments": 89
    },
    "previousOverallScore": 88,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 22,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 18,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 23,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Submitted",
        "score": null,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1025",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 7 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 86,
        "communication": 89,
        "grammar": 86,
        "vocabulary": 91
      },
      {
        "date": "2026-08-21",
        "overallScore": 88,
        "communication": 91,
        "grammar": 88,
        "vocabulary": 93
      },
      {
        "date": "2026-09-04",
        "overallScore": 90,
        "communication": 92,
        "grammar": 90,
        "vocabulary": 94
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10347",
    "rollNo": "26bcs10347",
    "name": "Pradeep Dasari",
    "phone": "+91 98451 10347",
    "email": "pradeep.26bcs10347@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 6",
    "joiningDate": "2026-08-01",
    "currentLevel": "Intermediate (B1)",
    "initialRemarks": "Official SST 2026 Cohort • Group 6 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 83,
      "grammar": 74,
      "vocabulary": 76,
      "pronunciation": 76,
      "participation": 85,
      "assignments": 83,
      "assessments": 73
    },
    "previousOverallScore": 75,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 19,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 15,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 21,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 23,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1026",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 6 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 73,
        "communication": 80,
        "grammar": 70,
        "vocabulary": 73
      },
      {
        "date": "2026-08-21",
        "overallScore": 75,
        "communication": 82,
        "grammar": 72,
        "vocabulary": 75
      },
      {
        "date": "2026-09-04",
        "overallScore": 77,
        "communication": 83,
        "grammar": 74,
        "vocabulary": 76
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10457",
    "rollNo": "26bcs10457",
    "name": "Prajjwal Pandey",
    "phone": "+91 98451 10457",
    "email": "prajjwal.26bcs10457@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 6",
    "joiningDate": "2026-08-01",
    "currentLevel": "Upper-Intermediate (B2)",
    "initialRemarks": "Official SST 2026 Cohort • Group 6 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 82,
      "grammar": 78,
      "vocabulary": 88,
      "pronunciation": 85,
      "participation": 80,
      "assignments": 93,
      "assessments": 86
    },
    "previousOverallScore": 82,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 20,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 16,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 21,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 26,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1027",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 6 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 80,
        "communication": 79,
        "grammar": 74,
        "vocabulary": 85
      },
      {
        "date": "2026-08-21",
        "overallScore": 82,
        "communication": 81,
        "grammar": 76,
        "vocabulary": 87
      },
      {
        "date": "2026-09-04",
        "overallScore": 84,
        "communication": 82,
        "grammar": 78,
        "vocabulary": 88
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10323",
    "rollNo": "26bcs10323",
    "name": "Rahamtulla Mohammad",
    "phone": "+91 98451 10323",
    "email": "rahamtulla.26bcs10323@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 6",
    "joiningDate": "2026-08-01",
    "currentLevel": "Advanced (C1)",
    "initialRemarks": "Official SST 2026 Cohort • Group 6 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 93,
      "grammar": 94,
      "vocabulary": 90,
      "pronunciation": 94,
      "participation": 93,
      "assignments": 91,
      "assessments": 90
    },
    "previousOverallScore": 89,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 22,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 19,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 24,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 28,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1028",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 6 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 87,
        "communication": 90,
        "grammar": 90,
        "vocabulary": 87
      },
      {
        "date": "2026-08-21",
        "overallScore": 89,
        "communication": 92,
        "grammar": 92,
        "vocabulary": 89
      },
      {
        "date": "2026-09-04",
        "overallScore": 91,
        "communication": 93,
        "grammar": 94,
        "vocabulary": 90
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10458",
    "rollNo": "26bcs10458",
    "name": "Sai Pragneshwar Amani",
    "phone": "+91 98451 10458",
    "email": "sai.26bcs10458@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 3",
    "joiningDate": "2026-08-01",
    "currentLevel": "Upper-Intermediate (B2)",
    "initialRemarks": "Official SST 2026 Cohort • Group 3 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 84,
      "grammar": 78,
      "vocabulary": 82,
      "pronunciation": 83,
      "participation": 86,
      "assignments": 81,
      "assessments": 74
    },
    "previousOverallScore": 76,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 19,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 16,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 21,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 24,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1029",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 3 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 74,
        "communication": 81,
        "grammar": 74,
        "vocabulary": 79
      },
      {
        "date": "2026-08-21",
        "overallScore": 76,
        "communication": 83,
        "grammar": 76,
        "vocabulary": 81
      },
      {
        "date": "2026-09-04",
        "overallScore": 78,
        "communication": 84,
        "grammar": 78,
        "vocabulary": 82
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10121",
    "rollNo": "26bcs10121",
    "name": "Satya Mukhesh Aravind Balla Balla",
    "phone": "+91 98451 10121",
    "email": "satya.26bcs10121@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 5",
    "joiningDate": "2026-08-01",
    "currentLevel": "Upper-Intermediate (B2)",
    "initialRemarks": "Official SST 2026 Cohort • Group 5 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 83,
      "grammar": 82,
      "vocabulary": 84,
      "pronunciation": 82,
      "participation": 81,
      "assignments": 91,
      "assessments": 87
    },
    "previousOverallScore": 83,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 21,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 17,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 21,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Submitted",
        "score": null,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1030",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 5 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 81,
        "communication": 80,
        "grammar": 78,
        "vocabulary": 81
      },
      {
        "date": "2026-08-21",
        "overallScore": 83,
        "communication": 82,
        "grammar": 80,
        "vocabulary": 83
      },
      {
        "date": "2026-09-04",
        "overallScore": 85,
        "communication": 83,
        "grammar": 82,
        "vocabulary": 84
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10189",
    "rollNo": "26bcs10189",
    "name": "Shashwat Mishra",
    "phone": "+91 98451 10189",
    "email": "shashwat.26bcs10189@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 7",
    "joiningDate": "2026-08-01",
    "currentLevel": "Advanced (C1)",
    "initialRemarks": "Official SST 2026 Cohort • Group 7 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 94,
      "grammar": 86,
      "vocabulary": 96,
      "pronunciation": 91,
      "participation": 94,
      "assignments": 100,
      "assessments": 91
    },
    "previousOverallScore": 90,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 22,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 18,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 24,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 28,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1031",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 7 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 88,
        "communication": 91,
        "grammar": 82,
        "vocabulary": 93
      },
      {
        "date": "2026-08-21",
        "overallScore": 90,
        "communication": 93,
        "grammar": 84,
        "vocabulary": 95
      },
      {
        "date": "2026-09-04",
        "overallScore": 92,
        "communication": 94,
        "grammar": 86,
        "vocabulary": 96
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10648",
    "rollNo": "26bcs10648",
    "name": "Shiwang Gupta",
    "phone": "+91 98451 10648",
    "email": "shiwang.26bcs10648@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 4",
    "joiningDate": "2026-08-01",
    "currentLevel": "Upper-Intermediate (B2)",
    "initialRemarks": "Official SST 2026 Cohort • Group 4 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 85,
      "grammar": 82,
      "vocabulary": 78,
      "pronunciation": 80,
      "participation": 87,
      "assignments": 79,
      "assessments": 75
    },
    "previousOverallScore": 77,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 19,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 17,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 22,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 24,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1032",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 4 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 75,
        "communication": 82,
        "grammar": 78,
        "vocabulary": 75
      },
      {
        "date": "2026-08-21",
        "overallScore": 77,
        "communication": 84,
        "grammar": 80,
        "vocabulary": 77
      },
      {
        "date": "2026-09-04",
        "overallScore": 79,
        "communication": 85,
        "grammar": 82,
        "vocabulary": 78
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10292",
    "rollNo": "26bcs10292",
    "name": "Shreyansh Bhawsar Bhawsar",
    "phone": "+91 98451 10292",
    "email": "shreyansh.26bcs10292@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 1",
    "joiningDate": "2026-08-01",
    "currentLevel": "Upper-Intermediate (B2)",
    "initialRemarks": "Official SST 2026 Cohort • Group 1 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 84,
      "grammar": 86,
      "vocabulary": 90,
      "pronunciation": 89,
      "participation": 82,
      "assignments": 89,
      "assessments": 88
    },
    "previousOverallScore": 84,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 21,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 18,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 21,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 26,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1033",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 1 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 82,
        "communication": 81,
        "grammar": 82,
        "vocabulary": 87
      },
      {
        "date": "2026-08-21",
        "overallScore": 84,
        "communication": 83,
        "grammar": 84,
        "vocabulary": 89
      },
      {
        "date": "2026-09-04",
        "overallScore": 86,
        "communication": 84,
        "grammar": 86,
        "vocabulary": 90
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10318",
    "rollNo": "26bcs10318",
    "name": "Shubh Soni",
    "phone": "+91 98451 10318",
    "email": "shubh.26bcs10318@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 2",
    "joiningDate": "2026-08-01",
    "currentLevel": "Advanced (C1)",
    "initialRemarks": "Official SST 2026 Cohort • Group 2 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 95,
      "grammar": 90,
      "vocabulary": 92,
      "pronunciation": 95,
      "participation": 95,
      "assignments": 99,
      "assessments": 92
    },
    "previousOverallScore": 91,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 23,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 18,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 24,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 28,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1034",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 2 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 89,
        "communication": 92,
        "grammar": 86,
        "vocabulary": 89
      },
      {
        "date": "2026-08-21",
        "overallScore": 91,
        "communication": 94,
        "grammar": 88,
        "vocabulary": 91
      },
      {
        "date": "2026-09-04",
        "overallScore": 93,
        "communication": 95,
        "grammar": 90,
        "vocabulary": 92
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10516",
    "rollNo": "26bcs10516",
    "name": "Siddhant Dubey",
    "phone": "+91 98451 10516",
    "email": "siddhant.26bcs10516@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 4",
    "joiningDate": "2026-08-01",
    "currentLevel": "Upper-Intermediate (B2)",
    "initialRemarks": "Official SST 2026 Cohort • Group 4 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 86,
      "grammar": 74,
      "vocabulary": 84,
      "pronunciation": 77,
      "participation": 88,
      "assignments": 89,
      "assessments": 76
    },
    "previousOverallScore": 78,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 19,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 15,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 22,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Submitted",
        "score": null,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1035",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 4 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 76,
        "communication": 83,
        "grammar": 70,
        "vocabulary": 81
      },
      {
        "date": "2026-08-21",
        "overallScore": 78,
        "communication": 85,
        "grammar": 72,
        "vocabulary": 83
      },
      {
        "date": "2026-09-04",
        "overallScore": 80,
        "communication": 86,
        "grammar": 74,
        "vocabulary": 84
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10238",
    "rollNo": "26bcs10238",
    "name": "Subhramanya Trivikrama Abhinav Devisetti",
    "phone": "+91 98451 10238",
    "email": "subhramanya.26bcs10238@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 5",
    "joiningDate": "2026-08-01",
    "currentLevel": "Upper-Intermediate (B2)",
    "initialRemarks": "Official SST 2026 Cohort • Group 5 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 85,
      "grammar": 90,
      "vocabulary": 86,
      "pronunciation": 86,
      "participation": 83,
      "assignments": 87,
      "assessments": 89
    },
    "previousOverallScore": 85,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 21,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 18,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 22,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 26,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1036",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 5 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 83,
        "communication": 82,
        "grammar": 86,
        "vocabulary": 83
      },
      {
        "date": "2026-08-21",
        "overallScore": 85,
        "communication": 84,
        "grammar": 88,
        "vocabulary": 85
      },
      {
        "date": "2026-09-04",
        "overallScore": 87,
        "communication": 85,
        "grammar": 90,
        "vocabulary": 86
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10404",
    "rollNo": "26bcs10404",
    "name": "Tumati Jai Charan",
    "phone": "+91 98451 10404",
    "email": "tumati.26bcs10404@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 4",
    "joiningDate": "2026-08-01",
    "currentLevel": "Advanced (C1)",
    "initialRemarks": "Official SST 2026 Cohort • Group 4 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 96,
      "grammar": 94,
      "vocabulary": 98,
      "pronunciation": 95,
      "participation": 96,
      "assignments": 97,
      "assessments": 93
    },
    "previousOverallScore": 92,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 23,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 19,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 24,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 29,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1037",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 4 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 90,
        "communication": 93,
        "grammar": 90,
        "vocabulary": 95
      },
      {
        "date": "2026-08-21",
        "overallScore": 92,
        "communication": 95,
        "grammar": 92,
        "vocabulary": 97
      },
      {
        "date": "2026-09-04",
        "overallScore": 94,
        "communication": 96,
        "grammar": 94,
        "vocabulary": 98
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10512",
    "rollNo": "26bcs10512",
    "name": "Utkarsh Tiwari",
    "phone": "+91 98451 10512",
    "email": "utkarsh.26bcs10512@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 6",
    "joiningDate": "2026-08-01",
    "currentLevel": "Upper-Intermediate (B2)",
    "initialRemarks": "Official SST 2026 Cohort • Group 6 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 87,
      "grammar": 78,
      "vocabulary": 80,
      "pronunciation": 84,
      "participation": 89,
      "assignments": 87,
      "assessments": 77
    },
    "previousOverallScore": 79,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 20,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 16,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 22,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 25,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1038",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 6 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 77,
        "communication": 84,
        "grammar": 74,
        "vocabulary": 77
      },
      {
        "date": "2026-08-21",
        "overallScore": 79,
        "communication": 86,
        "grammar": 76,
        "vocabulary": 79
      },
      {
        "date": "2026-09-04",
        "overallScore": 81,
        "communication": 87,
        "grammar": 78,
        "vocabulary": 80
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10521",
    "rollNo": "26bcs10521",
    "name": "Vinit Chauhan",
    "phone": "+91 98451 10521",
    "email": "vinit.26bcs10521@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 4",
    "joiningDate": "2026-08-01",
    "currentLevel": "Advanced (C1)",
    "initialRemarks": "Official SST 2026 Cohort • Group 4 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 86,
      "grammar": 82,
      "vocabulary": 92,
      "pronunciation": 93,
      "participation": 84,
      "assignments": 97,
      "assessments": 90
    },
    "previousOverallScore": 86,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 21,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 17,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 22,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 27,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1039",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 4 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 84,
        "communication": 83,
        "grammar": 78,
        "vocabulary": 89
      },
      {
        "date": "2026-08-21",
        "overallScore": 86,
        "communication": 85,
        "grammar": 80,
        "vocabulary": 91
      },
      {
        "date": "2026-09-04",
        "overallScore": 88,
        "communication": 86,
        "grammar": 82,
        "vocabulary": 92
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10296",
    "rollNo": "26bcs10296",
    "name": "Yahoshuva Kesaboyina",
    "phone": "+91 98451 10296",
    "email": "yahoshuva.26bcs10296@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 5",
    "joiningDate": "2026-08-01",
    "currentLevel": "Intermediate (B1)",
    "initialRemarks": "Official SST 2026 Cohort • Group 5 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 77,
      "grammar": 78,
      "vocabulary": 74,
      "pronunciation": 72,
      "participation": 77,
      "assignments": 75,
      "assessments": 74
    },
    "previousOverallScore": 73,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 18,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 16,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 20,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Submitted",
        "score": null,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1040",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 5 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 71,
        "communication": 74,
        "grammar": 74,
        "vocabulary": 71
      },
      {
        "date": "2026-08-21",
        "overallScore": 73,
        "communication": 76,
        "grammar": 76,
        "vocabulary": 73
      },
      {
        "date": "2026-09-04",
        "overallScore": 75,
        "communication": 77,
        "grammar": 78,
        "vocabulary": 74
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10450",
    "rollNo": "26bcs10450",
    "name": "Yashaswin Ankennapalli",
    "phone": "+91 98451 10450",
    "email": "yashaswin.26bcs10450@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 5",
    "joiningDate": "2026-08-01",
    "currentLevel": "Upper-Intermediate (B2)",
    "initialRemarks": "Official SST 2026 Cohort • Group 5 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 88,
      "grammar": 82,
      "vocabulary": 86,
      "pronunciation": 81,
      "participation": 90,
      "assignments": 85,
      "assessments": 78
    },
    "previousOverallScore": 80,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 20,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 17,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 22,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 25,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1041",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 5 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 78,
        "communication": 85,
        "grammar": 78,
        "vocabulary": 83
      },
      {
        "date": "2026-08-21",
        "overallScore": 80,
        "communication": 87,
        "grammar": 80,
        "vocabulary": 85
      },
      {
        "date": "2026-09-04",
        "overallScore": 82,
        "communication": 88,
        "grammar": 82,
        "vocabulary": 86
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10664",
    "rollNo": "26bcs10664",
    "name": "Yugandhar Bhatlawande",
    "phone": "+91 98451 10664",
    "email": "yugandhar.26bcs10664@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 4",
    "joiningDate": "2026-08-01",
    "currentLevel": "Advanced (C1)",
    "initialRemarks": "Official SST 2026 Cohort • Group 4 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 87,
      "grammar": 86,
      "vocabulary": 88,
      "pronunciation": 90,
      "participation": 85,
      "assignments": 95,
      "assessments": 91
    },
    "previousOverallScore": 87,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 22,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 18,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 22,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 27,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1042",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 4 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 85,
        "communication": 84,
        "grammar": 82,
        "vocabulary": 85
      },
      {
        "date": "2026-08-21",
        "overallScore": 87,
        "communication": 86,
        "grammar": 84,
        "vocabulary": 87
      },
      {
        "date": "2026-09-04",
        "overallScore": 89,
        "communication": 87,
        "grammar": 86,
        "vocabulary": 88
      }
    ],
    "isArchived": false
  },
  {
    "id": "26bcs10718",
    "rollNo": "26bcs10718",
    "name": "Satwinderjeet Singh Sidhu",
    "phone": "+91 98451 10718",
    "email": "satwinderjeet.26bcs10718@sst.scaler.com",
    "batch": "English C - Term 1",
    "group": "Group 1",
    "joiningDate": "2026-08-01",
    "currentLevel": "Intermediate (B1)",
    "initialRemarks": "Official SST 2026 Cohort • Group 1 Member.",
    "avatar": "",
    "lastActivity": "Just now",
    "skills": {
      "communication": 78,
      "grammar": 70,
      "vocabulary": 80,
      "pronunciation": 79,
      "participation": 78,
      "assignments": 85,
      "assessments": 75
    },
    "previousOverallScore": 74,
    "assignments": [
      {
        "id": "ASG-101",
        "title": "Diagnostic Baseline Fluency Assessment",
        "dueDate": "2026-08-06",
        "status": "Graded",
        "score": 18,
        "maxScore": 25
      },
      {
        "id": "ASG-102",
        "title": "Tenses Mastery & Sentence Construction Quiz",
        "dueDate": "2026-08-20",
        "status": "Graded",
        "score": 14,
        "maxScore": 20
      },
      {
        "id": "ASG-103",
        "title": "Elevator Pitch & Self-Introduction Video",
        "dueDate": "2026-09-01",
        "status": "Graded",
        "score": 20,
        "maxScore": 25
      },
      {
        "id": "ASG-104",
        "title": "Group Discussion 1 Synthesis & Rebuttal Memo",
        "dueDate": "2026-09-08",
        "status": "Graded",
        "score": 23,
        "maxScore": 30
      }
    ],
    "crRemarks": [
      {
        "id": "RMK-1043",
        "date": "2026-08-15",
        "author": "Aarav (Lead CR)",
        "text": "Active participant in Group 1 collaborative discussions."
      }
    ],
    "historicalScores": [
      {
        "date": "2026-08-07",
        "overallScore": 72,
        "communication": 75,
        "grammar": 66,
        "vocabulary": 77
      },
      {
        "date": "2026-08-21",
        "overallScore": 74,
        "communication": 77,
        "grammar": 68,
        "vocabulary": 79
      },
      {
        "date": "2026-09-04",
        "overallScore": 76,
        "communication": 78,
        "grammar": 70,
        "vocabulary": 80
      }
    ],
    "isArchived": false
  }
];

export const initialAttendanceRecords: AttendanceRecord[] = [
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10535",
    "status": "Excused",
    "remarks": "On-duty event",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10283",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10438",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10424",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10624",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10068",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10462",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10477",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10565",
    "status": "Late",
    "remarks": "Transit / bus delay",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10647",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10311",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10093",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10483",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10036",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10437",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10269",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10409",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10443",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10065",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10478",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10525",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10410",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10472",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10452",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10412",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10401",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10347",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10457",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10323",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10458",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10121",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10189",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10648",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10292",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10318",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10516",
    "status": "Late",
    "remarks": "Transit / bus delay",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10238",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10404",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10512",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10521",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10296",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10450",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10664",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-101",
    "studentId": "26bcs10718",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-08-04T09:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10535",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10283",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10438",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10424",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10624",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10068",
    "status": "Absent",
    "remarks": "Medical appointment",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10462",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10477",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10565",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10647",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10311",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10093",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10483",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10036",
    "status": "Late",
    "remarks": "Transit / bus delay",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10437",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10269",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10409",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10443",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10065",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10478",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10525",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10410",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10472",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10452",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10412",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10401",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10347",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10457",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10323",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10458",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10121",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10189",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10648",
    "status": "Late",
    "remarks": "Transit / bus delay",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10292",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10318",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10516",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10238",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10404",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10512",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10521",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10296",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10450",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10664",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-102",
    "studentId": "26bcs10718",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-07T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10535",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10283",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10438",
    "status": "Excused",
    "remarks": "On-duty event",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10424",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10624",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10068",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10462",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10477",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10565",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10647",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10311",
    "status": "Late",
    "remarks": "Transit / bus delay",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10093",
    "status": "Absent",
    "remarks": "Family function out of station",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10483",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10036",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10437",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10269",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10409",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10443",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10065",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10478",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10525",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10410",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10472",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10452",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10412",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10401",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10347",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10457",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10323",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10458",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10121",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10189",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10648",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10292",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10318",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10516",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10238",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10404",
    "status": "Late",
    "remarks": "Transit / bus delay",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10512",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10521",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10296",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10450",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10664",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-103",
    "studentId": "26bcs10718",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-12T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10535",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10283",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10438",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10424",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10624",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10068",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10462",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10477",
    "status": "Late",
    "remarks": "Transit / bus delay",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10565",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10647",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10311",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10093",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10483",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10036",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10437",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10269",
    "status": "Late",
    "remarks": "Transit / bus delay",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10409",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10443",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10065",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10478",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10525",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10410",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10472",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10452",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10412",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10401",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10347",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10457",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10323",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10458",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10121",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10189",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10648",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10292",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10318",
    "status": "Late",
    "remarks": "Transit / bus delay",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10516",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10238",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10404",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10512",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10521",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10296",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10450",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10664",
    "status": "Late",
    "remarks": "Transit / bus delay",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-104",
    "studentId": "26bcs10718",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-14T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10535",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10283",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10438",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10424",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10624",
    "status": "Excused",
    "remarks": "On-duty event",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10068",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10462",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10477",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10565",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10647",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10311",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10093",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10483",
    "status": "Late",
    "remarks": "Transit / bus delay",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10036",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10437",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10269",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10409",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10443",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10065",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10478",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10525",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10410",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10472",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10452",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10412",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10401",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10347",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10457",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10323",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10458",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10121",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10189",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10648",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10292",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10318",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10516",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10238",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10404",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10512",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10521",
    "status": "Late",
    "remarks": "Transit / bus delay",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10296",
    "status": "Late",
    "remarks": "Arrived 10 mins late due to lab transport delay",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10450",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10664",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-105",
    "studentId": "26bcs10718",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-19T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10535",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10283",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10438",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10424",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10624",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10068",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10462",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10477",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10565",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10647",
    "status": "Late",
    "remarks": "Transit / bus delay",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10311",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10093",
    "status": "Absent",
    "remarks": "Family function out of station",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10483",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10036",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10437",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10269",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10409",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10443",
    "status": "Late",
    "remarks": "Transit / bus delay",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10065",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10478",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10525",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10410",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10472",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10452",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10412",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10401",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10347",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10457",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10323",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10458",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10121",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10189",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10648",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10292",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10318",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10516",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10238",
    "status": "Late",
    "remarks": "Transit / bus delay",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10404",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10512",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10521",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10296",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10450",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10664",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-106",
    "studentId": "26bcs10718",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-08-21T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10535",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10283",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10438",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10424",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10624",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10068",
    "status": "Absent",
    "remarks": "Medical appointment",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10462",
    "status": "Excused",
    "remarks": "On-duty event",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10477",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10565",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10647",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10311",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10093",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10483",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10036",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10437",
    "status": "Late",
    "remarks": "Transit / bus delay",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10269",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10409",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10443",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10065",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10478",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10525",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10410",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10472",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10452",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10412",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10401",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10347",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10457",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10323",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10458",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10121",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10189",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10648",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10292",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10318",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10516",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10238",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10404",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10512",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10521",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10296",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10450",
    "status": "Late",
    "remarks": "Transit / bus delay",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10664",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-107",
    "studentId": "26bcs10718",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10535",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10283",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10438",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10424",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10624",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10068",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10462",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10477",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10565",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10647",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10311",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10093",
    "status": "Late",
    "remarks": "Transit / bus delay",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10483",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10036",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10437",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10269",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10409",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10443",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10065",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10478",
    "status": "Late",
    "remarks": "Transit / bus delay",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10525",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10410",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10472",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10452",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10412",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10401",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10347",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10457",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10323",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10458",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10121",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10189",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10648",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10292",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10318",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10516",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10238",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10404",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10512",
    "status": "Late",
    "remarks": "Transit / bus delay",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10521",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10296",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10450",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10664",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-108",
    "studentId": "26bcs10718",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-02T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10535",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10283",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10438",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10424",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10624",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10068",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10462",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10477",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10565",
    "status": "Excused",
    "remarks": "On-duty event",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10647",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10311",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10093",
    "status": "Absent",
    "remarks": "Family function out of station",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10483",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10036",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10437",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10269",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10409",
    "status": "Late",
    "remarks": "Transit / bus delay",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10443",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10065",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10478",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10525",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10410",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10472",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10452",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10412",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10401",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10347",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10457",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10323",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10458",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10121",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10189",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10648",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10292",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10318",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10516",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10238",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10404",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10512",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10521",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10296",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10450",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10664",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-109",
    "studentId": "26bcs10718",
    "status": "Late",
    "remarks": "Transit / bus delay",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10535",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10283",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10438",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10424",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10624",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10068",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10462",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10477",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10565",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10647",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10311",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10093",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10483",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10036",
    "status": "Late",
    "remarks": "Transit / bus delay",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10437",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10269",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10409",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10443",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10065",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10478",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10525",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10410",
    "status": "Late",
    "remarks": "Transit / bus delay",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10472",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10452",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10412",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10401",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10347",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10457",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10323",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10458",
    "status": "Absent",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10121",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10189",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10648",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10292",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10318",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10516",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10238",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10404",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10512",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10521",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10296",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10450",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10664",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  },
  {
    "sessionId": "SES-110",
    "studentId": "26bcs10718",
    "status": "Present",
    "remarks": "",
    "timestamp": "2026-09-04T14:45:00.000Z"
  }
];

export const initialFollowUps: FollowUp[] = [
  {
    "id": "FLW-1001",
    "studentId": "26bcs10093",
    "studentName": "Divyanshika Sharma",
    "issueType": "Low Attendance",
    "priority": "Urgent",
    "dateIdentified": "2026-09-05",
    "actionRequired": "Call student regarding 3 missed sessions (Attendance 70.0%). Coordinate extra doubt clearance with Dr. Priya Nair.",
    "assignedTo": "Aarav (Lead CR)",
    "deadline": "2026-09-12",
    "status": "Pending",
    "remarks": "Auto-rule threshold alert: Attendance below 75%.",
    "isAutoGenerated": true
  },
  {
    "id": "FLW-1002",
    "studentId": "26bcs10068",
    "studentName": "Anmol Kumar",
    "issueType": "Low Attendance",
    "priority": "High",
    "dateIdentified": "2026-09-04",
    "actionRequired": "Verify missed session reason for SES-107 and collect excuse note.",
    "assignedTo": "Aarav (Lead CR)",
    "deadline": "2026-09-11",
    "status": "In Progress",
    "remarks": "Reached out on WhatsApp, awaiting medical slip.",
    "isAutoGenerated": true
  },
  {
    "id": "FLW-1003",
    "studentId": "26bcs10296",
    "studentName": "Yahoshuva Kesaboyina",
    "issueType": "Participation",
    "priority": "Low",
    "dateIdentified": "2026-09-06",
    "actionRequired": "Invite as Group 5 Lead Speaker for Mock Interview panel.",
    "assignedTo": "Aarav (Lead CR)",
    "deadline": "2026-09-14",
    "status": "Pending",
    "remarks": "Top performer in Group Discussion 1.",
    "isAutoGenerated": false
  }
];

export const initialTasks: CRTask[] = [
  {
    "id": "TSK-01",
    "task": "Confirm audio/visual & mic setup in Language Lab 102 for Group Discussion 1",
    "category": "Session",
    "priority": "Urgent",
    "dueDate": "2026-09-04",
    "status": "Completed",
    "notes": "Checked amphitheatre seating, moderator podium, and wireless mics."
  },
  {
    "id": "TSK-02",
    "task": "Broadcast score review for Tenses Quiz_C on Official WhatsApp Group",
    "category": "Communication",
    "priority": "High",
    "dueDate": "2026-09-04",
    "status": "Completed",
    "notes": "Sent tense error analysis and practice PDF at 04:30 PM."
  },
  {
    "id": "TSK-03",
    "task": "Record attendance for Group Discussion 1 and flag absentees",
    "category": "Attendance",
    "priority": "Urgent",
    "dueDate": "2026-09-04",
    "status": "Completed",
    "notes": "Recorded attendance in tracker; lecture rate 76.7%."
  },
  {
    "id": "TSK-04",
    "task": "Call absentees (Vikram Joshi, Sneha Roy, Rahul S, Ananya P) regarding missed presentations",
    "category": "Student Support",
    "priority": "High",
    "dueDate": "2026-09-07",
    "status": "Pending",
    "notes": "Must submit verified absentee reasons to Dr. Priya Nair today."
  },
  {
    "id": "TSK-05",
    "task": "Coordinate room booking & projector with Dr. Priya Nair for 9 SEP Conditionals lecture",
    "category": "Faculty Coordination",
    "priority": "Medium",
    "dueDate": "2026-09-08",
    "status": "Pending",
    "notes": "Ensure Language Lab 102 is reserved for 02:00 PM - 03:30 PM."
  },
  {
    "id": "TSK-06",
    "task": "Export 4-Week English Language & Communication Skills Attendance CSV for HOD",
    "category": "Reporting",
    "priority": "Medium",
    "dueDate": "2026-09-09",
    "status": "Pending",
    "notes": "Weekly summary export due before mid-semester audit."
  },
  {
    "id": "TSK-07",
    "task": "Distribute Conditionals preparation worksheet and grammar drills to students",
    "category": "General",
    "priority": "Low",
    "dueDate": "2026-09-08",
    "status": "Pending",
    "notes": "Include zero, first, second, and third conditional exercises."
  }
];

export const initialStudentRequests: StudentRequest[] = [
  {
    "id": "REQ-2001",
    "studentId": "26bcs10093",
    "studentName": "Divyanshika Sharma",
    "type": "Leave / Absence Excuse",
    "subject": "Medical Excuse for Lecture 9 (SES-109)",
    "message": "Respected Ma'am, I had a severe migraine and visited the campus clinic on Sep 4th. Attached is my prescription from the health centre. Kindly excuse my absence.",
    "date": "2026-09-05",
    "status": "Pending"
  },
  {
    "id": "REQ-2002",
    "studentId": "26bcs10296",
    "studentName": "Yahoshuva Kesaboyina",
    "type": "Doubt / Query",
    "subject": "Clarification on Conditionals Type 3 Worksheet",
    "message": "Dear Dr. Priya Nair, I had a question on mixed conditionals in exercise 4. Could I clarify during office hours tomorrow?",
    "date": "2026-09-08",
    "status": "Approved",
    "teacherOrCrResponse": "Certainly Yahoshuva, drop by Faculty Block 3 Room 304 between 3:30 and 4:30 PM tomorrow.",
    "resolvedDate": "2026-09-08"
  },
  {
    "id": "REQ-2003",
    "studentId": "26bcs10424",
    "studentName": "Aditya Shaw",
    "type": "Assignment Extension",
    "subject": "GD-1 Synthesis Submission Extension Request",
    "message": "Requesting a 24-hour extension due to college hackathon participation.",
    "date": "2026-09-07",
    "status": "Pending"
  }
];
