import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode
} from 'react';
import {
  Student,
  Session,
  AttendanceRecord,
  FollowUp,
  CRTask,
  AppSettings,
  AttendanceStatus,
  StudentCalculatedStats,
  RiskStatus,
  UserRole,
  StudentRequest,
  StudentSkillScores,
  CRRemark,
  GoogleUser,
  ActivityLog
} from '../types';
import {
  initialStudents,
  initialSessions,
  initialAttendanceRecords,
  initialFollowUps,
  initialTasks,
  initialSettings,
  initialStudentRequests
} from '../data/mockData';
import { calculateDashboardMetrics, calculateStudentStats } from '../utils/calculations';
import { useToast } from './ToastContext';
import { soundFx } from '../utils/soundEffects';
import { api } from '../services/api';

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  timestamp: string;
  actionTab?: string;
  targetId?: string;
}

interface AppContextType {
  // System & Connection State
  isLoading: boolean;
  isBackendConnected: boolean;
  isSyncing: boolean;
  refreshData: (isSilent?: boolean) => Promise<void>;

  // Role & Identity
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentStudentId: string;
  setCurrentStudentId: (id: string) => void;
  currentStudent: Student | undefined;
  currentStudentStats: StudentCalculatedStats | undefined;
  activeTeacher: {
    name: string;
    designation: string;
    email: string;
    cabin: string;
    phone: string;
  };

  // Google Authentication & Security
  currentUser: GoogleUser;
  signInWithGoogle: (account: Partial<GoogleUser>) => void;
  signOutGoogle: () => void;
  isGoogleAuthModalOpen: boolean;
  setIsGoogleAuthModalOpen: (open: boolean) => void;
  isChangePasswordModalOpen: boolean;
  setIsChangePasswordModalOpen: (open: boolean) => void;
  updateCurrentUser: (updates: Partial<GoogleUser>) => void;

  // Interactivity, Audio & Guided Tour
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  soundVolume: number;
  setSoundVolume: (volume: number) => void;

  // State
  students: Student[];
  sessions: Session[];
  attendanceRecords: AttendanceRecord[];
  followUps: FollowUp[];
  tasks: CRTask[];
  settings: AppSettings;
  studentRequests: StudentRequest[];
  activityLogs: ActivityLog[];
  activeTab: string;
  selectedStudentId: string | null;
  selectedSessionId: string | null;
  isSearchOpen: boolean;
  isNotificationOpen: boolean;
  refreshActivityLogs: () => Promise<void>;
  logBroadcast: (payload: { topic: string; recipients: string; channel?: string }) => Promise<void>;

  // Calculated
  studentStats: StudentCalculatedStats[];
  dashboardMetrics: ReturnType<typeof calculateDashboardMetrics>;
  notifications: AppNotification[];
  unreadNotificationCount: number;

  // Navigation & Modals
  setActiveTab: (tab: string) => void;
  openStudentProfile: (studentId: string) => void;
  closeStudentProfile: () => void;
  setSelectedSessionId: (sessionId: string | null) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsNotificationOpen: (open: boolean) => void;

  // Attendance Actions
  markAttendance: (sessionId: string, studentId: string, status: AttendanceStatus, remarks?: string) => void;
  bulkMarkAttendance: (sessionId: string, records: Array<{ studentId: string; status: AttendanceStatus }>) => void;
  resetSessionAttendance: (sessionId: string) => void;

  // Student Actions
  addStudent: (studentData: Partial<Student> & { name: string; email: string; phone: string; batch: string }) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addCRRemark: (studentId: string, text: string) => void;

  // Student Portal Actions
  submitStudentRequest: (req: { type: StudentRequest['type']; subject: string; message: string; studentId?: string }) => void;
  resolveStudentRequest: (id: string, response: string, newStatus?: 'Approved' | 'Resolved') => void;

  // Teacher / Faculty Actions
  updateStudentSkillScore: (studentId: string, skill: keyof StudentSkillScores, score: number) => void;
  updateStudentAssignmentScore: (studentId: string, assignmentId: string, score: number) => void;
  addFacultyFeedback: (studentId: string, remark: string) => void;

  // Session Actions
  addSession: (sessionData: Omit<Session, 'id'>) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  deleteSession: (id: string) => void;

  // Follow-up Actions
  addFollowUp: (followUpData: Omit<FollowUp, 'id' | 'dateIdentified'>) => void;
  updateFollowUp: (id: string, updates: Partial<FollowUp>) => void;
  deleteFollowUp: (id: string) => void;

  // CR Task Actions
  toggleTask: (id: string) => void;
  addTask: (taskData: Omit<CRTask, 'id'>) => void;
  updateTask: (id: string, updates: Partial<CRTask>) => void;
  deleteTask: (id: string) => void;

  // Settings & System
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'classora_students_v2',
  SESSIONS: 'classora_sessions_v2',
  ATTENDANCE: 'classora_attendance_v2',
  FOLLOWUPS: 'classora_followups_v2',
  TASKS: 'classora_tasks_v2',
  SETTINGS: 'classora_settings_v2',
  ROLE: 'classora_role_v2',
  CURRENT_STUDENT: 'classora_curr_student_v2',
  STUDENT_REQUESTS: 'classora_requests_v2',
  GOOGLE_USER: 'classora_goog_user_v2',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { addToast } = useToast();

  // Google User Authentication State (Restricted strictly to SST emails)
  const [currentUser, setCurrentUser] = useState<GoogleUser>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GOOGLE_USER);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const email = (parsed?.email || '').trim().toLowerCase();
        const isSstDomain = /@(sst\.)?scaler\.com$/i.test(email) || /@sst\.scler\.com$/i.test(email);
        if (parsed?.isGoogleAuthenticated && isSstDomain) {
          return parsed;
        }
      } catch {}
    }
    return {
      id: '',
      name: '',
      email: '',
      role: 'CR',
      avatar: '',
      isGoogleAuthenticated: false,
    };
  });

  const [isGoogleAuthModalOpen, setIsGoogleAuthModalOpen] = useState<boolean>(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => soundFx.enabled);

  // Role & Current Student State
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || 'CR';
  });

  const [currentStudentId, setCurrentStudentIdState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT);
    return saved || '26bcs10296'; // Yahoshuva Kesaboyina (Group 5)
  });

  const [studentRequests, setStudentRequests] = useState<StudentRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENT_REQUESTS);
    return saved ? JSON.parse(saved) : initialStudentRequests;
  });

  // Fixed Faculty Coordinator info
  const activeTeacher = {
    name: 'Dr. Priya Nair',
    designation: 'Course Coordinator & Associate Professor (Phonetics & Linguistics)',
    email: 'priya.nair@sst.scaler.com',
    cabin: 'Faculty Block 3, Room 304',
    phone: '+91 98450 11223'
  };

  // Initialize state from localStorage or mock defaults
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return saved ? JSON.parse(saved) : initialSessions;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : initialAttendanceRecords;
  });

  const [followUps, setFollowUps] = useState<FollowUp[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOLLOWUPS);
    return saved ? JSON.parse(saved) : initialFollowUps;
  });

  const [tasks, setTasks] = useState<CRTask[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Backend Sync and Loading States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [soundVolume, setSoundVolumeState] = useState<number>(soundFx.volume);

  const setSoundVolume = useCallback((vol: number) => {
    soundFx.setVolume(vol);
    setSoundVolumeState(soundFx.volume);
  }, []);

  // UI Navigation states
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>('SES-107');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  // Synchronize state with Express backend
  const refreshData = useCallback(async (isSilent = false) => {
    try {
      setIsSyncing(true);
      const data = await api.getBootstrapData();
      if (data) {
        if (data.students && data.students.length > 0) setStudents(data.students);
        if (data.sessions && data.sessions.length > 0) setSessions(data.sessions);
        if (data.attendanceRecords) setAttendanceRecords(data.attendanceRecords);
        if (data.followUps) setFollowUps(data.followUps);
        if (data.tasks) setTasks(data.tasks);
        if (data.studentRequests) setStudentRequests(data.studentRequests);
        if (data.settings) setSettings(data.settings);
        if (data.activityLogs) setActivityLogs(data.activityLogs);
        setIsBackendConnected(true);
        if (!isSilent) addToast('Database synchronized with live Express backend', 'success');
      }
    } catch (err) {
      console.warn('[Classora] Backend sync unavailable, preserving local state:', err);
      setIsBackendConnected(false);
      if (!isSilent) addToast('Backend server unreachable. Using local offline cache.', 'warning');
    } finally {
      setIsSyncing(false);
    }
  }, [addToast]);

  const refreshActivityLogs = useCallback(async () => {
    try {
      const logs = await api.getActivityLogs(25);
      if (logs) setActivityLogs(logs);
    } catch (err) {
      console.warn('[Classora] Failed to fetch activity logs:', err);
    }
  }, []);

  const logBroadcast = useCallback(async (payload: { topic: string; recipients: string; channel?: string }) => {
    try {
      await api.logBroadcast({
        ...payload,
        actorName: currentUser.name || 'Aarav Sharma',
        actorRole: userRole
      });
      await refreshActivityLogs();
    } catch (err) {
      console.warn('[Classora] Broadcast log failed:', err);
    }
  }, [currentUser.name, userRole, refreshActivityLogs]);

  // Auto-reconnect listeners and 15s health check polling when offline
  useEffect(() => {
    const handleOnline = () => {
      refreshData(true);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('focus', handleOnline);

    // Continuous 15s real-time heartbeat synchronization with Express backend
    const timer = setInterval(() => {
      if (!isSyncing) {
        refreshData(true);
      }
    }, 15000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('focus', handleOnline);
      clearInterval(timer);
    };
  }, [isBackendConnected, isSyncing, refreshData]);

  // Initial load from backend with fallback
  useEffect(() => {
    let isMounted = true;
    const initApp = async () => {
      try {
        setIsLoading(true);
        const data = await api.getBootstrapData();
        if (isMounted && data) {
          if (data.students && data.students.length > 0) setStudents(data.students);
          if (data.sessions && data.sessions.length > 0) setSessions(data.sessions);
          if (data.attendanceRecords) setAttendanceRecords(data.attendanceRecords);
          if (data.followUps) setFollowUps(data.followUps);
          if (data.tasks) setTasks(data.tasks);
          if (data.studentRequests) setStudentRequests(data.studentRequests);
          if (data.settings) setSettings(data.settings);
          if (data.activityLogs) setActivityLogs(data.activityLogs);
          setIsBackendConnected(true);
        }
      } catch (err) {
        console.warn('[Classora] Backend unavailable on boot, fallback to local cache:', err);
        setIsBackendConnected(false);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    initApp();
    return () => { isMounted = false; };
  }, []);

  const setUserRole = useCallback((role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    if (role === 'Student') {
      setActiveTab('student-overview');
    } else if (role === 'Teacher') {
      setActiveTab('teacher-overview');
    } else {
      setActiveTab('dashboard');
    }
  }, []);

  const setCurrentStudentId = useCallback((id: string) => {
    setCurrentStudentIdState(id);
    localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, id);
  }, []);

  // Sync to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOLLOWUPS, JSON.stringify(followUps));
  }, [followUps]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENT_REQUESTS, JSON.stringify(studentRequests));
  }, [studentRequests]);

  // Derived calculations (Instant recomputation!)
  const dashboardMetrics = useMemo(() => {
    return calculateDashboardMetrics(students, sessions, attendanceRecords, settings);
  }, [students, sessions, attendanceRecords, settings]);

  const studentStats = useMemo(() => {
    return students
      .filter(s => !s.isArchived)
      .map(s => calculateStudentStats(s, sessions, attendanceRecords, settings));
  }, [students, sessions, attendanceRecords, settings]);

  const currentStudent = useMemo(() => {
    return students.find(s => s.id === currentStudentId) || students[0];
  }, [students, currentStudentId]);

  const currentStudentStats = useMemo(() => {
    return studentStats.find(s => s.student.id === currentStudentId) || studentStats[0];
  }, [studentStats, currentStudentId]);

  // Automatic Follow-Up Generator:
  // Automatically creates a follow-up when attendance drops below threshold, preventing duplicates
  useEffect(() => {
    if (isLoading) return;

    const atRiskOrAttention = studentStats.filter(
      s => s.status === 'At Risk' || s.status === 'Needs Attention'
    );

    let createdCount = 0;
    const todayStr = new Date().toISOString().split('T')[0];

    atRiskOrAttention.forEach(stat => {
      // Check if a pending or in-progress follow-up already exists for this student
      const existing = followUps.find(
        f => f.studentId === stat.student.id &&
             f.issueType === 'Low Attendance' &&
             (f.status === 'Pending' || f.status === 'In Progress')
      );

      if (!existing) {
        const isCritical = stat.status === 'At Risk';
        const newFollowUp: FollowUp = {
          id: `FLW-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 90 + 10)}`,
          studentId: stat.student.id,
          studentName: stat.student.name,
          issueType: 'Low Attendance',
          priority: isCritical ? 'Urgent' : 'High',
          dateIdentified: todayStr,
          actionRequired: isCritical
            ? `Emergency CR call & guardian alert: Attendance at ${stat.attendancePercentage}% (${stat.missedSessions} missed).`
            : `Reach out to check reasons for missed classes (${stat.attendancePercentage}%).`,
          assignedTo: 'Aarav (Lead CR)',
          deadline: todayStr,
          status: 'Pending',
          remarks: `Auto-generated rule: Attendance dropped below threshold (${stat.attendancePercentage}%).`,
          isAutoGenerated: true,
        };

        setFollowUps(prev => [newFollowUp, ...prev]);
        createdCount++;
      }
    });

    if (createdCount > 0) {
      addToast(`${createdCount} new attendance follow-up suggestion(s) generated`, 'warning');
    }
  }, [studentStats, followUps, addToast, isLoading]);

  // Dynamic Notifications Engine
  const notifications = useMemo(() => {
    const list: AppNotification[] = [];
    const todayStr = new Date().toISOString().split('T')[0];

    // Today's absent students
    const todaySessions = sessions.filter(s => s.date === todayStr);
    const todaySessionIds = todaySessions.map(s => s.id);
    const absents = attendanceRecords.filter(
      r => todaySessionIds.includes(r.sessionId) && r.status === 'Absent'
    );

    if (absents.length > 0) {
      list.push({
        id: 'notif-absent-today',
        title: `${absents.length} students absent today`,
        description: `Immediate verification required before 04:00 PM.`,
        type: 'warning',
        timestamp: 'Just now',
        actionTab: 'attendance',
      });
    }

    // At risk students count
    const atRisk = studentStats.filter(s => s.status === 'At Risk');
    if (atRisk.length > 0) {
      list.push({
        id: 'notif-at-risk',
        title: `${atRisk.length} students critical (<${settings.atRiskThreshold}% attendance)`,
        description: `Students like ${atRisk[0].student.name} require emergency check-in.`,
        type: 'urgent',
        timestamp: 'Active rule',
        actionTab: 'reports',
      });
    }

    // Urgent pending follow-ups
    const urgentFollowUps = followUps.filter(f => f.priority === 'Urgent' && f.status === 'Pending');
    if (urgentFollowUps.length > 0) {
      list.push({
        id: 'notif-urgent-followups',
        title: `${urgentFollowUps.length} urgent follow-ups pending`,
        description: `High-priority student interventions awaiting action.`,
        type: 'urgent',
        timestamp: 'Today',
        actionTab: 'follow-ups',
      });
    }

    // Pending CR Tasks due today
    const pendingTasks = tasks.filter(t => t.status === 'Pending');
    if (pendingTasks.length > 0) {
      list.push({
        id: 'notif-pending-tasks',
        title: `${pendingTasks.length} CR tasks pending`,
        description: `Keep daily operations moving smoothly.`,
        type: 'info',
        timestamp: 'Today',
        actionTab: 'cr-tasks',
      });
    }

    // In Progress session
    const currentSession = sessions.find(s => s.status === 'In Progress');
    if (currentSession) {
      list.push({
        id: 'notif-in-progress-session',
        title: `Live Session: ${currentSession.topic}`,
        description: `${currentSession.faculty} • ${currentSession.location}`,
        type: 'info',
        timestamp: 'Now',
        actionTab: 'attendance',
        targetId: currentSession.id,
      });
    }

    return list;
  }, [sessions, attendanceRecords, studentStats, followUps, tasks, settings.atRiskThreshold]);

  const unreadNotificationCount = notifications.length;

  // Actions implementation
  const openStudentProfile = useCallback((studentId: string) => {
    setSelectedStudentId(studentId);
  }, []);

  const closeStudentProfile = useCallback(() => {
    setSelectedStudentId(null);
  }, []);

  const markAttendance = useCallback((
    sessionId: string,
    studentId: string,
    status: AttendanceStatus,
    remarks?: string
  ) => {
    const timestamp = new Date().toISOString();
    setAttendanceRecords(prev => {
      const filtered = prev.filter(r => !(r.sessionId === sessionId && r.studentId === studentId));
      return [...filtered, { sessionId, studentId, status, remarks, timestamp }];
    });

    api.markAttendance(sessionId, studentId, status, remarks).catch(err => {
      console.warn('[Classora Backend] markAttendance failed:', err);
    });
  }, []);

  const bulkMarkAttendance = useCallback((
    sessionId: string,
    records: Array<{ studentId: string; status: AttendanceStatus }>
  ) => {
    const timestamp = new Date().toISOString();
    setAttendanceRecords(prev => {
      const studentIds = new Set(records.map(r => r.studentId));
      const filtered = prev.filter(r => !(r.sessionId === sessionId && studentIds.has(r.studentId)));
      const newRecords: AttendanceRecord[] = records.map(r => ({
        sessionId,
        studentId: r.studentId,
        status: r.status,
        timestamp,
      }));
      return [...filtered, ...newRecords];
    });

    api.bulkMarkAttendance(sessionId, records).catch(err => {
      console.warn('[Classora Backend] bulkMarkAttendance failed:', err);
    });

    addToast(`Saved attendance for ${records.length} students!`, 'success');
  }, [addToast]);

  const resetSessionAttendance = useCallback((sessionId: string) => {
    setAttendanceRecords(prev => prev.filter(r => r.sessionId !== sessionId));
    api.resetSessionAttendance(sessionId).catch(err => {
      console.warn('[Classora Backend] resetSessionAttendance failed:', err);
    });
    addToast('Attendance reset for session', 'info');
  }, [addToast]);

  const addStudent = useCallback((studentData: Partial<Student> & { name: string; email: string; phone: string; batch: string }) => {
    const count = students.length + 1;
    const newId = `ENG-2026-${count.toString().padStart(3, '0')}`;
    const newStudent: Student = {
      id: newId,
      name: studentData.name,
      phone: studentData.phone,
      email: studentData.email,
      batch: studentData.batch,
      joiningDate: studentData.joiningDate || new Date().toISOString().split('T')[0],
      currentLevel: studentData.currentLevel || 'Intermediate (B1)',
      initialRemarks: studentData.initialRemarks || 'Newly enrolled student.',
      lastActivity: 'Just now',
      skills: studentData.skills || {
        communication: 75,
        grammar: 75,
        vocabulary: 75,
        pronunciation: 75,
        participation: 75,
        assignments: 75,
        assessments: 75,
      },
      previousOverallScore: 75,
      assignments: [],
      crRemarks: [],
      historicalScores: [
        { date: new Date().toISOString().split('T')[0], overallScore: 75, communication: 75, grammar: 75, vocabulary: 75 }
      ],
    };

    setStudents(prev => [newStudent, ...prev]);
    api.createStudent(newStudent).catch(err => {
      console.warn('[Classora Backend] createStudent failed:', err);
    });
    addToast(`Student "${newStudent.name}" enrolled successfully!`, 'success');
  }, [students.length, addToast]);

  const updateStudent = useCallback((id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    api.updateStudent(id, updates).catch(err => {
      console.warn('[Classora Backend] updateStudent failed:', err);
    });
    addToast('Student details updated', 'success');
  }, [addToast]);

  const deleteStudent = useCallback((id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setAttendanceRecords(prev => prev.filter(r => r.studentId !== id));
    setFollowUps(prev => prev.filter(f => f.studentId !== id));
    if (selectedStudentId === id) setSelectedStudentId(null);
    api.deleteStudent(id).catch(err => {
      console.warn('[Classora Backend] deleteStudent failed:', err);
    });
    addToast('Student record archived/removed', 'info');
  }, [selectedStudentId, addToast]);

  const addCRRemark = useCallback((studentId: string, text: string) => {
    const remark = {
      id: `REM-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      author: 'Aarav (Lead CR)',
      text,
    };
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          crRemarks: [remark, ...s.crRemarks],
        };
      }
      return s;
    }));
    api.addCRRemark(studentId, text, 'Aarav (Lead CR)').catch(err => {
      console.warn('[Classora Backend] addCRRemark failed:', err);
    });
    addToast('CR note recorded', 'success');
  }, [addToast]);

  const addSession = useCallback((sessionData: Omit<Session, 'id'>) => {
    const nextId = `SES-${101 + sessions.length}`;
    const newSession: Session = {
      id: nextId,
      ...sessionData,
    };
    setSessions(prev => [newSession, ...prev]);
    api.createSession(newSession).catch(err => {
      console.warn('[Classora Backend] createSession failed:', err);
    });
    addToast(`New session "${newSession.topic}" scheduled!`, 'success');
  }, [sessions.length, addToast]);

  const updateSession = useCallback((id: string, updates: Partial<Session>) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    api.updateSession(id, updates).catch(err => {
      console.warn('[Classora Backend] updateSession failed:', err);
    });
    addToast('Session updated successfully', 'success');
  }, [addToast]);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    setAttendanceRecords(prev => prev.filter(r => r.sessionId !== id));
    api.deleteSession(id).catch(err => {
      console.warn('[Classora Backend] deleteSession failed:', err);
    });
    addToast('Session removed', 'info');
  }, [addToast]);

  const addFollowUp = useCallback((followUpData: Omit<FollowUp, 'id' | 'dateIdentified'>) => {
    const newFollowUp: FollowUp = {
      id: `FLW-${Date.now().toString().slice(-4)}`,
      dateIdentified: new Date().toISOString().split('T')[0],
      ...followUpData,
    };
    setFollowUps(prev => [newFollowUp, ...prev]);
    api.createFollowUp(newFollowUp).catch(err => {
      console.warn('[Classora Backend] createFollowUp failed:', err);
    });
    addToast(`Follow-up logged for ${newFollowUp.studentName}`, 'success');
  }, [addToast]);

  const updateFollowUp = useCallback((id: string, updates: Partial<FollowUp>) => {
    setFollowUps(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    api.updateFollowUp(id, updates).catch(err => {
      console.warn('[Classora Backend] updateFollowUp failed:', err);
    });
    addToast('Follow-up status updated', 'success');
  }, [addToast]);

  const deleteFollowUp = useCallback((id: string) => {
    setFollowUps(prev => prev.filter(f => f.id !== id));
    api.deleteFollowUp(id).catch(err => {
      console.warn('[Classora Backend] deleteFollowUp failed:', err);
    });
    addToast('Follow-up removed', 'info');
  }, [addToast]);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
    api.toggleTask(id).catch(err => {
      console.warn('[Classora Backend] toggleTask failed:', err);
    });
  }, []);

  const addTask = useCallback((taskData: Omit<CRTask, 'id'>) => {
    const newTask: CRTask = {
      id: `TSK-${Date.now().toString().slice(-3)}`,
      ...taskData,
    };
    setTasks(prev => [newTask, ...prev]);
    api.createTask(newTask).catch(err => {
      console.warn('[Classora Backend] createTask failed:', err);
    });
    addToast('New CR Task created', 'success');
  }, [addToast]);

  const updateTask = useCallback((id: string, updates: Partial<CRTask>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    api.updateTask(id, updates).catch(err => {
      console.warn('[Classora Backend] updateTask failed:', err);
    });
    addToast('Task updated', 'success');
  }, [addToast]);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    api.deleteTask(id).catch(err => {
      console.warn('[Classora Backend] deleteTask failed:', err);
    });
    addToast('Task deleted', 'info');
  }, [addToast]);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    api.updateSettings(updates).catch(err => {
      console.warn('[Classora Backend] updateSettings failed:', err);
    });
    addToast('Settings saved successfully', 'success');
  }, [addToast]);

  // Student Portal Request submission
  const submitStudentRequest = useCallback((req: { type: StudentRequest['type']; subject: string; message: string; studentId?: string }) => {
    const targetId = req.studentId || currentStudentId;
    const targetStudent = students.find(s => s.id === targetId);
    const studentName = targetStudent ? targetStudent.name : 'Student';
    const newReq: StudentRequest = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      studentId: targetId,
      studentName,
      type: req.type,
      subject: req.subject,
      message: req.message,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setStudentRequests(prev => [newReq, ...prev]);

    // Also auto-create a Follow-up so CR and Teacher immediately see it in their board!
    const newFollowUp: FollowUp = {
      id: `FLW-${Date.now().toString().slice(-4)}`,
      studentId: targetId,
      studentName,
      issueType: req.type === 'Leave / Absence Excuse' ? 'Low Attendance' : 'Student Request',
      priority: req.type === 'Leave / Absence Excuse' ? 'High' : 'Medium',
      dateIdentified: new Date().toISOString().split('T')[0],
      actionRequired: `[${req.type}] ${req.subject}: "${req.message.slice(0, 80)}"`,
      assignedTo: 'Aarav (Lead CR)',
      deadline: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      status: 'Pending',
      remarks: 'Submitted via Classora Student Portal.',
      isAutoGenerated: true,
    };
    setFollowUps(prev => [newFollowUp, ...prev]);

    api.submitStudentRequest({
      type: req.type,
      subject: req.subject,
      message: req.message,
      studentId: targetId
    }).catch(err => {
      console.warn('[Classora Backend] submitStudentRequest failed:', err);
    });

    addToast(`Request "${req.subject}" submitted to Lead CR & Dr. Priya Nair.`, 'success');
  }, [currentStudentId, students, addToast]);

  const resolveStudentRequest = useCallback((id: string, responseText: string, newStatus: 'Approved' | 'Resolved' = 'Resolved') => {
    const targetReq = studentRequests.find(r => r.id === id);
    setStudentRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus, teacherOrCrResponse: responseText } : r));

    if (targetReq && targetReq.type === 'Leave / Absence Excuse' && newStatus === 'Approved') {
      const targetSessionId = selectedSessionId || 'SES-110';
      setAttendanceRecords(prev => {
        const existing = prev.find(a => a.studentId === targetReq.studentId && a.sessionId === targetSessionId);
        if (existing) {
          return prev.map(a => (a.studentId === targetReq.studentId && a.sessionId === targetSessionId)
            ? { ...a, status: 'Excused' as AttendanceStatus, remarks: `Approved Leave: ${targetReq.subject}` }
            : a
          );
        } else {
          return [...prev, {
            sessionId: targetSessionId,
            studentId: targetReq.studentId,
            status: 'Excused' as AttendanceStatus,
            remarks: `Approved Leave: ${targetReq.subject}`,
            timestamp: new Date().toISOString()
          }];
        }
      });
      soundFx.playCelebration();
      addToast(`Leave approved for ${targetReq.studentName}. Session attendance updated to Excused!`, 'success');
    } else {
      addToast(`Student request marked as ${newStatus}`, 'success');
    }

    api.resolveStudentRequest(id, responseText, newStatus).then(() => {
      refreshData(true);
      refreshActivityLogs();
    }).catch(err => {
      console.warn('[Classora Backend] resolveStudentRequest failed:', err);
    });
  }, [studentRequests, selectedSessionId, addToast, refreshData, refreshActivityLogs]);

  // Teacher grading & feedback methods
  const updateStudentSkillScore = useCallback((studentId: string, skill: keyof StudentSkillScores, score: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      return {
        ...s,
        skills: {
          ...s.skills,
          [skill]: Math.max(0, Math.min(100, score))
        }
      };
    }));
    api.updateStudentSkill(studentId, skill, score).catch(err => {
      console.warn('[Classora Backend] updateStudentSkill failed:', err);
    });
    addToast(`Updated ${skill} competency score`, 'success');
  }, [addToast]);

  const updateStudentAssignmentScore = useCallback((studentId: string, assignmentId: string, score: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      return {
        ...s,
        assignments: s.assignments.map(a => {
          if (a.id !== assignmentId) return a;
          return {
            ...a,
            score: Math.max(0, Math.min(a.maxScore, score)),
            status: 'Graded' as const
          };
        })
      };
    }));
    api.updateStudentAssignment(studentId, assignmentId, score).catch(err => {
      console.warn('[Classora Backend] updateStudentAssignment failed:', err);
    });
    addToast('Assessment evaluated & score saved', 'success');
  }, [addToast]);

  const addFacultyFeedback = useCallback((studentId: string, remarkText: string) => {
    const remark: CRRemark = {
      id: `FCT-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      author: 'Dr. Priya Nair (Faculty)',
      text: remarkText
    };
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      return {
        ...s,
        crRemarks: [remark, ...s.crRemarks]
      };
    }));
    api.addFacultyFeedback(studentId, remarkText).catch(err => {
      console.warn('[Classora Backend] addFacultyFeedback failed:', err);
    });
    addToast('Faculty feedback recorded on student profile', 'success');
  }, [addToast]);

  const signInWithGoogle = useCallback(async (account: Partial<GoogleUser>) => {
    const email = (account.email || '').trim().toLowerCase();
    const isSstDomain = /@(sst\.)?scaler\.com$/i.test(email) || /@sst\.scler\.com$/i.test(email);

    if (!isSstDomain) {
      soundFx.playPop();
      addToast('Access Denied: Only Scaler School of Technology (@sst.scaler.com) accounts are permitted.', 'error');
      throw new Error('Access Denied: Only Scaler School of Technology (@sst.scaler.com) accounts are authorized.');
    }

    let verifiedUser: GoogleUser = {
      id: account.id || `sst-${Date.now()}`,
      name: account.name || email.split('@')[0].replace(/\./g, ' '),
      email: email,
      avatar: account.avatar || '',
      role: account.role || 'Student',
      studentId: account.studentId,
      isGoogleAuthenticated: true,
      mustChangePassword: account.mustChangePassword
    };

    try {
      const res = await api.authenticateGoogle(email, account.name, account.avatar);
      if (res && res.user) {
        verifiedUser = {
          ...verifiedUser,
          ...res.user,
          isGoogleAuthenticated: true,
          mustChangePassword: account.mustChangePassword ?? res.user.mustChangePassword
        };
      }
    } catch (err: any) {
      console.warn('[Classora] Backend authentication notification:', err.message);
    }

    setCurrentUser(verifiedUser);
    localStorage.setItem(STORAGE_KEYS.GOOGLE_USER, JSON.stringify(verifiedUser));

    setUserRole(verifiedUser.role);
    if (verifiedUser.studentId) {
      setCurrentStudentId(verifiedUser.studentId);
    }

    if (verifiedUser.mustChangePassword) {
      setIsChangePasswordModalOpen(true);
    }

    addToast(`Google Verified: Welcome ${verifiedUser.name} (${verifiedUser.role})`, 'success');
  }, [setUserRole, setCurrentStudentId, addToast]);

  const updateCurrentUser = useCallback((updates: Partial<GoogleUser>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.GOOGLE_USER, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const signOutGoogle = useCallback(() => {
    const unauthUser: GoogleUser = {
      id: '',
      name: '',
      email: '',
      avatar: '',
      role: 'CR',
      isGoogleAuthenticated: false,
    };
    setCurrentUser(unauthUser);
    localStorage.removeItem(STORAGE_KEYS.GOOGLE_USER);
    addToast('Signed out of SST Google account', 'info');
  }, [addToast]);

  const toggleSound = useCallback(() => {
    const isEnabled = soundFx.toggle();
    setSoundEnabled(isEnabled);
    addToast(isEnabled ? 'Sound effects enabled' : 'Sound effects muted', 'info');
  }, [addToast]);

  const resetToDemoData = useCallback(async () => {
    try {
      setIsSyncing(true);
      await api.resyncOfficial();
      await refreshData(true);
      addToast('Classora database re-synchronized with official SST 2026 registry', 'success');
    } catch (err: any) {
      console.warn('[Classora Backend] resyncOfficial fallback:', err);
      localStorage.removeItem(STORAGE_KEYS.STUDENTS);
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
      localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
      localStorage.removeItem(STORAGE_KEYS.FOLLOWUPS);
      localStorage.removeItem(STORAGE_KEYS.TASKS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.ROLE);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT);
      localStorage.removeItem(STORAGE_KEYS.STUDENT_REQUESTS);

      setStudents(initialStudents);
      setSessions(initialSessions);
      setAttendanceRecords(initialAttendanceRecords);
      setFollowUps(initialFollowUps);
      setTasks(initialTasks);
      setSettings(initialSettings);
      setSelectedSessionId('SES-107');
      setUserRoleState('CR');
      setCurrentStudentIdState('26bcs10296');
      setStudentRequests(initialStudentRequests);
      addToast('Local SST 2026 dataset refreshed', 'info');
    } finally {
      setIsSyncing(false);
    }
  }, [refreshData, addToast]);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        isBackendConnected,
        isSyncing,
        refreshData,

        userRole,
        setUserRole,
        currentStudentId,
        setCurrentStudentId,
        currentStudent,
        currentStudentStats,
        activeTeacher,
        studentRequests,

        currentUser,
        signInWithGoogle,
        signOutGoogle,
        isGoogleAuthModalOpen,
        setIsGoogleAuthModalOpen,
        isChangePasswordModalOpen,
        setIsChangePasswordModalOpen,
        updateCurrentUser,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isShortcutsOpen,
        setIsShortcutsOpen,
        soundEnabled,
        toggleSound,
        soundVolume,
        setSoundVolume,

        students,
        sessions,
        attendanceRecords,
        followUps,
        tasks,
        settings,
        activeTab,
        selectedStudentId,
        selectedSessionId,
        isSearchOpen,
        isNotificationOpen,

        studentStats,
        dashboardMetrics,
        notifications,
        unreadNotificationCount,

        setActiveTab,
        openStudentProfile,
        closeStudentProfile,
        setSelectedSessionId,
        setIsSearchOpen,
        setIsNotificationOpen,

        markAttendance,
        bulkMarkAttendance,
        resetSessionAttendance,

        addStudent,
        updateStudent,
        deleteStudent,
        addCRRemark,

        submitStudentRequest,
        resolveStudentRequest,
        updateStudentSkillScore,
        updateStudentAssignmentScore,
        addFacultyFeedback,

        addSession,
        updateSession,
        deleteSession,

        addFollowUp,
        updateFollowUp,
        deleteFollowUp,

        toggleTask,
        addTask,
        updateTask,
        deleteTask,

        updateSettings,
        resetToDemoData,
        activityLogs,
        refreshActivityLogs,
        logBroadcast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
