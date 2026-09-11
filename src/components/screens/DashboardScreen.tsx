import React from 'react';
import {
  Users,
  UserCheck,
  UserX,
  CalendarCheck2,
  Clock,
  Percent,
  ArrowRight,
  Plus,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  TrendingUp,
  Award,
  Sparkles,
  ExternalLink,
  MessageSquare,
  RotateCcw,
  ShieldCheck,
  Layers,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../common/MetricCard';
import { RiskBadge, SessionBadge, PriorityBadge } from '../common/StatusBadge';
import { WelcomeHero } from '../common/WelcomeHero';
import { Card3D } from '../common/Card3D';
import { soundFx } from '../../utils/soundEffects';
import { fireQuickConfetti, fireStarConfetti } from '../../utils/confettiUtils';
import { WhatsAppBroadcastModal } from '../common/WhatsAppBroadcastModal';
import { formatTimeAgo } from '../../utils/formatters';

export const DashboardScreen: React.FC = () => {
  const [isBroadcastOpen, setIsBroadcastOpen] = React.useState(false);
  const [activityFilter, setActivityFilter] = React.useState<'all' | 'attendance' | 'academic' | 'system' | 'communication'>('all');
  const {
    students,
    sessions,
    tasks,
    dashboardMetrics,
    activityLogs,
    refreshActivityLogs,
    setActiveTab,
    openStudentProfile,
    setSelectedSessionId,
    toggleTask,
    setIsGoogleAuthModalOpen,
    setIsOnboardingOpen
  } = useApp();

  const filteredActivityLogs = React.useMemo(() => {
    if (!activityLogs) return [];
    if (activityFilter === 'all') return activityLogs;
    return activityLogs.filter(log => log.category === activityFilter);
  }, [activityLogs, activityFilter]);

  const {
    totalStudents,
    presentToday,
    presentPercentage,
    absentToday,
    absentPercentage,
    sessionsConducted,
    totalPlannedSessions,
    pendingSessions,
    averageAttendance,
    statusDistribution,
    studentsNeedingAttention,
    topPerformers,
    attendanceTrend,
    recentSessionsData,
  } = dashboardMetrics;

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => s.date === todayStr);

  const pendingTasksToday = tasks.slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      {/* 3D Interactive Welcome & Onboarding Hero */}
      <WelcomeHero
        onOpenTour={() => setIsOnboardingOpen(true)}
        onOpenGoogleAuth={() => setIsGoogleAuthModalOpen(true)}
      />

      {/* Top Banner / Welcome Callout */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Subject - 2 • 4 Weeks Curriculum</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
            English Language & Communication Skills
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            CR Command Center for Tenses, Speed Friending, Impromptu Speeches, Everyday Conversations, Presentations, and Group Discussions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => {
              soundFx.playPop();
              setSelectedSessionId('SES-107');
              setActiveTab('attendance');
            }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <PlayCircle className="w-4 h-4" />
            Mark Attendance
          </button>
          <button
            onClick={() => {
              soundFx.playPop();
              setActiveTab('groups');
            }}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <Users className="w-4 h-4" />
            Discussion Groups (7)
          </button>
          <button
            onClick={() => {
              soundFx.playPop();
              setIsBroadcastOpen(true);
            }}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            Broadcast
          </button>
          <button
            onClick={() => {
              soundFx.playPop();
              setActiveTab('students');
            }}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all border border-slate-700 hover:scale-105 active:scale-95"
          >
            Directory
          </button>
        </div>
      </div>

      {/* 6 KPI Cards wrapped in 3D perspective tilt */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card3D intensity={10}>
          <MetricCard
            title="Total Students"
            value={totalStudents}
            subtitle="Enrolled active"
            icon={<Users className="w-5 h-5 text-blue-600" />}
            iconBgColor="bg-blue-50"
            onClick={() => setActiveTab('students')}
          />
        </Card3D>
        <Card3D intensity={10}>
          <MetricCard
            title="Present Today"
            value={presentToday}
            subtitle={`${presentPercentage}% attendance`}
            trend={{ value: `${presentPercentage}%`, isPositive: presentPercentage >= 85 }}
            icon={<UserCheck className="w-5 h-5 text-emerald-600" />}
            iconBgColor="bg-emerald-50"
            onClick={() => setActiveTab('attendance')}
          />
        </Card3D>
        <Card3D intensity={10}>
          <MetricCard
            title="Absent Today"
            value={absentToday}
            subtitle={`${absentPercentage}% absent rate`}
            trend={{ value: `${absentToday} students`, isPositive: absentToday === 0 }}
            icon={<UserX className="w-5 h-5 text-rose-600" />}
            iconBgColor="bg-rose-50"
            onClick={() => setActiveTab('attendance')}
          />
        </Card3D>
        <Card3D intensity={10}>
          <MetricCard
            title="Sessions Done"
            value={`${sessionsConducted} / ${totalPlannedSessions}`}
            subtitle="Curriculum progress"
            icon={<CalendarCheck2 className="w-5 h-5 text-indigo-600" />}
            iconBgColor="bg-indigo-50"
            onClick={() => setActiveTab('sessions')}
          />
        </Card3D>
        <Card3D intensity={10}>
          <MetricCard
            title="Pending Sessions"
            value={pendingSessions}
            subtitle="Upcoming & scheduled"
            icon={<Clock className="w-5 h-5 text-amber-600" />}
            iconBgColor="bg-amber-50"
            onClick={() => setActiveTab('sessions')}
          />
        </Card3D>
        <Card3D intensity={10}>
          <MetricCard
            title="Avg Attendance"
            value={`${averageAttendance}%`}
            subtitle="Class-wide cumulative"
            trend={{ value: averageAttendance >= 85 ? 'On Track' : 'Needs Work', isPositive: averageAttendance >= 85 }}
            icon={<Percent className="w-5 h-5 text-purple-600" />}
            iconBgColor="bg-purple-50"
            onClick={() => setActiveTab('reports')}
          />
        </Card3D>
      </div>

      {/* OFFICIAL DISCUSSION GROUPS HUB HIGHLIGHT (7 Groups from GROUPS_ENG_2026.pdf) */}
      <div className="bg-gradient-to-br from-white via-indigo-50/20 to-blue-50/30 rounded-2xl p-5 border border-indigo-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-600/20 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Official Discussion Groups Hub
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
                  7 Groups • 44 Students Active
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Official cohorts from GROUPS_ENG_2026.pdf for Lecture 10 debate, articulation & negotiation labs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                soundFx.playPop();
                setIsBroadcastOpen(true);
              }}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Broadcast to Groups</span>
            </button>
            <button
              onClick={() => {
                soundFx.playPop();
                setActiveTab('groups');
              }}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <span>Open Groups Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 7 Groups Mini Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {['Group 1', 'Group 2', 'Group 3', 'Group 4', 'Group 5', 'Group 6', 'Group 7'].map((grp, i) => {
            const count = students.filter(s => (s.discussionGroup || s.group) === grp && !s.isArchived).length;
            return (
              <button
                key={grp}
                onClick={() => {
                  soundFx.playPop();
                  setActiveTab('groups');
                }}
                className="p-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-xs transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {grp}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">#{i + 1}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  <span className="font-bold text-slate-900">{count}</span> members
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DASHBOARD ANALYTICS CHARTS (3 CHARTS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend Line Chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Attendance Trajectory Across Recent Sessions
              </h3>
              <p className="text-xs text-slate-500">
                Shows average presence % over the last 8 completed sessions
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Target: 85%+
            </span>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            {attendanceTrend.length === 0 ? (
              <div className="text-center p-6 text-slate-400">
                <CalendarCheck2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="font-bold text-slate-600 text-sm">Real-time attendance tracking ready</p>
                <p className="text-xs text-slate-400 mt-1">Attendance trajectory will plot automatically as faculty records live attendance.</p>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="mt-3 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1"
                >
                  Go to Live Attendance Console <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrend} margin={{ top: 10, right: 20, left: -10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="sessionName"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" />
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'Attendance']}
                    labelFormatter={label => `Topic: ${label}`}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="attendancePct"
                    stroke="#2563EB"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#2563EB', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Student Status Donut Chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Student Status Distribution
            </h3>
            <p className="text-xs text-slate-500">Categorized by attendance thresholds</p>
          </div>

          <div className="h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Center metric */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900">{totalStudents}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Students</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {statusDistribution.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900">{item.value}</span>
                  <span className="text-slate-400">
                    ({totalStudents > 0 ? Math.round((item.value / totalStudents) * 100) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar Chart: Recent Session Attendance Breakdown */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Session Attendance Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Comparing Present, Late, and Absent headcounts for recent sessions
            </p>
          </div>
          <button
            onClick={() => setActiveTab('attendance')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto"
          >
            Marking Console <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="h-64 w-full flex items-center justify-center">
          {recentSessionsData.length === 0 ? (
            <div className="text-center p-6 text-slate-400">
              <Activity className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-slate-600 text-sm">No live session records yet</p>
              <p className="text-xs text-slate-400 mt-1">Headcount distribution (Present / Late / Absent) will update dynamically in real time.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recentSessionsData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="Present" fill="#10B981" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="Late" fill="#F59E0B" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="Absent" fill="#EF4444" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* TODAY'S SESSIONS & TODAY'S CR TASKS (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Sessions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Today&apos;s Sessions
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {todaySessions.length} Scheduled
                </span>
              </div>
              <button
                onClick={() => setActiveTab('sessions')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {todaySessions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No sessions scheduled for today.
                </div>
              ) : (
                todaySessions.map(session => (
                  <div
                    key={session.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{session.topic}</span>
                        <SessionBadge status={session.status} />
                      </div>
                      <p className="text-xs text-slate-500">
                        {session.startTime} - {session.endTime} • {session.faculty}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Mode: <span className="font-medium text-slate-600">{session.mode}</span> ({session.location})
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedSessionId(session.id);
                        setActiveTab('attendance');
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shrink-0 shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      Mark Attendance
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Today's CR Tasks Checklist */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Today&apos;s CR Action Checklist
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {tasks.filter(t => t.status === 'Completed').length} / {tasks.length} Done
                </span>
              </div>
              <button
                onClick={() => setActiveTab('cr-tasks')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                All Tasks <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {pendingTasksToday.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-1.5" />
                  <p className="font-bold text-slate-700 text-xs">No pending operational tasks</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">CR Aarav Sharma or Teacher Noor Nigar can log tasks in real time.</p>
                </div>
              ) : (
                pendingTasksToday.map(task => {
                  const isDone = task.status === 'Completed';
                  return (
                    <div
                      key={task.id}
                      onClick={() => {
                        if (!isDone) {
                          soundFx.playSuccess();
                          fireStarConfetti();
                        } else {
                          soundFx.playPop();
                        }
                        toggleTask(task.id);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
                        isDone
                          ? 'bg-slate-50 border-slate-200/80 text-slate-400'
                          : 'bg-white border-slate-200 hover:border-blue-300 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                            isDone
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 hover:border-blue-500 bg-white'
                          }`}
                        >
                          {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span className={`text-xs font-medium truncate ${isDone ? 'line-through' : ''}`}>
                          {task.task}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <PriorityBadge priority={task.priority} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* REAL-TIME INSTITUTIONAL ACTIVITY AUDIT FEED */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              <span>Institutional Activity Audit Trail</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                Live Audit Stream
              </span>
            </h3>
          </div>

          {/* Category Filter Pills & Refresh */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(['all', 'attendance', 'academic', 'system', 'communication'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActivityFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  activityFilter === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => {
                soundFx.playPop();
                refreshActivityLogs();
              }}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
              title="Refresh Activity Log"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredActivityLogs.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No recent activity records matching filter.
            </div>
          ) : (
            filteredActivityLogs.slice(0, 6).map((log) => {
              const timeAgo = formatTimeAgo(log.timestamp);
              return (
                <div
                  key={log.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start space-x-3 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold ${
                      log.category === 'attendance'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.category === 'academic'
                        ? 'bg-blue-100 text-blue-800'
                        : log.category === 'communication'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {log.actorRole === 'Teacher' ? 'FAC' : log.actorRole === 'CR' ? 'CR' : 'SYS'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900">{log.actorName}</span>
                        <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-700">
                          {log.action}
                        </span>
                        <span className="text-[11px] text-slate-400">{timeAgo}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5 break-words">
                        {log.details}
                      </p>
                    </div>
                  </div>

                  {log.targetId && (
                    <button
                      onClick={() => {
                        if (log.category === 'attendance') {
                          setActiveTab('attendance');
                        } else if (log.targetId?.startsWith('26bcs')) {
                          openStudentProfile(log.targetId);
                        } else if (log.targetId?.startsWith('Group')) {
                          setActiveTab('groups');
                        }
                      }}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 shrink-0 hover:underline flex items-center gap-0.5"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* STUDENTS NEEDING ATTENTION & TOP PERFORMERS (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Students Needing Attention (2 cols) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Students Needing Immediate Attention
              </h3>
              <p className="text-xs text-slate-500">
                Students below attendance thresholds requiring CR follow-up or intervention
              </p>
            </div>
            <button
              onClick={() => setActiveTab('follow-ups')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              Follow-ups Hub <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/50">
                <tr>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Attendance %</th>
                  <th className="py-2.5 px-3">Missed</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Recommended Action</th>
                  <th className="py-2.5 px-3 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentsNeedingAttention.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-1" />
                      <p className="font-bold text-slate-700 text-xs">All 44 students are currently in good standing</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Real-time alerts will trigger automatically if attendance drops below thresholds.</p>
                    </td>
                  </tr>
                ) : (
                  studentsNeedingAttention.slice(0, 5).map(stat => (
                    <tr
                      key={stat.student.id}
                      onClick={() => openStudentProfile(stat.student.id)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{stat.student.name}</div>
                        <div className="text-[11px] text-slate-400">{stat.student.id} • {stat.student.batch}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-rose-600 text-sm">
                          {stat.attendancePercentage}%
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">
                        {stat.missedSessions} sessions
                      </td>
                      <td className="py-3 px-3">
                        <RiskBadge status={stat.status} />
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-1 rounded-md border border-rose-200">
                          {stat.attendancePercentage < 70 ? 'Emergency Call & Parent Alert' : 'Log Attendance Follow-up'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 ml-auto">
                          View <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performers (1 col) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Top Performers
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('performance')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {topPerformers.map((stat, idx) => (
                <div
                  key={stat.student.id}
                  onClick={() => openStudentProfile(stat.student.id)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                        idx === 0
                          ? 'bg-amber-100 text-amber-800'
                          : idx === 1
                          ? 'bg-slate-200 text-slate-800'
                          : idx === 2
                          ? 'bg-amber-900/10 text-amber-900'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{stat.student.name}</p>
                      <p className="text-[11px] text-slate-400">
                        Attendance: {stat.attendancePercentage}% • Level: {stat.student.currentLevel.split(' ')[0]}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {stat.overallScore}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* WHATSAPP BROADCAST MODAL */}
      <WhatsAppBroadcastModal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
      />
    </div>
  );
};
