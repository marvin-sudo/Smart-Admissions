import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Download, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  X, 
  Check, 
  Filter, 
  QrCode, 
  Printer, 
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';
import { ApplicantRecord, ApplicationStatus } from '../../../types/admissions';
import { MessageModal } from '../MessageModal';

export const MyApplicationsTab: React.FC<{ onNavigateToDiscover?: () => void }> = ({ onNavigateToDiscover }) => {
  const { currentUser } = useAuth();
  const { 
    applications, 
    children, 
    schools,
    acceptOffer, 
    declineOffer, 
    withdrawApplication 
  } = useAdmissionsData();

  const [selectedChildFilter, setSelectedChildFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedAppForSlip, setSelectedAppForSlip] = useState<ApplicantRecord | null>(null);
  const [withdrawModalApp, setWithdrawModalApp] = useState<ApplicantRecord | null>(null);
  const [withdrawReason, setWithdrawReason] = useState('Enrolled in alternate school');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Message Modal
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageTarget, setMessageTarget] = useState<{ id: string; name: string } | null>(null);

  if (!currentUser) return null;

  // Filter parent's applications
  const parentApplications = applications.filter(app => 
    !app.parentId || app.parentId === currentUser.id || app.parentEmail === currentUser.email
  );

  const filteredApplications = parentApplications.filter(app => {
    const matchesChild = selectedChildFilter === 'all' || app.childId === selectedChildFilter || app.studentName.toLowerCase().includes(selectedChildFilter.toLowerCase());
    const matchesStatus = 
      selectedStatusFilter === 'all' 
        ? true 
        : selectedStatusFilter === 'pending'
        ? (app.status === 'Submitted' || app.status === 'Under Review' || app.status === 'Pending Documents')
        : selectedStatusFilter === 'interviews'
        ? app.status === 'Interview Scheduled'
        : selectedStatusFilter === 'admitted'
        ? app.status === 'Admitted'
        : app.status.toLowerCase() === selectedStatusFilter.toLowerCase();

    return matchesChild && matchesStatus;
  });

  const getStepNumber = (status: ApplicationStatus) => {
    switch (status) {
      case 'Submitted': return 1;
      case 'Verified':
      case 'Under Review':
      case 'Pending Documents': return 2;
      case 'Interview Scheduled': return 3;
      case 'Admitted': return 4;
      default: return 1;
    }
  };

  const handleAccept = async (appId: string) => {
    await acceptOffer(appId);
    setActionSuccessMsg('Admission offer accepted! Your child’s placement is confirmed.');
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleDecline = async (appId: string) => {
    if (window.confirm('Are you sure you want to decline this admission offer? This slot will be released.')) {
      await declineOffer(appId);
      setActionSuccessMsg('Offer declined and slot released.');
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }
  };

  const handleWithdrawConfirm = async () => {
    if (withdrawModalApp) {
      await withdrawApplication(withdrawModalApp.id, withdrawReason);
      setWithdrawModalApp(null);
      setActionSuccessMsg('Application successfully withdrawn.');
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }
  };

  const handleOpenMessage = (schoolId: string, schoolName: string) => {
    setMessageTarget({ id: schoolId, name: schoolName });
    setMessageModalOpen(true);
  };

  // Counts
  const totalCount = parentApplications.length;
  const reviewCount = parentApplications.filter(a => a.status === 'Submitted' || a.status === 'Under Review').length;
  const interviewCount = parentApplications.filter(a => a.status === 'Interview Scheduled').length;
  const admittedCount = parentApplications.filter(a => a.status === 'Admitted').length;

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-xs transition-all">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Stats Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Submitted</span>
            <FileText className="w-4 h-4 text-[#6C3EF4]" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 tabular-nums">{totalCount}</p>
          <span className="text-[10px] text-slate-500">Across all institutions</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Under Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 tabular-nums text-amber-600">{reviewCount}</p>
          <span className="text-[10px] text-slate-500">Admissions committee vetting</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Interviews</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 tabular-nums text-[#6C3EF4] dark:text-purple-400">{interviewCount}</p>
          <span className="text-[10px] text-slate-500">Scheduled oral/written sessions</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Offers Ready</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 tabular-nums text-emerald-600">{admittedCount}</p>
          <span className="text-[10px] text-slate-500">Official admission granted</span>
        </div>
      </div>

      {/* Filter and Child Switcher Bar */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              selectedStatusFilter === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setSelectedStatusFilter('pending')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              selectedStatusFilter === 'pending'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            In Review ({reviewCount})
          </button>
          <button
            onClick={() => setSelectedStatusFilter('interviews')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              selectedStatusFilter === 'interviews'
                ? 'bg-[#6C3EF4] text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Interviews ({interviewCount})
          </button>
          <button
            onClick={() => setSelectedStatusFilter('admitted')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              selectedStatusFilter === 'admitted'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Admitted ({admittedCount})
          </button>
        </div>

        {/* Filter by Child */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs text-slate-500 font-medium">Child:</label>
          <select
            value={selectedChildFilter}
            onChange={(e) => setSelectedChildFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Children</option>
            {children.map(ch => (
              <option key={ch.id} value={ch.name}>{ch.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white dark:bg-[#111827] rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-[#6C3EF4] flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No applications match this filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You can discover accredited primary and secondary schools and lodge an admission dossier anytime.
          </p>
          {onNavigateToDiscover && (
            <button
              onClick={onNavigateToDiscover}
              className="px-4 py-2 bg-[#6C3EF4] text-white text-xs font-bold rounded-xl hover:bg-[#5B2FE3] transition-colors cursor-pointer"
            >
              Explore Schools Directory
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => {
            const currentStep = getStepNumber(app.status);
            const isAdmitted = app.status === 'Admitted';
            const isInterview = app.status === 'Interview Scheduled';
            const isWithdrawn = app.status === 'Rejected';

            return (
              <div 
                key={app.id}
                className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-purple-300 dark:hover:border-purple-700/60 transition-all overflow-hidden"
              >
                {/* Header Information */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] dark:text-purple-300 font-black text-sm flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800">
                        {app.schoolName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            {app.studentName}
                          </h3>
                          <span className="text-xs text-slate-400 font-mono">({app.id})</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isAdmitted 
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' 
                              : isInterview 
                              ? 'bg-purple-100 text-[#6C3EF4] dark:bg-purple-950/60 dark:text-purple-300'
                              : isWithdrawn
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          Applying to: <strong className="text-slate-900 dark:text-white">{app.schoolName}</strong> · Target Level: <strong>{app.gradeLevel}</strong>
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          PLE / Academic Score: <span className="font-semibold text-slate-700 dark:text-slate-200">{app.pleAggregate || 'Grade 1 Distinction'}</span> · Submitted on {app.submissionDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        onClick={() => handleOpenMessage(app.schoolId || 'sch-gayaza-01', app.schoolName)}
                        className="px-3 py-1.5 text-xs font-semibold text-[#6C3EF4] dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 rounded-xl border border-purple-200 dark:border-purple-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message School</span>
                      </button>

                      {!isWithdrawn && !isAdmitted && (
                        <button
                          onClick={() => setWithdrawModalApp(app)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                          title="Withdraw this application"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 4-Step Milestone Progress Bar */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold text-slate-400 mb-2">
                      <div className={currentStep >= 1 ? 'text-[#6C3EF4] dark:text-purple-400' : ''}>
                        <span>1. Submitted</span>
                      </div>
                      <div className={currentStep >= 2 ? 'text-[#6C3EF4] dark:text-purple-400' : ''}>
                        <span>2. Vetting & UNEB</span>
                      </div>
                      <div className={currentStep >= 3 ? 'text-[#6C3EF4] dark:text-purple-400' : ''}>
                        <span>3. Assessment</span>
                      </div>
                      <div className={currentStep >= 4 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                        <span>4. Official Offer</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden flex">
                      <div 
                        className={`h-full transition-all duration-700 ${
                          isAdmitted 
                            ? 'bg-emerald-500' 
                            : isWithdrawn 
                            ? 'bg-rose-400' 
                            : 'bg-gradient-to-r from-[#6C3EF4] to-[#8B5CF6]'
                        }`}
                        style={{ width: `${(currentStep / 4) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Special Callout: Official Admission Offer Ready */}
                  {isAdmitted && (
                    <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-200 font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Official Admission Package Approved!</span>
                        </div>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                          Congratulations! {app.studentName} has been offered a placement at {app.schoolName} for {app.gradeLevel}.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setSelectedAppForSlip(app)}
                          className="px-3.5 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-200 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-xl hover:bg-emerald-100 flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Admission Slip</span>
                        </button>
                        <button
                          onClick={() => handleAccept(app.id)}
                          className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          Confirm & Accept Slot
                        </button>
                        <button
                          onClick={() => handleDecline(app.id)}
                          className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 rounded-xl cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Special Callout: Interview Scheduled */}
                  {isInterview && (
                    <div className="mt-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[#6C3EF4] dark:text-purple-300 font-bold text-xs">
                          <Calendar className="w-4 h-4 text-[#6C3EF4] shrink-0" />
                          <span>Entrance Assessment & Oral Interview Call</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          Date: <strong className="text-slate-900 dark:text-white">Saturday, Dec 05, 2026 at 09:30 AM EAT</strong>
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Venue: Main Academic Boardroom, {app.schoolName}. Please bring original PLE Slip, 2 Passport Photos, and Baptismal Card.
                        </p>
                      </div>

                      <button
                        onClick={() => handleOpenMessage(app.schoolId || 'sch-gayaza-01', app.schoolName)}
                        className="px-3 py-2 text-xs font-bold text-[#6C3EF4] bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-700 rounded-xl hover:bg-purple-100 shrink-0 cursor-pointer"
                      >
                        Reschedule / Inquire
                      </button>
                    </div>
                  )}

                  {/* Historical Timeline Snippet */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] flex items-center justify-between text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Last Activity:</span>
                      <strong className="text-slate-700 dark:text-slate-300">
                        {app.timeline && app.timeline.length > 0 ? app.timeline[app.timeline.length - 1].title : 'Dossier received'}
                      </strong>
                    </span>
                    <span className="text-slate-400">
                      {app.timeline && app.timeline.length > 0 ? app.timeline[app.timeline.length - 1].date : 'Recent'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Official Admission Slip Modal / Certificate Preview */}
      {selectedAppForSlip && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto text-slate-900 shadow-2xl p-6 sm:p-8 space-y-6 border border-slate-200">
            {/* Header with National Emblems */}
            <div className="text-center pb-4 border-b-2 border-[#6C3EF4] space-y-1">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ShieldCheck className="w-6 h-6 text-[#6C3EF4]" />
                <span className="text-[11px] font-black uppercase tracking-widest text-[#6C3EF4]">
                  SMART ADMISSIONS UGANDA · OFFICIAL PLACEMENT PROVISIONAL SLIP
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">
                {selectedAppForSlip.schoolName}
              </h2>
              <p className="text-xs text-slate-500">
                Registered Center of the Ministry of Education & Sports · Republic of Uganda
              </p>
            </div>

            {/* Certificate Body */}
            <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Dossier Reference:</span>
                <span className="font-mono font-bold text-[#6C3EF4]">{selectedAppForSlip.id}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Candidate Full Name:</span>
                <span className="font-bold text-slate-900">{selectedAppForSlip.studentName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Level Offered:</span>
                <span className="font-bold text-slate-900">{selectedAppForSlip.gradeLevel}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">PLE / Academic Division:</span>
                <span className="font-bold text-slate-900">{selectedAppForSlip.pleAggregate || 'Division 1 (Distinction)'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Parent / Guardian:</span>
                <span className="font-bold text-slate-900">{selectedAppForSlip.parentName}</span>
              </div>
            </div>

            <div className="text-xs text-slate-600 leading-relaxed space-y-2">
              <p>
                This letter confirms that the above-named candidate has satisfied the academic requirements and entrance standards of <strong>{selectedAppForSlip.schoolName}</strong> and has been offered provisional admission for the upcoming academic year.
              </p>
              <p>
                <strong>Terms of Placement:</strong> Physical reporting and registration takes place on the official term opening date. This slip must be presented alongside the candidate’s authentic UNEB Primary Leaving Examination (PLE) Pass Slip and medical clearance dossier.
              </p>
            </div>

            {/* Official Stamp & QR Code */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center p-1">
                  <QrCode className="w-14 h-14 text-slate-800" />
                </div>
                <div className="text-[10px] text-slate-500">
                  <p className="font-mono font-bold text-slate-800">MoES-VERIFIED-AUTH</p>
                  <p>Scan to authenticate credential on national registry</p>
                </div>
              </div>

              <div className="text-right">
                <div className="w-32 border-b border-slate-400 mb-1" />
                <p className="text-[10px] font-bold text-slate-800">Office of the Head of Admissions</p>
                <p className="text-[9px] text-slate-500">{selectedAppForSlip.schoolName}</p>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setSelectedAppForSlip(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-[#6C3EF4] hover:bg-[#5B2FE3] rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Reason Modal */}
      {withdrawModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Withdraw Application</h3>
              <button onClick={() => setWithdrawModalApp(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Are you sure you wish to withdraw the application for <strong>{withdrawModalApp.studentName}</strong> to <strong>{withdrawModalApp.schoolName}</strong>?
            </p>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Reason for withdrawal:</label>
              <select
                value={withdrawReason}
                onChange={(e) => setWithdrawReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              >
                <option value="Enrolled in alternate school">Enrolled in alternate preferred school</option>
                <option value="Family relocation outside district">Family relocation outside district</option>
                <option value="Financial / Tuition re-evaluation">Financial / Tuition budget change</option>
                <option value="Applying for alternate academic term">Applying for alternate academic term</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setWithdrawModalApp(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdrawConfirm}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
              >
                Confirm Withdrawal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messaging Modal */}
      <MessageModal
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        targetSchoolId={messageTarget?.id}
        targetSchoolName={messageTarget?.name}
      />
    </div>
  );
};
