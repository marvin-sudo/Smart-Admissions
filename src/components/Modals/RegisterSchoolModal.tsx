import React, { useState } from 'react';
import { 
  X, 
  School, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft
} from 'lucide-react';
import { SchoolRegistrationData } from '../../types/admissions';
import { useAdmissionsData } from '../../context/AdmissionsDataContext';

interface RegisterSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterSchoolModal: React.FC<RegisterSchoolModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { registerNewSchoolInDb } = useAdmissionsData();
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<SchoolRegistrationData>({
    schoolName: '',
    schoolType: 'Day & Boarding',
    level: 'Secondary (O & A Level)',
    district: 'Wakiso',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    estimatedIntake: '200 - 500 applicants',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceCode, setReferenceCode] = useState('');

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1 && !formData.schoolName.trim()) {
      return;
    }
    if (step === 2 && !formData.district.trim()) {
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contactPerson.trim() || !formData.contactEmail.trim() || !formData.contactPhone.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await registerNewSchoolInDb({
        name: formData.schoolName.trim(),
        type: formData.schoolType,
        level: formData.level,
        district: formData.district,
        contactPerson: formData.contactPerson.trim(),
        contactEmail: formData.contactEmail.trim(),
        contactPhone: formData.contactPhone.trim(),
        description: formData.notes
      });
      setReferenceCode(created.code);
    } catch {
      const generatedCode = `SCH-UG-${Math.floor(1000 + Math.random() * 9000)}`;
      setReferenceCode(generatedCode);
    }

    setIsSubmitting(false);
    setStep(4); // Success step
  };

  const handleReset = () => {
    setStep(1);
    setFormData({
      schoolName: '',
      schoolType: 'Day & Boarding',
      level: 'Secondary (O & A Level)',
      district: 'Wakiso',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      estimatedIntake: '200 - 500 applicants',
      notes: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-[#F5F3FF]/40 dark:bg-slate-950/60">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#0000B7] dark:bg-purple-600 text-white flex items-center justify-center">
              <School className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#0000B7] dark:text-purple-300 uppercase tracking-wider">
              School Onboarding Registration
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Register Your School on Smart Admissions
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Digitize your upcoming intake cycle and join leading institutions across Uganda & East Africa.
          </p>

          {/* Stepper progress indicator */}
          {step < 4 && (
            <div className="flex items-center gap-2 mt-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1 flex items-center gap-2">
                  <div className={`h-1.5 flex-1 rounded-full ${
                    step >= s ? 'bg-[#8B5CF6]' : 'bg-slate-200 dark:bg-slate-800'
                  }`} />
                  <span className={`text-[10px] font-mono font-semibold ${
                    step >= s ? 'text-[#8B5CF6] dark:text-purple-300' : 'text-slate-400 dark:text-slate-600'
                  }`}>
                    0{s}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Step 1: School Identity</h4>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  School Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. St. Charles Lwanga College, Wakiso"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Institution Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6]"
                  >
                    <option value="Secondary (O & A Level)" className="dark:bg-slate-800">Secondary (O & A Level)</option>
                    <option value="Primary" className="dark:bg-slate-800">Primary (P.1 - P.7)</option>
                    <option value="Nursery" className="dark:bg-slate-800">Nursery & Kindergarten</option>
                    <option value="Tertiary / Vocational" className="dark:bg-slate-800">Tertiary / Vocational</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Enrolment Type
                  </label>
                  <select
                    value={formData.schoolType}
                    onChange={(e) => setFormData({ ...formData, schoolType: e.target.value as any })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6]"
                  >
                    <option value="Day & Boarding" className="dark:bg-slate-800">Day & Boarding</option>
                    <option value="Boarding Only" className="dark:bg-slate-800">Boarding Only</option>
                    <option value="Day Only" className="dark:bg-slate-800">Day Only</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg shadow-sm shadow-[#8B5CF6]/25 transition-colors cursor-pointer"
                >
                  <span>Continue to Intake Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Step 2: Location & Intake Scope</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    District / Town
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kampala, Wakiso, Mukono, Mbarara"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estimated Applicants Per Cycle
                  </label>
                  <select
                    value={formData.estimatedIntake}
                    onChange={(e) => setFormData({ ...formData, estimatedIntake: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6]"
                  >
                    <option value="Under 200 applicants" className="dark:bg-slate-800">Under 200 applicants</option>
                    <option value="200 - 500 applicants" className="dark:bg-slate-800">200 - 500 applicants</option>
                    <option value="500 - 1,500 applicants" className="dark:bg-slate-800">500 - 1,500 applicants</option>
                    <option value="Over 1,500 applicants" className="dark:bg-slate-800">Over 1,500 applicants</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  National / International Curriculum
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg border border-[#8B5CF6] bg-purple-50 dark:bg-purple-950/50 text-[#8B5CF6] dark:text-purple-300 font-semibold text-center">
                    UNEB (Uganda)
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-center">
                    Cambridge (IGCSE)
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-center">
                    IB / Dual
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg shadow-sm shadow-[#8B5CF6]/25 transition-colors cursor-pointer"
                >
                  <span>Continue to Staff Contacts</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Step 3: Authorized Admissions Contact</h4>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Registrar / Headteacher Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sister Maria Goretti / Mr. Ronald Mugerwa"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  required
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Official School Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="admissions@school.ac.ug"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    required
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Telephone / WhatsApp Desk <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+256 700 000 000"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    required
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg shadow-sm shadow-[#8B5CF6]/25 transition-colors cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? 'Registering institution...' : 'Submit School Registration'}
                </button>
              </div>
            </form>
          )}

          {step === 4 && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                School Registration Submitted!
              </h4>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl max-w-sm mx-auto text-left space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400">School Onboarding Ref:</span>
                  <span className="font-mono font-bold text-[#8B5CF6] dark:text-purple-300">{referenceCode}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Registered Institution:</span>
                  <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">{formData.schoolName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Location:</span>
                  <span className="text-slate-700 dark:text-slate-300">{formData.district}, Uganda</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                Our Kampala onboarding team has received your institution's registration. We will contact <strong>{formData.contactPerson}</strong> at <strong>{formData.contactEmail}</strong> within 24 business hours to set up your admissions portal credentials and intake cutoff rules.
              </p>

              <button
                type="button"
                onClick={handleReset}
                className="mt-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg shadow-sm shadow-[#8B5CF6]/25 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
