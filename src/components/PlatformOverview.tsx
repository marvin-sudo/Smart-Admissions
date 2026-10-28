import React from 'react';
import { 
  Users, 
  School, 
  BarChart3, 
  CheckCircle, 
  ArrowRight
} from 'lucide-react';
import { PortalType } from '../types/admissions';
import { ScrollReveal } from './ScrollReveal';

interface PlatformOverviewProps {
  onSelectPortalDemo: (portal: PortalType) => void;
  onOpenRegister: () => void;
}

export const PlatformOverview: React.FC<PlatformOverviewProps> = ({ 
  onSelectPortalDemo,
  onOpenRegister: _onOpenRegister 
}) => {
  return (
    <section id="platform-overview" className="py-20 lg:py-28 bg-white dark:bg-[#0B0F19] border-t border-slate-100 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#0000B7] dark:text-purple-300 bg-[#F5F3FF] dark:bg-purple-950/40 px-3 py-1 rounded-md border border-[#8B5CF6]/20 dark:border-purple-800/40">
            One Platform, Three Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-4 text-balance">
            Everything Admissions Needs. <br />
            <span className="text-[#0000B7] dark:text-[#A78BFA]">All in One Place.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-4 leading-relaxed font-normal">
            Smart Admissions connects every part of the admissions journey through dedicated experiences for parents, schools, and top management.
          </p>
        </ScrollReveal>

        {/* 3 Large Distinct Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card A: Parent Portal */}
          <ScrollReveal delay={0}>
            <div className="group relative h-full bg-[#F5F3FF]/30 dark:bg-slate-900/60 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-[#8B5CF6]/50 p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-[#8B5CF6]/10 hover:-translate-y-1">
              <div className="space-y-6">
                
                {/* Header & Icon */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#8B5CF6] dark:text-purple-300 flex items-center justify-center shadow-xs">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-1 rounded border border-purple-200/60 dark:border-purple-800/40">
                    For Families & Students
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    A Simpler Way for Parents to Apply.
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                    Give parents a convenient way to discover participating schools, submit student applications, upload required documents, and follow admission progress online.
                  </p>
                </div>

                {/* Realistic Mini Preview Mockup */}
                <div className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-3.5 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="font-semibold text-slate-800 dark:text-white">My Child's Application</span>
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">
                      Under Review
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Target Class</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">Senior 1 (S.1 Day)</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Uploaded Documents</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">PLE Slip, Birth Cert (2/2)</span>
                  </div>
                </div>

                {/* Key Features List */}
                <div className="space-y-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Key Capabilities</p>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                      <span>Online student registration and applications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                      <span>Student and parent information management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                      <span>Document uploads (PLE slips, IDs, birth certs)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                      <span>Real-time application status tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                      <span>Admission notifications and milestone updates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                      <span>Access to relevant school admission instructions</span>
                    </li>
                  </ul>
                </div>

              </div>

              {/* CTA */}
              <div className="pt-6 mt-6 border-t border-slate-200/60 dark:border-slate-800">
                <button
                  onClick={() => onSelectPortalDemo('parent')}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-[#0000B7] dark:text-purple-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-[#0000B7]/30 dark:border-purple-500/40 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <span>Explore the Parent Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Card B: School Administration Portal */}
          <ScrollReveal delay={150}>
            <div className="group relative h-full bg-[#0000B7]/[0.03] dark:bg-slate-900/80 rounded-2xl border-2 border-[#0000B7]/30 dark:border-[#8B5CF6]/50 hover:border-[#8B5CF6] p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-[#8B5CF6]/15 hover:-translate-y-1">
              <div className="space-y-6">
                
                {/* Header & Icon */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#0000B7]/10 dark:bg-purple-950/60 text-[#0000B7] dark:text-purple-300 flex items-center justify-center shadow-xs">
                    <School className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-[#0000B7] dark:text-purple-300 bg-[#0000B7]/10 dark:bg-purple-950/50 px-2.5 py-1 rounded border border-[#0000B7]/20 dark:border-purple-800/40">
                    For School Admissions Staff
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Admissions Management Made Efficient.
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                    Help schools receive, organise, review, and manage student applications through a centralised digital workspace.
                  </p>
                </div>

                {/* Realistic Mini Preview Mockup */}
                <div className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-3.5 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="font-semibold text-slate-800 dark:text-white">Admissions Queue</span>
                    <span className="text-[11px] font-mono text-[#0000B7] dark:text-purple-300 bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded">
                      142 Pending Review
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Batch Verification</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400 font-mono">84% Verified</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Interview Cohorts</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">3 Batches Scheduled</span>
                  </div>
                </div>

                {/* Key Features List */}
                <div className="space-y-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Key Capabilities</p>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                      <span>School admission dashboard & real-time queue</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                      <span>Application review and verification criteria</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                      <span>Student records and academic aggregate history</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                      <span>Admission status updates & one-click letters</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                      <span>Document management & verification checks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                      <span>Direct SMS/Email communication with parents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                      <span>Application reporting, breakdowns, and summaries</span>
                    </li>
                  </ul>
                </div>

              </div>

              {/* CTA */}
              <div className="pt-6 mt-6 border-t border-slate-200/60 dark:border-slate-800">
                <button
                  onClick={() => onSelectPortalDemo('school')}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <span>Explore the School Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Card C: Top Management Dashboard */}
          <ScrollReveal delay={300}>
            <div className="group relative h-full bg-[#F5F3FF]/30 dark:bg-slate-900/60 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-[#8B5CF6]/50 p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-[#8B5CF6]/10 hover:-translate-y-1">
              <div className="space-y-6">
                
                {/* Header & Icon */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shadow-xs">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded border border-indigo-200/60 dark:border-indigo-800/40">
                    For Boards & Directors
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Clear Insights. Better Decisions.
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                    Give authorised management teams a broader overview of admissions activity, institutional performance, and application trends across participating schools.
                  </p>
                </div>

                {/* Realistic Mini Preview Mockup */}
                <div className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-3.5 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="font-semibold text-slate-800 dark:text-white">Network Overview (8 Schools)</span>
                    <span className="text-[11px] font-mono text-[#0000B7] dark:text-purple-300 bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded">
                      5,840 Total Inflow
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Acceptance Yield</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 font-mono">72.4%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Gender Parity Ratio</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 font-mono">51% F / 49% M</span>
                  </div>
                </div>

                {/* Key Features List */}
                <div className="space-y-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Key Capabilities</p>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <span>Consolidated admissions overview across branches</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <span>School-level application performance summaries</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <span>Intake capacity and admission progress monitoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <span>Demographic trends and performance analytics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <span>Centralised institutional oversight</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <span>Role-based access controls and staff permissions</span>
                    </li>
                  </ul>
                </div>

              </div>

              {/* CTA */}
              <div className="pt-6 mt-6 border-t border-slate-200/60 dark:border-slate-800">
                <button
                  onClick={() => onSelectPortalDemo('management')}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-[#0000B7] dark:text-purple-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-[#0000B7]/30 dark:border-purple-500/40 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <span>Explore Management Features</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
};
