import React from 'react';
import { 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  School, 
  Users, 
  BarChart3
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface HeroSectionProps {
  onGetStarted: () => void;
  onExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted, onExplore }) => {
  return (
    <section id="home" className="relative pt-8 pb-20 lg:pt-16 lg:pb-28 overflow-hidden bg-gradient-to-b from-white via-[#F5F3FF]/40 to-white dark:from-[#0B0F19] dark:via-slate-900/60 dark:to-[#0B0F19] transition-colors duration-200">
      {/* Background ambient lighting subtle glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/15 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-[#0000B7]/5 dark:bg-[#8B5CF6]/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Value Proposition, and CTAs */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            
            {/* Introductory Badge & Headline */}
            <ScrollReveal delay={0}>
              <div className="inline-flex items-center gap-2 self-start px-3 py-1 text-xs font-semibold tracking-wider text-[#0000B7] dark:text-purple-300 uppercase bg-[#F5F3FF] dark:bg-purple-950/40 border border-[#8B5CF6]/20 dark:border-purple-800/40 rounded-md mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0000B7] dark:bg-purple-400" />
                SMARTER SCHOOL ADMISSIONS
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12] text-balance">
                School Admissions, <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#0000B7] via-[#5B30DE] to-[#8B5CF6] dark:from-[#8B5CF6] dark:via-[#A78BFA] dark:to-white bg-clip-text text-transparent">
                  Made Simple.
                </span>
              </h1>
            </ScrollReveal>

            {/* Supporting Text */}
            <ScrollReveal delay={100}>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Smart Admissions brings schools, parents, and administrators together through one intelligent platform that makes applications easier, admissions more transparent, and school management more efficient.
              </p>
            </ScrollReveal>

            {/* CTAs */}
            <ScrollReveal delay={200}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  onClick={onGetStarted}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg shadow-md shadow-[#8B5CF6]/25 hover:shadow-lg hover:shadow-[#8B5CF6]/30 transition-all cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <a
                  href="#platform-overview"
                  onClick={onExplore}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 rounded-lg transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-xs cursor-pointer"
                >
                  <span>Explore the Platform</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                </a>
              </div>
            </ScrollReveal>

            {/* Short Trust Statement & Endorsement */}
            <ScrollReveal delay={300}>
              <div className="pt-2 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-[#0000B7] dark:text-[#8B5CF6] shrink-0" />
                <span>One platform. Three experiences. A smarter admissions journey.</span>
              </div>

              <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 mt-4">
                <p className="text-xs font-semibold tracking-wide uppercase text-slate-400 dark:text-slate-500 mb-2.5">
                  Supporting schools & parents across East Africa
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <span>UNEB & Cambridge Curriculums</span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span>Mobile-Optimised Submissions</span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span>Direct Document Verification</span>
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Right Column: Hero Visual Asset (Clean Photographic & Experience Showcase) */}
          <div className="lg:col-span-6 relative">
            <ScrollReveal delay={150}>
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 group">
                
                {/* Campus Photography */}
                <div className="relative h-80 sm:h-[420px] overflow-hidden">
                  <img
                    src="/src/assets/images/african_school_campus_1792051650026.jpg"
                    alt="Modern African school campus and academic community in Kampala Uganda"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.display = 'none';
                    }}
                  />

                  {/* Scrim overlay at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-xs font-semibold text-[#0000B7] dark:text-purple-300 border border-white/40 dark:border-slate-800 shadow-xs">
                    <School className="w-3.5 h-3.5 text-[#0000B7] dark:text-purple-400" />
                    <span>Uganda & East Africa School Network</span>
                  </div>

                  {/* Floating Bottom Card Over Image */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-4 border border-white/60 dark:border-slate-800 shadow-lg text-xs space-y-2.5">
                    <div className="flex items-center justify-between text-slate-800 dark:text-white">
                      <span className="font-bold text-sm">Unified Digital Admissions</span>
                      <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/50">
                        Active Network
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
                        <span className="truncate">Parent Portal</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <School className="w-3.5 h-3.5 text-[#0000B7] dark:text-purple-400 shrink-0" />
                        <span className="truncate">School Portal</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span className="truncate">Board Oversight</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
};
