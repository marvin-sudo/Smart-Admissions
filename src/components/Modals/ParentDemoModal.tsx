import React, { useState } from 'react';
import { 
  X, 
  Users, 
  CheckCircle2, 
  FileText, 
  ArrowRight
} from 'lucide-react';
import { SCHOOL_PARTNERS } from '../../data/mockData';

interface ParentDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ParentDemoModal: React.FC<ParentDemoModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<number>(1);
  const [studentName, setStudentName] = useState('Trevor Mugisha');
  const [selectedSchool, setSelectedSchool] = useState('St. Mary’s College Kisubi');
  const [gradeLevel, setGradeLevel] = useState('Senior 1 (S.1)');
  const [pleAggregates, setPleAggregates] = useState('4 Aggregates (Div 1)');
  const [uploadedFile] = useState<string | null>('UNEB_PLE_Slip_2025_004.pdf');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-[#F5F3FF]/40 dark:bg-slate-950/60">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#8B5CF6] text-white flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#8B5CF6] dark:text-purple-300 uppercase tracking-wider">
              Parent Portal Interactive Demo
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Simulate Student Application
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            See how easily parents submit admissions documents and track admission progress in real time.
          </p>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Student Full Name
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Participating School
                </label>
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6] cursor-pointer"
                >
                  {SCHOOL_PARTNERS.map((sch) => (
                    <option key={sch} value={sch} className="dark:bg-slate-800">{sch}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Entry Class
                  </label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6] cursor-pointer"
                  >
                    <option value="Senior 1 (S.1)" className="dark:bg-slate-800">Senior 1 (S.1)</option>
                    <option value="Senior 5 (S.5)" className="dark:bg-slate-800">Senior 5 (S.5)</option>
                    <option value="Primary 1 (P.1)" className="dark:bg-slate-800">Primary 1 (P.1)</option>
                    <option value="Nursery" className="dark:bg-slate-800">Nursery / Baby Class</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    UNEB Exam Results
                  </label>
                  <input
                    type="text"
                    value={pleAggregates}
                    onChange={(e) => setPleAggregates(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              {/* Upload simulation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Required Document Upload (PLE Result Slip)
                </label>
                <div className="p-3.5 border-2 border-dashed border-purple-200 dark:border-purple-900/60 rounded-xl bg-purple-50/40 dark:bg-purple-950/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#8B5CF6]" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">{uploadedFile}</span>
                  </div>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded text-[10px] border border-emerald-200/50 dark:border-emerald-800/50">
                    Attached
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-semibold text-white bg-[#8B5CF6] hover:bg-[#7c4deb] rounded-lg transition-colors cursor-pointer"
                >
                  <span>Submit Simulated Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Application #ADM-2026-9042 Created!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Submitted directly to {selectedSchool} Admissions Office</p>
              </div>

              {/* Live Tracking View */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Applicant:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{studentName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Class & Scores:</span>
                  <span className="text-slate-800 dark:text-slate-200">{gradeLevel} · {pleAggregates}</span>
                </div>

                {/* Status Bar */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-600 dark:text-slate-400">Admission Progress</span>
                    <span className="text-[#8B5CF6] dark:text-purple-300 font-semibold">Stage 1 of 4: Received</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-[#8B5CF6] h-2 rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200/60 dark:border-purple-900/60 text-xs text-slate-700 dark:text-slate-300">
                <p className="font-semibold text-[#8B5CF6] dark:text-purple-300 mb-0.5">What happens next?</p>
                <p>The parent receives an immediate confirmation SMS. When the school admissions committee verifies the PLE slip or schedules an oral interview, an update appears automatically in this view.</p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Restart Demo
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
