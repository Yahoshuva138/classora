import React, { useState, useEffect, useRef } from 'react';
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Key,
  ExternalLink,
  HelpCircle,
  X,
  Check,
  Users,
  Search,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { soundFx } from '../../utils/soundEffects';
import { fireGrandCelebration } from '../../utils/confettiUtils';
import { UserRole, GoogleUser } from '../../types';
import { initialStudents } from '../../data/mockData';
import { decodeGoogleJwt, isSstEmail, getGoogleClientId, saveGoogleClientId } from '../../utils/googleAuth';
import { LibraryBookIntro } from './LibraryBookIntro';

function saveOfflineUser(email: string, pass: string) {
  try {
    const raw = localStorage.getItem('classora_offline_users') || '{}';
    const parsed = JSON.parse(raw);
    parsed[email.toLowerCase().trim()] = pass;
    localStorage.setItem('classora_offline_users', JSON.stringify(parsed));
  } catch {}
}

function getOfflineCohortUser(email: string, passwordAttempt?: string): GoogleUser | null {
  const clean = email.trim().toLowerCase();

  let storedUsers: Record<string, string> = {};
  try {
    const raw = localStorage.getItem('classora_offline_users');
    if (raw) storedUsers = JSON.parse(raw);
  } catch {}

  const validPassword = storedUsers[clean] || 'SST@2026';
  if (passwordAttempt && passwordAttempt.trim() !== validPassword && passwordAttempt.trim() !== 'SST@2026') {
    return null;
  }

  // Predefined Roles
  if (clean === 'admin@sst.scaler.com' || clean === 'yahoshuva.26bcs10296@sst.scaler.com') {
    return {
      id: 'goog-26bcs10296',
      name: 'Yahoshuva Kesaboyina',
      email: clean,
      role: 'Admin',
      studentId: '26bcs10296',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      isGoogleAuthenticated: true,
      mustChangePassword: false
    };
  }

  if (
    clean === 'noor.nigar@scaler.com' ||
    (clean.endsWith('@scaler.com') && !clean.endsWith('@sst.scaler.com')) ||
    clean.includes('noor') ||
    clean.includes('nigar') ||
    clean.includes('faculty') ||
    clean.includes('teacher')
  ) {
    const isNoor = clean.includes('noor') || clean.includes('nigar');
    const teacherName = isNoor
      ? 'Noor Nigar'
      : clean
          .split('@')[0]
          .split('.')
          .map(p => p.charAt(0).toUpperCase() + p.slice(1))
          .join(' ');

    return {
      id: isNoor ? 'goog-faculty' : `goog-${clean.split('@')[0].replace(/[^a-zA-Z0-9]/g, '-')}`,
      name: teacherName,
      email: clean,
      role: 'Teacher',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      isGoogleAuthenticated: true,
      mustChangePassword: false
    };
  }

  if (clean === 'aarav.sharma@sst.scaler.com') {
    return {
      id: 'goog-cr',
      name: 'Aarav Sharma',
      email: clean,
      role: 'CR',
      studentId: '26bcs10424',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
      isGoogleAuthenticated: true,
      mustChangePassword: false
    };
  }

  // Find in cohort 44 students list
  const matched = initialStudents.find(
    s => (s.email && s.email.toLowerCase() === clean) || clean.includes(s.id.toLowerCase())
  );

  if (matched) {
    return {
      id: `goog-${matched.id}`,
      name: matched.name,
      email: clean,
      role: 'Student',
      studentId: matched.id,
      avatar: matched.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      isGoogleAuthenticated: true,
      mustChangePassword: true
    };
  }

  // Any valid SST domain user
  const nameFromEmail = clean.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return {
    id: `goog-${Date.now()}`,
    name: nameFromEmail,
    email: clean,
    role: 'Student',
    avatar: '',
    isGoogleAuthenticated: true,
    mustChangePassword: true
  };
}

// Multi-color Google "G" icon
const GoogleGIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export const SSTAuthGate: React.FC = () => {
  const { signInWithGoogle, loginAsGuest } = useApp();

  // Mode: 'login' ("Log in to account") or 'register' ("Create an account")
  const [authMode, setAuthMode] = useState<'register' | 'login'>('login');

  // Form inputs
  const [firstName, setFirstName] = useState('Yahoshuva');
  const [lastName, setLastName] = useState('Kesaboyina');
  const [email, setEmail] = useState('yahoshuva.26bcs10296@sst.scaler.com');
  const [password, setPassword] = useState('SST@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Feedback states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isGcpModalOpen, setIsGcpModalOpen] = useState(false);
  const [customClientId, setCustomClientId] = useState(getGoogleClientId());
  const [savedSuccess, setSavedSuccess] = useState(false);

  // 44 Cohort Roster Modal state
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [cohortRoster, setCohortRoster] = useState<{ id: string; name: string; email: string; rollNo: string; group: string }[]>([]);
  const [rosterSearch, setRosterSearch] = useState('');

  // 3D Library Book Intro for English / Library Lovers — Plays on EVERY page load / refresh
  const [showBookIntro, setShowBookIntro] = useState<boolean>(true);

  // Determine if entered email is from an external non-SST domain
  const isExternalEmail = Boolean(email.trim() && !isSstEmail(email.trim().toLowerCase()));

  const handleGuestLogin = async () => {
    soundFx.playSuccess();
    fireGrandCelebration();
    const cleanEmail = email.trim().toLowerCase();
    const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
    await loginAsGuest(fullName || undefined, cleanEmail && !isSstEmail(cleanEmail) ? cleanEmail : undefined);
  };

  // Clear any legacy sessionStorage lock so refresh always plays
  useEffect(() => {
    try {
      sessionStorage.removeItem('classora_book_seen');
    } catch {}
  }, []);

  const handleBookComplete = () => {
    setShowBookIntro(false);
  };

  // Fetch cohort roster
  useEffect(() => {
    api.getCohortRoster().then(list => {
      if (list && list.length > 0) setCohortRoster(list);
    }).catch(() => {});
  }, []);

  // Carousel slides for left banner
  const slides = [
    {
      title: 'Capturing Moments,',
      subtitle: 'Creating Memories',
      quote: 'Classora Academic OS • Scaler School of Technology'
    },
    {
      title: 'Mastering Voices,',
      subtitle: 'Shaping Tomorrow',
      quote: 'English Language & Communication Skills • ENG-101'
    },
    {
      title: 'Unified Cohort,',
      subtitle: 'Real-Time Insights',
      quote: 'Active Attendance & Dynamic Skill Performance Tracking'
    }
  ];

  // Auto-cycle carousel slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Seamless SST Google SSO: Authenticates registered cohort accounts or Guest visitors
  const handleGoogleSSO = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const targetEmail = email.trim().toLowerCase() || 'yahoshuva.26bcs10296@sst.scaler.com';
    const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ') || targetEmail.split('@')[0].replace(/\./g, ' ');

    if (!isSstEmail(targetEmail)) {
      try {
        soundFx.playSuccess();
        fireGrandCelebration();
        await loginAsGuest(fullName, targetEmail);
      } catch (err: any) {
        soundFx.playPop();
        setErrorMessage(err.message || 'Could not start guest session.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (authMode === 'register') {
      soundFx.playPop();
      setErrorMessage('To register your account, please enter your details in the form above and click "Create account".');
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.authenticateGoogle(targetEmail, fullName);

      soundFx.playSuccess();
      fireGrandCelebration();

      if (res && (res.user || (res as any).data)) {
        await signInWithGoogle({
          ...(res.user || (res as any).data),
          isGoogleAuthenticated: true
        });
      }
    } catch (err: any) {
      soundFx.playPop();
      setErrorMessage(err.message || 'Authentication error. If you have not registered yet, please click "Sign up" to create your account first.');
    } finally {
      setIsLoading(false);
    }
  };

  // Select student from 44 cohort modal
  const handleSelectCohortStudent = (student: { name: string; email: string }) => {
    soundFx.playPop();
    const parts = student.name.split(' ');
    setFirstName(parts[0] || '');
    setLastName(parts.slice(1).join(' ') || '');
    setEmail(student.email);
    setPassword('SST@2026');
    setIsRosterModalOpen(false);
    setErrorMessage(null);
  };

  // 1-Click Quick Role Presets handler for instant test switching
  const handleSelectRolePreset = (role: 'Admin' | 'Teacher' | 'CR' | 'Student' | 'Guest') => {
    soundFx.playPop();
    if (role === 'Guest') {
      handleGuestLogin();
      return;
    }
    setAuthMode('login');
    setErrorMessage(null);
    setSuccessMessage(null);
    if (role === 'Admin') {
      setEmail('yahoshuva.26bcs10296@sst.scaler.com');
      setFirstName('Yahoshuva');
      setLastName('Kesaboyina');
      setPassword('SST@2026');
    } else if (role === 'Teacher') {
      setEmail('noor.nigar@scaler.com');
      setFirstName('Noor');
      setLastName('Nigar');
      setPassword('SST@2026');
    } else if (role === 'CR') {
      setEmail('aarav.sharma@sst.scaler.com');
      setFirstName('Aarav');
      setLastName('Sharma');
      setPassword('SST@2026');
    } else {
      const sample = cohortRoster[0] || { email: 'abhiram.26bcs10535@sst.scaler.com', name: 'Abhiram Wayakar' };
      const parts = sample.name.split(' ');
      setEmail(sample.email);
      setFirstName(parts[0] || 'Abhiram');
      setLastName(parts.slice(1).join(' ') || 'Wayakar');
      setPassword('SST@2026');
    }
  };

  // Form submit handler (Real Registration or Login)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ') || cleanEmail.split('@')[0].replace(/\./g, ' ');

    // Any external email can log in as Guest Visitor!
    if (!isSstEmail(cleanEmail)) {
      setIsLoading(true);
      try {
        soundFx.playSuccess();
        fireGrandCelebration();
        await loginAsGuest(fullName, cleanEmail);
      } catch (err: any) {
        soundFx.playPop();
        setErrorMessage(err.message || 'Could not initialize guest preview session.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (authMode === 'register') {
      if (!agreeTerms) {
        soundFx.playPop();
        setErrorMessage('Please agree to the Terms & Conditions to proceed.');
        return;
      }
      if (!password || password.trim().length < 4) {
        soundFx.playPop();
        setErrorMessage('Please choose a password with at least 4 characters.');
        return;
      }
    }

    setIsLoading(true);
    try {

      if (authMode === 'register') {
        // 1. SIGN UP / REGISTER FIRST
        const res = await api.registerUser({
          name: fullName,
          email: cleanEmail,
          password: password,
          role: 'Student'
        });

        soundFx.playSuccess();
        
        // Show prominent green confirmation and transition to Login screen
        setErrorMessage(null);
        setSuccessMessage(`Registration successful for ${res.studentName || fullName}! Please enter your password to log in below.`);
        setAuthMode('login');
      } else {
        // 2. LOG IN (AFTER REGISTRATION)
        const res = await api.loginUser({
          email: cleanEmail,
          password: password
        });

        soundFx.playSuccess();
        fireGrandCelebration();

        if (res && res.user) {
          await signInWithGoogle({
            ...res.user,
            isGoogleAuthenticated: true
          });
        }
      }
    } catch (err: any) {
      soundFx.playPop();
      const errMsg = err?.message || String(err || '');
      const isNetworkOrDbFail = !err ||
        errMsg.includes('Failed to fetch') ||
        errMsg.includes('fetch failed') ||
        errMsg.includes('NetworkError') ||
        errMsg.includes('ENOTFOUND') ||
        errMsg.includes('mongodb') ||
        errMsg.includes('Mongo') ||
        errMsg.includes('500') ||
        errMsg.includes('Internal Server Error');
      
      if (isNetworkOrDbFail && isSstEmail(cleanEmail)) {
        if (authMode === 'login') {
          const offlineUser = getOfflineCohortUser(cleanEmail, password);
          if (offlineUser) {
            soundFx.playSuccess();
            fireGrandCelebration();
            await signInWithGoogle({
              ...offlineUser,
              isGoogleAuthenticated: true
            });
            return;
          } else {
            setErrorMessage('Incorrect password. Please use the Cohort Default Password (SST@2026) or register first.');
            return;
          }
        } else if (authMode === 'register') {
          saveOfflineUser(cleanEmail, password);
          soundFx.playSuccess();
          setErrorMessage(null);
          setSuccessMessage(`Registration saved for ${fullName}! Please enter your password to log in below.`);
          setAuthMode('login');
          return;
        }
      }

      setErrorMessage(
        isNetworkOrDbFail
          ? 'Cannot reach backend database. Please check connection or log in with the Cohort Default Password (SST@2026).'
          : (err.message || 'Authentication error. Please check your credentials.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveClientId = (e: React.FormEvent) => {
    e.preventDefault();
    saveGoogleClientId(customClientId);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsGcpModalOpen(false);
      window.location.reload();
    }, 1000);
  };

  if (showBookIntro) {
    return <LibraryBookIntro onComplete={handleBookComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#1c182d] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#6c5dd3] selection:text-white">
      {/* Centered Floating Luxury Card */}
      <div className="w-full max-w-5xl bg-[#231e36] rounded-[28px] overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.55)] border border-white/[0.07] flex flex-col md:flex-row min-h-[580px] md:min-h-[640px]">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Visual Brand Banner with Desert Dunes Art     */}
        {/* ========================================================= */}
        <div className="relative md:w-[46%] lg:w-[48%] p-3 sm:p-4 flex flex-col shrink-0">
          <div className="relative w-full h-44 sm:h-56 md:h-full min-h-[175px] md:min-h-[580px] rounded-[22px] overflow-hidden flex flex-col justify-between p-4 sm:p-6 md:p-8 shadow-inner">
            {/* Dune Twilight Photography Background */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
              style={{
                backgroundImage: `url('/images/auth-banner.jpg')`,
                backgroundColor: '#1b1429'
              }}
            />

            {/* Dark Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/80 pointer-events-none" />

            {/* Top Brand & Navigation Header */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {/* Stylized Modern ΛNU Logo */}
                <span className="text-2xl sm:text-3xl font-black tracking-widest text-white select-none font-sans drop-shadow-md">
                  ΛNU
                </span>
                <span className="text-[10px] text-white/70 font-mono tracking-widest uppercase bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
                  SST
                </span>
              </div>

              {/* "Back to website →" Pill Button */}
              <button
                type="button"
                onClick={() => {
                  soundFx.playPop();
                  window.open('https://scaler.com', '_blank');
                }}
                className="text-xs font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/20 active:bg-white/25 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Back to website</span>
                <span className="text-sm leading-none">&rarr;</span>
              </button>
            </div>

            {/* Bottom Hero Typography & Carousel Indicators */}
            <div className="relative z-10 space-y-2 sm:space-y-4 pt-4 sm:pt-8 md:pt-24">
              <div className="transition-all duration-300">
                <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-white leading-tight font-serif drop-shadow-lg">
                  {slides[activeSlide].title}
                  <br className="hidden sm:inline" />{' '}
                  <span className="font-normal">{slides[activeSlide].subtitle}</span>
                </h2>
                <p className="text-[10px] sm:text-[11px] text-white/60 font-sans tracking-wide mt-1 sm:mt-2 hidden sm:block">
                  {slides[activeSlide].quote}
                </p>
              </div>

              {/* 3 Horizontal Dash Indicators (Active is elongated pill) */}
              <div className="flex items-center space-x-2 pt-1 sm:pt-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      soundFx.playPop();
                      setActiveSlide(idx);
                    }}
                    className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                      activeSlide === idx
                        ? 'w-7 bg-white shadow-sm'
                        : 'w-2.5 bg-white/35 hover:bg-white/60'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Luxury Dark Purple Authentication Form      */}
        {/* ========================================================= */}
        <div className="md:w-[54%] lg:w-[52%] p-5 sm:p-8 lg:p-12 flex flex-col justify-center bg-[#231e36]">
          <div className="max-w-md w-full mx-auto">
            {/* Quick 1-Click Role Presets Bar */}
            <div className="mb-5 sm:mb-6 bg-white/[0.03] p-2.5 rounded-2xl border border-white/[0.07]">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 flex items-center gap-1">
                  <span>⚡</span> Quick Persona Select
                </span>
                <span className="text-[10px] text-indigo-300 font-medium">1-Click Fast Login</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSelectRolePreset('Admin')}
                  className={`px-2 py-1.5 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    email === 'yahoshuva.26bcs10296@sst.scaler.com' || email === 'admin@sst.scaler.com'
                      ? 'bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-xs'
                      : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                  title="Super Admin: Yahoshuva Kesaboyina"
                >
                  <span>👑</span>
                  <span>Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectRolePreset('Teacher')}
                  className={`px-2 py-1.5 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    email === 'noor.nigar@scaler.com'
                      ? 'bg-indigo-500/25 text-indigo-300 border-indigo-500/50 shadow-xs'
                      : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                  title="Faculty: Noor Nigar"
                >
                  <span>👩‍🏫</span>
                  <span>Teacher</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectRolePreset('CR')}
                  className={`px-2 py-1.5 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    email === 'aarav.sharma@sst.scaler.com'
                      ? 'bg-blue-500/25 text-blue-300 border-blue-500/50 shadow-xs'
                      : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                  title="Lead CR: Aarav Sharma"
                >
                  <span>🎓</span>
                  <span>Lead CR</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectRolePreset('Student')}
                  className={`px-2 py-1.5 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                    email.includes('26bcs') && email !== 'yahoshuva.26bcs10296@sst.scaler.com'
                      ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50 shadow-xs'
                      : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                  title="Enrolled Cohort Student"
                >
                  <span>👨‍🎓</span>
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectRolePreset('Guest')}
                  className="px-2 py-1.5 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border bg-teal-500/15 text-teal-300 border-teal-500/30 hover:bg-teal-500/25 hover:border-teal-400/50"
                  title="Explore as Guest Visitor (Read-Only Preview)"
                >
                  <span>👁️</span>
                  <span>Guest</span>
                </button>
              </div>
            </div>

            {/* Form Title & Mode Switcher */}
            <div className="mb-5 sm:mb-7">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white mb-2 font-sans">
                {authMode === 'register' ? 'Create an account' : 'Log in to account'}
              </h1>

              <p className="text-xs text-white/50 flex items-center gap-1">
                <span>
                  {authMode === 'register'
                    ? 'Already have an account?'
                    : "Don't have an account?"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playPop();
                    setAuthMode(prev => (prev === 'register' ? 'login' : 'register'));
                    setErrorMessage(null);
                  }}
                  className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-2 transition-colors cursor-pointer"
                >
                  {authMode === 'register' ? 'Log in' : 'Sign up'}
                </button>
              </p>
            </div>

            {/* Success Banner */}
            {successMessage && (
              <div className="mb-5 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs flex items-start gap-3 animate-in fade-in duration-200 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-emerald-200 text-sm mb-0.5">Registration Successful!</div>
                  <div className="leading-relaxed text-emerald-300/90">{successMessage}</div>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="leading-relaxed">{errorMessage}</span>
                  {(errorMessage.toLowerCase().includes('not registered') || errorMessage.toLowerCase().includes('sign up')) && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playPop();
                          setAuthMode('register');
                          setErrorMessage(null);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-[11px] font-semibold rounded-lg border border-rose-500/40 transition-all cursor-pointer"
                      >
                        <span>Create & Register Account Now &rarr;</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Default Password Cohort Notice */}
            <div className="mb-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-200 text-xs flex items-center justify-between gap-2 text-left">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-[11px] text-white/80">
                  Cohort Default Password: <strong className="font-mono text-indigo-200 bg-white/10 px-1.5 py-0.5 rounded">SST@2026</strong>
                </span>
              </div>
              <span className="text-[10px] text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full font-medium shrink-0">
                Change after login
              </span>
            </div>

            {/* The Main Input Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
              {/* Row 1: Name Fields (In register mode) */}
              {authMode === 'register' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="w-full bg-[#322c4d] border border-white/5 focus:border-[#6c5dd3] focus:ring-1 focus:ring-[#6c5dd3] text-white placeholder:text-white/35 rounded-xl px-4 py-2.5 sm:py-3 text-base sm:text-sm min-h-[44px] outline-none transition shadow-inner"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full bg-[#322c4d] border border-white/5 focus:border-[#6c5dd3] focus:ring-1 focus:ring-[#6c5dd3] text-white placeholder:text-white/35 rounded-xl px-4 py-2.5 sm:py-3 text-base sm:text-sm min-h-[44px] outline-none transition shadow-inner"
                    />
                  </div>
                </div>
              )}

              {/* Row 2: Email Field */}
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email (@sst.scaler.com, @scaler.com, or any email)"
                  className="w-full bg-[#322c4d] border border-white/5 focus:border-[#6c5dd3] focus:ring-1 focus:ring-[#6c5dd3] text-white placeholder:text-white/35 rounded-xl px-4 py-2.5 sm:py-3 text-base sm:text-sm min-h-[44px] outline-none transition shadow-inner"
                />
                {isExternalEmail && (
                  <div className="mt-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                    <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>External email detected: You will enter as <strong>Guest Visitor</strong> (Read-Only Showcase)</span>
                  </div>
                )}
              </div>

              {/* Row 3: Password Field with Minimalist Eye Toggle */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required={!isExternalEmail}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={
                    isExternalEmail
                      ? 'Password (Optional for Guest Visitors)'
                      : authMode === 'register'
                      ? 'Choose a password (min 4 chars)'
                      : 'Enter your password'
                  }
                  className="w-full bg-[#322c4d] border border-white/5 focus:border-[#6c5dd3] focus:ring-1 focus:ring-[#6c5dd3] text-white placeholder:text-white/35 rounded-xl px-4 py-2.5 sm:py-3 pr-11 text-base sm:text-sm min-h-[44px] outline-none transition shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 p-1 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Checkbox: "I agree to the Terms & Conditions" (Register mode) */}
              {authMode === 'register' && !isExternalEmail && (
                <div className="pt-1 pb-1">
                  <label className="flex items-center gap-2.5 text-xs text-white/60 hover:text-white/80 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={e => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 rounded bg-[#322c4d] border border-white/20 text-[#6c5dd3] focus:ring-0 focus:ring-offset-0 transition cursor-pointer accent-[#6c5dd3]"
                    />
                    <span>
                      I agree to the{' '}
                      <span className="text-white/80 hover:text-white underline underline-offset-2">
                        Terms & Conditions
                      </span>
                    </span>
                  </label>
                </div>
              )}

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white font-medium py-3.5 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 hover:scale-[1.008] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                  isExternalEmail
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/30'
                    : 'bg-[#6c5dd3] hover:bg-[#5e4fc4] active:bg-[#5344b4] shadow-lg shadow-[#6c5dd3]/25'
                }`}
              >
                <span>
                  {isLoading
                    ? (isExternalEmail ? 'Connecting to Showcase Preview...' : 'Verifying with Cohort Database...')
                    : isExternalEmail
                    ? 'Enter as Guest Visitor'
                    : authMode === 'register'
                    ? 'Create account'
                    : 'Sign in'}
                </span>
              </button>
            </form>

            {/* Divider: "Or register with" / "Or sign in with" */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.08]" />
              </div>
              <div className="relative flex justify-center text-[11px]">
                <span className="bg-[#231e36] px-3 text-white/40 font-medium">
                  {isExternalEmail ? 'Or explore with Google' : authMode === 'register' ? 'Or register with' : 'Or sign in with'}
                </span>
              </div>
            </div>

            {/* Institutional SSO Button: Google */}
            <div>
              <button
                type="button"
                onClick={() => {
                  soundFx.playPop();
                  handleGoogleSSO();
                }}
                disabled={isLoading}
                className="w-full bg-[#322c4d] hover:bg-[#3d365e] active:bg-[#2c2644] text-white border border-white/10 hover:border-indigo-400/30 rounded-xl py-3 px-4 flex items-center justify-center gap-2.5 text-xs font-semibold transition cursor-pointer shadow-sm hover:scale-[1.01]"
              >
                <GoogleGIcon className="w-4 h-4 shrink-0" />
                <span>{isExternalEmail ? 'Continue with Google as Guest' : 'Continue with Google (@sst.scaler.com)'}</span>
              </button>
            </div>

            {/* 1-Click Guest Visitor Showcase Button */}
            <div className="mt-3">
              <button
                type="button"
                onClick={handleGuestLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600/25 via-teal-600/25 to-cyan-600/25 hover:from-emerald-600/40 hover:via-teal-600/40 hover:to-cyan-600/40 active:scale-[0.99] text-emerald-200 border border-emerald-500/35 hover:border-emerald-400/55 rounded-xl py-3 px-4 flex items-center justify-center gap-2.5 text-xs font-semibold transition cursor-pointer shadow-md shadow-emerald-950/40"
                title="Explore Classora Academic OS with read-only visitor access"
              >
                <Eye className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Explore as Guest Visitor (Read-Only Preview)</span>
              </button>
            </div>

            {/* Quick Cohort Roster Lookup */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => {
                  soundFx.playPop();
                  setIsRosterModalOpen(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] active:bg-white/[0.1] border border-white/10 text-white/70 hover:text-white text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Official SST 44-Student Cohort • View Roster</span>
              </button>
            </div>

            {/* Institutional Security Footnote & Client Setup Link */}
            <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-white/40">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SST Institutional Gateway</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playPop();
                    setShowBookIntro(true);
                  }}
                  className="hover:text-amber-300 text-amber-400/80 transition-colors cursor-pointer flex items-center gap-1.5 font-serif"
                  title="Replay English 3D Book Opening Animation"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>3D Book Intro</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsGcpModalOpen(true)}
                  className="hover:text-white/70 underline transition-colors cursor-pointer"
                >
                  OAuth Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GCP OAuth Client ID Configuration & Explanation Modal */}
      {isGcpModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200"
          onClick={() => setIsGcpModalOpen(false)}
        >
          <div
            className="bg-[#231e36] text-white rounded-2xl max-w-lg w-full shadow-2xl border border-white/10 p-5 sm:p-6 relative my-auto max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2.5rem)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsGcpModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Google OAuth Client Configuration</h3>
                <p className="text-xs text-white/50">Scaler School of Technology • Classora Academic OS</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-white/70">
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 space-y-1.5 text-left">
                <p className="font-bold text-xs flex items-center gap-1.5 text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Why did Google show Error 401: invalid_client?
                </p>
                <p className="leading-relaxed text-white/70">
                  Your email is 100% valid. Google blocked the popup because the app’s Client ID has not yet been registered in Google Cloud Console for <code className="bg-white/10 px-1 py-0.5 rounded text-white font-mono">http://localhost:5173</code>.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 space-y-1 text-left">
                <p className="font-bold text-xs flex items-center gap-1.5 text-emerald-300">
                  <Check className="w-4 h-4 shrink-0" />
                  Instant Zero-Config Sign In:
                </p>
                <p className="leading-relaxed text-white/70">
                  Simply use the <strong>"Create account"</strong> or <strong>"Sign in"</strong> button on the main form with your <code className="text-emerald-300 font-mono">@sst.scaler.com</code> email!
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 space-y-3 text-left">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-amber-400 shrink-0" />
                  To Enable Native Google Browser Popup:
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 pl-1 text-[11px] text-white/60">
                  <li>Visit <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline inline-flex items-center gap-0.5">Google Cloud Console <ExternalLink className="w-3 h-3" /></a></li>
                  <li>Create Credentials &rarr; <strong>OAuth client ID</strong> &rarr; <strong>Web application</strong></li>
                  <li>Add <code className="bg-white/10 px-1 py-0.5 rounded font-mono text-white">http://localhost:5173</code> to <strong>Authorized JavaScript origins</strong></li>
                  <li>Copy your Client ID and save below:</li>
                </ol>

                <form onSubmit={handleSaveClientId} className="space-y-2 mt-2">
                  <input
                    type="text"
                    value={customClientId}
                    onChange={e => setCustomClientId(e.target.value)}
                    placeholder="xxxxxxxxxxxx-xxxxxxxxxxxxxxxx.apps.googleusercontent.com"
                    className="w-full h-10 px-3 text-xs font-mono rounded-xl bg-[#322c4d] border border-white/10 text-white focus:outline-none focus:border-[#6c5dd3]"
                  />

                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsGcpModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#6c5dd3] hover:bg-[#5e4fc4] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      {savedSuccess ? 'Saved & Reloading...' : 'Save Client ID'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official 44 Cohort Roster Modal */}
      {isRosterModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200"
          onClick={() => setIsRosterModalOpen(false)}
        >
          <div
            className="bg-[#231e36] text-white rounded-2xl max-w-2xl w-full shadow-2xl border border-white/10 p-5 sm:p-6 relative my-auto max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2.5rem)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsRosterModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Official SST ENG-101 Cohort Roster</h3>
                <p className="text-xs text-white/50">Only these 44 students are eligible to register and log in</p>
              </div>
            </div>

            {/* Search filter */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={rosterSearch}
                onChange={e => setRosterSearch(e.target.value)}
                placeholder="Search by name, roll number, or group..."
                className="w-full bg-[#1c182d] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-[#6c5dd3]"
              />
            </div>

            {/* Student List */}
            <div className="overflow-y-auto flex-1 space-y-2 pr-1 custom-scrollbar">
              {cohortRoster
                .filter(s => {
                  const q = rosterSearch.toLowerCase();
                  return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q) || s.group.toLowerCase().includes(q);
                })
                .map(s => (
                  <div
                    key={s.id || s.rollNo}
                    onClick={() => handleSelectCohortStudent(s)}
                    className="p-3 rounded-xl bg-white/[0.03] hover:bg-indigo-600/20 active:bg-indigo-600/30 border border-white/5 hover:border-indigo-500/30 transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-indigo-200 flex items-center gap-2">
                          <span>{s.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                            {s.rollNo}
                          </span>
                        </div>
                        <div className="text-[11px] text-white/40 group-hover:text-white/60 font-mono">
                          {s.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {s.group}
                      </span>
                      <span className="text-xs text-indigo-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                        <span>Select</span> &rarr;
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-[11px] text-white/40">
              <span>Showing {cohortRoster.length} verified Scaler School of Technology students</span>
              <button
                type="button"
                onClick={() => setIsRosterModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
