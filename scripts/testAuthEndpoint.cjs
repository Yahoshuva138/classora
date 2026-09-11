const http = require('http');

function makeRequest(path, method, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
        }
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk) => (responseBody += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(responseBody) });
          } catch {
            resolve({ status: res.statusCode, body: responseBody });
          }
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function run() {
  console.log('Testing SST Authentication API...');

  // 1. Test rejection of non-SST email
  const failRes = await makeRequest('/api/auth/google', 'POST', {
    email: 'hacker@gmail.com',
    name: 'External User'
  });
  console.log('Test 1 (@gmail.com rejection):', failRes.status === 403 ? 'PASSED (403 Forbidden)' : 'FAILED', failRes.body);

  // 2. Test acceptance of SST student
  const studentRes = await makeRequest('/api/auth/google', 'POST', {
    email: 'yahoshuva.26bcs10296@sst.scaler.com',
    name: 'Yahoshuva Kesaboyina'
  });
  console.log('Test 2 (Student Login):', studentRes.status === 200 && studentRes.body.data.role === 'Student' ? 'PASSED' : 'FAILED', studentRes.body.data);

  // 3. Test acceptance of SST CR
  const crRes = await makeRequest('/api/auth/google', 'POST', {
    email: 'aarav.sharma@sst.scaler.com',
    name: 'Aarav Sharma'
  });
  console.log('Test 3 (CR Login):', crRes.status === 200 && crRes.body.data.role === 'CR' ? 'PASSED' : 'FAILED', crRes.body.data);

  // 4. Test acceptance of SST Faculty
  const teacherRes = await makeRequest('/api/auth/google', 'POST', {
    email: 'priya.nair@sst.scaler.com',
    name: 'Dr. Priya Nair'
  });
  console.log('Test 4 (Faculty Login):', teacherRes.status === 200 && teacherRes.body.data.role === 'Teacher' ? 'PASSED' : 'FAILED', teacherRes.body.data);
}

run().catch(console.error);
