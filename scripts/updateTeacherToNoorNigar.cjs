const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '../server/data/persistedStore.json');
const raw = fs.readFileSync(storePath, 'utf8');
const store = JSON.parse(raw);

console.log('--- Current Counts ---');
console.log('Students:', store.students?.length);
console.log('Users:', store.users?.length);
console.log('Sessions:', store.sessions?.length);

// 1. Settings facultyList
if (store.settings && store.settings[0] && Array.isArray(store.settings[0].facultyList)) {
  store.settings[0].facultyList = store.settings[0].facultyList.map(f => 
    f.includes('Priya') || f.includes('Nair') ? 'Noor Nigar (Course Instructor)' : f
  );
  if (!store.settings[0].facultyList.includes('Noor Nigar (Course Instructor)')) {
    store.settings[0].facultyList.unshift('Noor Nigar (Course Instructor)');
  }
}

// 2. Sessions
if (Array.isArray(store.sessions)) {
  for (const s of store.sessions) {
    if (s.faculty && (s.faculty.includes('Priya') || s.faculty.includes('Nair'))) {
      s.faculty = 'Noor Nigar (Course Instructor)';
    }
  }
}

// 3. FollowUps
if (Array.isArray(store.followups)) {
  for (const f of store.followups) {
    if (f.actionRequired && f.actionRequired.includes('Priya')) {
      f.actionRequired = f.actionRequired.replace(/Dr\.\s*Priya\s*Nair/g, 'Noor Nigar');
    }
  }
}

// 4. Tasks
if (Array.isArray(store.tasks)) {
  for (const t of store.tasks) {
    if (t.task && t.task.includes('Priya')) {
      t.task = t.task.replace(/Dr\.\s*Priya\s*Nair/g, 'Noor Nigar');
    }
    if (t.notes && t.notes.includes('Priya')) {
      t.notes = t.notes.replace(/Dr\.\s*Priya\s*Nair/g, 'Noor Nigar');
    }
  }
}

// 5. Requests
if (Array.isArray(store.requests)) {
  for (const r of store.requests) {
    if (r.message && r.message.includes('Priya')) {
      r.message = r.message.replace(/Dr\.\s*Priya\s*Nair/g, "Ma'am Noor Nigar");
    }
  }
}

// 6. Users
if (Array.isArray(store.users)) {
  for (const u of store.users) {
    if (u.id === 'goog-faculty' || u.email === 'priya.nair@sst.scaler.com' || (u.name && u.name.includes('Priya'))) {
      u.name = 'Noor Nigar';
      u.email = 'noor.nigar@scaler.com';
      u.role = 'Teacher';
    }
  }

  // Ensure both noor.nigar@scaler.com and noor.nigar@sst.scaler.com exist
  const hasSstScaler = store.users.some(u => u.email === 'noor.nigar@sst.scaler.com');

  if (!hasSstScaler) {
    store.users.push({
      _id: `mem_${Date.now()}_noor_sst`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: 'goog-faculty-sst',
      name: 'Noor Nigar',
      email: 'noor.nigar@sst.scaler.com',
      role: 'Teacher',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      personaKey: 'coordinator_faculty_sst',
      isGoogleAuthenticated: true,
      password: 'SST@2026',
      isRegistered: true,
      mustChangePassword: true
    });
  }
}

// 7. ActivityLogs
if (Array.isArray(store.activitylogs)) {
  for (const a of store.activitylogs) {
    if (a.actorName && (a.actorName.includes('Priya') || a.actorName.includes('Nair'))) {
      a.actorName = 'Noor Nigar';
    }
  }
}

fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');

console.log('--- Migration to Noor Nigar Completed Successfully ---');
console.log('Students:', store.students?.length);
console.log('Users:', store.users?.length);
console.log('Sessions with Noor Nigar:', store.sessions?.filter(s => s.faculty?.includes('Noor Nigar')).length);
console.log('Teacher users:', store.users?.filter(u => u.role === 'Teacher').map(u => ({ name: u.name, email: u.email })));
