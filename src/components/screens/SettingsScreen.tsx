import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Sliders,
  Users,
  GraduationCap,
  Bell,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  Save,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { soundFx } from '../../utils/soundEffects';

export const SettingsScreen: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetToDemoData,
    soundEnabled,
    toggleSound,
    soundVolume,
    setSoundVolume
  } = useApp();

  const [localSettings, setLocalSettings] = useState(settings);
  const [newBatchName, setNewBatchName] = useState('');
  const [newFacultyName, setNewFacultyName] = useState('');
  const [newSessionTypeName, setNewSessionTypeName] = useState('');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSaveAttendanceRules = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      onTrackThreshold: Number(localSettings.onTrackThreshold),
      needsAttentionThreshold: Number(localSettings.needsAttentionThreshold),
      atRiskThreshold: Number(localSettings.atRiskThreshold),
      lateAttendanceWeight: Number(localSettings.lateAttendanceWeight),
    });
  };

  const handleToggleNotification = (key: keyof typeof settings.notifications) => {
    const updated = {
      ...localSettings.notifications,
      [key]: !localSettings.notifications[key],
    };
    setLocalSettings({ ...localSettings, notifications: updated });
    updateSettings({ notifications: updated });
  };

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchName.trim()) return;
    const updated = [...localSettings.batches, newBatchName.trim()];
    setLocalSettings({ ...localSettings, batches: updated });
    updateSettings({ batches: updated });
    setNewBatchName('');
  };

  const handleRemoveBatch = (batch: string) => {
    const updated = localSettings.batches.filter(b => b !== batch);
    setLocalSettings({ ...localSettings, batches: updated });
    updateSettings({ batches: updated });
  };

  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacultyName.trim()) return;
    const updated = [...localSettings.facultyList, newFacultyName.trim()];
    setLocalSettings({ ...localSettings, facultyList: updated });
    updateSettings({ facultyList: updated });
    setNewFacultyName('');
  };

  const handleRemoveFaculty = (faculty: string) => {
    const updated = localSettings.facultyList.filter(f => f !== faculty);
    setLocalSettings({ ...localSettings, facultyList: updated });
    updateSettings({ facultyList: updated });
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Top Welcome */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
        <div className="flex items-center space-x-3 mb-1">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Class Representative Tracker Settings
            </h2>
            <p className="text-xs text-slate-500">
              Configure attendance thresholds, batch names, faculty list, and notification triggers.
            </p>
          </div>
        </div>
      </div>

      {/* 1. ATTENDANCE RULES & RISK THRESHOLDS */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Sliders className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Attendance Risk Threshold Rules
          </h3>
        </div>

        <form onSubmit={handleSaveAttendanceRules} className="space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            These percentages determine which students automatically qualify as On Track, Needs Attention, or At Risk across all tables, charts, and follow-up engines.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <label className="text-xs font-bold text-emerald-900 block mb-1">
                🟢 On Track Threshold (%)
              </label>
              <input
                type="number"
                min={50}
                max={100}
                value={localSettings.onTrackThreshold}
                onChange={e =>
                  setLocalSettings({ ...localSettings, onTrackThreshold: Number(e.target.value) })
                }
                className="w-full text-sm font-bold p-2 rounded-lg border border-emerald-300 bg-white"
              />
              <p className="text-[11px] text-emerald-700 mt-1">Default: 85% and above</p>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
              <label className="text-xs font-bold text-amber-900 block mb-1">
                🟡 Needs Attention (%)
              </label>
              <input
                type="number"
                min={40}
                max={90}
                value={localSettings.needsAttentionThreshold}
                onChange={e =>
                  setLocalSettings({ ...localSettings, needsAttentionThreshold: Number(e.target.value) })
                }
                className="w-full text-sm font-bold p-2 rounded-lg border border-amber-300 bg-white"
              />
              <p className="text-[11px] text-amber-700 mt-1">Default: 70% to 84%</p>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50">
              <label className="text-xs font-bold text-rose-900 block mb-1">
                🔴 At Risk Threshold (&lt; %)
              </label>
              <input
                type="number"
                min={30}
                max={80}
                value={localSettings.atRiskThreshold}
                onChange={e =>
                  setLocalSettings({ ...localSettings, atRiskThreshold: Number(e.target.value) })
                }
                className="w-full text-sm font-bold p-2 rounded-lg border border-rose-300 bg-white"
              />
              <p className="text-[11px] text-rose-700 mt-1">Default: Under 70%</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2 text-xs text-slate-600">
              <span className="font-semibold">Late Attendance Weight:</span>
              <select
                value={localSettings.lateAttendanceWeight}
                onChange={e =>
                  setLocalSettings({ ...localSettings, lateAttendanceWeight: Number(e.target.value) })
                }
                className="p-1.5 rounded-lg border border-slate-300 text-xs bg-white"
              >
                <option value={0.5}>0.5 (Half presence)</option>
                <option value={1.0}>1.0 (Full presence)</option>
                <option value={0.0}>0.0 (Treated as absent)</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Thresholds
            </button>
          </div>
        </form>
      </div>

      {/* 2. BATCHES MANAGEMENT */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Users className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Manage Student Batches
          </h3>
        </div>

        <form onSubmit={handleAddBatch} className="flex gap-2">
          <input
            type="text"
            value={newBatchName}
            onChange={e => setNewBatchName(e.target.value)}
            placeholder="e.g. Batch D - Fast Track Speaking"
            className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Batch
          </button>
        </form>

        <div className="space-y-2">
          {localSettings.batches.map(batch => (
            <div
              key={batch}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-semibold"
            >
              <span className="text-slate-800">{batch}</span>
              {localSettings.batches.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveBatch(batch)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. FACULTY LIST */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Faculty Directory & Instructors
          </h3>
        </div>

        <form onSubmit={handleAddFaculty} className="flex gap-2">
          <input
            type="text"
            value={newFacultyName}
            onChange={e => setNewFacultyName(e.target.value)}
            placeholder="e.g. Dr. Sunita Kulkarni (Voice Coach)"
            className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Faculty
          </button>
        </form>

        <div className="space-y-2">
          {localSettings.facultyList.map(faculty => (
            <div
              key={faculty}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-semibold"
            >
              <span className="text-slate-800">{faculty}</span>
              {localSettings.facultyList.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveFaculty(faculty)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. NOTIFICATION PREFERENCES */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Bell className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Notification Alert Triggers
          </h3>
        </div>

        <div className="space-y-3">
          {[
            {
              key: 'lowAttendanceAlerts' as const,
              title: 'Low Attendance Alerts',
              desc: 'Show in-app notification when student drops below the Needs Attention threshold.',
            },
            {
              key: 'followUpReminders' as const,
              title: 'Follow-up Due Reminders',
              desc: 'Notify about urgent pending interventions due today.',
            },
            {
              key: 'sessionReminders' as const,
              title: 'Today Session Reminders',
              desc: 'Broadcast upcoming class times and room allocations in the notification bell.',
            },
            {
              key: 'taskReminders' as const,
              title: 'CR Task Checklist Alerts',
              desc: 'Remind about pending daily responsibilities before evening cutoff.',
            },
          ].map(item => (
            <div
              key={item.key}
              onClick={() => handleToggleNotification(item.key)}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-slate-900">{item.title}</p>
                <p className="text-[11px] text-slate-500">{item.desc}</p>
              </div>
              <div
                className={`w-10 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                  localSettings.notifications[item.key] ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. SOUND EFFECTS & AUDIO PREFERENCES */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-blue-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Audio Feedback & Sound Effects
            </h3>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${soundEnabled ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
            {soundEnabled ? 'Active' : 'Muted'}
          </span>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Synthetic audio cues provide instant acoustic confirmation when marking attendance, resolving follow-ups, or completing tasks. Generated with zero network delay via the Web Audio API.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Master Toggle */}
          <div
            onClick={toggleSound}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-bold text-slate-900">Sound Effects Master</p>
              <p className="text-[11px] text-slate-500">
                {soundEnabled ? 'Click to silence sound cues' : 'Click to enable gentle acoustic feedback'}
              </p>
            </div>
            <div
              className={`w-10 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                soundEnabled ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
            </div>
          </div>

          {/* Volume Slider & Test Button */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Feedback Volume</span>
              <span className="text-xs font-mono font-bold text-blue-600">
                {Math.round(soundVolume * 100)}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              disabled={!soundEnabled}
              value={soundVolume}
              onChange={e => setSoundVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-40"
            />

            <div className="flex items-center justify-end">
              <button
                type="button"
                disabled={!soundEnabled}
                onClick={() => soundFx.playSuccess()}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Test Sound Cue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. SST ACADEMIC DATABASE OPERATIONS */}
      <div className="bg-blue-50/60 rounded-2xl p-6 border border-blue-200 space-y-3">
        <div className="flex items-center space-x-2">
          <RotateCcw className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider">
            SST 2026 Academic Database Operations
          </h3>
        </div>
        <p className="text-xs text-blue-800 leading-relaxed">
          Re-synchronize with the official Scaler School of Technology (SST) 2026 registry containing the 44 enrolled students, 12 syllabus sessions, 7 discussion groups, and live Express backend store.
        </p>
        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Re-sync Official SST 2026 Cohort
        </button>
      </div>

      {/* CONFIRM RESET DIALOG */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          resetToDemoData();
          setLocalSettings(settings);
        }}
        title="Re-sync Official SST 2026 Database"
        message="This will re-index all 44 students from the official English assignment list, restore the 12 syllabus sessions, and synchronize with the live backend. Continue?"
        confirmText="Re-sync Database"
        isDestructive={false}
      />
    </div>
  );
};
