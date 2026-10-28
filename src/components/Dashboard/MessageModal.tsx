import React, { useState } from 'react';
import { X, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmissionsData } from '../../context/AdmissionsDataContext';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSchoolId?: string;
  targetSchoolName?: string;
  targetParentId?: string;
  targetParentName?: string;
  existingThreadId?: string;
}

export const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  onClose,
  targetSchoolId,
  targetSchoolName,
  targetParentId,
  targetParentName,
  existingThreadId
}) => {
  const { currentUser } = useAuth();
  const { sendMessage, threads } = useAdmissionsData();

  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentFeedback, setSentFeedback] = useState(false);

  if (!isOpen || !currentUser) return null;

  // If there's an existing thread, find it
  const currentThread = existingThreadId 
    ? threads.find(t => t.id === existingThreadId)
    : threads.find(t => 
        (targetSchoolId && t.schoolId === targetSchoolId && t.parentId === currentUser.id) ||
        (targetParentId && t.parentId === targetParentId && t.schoolId === currentUser.schoolId)
      );

  const recipientName = targetSchoolName || targetParentName || currentThread?.schoolName || 'Admissions Representative';

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setIsSending(true);

    const schoolId = targetSchoolId || currentThread?.schoolId || currentUser.schoolId || 'sch-gayaza-01';
    const parentId = targetParentId || currentThread?.parentId || currentUser.id;

    await sendMessage(
      currentThread ? currentThread.id : null,
      schoolId,
      parentId,
      currentUser.role as 'parent' | 'school' | 'admin',
      currentUser.name,
      messageText.trim()
    );

    setIsSending(false);
    setMessageText('');
    setSentFeedback(true);
    setTimeout(() => {
      setSentFeedback(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-left flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Conversation with {recipientName}
              </h3>
              <p className="text-[11px] text-slate-400">
                Official Smart Admissions In-App Messaging
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Previous Message Bubbles if thread exists */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 min-h-[160px] max-h-72">
          {currentThread && currentThread.messages.length > 0 ? (
            currentThread.messages.map((m) => {
              const isMe = 
                (currentUser.role === 'parent' && m.senderRole === 'parent') ||
                (currentUser.role === 'school' && m.senderRole === 'school');

              return (
                <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-slate-400 mb-1 px-1">
                    {m.senderName} · {m.timestamp}
                  </span>
                  <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm ${
                    isMe 
                      ? 'bg-[#6C3EF4] text-white rounded-tr-xs' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs'
                  }`}>
                    {m.text}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              Start your inquiry with {recipientName}. Ask about admission intakes, requirements, or schedule campus visits.
            </div>
          )}
        </div>

        {sentFeedback && (
          <div className="py-2 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Message delivered successfully!</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSend} className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            required
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={`Type message to ${recipientName}...`}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
          />
          <button
            type="submit"
            disabled={isSending || !messageText.trim()}
            className="p-2.5 bg-[#6C3EF4] hover:bg-[#5B2FE3] text-white rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
