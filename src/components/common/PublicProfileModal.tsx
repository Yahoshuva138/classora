import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Globe,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Code2,
  User,
  AtSign,
  GraduationCap,
  Sparkles,
  Award,
  BookOpen,
  Calendar,
  Edit3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { soundFx } from '../../utils/soundEffects';
import { fireQuickConfetti } from '../../utils/confettiUtils';

export const PublicProfileModal: React.FC = () => {
  const { addToast } = useToast();
  const {
    publicProfileTarget,
    closePublicProfile,
    currentUser,
    setIsProfileCustomizationOpen,
    userRole,
    studentStats
  } = useApp();

  const [hasCopied, setHasCopied] = useState(false);

  if (!publicProfileTarget) return null;

  const target = publicProfileTarget.student || publicProfileTarget.user;
  if (!target) return null;

  const isStudent = !!publicProfileTarget.student;
  const student = publicProfileTarget.student;
  const user = publicProfileTarget.user;

  // Find stats if student
  const stats = student ? studentStats.find(s => s.student.id === student.id) : null;

  const name = target.name || 'SST Scholar';
  const email = target.email || '';
  const avatar = target.avatar || '';
  const headline = target.headline || (isStudent ? 'SST 2026 Cohort • Computer Science & AI' : 'Scaler School of Technology Faculty');
  const bio = target.bio || '';
  const identifier = isStudent ? student?.rollNo || student?.id : user?.studentId || user?.id || user?.email;
  const role = user?.role || (student?.initialRemarks?.includes('CR') ? 'CR' : 'Student');

  const links = target.publicLinks || {};

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'SST';

  const shareableUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?profile=${encodeURIComponent(identifier || '')}`
    : `?profile=${identifier}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareableUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareableUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setHasCopied(true);
      soundFx.playSuccess();
      fireQuickConfetti();
      addToast('Public profile link copied to clipboard!', 'success');
      setTimeout(() => setHasCopied(false), 3000);
    } catch {
      addToast('Failed to copy link.', 'error');
    }
  };

  const isOwner = currentUser.email?.toLowerCase() === email.toLowerCase() ||
    (currentUser.studentId && currentUser.studentId === identifier) ||
    (currentUser.id && currentUser.id === identifier);

  const canEdit = isOwner || userRole === 'Admin';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        onClick={closePublicProfile}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all w-full max-w-xl my-6 border border-slate-200">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 relative p-4 flex items-start justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/30">
                Official SST Verified Identity
              </span>
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1 bg-emerald-950/40 backdrop-blur-xs px-2 py-0.5 rounded-full border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Active Member
              </span>
            </div>

            <button
              onClick={closePublicProfile}
              className="rounded-xl p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Card Body */}
          <div className="px-6 pb-6 relative">
            {/* Avatar & Action Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 gap-3 mb-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-white p-1 ring-4 ring-white shadow-2xl shrink-0">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={name}
                    className="w-full h-full object-cover rounded-[20px]"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-slate-900 text-white font-black text-3xl flex items-center justify-center rounded-[20px]">
                    {initials}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      closePublicProfile();
                      setIsProfileCustomizationOpen(true);
                    }}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition border border-blue-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    hasCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Name, Role & Headline */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{name}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  role === 'Admin'
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : role === 'Teacher'
                    ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                    : role === 'CR'
                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                }`}>
                  {role === 'Admin' ? '👑 Course Admin' : role === 'Teacher' ? '👨‍🏫 Faculty Teacher' : role === 'CR' ? '🎓 Lead CR' : '👨‍🎓 Student'}
                </span>
              </div>

              <p className="text-xs text-indigo-600 font-bold mt-1">
                {headline}
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-500 font-medium">
                <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                  {identifier}
                </span>
                <span>•</span>
                <span>{email}</span>
                {student?.group && (
                  <>
                    <span>•</span>
                    <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                      {student.group}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Bio */}
            {bio && (
              <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed italic">
                "{bio}"
              </div>
            )}

            {/* Student Stats Ribbon (if student) */}
            {stats && (
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Attendance</p>
                  <p className={`text-base font-black ${
                    stats.attendancePercentage >= 85
                      ? 'text-emerald-600'
                      : stats.attendancePercentage >= 70
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }`}>
                    {stats.attendancePercentage}%
                  </p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Overall Score</p>
                  <p className="text-base font-black text-blue-600">
                    {stats.overallScore} / 100
                  </p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-400">English Level</p>
                  <p className="text-xs font-bold text-purple-700 mt-1 truncate">
                    {student?.currentLevel || 'B1 (Intermediate)'}
                  </p>
                </div>
              </div>
            )}

            {/* Public Links & Profiles */}
            <div className="mt-5 pt-4 border-t border-slate-200">
              <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2.5">
                Public Profiles & Developer Handles
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                {links.github && (
                  <a
                    href={links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-slate-800 transition shadow-xs"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                )}
                {links.linkedin && (
                  <a
                    href={links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-blue-700 transition shadow-xs"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3 text-blue-200" />
                  </a>
                )}
                {links.portfolio && (
                  <a
                    href={links.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-700 transition shadow-xs"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Portfolio</span>
                    <ExternalLink className="w-3 h-3 text-emerald-200" />
                  </a>
                )}
                {links.leetcode && (
                  <a
                    href={links.leetcode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-amber-600 transition shadow-xs"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>LeetCode</span>
                    <ExternalLink className="w-3 h-3 text-amber-200" />
                  </a>
                )}
                {links.twitter && (
                  <a
                    href={links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-sky-600 transition shadow-xs"
                  >
                    <AtSign className="w-3.5 h-3.5" />
                    <span>Twitter</span>
                    <ExternalLink className="w-3 h-3 text-sky-200" />
                  </a>
                )}
                {!links.github && !links.linkedin && !links.portfolio && !links.leetcode && !links.twitter && (
                  <p className="text-xs text-slate-400 italic">
                    No public links added yet by this member.
                  </p>
                )}
              </div>
            </div>

            {/* Shareable Link Box */}
            <div className="mt-5 p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500 font-mono truncate max-w-xs sm:max-w-sm">
                {shareableUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-lg transition flex items-center gap-1 cursor-pointer shrink-0"
              >
                {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{hasCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
