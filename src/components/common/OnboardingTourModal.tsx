import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Calendar,
  Award,
  ShieldCheck,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { GoogleIcon, Classora3DLogo } from './Classora3DLogo';
import { Card3D } from './Card3D';
import { soundFx } from '../../utils/soundEffects';
import { fireGrandCelebration } from '../../utils/confettiUtils';

interface OnboardingTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: 'CR' | 'Teacher' | 'Student') => void;
}

export const OnboardingTourModal: React.FC<OnboardingTourModalProps> = ({
  isOpen,
  onClose,
  onSelectRole
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: 'Welcome to Classora Academic OS',
      subtitle: 'Course: English Language & Communication Skills (Subject - 2 • 4 Weeks)',
      icon: '✨',
      badge: 'Step 1 of 4: The Next-Gen Platform',
      content: (
        <div className="space-y-4">
          <div className="flex justify-center my-2">
            <Classora3DLogo size="xl" showText={false} />
          </div>
          <p className="text-xs sm:text-sm text-slate-600 text-center leading-relaxed">
            Classora is an intelligent academic tracking platform built for higher education, uniting <strong className="text-slate-900">Class Representatives</strong>, <strong className="text-slate-900">Faculty</strong>, and <strong className="text-slate-900">Students</strong> in real-time.
          </p>
          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
              <span className="text-xl block">🎓</span>
              <strong className="text-blue-900 font-bold block mt-1">CR Mode</strong>
              <span className="text-[10px] text-blue-700">Daily Operations</span>
            </div>
            <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
              <span className="text-xl block">👨‍🏫</span>
              <strong className="text-indigo-900 font-bold block mt-1">Teacher Mode</strong>
              <span className="text-[10px] text-indigo-700">Gradebook & Audit</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-xl block">👨‍🎓</span>
              <strong className="text-emerald-900 font-bold block mt-1">Student Portal</strong>
              <span className="text-[10px] text-emerald-700">Safe Margin & Radar</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Real-Time Multi-Role Switching',
      subtitle: 'Experience Classora from three distinct campus perspectives',
      icon: '🎭',
      badge: 'Step 2 of 4: Role Synergy',
      content: (
        <div className="space-y-3.5">
          <p className="text-xs text-slate-600 leading-relaxed">
            Use the top header segmented control at any time to switch roles without re-logging in:
          </p>
          <div className="space-y-2">
            <div
              onClick={() => {
                soundFx.playPop();
                onSelectRole('CR');
              }}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer flex items-center space-x-3"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg">
                🎓
              </div>
              <div className="text-left text-xs">
                <strong className="text-slate-900 block font-bold">Class Representative (Aarav Sharma)</strong>
                <span className="text-slate-500 text-[11px]">Rapid attendance marking console, daily task checklist, absentee outreach.</span>
              </div>
            </div>

            <div
              onClick={() => {
                soundFx.playPop();
                onSelectRole('Teacher');
              }}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer flex items-center space-x-3"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-lg">
                👨‍🏫
              </div>
              <div className="text-left text-xs">
                <strong className="text-slate-900 block font-bold">Faculty Coordinator (Dr. Priya Nair)</strong>
                <span className="text-slate-500 text-[11px]">Interactive marks gradebook, syllabus timeline, and medical excuse approvals.</span>
              </div>
            </div>

            <div
              onClick={() => {
                soundFx.playPop();
                onSelectRole('Student');
              }}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer flex items-center space-x-3"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-lg">
                👨‍🎓
              </div>
              <div className="text-left text-xs">
                <strong className="text-slate-900 block font-bold">Student Portal (Rohan, Aarav, Sneha)</strong>
                <span className="text-slate-500 text-[11px]">Personal safe-margin attendance gauge, lecture notes, and leave submission form.</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Intelligent Safe Margin & 7-Skill Radar',
      subtitle: 'No more guess-work regarding condonation or attendance shortages',
      icon: '📊',
      badge: 'Step 3 of 4: Academic Analytics',
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-xs">
            <div className="flex items-center space-x-2 font-bold text-amber-950 mb-1">
              <span className="text-base">⚡</span>
              <span>Dynamic Safe Margin Intelligence</span>
            </div>
            <p className="text-amber-900 text-[11px] leading-relaxed">
              Classora automatically calculates: <em>“Attend the next 2 consecutive classes to cross the 75% exam minimum, and 4 classes to achieve 85% On-Track honor standing.”</em>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-xs">
            <div className="flex items-center space-x-2 font-bold text-blue-950 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>7-Skill Competency Mapping</span>
            </div>
            <p className="text-blue-900 text-[11px] leading-relaxed">
              Evaluates students across: <strong>Communication, Grammar, Vocabulary, Pronunciation, Participation, Assignments,</strong> and <strong>Assessments</strong> with class benchmark comparisons.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Google Single Sign-On Ready',
      subtitle: 'Authenticate securely with your campus Google credentials',
      icon: '🛡️',
      badge: 'Step 4 of 4: Seamless Access',
      content: (
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-lg flex items-center justify-center mx-auto">
            <GoogleIcon className="w-10 h-10" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">One-Click Google Authentication</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Easily connect with Google Workspace accounts to synchronize roles, profile photos, and attendance notifications.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-medium text-left flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Ready to explore! You can trigger this tour or switch Google accounts at any time.</span>
          </div>
        </div>
      )
    }
  ];

  const current = tourSteps[currentStep];

  const handleNext = () => {
    soundFx.playPop();
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      soundFx.playSuccess();
      fireGrandCelebration();
      onClose();
    }
  };

  const handlePrev = () => {
    soundFx.playPop();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden relative animate-in zoom-in-95 duration-150 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-3 border-b border-slate-100 flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              {current.badge}
            </span>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-1.5 flex items-center gap-2">
              <span>{current.icon}</span>
              <span>{current.title}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {current.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 min-h-[300px] flex flex-col justify-center">
          {current.content}
        </div>

        {/* Footer Progress & Nav */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {/* Step Indicators */}
          <div className="flex space-x-1.5">
            {tourSteps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep ? 'w-6 bg-blue-600' : 'w-2 bg-slate-300'
                }`}
              />
            ))}
          </div>

          {/* Nav Buttons */}
          <div className="flex items-center space-x-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-600/20 flex items-center space-x-1.5 hover:scale-105 active:scale-95"
            >
              <span>{currentStep === tourSteps.length - 1 ? 'Start Using Classora' : 'Continue'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
