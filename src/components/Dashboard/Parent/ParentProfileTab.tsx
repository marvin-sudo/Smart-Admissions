import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  Users, 
  Edit3, 
  CheckCircle2, 
  Check, 
  X, 
  HeartHandshake, 
  Building2, 
  FileText,
  Lock
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';

export const ParentProfileTab: React.FC = () => {
  const { currentUser } = useAuth();
  const { parents, children, updateParentProfile } = useAdmissionsData();

  // Find parent record or fallback to current user
  const parentRecord = parents.find(p => p.id === currentUser?.id || p.email === currentUser?.email) || {
    id: currentUser?.id || 'usr-parent-01',
    name: currentUser?.name || 'Grace Mugisha',
    email: currentUser?.email || 'grace.mugisha@gmail.com',
    phone: currentUser?.phone || '+256 772 123456',
    district: 'Kampala (Kololo)',
    ninNumber: 'CF82041923K7L',
    occupation: 'Senior Financial Analyst, Stanbic Bank',
    registeredDate: 'Sep 12, 2026',
    status: 'verified' as const,
    childrenCount: children.length,
    activeApplicationsCount: 2
  };

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(parentRecord.name);
  const [phone, setPhone] = useState(parentRecord.phone);
  const [email, setEmail] = useState(parentRecord.email);
  const [district, setDistrict] = useState(parentRecord.district);
  const [ninNumber, setNinNumber] = useState(parentRecord.ninNumber);
  const [occupation, setOccupation] = useState(parentRecord.occupation || '');
  const [emergencyName, setEmergencyName] = useState('Patrick Mugisha');
  const [emergencyPhone, setEmergencyPhone] = useState('+256 701 987654');
  const [emergencyRelation, setEmergencyRelation] = useState('Spouse / Co-Guardian');
  const [successToast, setSuccessToast] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateParentProfile(parentRecord.id, {
      name,
      phone,
      email,
      district,
      ninNumber,
      occupation
    });
    setIsEditing(false);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Parent dossier updated successfully. Changes synchronized with school admissions desks.</span>
          </div>
          <button onClick={() => setSuccessToast(false)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Identity Hero Card */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div className="flex items-start gap-4">
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-300 dark:border-purple-600 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6C3EF4] to-[#4F28C9] text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-md">
                {name.charAt(0)}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {name}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>NIRA Verified Citizen</span>
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Parent / Primary Educational Guardian · Member since {parentRecord.registeredDate}
              </p>

              {/* NIRA National ID Badge */}
              <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 text-xs font-mono text-[#6C3EF4] dark:text-purple-300">
                <Lock className="w-3 h-3" />
                <span>Uganda NIN: <strong>{ninNumber}</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#6C3EF4] dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 rounded-xl border border-purple-200 dark:border-purple-800 transition-colors self-start cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Dossier'}</span>
          </button>
        </div>

        {/* View / Edit Mode Switch */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Edit Guardian Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Full Legal Name:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">National ID (NIN):</label>
                <input
                  type="text"
                  required
                  value={ninNumber}
                  onChange={(e) => setNinNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Primary Phone (SMS & MoMo):</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Email Address:</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Residential District & Town:</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Occupation & Organization:</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-[#6C3EF4] hover:bg-[#5B2FE3] rounded-xl shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Contact Details</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Phone className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>{phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Mail className="w-4 h-4 text-purple-500 shrink-0" />
                  <span className="truncate">{email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>{district}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Professional Background</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Briefcase className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>{occupation || 'Not Specified'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Building2 className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>Kampala / Wakiso Employment Zone</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Emergency Alternate Guardian</h4>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">{emergencyName}</p>
                <p className="text-[11px] text-slate-500">{emergencyRelation} · {emergencyPhone}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Linked Children in Dossier */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Linked Children & Educational Dependents
            </h3>
            <p className="text-xs text-slate-500">Learners registered under this legal guardianship profile</p>
          </div>
          <span className="text-xs font-bold text-[#6C3EF4]">
            {children.length} Children
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {children.map(ch => (
            <div key={ch.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-xs block">{ch.name}</span>
                <span className="text-[11px] text-slate-500">{ch.gradeApplyingFor} · {ch.pleAggregate || 'Grade 1'}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4]">
                {ch.gender}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
