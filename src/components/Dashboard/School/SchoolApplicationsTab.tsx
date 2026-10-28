import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MessageSquare, 
  Download, 
  Printer, 
  ShieldCheck, 
  X, 
  ChevronRight, 
  Check, 
  Eye, 
  Award,
  Users
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';
import { ApplicantRecord, ApplicationStatus } from '../../../types/admissions';
import { MessageModal } from '../MessageModal';

export const SchoolApplicationsTab: React.FC = () => {
  const { currentUser } = useAuth();
  const { schools, applications, updateApplicationStatus } = useAdmissionsData();

  const currentSchool = schools.find(s => 
    s.id === currentUser?.schoolId || s.name.toLowerCase() === (currentUser?.schoolName || '').toLowerCase()
  ) || schools[0];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [viewingApp, setViewingApp] = useState<ApplicantRecord | null>(null);
  const [interviewModalApp, setInterviewModalApp] = useState<ApplicantRecord | null>(null);
  const [interviewDate, setInterviewDate] = useState('2026-11-28');
  const [interviewTime, setInterviewTime] = useState('09:00');
  const [interviewVenue, setInterviewVenue] = useState('Main Academic Boardroom');
  const [statusToast, setStatusToast] = useState<string | null>(null);

  // Message modal state
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageTarget, setMessageTarget] = useState<{ id: string; name: string } | null>(null);

  // Filter applications for this school
  const schoolApps = applications.filter(app => 
    app.schoolId === currentSchool.id || app.schoolName.toLowerCase() === currentSchool.name.toLowerCase()
  );

  const filteredApps = schoolApps.filter(app => {
    const matchesSearch = 
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.pleAggregate && app.pleAggregate.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = selectedStatus === 'all' || app.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesGrade = selectedGrade === 'all' || app.gradeLevel.toLowerCase().includes(selectedGrade.toLowerCase());

    return matchesSearch && matchesStatus && matchesGrade;
  });

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    await updateApplicationStatus(appId, newStatus);
    setStatusToast(`Application updated to "${newStatus}". Parent notified.`);
    setTimeout(() => setStatusToast(null), 3500);
  };

  const handleScheduleInterviewConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewModalApp) return;

    await updateApplicationStatus(
      interviewModalApp.id, 
      'Interview Scheduled', 
      `Interview scheduled for ${interviewDate} at ${interviewTime} (${interviewVenue}).`
    );

    setStatusToast(`Interview invitation sent to ${interviewModalApp.parentName} for ${interviewModalApp.studentName}.`);
    setInterviewModalApp(null);
    setTimeout(() => setStatusToast(null), 3500);
  };

  const handleOpenMessage = (parentId: string, parentName: string) => {
    setMessageTarget({ id: parentId, name: parentName });
    setMessageModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {statusToast && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusToast}</span>
          </div>
          <button onClick={() => setStatusToast(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header and Export Tools */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Candidate Applications Register
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] dark:text-purple-300">
              {schoolApps.length} Received
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review submitted student dossiers, verify UNEB pass slip results, schedule interviews, and issue official admission offers.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Admissions Roll</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name, parent, application ID, or aggregate score..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C3EF4]/30"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Grades</option>
              <option value="Senior 1">Senior 1 (S.1)</option>
              <option value="Senior 5">Senior 5 (S.5)</option>
              <option value="Primary">Primary</option>
            </select>
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              selectedStatus === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            All ({schoolApps.length})
          </button>
          <button
            onClick={() => setSelectedStatus('submitted')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              selectedStatus === 'submitted'
                ? 'bg-[#6C3EF4] text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            New Submissions ({schoolApps.filter(a => a.status === 'Submitted').length})
          </button>
          <button
            onClick={() => setSelectedStatus('under review')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              selectedStatus === 'under review'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Under Review ({schoolApps.filter(a => a.status === 'Under Review' || a.status === 'Verified').length})
          </button>
          <button
            onClick={() => setSelectedStatus('interview scheduled')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              selectedStatus === 'interview scheduled'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Interviews ({schoolApps.filter(a => a.status === 'Interview Scheduled').length})
          </button>
          <button
            onClick={() => setSelectedStatus('admitted')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              selectedStatus === 'admitted'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Admitted ({schoolApps.filter(a => a.status === 'Admitted').length})
          </button>
        </div>
      </div>

      {/* Applications Data Table */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Applicant & ID</th>
                <th className="py-3.5 px-4">Parent Guardian</th>
                <th className="py-3.5 px-4">Target Grade</th>
                <th className="py-3.5 px-4">PLE / Academic Score</th>
                <th className="py-3.5 px-4">Status & Action</th>
                <th className="py-3.5 px-4 text-right">Tools</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No candidate records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] font-bold flex items-center justify-center text-xs shrink-0">
                          {app.studentName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{app.studentName}</span>
                          <span className="text-[10px] font-mono text-slate-400">{app.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">{app.parentName}</span>
                      <span className="text-[11px] text-slate-500">{app.parentPhone || app.parentEmail}</span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {app.gradeLevel}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#6C3EF4] dark:text-purple-300 block">
                        {app.pleAggregate || 'Grade 1 Distinction'}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold">Pass Slip Attached</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                        className={`text-[11px] font-bold py-1.5 px-2.5 rounded-lg border focus:outline-none ${
                          app.status === 'Admitted'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                            : app.status === 'Interview Scheduled'
                            ? 'bg-purple-50 dark:bg-purple-950/60 text-[#6C3EF4] dark:text-purple-300 border-purple-300'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300'
                        }`}
                      >
                        <option value="Submitted">1. Submitted</option>
                        <option value="Under Review">2. Under Review</option>
                        <option value="Interview Scheduled">3. Interview Scheduled</option>
                        <option value="Admitted">4. Admit Candidate</option>
                        <option value="Rejected">Decline / Reject</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setViewingApp(app)}
                          className="p-1.5 text-slate-500 hover:text-[#6C3EF4] hover:bg-purple-50 dark:hover:bg-slate-800 rounded-lg"
                          title="View Full Candidate Dossier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setInterviewModalApp(app)}
                          className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-800 rounded-lg"
                          title="Schedule Interview Session"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenMessage(app.parentId || 'parent-1', app.parentName)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg"
                          title="Chat with Parent"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Dossier Inspection Modal */}
      {viewingApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-purple-600 font-bold uppercase tracking-wider">
                  Dossier Ref: {viewingApp.id}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {viewingApp.studentName}
                </h3>
                <p className="text-xs text-slate-500">Applying for: {viewingApp.gradeLevel}</p>
              </div>
              <button onClick={() => setViewingApp(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/40 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">PLE / Academic Aggregate:</span>
                <span className="font-bold text-[#6C3EF4]">{viewingApp.pleAggregate || '4 Aggregates (Div 1)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Parent / Guardian:</span>
                <span className="font-bold text-slate-900 dark:text-white">{viewingApp.parentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contact Telephone:</span>
                <span className="font-semibold">{viewingApp.parentPhone || '+256 772 123456'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Submission Date:</span>
                <span className="font-semibold">{viewingApp.submissionDate}</span>
              </div>
            </div>

            {viewingApp.notes && (
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Application Notes / Statements:</span>
                <p className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 italic">
                  "{viewingApp.notes}"
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setViewingApp(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const target = viewingApp;
                  setViewingApp(null);
                  handleStatusChange(target.id, 'Admitted');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Issue Admission Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {interviewModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleScheduleInterviewConfirm} className="bg-white dark:bg-[#111827] rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Schedule Entrance Assessment
                </h3>
                <p className="text-xs text-slate-500">Candidate: {interviewModalApp.studentName}</p>
              </div>
              <button type="button" onClick={() => setInterviewModalApp(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Date:</label>
                <input
                  type="date"
                  required
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Time (EAT):</label>
                <input
                  type="time"
                  required
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Campus Venue / Room:</label>
              <input
                type="text"
                required
                value={interviewVenue}
                onChange={(e) => setInterviewVenue(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setInterviewModalApp(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#6C3EF4] hover:bg-[#5B2FE3] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Send Interview Call</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Message Modal */}
      <MessageModal
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        targetParentId={messageTarget?.id}
        targetParentName={messageTarget?.name}
      />
    </div>
  );
};
