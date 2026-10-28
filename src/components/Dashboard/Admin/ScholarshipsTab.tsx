import React, { useState } from 'react';
import { 
  Award, 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  Users, 
  Building2, 
  CheckCircle2, 
  X, 
  Check, 
  Clock, 
  AlertCircle,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';
import { Scholarship } from '../../../types/admissions';

export const ScholarshipsTab: React.FC = () => {
  const { scholarships, schools, toggleScholarshipStatus, addScholarship, addAuditLog } = useAdmissionsData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed'>('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [schoolId, setSchoolId] = useState(schools[0]?.id || 'sch-smack-02');
  const [description, setDescription] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [coverage, setCoverage] = useState('100% Full Boarding Tuition');
  const [deadline, setDeadline] = useState('Dec 15, 2026');
  const [educationLevel, setEducationLevel] = useState('Senior 1 (S.1)');

  // Metrics
  const totalScholarships = scholarships.length;
  const activeCount = scholarships.filter(s => s.status === 'active').length;
  const totalApplicants = scholarships.reduce((acc, s) => acc + (s.applicationsCount || 0), 0);

  const filteredScholarships = scholarships.filter(sch => {
    const matchesSearch = 
      sch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.eligibility.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || sch.status === statusFilter;
    const matchesLevel = levelFilter === 'all' || sch.educationLevel.toLowerCase().includes(levelFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesLevel;
  });

  const handleToggleStatus = (scholarshipId: string, currentStatus: string, schTitle: string) => {
    toggleScholarshipStatus(scholarshipId);
    const newStatus = currentStatus === 'active' ? 'closed' : 'active';
    addAuditLog({
      actorName: 'Dr. Ronald Mukasa',
      actorRole: 'Super Administrator',
      action: 'Scholarship Status Toggled',
      target: schTitle,
      details: `Changed bursary program status to ${newStatus}.`,
      ipAddress: '196.43.102.14',
      status: 'success'
    });
    setFeedback(`Scholarship "${schTitle}" is now ${newStatus}.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleCreateScholarship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !eligibility.trim()) return;

    const targetSchool = schools.find(s => s.id === schoolId);
    const targetName = targetSchool ? targetSchool.name : 'National Sponsoring Body';

    await addScholarship({
      schoolId,
      schoolName: targetName,
      title,
      description,
      eligibility,
      coverage,
      deadline,
      educationLevel,
      status: 'active',
      urgent: false
    });

    addAuditLog({
      actorName: 'Dr. Ronald Mukasa',
      actorRole: 'Super Administrator',
      action: 'National Scholarship Provisioned',
      target: title,
      details: `Created new bursary under ${targetName}.`,
      ipAddress: '196.43.102.14',
      status: 'success'
    });

    setFeedback(`New scholarship program "${title}" published.`);
    setShowAddModal(false);
    setTitle('');
    setDescription('');
    setEligibility('');
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

      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-[#6C3EF4]" />
            <span>National Bursaries & Scholarships</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Institutional endowments, government bursaries, and partner foundation educational grants across Uganda
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#6C3EF4] hover:bg-[#5b32db] rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Scholarship</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Programs</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">{totalScholarships}</p>
          <span className="text-[11px] text-slate-400">Listed bursaries</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Active & Open</span>
          <p className="text-2xl font-extrabold text-emerald-600 tabular-nums mt-1">{activeCount}</p>
          <span className="text-[11px] text-slate-400">Accepting applications</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-[#6C3EF4] uppercase tracking-wider">Applicant Candidates</span>
          <p className="text-2xl font-extrabold text-[#6C3EF4] tabular-nums mt-1">{totalApplicants}</p>
          <span className="text-[11px] text-slate-400">Dossiers submitted</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">Award Coverage</span>
          <p className="text-2xl font-extrabold text-blue-600 tabular-nums mt-1">100%</p>
          <span className="text-[11px] text-slate-400">Tuition & boarding grants</span>
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
              placeholder="Search scholarship title, school, foundation, or eligibility criteria..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-slate-900 dark:text-white"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-slate-900 dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active & Open Only</option>
              <option value="closed">Closed / Concluded</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-slate-900 dark:text-white"
            >
              <option value="all">All Education Levels</option>
              <option value="senior 1">Senior 1 (S.1)</option>
              <option value="senior 5">Senior 5 (S.5)</option>
              <option value="primary">Primary</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scholarships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredScholarships.map((sch) => (
          <div 
            key={sch.id}
            className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/60 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-[#6C3EF4]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {sch.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {sch.schoolName} · Level: {sch.educationLevel}
                    </p>
                  </div>
                </div>

                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                  sch.status === 'active'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {sch.status === 'active' ? 'Active' : 'Closed'}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                {sch.description}
              </p>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Coverage:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{sch.coverage}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Eligibility:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{sch.eligibility}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Application Deadline:</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400 tabular-nums flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{sch.deadline}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500 flex items-center gap-1.5 tabular-nums">
                <Users className="w-3.5 h-3.5 text-[#6C3EF4]" />
                <strong>{sch.applicationsCount}</strong> candidates applied
              </span>

              <button
                onClick={() => handleToggleStatus(sch.id, sch.status, sch.title)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                  sch.status === 'active'
                    ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60'
                    : 'text-white bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {sch.status === 'active' ? 'Close Applications' : 'Reactivate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Scholarship Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#111827] rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-[#6C3EF4]" />
                <span>Publish New National Scholarship</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateScholarship} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Scholarship Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Stanbic National STEM Secondary Scholars"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Benefactor / School
                  </label>
                  <select
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {schools.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Education Level
                  </label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="Senior 1 (S.1)">Senior 1 (S.1)</option>
                    <option value="Senior 5 (S.5)">Senior 5 (S.5)</option>
                    <option value="Primary 1 - 7">Primary 1 - 7</option>
                    <option value="A-Level STEM">A-Level STEM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Coverage *
                  </label>
                  <input
                    type="text"
                    required
                    value={coverage}
                    onChange={(e) => setCoverage(e.target.value)}
                    placeholder="e.g. 100% Tuition & Boarding"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Application Deadline *
                  </label>
                  <input
                    type="text"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder="e.g. Dec 20, 2026"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Eligibility Criteria *
                </label>
                <input
                  type="text"
                  required
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  placeholder="e.g. Division 1 (4-6 aggregates) + Financial need certificate"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Grant Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive description of bursary scope, requirements, and assessment procedures..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-[#6C3EF4] hover:bg-[#5b32db] rounded-xl shadow-xs cursor-pointer"
                >
                  Publish Scholarship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
