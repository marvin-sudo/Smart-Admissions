import React, { useState } from 'react';
import { School, Building2, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmissionsData } from '../../context/AdmissionsDataContext';

export const SchoolOnboarding: React.FC = () => {
  const { currentUser, completeOnboarding } = useAuth();
  const { registerNewSchoolInDb } = useAdmissionsData();

  const [schoolName, setSchoolName] = useState(currentUser?.schoolName || '');
  const [district, setDistrict] = useState('Wakiso');
  const [schoolType, setSchoolType] = useState<'Day' | 'Boarding' | 'Day & Boarding'>('Boarding');
  const [level, setLevel] = useState<'Nursery' | 'Primary' | 'Secondary (O & A Level)' | 'Tertiary / Vocational'>('Secondary (O & A Level)');
  const [phone, setPhone] = useState(currentUser?.phone || '+256 414 000000');
  const [intakeCapacity, setIntakeCapacity] = useState('250');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);

    const createdSchool = await registerNewSchoolInDb({
      name: schoolName.trim(),
      type: schoolType,
      level,
      district,
      contactPerson: currentUser.name,
      contactEmail: currentUser.email,
      contactPhone: phone,
      description: description.trim() || undefined
    });

    completeOnboarding({
      schoolId: createdSchool.id,
      schoolName: createdSchool.name,
      schoolVerificationStatus: 'pending'
    });

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
          <Building2 className="w-3.5 h-3.5" />
          <span>School Control Center Setup</span>
        </div>
        <h2 className="mt-3 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Register Your Institution
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Provide foundational details to initiate MoES audit and activate your admissions workspace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white dark:bg-[#111827] py-8 px-6 sm:px-10 shadow-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl">
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official School Name
              </label>
              <input
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="e.g. Seeta High School Green Campus"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  District / Location
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  School Type
                </label>
                <select
                  value={schoolType}
                  onChange={(e) => setSchoolType(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
                >
                  <option value="Boarding">Boarding Only</option>
                  <option value="Day">Day Only</option>
                  <option value="Day & Boarding">Day & Boarding</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Education Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
                >
                  <option value="Secondary (O & A Level)">Secondary (O & A Level)</option>
                  <option value="Primary">Primary</option>
                  <option value="Nursery">Nursery</option>
                  <option value="Tertiary / Vocational">Tertiary / Vocational</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Estimated Annual Intake
                </label>
                <input
                  type="number"
                  value={intakeCapacity}
                  onChange={(e) => setIntakeCapacity(e.target.value)}
                  placeholder="e.g. 250"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Brief Institution Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share mission, academic achievements, special extracurriculars or facilities..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#6C3EF4] hover:bg-[#5B2FE3] shadow-md transition-all cursor-pointer"
              >
                <span>{isSubmitting ? 'Submitting for Audit...' : 'Submit School & Enter Control Center'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
