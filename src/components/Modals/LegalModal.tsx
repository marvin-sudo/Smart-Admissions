import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2 mb-1.5">
            {type === 'privacy' ? (
              <ShieldCheck className="w-5 h-5 text-[#8B5CF6]" />
            ) : (
              <FileText className="w-5 h-5 text-[#8B5CF6]" />
            )}
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Smart Admissions Legal Terms
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {type === 'privacy' ? 'Platform Privacy Policy' : 'Terms of Service'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Last updated: October 2026 · Governing school and student data across Uganda and East Africa
          </p>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {type === 'privacy' ? (
            <>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">1. Collection of Educational Information</h4>
              <p>
                Smart Admissions collects student identifying records (names, birth certificate details, PLE/UCE examination indices and aggregates) and guardian contact details exclusively for processing institutional applications to registered partner schools.
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">2. Use of Information</h4>
              <p>
                Candidate data is made available solely to the authorized admissions committees, registrars, and headteachers of schools to which the parent has explicitly submitted an application. We do not sell, rent, or trade applicant or family personal data to third-party commercial marketing entities.
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">3. Document Security & Access Controls</h4>
              <p>
                All academic result slips and official identification files uploaded through the portal are stored in secure cloud environments with role-based cryptographic access policies, ensuring that only designated school admissions personnel can access verified files.
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">4. Data Retention and Parental Rights</h4>
              <p>
                Parents and legal guardians maintain the right to review their active submissions, update contact details, or request archival upon the conclusion of the academic admission intake season.
              </p>
            </>
          ) : (
            <>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">1. Terms of Educational Access</h4>
              <p>
                Smart Admissions operates as a digital admissions management bridge between applicants and registered educational institutions. Admission decisions, cut-off thresholds, and school-specific criteria remain under the sovereign authority of each school’s board and admissions committee.
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">2. Authenticity of Submitted Academic Records</h4>
              <p>
                Parents and students agree that all submitted examination results, PLE slips, testimonials, and identity credentials are true, accurate, and unedited. Submission of falsified documentation may result in immediate disqualification by the recipient school.
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">3. School Obligations</h4>
              <p>
                Participating schools agree to manage candidate records responsibly, provide timely status updates through the platform, and protect student confidentiality in accordance with national education standards.
              </p>
            </>
          )}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
