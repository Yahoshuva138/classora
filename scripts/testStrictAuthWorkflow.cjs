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
  console.log('  TESTING STRICT 2-STEP AUTHENTICATION & 44-STUDENT COHORT RULES  ');
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

  // 1. Check Roster Endpoint
  await test('Cohort roster returns exactly 44 official SST students', async () => {
    const res = await makeRequest('/api/auth/cohort-roster', 'GET');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.body.count !== 44) throw new Error(`Expected 44 students, got ${res.body.count}`);
  });

  // 2. Reject non-SST domain
  await test('Reject external email registration (@gmail.com)', async () => {
    const res = await makeRequest('/api/auth/register', 'POST', {
      name: 'External User',
      email: 'user@gmail.com',
      password: 'password123'
    });
    if (res.status !== 403) throw new Error(`Expected 403, got ${res.status}`);
  });

  // 3. Reject SST email not in 44-student cohort
  await test('Reject non-cohort SST email (@sst.scaler.com not in roster)', async () => {
    const res = await makeRequest('/api/auth/register', 'POST', {
      name: 'Unknown Student',
      email: 'unknown.26bcs99999@sst.scaler.com',
      password: 'password123'
    });
    if (res.status !== 403) throw new Error(`Expected 403, got ${res.status}: ${JSON.stringify(res.body)}`);
    if (!res.body.error.includes('44 students')) throw new Error('Expected 44 students mention in error');
  });

  // 4. Default password login for cohort students
  await test('Cohort student can log in directly with shared default password SST@2026', async () => {
    const res = await makeRequest('/api/auth/login', 'POST', {
      email: 'adapa.26bcs10283@sst.scaler.com',
      password: 'SST@2026'
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
    if (!res.body.user.mustChangePassword) throw new Error('Expected mustChangePassword: true for default password login');
  });

  // 5. Successful registration for official cohort student
  await test('Successfully register official cohort student (Anmol Kumar)', async () => {
    const res = await makeRequest('/api/auth/register', 'POST', {
      name: 'Anmol Kumar',
      email: 'anmol.26bcs10068@sst.scaler.com',
      password: 'securePassword2026'
    });
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}: ${JSON.stringify(res.body)}`);
    if (!res.body.isRegistered) throw new Error('Expected isRegistered: true');
    if (!res.body.message.includes('Registration successful')) throw new Error(`Unexpected message: ${res.body.message}`);
  });

  // 6. Prevent duplicate registration
  await test('Reject duplicate registration attempt for already registered student', async () => {
    const res = await makeRequest('/api/auth/register', 'POST', {
      name: 'Anmol Kumar',
      email: 'anmol.26bcs10068@sst.scaler.com',
      password: 'securePassword2026'
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}: ${JSON.stringify(res.body)}`);
    if (!res.body.error.includes('already registered')) throw new Error(`Expected "already registered", got: ${res.body.error}`);
  });

  // 7. Reject login with wrong password
  await test('Reject login with incorrect password', async () => {
    const res = await makeRequest('/api/auth/login', 'POST', {
      email: 'anmol.26bcs10068@sst.scaler.com',
      password: 'wrongPassword123'
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}: ${JSON.stringify(res.body)}`);
    if (!res.body.error.includes('Incorrect password')) throw new Error(`Expected "Incorrect password", got: ${res.body.error}`);
  });

  // 8. Successful login with correct password
  await test('Successfully login with correct registered password', async () => {
    const res = await makeRequest('/api/auth/login', 'POST', {
      email: 'anmol.26bcs10068@sst.scaler.com',
      password: 'securePassword2026'
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
    if (res.body.user.role !== 'Student') throw new Error(`Expected role Student, got ${res.body.user.role}`);
    if (res.body.user.studentId !== '26bcs10068') throw new Error(`Expected studentId 26bcs10068, got ${res.body.user.studentId}`);
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
