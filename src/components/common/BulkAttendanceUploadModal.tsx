import React, { useState, useRef, useMemo } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Download,
  X,
  Search,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useApp } from '../../context/AppContext';
import { Student, AttendanceStatus } from '../../types';
import { downloadCSV, generateBulkAttendanceTemplateCSV } from '../../utils/exportUtils';
import { soundFx } from '../../utils/soundEffects';
import { fireGrandCelebration, fireQuickConfetti } from '../../utils/confettiUtils';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';

interface BulkAttendanceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSessionId?: string;
}

interface ParsedStudentRow {
  rawRowIndex: number;
  rollNo: string;
  name: string;
  email: string;
  status: AttendanceStatus;
  remarks: string;
  matchedStudent: Student | null;
  matchConfidence: 'Exact' | 'Email' | 'Name' | 'Unmatched';
}

export const BulkAttendanceUploadModal: React.FC<BulkAttendanceUploadModalProps> = ({
  isOpen,
  onClose,
  defaultSessionId
}) => {
  const { students, sessions, bulkMarkAttendance } = useApp();
  const { addToast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    defaultSessionId || sessions[0]?.id || 'SES-102'
  );
  const [isMultiSessionFile, setIsMultiSessionFile] = useState<boolean>(false);
  const [selectedColumnKey, setSelectedColumnKey] = useState<string>('');
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [fileRawData, setFileRawData] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [sheetName, setSheetName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [parsedRows, setParsedRows] = useState<ParsedStudentRow[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const targetSession = useMemo(() => {
    return sessions.find(s => s.id === selectedSessionId) || sessions[0];
  }, [sessions, selectedSessionId]);

  // Clean state when closed
  const handleClose = () => {
    setFileName('');
    setFileSize('');
    setSheetName('');
    setFileRawData([]);
    setAvailableColumns([]);
    setParsedRows([]);
    setSearchQuery('');
    onClose();
  };

  // Helper to parse string to AttendanceStatus
  const normalizeStatus = (raw: any): AttendanceStatus => {
    if (!raw) return 'Absent';
    const s = String(raw).trim().toUpperCase();
    if (s === 'P' || s === 'PRESENT' || s === '1' || s === 'YES' || s === 'Y') return 'Present';
    if (s === 'A' || s === 'ABSENT' || s === '0' || s === 'NO' || s === 'N') return 'Absent';
    if (s === 'L' || s === 'LATE' || s === 'TARDY') return 'Late';
    if (s === 'E' || s === 'EXCUSED' || s === 'LEAVE' || s === 'MEDICAL' || s === 'EXCUSE') return 'Excused';
    return 'Present';
  };

  // Process rows with given column mapping
  const processRows = (rawRows: any[], statusCol: string) => {
    const activeStudents = students.filter(s => !s.isArchived);

    const results: ParsedStudentRow[] = rawRows.map((row, index) => {
      // Find Student Identifier
      let rollNo = '';
      let name = '';
      let email = '';
      let status: AttendanceStatus = 'Present';
      let remarks = '';

      const keys = Object.keys(row);

      // 1. Match Roll No column
      for (const k of keys) {
        const lk = k.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (lk.includes('rollno') || lk === 'roll' || lk.includes('studentid') || lk.includes('regno') || lk === 'id') {
          rollNo = String(row[k] || '').trim().toLowerCase();
          break;
        }
      }

      // 2. Match Name column
      for (const k of keys) {
        const lk = k.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (lk.includes('studentname') || lk === 'name' || lk.includes('fullname')) {
          name = String(row[k] || '').trim();
          break;
        }
      }

      // 3. Match Email column
      for (const k of keys) {
        const lk = k.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (lk.includes('email') || lk === 'mail') {
          email = String(row[k] || '').trim().toLowerCase();
          break;
        }
      }

      // 4. Match Remarks column
      for (const k of keys) {
        const lk = k.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (lk.includes('remark') || lk.includes('note') || lk.includes('comment')) {
          remarks = String(row[k] || '').trim();
          break;
        }
      }

      // 5. Match Status
      if (statusCol && row[statusCol] !== undefined) {
        status = normalizeStatus(row[statusCol]);
      } else {
        // Fallback: look for generic status column
        for (const k of keys) {
          const lk = k.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (lk.includes('status') || lk.includes('attendance') || lk === 'mark') {
            status = normalizeStatus(row[k]);
            break;
          }
        }
      }

      // Match against official cohort roster
      let matchedStudent: Student | null = null;
      let matchConfidence: 'Exact' | 'Email' | 'Name' | 'Unmatched' = 'Unmatched';

      if (rollNo) {
        matchedStudent = activeStudents.find(s => s.id.toLowerCase() === rollNo || s.rollNo?.toLowerCase() === rollNo) || null;
        if (matchedStudent) matchConfidence = 'Exact';
      }

      if (!matchedStudent && email) {
        matchedStudent = activeStudents.find(s => s.email.toLowerCase() === email) || null;
        if (matchedStudent) matchConfidence = 'Email';
      }

      if (!matchedStudent && name) {
        const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
        matchedStudent = activeStudents.find(s => {
          const sClean = s.name.toLowerCase().replace(/[^a-z]/g, '');
          return sClean === cleanName || sClean.includes(cleanName) || cleanName.includes(sClean);
        }) || null;
        if (matchedStudent) matchConfidence = 'Name';
      }

      return {
        rawRowIndex: index + 1,
        rollNo: matchedStudent ? matchedStudent.id : (rollNo || 'N/A'),
        name: matchedStudent ? matchedStudent.name : (name || 'Unknown Student'),
        email: matchedStudent ? matchedStudent.email : (email || '—'),
        status,
        remarks,
        matchedStudent,
        matchConfidence
      };
    });

    setParsedRows(results);
  };

  // Handle uploaded file
  const handleFile = (file: File) => {
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'xlsx' && ext !== 'xls' && ext !== 'csv') {
      addToast('Please upload a valid Excel (.xlsx, .xls) or CSV (.csv) file.', 'error');
      return;
    }

    setIsProcessing(true);
    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + ' KB');

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        setSheetName(firstSheetName);

        const worksheet = workbook.Sheets[firstSheetName];
        const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (rows.length === 0) {
          addToast('The uploaded sheet contains no data rows.', 'warning');
          setIsProcessing(false);
          return;
        }

        setFileRawData(rows);
        const cols = Object.keys(rows[0] || {});
        setAvailableColumns(cols);

        // Detect if multi-session
        const sessionLikeCols = cols.filter(c => {
          const lc = c.toLowerCase();
          return sessions.some(s => lc.includes(s.topic.toLowerCase().slice(0, 8)) || lc.includes(s.id.toLowerCase()));
        });

        if (sessionLikeCols.length >= 2) {
          setIsMultiSessionFile(true);
          // Try to match current active session
          const matchedCol = sessionLikeCols.find(c => {
            const lc = c.toLowerCase();
            return lc.includes(targetSession.topic.toLowerCase().slice(0, 8)) || lc.includes(targetSession.id.toLowerCase());
          }) || sessionLikeCols[0];
          setSelectedColumnKey(matchedCol);
          processRows(rows, matchedCol);
        } else {
          setIsMultiSessionFile(false);
          // Find standard status column or pick last
          const statusCol = cols.find(c => {
            const lc = c.toLowerCase();
            return lc.includes('status') || lc.includes('attendance') || lc.includes('mark');
          }) || cols[cols.length - 1];
          setSelectedColumnKey(statusCol);
          processRows(rows, statusCol);
        }

        soundFx.playSuccess();
        addToast(`Parsed ${rows.length} rows from ${file.name}`, 'success');
      } catch (err: any) {
        console.error('Failed to parse spreadsheet:', err);
        addToast('Error parsing file: ' + (err.message || 'Corrupt spreadsheet'), 'error');
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      addToast('Failed to read file from disk.', 'error');
      setIsProcessing(false);
    };

    reader.readAsArrayBuffer(file);
  };

  // Change status column mapping
  const handleColumnChange = (newCol: string) => {
    setSelectedColumnKey(newCol);
    if (fileRawData.length > 0) {
      processRows(fileRawData, newCol);
    }
  };

  // Inline status toggle for a row
  const handleRowStatusChange = (index: number, newStatus: AttendanceStatus) => {
    setParsedRows(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], status: newStatus };
      return updated;
    });
  };

  // Summary counts
  const summary = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;
    let matched = 0;
    let unmatched = 0;

    parsedRows.forEach(r => {
      if (r.matchedStudent) matched++;
      else unmatched++;

      if (r.status === 'Present') present++;
      else if (r.status === 'Absent') absent++;
      else if (r.status === 'Late') late++;
      else if (r.status === 'Excused') excused++;
    });

    const total = parsedRows.length;
    const matchRate = total > 0 ? Math.round((matched / total) * 100) : 0;
    return { present, absent, late, excused, matched, unmatched, total, matchRate };
  }, [parsedRows]);

  // Filtered rows for preview table
  const filteredRows = useMemo(() => {
    return parsedRows.filter(r => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.rollNo.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'All' ||
        r.status === statusFilter ||
        (statusFilter === 'Unmatched' && !r.matchedStudent);

      return matchesSearch && matchesStatus;
    });
  }, [parsedRows, searchQuery, statusFilter]);

  // Commit attendance to store
  const handleApplyAttendance = () => {
    if (!targetSession) return;
    if (parsedRows.length === 0) {
      addToast('No attendance rows to submit.', 'warning');
      return;
    }

    const matchedRecords = parsedRows
      .filter(r => r.matchedStudent)
      .map(r => ({
        studentId: r.matchedStudent!.id,
        status: r.status
      }));

    if (matchedRecords.length === 0) {
      addToast('None of the rows matched students in the 44-student cohort.', 'error');
      return;
    }

    bulkMarkAttendance(targetSession.id, matchedRecords);
    soundFx.playFanfare();
    fireGrandCelebration();
    addToast(
      `Successfully marked attendance for ${matchedRecords.length} students in "${targetSession.topic}"!`,
      'success'
    );
    handleClose();
  };

  // Download pre-filled template
  const handleDownloadTemplate = () => {
    soundFx.playPop();
    fireQuickConfetti();
    const csv = generateBulkAttendanceTemplateCSV(students, targetSession?.topic || 'SST English Course');
    const safeTopic = (targetSession?.topic || 'Session').replace(/[^a-zA-Z0-9]/g, '_');
    downloadCSV(`Classora_Attendance_Template_${targetSession?.id || 'SES'}_${safeTopic}.csv`, csv);
    addToast('Official 44-student template downloaded!', 'success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Box */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-left">
        <div className="relative transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all w-full max-w-4xl border border-slate-200 my-6 flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  Upload Bulk Attendance Sheet
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    Excel & CSV
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Import official attendance marks, auto-match against 44 cohort students, and commit in one click
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Top Bar: Target Session & Template Download */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Target Session Selector */}
              <div className="md:col-span-2 bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Target Curriculum Session
                </label>
                <select
                  value={selectedSessionId}
                  onChange={(e) => setSelectedSessionId(e.target.value)}
                  className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs"
                >
                  {sessions.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.id}: {s.topic} ({formatDate(s.date)} • {s.status})
                    </option>
                  ))}
                </select>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                  <span>Faculty: <strong className="text-slate-800">{targetSession?.faculty}</strong></span>
                  <span>•</span>
                  <span>Batch: <strong className="text-slate-800">{targetSession?.batch}</strong></span>
                </div>
              </div>

              {/* Template Generator Card */}
              <div className="bg-gradient-to-br from-indigo-50/80 to-blue-50/40 rounded-2xl p-4 border border-indigo-100 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 block">
                    Fast Track
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-0.5">Cohort Template</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Pre-filled with all 44 official students</p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="mt-3 w-full py-2 px-3 rounded-xl bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Download Template (.csv)
                </button>
              </div>
            </div>

            {/* File Dropzone Area */}
            {!fileName ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFile(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/60 scale-[0.99]'
                    : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFile(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-14 h-14 rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <FileSpreadsheet className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  Click to browse or drop attendance sheet here
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Supports Microsoft Excel (<code className="bg-slate-200/80 px-1 py-0.5 rounded text-[10px]">.xlsx</code>, <code className="bg-slate-200/80 px-1 py-0.5 rounded text-[10px]">.xls</code>) and CSV (<code className="bg-slate-200/80 px-1 py-0.5 rounded text-[10px]">.csv</code>)
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-400">
                  <span>Auto-detects Roll Numbers</span>
                  <span>•</span>
                  <span>Recognizes P/A/L/E</span>
                  <span>•</span>
                  <span>Multi-column compatible</span>
                </div>
              </div>
            ) : (
              /* File Loaded Status Bar */
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm">{fileName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-800">
                        {fileSize}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Sheet: <span className="font-semibold">{sheetName}</span> • {fileRawData.length} records parsed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFileName('');
                      setFileRawData([]);
                      setParsedRows([]);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Replace File
                  </button>
                </div>
              </div>
            )}

            {/* Column Selector for Multi-Session Spreadsheets */}
            {fileName && availableColumns.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Attendance Column to Import
                    </label>
                    {isMultiSessionFile && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                        Multi-Session File
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Select which column in your file contains the attendance marks (P/A/L/E)
                  </p>
                </div>
                <div className="w-full md:w-72">
                  <select
                    value={selectedColumnKey}
                    onChange={(e) => handleColumnChange(e.target.value)}
                    className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {availableColumns.map(col => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Summary Statistics Chips */}
            {parsedRows.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                  <div className="bg-slate-100/80 rounded-xl p-2.5 border border-slate-200/80 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Total In Sheet</span>
                    <span className="text-base font-black text-slate-900">{summary.total}</span>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-2.5 border border-blue-200 text-center">
                    <span className="text-[10px] uppercase font-bold text-blue-600 block">Cohort Matched</span>
                    <span className="text-base font-black text-blue-700">{summary.matched} / 44</span>
                  </div>

                  <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-200 text-center">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 block">Present (P)</span>
                    <span className="text-base font-black text-emerald-700">{summary.present}</span>
                  </div>

                  <div className="bg-rose-50 rounded-xl p-2.5 border border-rose-200 text-center">
                    <span className="text-[10px] uppercase font-bold text-rose-600 block">Absent (A)</span>
                    <span className="text-base font-black text-rose-700">{summary.absent}</span>
                  </div>

                  <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-200 text-center">
                    <span className="text-[10px] uppercase font-bold text-amber-600 block">Late (L)</span>
                    <span className="text-base font-black text-amber-700">{summary.late}</span>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-2.5 border border-purple-200 text-center">
                    <span className="text-[10px] uppercase font-bold text-purple-600 block">Excused (E)</span>
                    <span className="text-base font-black text-purple-700">{summary.excused}</span>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search preview by name or roll no..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">Status Filter:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold"
                    >
                      <option value="All">All ({summary.total})</option>
                      <option value="Present">Present ({summary.present})</option>
                      <option value="Absent">Absent ({summary.absent})</option>
                      <option value="Late">Late ({summary.late})</option>
                      <option value="Excused">Excused ({summary.excused})</option>
                      {summary.unmatched > 0 && (
                        <option value="Unmatched">⚠️ Unmatched ({summary.unmatched})</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Preview Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs max-h-64 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 sticky top-0 z-10">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Student Name</th>
                        <th className="py-2.5 px-3">Roll No</th>
                        <th className="py-2.5 px-3 text-center">Match Status</th>
                        <th className="py-2.5 px-3 text-center">Attendance Mark</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredRows.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-400">
                            No students match current filter.
                          </td>
                        </tr>
                      ) : (
                        filteredRows.map((row, idx) => {
                          const isMatched = !!row.matchedStudent;

                          return (
                            <tr key={idx} className={`hover:bg-slate-50/70 transition-colors ${!isMatched ? 'bg-amber-50/40' : ''}`}>
                              <td className="py-2 px-3 text-slate-400 font-mono text-[11px]">
                                {row.rawRowIndex}
                              </td>
                              <td className="py-2 px-3 font-semibold text-slate-900">
                                {row.name}
                                {row.email && row.email !== '—' && (
                                  <span className="block text-[10px] text-slate-400 font-normal">{row.email}</span>
                                )}
                              </td>
                              <td className="py-2 px-3 font-mono font-bold text-slate-700 text-[11px]">
                                {row.rollNo}
                              </td>
                              <td className="py-2 px-3 text-center">
                                {isMatched ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3" /> Matched ({row.matchConfidence})
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                                    <AlertTriangle className="w-3 h-3" /> Not in Roster
                                  </span>
                                )}
                              </td>
                              <td className="py-2 px-3 text-center">
                                <select
                                  value={row.status}
                                  onChange={(e) => handleRowStatusChange(row.rawRowIndex - 1, e.target.value as AttendanceStatus)}
                                  className={`text-xs font-bold rounded-lg px-2 py-1 border transition-colors cursor-pointer ${
                                    row.status === 'Present'
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                      : row.status === 'Absent'
                                      ? 'bg-rose-50 text-rose-800 border-rose-300'
                                      : row.status === 'Late'
                                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                                      : 'bg-purple-50 text-purple-800 border-purple-300'
                                  }`}
                                >
                                  <option value="Present">Present</option>
                                  <option value="Absent">Absent</option>
                                  <option value="Late">Late</option>
                                  <option value="Excused">Excused</option>
                                </select>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-100 px-6 py-4 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-slate-500">
              {summary.matched > 0 && (
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Ready to record attendance for {summary.matched} students
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={summary.matched === 0 || isProcessing}
                onClick={handleApplyAttendance}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm flex items-center gap-1.5 ${
                  summary.matched > 0 && !isProcessing
                    ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 cursor-pointer shadow-blue-500/25'
                    : 'bg-slate-300 cursor-not-allowed opacity-60'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Apply Attendance ({summary.matched} Students)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
