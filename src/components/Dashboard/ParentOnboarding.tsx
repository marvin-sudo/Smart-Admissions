import React, { useState } from 'react';
import { Users, GraduationCap, CheckCircle2, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmissionsData } from '../../context/AdmissionsDataContext';

export const ParentOnboarding: React.FC = () => {
  const { currentUser, completeOnboarding } = useAuth();
  const { addChild } = useAdmissionsData();

  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [district, setDistrict] = useState('Kampala');
  const [childName, setChildName] = useState('');
  const [childGender, setChildGender] = useState<'Male' | 'Female'>('Male');
  const [gradeLevel, setGradeLevel] = useState('Senior 1 (S.1)');
  const [pleAggregate, setPleAggregate] = useState('4 Aggregates (Div 1)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);

    if (childName.trim()) {
      await addChild({
        parentId: currentUser.id,
        name: childName.trim(),
        gender: childGender,
        dateOfBirth: '2013-05-15',
        gradeApplyingFor: gradeLevel,
        pleAggregate: pleAggregate.trim() || undefined
      });
    }

    completeOnboarding({ phone });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <img 
          src="https://i.postimg.cc/wvwHtwCq/Sm-App-Horizontal-with-tagline.png" 
          alt="Smart Admissions" 
          className="h-12 w-auto mx-auto object-contain dark:brightness-110"
        />
        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] dark:text-purple-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Parent Portal Onboarding</span>
        </div>
        <h2 className="mt-3 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Welcome, {currentUser?.name || 'Parent'}!
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Set up your family profile to personalize school suggestions and start applying
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white dark:bg-[#111827] py-8 px-6 sm:px-10 shadow-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl">
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                1. Parent Contact Details
              </h3>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+256 700 000000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred District
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
                  >
                    <option value="Kampala">Kampala</option>
                    <option value="Wakiso">Wakiso</option>
                    <option value="Mukono">Mukono</option>
                    <option value="Jinja">Jinja</option>
                    <option value="Mbarara">Mbarara</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                2. Register Your Child
              </h3>
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Child's Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="e.g. Samuel Mugisha"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Gender
                    </label>
                    <select
                      value={childGender}
                      onChange={(e) => setChildGender(e.target.value as 'Male' | 'Female')}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Applying Grade
                    </label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
                    >
                      <option value="Senior 1 (S.1)">Senior 1 (S.1)</option>
                      <option value="Senior 2 (S.2)">Senior 2 (S.2)</option>
                      <option value="Senior 5 (S.5)">Senior 5 (S.5)</option>
                      <option value="Primary 1 (P.1)">Primary 1 (P.1)</option>
                      <option value="Primary 5 (P.5)">Primary 5 (P.5)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      PLE / Results
                    </label>
                    <input
                      type="text"
                      value={pleAggregate}
                      onChange={(e) => setPleAggregate(e.target.value)}
                      placeholder="e.g. 4 Aggregates"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#6C3EF4] hover:bg-[#5B2FE3] shadow-md transition-all cursor-pointer"
              >
                <span>{isSubmitting ? 'Saving Profile...' : 'Complete Onboarding & Enter Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
