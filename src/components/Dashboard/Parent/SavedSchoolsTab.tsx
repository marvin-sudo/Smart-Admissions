import React, { useState, useEffect } from 'react';
import { 
  Bookmark, 
  Trash2, 
  ArrowRight, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Table, 
  Grid, 
  MessageSquare, 
  FileText, 
  Check, 
  Printer, 
  DollarSign, 
  Calendar, 
  Plus,
  Sparkles,
  Search
} from 'lucide-react';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';
import { SchoolRecord } from '../../../types/admissions';
import { QuickApplyModal } from '../QuickApplyModal';
import { MessageModal } from '../MessageModal';

export const SavedSchoolsTab: React.FC<{ onNavigateToDiscover?: () => void }> = ({ onNavigateToDiscover }) => {
  const { schools, savedSchoolIds, toggleSaveSchool } = useAdmissionsData();

  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards');
  const [personalNotes, setPersonalNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('smart_admissions_parent_notes');
      return saved ? JSON.parse(saved) : {
        'sch-gayaza-01': 'First choice for Sarah. High performance in science subjects and leadership focus.',
        'sch-smack-02': 'Recommended by Uncle Joseph. Renowned mathematics department for Trevor.'
      };
    } catch {
      return {};
    }
  });

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedSchoolForApply, setSelectedSchoolForApply] = useState<SchoolRecord | null>(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageTarget, setMessageTarget] = useState<{ id: string; name: string } | null>(null);

  // Save notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('smart_admissions_parent_notes', JSON.stringify(personalNotes));
    } catch {}
  }, [personalNotes]);

  const handleUpdateNote = (schoolId: string, noteText: string) => {
    setPersonalNotes(prev => ({
      ...prev,
      [schoolId]: noteText
    }));
  };

  const savedSchoolsList = schools.filter(s => savedSchoolIds.includes(s.id));

  const handleOpenApply = (school: SchoolRecord) => {
    setSelectedSchoolForApply(school);
    setApplyModalOpen(true);
  };

  const handleOpenMessage = (school: SchoolRecord) => {
    setMessageTarget({ id: school.id, name: school.name });
    setMessageModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header and View Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Saved Schools Shortlist
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] dark:text-purple-300">
              {savedSchoolsList.length} Bookmarked
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare key parameters side-by-side, record family considerations, and fast-track admissions.
          </p>
        </div>

        {savedSchoolsList.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* View Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-slate-700 text-[#6C3EF4] dark:text-purple-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
              <button
                onClick={() => setViewMode('matrix')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'matrix'
                    ? 'bg-white dark:bg-slate-700 text-[#6C3EF4] dark:text-purple-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Comparison Matrix</span>
              </button>
            </div>

            <button
              onClick={() => window.print()}
              className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 rounded-xl transition-colors cursor-pointer"
              title="Print Shortlist"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {savedSchoolsList.length === 0 ? (
        <div className="bg-white dark:bg-[#111827] rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-[#6C3EF4] flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Your shortlist is currently empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse our directory of accredited primary and secondary schools and bookmark institutions you are considering for your children.
          </p>
          {onNavigateToDiscover && (
            <button
              onClick={onNavigateToDiscover}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#6C3EF4] hover:bg-[#5B2FE3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Browse Schools Directory</span>
            </button>
          )}
        </div>
      ) : viewMode === 'cards' ? (
        /* Cards View with Personal Notes */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {savedSchoolsList.map((school) => {
            const currentNote = personalNotes[school.id] || '';
            return (
              <div
                key={school.id}
                className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:border-purple-300 dark:hover:border-purple-700/60 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] font-black text-sm flex items-center justify-center shrink-0">
                        {school.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {school.name}
                          </h3>
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {school.location} · {school.type}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSaveSchool(school.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                      title="Remove from shortlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Key Stats Bar */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">FEES ESTIMATE</span>
                      <span className="font-bold text-slate-900 dark:text-white">{school.tuitionRange.split('-')[0]}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">UNEB CENTER</span>
                      <span className="font-semibold text-[#6C3EF4] dark:text-purple-300">{school.badge || 'Certified'}</span>
                    </div>
                  </div>

                  {/* Personal Parent Note Area */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center justify-between">
                      <span>Family Notes & Considerations:</span>
                      <span className="text-[10px] font-normal text-slate-400">Autosaved</span>
                    </label>
                    <textarea
                      rows={2}
                      value={currentNote}
                      onChange={(e) => handleUpdateNote(school.id, e.target.value)}
                      placeholder="Add notes, e.g. 'Sibling attended', 'Prefers boarding', 'Transport route verified'..."
                      className="w-full px-3 py-2 bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/60 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6C3EF4]"
                    />
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenMessage(school)}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Inquire</span>
                  </button>

                  <button
                    onClick={() => handleOpenApply(school)}
                    className="flex-1 py-2 px-4 bg-[#6C3EF4] hover:bg-[#5B2FE3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Fast-Track Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Side-by-Side Comparison Matrix Table */
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="p-4">School Institution</th>
                <th className="p-4">District</th>
                <th className="p-4">Type</th>
                <th className="p-4">Tuition Estimate</th>
                <th className="p-4">Intake Cap</th>
                <th className="p-4">UNEB Status</th>
                <th className="p-4">Key Facilities</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {savedSchoolsList.map((school) => (
                <tr key={school.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-[#6C3EF4] font-bold flex items-center justify-center text-xs shrink-0">
                        {school.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{school.name}</span>
                        <span className="text-[10px] text-slate-400">{school.level}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                    {school.district}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {school.type}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white tabular-nums">
                    {school.tuitionRange.split('-')[0]}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 tabular-nums">
                    {school.intakeCapacity || 250} Students
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 max-w-xs truncate">
                    {school.facilities.slice(0, 2).join(', ')}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenApply(school)}
                        className="px-3 py-1.5 bg-[#6C3EF4] text-white font-bold rounded-lg hover:bg-[#5B2FE3]"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => toggleSaveSchool(school.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <QuickApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        selectedSchool={selectedSchoolForApply}
      />

      <MessageModal
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        targetSchoolId={messageTarget?.id}
        targetSchoolName={messageTarget?.name}
      />
    </div>
  );
};
