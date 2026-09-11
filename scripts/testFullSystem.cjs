const http = require('http');

function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {})
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runMasterTest() {
  console.log('======================================================================');
  console.log('       CLASSORA ACADEMIC OS — FULL SYSTEM VERIFICATION SUITE         ');
  console.log('======================================================================\n');

  let passed = 0;
  let total = 0;

  async function check(name, testFn) {
    total++;
    try {
      await testFn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
    }
  }

  // 1. Healthcheck
  await check('Backend Healthcheck Endpoint (/api/health)', async () => {
    const res = await makeRequest('/api/health');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (res.body.status !== 'healthy') throw new Error(`Health status: ${res.body.status}`);
  });

  // 2. Resync to clean state
  await check('Database Resync & Re-hydration (/api/resync-official)', async () => {
    const res = await makeRequest('/api/resync-official', 'POST');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  // 3. Official 44-Student Cohort Roster
  await check('Official Cohort Roster returns exactly 44 students (/api/auth/cohort-roster)', async () => {
    const res = await makeRequest('/api/auth/cohort-roster');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (res.body.count !== 44) throw new Error(`Expected 44 students, got ${res.body.count}`);
    if (res.body.roster.length !== 44) throw new Error(`Array length is ${res.body.roster.length}`);
  });

  // 4. Default Password Login
  await check('Login with default cohort password SST@2026 flags mustChangePassword', async () => {
    const res = await makeRequest('/api/auth/login', 'POST', {
      email: 'adapa.26bcs10283@sst.scaler.com',
      password: 'SST@2026'
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}: ${JSON.stringify(res.body)}`);
    if (res.body.user.mustChangePassword !== true) throw new Error('Expected mustChangePassword: true');
    if (res.body.user.studentId !== '26bcs10283') throw new Error(`Expected studentId 26bcs10283`);
  });

  // 5. Change Password Validation & Execution
  await check('Change password to secure custom password and clear mustChangePassword', async () => {
    const res = await makeRequest('/api/auth/change-password', 'POST', {
      email: 'adapa.26bcs10283@sst.scaler.com',
      currentPassword: 'SST@2026',
      newPassword: 'MySecurePassword#2026'
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}: ${JSON.stringify(res.body)}`);
    if (res.body.user.mustChangePassword !== false) throw new Error('Expected mustChangePassword: false');
  });

  // 6. Login with new password
  await check('Login with updated personal password succeeds', async () => {
    const res = await makeRequest('/api/auth/login', 'POST', {
      email: 'adapa.26bcs10283@sst.scaler.com',
      password: 'MySecurePassword#2026'
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (res.body.user.mustChangePassword !== false) throw new Error('Expected mustChangePassword: false');
  });

  // 7. Security: Block non-cohort email
  await check('Security: Reject external email registration (HTTP 403)', async () => {
    const res = await makeRequest('/api/auth/register', 'POST', {
      name: 'External Hacker',
      email: 'hacker@gmail.com',
      password: 'hackpassword'
    });
    if (res.status !== 403) throw new Error(`Expected 403, got ${res.status}`);
  });

  // 8. Students API
  await check('Students API returns all 44 students (/api/students)', async () => {
    const res = await makeRequest('/api/students');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = res.body.data || res.body;
    if (!Array.isArray(data) || data.length !== 44) throw new Error(`Expected 44 students, got ${data?.length}`);
  });

  // 9. Sessions API
  await check('Sessions API returns all curriculum sessions (/api/sessions)', async () => {
    const res = await makeRequest('/api/sessions');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = res.body.data || res.body;
    if (!Array.isArray(data) || data.length < 10) throw new Error(`Expected >= 10 sessions, got ${data?.length}`);
  });

  // 10. Attendance Records API
  await check('Attendance Records API is operational (/api/attendance)', async () => {
    const res = await makeRequest('/api/attendance');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = res.body.data || res.body;
    if (!Array.isArray(data) || data.length === 0) throw new Error('Expected attendance records');
  });

  // 11. Activity Log API
  await check('Activity Log records recent system events (/api/activity-logs)', async () => {
    const res = await makeRequest('/api/activity-logs');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = res.body.data || res.body;
    if (!Array.isArray(data) || data.length === 0) throw new Error('Expected activity logs');
  });

  // 12. Student Leave Request Flow
  await check('Student Leave Request Submission (/api/requests)', async () => {
    const res = await makeRequest('/api/requests', 'POST', {
      studentId: '26bcs10296',
      studentName: 'Yahoshuva Kesaboyina',
      type: 'Leave',
      title: 'Hackathon Attendance Permission',
      reason: 'Representing Scaler at National Hackathon',
      date: '2026-09-15'
    });
    if (res.status !== 201 && res.status !== 200) throw new Error(`Expected 200/201, got ${res.status}`);
  });

  // 13. Production SPA Serving
  await check('Unified Server serves compiled frontend SPA index.html (GET /)', async () => {
    const res = await makeRequest('/');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const content = res.raw || JSON.stringify(res.body);
    if (!content.includes('<!doctype html>') || !content.includes('root')) {
      throw new Error('Response did not contain valid SPA index.html');
    }
  });

  console.log('\n======================================================================');
  console.log(`                     RESULTS: ${passed}/${total} CHECKS PASSED`);
  console.log('======================================================================\n');

  process.exit(passed === total ? 0 : 1);
}

runMasterTest();
