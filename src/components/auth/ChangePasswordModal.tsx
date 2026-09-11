import React, { useState } from 'react';
import {
  Key,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { soundFx } from '../../utils/soundEffects';
import { fireGrandCelebration } from '../../utils/confettiUtils';
import { useToast } from '../../context/ToastContext';

export const ChangePasswordModal: React.FC = () => {
  const {
    currentUser,
    isChangePasswordModalOpen,
    setIsChangePasswordModalOpen,
    updateCurrentUser
  } = useApp();
  const { addToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('SST@2026');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isChangePasswordModalOpen || !currentUser || !currentUser.isGoogleAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!newPassword || newPassword.trim().length < 4) {
      soundFx.playPop();
      setErrorMessage('New password must be at least 4 characters long.');
      return;
    }

    if (newPassword.trim() === 'SST@2026') {
      soundFx.playPop();
      setErrorMessage('Please choose a personal password different from the shared cohort default (SST@2026).');
      return;
    }

    if (newPassword !== confirmPassword) {
      soundFx.playPop();
      setErrorMessage('New password and confirmation password do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.changePassword({
        email: currentUser.email,
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim()
      });

      soundFx.playSuccess();
      fireGrandCelebration();
      setSuccessMessage(res.message || 'Password changed successfully!');
      updateCurrentUser({ mustChangePassword: false });
      addToast('Password updated successfully! Your account is secured.', 'success');

      setTimeout(() => {
        setIsChangePasswordModalOpen(false);
        setNewPassword('');
        setConfirmPassword('');
        setSuccessMessage(null);
      }, 1400);
    } catch (err: any) {
      soundFx.playPop();
      setErrorMessage(err.message || 'Failed to update password. Please check your current password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#231e36] text-white rounded-2xl max-w-md w-full shadow-2xl border border-white/10 p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            soundFx.playPop();
            setIsChangePasswordModalOpen(false);
          }}
          className="absolute top-4 right-4 text-white/40 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Icon */}
        <div className="flex items-start space-x-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20 shadow-inner">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">Change Your Password</h3>
            <p className="text-xs text-white/50 mt-0.5">
              Scaler School of Technology • {currentUser.name}
            </p>
          </div>
        </div>

        {/* Security Alert Callout */}
        <div className="mb-5 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs space-y-1 text-left">
          <p className="font-semibold flex items-center gap-1.5 text-amber-200">
            <Key className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            Security Notice: Default Password Active
          </p>
          <p className="leading-relaxed text-white/70 text-[11px]">
            Your account was accessed using the shared cohort default password (<code className="bg-white/10 px-1 py-0.5 rounded text-amber-300 font-mono font-bold">SST@2026</code>). Please create a private password to secure your personal dashboard and academic records.
          </p>
        </div>

        {/* Success Banner */}
        {successMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Change Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          {/* Current Password */}
          <div>
            <label className="block text-[11px] font-medium text-white/60 mb-1">
              Current / Default Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Enter current password (default: SST@2026)"
                className="w-full bg-[#322c4d] border border-white/10 focus:border-[#6c5dd3] focus:ring-1 focus:ring-[#6c5dd3] text-white placeholder:text-white/35 rounded-xl px-3.5 py-2.5 pr-10 text-xs outline-none transition shadow-inner font-mono"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 p-0.5 transition cursor-pointer"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[11px] font-medium text-white/60 mb-1">
              New Password (minimum 4 characters)
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Choose a new personal password"
                className="w-full bg-[#322c4d] border border-white/10 focus:border-[#6c5dd3] focus:ring-1 focus:ring-[#6c5dd3] text-white placeholder:text-white/35 rounded-xl px-3.5 py-2.5 pr-10 text-xs outline-none transition shadow-inner font-mono"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 p-0.5 transition cursor-pointer"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-[11px] font-medium text-white/60 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className="w-full bg-[#322c4d] border border-white/10 focus:border-[#6c5dd3] focus:ring-1 focus:ring-[#6c5dd3] text-white placeholder:text-white/35 rounded-xl px-3.5 py-2.5 pr-10 text-xs outline-none transition shadow-inner font-mono"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 p-0.5 transition cursor-pointer"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Match Indicator */}
          {newPassword && confirmPassword && (
            <div className="text-[11px] flex items-center gap-1.5 pt-0.5">
              {newPassword === confirmPassword ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                soundFx.playPop();
                setIsChangePasswordModalOpen(false);
              }}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-medium transition cursor-pointer"
            >
              Remind Me Later
            </button>
            <button
              type="submit"
              disabled={isLoading || !newPassword || newPassword !== confirmPassword}
              className="px-5 py-2.5 rounded-xl bg-[#6c5dd3] hover:bg-[#5e4fc4] active:bg-[#5344b4] text-white text-xs font-semibold shadow-lg shadow-[#6c5dd3]/25 transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isLoading ? 'Updating...' : 'Save & Secure Account'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
