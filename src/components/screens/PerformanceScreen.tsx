import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  Flame,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  BarChart2,
  CheckCircle2,
  Users
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../common/StatusBadge';

export const PerformanceScreen: React.FC = () => {
  const { studentStats, openStudentProfile, dashboardMetrics } = useApp();
  const [selectedBatch, setSelectedBatch] = useState('All');

  const { skillAverages, weakestSkill } = dashboardMetrics;

  // Filter student stats by batch if selected
  const activeStats = studentStats.filter(
    s => selectedBatch === 'All' || s.student.batch === selectedBatch
  );

  // Top Performers (sorted by overallScore desc)
  const topPerformers = [...activeStats]
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 6);

  // Most Improved Students (sorted by scoreImprovement desc)
  const mostImproved = [...activeStats]
    .filter(s => s.scoreImprovement > 0)
    .sort((a, b) => b.scoreImprovement - a.scoreImprovement)
    .slice(0, 5);

  // Students Requiring Academic Support (overall score < 70)
  const requiringSupport = [...activeStats]
    .filter(s => s.overallScore < 75)
    .sort((a, b) => a.overallScore - b.overallScore);

  // Class wide average score
  const classAvgScore = activeStats.length > 0
    ? Math.round(activeStats.reduce((acc, curr) => acc + curr.overallScore, 0) / activeStats.length)
    : 0;

  // Highest scorer
  const bestScorer = topPerformers[0];

  // Group comparison metrics for official Discussion Groups (Group 1 - 7)
  const groupStats = useMemo(() => {
    const groupNames = ['Group 1', 'Group 2', 'Group 3', 'Group 4', 'Group 5', 'Group 6', 'Group 7'];
    return groupNames.map(grp => {
      const members = studentStats.filter(s => (s.student.group || 'Group 1') === grp);
      if (members.length === 0) {
        return {
          name: grp,
          memberCount: 0,
          avgScore: 0,
          avgAttendance: 0,
          topStudent: 'N/A',
          topScore: 0,
          atRiskCount: 0,
        };
      }
      const totalScore = members.reduce((acc, m) => acc + m.overallScore, 0);
      const totalAtt = members.reduce((acc, m) => acc + m.attendancePercentage, 0);
      const sortedByScore = [...members].sort((a, b) => b.overallScore - a.overallScore);
      const atRiskCount = members.filter(m => m.status === 'Needs Attention' || m.status === 'At Risk').length;

      return {
        name: grp,
        memberCount: members.length,
        avgScore: Math.round(totalScore / members.length),
        avgAttendance: Math.round(totalAtt / members.length),
        topStudent: sortedByScore[0]?.student.name || 'N/A',
        topScore: sortedByScore[0]?.overallScore || 0,
        atRiskCount,
      };
    });
  }, [studentStats]);

  return (
    <div className="space-y-6 pb-12">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Class Average Score
          </p>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-blue-600">{classAvgScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <span className="text-xs text-emerald-600 font-medium">+3.4 pts improvement</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Top Performer
          </p>
          <p className="text-lg font-bold text-slate-900 mt-1 truncate">
            {bestScorer ? bestScorer.student.name : 'N/A'}
          </p>
          <span className="text-xs text-amber-600 font-bold">
            {bestScorer ? `${bestScorer.overallScore}/100 • ${bestScorer.student.currentLevel.split(' ')[0]}` : ''}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Needs Support
          </p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{requiringSupport.length}</p>
          <span className="text-xs text-rose-600 font-medium">Scores below 75 threshold</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Weakest Skill Area
          </p>
          <p className="text-lg font-bold text-slate-900 mt-1 truncate">
            {weakestSkill ? weakestSkill.skill : 'Pronunciation'}
          </p>
          <span className="text-xs text-amber-600 font-semibold">
            {weakestSkill ? `${weakestSkill.score}% class average` : ''}
          </span>
        </div>
      </div>

      {/* SKILL RADAR & BAR CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Average Skill Distribution (Bar) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Class Proficiency Across 7 Dimensions
              </h3>
              <p className="text-xs text-slate-500">
                Evaluation breakdown from oral exams, labs, and assignments
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Scale 0 - 100
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillAverages} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="skill" tick={{ fontSize: 10, fill: '#64748b' }} angle={-15} textAnchor="end" />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="score" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Radar / Competency Web */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Skill Balance & Focus Map
            </h3>
            <p className="text-xs text-slate-500">
              Balanced communication radar chart across oral and written competence
            </p>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillAverages}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: '#475569' }} />
                <PolarRadiusAxis angle={30} domain={[40, 100]} tick={{ fontSize: 9 }} />
                <Radar
                  name="Class Average"
                  dataKey="score"
                  stroke="#2563EB"
                  fill="#3B82F6"
                  fillOpacity={0.4}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* CR Action Tip Banner */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start space-x-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">CR Action Tip for Pronunciation:</span> Schedule a 20-minute
              minimal-pairs drill with Noor Nigar to address tongue placement and word stress issues before the viva.
            </div>
          </div>
        </div>
      </div>

      {/* TOP PERFORMERS & MOST IMPROVED (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers Leaderboard */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Top Performers Leaderboard
              </h3>
            </div>
            <span className="text-xs text-slate-500">Highest Cumulative Score</span>
          </div>

          <div className="space-y-2.5">
            {topPerformers.map((stat, idx) => (
              <div
                key={stat.student.id}
                onClick={() => openStudentProfile(stat.student.id)}
                className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer flex items-center justify-between"
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
                      {stat.student.id} • {stat.student.batch} • {stat.student.currentLevel}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-xs font-black text-blue-600">{stat.overallScore}/100</p>
                    <p className="text-[10px] text-slate-400">{stat.attendancePercentage}% att.</p>
                  </div>
                  <RiskBadge status={stat.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Improved Students */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Most Improved Students
              </h3>
            </div>
            <span className="text-xs text-slate-500">Highest Score Growth</span>
          </div>

          <div className="space-y-2.5">
            {mostImproved.map(stat => (
              <div
                key={stat.student.id}
                onClick={() => openStudentProfile(stat.student.id)}
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                    +{stat.scoreImprovement}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{stat.student.name}</p>
                    <p className="text-[11px] text-slate-400">
                      Grew from {stat.student.previousOverallScore} to {stat.overallScore} pts
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> +{stat.scoreImprovement} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DISCUSSION GROUPS COMPARISON BENCHMARK (GROUPS 1 - 7) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Discussion Groups Cohort Analysis (Groups 1–7)
              </h3>
              <p className="text-xs text-slate-500">
                Official team performance and attendance metrics for Lecture 10 (SES-110: Group Discussion 1)
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
            44 Students in 7 Groups
          </span>
        </div>

        {/* Group Comparison Bar Chart */}
        <div className="h-64 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={groupStats} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />
              <Bar name="Avg Academic Score" dataKey="avgScore" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              <Bar name="Avg Attendance %" dataKey="avgAttendance" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 7 Group Detail Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {groupStats.map(g => (
            <div
              key={g.name}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{g.name}</span>
                  <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {g.memberCount} members
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between text-xs">
                  <span className="text-slate-500">Avg Score:</span>
                  <span className="font-black text-indigo-600 text-sm">{g.avgScore}/100</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between text-xs">
                  <span className="text-slate-500">Attendance:</span>
                  <span className="font-bold text-emerald-600">{g.avgAttendance}%</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-[11px] flex items-center justify-between text-slate-600">
                <span className="truncate max-w-[130px]">Top: <strong>{g.topStudent}</strong></span>
                {g.atRiskCount > 0 ? (
                  <span className="text-rose-600 font-bold text-[10px] bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                    {g.atRiskCount} at-risk
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    All On-Track
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STUDENTS REQUIRING SUPPORT */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Students Requiring Academic Support
            </h3>
            <p className="text-xs text-slate-500">
              Score below 75 in 2 or more categories; recommended for peer-buddy pairing
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {requiringSupport.map(stat => (
            <div
              key={stat.student.id}
              onClick={() => openStudentProfile(stat.student.id)}
              className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 transition-colors cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{stat.student.name}</span>
                <span className="text-xs font-black text-rose-600">{stat.overallScore}/100</span>
              </div>
              <p className="text-[11px] text-slate-500">{stat.student.id} • {stat.student.batch}</p>
              <div className="pt-2 border-t border-rose-200/60 text-[11px] text-slate-600 flex justify-between">
                <span>Comm: {stat.student.skills.communication}</span>
                <span>Grammar: {stat.student.skills.grammar}</span>
                <span>Vocab: {stat.student.skills.vocabulary}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
