const http = require('http');

function post(path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api' + path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        ...headers
      }
    }, res => {
      let buf = '';
      res.on('data', chunk => buf += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(buf) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: buf });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api' + path,
      method: 'GET'
    }, res => {
      let buf = '';
      res.on('data', chunk => buf += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(buf) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: buf });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  console.log('=== 1. Testing Bootstrap Endpoint ===');
  const bootRes = await get('/bootstrap');
  console.log('Bootstrap HTTP status:', bootRes.status);
  const bootData = bootRes.data.data;
  console.log('Students Count:', bootData.students?.length);
  console.log('Faculty List:', bootData.settings?.facultyList);
  if (bootData.students?.length !== 44) {
    throw new Error(`Expected 44 students, found ${bootData.students?.length}`);
  }
  if (!bootData.settings?.facultyList?.[0]?.includes('Noor Nigar')) {
    throw new Error(`Expected Noor Nigar as first faculty, found: ${bootData.settings?.facultyList?.[0]}`);
  }

  console.log('\n=== 2. Testing Teacher Login: noor.nigar@scaler.com ===');
  const loginRes1 = await post('/auth/login', {
    email: 'noor.nigar@scaler.com',
    password: 'SST@2026'
  });
  console.log('Login @scaler.com HTTP status:', loginRes1.status);
  console.log('User name:', loginRes1.data.user?.name);
  console.log('User role:', loginRes1.data.user?.role);
  if (loginRes1.data.user?.role !== 'Teacher' || loginRes1.data.user?.name !== 'Noor Nigar') {
    throw new Error(`Expected Teacher Noor Nigar, got: ${JSON.stringify(loginRes1.data)}`);
  }

  console.log('\n=== 3. Testing Teacher Login: noor.nigar@sst.scaler.com ===');
  const loginRes2 = await post('/auth/login', {
    email: 'noor.nigar@sst.scaler.com',
    password: 'SST@2026'
  });
  console.log('Login @sst.scaler.com HTTP status:', loginRes2.status);
  console.log('User name:', loginRes2.data.user?.name);
  console.log('User role:', loginRes2.data.user?.role);
  if (loginRes2.data.user?.role !== 'Teacher' || loginRes2.data.user?.name !== 'Noor Nigar') {
    throw new Error(`Expected Teacher Noor Nigar, got: ${JSON.stringify(loginRes2.data)}`);
  }

  console.log('\n=== 4. Testing Google Auth: noor.nigar@scaler.com ===');
  const gAuthRes = await post('/auth/google', {
    email: 'noor.nigar@scaler.com',
    name: 'Noor Nigar'
  });
  const gAuthUser = gAuthRes.data.data || gAuthRes.data.user;
  console.log('Google Auth status:', gAuthRes.status);
  console.log('Google Auth role:', gAuthUser?.role);
  if (gAuthUser?.role !== 'Teacher') {
    throw new Error(`Expected Teacher role from Google Auth, got: ${JSON.stringify(gAuthRes.data)}`);
  }

  console.log('\n=== 5. Testing Teacher Attendance Permissions ===');
  // Faculty recording attendance
  const markRes = await post('/attendance/bulk', {
    sessionId: 'SES-110',
    records: [{ studentId: '26bcs10093', status: 'Present' }],
    actorName: 'Noor Nigar',
    actorRole: 'Teacher'
  }, { 'x-user-role': 'Teacher' });
  console.log('Teacher attendance mark HTTP status:', markRes.status);
  if (markRes.status !== 200) {
    throw new Error(`Expected 200 for teacher attendance mark, got ${markRes.status}`);
  }

  // Student recording attendance (should be forbidden 403)
  const studentMarkRes = await post('/attendance/bulk', {
    sessionId: 'SES-110',
    records: [{ studentId: '26bcs10093', status: 'Present' }],
    actorName: 'Divyanshika Sharma',
    actorRole: 'Student'
  }, { 'x-user-role': 'Student' });
  console.log('Student attendance mark HTTP status (expecting 403):', studentMarkRes.status);
  if (studentMarkRes.status !== 403) {
    throw new Error(`Expected 403 for student attendance mark, got ${studentMarkRes.status}`);
  }

  // CR recording attendance (should be forbidden 403)
  const crMarkRes = await post('/attendance/bulk', {
    sessionId: 'SES-110',
    records: [{ studentId: '26bcs10093', status: 'Present' }],
    actorName: 'Aarav Sharma',
    actorRole: 'CR'
  }, { 'x-user-role': 'CR' });
  console.log('CR attendance mark HTTP status (expecting 403):', crMarkRes.status);
  if (crMarkRes.status !== 403) {
    throw new Error(`Expected 403 for CR attendance mark, got ${crMarkRes.status}`);
  }

  console.log('\n>>> ALL TEACHER IDENTITY & PERMISSION CHECKS PASSED PERFECTLY! <<<');
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
