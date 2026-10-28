import React from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Zap, 
  Gift, 
  Check, 
  Building2, 
  Clock, 
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';

export const SchoolSubscriptionTab: React.FC = () => {
  const { currentUser } = useAuth();
  const { schools, applications } = useAdmissionsData();

  const currentSchool = schools.find(s => 
    s.id === currentUser?.schoolId || s.name.toLowerCase() === (currentUser?.schoolName || '').toLowerCase()
  ) || schools[0];

  const schoolApps = applications.filter(a => 
    a.schoolId === currentSchool.id || a.schoolName.toLowerCase() === currentSchool.name.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* 1. Header Banner with Big Prominent FREE Badges */}
      <div className="bg-gradient-to-r from-[#121927] via-[#1E1B4B] to-[#2E1065] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-purple-500/30">
        <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-md bg-emerald-500 text-white text-xs font-black uppercase tracking-widest shadow-xs">
              FREE
            </span>
            <span className="px-3 py-1 rounded-md bg-white/10 backdrop-blur-xs text-emerald-300 text-xs font-bold">
              100% Free Institutional Tier Active
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-200 text-[11px] font-semibold">
              Perpetual National Access
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Institutional Plan: Free Tier
          </h1>
          <p className="text-sm text-purple-100 leading-relaxed">
            Smart Admissions provides accredited schools in Uganda with full digital admissions, automated UNEB validation, parent messaging, and student intake management at zero cost.
          </p>
        </div>
      </div>

      {/* 2. Active Subscription Card */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border-2 border-emerald-500/40 dark:border-emerald-500/30 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 text-xs font-black uppercase tracking-wider">
                FREE PLAN
              </span>
              <span className="text-xs font-bold text-slate-500">· Active for {currentSchool.name}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              UGX 0 <span className="text-sm font-semibold text-slate-400">/ Free Forever</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              No subscription fee, no commissions on application handling, and no hidden server charges.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Full Features Unlocked</span>
            </span>
          </div>
        </div>

        {/* Quota Usage Meter */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Student Applications Processed
            </span>
            <span className="font-extrabold text-[#6C3EF4] dark:text-purple-300 tabular-nums">
              {schoolApps.length} / Unlimited (Free Tier)
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-[#6C3EF4] h-full rounded-full" style={{ width: '100%' }} />
          </div>
          <p className="text-[11px] text-slate-400">
            Your institution is cleared for unlimited intake cycles, scholarship programs, and parent chats.
          </p>
        </div>
      </div>

      {/* 3. Included Features in the Free Tier */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Everything Included in Your Free Institutional Account
            </h3>
            <p className="text-xs text-slate-500">Every accredited primary and secondary school receives full platform access</p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-extrabold">
            FREE TIER
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Unlimited Candidate Applications</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Receive, vet, and store student admission dossiers with zero volume caps.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Automated UNEB Score Validation</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Instant verification of Primary Leaving Examination aggregates.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">End-to-End Encrypted Parent Inquiries</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Secure, confidential messaging with parents and legal guardians.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">National Directory Verification Badge</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">MoES certified badge displayed on parent discovery feeds.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Intake Funnel & Pipeline Kanban</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Drag-and-advance pipeline from submission to enrolled confirmation.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Prospective Parent Leads CRM</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Engage families who saved your institution to their shortlists.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
