import React, { useState } from 'react';
import { 
  FileCheck2, 
  FolderLock, 
  Milestone, 
  FileSpreadsheet, 
  BellRing, 
  TrendingUp, 
  Check, 
  ChevronDown
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const FeaturesGrid: React.FC = () => {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number | null>(null);

  const features = [
    {
      title: 'Online Applications',
      tagline: 'Simplify student registration & submission',
      description: 'Replace cumbersome manual paper queues with guided, accessible digital admission forms customized to each school’s intake requirements and entry grades.',
      icon: FileCheck2,
      status: 'Fully Available',
      details: [
        'Dynamic form fields for PLE/UCE aggregates and academic history',
        'Multi-child profiles for parents with multiple school-age students',
        'Intake fee options and instant submission confirmation receipts'
      ]
    },
    {
      title: 'Centralised Records',
      tagline: 'Organised info in one workspace',
      description: 'Maintain secure, searchable digital applicant archives. Eliminate lost paper files and ensure authorized staff can retrieve student background information in seconds.',
      icon: FolderLock,
      status: 'Fully Available',
      details: [
        'Structured candidate profiles with full academic documentation',
        'Staff activity audit trails and verification timestamps',
        'Exportable class lists and cohort registers in CSV/PDF'
      ]
    },
    {
      title: 'Application Tracking',
      tagline: 'Follow progress through clear statuses',
      description: 'Provide end-to-end transparency with structured status milestones: Received, In Verification, Shortlisted, Interview Scheduled, and Admitted.',
      icon: Milestone,
      status: 'Fully Available',
      details: [
        'Live parent-facing milestone progress tracker',
        'Transparent admissions criteria and checklist requirements',
        'Automated next-step instructions at each decision stage'
      ]
    },
    {
      title: 'Document Management',
      tagline: 'Secure document collection & verification',
      description: 'Collect, review, and organise mandatory admission credentials including UNEB examination slips, birth certificates, immunization records, and passport photos.',
      icon: FileSpreadsheet,
      status: 'Fully Available',
      details: [
        'High-resolution PDF, JPEG, and PNG document uploads',
        'Built-in verification flags for admissions committee reviews',
        'Secure document access restricted to authorized admissions staff'
      ]
    },
    {
      title: 'Notifications and Updates',
      tagline: 'Real-time parent & school communication',
      description: 'Keep families and staff in continuous sync with automated SMS alerts and email updates whenever an application status changes or documents require attention.',
      icon: BellRing,
      status: 'Fully Available',
      details: [
        'Automated SMS notifications sent to guardian phone numbers',
        'Interview appointment reminders with location and time details',
        'Direct inquiry messaging between parent and school registrar'
      ]
    },
    {
      title: 'Reports and Analytics',
      tagline: 'Application volumes & admission trends',
      description: 'Empower headteachers, bursars, and boards with real-time insight into application volume, gender ratios, regional distribution, and capacity fill rates.',
      icon: TrendingUp,
      status: 'Fully Available',
      details: [
        'Real-time intake conversion metrics and aggregate breakdowns',
        'Comparative cohort trends across academic terms and intake years',
        'Executive summaries tailored for board and diocesan meetings'
      ]
    }
  ];

  return (
    <section id="features" className="py-20 lg:py-28 bg-white dark:bg-[#0B0F19] border-t border-slate-100 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#0000B7] dark:text-purple-300 bg-[#F5F3FF] dark:bg-purple-950/40 px-3 py-1 rounded-md border border-[#8B5CF6]/20 dark:border-purple-800/40">
            Core Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-4 text-balance">
            Everything You Need for a Better Admissions Experience.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
            Engineered specifically to solve the logistical challenges of school admissions across East Africa.
          </p>
        </ScrollReveal>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const isExpanded = activeFeatureIndex === idx;

            return (
              <ScrollReveal key={feature.title} delay={(idx % 3) * 100}>
                <div
                  className="group h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-[#8B5CF6]/50 dark:hover:border-[#8B5CF6]/50 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:shadow-[#8B5CF6]/10"
                >
                  <div>
                    {/* Top Header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-[#F5F3FF] dark:bg-purple-950/60 text-[#0000B7] dark:text-purple-300 flex items-center justify-center transition-colors group-hover:bg-[#8B5CF6] group-hover:text-white group-hover:shadow-sm">
                        <Icon className="w-6 h-6" strokeWidth={1.8} />
                      </div>
                      <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        Feature 0{idx + 1}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#8B5CF6] dark:group-hover:text-purple-400 transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-xs font-semibold text-[#8B5CF6] dark:text-purple-400 mt-1 mb-2.5">
                      {feature.tagline}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Toggleable Details for Deeper Exploration */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">Included capabilities:</p>
                        {feature.details.map((item, dIdx) => (
                          <div key={dIdx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Action */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => setActiveFeatureIndex(isExpanded ? null : idx)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B5CF6] dark:text-purple-400 hover:text-[#7C3AED] dark:hover:text-purple-300 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide details' : 'Explore capabilities'}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded font-medium border border-emerald-200/50 dark:border-emerald-800/40">
                      {feature.status}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};
