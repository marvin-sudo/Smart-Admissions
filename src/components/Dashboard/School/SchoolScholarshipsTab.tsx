import React, { useState } from 'react';
import { 
  Award, 
  Plus, 
  Clock, 
  Users, 
  CheckCircle2, 
  X, 
  Calendar, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';
import { Scholarship } from '../../../types/admissions';

export const SchoolScholarshipsTab: React.FC = () => {
  const { currentUser } = useAuth();
  const { schools, scholarships, applications, createScholarship, toggleScholarshipStatus } = useAdmissionsData();

  const currentSchool = schools.find(s => 
    s.id === currentUser?.schoolId || s.name.toLowerCase() === (currentUser?.schoolName || '').toLowerCase()
  ) || schools[0];

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eligibility, setEligibility] = useState('PLE Aggregates 4 - 8 in UNEB Examinations');
  const [coverage, setCoverage] = useState('100% Full Tuition & Boarding');
  const [deadline, setDeadline] = useState('Dec 15, 2026');
  const [educationLevel, setEducationLevel] = useState('Senior 1 (S.1)');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter scholarships for this school
  const myScholarships = scholarships.filter(s => 
    s.schoolId === currentSchool.id || s.schoolName.toLowerCase() === currentSchool.name.toLowerCase()
  );

  // Candidate applications linked to scholarship programs
  const scholarshipApps = applications.filter(a => 
    (a.schoolId === currentSchool.id || a.schoolName.toLowerCase() === currentSchool.name.toLowerCase()) &&
    a.notes && a.notes.includes('[Scholarship')
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createScholarship({
      schoolId: currentSchool.id,
      schoolName: currentSchool.name,
      title: title.trim(),
      description: description.trim(),
      eligibility: eligibility.trim(),
      coverage: coverage.trim(),
      deadline: deadline.trim(),
      educationLevel
    });

    setCreateModalOpen(false);
    setTitle('');
    setDescription('');
    setToastMessage('New scholarship opportunity published to parent discovery directory.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Institutional Bursaries & Merit Grants
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] dark:text-purple-300">
              {myScholarships.length} Active Schemes
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Offer tuition exemptions, STEM grants, and alumni endowments to attract Uganda’s brightest learners.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#6C3EF4] hover:bg-[#5B2FE3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Scholarship Program</span>
        </button>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {myScholarships.map((sch) => (
          <div 
            key={sch.id}
            className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] dark:text-purple-300 font-bold flex items-center justify-center text-xs">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {sch.title}
                    </h3>
                    <span className="text-[10px] text-slate-400">{sch.educationLevel}</span>
                  </div>
                </div>

                <span className="text-xs font-black px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60">
                  {sch.coverage}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {sch.description}
              </p>

              {/* Criteria */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Eligibility Threshold:
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{sch.eligibility}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 text-rose-600 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Closing: {sch.deadline}</span>
                </span>
                <span className="tabular-nums font-semibold text-slate-700 dark:text-slate-300">
                  {sch.applicationsCount || 14} Candidates Applied
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                sch.status === 'active' 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' 
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {sch.status === 'active' ? 'Accepting Dossiers' : 'Applications Closed'}
              </span>

              <button
                onClick={() => toggleScholarshipStatus(sch.id)}
                className="text-xs font-semibold text-[#6C3EF4] hover:underline cursor-pointer"
              >
                {sch.status === 'active' ? 'Pause Submissions' : 'Reactivate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Candidate Applicants Under Scholarship Consideration */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Bursary Candidate Applicants
            </h3>
            <p className="text-xs text-slate-500">Students seeking merit tuition assistance based on UNEB scores</p>
          </div>
          <span className="text-xs font-bold text-[#6C3EF4]">{scholarshipApps.length} Applicants</span>
        </div>

        {scholarshipApps.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No scholarship applications submitted yet.</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {scholarshipApps.map(app => (
              <div key={app.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{app.studentName}</span>
                  <span className="text-slate-400 ml-2">({app.pleAggregate || 'Div 1'})</span>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{app.notes}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-[#6C3EF4]">
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Scholarship Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-white dark:bg-[#111827] rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Create Scholarship / Bursary Scheme
                </h3>
                <p className="text-xs text-slate-500">Publish a new funding opportunity for prospective students</p>
              </div>
              <button type="button" onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Program Title:</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior One STEM Excellence Bursary"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Tuition Coverage:</label>
                <select
                  value={coverage}
                  onChange={(e) => setCoverage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                >
                  <option value="100% Full Tuition & Boarding">100% Full Tuition & Boarding</option>
                  <option value="75% Tuition Exemption">75% Tuition Exemption</option>
                  <option value="50% Tuition Bursary">50% Tuition Bursary</option>
                  <option value="UGX 1,500,000 / Term Grant">UGX 1,500,000 / Term Grant</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Target Grade:</label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                >
                  <option value="Senior 1 (S.1)">Senior 1 (S.1)</option>
                  <option value="Senior 5 (S.5)">Senior 5 (S.5)</option>
                  <option value="Primary 1 (P.1)">Primary 1 (P.1)</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Application Deadline:</label>
                <input
                  type="text"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="e.g. Dec 15, 2026"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Eligibility Criteria:</label>
                <input
                  type="text"
                  required
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  placeholder="e.g. PLE Aggregates 4 - 8"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Scheme Description & Sponsor:</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail eligibility conditions, sponsor backing (e.g. Alumni Endowment), and selection process..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#6C3EF4] hover:bg-[#5B2FE3] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Publish Scholarship</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
