import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  RotateCcw,
  Target
} from 'lucide-react';
import { StudentCalculatedStats } from '../../types';

interface AttendanceSimulatorWidgetProps {
  stats: StudentCalculatedStats;
  compact?: boolean;
}

export const AttendanceSimulatorWidget: React.FC<AttendanceSimulatorWidgetProps> = ({
  stats,
  compact = false
}) => {
  const [attendCount, setAttendCount] = useState<number>(2);
  const [missCount, setMissCount] = useState<number>(0);
  const [targetGoal, setTargetGoal] = useState<75 | 85>(75);

  const currentTotal = stats.totalApplicableSessions || 1;
  const currentAttended = stats.attendedSessions || (stats.presentCount + (stats.excusedCount || 0));
  const currentPct = stats.attendancePercentage;

  // Simulated calculations
  const simTotal = currentTotal + attendCount + missCount;
  const simAttended = currentAttended + attendCount;
  const simPct = simTotal > 0 ? (simAttended / simTotal) * 100 : 0;
  const diffPct = simPct - currentPct;

  // Status badge for simulation
  const simStatus =
    simPct >= 85 ? 'On Track' : simPct >= 70 ? 'Needs Attention' : 'At Risk';

  // Strategic projection math
  const goalDecimal = targetGoal / 100;
  let strategicAdvice = '';

  if (currentPct < targetGoal) {
    // How many consecutive classes needed to reach target
    // (currentAttended + k) / (currentTotal + k) >= goalDecimal
    // k * (1 - goalDecimal) >= goalDecimal * currentTotal - currentAttended
    const needed = Math.ceil(
      (goalDecimal * currentTotal - currentAttended) / (1 - goalDecimal)
    );
    const validNeeded = Math.max(1, needed);
    strategicAdvice = `You must attend the next ${validNeeded} consecutive ${
      validNeeded === 1 ? 'class' : 'classes'
    } without missing to reach your ${targetGoal}% goal.`;
  } else {
    // Safe misses buffer
    // currentAttended / (currentTotal + m) >= goalDecimal
    // m <= (currentAttended / goalDecimal) - currentTotal
    const safeMisses = Math.floor(currentAttended / goalDecimal - currentTotal);
    if (safeMisses > 0) {
      strategicAdvice = `Buffer safety: You can miss up to ${safeMisses} upcoming ${
        safeMisses === 1 ? 'class' : 'classes'
      } and still stay above ${targetGoal}%.`;
    } else {
      strategicAdvice = `Threshold warning: You are at the ${targetGoal}% boundary. Missing 1 class will drop your attendance below requirement!`;
    }
  }

  const handleReset = () => {
    setAttendCount(0);
    setMissCount(0);
  };

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                &ldquo;What-If&rdquo; Attendance Simulator
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                Predictive Model
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Simulate upcoming lectures to plan attendance and maintain University criteria
            </p>
          </div>
        </div>

        {/* Target Threshold Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs">
          <span className="text-[11px] font-semibold text-slate-500 px-2 flex items-center gap-1">
            <Target className="w-3.5 h-3.5" /> Target:
          </span>
          <button
            type="button"
            onClick={() => setTargetGoal(75)}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              targetGoal === 75
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            75% Min
          </button>
          <button
            type="button"
            onClick={() => setTargetGoal(85)}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              targetGoal === 85
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            85% Distinction
          </button>
        </div>
      </div>

      {/* Comparison Scoreboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Current State */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <p className="text-[11px] font-semibold text-slate-500 mb-1">Current Attendance</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-extrabold text-slate-900 font-mono">
              {currentPct.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400">
              ({currentAttended}/{currentTotal})
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Status: <span className="font-bold">{stats.status}</span>
          </p>
        </div>

        {/* Projected State */}
        <div className={`p-3.5 rounded-2xl border ${
          simStatus === 'On Track'
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            : simStatus === 'Needs Attention'
            ? 'bg-amber-50/70 border-amber-200 text-amber-900'
            : 'bg-rose-50/70 border-rose-200 text-rose-900'
        }`}>
          <p className="text-[11px] font-semibold opacity-75 mb-1">Projected Attendance</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-extrabold font-mono">
              {simPct.toFixed(1)}%
            </span>
            <span className="text-xs opacity-70">
              ({simAttended.toFixed(0)}/{simTotal})
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[11px] font-bold px-2 py-0.2 rounded-full bg-white/70">
              {simStatus}
            </span>
          </div>
        </div>

        {/* Net Change / Trajectory */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <p className="text-[11px] font-semibold text-slate-500 mb-1">Projected Shift</p>
          <div className="flex items-center space-x-1.5">
            {diffPct > 0 ? (
              <>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-xl font-extrabold text-emerald-600 font-mono">
                  +{diffPct.toFixed(1)}%
                </span>
              </>
            ) : diffPct < 0 ? (
              <>
                <TrendingDown className="w-5 h-5 text-rose-600" />
                <span className="text-xl font-extrabold text-rose-600 font-mono">
                  {diffPct.toFixed(1)}%
                </span>
              </>
            ) : (
              <span className="text-xl font-extrabold text-slate-600 font-mono">
                0.0%
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {attendCount + missCount === 0
              ? 'No upcoming classes applied'
              : `${attendCount + missCount} future classes simulated`}
          </p>
        </div>
      </div>

      {/* Interactive Sliders / Steppers */}
      <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Classes to Attend */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Upcoming Classes to Attend
              </span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                +{attendCount}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={attendCount}
              onChange={e => setAttendCount(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <span className="text-slate-400">Quick:</span>
              {[1, 3, 5, 8].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setAttendCount(n)}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 font-medium transition-colors"
                >
                  +{n}
                </button>
              ))}
            </div>
          </div>

          {/* Classes to Miss */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                Upcoming Classes to Miss / Absent
              </span>
              <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                {missCount}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={missCount}
              onChange={e => setMissCount(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <span className="text-slate-400">Quick:</span>
              {[0, 1, 2, 4].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setMissCount(n)}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-rose-100 hover:text-rose-800 font-medium transition-colors"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Scenario Buttons & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 text-[11px] font-semibold">Presets:</span>
            <button
              type="button"
              onClick={() => { setAttendCount(5); setMissCount(0); }}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-medium transition-colors"
            >
              Attend Next 5
            </button>
            <button
              type="button"
              onClick={() => { setAttendCount(2); setMissCount(2); }}
              className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-medium transition-colors"
            >
              50/50 Split (+2, -2)
            </button>
            <button
              type="button"
              onClick={() => { setAttendCount(0); setMissCount(2); }}
              className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 font-medium transition-colors"
            >
              Miss Next 2
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors font-medium text-[11px]"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>

      {/* Strategic Recommendation Callout */}
      <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 flex items-start space-x-3 text-xs">
        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-indigo-950">Academic Planning Recommendation:</p>
          <p className="text-indigo-800 leading-relaxed">{strategicAdvice}</p>
        </div>
      </div>
    </div>
  );
};
