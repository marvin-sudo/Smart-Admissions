import React, { useState } from 'react';
import { 
  School, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface BenefitsSectionProps {
  onOpenRegister: () => void;
  onOpenParentDemo: () => void;
}

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({ 
  onOpenRegister,
  onOpenParentDemo 
}) => {
  const [activeTab, setActiveTab] = useState<'parents' | 'schools' | 'management'>('schools');

  const benefitGroups = {
    parents: {
      id: 'for-parents',
      role: 'For Parents & Guardians',
      title: 'Less Anxiety, Total Clarity on Your Child’s Future',
      subtitle: 'Eliminate long travels, crowded physical queues, and months of silence waiting for school notice boards.',
      points: [
        {
          title: 'Convenient online applications',
          desc: 'Submit student applications anytime, anywhere from your smartphone without traveling across towns.'
        },
        {
          title: 'Less uncertainty during the admission process',
          desc: 'Know exactly where your application stands at every stage with clear, visible status markers.'
        },
        {
          title: 'Clearer communication with schools',
          desc: 'Receive direct SMS and in-app messages regarding interview dates, requirements, and deadlines.'
        },
        {
          title: 'Easier access to application information',
          desc: 'Keep all certificates, academic slips, and official admission letters safely backed up in your digital portal.'
        }
      ],
      image: '/src/assets/images/student_parent_admission_1792051650758.jpg',
      imageAlt: 'African mother and daughter reviewing school admission progress on laptop',
      badge: 'Parent Experience',
      actionText: 'Experience the Parent Flow',
      actionHandler: onOpenParentDemo
    },
    schools: {
      id: 'for-schools',
      role: 'For Schools & Admissions Committees',
      title: 'A Stress-Free, Organized Intake Cycle',
      subtitle: 'Free your academic registrar and admissions committee from thousands of paper folders and manual tallying.',
      points: [
        {
          title: 'A more organised admissions workflow',
          desc: 'Streamline the entire candidate lifecycle from online intake to class list compilation in one system.'
        },
        {
          title: 'Easier application review',
          desc: 'Sort, filter, and score candidates by national exam aggregates, division, and priority criteria in seconds.'
        },
        {
          title: 'Reduced dependence on scattered paper records',
          desc: 'Centralize birth certificates, PLE/UCE slips, and recommendation letters in protected digital archives.'
        },
        {
          title: 'Better visibility into admissions progress',
          desc: 'Track intake quotas by class and stream in real time, preventing accidental under or over-enrolment.'
        }
      ],
      image: '/src/assets/images/school_admin_office_1792051650369.jpg',
      imageAlt: 'School administrator working at an organized admissions desk in Kampala',
      badge: 'School Administration',
      actionText: 'Register Your School',
      actionHandler: onOpenRegister
    },
    management: {
      id: 'for-management',
      role: 'For Top Management & School Boards',
      title: 'Actionable Oversight Across All Institutions',
      subtitle: 'Equip directors, foundation bodies, and diocesan education boards with high-level institutional intelligence.',
      points: [
        {
          title: 'A broader view of admissions activity',
          desc: 'Monitor institutional demand, application spikes, and intake health across multiple schools or campuses.'
        },
        {
          title: 'Better access to summary reports',
          desc: 'Generate audit-ready reports and executive summaries for board meetings with a single click.'
        },
        {
          title: 'More informed administrative decisions',
          desc: 'Leverage historical demographic and academic trends to optimize classroom capacity and resource allocation.'
        },
        {
          title: 'Improved oversight across participating schools',
          desc: 'Ensure compliance with admissions policies, cutoff thresholds, and institutional quotas across branches.'
        }
      ],
      image: '/src/assets/images/african_school_campus_1792051650026.jpg',
      imageAlt: 'Prestigious East African educational institution campus architecture',
      badge: 'Board & Executive Oversight',
      actionText: 'Request Executive Demo',
      actionHandler: onOpenRegister
    }
  };

  const current = benefitGroups[activeTab];

  return (
    <section id="benefits" className="py-20 lg:py-28 bg-[#F5F3FF]/40 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#0000B7] dark:text-purple-300 bg-white dark:bg-slate-900 px-3 py-1 rounded-md border border-[#8B5CF6]/20 dark:border-purple-800/40 shadow-xs">
            Value for Every Stakeholder
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-4 text-balance">
            Benefits Built Specifically for Your Role
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            Whether you are a parent guiding your child, an admissions officer reviewing files, or a board director planning capacity.
          </p>

          {/* Interactive Role Switcher Tabs */}
          <div className="flex items-center justify-center gap-2 mt-8 p-1 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs max-w-md mx-auto">
            {(['schools', 'parents', 'management'] as const).map((tab) => {
              const labels = {
                schools: 'For Schools',
                parents: 'For Parents',
                management: 'For Management'
              };
              const isSelected = activeTab === tab;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#8B5CF6] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Split Layout: Benefits List on Left, Real Imagery / Preview on Right */}
        <ScrollReveal delay={150}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Role Details & Points */}
              <div className="lg:col-span-7 space-y-6">
                
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0000B7] dark:text-purple-300 bg-[#F5F3FF] dark:bg-purple-950/60 px-2.5 py-1 rounded border border-[#8B5CF6]/20 dark:border-purple-800/40">
                    {current.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
                    {current.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {current.subtitle}
                  </p>
                </div>

                {/* Points Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  {current.points.map((pt, idx) => (
                    <div key={idx} className="space-y-1.5 p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0000B7] dark:text-purple-400 shrink-0 mt-0.5" />
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {pt.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                        {pt.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <button
                    onClick={current.actionHandler}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg shadow-sm shadow-[#8B5CF6]/20 transition-all cursor-pointer"
                  >
                    <span>{current.actionText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Right Column: High Quality Authentic Imagery with Fallback */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-md group">
                  <img
                    src={current.image}
                    alt={current.imageAlt}
                    referrerPolicy="no-referrer"
                    className="w-full h-80 sm:h-96 object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.display = 'none';
                    }}
                  />
                  
                  {/* Fallback container if image is hidden */}
                  <div className="hidden only:flex w-full h-80 sm:h-96 bg-gradient-to-br from-[#0000B7]/10 via-[#8B5CF6]/10 to-[#F5F3FF] items-center justify-center p-6 text-center">
                    <div>
                      <School className="w-12 h-12 text-[#0000B7] mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-800">{current.role}</p>
                      <p className="text-xs text-slate-500 mt-1">Smart Admissions Platform</p>
                    </div>
                  </div>

                  {/* Subtle bottom overlay tag */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-3 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-white">{current.role}</span>
                    <span className="text-[11px] font-mono text-[#0000B7] dark:text-purple-400 font-semibold">100% Digital Flow</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
