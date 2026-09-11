import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Calendar as CalendarIcon,
  Menu,
  ChevronDown,
  User,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  HelpCircle,
  LogOut,
  RefreshCw,
  Keyboard,
  Key,
  Crown,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Classora3DLogo, GoogleIcon } from '../common/Classora3DLogo';
import { soundFx } from '../../utils/soundEffects';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const {
    activeTab,
    notifications,
    unreadNotificationCount,
    isNotificationOpen,
    setIsNotificationOpen,
    setIsSearchOpen,
    resetToDemoData,
    setActiveTab,
    openStudentProfile,
    userRole,
    setUserRole,
    currentStudent,
    currentStudentStats,
    activeTeacher,
    students,
    setCurrentStudentId,
    currentUser,
    signOutGoogle,
    setIsGoogleAuthModalOpen,
    setIsChangePasswordModalOpen,
    isOnboardingOpen,
    setIsOnboardingOpen,
    isShortcutsOpen,
    setIsShortcutsOpen,
    isRoleManagementModalOpen,
    setIsRoleManagementModalOpen,
    soundEnabled,
    toggleSound,
    soundVolume,
    setSoundVolume,
    isBackendConnected,
    isSyncing,
    refreshData
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Measure backend ping
  useEffect(() => {
    let timer: any;
    const measurePing = async () => {
      try {
        const start = performance.now();
        const res = await fetch('/api/health');
        if (res.ok) {
          const latency = Math.round(performance.now() - start);
          setLatencyMs(latency);
        }
      } catch {
        setLatencyMs(null);
      }
    };

    measurePing();
    timer = setInterval(measurePing, 10000);
    return () => clearInterval(timer);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsNotificationOpen]);

  // Today's formatted date
  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const getPageTitle = () => {
    if (userRole === 'Student') {
      switch (activeTab) {
        case 'student-overview': return 'Student Portal Overview';
        case 'student-attendance': return 'My Attendance & Timetable';
        case 'student-grades': return 'My Assessments & Competencies';
        case 'student-support': return 'Submit Leave / CR Support';
        case 'groups': return 'My Official Discussion Group';
        default: return 'Student Portal Overview';
      }
    }
    if (userRole === 'Teacher') {
      switch (activeTab) {
        case 'teacher-overview': return 'Course Coordinator Overview';
        case 'teacher-gradebook': return 'Assessment Gradebook';
        case 'teacher-attendance': return 'Attendance & Excuse Audit';
        case 'teacher-feedback': return 'Student Mentorship & Notes';
        case 'groups': return 'Discussion Groups (Groups 1–7)';
        case 'sessions': return 'Curriculum & Session Schedule';
        case 'students': return 'Student Directory & Records';
        case 'performance': return 'Competency & Skill Analytics';
        case 'reports': return 'Class Performance Reports';
        default: return 'Course Coordinator Overview';
      }
    }
    switch (activeTab) {
      case 'dashboard': return 'English CR Dashboard';
      case 'students': return 'Student Directory & Records';
      case 'sessions': return 'Curriculum & Session Schedule';
      case 'attendance': return 'Attendance Marking Console';
      case 'groups': return 'Discussion Groups (Groups 1–7)';
      case 'performance': return 'Performance & Skill Analytics';
      case 'follow-ups': return 'Student Follow-up Tracker';
      case 'cr-tasks': return 'CR Operations & Task Board';
      case 'reports': return 'Executive Reports & Analytics';
      case 'settings': return 'Tracker Configuration & Rules';
      default: return 'English CR Dashboard';
    }
  };

  const getProfileDetails = () => {
    if (currentUser.isGoogleAuthenticated) {
      const isUserAdmin = currentUser.role === 'Admin';
      const isUserTeacher = currentUser.role === 'Teacher';
      const isUserCR = currentUser.role === 'CR';

      return {
        initials: currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'SST',
        name: currentUser.name,
        roleTitle: isUserAdmin
          ? 'Course Super Administrator'
          : isUserTeacher
          ? 'Course Coordinator & Faculty'
          : isUserCR
          ? 'Lead English CR'
          : 'Enrolled Student',
        email: currentUser.email,
        badgeText: isUserAdmin
          ? '👑 Super Admin'
          : isUserTeacher
          ? 'Faculty Coordinator'
          : isUserCR
          ? 'Lead CR'
          : currentStudentStats
          ? `${currentStudentStats.attendancePercentage}% Attendance`
          : 'SST Student',
        bg: isUserAdmin
          ? 'bg-amber-600'
          : isUserTeacher
          ? 'bg-indigo-600'
          : isUserCR
          ? 'bg-blue-600'
          : 'bg-emerald-600'
      };
    }
    if (userRole === 'Admin') {
      return {
        initials: 'YK',
        name: 'Yahoshuva Kesaboyina',
        roleTitle: 'Course Super Administrator',
        email: 'yahoshuva.26bcs10296@sst.scaler.com',
        badgeText: '👑 Super Admin',
        bg: 'bg-amber-600'
      };
    }
    if (userRole === 'Student' && currentStudent) {
      return {
        initials: currentStudent.name.split(' ').map(n => n[0]).join(''),
        name: currentStudent.name,
        roleTitle: `Student • ${currentStudent.batch.split(' ')[0]}`,
        email: currentStudent.email,
        badgeText: currentStudentStats ? `${currentStudentStats.attendancePercentage}% Attendance` : 'Enrolled Student',
        bg: 'bg-emerald-600'
      };
    }
    if (userRole === 'Teacher') {
      return {
        initials: activeTeacher.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'NN',
        name: activeTeacher.name,
        roleTitle: 'Course Instructor & Faculty',
        email: activeTeacher.email,
        badgeText: 'Course Instructor',
        bg: 'bg-indigo-600'
      };
    }
    return {
      initials: 'AS',
      name: 'Aarav Sharma',
      roleTitle: 'Lead English CR',
      email: 'aarav.sharma@sst.scaler.com',
      badgeText: 'Elected Class Rep',
      bg: 'bg-blue-600'
    };
  };

  const profile = getProfileDetails();

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-3 sm:px-5 lg:px-7 flex items-center justify-between sticky top-0 z-30 shadow-subtle gap-2">
      {/* Left: Mobile hamburger, Logo, & Page Title */}
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1 md:flex-initial">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors shrink-0 cursor-pointer"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 sm:space-x-2.5 min-w-0">
          <div className="lg:hidden shrink-0">
            <Classora3DLogo size="sm" showText={false} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="lg:hidden font-black text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 shrink-0">
                Classora
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
                {getPageTitle()}
              </h2>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-[11px] text-slate-500 truncate">
              <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 shrink-0">
                Subject - 2 • 4 Weeks
              </span>
              <span>•</span>
              <CalendarIcon className="w-3 h-3 text-blue-600 shrink-0" />
              <span className="truncate">{todayFormatted}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Position Indicator (Concise & uncluttered on medium/large screens) */}
      <div className="hidden md:flex items-center space-x-2 shrink-0">
        {userRole === 'Admin' ? (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-2xl bg-amber-500/15 text-amber-800 border border-amber-300 shadow-2xs">
              <span className="text-xs">👑</span>
              <span className="text-xs font-extrabold tracking-tight">Super Admin</span>
              <span className="hidden 2xl:inline text-[10px] font-semibold text-amber-700 bg-amber-200/60 px-1.5 py-0.2 rounded-md">
                Full Authority
              </span>
            </div>
            <button
              onClick={() => {
                soundFx.playPop();
                setIsRoleManagementModalOpen(true);
              }}
              className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-2xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all cursor-pointer"
              title="Appoint Teachers, CRs, and manage institutional staff"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Role Manager</span>
            </button>
          </div>
        ) : userRole === 'Teacher' ? (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-2xl bg-indigo-50 text-indigo-800 border border-indigo-200 shadow-2xs">
              <span className="text-xs">👨‍🏫</span>
              <span className="text-xs font-extrabold tracking-tight">Faculty</span>
              <span className="hidden 2xl:inline text-[10px] font-semibold text-indigo-700 bg-indigo-100 px-1.5 py-0.2 rounded-md">
                Attendance & CR Authority
              </span>
            </div>
            <button
              onClick={() => {
                soundFx.playPop();
                setIsRoleManagementModalOpen(true);
              }}
              className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all cursor-pointer"
              title="Appoint or remove Class Representatives (CR)"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Manage CRs</span>
            </button>
          </div>
        ) : userRole === 'CR' ? (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-2xl bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs">
            <span className="text-xs">🎓</span>
            <span className="text-xs font-extrabold tracking-tight">Class Rep (CR)</span>
            <span className="hidden 2xl:inline text-[10px] font-semibold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded-md">
              Peer Lead
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
            <span className="text-xs">👨‍🎓</span>
            <span className="text-xs font-extrabold tracking-tight">Student Portal</span>
            <span className="hidden 2xl:inline text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md">
              Verified SST Cohort
            </span>
          </div>
        )}
      </div>

      {/* Right: Sync Status, Search, Shortcuts, Audio, Notifications, Profile */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
        {/* Live Database Sync Badge & Ping */}
        <button
          onClick={() => refreshData()}
          disabled={isSyncing}
          className={`flex items-center space-x-1.5 px-2 sm:px-2.5 py-1 rounded-full text-[11px] font-semibold border select-none transition-all cursor-pointer ${
            isBackendConnected
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 ring-2 ring-amber-400/20'
          }`}
          title={isBackendConnected ? `Express API Live (${latencyMs !== null ? `${latencyMs}ms ping • ` : ''}Click to force re-sync)` : "Backend offline • Local cache active (Click to retry connection)"}
        >
          {isSyncing ? (
            <RefreshCw className="w-2.5 h-2.5 animate-spin text-blue-600 shrink-0" />
          ) : (
            <span className={`w-2 h-2 rounded-full shrink-0 ${isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          )}
          <span className="text-[10px] sm:text-[11px]">
            {isSyncing ? (
              'Syncing...'
            ) : isBackendConnected ? (
              <>
                <span className="hidden xl:inline">{latencyMs !== null ? `${latencyMs}ms • ` : ''}Live DB</span>
                <span className="xl:hidden">Live</span>
              </>
            ) : (
              <span className="font-bold text-amber-900">Offline</span>
            )}
          </span>
        </button>

        {/* Global Search Button / Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="sm:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          title="Search (⌘K)"
          aria-label="Search"
        >
          <Search className="w-4 h-4 text-slate-600" />
        </button>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="hidden sm:flex items-center space-x-2 px-2.5 sm:px-3 py-1.5 bg-slate-100/80 hover:bg-slate-200/70 text-slate-600 rounded-xl text-xs font-medium transition-colors border border-slate-200/60 shadow-2xs cursor-pointer"
          title="Command Palette & Quick Search (Ctrl+K or /)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden lg:inline">Command Palette</span>
          <span className="lg:hidden">Search</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 bg-white rounded border border-slate-300 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Keyboard Shortcuts Button */}
        <button
          onClick={() => {
            soundFx.playPop();
            setIsShortcutsOpen(true);
          }}
          className="hidden xl:flex items-center space-x-1 p-2 bg-slate-100/80 hover:bg-slate-200/70 text-slate-600 rounded-xl transition-all border border-slate-200/60 shadow-2xs cursor-pointer"
          title="Keyboard Shortcuts Cheat Sheet (Press ?)"
          aria-label="Keyboard Shortcuts"
        >
          <Keyboard className="w-3.5 h-3.5 text-slate-500" />
        </button>

        {/* Guided Tour Button */}
        <button
          onClick={() => {
            soundFx.playPop();
            setIsOnboardingOpen(true);
          }}
          className="hidden xl:flex items-center space-x-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all border border-indigo-200/80 shadow-2xs cursor-pointer"
          title="Interactive Feature Walkthrough"
        >
          <span>🚀</span>
          <span>Tour</span>
        </button>

        {/* Sound FX Audio Toggle */}
        <button
          onClick={() => toggleSound()}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            soundEnabled
              ? 'text-blue-600 hover:bg-blue-50 bg-blue-50/60'
              : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
          }`}
          title={soundEnabled ? `Audio Sound FX (${Math.round(soundVolume * 100)}% - Click to Mute)` : 'Enable Audio Sound FX'}
          aria-label="Toggle Sound Effects"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Google Sign In button if not signed in */}
        {!currentUser.isGoogleAuthenticated && (
          <button
            onClick={() => {
              soundFx.playPop();
              setIsGoogleAuthModalOpen(true);
            }}
            className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer"
            title="Sign in with Google"
          >
            <GoogleIcon className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}

        {/* Notifications Tray */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notification Popover Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-slate-900 text-sm">Notifications</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
                    {unreadNotificationCount}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">Classora Sync</span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No active alerts. All systems running smoothly!
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setIsNotificationOpen(false);
                        if (n.actionTab) setActiveTab(n.actionTab);
                      }}
                      className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start space-x-3"
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                          n.type === 'urgent'
                            ? 'bg-rose-500'
                            : n.type === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-blue-500'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 leading-tight">
                          {n.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                          {n.description}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {n.timestamp}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile / Role Menu (Unified with Google Persona & unclipped name) */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 p-1 sm:pl-1.5 sm:pr-2.5 sm:py-1 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
            title={`${profile.name} (${profile.roleTitle})`}
          >
            <div className="relative shrink-0">
              <div className={`w-8 h-8 rounded-xl ${profile.bg} text-white font-bold flex items-center justify-center text-xs shadow-xs overflow-hidden`}>
                {currentUser.isGoogleAuthenticated && currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-xl object-cover" />
                ) : (
                  profile.initials
                )}
              </div>
              {currentUser.isGoogleAuthenticated && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-2xs ring-1 ring-slate-100">
                  <GoogleIcon className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
            <div className="hidden sm:block text-left min-w-0">
              <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[130px]">{profile.name}</p>
              <p className="text-[10px] text-slate-500 font-medium truncate max-w-[130px] hidden lg:block">{profile.roleTitle}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block shrink-0" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900">{profile.name}</p>
                  {currentUser.isGoogleAuthenticated && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                      <GoogleIcon className="w-2.5 h-2.5" /> Google
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 truncate">{profile.email}</p>
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" /> {profile.badgeText}
                </span>
              </div>

              <div className="py-1">
                {(userRole === 'Admin' || userRole === 'Teacher') && (
                  <>
                    <div className="px-4 py-1 text-[10px] uppercase font-bold text-slate-400">Authority Controls</div>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsRoleManagementModalOpen(true);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center space-x-2 font-bold ${
                        userRole === 'Admin' ? 'text-amber-700 hover:bg-amber-50' : 'text-indigo-700 hover:bg-indigo-50'
                      }`}
                    >
                      {userRole === 'Admin' ? <Crown className="w-4 h-4 text-amber-600" /> : <Users className="w-4 h-4 text-indigo-600" />}
                      <span>{userRole === 'Admin' ? 'Appoint Teachers & Staff' : 'Appoint Class Reps (CR)'}</span>
                    </button>
                    <div className="border-t border-slate-100 my-1"></div>
                  </>
                )}

                <div className="px-4 py-1 text-[10px] uppercase font-bold text-slate-400">Google Authentication</div>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsGoogleAuthModalOpen(true);
                  }}
                  className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                >
                  <GoogleIcon className="w-3.5 h-3.5" />
                  <span>Switch Google Persona...</span>
                </button>
                {currentUser.isGoogleAuthenticated && (
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      setIsChangePasswordModalOpen(true);
                    }}
                    className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span className="flex items-center space-x-2">
                      <Key className="w-3.5 h-3.5 text-slate-500" />
                      <span>Change Account Password</span>
                    </span>
                    {currentUser.mustChangePassword && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-800 rounded">
                        Required
                      </span>
                    )}
                  </button>
                )}
                {currentUser.isGoogleAuthenticated && (
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      signOutGoogle();
                    }}
                    className="w-full text-left px-4 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out of SST Account</span>
                  </button>
                )}

                <div className="border-t border-slate-100 my-1"></div>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setActiveTab('settings');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Classora Configuration</span>
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    resetToDemoData();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-blue-700 hover:bg-blue-50 flex items-center space-x-2"
                  title="Re-synchronize with Official SST 2026 Registry"
                >
                  <RotateCcw className="w-4 h-4 text-blue-500" />
                  <span>Re-sync SST Database</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
