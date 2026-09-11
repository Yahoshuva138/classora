import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Users,
  Calendar,
  AlertCircle,
  ListChecks,
  ArrowRight,
  Command,
  Compass,
  GraduationCap,
  Sparkles,
  HelpCircle,
  Settings,
  ShieldCheck,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { exportFullAttendanceMatrixCSV } from '../../utils/exportUtils';

interface SearchResultItem {
  id: string;
  type: 'command' | 'group' | 'student' | 'session' | 'followup' | 'task';
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: React.ReactNode;
  action: () => void;
}

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    students,
    sessions,
    attendanceRecords,
    followUps,
    tasks,
    setActiveTab,
    openStudentProfile,
    setSelectedSessionId,
    setUserRole,
    setIsShortcutsOpen,
    setIsOnboardingOpen,
    settings
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when modal is open
  useBodyScrollLock(isSearchOpen);

  // Focus input on open & reset selection
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isSearchOpen]);

  // Global hotkey listener: '/' or 'Cmd+K' / 'Ctrl+K' to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdK = (isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'k';
      const isSlash = e.key === '/' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA';

      if ((isCmdK || isSlash) && !isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  const trimmed = query.trim().toLowerCase();

  // 1. Navigation Commands
  const navigationCommands: SearchResultItem[] = [
    {
      id: 'cmd-dashboard',
      type: 'command',
      title: 'Go to Dashboard',
      subtitle: 'Overview of attendance, cohort metrics & daily priorities',
      icon: <Compass className="w-4 h-4 text-blue-500" />,
      action: () => { setActiveTab('dashboard'); setIsSearchOpen(false); }
    },
    {
      id: 'cmd-students',
      type: 'command',
      title: 'Go to Students Roster',
      subtitle: 'Directory of all 44 official SST 2026 students',
      icon: <Users className="w-4 h-4 text-emerald-500" />,
      action: () => { setActiveTab('students'); setIsSearchOpen(false); }
    },
    {
      id: 'cmd-sessions',
      type: 'command',
      title: 'Go to Sessions Timetable',
      subtitle: '12-lecture syllabus including SES-110 Group Discussion',
      icon: <Calendar className="w-4 h-4 text-indigo-500" />,
      action: () => { setActiveTab('sessions'); setIsSearchOpen(false); }
    },
    {
      id: 'cmd-attendance',
      type: 'command',
      title: 'Go to Attendance Register',
      subtitle: 'Mark present, absent, late, or excused with 1-click',
      icon: <ListChecks className="w-4 h-4 text-amber-500" />,
      action: () => { setActiveTab('attendance'); setIsSearchOpen(false); }
    },
    {
      id: 'cmd-groups',
      type: 'command',
      title: 'Go to Discussion Groups (Groups 1–7)',
      subtitle: 'Official Lecture 10 debate teams, assigned topics & performance',
      icon: <Users className="w-4 h-4 text-purple-500" />,
      action: () => { setActiveTab('groups'); setIsSearchOpen(false); }
    },
    {
      id: 'cmd-export-matrix',
      type: 'command',
      title: 'Export Full Attendance Matrix (.CSV)',
      subtitle: 'Download 44-student x 12-session official matrix spreadsheet',
      icon: <FileSpreadsheet className="w-4 h-4 text-emerald-500" />,
      action: () => { exportFullAttendanceMatrixCSV(students, sessions, attendanceRecords); setIsSearchOpen(false); }
    },
    {
      id: 'cmd-performance',
      type: 'command',
      title: 'Go to Performance & Cohort Analytics',
      subtitle: 'Discussion group benchmarking, attendance & skill averages',
      icon: <Sparkles className="w-4 h-4 text-purple-500" />,
      action: () => { setActiveTab('performance'); setIsSearchOpen(false); }
    },
    {
      id: 'cmd-followups',
      type: 'command',
      title: 'Go to Follow-ups Desk',
      subtitle: 'Track student attendance and academic interventions',
      icon: <AlertCircle className="w-4 h-4 text-rose-500" />,
      action: () => { setActiveTab('follow-ups'); setIsSearchOpen(false); }
    },
    {
      id: 'cmd-tasks',
      type: 'command',
      title: 'Go to CR Task Checklist',
      subtitle: 'Daily class representative checklist & responsibilities',
      icon: <ListChecks className="w-4 h-4 text-teal-500" />,
      action: () => { setActiveTab('cr-tasks'); setIsSearchOpen(false); }
    },
    {
      id: 'cmd-settings',
      type: 'command',
      title: 'Go to App Settings',
      subtitle: 'Thresholds, notification triggers, sound & batches',
      icon: <Settings className="w-4 h-4 text-slate-500" />,
      action: () => { setActiveTab('settings'); setIsSearchOpen(false); }
    },
    {
      id: 'cmd-teacher-portal',
      type: 'command',
      title: 'Switch to Faculty Portal (Dr. Priya Nair)',
      subtitle: 'Gradebook, team broadcast & academic audit trail',
      icon: <GraduationCap className="w-4 h-4 text-violet-500" />,
      action: () => { setUserRole('Teacher'); setIsSearchOpen(false); }
    },
    {
      id: 'cmd-student-portal',
      type: 'command',
      title: 'Switch to Student Portal View',
      subtitle: 'Personal attendance, discussion team & leave requests',
      icon: <Users className="w-4 h-4 text-sky-500" />,
      action: () => { setUserRole('Student'); setIsSearchOpen(false); }
    },
    {
      id: 'cmd-shortcuts',
      type: 'command',
      title: 'Open Keyboard Shortcuts (?)',
      subtitle: 'View all keyboard shortcuts and hotkeys',
      icon: <HelpCircle className="w-4 h-4 text-amber-500" />,
      action: () => { setIsShortcutsOpen(true); setIsSearchOpen(false); }
    },
    {
      id: 'cmd-tour',
      type: 'command',
      title: 'Start Classora Guided Tour',
      subtitle: 'Interactive onboarding through all portals and workflows',
      icon: <Sparkles className="w-4 h-4 text-yellow-500" />,
      action: () => { setIsOnboardingOpen(true); setIsSearchOpen(false); }
    }
  ];

  // Filter commands
  const matchingCommands = trimmed
    ? navigationCommands.filter(c =>
        (c.title || '').toLowerCase().includes(trimmed) ||
        (c.subtitle || '').toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : navigationCommands.slice(0, 4);

  // 2. Discussion Groups (Group 1 - 7)
  const officialGroups = settings.groups || [
    'Group 1', 'Group 2', 'Group 3', 'Group 4', 'Group 5', 'Group 6', 'Group 7'
  ];

  const matchingGroups: SearchResultItem[] = officialGroups
    .filter(grp => {
      if (!trimmed) return false;
      const lower = grp.toLowerCase();
      const numMatch = grp.replace(/\D/g, '');
      return (
        lower.includes(trimmed) ||
        trimmed.includes(lower) ||
        (trimmed.startsWith('g') && trimmed.includes(numMatch)) ||
        (trimmed === numMatch && trimmed.length === 1) ||
        ((trimmed.includes('group') || trimmed.includes('team') || trimmed.includes('gd') || trimmed.includes('discuss')) && trimmed.length <= 12)
      );
    })
    .map(grp => {
      const members = students.filter(s => (s.group || 'Group 1') === grp);
      const memberNames = members.slice(0, 3).map(m => m.name.split(' ')[0]).join(', ');
      return {
        id: `group-${grp}`,
        type: 'group',
        title: `${grp} — Discussion Team`,
        subtitle: `${members.length} students (${memberNames}${members.length > 3 ? '...' : ''}) • SES-110`,
        badge: `${members.length} members`,
        icon: <Layers className="w-4 h-4 text-indigo-500" />,
        action: () => {
          setActiveTab('students');
          setIsSearchOpen(false);
        }
      };
    });

  // 3. Students Matches
  const matchingStudents: SearchResultItem[] = trimmed
    ? students
        .filter(s =>
          (s.name || '').toLowerCase().includes(trimmed) ||
          (s.id || '').toLowerCase().includes(trimmed) ||
          (s.batch || '').toLowerCase().includes(trimmed) ||
          (s.currentLevel || '').toLowerCase().includes(trimmed) ||
          (s.group || '').toLowerCase().includes(trimmed)
        )
        .slice(0, 5)
        .map(student => ({
          id: `student-${student.id}`,
          type: 'student',
          title: student.name,
          subtitle: `${student.id} • ${student.group || 'Group 1'} • ${student.batch} • Level: ${student.currentLevel}`,
          badge: student.group || 'Group 1',
          icon: (
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-[10px]">
              {(student.name || 'ST').slice(0, 2).toUpperCase()}
            </div>
          ),
          action: () => {
            setIsSearchOpen(false);
            openStudentProfile(student.id);
          }
        }))
    : [];

  // 4. Sessions Matches
  const matchingSessions: SearchResultItem[] = trimmed
    ? sessions
        .filter(s =>
          (s.topic || '').toLowerCase().includes(trimmed) ||
          (s.faculty || '').toLowerCase().includes(trimmed) ||
          (s.id || '').toLowerCase().includes(trimmed) ||
          (s.batch || '').toLowerCase().includes(trimmed)
        )
        .slice(0, 4)
        .map(session => ({
          id: `session-${session.id}`,
          type: 'session',
          title: session.topic,
          subtitle: `${session.date} • ${session.startTime} • ${session.faculty}`,
          badge: session.id,
          icon: <Calendar className="w-4 h-4 text-indigo-500" />,
          action: () => {
            setIsSearchOpen(false);
            setSelectedSessionId(session.id);
            setActiveTab('attendance');
          }
        }))
    : [];

  // 5. Follow-ups Matches
  const matchingFollowUps: SearchResultItem[] = trimmed
    ? followUps
        .filter(f =>
          (f.studentName || '').toLowerCase().includes(trimmed) ||
          (f.actionRequired || '').toLowerCase().includes(trimmed) ||
          (f.issueType || '').toLowerCase().includes(trimmed) ||
          (f.id || '').toLowerCase().includes(trimmed)
        )
        .slice(0, 3)
        .map(f => ({
          id: `followup-${f.id}`,
          type: 'followup',
          title: `${f.studentName} — ${f.issueType}`,
          subtitle: f.actionRequired,
          badge: f.status,
          icon: <AlertCircle className="w-4 h-4 text-rose-500" />,
          action: () => {
            setIsSearchOpen(false);
            setActiveTab('follow-ups');
          }
        }))
    : [];

  // 6. CR Tasks Matches
  const matchingTasks: SearchResultItem[] = trimmed
    ? tasks
        .filter(t =>
          (t.task || '').toLowerCase().includes(trimmed) ||
          (t.category || '').toLowerCase().includes(trimmed) ||
          (t.id || '').toLowerCase().includes(trimmed)
        )
        .slice(0, 3)
        .map(t => ({
          id: `task-${t.id}`,
          type: 'task',
          title: t.task,
          subtitle: `Category: ${t.category} • Priority: ${t.priority}`,
          badge: t.status,
          icon: <ListChecks className="w-4 h-4 text-emerald-500" />,
          action: () => {
            setIsSearchOpen(false);
            setActiveTab('cr-tasks');
          }
        }))
    : [];

  // Flatten active selectable items for keyboard traversal
  const allFlatItems: SearchResultItem[] = [
    ...matchingCommands,
    ...matchingGroups,
    ...matchingStudents,
    ...matchingSessions,
    ...matchingFollowUps,
    ...matchingTasks
  ];

  // Reset or clamp selectedIndex when items change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Arrow key navigation
  const handleKeyDownInModal = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (allFlatItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % allFlatItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + allFlatItems.length) % allFlatItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allFlatItems[selectedIndex]) {
        allFlatItems[selectedIndex].action();
      }
    }
  };

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative mx-auto max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 transition-all border border-slate-200">
        {/* Search Header Input */}
        <div className="relative border-b border-slate-200 flex items-center px-4 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDownInModal}
            placeholder="Search students, groups (Group 1-7), sessions, commands... (↑↓ to navigate, Enter to open)"
            className="h-14 w-full bg-transparent border-0 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
          />
          <div className="flex items-center gap-1 shrink-0">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-200/60 border border-slate-300 rounded">
              ESC
            </kbd>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results Container */}
        <div ref={resultsContainerRef} className="max-h-[65vh] overflow-y-auto p-4 space-y-4">
          {/* Quick Suggestions when empty */}
          {!trimmed && (
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                <span className="flex items-center gap-1.5">
                  <Command className="w-3.5 h-3.5 text-blue-500" />
                  Quick Actions & Navigation
                </span>
                <span className="text-[10px] normal-case text-slate-400">Press ↑↓ to browse</span>
              </div>
              <div className="space-y-1">
                {matchingCommands.map(item => {
                  const flatIdx = allFlatItems.indexOf(item);
                  const isSelected = flatIdx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(flatIdx)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/90 text-blue-900 ring-1 ring-blue-200' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-xs font-semibold">{item.title}</p>
                          <p className="text-[11px] text-slate-500">{item.subtitle}</p>
                        </div>
                      </div>
                      <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-300'}`} />
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 mb-2 px-2 font-semibold">Try searching:</p>
                <div className="flex items-center gap-2 flex-wrap text-xs text-slate-600 px-2">
                  <span className="bg-slate-100 px-2.5 py-1 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => setQuery('Group 1')}>👥 Group 1</span>
                  <span className="bg-slate-100 px-2.5 py-1 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => setQuery('Yahoshuva')}>👤 Yahoshuva</span>
                  <span className="bg-slate-100 px-2.5 py-1 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => setQuery('Conditionals')}>📖 Conditionals</span>
                  <span className="bg-slate-100 px-2.5 py-1 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => setQuery('Teacher')}>🎓 Teacher Portal</span>
                </div>
              </div>
            </div>
          )}

          {trimmed && allFlatItems.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-sm">
              No results found for &ldquo;<span className="font-semibold text-slate-800">{query}</span>&rdquo;.
            </div>
          )}

          {/* Render Active Matching Sections */}
          {trimmed && (
            <>
              {/* Commands */}
              {matchingCommands.length > 0 && (
                <div>
                  <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                    <Command className="w-3.5 h-3.5 text-blue-500" />
                    <span>Actions & Views ({matchingCommands.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingCommands.map(item => {
                      const flatIdx = allFlatItems.indexOf(item);
                      const isSelected = flatIdx === selectedIndex;
                      return (
                        <div
                          key={item.id}
                          onClick={item.action}
                          onMouseEnter={() => setSelectedIndex(flatIdx)}
                          className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50 text-blue-900 ring-1 ring-blue-200' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                              {item.icon}
                            </div>
                            <div>
                              <p className="text-xs font-semibold">{item.title}</p>
                              <p className="text-[11px] text-slate-500">{item.subtitle}</p>
                            </div>
                          </div>
                          <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-300'}`} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Discussion Groups */}
              {matchingGroups.length > 0 && (
                <div>
                  <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Discussion Groups ({matchingGroups.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingGroups.map(item => {
                      const flatIdx = allFlatItems.indexOf(item);
                      const isSelected = flatIdx === selectedIndex;
                      return (
                        <div
                          key={item.id}
                          onClick={item.action}
                          onMouseEnter={() => setSelectedIndex(flatIdx)}
                          className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                            isSelected ? 'bg-indigo-50 text-indigo-900 ring-1 ring-indigo-200' : 'hover:bg-indigo-50/50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                              {item.icon}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                              <p className="text-[11px] text-slate-500">{item.subtitle}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                            {item.badge}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Students Matches */}
              {matchingStudents.length > 0 && (
                <div>
                  <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    <span>Students ({matchingStudents.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingStudents.map(item => {
                      const flatIdx = allFlatItems.indexOf(item);
                      const isSelected = flatIdx === selectedIndex;
                      return (
                        <div
                          key={item.id}
                          onClick={item.action}
                          onMouseEnter={() => setSelectedIndex(flatIdx)}
                          className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50 text-blue-900 ring-1 ring-blue-200' : 'hover:bg-blue-50/70 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {item.icon}
                            <div>
                              <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                              <p className="text-[11px] text-slate-500">{item.subtitle}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {item.badge}
                            </span>
                            <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-300'}`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sessions Matches */}
              {matchingSessions.length > 0 && (
                <div>
                  <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Sessions ({matchingSessions.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingSessions.map(item => {
                      const flatIdx = allFlatItems.indexOf(item);
                      const isSelected = flatIdx === selectedIndex;
                      return (
                        <div
                          key={item.id}
                          onClick={item.action}
                          onMouseEnter={() => setSelectedIndex(flatIdx)}
                          className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                            isSelected ? 'bg-indigo-50 text-indigo-900 ring-1 ring-indigo-200' : 'hover:bg-indigo-50/70 text-slate-700'
                          }`}
                        >
                          <div>
                            <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                            <p className="text-[11px] text-slate-500">{item.subtitle}</p>
                          </div>
                          <span className="text-[11px] font-medium text-indigo-600">
                            View Attendance →
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Follow-ups Matches */}
              {matchingFollowUps.length > 0 && (
                <div>
                  <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    <span>Follow-ups ({matchingFollowUps.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingFollowUps.map(item => {
                      const flatIdx = allFlatItems.indexOf(item);
                      const isSelected = flatIdx === selectedIndex;
                      return (
                        <div
                          key={item.id}
                          onClick={item.action}
                          onMouseEnter={() => setSelectedIndex(flatIdx)}
                          className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                            isSelected ? 'bg-rose-50 text-rose-900 ring-1 ring-rose-200' : 'hover:bg-rose-50/70 text-slate-700'
                          }`}
                        >
                          <div>
                            <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                            <p className="text-[11px] text-slate-500 line-clamp-1">{item.subtitle}</p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {item.badge}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tasks Matches */}
              {matchingTasks.length > 0 && (
                <div>
                  <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                    <ListChecks className="w-3.5 h-3.5 text-emerald-500" />
                    <span>CR Tasks ({matchingTasks.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingTasks.map(item => {
                      const flatIdx = allFlatItems.indexOf(item);
                      const isSelected = flatIdx === selectedIndex;
                      return (
                        <div
                          key={item.id}
                          onClick={item.action}
                          onMouseEnter={() => setSelectedIndex(flatIdx)}
                          className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                            isSelected ? 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200' : 'hover:bg-emerald-50/70 text-slate-700'
                          }`}
                        >
                          <div>
                            <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                            <p className="text-[11px] text-slate-500">{item.subtitle}</p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {item.badge}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Hotkey Hints */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px]">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px]">↵</kbd> Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px]">ESC</kbd> Close
            </span>
          </div>
          <span className="text-slate-400 font-medium">Classora Omnibox</span>
        </div>
      </div>
    </div>
  );
};
