import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  ShieldCheck,
  Crown,
  Search,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { UserRole, GoogleUser } from '../../types';
import { soundFx } from '../../utils/soundEffects';
import { fireQuickConfetti } from '../../utils/confettiUtils';

export const RoleManagementModal: React.FC = () => {
  const {
    isRoleManagementModalOpen,
    setIsRoleManagementModalOpen,
    userRole,
    currentUser,
    updateUserRole,
    refreshData
  } = useApp();

  const { addToast } = useToast();

  const [users, setUsers] = useState<GoogleUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Fetch users when modal opens
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await api.getUsers();
      if (data && Array.isArray(data)) {
        setUsers(data);
      }
    } catch (err: any) {
      console.warn('Failed to load user list:', err);
      addToast('Could not load user list from server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isRoleManagementModalOpen) {
      fetchUsers();
    }
  }, [isRoleManagementModalOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isRoleManagementModalOpen) {
        setIsRoleManagementModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRoleManagementModalOpen, setIsRoleManagementModalOpen]);

  const isAdmin = userRole === 'Admin';
  const isTeacher = userRole === 'Teacher';

  // Role stats
  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter(u => u.role === 'Admin').length;
    const teachers = users.filter(u => u.role === 'Teacher').length;
    const crs = users.filter(u => u.role === 'CR').length;
    const students = users.filter(u => u.role === 'Student').length;
    return { total, admins, teachers, crs, students };
  }, [users]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      // If Teacher is viewing the Faculty CR Appointment Console, only show Students and CRs
      if (!isAdmin && (u.role === 'Teacher' || u.role === 'Admin')) {
        return false;
      }

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.studentId && u.studentId.toLowerCase().includes(q));

      const matchesRole = roleFilter === 'All' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter, isAdmin]);

  if (!isRoleManagementModalOpen) return null;

  const handleRoleChange = async (targetUser: GoogleUser, newRole: UserRole) => {
    if (targetUser.role === newRole) return;
    try {
      setUpdatingUserId(targetUser.id || targetUser.email);
      soundFx.playPop();

      const success = await updateUserRole(targetUser.id || targetUser.email, newRole);
      if (success) {
        fireQuickConfetti();
        // Update local list
        setUsers(prev =>
          prev.map(u =>
            (u.id === targetUser.id || u.email === targetUser.email)
              ? { ...u, role: newRole }
              : u
          )
        );
        refreshData(true);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            👑 Super Admin
          </span>
        );
      case 'Teacher':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
            👨‍🏫 Teacher / Faculty
          </span>
        );
      case 'CR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            🎓 Class Rep (CR)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            👨‍🎓 Student
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsRoleManagementModalOpen(false)}
      />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all z-10 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shrink-0">
          <div className="flex items-center space-x-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-inner ${
              isAdmin
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                : 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40'
            }`}>
              {isAdmin ? <Crown className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-white tracking-tight">
                  {isAdmin ? 'SST Authority & Role Control Center' : 'Faculty CR Appointment Console'}
                </h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isAdmin ? 'bg-amber-500/30 text-amber-200 border border-amber-400/30' : 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/30'
                }`}>
                  {isAdmin ? 'Super Admin' : 'Faculty Access'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {isAdmin
                  ? 'Appoint Faculty Teachers, designate Class Representatives, and manage Student accounts.'
                  : 'Empower students as Class Representatives (CR) or relieve CR duties for your course.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsRoleManagementModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className={`px-6 py-3 border-b text-xs flex items-center gap-2.5 shrink-0 ${
          isAdmin
            ? 'bg-amber-50/80 text-amber-900 border-amber-200'
            : 'bg-indigo-50/80 text-indigo-900 border-indigo-200'
        }`}>
          <ShieldCheck className={`w-4 h-4 shrink-0 ${isAdmin ? 'text-amber-600' : 'text-indigo-600'}`} />
          <span>
            {isAdmin
              ? '👑 Super Admin Hierarchy: You have unrestricted authority to appoint Teachers, CRs, and Students.'
              : '👨‍🏫 Faculty Hierarchy: You can designate students as Class Representatives (CR) or revert them to Student status.'}
          </span>
        </div>

        {/* Quick Stats Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between flex-wrap gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <span className="font-bold text-slate-700">Total Users: <span className="text-slate-900">{stats.total}</span></span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-amber-700">👑 Admins: {stats.admins}</span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-indigo-700">👨‍🏫 Teachers: {stats.teachers}</span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-blue-700">🎓 CRs: {stats.crs}</span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-emerald-700">👨‍🎓 Students: {stats.students}</span>
          </div>

          <button
            onClick={fetchUsers}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            title="Refresh user roster from live database"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            <span>Reload</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, SST email, or roll number..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500">Filter Position:</label>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            >
              <option value="All">All Roles ({stats.total})</option>
              <option value="Admin">Admins ({stats.admins})</option>
              <option value="Teacher">Teachers ({stats.teachers})</option>
              <option value="CR">Class Reps ({stats.crs})</option>
              <option value="Student">Students ({stats.students})</option>
            </select>
          </div>
        </div>

        {/* User List Table */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isLoading && users.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
              Loading institutional user registry...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              No users found matching "{searchQuery}".
            </div>
          ) : (
            filteredUsers.map(user => {
              const isUpdating = updatingUserId === (user.id || user.email);
              const isCurrentLoggedIn = currentUser.email === user.email;

              return (
                <div
                  key={user.id || user.email}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  {/* User Details */}
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-200 overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        (user.name || 'User').slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-xs text-slate-900 truncate">
                          {user.name}
                        </p>
                        {isCurrentLoggedIn && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono truncate">
                        {user.email} {user.studentId ? `• ${user.studentId}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Position Badge & Control */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div>{getRoleBadge(user.role)}</div>

                    {/* Action Buttons based on logged in authority */}
                    {isAdmin ? (
                      /* Admin Full Select Control */
                      <div className="flex items-center gap-1.5">
                        <select
                          value={user.role}
                          disabled={isUpdating}
                          onChange={e => handleRoleChange(user, e.target.value as UserRole)}
                          className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 cursor-pointer disabled:opacity-50"
                        >
                          <option value="Admin">👑 Super Admin</option>
                          <option value="Teacher">👨‍🏫 Teacher / Faculty</option>
                          <option value="CR">🎓 Class Rep (CR)</option>
                          <option value="Student">👨‍🎓 Student</option>
                        </select>
                      </div>
                    ) : isTeacher ? (
                      /* Teacher CR Appointment / Removal Control */
                      <div className="flex items-center gap-1.5">
                        {user.role === 'Student' && (
                          <button
                            onClick={() => handleRoleChange(user, 'CR')}
                            disabled={isUpdating}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                            title="Appoint as Class Representative"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Appoint as CR</span>
                          </button>
                        )}
                        {user.role === 'CR' && (
                          <button
                            onClick={() => handleRoleChange(user, 'Student')}
                            disabled={isUpdating}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                            title="Relieve from CR role back to regular Student"
                          >
                            <span>Relieve to Student</span>
                          </button>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Official SST Scaler School of Technology Security Guard</span>
          <button
            onClick={() => setIsRoleManagementModalOpen(false)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
