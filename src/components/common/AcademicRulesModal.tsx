import React, { useState, useEffect } from 'react';
import {
  X,
  Sliders,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Bell,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { soundFx } from '../../utils/soundEffects';
import { fireQuickConfetti } from '../../utils/confettiUtils';
import { useToast } from '../../context/ToastContext';

interface AcademicRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AcademicRulesModal: React.FC<AcademicRulesModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useApp();
  const { addToast } = useToast();

  const [onTrack, setOnTrack] = useState(settings.onTrackThreshold ?? 85);
  const [needsAttention, setNeedsAttention] = useState(settings.needsAttentionThreshold ?? 75);
  const [atRisk, setAtRisk] = useState(settings.atRiskThreshold ?? 70);
  const [lateWeight, setLateWeight] = useState(settings.lateAttendanceWeight ?? 0.5);
  const [lowAlerts, setLowAlerts] = useState(settings.notifications?.lowAttendanceAlerts ?? true);
  const [followUpReminders, setFollowUpReminders] = useState(settings.notifications?.followUpReminders ?? true);
  const [sessionReminders, setSessionReminders] = useState(settings.notifications?.sessionReminders ?? true);

  // Sync when settings change
  useEffect(() => {
    setOnTrack(settings.onTrackThreshold ?? 85);
    setNeedsAttention(settings.needsAttentionThreshold ?? 75);
    setAtRisk(settings.atRiskThreshold ?? 70);
    setLateWeight(settings.lateAttendanceWeight ?? 0.5);
    setLowAlerts(settings.notifications?.lowAttendanceAlerts ?? true);
    setFollowUpReminders(settings.notifications?.followUpReminders ?? true);
    setSessionReminders(settings.notifications?.sessionReminders ?? true);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  // Preset Handlers
  const applyPreset = (ot: number, na: number, ar: number, lw: number, label: string) => {
    soundFx.playPop();
    setOnTrack(ot);
    setNeedsAttention(na);
    setAtRisk(ar);
    setLateWeight(lw);
    addToast(`Applied "${label}" rule preset`, 'info');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (atRisk >= onTrack) {
      addToast('At-Risk threshold must be lower than On-Track threshold.', 'error');
      return;
    }

    soundFx.playSuccess();
    fireQuickConfetti();

    updateSettings({
      onTrackThreshold: Number(onTrack),
      needsAttentionThreshold: Number(needsAttention),
      atRiskThreshold: Number(atRisk),
      lateAttendanceWeight: Number(lateWeight),
      notifications: {
        ...settings.notifications,
        lowAttendanceAlerts: lowAlerts,
        followUpReminders: followUpReminders,
        sessionReminders: sessionReminders,
      }
    });

    addToast(`Academic Rules updated! Recalculated dashboard at ${onTrack}% On-Track / ${atRisk}% At-Risk.`, 'success');
    onClose();
  };

  const handleResetDefaults = () => {
    soundFx.playPop();
    setOnTrack(85);
    setNeedsAttention(75);
    setAtRisk(70);
    setLateWeight(0.5);
    setLowAlerts(true);
    setFollowUpReminders(true);
    setSessionReminders(true);
    addToast('Reset to SST Official Academic Standards', 'info');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden relative my-auto max-h-[calc(100vh-2rem)] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 p-5 sm:p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Set Academic Regulations & Evaluation Rules
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Real-Time Recalculation
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Configure attendance thresholds, condonation limits, and evaluation weights for Subject - 2.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Visual Tier Preview Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Threshold Distribution Preview</span>
              <span className="text-[11px] text-slate-500 font-normal">Scale: 0% to 100%</span>
            </div>
            <div className="w-full h-4 rounded-full bg-slate-100 flex overflow-hidden p-0.5 border border-slate-200">
              <div
                style={{ width: `${atRisk}%` }}
                className="h-full bg-rose-500 rounded-l-full flex items-center justify-center text-[9px] font-black text-white transition-all duration-300"
                title={`At Risk (< ${atRisk}%)`}
              >
                {atRisk > 20 && `< ${atRisk}%`}
              </div>
              <div
                style={{ width: `${Math.max(0, onTrack - atRisk)}%` }}
                className="h-full bg-amber-400 flex items-center justify-center text-[9px] font-black text-slate-900 transition-all duration-300"
                title={`Needs Attention (${atRisk}% - ${onTrack - 1}%)`}
              >
                {onTrack - atRisk > 15 && `${atRisk}–${onTrack}%`}
              </div>
              <div
                style={{ width: `${Math.max(0, 100 - onTrack)}%` }}
                className="h-full bg-emerald-500 rounded-r-full flex items-center justify-center text-[9px] font-black text-white transition-all duration-300"
                title={`On Track (≥ ${onTrack}%)`}
              >
                {100 - onTrack > 15 && `≥ ${onTrack}%`}
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium px-1">
              <span className="text-rose-600 font-bold">● At Risk (&lt;{atRisk}%)</span>
              <span className="text-amber-600 font-bold">● Warning ({atRisk}%–{onTrack - 1}%)</span>
              <span className="text-emerald-600 font-bold">● On Track (≥{onTrack}%)</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Standard Presets:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => applyPreset(85, 75, 70, 0.5, 'SST Standard')}
                className={`p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                  onTrack === 85 && atRisk === 70 && lateWeight === 0.5
                    ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>SST Standard</span>
                  {onTrack === 85 && atRisk === 70 && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">85% On Track • &lt;70% Debarment</div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset(90, 80, 75, 0.5, 'Strict Faculty')}
                className={`p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                  onTrack === 90 && atRisk === 75
                    ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>Strict Faculty</span>
                  {onTrack === 90 && atRisk === 75 && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">90% On Track • &lt;75% Debarment</div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset(80, 70, 65, 1.0, 'Grace Period')}
                className={`p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                  onTrack === 80 && atRisk === 65
                    ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>Grace Examination</span>
                  {onTrack === 80 && atRisk === 65 && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">80% On Track • &lt;65% Debarment</div>
              </button>
            </div>
          </div>

          {/* Individual Threshold Sliders & Number Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* On Track */}
            <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <label className="text-xs font-bold text-emerald-950 block">
                🟢 On-Track Honor (%)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={onTrack}
                  onChange={e => setOnTrack(Number(e.target.value))}
                  className="w-full text-base font-black p-2 rounded-xl border border-emerald-300 bg-white text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-sm font-bold text-emerald-800">%</span>
              </div>
              <input
                type="range"
                min={50}
                max={100}
                value={onTrack}
                onChange={e => setOnTrack(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <p className="text-[10px] text-emerald-700 leading-tight">
                Qualifies for Merit Certificate & Campus honors.
              </p>
            </div>

            {/* Warning / Needs Attention */}
            <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-2">
              <label className="text-xs font-bold text-amber-950 block">
                🟡 Needs Attention (%)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={40}
                  max={95}
                  value={needsAttention}
                  onChange={e => setNeedsAttention(Number(e.target.value))}
                  className="w-full text-base font-black p-2 rounded-xl border border-amber-300 bg-white text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-sm font-bold text-amber-800">%</span>
              </div>
              <input
                type="range"
                min={40}
                max={95}
                value={needsAttention}
                onChange={e => setNeedsAttention(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[10px] text-amber-700 leading-tight">
                Triggers CR call intervention & makeup lab work.
              </p>
            </div>

            {/* At Risk Debarment */}
            <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-2">
              <label className="text-xs font-bold text-rose-950 block">
                🔴 Debarment Risk (&lt; %)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={30}
                  max={90}
                  value={atRisk}
                  onChange={e => setAtRisk(Number(e.target.value))}
                  className="w-full text-base font-black p-2 rounded-xl border border-rose-300 bg-white text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <span className="text-sm font-bold text-rose-800">%</span>
              </div>
              <input
                type="range"
                min={30}
                max={90}
                value={atRisk}
                onChange={e => setAtRisk(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <p className="text-[10px] text-rose-700 leading-tight">
                Condonation alert and debarment warning from oral exams.
              </p>
            </div>
          </div>

          {/* Late Weight & Notification Rules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Late Weight Setting */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                ⏱️ Late Arrival Attendance Credit
              </label>
              <select
                value={lateWeight}
                onChange={e => setLateWeight(Number(e.target.value))}
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value={0.5}>0.5x Credit (Standard: 2 Lates = 1 Full Present)</option>
                <option value={0.75}>0.75x Credit (Generous Grace: 75% credit)</option>
                <option value={1.0}>1.0x Credit (Full Credit: Treated as Present)</option>
                <option value={0.0}>0.0x Credit (Strict: Late arrivals treated as Absent)</option>
              </select>
              <p className="text-[10px] text-slate-500">
                Determines how partial attendance hours are credited toward aggregate percentage.
              </p>
            </div>

            {/* Notification Automation Triggers */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <label className="text-xs font-bold text-slate-800 block flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-indigo-600" />
                <span>Automated Alert Rules</span>
              </label>
              <div className="space-y-1.5 text-xs">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={lowAlerts}
                    onChange={e => setLowAlerts(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 font-medium">Automatic alerts when attendance &lt; {atRisk}%</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={followUpReminders}
                    onChange={e => setFollowUpReminders(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 font-medium">CR follow-up reminders for pending tasks</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sessionReminders}
                    onChange={e => setSessionReminders(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 font-medium">Session schedule & timetable notifications</span>
                </label>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer py-1 self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to University Standards</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Apply Rules & Recalculate</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
