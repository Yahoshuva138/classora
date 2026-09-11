import React, { useState, useMemo } from 'react';
import {
  ListChecks,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Calendar,
  Edit2,
  Trash2,
  Tag,
  AlertTriangle,
  RotateCcw,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CRTask, TaskCategory, PriorityLevel, TaskStatus } from '../../types';
import { PriorityBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatDate } from '../../utils/formatters';

export const CRTasksScreen: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CRTask | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<CRTask | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    task: '',
    category: 'Attendance' as TaskCategory,
    priority: 'High' as PriorityLevel,
    dueDate: new Date().toISOString().split('T')[0],
    status: 'Pending' as TaskStatus,
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      task: '',
      category: 'Attendance',
      priority: 'High',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      notes: '',
    });
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Metrics
  const totalTasks = tasks.length;
  const pendingCount = tasks.filter(t => t.status === 'Pending').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const dueTodayCount = tasks.filter(t => t.dueDate === todayStr && t.status !== 'Completed').length;

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || t.task.toLowerCase().includes(q) || (t.notes && t.notes.toLowerCase().includes(q));
      const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;

      return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
    }).sort((a, b) => {
      // Completed at bottom
      if (a.status === 'Completed' && b.status !== 'Completed') return 1;
      if (a.status !== 'Completed' && b.status === 'Completed') return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });
  }, [tasks, searchQuery, categoryFilter, statusFilter, priorityFilter]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.task) return;
    addTask(formData);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    updateTask(editingTask.id, formData);
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  const openEditModal = (t: CRTask) => {
    setEditingTask(t);
    setFormData({
      task: t.task,
      category: t.category,
      priority: t.priority,
      dueDate: t.dueDate,
      status: t.status,
      notes: t.notes || '',
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Tasks
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalTasks}</p>
          <span className="text-xs text-slate-500">Operational checklist</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Pending Tasks
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{pendingCount}</p>
          <span className="text-xs text-blue-600 font-medium">To be completed</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Due Today
          </p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{dueTodayCount}</p>
          <span className="text-xs text-amber-600 font-medium">High priority focus</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Completed Tasks
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{completedCount}</p>
          <span className="text-xs text-emerald-600 font-medium">
            {totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0}% done
          </span>
        </div>
      </div>

      {/* Action and Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tasks or notes..."
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
            <Plus className="w-4 h-4" /> Add CR Task
          </button>
        </div>

        {/* Filter row */}
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
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs"
          >
            <option value="All">All Categories</option>
            <option value="Attendance">Attendance</option>
            <option value="Session">Session</option>
            <option value="Student Support">Student Support</option>
            <option value="Communication">Communication</option>
            <option value="Faculty Coordination">Faculty Coordination</option>
            <option value="Reporting">Reporting</option>
            <option value="General">General</option>
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

          <span className="ml-auto text-xs text-slate-400 font-medium">
            {filteredTasks.length} task(s)
          </span>
        </div>
      </div>

      {/* Task Item Checklist */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
            No CR tasks match current criteria.
          </div>
        ) : (
          filteredTasks.map(t => {
            const isDone = t.status === 'Completed';

            return (
              <div
                key={t.id}
                className={`bg-white rounded-2xl p-4 border transition-all shadow-card flex items-start sm:items-center justify-between gap-3 ${
                  isDone
                    ? 'border-slate-200/70 bg-slate-50/50 opacity-75'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                {/* Left checkbox & text */}
                <div className="flex items-start sm:items-center space-x-3.5 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => toggleTask(t.id)}
                    className={`w-6 h-6 rounded-xl border flex items-center justify-center transition-all shrink-0 mt-0.5 sm:mt-0 ${
                      isDone
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                        : 'border-slate-300 hover:border-blue-500 bg-white'
                    }`}
                  >
                    {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span
                        className={`text-xs sm:text-sm font-bold text-slate-900 ${
                          isDone ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {t.task}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {t.category}
                      </span>
                      <PriorityBadge priority={t.priority} />
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" /> Due: {formatDate(t.dueDate)}
                      </span>
                      {t.dueDate === todayStr && !isDone && (
                        <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.2 rounded">
                          Due Today
                        </span>
                      )}
                    </div>

                    {t.notes && (
                      <p className="text-[11px] text-slate-400 italic">
                        Notes: {t.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => openEditModal(t)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                    title="Edit Task"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTaskToDelete(t)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD TASK MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add CR Task"
        subtitle="Operational class representative responsibility."
        maxWidth="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Task Description *</label>
            <input
              type="text"
              value={formData.task}
              onChange={e => setFormData({ ...formData, task: e.target.value })}
              placeholder="e.g. Broadcast audio recording of Session 107 to WhatsApp group"
              required
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Attendance">Attendance</option>
                <option value="Session">Session</option>
                <option value="Student Support">Student Support</option>
                <option value="Communication">Communication</option>
                <option value="Faculty Coordination">Faculty Coordination</option>
                <option value="Reporting">Reporting</option>
                <option value="General">General</option>
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
            <label className="text-xs font-bold text-slate-700 block mb-1">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
              required
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Notes / Checklist Details</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Important numbers, URLs, room numbers, or specifics..."
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
              Create Task
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT TASK MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit CR Task"
        subtitle="Update task details or status"
        maxWidth="md"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Task Description</label>
            <input
              type="text"
              value={formData.task}
              onChange={e => setFormData({ ...formData, task: e.target.value })}
              required
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Attendance">Attendance</option>
                <option value="Session">Session</option>
                <option value="Student Support">Student Support</option>
                <option value="Communication">Communication</option>
                <option value="Faculty Coordination">Faculty Coordination</option>
                <option value="Reporting">Reporting</option>
                <option value="General">General</option>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              />
            </div>
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
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
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
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (taskToDelete) deleteTask(taskToDelete.id);
        }}
        title="Delete Task"
        message={`Are you sure you want to delete task "${taskToDelete?.task}"?`}
        confirmText="Delete Task"
        isDestructive={true}
      />
    </div>
  );
};
