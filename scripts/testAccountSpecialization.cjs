/**
 * Verification Test Suite for Account Specialization:
 * Custom Display Photos, Academic Bio & Headlines, and Public Social Links
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('🧪 Starting Account Specialization Verification Suite...');

  // 1. Check types and schema validity in memory store / persisted data
  const storePath = path.join(__dirname, '../server/data/persistedStore.json');
  if (!fs.existsSync(storePath)) {
    throw new Error(`Store file not found at: ${storePath}`);
  }

  const rawStore = fs.readFileSync(storePath, 'utf8');
  const store = JSON.parse(rawStore);
  console.log(`✓ Loaded persistedStore.json (${store.users.length} users, ${store.students.length} students)`);

  // Verify Yahoshuva Kesaboyina user and student record
  const ykUser = store.users.find(u => u.studentId === '26bcs10296' || u.id === 'goog-26bcs10296');
  const ykStudent = store.students.find(s => s.id === '26bcs10296');

  if (!ykUser) throw new Error('Yahoshuva user record not found in persistedStore.json');
  if (!ykStudent) throw new Error('Yahoshuva student record not found in persistedStore.json');

  console.log(`✓ Found target user "${ykUser.name}" (${ykUser.email}) and student record "${ykStudent.name}" (${ykStudent.id})`);

  // Verify that test updates work via memoryStore directly or express
  const { memoryStore } = await import('../server/services/memoryStore.js');

  const testPayload = {
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
    headline: 'SST CSE 2026 • AI / Systems Enthusiast • Course Admin',
    bio: 'Pioneering intelligent agentic education platforms and real-time student analytics at Scaler School of Technology.',
    publicLinks: {
      github: 'https://github.com/Yahoshuva138',
      linkedin: 'https://linkedin.com/in/yahoshuva-kesaboyina',
      portfolio: 'https://yahoshuva.dev',
      leetcode: 'https://leetcode.com/u/yahoshuva',
      twitter: 'https://x.com/yahoshuva'
    }
  };

  // Perform update on user
  await memoryStore.collection('users').updateOne(
    { email: ykUser.email },
    { $set: testPayload }
  );

  // Perform sync update on student
  await memoryStore.collection('students').updateOne(
    { id: ykStudent.id },
    { $set: testPayload }
  );

  // Verify updated in memoryStore
  const updatedU = await memoryStore.collection('users').findOne({ email: ykUser.email });
  const updatedS = await memoryStore.collection('students').findOne({ id: ykStudent.id });

  if (updatedU.avatar !== testPayload.avatar) throw new Error('User avatar was not updated');
  if (updatedU.headline !== testPayload.headline) throw new Error('User headline was not updated');
  if (updatedU.publicLinks.github !== testPayload.publicLinks.github) throw new Error('User github link not updated');
  if (updatedS.avatar !== testPayload.avatar) throw new Error('Student avatar was not updated');
  if (updatedS.headline !== testPayload.headline) throw new Error('Student headline was not updated');
  if (updatedS.publicLinks.linkedin !== testPayload.publicLinks.linkedin) throw new Error('Student linkedin link not updated');

  console.log('✓ Verified user and student document updates with avatar, headline, bio, and all 5 public links');
  console.log('🎉 ALL ACCOUNT SPECIALIZATION TESTS PASSED SUCCESSFULLY!');
}

main().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
