import React from 'react';
import { Sparkles, ArrowRight, Compass, ShieldCheck, GraduationCap, Building2, BarChart2 } from 'lucide-react';

interface HeroBannerProps {
  badge?: string;
  headline: string;
  description: string;
  primaryCtaText: string;
  onPrimaryCta: () => void;
  secondaryCtaText?: string;
  onSecondaryCta?: () => void;
  iconType?: 'parent' | 'school' | 'admin';
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  badge = 'Unified Admissions Ecosystem',
  headline,
  description,
  primaryCtaText,
  onPrimaryCta,
  secondaryCtaText,
  onSecondaryCta,
  iconType = 'parent'
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6C3EF4] via-[#7B4CF6] to-[#8B5CF6] text-white p-6 sm:p-8 lg:p-10 shadow-lg shadow-purple-500/15 mb-8">
      {/* Decorative Geometric Ambient Background Elements */}
      <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute right-1/4 -bottom-20 w-64 h-64 rounded-full bg-indigo-900/30 blur-2xl pointer-events-none" />
      
      {/* Subtle Abstract Architectural SVG Pattern on the Right */}
      <div className="absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 opacity-15 hidden md:block pointer-events-none">
        <svg width="220" height="220" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="2" strokeDasharray="6 6" />
          <circle cx="100" cy="100" r="50" stroke="white" strokeWidth="3" />
          <path d="M100 20 L100 180 M20 100 L180 100" stroke="white" strokeWidth="1.5" />
          <rect x="70" y="70" width="60" height="60" rx="12" stroke="white" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative z-10 max-w-2xl">
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-purple-100 text-xs font-semibold tracking-wide mb-4 border border-white/20">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>{badge}</span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white text-balance">
          {headline}
        </h1>

        {/* Description */}
        <p className="mt-3 text-sm sm:text-base text-purple-100/90 leading-relaxed max-w-xl">
          {description}
        </p>

        {/* CTAs */}
        <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3">
          <button
            onClick={onPrimaryCta}
            className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white text-[#6C3EF4] hover:bg-purple-50 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all transform active:scale-95 cursor-pointer"
          >
            <span>{primaryCtaText}</span>
            <ArrowRight className="w-4 h-4 text-[#6C3EF4]" />
          </button>

          {secondaryCtaText && onSecondaryCta && (
            <button
              onClick={onSecondaryCta}
              className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold border border-white/20 backdrop-blur-xs transition-all cursor-pointer"
            >
              <span>{secondaryCtaText}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
