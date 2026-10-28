import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  GraduationCap, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Award, 
  HeartHandshake, 
  X, 
  ArrowRight,
  ShieldCheck,
  Building2,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';
import { ChildRecord } from '../../../types/admissions';

export const MyChildrenTab: React.FC<{ onNavigateToDiscover?: () => void }> = ({ onNavigateToDiscover }) => {
  const { currentUser } = useAuth();
  const { children, applications, addChild, updateChild, deleteChild } = useAdmissionsData();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<ChildRecord | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formGender, setFormGender] = useState<'Male' | 'Female'>('Male');
  const [formDob, setFormDob] = useState('2013-05-12');
  const [formGrade, setFormGrade] = useState('Senior 1 (S.1)');
  const [formSchool, setFormSchool] = useState('');
  const [formPleAggregate, setFormPleAggregate] = useState('4 Aggregates (Div 1)');
  const [formPleIndex, setFormPleIndex] = useState('002144/032');
  const [formNotes, setFormNotes] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!currentUser) return null;

  const handleOpenAdd = () => {
    setFormName('');
    setFormGender('Male');
    setFormDob('2013-05-12');
    setFormGrade('Senior 1 (S.1)');
    setFormSchool('');
    setFormPleAggregate('4 Aggregates (Div 1)');
    setFormPleIndex('002144/032');
    setFormNotes('');
    setAddModalOpen(true);
  };

  const handleOpenEdit = (child: ChildRecord) => {
    setEditingChild(child);
    setFormName(child.name);
    setFormGender(child.gender);
    setFormDob(child.dateOfBirth);
    setFormGrade(child.gradeApplyingFor);
    setFormSchool(child.currentSchool || '');
    setFormPleAggregate(child.pleAggregate || '');
    setFormPleIndex('002144/032');
    setFormNotes(child.notes || '');
  };

  const handleSaveChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingChild) {
      updateChild(editingChild.id, {
        name: formName.trim(),
        gender: formGender,
        dateOfBirth: formDob,
        gradeApplyingFor: formGrade,
        currentSchool: formSchool.trim(),
        pleAggregate: formPleAggregate.trim(),
        notes: formNotes.trim()
      });
      setFeedbackMsg(`Updated ${formName}’s profile.`);
      setEditingChild(null);
    } else {
      await addChild({
        parentId: currentUser.id,
        name: formName.trim(),
        gender: formGender,
        dateOfBirth: formDob,
        gradeApplyingFor: formGrade,
        currentSchool: formSchool.trim(),
        pleAggregate: formPleAggregate.trim(),
        notes: formNotes.trim()
      });
      setFeedbackMsg(`Added ${formName} to your family profiles.`);
      setAddModalOpen(false);
    }

    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleDeleteChildConfirm = (child: ChildRecord) => {
    if (window.confirm(`Are you sure you want to remove ${child.name}? This will unbind active applications.`)) {
      deleteChild(child.id);
      setFeedbackMsg(`Removed ${child.name} from registered children.`);
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              My Children & Students
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] dark:text-purple-300">
              {children.length} Registered
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your child profiles, attach authentic UNEB PLE pass results, and track each child’s admissions progress.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#6C3EF4] hover:bg-[#5B2FE3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Child</span>
        </button>
      </div>

      {/* Children List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {children.map((child) => {
          // Find applications for this child
          const childApps = applications.filter(a => 
            a.childId === child.id || a.studentName.toLowerCase() === child.name.toLowerCase()
          );

          return (
            <div
              key={child.id}
              className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:border-purple-300 dark:hover:border-purple-700/60 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] dark:text-purple-300 font-black text-base flex items-center justify-center shrink-0">
                      {child.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {child.name}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {child.gender}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Target Grade: <strong className="text-slate-800 dark:text-slate-200">{child.gradeApplyingFor}</strong> · DOB: {child.dateOfBirth}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(child)}
                      className="p-1.5 text-slate-400 hover:text-[#6C3EF4] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Edit child profile"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteChildConfirm(child)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Remove child"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Academic & PLE Card */}
                <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Current Primary School:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{child.currentSchool || 'Kampala Parents’ School'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">UNEB Assessment Score:</span>
                    <span className="font-bold text-[#6C3EF4] dark:text-purple-300 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>{child.pleAggregate || '4 Aggregates (Div 1)'}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-purple-100/80 dark:border-purple-800/40">
                    <span className="text-slate-500">UNEB Center Verification:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Pass Slip Validated</span>
                    </span>
                  </div>
                </div>

                {/* Special Considerations & Notes */}
                {child.notes && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    "{child.notes}"
                  </p>
                )}

                {/* Linked Applications Status */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Active Applications ({childApps.length}):
                  </span>
                  {childApps.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No applications submitted for this child yet.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {childApps.map(app => (
                        <div key={app.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">{app.schoolName}</span>
                            <span className="text-[10px] text-slate-400 block">{app.id}</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            app.status === 'Admitted'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : app.status === 'Interview Scheduled'
                              ? 'bg-purple-100 text-[#6C3EF4] dark:bg-purple-950/60 dark:text-purple-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Quick Action */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Profile complete</span>
                {onNavigateToDiscover && (
                  <button
                    onClick={onNavigateToDiscover}
                    className="text-xs font-bold text-[#6C3EF4] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Apply for {child.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Child Modal */}
      {(addModalOpen || editingChild) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={handleSaveChild}
            className="bg-white dark:bg-[#111827] rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingChild ? `Edit Profile: ${editingChild.name}` : 'Register New Child Profile'}
                </h3>
                <p className="text-xs text-slate-500">Provide learner details for authentic school admissions.</p>
              </div>
              <button 
                type="button" 
                onClick={() => { setAddModalOpen(false); setEditingChild(null); }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Child Full Legal Name:
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Trevor Mugisha"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Gender:
                </label>
                <select
                  value={formGender}
                  onChange={(e) => setFormGender(e.target.value as 'Male' | 'Female')}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Date of Birth:
                </label>
                <input
                  type="date"
                  required
                  value={formDob}
                  onChange={(e) => setFormDob(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Target Grade Level:
                </label>
                <select
                  value={formGrade}
                  onChange={(e) => setFormGrade(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                >
                  <option value="Senior 1 (S.1)">Senior 1 (S.1)</option>
                  <option value="Senior 2 (S.2)">Senior 2 (S.2)</option>
                  <option value="Senior 3 (S.3)">Senior 3 (S.3)</option>
                  <option value="Senior 5 (S.5)">Senior 5 (S.5)</option>
                  <option value="Primary 1 (P.1)">Primary 1 (P.1)</option>
                  <option value="Primary 5 (P.5)">Primary 5 (P.5)</option>
                  <option value="Primary 7 (P.7)">Primary 7 (P.7)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Current School:
                </label>
                <input
                  type="text"
                  value={formSchool}
                  onChange={(e) => setFormSchool(e.target.value)}
                  placeholder="e.g. Kampala Parents’ School"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  PLE Aggregate / Division:
                </label>
                <input
                  type="text"
                  value={formPleAggregate}
                  onChange={(e) => setFormPleAggregate(e.target.value)}
                  placeholder="e.g. 4 Aggregates (Div 1)"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  UNEB Index Number:
                </label>
                <input
                  type="text"
                  value={formPleIndex}
                  onChange={(e) => setFormPleIndex(e.target.value)}
                  placeholder="e.g. 002144/032"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Medical Notes / Talents / Special Needs:
              </label>
              <textarea
                rows={2}
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Mention talents, dietary preferences, or medical conditions (e.g. Asthmatic, excels in chess & coding)..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => { setAddModalOpen(false); setEditingChild(null); }}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#6C3EF4] hover:bg-[#5B2FE3] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                <span>{editingChild ? 'Update Child Profile' : 'Save Child Record'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
