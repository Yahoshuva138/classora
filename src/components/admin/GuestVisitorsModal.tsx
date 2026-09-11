import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Eye,
  ShieldCheck,
  Search,
  RefreshCw,
  Download,
  Trash2,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Clock,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { GuestVisitor } from '../../types';
import { soundFx } from '../../utils/soundEffects';

export const GuestVisitorsModal: React.FC = () => {
  const {
    isGuestVisitorsModalOpen,
    setIsGuestVisitorsModalOpen,
    userRole
  } = useApp();

  const { addToast } = useToast();

  const [visitors, setVisitors] = useState<GuestVisitor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deviceFilter, setDeviceFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Strictly restricted to Main Admin
  const isMainAdmin = userRole === 'Admin';

  const fetchVisitors = async () => {
    if (!isMainAdmin) return;
    try {
      setIsLoading(true);
      const list = await api.getGuestVisitors();
      if (Array.isArray(list)) {
        setVisitors(list);
      }
    } catch (err: any) {
      console.warn('Failed to fetch guest visitors list:', err);
      addToast('Could not load guest visitors list', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isGuestVisitorsModalOpen && isMainAdmin) {
      fetchVisitors();
    }
  }, [isGuestVisitorsModalOpen, isMainAdmin]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isGuestVisitorsModalOpen) {
        setIsGuestVisitorsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGuestVisitorsModalOpen, setIsGuestVisitorsModalOpen]);

  // Copy visitor ID or details
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    soundFx.playPop();
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Delete individual visitor session
  const handleDeleteVisitor = async (visitor: GuestVisitor) => {
    if (!window.confirm(`Remove session log for "${visitor.guestName}"?`)) return;
    try {
      setDeletingId(visitor.id);
      await api.deleteGuestVisitor(visitor.id);
      soundFx.playPop();
      setVisitors(prev => prev.filter(v => v.id !== visitor.id));
      addToast(`Session record for ${visitor.guestName} deleted`, 'info');
    } catch (err: any) {
      console.error(err);
      addToast('Failed to delete visitor record', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    if (visitors.length === 0) {
      addToast('No visitor records to export', 'info');
      return;
    }

    const headers = [
      'Session ID',
      'Guest Name',
      'Guest Email',
      'Device Type',
      'IP Address',
      'Login Time',
      'Last Active',
      'Page Views',
      'Blocked Mutations',
      'Status',
      'User Agent'
    ];

    const rows = visitors.map(v => [
      `"${v.id}"`,
      `"${v.guestName}"`,
      `"${v.guestEmail}"`,
      `"${v.deviceType || 'Unknown'}"`,
      `"${v.ipAddress || 'Internal'}"`,
      `"${new Date(v.loginTime).toLocaleString()}"`,
      `"${new Date(v.lastActiveTime).toLocaleString()}"`,
      v.pageViewsCount || 1,
      v.attemptedMutationsCount || 0,
      `"${v.status}"`,
      `"${(v.userAgent || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `classora_guest_visitors_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    soundFx.playPop();
    addToast('Guest visitors audit log exported as CSV', 'success');
  };

  // Calculate stats
  const stats = useMemo(() => {
    const total = visitors.length;
    const now = Date.now();
    // Active if marked active and pinged within last 15 mins
    const active = visitors.filter(v => {
      const lastActive = new Date(v.lastActiveTime).getTime();
      return v.status === 'Active' && now - lastActive < 15 * 60 * 1000;
    }).length;

    const desktop = visitors.filter(v => v.deviceType === 'Desktop').length;
    const mobile = visitors.filter(v => v.deviceType === 'Mobile').length;
    const tablet = visitors.filter(v => v.deviceType === 'Tablet').length;
    const totalBlockedMutations = visitors.reduce((sum, v) => sum + (v.attemptedMutationsCount || 0), 0);

    return { total, active, desktop, mobile, tablet, totalBlockedMutations };
  }, [visitors]);

  // Filter visitors
  const filteredVisitors = useMemo(() => {
    return visitors.filter(v => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.guestName.toLowerCase().includes(q) ||
        v.guestEmail.toLowerCase().includes(q) ||
        (v.ipAddress && v.ipAddress.toLowerCase().includes(q)) ||
        (v.id && v.id.toLowerCase().includes(q));

      const matchesDevice = deviceFilter === 'All' || v.deviceType === deviceFilter;
      const matchesStatus = statusFilter === 'All' || v.status === statusFilter;

      return matchesSearch && matchesDevice && matchesStatus;
    });
  }, [visitors, searchQuery, deviceFilter, statusFilter]);

  if (!isGuestVisitorsModalOpen || !isMainAdmin) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm transition-opacity"
        onClick={() => setIsGuestVisitorsModalOpen(false)}
      />

      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all z-10 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-teal-500/20 text-teal-300 border border-teal-400/40 shadow-inner">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-white tracking-tight">
                  Guest Visitors & Showcase Audit Registry
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-teal-500/30 text-teal-200 border border-teal-400/40">
                  Main Admin Only
                </span>
              </div>
              <p className="text-xs text-teal-100/70 mt-0.5">
                Special audit list of all external visitors exploring Classora in read-only sandbox mode.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsGuestVisitorsModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security & Sandbox Info Banner */}
        <div className="px-6 py-3 bg-teal-50/90 border-b border-teal-200 text-xs flex items-center justify-between gap-3 text-teal-950 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
            <span>
              <strong>Zero Data Mutation Guarantee:</strong> Guest visitors can observe cohort dashboards, syllabi, attendance, and analytics, but cannot modify, mark, or export student records.
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-md">
            🔒 Sandbox Guard Active
          </span>
        </div>

        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 bg-slate-50 border-b border-slate-200/80 shrink-0">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Total Visitors</span>
              <Globe className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {stats.total}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Registered sessions</div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Active Now</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
              {stats.active}
            </div>
            <div className="text-[11px] text-emerald-600/80 mt-0.5">Online within 15m</div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Devices</span>
              <Monitor className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-sm font-bold text-slate-800 mt-1.5 flex items-center gap-2">
              <span title="Desktop">{stats.desktop} 💻</span>
              <span>•</span>
              <span title="Mobile">{stats.mobile} 📱</span>
              {stats.tablet > 0 && (
                <>
                  <span>•</span>
                  <span title="Tablet">{stats.tablet} 📟</span>
                </>
              )}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Device breakdown</div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Blocked Mutations</span>
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-teal-700 mt-1">
              {stats.totalBlockedMutations}
            </div>
            <div className="text-[11px] text-teal-600 font-semibold mt-0.5">100% data protected</div>
          </div>
        </div>

        {/* Search, Filter & Action Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by visitor name, email, IP, or ID..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Device Filter */}
            <select
              value={deviceFilter}
              onChange={e => setDeviceFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 text-xs font-semibold text-slate-700 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="All">All Devices</option>
              <option value="Desktop">💻 Desktop</option>
              <option value="Mobile">📱 Mobile</option>
              <option value="Tablet">📟 Tablet</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 text-xs font-semibold text-slate-700 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">🟢 Active</option>
              <option value="Ended">⚪ Ended</option>
            </select>

            {/* CSV Export Button */}
            <button
              onClick={handleExportCsv}
              disabled={visitors.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition-all cursor-pointer disabled:opacity-50"
              title="Export visitors audit ledger as CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export CSV</span>
            </button>

            {/* Reload Button */}
            <button
              onClick={fetchVisitors}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all cursor-pointer disabled:opacity-50"
              title="Refresh visitor sessions"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Visitors Table */}
        <div className="flex-1 overflow-y-auto min-h-[250px]">
          {isLoading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin text-teal-600 mb-3" />
              <p className="text-sm font-semibold text-slate-600">Retrieving visitor audit records...</p>
            </div>
          ) : filteredVisitors.length === 0 ? (
            <div className="py-16 text-center px-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3 border border-teal-200/60">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Guest Visitors Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                {searchQuery || deviceFilter !== 'All' || statusFilter !== 'All'
                  ? 'No guest visitor records matched your search filters.'
                  : 'Whenever external guests click "Explore as Guest Visitor", their read-only sessions appear here exclusively for the Main Admin.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 z-10">
                <tr>
                  <th className="py-3 px-4">Visitor & Session ID</th>
                  <th className="py-3 px-3">Device & Client</th>
                  <th className="py-3 px-3">Origin IP</th>
                  <th className="py-3 px-3">Session Timeline</th>
                  <th className="py-3 px-3 text-center">Interactions</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVisitors.map(v => {
                  const isOnline =
                    v.status === 'Active' &&
                    Date.now() - new Date(v.lastActiveTime).getTime() < 15 * 60 * 1000;

                  return (
                    <tr key={v.id} className="hover:bg-teal-50/30 transition-colors">
                      {/* Visitor Details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white font-black flex items-center justify-center text-xs shadow-xs shrink-0">
                            👁️
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate">{v.guestName}</p>
                            <p className="text-[11px] text-slate-500 truncate">{v.guestEmail}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="font-mono text-[10px] text-slate-400 truncate max-w-[120px]">
                                {v.id}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(v.id, v.id)}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                                title="Copy visitor ID"
                              >
                                {copiedId === v.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Device & Client */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          {v.deviceType === 'Mobile' ? (
                            <Smartphone className="w-4 h-4 text-purple-600 shrink-0" />
                          ) : v.deviceType === 'Tablet' ? (
                            <Tablet className="w-4 h-4 text-amber-600 shrink-0" />
                          ) : (
                            <Monitor className="w-4 h-4 text-blue-600 shrink-0" />
                          )}
                          <span className="font-semibold text-slate-700">{v.deviceType || 'Desktop'}</span>
                        </div>
                        {v.userAgent && (
                          <p className="text-[10px] text-slate-400 truncate max-w-[160px] mt-0.5" title={v.userAgent}>
                            {v.userAgent}
                          </p>
                        )}
                      </td>

                      {/* Origin IP */}
                      <td className="py-3.5 px-3">
                        <span className="font-mono text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {v.ipAddress || '127.0.0.1'}
                        </span>
                      </td>

                      {/* Session Timeline */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1 text-slate-700 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{new Date(v.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Last seen: {new Date(v.lastActiveTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>

                      {/* Interactions & Sandbox Security */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-bold text-slate-800">
                            {v.pageViewsCount || 1} views
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded font-semibold border border-teal-200 mt-0.5">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            {v.attemptedMutationsCount || 0} blocked
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        {isOnline ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            Ended
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteVisitor(v)}
                          disabled={deletingId === v.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Prune session record"
                        >
                          <Trash2 className={`w-4 h-4 ${deletingId === v.id ? 'animate-spin text-rose-500' : ''}`} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Showing {filteredVisitors.length} of {visitors.length} visitors</span>
            <span>•</span>
            <span className="text-teal-700 font-semibold">Strictly hidden from Teachers, CRs, Students, and Guests</span>
          </div>
          <button
            onClick={() => setIsGuestVisitorsModalOpen(false)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition cursor-pointer"
          >
            Close Registry
          </button>
        </div>
      </div>
    </div>
  );
};
