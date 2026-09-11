import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  Link as LinkIcon,
  Globe,
  Share2,
  Copy,
  Check,
  RotateCcw,
  User,
  ShieldCheck,
  ExternalLink,
  Code2,
  AtSign,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { soundFx } from '../../utils/soundEffects';
import { fireQuickConfetti, fireStarConfetti } from '../../utils/confettiUtils';
import { UserSocialLinks } from '../../types';
import { sanitizeImageUrl, SAMPLE_IMAGE_PRESETS, testImageLoad } from '../../utils/imageUrlHelper';

// Curated high-resolution academic & tech avatars
const CURATED_AVATARS = [
  {
    id: 'ai-architect',
    label: 'AI & Systems',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'tech-lead',
    label: 'Tech Lead / CR',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'algorithmist',
    label: 'Algorithmist',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'fullstack-dev',
    label: 'Full-Stack Dev',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'faculty-mentor',
    label: 'Faculty Mentor',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'researcher',
    label: 'ML Researcher',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'cyber-innovator',
    label: 'Innovator',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'creative-scholar',
    label: 'Scholar',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=80',
  },
];

// Helper to normalize social link inputs
function normalizeUrl(input: string, prefix: string): string {
  const trimmed = (input || '').trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const cleanHandle = trimmed.replace(/^@/, '');
  return `${prefix}${cleanHandle}`;
}

export const UserProfileCustomizationModal: React.FC = () => {
  const { addToast } = useToast();
  const {
    isProfileCustomizationOpen,
    setIsProfileCustomizationOpen,
    currentUser,
    updateUserProfile,
    userRole,
    currentStudentStats
  } = useApp();

  const [activeTab, setActiveTab] = useState<'avatar' | 'bio' | 'links' | 'preview'>('avatar');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasCopiedLink, setHasCopiedLink] = useState(false);

  // Form states initialized from currentUser
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [leetcode, setLeetcode] = useState('');
  const [twitter, setTwitter] = useState('');
  const [imageLink, setImageLink] = useState('');

  // Custom Image URL test input
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [imageError, setImageError] = useState(false);
  const [isVerifyingImage, setIsVerifyingImage] = useState(false);
  const [imageVerified, setImageVerified] = useState(false);

  // DiceBear Generator seed
  const [dicebearSeed, setDicebearSeed] = useState('');
  const [dicebearStyle, setDicebearStyle] = useState<'avataaars' | 'bottts' | 'lorelei' | 'adventurer'>('avataaars');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever modal opens or currentUser changes
  useEffect(() => {
    if (isProfileCustomizationOpen && currentUser) {
      setAvatar(currentUser.avatar || '');
      setName(currentUser.name || '');
      setHeadline(currentUser.headline || '');
      setBio(currentUser.bio || '');
      setGithub(currentUser.publicLinks?.github || '');
      setLinkedin(currentUser.publicLinks?.linkedin || '');
      setPortfolio(currentUser.publicLinks?.portfolio || '');
      setLeetcode(currentUser.publicLinks?.leetcode || '');
      setTwitter(currentUser.publicLinks?.twitter || '');
      setImageLink(currentUser.publicLinks?.imageLink || '');
      setCustomImageUrl(currentUser.avatar || '');
      setImageError(false);
      setImageVerified(!!currentUser.avatar);
      setIsVerifyingImage(false);
      setDicebearSeed(currentUser.studentId || currentUser.name || 'SST');
    }
  }, [isProfileCustomizationOpen, currentUser]);

  if (!isProfileCustomizationOpen) return null;

  // Compute initials fallback
  const initials = (name || currentUser.name || 'SST')
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Compress and encode uploaded image to Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (PNG, JPG, WebP).', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('Image is larger than 5MB. Compressing automatically...', 'info');
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 400;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setAvatar(compressedDataUrl);
          setImageError(false);
          soundFx.playPop();
          addToast('Photo uploaded and optimized successfully!', 'success');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleUrlInputChange = (val: string) => {
    setCustomImageUrl(val);
    setImageVerified(false);
    setImageError(false);
    const sanitized = sanitizeImageUrl(val);
    if (sanitized && (sanitized.startsWith('http') || sanitized.startsWith('data:'))) {
      setAvatar(sanitized);
    }
  };

  const handleApplyCustomUrl = async () => {
    if (!customImageUrl.trim()) return;
    const sanitized = sanitizeImageUrl(customImageUrl);
    setCustomImageUrl(sanitized);
    setAvatar(sanitized);
    setIsVerifyingImage(true);
    const ok = await testImageLoad(sanitized);
    setIsVerifyingImage(false);
    if (ok) {
      setImageError(false);
      setImageVerified(true);
      soundFx.playSuccess();
      addToast('Image verified and applied successfully!', 'success');
    } else {
      setImageError(true);
      setImageVerified(false);
      soundFx.playPop();
      addToast('Image URL applied. If it fails to show, check link public view permissions.', 'info');
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      if (!navigator.clipboard?.readText) {
        addToast('Clipboard access not supported in this browser.', 'error');
        return;
      }
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        addToast('Clipboard is empty. Copy an image URL first!', 'info');
        return;
      }
      const sanitized = sanitizeImageUrl(text.trim());
      setCustomImageUrl(sanitized);
      setAvatar(sanitized);
      setImageError(false);
      setImageVerified(true);
      soundFx.playPop();
      addToast('Pasted and applied image URL from clipboard!', 'success');
    } catch {
      addToast('Could not access clipboard. Please paste manually.', 'error');
    }
  };

  const handleGenerateDicebear = () => {
    const seed = (dicebearSeed.trim() || name || 'SST').toLowerCase();
    const generated = `https://api.dicebear.com/7.x/${dicebearStyle}/svg?seed=${encodeURIComponent(seed)}`;
    setAvatar(generated);
    setCustomImageUrl(generated);
    setImageError(false);
    setImageVerified(true);
    soundFx.playPop();
    fireQuickConfetti();
    addToast(`Generated unique ${dicebearStyle} avatar!`, 'success');
  };

  const handleResetToMonogram = () => {
    setAvatar('');
    setCustomImageUrl('');
    setImageVerified(false);
    setImageError(false);
    soundFx.playPop();
    addToast('Reset to default SST monogram initials.', 'info');
  };

  const shareableIdentifier = currentUser.studentId || currentUser.id || currentUser.email;
  const shareableUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?profile=${encodeURIComponent(shareableIdentifier)}`
    : `?profile=${shareableIdentifier}`;

  const handleCopyShareLink = async () => {
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
      setHasCopiedLink(true);
      soundFx.playSuccess();
      fireQuickConfetti();
      addToast('Shareable public profile link copied to clipboard!', 'success');
      setTimeout(() => setHasCopiedLink(false), 3000);
    } catch {
      addToast('Could not copy link automatically.', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prioritize sanitized customImageUrl if user entered something
      const finalAvatar = customImageUrl.trim()
        ? sanitizeImageUrl(customImageUrl.trim())
        : (avatar.trim() || '');

      const formattedLinks: UserSocialLinks = {
        github: normalizeUrl(github, 'https://github.com/'),
        linkedin: normalizeUrl(linkedin, 'https://linkedin.com/in/'),
        portfolio: portfolio.trim() ? (portfolio.startsWith('http') ? portfolio.trim() : `https://${portfolio.trim()}`) : '',
        leetcode: normalizeUrl(leetcode, 'https://leetcode.com/u/'),
        twitter: normalizeUrl(twitter, 'https://x.com/'),
        imageLink: imageLink.trim() ? sanitizeImageUrl(imageLink.trim()) : '',
      };

      await updateUserProfile({
        avatar: finalAvatar,
        name: name.trim() || currentUser.name,
        headline: headline.trim(),
        bio: bio.trim(),
        publicLinks: formattedLinks,
      });

      soundFx.playFanfare();
      fireStarConfetti();
      setIsProfileCustomizationOpen(false);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      addToast('Failed to save profile changes. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        onClick={() => setIsProfileCustomizationOpen(false)}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all w-full max-w-2xl my-6 border border-slate-200 flex flex-col max-h-[90vh]">
          {/* Top Banner & Header */}
          <div className="relative bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 px-6 py-5 text-white shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-amber-300">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-white">
                    Account Specialization & Profile
                  </h3>
                  <p className="text-xs text-indigo-200">
                    Customize your display photo, academic headline, and public links
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsProfileCustomizationOpen(false)}
                className="rounded-xl p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 mt-4 overflow-x-auto no-scrollbar pt-1">
              {[
                { id: 'avatar', label: '📷 Display Photo', count: avatar ? 'Set' : 'Default' },
                { id: 'bio', label: '📝 Headline & Bio', count: headline ? '✓' : '' },
                { id: 'links', label: '🔗 Public Links', count: (github || linkedin || portfolio || leetcode || twitter) ? 'Active' : '' },
                { id: 'preview', label: '🪪 Live Card & Share', count: 'Share' }
              ].map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      soundFx.playPop();
                      setActiveTab(tab.id as any);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-md scale-102'
                        : 'bg-white/10 hover:bg-white/20 text-white/90'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.count && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        isActive ? 'bg-indigo-100 text-indigo-800' : 'bg-white/15 text-white'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* TAB 1: DISPLAY PHOTO */}
            {activeTab === 'avatar' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Live Preview Card */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="relative shrink-0 mx-auto sm:mx-0">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20 ring-4 ring-white">
                      {avatar && !imageError ? (
                        <img
                          src={avatar}
                          alt="Avatar preview"
                          onError={() => setImageError(true)}
                          className="w-full h-full object-cover rounded-[14px]"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-900 text-white font-black text-2xl flex items-center justify-center rounded-[14px]">
                          {initials}
                        </div>
                      )}
                    </div>
                    {/* Badge */}
                    <div className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white border-2 border-white shadow-xs">
                      {userRole}
                    </div>
                  </div>

                  <div className="text-center sm:text-left space-y-1 flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base">{name || currentUser.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {currentUser.studentId || currentUser.email}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {headline || 'Official SST 2026 Student & Community Member'}
                    </p>
                    <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Upload Local Photo
                      </button>
                      {avatar && (
                        <button
                          type="button"
                          onClick={handleResetToMonogram}
                          className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Reset to Monogram
                        </button>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Option 1: Direct Image URL (Supports ANY Web / Drive / Cloud / GitHub link) */}
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-blue-600" />
                        Option A: Any Image URL Link (Web, Drive, Cloud, Social)
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Paste ANY link: Google Drive photo, Dropbox, GitHub profile, Unsplash, Imgur, or direct image URL.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handlePasteFromClipboard}
                      className="self-start sm:self-auto px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 flex items-center gap-1 transition cursor-pointer shrink-0"
                      title="Paste image link from clipboard"
                    >
                      <Copy className="w-3 h-3" />
                      Paste from Clipboard
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={e => handleUrlInputChange(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleApplyCustomUrl();
                        }
                      }}
                      placeholder="Paste ANY image URL (e.g. Google Drive share link, https://... or github.com/username)"
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      disabled={isVerifyingImage}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shrink-0 shadow-xs flex items-center gap-1.5"
                    >
                      {isVerifyingImage ? (
                        <span>Checking...</span>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Apply URL</span>
                        </>
                      )}
                    </button>
                    {customImageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomImageUrl('');
                          setAvatar('');
                          setImageVerified(false);
                          setImageError(false);
                          soundFx.playPop();
                        }}
                        className="px-2.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer shrink-0"
                        title="Clear link"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Verification / status indicator */}
                  {imageVerified && (
                    <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Image URL verified & active in preview!</span>
                    </div>
                  )}

                  {imageError && (
                    <div className="text-[11px] text-rose-600 font-medium flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                      <span>
                        Could not display image directly. If using Google Drive, ensure link sharing is set to "Anyone with the link can view".
                      </span>
                    </div>
                  )}

                  {/* Quick 1-Click Sample Presets */}
                  <div className="pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Quick 1-Click Sample Image Links:
                    </span>
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                      {SAMPLE_IMAGE_PRESETS.map(preset => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setCustomImageUrl(preset.url);
                            setAvatar(preset.url);
                            setImageError(false);
                            setImageVerified(true);
                            soundFx.playPop();
                            addToast(`Applied sample image URL (${preset.label})!`, 'info');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-[11px] font-bold text-slate-700 hover:text-indigo-700 transition shrink-0 cursor-pointer flex items-center gap-1 shadow-2xs"
                        >
                          <span>{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Option 2: Curated SST & Academic Presets Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Option B: Curated Academic & Tech Presets
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">1-Click Selection</span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                    {CURATED_AVATARS.map(cur => {
                      const isSelected = avatar === cur.url;
                      return (
                        <button
                          key={cur.id}
                          type="button"
                          onClick={() => {
                            setAvatar(cur.url);
                            setCustomImageUrl(cur.url);
                            setImageError(false);
                            soundFx.playPop();
                          }}
                          className={`group relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-blue-600 ring-2 ring-blue-500/40 scale-105 shadow-md'
                              : 'border-slate-200 hover:border-slate-400'
                          }`}
                          title={cur.label}
                        >
                          <img
                            src={cur.url}
                            alt={cur.label}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-blue-600/30 backdrop-blur-[1px] flex items-center justify-center">
                              <Check className="w-4 h-4 text-white drop-shadow-md stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Option 3: DiceBear Custom SVG Generator */}
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-indigo-950">Option C: Generate Custom AI / Vector Avatar</span>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-700 uppercase bg-indigo-100/70 px-2 py-0.5 rounded-full">
                      DiceBear 7.x
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-1">
                      <label className="block text-[10px] font-bold text-indigo-900 uppercase mb-1">Style</label>
                      <select
                        value={dicebearStyle}
                        onChange={e => setDicebearStyle(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-indigo-200 bg-white font-semibold text-slate-800 focus:outline-none"
                      >
                        <option value="avataaars">Avataaars (3D Persona)</option>
                        <option value="bottts">Bottts (Tech Robots)</option>
                        <option value="lorelei">Lorelei (Artistic)</option>
                        <option value="adventurer">Adventurer (Hero)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block text-[10px] font-bold text-indigo-900 uppercase mb-1">Seed / Handle</label>
                      <input
                        type="text"
                        value={dicebearSeed}
                        onChange={e => setDicebearSeed(e.target.value)}
                        placeholder="Your rollNo or name"
                        className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-indigo-200 bg-white text-slate-800 font-medium focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-1 flex items-end">
                      <button
                        type="button"
                        onClick={handleGenerateDicebear}
                        className="w-full px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Generate Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: HEADLINE & BIO */}
            {activeTab === 'bio' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Official institutional roster records remain synced.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Academic & Professional Headline
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={e => setHeadline(e.target.value)}
                    placeholder="e.g. Computer Science & AI | Class of 2028 | Scaler School of Technology"
                    maxLength={100}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                  {/* Suggestions Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[10px] font-bold text-slate-400">Suggestions:</span>
                    {[
                      'SST CSE 2026 • AI / Systems',
                      'Full-Stack Developer • Open Source',
                      'Class Representative (CR) • SST 2026',
                      'Competitive Programmer • LeetCode 2000+'
                    ].map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setHeadline(sug);
                          soundFx.playPop();
                        }}
                        className="text-[10px] font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 px-2 py-0.5 rounded-lg transition cursor-pointer"
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      About & Academic Bio
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">{bio.length} / 300</span>
                  </div>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    maxLength={300}
                    placeholder="Share your goals in English communication, technical projects, or personal vision within the SST community..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium resize-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Your bio will be featured on your shareable public profile card and in peer directory drawer views.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: PUBLIC SOCIAL LINKS */}
            {activeTab === 'links' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
                  <Globe className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    Add your developer handles or profile links below. They will be displayed on your official student badge and public profile card.
                  </span>
                </div>

                {/* GitHub */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-slate-900" />
                    GitHub Profile
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={github}
                      onChange={e => setGithub(e.target.value)}
                      placeholder="username or https://github.com/username"
                      className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-800 font-mono text-slate-800"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">gh/</span>
                  </div>
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-700" />
                    LinkedIn Profile
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={linkedin}
                      onChange={e => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-slate-800"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 font-bold text-xs">in/</span>
                  </div>
                </div>

                {/* Portfolio / Personal Website */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    Personal Portfolio / Website
                  </label>
                  <input
                    type="url"
                    value={portfolio}
                    onChange={e => setPortfolio(e.target.value)}
                    placeholder="https://yourdomain.dev"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-mono text-slate-800"
                  />
                </div>

                {/* LeetCode / Scaler */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-amber-600" />
                    LeetCode / Coding Profile
                  </label>
                  <input
                    type="text"
                    value={leetcode}
                    onChange={e => setLeetcode(e.target.value)}
                    placeholder="https://leetcode.com/u/username or handle"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-slate-800"
                  />
                </div>

                {/* Twitter / X */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                    <AtSign className="w-3.5 h-3.5 text-sky-500" />
                    Twitter / X Handle
                  </label>
                  <input
                    type="text"
                    value={twitter}
                    onChange={e => setTwitter(e.target.value)}
                    placeholder="@handle or https://x.com/handle"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-slate-800"
                  />
                </div>

                {/* Public Image / Headshot URL Link */}
                <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-purple-950 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                      Public Headshot / Image URL Link
                    </label>
                    <span className="text-[10px] font-bold text-purple-700 uppercase bg-purple-100/70 px-2 py-0.5 rounded-full">
                      Optional Image Link
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageLink}
                      onChange={e => setImageLink(e.target.value)}
                      placeholder="https://drive.google.com/... or https://images.unsplash.com/..."
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-purple-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-slate-900"
                    />
                    {imageLink && (
                      <a
                        href={sanitizeImageUrl(imageLink)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> View
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-purple-700/80 mt-1">
                    Direct link to your high-resolution Google Drive headshot, portfolio photo, or photography collection.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: LIVE PREVIEW & SHAREABLE LINK */}
            {activeTab === 'preview' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* 1-Click Copy Link Ribbon */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Shareable Public Profile
                    </span>
                    <p className="text-xs font-bold text-slate-900 mt-1">
                      Anyone with this link can view your verified SST academic profile card.
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono truncate max-w-sm mt-0.5">
                      {shareableUrl}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm cursor-pointer shrink-0 ${
                      hasCopiedLink
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {hasCopiedLink ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Public Link</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Public Profile Card Preview */}
                <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-lg bg-white">
                  {/* Top Gradient Header */}
                  <div className="h-28 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 relative p-4 flex items-start justify-between text-white">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/30">
                      Official SST Public Identity
                    </span>
                    <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-300" /> Verified Student
                    </span>
                  </div>

                  {/* Profile Body */}
                  <div className="px-6 pb-6 pt-0 relative">
                    {/* Avatar Overlap */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 gap-3 mb-3">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white p-1 ring-4 ring-white shadow-xl">
                        {avatar && !imageError ? (
                          <img
                            src={avatar}
                            alt={name}
                            className="w-full h-full object-cover rounded-[14px]"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-900 text-white font-black text-2xl flex items-center justify-center rounded-[14px]">
                            {initials}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {userRole}
                        </span>
                        {currentStudentStats && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {currentStudentStats.attendancePercentage}% Attendance
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Name & Headline */}
                    <div>
                      <h3 className="text-xl font-black text-slate-900">{name || currentUser.name}</h3>
                      <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                        {headline || 'Computer Science & AI • Scaler School of Technology (SST)'}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {currentUser.email} • ID: {currentUser.studentId || currentUser.id}
                      </p>
                    </div>

                    {/* Bio */}
                    {bio && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 leading-relaxed italic">
                        "{bio}"
                      </div>
                    )}

                    {/* Social Links Ribbon */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                      {github && (
                        <a
                          href={normalizeUrl(github, 'https://github.com/')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-slate-800 transition"
                        >
                          <Code2 className="w-3.5 h-3.5" />
                          <span>GitHub</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      )}
                      {linkedin && (
                        <a
                          href={normalizeUrl(linkedin, 'https://linkedin.com/in/')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-blue-700 transition"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>LinkedIn</span>
                          <ExternalLink className="w-3 h-3 text-blue-200" />
                        </a>
                      )}
                      {portfolio && (
                        <a
                          href={portfolio.startsWith('http') ? portfolio : `https://${portfolio}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-700 transition"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Portfolio</span>
                          <ExternalLink className="w-3 h-3 text-emerald-200" />
                        </a>
                      )}
                      {leetcode && (
                        <a
                          href={normalizeUrl(leetcode, 'https://leetcode.com/u/')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-amber-600 transition"
                        >
                          <Code2 className="w-3.5 h-3.5" />
                          <span>LeetCode</span>
                          <ExternalLink className="w-3 h-3 text-amber-200" />
                        </a>
                      )}
                      {twitter && (
                        <a
                          href={normalizeUrl(twitter, 'https://x.com/')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-sky-600 transition"
                        >
                          <AtSign className="w-3.5 h-3.5" />
                          <span>Twitter</span>
                          <ExternalLink className="w-3 h-3 text-sky-200" />
                        </a>
                      )}
                      {imageLink && (
                        <a
                          href={sanitizeImageUrl(imageLink)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-purple-700 transition"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Image / Photo</span>
                          <ExternalLink className="w-3 h-3 text-purple-200" />
                        </a>
                      )}
                      {!github && !linkedin && !portfolio && !leetcode && !twitter && !imageLink && (
                        <span className="text-xs text-slate-400 italic">
                          No social links added yet. Switch to "Public Links" tab to add your GitHub, LinkedIn, or Image link.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsProfileCustomizationOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Share Link</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black rounded-xl transition shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
