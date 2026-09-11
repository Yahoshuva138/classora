import {
  Student,
  Session,
  AttendanceRecord,
  AppSettings,
  StudentCalculatedStats,
  RiskStatus
} from '../types';

/**
 * Calculates attendance statistics for a single student across all applicable sessions.
 */
export function calculateStudentStats(
  student: Student,
  sessions: Session[],
  attendanceRecords: AttendanceRecord[],
  settings: AppSettings
): StudentCalculatedStats {
  // Find sessions that belong to this student's batch or all batches, and are conducted (Completed or In Progress)
  const studentSessions = sessions.filter(
    s => (s.batch === 'All Batches' || s.batch === student.batch) &&
         (s.status === 'Completed' || s.status === 'In Progress')
  );

  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let excusedCount = 0;

  studentSessions.forEach(session => {
    const record = attendanceRecords.find(
      r => r.sessionId === session.id && r.studentId === student.id
    );

    if (record) {
      if (record.status === 'Present') presentCount++;
      else if (record.status === 'Absent') absentCount++;
      else if (record.status === 'Late') lateCount++;
      else if (record.status === 'Excused') excusedCount++;
    }
  });

  const totalMarkedSessions = presentCount + absentCount + lateCount;
  const applicableSessions = totalMarkedSessions;

  const safeSettings = settings || {
    atRiskThreshold: 75,
    onTrackThreshold: 85,
    lateAttendanceWeight: 0.5,
  };

  let attendancePercentage = 100;
  if (applicableSessions > 0) {
    const effectiveAttended = presentCount + (lateCount * (safeSettings.lateAttendanceWeight ?? 0.5));
    attendancePercentage = Math.min(100, Math.round((effectiveAttended / applicableSessions) * 100));
  }

  // Determine Risk Status
  let status: RiskStatus = 'On Track';
  if (attendancePercentage < (safeSettings.atRiskThreshold ?? 75)) {
    status = 'At Risk';
  } else if (attendancePercentage < (safeSettings.onTrackThreshold ?? 85)) {
    status = 'Needs Attention';
  }

  // Calculate Overall Skill Score (Average of 7 skills) with null safety
  const skills = student.skills || {
    communication: 75,
    grammar: 75,
    vocabulary: 75,
    pronunciation: 75,
    participation: 75,
    assignments: 75,
    assessments: 75,
  };
  const {
    communication = 75,
    grammar = 75,
    vocabulary = 75,
    pronunciation = 75,
    participation = 75,
    assignments = 75,
    assessments = 75
  } = skills;
  const overallScore = Math.round(
    (communication + grammar + vocabulary + pronunciation + participation + assignments + assessments) / 7
  );

  const scoreImprovement = overallScore - (student.previousOverallScore || overallScore);

  return {
    student,
    totalApplicableSessions: applicableSessions,
    presentCount,
    absentCount,
    lateCount,
    excusedCount,
    attendedSessions: presentCount + lateCount,
    missedSessions: absentCount,
    attendancePercentage,
    status,
    overallScore,
    scoreImprovement,
  };
}

/**
 * Computes dashboard-wide metrics and aggregates.
 */
export function calculateDashboardMetrics(
  students: Student[],
  sessions: Session[],
  attendanceRecords: AttendanceRecord[],
  settings: AppSettings
) {
  const activeStudents = students.filter(s => !s.isArchived);
  const studentStats = activeStudents.map(student =>
    calculateStudentStats(student, sessions, attendanceRecords, settings)
  );

  // Today's Date formatted YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // Sessions today
  const todaySessions = sessions.filter(s => s.date === todayStr);
  const conductedSessions = sessions.filter(s => s.status === 'Completed');
  const pendingSessions = sessions.filter(s => s.status === 'Upcoming' || s.status === 'In Progress');

  // Today's attendance calculation
  let todayPresentCount = 0;
  let todayAbsentCount = 0;
  let todayTotalMarked = 0;

  if (todaySessions.length > 0) {
    const todaySessionIds = todaySessions.map(s => s.id);
    const todayRecords = attendanceRecords.filter(r => todaySessionIds.includes(r.sessionId));

    todayRecords.forEach(r => {
      if (r.status === 'Present' || r.status === 'Late') {
        todayPresentCount++;
        todayTotalMarked++;
      } else if (r.status === 'Absent') {
        todayAbsentCount++;
        todayTotalMarked++;
      }
    });
  }

  // Pure Real-Time metrics for today
  let presentToday = todayPresentCount;
  let absentToday = todayAbsentCount;
  let presentPercentage = 0;
  let absentPercentage = 0;

  if (todayTotalMarked > 0) {
    presentPercentage = Math.round((todayPresentCount / todayTotalMarked) * 100);
    absentPercentage = Math.round((todayAbsentCount / todayTotalMarked) * 100);
  }

  // Real-time sessions with recorded attendance
  const sessionsWithRecords = sessions.filter(session =>
    attendanceRecords.some(r => r.sessionId === session.id)
  );

  // Average class attendance % (only when sessions have been recorded)
  let averageAttendance = 0;
  if (sessionsWithRecords.length > 0 && studentStats.length > 0) {
    const totalAttendanceSum = studentStats.reduce((acc, curr) => acc + curr.attendancePercentage, 0);
    averageAttendance = Math.round(totalAttendanceSum / studentStats.length);
  }

  // Status Distribution
  const onTrackCount = studentStats.filter(s => s.status === 'On Track').length;
  const needsAttentionCount = studentStats.filter(s => s.status === 'Needs Attention').length;
  const atRiskCount = studentStats.filter(s => s.status === 'At Risk').length;

  // Students Needing Attention (sorted by lowest attendance % first)
  const studentsNeedingAttention = studentStats
    .filter(s => s.status === 'At Risk' || s.status === 'Needs Attention')
    .sort((a, b) => a.attendancePercentage - b.attendancePercentage);

  // Top Performers (sorted by overall score & attendance)
  const topPerformers = [...studentStats]
    .sort((a, b) => (b.overallScore * 0.6 + b.attendancePercentage * 0.4) - (a.overallScore * 0.6 + a.attendancePercentage * 0.4))
    .slice(0, 5);

  // Real-Time Attendance Trend (Chronological sessions with recorded attendance)
  const attendanceTrend = sessionsWithRecords
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-8)
    .map(session => {
      const records = attendanceRecords.filter(r => r.sessionId === session.id);
      const present = records.filter(r => r.status === 'Present' || r.status === 'Late').length;
      const total = records.length || 1;
      const pct = Math.round((present / total) * 100);
      return {
        sessionName: session.topic.length > 18 ? session.topic.slice(0, 16) + '...' : session.topic,
        fullTopic: session.topic,
        date: session.date,
        attendancePct: pct,
        present,
        total,
      };
    });

  // Real-Time Recent Sessions Bar Chart Data
  const recentSessionsData = sessionsWithRecords
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-5)
    .map(session => {
      const records = attendanceRecords.filter(r => r.sessionId === session.id);
      const present = records.filter(r => r.status === 'Present').length;
      const late = records.filter(r => r.status === 'Late').length;
      const absent = records.filter(r => r.status === 'Absent').length;
      const excused = records.filter(r => r.status === 'Excused').length;
      return {
        name: session.topic.length > 14 ? session.topic.slice(0, 12) + '..' : session.topic,
        fullName: session.topic,
        Present: present,
        Late: late,
        Absent: absent,
        Excused: excused,
        date: session.date,
      };
    });

  // Skill analysis
  const skillTotals = {
    communication: 0,
    grammar: 0,
    vocabulary: 0,
    pronunciation: 0,
    participation: 0,
    assignments: 0,
    assessments: 0,
  };

  activeStudents.forEach(s => {
    const sk = s.skills || {
      communication: 75,
      grammar: 75,
      vocabulary: 75,
      pronunciation: 75,
      participation: 75,
      assignments: 75,
      assessments: 75,
    };
    skillTotals.communication += sk.communication ?? 75;
    skillTotals.grammar += sk.grammar ?? 75;
    skillTotals.vocabulary += sk.vocabulary ?? 75;
    skillTotals.pronunciation += sk.pronunciation ?? 75;
    skillTotals.participation += sk.participation ?? 75;
    skillTotals.assignments += sk.assignments ?? 75;
    skillTotals.assessments += sk.assessments ?? 75;
  });

  const count = activeStudents.length || 1;
  const skillAverages = [
    { skill: 'Communication', score: Math.round(skillTotals.communication / count) },
    { skill: 'Grammar', score: Math.round(skillTotals.grammar / count) },
    { skill: 'Vocabulary', score: Math.round(skillTotals.vocabulary / count) },
    { skill: 'Pronunciation', score: Math.round(skillTotals.pronunciation / count) },
    { skill: 'Participation', score: Math.round(skillTotals.participation / count) },
    { skill: 'Assignments', score: Math.round(skillTotals.assignments / count) },
    { skill: 'Assessments', score: Math.round(skillTotals.assessments / count) },
  ];

  // Weakest skill
  const weakestSkill = [...skillAverages].sort((a, b) => a.score - b.score)[0];

  return {
    totalStudents: activeStudents.length,
    presentToday,
    presentPercentage,
    absentToday,
    absentPercentage,
    sessionsConducted: conductedSessions.length,
    totalPlannedSessions: sessions.length,
    pendingSessions: pendingSessions.length,
    averageAttendance,
    onTrackCount,
    needsAttentionCount,
    atRiskCount,
    statusDistribution: [
      { name: 'On Track', value: onTrackCount, color: '#10B981' },
      { name: 'Needs Attention', value: needsAttentionCount, color: '#F59E0B' },
      { name: 'At Risk', value: atRiskCount, color: '#EF4444' },
    ],
    studentsNeedingAttention,
    topPerformers,
    attendanceTrend,
    recentSessionsData,
    skillAverages,
    weakestSkill,
    studentStats,
  };
}
