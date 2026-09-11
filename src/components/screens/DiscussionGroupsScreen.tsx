import React, { useState, useMemo } from 'react';
import {
  Users,
  MessageSquare,
  Award,
  Calendar,
  Share2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  Sparkles,
  Download,
  Filter,
  Flame,
  ShieldCheck,
  Star,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../common/StatusBadge';
import { soundFx } from '../../utils/soundEffects';
import { fireQuickConfetti, fireGrandCelebration } from '../../utils/confettiUtils';
import { WhatsAppBroadcastModal } from '../common/WhatsAppBroadcastModal';
import { downloadCSV } from '../../utils/exportUtils';
import { Student } from '../../types';

interface GroupDebateScore {
  content: number;
  articulation: number;
  listening: number;
  teamwork: number;
}

const OFFICIAL_GROUP_TOPICS: Record<string, { topic: string; focus: string; debateRole: string }> = {
  'Group 1': {
    topic: 'Artificial Intelligence in Higher Education: Transformative Catalyst or Academic Vulnerability?',
    focus: 'GenAI Tools, Code Copilots, Academic Rigor, Assessment Integrity',
    debateRole: 'Affirmative Lead Team'
  },
  'Group 2': {
    topic: 'Campus Cybersecurity, Digital Privacy & Sovereign Cloud Infrastructure',
    focus: 'Data Sovereignty, Campus Surveillance, Biometrics, Vulnerability Disclosure',
    debateRole: 'Technical Audit Panel'
  },
  'Group 3': {
    topic: 'Remote Collaboration vs. In-Person Engineering Cohorts: Post-Pandemic Paradigms',
    focus: 'Async Workflows, Deep Work, Peer Bonding, Physical Lab Dynamics',
    debateRole: 'Comparative Analysis Team'
  },
  'Group 4': {
    topic: 'Open-Source AI Licensing, Fair Use & Commercial Derivative Rights',
    focus: 'Llama Weights, Training Set Copyright, Attribution, Developer Ethics',
    debateRole: 'Policy & Legal Team'
  },
  'Group 5': {
    topic: 'Engineering Technical Communication: Pitching Architecture to Non-Technical Stakeholders',
    focus: 'Executive Summaries, Technical Jargon vs Clarity, Persuasive Presentation',
    debateRole: 'Industry Readiness Team'
  },
  'Group 6': {
    topic: 'Campus Environmental Sustainability & Zero-Carbon Technological Initiatives',
    focus: 'E-Waste Management, Renewable Energy, Green Computing, Student Initiatives',
    debateRole: 'Civic Impact Team'
  },
  'Group 7': {
    topic: 'Constructive Peer Review Culture & Psychological Safety in Technical Teams',
    focus: 'Code Review Etiquette, Blameless Post-Mortems, Mentorship, Conflict Resolution',
    debateRole: 'Team Dynamics Panel'
  }
};

export const DiscussionGroupsScreen: React.FC = () => {
  const { students, studentStats, openStudentProfile, userRole, currentUser } = useApp();
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastTargetGroup, setBroadcastTargetGroup] = useState<string>('Group 5');
  const [groupScores, setGroupScores] = useState<Record<string, GroupDebateScore>>({
    'Group 1': { content: 88, articulation: 85, listening: 82, teamwork: 90 },
    'Group 2': { content: 84, articulation: 82, listening: 86, teamwork: 85 },
    'Group 3': { content: 86, articulation: 88, listening: 84, teamwork: 87 },
    'Group 4': { content: 82, articulation: 80, listening: 85, teamwork: 84 },
    'Group 5': { content: 92, articulation: 90, listening: 88, teamwork: 94 },
    'Group 6': { content: 80, articulation: 78, listening: 82, teamwork: 82 },
    'Group 7': { content: 90, articulation: 88, listening: 89, teamwork: 92 }
  });

  const groupNames = ['Group 1', 'Group 2', 'Group 3', 'Group 4', 'Group 5', 'Group 6', 'Group 7'];

  // Calculate statistics per group
  const groupData = useMemo(() => {
    return groupNames.map(groupName => {
      const members = students.filter(s => (s.discussionGroup || s.group) === groupName && !s.isArchived);
      const memberStats = members.map(m => studentStats.find(st => st.student.id === m.id)).filter(Boolean);

      const avgAttendance = memberStats.length
        ? Math.round(memberStats.reduce((sum, s) => sum + (s?.attendancePercentage || 0), 0) / memberStats.length)
        : 0;

      const avgCommunication = members.length
        ? Math.round(members.reduce((sum, m) => sum + (m.skills?.communication || 75), 0) / members.length)
        : 75;

      const atRiskCount = memberStats.filter(s => s && (s.status === 'At Risk' || s.status === 'Needs Attention')).length;

      // Identify Group Leader (first member or assigned)
      const leader = members[0] || null;

      const metadata = OFFICIAL_GROUP_TOPICS[groupName] || {
        topic: 'Discussion Topic for Term 1',
        focus: 'Collaborative Dialogue',
        debateRole: 'Panelist'
      };

      const score = groupScores[groupName] || { content: 80, articulation: 80, listening: 80, teamwork: 80 };
      const compositeScore = Math.round((score.content + score.articulation + score.listening + score.teamwork) / 4);

      return {
        name: groupName,
        members,
        leader,
        avgAttendance,
        avgCommunication,
        atRiskCount,
        metadata,
        score,
        compositeScore
      };
    });
  }, [students, studentStats, groupScores]);

  // Filter groups
  const filteredGroups = useMemo(() => {
    return groupData.filter(g => {
      if (selectedGroup !== 'All' && g.name !== selectedGroup) return false;
      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase();
      const matchesTopic = g.metadata.topic.toLowerCase().includes(query);
      const matchesGroup = g.name.toLowerCase().includes(query);
      const matchesMember = g.members.some(
        m => m.name.toLowerCase().includes(query) || m.id.toLowerCase().includes(query)
      );

      return matchesTopic || matchesGroup || matchesMember;
    });
  }, [groupData, selectedGroup, searchQuery]);

  const handleExportGroupsCSV = () => {
    const headers = ['Discussion Group', 'Student Roll No', 'Student Name', 'Batch', 'Attendance %', 'Group Topic', 'Group Composite Score'];
    const rows: string[][] = [];

    groupData.forEach(g => {
      g.members.forEach(m => {
        const stats = studentStats.find(st => st.student.id === m.id);
        rows.push([
          `"${g.name}"`,
          `"${m.id}"`,
          `"${m.name}"`,
          `"${m.batch}"`,
          `${stats?.attendancePercentage || 0}%`,
          `"${g.metadata.topic.replace(/"/g, '""')}"`,
          `${g.compositeScore}/100`
        ]);
      });
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCSV('SST_Official_Discussion_Groups_2026.csv', csvContent);
  };

  const handleOpenGroupBroadcast = (groupName: string) => {
    soundFx.playPop();
    setBroadcastTargetGroup(groupName);
    setIsBroadcastOpen(true);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-100/50 via-blue-50/30 to-transparent rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center space-x-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shadow-xs">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                Official Syllabus Document • GROUPS_ENG_2026.pdf
              </span>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                English Discussion Groups Hub (Groups 1–7)
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            44 students partitioned across 7 discussion cohorts for Lecture 10 (<strong className="text-slate-800">SES-110: Group Discussion 1</strong>). Monitor group dynamics, track debate performance, and broadcast announcements.
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10 shrink-0">
          <button
            onClick={handleExportGroupsCSV}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs hover:shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" /> Export Groups Roster (.CSV)
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by student name, roll number, or discussion topic..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-slate-500 font-bold flex items-center gap-1">
            <Filter className="w-3 h-3" /> Group:
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setSelectedGroup('All')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedGroup === 'All'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All 7 Groups
            </button>
            {groupNames.map(g => (
              <button
                key={g}
                onClick={() => setSelectedGroup(g)}
                className={`px-2.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  selectedGroup === g
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGroups.map(group => {
          const isUserInThisGroup =
            currentUser.isGoogleAuthenticated &&
            group.members.some(
              m =>
                (currentUser.studentId && m.id === currentUser.studentId) ||
                (currentUser.email && m.email?.toLowerCase() === currentUser.email.toLowerCase())
            );

          return (
            <div
              key={group.name}
              className={`bg-white rounded-3xl border transition-all duration-200 shadow-card hover:shadow-lg overflow-hidden flex flex-col justify-between ${
                isUserInThisGroup
                  ? 'border-purple-400 ring-2 ring-purple-400/30'
                  : 'border-slate-200/90 hover:border-purple-300'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 pb-4 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-transparent">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      {group.name.replace('Group ', 'G')}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                          {group.name}
                        </h3>
                        {isUserInThisGroup && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-emerald-600" /> Your Assigned Group
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-purple-700 font-semibold">
                        Role: {group.metadata.debateRole}
                      </span>
                    </div>
                  </div>

                  {/* WhatsApp Broadcast Shortcut */}
                  <button
                    onClick={() => handleOpenGroupBroadcast(group.name)}
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all text-xs font-bold flex items-center gap-1 shadow-2xs hover:scale-105 active:scale-95"
                    title={`Broadcast announcement to ${group.name} members`}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Broadcast</span>
                  </button>
                </div>

                {/* Assigned Topic */}
                <div className="mt-3 p-3 bg-purple-50/60 rounded-2xl border border-purple-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block mb-0.5">
                    Assigned GD Motion / Topic
                  </span>
                  <p className="text-xs font-bold text-slate-900 leading-snug">
                    "{group.metadata.topic}"
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Key Dimensions: {group.metadata.focus}
                  </p>
                </div>
              </div>

              {/* Group Metrics Bar */}
              <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Team Size
                  </span>
                  <span className="text-sm font-extrabold text-slate-800">
                    {group.members.length} Enrolled
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Avg Attendance
                  </span>
                  <span
                    className={`text-sm font-extrabold ${
                      group.avgAttendance >= 85
                        ? 'text-emerald-600'
                        : group.avgAttendance >= 75
                        ? 'text-blue-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {group.avgAttendance}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    GD Rubric Score
                  </span>
                  <span className="text-sm font-extrabold text-purple-700">
                    {group.compositeScore}/100
                  </span>
                </div>
              </div>

              {/* Roster of Official Members */}
              <div className="p-5 flex-1">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  <span>Enrolled Student Members ({group.members.length})</span>
                  <span>Attendance</span>
                </div>

                <div className="space-y-1.5">
                  {group.members.map(member => {
                    const stats = studentStats.find(s => s.student.id === member.id);
                    const isCurrentUser =
                      currentUser.isGoogleAuthenticated &&
                      ((currentUser.studentId && member.id === currentUser.studentId) ||
                        (currentUser.email && member.email?.toLowerCase() === currentUser.email.toLowerCase()));

                    return (
                      <div
                        key={member.id}
                        onClick={() => openStudentProfile(member.id)}
                        className={`p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer group ${
                          isCurrentUser
                            ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-400/40'
                            : 'bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            {member.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-1.5">
                              <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                                {member.name}
                              </p>
                              {member.id === group.leader?.id && (
                                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                                  Lead
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono block truncate">
                              {member.id} • {member.batch}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          {stats && (
                            <span
                              className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                                stats.attendancePercentage >= 85
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : stats.attendancePercentage >= 75
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {stats.attendancePercentage}%
                            </span>
                          )}
                          <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card Footer: Quick Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-medium">
                  {group.atRiskCount > 0 ? (
                    <span className="text-rose-600 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {group.atRiskCount} member{group.atRiskCount > 1 ? 's' : ''} at risk
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> All members &gt;75%
                    </span>
                  )}
                </span>

                <button
                  onClick={() => openStudentProfile(group.leader?.id || group.members[0].id)}
                  className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                >
                  <span>View Group Lead</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* WhatsApp Broadcast Modal */}
      <WhatsAppBroadcastModal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
      />
    </div>
  );
};
