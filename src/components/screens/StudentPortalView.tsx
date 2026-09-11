import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  GraduationCap,
  Sparkles,
  BookOpen,
  TrendingUp,
  MessageSquare,
  Users,
  Phone,
  MessageCircle,
  Mail,
  Award,
  FileText,
  Printer,
  Calculator,
  UserCheck,
  ShieldCheck,
  Download
} from 'lucide-react';
import { AttendanceSimulatorWidget } from '../common/AttendanceSimulatorWidget';
import { PrintableStudentDocument } from '../common/PrintableStudentDocument';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../common/StatusBadge';
import { StudentRequest } from '../../types';
import { Card3D } from '../common/Card3D';
import { soundFx } from '../../utils/soundEffects';
import { fireQuickConfetti } from '../../utils/confettiUtils';
import { useToast } from '../../context/ToastContext';

export const StudentPortalView: React.FC = () => {
  const { addToast } = useToast();
  const {
    students,
    sessions,
    attendanceRecords,
    settings,
    studentStats,
    setCurrentStudentId,
    currentStudent,
    currentStudentStats,
    studentRequests,
    submitStudentRequest,
    activeTeacher
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'attendance' | 'grades' | 'requests'>('overview');
  
  // Student Request Form state
  const [reqType, setReqType] = useState<StudentRequest['type']>('Leave / Absence Excuse');
  const [reqSubject, setReqSubject] = useState('');
  const [reqMessage, setReqMessage] = useState('');

  // Printable Document Modal state
  const [isPrintDocOpen, setIsPrintDocOpen] = useState(false);
  const [printDocType, setPrintDocType] = useState<'transcript' | 'certificate'>('transcript');

  // Quick switch student presets for testing (from official 44-student cohort)
  const quickProfiles = useMemo(() => {
    return [
      { id: '26bcs10296', label: 'Yahoshuva (Grp 5 • On Track)' },
      { id: '26bcs10093', label: 'Divyanshika (Grp 6 • At Risk)' },
      { id: '26bcs10068', label: 'Anmol (Grp 1 • Attention)' },
      { id: '26bcs10424', label: 'Aditya (Grp 1 • On Track)' },
      { id: '26bcs10535', label: 'Akhand (Grp 2 • On Track)' },
      { id: '26bcs10334', label: 'Ishan (Grp 7 • On Track)' },
    ];
  }, []);

  const student = currentStudent || students[0];
  const stats = currentStudentStats || studentStats[0];

  // Teammates in current student's discussion group (from official GROUPS_ENG_2026.pdf)
  const groupPeers = useMemo(() => {
    if (!student) return [];
    const grp = student.group || 'Group 1';
    return students.filter(s => (s.group || 'Group 1') === grp);
  }, [student, students]);

  // Calculate Safe Margin for attendance
  const safeMarginAdvice = useMemo(() => {
    if (!stats) return { text: '', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' };

    const percentage = stats.attendancePercentage;
    const attended = stats.presentCount + (stats.lateCount * (settings.lateAttendanceWeight ?? 0.5));
    const total = stats.totalApplicableSessions;

    if (percentage >= 85) {
      return {
        title: 'You are safely On Track!',
        text: `Great job! Your attendance is ${percentage}%. You have met the college 85% honor criterion and have buffer for unavoidable emergencies.`,
        color: 'text-emerald-800',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        badge: 'Safe Zone'
      };
    } else if (percentage >= 70) {
      // Calculate how many more classes needed to reach 85%
      const needed = Math.max(1, Math.ceil((0.85 * total - attended) / 0.15));
      return {
        title: 'Needs Attention: In Danger Zone',
        text: `Your attendance is currently ${percentage}%. You need to attend the next ${needed} consecutive sessions without absence to reach the 85% On-Track threshold.`,
        color: 'text-amber-800',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        badge: 'Action Needed'
      };
    } else {
      // Below 70% (At Risk)
      const needed75 = Math.max(1, Math.ceil((0.75 * total - attended) / 0.25));
      return {
        title: 'Critically At Risk (<70%)',
        text: `Critical Alert: You have missed ${stats.missedSessions} sessions. You must attend the next ${needed75} sessions to reach the 75% exam eligibility mark. Please submit absence documentation immediately.`,
        color: 'text-rose-800',
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        badge: 'Critical Alert'
      };
    }
  }, [stats, settings]);

  // Session-by-session history for current student
  const sessionHistory = useMemo(() => {
    if (!student) return [];
    return sessions.map(session => {
      const rec = attendanceRecords.find(r => r.sessionId === session.id && r.studentId === student.id);
      return {
        session,
        status: rec ? rec.status : ('Upcoming' as const),
        remarks: rec?.remarks || ''
      };
    });
  }, [student, sessions, attendanceRecords]);

  // Radar Data comparing student vs class average
  const radarData = useMemo(() => {
    if (!student) return [];

    // Class average skills
    const totals = { comm: 0, gram: 0, vocab: 0, pron: 0, part: 0, assign: 0, assess: 0 };
    students.forEach(s => {
      totals.comm += s.skills.communication;
      totals.gram += s.skills.grammar;
      totals.vocab += s.skills.vocabulary;
      totals.pron += s.skills.pronunciation;
      totals.part += s.skills.participation;
      totals.assign += s.skills.assignments;
      totals.assess += s.skills.assessments;
    });
    const count = students.length || 1;

    return [
      { skill: 'Communication', Student: student.skills.communication, ClassAvg: Math.round(totals.comm / count) },
      { skill: 'Grammar', Student: student.skills.grammar, ClassAvg: Math.round(totals.gram / count) },
      { skill: 'Vocabulary', Student: student.skills.vocabulary, ClassAvg: Math.round(totals.vocab / count) },
      { skill: 'Pronunciation', Student: student.skills.pronunciation, ClassAvg: Math.round(totals.pron / count) },
      { skill: 'Participation', Student: student.skills.participation, ClassAvg: Math.round(totals.part / count) },
      { skill: 'Assignments', Student: student.skills.assignments, ClassAvg: Math.round(totals.assign / count) },
      { skill: 'Assessments', Student: student.skills.assessments, ClassAvg: Math.round(totals.assess / count) },
    ];
  }, [student, students]);

  // Filter student requests for current student
  const myRequests = useMemo(() => {
    if (!student) return [];
    return studentRequests.filter(r => r.studentId === student.id);
  }, [studentRequests, student]);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqSubject.trim() || !reqMessage.trim()) return;

    soundFx.playSuccess();
    fireQuickConfetti();

    submitStudentRequest({
      type: reqType,
      subject: reqSubject.trim(),
      message: reqMessage.trim(),
      studentId: student.id,
    });

    setReqSubject('');
    setReqMessage('');
  };

  if (!student || !stats) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm my-6">
        <GraduationCap className="w-12 h-12 text-emerald-600 mx-auto mb-3 animate-pulse" />
        <h3 className="text-lg font-bold text-slate-900 mb-1">Loading Student Portal...</h3>
        <p className="text-xs text-slate-500">Connecting to student academic profile and attendance logs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner: Switch Student Profile Preview */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl font-bold text-emerald-200 shrink-0 shadow-inner">
              {student.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/30 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  Student Portal
                </span>
                <span className="text-xs text-teal-200">ID: {student.id}</span>
                <span className="text-xs text-teal-300">•</span>
                <span className="text-xs text-teal-200">{student.batch}</span>
                <span className="text-xs text-teal-300">•</span>
                <span className="text-[11px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-300/30">
                  {student.group || 'Group 1'}
                </span>
              </div>
              <h1 className="text-xl lg:text-2xl font-black tracking-tight text-white mt-1">
                {student.name}
              </h1>
              <p className="text-xs text-emerald-100/80">
                Course: <span className="font-semibold text-white">English Language & Communication Skills</span> (Subject - 2 • 4 Weeks)
              </p>
            </div>
          </div>

          {/* Quick Profile Switcher (Testing tool) */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex flex-col gap-1.5 lg:min-w-[320px]">
            <span className="text-[11px] font-semibold text-emerald-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Preview Student Experience:
            </span>
            <select
              value={student.id}
              onChange={(e) => setCurrentStudentId(e.target.value)}
              className="bg-slate-900/90 text-white text-xs font-medium rounded-xl px-3 py-2 border border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
            >
              {students.map(s => {
                const sStat = studentStats.find(st => st.student.id === s.id);
                return (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.id}) — {sStat ? `${sStat.attendancePercentage}% [${sStat.status}]` : s.currentLevel}
                  </option>
                );
              })}
            </select>
            <div className="flex flex-wrap gap-1 mt-1">
              {quickProfiles.map(p => (
                <button
                  key={p.id}
                  onClick={() => setCurrentStudentId(p.id)}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                    student.id === p.id
                      ? 'bg-emerald-400 text-slate-900 font-bold'
                      : 'bg-white/15 text-white/90 hover:bg-white/25'
                  }`}
                >
                  {p.label.split(' ')[0]} ({p.label.match(/\((.*?)\)/)?.[1] || ''})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sub Navigation Tabs & Document Print Triggers */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6 pt-4 border-t border-white/10">
          <div className="flex space-x-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'overview', label: 'My Overview', icon: BookOpen },
              { id: 'attendance', label: 'Attendance & Timetable', icon: Calendar },
              { id: 'grades', label: 'Assessments & Skills', icon: TrendingUp },
              { id: 'requests', label: 'Submit Leave / CR Help', icon: MessageSquare, badge: myRequests.length || null },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                    isActive
                      ? 'bg-white text-emerald-950 shadow-md'
                      : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Official Academic Printables */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setPrintDocType('transcript');
                setIsPrintDocOpen(true);
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-white/15 text-white hover:bg-white/25 transition-all flex items-center gap-1.5 border border-white/20 shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-teal-200" />
              <span>Official Transcript</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setPrintDocType('certificate');
                setIsPrintDocOpen(true);
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-400/20 text-amber-200 hover:bg-amber-400/30 transition-all flex items-center gap-1.5 border border-amber-300/40 shadow-xs"
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Certificate of Merit</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Attendance KPI Card & Safe Margin Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Main Attendance Percentage */}
            <Card3D intensity={8}>
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      My Attendance Rate
                    </span>
                    <RiskBadge status={stats.status} />
                  </div>
                  <div className="mt-4 flex items-baseline space-x-3">
                    <span className="text-5xl font-black text-slate-900 tracking-tight">
                      {stats.attendancePercentage}%
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      ({stats.presentCount} attended / {stats.totalApplicableSessions} held)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 rounded-full h-3 mt-4 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        stats.status === 'On Track'
                          ? 'bg-emerald-500'
                          : stats.status === 'Needs Attention'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, stats.attendancePercentage)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-100 text-center">
                  <div className="bg-emerald-50 p-2.5 rounded-2xl border border-emerald-100">
                    <span className="block text-lg font-bold text-emerald-700">{stats.presentCount}</span>
                    <span className="text-[11px] text-emerald-800 font-medium">Present</span>
                  </div>
                  <div className="bg-rose-50 p-2.5 rounded-2xl border border-rose-100">
                    <span className="block text-lg font-bold text-rose-700">{stats.absentCount}</span>
                    <span className="text-[11px] text-rose-800 font-medium">Absent</span>
                  </div>
                  <div className="bg-amber-50 p-2.5 rounded-2xl border border-amber-100">
                    <span className="block text-lg font-bold text-amber-700">{stats.lateCount}</span>
                    <span className="text-[11px] text-amber-800 font-medium">Late</span>
                  </div>
                </div>
              </div>
            </Card3D>

            {/* Smart Safe Margin Advisory Card */}
            <div className="lg:col-span-2">
              <Card3D intensity={8}>
                <div className={`rounded-3xl p-6 border ${safeMarginAdvice.border} ${safeMarginAdvice.bg} flex flex-col justify-between shadow-sm h-full`}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className={`w-5 h-5 ${safeMarginAdvice.color}`} />
                        <h3 className={`font-bold text-base ${safeMarginAdvice.color}`}>
                          {safeMarginAdvice.title}
                        </h3>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-white shadow-2xs border ${safeMarginAdvice.border} ${safeMarginAdvice.color}`}>
                        {safeMarginAdvice.badge}
                      </span>
                    </div>
                    <p className={`text-sm ${safeMarginAdvice.color} leading-relaxed`}>
                      {safeMarginAdvice.text}
                    </p>

                    <div className="mt-4 p-4 rounded-2xl bg-white/80 border border-white/60 space-y-2 text-xs text-slate-700">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                        University English Department Regulations:
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                        <li><strong>85%+ Attendance:</strong> Eligible for Honor Certificate & Campus Placement Recommendations.</li>
                        <li><strong>70% – 84% Attendance:</strong> Requires CR follow-up and makeup communication lab work.</li>
                        <li><strong>Under 70% Attendance:</strong> Risk of debarment from Final Oral Presentation & Conditionals exam.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-black/5">
                    <button
                      onClick={() => setActiveSubTab('requests')}
                      className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs hover:scale-105 active:scale-95"
                    >
                      Submit Absence Medical Excuse
                    </button>
                    <button
                      onClick={() => setActiveSubTab('grades')}
                      className="text-xs font-semibold px-4 py-2 rounded-xl bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs hover:scale-105 active:scale-95"
                    >
                      View 7-Skill Matrix
                    </button>
                  </div>
                </div>
              </Card3D>
            </div>
          </div>

          {/* Next Lecture & Skill Competencies */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Upcoming Lecture Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                    Next Class
                  </span>
                  <span className="text-xs text-slate-400">Lecture #11</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 leading-tight">
                  Conditionals
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Zero, First, Second & Third Conditionals with real-life scenario roleplay.
                </p>

                <div className="mt-5 space-y-2.5 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                    <span><strong>Date:</strong> 9 SEP 2026</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                    <span><strong>Time:</strong> 02:00 PM – 03:30 PM</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span><strong>Room:</strong> Language Lab 102 (Offline)</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span><strong>Faculty:</strong> {activeTeacher.name}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-medium">Lecture Handout Ready</span>
                <button
                  onClick={() => addToast('Downloaded Conditionals Prep Worksheet (PDF)', 'success')}
                  className="flex items-center space-x-1.5 font-bold text-blue-600 hover:text-blue-700"
                >
                  <Download className="w-4 h-4" />
                  <span>Get Handout</span>
                </button>
              </div>
            </div>

            {/* 7-Skill Radar Chart */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">7-Skill Competency Radar</h3>
                  <p className="text-xs text-slate-500">Your score vs Class 40-student benchmark</p>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    My Score
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-slate-500">
                    <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                    Class Average
                  </span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: '#475569', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Radar
                      name="My Score"
                      dataKey="Student"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.4}
                    />
                    <Radar
                      name="Class Avg"
                      dataKey="ClassAvg"
                      stroke="#94a3b8"
                      fill="#94a3b8"
                      fillOpacity={0.15}
                      strokeDasharray="3 3"
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Quick Assessment Results Strip */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-4">
              My Assessment Scorecard
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {student.assignments.map(a => (
                <div key={a.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {a.status}
                      </span>
                      <span className="text-[11px] text-slate-400">{a.dueDate}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-1 line-clamp-1">
                      {a.title}
                    </h4>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-slate-900">
                      {a.score !== undefined ? a.score : '—'}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      / {a.maxScore} marks
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discussion Group & Team Members Card (Official GROUPS_ENG_2026.pdf) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900 text-base">
                      Official Discussion Group: {student.group || 'Group 1'}
                    </h3>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                      {groupPeers.length} Members
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Cohort group roster for Lecture 10 (SES-110: Group Discussion 1 — Current Affairs & Campus Issues)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${groupPeers.map(p => p.email).join(',')}`}
                  className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Group</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {groupPeers.map(peer => {
                const isSelf = peer.id === student.id;
                const peerStat = studentStats.find(s => s.student.id === peer.id);
                return (
                  <div
                    key={peer.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isSelf
                        ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-400/20'
                        : 'bg-slate-50 border-slate-200/80 hover:bg-white hover:border-indigo-200 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isSelf ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {peer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-slate-900 text-xs line-clamp-1">{peer.name}</span>
                            {isSelf && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-600 text-white rounded-md">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 block">{peer.id}</span>
                        </div>
                      </div>
                      {peerStat && <RiskBadge status={peerStat.status} />}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-500 font-medium truncate max-w-[140px]">
                        {peer.email}
                      </span>
                      <div className="flex items-center space-x-1.5">
                        {peer.phone && (
                          <>
                            <a
                              href={`tel:${peer.phone}`}
                              title={`Call ${peer.name}`}
                              className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-colors"
                            >
                              <Phone className="w-3 h-3" />
                            </a>
                            <a
                              href={`https://wa.me/${peer.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`WhatsApp ${peer.name}`}
                              className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-300 transition-colors"
                            >
                              <MessageCircle className="w-3 h-3" />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* What-If Attendance Predictive Simulator */}
          <AttendanceSimulatorWidget stats={stats} />
        </div>
      )}

      {/* TAB 2: ATTENDANCE & TIMETABLE */}
      {activeSubTab === 'attendance' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Curriculum Timetable & My Attendance History
              </h3>
              <p className="text-xs text-slate-500">
                Official syllabus timeline for English Language & Communication Skills (Subject - 2 • 4 Weeks)
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-bold border border-emerald-200">
                {stats.presentCount} Present
              </span>
              <span className="px-3 py-1 bg-rose-50 text-rose-800 rounded-lg font-bold border border-rose-200">
                {stats.absentCount} Absent
              </span>
              <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-lg font-bold border border-amber-200">
                {stats.lateCount} Late
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {sessionHistory.map(({ session, status, remarks }, idx) => {
              const isPresent = status === 'Present';
              const isAbsent = status === 'Absent';
              const isLate = status === 'Late';
              const isExcused = status === 'Excused';
              const isUpcoming = session.status === 'Upcoming';

              return (
                <div key={session.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 border border-slate-200">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                          {session.date} • {session.startTime}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {session.location}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">
                        {session.topic}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {session.notes}
                      </p>
                      {remarks && (
                        <p className="text-[11px] text-slate-600 bg-slate-100/80 px-2 py-1 rounded-md mt-1.5 inline-block">
                          CR Note: {remarks}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                    {isUpcoming ? (
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                        Upcoming Class
                      </span>
                    ) : isPresent ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Present
                      </span>
                    ) : isAbsent ? (
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          Absent
                        </span>
                        <button
                          onClick={() => {
                            setReqType('Leave / Absence Excuse');
                            setReqSubject(`Absence excuse for ${session.topic} (${session.date})`);
                            setReqMessage(`I was unable to attend the session ${session.topic} due to: `);
                            setActiveSubTab('requests');
                          }}
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 underline"
                        >
                          Submit Excuse
                        </button>
                      </div>
                    ) : isLate ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                        <Clock className="w-4 h-4 text-amber-600" />
                        Late (+0.5)
                      </span>
                    ) : isExcused ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200">
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                        Excused
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Simulator Widget inside Attendance tab */}
          <div className="p-6 border-t border-slate-100">
            <AttendanceSimulatorWidget stats={stats} />
          </div>
        </div>
      )}

      {/* TAB 3: ASSESSMENTS & SKILLS */}
      {activeSubTab === 'grades' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Assignments Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 text-base mb-1">
                Graded Course Assessments
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Scores awarded by Dr. Priya Nair & faculty evaluators
              </p>

              <div className="space-y-3">
                {student.assignments.map(a => (
                  <div key={a.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{a.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Due: {a.dueDate} • Status: {a.status}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-slate-900">
                        {a.score !== undefined ? a.score : '—'}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold"> / {a.maxScore}</span>
                      <span className="block text-[11px] text-emerald-600 font-bold">
                        {a.score ? `${Math.round((a.score / a.maxScore) * 100)}%` : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Matrix */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 text-base mb-1">
                7-Skill Mastery Matrix
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Rubric evaluations across key communication domains
              </p>

              <div className="space-y-3.5">
                {[
                  { name: 'Communication Fluency', score: student.skills.communication, color: 'bg-blue-600' },
                  { name: 'Grammar & Syntax', score: student.skills.grammar, color: 'bg-indigo-600' },
                  { name: 'Vocabulary Range', score: student.skills.vocabulary, color: 'bg-emerald-600' },
                  { name: 'Pronunciation & Phonetics', score: student.skills.pronunciation, color: 'bg-teal-600' },
                  { name: 'Class Participation', score: student.skills.participation, color: 'bg-amber-600' },
                  { name: 'Written Assignments', score: student.skills.assignments, color: 'bg-purple-600' },
                  { name: 'Spoken Assessments', score: student.skills.assessments, color: 'bg-rose-600' },
                ].map(skill => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">{skill.name}</span>
                      <span className="text-slate-900 font-bold">{skill.score}/100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${skill.color} rounded-full`}
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CR Remarks & Faculty Notes */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Feedback from Lead CR & Faculty
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Mentorship observations and action points
            </p>

            <div className="space-y-3">
              {student.crRemarks.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No remarks recorded yet.</p>
              ) : (
                student.crRemarks.map(r => (
                  <div key={r.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="font-bold text-slate-700">{r.author}</span>
                      <span>{r.date}</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed">{r.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SUBMIT LEAVE / CR HELP */}
      {activeSubTab === 'requests' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submit New Request Form */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Submit Request or Excuse
                </h3>
                <p className="text-xs text-slate-500">
                  Direct message to Lead CR Aarav Sharma & Dr. Priya Nair
                </p>
              </div>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Request Category
                </label>
                <select
                  value={reqType}
                  onChange={(e) => setReqType(e.target.value as any)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="Leave / Absence Excuse">Leave / Absence Excuse</option>
                  <option value="Doubt in Lecture">Doubt in Lecture / Grammar Concept</option>
                  <option value="CR Notes Request">Request Lecture Notes / Transcripts</option>
                  <option value="Assignment Help">Assignment Guidance / Peer Tutoring</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sick leave excuse for Group Discussion 1 (4 SEP)"
                  value={reqSubject}
                  onChange={(e) => setReqSubject(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message / Reason Details
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please describe why you missed class or what specific assistance you need..."
                  value={reqMessage}
                  onChange={(e) => setReqMessage(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit to Lead CR & Faculty</span>
              </button>
            </form>
          </div>

          {/* Submitted Requests History */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">
                My Submitted Requests & Responses
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Track status of absence requests and CR assistance
              </p>

              <div className="space-y-3">
                {myRequests.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                    No requests submitted yet. Use the form on the left to submit a leave excuse or ask for notes.
                  </div>
                ) : (
                  myRequests.map(req => (
                    <div key={req.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{req.subject}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'Resolved'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{req.message}</p>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200/50">
                        <span>Submitted on: {req.date}</span>
                        <span className="font-medium text-slate-500">{req.type}</span>
                      </div>

                      {req.teacherOrCrResponse && (
                        <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-900">
                          <strong>Official Response:</strong> {req.teacherOrCrResponse}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Helpful CR Contact card */}
            <div className="mt-6 p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-blue-950 flex items-center justify-between">
              <div>
                <p className="font-bold">Elected English CR: Aarav Sharma</p>
                <p className="text-[11px] text-blue-800">Batch A • Language Lab 102</p>
              </div>
              <span className="text-[11px] font-bold text-blue-600 bg-white px-2.5 py-1 rounded-lg shadow-2xs border border-blue-200">
                aarav.sharma@sst.scaler.com
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Official Printable Academic Document Modal */}
      <PrintableStudentDocument
        isOpen={isPrintDocOpen}
        onClose={() => setIsPrintDocOpen(false)}
        student={student}
        stats={stats}
        defaultView={printDocType}
      />
    </div>
  );
};
