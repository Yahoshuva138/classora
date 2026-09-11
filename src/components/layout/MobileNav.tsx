import {
  LayoutDashboard,
  Users,
  Calendar,
  CheckSquare,
  ListChecks,
  X,
  GraduationCap,
  Award,
  ShieldCheck,
  BookOpen,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Sidebar } from './Sidebar';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, userRole } = useApp();

  const getBottomTabs = () => {
    if (userRole === 'Student') {
      return [
        { id: 'student-overview', label: 'Overview', icon: BookOpen },
        { id: 'student-attendance', label: 'Attendance', icon: Calendar },
        { id: 'student-grades', label: 'Grades', icon: Award },
        { id: 'student-support', label: 'Help', icon: HelpCircle },
        { id: 'sessions', label: 'Syllabus', icon: CheckSquare },
      ];
    }
    if (userRole === 'Teacher') {
      return [
        { id: 'teacher-overview', label: 'Overview', icon: GraduationCap },
        { id: 'teacher-gradebook', label: 'Gradebook', icon: Award },
        { id: 'teacher-attendance', label: 'Excuses', icon: ShieldCheck },
        { id: 'teacher-feedback', label: 'Notes', icon: MessageSquare },
        { id: 'sessions', label: 'Schedule', icon: Calendar },
      ];
    }
    return [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'students', label: 'Students', icon: Users },
      { id: 'attendance', label: 'Attendance', icon: CheckSquare },
      { id: 'sessions', label: 'Sessions', icon: Calendar },
      { id: 'cr-tasks', label: 'Tasks', icon: ListChecks },
    ];
  };

  const bottomTabs = getBottomTabs();

  return (
    <>
      {/* Mobile Slide-in Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 shadow-2xl z-10">
            <div className="absolute top-3 right-3">
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar onCloseMobile={onClose} />
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar for Small Screens */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200/90 z-40 flex items-center justify-around px-2 shadow-lg select-none pb-safe">
        {bottomTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          let activeClasses = 'text-blue-600 font-bold';
          let activePill = 'bg-blue-50';
          if (userRole === 'Teacher') {
            activeClasses = 'text-indigo-600 font-bold';
            activePill = 'bg-indigo-50';
          } else if (userRole === 'Student') {
            activeClasses = 'text-emerald-600 font-bold';
            activePill = 'bg-emerald-50';
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all duration-150 ${
                isActive ? `${activeClasses} ${activePill}` : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] scale-105' : 'scale-100'} transition-transform`} />
              <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
