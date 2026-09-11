import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Users,
  Search,
  MessageSquare,
  Award,
  Calendar,
  Clock,
  MapPin,
  Send,
  Download,
  ShieldCheck,
  Save,
  UploadCloud
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportGradebookCSV } from '../../utils/exportUtils';
import { Card3D } from '../common/Card3D';
import { soundFx } from '../../utils/soundEffects';
import { fireStarConfetti, fireGrandCelebration } from '../../utils/confettiUtils';
import { useToast } from '../../context/ToastContext';
import { BulkAttendanceUploadModal } from '../common/BulkAttendanceUploadModal';

import { StudentAssignment } from '../../types';

interface CriteriaScoreInputProps {
  studentId: string;
  assignment?: StudentAssignment;
  maxLimit: number;
  label: string;
  isEditing: boolean;
  onSave: (studentId: string, assignmentId: string, score: number) => void;
}

const CriteriaScoreInput: React.FC<CriteriaScoreInputProps> = ({
  studentId,
  assignment,
  maxLimit,
  label,
  isEditing,
  onSave
}) => {
  const currentVal = assignment?.score ?? null;
  const [val, setVal] = React.useState<number | string>(currentVal !== null ? currentVal : '');
  const [isOutOfRange, setIsOutOfRange] = React.useState(false);

  React.useEffect(() => {
    setVal(assignment?.score !== null && assignment?.score !== undefined ? assignment.score : '');
    setIsOutOfRange(false);
  }, [assignment?.score]);

  if (!isEditing) {
    return (
      <div className="flex flex-col items-center">
        <span className="font-bold text-slate-800 text-xs">
          {assignment?.score !== null && assignment?.score !== undefined ? assignment.score : '—'}
        </span>
        <span className="text-[10px] text-slate-400 font-medium">/ {maxLimit}</span>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      setVal('');
      setIsOutOfRange(false);
      return;
    }
    const num = Number(raw);
    if (isNaN(num)) return;
    if (num > maxLimit) {
      setIsOutOfRange(true);
      setVal(maxLimit);
    } else if (num < 0) {
      setIsOutOfRange(true);
      setVal(0);
    } else {
      setIsOutOfRange(false);
      setVal(num);
    }
  };

  const handleCommit = () => {
    if (!assignment) return;
    const num = val === '' ? 0 : Number(val);
    const clamped = Math.max(0, Math.min(maxLimit, Math.round(num)));
    setVal(clamped);
    setIsOutOfRange(false);
    onSave(studentId, assignment.id, clamped);
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="number"
        min={0}
        max={maxLimit}
        value={val}
        placeholder={`0-${maxLimit}`}
        onChange={handleChange}
        onBlur={handleCommit}
        onKeyDown={(e) => { if (e.key === 'Enter') handleCommit(); }}
        className={`w-16 px-2 py-1 text-center font-bold text-slate-900 bg-white border rounded-lg focus:outline-none transition-all ${
          isOutOfRange
            ? 'border-rose-500 ring-2 ring-rose-200'
            : 'border-indigo-300 focus:ring-2 focus:ring-indigo-500 shadow-xs'
        }`}
        title={`${label}: strictly limited to 0 - ${maxLimit}`}
      />
      <span className="text-[10px] text-indigo-600 font-bold mt-0.5">Max {maxLimit}</span>
    </div>
  );
};

export const TeacherPortalView: React.FC = () => {
  const { addToast } = useToast();
  const {
    students,
    sessions,
    attendanceRecords,
    studentStats,
    dashboardMetrics,
    studentRequests,
    resolveStudentRequest,
    markAttendance,
    updateStudentAssignmentScore,
    updateStudentSkillScore,
    addFacultyFeedback,
    activeTeacher,
    openStudentProfile
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'gradebook' | 'audit' | 'feedback'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  // Quick announcement broadcast state
  const [announcementText, setAnnouncementText] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState('All Students & CR');

  // Feedback form state
  const [feedbackStudentId, setFeedbackStudentId] = useState(students[0]?.id || '');
  const [feedbackText, setFeedbackText] = useState('');

  // Pending excuse requests count
  const pendingRequests = useMemo(() => {
    return studentRequests.filter(r => r.status === 'Pending');
  }, [studentRequests]);

  // Filtered students for gradebook
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBatch = selectedBatch === 'all' || s.batch === selectedBatch;
      const matchesGroup = selectedGroup === 'all' || (s.group || 'Group 1') === selectedGroup;
      return matchesSearch && matchesBatch && matchesGroup && !s.isArchived;
    });
  }, [students, searchQuery, selectedBatch, selectedGroup]);

  // Handle Excuse Approval: automatically changes attendance record to 'Excused' and resolves request
  const handleApproveExcuse = (reqId: string, studentId: string, studentName: string) => {
    // Find the request
    const req = studentRequests.find(r => r.id === reqId);
    // Find session if mentioned in subject (e.g. SES-110 or Group Discussion 1)
    let matchedSession = sessions.find(s => s.id === 'SES-110'); // Default to GD 1
    if (req?.subject.includes('4 SEP') || req?.subject.toLowerCase().includes('discussion')) {
      matchedSession = sessions.find(s => s.topic.includes('Discussion') || s.id === 'SES-110');
    }

    if (matchedSession) {
      markAttendance(matchedSession.id, studentId, 'Excused', `Approved by ${activeTeacher.name} (Medical Documentation Verified)`);
    }

    soundFx.playSuccess();
    fireGrandCelebration();

    resolveStudentRequest(
      reqId,
      'Medical certificate accepted. Attendance record updated to Excused without penalty.',
      'Approved'
    );

    addToast(`Medical excuse approved for ${studentName}. Attendance updated to Excused.`, 'success');
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    soundFx.playFanfare();
    fireStarConfetti();
    addToast(`Broadcast sent to ${broadcastTarget}: "${announcementText}"`, 'success');
    setAnnouncementText('');
  };

  const handleAddFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim() || !feedbackStudentId) return;
    addFacultyFeedback(feedbackStudentId, feedbackText.trim());
    setFeedbackText('');
  };

  return (
    <div className="space-y-6">
      {/* Faculty Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 rounded-3xl p-6 lg:p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl font-bold text-indigo-200 shrink-0 shadow-inner">
              👨‍🏫
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                  Course Coordinator & Faculty Portal
                </span>
                <span className="text-xs text-indigo-200">{activeTeacher.cabin}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
                  {activeTeacher.name}
                </h1>
                {activeTeacher.company && (
                  <span className="text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30 px-2 py-0.5 rounded-full">
                    {activeTeacher.company}
                  </span>
                )}
                {activeTeacher.rating && (
                  <span className="text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    ★ {activeTeacher.rating}
                  </span>
                )}
                <span className="text-xs text-indigo-300 font-mono bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                  {activeTeacher.email}
                </span>
              </div>
              <p className="text-xs text-indigo-200/90 font-medium mt-1">
                {activeTeacher.designation} • <span className="text-white font-semibold">English Language & Communication Skills (Subject - 2 • 4 Weeks)</span>
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-center">
            <div>
              <span className="block text-2xl font-black text-white">{students.length}</span>
              <span className="text-[11px] text-indigo-200 font-medium">Enrolled</span>
            </div>
            <div className="border-x border-white/15 px-3">
              <span className="block text-2xl font-black text-emerald-300">
                {dashboardMetrics.averageAttendance}%
              </span>
              <span className="text-[11px] text-indigo-200 font-medium">Class Avg</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-amber-300">
                {pendingRequests.length}
              </span>
              <span className="text-[11px] text-indigo-200 font-medium">Pending Leaves</span>
            </div>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex space-x-2 mt-6 pt-4 border-t border-white/10 overflow-x-auto">
          {[
            { id: 'overview', label: 'Faculty Overview', icon: GraduationCap },
            { id: 'gradebook', label: 'Assessment Gradebook', icon: Award },
            {
              id: 'audit',
              label: 'Attendance & Excuse Audit',
              icon: ShieldCheck,
              badge: pendingRequests.length || null
            },
            { id: 'feedback', label: 'Student Mentorship & Notes', icon: MessageSquare },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-white text-indigo-950 shadow-md'
                    : 'text-indigo-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB 1: FACULTY OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card3D intensity={8}>
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm h-full">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Enrolled</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-black text-slate-900">{students.length}</span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">3 Batches</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Lead CR: Yahoshuva Kesaboyina</p>
              </div>
            </Card3D>

            <Card3D intensity={8}>
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm h-full">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Class Attendance</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-black text-emerald-600">{dashboardMetrics.averageAttendance}%</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {dashboardMetrics.onTrackCount} On Track
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Goal: ≥80% class average</p>
              </div>
            </Card3D>

            <Card3D intensity={8}>
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm h-full">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">At-Risk Watchlist</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-black text-rose-600">{dashboardMetrics.atRiskCount}</span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                    {dashboardMetrics.needsAttentionCount} Attention
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Assigned to Lead CR for calling</p>
              </div>
            </Card3D>

            <Card3D intensity={8}>
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm h-full">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Syllabus Completion</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-black text-indigo-600">10 / 11</span>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">91%</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Next: Conditionals (9 SEP)</p>
              </div>
            </Card3D>
          </div>

          {/* Curriculum Timeline & Quick Announcement */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Syllabus Roadmap */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Curriculum Schedule & Pacing
                  </h3>
                  <p className="text-xs text-slate-500">
                    Subject - 2 • 4 Weeks (Lectures 1 to 11)
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                  Active Term
                </span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1 divide-y divide-slate-100">
                {sessions.map(s => {
                  const isDone = s.status === 'Completed';
                  const isUpcoming = s.status === 'Upcoming';

                  return (
                    <div key={s.id} className="pt-3 flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start space-x-3">
                        <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${isDone ? 'bg-emerald-500' : 'bg-blue-600 animate-pulse'}`} />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900 text-xs sm:text-sm">{s.topic}</span>
                            <span className="text-[10px] text-slate-400 font-medium">({s.sessionType})</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{s.notes}</p>
                          <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {s.date}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {s.startTime}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {s.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isDone ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {s.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Broadcast to Class & CR */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Broadcast Notice</h3>
                    <p className="text-[11px] text-slate-500">Send instant alert to students & CR</p>
                  </div>
                </div>

                <form onSubmit={handleBroadcast} className="space-y-3 mt-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Audience</label>
                    <select
                      value={broadcastTarget}
                      onChange={(e) => setBroadcastTarget(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="All Students & CR">All Students & CR (44 Official Students)</option>
                      <option value="Lead CR Yahoshuva Kesaboyina">Lead CR Yahoshuva Kesaboyina only</option>
                      <option value="At-Risk Students (<70%)">At-Risk Students Only (Under 70% Attendance)</option>
                      <option value="Batch A - Morning">Batch A - Morning</option>
                      <option value="Group 1 Discussion Team">Group 1 Discussion Team</option>
                      <option value="Group 2 Discussion Team">Group 2 Discussion Team</option>
                      <option value="Group 3 Discussion Team">Group 3 Discussion Team</option>
                      <option value="Group 4 Discussion Team">Group 4 Discussion Team</option>
                      <option value="Group 5 Discussion Team">Group 5 Discussion Team</option>
                      <option value="Group 6 Discussion Team">Group 6 Discussion Team</option>
                      <option value="Group 7 Discussion Team">Group 7 Discussion Team</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Announcement Message</label>
                    <textarea
                      required
                      rows={4}
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      placeholder="e.g. Please bring your Conditionals grammar handbook for the 9 SEP lecture in Language Lab 102..."
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center space-x-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Announcement</span>
                  </button>
                </form>
              </div>

              {/* Faculty Advisory */}
              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                <span className="font-bold text-slate-800">Note:</span> Announcements are synced to the student dashboard notices and CR task queue.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: GRADEBOOK & ASSESSMENTS */}
      {activeSubTab === 'gradebook' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                English Communication Skills Gradebook
              </h3>
              <p className="text-xs text-slate-500">
                Direct marks entry for Diagnostic Test, Quizzes, Impromptu Speeches & Group Discussions
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
                />
              </div>

              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Batches</option>
                <option value="Batch A - Morning">Batch A</option>
                <option value="Batch B - Afternoon">Batch B</option>
                <option value="Batch C - Weekend">Batch C</option>
              </select>

              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
              >
                <option value="all">All Groups</option>
                {['Group 1', 'Group 2', 'Group 3', 'Group 4', 'Group 5', 'Group 6', 'Group 7'].map(grp => (
                  <option key={grp} value={grp}>{grp}</option>
                ))}
              </select>

              <button
                onClick={() => exportGradebookCSV(students)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-colors border border-indigo-200"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-3 text-center">
                    <div className="font-bold text-slate-700">English Test_C</div>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">Max: 25</span>
                  </th>
                  <th className="py-3 px-3 text-center">
                    <div className="font-bold text-slate-700">Tenses Quiz_C</div>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">Max: 20</span>
                  </th>
                  <th className="py-3 px-3 text-center">
                    <div className="font-bold text-slate-700">Presentation</div>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">Max: 25</span>
                  </th>
                  <th className="py-3 px-3 text-center">
                    <div className="font-bold text-slate-700">Group Discussion</div>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Max: 30</span>
                  </th>
                  <th className="py-3 px-3 text-center">Attendance %</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(student => {
                  const stat = studentStats.find(s => s.student.id === student.id);
                  const a1 = student.assignments[0];
                  const a2 = student.assignments[1];
                  const a3 = student.assignments[2];
                  const a4 = student.assignments[3];

                  const isEditing = editingStudentId === student.id;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 font-bold text-slate-700 flex items-center justify-center text-xs">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <span
                              onClick={() => openStudentProfile(student.id)}
                              className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer block"
                            >
                              {student.name}
                            </span>
                            <div className="flex items-center space-x-1.5 mt-0.5">
                              <span className="text-[11px] text-slate-400">{student.id} • {student.batch}</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                                {student.group || 'Group 1'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Test C (Limit 25) */}
                      <td className="py-3.5 px-3 text-center">
                        <CriteriaScoreInput
                          studentId={student.id}
                          assignment={a1}
                          maxLimit={25}
                          label="English Test_C"
                          isEditing={isEditing}
                          onSave={updateStudentAssignmentScore}
                        />
                      </td>

                      {/* Quiz C (Limit 20) */}
                      <td className="py-3.5 px-3 text-center">
                        <CriteriaScoreInput
                          studentId={student.id}
                          assignment={a2}
                          maxLimit={20}
                          label="Tenses Quiz_C"
                          isEditing={isEditing}
                          onSave={updateStudentAssignmentScore}
                        />
                      </td>

                      {/* Presentation (Limit 25) */}
                      <td className="py-3.5 px-3 text-center">
                        <CriteriaScoreInput
                          studentId={student.id}
                          assignment={a3}
                          maxLimit={25}
                          label="Presentation"
                          isEditing={isEditing}
                          onSave={updateStudentAssignmentScore}
                        />
                      </td>

                      {/* Group Discussion (Limit 30) */}
                      <td className="py-3.5 px-3 text-center">
                        <CriteriaScoreInput
                          studentId={student.id}
                          assignment={a4}
                          maxLimit={30}
                          label="Group Discussion"
                          isEditing={isEditing}
                          onSave={updateStudentAssignmentScore}
                        />
                      </td>

                      {/* Attendance % */}
                      <td className="py-3.5 px-3 text-center">
                        <span className={`font-black ${
                          stat?.status === 'On Track' ? 'text-emerald-600' :
                          stat?.status === 'Needs Attention' ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          {stat?.attendancePercentage}%
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setEditingStudentId(isEditing ? null : student.id)}
                          className={`text-xs px-3 py-1 rounded-lg font-bold transition-colors ${
                            isEditing
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {isEditing ? 'Done' : 'Edit Marks'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: ATTENDANCE & EXCUSE AUDIT */}
      {activeSubTab === 'audit' && (
        <div className="space-y-6">
          {/* Pending Student Absence Excuses */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Student Absence Excuses & Leave Applications
                </h3>
                <p className="text-xs text-slate-500">
                  Review medical leaves submitted via Student Portal. Approving automatically updates the attendance record to Excused.
                </p>
              </div>
              <span className="text-xs font-bold bg-amber-50 text-amber-800 px-3 py-1 rounded-xl border border-amber-200">
                {pendingRequests.length} Awaiting Approval
              </span>
            </div>

            <div className="space-y-3">
              {studentRequests.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No student requests in queue.
                </div>
              ) : (
                studentRequests.map(req => {
                  const isPending = req.status === 'Pending';
                  return (
                    <div key={req.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">{req.studentName}</span>
                          <span className="text-xs text-slate-400">({req.studentId})</span>
                          {students.find(s => s.id === req.studentId)?.group && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {students.find(s => s.id === req.studentId)?.group}
                            </span>
                          )}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            {req.type}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-xs">{req.subject}</h4>
                        <p className="text-[11px] text-slate-600 leading-relaxed max-w-2xl">{req.message}</p>
                        <span className="text-[10px] text-slate-400 block mt-1">Submitted on {req.date}</span>

                        {req.teacherOrCrResponse && (
                          <div className="mt-2 p-2 rounded-xl bg-emerald-50 text-[11px] text-emerald-900 border border-emerald-100">
                            <strong>Recorded Action:</strong> {req.teacherOrCrResponse}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {isPending ? (
                          <>
                            <button
                              onClick={() => handleApproveExcuse(req.id, req.studentId, req.studentName)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                            >
                              Approve & Excuse Attendance
                            </button>
                            <button
                              onClick={() => resolveStudentRequest(req.id, 'Excuse request declined. Insufficient medical proof.', 'Resolved')}
                              className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors"
                            >
                              Decline
                            </button>
                          </>
                        ) : (
                          <span className={`text-xs font-bold px-3 py-1 rounded-xl ${
                            req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {req.status}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Session Attendance Rates */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-0.5">
                  Course Lecture Attendance Audit
                </h3>
                <p className="text-xs text-slate-500">
                  Official attendance records across all 12 curriculum lectures & labs
                </p>
              </div>
              <button
                onClick={() => setIsBulkUploadOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto hover:scale-105 active:scale-95 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" /> Upload Attendance Sheet
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sessions.map(session => {
                const recs = attendanceRecords.filter(r => r.sessionId === session.id);
                const present = recs.filter(r => r.status === 'Present').length;
                const absent = recs.filter(r => r.status === 'Absent').length;
                const rate = recs.length ? Math.round((present / recs.length) * 100) : 0;

                return (
                  <div key={session.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-500">{session.date}</span>
                      <span className="font-bold text-slate-900">{rate}% Rate</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">{session.topic}</h4>
                    <div className="mt-2 flex items-center space-x-2 text-[11px] text-slate-500">
                      <span className="text-emerald-700 font-bold">{present} Present</span>
                      <span>•</span>
                      <span className="text-rose-700 font-bold">{absent} Absent</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: STUDENT MENTORSHIP & NOTES */}
      {activeSubTab === 'feedback' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Remark Form */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Record Faculty Observation & Note
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Feedback is permanently saved to the student record and visible to Lead CR Yahoshuva Kesaboyina
            </p>

            <form onSubmit={handleAddFeedbackSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Student</label>
                <select
                  value={feedbackStudentId}
                  onChange={(e) => setFeedbackStudentId(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.id}) — {s.batch}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Faculty Feedback Text</label>
                <textarea
                  required
                  rows={5}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="e.g. Excellent improvement in impromptu speech articulation. Needs to practice passive voice transformations..."
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Faculty Note to Student File</span>
              </button>
            </form>
          </div>

          {/* Recent Student Feedback Stream */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Recent Student Observation Log
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Past remarks given by {activeTeacher.name} & Lead CR
            </p>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {students.flatMap(s => s.crRemarks.map(r => ({ ...r, studentName: s.name, studentId: s.id }))).length === 0 ? (
                <p className="text-xs text-slate-400 italic">No remarks recorded yet.</p>
              ) : (
                students
                  .flatMap(s => s.crRemarks.map(r => ({ ...r, studentName: s.name, studentId: s.id })))
                  .slice(0, 10)
                  .map((r, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span className="font-bold text-slate-900">{r.studentName} ({r.studentId})</span>
                        <span>{r.date}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{r.text}</p>
                      <span className="text-[10px] text-indigo-600 font-semibold block mt-1">Author: {r.author}</span>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* BULK ATTENDANCE UPLOAD MODAL */}
      <BulkAttendanceUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
      />
    </div>
  );
};
