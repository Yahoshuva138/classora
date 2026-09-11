const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('==================================================');
console.log('CLASSORA ATTENDANCE & BULK UPLOAD TEST SUITE');
console.log('==================================================');

// 1. Check seedData.json and persistedStore.json
const seedData = JSON.parse(fs.readFileSync(path.join(__dirname, '../server/data/seedData.json'), 'utf8'));
const persistedStore = JSON.parse(fs.readFileSync(path.join(__dirname, '../server/data/persistedStore.json'), 'utf8'));

console.log('\n1. Verifying Database Stores:');
console.log(`- Seed Students count: ${seedData.initialStudents.length} (Expected 44)`);
assert.strictEqual(seedData.initialStudents.length, 44, 'Student count must be 44');

console.log(`- Seed Sessions count: ${seedData.initialSessions.length} (Expected 12)`);
assert.strictEqual(seedData.initialSessions.length, 12, 'Session count must be 12');

console.log(`- Seed Attendance count: ${seedData.initialAttendanceRecords.length} (Expected 343)`);
assert.strictEqual(seedData.initialAttendanceRecords.length, 343, 'Attendance count must be 343');

console.log(`- Persisted Attendance count: ${persistedStore.attendance.length} (Expected 343)`);
assert.strictEqual(persistedStore.attendance.length, 343, 'Persisted attendance count must be 343');
console.log('✅ Store counts verified successfully.');

// 2. Verify Attendance Calculations
console.log('\n2. Verifying Attendance Metrics Calculation:');
const records = seedData.initialAttendanceRecords;
let pCount = 0, aCount = 0, lCount = 0, eCount = 0;

records.forEach(r => {
  if (r.status === 'Present') pCount++;
  else if (r.status === 'Absent') aCount++;
  else if (r.status === 'Late') lCount++;
  else if (r.status === 'Excused') eCount++;
});

console.log(`- Present: ${pCount} (Report: 275)`);
assert.strictEqual(pCount, 275, 'Present count must be 275');

console.log(`- Absent: ${aCount} (Report: 67)`);
assert.strictEqual(aCount, 67, 'Absent count must be 67');

console.log(`- Late: ${lCount} (Report: 1)`);
assert.strictEqual(lCount, 1, 'Late count must be 1');

console.log(`- Excused: ${eCount} (Unrecorded/Missing left as-is: 0)`);
assert.strictEqual(eCount, 0, 'Excused count must be 0');

const rawPct = ((pCount + 0.5 * lCount) / (pCount + aCount + lCount)) * 100;
console.log(`- Authentic Cohort Attendance: ${rawPct.toFixed(1)}% (Expected 80.3%)`);
assert.strictEqual(rawPct.toFixed(1), '80.3', 'Cohort attendance percentage must be 80.3%');
console.log('✅ Cohort attendance rate verified successfully.');

// 3. Verify Student-Level Attendance Percentages
console.log('\n3. Verifying Student-Level Attendance & Watchlist:');
const students = seedData.initialStudents;
const completedSessions = seedData.initialSessions.filter(s => s.status === 'Completed');

const atRiskStudents = [];
students.forEach(s => {
  const studentRecs = records.filter(r => r.studentId === s.id);
  const p = studentRecs.filter(r => r.status === 'Present').length;
  const a = studentRecs.filter(r => r.status === 'Absent').length;
  const l = studentRecs.filter(r => r.status === 'Late').length;
  const marked = p + a + l;
  const pct = marked > 0 ? Math.round(((p + 0.5 * l) / marked) * 100) : 100;
  if (pct < 75) {
    atRiskStudents.push({ id: s.id, name: s.name, pct });
  }
});

console.log(`- Low Attendance Students (<75%): ${atRiskStudents.length} students found`);
assert.strictEqual(atRiskStudents.length, 9, 'Exactly 9 students must be in the at-risk watchlist');

const bhavya = atRiskStudents.find(s => s.id === '26bcs10565');
assert(bhavya && bhavya.pct === 0, 'Bhavya Jain must have 0% attendance');
console.log(`  ✓ 26bcs10565 Bhavya Jain: ${bhavya.pct}%`);

const vivek = atRiskStudents.find(s => s.id === '26bcs10525');
assert(vivek && vivek.pct === 13, 'Vivekvardhan Reddy must have 13% attendance');
console.log(`  ✓ 26bcs10525 Vivekvardhan Reddy: ${vivek.pct}%`);

console.log('✅ Student-level attendance calculations verified successfully.');

// 4. Verify Sessions Alignment
console.log('\n4. Verifying Session Curriculum & Status:');
const completedIds = completedSessions.map(s => s.id);
console.log(`- Completed Sessions: ${completedIds.join(', ')}`);
assert.strictEqual(completedSessions.length, 9, 'Must have 9 completed sessions (SES-101 to SES-109)');

const gdSession = seedData.initialSessions.find(s => s.id === 'SES-109');
assert(gdSession && gdSession.topic === 'Group Discussion 1', 'SES-109 must be Group Discussion 1');
assert.strictEqual(gdSession.status, 'Completed', 'SES-109 status must be Completed');

const condSession = seedData.initialSessions.find(s => s.id === 'SES-110');
assert(condSession && condSession.topic === 'Conditionals', 'SES-110 must be Conditionals');
console.log('✅ Session alignment verified successfully.');

console.log('\n==================================================');
console.log('🎉 ALL ATTENDANCE & BULK UPLOAD TESTS PASSED!');
console.log('==================================================');
