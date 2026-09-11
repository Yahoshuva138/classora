import { StudentCalculatedStats, Session, AttendanceRecord, FollowUp } from '../types';

/**
 * Trigger browser download of CSV string
 */
export function downloadCSV(filename: string, csvContent: string) {
  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate Attendance Report CSV
 */
export function generateAttendanceCSV(studentStats: StudentCalculatedStats[]): string {
  const headers = [
    'Student ID',
    'Full Name',
    'Batch',
    'Current Level',
    'Attendance %',
    'Status',
    'Attended Sessions',
    'Missed Sessions',
    'Present Count',
    'Late Count',
    'Absent Count',
    'Excused Count'
  ];

  const rows = studentStats.map(s => [
    `"${s.student.id}"`,
    `"${s.student.name}"`,
    `"${s.student.batch}"`,
    `"${s.student.currentLevel}"`,
    `${s.attendancePercentage}%`,
    `"${s.status}"`,
    s.attendedSessions,
    s.missedSessions,
    s.presentCount,
    s.lateCount,
    s.absentCount,
    s.excusedCount
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

/**
 * Generate Performance Report CSV
 */
export function generatePerformanceCSV(studentStats: StudentCalculatedStats[]): string {
  const headers = [
    'Student ID',
    'Full Name',
    'Batch',
    'Overall Score',
    'Improvement',
    'Communication',
    'Grammar',
    'Vocabulary',
    'Pronunciation',
    'Participation',
    'Assignments',
    'Assessments'
  ];

  const rows = studentStats.map(s => [
    `"${s.student.id}"`,
    `"${s.student.name}"`,
    `"${s.student.batch}"`,
    `${s.overallScore}/100`,
    `${s.scoreImprovement >= 0 ? '+' : ''}${s.scoreImprovement}`,
    s.student.skills?.communication ?? 75,
    s.student.skills?.grammar ?? 75,
    s.student.skills?.vocabulary ?? 75,
    s.student.skills?.pronunciation ?? 75,
    s.student.skills?.participation ?? 75,
    s.student.skills?.assignments ?? 75,
    s.student.skills?.assessments ?? 75
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

/**
 * Generate At-Risk Intervention Report CSV
 */
export function generateAtRiskCSV(atRiskStats: StudentCalculatedStats[]): string {
  const headers = [
    'Student ID',
    'Full Name',
    'Phone',
    'Email',
    'Batch',
    'Attendance %',
    'Missed Sessions',
    'Overall Score',
    'Current Level',
    'Recommended Action'
  ];

  const rows = atRiskStats.map(s => [
    `"${s.student.id}"`,
    `"${s.student.name}"`,
    `"${s.student.phone}"`,
    `"${s.student.email}"`,
    `"${s.student.batch}"`,
    `${s.attendancePercentage}%`,
    s.missedSessions,
    `${s.overallScore}/100`,
    `"${s.student.currentLevel}"`,
    s.attendancePercentage < 70 ? '"Immediate CR Contact & Parent Alert"' : '"Academic Mentorship & Check-in"'
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

/**
 * Generate Follow-up Tracker CSV
 */
export function generateFollowUpsCSV(followUps: FollowUp[]): string {
  const headers = [
    'Follow-up ID',
    'Student Name',
    'Issue Type',
    'Priority',
    'Status',
    'Date Identified',
    'Deadline',
    'Assigned To',
    'Action Required',
    'Remarks'
  ];

  const rows = followUps.map(f => [
    `"${f.id}"`,
    `"${f.studentName}"`,
    `"${f.issueType}"`,
    `"${f.priority}"`,
    `"${f.status}"`,
    `"${f.dateIdentified}"`,
    `"${f.deadline}"`,
    `"${f.assignedTo}"`,
    `"${(f.actionRequired || '').replace(/"/g, '""')}"`,
    `"${(f.remarks || '').replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

/**
 * Trigger export of Gradebook CSV directly
 */
export function exportGradebookCSV(students: import('../types').Student[]) {
  const headers = ['Student ID', 'Name', 'Batch', 'English Test_C (25)', 'Tenses Quiz_C (20)', 'Presentation (25)', 'Group Discussion (30)'];
  const rows = students.map(s => [
    `"${s.id}"`,
    `"${s.name}"`,
    `"${s.batch}"`,
    s.assignments?.[0]?.score ?? '',
    s.assignments?.[1]?.score ?? '',
    s.assignments?.[2]?.score ?? '',
    s.assignments?.[3]?.score ?? '',
  ]);
  const content = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCSV('Classora_English_Gradebook.csv', content);
}

/**
 * Trigger export of Attendance Summary CSV directly
 */
export function exportAttendanceSummaryCSV(studentStats: StudentCalculatedStats[]) {
  const content = generateAttendanceCSV(studentStats);
  downloadCSV('Classora_Attendance_Summary.csv', content);
}

/**
 * Trigger export of Full Matrix Attendance Sheet (44 students x 12 sessions)
 */
export function exportFullAttendanceMatrixCSV(
  students: import('../types').Student[],
  sessions: Session[],
  attendanceRecords: AttendanceRecord[]
) {
  const sortedSessions = [...sessions].sort((a, b) => a.date.localeCompare(b.date));
  const headers = [
    'Student Roll No',
    'Student Name',
    'Discussion Group',
    'Batch',
    ...sortedSessions.map(s => `"${s.id} (${s.date})"`),
    'Attended Count',
    'Total Sessions',
    'Attendance %',
    'Eligibility Status'
  ];

  const rows = students.filter(s => !s.isArchived).map(s => {
    const studentRecords = attendanceRecords.filter(r => r.studentId === s.id);
    let attended = 0;
    const sessionMarks = sortedSessions.map(ses => {
      const rec = studentRecords.find(r => r.sessionId === ses.id);
      const status = rec?.status || 'Unmarked';
      if (status === 'Present' || status === 'Late' || status === 'Excused') {
        attended++;
      }
      return `"${status}"`;
    });

    const total = sortedSessions.length;
    const pct = total > 0 ? Math.round((attended / total) * 100) : 0;
    const statusLabel = pct >= 85 ? 'On Track' : pct >= 75 ? 'Warning' : 'At Risk';

    return [
      `"${s.id}"`,
      `"${s.name}"`,
      `"${s.discussionGroup || 'Unassigned'}"`,
      `"${s.batch}"`,
      ...sessionMarks,
      attended,
      total,
      `${pct}%`,
      `"${statusLabel}"`
    ];
  });

  const content = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCSV('SST_Official_Attendance_Matrix_Term1_2026.csv', content);
}

/**
 * Generate a pre-filled CSV template for bulk attendance marking
 */
export function generateBulkAttendanceTemplateCSV(
  students: import('../types').Student[],
  sessionTopic: string = 'Session Attendance'
): string {
  const headers = [
    'Roll No',
    'Student Name',
    'Email',
    'Batch',
    'Status (Present/Absent/Late/Excused)',
    'Remarks'
  ];

  const rows = students
    .filter(s => !s.isArchived)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(s => [
      `"${s.id}"`,
      `"${s.name}"`,
      `"${s.email}"`,
      `"${s.batch}"`,
      `"Present"`,
      `""`
    ]);

  return [
    `# Classora Bulk Attendance Upload Template - ${sessionTopic}`,
    `# Instructions: Edit the Status column to Present, Absent, Late, or Excused (or P, A, L, E). Do not modify the Roll No column.`,
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');
}

