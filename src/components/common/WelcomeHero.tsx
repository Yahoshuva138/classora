import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Play,
  X,
  Award,
  BookOpen,
  CheckCircle2,
  Users,
  Compass
} from 'lucide-react';
import { Classora3DLogo, GoogleIcon } from './Classora3DLogo';
import { Card3D } from './Card3D';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/soundEffects';
import { fireQuickConfetti } from '../../utils/confettiUtils';

interface WelcomeHeroProps {
  onOpenTour: () => void;
  onOpenGoogleAuth: () => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  onOpenTour,
  onOpenGoogleAuth
}) => {
  const { userRole, setUserRole, currentUser, dashboardMetrics } = useApp();
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('classora_hero_dismissed') === 'true';
  });

  if (isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('classora_hero_dismissed', 'true');
  };

  const handleRoleSelect = (role: 'CR' | 'Teacher' | 'Student') => {
    soundFx.playSuccess();
    fireQuickConfetti();
    setUserRole(role);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl border border-indigo-500/30 p-6 sm:p-8 mb-6">
      {/* 3D Background Decorative Grid & Light Orbs */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-20"
        title="Dismiss intro banner"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left: Branding & Intro */}
        <div className="max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Classora3DLogo size="md" showText={false} />
            <span className="text-[11px] font-black uppercase tracking-widest bg-gradient-to-r from-blue-400 to-emerald-400 text-slate-950 px-3 py-1 rounded-full font-sans shadow-md">
              Next-Gen Academic OS
            </span>
            <span className="text-xs text-indigo-200 font-semibold flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Subject - 2 • 4 Weeks
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-emerald-300">Classora</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            The all-in-one centralized academic portal for <strong className="text-white">English Language & Communication Skills</strong>.
            Experience intelligent attendance tracking, 7-skill competency radars, automated condonation alerts, and interactive multi-role collaboration.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                soundFx.playPop();
                onOpenTour();
              }}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Take 60s Interactive Tour</span>
            </button>

            {!currentUser.isGoogleAuthenticated ? (
              <button
                onClick={() => {
                  soundFx.playPop();
                  onOpenGoogleAuth();
                }}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all shadow-md hover:scale-105 active:scale-95"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Sign in with Google</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Google Verified: <strong>{currentUser.name}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Interactive 3D Role Switcher Cards */}
        <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1: CR */}
          <Card3D intensity={12} onClick={() => handleRoleSelect('CR')}>
            <div
              className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                userRole === 'CR'
                  ? 'bg-blue-600/90 border-blue-400 ring-2 ring-blue-400/50 shadow-xl'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 hover:border-blue-500/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🎓</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  userRole === 'CR' ? 'bg-white text-blue-900' : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {userRole === 'CR' ? 'Active' : 'Switch'}
                </span>
              </div>
              <h4 className="font-bold text-sm text-white">Class Rep (CR)</h4>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                Rapid attendance console, daily checklist & at-risk calls.
              </p>
            </div>
          </Card3D>

          {/* Card 2: Teacher */}
          <Card3D intensity={12} onClick={() => handleRoleSelect('Teacher')}>
            <div
              className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                userRole === 'Teacher'
                  ? 'bg-indigo-600/90 border-indigo-400 ring-2 ring-indigo-400/50 shadow-xl'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 hover:border-indigo-500/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">👨‍🏫</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  userRole === 'Teacher' ? 'bg-white text-indigo-900' : 'bg-indigo-500/20 text-indigo-300'
                }`}>
                  {userRole === 'Teacher' ? 'Active' : 'Switch'}
                </span>
              </div>
              <h4 className="font-bold text-sm text-white">Faculty Lead</h4>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                Gradebook matrix, excuse approvals & student feedback.
              </p>
            </div>
          </Card3D>

          {/* Card 3: Student */}
          <Card3D intensity={12} onClick={() => handleRoleSelect('Student')}>
            <div
              className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                userRole === 'Student'
                  ? 'bg-emerald-600/90 border-emerald-400 ring-2 ring-emerald-400/50 shadow-xl'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 hover:border-emerald-500/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">👨‍🎓</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  userRole === 'Student' ? 'bg-white text-emerald-900' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {userRole === 'Student' ? 'Active' : 'Switch'}
                </span>
              </div>
              <h4 className="font-bold text-sm text-white">Student Portal</h4>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                Safe margin forecast, 7-skill radar & leave excuses.
              </p>
            </div>
          </Card3D>
        </div>
      </div>
    </div>
  );
};
