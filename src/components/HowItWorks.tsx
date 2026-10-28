import React, { useState } from 'react';
import { 
  Search, 
  FileEdit, 
  ClipboardCheck, 
  BellRing, 
  Check
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      number: '01',
      title: 'Discover',
      tagline: 'School Search & Entry Requirements',
      shortDesc: 'Parents identify a school and review its admission requirements.',
      fullDesc: 'Families explore verified school profiles, entry cut-off aggregates (e.g. UNEB PLE or UCE requirements), tuition structures, day vs boarding options, and specific intake dates.',
      icon: Search,
      badge: 'Step 1: Discovery',
      highlightItem: 'Requirement checklists: academic cutoffs, intake dates, and fees',
      actor: 'Parents & Students'
    },
    {
      number: '02',
      title: 'Apply',
      tagline: 'Digital Submissions & Document Uploads',
      shortDesc: 'Parents complete the online application and submit the required information.',
      fullDesc: 'Guided online forms capture student bio-data, academic records, guardian contacts, and high-resolution document uploads such as PLE result slips and birth certificates.',
      icon: FileEdit,
      badge: 'Step 2: Application',
      highlightItem: 'Mobile-friendly form with autosave and instant confirmation ID',
      actor: 'Parents'
    },
    {
      number: '03',
      title: 'Review',
      tagline: 'Committee Evaluation & Verification',
      shortDesc: 'The school admissions team reviews applications and updates their status.',
      fullDesc: 'School admissions officers verify academic credentials against national examination guidelines, grade candidate files, and collaborate on interview or admission shortlists.',
      icon: ClipboardCheck,
      badge: 'Step 3: Evaluation',
      highlightItem: 'Batch review dashboard with audit logs and interview scheduler',
      actor: 'School Admissions Team'
    },
    {
      number: '04',
      title: 'Track and Respond',
      tagline: 'Milestone Tracking & Official Decision',
      shortDesc: 'Parents receive updates and follow the admission process through the platform.',
      fullDesc: 'Parents monitor live milestones, receive instant SMS notifications on status changes, download official digital admission letters, and confirm their enrollment choice.',
      icon: BellRing,
      badge: 'Step 4: Decision & Enrolment',
      highlightItem: 'Instant SMS & email alerts with downloadable admission packets',
      actor: 'Parents & Schools'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-[#F5F3FF]/40 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#0000B7] dark:text-purple-300 bg-white dark:bg-slate-900 px-3 py-1 rounded-md border border-[#8B5CF6]/20 dark:border-purple-800/40 shadow-xs">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-4 text-balance">
            How Smart Admissions Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            From initial school discovery to the official admission decision, our structured flow keeps every stakeholder aligned.
          </p>
        </ScrollReveal>

        {/* Desktop Horizontal Process with Connecting Lines */}
        <div className="relative">
          
          {/* Connecting line behind desktop circles */}
          <div className="hidden lg:block absolute top-1/2 -translate-y-8 left-[10%] right-[10%] h-0.5 bg-slate-200 dark:bg-slate-800 z-0" />

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStep === idx + 1;

              return (
                <ScrollReveal key={step.number} delay={idx * 100}>
                  <div
                    onClick={() => setActiveStep(idx + 1)}
                    className={`h-full rounded-2xl p-6 border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 border-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/15 ring-2 ring-[#8B5CF6]/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md'
                    }`}
                  >
                    <div>
                      {/* Step Number & Icon */}
                      <div className="flex items-center justify-between mb-5">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#8B5CF6] text-white shadow-sm shadow-[#8B5CF6]/30'
                            : 'bg-[#F5F3FF] dark:bg-purple-950/60 text-[#0000B7] dark:text-purple-300'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-2xl font-black font-mono tabular-nums ${
                          isSelected ? 'text-[#8B5CF6]' : 'text-slate-300 dark:text-slate-700'
                        }`}>
                          {step.number}
                        </span>
                      </div>

                      <div className="mb-2">
                        <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded">
                          {step.actor}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                        {step.title}
                      </h3>
                      
                      <p className="text-xs font-medium text-[#0000B7] dark:text-[#A78BFA] mb-2.5">
                        {step.tagline}
                      </p>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {step.shortDesc}
                      </p>
                    </div>

                    {/* Active Step Indicator Pill */}
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {isSelected ? 'Currently Viewing' : 'Click to inspect'}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#8B5CF6]' : 'bg-slate-300 dark:bg-slate-700'}`} />
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

        </div>

        {/* Active Step Detail Callout Box */}
        <ScrollReveal delay={200} className="mt-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0000B7] dark:text-purple-300 bg-[#F5F3FF] dark:bg-purple-950/50 px-2.5 py-0.5 rounded border border-[#8B5CF6]/20 dark:border-purple-800/40">
                  Deep Dive: Step {activeStep} — {steps[activeStep - 1].title}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{steps[activeStep - 1].actor}</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {steps[activeStep - 1].tagline}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {steps[activeStep - 1].fullDesc}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl p-4 shrink-0 w-full md:w-auto">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Key Feature Highlight:</p>
              <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{steps[activeStep - 1].highlightItem}</span>
              </p>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
