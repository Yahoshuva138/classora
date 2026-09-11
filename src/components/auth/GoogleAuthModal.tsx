import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, User, Sparkles, ArrowRight, AlertCircle, LogOut } from 'lucide-react';
import { GoogleIcon } from '../common/Classora3DLogo';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { soundFx } from '../../utils/soundEffects';
import { fireGrandCelebration } from '../../utils/confettiUtils';
import { isSstEmail } from '../../utils/googleAuth';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, currentUser, signOutGoogle, students } = useApp();
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customRole, setCustomRole] = useState<UserRole>('Student');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const triggerGoogleSignIn = () => {
    setErrorMessage(null);
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('Google prompt notice:', notification.getNotDisplayedReason?.() || 'dismissed');
          }
        });
      } catch (err) {
        console.warn('Google prompt invocation:', err);
      }
    } else {
      setErrorMessage('Google Identity Services client is initializing. Please enter your SST email below.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const email = customEmail.trim().toLowerCase();
    if (!email) return;

    // Strict Institutional Domain validation
    if (!isSstEmail(email)) {
      soundFx.playPop();
      setErrorMessage('Access Denied: Only Scaler School of Technology (@sst.scaler.com) accounts are authorized.');
      return;
    }

    setIsLoading(true);
    try {
      let role: UserRole = customRole;
      let studentId = undefined;
      let userName = customName.trim() || email.split('@')[0].replace(/\./g, ' ');

      if (email.includes('aarav') || email.includes('cr')) {
        role = 'CR';
        userName = customName.trim() || 'Aarav Sharma';
      } else if (email.includes('noor') || email.includes('nigar') || email.includes('priya') || email.includes('faculty') || email.includes('teacher')) {
        role = 'Teacher';
        userName = customName.trim() || 'Noor Nigar';
      } else {
        const rollMatch = email.match(/26bcs\d+/i);
        const rollNo = rollMatch ? rollMatch[0].toLowerCase() : null;
        const matchedStudent = students.find(
          s =>
            (s.email && s.email.toLowerCase() === email) ||
            (rollNo && s.id.toLowerCase() === rollNo) ||
            (rollNo && s.rollNo && s.rollNo.toLowerCase() === rollNo)
        );
        if (matchedStudent) {
          studentId = matchedStudent.id;
          userName = customName.trim() || matchedStudent.name;
        }
      }

      soundFx.playSuccess();
      fireGrandCelebration();
      await signInWithGoogle({
        id: `sst-${Date.now()}`,
        name: userName,
        email: email,
        role: role,
        avatar: '',
        isGoogleAuthenticated: true,
        studentId: studentId
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify institutional credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4 md:p-6 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden relative animate-in zoom-in-95 duration-150 my-auto max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2.5rem)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header (Compact & Fixed at top) */}
        <div className="shrink-0 p-4 sm:p-5 pb-3 text-center border-b border-slate-100 bg-white relative">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-center mx-auto mb-2">
            <GoogleIcon className="w-6 h-6" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Institutional Google Gateway
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Scaler School of Technology • <strong className="text-slate-800">@sst.scaler.com</strong>
          </p>
        </div>

        {/* Active Auth State Notification if already logged in */}
        {currentUser.isGoogleAuthenticated && (
          <div className="shrink-0 p-3 sm:p-3.5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 text-xs min-w-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-emerald-950">Active Session:</span>
                <p className="text-emerald-800 text-[11px] font-mono truncate">{currentUser.email}</p>
                <p className="text-emerald-700 text-[10px] truncate">{currentUser.name} • {currentUser.role}</p>
              </div>
            </div>
            <button
              onClick={() => {
                signOutGoogle();
                onClose();
              }}
              className="shrink-0 text-[11px] font-bold text-rose-700 hover:text-rose-800 bg-white px-2.5 py-1.5 rounded-lg border border-rose-200 shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign out</span>
            </button>
          </div>
        )}

        {/* Modal Body (Scrollable inside container if height is constrained) */}
        <div className="p-4 sm:p-6 space-y-3.5 overflow-y-auto flex-1 text-left">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">{errorMessage}</p>
            </div>
          )}

          {/* Real Google GIS trigger */}
          <button
            type="button"
            onClick={triggerGoogleSignIn}
            className="w-full h-11 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-all shadow-xs flex items-center justify-center gap-2.5 hover:scale-[1.005] active:scale-[0.99] cursor-pointer"
          >
            <GoogleIcon className="w-4.5 h-4.5 shrink-0" />
            <span>Sign In with Google (Browser Account)</span>
          </button>

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-2.5 text-slate-400 font-bold tracking-wider">
                Or enter institutional email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-left text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">
                Institutional Email Address
              </label>
              <input
                type="email"
                required
                value={customEmail}
                onChange={e => setCustomEmail(e.target.value)}
                placeholder="name.26bcs10xxx@sst.scaler.com"
                className="w-full h-9 sm:h-10 px-3 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">
                Full Name (Optional)
              </label>
              <input
                type="text"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                placeholder="e.g. Yahoshuva Kesaboyina"
                className="w-full h-9 sm:h-10 px-3 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">
                Role / Capacity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Student', 'CR', 'Teacher'] as UserRole[]).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setCustomRole(r)}
                    className={`py-1.5 sm:py-2 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                      customRole === r
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !customEmail.trim()}
              className="w-full h-10 sm:h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{isLoading ? 'Verifying...' : 'Sign In with SST Email'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
