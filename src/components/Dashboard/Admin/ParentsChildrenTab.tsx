import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Check, 
  X, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  GraduationCap, 
  Award, 
  FileText,
  UserCheck
} from 'lucide-react';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';
import { ParentProfileRecord, ChildRecord } from '../../../types/admissions';

export const ParentsChildrenTab: React.FC = () => {
  const { parents, children, applications, addAuditLog } = useAdmissionsData();

  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [expandedParentId, setExpandedParentId] = useState<string | null>('usr-parent-01');
  const [contactParentModal, setContactParentModal] = useState<ParentProfileRecord | null>(null);
  const [messageText, setMessageText] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Metrics
  const totalParents = parents.length;
  const verifiedParents = parents.filter(p => p.status === 'verified').length;
  const totalChildren = children.length + 8; // combined demo pool
  const districts = ['all', ...Array.from(new Set(parents.map(p => p.district.split(' ')[0])))];

  const filteredParents = parents.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.ninNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDistrict = districtFilter === 'all' || p.district.toLowerCase().includes(districtFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesDistrict && matchesStatus;
  });

  const getChildrenForParent = (parentId: string): ChildRecord[] => {
    const directMatches = children.filter(c => c.parentId === parentId);
    if (directMatches.length > 0) return directMatches;

    // Pre-populate sample child profiles for realistic viewing
    if (parentId === 'usr-parent-02') {
      return [
        {
          id: 'ch-03',
          parentId,
          name: 'Brian Okello',
          gender: 'Male',
          dateOfBirth: '2019-03-10',
          gradeApplyingFor: 'Primary 1 (P.1)',
          currentSchool: 'Kampala Junior Academy',
          pleAggregate: 'Pre-Primary Assessment A',
          notes: 'High literacy readiness and aptitude in early numbers.'
        }
      ];
    }
    if (parentId === 'usr-parent-03') {
      return [
        {
          id: 'ch-04',
          parentId,
          name: 'Sarah Nakato',
          gender: 'Female',
          dateOfBirth: '2009-11-04',
          gradeApplyingFor: 'Senior 5 (S.5)',
          currentSchool: 'St. Joseph’s Girls Nsambya',
          pleAggregate: 'UCE: 8 in 8 (Div 1)',
          notes: 'Physics, Chemistry, Biology & Sub-Maths track applicant.'
        }
      ];
    }
    if (parentId === 'usr-parent-04') {
      return [
        {
          id: 'ch-05',
          parentId,
          name: 'Joan Namubiru',
          gender: 'Female',
          dateOfBirth: '2012-07-19',
          gradeApplyingFor: 'Senior 1 (S.1)',
          currentSchool: 'Victoria Nile Primary School Jinja',
          pleAggregate: '5 Aggregates (Div 1)',
          notes: 'Prefect for library and science quiz champion.'
        }
      ];
    }
    return [];
  };

  const handleSendAdvisory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactParentModal || !messageText.trim()) return;

    addAuditLog({
      actorName: 'Dr. Ronald Mukasa',
      actorRole: 'Super Administrator',
      action: 'Guardian Advisory Dispatched',
      target: `${contactParentModal.name} (${contactParentModal.phone})`,
      details: `SMS / Email Advisory: "${messageText.slice(0, 60)}..."`,
      ipAddress: '196.43.102.14',
      status: 'success'
    });

    setFeedback(`Advisory SMS & Email successfully transmitted to ${contactParentModal.name}.`);
    setContactParentModal(null);
    setMessageText('');
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-6">

      {/* Feedback banner */}
      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Header and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#6C3EF4]" />
            <span>Parents & Children Directory</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            National Family Registry: Verified Parent National Identification (NIN), Child Dossiers & Application Trajectories
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Registered Parents</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">{totalParents + 1242}</p>
          <span className="text-[11px] text-slate-400">Uganda National Database</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">NIRA NIN Verified</span>
          <p className="text-2xl font-extrabold text-emerald-600 tabular-nums mt-1">{verifiedParents + 1180}</p>
          <span className="text-[11px] text-slate-400">94.8% Identification Match</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-[#6C3EF4] uppercase tracking-wider">Child Profiles</span>
          <p className="text-2xl font-extrabold text-[#6C3EF4] tabular-nums mt-1">{totalChildren + 1850}</p>
          <span className="text-[11px] text-slate-400">Average 1.8 children per family</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">Active Applications</span>
          <p className="text-2xl font-extrabold text-blue-600 tabular-nums mt-1">{applications.length + 860}</p>
          <span className="text-[11px] text-slate-400">Pending intake decisions</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search parent name, phone, email, or National ID (NIN)..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-slate-900 dark:text-white"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-slate-900 dark:text-white"
            >
              <option value="all">All Districts</option>
              {districts.filter(d => d !== 'all').map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-slate-900 dark:text-white"
            >
              <option value="all">All Verification Statuses</option>
              <option value="verified">Verified NIN Only</option>
              <option value="unverified">Pending NIN Verification</option>
            </select>
          </div>
        </div>
      </div>

      {/* Parents Master Directory List */}
      <div className="space-y-4">
        {filteredParents.map((parent) => {
          const linkedChildren = getChildrenForParent(parent.id);
          const isExpanded = expandedParentId === parent.id;

          return (
            <div 
              key={parent.id}
              className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-all duration-200"
            >
              {/* Parent Summary Header */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/60 flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5 text-[#6C3EF4]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                        {parent.name}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        parent.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {parent.status === 'verified' && <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                        {parent.status === 'verified' ? 'NIN Verified' : 'Unverified'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                      <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        NIN: {parent.ninNumber}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{parent.district}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-slate-400" />
                        <span>{parent.occupation || 'Self-Employed'}</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{parent.phone}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>{parent.email}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => setContactParentModal(parent)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#6C3EF4]" />
                    <span>Send Advisory</span>
                  </button>

                  <button
                    onClick={() => setExpandedParentId(isExpanded ? null : parent.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#6C3EF4] dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-xl transition-colors cursor-pointer"
                  >
                    <span>{linkedChildren.length} Linked Children</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expandable Children and Application Details */}
              {isExpanded && (
                <div className="bg-slate-50/70 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/80 p-4 sm:p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-[#6C3EF4]" />
                    <span>Associated Children & Admission Progress</span>
                  </h4>

                  {linkedChildren.length === 0 ? (
                    <p className="text-xs text-slate-400 py-2">No child records registered yet for this parent account.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {linkedChildren.map((child) => (
                        <div 
                          key={child.id}
                          className="bg-white dark:bg-[#111827] rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-800 space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">
                                {child.name}
                              </h5>
                              <p className="text-[11px] text-slate-500">
                                {child.gender} · Target: <strong className="text-slate-800 dark:text-slate-200">{child.gradeApplyingFor}</strong>
                              </p>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] dark:text-purple-300">
                              {child.pleAggregate || 'Grade Verified'}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-500 space-y-0.5">
                            <p>Current School: <span className="font-medium text-slate-700 dark:text-slate-300">{child.currentSchool || 'Kampala Parents School'}</span></p>
                            {child.notes && (
                              <p className="text-slate-400 italic line-clamp-2">"{child.notes}"</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Send Official Advisory Modal */}
      {contactParentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#111827] rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-[#6C3EF4]" />
                <span>Send Official Guardian Advisory</span>
              </h3>
              <button 
                onClick={() => setContactParentModal(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendAdvisory} className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white">{contactParentModal.name}</p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Phone: {contactParentModal.phone} · Email: {contactParentModal.email}
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Advisory Notification Content
                </label>
                <textarea
                  required
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="e.g. Please upload Trevor's UNEB official verification certificate to finalize the Gayaza High School S.1 intake list."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setContactParentModal(null)}
                  className="px-3 py-2 font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-[#6C3EF4] hover:bg-[#5b32db] rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Advisory</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
