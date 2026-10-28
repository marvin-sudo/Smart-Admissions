import React from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  FileLock2, 
  UserCheck, 
  Headphones, 
  Database
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const TrustSection: React.FC = () => {
  const pillars = [
    {
      title: 'Role-Based Access',
      desc: 'Ensure school registrars, headteachers, bursars, and directors access only the data and administrative tools relevant to their specific institutional role.',
      icon: UserCheck
    },
    {
      title: 'Organised Student Information',
      desc: 'Applicant records, contact details, and academic history are structured methodically to maintain student confidentiality and reduce administrative mishandling.',
      icon: Database
    },
    {
      title: 'Controlled Access to Administrative Functions',
      desc: 'Critical actions such as approving admissions, issuing acceptance letters, or altering class capacity limits require authorized staff verification.',
      icon: KeyRound
    },
    {
      title: 'Secure Handling of Application Documents',
      desc: 'National examination slips, birth certificates, and identity files are held in secure cloud storage with restricted download permissions.',
      icon: FileLock2
    },
    {
      title: 'Responsive Support for Admissions Workflows',
      desc: 'Dedicated technical and operational assistance is readily available to help schools and parents navigate each stage of the application cycle smoothly.',
      icon: Headphones
    }
  ];

  return (
    <section id="trust" className="py-20 lg:py-28 bg-[#F5F3FF]/40 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#0000B7] dark:text-purple-300 bg-white dark:bg-slate-900 px-3 py-1 rounded-md border border-[#8B5CF6]/20 dark:border-purple-800/40 shadow-xs">
            Responsible Governance & Data Integrity
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-4 text-balance">
            Built for Organised, Responsible Admissions.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
            Smart Admissions is designed to help institutions manage admissions information through structured workflows and appropriate access controls.
          </p>
        </ScrollReveal>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={idx} delay={(idx % 3) * 100}>
                <div 
                  className="h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs hover:border-[#8B5CF6]/40 transition-all duration-200"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#F5F3FF] dark:bg-purple-950/60 text-[#0000B7] dark:text-purple-300 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}

          {/* Verification Principle Card */}
          <ScrollReveal delay={200}>
            <div className="h-full bg-gradient-to-br from-[#0000B7] to-[#8B5CF6] text-white rounded-2xl p-6 sm:p-7 shadow-md flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-white/15 text-white flex items-center justify-center mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold mb-2">
                  Designed for Educational Institutions
                </h3>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  We prioritize transparent workflows, traceable record-keeping, and respectful handling of families' personal information during every intake cycle.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/20 text-[11px] text-white/80">
                Protected by structured access policies
              </div>
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
};
