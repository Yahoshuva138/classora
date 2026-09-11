import {
  LayoutDashboard,
  Users,
  Calendar,
  CheckSquare,
  TrendingUp,
  AlertCircle,
  ListChecks,
  FileSpreadsheet,
  Settings,
  GraduationCap,
  Sparkles,
  Award,
  ShieldCheck,
  BookOpen,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Classora3DLogo } from '../common/Classora3DLogo';
import { soundFx } from '../../utils/soundEffects';

interface SidebarProps {
  onCloseMobile?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: number | null;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    followUps,
    tasks,
    userRole,
    studentRequests,
    currentStudent,
    activeTeacher,
    currentUser
  } = useApp();

  const pendingFollowUpCount = followUps.filter(f => f.status === 'Pending').length;
  const pendingTaskCount = tasks.filter(t => t.status === 'Pending').length;
  const pendingExcuseCount = studentRequests.filter(r => r.status === 'Pending').length;

  // Role-specific navigation sets
  const adminNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Admin Command', icon: LayoutDashboard },
    { id: 'students', label: 'Student Directory', icon: Users },
    { id: 'sessions', label: 'Sessions & Schedule', icon: Calendar },
    { id: 'attendance', label: 'Master Attendance', icon: CheckSquare },
    { id: 'teacher-gradebook', label: 'Gradebook & Rubrics', icon: Award },
    { id: 'groups', label: 'Discussion Groups', icon: Users, badge: 7, badgeColor: 'bg-purple-500 text-white' },
    { id: 'performance', label: 'Performance Analytics', icon: TrendingUp },
    {
      id: 'follow-ups',
      label: 'Follow-ups',
      icon: AlertCircle,
      badge: pendingFollowUpCount > 0 ? pendingFollowUpCount : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'cr-tasks',
      label: 'CR Tasks',
      icon: ListChecks,
      badge: pendingTaskCount > 0 ? pendingTaskCount : null,
      badgeColor: 'bg-blue-500 text-white',
    },
    { id: 'reports', label: 'Reports & Exports', icon: FileSpreadsheet },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  const crNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'sessions', label: 'Sessions', icon: Calendar },
    { id: 'attendance', label: 'Attendance (Read Only)', icon: CheckSquare },
    { id: 'groups', label: 'Discussion Groups', icon: Users, badge: 7, badgeColor: 'bg-purple-500 text-white' },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    {
      id: 'follow-ups',
      label: 'Follow-ups',
      icon: AlertCircle,
      badge: pendingFollowUpCount > 0 ? pendingFollowUpCount : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'cr-tasks',
      label: 'CR Tasks',
      icon: ListChecks,
      badge: pendingTaskCount > 0 ? pendingTaskCount : null,
      badgeColor: 'bg-blue-500 text-white',
    },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const teacherNavItems: NavItem[] = [
    { id: 'teacher-overview', label: 'Overview', icon: GraduationCap },
    { id: 'teacher-gradebook', label: 'Gradebook', icon: Award },
    {
      id: 'teacher-attendance',
      label: 'Attendance & Excuses',
      icon: ShieldCheck,
      badge: pendingExcuseCount > 0 ? pendingExcuseCount : null,
      badgeColor: 'bg-amber-500 text-slate-900',
    },
    { id: 'groups', label: 'Discussion Groups (1-7)', icon: Users, badge: 7, badgeColor: 'bg-purple-500 text-white' },
    { id: 'teacher-feedback', label: 'Student Mentorship', icon: MessageSquare },
    { id: 'sessions', label: 'Curriculum Schedule', icon: Calendar },
    { id: 'students', label: 'Student Directory', icon: Users },
    { id: 'performance', label: 'Skill Analytics', icon: TrendingUp },
    { id: 'reports', label: 'Class Reports', icon: FileSpreadsheet },
  ];

  const studentNavItems: NavItem[] = [
    { id: 'student-overview', label: 'My Overview', icon: BookOpen },
    { id: 'groups', label: 'My Discussion Group', icon: Users },
    { id: 'student-attendance', label: 'Attendance & Timetable', icon: Calendar },
    { id: 'student-grades', label: 'Assessments & Skills', icon: Award },
    { id: 'student-support', label: 'Submit Leave / CR Help', icon: HelpCircle },
    { id: 'sessions', label: 'Course Syllabus', icon: CheckSquare },
  ];

  const currentNavItems =
    userRole === 'Admin'
      ? adminNavItems
      : userRole === 'Student'
      ? studentNavItems
      : userRole === 'Teacher'
      ? teacherNavItems
      : crNavItems;

  const roleAccentColor =
    userRole === 'Admin'
      ? 'bg-amber-600 shadow-amber-600/20'
      : userRole === 'Student'
      ? 'bg-emerald-600 shadow-emerald-600/20'
      : userRole === 'Teacher'
      ? 'bg-indigo-600 shadow-indigo-600/20'
      : 'bg-blue-600 shadow-blue-600/20';

  const roleBadge =
    userRole === 'Admin'
      ? { text: 'Super Admin', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' }
      : userRole === 'Student'
      ? { text: 'Student Portal', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' }
      : userRole === 'Teacher'
      ? { text: 'Teacher / Faculty', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' }
      : { text: 'Class Rep (CR)', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };

  const handleNavClick = (id: string) => {
    soundFx.playPop();
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="shrink-0">
            <Classora3DLogo size="md" showText={false} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <h1 className="font-black text-white text-base tracking-tight leading-none">
                Classora
              </h1>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border uppercase ${roleBadge.color}`}>
                {roleBadge.text}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold truncate mt-1">
              English Language & Comm. Skills
            </p>
            <p className="text-[10px] text-blue-400 font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Subject - 2 • 4 Weeks
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {userRole === 'Admin'
            ? 'Super Admin Workspace'
            : userRole === 'Student'
            ? 'Student Workspace'
            : userRole === 'Teacher'
            ? 'Faculty Workspace'
            : 'CR Navigation'}
        </div>
        {currentNavItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? `${roleAccentColor} text-white shadow-md font-semibold`
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {'badge' in item && item.badge !== null && item.badge !== undefined && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Motivational Motto & Active Persona Status Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
          <div className="flex items-center space-x-2 text-blue-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Classora Motto</span>
          </div>
          <p className="text-[11px] text-slate-300 italic leading-relaxed">
            “Small Steps. Better Communicators. Brighter Futures.”
          </p>
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="truncate max-w-[150px]">
            {userRole === 'Admin'
              ? `Admin: ${currentUser.name || 'Yahoshuva'}`
              : userRole === 'Student' && currentStudent
              ? `Student: ${currentStudent.name}`
              : userRole === 'Teacher'
              ? `Faculty: ${activeTeacher.name}`
              : 'Lead CR: Aarav Sharma'}
          </span>
          <span className="text-emerald-400 font-medium text-[10px]">● Online</span>
        </div>
      </div>
    </aside>
  );
};
