import React from 'react';
import { GraduationCap, Mail, Phone, MapPin, ArrowUp, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenRegister: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenPrivacy, 
  onOpenTerms,
  onOpenRegister 
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand & Description (spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Footer Logo in White */}
            <a href="#home" className="flex items-center group shrink-0" aria-label="Smart Admissions Home">
              <img 
                src="https://i.postimg.cc/wvwHtwCq/Sm-App-Horizontal-with-tagline.png" 
                alt="Smart Admissions" 
                className="h-14 sm:h-16 md:h-18 w-auto max-w-[240px] sm:max-w-[280px] md:max-w-[320px] object-contain brightness-0 invert opacity-95 transition-opacity group-hover:opacity-100"
                referrerPolicy="no-referrer"
              />
            </a>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              The digital school admissions management platform designed to simplify the admission process for schools, parents, students, and school administrators across Uganda and Africa.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Plot 14 Lumumba Avenue, Nakasero, Kampala, Uganda</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono">support@smartadmissions.ug</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono">+256 700 812 900</span>
              </div>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Platform</p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#home" className="hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#platform-overview" className="hover:text-white transition-colors">Platform Overview</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">Core Features</a>
              </li>
              <li>
                <a href="#dashboard-showcase" className="hover:text-white transition-colors">Dashboard Showcase</a>
              </li>
              <li>
                <a href="#success-stories" className="hover:text-white transition-colors">Success Stories</a>
              </li>
              <li>
                <a href="#trust" className="hover:text-white transition-colors">Trust & Governance</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Parent Resources */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Parent Resources</p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#for-parents" className="hover:text-white transition-colors">Parent Portal Overview</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">Document Checklist Guide</a>
              </li>
              <li>
                <a href="#dashboard-showcase" className="hover:text-white transition-colors">Tracking Your Application</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">Parent FAQ & Help</a>
              </li>
              <li>
                <button 
                  onClick={onOpenRegister}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors cursor-pointer"
                >
                  Apply to a School
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: School Resources */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">School Resources</p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#for-schools" className="hover:text-white transition-colors">School Portal Workspace</a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">UNEB Slip Verification</a>
              </li>
              <li>
                <button 
                  onClick={onOpenRegister}
                  className="text-white hover:text-purple-300 font-semibold transition-colors cursor-pointer text-left"
                >
                  Register Your School
                </button>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">Request Staff Training</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">Kampala Desk Support</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-14 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <p>© {new Date().getFullYear()} Smart Admissions. All rights reserved.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Empowering smarter school admissions across Uganda and East Africa.</p>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={onOpenPrivacy}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button 
              onClick={onOpenTerms}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Top</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
