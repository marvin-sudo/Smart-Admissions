import React, { useState } from 'react';
import { X, CheckCircle2, GraduationCap, School, FileText, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmissionsData } from '../../context/AdmissionsDataContext';
import { SchoolRecord } from '../../types/admissions';

interface QuickApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSchool: SchoolRecord | null;
}

export const QuickApplyModal: React.FC<QuickApplyModalProps> = ({
  isOpen,
  onClose,
  selectedSchool
}) => {
  const { currentUser } = useAuth();
  const { children, submitApplication } = useAdmissionsData();

  const [selectedChildId, setSelectedChildId] = useState<string>(children[0]?.id || '');
  const [customStudentName, setCustomStudentName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('Senior 1 (S.1)');
  const [pleAggregate, setPleAggregate] = useState('4 Aggregates (Div 1)');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !selectedSchool) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);

    const childObj = children.find(c => c.id === selectedChildId);
    const studentName = childObj ? childObj.name : (customStudentName || 'Prospective Student');

    await submitApplication({
      childId: selectedChildId || `ch-adhoc-${Date.now()}`,
      studentName,
      parentId: currentUser.id,
      parentName: currentUser.name,
      parentEmail: currentUser.email,
      parentPhone: currentUser.phone,
      schoolId: selectedSchool.id,
      gradeLevel,
      pleAggregate,
      notes: notes || 'Official online intake submission via Smart Admissions.'
    });

    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Application Submitted!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Your application has been received by <strong className="text-slate-900 dark:text-white">{selectedSchool.name}</strong>. The admissions committee has been notified.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Apply for Admission
                </h3>
                <p className="text-xs text-[#6C3EF4] dark:text-purple-400 font-semibold truncate">
                  {selectedSchool.name} · {selectedSchool.location}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Select Child */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Child
                </label>
                {children.length > 0 ? (
                  <select
                    value={selectedChildId}
                    onChange={(e) => setSelectedChildId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
                  >
                    {children.map((child) => (
                      <option key={child.id} value={child.id}>
                        {child.name} ({child.gradeApplyingFor})
                      </option>
                    ))}
                    <option value="">Other / New Student</option>
                  </select>
                ) : null}

                {(!children.length || selectedChildId === '') && (
                  <input
                    type="text"
                    required
                    value={customStudentName}
                    onChange={(e) => setCustomStudentName(e.target.value)}
                    placeholder="Enter student full name"
                    className="mt-2 w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
                  />
                )}
              </div>

              {/* Grade Applying For */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Class Applying For
                  </label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
                  >
                    <option value="Senior 1 (S.1)">Senior 1 (S.1)</option>
                    <option value="Senior 2 (S.2)">Senior 2 (S.2)</option>
                    <option value="Senior 3 (S.3)">Senior 3 (S.3)</option>
                    <option value="Senior 5 (S.5)">Senior 5 (S.5)</option>
                    <option value="Primary 1 (P.1)">Primary 1 (P.1)</option>
                    <option value="Primary 5 (P.5)">Primary 5 (P.5)</option>
                    <option value="Nursery / Kindergarten">Nursery / Kindergarten</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Academic Result / PLE
                  </label>
                  <input
                    type="text"
                    value={pleAggregate}
                    onChange={(e) => setPleAggregate(e.target.value)}
                    placeholder="e.g. 4 Aggregates (Div 1)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
                  />
                </div>
              </div>

              {/* Notes / Special Instructions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Supporting Notes or Extracurriculars
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Mention academic achievements, talents in robotics, sports, music, or boarding preferences..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#6C3EF4] hover:bg-[#5B2FE3] rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
