import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  AlertCircle,
  TrendingUp,
  Download,
  CheckCircle2,
  Mail,
  Phone,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { RiskBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { generateAttendanceCSV, downloadCSV } from '../../utils/exportUtils';

export const StudentsScreen: React.FC = () => {
  const {
    students,
    studentStats,
    settings,
    openStudentProfile,
    addStudent,
    updateStudent,
    deleteStudent,
    addFollowUp,
    userRole,
    setIsRoleManagementModalOpen,
    openPublicProfile
  } = useApp();

  const canManageStudents = userRole === 'Teacher' || userRole === 'Admin';

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [batchFilter, setBatchFilter] = useState('All');
  const [groupFilter, setGroupFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState<'name' | 'attendance' | 'performance' | 'batch'>('attendance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    batch: settings.batches[0] || 'Batch A - Morning',
    joiningDate: new Date().toISOString().split('T')[0],
    currentLevel: 'Intermediate (B1)',
    initialRemarks: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      batch: settings.batches[0] || 'Batch A - Morning',
      joiningDate: new Date().toISOString().split('T')[0],
      currentLevel: 'Intermediate (B1)',
      initialRemarks: '',
    });
  };

  // Top summary KPIs
  const totalStudents = studentStats.length;
  const activeStudents = totalStudents;
  const atRiskStudents = studentStats.filter(s => s.status === 'At Risk').length;
  const avgAttendance = totalStudents > 0
    ? Math.round(studentStats.reduce((acc, curr) => acc + curr.attendancePercentage, 0) / totalStudents)
    : 0;

  // Filtered & Sorted Student List
  const filteredStudents = useMemo(() => {
    return studentStats.filter(stat => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        stat.student.name.toLowerCase().includes(q) ||
        stat.student.id.toLowerCase().includes(q) ||
        stat.student.email.toLowerCase().includes(q) ||
        (stat.student.group && stat.student.group.toLowerCase().includes(q)) ||
        stat.student.batch.toLowerCase().includes(q);

      const matchesBatch = batchFilter === 'All' || stat.student.batch === batchFilter;
      const matchesStatus = statusFilter === 'All' || stat.status === statusFilter;
      const matchesGroup = groupFilter === 'All' || stat.student.group === groupFilter;

      return matchesSearch && matchesBatch && matchesStatus && matchesGroup;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.student.name.localeCompare(b.student.name);
      } else if (sortField === 'attendance') {
        comparison = a.attendancePercentage - b.attendancePercentage;
      } else if (sortField === 'performance') {
        comparison = a.overallScore - b.overallScore;
      } else if (sortField === 'batch') {
        comparison = a.student.batch.localeCompare(b.student.batch);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [studentStats, searchQuery, batchFilter, groupFilter, statusFilter, sortField, sortOrder]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    addStudent(formData);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    updateStudent(editingStudent.id, formData);
    setIsEditModalOpen(false);
    setEditingStudent(null);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      phone: student.phone,
      email: student.email,
      batch: student.batch,
      joiningDate: student.joiningDate,
      currentLevel: student.currentLevel,
      initialRemarks: student.initialRemarks,
    });
    setIsEditModalOpen(true);
  };

  const handleExport = () => {
    const csv = generateAttendanceCSV(studentStats);
    downloadCSV(`English_CR_Students_${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top 4 Stat Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Students
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalStudents}</p>
          <span className="text-xs text-blue-600 font-medium">3 Batches Enrolled</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Active Students
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{activeStudents}</p>
          <span className="text-xs text-emerald-600 font-medium">100% active roster</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            At-Risk Students
          </p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{atRiskStudents}</p>
          <span className="text-xs text-rose-600 font-medium">Below 70% threshold</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Average Attendance
          </p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{avgAttendance}%</p>
          <span className="text-xs text-slate-500 font-medium">Class wide benchmark</span>
        </div>
      </div>

      {/* Action and Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by student name, ID, or email..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExport}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
            </button>
            {canManageStudents && (
              <>
                <button
                  onClick={() => setIsRoleManagementModalOpen(true)}
                  className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors border border-indigo-200 flex items-center gap-1.5"
                  title="Appoint Class Representatives and manage roles"
                >
                  <Users className="w-4 h-4" /> Manage Positions
                </button>
                <button
                  onClick={() => {
                    resetForm();
                    setIsAddModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" /> Add Student
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filters and Sorters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-1 text-slate-500 font-medium mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          {/* Batch Filter */}
          <select
            value={batchFilter}
            onChange={e => setBatchFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:outline-none"
          >
            <option value="All">All Batches</option>
            {settings.batches.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          {/* Discussion Group Filter */}
          <select
            value={groupFilter}
            onChange={e => setGroupFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-purple-200 bg-purple-50/50 text-purple-800 text-xs font-semibold focus:outline-none"
          >
            <option value="All">All Discussion Groups</option>
            {['Group 1', 'Group 2', 'Group 3', 'Group 4', 'Group 5', 'Group 6', 'Group 7'].map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="On Track">On Track (≥85%)</option>
            <option value="Needs Attention">Needs Attention (70-84%)</option>
            <option value="At Risk">At Risk (&lt;70%)</option>
          </select>

          {/* Sort selector */}
          <div className="ml-auto flex items-center space-x-2">
            <span className="text-slate-500 font-medium">Sort:</span>
            <select
              value={sortField}
              onChange={e => setSortField(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs focus:outline-none"
            >
              <option value="attendance">Attendance %</option>
              <option value="performance">Overall Score</option>
              <option value="name">Name</option>
              <option value="batch">Batch</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
              title="Toggle Ascending / Descending"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Student ID & Name</th>
                <th className="py-3 px-4">Batch & Group</th>
                <th className="py-3 px-4">Attendance %</th>
                <th className="py-3 px-4">Performance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4">Quick Follow-up</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No students match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(stat => (
                  <tr
                    key={stat.student.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Student & Name */}
                    <td
                      className="py-3.5 px-4 cursor-pointer"
                      onClick={() => openStudentProfile(stat.student.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden ring-1 ring-slate-200">
                          {stat.student.avatar ? (
                            <img src={stat.student.avatar} alt={stat.student.name} className="w-full h-full object-cover" />
                          ) : (
                            stat.student.name.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
                            {stat.student.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {stat.student.id} • {stat.student.currentLevel.split(' ')[0]}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Batch & Group */}
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      <div className="text-xs text-slate-700">{stat.student.batch}</div>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200">
                        {stat.student.group || 'Group 1'}
                      </span>
                    </td>

                    {/* Attendance % */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`font-extrabold text-sm ${
                            stat.attendancePercentage >= 85
                              ? 'text-emerald-600'
                              : stat.attendancePercentage >= 70
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {stat.attendancePercentage}%
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({stat.attendedSessions}/{stat.totalApplicableSessions})
                        </span>
                      </div>
                    </td>

                    {/* Performance */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-slate-800">
                          {stat.overallScore}/100
                        </span>
                        {stat.scoreImprovement !== 0 && (
                          <span
                            className={`text-[10px] font-bold ${
                              stat.scoreImprovement > 0 ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            ({stat.scoreImprovement > 0 ? '+' : ''}{stat.scoreImprovement})
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <RiskBadge status={stat.status} />
                    </td>

                    {/* Last Activity */}
                    <td className="py-3.5 px-4 text-slate-500">
                      {stat.student.lastActivity}
                    </td>

                    {/* Quick Follow-up */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => {
                          addFollowUp({
                            studentId: stat.student.id,
                            studentName: stat.student.name,
                            issueType: stat.attendancePercentage < 85 ? 'Low Attendance' : 'Performance',
                            priority: stat.attendancePercentage < 70 ? 'Urgent' : 'High',
                            actionRequired: `CR follow-up with ${stat.student.name} regarding English learning progress.`,
                            assignedTo: 'Aarav (Lead CR)',
                            deadline: new Date().toISOString().split('T')[0],
                            status: 'Pending',
                            remarks: 'Initiated from student directory.',
                          });
                        }}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        + Log Follow-up
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openPublicProfile(stat.student.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="View Public Profile Card"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openStudentProfile(stat.student.id)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="View Profile Drawer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {canManageStudents && (
                          <>
                            <button
                              onClick={() => openEditModal(stat.student)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Edit Student"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setStudentToDelete(stat.student)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Student"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD STUDENT MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Enroll New Student"
        subtitle="Add a student record to the English CR Tracker."
        maxWidth="lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Full Student Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Yashika Sen"
              required
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                required
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="student.26bcs10xxx@sst.scaler.com"
                required
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Assigned Batch *
              </label>
              <select
                value={formData.batch}
                onChange={e => setFormData({ ...formData, batch: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                {settings.batches.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Current English Level
              </label>
              <select
                value={formData.currentLevel}
                onChange={e => setFormData({ ...formData, currentLevel: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="Beginner (A1)">Beginner (A1)</option>
                <option value="Elementary (A2)">Elementary (A2)</option>
                <option value="Intermediate (B1)">Intermediate (B1)</option>
                <option value="Upper Intermediate (B2)">Upper Intermediate (B2)</option>
                <option value="Advanced (C1)">Advanced (C1)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Initial Remarks / Faculty Notes
            </label>
            <textarea
              value={formData.initialRemarks}
              onChange={e => setFormData({ ...formData, initialRemarks: e.target.value })}
              placeholder="Initial diagnostic observations, speaking strengths or areas to improve..."
              rows={3}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              Enroll Student
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT STUDENT MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Student Record"
        subtitle={`Updating information for ${editingStudent?.name}`}
        maxWidth="lg"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Full Student Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number *</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Batch</label>
              <select
                value={formData.batch}
                onChange={e => setFormData({ ...formData, batch: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                {settings.batches.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Current English Level</label>
              <select
                value={formData.currentLevel}
                onChange={e => setFormData({ ...formData, currentLevel: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Beginner (A1)">Beginner (A1)</option>
                <option value="Elementary (A2)">Elementary (A2)</option>
                <option value="Intermediate (B1)">Intermediate (B1)</option>
                <option value="Upper Intermediate (B2)">Upper Intermediate (B2)</option>
                <option value="Advanced (C1)">Advanced (C1)</option>
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
              Update Record
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={() => {
          if (studentToDelete) deleteStudent(studentToDelete.id);
        }}
        title="Archive Student Record"
        message={`Are you sure you want to remove ${studentToDelete?.name} (${studentToDelete?.id}) from the active class tracker? All related attendance logs and follow-ups will be archived.`}
        confirmText="Archive Student"
        isDestructive={true}
      />
    </div>
  );
};
