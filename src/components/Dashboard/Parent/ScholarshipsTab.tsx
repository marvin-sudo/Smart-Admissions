import React, { useState } from 'react';
import { 
  Award, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Filter, 
  Users, 
  BookOpen, 
  X, 
  Clock, 
  GraduationCap, 
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';
import { Scholarship } from '../../../types/admissions';

export const ScholarshipsTab: React.FC = () => {
  const { currentUser } = useAuth();
  const { scholarships, schools, children, submitApplication } = useAdmissionsData();

  const [selectedChildFilter, setSelectedChildFilter] = useState('all');
  const [selectedCoverageFilter, setSelectedCoverageFilter] = useState('all');
  const [applyModalScholarship, setApplyModalScholarship] = useState<Scholarship | null>(null);
  
  // Application form state
  const [selectedChildId, setSelectedChildId] = useState('');
  const [applicantStatement, setApplicantStatement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  if (!currentUser) return null;

  // Filtered scholarships
  const filteredScholarships = scholarships.filter(sch => {
    const matchesCoverage = 
      selectedCoverageFilter === 'all' || 
      sch.coverage.toLowerCase().includes(selectedCoverageFilter.toLowerCase());

    return matchesCoverage;
  });

  const handleOpenApply = (sch: Scholarship) => {
    setApplyModalScholarship(sch);
    if (children.length > 0) {
      setSelectedChildId(children[0].id);
    }
    setApplicantStatement('');
  };

  const handleSubmitScholarshipApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyModalScholarship || !selectedChildId) return;

    setIsSubmitting(true);
    const chosenChild = children.find(c => c.id === selectedChildId);
    if (!chosenChild) return;

    // Submit formal application linked to this school & scholarship
    await submitApplication({
      childId: chosenChild.id,
      studentName: chosenChild.name,
      parentId: currentUser.id,
      parentName: currentUser.name,
      parentEmail: currentUser.email,
      parentPhone: currentUser.phone,
      schoolId: applyModalScholarship.schoolId,
      gradeLevel: chosenChild.gradeApplyingFor,
      pleAggregate: chosenChild.pleAggregate,
      notes: `[Scholarship Grant: ${applyModalScholarship.title} - ${applyModalScholarship.coverage}] Justification: ${applicantStatement}`
    });

    setIsSubmitting(false);
    setSuccessBanner(`Scholarship application submitted for ${chosenChild.name} to ${applyModalScholarship.schoolName}!`);
    setApplyModalScholarship(null);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      {successBanner && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1E1B4B] via-[#4338CA] to-[#6C3EF4] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/15 backdrop-blur-xs text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>National Bursary & Merit Assistance Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Scholarships & Tuition Grants
          </h1>
          <p className="mt-2 text-sm text-purple-100 leading-relaxed">
            Discover verified tuition exemptions, STEM grants, and alumni endowments across accredited Ugandan institutions for high-achieving and deserving students.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Coverage:</span>
          <button
            onClick={() => setSelectedCoverageFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              selectedCoverageFilter === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            All Opportunities ({scholarships.length})
          </button>
          <button
            onClick={() => setSelectedCoverageFilter('100%')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              selectedCoverageFilter === '100%'
                ? 'bg-[#6C3EF4] text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            100% Full Bursaries
          </button>
          <button
            onClick={() => setSelectedCoverageFilter('50%')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              selectedCoverageFilter === '50%'
                ? 'bg-[#6C3EF4] text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            50% Partial Grants
          </button>
        </div>

        {/* Matched Children Helper */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <GraduationCap className="w-4 h-4 text-[#6C3EF4]" />
          <span>Eligible Candidates: <strong>{children.length} in Family</strong></span>
        </div>
      </div>

      {/* Scholarships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredScholarships.map((sch) => {
          const matchingSchool = schools.find(s => s.id === sch.schoolId);
          return (
            <div 
              key={sch.id}
              className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:border-purple-300 dark:hover:border-purple-700/60 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] dark:text-purple-300 font-black text-xs flex items-center justify-center shrink-0">
                      {sch.schoolName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <span>{sch.schoolName}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </h4>
                      <span className="text-[10px] text-slate-400">{sch.educationLevel}</span>
                    </div>
                  </div>

                  <span className="text-xs font-black px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                    {sch.coverage}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {sch.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {sch.description}
                </p>

                {/* Eligibility Criteria */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Eligibility Requirement
                  </span>
                  <div className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-200 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6C3EF4] shrink-0 mt-0.5" />
                    <span>{sch.eligibility}</span>
                  </div>
                </div>

                {/* Deadline & Applications info */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Deadline: {sch.deadline}</span>
                  </span>
                  <span className="tabular-nums">
                    {sch.applicationsCount || 14} applicants
                  </span>
                </div>
              </div>

              {/* Bottom Apply Action */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Sponsored intake</span>
                <button
                  onClick={() => handleOpenApply(sch)}
                  className="px-4 py-2 bg-[#6C3EF4] hover:bg-[#5B2FE3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Apply for Child</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scholarship Application Modal */}
      {applyModalScholarship && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={handleSubmitScholarshipApplication}
            className="bg-white dark:bg-[#111827] rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#6C3EF4] uppercase tracking-wider">
                  {applyModalScholarship.coverage}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {applyModalScholarship.title}
                </h3>
                <p className="text-xs text-slate-500">{applyModalScholarship.schoolName}</p>
              </div>
              <button 
                type="button" 
                onClick={() => setApplyModalScholarship(null)} 
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Select Child to Apply:
              </label>
              <select
                required
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium"
              >
                {children.map(ch => (
                  <option key={ch.id} value={ch.id}>
                    {ch.name} · {ch.gradeApplyingFor} · {ch.pleAggregate || 'Grade 1'}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/60 text-xs space-y-1">
              <span className="font-bold text-[#6C3EF4] dark:text-purple-300 block">Criteria Verification:</span>
              <p className="text-slate-600 dark:text-slate-300">
                {applyModalScholarship.eligibility}
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Parent Motivation / Merit Justification:
              </label>
              <textarea
                required
                rows={3}
                value={applicantStatement}
                onChange={(e) => setApplicantStatement(e.target.value)}
                placeholder="Briefly state your child’s academic goals, extracurricular achievements, or why they deserve this grant..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setApplyModalScholarship(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#6C3EF4] hover:bg-[#5B2FE3] disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Bursary Dossier'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
