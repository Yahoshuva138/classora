import React from 'react';
import { RiskStatus, PriorityLevel, SessionStatus, FollowUpStatus, AttendanceStatus } from '../../types';
import {
  getRiskBadgeClasses,
  getPriorityBadgeClasses,
  getSessionStatusClasses,
  getFollowUpStatusClasses
} from '../../utils/formatters';

export const RiskBadge: React.FC<{ status: RiskStatus }> = ({ status }) => {
  const dotColor =
    status === 'On Track'
      ? 'bg-emerald-500'
      : status === 'Needs Attention'
      ? 'bg-amber-500'
      : 'bg-rose-500';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ring-1 ${getRiskBadgeClasses(
        status
      )}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: PriorityLevel }> = ({ priority }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${getPriorityBadgeClasses(
        priority
      )}`}
    >
      {priority}
    </span>
  );
};

export const SessionBadge: React.FC<{ status: SessionStatus }> = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSessionStatusClasses(
        status
      )}`}
    >
      {status}
    </span>
  );
};

export const FollowUpBadge: React.FC<{ status: FollowUpStatus }> = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getFollowUpStatusClasses(
        status
      )}`}
    >
      {status}
    </span>
  );
};

export const AttendancePill: React.FC<{ status: AttendanceStatus }> = ({ status }) => {
  let classes = 'bg-slate-100 text-slate-700';
  if (status === 'Present') classes = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  else if (status === 'Absent') classes = 'bg-rose-100 text-rose-800 border-rose-300';
  else if (status === 'Late') classes = 'bg-amber-100 text-amber-800 border-amber-300';
  else if (status === 'Excused') classes = 'bg-blue-100 text-blue-800 border-blue-300';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${classes}`}>
      {status}
    </span>
  );
};
