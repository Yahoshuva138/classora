import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  Award,
  FileText,
  CheckCircle2,
  Calendar,
  Sparkles,
  Download
} from 'lucide-react';
import { Student, StudentCalculatedStats } from '../../types';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useApp } from '../../context/AppContext';

interface PrintableStudentDocumentProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  stats: StudentCalculatedStats;
  defaultView?: 'transcript' | 'certificate';
}

export const PrintableStudentDocument: React.FC<PrintableStudentDocumentProps> = ({
  isOpen,
  onClose,
  student,
  stats,
  defaultView = 'transcript'
}) => {
  useBodyScrollLock(isOpen);
  const { activeTeacher } = useApp();
  const [docType, setDocType] = useState<'transcript' | 'certificate'>(defaultView);

  useEffect(() => {
    setDocType(defaultView);
  }, [defaultView]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isEligibleForMerit = stats.attendancePercentage >= 85 || stats.overallScore >= 85;
  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-12 flex items-center justify-center print:p-0 print:m-0 print:block print:overflow-visible">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity print:hidden"
        onClick={onClose}
      />

      {/* Main Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all z-10 flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Top Interactive Controls (Hidden during print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setDocType('transcript')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  docType === 'transcript'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Academic Transcript
              </button>
              <button
                type="button"
                onClick={() => setDocType('certificate')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  docType === 'certificate'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" /> Certificate of Merit
                {isEligibleForMerit && (
                  <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Content View */}
        <div className="p-6 sm:p-10 overflow-y-auto print:p-8 print:overflow-visible flex-1 bg-slate-50">
          {docType === 'transcript' ? (
            /* =========================================================
               1. OFFICIAL ACADEMIC TRANSCRIPT
               ========================================================= */
            <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-2xl border border-slate-300 shadow-sm print:shadow-none print:border-none print:p-0">
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-6 text-center space-y-1">
                <p className="text-xs font-bold tracking-widest text-indigo-900 uppercase">
                  School of Science and Technology • SST 2026 Cohort
                </p>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  OFFICIAL STUDENT PERFORMANCE TRANSCRIPT
                </h1>
                <p className="text-sm font-semibold text-slate-600">
                  Course: English Language &amp; Communication Skills (ENG-101 / Term 1)
                </p>
                <p className="text-xs text-slate-400">Classora Academic Records OS</p>
              </div>

              {/* Student Metadata Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Student Name</span>
                  <span className="font-bold text-slate-900 text-sm">{student.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Student ID</span>
                  <span className="font-mono font-bold text-slate-800">{student.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Discussion Team</span>
                  <span className="font-bold text-indigo-700">{student.group || 'Group 1'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">CEFR Level</span>
                  <span className="font-bold text-emerald-700">{student.currentLevel}</span>
                </div>
              </div>

              {/* Attendance Statistics */}
              <div className="my-6 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5">
                  1. Attendance &amp; Punctuality Audit
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <span className="text-slate-500 block">Total Sessions</span>
                    <span className="text-lg font-bold text-slate-900 font-mono">
                      {stats.totalApplicableSessions}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <span className="text-slate-500 block">Attended (Pres/Exc)</span>
                    <span className="text-lg font-bold text-emerald-700 font-mono">
                      {stats.attendedSessions}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <span className="text-slate-500 block">Absent Sessions</span>
                    <span className="text-lg font-bold text-rose-700 font-mono">
                      {stats.absentCount}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-indigo-200 bg-indigo-50/50">
                    <span className="text-indigo-900 font-bold block">Attendance %</span>
                    <span className="text-xl font-extrabold text-indigo-900 font-mono">
                      {stats.attendancePercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills Rubric Breakdown */}
              <div className="my-6 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5">
                  2. Linguistic Competencies &amp; Skill Rubric
                </h3>
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 text-left">
                      <th className="p-2.5 font-bold">Assessment Domain</th>
                      <th className="p-2.5 font-bold text-center">Score (/100)</th>
                      <th className="p-2.5 font-bold">Proficiency Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { name: 'Spoken Communication & Articulation', score: student.skills?.communication ?? 80 },
                      { name: 'Applied Syntax & Grammar', score: student.skills?.grammar ?? 80 },
                      { name: 'Lexical Range & Vocabulary', score: student.skills?.vocabulary ?? 80 },
                      { name: 'Phonetics & Pronunciation', score: student.skills?.pronunciation ?? 80 },
                      { name: 'Classroom & Discussion Participation', score: student.skills?.participation ?? 85 },
                      { name: 'Written Assignments & Extension Tasks', score: student.skills?.assignments ?? 82 },
                      { name: 'Formative & Summative Assessments', score: student.skills?.assessments ?? 84 }
                    ].map(skill => (
                      <tr key={skill.name}>
                        <td className="p-2.5 font-medium text-slate-800">{skill.name}</td>
                        <td className="p-2.5 font-bold font-mono text-center text-slate-900">{skill.score}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            skill.score >= 85 ? 'bg-emerald-100 text-emerald-800' :
                            skill.score >= 70 ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {skill.score >= 85 ? 'Distinction' : skill.score >= 70 ? 'Proficient' : 'Developing'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-900 bg-slate-50 font-bold text-slate-900">
                      <td className="p-2.5">Composite Course Score</td>
                      <td className="p-2.5 text-center font-mono text-base">{stats.overallScore.toFixed(1)} / 100</td>
                      <td className="p-2.5 text-indigo-700">{stats.status}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Faculty Remarks & Verification */}
              <div className="my-8 pt-4 border-t border-slate-200">
                <p className="text-xs font-bold text-slate-700 mb-1">Faculty Remarks:</p>
                <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                  &ldquo;{student.initialRemarks || 'Active engagement demonstrated throughout English Language modules with commendable collaborative teamwork in assigned discussion group.'}&rdquo;
                </p>
              </div>

              {/* Dual Signatures */}
              <div className="mt-12 pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="font-serif italic text-base text-slate-800 mb-1">{activeTeacher.name}</div>
                  <div className="border-t border-slate-400 pt-1 font-bold text-slate-900">
                    {activeTeacher.name}
                  </div>
                  <div className="text-slate-500 text-[11px]">{activeTeacher.designation}</div>
                </div>
                <div>
                  <div className="font-serif italic text-base text-slate-800 mb-1">Aarav Sharma</div>
                  <div className="border-t border-slate-400 pt-1 font-bold text-slate-900">
                    Aarav Sharma
                  </div>
                  <div className="text-slate-500 text-[11px]">Class Representative (English CR)</div>
                </div>
              </div>

              <div className="mt-8 text-center text-[10px] text-slate-400">
                Issued on {issueDate} • Verified via Classora Academic Platform • Authenticated SST 2026
              </div>
            </div>
          ) : (
            /* =========================================================
               2. CERTIFICATE OF MERIT & DISTINCTION
               ========================================================= */
            <div className="max-w-3xl mx-auto bg-[#FCFBF7] p-8 sm:p-14 rounded-3xl border-8 border-double border-amber-600/60 shadow-lg text-center relative overflow-hidden print:shadow-none print:border-8 print:border-amber-700">
              {/* Corner Ornaments */}
              <div className="absolute top-3 left-3 text-amber-600/40 text-2xl font-serif">✦</div>
              <div className="absolute top-3 right-3 text-amber-600/40 text-2xl font-serif">✦</div>
              <div className="absolute bottom-3 left-3 text-amber-600/40 text-2xl font-serif">✦</div>
              <div className="absolute bottom-3 right-3 text-amber-600/40 text-2xl font-serif">✦</div>

              <div className="space-y-6">
                {/* Institution Banner */}
                <div className="space-y-1">
                  <p className="text-xs font-bold tracking-[0.25em] text-amber-800 uppercase font-serif">
                    School of Science and Technology • SST 2026
                  </p>
                  <p className="text-xs tracking-wider text-slate-500 uppercase">
                    Department of Humanities &amp; Communication Studies
                  </p>
                </div>

                {/* Certificate Medal Icon */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 text-white flex items-center justify-center shadow-md ring-4 ring-amber-100">
                    <Award className="w-8 h-8" />
                  </div>
                </div>

                {/* Main Heading */}
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight">
                    CERTIFICATE OF MERIT
                  </h1>
                  <p className="text-xs tracking-widest uppercase font-bold text-amber-700">
                    FOR ACADEMIC EXCELLENCE &amp; EXEMPLARY ATTENDANCE
                  </p>
                </div>

                {/* Body Text */}
                <div className="max-w-xl mx-auto space-y-3 text-sm text-slate-700 leading-relaxed font-serif">
                  <p className="italic text-slate-500">This honor is proudly conferred upon</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-wide border-b-2 border-amber-600/30 pb-2 inline-block px-8">
                    {student.name}
                  </p>
                  <p className="text-xs font-mono text-slate-600">
                    Student Roll ID: <span className="font-bold">{student.id}</span> • Discussion Team:{' '}
                    <span className="font-bold">{student.group || 'Group 1'}</span>
                  </p>
                  <p className="pt-2 text-slate-700">
                    In recognition of outstanding dedication, scholarly engagement, and continuous punctuality in{' '}
                    <span className="font-bold text-slate-900">
                      English Language &amp; Communication Skills
                    </span>
                    , achieving a cumulative attendance record of{' '}
                    <span className="font-bold text-emerald-800 font-mono">
                      {stats.attendancePercentage.toFixed(1)}%
                    </span>{' '}
                    and an overall proficiency score of{' '}
                    <span className="font-bold text-emerald-800 font-mono">
                      {stats.overallScore.toFixed(1)} / 100
                    </span>
                    .
                  </p>
                </div>

                {/* Signatures & Seal */}
                <div className="mt-12 pt-8 border-t border-amber-200/80 grid grid-cols-2 gap-8 text-center text-xs">
                  <div>
                    <div className="font-serif italic text-base text-slate-800 mb-1">{activeTeacher.name}</div>
                    <div className="border-t border-slate-400/60 pt-1 font-bold text-slate-900">
                      {activeTeacher.name}
                    </div>
                    <div className="text-slate-500 text-[11px]">{activeTeacher.designation}</div>
                  </div>
                  <div>
                    <div className="font-serif italic text-base text-slate-800 mb-1">Aarav Sharma</div>
                    <div className="border-t border-slate-400/60 pt-1 font-bold text-slate-900">
                      Aarav Sharma
                    </div>
                    <div className="text-slate-500 text-[11px]">Class Representative (English CR)</div>
                  </div>
                </div>

                <div className="text-[10px] text-amber-800/60 tracking-wider uppercase font-medium">
                  Official Academic Award • Validated by Classora OS • Issued {issueDate}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
