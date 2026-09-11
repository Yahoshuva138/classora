import React, { useEffect } from 'react';
import { X, Keyboard, Command, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  const { setUserRole } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcutSections = [
    {
      title: 'Role Switching',
      items: [
        { keys: ['Shift', '1'], description: 'Switch to Class Representative (CR) console' },
        { keys: ['Shift', '2'], description: 'Switch to Faculty / Teacher Portal (Dr. Priya Nair)' },
        { keys: ['Shift', '3'], description: 'Switch to Student Portal View' },
      ]
    },
    {
      title: 'Navigation & Discovery',
      items: [
        { keys: ['⌘ / Ctrl', 'K'], description: 'Open Universal Command Palette & Search' },
        { keys: ['/'], description: 'Quick-focus search input from any screen' },
        { keys: ['?'], description: 'Open this Keyboard Shortcuts cheat-sheet' },
        { keys: ['Esc'], description: 'Close any modal, drawer, or search dialog' },
      ]
    },
    {
      title: 'Workflow Hotkeys',
      items: [
        { keys: ['Click', 'Live DB'], description: 'Force re-synchronize state with Express & MongoDB' },
        { keys: ['Click', 'Group'], description: 'Filter students or gradebook by discussion team (Groups 1–7)' },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all z-10">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-indigo-300 shadow-inner">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white tracking-tight flex items-center gap-2">
                Keyboard Shortcuts
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Power User
                </span>
              </h2>
              <p className="text-xs text-slate-300">Fast navigation for English CR & Faculty</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {shortcutSections.map(sec => (
            <div key={sec.title}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                {sec.title}
              </h3>
              <div className="space-y-2">
                {sec.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors text-xs"
                  >
                    <span className="text-slate-700 font-medium">{item.description}</span>
                    <div className="flex items-center space-x-1 shrink-0 ml-2">
                      {item.keys.map(k => (
                        <kbd
                          key={k}
                          className="px-2 py-1 text-[11px] font-bold text-slate-700 bg-white rounded-lg border border-slate-200 shadow-2xs"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Quick Role Switcher Buttons */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block mb-2">Try Switching Role Right Now:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => { setUserRole('CR'); onClose(); }}
                className="p-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-all text-center"
              >
                🎓 Class Rep
              </button>
              <button
                onClick={() => { setUserRole('Teacher'); onClose(); }}
                className="p-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-all text-center"
              >
                👨‍🏫 Faculty
              </button>
              <button
                onClick={() => { setUserRole('Student'); onClose(); }}
                className="p-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all text-center"
              >
                👨‍🎓 Student
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
