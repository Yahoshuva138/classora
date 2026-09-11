const fs = require('fs');
const path = require('path');

const seedDataPath = path.join(__dirname, '..', 'server', 'data', 'seedData.json');
const mockDataPath = path.join(__dirname, '..', 'src', 'data', 'mockData.ts');

const seed = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));

const content = `import {
  Student,
  Session,
  AttendanceRecord,
  FollowUp,
  CRTask,
  AppSettings,
  StudentRequest
} from '../types';

export const initialSettings: AppSettings = ${JSON.stringify(seed.initialSettings, null, 2)};

export const initialSessions: Session[] = ${JSON.stringify(seed.initialSessions, null, 2)};

export const initialStudents: Student[] = ${JSON.stringify(seed.initialStudents, null, 2)};

export const initialAttendanceRecords: AttendanceRecord[] = ${JSON.stringify(seed.initialAttendanceRecords, null, 2)};

export const initialFollowUps: FollowUp[] = ${JSON.stringify(seed.initialFollowUps, null, 2)};

export const initialTasks: CRTask[] = ${JSON.stringify(seed.initialTasks, null, 2)};

export const initialStudentRequests: StudentRequest[] = ${JSON.stringify(seed.initialStudentRequests, null, 2)};
`;

fs.writeFileSync(mockDataPath, content, 'utf8');
console.log('[Success] src/data/mockData.ts synchronized with official 44 students and 7 groups!');
