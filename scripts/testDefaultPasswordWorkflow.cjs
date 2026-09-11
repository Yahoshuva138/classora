const http = require('http');

function makeRequest(path, method, body) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('=================================================================');
  console.log(' TESTING COHORT DEFAULT PASSWORD (SST@2026) & CHANGE PASSWORD    ');
  console.log('=================================================================');
  let passed = 0;
  let total = 0;

  // Reset database state to pristine default cohort
  await makeRequest('/api/resync-official', 'POST');

  async function test(title, fn) {
    total++;
    try {
      await fn();
      console.log(`✅ [PASS] ${title}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${title}:`, err.message);
    }
  }

  // 1. Login with Default Password for cohort student
  await test('Login with shared default password SST@2026 for cohort student', async () => {
    const res = await makeRequest('/api/auth/login', 'POST', {
      email: 'adapa.26bcs10283@sst.scaler.com',
      password: 'SST@2026'
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
    if (!res.body.user.mustChangePassword) throw new Error('Expected mustChangePassword: true');
    if (res.body.user.studentId !== '26bcs10283') throw new Error(`Expected studentId 26bcs10283, got ${res.body.user.studentId}`);
  });

  // 2. Login with Default Password for Yahoshuva
  await test('Login with shared default password SST@2026 for Yahoshuva', async () => {
    const res = await makeRequest('/api/auth/login', 'POST', {
      email: 'yahoshuva.26bcs10296@sst.scaler.com',
      password: 'SST@2026'
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
    if (res.body.user.studentId !== '26bcs10296') throw new Error(`Expected studentId 26bcs10296, got ${res.body.user.studentId}`);
  });

  // 3. Reject setting new password back to default password SST@2026
  await test('Reject changing password back to the default SST@2026', async () => {
    const res = await makeRequest('/api/auth/change-password', 'POST', {
      email: 'adapa.26bcs10283@sst.scaler.com',
      currentPassword: 'SST@2026',
      newPassword: 'SST@2026'
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    if (!res.body.error.includes('different from the shared cohort default')) throw new Error(`Unexpected error message: ${res.body.error}`);
  });

  // 4. Reject short password
  await test('Reject new password shorter than 4 characters', async () => {
    const res = await makeRequest('/api/auth/change-password', 'POST', {
      email: 'adapa.26bcs10283@sst.scaler.com',
      currentPassword: 'SST@2026',
      newPassword: '123'
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  // 5. Successfully change password
  await test('Successfully change password to private custom password', async () => {
    const res = await makeRequest('/api/auth/change-password', 'POST', {
      email: 'adapa.26bcs10283@sst.scaler.com',
      currentPassword: 'SST@2026',
      newPassword: 'AdapaPersonal#2026'
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
    if (res.body.user.mustChangePassword !== false) throw new Error('Expected mustChangePassword: false');
  });

  // 6. Login with new private password
  await test('Login with updated private password reflects mustChangePassword: false', async () => {
    const res = await makeRequest('/api/auth/login', 'POST', {
      email: 'adapa.26bcs10283@sst.scaler.com',
      password: 'AdapaPersonal#2026'
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.body.user.mustChangePassword !== false) throw new Error('Expected mustChangePassword: false after change');
  });

  console.log('=================================================================');
  console.log(`  RESULTS: ${passed}/${total} TESTS PASSED  `);
  console.log('=================================================================');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
