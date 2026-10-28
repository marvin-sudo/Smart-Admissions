import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ChevronRight, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  X, 
  Check, 
  Sparkles, 
  BarChart3,
  SlidersHorizontal,
  FileText
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';
import { ApplicantRecord, ApplicationStatus } from '../../../types/admissions';

export const AdmissionsPipelineTab: React.FC = () => {
  const { currentUser } = useAuth();
  const { schools, applications, updateApplicationStatus } = useAdmissionsData();

  const currentSchool = schools.find(s => 
    s.id === currentUser?.schoolId || s.name.toLowerCase() === (currentUser?.schoolName || '').toLowerCase()
  ) || schools[0];

  const [notification, setNotification] = useState<string | null>(null);

  // Filter school applications
  const schoolApps = applications.filter(app => 
    app.schoolId === currentSchool.id || app.schoolName.toLowerCase() === currentSchool.name.toLowerCase()
  );

  const stage1Apps = schoolApps.filter(a => a.status === 'Submitted');
  const stage2Apps = schoolApps.filter(a => a.status === 'Under Review' || a.status === 'Verified');
  const stage3Apps = schoolApps.filter(a => a.status === 'Interview Scheduled');
  const stage4Apps = schoolApps.filter(a => a.status === 'Admitted');

  const capacity = currentSchool.intakeCapacity || 280;
  const fillPercentage = Math.round((stage4Apps.length / capacity) * 100);

  const handleAdvance = async (appId: string, currentStatus: ApplicationStatus) => {
    let nextStatus: ApplicationStatus = 'Under Review';
    if (currentStatus === 'Submitted') nextStatus = 'Under Review';
    else if (currentStatus === 'Under Review' || currentStatus === 'Verified') nextStatus = 'Interview Scheduled';
    else if (currentStatus === 'Interview Scheduled') nextStatus = 'Admitted';

    await updateApplicationStatus(appId, nextStatus);
    setNotification(`Advanced candidate to "${nextStatus}".`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header & Intake Target Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Admissions Pipeline & Conversion Funnel
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] dark:text-purple-300">
              Live Intake Tracking
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track student advancement across stages from submission to enrollment and monitor intake capacity.
          </p>
        </div>
      </div>

      {/* Pipeline Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Pipeline</span>
            <Users className="w-4 h-4 text-[#6C3EF4]" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 tabular-nums">
            {schoolApps.length}
          </p>
          <span className="text-[10px] text-slate-500">Across all four stages</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Capacity Filled</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 tabular-nums">{fillPercentage}%</span>
            <span className="text-xs text-slate-500">({stage4Apps.length}/{capacity})</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(fillPercentage, 100)}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">In Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2 tabular-nums">
            {stage2Apps.length}
          </p>
          <span className="text-[10px] text-slate-500">Awaiting committee decision</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Interviews Active</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-[#6C3EF4] dark:text-purple-400 mt-2 tabular-nums">
            {stage3Apps.length}
          </p>
          <span className="text-[10px] text-slate-500">Oral/Written sessions</span>
        </div>
      </div>

      {/* Visual Funnel Conversion Bar */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Intake Funnel Progression
        </h3>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
            <span className="text-[10px] font-bold text-[#6C3EF4] uppercase block">1. Submitted</span>
            <span className="text-lg font-black text-slate-900 dark:text-white mt-1 block">{stage1Apps.length}</span>
            <span className="text-[10px] text-slate-400">100% Entry</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <span className="text-[10px] font-bold text-amber-700 uppercase block">2. In Review</span>
            <span className="text-lg font-black text-slate-900 dark:text-white mt-1 block">{stage2Apps.length}</span>
            <span className="text-[10px] text-slate-400">UNEB Validated</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
            <span className="text-[10px] font-bold text-blue-700 uppercase block">3. Assessment</span>
            <span className="text-lg font-black text-slate-900 dark:text-white mt-1 block">{stage3Apps.length}</span>
            <span className="text-[10px] text-slate-400">Interviews</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <span className="text-[10px] font-bold text-emerald-700 uppercase block">4. Admitted</span>
            <span className="text-lg font-black text-emerald-600 mt-1 block">{stage4Apps.length}</span>
            <span className="text-[10px] text-emerald-600 font-bold">Placed</span>
          </div>
        </div>
      </div>

      {/* Kanban 4-Column Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {/* Column 1: New Submissions */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#6C3EF4]" />
              <span>1. New Submitted</span>
            </h4>
            <span className="text-xs font-bold text-[#6C3EF4] tabular-nums">{stage1Apps.length}</span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
            {stage1Apps.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-400">No new applications</p>
            ) : (
              stage1Apps.map(app => (
                <div key={app.id} className="p-3.5 bg-white dark:bg-[#111827] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2 hover:border-purple-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{app.studentName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{app.id}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{app.gradeLevel} · {app.pleAggregate || 'Grade 1'}</p>
                  <button
                    onClick={() => handleAdvance(app.id, app.status)}
                    className="w-full py-1.5 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-[#6C3EF4] text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Move to Review</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Under Review */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>2. Committee Review</span>
            </h4>
            <span className="text-xs font-bold text-amber-600 tabular-nums">{stage2Apps.length}</span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
            {stage2Apps.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-400">No candidates under review</p>
            ) : (
              stage2Apps.map(app => (
                <div key={app.id} className="p-3.5 bg-white dark:bg-[#111827] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2 hover:border-amber-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{app.studentName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{app.id}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{app.gradeLevel} · {app.pleAggregate || 'Grade 1'}</p>
                  <button
                    onClick={() => handleAdvance(app.id, app.status)}
                    className="w-full py-1.5 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-700 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Schedule Interview</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Interview Scheduled */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>3. Assessment</span>
            </h4>
            <span className="text-xs font-bold text-blue-600 tabular-nums">{stage3Apps.length}</span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
            {stage3Apps.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-400">No scheduled interviews</p>
            ) : (
              stage3Apps.map(app => (
                <div key={app.id} className="p-3.5 bg-white dark:bg-[#111827] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2 hover:border-blue-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{app.studentName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{app.id}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{app.gradeLevel} · {app.pleAggregate || 'Grade 1'}</p>
                  <button
                    onClick={() => handleAdvance(app.id, app.status)}
                    className="w-full py-1.5 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Admit Student</span>
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 4: Admitted */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>4. Enrolled Admitted</span>
            </h4>
            <span className="text-xs font-bold text-emerald-600 tabular-nums">{stage4Apps.length}</span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
            {stage4Apps.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-400">No admitted students yet</p>
            ) : (
              stage4Apps.map(app => (
                <div key={app.id} className="p-3.5 bg-white dark:bg-[#111827] rounded-xl border border-emerald-200 dark:border-emerald-900/40 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{app.studentName}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-slate-500">{app.gradeLevel} · {app.pleAggregate}</p>
                  <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Official Slot Confirmed
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
