const assert = require('assert');

async function testRbac() {
  console.log('🚀 Starting Classora RBAC & Authority Hierarchy Test Suite...\n');
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
      console.error(`     Reason:`, err.message);
    }
  }

  // 1. Attendance permission tests
  await testCase('CR cannot mark single attendance (HTTP 403)', async () => {
    const res = await fetch(`${BASE_URL}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'CR' },
      body: JSON.stringify({ sessionId: 'SES-101', studentId: '26bcs10296', status: 'Present' })
    });
    assert.strictEqual(res.status, 403, `Expected status 403, got ${res.status}`);
  });

  await testCase('Student cannot mark single attendance (HTTP 403)', async () => {
    const res = await fetch(`${BASE_URL}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'Student' },
      body: JSON.stringify({ sessionId: 'SES-101', studentId: '26bcs10296', status: 'Present' })
    });
    assert.strictEqual(res.status, 403, `Expected status 403, got ${res.status}`);
  });

  await testCase('CR cannot bulk mark attendance (HTTP 403)', async () => {
    const res = await fetch(`${BASE_URL}/attendance/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'CR' },
      body: JSON.stringify({ sessionId: 'SES-101', records: [{ studentId: '26bcs10296', status: 'Present' }] })
    });
    assert.strictEqual(res.status, 403, `Expected status 403, got ${res.status}`);
  });

  await testCase('CR cannot reset session attendance (HTTP 403)', async () => {
    const res = await fetch(`${BASE_URL}/attendance/session/SES-101`, {
      method: 'DELETE',
      headers: { 'x-user-role': 'CR' }
    });
    assert.strictEqual(res.status, 403, `Expected status 403, got ${res.status}`);
  });

  await testCase('Teacher CAN mark single attendance (HTTP 200)', async () => {
    const res = await fetch(`${BASE_URL}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'Teacher' },
      body: JSON.stringify({ sessionId: 'SES-101', studentId: '26bcs10296', status: 'Present' })
    });
    assert.strictEqual(res.status, 200, `Expected status 200, got ${res.status}`);
  });

  await testCase('Teacher CAN bulk mark attendance (HTTP 200)', async () => {
    const res = await fetch(`${BASE_URL}/attendance/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'Teacher' },
      body: JSON.stringify({ sessionId: 'SES-101', records: [{ studentId: '26bcs10296', status: 'Present' }] })
    });
    assert.strictEqual(res.status, 200, `Expected status 200, got ${res.status}`);
  });

  await testCase('Admin CAN mark attendance (HTTP 200)', async () => {
    const res = await fetch(`${BASE_URL}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'Admin' },
      body: JSON.stringify({ sessionId: 'SES-101', studentId: '26bcs10296', status: 'Present' })
    });
    assert.strictEqual(res.status, 200, `Expected status 200, got ${res.status}`);
  });

  // 2. Student enrollment permission tests ("teacher add students")
  await testCase('CR cannot enroll a new student (HTTP 403)', async () => {
    const res = await fetch(`${BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'CR' },
      body: JSON.stringify({ name: 'Unauthorized Student', email: 'unauth@sst.scaler.com', batch: 'Batch A - Morning' })
    });
    assert.strictEqual(res.status, 403, `Expected status 403, got ${res.status}`);
  });

  await testCase('Teacher CAN enroll a new student (HTTP 201)', async () => {
    const testEmail = `teacher.student.${Date.now()}@sst.scaler.com`;
    const res = await fetch(`${BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'Teacher' },
      body: JSON.stringify({ name: 'Teacher Added Student', email: testEmail, batch: 'Batch A - Morning' })
    });
    assert.strictEqual(res.status, 201, `Expected status 201, got ${res.status}`);
  });

  await testCase('Admin CAN enroll a new student (HTTP 201)', async () => {
    const testEmail = `admin.student.${Date.now()}@sst.scaler.com`;
    const res = await fetch(`${BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'Admin' },
      body: JSON.stringify({ name: 'Admin Added Student', email: testEmail, batch: 'Batch A - Morning' })
    });
    assert.strictEqual(res.status, 201, `Expected status 201, got ${res.status}`);
  });

  // 3. Role Authority & Appointment tests
  await testCase('GET /auth/users returns user roster', async () => {
    const res = await fetch(`${BASE_URL}/auth/users`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(Array.isArray(data.data), 'Expected data.data to be an array');
    assert(data.data.length > 0, 'Expected non-empty users list');
  });

  await testCase('CR cannot modify any user role (HTTP 403)', async () => {
    const res = await fetch(`${BASE_URL}/auth/users/aarav.sharma@sst.scaler.com/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'CR' },
      body: JSON.stringify({ newRole: 'Teacher' })
    });
    assert.strictEqual(res.status, 403, `Expected status 403, got ${res.status}`);
  });

  await testCase('Teacher cannot appoint someone as Admin (HTTP 403)', async () => {
    const res = await fetch(`${BASE_URL}/auth/users/divyanshika.26bcs10093@sst.scaler.com/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'Teacher' },
      body: JSON.stringify({ newRole: 'Admin' })
    });
    assert.strictEqual(res.status, 403, `Expected status 403, got ${res.status}`);
  });

  await testCase('Teacher cannot appoint someone as Teacher (HTTP 403)', async () => {
    const res = await fetch(`${BASE_URL}/auth/users/divyanshika.26bcs10093@sst.scaler.com/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'Teacher' },
      body: JSON.stringify({ newRole: 'Teacher' })
    });
    assert.strictEqual(res.status, 403, `Expected status 403, got ${res.status}`);
  });

  await testCase('Teacher CAN appoint a Student as CR (HTTP 200 - "teacher makes the cr")', async () => {
    const res = await fetch(`${BASE_URL}/auth/users/divyanshika.26bcs10093@sst.scaler.com/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'Teacher' },
      body: JSON.stringify({ newRole: 'CR' })
    });
    assert.strictEqual(res.status, 200, `Expected status 200, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.user.role, 'CR');
  });

  await testCase('Teacher CAN relieve a CR back to Student (HTTP 200)', async () => {
    const res = await fetch(`${BASE_URL}/auth/users/divyanshika.26bcs10093@sst.scaler.com/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'Teacher' },
      body: JSON.stringify({ newRole: 'Student' })
    });
    assert.strictEqual(res.status, 200, `Expected status 200, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.user.role, 'Student');
  });

  await testCase('Admin CAN appoint someone as Teacher (HTTP 200 - "admin who rules everyone")', async () => {
    const res = await fetch(`${BASE_URL}/auth/users/aditya.26bcs10424@sst.scaler.com/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'Admin' },
      body: JSON.stringify({ newRole: 'Teacher' })
    });
    assert.strictEqual(res.status, 200, `Expected status 200, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.user.role, 'Teacher');
  });

  await testCase('Admin CAN revert Teacher back to Student (HTTP 200)', async () => {
    const res = await fetch(`${BASE_URL}/auth/users/aditya.26bcs10424@sst.scaler.com/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-user-role': 'Admin' },
      body: JSON.stringify({ newRole: 'Student' })
    });
    assert.strictEqual(res.status, 200, `Expected status 200, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.user.role, 'Student');
  });

  console.log(`\n========================================`);
  console.log(`Result: ${passed}/${total} Tests Passed!`);
  console.log(`========================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

testRbac().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
