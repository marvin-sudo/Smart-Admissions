import React from 'react';
import { ArrowRight, School, Sparkles, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface CtaSectionProps {
  onGetStarted: () => void;
  onRegisterSchool: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ 
  onGetStarted, 
  onRegisterSchool 
}) => {
  return (
    <section className="py-20 lg:py-24 bg-white dark:bg-[#0B0F19] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner with royal-blue-to-purple gradient */}
        <ScrollReveal>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0000B7] via-[#4323D4] to-[#8B5CF6] text-white p-8 sm:p-12 lg:p-16 shadow-2xl shadow-[#0000B7]/25">
            
            {/* Subtle background circular lights */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#8B5CF6]/30 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white/90 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Digital Transformation for African Education</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight text-balance">
                Make Your Next Admissions Cycle Smarter.
              </h2>

              <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
                Bring parents, schools, and administrators into one connected admissions experience.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm sm:text-base font-bold text-[#8B5CF6] bg-white hover:bg-slate-50 rounded-xl shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 text-[#8B5CF6]" />
                </button>

                <button
                  onClick={onRegisterSchool}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl backdrop-blur-sm transition-all cursor-pointer"
                >
                  <School className="w-4 h-4" />
                  <span>Register Your School</span>
                </button>
              </div>

              {/* Supporting Line */}
              <div className="pt-2 text-xs sm:text-sm text-white/80 font-medium">
                Start building a simpler, more organised admissions journey.
              </div>

              {/* Trust points */}
              <div className="pt-6 border-t border-white/20 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/80">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  Seamless Onboarding
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  Role-Based Security
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  Dedicated Regional Support
                </span>
              </div>

            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
