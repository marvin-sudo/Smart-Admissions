import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Send, 
  Lock, 
  ShieldCheck, 
  Phone, 
  Mail, 
  User, 
  Calendar, 
  Clock, 
  CheckCheck, 
  Paperclip, 
  X,
  Plus
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';

export const ParentInquiriesTab: React.FC = () => {
  const { currentUser } = useAuth();
  const { schools, threads, sendMessage } = useAdmissionsData();

  const currentSchool = schools.find(s => 
    s.id === currentUser?.schoolId || s.name.toLowerCase() === (currentUser?.schoolName || '').toLowerCase()
  ) || schools[0];

  // Filter threads for this school
  const schoolThreads = threads.filter(th => 
    th.schoolId === currentSchool.id || th.schoolName.toLowerCase() === currentSchool.name.toLowerCase()
  );

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeThreadId && schoolThreads.length > 0) {
      setActiveThreadId(schoolThreads[0].id);
    }
  }, [schoolThreads, activeThreadId]);

  const activeThread = schoolThreads.find(th => th.id === activeThreadId) || schoolThreads[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeThread) return;

    await sendMessage(
      activeThread.id,
      currentSchool.id,
      activeThread.parentId,
      'school',
      currentUser?.name || `${currentSchool.name} Admissions Desk`,
      inputText.trim(),
      activeThread.childName
    );

    setInputText('');
  };

  const filteredThreads = schoolThreads.filter(th => 
    th.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (th.childName && th.childName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    th.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Parent Admissions Inquiries & Communications
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] dark:text-purple-300">
              {schoolThreads.length} Active Conversations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            End-to-end encrypted direct dialogue with prospective parents and applicants.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs font-semibold text-[#6C3EF4] dark:text-purple-300">
          <Lock className="w-3.5 h-3.5" />
          <span>E2EE Cryptographic Desk</span>
        </div>
      </div>

      {/* Main Two-Column Chat Container */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[620px]">
        
        {/* Left Column: Parent Threads List */}
        <div className="md:col-span-4 border-r border-slate-200/80 dark:border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by parent or child..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6C3EF4]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <MessageSquare className="w-6 h-6 mx-auto text-slate-300" />
                <p>No active parent inquiries found.</p>
              </div>
            ) : (
              filteredThreads.map((th) => {
                const isSelected = activeThread?.id === th.id;
                return (
                  <div
                    key={th.id}
                    onClick={() => setActiveThreadId(th.id)}
                    className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-purple-50/80 dark:bg-purple-950/40 border-l-4 border-l-[#6C3EF4]' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-[#6C3EF4] dark:text-purple-300 font-bold flex items-center justify-center text-xs shrink-0">
                      {th.parentName.charAt(0)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {th.parentName}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {th.lastMessageTime}
                        </span>
                      </div>

                      {th.childName && (
                        <span className="inline-block text-[10px] font-semibold text-[#6C3EF4] dark:text-purple-300">
                          Candidate: {th.childName}
                        </span>
                      )}

                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {th.lastMessage}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat Pane */}
        <div className="md:col-span-8 flex flex-col justify-between h-full bg-slate-50/40 dark:bg-[#0B0F19]">
          {activeThread ? (
            <>
              {/* Header */}
              <div className="p-4 bg-white dark:bg-[#111827] border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] font-bold flex items-center justify-center text-xs">
                    {activeThread.parentName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {activeThread.parentName}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {activeThread.childName ? `Regarding ${activeThread.childName}` : 'Prospective Parent'} · Verified Guardian
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>E2EE Active</span>
                </div>
              </div>

              {/* Message Stream */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
                {activeThread.messages.map((msg) => {
                  const isSchool = msg.senderRole === 'school';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isSchool ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[10px] font-semibold text-slate-400">
                          {msg.senderName}
                        </span>
                        <span className="text-[9px] text-slate-400">· {msg.timestamp}</span>
                        <Lock className="w-2.5 h-2.5 text-slate-400" />
                      </div>

                      <div
                        className={`max-w-md rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs ${
                          isSchool
                            ? 'bg-[#6C3EF4] text-white rounded-tr-none'
                            : 'bg-white dark:bg-[#1E293B] text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-none'
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Response Presets */}
              <div className="px-4 py-2 bg-white/60 dark:bg-[#111827]/60 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px]">
                <span className="text-slate-400 font-medium shrink-0">Canned Reply:</span>
                <button
                  type="button"
                  onClick={() => setInputText('Your child’s application and UNEB pass slip have been verified by our academic board.')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 shrink-0 cursor-pointer"
                >
                  Confirm Document Verification
                </button>
                <button
                  type="button"
                  onClick={() => setInputText('We are pleased to invite your child for oral interview assessment this coming Saturday.')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 shrink-0 cursor-pointer"
                >
                  Interview Invitation
                </button>
                <button
                  type="button"
                  onClick={() => setInputText('Please note that boarding vacancy cutoff aggregates for Senior One are currently 4 to 8.')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 shrink-0 cursor-pointer"
                >
                  Cutoff Information
                </button>
              </div>

              {/* Message Input */}
              <form onSubmit={handleSend} className="p-4 bg-white dark:bg-[#111827] border-t border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type an official admissions response..."
                    className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C3EF4]/30"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-2.5 bg-[#6C3EF4] hover:bg-[#5B2FE3] disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
              <MessageSquare className="w-10 h-10 text-slate-300" />
              <p>Select a parent conversation from the left.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
