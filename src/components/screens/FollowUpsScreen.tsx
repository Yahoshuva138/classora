import React, { useState, useMemo } from 'react';
import {
  AlertCircle,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Calendar,
  Edit2,
  Trash2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Check,
  RotateCcw,
  Phone,
  MessageCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FollowUp, FollowUpStatus, PriorityLevel, FollowUpIssueType } from '../../types';
import { FollowUpBadge, PriorityBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatDate } from '../../utils/formatters';

export const FollowUpsScreen: React.FC = () => {
  const {
    followUps,
    students,
    addFollowUp,
    updateFollowUp,
    deleteFollowUp,
    openStudentProfile
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [issueFilter, setIssueFilter] = useState('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState<FollowUp | null>(null);
  const [followUpToDelete, setFollowUpToDelete] = useState<FollowUp | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    studentId: students[0]?.id || '',
    studentName: students[0]?.name || '',
    issueType: 'Low Attendance' as FollowUpIssueType,
    priority: 'High' as PriorityLevel,
    actionRequired: '',
    assignedTo: 'Aarav (Lead CR)',
    deadline: new Date().toISOString().split('T')[0],
    status: 'Pending' as FollowUpStatus,
    remarks: '',
  });

  const resetForm = () => {
    setFormData({
      studentId: students[0]?.id || '',
      studentName: students[0]?.name || '',
      issueType: 'Low Attendance',
      priority: 'High',
      actionRequired: '',
      assignedTo: 'Aarav (Lead CR)',
      deadline: new Date().toISOString().split('T')[0],
      status: 'Pending',
      remarks: '',
    });
  };

  // Metrics
  const totalFollowUps = followUps.length;
  const pendingCount = followUps.filter(f => f.status === 'Pending').length;
  const inProgressCount = followUps.filter(f => f.status === 'In Progress').length;
  const urgentCount = followUps.filter(f => f.priority === 'Urgent' && f.status !== 'Completed').length;
  const completedCount = followUps.filter(f => f.status === 'Completed').length;

  // Filtered Follow-ups
  const filteredFollowUps = useMemo(() => {
    return followUps.filter(f => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        f.studentName.toLowerCase().includes(q) ||
        f.actionRequired.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || f.priority === priorityFilter;
      const matchesIssue = issueFilter === 'All' || f.issueType === issueFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesIssue;
    }).sort((a, b) => {
      // Prioritize Pending & Urgent
      if (a.status === 'Completed' && b.status !== 'Completed') return 1;
      if (a.status !== 'Completed' && b.status === 'Completed') return -1;
      return a.deadline.localeCompare(b.deadline);
    });
  }, [followUps, searchQuery, statusFilter, priorityFilter, issueFilter]);

  const handleStudentSelect = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setFormData(prev => ({
        ...prev,
        studentId: student.id,
        studentName: student.name,
      }));
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.actionRequired) return;
    addFollowUp(formData);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFollowUp) return;
    updateFollowUp(editingFollowUp.id, formData);
    setIsEditModalOpen(false);
    setEditingFollowUp(null);
  };

  const openEditModal = (f: FollowUp) => {
    setEditingFollowUp(f);
    setFormData({
      studentId: f.studentId,
      studentName: f.studentName,
      issueType: f.issueType,
      priority: f.priority,
      actionRequired: f.actionRequired,
      assignedTo: f.assignedTo,
      deadline: f.deadline,
      status: f.status,
      remarks: f.remarks,
    });
    setIsEditModalOpen(true);
  };

  const toggleComplete = (f: FollowUp) => {
    const nextStatus: FollowUpStatus = f.status === 'Completed' ? 'Pending' : 'Completed';
    updateFollowUp(f.id, { status: nextStatus });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Follow-ups
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalFollowUps}</p>
          <span className="text-xs text-slate-500">Active tracker log</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Pending Action
          </p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</p>
          <span className="text-xs text-amber-600 font-medium">Awaiting CR intervention</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Urgent Priorities
          </p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{urgentCount}</p>
          <span className="text-xs text-rose-600 font-medium">Critical intervention needed</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Resolved Follow-ups
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{completedCount}</p>
          <span className="text-xs text-emerald-600 font-medium">Cases addressed</span>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by student name or action..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Create Follow-up
          </button>
        </div>

        {/* Filter dropdowns */}
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
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={issueFilter}
            onChange={e => setIssueFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs"
          >
            <option value="All">All Issue Types</option>
            <option value="Low Attendance">Low Attendance</option>
            <option value="Performance">Performance</option>
            <option value="Participation">Participation</option>
            <option value="Assignment">Assignment</option>
            <option value="Session Issue">Session Issue</option>
          </select>

          <span className="ml-auto text-xs text-slate-400 font-medium">
            {filteredFollowUps.length} follow-up(s)
          </span>
        </div>
      </div>

      {/* Follow-up Cards List */}
      <div className="space-y-3">
        {filteredFollowUps.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
            No follow-ups found matching your current filters.
          </div>
        ) : (
          filteredFollowUps.map(f => {
            const isDone = f.status === 'Completed';
            const targetStudent = students.find(s => s.id === f.studentId);

            return (
              <div
                key={f.id}
                className={`bg-white rounded-2xl p-5 border transition-all shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isDone
                    ? 'border-slate-200/80 bg-slate-50/50 opacity-80'
                    : f.priority === 'Urgent'
                    ? 'border-rose-300 hover:border-rose-400 bg-rose-50/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Left info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                    <span
                      onClick={() => openStudentProfile(f.studentId)}
                      className="font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer text-sm"
                    >
                      {f.studentName}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {f.issueType}
                    </span>
                    <PriorityBadge priority={f.priority} />
                    <FollowUpBadge status={f.status} />
                    {f.isAutoGenerated && (
                      <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                        ⚡ Auto-Rule
                      </span>
                    )}
                  </div>

                  <p className={`text-xs text-slate-800 leading-relaxed ${isDone ? 'line-through text-slate-400' : ''}`}>
                    {f.actionRequired}
                  </p>

                  <div className="flex items-center space-x-4 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Deadline: {formatDate(f.deadline)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" /> Assigned: {f.assignedTo}
                    </span>
                  </div>

                  {targetStudent && !isDone && (
                    <div className="flex items-center space-x-2 pt-1">
                      <a
                        href={`tel:${targetStudent.phone}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold border border-emerald-200/80 transition-colors"
                        title={`Direct Call: ${targetStudent.phone}`}
                      >
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/${targetStudent.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 text-[11px] font-bold border border-green-200/80 transition-colors"
                        title={`WhatsApp message to ${targetStudent.name}`}
                      >
                        <MessageCircle className="w-3 h-3 text-green-600" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  )}

                  {f.remarks && (
                    <p className="text-[11px] text-slate-500 italic">
                      Remarks: &ldquo;{f.remarks}&rdquo;
                    </p>
                  )}
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  <button
                    onClick={() => toggleComplete(f)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                      isDone
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" /> Reopen
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" /> Complete
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => openEditModal(f)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
                    title="Edit Follow-up"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setFollowUpToDelete(f)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                    title="Delete Follow-up"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD FOLLOW-UP MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Log Student Follow-up"
        subtitle="Record an academic, attendance, or behavioral intervention."
        maxWidth="lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Select Student *</label>
            <select
              value={formData.studentId}
              onChange={e => handleStudentSelect(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.id} • {s.batch})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Issue Category</label>
              <select
                value={formData.issueType}
                onChange={e => setFormData({ ...formData, issueType: e.target.value as any })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Low Attendance">Low Attendance</option>
                <option value="Performance">Performance</option>
                <option value="Participation">Participation</option>
                <option value="Assignment">Assignment</option>
                <option value="Session Issue">Session Issue</option>
                <option value="Student Request">Student Request</option>
                <option value="Faculty Instruction">Faculty Instruction</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Priority Level</label>
              <select
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Action Required *</label>
            <input
              type="text"
              value={formData.actionRequired}
              onChange={e => setFormData({ ...formData, actionRequired: e.target.value })}
              placeholder="e.g. Schedule 1-on-1 speaking practice with peer buddy before viva"
              required
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Deadline Date</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                required
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Assigned To</label>
              <input
                type="text"
                value={formData.assignedTo}
                onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Remarks & Details</label>
            <textarea
              value={formData.remarks}
              onChange={e => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Notes, conversation logs, or specific student challenges..."
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
              Log Follow-up
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT FOLLOW-UP MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Follow-up"
        subtitle={`Updating item for ${editingFollowUp?.studentName}`}
        maxWidth="lg"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Action Required</label>
            <input
              type="text"
              value={formData.actionRequired}
              onChange={e => setFormData({ ...formData, actionRequired: e.target.value })}
              required
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Deadline Date</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Assigned To</label>
              <input
                type="text"
                value={formData.assignedTo}
                onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Remarks</label>
            <textarea
              value={formData.remarks}
              onChange={e => setFormData({ ...formData, remarks: e.target.value })}
              rows={2}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
            />
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
        isOpen={!!followUpToDelete}
        onClose={() => setFollowUpToDelete(null)}
        onConfirm={() => {
          if (followUpToDelete) deleteFollowUp(followUpToDelete.id);
        }}
        title="Delete Follow-up Item"
        message={`Are you sure you want to remove the follow-up record for ${followUpToDelete?.studentName}?`}
        confirmText="Delete Record"
        isDestructive={true}
      />
    </div>
  );
};
