const assert = require('assert');
const fs = require('fs');
const path = require('path');

async function runTests() {
  console.log('🚀 Running Classora Marking Limits & Data Persistence Test Suite...\n');
  const BASE_URL = 'http://localhost:5000/api';

  let passed = 0;
  let total = 0;

  async function testCase(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}`);
      console.error('     Reason:', err.message);
    }
  }

  const TEST_STUDENT_ID = '26bcs10093';

  // -------------------------------------------------------------
  // SUITE 1: STRICT MARKING CRITERIA COLUMN LIMITS
  // -------------------------------------------------------------
  console.log('--- 1. Criteria Column Limits Enforcement ---');

  await testCase('English Test_C (ASG-101): Clamps score > 25 to 25', async () => {
    const res = await fetch(`${BASE_URL}/students/${TEST_STUDENT_ID}/assignments/ASG-101`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: 99 })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    const asg = data.data.find(a => a.id === 'ASG-101');
    assert.strictEqual(asg.score, 25, 'Score should be clamped to 25');
    assert.strictEqual(asg.maxScore, 25, 'Max score should be 25');
  });

  await testCase('English Test_C (ASG-101): Clamps negative score to 0', async () => {
    const res = await fetch(`${BASE_URL}/students/${TEST_STUDENT_ID}/assignments/ASG-101`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: -10 })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    const asg = data.data.find(a => a.id === 'ASG-101');
    assert.strictEqual(asg.score, 0, 'Score should be clamped to 0');
  });

  await testCase('English Test_C (ASG-101): Valid in-bounds score 22 is preserved', async () => {
    const res = await fetch(`${BASE_URL}/students/${TEST_STUDENT_ID}/assignments/ASG-101`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: 22 })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    const asg = data.data.find(a => a.id === 'ASG-101');
    assert.strictEqual(asg.score, 22);
  });

  await testCase('Tenses Quiz_C (ASG-102): Clamps score > 20 to 20', async () => {
    const res = await fetch(`${BASE_URL}/students/${TEST_STUDENT_ID}/assignments/ASG-102`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: 25 })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    const asg = data.data.find(a => a.id === 'ASG-102');
    assert.strictEqual(asg.score, 20, 'Score should be clamped to 20');
    assert.strictEqual(asg.maxScore, 20, 'Max score should be 20');
  });

  await testCase('Presentation (ASG-103): Clamps score > 25 to 25', async () => {
    const res = await fetch(`${BASE_URL}/students/${TEST_STUDENT_ID}/assignments/ASG-103`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: 50 })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    const asg = data.data.find(a => a.id === 'ASG-103');
    assert.strictEqual(asg.score, 25, 'Score should be clamped to 25');
    assert.strictEqual(asg.maxScore, 25, 'Max score should be 25');
  });

  await testCase('Group Discussion (ASG-104): Clamps score > 30 to 30', async () => {
    const res = await fetch(`${BASE_URL}/students/${TEST_STUDENT_ID}/assignments/ASG-104`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: 99 })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    const asg = data.data.find(a => a.id === 'ASG-104');
    assert.strictEqual(asg.score, 30, 'Score should be clamped to 30');
    assert.strictEqual(asg.maxScore, 30, 'Max score should be 30');
  });

  await testCase('Skill Scores: Clamps score > 100 to 100', async () => {
    const res = await fetch(`${BASE_URL}/students/${TEST_STUDENT_ID}/skills`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skill: 'grammar', score: 150 })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.data.grammar, 100);
  });

  await testCase('Skill Scores: Rejects invalid skill name (HTTP 400)', async () => {
    const res = await fetch(`${BASE_URL}/students/${TEST_STUDENT_ID}/skills`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skill: 'telepathy', score: 80 })
    });
    assert.strictEqual(res.status, 400);
  });

  // -------------------------------------------------------------
  // SUITE 2: DATA PERSISTENCE ACROSS SESSIONS & DISK SYNC
  // -------------------------------------------------------------
  console.log('\n--- 2. Data Persistence & Disk Storage ---');

  await testCase('Disk write-through: persistedStore.json contains updated student scores', async () => {
    // Wait 250ms for debounced disk flush
    await new Promise(r => setTimeout(r, 300));
    const storePath = path.join('server', 'data', 'persistedStore.json');
    assert.ok(fs.existsSync(storePath), 'persistedStore.json must exist');
    const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));
    assert.ok(store.students && store.students.length > 0, 'Students collection must be persisted');
    const savedStudent = store.students.find(s => s.id === TEST_STUDENT_ID || s.rollNo === TEST_STUDENT_ID);
    assert.ok(savedStudent, 'Target student must exist in disk store');
    const asg1 = savedStudent.assignments.find(a => a.id === 'ASG-101');
    assert.strictEqual(asg1.score, 22, 'Persisted store must contain the updated score 22');
  });

  await testCase('Attendance persistence: Marked attendance writes to disk store', async () => {
    const markRes = await fetch(`${BASE_URL}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'SES-107',
        studentId: TEST_STUDENT_ID,
        status: 'Present',
        remarks: 'Active participant in GD',
        actorRole: 'Teacher'
      })
    });
    assert.strictEqual(markRes.status, 200);

    // Wait 250ms for debounced disk flush
    await new Promise(r => setTimeout(r, 300));
    const storePath = path.join('server', 'data', 'persistedStore.json');
    const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));
    const attRecord = (store.attendance || []).find(a => a.sessionId === 'SES-107' && a.studentId === TEST_STUDENT_ID);
    assert.ok(attRecord, 'Attendance record must be saved in persistedStore.json');
    assert.strictEqual(attRecord.status, 'Present');
  });

  await testCase('Bootstrap endpoint serves persisted data correctly', async () => {
    const res = await fetch(`${BASE_URL}/bootstrap`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.success);
    const student = data.data.students.find(s => s.id === TEST_STUDENT_ID || s.rollNo === TEST_STUDENT_ID);
    assert.ok(student, 'Student must be returned in bootstrap');
    const asg = student.assignments.find(a => a.id === 'ASG-101');
    assert.strictEqual(asg.score, 22, 'Bootstrap data must retain persisted score 22');
  });

  console.log(`\n========================================`);
  console.log(`SUMMARY: ${passed}/${total} TESTS PASSED`);
  console.log(`========================================`);

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
