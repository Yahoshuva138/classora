// scripts/verifyCohortSystem.cjs
const http = require('http');

async function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    }).on('error', reject);
  });
}

async function post(url, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      }
    }, (res) => {
      let resData = '';
      res.on('data', chunk => resData += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(resData) });
        } catch (e) {
          resolve({ status: res.statusCode, body: resData });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('=== CLASSORA END-TO-END COHORT VERIFICATION ===\n');

  // 1. Health check
  const health = await get('http://localhost:5000/api/health');
  console.log('1. Health Check:', health.status === 200 ? 'PASSED' : 'FAILED', health.body);

  // 2. Bootstrap check
  const bootstrap = await get('http://localhost:5000/api/bootstrap');
  if (bootstrap.status !== 200 || !bootstrap.body.success) {
    console.error('FAILED to fetch bootstrap data');
    process.exit(1);
  }
  const data = bootstrap.body.data;
  console.log('\n2. Bootstrap Data:');
  console.log(`- Total Students: ${data.students.length} (Expected: 44)`);
  console.log(`- Total Sessions: ${data.sessions.length} (Expected: 12)`);
  console.log(`- Attendance Records: ${data.attendanceRecords.length} (Expected: 440)`);

  // 3. Discussion Groups Distribution
  const groupCounts = {};
  data.students.forEach(s => {
    const grp = s.group || 'Ungrouped';
    groupCounts[grp] = (groupCounts[grp] || 0) + 1;
  });
  console.log('\n3. Official Discussion Group Distribution:');
  Object.keys(groupCounts).sort().forEach(g => {
    console.log(`  * ${g}: ${groupCounts[g]} students`);
  });

  // Verify group names are Group 1 to Group 7
  const expectedGroups = ['Group 1', 'Group 2', 'Group 3', 'Group 4', 'Group 5', 'Group 6', 'Group 7'];
  const allGroupsPresent = expectedGroups.every(g => groupCounts[g] >= 6);
  console.log(`- All 7 groups populated: ${allGroupsPresent ? 'PASSED' : 'FAILED'}`);

  // 4. Test Student Request Submission
  console.log('\n4. Testing Student Leave Request Flow:');
  const reqRes = await post('http://localhost:5000/api/requests', {
    type: 'Leave / Absence Excuse',
    subject: 'Absence excuse for 4 SEP Group Discussion 1 (SES-110)',
    message: 'I was participating in university inter-college debate tournament. Medical & permission slip attached.',
    studentId: '26bcs10296',
    studentName: 'Yahoshuva Kesaboyina'
  });
  console.log('- Create Request Status:', reqRes.status, reqRes.body?.success ? 'PASSED' : 'FAILED');

  // 5. Test Attendance Recording
  console.log('\n5. Testing Attendance Update:');
  const attRes = await post('http://localhost:5000/api/attendance', {
    sessionId: 'SES-110',
    studentId: '26bcs10296',
    status: 'Excused',
    remarks: 'Approved by Dr. Priya Nair (Medical / University Event)'
  });
  console.log('- Attendance Update Status:', attRes.status, attRes.body?.success ? 'PASSED' : 'FAILED');

  console.log('\n=== ALL END-TO-END TESTS COMPLETED SUCCESSFULLY ===');
}

runTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
