import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Users,
  FileText,
  Clock,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../common/StatusBadge';
import {
  generateAttendanceCSV,
  generatePerformanceCSV,
  generateAtRiskCSV,
  generateFollowUpsCSV,
  downloadCSV,
  exportFullAttendanceMatrixCSV,
  exportGradebookCSV
} from '../../utils/exportUtils';
import { formatDate } from '../../utils/formatters';
import { PrintableStudentDocument } from '../common/PrintableStudentDocument';
import { StudentCalculatedStats } from '../../types';

export const ReportsScreen: React.FC = () => {
  const { students, studentStats, sessions, attendanceRecords, followUps, openStudentProfile } = useApp();
  const [activeReportTab, setActiveReportTab] = useState<'attendance' | 'performance' | 'at-risk' | 'sessions' | 'follow-ups'>('attendance');

  // Printable Document Modal State
  const [selectedStudentForDoc, setSelectedStudentForDoc] = useState<StudentCalculatedStats | null>(null);
  const [docModalView, setDocModalView] = useState<'transcript' | 'certificate'>('transcript');

  const todayStr = new Date().toISOString().split('T')[0];

  const atRiskStudents = studentStats.filter(s => s.status === 'At Risk' || s.status === 'Needs Attention');

  const handleExportCSV = () => {
    if (activeReportTab === 'attendance') {
      const csv = generateAttendanceCSV(studentStats);
      downloadCSV(`English_CR_Attendance_Report_${todayStr}.csv`, csv);
    } else if (activeReportTab === 'performance') {
      const csv = generatePerformanceCSV(studentStats);
      downloadCSV(`English_CR_Performance_Report_${todayStr}.csv`, csv);
    } else if (activeReportTab === 'at-risk') {
      const csv = generateAtRiskCSV(atRiskStudents);
      downloadCSV(`English_CR_At_Risk_Students_${todayStr}.csv`, csv);
    } else if (activeReportTab === 'follow-ups') {
      const csv = generateFollowUpsCSV(followUps);
      downloadCSV(`English_CR_Follow_Ups_Report_${todayStr}.csv`, csv);
    } else {
      const csv = generateAttendanceCSV(studentStats);
      downloadCSV(`English_CR_Report_${todayStr}.csv`, csv);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Export Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              CR Executive Reports & Data Exports
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Generate printable rosters, CSV exports for HOD submission, and intervention audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => exportFullAttendanceMatrixCSV(students, sessions, attendanceRecords)}
            className="px-3.5 py-2 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            title="Download full 44-student x 12-session matrix"
          >
            <Download className="w-4 h-4 text-purple-600" /> Export Full Attendance Matrix (.CSV)
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Print / PDF View
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-blue-600/20"
          >
            <Download className="w-4 h-4" /> Export Active Report (.CSV)
          </button>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { id: 'attendance', label: 'Attendance Report' },
          { id: 'performance', label: 'Performance Report' },
          { id: 'at-risk', label: `At-Risk & Low Attendance (${atRiskStudents.length})` },
          { id: 'sessions', label: `Session Analytics (${sessions.length})` },
          { id: 'follow-ups', label: `Follow-up Audit (${followUps.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveReportTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeReportTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* REPORT CONTENT AREA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        {/* ATTENDANCE REPORT TABLE */}
        {activeReportTab === 'attendance' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Student ID & Name</th>
                  <th className="py-3.5 px-4">Batch</th>
                  <th className="py-3.5 px-4">Attendance %</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Attended / Total</th>
                  <th className="py-3.5 px-4">Present</th>
                  <th className="py-3.5 px-4">Late</th>
                  <th className="py-3.5 px-4">Absent</th>
                  <th className="py-3.5 px-4">Excused</th>
                  <th className="py-3.5 px-4 text-right">Official Document</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentStats.map(s => (
                  <tr
                    key={s.student.id}
                    onClick={() => openStudentProfile(s.student.id)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {s.student.name}
                      <span className="block text-[11px] text-slate-400 font-normal">
                        {s.student.id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{s.student.batch}</td>
                    <td className="py-3.5 px-4 font-black text-sm text-slate-900">
                      {s.attendancePercentage}%
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge status={s.status} />
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {s.attendedSessions} / {s.totalApplicableSessions}
                    </td>
                    <td className="py-3.5 px-4 text-emerald-600 font-bold">{s.presentCount}</td>
                    <td className="py-3.5 px-4 text-amber-600 font-bold">{s.lateCount}</td>
                    <td className="py-3.5 px-4 text-rose-600 font-bold">{s.absentCount}</td>
                    <td className="py-3.5 px-4 text-blue-600 font-medium">{s.excusedCount}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudentForDoc(s);
                          setDocModalView(s.attendancePercentage >= 85 ? 'certificate' : 'transcript');
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1 border transition-colors ${
                          s.attendancePercentage >= 85
                            ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                            : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                        }`}
                        title="Print Transcript or Certificate"
                      >
                        {s.attendancePercentage >= 85 ? (
                          <>
                            <Award className="w-3.5 h-3.5 text-amber-600" />
                            <span>Merit</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span>Transcript</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PERFORMANCE REPORT TABLE */}
        {activeReportTab === 'performance' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Batch</th>
                  <th className="py-3.5 px-4">Overall Score</th>
                  <th className="py-3.5 px-4">Improvement</th>
                  <th className="py-3.5 px-4">Comm.</th>
                  <th className="py-3.5 px-4">Grammar</th>
                  <th className="py-3.5 px-4">Vocab</th>
                  <th className="py-3.5 px-4">Pronunc.</th>
                  <th className="py-3.5 px-4">Particip.</th>
                  <th className="py-3.5 px-4">Assignments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentStats.map(s => (
                  <tr
                    key={s.student.id}
                    onClick={() => openStudentProfile(s.student.id)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {s.student.name}
                      <span className="block text-[11px] text-slate-400 font-normal">
                        {s.student.currentLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{s.student.batch}</td>
                    <td className="py-3.5 px-4 font-black text-blue-600 text-sm">
                      {s.overallScore}/100
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-bold ${
                          s.scoreImprovement > 0
                            ? 'text-emerald-600'
                            : s.scoreImprovement < 0
                            ? 'text-rose-600'
                            : 'text-slate-400'
                        }`}
                      >
                        {s.scoreImprovement > 0 ? `+${s.scoreImprovement}` : s.scoreImprovement}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">{s.student.skills.communication}</td>
                    <td className="py-3.5 px-4">{s.student.skills.grammar}</td>
                    <td className="py-3.5 px-4">{s.student.skills.vocabulary}</td>
                    <td className="py-3.5 px-4">{s.student.skills.pronunciation}</td>
                    <td className="py-3.5 px-4">{s.student.skills.participation}</td>
                    <td className="py-3.5 px-4">{s.student.skills.assignments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* AT-RISK REPORT */}
        {activeReportTab === 'at-risk' && (
          <div className="overflow-x-auto">
            <div className="p-4 bg-rose-50/70 border-b border-rose-200 text-xs text-rose-900 flex items-center justify-between">
              <span className="font-semibold">
                Critical Intervention Roster: Students below the configured risk threshold.
              </span>
              <span className="font-bold">{atRiskStudents.length} Students Flagged</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Student ID & Name</th>
                  <th className="py-3.5 px-4">Contact Phone</th>
                  <th className="py-3.5 px-4">Batch</th>
                  <th className="py-3.5 px-4">Attendance %</th>
                  <th className="py-3.5 px-4">Missed Sessions</th>
                  <th className="py-3.5 px-4">Overall Score</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Mandated Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {atRiskStudents.map(s => (
                  <tr
                    key={s.student.id}
                    onClick={() => openStudentProfile(s.student.id)}
                    className="hover:bg-rose-50/30 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {s.student.name}
                      <span className="block text-[11px] text-slate-400 font-normal">
                        {s.student.id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {s.student.phone}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{s.student.batch}</td>
                    <td className="py-3.5 px-4 font-black text-rose-600 text-sm">
                      {s.attendancePercentage}%
                    </td>
                    <td className="py-3.5 px-4 font-bold text-rose-700">
                      {s.missedSessions} sessions
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {s.overallScore}/100
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge status={s.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-bold text-rose-800 bg-rose-100 px-2 py-1 rounded-md">
                        {s.attendancePercentage < 70
                          ? 'Urgent Parent Contact & HOD Report'
                          : 'Attendance Warning & Mentorship'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SESSION ANALYTICS */}
        {activeReportTab === 'sessions' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Session ID</th>
                  <th className="py-3.5 px-4">Topic</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Faculty</th>
                  <th className="py-3.5 px-4">Batch</th>
                  <th className="py-3.5 px-4">Mode / Location</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Attendance Recorded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sessions.map(s => {
                  const records = attendanceRecords.filter(r => r.sessionId === s.id);
                  const present = records.filter(r => r.status === 'Present' || r.status === 'Late').length;
                  const total = records.length;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-500">{s.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{s.topic}</td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {formatDate(s.date)} • {s.startTime}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">{s.faculty}</td>
                      <td className="py-3.5 px-4 text-blue-600 font-medium">{s.batch}</td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {s.mode} ({s.location})
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {total > 0 ? (
                          <span className="font-bold text-emerald-600">
                            {present} / {total} Marked ({Math.round((present / total) * 100)}%)
                          </span>
                        ) : (
                          <span className="text-slate-400">Pending</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* FOLLOW-UPS REPORT */}
        {activeReportTab === 'follow-ups' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Follow-up ID</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Issue Type</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Action Required</th>
                  <th className="py-3.5 px-4">Assigned To</th>
                  <th className="py-3.5 px-4">Deadline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {followUps.map(f => (
                  <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{f.id}</td>
                    <td
                      className="py-3.5 px-4 font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                      onClick={() => openStudentProfile(f.studentId)}
                    >
                      {f.studentName}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{f.issueType}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          f.priority === 'Urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {f.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          f.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {f.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{f.actionRequired}</td>
                    <td className="py-3.5 px-4 text-slate-500">{f.assignedTo}</td>
                    <td className="py-3.5 px-4 text-slate-500">{formatDate(f.deadline)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Official Printable Academic Document Modal */}
      {selectedStudentForDoc && (
        <PrintableStudentDocument
          isOpen={!!selectedStudentForDoc}
          onClose={() => setSelectedStudentForDoc(null)}
          student={selectedStudentForDoc.student}
          stats={selectedStudentForDoc}
          defaultView={docModalView}
        />
      )}
    </div>
  );
};
