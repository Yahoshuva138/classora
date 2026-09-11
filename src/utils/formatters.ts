import { RiskStatus, PriorityLevel, SessionStatus, FollowUpStatus } from '../types';

export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getInitials(name: string): string {
  if (!name) return 'ST';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getRiskBadgeClasses(status: RiskStatus): string {
  switch (status) {
    case 'On Track':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20';
    case 'Needs Attention':
      return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20';
    case 'At Risk':
      return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-600/20';
  }
}

export function getPriorityBadgeClasses(priority: PriorityLevel): string {
  switch (priority) {
    case 'Urgent':
      return 'bg-red-100 text-red-800 border-red-200 font-semibold';
    case 'High':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Medium':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Low':
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export function getSessionStatusClasses(status: SessionStatus): string {
  switch (status) {
    case 'Completed':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'In Progress':
      return 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse';
    case 'Upcoming':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'Cancelled':
      return 'bg-slate-100 text-slate-500 border-slate-200 line-through';
  }
}

export function getFollowUpStatusClasses(status: FollowUpStatus): string {
  switch (status) {
    case 'Completed':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'In Progress':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Pending':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Cancelled':
      return 'bg-slate-100 text-slate-500 border-slate-200';
  }
}

export function formatTimeAgo(dateString: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.max(0, Math.floor(diffMs / 1000));
    if (diffSec < 60) return 'just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'yesterday';
    return `${diffDays}d ago`;
  } catch {
    return dateString;
  }
}
