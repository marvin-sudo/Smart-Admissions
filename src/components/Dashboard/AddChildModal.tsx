import React, { useState } from 'react';
import { X, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmissionsData } from '../../context/AdmissionsDataContext';

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddChildModal: React.FC<AddChildModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentUser } = useAuth();
  const { addChild } = useAdmissionsData();

  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [dateOfBirth, setDateOfBirth] = useState('2013-05-15');
  const [gradeApplyingFor, setGradeApplyingFor] = useState('Senior 1 (S.1)');
  const [currentSchool, setCurrentSchool] = useState('');
  const [pleAggregate, setPleAggregate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);

    await addChild({
      parentId: currentUser.id,
      name: name.trim(),
      gender,
      dateOfBirth,
      gradeApplyingFor,
      currentSchool: currentSchool.trim() || undefined,
      pleAggregate: pleAggregate.trim() || undefined,
      notes: notes.trim() || undefined
    });

    setIsSaving(false);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setName('');
      setCurrentSchool('');
      setPleAggregate('');
      setNotes('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Child Added to Family!
            </h3>
            <p className="text-xs text-slate-500">
              You can now submit applications and track admissions for {name}.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Add Child to Profile
                </h3>
                <p className="text-xs text-slate-500">
                  Register student details to easily apply to multiple schools
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Child's Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Samuel Mugisha"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Class / Grade
                  </label>
                  <select
                    value={gradeApplyingFor}
                    onChange={(e) => setGradeApplyingFor(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
                  >
                    <option value="Senior 1 (S.1)">Senior 1 (S.1)</option>
                    <option value="Senior 2 (S.2)">Senior 2 (S.2)</option>
                    <option value="Senior 5 (S.5)">Senior 5 (S.5)</option>
                    <option value="Primary 1 (P.1)">Primary 1 (P.1)</option>
                    <option value="Primary 5 (P.5)">Primary 5 (P.5)</option>
                    <option value="Kindergarten">Kindergarten</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    PLE / Exam Aggregates
                  </label>
                  <input
                    type="text"
                    value={pleAggregate}
                    onChange={(e) => setPleAggregate(e.target.value)}
                    placeholder="e.g. 5 Aggregates"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current School
                </label>
                <input
                  type="text"
                  value={currentSchool}
                  onChange={(e) => setCurrentSchool(e.target.value)}
                  placeholder="e.g. Kampala Junior Academy"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#6C3EF4] hover:bg-[#5B2FE3] rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Add Child'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
