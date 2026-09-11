import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Search,
  Filter,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  RotateCcw,
  Save,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  UploadCloud
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AttendanceStatus } from '../../types';
import { RiskBadge } from '../common/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';
import { soundFx } from '../../utils/soundEffects';
import { fireQuickConfetti, fireGrandCelebration } from '../../utils/confettiUtils';
import { BulkAttendanceUploadModal } from '../common/BulkAttendanceUploadModal';

export const AttendanceScreen: React.FC = () => {
  const {
    sessions,
    students,
    attendanceRecords,
    studentStats,
    selectedSessionId,
    setSelectedSessionId,
    markAttendance,
    bulkMarkAttendance,
    resetSessionAttendance,
    openStudentProfile,
    userRole
  } = useApp();

  const canEditAttendance = userRole === 'Teacher' || userRole === 'Admin';

  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [batchFilter, setBatchFilter] = useState('All');
  const [groupFilter, setGroupFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  // Currently selected session (or fallback to latest)
  const activeSession = useMemo(() => {
    return sessions.find(s => s.id === selectedSessionId) || sessions[0];
  }, [sessions, selectedSessionId]);

  // Students belonging to this session's batch or all
  const sessionStudents = useMemo(() => {
    if (!activeSession) return [];
    return students.filter(
      s => !s.isArchived && (activeSession.batch === 'All Batches' || s.batch === activeSession.batch)
    );
  }, [students, activeSession]);

  // Map studentId -> current status for activeSession
  const attendanceMap = useMemo(() => {
    const map = new Map<string, AttendanceStatus>();
    if (!activeSession) return map;

    attendanceRecords
      .filter(r => r.sessionId === activeSession.id)
      .forEach(r => {
        map.set(r.studentId, r.status);
      });
    return map;
  }, [attendanceRecords, activeSession]);

  // Headcount summary for active session
  const summaryCounts = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;
    let unmarked = 0;

    sessionStudents.forEach(s => {
      const st = attendanceMap.get(s.id);
      if (st === 'Present') present++;
      else if (st === 'Absent') absent++;
      else if (st === 'Late') late++;
      else if (st === 'Excused') excused++;
      else unmarked++;
    });

    const total = sessionStudents.length;
    const rate = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 0;
    return { present, absent, late, excused, unmarked, total, rate };
  }, [sessionStudents, attendanceMap]);

  // Filtered student list
  const filteredStudents = useMemo(() => {
    return sessionStudents.filter(student => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        student.name.toLowerCase().includes(q) ||
        student.id.toLowerCase().includes(q) ||
        (student.group && student.group.toLowerCase().includes(q));

      const matchesBatch = batchFilter === 'All' || student.batch === batchFilter;
      const matchesGroup = groupFilter === 'All' || student.group === groupFilter;

      const currentStatus = attendanceMap.get(student.id) || 'Absent';
      const matchesStatus = statusFilter === 'All' || currentStatus === statusFilter;

      return matchesSearch && matchesBatch && matchesGroup && matchesStatus;
    });
  }, [sessionStudents, searchQuery, batchFilter, groupFilter, statusFilter, attendanceMap]);

  const handleMarkAllPresent = () => {
    if (!activeSession) return;
    soundFx.playSuccess();
    fireQuickConfetti();
    const records = sessionStudents.map(s => ({
      studentId: s.id,
      status: 'Present' as AttendanceStatus,
    }));
    bulkMarkAttendance(activeSession.id, records);
    addToast(`Marked all ${sessionStudents.length} students as Present!`, 'success');
  };

  const handleReset = () => {
    if (!activeSession) return;
    soundFx.playPop();
    resetSessionAttendance(activeSession.id);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* SESSION PICKER & ACTION BAR */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Select Session Dropdown */}
          <div className="flex-1 max-w-xl">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Select Session To Mark
            </label>
            <select
              value={activeSession?.id || ''}
              onChange={e => setSelectedSessionId(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            >
              {sessions.map(s => (
                <option key={s.id} value={s.id}>
                  {s.id}: {s.topic} ({formatDate(s.date)} • {s.batch})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Action Buttons or Read-Only Notice */}
          <div className="flex items-center gap-2 flex-wrap">
            {canEditAttendance ? (
              <>
                <button
                  onClick={handleMarkAllPresent}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 hover:scale-105 active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" /> Mark All Present
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
                  title="Reset all marks for this session"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset
                </button>
                <button
                  onClick={() => setIsBulkUploadOpen(true)}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 hover:scale-105 active:scale-95"
                  title="Upload Excel or CSV attendance spreadsheet"
                >
                  <UploadCloud className="w-4 h-4" /> Upload Sheet
                </button>
                <button
                  onClick={() => {
                    soundFx.playFanfare();
                    fireGrandCelebration();
                    addToast('Attendance records synced to tracker successfully!', 'success');
                  }}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 hover:scale-105 active:scale-95"
                >
                  <Save className="w-4 h-4" /> Save Attendance
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Read-Only Audit Mode: Only Faculty Teachers can record or edit attendance.</span>
              </div>
            )}
          </div>
        </div>

        {/* Active Session Info Banner */}
        {activeSession && (
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-blue-900 text-sm">
                  {activeSession.topic}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-200 text-blue-800">
                  {activeSession.status}
                </span>
              </div>
              <p className="text-slate-600">
                {formatDate(activeSession.date)} • {activeSession.startTime} - {activeSession.endTime} • Faculty: <span className="font-semibold text-slate-800">{activeSession.faculty}</span>
              </p>
              <p className="text-slate-500">
                Mode: <span className="font-semibold">{activeSession.mode}</span> ({activeSession.location}) • Batch: <span className="font-semibold">{activeSession.batch}</span>
              </p>
            </div>

            {/* Attendance Tally Badges */}
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <span className="px-2.5 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {summaryCounts.present} Present
              </span>
              <span className="px-2.5 py-1.5 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {summaryCounts.late} Late
              </span>
              <span className="px-2.5 py-1.5 rounded-lg bg-rose-100 text-rose-800 font-bold flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> {summaryCounts.absent} Absent
              </span>
              <span className="px-2.5 py-1.5 rounded-lg bg-blue-100 text-blue-800 font-bold">
                {summaryCounts.rate}% Rate
              </span>
            </div>
          </div>
        )}
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search student by name or ID..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center space-x-1 text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs"
          >
            <option value="All">All Students</option>
            <option value="Present">Present Only</option>
            <option value="Absent">Absent Only</option>
            <option value="Late">Late Only</option>
            <option value="Excused">Excused Only</option>
          </select>

          {/* Group Filter */}
          <select
            value={groupFilter}
            onChange={e => setGroupFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-purple-200 bg-purple-50/50 text-purple-800 text-xs font-semibold focus:outline-none"
          >
            <option value="All">All Groups (1-7)</option>
            {['Group 1', 'Group 2', 'Group 3', 'Group 4', 'Group 5', 'Group 6', 'Group 7'].map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <span className="text-slate-400 font-medium ml-2">
            {filteredStudents.length} Students Listed
          </span>
        </div>
      </div>

      {/* ATTENDANCE MARKING TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Student ID & Name</th>
                <th className="py-3.5 px-4">Batch</th>
                <th className="py-3.5 px-4">{canEditAttendance ? 'Mark Attendance for Session' : 'Official Attendance Status'}</th>
                <th className="py-3.5 px-4 text-center">Cumulative %</th>
                <th className="py-3.5 px-4">Risk Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No students match the current filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const currentStatus = attendanceMap.get(student.id) || 'Absent';
                  const stat = studentStats.find(s => s.student.id === student.id);
                  const attendancePct = stat ? stat.attendancePercentage : 100;
                  const risk = stat ? stat.status : 'On Track';

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Student Info */}
                      <td
                        className="py-3.5 px-4 cursor-pointer"
                        onClick={() => openStudentProfile(student.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                            {student.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
                              {student.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {student.id} • {student.currentLevel.split(' ')[0]}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Batch & Group */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        <div className="text-xs text-slate-700">{student.batch}</div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200">
                          {student.group || 'Group 1'}
                        </span>
                      </td>

                      {/* Interactive Segmented Control or Read-Only Status */}
                      <td className="py-3.5 px-4">
                        {canEditAttendance ? (
                          <div className="flex items-center justify-center space-x-1 bg-slate-100/90 p-1 rounded-xl max-w-xs mx-auto border border-slate-200">
                            {/* Present Button */}
                            <button
                              type="button"
                              onClick={() => {
                                soundFx.playPop();
                                if (activeSession) markAttendance(activeSession.id, student.id, 'Present');
                              }}
                              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all ${
                                currentStatus === 'Present'
                                  ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-500'
                                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                              }`}
                            >
                              Present
                            </button>

                            {/* Absent Button */}
                            <button
                              type="button"
                              onClick={() => {
                                soundFx.playPop();
                                if (activeSession) markAttendance(activeSession.id, student.id, 'Absent');
                              }}
                              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all ${
                                currentStatus === 'Absent'
                                  ? 'bg-rose-600 text-white shadow-sm ring-1 ring-rose-500'
                                  : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50'
                              }`}
                            >
                              Absent
                            </button>

                            {/* Late Button */}
                            <button
                              type="button"
                              onClick={() => {
                                soundFx.playPop();
                                if (activeSession) markAttendance(activeSession.id, student.id, 'Late');
                              }}
                              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all ${
                                currentStatus === 'Late'
                                  ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-500'
                                  : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50'
                              }`}
                            >
                              Late
                            </button>

                            {/* Excused Button */}
                            <button
                              type="button"
                              onClick={() => {
                                soundFx.playPop();
                                if (activeSession) markAttendance(activeSession.id, student.id, 'Excused');
                              }}
                              className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all ${
                                currentStatus === 'Excused'
                                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-500'
                                  : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
                              }`}
                            >
                              Excused
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${
                              currentStatus === 'Present'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : currentStatus === 'Absent'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : currentStatus === 'Late'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}>
                              <span className={`w-2 h-2 rounded-full ${
                                currentStatus === 'Present' ? 'bg-emerald-500' :
                                currentStatus === 'Absent' ? 'bg-rose-500' :
                                currentStatus === 'Late' ? 'bg-amber-500' :
                                'bg-blue-500'
                              }`} />
                              <span>{currentStatus}</span>
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Cumulative % (Instantly calculated!) */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`font-black text-sm ${
                            attendancePct >= 85
                              ? 'text-emerald-600'
                              : attendancePct >= 70
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {attendancePct}%
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          {stat?.attendedSessions}/{stat?.totalApplicableSessions} sessions
                        </span>
                      </td>

                      {/* Risk Status */}
                      <td className="py-3.5 px-4">
                        <RiskBadge status={risk} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BULK ATTENDANCE UPLOAD MODAL */}
      <BulkAttendanceUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        defaultSessionId={activeSession?.id}
      />
    </div>
  );
};
