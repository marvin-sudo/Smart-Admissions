import React, { useState } from 'react';
import { 
  Building2, 
  School, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Users, 
  DollarSign, 
  Award, 
  Edit3, 
  CheckCircle2, 
  Plus, 
  X, 
  Check, 
  Eye, 
  Sparkles,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';
import { SchoolRecord } from '../../../types/admissions';

export const MySchoolProfileTab: React.FC = () => {
  const { currentUser } = useAuth();
  const { schools, updateSchoolProfile } = useAdmissionsData();

  const currentSchool = schools.find(s => 
    s.id === currentUser?.schoolId || s.name.toLowerCase() === (currentUser?.schoolName || '').toLowerCase()
  ) || schools[0];

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentSchool.name);
  const [district, setDistrict] = useState(currentSchool.district);
  const [location, setLocation] = useState(currentSchool.location);
  const [level, setLevel] = useState(currentSchool.level);
  const [type, setType] = useState(currentSchool.type);
  const [tuitionRange, setTuitionRange] = useState(currentSchool.tuitionRange);
  const [intakeCapacity, setIntakeCapacity] = useState(currentSchool.intakeCapacity || 280);
  const [contactPerson, setContactPerson] = useState(currentSchool.contactPerson);
  const [contactEmail, setContactEmail] = useState(currentSchool.contactEmail);
  const [contactPhone, setContactPhone] = useState(currentSchool.contactPhone);
  const [description, setDescription] = useState(currentSchool.description);
  const [facilities, setFacilities] = useState<string[]>(currentSchool.facilities || []);
  const [newFacility, setNewFacility] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddFacility = () => {
    if (newFacility.trim() && !facilities.includes(newFacility.trim())) {
      setFacilities([...facilities, newFacility.trim()]);
      setNewFacility('');
    }
  };

  const handleRemoveFacility = (fac: string) => {
    setFacilities(facilities.filter(f => f !== fac));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSchoolProfile(currentSchool.id, {
      name,
      district,
      location,
      level,
      type,
      tuitionRange,
      intakeCapacity: Number(intakeCapacity),
      contactPerson,
      contactEmail,
      contactPhone,
      description,
      facilities
    });

    setIsEditing(false);
    setToastMessage('School institutional profile successfully updated and published to the national directory.');
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

      {/* Header and Edit Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Institutional Profile & Public Directory Dossier
            </h2>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              currentSchool.verificationStatus === 'verified'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
            }`}>
              {currentSchool.verificationStatus === 'verified' ? 'MoES Verified Center' : 'Audit Pending'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            This profile information is displayed directly to prospective parents and students on Smart Admissions.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#6C3EF4] hover:bg-[#5B2FE3] rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Cancel Editing' : 'Edit School Profile'}</span>
        </button>
      </div>

      {isEditing ? (
        /* Edit Mode Form */
        <form onSubmit={handleSave} className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Edit Institution Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Official School Name:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                District / Administrative Region:
              </label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Campus Location Address:
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Education Level:
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              >
                <option value="Secondary (O & A Level)">Secondary (O & A Level)</option>
                <option value="Primary">Primary</option>
                <option value="Nursery">Nursery</option>
                <option value="Tertiary / Vocational">Tertiary / Vocational</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Boarding / Day Type:
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'Day' | 'Boarding' | 'Day & Boarding')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              >
                <option value="Boarding">Boarding Only</option>
                <option value="Day">Day Only</option>
                <option value="Day & Boarding">Day & Boarding</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Annual Intake Capacity (Seats):
              </label>
              <input
                type="number"
                required
                value={intakeCapacity}
                onChange={(e) => setIntakeCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white tabular-nums"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Estimated Tuition Range (UGX / Term):
              </label>
              <input
                type="text"
                required
                value={tuitionRange}
                onChange={(e) => setTuitionRange(e.target.value)}
                placeholder="e.g. UGX 1,850,000 - 2,400,000 / Term"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Head of Admissions / Registrar:
              </label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Admissions Phone:
              </label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Admissions Email:
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
              About the Institution & Academic Mission:
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Facilities Management */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-2">
              Campus Facilities & Infrastructure:
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {facilities.map((fac, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-[#6C3EF4] dark:text-purple-300 text-xs font-semibold border border-purple-200 dark:border-purple-800">
                  <span>{fac}</span>
                  <button type="button" onClick={() => handleRemoveFacility(fac)} className="hover:text-rose-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newFacility}
                onChange={(e) => setNewFacility(e.target.value)}
                placeholder="e.g. Modern Robotics Lab, Olympic Swimming Pool..."
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddFacility}
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl"
              >
                + Add Facility
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#6C3EF4] hover:bg-[#5B2FE3] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      ) : (
        /* View Mode: Institutional Overview */
        <div className="space-y-6">
          {/* Main Card */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] font-black text-2xl flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800">
                {currentSchool.name.substring(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {currentSchool.name}
                  </h3>
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-[#6C3EF4] dark:text-purple-300">
                    {currentSchool.badge || `UNEB: ${currentSchool.code}`}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentSchool.location}</span>
                  <span>·</span>
                  <span>{currentSchool.level}</span>
                  <span>·</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{currentSchool.type}</span>
                </p>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ANNUAL INTAKE</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm tabular-nums">
                  {currentSchool.intakeCapacity || 280} Seats
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TUITION ESTIMATE</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {currentSchool.tuitionRange.split('-')[0]}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">DIRECTORY VIEWS</span>
                <span className="font-extrabold text-[#6C3EF4] text-sm tabular-nums">
                  {currentSchool.profileViews.toLocaleString()} Parents
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AUTHENTICATION</span>
                <span className="font-bold text-emerald-600 text-sm">MoES Certified</span>
              </div>
            </div>

            {/* About Institution */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                Institutional Mission & Description
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentSchool.description}
              </p>
            </div>

            {/* Facilities */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                Campus Facilities & Co-Curricular Hubs
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {currentSchool.facilities.map((fac, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100/60 dark:border-purple-800/40 text-xs text-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6C3EF4] shrink-0" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Admissions Desk Direct Contact */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">DIRECTOR OF ADMISSIONS</span>
                <span className="font-bold text-slate-900 dark:text-white">{currentSchool.contactPerson}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">DIRECT PHONE</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentSchool.contactPhone}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">OFFICIAL EMAIL</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentSchool.contactEmail}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
