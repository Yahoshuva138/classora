import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { StudentProfileDrawer } from './components/screens/StudentProfileDrawer';

// Screens
import { DashboardScreen } from './components/screens/DashboardScreen';
import { StudentsScreen } from './components/screens/StudentsScreen';
import { SessionsScreen } from './components/screens/SessionsScreen';
import { AttendanceScreen } from './components/screens/AttendanceScreen';
import { PerformanceScreen } from './components/screens/PerformanceScreen';
import { FollowUpsScreen } from './components/screens/FollowUpsScreen';
import { CRTasksScreen } from './components/screens/CRTasksScreen';
import { ReportsScreen } from './components/screens/ReportsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { StudentPortalView } from './components/screens/StudentPortalView';
import { TeacherPortalView } from './components/screens/TeacherPortalView';
import { DiscussionGroupsScreen } from './components/screens/DiscussionGroupsScreen';

import { SSTAuthGate } from './components/auth/SSTAuthGate';
import { GoogleAuthModal } from './components/auth/GoogleAuthModal';
import { ChangePasswordModal } from './components/auth/ChangePasswordModal';
import { OnboardingTourModal } from './components/common/OnboardingTourModal';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ShieldAlert, Key } from 'lucide-react';

const AuthenticatedApp: React.FC = () => {
  const {
    activeTab,
    userRole,
    setUserRole,
    currentUser,
    isGoogleAuthModalOpen,
    setIsGoogleAuthModalOpen,
    setIsChangePasswordModalOpen,
    isOnboardingOpen,
    setIsOnboardingOpen,
    isShortcutsOpen,
    setIsShortcutsOpen
  } = useApp();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Global Keyboard Shortcuts (Shift+1/2/3 for roles, ? for shortcuts cheat sheet)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
        return;
      }

      if ((e.shiftKey || e.altKey) && (e.code === 'Digit1' || e.key === '1' || e.key === '!')) {
        setUserRole('CR');
      } else if ((e.shiftKey || e.altKey) && (e.code === 'Digit2' || e.key === '2' || e.key === '@')) {
        setUserRole('Teacher');
      } else if ((e.shiftKey || e.altKey) && (e.code === 'Digit3' || e.key === '3' || e.key === '#')) {
        setUserRole('Student');
      } else if (e.key === '?' || (e.shiftKey && e.key === '?')) {
        e.preventDefault();
        setIsShortcutsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setUserRole, setIsShortcutsOpen]);

  const renderActiveScreen = () => {
    // Student Portal tab routes
    if (activeTab.startsWith('student-')) {
      return <StudentPortalView />;
    }

    // Teacher / Faculty tab routes
    if (activeTab.startsWith('teacher-')) {
      return <TeacherPortalView />;
    }

    // Role-dependent dashboard fallback
    if (userRole === 'Student' && activeTab === 'dashboard') {
      return <StudentPortalView />;
    }
    if (userRole === 'Teacher' && activeTab === 'dashboard') {
      return <TeacherPortalView />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'students':
        return <StudentsScreen />;
      case 'sessions':
        return <SessionsScreen />;
      case 'attendance':
        return <AttendanceScreen />;
      case 'groups':
        return <DiscussionGroupsScreen />;
      case 'performance':
        return <PerformanceScreen />;
      case 'follow-ups':
        return <FollowUpsScreen />;
      case 'cr-tasks':
        return <CRTasksScreen />;
      case 'reports':
        return <ReportsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        if (userRole === 'Student') return <StudentPortalView />;
        if (userRole === 'Teacher') return <TeacherPortalView />;
        return <DashboardScreen />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans antialiased text-slate-900">
      {/* Desktop Navy Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Nav Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onToggleMobileMenu={() => setIsMobileNavOpen(true)} />

        {/* Security Banner if user is on default password */}
        {currentUser?.mustChangePassword && (
          <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs transition-all animate-in fade-in">
            <div className="flex items-center gap-2 text-amber-900 font-medium">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Default Password Active:</strong> You are currently using the shared cohort default password (<code className="bg-amber-200/60 px-1.5 py-0.5 rounded font-mono font-bold text-amber-950">SST@2026</code>). For your security, please update your password.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsChangePasswordModalOpen(true)}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-lg font-semibold text-xs transition shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Change Password Now</span>
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <ErrorBoundary key={activeTab} fallbackTitle={`Error rendering ${activeTab} screen`}>
              {renderActiveScreen()}
            </ErrorBoundary>
          </div>
        </main>
      </div>

      {/* Global Overlays & Modals */}
      <GlobalSearchModal />
      <ErrorBoundary fallbackTitle="Error loading student profile drawer">
        <StudentProfileDrawer />
      </ErrorBoundary>
      <ChangePasswordModal />
      <GoogleAuthModal
        isOpen={isGoogleAuthModalOpen}
        onClose={() => setIsGoogleAuthModalOpen(false)}
      />
      <OnboardingTourModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSelectRole={(role) => setUserRole(role)}
      />
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};

const MainLayout: React.FC = () => {
  const { currentUser } = useApp();

  // Authentication Gate: Require verified SST Google Account
  if (!currentUser || !currentUser.isGoogleAuthenticated) {
    return <SSTAuthGate />;
  }

  return <AuthenticatedApp />;
};

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </ToastProvider>
  );
}
