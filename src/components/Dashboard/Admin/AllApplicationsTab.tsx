import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  Check, 
  Building2, 
  User, 
  Calendar, 
  Award, 
  ShieldCheck,
  Send
} from 'lucide-react';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';
import { ApplicantRecord, ApplicationStatus } from '../../../types/admissions';

export const AllApplicationsTab: React.FC = () => {
  const { applications, schools, overrideApplicationStatus, addAuditLog } = useAdmissionsData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [activeDossier, setActiveDossier] = useState<ApplicantRecord | null>(null);
  const [overrideStatus, setOverrideStatus] = useState<ApplicationStatus>('Admitted');
  const [overrideNote, setOverrideNote] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Metrics
  const totalApps = applications.length;
  const admittedCount = applications.filter(a => a.status === 'Admitted').length;
  const underReviewCount = applications.filter(a => a.status === 'Under Review' || a.status === 'Submitted').length;
  const interviewCount = applications.filter(a => a.status === 'Interview Scheduled').length;

  // Grade levels set
  const gradeLevels = ['all', ...Array.from(new Set(applications.map(a => a.gradeLevel)))];

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.pleAggregate && app.pleAggregate.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSchool = selectedSchoolId === 'all' || app.schoolId === selectedSchoolId || app.schoolName.toLowerCase().includes(selectedSchoolId.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    const matchesGrade = selectedGrade === 'all' || app.gradeLevel === selectedGrade;

    return matchesSearch && matchesSchool && matchesStatus && matchesGrade;
  });

  const handleApplyOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDossier) return;

    await overrideApplicationStatus(activeDossier.id, overrideStatus, overrideNote);
    
    addAuditLog({
      actorName: 'Dr. Ronald Mukasa',
      actorRole: 'Super Administrator',
      action: 'Admissions Decision Override',
      target: `${activeDossier.studentName} (${activeDossier.id})`,
      details: `Status overridden to ${overrideStatus}. Reason: ${overrideNote || 'Supervisory ministerial review.'}`,
      ipAddress: '196.43.102.14',
      status: 'success'
    });

    setFeedback(`Application ${activeDossier.id} updated to ${overrideStatus}.`);
    setActiveDossier(prev => prev ? { ...prev, status: overrideStatus } : null);
    setOverrideNote('');
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleExportCSV = () => {
    const headers = ['Application ID', 'Student Name', 'Parent Name', 'Parent Email', 'Parent Phone', 'School', 'Grade Level', 'PLE Score', 'Status', 'Submission Date'];
    const rows = filteredApps.map(a => [
      a.id,
      `"${a.studentName}"`,
      `"${a.parentName}"`,
      a.parentEmail || '',
      a.parentPhone || '',
      `"${a.schoolName}"`,
      `"${a.gradeLevel}"`,
      `"${a.pleAggregate || ''}"`,
      a.status,
      a.submissionDate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartAdmissions_Applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setFeedback('Exported applications report to CSV successfully.');
    setTimeout(() => setFeedback(null), 3500);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Admitted':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
      case 'Interview Scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300';
      case 'Under Review':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300';
      case 'Verified':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
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

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#6C3EF4]" />
            <span>All Applications Master Registry</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Central repository of student admission dossiers, UNEB verified slips & admission lifecycle across all schools
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#6C3EF4]" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Received</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">{totalApps}</p>
          <span className="text-[11px] text-slate-400">Aggregated intake volume</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Admitted Candidates</span>
          <p className="text-2xl font-extrabold text-emerald-600 tabular-nums mt-1">{admittedCount}</p>
          <span className="text-[11px] text-slate-400">{Math.round((admittedCount / (totalApps || 1)) * 100)}% Placement rate</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">Under Committee Review</span>
          <p className="text-2xl font-extrabold text-amber-600 tabular-nums mt-1">{underReviewCount}</p>
          <span className="text-[11px] text-slate-400">Pending final school offer</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">Interviews Scheduled</span>
          <p className="text-2xl font-extrabold text-blue-600 tabular-nums mt-1">{interviewCount}</p>
          <span className="text-[11px] text-slate-400">Oral & written entrance tests</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student, parent, application ID (e.g. ADM-2026-0142), or PLE..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-slate-900 dark:text-white"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-slate-900 dark:text-white"
            >
              <option value="all">All Schools ({schools.length})</option>
              {schools.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-slate-900 dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Verified">Verified</option>
              <option value="Under Review">Under Review</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Admitted">Admitted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-slate-900 dark:text-white"
            >
              <option value="all">All Grades</option>
              {gradeLevels.filter(g => g !== 'all').map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applications Master Table */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              Nationwide Student Applications
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredApps.length} student dossiers matching criteria
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Dossier ID</th>
                <th className="py-3 px-4">Student & Academic Slip</th>
                <th className="py-3 px-4">Parent / Guardian</th>
                <th className="py-3 px-4">Target School & Grade</th>
                <th className="py-3 px-4">Submitted Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Supervision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                    No applications found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {app.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">{app.studentName}</p>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Award className="w-3 h-3 text-[#6C3EF4]" />
                        <span>{app.pleAggregate || 'Under Assessment'}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{app.parentName}</span>
                      <p className="text-[11px] text-slate-400">{app.parentPhone || app.parentEmail || 'Contact verified'}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{app.schoolName}</span>
                      <p className="text-[11px] text-slate-400">{app.gradeLevel}</p>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 tabular-nums">
                      {app.submissionDate}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setActiveDossier(app);
                          setOverrideStatus(app.status);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-[#6C3EF4] dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Dossier</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dossier & Decision Override Modal */}
      {activeDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#111827] rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#6C3EF4]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{activeDossier.studentName}</span>
                    <span className="font-mono text-xs font-normal text-slate-400">({activeDossier.id})</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Applying for {activeDossier.gradeLevel} at {activeDossier.schoolName}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setActiveDossier(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 text-[11px]">Academic Slip</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{activeDossier.pleAggregate || 'Pending'}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 text-[11px]">Parent / Guardian</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">{activeDossier.parentName}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 text-[11px]">Verified Docs</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 tabular-nums mt-0.5">{activeDossier.documentsCount} Files Attached</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 text-[11px]">Current Status</span>
                <p className="font-bold mt-0.5">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadge(activeDossier.status)}`}>
                    {activeDossier.status}
                  </span>
                </p>
              </div>
            </div>

            {/* Application Notes */}
            {activeDossier.notes && (
              <div className="text-xs space-y-1">
                <span className="font-bold text-slate-900 dark:text-white">Applicant Dossier Notes</span>
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                  {activeDossier.notes}
                </p>
              </div>
            )}

            {/* Lifecycle Timeline */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-900 dark:text-white">Admissions Stage History</span>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {activeDossier.timeline && activeDossier.timeline.length > 0 ? (
                  activeDossier.timeline.map((item) => (
                    <div key={item.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-[#6C3EF4] mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">{item.title}</span>
                          <span className="text-[10px] text-slate-400 tabular-nums">{item.date}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-xs">Submitted online · Under admissions committee assessment.</p>
                )}
              </div>
            </div>

            {/* Super Admin Decision Override Box */}
            <form onSubmit={handleApplyOverride} className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 space-y-3 text-xs">
              <div className="flex items-center gap-1.5 text-[#6C3EF4] dark:text-purple-300 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Super Administrator Decision Override & Ministerial Clearance</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Super Admins can intervene in verification stalls, resolve intake quota disputes, or grant national placement.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Override Target Status
                  </label>
                  <select
                    value={overrideStatus}
                    onChange={(e) => setOverrideStatus(e.target.value as ApplicationStatus)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="Admitted">Admitted (Issue Offer)</option>
                    <option value="Verified">Verified (UNEB Validated)</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Pending Documents">Pending Documents</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Audit Note / Ministerial Justification
                  </label>
                  <input
                    type="text"
                    value={overrideNote}
                    onChange={(e) => setOverrideNote(e.target.value)}
                    placeholder="e.g. Verified by MoES Directive / UNEB slip re-checked"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 font-bold text-white bg-[#6C3EF4] hover:bg-[#5b32db] rounded-xl shadow-xs cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Execute Status Override</span>
                </button>
              </div>
            </form>

            <div className="flex items-center justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveDossier(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
