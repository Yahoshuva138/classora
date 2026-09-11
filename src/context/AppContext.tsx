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
  UserRole,
  StudentRequest,
  StudentSkillScores,
  CRRemark,
  GoogleUser,
  ActivityLog,
  UserSocialLinks,
  GuestVisitor
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
    company?: string;
    rating?: number;
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

  // Profile Customization & Public Showcase
  isProfileCustomizationOpen: boolean;
  setIsProfileCustomizationOpen: (open: boolean) => void;
  publicProfileTarget: { user?: GoogleUser; student?: Student } | null;
  openPublicProfile: (targetIdOrStudent: string | Student) => void;
  closePublicProfile: () => void;
  updateUserProfile: (updates: { avatar?: string; bio?: string; headline?: string; publicLinks?: UserSocialLinks; name?: string }) => Promise<void>;

  // Guest Showcase & Admin Visitors Console
  isGuestVisitorsModalOpen: boolean;
  setIsGuestVisitorsModalOpen: (open: boolean) => void;
  loginAsGuest: (customName?: string) => Promise<void>;
  currentGuestVisitor: GuestVisitor | null;

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
  clearAllFollowUps: () => void;

  // CR Task Actions
  toggleTask: (id: string) => void;
  addTask: (taskData: Omit<CRTask, 'id'>) => void;
  updateTask: (id: string, updates: Partial<CRTask>) => void;
  deleteTask: (id: string) => void;
  // Role Management Modal & Actions
  isRoleManagementModalOpen: boolean;
  setIsRoleManagementModalOpen: (open: boolean) => void;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<boolean>;

  // Settings & System
  updateSettings: (updates: Partial<AppSettings>) => void;
  refreshRealTimeData: () => void;
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
  ACTIVE_TAB: 'classora_active_tab_v2',
  SELECTED_SESSION: 'classora_selected_session_v2',
  SELECTED_STUDENT: 'classora_selected_student_v2',
  USER_MODIFIED_SCORES: 'classora_user_modified_scores_v2',
  USER_MODIFIED_ATTENDANCE: 'classora_user_modified_attendance_v2',
};

// Academic Marking Criteria Column Max Limits
export const MARKING_CRITERIA_LIMITS: Record<string, { id: string; name: string; maxScore: number; minScore: number }> = {
  'ASG-101': { id: 'ASG-101', name: 'English Test_C', maxScore: 25, minScore: 0 },
  'ASG-102': { id: 'ASG-102', name: 'Tenses Quiz_C', maxScore: 20, minScore: 0 },
  'ASG-103': { id: 'ASG-103', name: 'Presentation', maxScore: 25, minScore: 0 },
  'ASG-104': { id: 'ASG-104', name: 'Group Discussion', maxScore: 30, minScore: 0 },
};

export function getCriteriaMaxScore(assignmentId?: string, title?: string, fallbackMax = 25): number {
  if (assignmentId && MARKING_CRITERIA_LIMITS[assignmentId]) {
    return MARKING_CRITERIA_LIMITS[assignmentId].maxScore;
  }
  const t = (title || '').toLowerCase();
  if (t.includes('english test') || t.includes('diagnostic')) return 25;
  if (t.includes('tenses') || t.includes('quiz')) return 20;
  if (t.includes('presentation') || t.includes('pitch')) return 25;
  if (t.includes('group discussion') || t.includes('debate')) return 30;
  return fallbackMax;
}

export function deduplicateStudents(list: Student[]): Student[] {
  if (!list || !Array.isArray(list)) return [];
  const seenIds = new Set<string>();
  const seenEmails = new Set<string>();
  const result: Student[] = [];

  for (const s of list) {
    if (!s) continue;
    const rawId = (s.rollNo || s.id || '').trim().toLowerCase();
    const rawEmail = (s.email || '').trim().toLowerCase();

    // If an item has an ObjectId as id (24-hex char) and also has a rollNo, normalize id to rollNo
    const canonicalId = (s.rollNo || s.id || '').trim();
    const cleanStudent: Student = {
      ...s,
      id: canonicalId,
      rollNo: canonicalId
    };

    if (seenIds.has(rawId) || (rawEmail && seenEmails.has(rawEmail))) {
      continue; // Duplicate! Skip.
    }

    if (rawId) seenIds.add(rawId);
    if (rawEmail) seenEmails.add(rawEmail);
    result.push(cleanStudent);
  }

  return result;
}

// Local-first smart reconciliation to guarantee data persistence without doubling roster
function reconcileStudents(localList: Student[], serverList: Student[]): Student[] {
  if (!serverList || serverList.length === 0) return deduplicateStudents(localList);

  const cleanServerList = deduplicateStudents(serverList);
  if (!localList || localList.length === 0) return cleanServerList;

  let modifiedScores: Record<string, { score: number; updatedAt: number }> = {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_MODIFIED_SCORES);
    if (raw) modifiedScores = JSON.parse(raw);
  } catch {}

  const serverIdSet = new Set<string>();
  const serverEmailSet = new Set<string>();

  for (const s of cleanServerList) {
    const idKey = (s.rollNo || s.id || '').trim().toLowerCase();
    const emailKey = (s.email || '').trim().toLowerCase();
    if (idKey) serverIdSet.add(idKey);
    if (emailKey) serverEmailSet.add(emailKey);
  }

  const localMap = new Map<string, Student>();
  for (const ls of localList) {
    const idKey = (ls.rollNo || ls.id || '').trim().toLowerCase();
    const emailKey = (ls.email || '').trim().toLowerCase();
    if (idKey) localMap.set(idKey, ls);
    if (emailKey) localMap.set(emailKey, ls);
  }

  const mergedServerStudents = cleanServerList.map(serverStudent => {
    const sId = (serverStudent.rollNo || serverStudent.id || '').trim().toLowerCase();
    const sEmail = (serverStudent.email || '').trim().toLowerCase();
    const localStudent = localMap.get(sId) || (sEmail ? localMap.get(sEmail) : undefined);
    if (!localStudent) return serverStudent;

    // Merge assignments
    const mergedAssignments = (serverStudent.assignments || []).map(serverAsg => {
      const localAsg = localStudent.assignments?.find(a => a.id === serverAsg.id);
      if (!localAsg) return serverAsg;

      const modKey = `${serverStudent.id}_${serverAsg.id}`;
      const userMod = modifiedScores[modKey];

      // Priority 1: User explicitly modified this score in the current or previous session
      if (userMod !== undefined && userMod.score !== undefined) {
        return {
          ...serverAsg,
          score: userMod.score,
          status: 'Graded' as const
        };
      }

      // Priority 2: Server assignment score is authoritative (real-time live database)
      return serverAsg;
    });

    // Real-time skills from server with user modifications applied
    const mergedSkills: StudentSkillScores = {
      ...(serverStudent.skills || {
        communication: 0,
        grammar: 0,
        vocabulary: 0,
        pronunciation: 0,
        participation: 0,
        assignments: 0,
        assessments: 0,
      })
    };

    const skillKeys: Array<keyof StudentSkillScores> = [
      'communication', 'grammar', 'vocabulary', 'pronunciation', 'participation', 'assignments', 'assessments'
    ];
    for (const sk of skillKeys) {
      const modKey = `${serverStudent.id}_${sk}`;
      if (modifiedScores[modKey]?.score !== undefined) {
        mergedSkills[sk] = modifiedScores[modKey].score;
      }
    }

    // Merge remarks (union without duplicates)
    const serverRemarkIds = new Set((serverStudent.crRemarks || []).map(r => r.id));
    const extraLocalRemarks = (localStudent.crRemarks || []).filter(r => !serverRemarkIds.has(r.id));
    const mergedRemarks = [...extraLocalRemarks, ...(serverStudent.crRemarks || [])];

    const canonicalId = serverStudent.rollNo || serverStudent.id;

    return {
      ...serverStudent,
      id: canonicalId,
      rollNo: canonicalId,
      skills: mergedSkills,
      assignments: mergedAssignments,
      crRemarks: mergedRemarks,
      phone: localStudent.phone || serverStudent.phone,
      batch: localStudent.batch || serverStudent.batch,
      currentLevel: localStudent.currentLevel || serverStudent.currentLevel,
    };
  });

  // Only keep genuinely new local students that do NOT exist in serverList by ID, rollNo, or email
  const isMongoObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id);
  const extraLocalStudents = localList.filter(ls => {
    const lsId = (ls.rollNo || ls.id || '').trim().toLowerCase();
    const lsEmail = (ls.email || '').trim().toLowerCase();
    if (!lsId) return false;
    if (isMongoObjectId(ls.id)) return false; // Legacy ObjectId duplicate!
    return !serverIdSet.has(lsId) && (!lsEmail || !serverEmailSet.has(lsEmail));
  });

  const combined = [...mergedServerStudents, ...extraLocalStudents];
  const finalResult = deduplicateStudents(combined);
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(finalResult));
  } catch {}
  return finalResult;
}

function reconcileAttendance(localRecs: AttendanceRecord[], serverRecs: AttendanceRecord[]): AttendanceRecord[] {
  let modifiedAttendance: Record<string, { status: AttendanceStatus; updatedAt: number; remarks?: string }> = {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_MODIFIED_ATTENDANCE);
    if (raw) modifiedAttendance = JSON.parse(raw);
  } catch {}

  const map = new Map<string, AttendanceRecord>();
  // 1. Authoritative real-time server records
  for (const r of (serverRecs || [])) {
    map.set(`${r.sessionId}_${r.studentId}`, r);
  }

  // 2. User's explicit real-time modifications take precedence or add records
  for (const [key, userMod] of Object.entries(modifiedAttendance)) {
    const [sessionId, studentId] = key.split('_');
    if (sessionId && studentId && userMod?.status) {
      const sr = map.get(key);
      map.set(key, {
        sessionId,
        studentId,
        status: userMod.status,
        remarks: userMod.remarks ?? sr?.remarks,
        timestamp: new Date(userMod.updatedAt || Date.now()).toISOString()
      });
    }
  }

  const result = Array.from(map.values());
  try {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(result));
  } catch {}
  return result;
}

function reconcileSessions(localList: Session[], serverList: Session[]): Session[] {
  if (!serverList || serverList.length === 0) return localList;
  if (!localList || localList.length === 0) return serverList;

  const serverMap = new Map(serverList.map(s => [s.id, s]));
  const merged: Session[] = [...serverList];

  for (const ls of localList) {
    if (!serverMap.has(ls.id)) {
      merged.push(ls);
    }
  }
  return merged;
}

function reconcileFollowUps(localList: FollowUp[], serverList: FollowUp[]): FollowUp[] {
  const isTest = (f: FollowUp) => f.isAutoGenerated || f.id?.startsWith('FLW-') || /^fu-\d+$/i.test(f.id);
  const cleanServer = (serverList || []).filter(f => !isTest(f));
  const cleanLocal = (localList || []).filter(f => !isTest(f));
  const serverIds = new Set(cleanServer.map(f => f.id));
  const extraLocal = cleanLocal.filter(f => !serverIds.has(f.id));
  const result = [...cleanServer, ...extraLocal];
  try {
    localStorage.setItem(STORAGE_KEYS.FOLLOWUPS, JSON.stringify(result));
  } catch {}
  return result;
}

function reconcileTasks(localList: CRTask[], serverList: CRTask[]): CRTask[] {
  if (!serverList) return (localList || []).filter(lt => !/^task-\d+$/i.test(lt.id));
  const serverIds = new Set(serverList.map(t => t.id));
  const isDemoId = (id: string) => /^task-\d+$/i.test(id);
  const extraLocal = (localList || []).filter(lt => !serverIds.has(lt.id) && !isDemoId(lt.id));
  const result = [...serverList, ...extraLocal];
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(result));
  } catch {}
  return result;
}

function reconcileRequests(localList: StudentRequest[], serverList: StudentRequest[]): StudentRequest[] {
  if (!serverList) return (localList || []).filter(lr => !/^req-\d+$/i.test(lr.id));
  const serverIds = new Set(serverList.map(r => r.id));
  const isDemoId = (id: string) => /^req-\d+$/i.test(id);
  const extraLocal = (localList || []).filter(lr => !serverIds.has(lr.id) && !isDemoId(lr.id));
  const result = [...serverList, ...extraLocal];
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENT_REQUESTS, JSON.stringify(result));
  } catch {}
  return result;
}

function reconcileSettings(localSettings: AppSettings, serverSettings?: AppSettings | null): AppSettings {
  if (!serverSettings) return localSettings;
  if (!localSettings) return serverSettings;
  return {
    ...localSettings,
    ...serverSettings,
    onTrackThreshold: localSettings.onTrackThreshold ?? serverSettings.onTrackThreshold,
    needsAttentionThreshold: localSettings.needsAttentionThreshold ?? serverSettings.needsAttentionThreshold,
    atRiskThreshold: localSettings.atRiskThreshold ?? serverSettings.atRiskThreshold,
  };
}

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
  const [isProfileCustomizationOpen, setIsProfileCustomizationOpen] = useState<boolean>(false);
  const [publicProfileTarget, setPublicProfileTarget] = useState<{ user?: GoogleUser; student?: Student } | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isRoleManagementModalOpen, setIsRoleManagementModalOpen] = useState<boolean>(false);
  const [isGuestVisitorsModalOpen, setIsGuestVisitorsModalOpen] = useState<boolean>(false);
  const [currentGuestVisitor, setCurrentGuestVisitor] = useState<GuestVisitor | null>(() => {
    try {
      const saved = localStorage.getItem('classora_guest_visitor_v2');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => soundFx.enabled);

  // Role & Current Student State
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.GOOGLE_USER);
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed?.role) return parsed.role as UserRole;
      } catch {}
    }
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || 'CR';
  });

  const [currentStudentId, setCurrentStudentIdState] = useState<string>(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.GOOGLE_USER);
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed?.studentId) return parsed.studentId;
      } catch {}
    }
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT);
    return saved || '26bcs10296'; // Yahoshuva Kesaboyina (Group 5)
  });

  const [studentRequests, setStudentRequests] = useState<StudentRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENT_REQUESTS);
    if (saved) {
      try {
        const parsed: StudentRequest[] = JSON.parse(saved);
        return parsed.filter(r => !/^req-\d+$/i.test(r.id));
      } catch {}
    }
    return initialStudentRequests;
  });

  // Official Course Instructor info (Scaler++)
  const activeTeacher = {
    name: 'Noor Nigar',
    designation: 'Course Instructor (English & Communication Skills)',
    email: 'noor.nigar@scaler.com',
    company: 'Scaler',
    rating: 4.4,
    cabin: 'Scaler Faculty Studio, Floor 4',
    phone: '+91 98450 11223'
  };

  // Initialize state from localStorage or mock defaults
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (saved) {
      try {
        const parsed: Student[] = JSON.parse(saved);
        return deduplicateStudents(parsed);
      } catch {}
    }
    return deduplicateStudents(initialStudents);
  });

  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return saved ? JSON.parse(saved) : initialSessions;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    try {
      const userModRaw = localStorage.getItem(STORAGE_KEYS.USER_MODIFIED_ATTENDANCE);
      if (userModRaw) {
        const userMod = JSON.parse(userModRaw);
        if (Object.keys(userMod).length > 0) {
          const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
          if (saved) return JSON.parse(saved);
        }
      }
    } catch {}
    return initialAttendanceRecords;
  });

  const [followUps, setFollowUps] = useState<FollowUp[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOLLOWUPS);
    if (saved) {
      try {
        const parsed: FollowUp[] = JSON.parse(saved);
        const clean = parsed.filter(f => !f.isAutoGenerated && !f.id?.startsWith('FLW-') && !/^fu-\d+$/i.test(f.id));
        if (clean.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEYS.FOLLOWUPS, JSON.stringify(clean));
        }
        return clean;
      } catch {}
    }
    return initialFollowUps;
  });

  const [tasks, setTasks] = useState<CRTask[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (saved) {
      try {
        const parsed: CRTask[] = JSON.parse(saved);
        return parsed.filter(t => !/^task-\d+$/i.test(t.id));
      } catch {}
    }
    return initialTasks;
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

  // UI Navigation states with LocalStorage persistence across reloads
  const [activeTab, setActiveTabState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB);
    if (saved) return saved;
    const savedUser = localStorage.getItem(STORAGE_KEYS.GOOGLE_USER);
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed?.role === 'Student') return 'student-overview';
        if (parsed?.role === 'Teacher') return 'teacher-overview';
      } catch {}
    }
    return 'dashboard';
  });

  const setActiveTab = useCallback((tab: string) => {
    setActiveTabState(tab);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, tab);
  }, []);

  const [selectedStudentId, setSelectedStudentIdState] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_STUDENT) || null;
  });

  const setSelectedStudentId = useCallback((id: string | null) => {
    setSelectedStudentIdState(id);
    if (id) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_STUDENT, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SELECTED_STUDENT);
    }
  }, []);

  const [selectedSessionId, setSelectedSessionIdState] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_SESSION) || 'SES-107';
  });

  const setSelectedSessionId = useCallback((id: string | null) => {
    setSelectedSessionIdState(id);
    if (id) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_SESSION, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SELECTED_SESSION);
    }
  }, []);

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  // Synchronize state with Express backend
  const refreshData = useCallback(async (isSilent = false) => {
    try {
      setIsSyncing(true);
      const data = await api.getBootstrapData();
      if (data) {
        if (data.students && data.students.length > 0) {
          setStudents(prev => reconcileStudents(prev, data.students));
        }
        if (data.sessions && data.sessions.length > 0) {
          setSessions(prev => reconcileSessions(prev, data.sessions));
        }
        if (data.attendanceRecords) {
          setAttendanceRecords(prev => reconcileAttendance(prev, data.attendanceRecords));
        }
        if (data.followUps) {
          setFollowUps(prev => reconcileFollowUps(prev, data.followUps));
        }
        if (data.tasks) {
          setTasks(prev => reconcileTasks(prev, data.tasks));
        }
        if (data.studentRequests) {
          setStudentRequests(prev => reconcileRequests(prev, data.studentRequests));
        }
        if (data.settings) {
          setSettings(prev => reconcileSettings(prev, data.settings));
        }
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

  // Auto-reconnect listeners and 5s real-time heartbeat synchronization with Express backend
  useEffect(() => {
    const handleOnline = () => {
      refreshData(true);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshData(true);
      }
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('focus', handleOnline);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Continuous 5s real-time heartbeat synchronization with Express backend
    const timer = setInterval(() => {
      if (!isSyncing) {
        refreshData(true);
      }
    }, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('focus', handleOnline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(timer);
    };
  }, [isBackendConnected, isSyncing, refreshData]);

  // Initial load from backend with fallback and smart reconciliation
  useEffect(() => {
    let isMounted = true;
    const initApp = async () => {
      try {
        setIsLoading(true);

        // Immediate cleanup of any testing/auto-generated follow-ups from localStorage
        try {
          const rawFu = localStorage.getItem(STORAGE_KEYS.FOLLOWUPS);
          if (rawFu) {
            const parsed = JSON.parse(rawFu);
            const clean = parsed.filter((f: any) => !f.isAutoGenerated && !f.id?.startsWith('FLW-') && !/^fu-\d+$/i.test(f.id));
            if (clean.length !== parsed.length) {
              localStorage.setItem(STORAGE_KEYS.FOLLOWUPS, JSON.stringify(clean));
              setFollowUps(clean);
            }
          }
        } catch {}

        const data = await api.getBootstrapData();
        if (isMounted && data) {
          if (data.students && data.students.length > 0) {
            setStudents(prev => reconcileStudents(prev, data.students));
          }
          if (data.sessions && data.sessions.length > 0) {
            setSessions(prev => reconcileSessions(prev, data.sessions));
          }
          if (data.attendanceRecords) {
            setAttendanceRecords(prev => reconcileAttendance(prev, data.attendanceRecords));
          }
          if (data.followUps) {
            setFollowUps(prev => reconcileFollowUps(prev, data.followUps));
          }
          if (data.tasks) {
            setTasks(prev => reconcileTasks(prev, data.tasks));
          }
          if (data.studentRequests) {
            setStudentRequests(prev => reconcileRequests(prev, data.studentRequests));
          }
          if (data.settings) {
            setSettings(prev => reconcileSettings(prev, data.settings));
          }
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
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Attendance marking is disabled in read-only showcase.', 'info');
      return;
    }
    if (userRole !== 'Teacher' && userRole !== 'Admin') {
      addToast('Permission Denied: Only faculty teachers and course admins have permission to record attendance.', 'error');
      return;
    }
    const timestamp = new Date().toISOString();
    setAttendanceRecords(prev => {
      const filtered = prev.filter(r => !(r.sessionId === sessionId && r.studentId === studentId));
      const updated = [...filtered, { sessionId, studentId, status, remarks, timestamp }];
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(updated));
      return updated;
    });

    // Save to userModifiedAttendance registry to protect against serverless resets
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER_MODIFIED_ATTENDANCE) || '{}';
      const parsed = JSON.parse(raw);
      parsed[`${sessionId}_${studentId}`] = { status, timestamp, remarks, updatedAt: Date.now() };
      localStorage.setItem(STORAGE_KEYS.USER_MODIFIED_ATTENDANCE, JSON.stringify(parsed));
    } catch {}

    api.markAttendance(sessionId, studentId, status, remarks).catch(err => {
      console.warn('[Classora Backend] markAttendance failed:', err);
    });
  }, [userRole, addToast]);

  const bulkMarkAttendance = useCallback((
    sessionId: string,
    records: Array<{ studentId: string; status: AttendanceStatus }>
  ) => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Bulk attendance marking is disabled in read-only showcase.', 'info');
      return;
    }
    if (userRole !== 'Teacher' && userRole !== 'Admin') {
      addToast('Permission Denied: Only faculty teachers and course admins have permission to record attendance.', 'error');
      return;
    }
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
      const updated = [...filtered, ...newRecords];
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(updated));
      return updated;
    });

    // Save to userModifiedAttendance registry
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER_MODIFIED_ATTENDANCE) || '{}';
      const parsed = JSON.parse(raw);
      records.forEach(r => {
        parsed[`${sessionId}_${r.studentId}`] = { status: r.status, timestamp, updatedAt: Date.now() };
      });
      localStorage.setItem(STORAGE_KEYS.USER_MODIFIED_ATTENDANCE, JSON.stringify(parsed));
    } catch {}

    api.bulkMarkAttendance(sessionId, records).catch(err => {
      console.warn('[Classora Backend] bulkMarkAttendance failed:', err);
    });

    addToast(`Saved attendance for ${records.length} students!`, 'success');
  }, [userRole, addToast]);

  const resetSessionAttendance = useCallback((sessionId: string) => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Modifying attendance is disabled in read-only showcase.', 'info');
      return;
    }
    if (userRole !== 'Teacher' && userRole !== 'Admin') {
      addToast('Permission Denied: Only faculty teachers and course admins have permission to reset attendance.', 'error');
      return;
    }
    setAttendanceRecords(prev => {
      const updated = prev.filter(r => r.sessionId !== sessionId);
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(updated));
      return updated;
    });

    // Clean userModifiedAttendance registry for this session
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER_MODIFIED_ATTENDANCE) || '{}';
      const parsed = JSON.parse(raw);
      Object.keys(parsed).forEach(k => {
        if (k.startsWith(`${sessionId}_`)) delete parsed[k];
      });
      localStorage.setItem(STORAGE_KEYS.USER_MODIFIED_ATTENDANCE, JSON.stringify(parsed));
    } catch {}

    api.resetSessionAttendance(sessionId).catch(err => {
      console.warn('[Classora Backend] resetSessionAttendance failed:', err);
    });
    addToast('Attendance reset for session', 'info');
  }, [userRole, addToast]);

  const addStudent = useCallback((studentData: Partial<Student> & { name: string; email: string; phone: string; batch: string }) => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Student enrollment is disabled in read-only showcase.', 'info');
      return;
    }
    if (userRole !== 'Teacher' && userRole !== 'Admin') {
      addToast('Permission Denied: Only faculty teachers and course admins have authority to enroll students.', 'error');
      return;
    }
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
  }, [userRole, students.length, addToast]);

  const updateUserRole = useCallback(async (userId: string, newRole: UserRole): Promise<boolean> => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Modifying user positions requires Administrative privileges.', 'error');
      return false;
    }
    try {
      const res = await api.updateUserRole(userId, newRole);
      if (res && res.user) {
        // If the updated user is the currently logged in user, update active role
        if (currentUser.id === userId || currentUser.email === res.user.email) {
          setUserRoleState(newRole);
          localStorage.setItem(STORAGE_KEYS.ROLE, newRole);
          setCurrentUser(prev => ({ ...prev, role: newRole }));
        }
        addToast(`Position updated to ${newRole} for ${res.user.name}`, 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Failed to update user role:', err);
      addToast(err?.message || 'Failed to update user role', 'error');
      return false;
    }
  }, [userRole, currentUser.id, currentUser.email, addToast]);

  const updateStudent = useCallback((id: string, updates: Partial<Student>) => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Modifying student records is disabled in read-only showcase.', 'info');
      return;
    }
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    api.updateStudent(id, updates).catch(err => {
      console.warn('[Classora Backend] updateStudent failed:', err);
    });
    addToast('Student details updated', 'success');
  }, [userRole, addToast]);

  const deleteStudent = useCallback((id: string) => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Archiving students is disabled in read-only showcase.', 'info');
      return;
    }
    setStudents(prev => prev.filter(s => s.id !== id));
    setAttendanceRecords(prev => prev.filter(r => r.studentId !== id));
    setFollowUps(prev => prev.filter(f => f.studentId !== id));
    if (selectedStudentId === id) setSelectedStudentId(null);
    api.deleteStudent(id).catch(err => {
      console.warn('[Classora Backend] deleteStudent failed:', err);
    });
    addToast('Student record archived/removed', 'info');
  }, [userRole, selectedStudentId, addToast]);

  const addCRRemark = useCallback((studentId: string, text: string) => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Adding remarks is disabled in read-only showcase.', 'info');
      return;
    }
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
  }, [userRole, addToast]);

  const addSession = useCallback((sessionData: Omit<Session, 'id'>) => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Scheduling sessions is disabled in read-only showcase.', 'info');
      return;
    }
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
  }, [userRole, sessions.length, addToast]);

  const updateSession = useCallback((id: string, updates: Partial<Session>) => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Modifying sessions is disabled in read-only showcase.', 'info');
      return;
    }
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    api.updateSession(id, updates).catch(err => {
      console.warn('[Classora Backend] updateSession failed:', err);
    });
    addToast('Session updated successfully', 'success');
  }, [userRole, addToast]);

  const deleteSession = useCallback((id: string) => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Deleting sessions is disabled in read-only showcase.', 'info');
      return;
    }
    setSessions(prev => prev.filter(s => s.id !== id));
    setAttendanceRecords(prev => prev.filter(r => r.sessionId !== id));
    api.deleteSession(id).catch(err => {
      console.warn('[Classora Backend] deleteSession failed:', err);
    });
    addToast('Session removed', 'info');
  }, [userRole, addToast]);

  const addFollowUp = useCallback((followUpData: Omit<FollowUp, 'id' | 'dateIdentified'>) => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Follow-up logging is disabled in read-only showcase.', 'info');
      return;
    }
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
  }, [userRole, addToast]);

  const updateFollowUp = useCallback((id: string, updates: Partial<FollowUp>) => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Updating follow-ups is disabled in read-only showcase.', 'info');
      return;
    }
    setFollowUps(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    api.updateFollowUp(id, updates).catch(err => {
      console.warn('[Classora Backend] updateFollowUp failed:', err);
    });
    addToast('Follow-up status updated', 'success');
  }, [userRole, addToast]);

  const deleteFollowUp = useCallback((id: string) => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Deleting follow-ups is disabled in read-only showcase.', 'info');
      return;
    }
    setFollowUps(prev => prev.filter(f => f.id !== id));
    api.deleteFollowUp(id).catch(err => {
      console.warn('[Classora Backend] deleteFollowUp failed:', err);
    });
    addToast('Follow-up removed', 'info');
  }, [userRole, addToast]);

  const clearAllFollowUps = useCallback(() => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Clearing follow-ups is disabled in read-only showcase.', 'info');
      return;
    }
    setFollowUps([]);
    localStorage.removeItem(STORAGE_KEYS.FOLLOWUPS);
    api.clearAllFollowUps().catch(err => {
      console.warn('[Classora Backend] clearAllFollowUps failed:', err);
    });
    addToast('All follow-ups cleared successfully', 'info');
  }, [userRole, addToast]);

  const toggleTask = useCallback((id: string) => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Task toggling is disabled in read-only showcase.', 'info');
      return;
    }
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
  }, [userRole]);

  const addTask = useCallback((taskData: Omit<CRTask, 'id'>) => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Creating tasks is disabled in read-only showcase.', 'info');
      return;
    }
    const newTask: CRTask = {
      id: `TSK-${Date.now().toString().slice(-3)}`,
      ...taskData,
    };
    setTasks(prev => [newTask, ...prev]);
    api.createTask(newTask).catch(err => {
      console.warn('[Classora Backend] createTask failed:', err);
    });
    addToast('New CR Task created', 'success');
  }, [userRole, addToast]);

  const updateTask = useCallback((id: string, updates: Partial<CRTask>) => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Updating tasks is disabled in read-only showcase.', 'info');
      return;
    }
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    api.updateTask(id, updates).catch(err => {
      console.warn('[Classora Backend] updateTask failed:', err);
    });
    addToast('Task updated', 'success');
  }, [userRole, addToast]);

  const deleteTask = useCallback((id: string) => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Deleting tasks is disabled in read-only showcase.', 'info');
      return;
    }
    setTasks(prev => prev.filter(t => t.id !== id));
    api.deleteTask(id).catch(err => {
      console.warn('[Classora Backend] deleteTask failed:', err);
    });
    addToast('Task deleted', 'info');
  }, [userRole, addToast]);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Settings customization is disabled in read-only showcase.', 'info');
      return;
    }
    setSettings(prev => ({ ...prev, ...updates }));
    api.updateSettings(updates).catch(err => {
      console.warn('[Classora Backend] updateSettings failed:', err);
    });
    addToast('Settings saved successfully', 'success');
  }, [userRole, addToast]);

  // Student Portal Request submission
  const submitStudentRequest = useCallback((req: { type: StudentRequest['type']; subject: string; message: string; studentId?: string }) => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Submitting requests is disabled in read-only showcase.', 'info');
      return;
    }
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

    addToast(`Request "${req.subject}" submitted to Lead CR & Noor Nigar.`, 'success');
  }, [userRole, currentStudentId, students, addToast]);

  const resolveStudentRequest = useCallback((id: string, responseText: string, newStatus: 'Approved' | 'Resolved' = 'Resolved') => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Resolving requests is disabled in read-only showcase.', 'info');
      return;
    }
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
  }, [userRole, studentRequests, selectedSessionId, addToast, refreshData, refreshActivityLogs]);

  // Teacher grading & feedback methods with strict column limit enforcement and persistent tracking
  const updateStudentSkillScore = useCallback((studentId: string, skill: keyof StudentSkillScores, rawScore: number) => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Competency evaluation is disabled in read-only showcase.', 'info');
      return;
    }
    const clampedScore = Math.max(0, Math.min(100, Math.round(Number(rawScore) || 0)));
    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.id !== studentId) return s;
        return {
          ...s,
          skills: {
            ...s.skills,
            [skill]: clampedScore
          }
        };
      });
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updated));
      return updated;
    });

    // Save to userModifiedScores registry to preserve across all reloads
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER_MODIFIED_SCORES) || '{}';
      const parsed = JSON.parse(raw);
      parsed[`${studentId}_${skill}`] = { score: clampedScore, updatedAt: Date.now() };
      localStorage.setItem(STORAGE_KEYS.USER_MODIFIED_SCORES, JSON.stringify(parsed));
    } catch {}

    api.updateStudentSkill(studentId, skill, clampedScore).catch(err => {
      console.warn('[Classora Backend] updateStudentSkill failed:', err);
    });
    addToast(`Updated ${skill} competency score: ${clampedScore}/100`, 'success');
  }, [userRole, addToast]);

  const updateStudentAssignmentScore = useCallback((studentId: string, assignmentId: string, rawScore: number) => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Grading assignments is disabled in read-only showcase.', 'info');
      return;
    }
    let finalClampedScore = 0;
    let colMax = 25;
    let colTitle = '';

    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.id !== studentId) return s;
        return {
          ...s,
          assignments: (s.assignments || []).map(a => {
            if (a.id !== assignmentId) return a;
            colTitle = a.title;
            colMax = getCriteriaMaxScore(a.id, a.title, a.maxScore || 25);
            finalClampedScore = Math.max(0, Math.min(colMax, Math.round(Number(rawScore) || 0)));
            return {
              ...a,
              score: finalClampedScore,
              maxScore: colMax,
              status: 'Graded' as const
            };
          })
        };
      });
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updated));
      return updated;
    });

    // Save to userModifiedScores registry to preserve across all reloads
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER_MODIFIED_SCORES) || '{}';
      const parsed = JSON.parse(raw);
      parsed[`${studentId}_${assignmentId}`] = { score: finalClampedScore, updatedAt: Date.now() };
      localStorage.setItem(STORAGE_KEYS.USER_MODIFIED_SCORES, JSON.stringify(parsed));
    } catch {}

    api.updateStudentAssignment(studentId, assignmentId, finalClampedScore).catch(err => {
      console.warn('[Classora Backend] updateStudentAssignment failed:', err);
    });

    if (rawScore > colMax) {
      addToast(`Entered ${rawScore} exceeds limit for ${colTitle || 'assignment'}. Clamped to max ${colMax}.`, 'warning');
    } else if (rawScore < 0) {
      addToast('Score cannot be negative. Set to 0.', 'warning');
    } else {
      addToast(`Assessment evaluated: ${finalClampedScore}/${colMax} saved`, 'success');
    }
  }, [userRole, addToast]);

  const addFacultyFeedback = useCallback((studentId: string, remarkText: string) => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Adding faculty feedback is disabled in read-only showcase.', 'info');
      return;
    }
    const remark: CRRemark = {
      id: `FCT-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      author: 'Noor Nigar (Instructor)',
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

  const openPublicProfile = useCallback((target: string | Student) => {
    if (typeof target === 'string') {
      const trimmed = target.trim().toLowerCase();
      const foundStudent = students.find(s =>
        s.id.toLowerCase() === trimmed ||
        (s.rollNo && s.rollNo.toLowerCase() === trimmed) ||
        s.email.toLowerCase() === trimmed
      );
      if (foundStudent) {
        setPublicProfileTarget({ student: foundStudent });
        return;
      }
      if (currentUser.id === target || currentUser.email.toLowerCase() === trimmed) {
        setPublicProfileTarget({ user: currentUser });
        return;
      }
      if (activeTeacher.email.toLowerCase() === trimmed) {
        setPublicProfileTarget({
          user: {
            id: 'teacher-nn',
            name: activeTeacher.name,
            email: activeTeacher.email,
            avatar: currentUser.email === activeTeacher.email ? currentUser.avatar : '',
            role: 'Teacher',
            isGoogleAuthenticated: true,
            headline: 'Course Coordinator & Faculty • English Language & Communication Skills',
            bio: 'Lead Instructor for English Communication Skills at Scaler School of Technology.',
            publicLinks: currentUser.publicLinks || {}
          }
        });
        return;
      }
      // If student not found directly, create minimal preview if formatted like roll number
      if (/^26bcs\d{5}$/i.test(trimmed)) {
        setPublicProfileTarget({
          student: {
            id: target,
            rollNo: target,
            name: `Student (${target.toUpperCase()})`,
            email: `${target.toLowerCase()}@sst.scaler.com`,
            phone: '+91 98000 00000',
            batch: 'SST 2026 Cohort',
            group: 'Group 1',
            joiningDate: '2024-08-01',
            currentLevel: 'Intermediate (B1)',
            initialRemarks: 'Enrolled SST 2026 student.',
            lastActivity: 'Active',
            skills: { communication: 80, grammar: 80, vocabulary: 80, pronunciation: 80, participation: 80, assignments: 80, assessments: 80 },
            previousOverallScore: 80,
            assignments: [],
            crRemarks: [],
            historicalScores: []
          }
        });
        return;
      }
    } else {
      setPublicProfileTarget({ student: target });
    }
  }, [students, currentUser, activeTeacher]);

  const closePublicProfile = useCallback(() => {
    setPublicProfileTarget(null);
    if (typeof window !== 'undefined' && window.location.search.includes('profile=')) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const profileParam = params.get('profile');
      if (profileParam) {
        const timer = setTimeout(() => {
          openPublicProfile(profileParam);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [openPublicProfile]);

  const updateUserProfile = useCallback(async (updates: {
    avatar?: string;
    bio?: string;
    headline?: string;
    publicLinks?: UserSocialLinks;
    name?: string;
  }) => {
    if (userRole === 'Guest') {
      addToast('Guest Visitor Mode: Profile changes cannot be permanently saved.', 'info');
      return;
    }
    setCurrentUser(prev => {
      const updated: GoogleUser = {
        ...prev,
        avatar: updates.avatar !== undefined ? updates.avatar : prev.avatar,
        bio: updates.bio !== undefined ? updates.bio : prev.bio,
        headline: updates.headline !== undefined ? updates.headline : prev.headline,
        name: updates.name !== undefined ? updates.name : prev.name,
        publicLinks: {
          ...(prev.publicLinks || {}),
          ...(updates.publicLinks || {})
        }
      };
      localStorage.setItem(STORAGE_KEYS.GOOGLE_USER, JSON.stringify(updated));
      return updated;
    });

    const studentTargetId = currentUser.studentId || (currentUser.role === 'Student' || currentUser.role === 'CR' ? currentUser.id : null);
    setStudents(prev => {
      let changed = false;
      const next = prev.map(s => {
        if (
          (studentTargetId && s.id === studentTargetId) ||
          (currentUser.email && s.email.toLowerCase() === currentUser.email.toLowerCase()) ||
          (s.id === currentUser.id)
        ) {
          changed = true;
          return {
            ...s,
            avatar: updates.avatar !== undefined ? updates.avatar : s.avatar,
            bio: updates.bio !== undefined ? updates.bio : s.bio,
            headline: updates.headline !== undefined ? updates.headline : s.headline,
            name: updates.name !== undefined ? updates.name : s.name,
            publicLinks: {
              ...(s.publicLinks || {}),
              ...(updates.publicLinks || {})
            }
          };
        }
        return s;
      });
      if (changed) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(next));
      }
      return next;
    });

    const targetIdentifier = currentUser.id || currentUser.email;
    if (targetIdentifier) {
      try {
        await api.updateUserProfile(targetIdentifier, updates);
      } catch (err) {
        console.warn('[Classora Backend] updateUserProfile failed:', err);
      }
    }

    addToast('Profile, display photo, and public links updated!', 'success');
  }, [userRole, currentUser, addToast]);

  const loginAsGuest = useCallback(async (customName?: string) => {
    try {
      const deviceType = window.innerWidth <= 768 ? 'Mobile' : (window.innerWidth <= 1024 ? 'Tablet' : 'Desktop');
      const userAgent = navigator.userAgent;
      
      let guestUser: GoogleUser = {
        id: `gst_${Date.now()}`,
        name: customName?.trim() || `Guest Visitor #${Math.floor(1000 + Math.random() * 9000)}`,
        email: `guest.${Date.now()}@classora.preview`,
        avatar: '',
        role: 'Guest',
        isGoogleAuthenticated: false,
      };

      try {
        const res = await api.recordGuestSession({
          guestName: guestUser.name,
          deviceType,
          userAgent
        });
        if (res && res.user) {
          guestUser = { ...res.user, isGoogleAuthenticated: false };
          if (res.visitor) {
            setCurrentGuestVisitor(res.visitor);
            localStorage.setItem('classora_guest_visitor_v2', JSON.stringify(res.visitor));
          }
        }
      } catch (e) {
        console.warn('[Classora] Backend guest session record notice:', e);
      }

      setCurrentUser(guestUser);
      localStorage.setItem(STORAGE_KEYS.GOOGLE_USER, JSON.stringify(guestUser));
      setUserRole('Guest');
      setActiveTab('dashboard');
      soundFx.playCelebration();
      addToast(`Welcome to Classora Showcase Preview, ${guestUser.name}! (Read-Only Mode)`, 'success');
    } catch (err: any) {
      console.error('Failed to log in as guest:', err);
      addToast('Could not initialize guest preview session.', 'error');
    }
  }, [setUserRole, setActiveTab, addToast]);

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
    setCurrentGuestVisitor(null);
    localStorage.removeItem(STORAGE_KEYS.GOOGLE_USER);
    localStorage.removeItem('classora_guest_visitor_v2');
    addToast('Signed out of account', 'info');
  }, [addToast]);

  // Periodic heartbeat ping for active guest session
  useEffect(() => {
    if (userRole === 'Guest' && currentGuestVisitor?.id) {
      const interval = setInterval(() => {
        api.pingGuestSession(currentGuestVisitor.id);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [userRole, currentGuestVisitor?.id]);

  const toggleSound = useCallback(() => {
    const isEnabled = soundFx.toggle();
    setSoundEnabled(isEnabled);
    addToast(isEnabled ? 'Sound effects enabled' : 'Sound effects muted', 'info');
  }, [addToast]);

  const refreshRealTimeData = useCallback(async () => {
    try {
      setIsSyncing(true);
      await api.resyncOfficial();
      await refreshData(true);
      addToast('Classora database re-synchronized with live official SST 2026 registry', 'success');
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
      localStorage.removeItem(STORAGE_KEYS.USER_MODIFIED_SCORES);
      localStorage.removeItem(STORAGE_KEYS.USER_MODIFIED_ATTENDANCE);

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
      addToast('Live SST 2026 dataset refreshed', 'info');
    } finally {
      setIsSyncing(false);
    }
  }, [refreshData, addToast]);

  const resetToDemoData = refreshRealTimeData;

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
        isProfileCustomizationOpen,
        setIsProfileCustomizationOpen,
        publicProfileTarget,
        openPublicProfile,
        closePublicProfile,
        updateUserProfile,
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
        clearAllFollowUps,

        toggleTask,
        addTask,
        updateTask,
        deleteTask,

        updateSettings,
        refreshRealTimeData,
        resetToDemoData,
        activityLogs,
        refreshActivityLogs,
        logBroadcast,
        isRoleManagementModalOpen,
        setIsRoleManagementModalOpen,
        updateUserRole,
        isGuestVisitorsModalOpen,
        setIsGuestVisitorsModalOpen,
        loginAsGuest,
        currentGuestVisitor,
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
