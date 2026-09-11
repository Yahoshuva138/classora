import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  List,
  Plus,
  Search,
  Filter,
  UserCheck,
  MapPin,
  Clock,
  User,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Session, SessionStatus, SessionMode } from '../../types';
import { SessionBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatDate } from '../../utils/formatters';
import { WhatsAppBroadcastModal } from '../common/WhatsAppBroadcastModal';

export const SessionsScreen: React.FC = () => {
  const {
    sessions,
    attendanceRecords,
    students,
    settings,
    setActiveTab,
    setSelectedSessionId,
    addSession,
    updateSession,
    deleteSession
  } = useApp();

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [batchFilter, setBatchFilter] = useState('All');

  // WhatsApp Broadcast Modal State
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastSessionId, setBroadcastSessionId] = useState<string | null>(null);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    topic: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:30 AM',
    endTime: '11:00 AM',
    faculty: settings.facultyList[0] || 'Noor Nigar',
    batch: settings.batches[0] || 'Batch A - Morning',
    mode: 'Offline' as SessionMode,
    location: 'Language Lab 102',
    status: 'Upcoming' as SessionStatus,
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      topic: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:30 AM',
      endTime: '11:00 AM',
      faculty: settings.facultyList[0] || 'Noor Nigar',
      batch: settings.batches[0] || 'Batch A - Morning',
      mode: 'Offline',
      location: 'Language Lab 102',
      status: 'Upcoming',
      notes: '',
    });
  };

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        session.topic.toLowerCase().includes(q) ||
        session.faculty.toLowerCase().includes(q) ||
        session.location.toLowerCase().includes(q) ||
        session.id.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' || session.status === statusFilter;
      const matchesBatch = batchFilter === 'All' || session.batch === batchFilter;

      return matchesSearch && matchesStatus && matchesBatch;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [sessions, searchQuery, statusFilter, batchFilter]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic || !formData.date) return;
    addSession(formData);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession) return;
    updateSession(editingSession.id, formData);
    setIsEditModalOpen(false);
    setEditingSession(null);
  };

  const openEditModal = (session: Session) => {
    setEditingSession(session);
    setFormData({
      topic: session.topic,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      faculty: session.faculty,
      batch: session.batch,
      mode: session.mode,
      location: session.location,
      status: session.status,
      notes: session.notes || '',
    });
    setIsEditModalOpen(true);
  };

  const getSessionAttendanceStats = (sessionId: string) => {
    const records = attendanceRecords.filter(r => r.sessionId === sessionId);
    const present = records.filter(r => r.status === 'Present' || r.status === 'Late').length;
    const absent = records.filter(r => r.status === 'Absent').length;
    const totalMarked = records.length;
    return { present, absent, totalMarked };
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search sessions by topic, faculty, room..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" /> List
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'calendar'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" /> Calendar
              </button>
            </div>

              <button
                type="button"
                onClick={() => {
                  setBroadcastSessionId(null);
                  setIsBroadcastOpen(true);
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Broadcast
              </button>

              <button
                onClick={() => {
                  resetForm();
                  setIsAddModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Create Session
              </button>
            </div>
          </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-1 text-slate-500 font-medium mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs"
          >
            <option value="All">All Statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={batchFilter}
            onChange={e => setBatchFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs"
          >
            <option value="All">All Batches</option>
            {settings.batches.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <span className="ml-auto text-xs text-slate-500 font-medium">
            Showing {filteredSessions.length} session(s)
          </span>
        </div>
      </div>

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSessions.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
              No sessions found matching current filters.
            </div>
          ) : (
            filteredSessions.map(session => {
              const { present, absent, totalMarked } = getSessionAttendanceStats(session.id);
              const isMarked = totalMarked > 0;
              const attendanceRate = totalMarked > 0 ? Math.round((present / totalMarked) * 100) : 0;

              return (
                <div
                  key={session.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: ID, Batch, Status */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {session.id}
                        </span>
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          {session.batch}
                        </span>
                      </div>
                      <SessionBadge status={session.status} />
                    </div>

                    {/* Topic Title */}
                    <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">
                      {session.topic}
                    </h3>

                    {/* Details list */}
                    <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {formatDate(session.date)} • {session.startTime} - {session.endTime}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Faculty: {session.faculty}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {session.mode} • {session.location}
                        </span>
                      </div>
                      {session.notes && (
                        <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100">
                          &ldquo;{session.notes}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Attendance Stats bar & actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {isMarked ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-800">
                            {present} Present / {absent} Absent
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              attendanceRate >= 85
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {attendanceRate}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">
                          Attendance pending
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setBroadcastSessionId(session.id);
                          setIsBroadcastOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Broadcast Session to WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(session)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                        title="Edit Session"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSessionToDelete(session)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Delete Session"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSessionId(session.id);
                          setActiveTab('attendance');
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <UserCheck className="w-3.5 h-3.5" /> Mark
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base">
              Monthly Curriculum Schedule
            </h3>
            <span className="text-xs font-medium text-slate-500">
              Interactive session blocks
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredSessions.map(session => (
              <div
                key={session.id}
                onClick={() => {
                  setSelectedSessionId(session.id);
                  setActiveTab('attendance');
                }}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/60 hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                    <span>{formatDate(session.date)}</span>
                    <SessionBadge status={session.status} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {session.topic}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {session.startTime} • {session.faculty.split(' ')[0]} {session.faculty.split(' ')[1]}
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-blue-600 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span>{session.batch.split(' ')[0]}</span>
                  <span>Mark →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE SESSION MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule New Session"
        subtitle="Create an English class, speaking lab, or assessment."
        maxWidth="lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Session Topic / Title *
            </label>
            <input
              type="text"
              value={formData.topic}
              onChange={e => setFormData({ ...formData, topic: e.target.value })}
              placeholder="e.g. Negotiation Tactics & Cross-Cultural Communication"
              required
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Start Time *</label>
              <input
                type="text"
                value={formData.startTime}
                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                placeholder="09:30 AM"
                required
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">End Time *</label>
              <input
                type="text"
                value={formData.endTime}
                onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                placeholder="11:00 AM"
                required
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Faculty</label>
              <select
                value={formData.faculty}
                onChange={e => setFormData({ ...formData, faculty: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                {settings.facultyList.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Target Batch</label>
              <select
                value={formData.batch}
                onChange={e => setFormData({ ...formData, batch: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="All Batches">All Batches (Combined)</option>
                {settings.batches.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Delivery Mode</label>
              <select
                value={formData.mode}
                onChange={e => setFormData({ ...formData, mode: e.target.value as any })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Offline">Offline (Classroom / Lab)</option>
                <option value="Online">Online (Zoom / Meet)</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Room / Meeting Link</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                placeholder="Language Lab 102 or Google Meet URL"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Notes / Agenda</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Key activities, materials required, speaking drill topics..."
              rows={2}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
            >
              Schedule Session
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT SESSION MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Session Details"
        subtitle={`Updating session ${editingSession?.id}`}
        maxWidth="lg"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Session Topic *</label>
            <input
              type="text"
              value={formData.topic}
              onChange={e => setFormData({ ...formData, topic: e.target.value })}
              required
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Start Time</label>
              <input
                type="text"
                value={formData.startTime}
                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">End Time</label>
              <input
                type="text"
                value={formData.endTime}
                onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Mode</label>
              <select
                value={formData.mode}
                onChange={e => setFormData({ ...formData, mode: e.target.value as any })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Offline">Offline</option>
                <option value="Online">Online</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE MODAL */}
      <ConfirmDialog
        isOpen={!!sessionToDelete}
        onClose={() => setSessionToDelete(null)}
        onConfirm={() => {
          if (sessionToDelete) deleteSession(sessionToDelete.id);
        }}
        title="Remove Session"
        message={`Are you sure you want to delete session "${sessionToDelete?.topic}"? All attendance records tied to this session will be permanently removed.`}
        confirmText="Delete Session"
        isDestructive={true}
      />

      {/* WHATSAPP BROADCAST MODAL */}
      <WhatsAppBroadcastModal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        initialSessionId={broadcastSessionId}
      />
    </div>
  );
};
