/**
 * Automated Verification Script: Guest Visitor Showcase & Admin Registry Security
 * 
 * Verifies:
 * 1. Guest session creation (POST /api/auth/guest-session)
 * 2. Guest heartbeat ping (POST /api/auth/guest-ping)
 * 3. Strict Read-Only Sandbox protection (Blocks attendance, student modification, tasks, followups with HTTP 403)
 * 4. Main Admin Exclusive registry protection (Strictly rejects Guest, Student, CR, Teacher with HTTP 403; allows Admin with HTTP 200)
 * 5. Admin deletion of visitor records
 */

const http = require('http');

const PORT = 5000;
const HOST = '127.0.0.1';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const headers = options.headers || {};
    if (options.body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const req = http.request(
      {
        hostname: HOST,
        port: PORT,
        path,
        method: options.method || 'GET',
        headers,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = data;
          }
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        });
      }
    );

    req.on('error', reject);

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('======================================================================');
  console.log('🧪 VERIFYING GUEST VISITOR SHOWCASE & ADMIN-ONLY REGISTRY SECURITY');
  console.log('======================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  try {
    // 1. Create Guest Session
    console.log('📌 Test Group 1: Guest Session Creation & Ping');
    const guestSessionRes = await request('/api/auth/guest-session', {
      method: 'POST',
      body: {
        guestName: 'Dr. Test Evaluator',
        deviceType: 'Desktop',
        userAgent: 'Mozilla/5.0 Test Suite Automated Agent'
      }
    });

    assert(guestSessionRes.status === 200, 'POST /api/auth/guest-session returns 200 OK');
    assert(guestSessionRes.data && guestSessionRes.data.success === true, 'Response contains success: true');
    assert(guestSessionRes.data && guestSessionRes.data.user && guestSessionRes.data.user.role === 'Guest', 'Guest user has role === "Guest"');
    assert(guestSessionRes.data && guestSessionRes.data.visitor && guestSessionRes.data.visitor.id, 'Response contains visitor session ID');

    const visitorId = guestSessionRes.data?.visitor?.id;

    // 2. Ping Guest Session
    if (visitorId) {
      const pingRes = await request('/api/auth/guest-ping', {
        method: 'POST',
        body: { visitorId }
      });
      assert(pingRes.status === 200 && pingRes.data.success === true, 'POST /api/auth/guest-ping returns 200 OK');
    }

    console.log('\n📌 Test Group 2: Strict Read-Only Sandbox Protection (Blocks Guest Mutations)');

    // Attempt to mark attendance as Guest
    const attendanceRes = await request('/api/attendance', {
      method: 'POST',
      body: {
        sessionId: 'test-session',
        studentId: 'test-student',
        status: 'Present',
        markedByRole: 'Guest',
        callerRole: 'Guest'
      }
    });
    assert(attendanceRes.status === 403, 'POST /api/attendance rejects Guest with HTTP 403 Forbidden');

    // Attempt to modify student as Guest
    const studentUpdateRes = await request('/api/students/dummy-student-id', {
      method: 'PUT',
      body: {
        name: 'Hacked Name',
        callerRole: 'Guest'
      }
    });
    assert(studentUpdateRes.status === 403, 'PUT /api/students/:id rejects Guest with HTTP 403 Forbidden');

    // Attempt to create task as Guest
    const taskRes = await request('/api/tasks', {
      method: 'POST',
      body: {
        title: 'Unauthorized Task',
        callerRole: 'Guest'
      }
    });
    assert(taskRes.status === 403, 'POST /api/tasks rejects Guest with HTTP 403 Forbidden');

    // Attempt to create followup as Guest
    const followupRes = await request('/api/followups', {
      method: 'POST',
      body: {
        studentName: 'Test Student',
        callerRole: 'Guest'
      }
    });
    assert(followupRes.status === 403, 'POST /api/followups rejects Guest with HTTP 403 Forbidden');

    // Attempt to change role as Guest
    const roleRes = await request('/api/auth/users/dummy/role', {
      method: 'PATCH',
      body: {
        newRole: 'Admin',
        callerRole: 'Guest'
      }
    });
    assert(roleRes.status === 403, 'PATCH /api/auth/users/:id/role rejects Guest with HTTP 403 Forbidden');

    console.log('\n📌 Test Group 3: Main-Admin-Only Guest Registry Access Protection');

    // Guest accessing registry -> 403
    const guestAccessRegistry = await request('/api/admin/guest-visitors', {
      headers: { 'x-caller-role': 'Guest' }
    });
    assert(guestAccessRegistry.status === 403, 'GET /api/admin/guest-visitors rejects Guest with HTTP 403');

    // Student accessing registry -> 403
    const studentAccessRegistry = await request('/api/admin/guest-visitors', {
      headers: { 'x-caller-role': 'Student' }
    });
    assert(studentAccessRegistry.status === 403, 'GET /api/admin/guest-visitors rejects Student with HTTP 403');

    // CR accessing registry -> 403
    const crAccessRegistry = await request('/api/admin/guest-visitors', {
      headers: { 'x-caller-role': 'CR' }
    });
    assert(crAccessRegistry.status === 403, 'GET /api/admin/guest-visitors rejects CR with HTTP 403');

    // Teacher accessing registry -> 403
    const teacherAccessRegistry = await request('/api/admin/guest-visitors', {
      headers: { 'x-caller-role': 'Teacher' }
    });
    assert(teacherAccessRegistry.status === 403, 'GET /api/admin/guest-visitors rejects Teacher with HTTP 403');

    // Admin accessing registry -> 200 OK
    const adminAccessRegistry = await request('/api/admin/guest-visitors', {
      headers: { 'x-caller-role': 'Admin' }
    });
    assert(adminAccessRegistry.status === 200, 'GET /api/admin/guest-visitors allows Admin with HTTP 200 OK');
    assert(Array.isArray(adminAccessRegistry.data.data), 'Registry data contains visitor array');
    const hasCreatedVisitor = adminAccessRegistry.data.data.some(v => v.id === visitorId);
    assert(hasCreatedVisitor, 'Newly created guest session is present in admin registry list');

    console.log('\n📌 Test Group 4: Admin Record Cleanup & Deletion');

    // Non-admin attempting deletion -> 403
    const unauthorizedDelete = await request(`/api/admin/guest-visitors/${visitorId}`, {
      method: 'DELETE',
      headers: { 'x-caller-role': 'Student' }
    });
    assert(unauthorizedDelete.status === 403, 'DELETE /api/admin/guest-visitors/:id rejects non-admin with HTTP 403');

    // Admin deleting record -> 200 OK
    const adminDelete = await request(`/api/admin/guest-visitors/${visitorId}`, {
      method: 'DELETE',
      headers: { 'x-caller-role': 'Admin' }
    });
    assert(adminDelete.status === 200, 'DELETE /api/admin/guest-visitors/:id allows Admin with HTTP 200 OK');

    console.log('\n======================================================================');
    console.log(`🏁 TEST SUMMARY: ${passed}/${total} assertions passed (${Math.round((passed / total) * 100)}%)`);
    console.log('======================================================================\n');

    if (passed === total) {
      console.log('🎉 ALL GUEST VISITOR SHOWCASE & RBAC SECURITY TESTS PASSED PERFECTLY!');
      process.exit(0);
    } else {
      console.error('💥 SOME TESTS FAILED.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Unexpected error running guest security tests:', error);
    process.exit(1);
  }
}

runTests();
