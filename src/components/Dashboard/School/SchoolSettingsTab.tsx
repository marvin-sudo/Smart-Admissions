import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Bell, 
  Users, 
  Mail, 
  Lock, 
  CheckCircle2, 
  Check, 
  X, 
  Building2, 
  SlidersHorizontal,
  Smartphone,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';

export const SchoolSettingsTab: React.FC = () => {
  const { currentUser } = useAuth();
  const { schools, updateSchoolProfile } = useAdmissionsData();

  const currentSchool = schools.find(s => 
    s.id === currentUser?.schoolId || s.name.toLowerCase() === (currentUser?.schoolName || '').toLowerCase()
  ) || schools[0];

  const [intakeOpen, setIntakeOpen] = useState(true);
  const [cutoffPle, setCutoffPle] = useState('Aggregates 4 - 12 (Division 1 & 2)');
  const [intakeCap, setIntakeCap] = useState(currentSchool.intakeCapacity || 280);
  const [deadlineDate, setDeadlineDate] = useState('2026-12-15');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [autoResponseMsg, setAutoResponseMsg] = useState(
    `Thank you for applying to ${currentSchool.name}. Your dossier has been logged into our admissions registry and is undergoing UNEB pass slip verification.`
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Staff members
  const [staff, setStaff] = useState([
    { id: 'st-01', name: currentSchool.contactPerson, role: 'Head of Admissions & Directorate', email: currentSchool.contactEmail },
    { id: 'st-02', name: 'Mr. Davis Byaruhanga', role: 'Academic Registrar & UNEB Liaison', email: 'registrar@school.sc.ug' },
    { id: 'st-03', name: 'Mrs. Grace Kigozi', role: 'Senior Admissions Officer', email: 'admissions2@school.sc.ug' }
  ]);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('Admissions Committee Reviewer');
  const [inviteEmail, setInviteEmail] = useState('');

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSchoolProfile(currentSchool.id, {
      intakeCapacity: Number(intakeCap)
    });
    setToastMessage('Admissions desk configuration and intake parameters saved.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleInviteStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    setStaff([
      ...staff,
      {
        id: `st-${Date.now()}`,
        name: inviteName.trim(),
        role: inviteRole,
        email: inviteEmail.trim()
      }
    ]);

    setInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
    setToastMessage(`Staff invitation dispatched to ${inviteEmail}.`);
    setTimeout(() => setToastMessage(null), 3500);
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

      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Admissions Desk & School Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure intake cycle availability, PLE cutoff thresholds, committee staff access, and automated parent responses.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Intake Cycle & Eligibility Controls */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Intake Cycle & Cutoff Thresholds
              </h3>
              <p className="text-xs text-slate-500">Public application availability on Smart Admissions</p>
            </div>
          </div>

          {/* Live Intake Switch */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Accepting Online Applications for 2027 Academic Year
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                When active, parents can submit dossiers via the Discover Schools portal.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIntakeOpen(!intakeOpen)}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                intakeOpen ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                intakeOpen ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Minimum PLE Aggregate Cutoff:
              </label>
              <input
                type="text"
                value={cutoffPle}
                onChange={(e) => setCutoffPle(e.target.value)}
                placeholder="e.g. Aggregates 4 - 12"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Intake Target Seats:
              </label>
              <input
                type="number"
                value={intakeCap}
                onChange={(e) => setIntakeCap(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white tabular-nums"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Intake Closing Deadline:
              </label>
              <input
                type="date"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Admissions Committee & Authorized Officers */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  School Admissions Committee & Authorized Staff
                </h3>
                <p className="text-xs text-slate-500">Personnel with authorization to vet applications and issue letters</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setInviteModalOpen(true)}
              className="px-3 py-1.5 bg-[#6C3EF4] hover:bg-[#5B2FE3] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              + Invite Officer
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {staff.map((st) => (
              <div key={st.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{st.name}</span>
                  <span className="text-[11px] text-slate-500">{st.role} · {st.email}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Authorized
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Automated Parent Notifications & Canned Confirmations */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Automated Notifications & Parent Acknowledgement
              </h3>
              <p className="text-xs text-slate-500">Configure instant messaging responses when applications arrive</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Email Admissions Digest</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Notify directorate immediately when applications are lodged.</p>
              </div>
              <button
                type="button"
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                  emailAlerts ? 'bg-[#6C3EF4]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  emailAlerts ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">SMS Notification for Admissions</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Send SMS dispatch when an interview slot is confirmed.</p>
              </div>
              <button
                type="button"
                onClick={() => setSmsAlerts(!smsAlerts)}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                  smsAlerts ? 'bg-[#6C3EF4]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  smsAlerts ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
              Automated Welcome / Acknowledgement Message to Parents:
            </label>
            <textarea
              rows={3}
              value={autoResponseMsg}
              onChange={(e) => setAutoResponseMsg(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#6C3EF4] hover:bg-[#5B2FE3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Save All Settings
          </button>
        </div>
      </form>

      {/* Invite Staff Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleInviteStaff} className="bg-white dark:bg-[#111827] rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Invite School Admissions Staff
                </h3>
                <p className="text-xs text-slate-500">Grant authorized access to review candidate applications</p>
              </div>
              <button type="button" onClick={() => setInviteModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Staff Full Name:</label>
              <input
                type="text"
                required
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="e.g. Sister Dr. Florence"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Official Email Address:</label>
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="e.g. admissions@school.sc.ug"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Role / Designation:</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              >
                <option value="Head of Admissions">Head of Admissions</option>
                <option value="Academic Registrar">Academic Registrar</option>
                <option value="Admissions Committee Reviewer">Admissions Committee Reviewer</option>
                <option value="Bursar / Accounts Officer">Bursar / Accounts Officer</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setInviteModalOpen(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#6C3EF4] hover:bg-[#5B2FE3] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Send Invite
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
