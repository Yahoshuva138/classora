import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  Calendar,
  Award,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  UserCheck,
  TrendingUp,
  FileText,
  Plus,
  Printer,
  Calculator,
  Share2,
  ExternalLink,
  Code2,
  Globe,
  User,
  AtSign,
  Edit3,
  Camera
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { RiskBadge, FollowUpBadge } from '../common/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { AttendanceSimulatorWidget } from '../common/AttendanceSimulatorWidget';
import { PrintableStudentDocument } from '../common/PrintableStudentDocument';

export const StudentProfileDrawer: React.FC = () => {
  const {
    selectedStudentId,
    closeStudentProfile,
    students,
    studentStats,
    sessions,
    attendanceRecords,
    followUps,
    addCRRemark,
    markAttendance,
    addFollowUp,
    currentUser,
    userRole,
    setIsProfileCustomizationOpen,
    openPublicProfile
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'attendance' | 'performance' | 'assignments' | 'followups' | 'notes' | 'simulator'
  >('overview');
  const [newNote, setNewNote] = useState('');
  const [showAddFollowUp, setShowAddFollowUp] = useState(false);
  const [newFollowUpAction, setNewFollowUpAction] = useState('');
  const [newFollowUpPriority, setNewFollowUpPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('High');

  // Printable Document Modal State
  const [isPrintDocOpen, setIsPrintDocOpen] = useState(false);
  const [printDocType, setPrintDocType] = useState<'transcript' | 'certificate'>('transcript');

  if (!selectedStudentId) return null;

  const student = students.find(s => s.id === selectedStudentId);
  const stats = studentStats.find(s => s.student.id === selectedStudentId);

  if (!student || !stats) return null;

  // Student's session attendance list
  const studentSessions = sessions
    .filter(s => s.batch === 'All Batches' || s.batch === student.batch)
    .sort((a, b) => b.date.localeCompare(a.date));

  // Radar chart data for 7 English skills
  const radarData = [
    { subject: 'Communication', score: student.skills.communication, fullMark: 100 },
    { subject: 'Grammar', score: student.skills.grammar, fullMark: 100 },
    { subject: 'Vocabulary', score: student.skills.vocabulary, fullMark: 100 },
    { subject: 'Pronunciation', score: student.skills.pronunciation, fullMark: 100 },
    { subject: 'Participation', score: student.skills.participation, fullMark: 100 },
    { subject: 'Assignments', score: student.skills.assignments, fullMark: 100 },
    { subject: 'Assessments', score: student.skills.assessments, fullMark: 100 },
  ];

  // Student's follow-ups
  const studentFollowUps = followUps.filter(f => f.studentId === student.id);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addCRRemark(student.id, newNote.trim());
    setNewNote('');
  };

  const handleCreateFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFollowUpAction.trim()) return;
    addFollowUp({
      studentId: student.id,
      studentName: student.name,
      issueType: 'Performance',
      priority: newFollowUpPriority,
      actionRequired: newFollowUpAction.trim(),
      assignedTo: 'Aarav (Lead CR)',
      deadline: new Date().toISOString().split('T')[0],
      status: 'Pending',
      remarks: 'Logged directly from student profile drawer.',
    });
    setNewFollowUpAction('');
    setShowAddFollowUp(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={closeStudentProfile}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-slate-50/80 shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3.5 sm:space-x-4 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-xl shadow-md shadow-blue-500/20 overflow-hidden ring-2 ring-blue-100">
                    {student.avatar ? (
                      <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                    ) : (
                      student.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  {(currentUser.id === student.id || currentUser.studentId === student.id || userRole === 'Admin') && (
                    <button
                      type="button"
                      onClick={() => {
                        closeStudentProfile();
                        setIsProfileCustomizationOpen(true);
                      }}
                      className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-slate-900 text-white hover:bg-blue-600 transition shadow-xs cursor-pointer"
                      title="Edit photo & links"
                    >
                      <Camera className="w-3 h-3 text-amber-300" />
                    </button>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2.5 flex-wrap">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight truncate">
                      {student.name}
                    </h2>
                    <RiskBadge status={stats.status} />
                  </div>
                  {student.headline && (
                    <p className="text-xs font-semibold text-indigo-700 mt-0.5 truncate">
                      {student.headline}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-slate-700 font-mono">{student.id}</span>
                    <span>•</span>
                    <span>{student.batch}</span>
                    <span>•</span>
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 text-[10px]">
                      {student.group || 'Group 1'}
                    </span>
                    <span>•</span>
                    <span className="font-medium text-blue-600">{student.currentLevel}</span>
                  </p>
                  {student.bio && (
                    <p className="text-[11px] text-slate-500 italic mt-1 line-clamp-1">
                      "{student.bio}"
                    </p>
                  )}

                  {/* Public Social Links */}
                  {student.publicLinks && (student.publicLinks.github || student.publicLinks.linkedin || student.publicLinks.portfolio || student.publicLinks.leetcode || student.publicLinks.twitter) && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {student.publicLinks.github && (
                        <a
                          href={student.publicLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 rounded-lg bg-slate-900 text-white text-[10px] font-bold flex items-center gap-1 hover:bg-slate-800 transition"
                        >
                          <Code2 className="w-3 h-3 text-teal-300" /> GitHub
                        </a>
                      )}
                      {student.publicLinks.linkedin && (
                        <a
                          href={student.publicLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 rounded-lg bg-blue-600 text-white text-[10px] font-bold flex items-center gap-1 hover:bg-blue-700 transition"
                        >
                          <User className="w-3 h-3 text-blue-100" /> LinkedIn
                        </a>
                      )}
                      {student.publicLinks.portfolio && (
                        <a
                          href={student.publicLinks.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 hover:bg-emerald-700 transition"
                        >
                          <Globe className="w-3 h-3 text-emerald-100" /> Portfolio
                        </a>
                      )}
                      {student.publicLinks.leetcode && (
                        <a
                          href={student.publicLinks.leetcode}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 rounded-lg bg-amber-500 text-white text-[10px] font-bold flex items-center gap-1 hover:bg-amber-600 transition"
                        >
                          <Code2 className="w-3 h-3 text-amber-100" /> LeetCode
                        </a>
                      )}
                      {student.publicLinks.twitter && (
                        <a
                          href={student.publicLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 rounded-lg bg-sky-500 text-white text-[10px] font-bold flex items-center gap-1 hover:bg-sky-600 transition"
                        >
                          <AtSign className="w-3 h-3 text-sky-100" /> Twitter
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-1.5 shrink-0">
                {(currentUser.id === student.id || currentUser.studentId === student.id || userRole === 'Admin') && (
                  <button
                    type="button"
                    onClick={() => {
                      closeStudentProfile();
                      setIsProfileCustomizationOpen(true);
                    }}
                    title="Edit Profile & Avatar"
                    className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors flex items-center gap-1 border border-blue-200 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openPublicProfile(student.id)}
                  title="Share Public Profile Link & Card"
                  className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors flex items-center gap-1 border border-indigo-200 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPrintDocType('transcript');
                    setIsPrintDocOpen(true);
                  }}
                  title="Print Official Transcript"
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1 border border-slate-200"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Transcript</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPrintDocType('certificate');
                    setIsPrintDocOpen(true);
                  }}
                  title="Generate Certificate of Merit"
                  className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors flex items-center gap-1 border border-amber-200"
                >
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">Merit</span>
                </button>
                <button
                  onClick={closeStudentProfile}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick stats ribbon */}
            <div className="grid grid-cols-4 gap-2 mt-5 pt-4 border-t border-slate-200/60 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                <p className="text-[10px] uppercase font-bold text-slate-400">Attendance</p>
                <p className="text-lg font-bold text-slate-900">{stats.attendancePercentage}%</p>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                <p className="text-[10px] uppercase font-bold text-slate-400">Attended</p>
                <p className="text-lg font-bold text-emerald-600">
                  {stats.attendedSessions} / {stats.totalApplicableSessions}
                </p>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                <p className="text-[10px] uppercase font-bold text-slate-400">Missed</p>
                <p className="text-lg font-bold text-rose-600">{stats.missedSessions}</p>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                <p className="text-[10px] uppercase font-bold text-slate-400">Overall Score</p>
                <p className="text-lg font-bold text-blue-600">{stats.overallScore}/100</p>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex space-x-1 mt-5 border-b border-slate-200 text-xs font-semibold overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'attendance', label: `Session History (${studentSessions.length})` },
                { id: 'simulator', label: 'What-If Simulator' },
                { id: 'performance', label: 'Skills & Scores' },
                { id: 'assignments', label: `Assignments (${student.assignments.length})` },
                { id: 'followups', label: `Follow-ups (${studentFollowUps.length})` },
                { id: 'notes', label: `CR Notes (${student.crRemarks.length})` },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2 border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Contact & Profile Info */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Student Details & Contact
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center space-x-2 text-slate-700">
                      <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                      <a href={`mailto:${student.email}`} className="truncate hover:text-blue-600 hover:underline">
                        {student.email}
                      </a>
                    </div>
                    <div className="flex items-center justify-between space-x-2 text-slate-700">
                      <div className="flex items-center space-x-2 truncate">
                        <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                        <a href={`tel:${student.phone}`} className="hover:text-emerald-600 hover:underline font-mono">
                          {student.phone}
                        </a>
                      </div>
                      <a
                        href={`https://wa.me/${student.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors shrink-0"
                      >
                        WhatsApp
                      </a>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-700">
                      <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>Enrolled: {formatDate(student.joiningDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-700">
                      <Award className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Proficiency: {student.currentLevel}</span>
                    </div>
                  </div>
                  {student.initialRemarks && (
                    <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 italic">
                      Initial Remark: &ldquo;{student.initialRemarks}&rdquo;
                    </div>
                  )}
                </div>

                {/* Score Progress Trend */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Performance Trajectory
                    </h4>
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {stats.scoreImprovement >= 0 ? `+${stats.scoreImprovement}` : stats.scoreImprovement} pts this term
                    </span>
                  </div>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={student.historicalScores}>
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis domain={[50, 100]} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="overallScore"
                          name="Overall Score"
                          stroke="#2563EB"
                          strokeWidth={2.5}
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="communication"
                          name="Communication"
                          stroke="#10B981"
                          strokeWidth={1.5}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Radar Skill Breakdown */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    7-Dimension English Competency
                  </h4>
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#475569' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                        <Radar
                          name={student.name}
                          dataKey="score"
                          stroke="#2563EB"
                          fill="#3B82F6"
                          fillOpacity={0.4}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* ATTENDANCE TAB */}
            {activeTab === 'attendance' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500 font-medium">
                    Applicable sessions for this student. You can adjust statuses directly.
                  </p>
                  <span className="text-xs font-bold text-slate-700">
                    {stats.attendancePercentage}% overall
                  </span>
                </div>

                <div className="space-y-2">
                  {studentSessions.map(session => {
                    const record = attendanceRecords.find(
                      r => r.sessionId === session.id && r.studentId === student.id
                    );
                    const currentStatus = record ? record.status : 'Absent';

                    return (
                      <div
                        key={session.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-center justify-between"
                      >
                        <div className="min-w-0 flex-1 pr-3">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {session.topic}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {session.date} • {session.startTime} • {session.faculty}
                          </p>
                        </div>

                        {/* Interactive Status Selector */}
                        <div className="flex items-center space-x-1 shrink-0 bg-slate-100 p-1 rounded-lg">
                          {(['Present', 'Late', 'Absent', 'Excused'] as const).map(st => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => markAttendance(session.id, student.id, st)}
                              className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-all ${
                                currentStatus === st
                                  ? st === 'Present'
                                    ? 'bg-emerald-600 text-white shadow-2xs'
                                    : st === 'Late'
                                    ? 'bg-amber-600 text-white shadow-2xs'
                                    : st === 'Absent'
                                    ? 'bg-rose-600 text-white shadow-2xs'
                                    : 'bg-blue-600 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* WHAT-IF ATTENDANCE SIMULATOR TAB */}
            {activeTab === 'simulator' && (
              <div className="space-y-4">
                <AttendanceSimulatorWidget stats={stats} />
              </div>
            )}

            {/* PERFORMANCE TAB */}
            {activeTab === 'performance' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(student.skills).map(([skill, score]) => (
                    <div
                      key={skill}
                      className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold capitalize text-slate-700 mb-2">
                        <span>{skill}</span>
                        <span className="text-slate-900 font-bold">{score}/100</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            score >= 85
                              ? 'bg-emerald-500'
                              : score >= 70
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ASSIGNMENTS TAB */}
            {activeTab === 'assignments' && (
              <div className="space-y-3">
                {student.assignments.map(asg => (
                  <div
                    key={asg.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{asg.title}</p>
                      <p className="text-[11px] text-slate-500">Due: {asg.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          asg.status === 'Graded'
                            ? 'bg-emerald-100 text-emerald-800'
                            : asg.status === 'Submitted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {asg.status}
                      </span>
                      {asg.score !== undefined && (
                        <p className="font-bold text-slate-800 mt-1">
                          {asg.score}/{asg.maxScore}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* FOLLOW-UPS TAB */}
            {activeTab === 'followups' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Follow-up Action Log
                  </h4>
                  <button
                    onClick={() => setShowAddFollowUp(true)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Log Follow-up
                  </button>
                </div>

                {showAddFollowUp && (
                  <form
                    onSubmit={handleCreateFollowUp}
                    className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3"
                  >
                    <p className="text-xs font-bold text-blue-900">New Follow-up for {student.name}</p>
                    <input
                      type="text"
                      value={newFollowUpAction}
                      onChange={e => setNewFollowUpAction(e.target.value)}
                      placeholder="e.g. Call student regarding low attendance and missed assignments"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                      required
                    />
                    <div className="flex items-center justify-between">
                      <select
                        value={newFollowUpPriority}
                        onChange={e => setNewFollowUpPriority(e.target.value as any)}
                        className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="Low">Low Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="High">High Priority</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                      <div className="space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowAddFollowUp(false)}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                        >
                          Save Follow-up
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {studentFollowUps.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No active or historical follow-ups recorded for {student.name}.
                  </div>
                ) : (
                  studentFollowUps.map(f => (
                    <div
                      key={f.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900">{f.issueType}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              f.priority === 'Urgent'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {f.priority}
                          </span>
                        </div>
                        <FollowUpBadge status={f.status} />
                      </div>
                      <p className="text-slate-700">{f.actionRequired}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                        <span>Due: {f.deadline}</span>
                        <span>Assigned: {f.assignedTo}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* CR REMARKS TAB */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <form onSubmit={handleAddNote} className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                    Add CR Observation or Note
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNote}
                      onChange={e => setNewNote(e.target.value)}
                      placeholder="e.g. Student volunteered to host Friday debate; good progress..."
                      className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" /> Note
                    </button>
                  </div>
                </form>

                <div className="space-y-2.5 pt-2">
                  {student.crRemarks.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      No remarks recorded yet. Enter a note above to track student developments.
                    </div>
                  ) : (
                    student.crRemarks.map(rem => (
                      <div
                        key={rem.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                          <span className="text-blue-600 font-semibold">{rem.author}</span>
                          <span>{formatDate(rem.date)}</span>
                        </div>
                        <p className="text-slate-800 leading-relaxed">{rem.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
