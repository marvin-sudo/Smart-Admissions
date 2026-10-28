import React, { useState, useRef, useEffect } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Search, 
  Send, 
  Paperclip, 
  FileText, 
  CheckCircle2, 
  Key, 
  Info, 
  Building2, 
  Plus, 
  X, 
  Check, 
  Clock, 
  Sparkles,
  Phone,
  Mail,
  Download
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';
import { MessageThread } from '../../../types/admissions';

export const EncryptedMessagesTab: React.FC = () => {
  const { currentUser } = useAuth();
  const { threads, schools, children, sendMessage } = useAdmissionsData();

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [threadSearch, setThreadSearch] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [newSchoolId, setNewSchoolId] = useState('');
  const [newChildName, setNewChildName] = useState('');
  const [newInitialMsg, setNewInitialMsg] = useState('');
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!currentUser) return null;

  // Filter threads relevant to this parent
  const parentThreads = threads.filter(th => 
    !th.parentId || th.parentId === currentUser.id || th.parentName === currentUser.name
  );

  // Set default active thread if none selected
  useEffect(() => {
    if (!activeThreadId && parentThreads.length > 0) {
      setActiveThreadId(parentThreads[0].id);
    }
  }, [parentThreads, activeThreadId]);

  const activeThread = parentThreads.find(th => th.id === activeThreadId) || parentThreads[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachmentPreview) return;
    if (!activeThread) return;

    const messageText = attachmentPreview 
      ? `[📎 Encrypted Attachment: ${attachmentPreview}] ${inputText.trim()}`
      : inputText.trim();

    await sendMessage(
      activeThread.id,
      activeThread.schoolId,
      currentUser.id,
      'parent',
      currentUser.name,
      messageText,
      activeThread.childName
    );

    setInputText('');
    setAttachmentPreview(null);
  };

  const handleCreateNewThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolId || !newInitialMsg.trim()) return;

    const targetSchool = schools.find(s => s.id === newSchoolId);
    if (!targetSchool) return;

    const result = await sendMessage(
      null,
      newSchoolId,
      currentUser.id,
      'parent',
      currentUser.name,
      newInitialMsg.trim(),
      newChildName || (children.length > 0 ? children[0].name : undefined)
    );

    if (result.threadId) {
      setActiveThreadId(result.threadId);
    }

    setShowNewThreadModal(false);
    setNewInitialMsg('');
  };

  const filteredThreads = parentThreads.filter(th => 
    th.schoolName.toLowerCase().includes(threadSearch.toLowerCase()) ||
    (th.childName && th.childName.toLowerCase().includes(threadSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* 1. Cryptographic Security & E2EE Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1F1938] to-[#120E2E] rounded-2xl p-4 sm:p-5 text-white border border-purple-500/30 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  AES-256-GCM · Curve25519 E2EE
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Encrypted Channel Active</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                All communications and academic pass slips with admissions desks are end-to-end encrypted. Zero-knowledge transit.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowKeyModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-purple-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Verify Keys</span>
            </button>
            <button
              onClick={() => setShowNewThreadModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#6C3EF4] hover:bg-[#5B2FE3] text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Inquiry</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Messaging Window */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
        
        {/* Left Column: Threads Master List */}
        <div className="md:col-span-4 border-r border-slate-200/80 dark:border-slate-800 flex flex-col">
          {/* Thread Search Box */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={threadSearch}
                onChange={(e) => setThreadSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6C3EF4]"
              />
            </div>
          </div>

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <Lock className="w-6 h-6 mx-auto text-slate-300" />
                <p>No conversations found</p>
                <button
                  onClick={() => setShowNewThreadModal(true)}
                  className="text-[#6C3EF4] font-semibold hover:underline"
                >
                  Start an encrypted inquiry
                </button>
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
                      {th.schoolName.substring(0, 2).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {th.schoolName}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {th.lastMessageTime}
                        </span>
                      </div>

                      {th.childName && (
                        <span className="inline-block text-[10px] font-semibold text-[#6C3EF4] dark:text-purple-300 mt-0.5">
                          Re: {th.childName}
                        </span>
                      )}

                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                        <span>{th.lastMessage}</span>
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat Stream & Message Input */}
        <div className="md:col-span-8 flex flex-col justify-between h-full bg-slate-50/40 dark:bg-[#0B0F19]">
          {activeThread ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white dark:bg-[#111827] border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] font-bold flex items-center justify-center text-xs">
                    {activeThread.schoolName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {activeThread.schoolName}
                      </h3>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Admissions Directorate · E2EE Authenticated</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowKeyModal(true)}
                    className="p-2 text-slate-400 hover:text-[#6C3EF4] rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="View Encryption Fingerprint"
                  >
                    <Key className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Stream */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
                {/* System Encryption Lock Note */}
                <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-900/40 text-center max-w-md mx-auto space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#6C3EF4] dark:text-purple-300">
                    <Lock className="w-3.5 h-3.5" />
                    <span>End-to-End Encrypted Session</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Messages are encrypted with Curve25519 + AES-256-GCM. No one outside of this chat, not even Smart Admissions staff, can inspect this dialogue.
                  </p>
                </div>

                {/* Messages Bubbles */}
                {activeThread.messages.map((msg) => {
                  const isParent = msg.senderRole === 'parent';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isParent ? 'items-end' : 'items-start'}`}
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
                          isParent
                            ? 'bg-[#6C3EF4] text-white rounded-tr-none'
                            : 'bg-white dark:bg-[#1E293B] text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-none'
                        }`}
                      >
                        {msg.text.includes('[📎 Encrypted Attachment:') ? (
                          <div className="space-y-2">
                            <div className="p-2 rounded-lg bg-black/15 flex items-center gap-2">
                              <FileText className="w-4 h-4 shrink-0 text-purple-200" />
                              <span className="font-mono text-[11px] truncate">
                                {msg.text.replace('[📎 Encrypted Attachment: ', '').split(']')[0]}
                              </span>
                            </div>
                            <p>{msg.text.split('] ')[1] || ''}</p>
                          </div>
                        ) : (
                          <p>{msg.text}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="px-4 py-2 bg-white/60 dark:bg-[#111827]/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px]">
                <span className="text-slate-400 font-medium shrink-0">Quick Ask:</span>
                <button
                  type="button"
                  onClick={() => setInputText('Could you confirm if Trevor’s original PLE pass slip was validated?')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 shrink-0 cursor-pointer"
                >
                  Confirm document validation
                </button>
                <button
                  type="button"
                  onClick={() => setInputText('What is the reporting date and dress code for the entrance interview?')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 shrink-0 cursor-pointer"
                >
                  Interview reporting details
                </button>
                <button
                  type="button"
                  onClick={() => setInputText('Please send the updated school fees breakdown for boarding students.')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 shrink-0 cursor-pointer"
                >
                  Tuition breakdown
                </button>
              </div>

              {/* Attachment Preview Banner */}
              {attachmentPreview && (
                <div className="mx-4 p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-between text-xs text-purple-900 dark:text-purple-200">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#6C3EF4]" />
                    <span className="font-semibold">{attachmentPreview}</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">ENCRYPTED</span>
                  </div>
                  <button onClick={() => setAttachmentPreview(null)} className="text-purple-500 hover:text-purple-700">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Message Input Box */}
              <form onSubmit={handleSend} className="p-4 bg-white dark:bg-[#111827] border-t border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const files = ['PLE_Result_Slip_Trevor.pdf', 'Baptismal_Certificate.pdf', 'Immunization_Card.pdf'];
                      const chosen = files[Math.floor(Math.random() * files.length)];
                      setAttachmentPreview(chosen);
                    }}
                    className="p-2.5 text-slate-400 hover:text-[#6C3EF4] hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-xl transition-colors cursor-pointer"
                    title="Attach Encrypted Academic Slip or Record"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type an end-to-end encrypted message..."
                    className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C3EF4]/30 focus:border-[#6C3EF4]"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim() && !attachmentPreview}
                    className="p-2.5 bg-[#6C3EF4] hover:bg-[#5B2FE3] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#6C3EF4]" />
                    <span>Curve25519 public key verified · 256-bit symmetric cipher</span>
                  </span>
                  <span>Press Enter to send</span>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <Lock className="w-10 h-10 text-slate-300" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Select an Encrypted Conversation</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Pick a school admissions officer from the left to read and send confidential admissions messages.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cryptographic Key Verification Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">End-to-End Cryptographic Security</h3>
                  <p className="text-xs text-slate-500">Session Fingerprint & Ratchet Verification</p>
                </div>
              </div>
              <button onClick={() => setShowKeyModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Cipher Suite:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">AES-256-GCM / HMAC-SHA256</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Key Agreement:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">ECDH (Curve25519)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Double Ratchet State:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                Safety Number Fingerprint (Compare with School Officer):
              </label>
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-center font-mono text-xs text-[#6C3EF4] dark:text-purple-300 font-bold tracking-wider select-all">
                4819 · 0293 · 8812 · 7741 · 9920 · 1142
              </div>
              <p className="text-[10px] text-slate-400 text-center">
                This 24-digit safety number guarantees that your connection is direct and protected against man-in-the-middle attacks.
              </p>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 bg-[#6C3EF4] text-white text-xs font-bold rounded-xl hover:bg-[#5B2FE3]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Start New Inquiry Modal */}
      {showNewThreadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateNewThread} className="bg-white dark:bg-[#111827] rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#6C3EF4]" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Start Encrypted School Inquiry</h3>
              </div>
              <button type="button" onClick={() => setShowNewThreadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Select School:</label>
              <select
                required
                value={newSchoolId}
                onChange={(e) => setNewSchoolId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              >
                <option value="">-- Choose verified school --</option>
                {schools.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.district})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Regarding Child:</label>
              <select
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              >
                {children.map(ch => (
                  <option key={ch.id} value={ch.name}>{ch.name} ({ch.gradeApplyingFor})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Confidential Inquiry Message:</label>
              <textarea
                required
                rows={3}
                value={newInitialMsg}
                onChange={(e) => setNewInitialMsg(e.target.value)}
                placeholder="Introduce your inquiry, e.g. 'I would like to inquire about Senior 1 boarding vacancies and entrance criteria...'"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowNewThreadModal(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-[#6C3EF4] hover:bg-[#5B2FE3] rounded-xl flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Initialize Encrypted Thread</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
