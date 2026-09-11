import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Copy,
  Check,
  Share2,
  Calendar,
  Layers,
  AlertTriangle,
  MessageSquare,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { soundFx } from '../../utils/soundEffects';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import {
  generateSessionReminderMessage,
  generateDiscussionGroupMessage,
  generateAttendanceAdvisoryMessage
} from '../../utils/whatsappTemplates';
import { Session } from '../../types';

interface WhatsAppBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSessionId?: string | null;
}

export const WhatsAppBroadcastModal: React.FC<WhatsAppBroadcastModalProps> = ({
  isOpen,
  onClose,
  initialSessionId
}) => {
  const { sessions, students, settings } = useApp();
  const { addToast } = useToast();

  useBodyScrollLock(isOpen);

  const [broadcastType, setBroadcastType] = useState<'session' | 'group' | 'attendance'>('session');
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    initialSessionId || sessions.find(s => s.status === 'Upcoming')?.id || sessions[0]?.id || ''
  );
  const [selectedGroup, setSelectedGroup] = useState<string>('Group 1');
  const [copied, setCopied] = useState<boolean>(false);

  // Sync initialSessionId if provided
  useEffect(() => {
    if (initialSessionId) {
      setSelectedSessionId(initialSessionId);
      setBroadcastType('session');
    }
  }, [initialSessionId]);

  // Handle escape key
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

  const currentSession: Session | undefined = sessions.find(s => s.id === selectedSessionId) || sessions[0];
  const groupMembers = students
    .filter(s => (s.group || 'Group 1') === selectedGroup)
    .map(s => s.name);

  // Compute message text
  let messageText = '';
  if (broadcastType === 'session' && currentSession) {
    messageText = generateSessionReminderMessage(currentSession);
  } else if (broadcastType === 'group') {
    messageText = generateDiscussionGroupMessage(selectedGroup, groupMembers);
  } else {
    messageText = generateAttendanceAdvisoryMessage();
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    soundFx.playSuccess();
    addToast('Broadcast announcement copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsAppWeb = () => {
    const encoded = encodeURIComponent(messageText);
    window.open(`https://web.whatsapp.com/send?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  const handleOpenWhatsAppNative = () => {
    const encoded = encodeURIComponent(messageText);
    window.location.href = `whatsapp://send?text=${encoded}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-16 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-white tracking-tight">
                  WhatsApp Class Broadcast Generator
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  CR Aarav
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                1-Click formatted broadcast announcements for SST 2026 batch WhatsApp group
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Template Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setBroadcastType('session')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                broadcastType === 'session'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Class Reminder
            </button>
            <button
              type="button"
              onClick={() => setBroadcastType('group')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                broadcastType === 'group'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> GD Groups
            </button>
            <button
              type="button"
              onClick={() => setBroadcastType('attendance')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                broadcastType === 'attendance'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" /> 75% Advisory
            </button>
          </div>

          {/* Context Controls */}
          {broadcastType === 'session' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Select Session to Announce:</label>
              <select
                value={selectedSessionId}
                onChange={e => setSelectedSessionId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium focus:ring-2 focus:ring-emerald-500"
              >
                {sessions.map(s => (
                  <option key={s.id} value={s.id}>
                    [{s.id}] {s.topic} ({s.date} • {s.startTime})
                  </option>
                ))}
              </select>
            </div>
          )}

          {broadcastType === 'group' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Select Discussion Team:</label>
              <div className="flex items-center gap-2 flex-wrap">
                {(settings.groups || ['Group 1', 'Group 2', 'Group 3', 'Group 4', 'Group 5', 'Group 6', 'Group 7']).map(grp => (
                  <button
                    key={grp}
                    type="button"
                    onClick={() => setSelectedGroup(grp)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedGroup === grp
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {grp}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                {groupMembers.length} official members assigned ({groupMembers.slice(0, 3).join(', ')}...)
              </p>
            </div>
          )}

          {/* WhatsApp Preview Bubble */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Live WhatsApp Message Preview
              </span>
              <span className="text-[11px] font-normal text-slate-400">Markdown formatted</span>
            </div>

            <div className="bg-[#EFEAE2] p-4 rounded-2xl border border-slate-300 shadow-inner relative overflow-hidden font-sans">
              {/* WhatsApp Mock Chat Bubble */}
              <div className="bg-[#DCF8C6] text-slate-900 rounded-2xl rounded-tr-none p-3.5 shadow-sm max-w-[95%] ml-auto text-xs whitespace-pre-wrap font-mono leading-relaxed border border-[#cbe4b5]">
                {messageText}
                <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-slate-500">
                  <span>Just now</span>
                  <span className="text-blue-500 font-bold">✓✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
            {copied ? 'Copied to Clipboard!' : 'Copy Formatted Text'}
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleOpenWhatsAppNative}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" /> Open WhatsApp App
            </button>
            <button
              type="button"
              onClick={handleOpenWhatsAppWeb}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <ExternalLink className="w-4 h-4" /> WhatsApp Web
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
