import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ExternalLink, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  X, 
  Check, 
  Eye, 
  FileSpreadsheet,
  Users
} from 'lucide-react';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';
import { SchoolRecord, SchoolVerificationStatus } from '../../../types/admissions';

interface AllSchoolsTabProps {
  onSelectSchool?: (schoolId: string) => void;
}

export const AllSchoolsTab: React.FC<AllSchoolsTabProps> = () => {
  const { schools, verifySchool, registerNewSchoolInDb } = useAdmissionsData();

  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | SchoolVerificationStatus>('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [selectedSchool, setSelectedSchool] = useState<SchoolRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New School Form State
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'Day' | 'Boarding' | 'Day & Boarding'>('Boarding');
  const [newLevel, setNewLevel] = useState<'Nursery' | 'Primary' | 'Secondary (O & A Level)' | 'Tertiary / Vocational'>('Secondary (O & A Level)');
  const [newDistrict, setNewDistrict] = useState('Wakiso');
  const [newContactPerson, setNewContactPerson] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Metrics
  const totalSchools = schools.length;
  const verifiedCount = schools.filter(s => s.verificationStatus === 'verified').length;
  const pendingCount = schools.filter(s => s.verificationStatus === 'pending').length;
  const totalCapacity = schools.reduce((acc, s) => acc + (s.intakeCapacity || 0), 0);

  // Unique districts for filter dropdown
  const districts = ['all', ...Array.from(new Set(schools.map(s => s.district)))];

  const handleVerify = async (schoolId: string, status: SchoolVerificationStatus) => {
    const res = await verifySchool(schoolId, status);
    setFeedback(res.message);
    if (selectedSchool && selectedSchool.id === schoolId) {
      setSelectedSchool(prev => prev ? { ...prev, verificationStatus: status } : null);
    }
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleRegisterSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newContactEmail.trim()) return;

    await registerNewSchoolInDb({
      name: newName,
      type: newType,
      level: newLevel,
      district: newDistrict,
      contactPerson: newContactPerson || 'Admissions Secretariat',
      contactEmail: newContactEmail,
      contactPhone: newContactPhone || '+256 700 000000',
      description: newDescription || `${newName} is a registered educational institution in ${newDistrict}.`
    });

    setFeedback(`Successfully registered ${newName} into national database.`);
    setShowAddModal(false);
    setNewName('');
    setNewContactEmail('');
    setNewContactPhone('');
    setNewContactPerson('');
    setNewDescription('');
    setTimeout(() => setFeedback(null), 4000);
  };

  const filteredSchools = schools.filter(school => {
    const matchesSearch = 
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = districtFilter === 'all' || school.district === districtFilter;
    const matchesStatus = statusFilter === 'all' || school.verificationStatus === statusFilter;
    const matchesLevel = levelFilter === 'all' || school.level.toLowerCase().includes(levelFilter.toLowerCase());

    return matchesSearch && matchesDistrict && matchesStatus && matchesLevel;
  });

  return (
    <div className="space-y-6">
      
      {/* Feedback Alert */}
      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#6C3EF4]" />
            <span>All Schools Dashboard</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            National Directory of Certified Ugandan Schools, UNEB Examination Centers & Capacity Quotas
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#6C3EF4] hover:bg-[#5b32db] rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register New School</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Institutions</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">{totalSchools}</p>
          <span className="text-[11px] text-slate-400">Nationwide active registry</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Verified & Certified</span>
          <p className="text-2xl font-extrabold text-emerald-600 tabular-nums mt-1">{verifiedCount}</p>
          <span className="text-[11px] text-slate-400">MoES & UNEB compliant</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">Pending Audit</span>
          <p className="text-2xl font-extrabold text-amber-600 tabular-nums mt-1">{pendingCount}</p>
          <span className="text-[11px] text-slate-400">Awaiting inspection clearance</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-[#6C3EF4] uppercase tracking-wider">Intake Capacity</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">{totalCapacity.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">Target seats available</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search school name, center code, or district..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-slate-900 dark:text-white"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-slate-900 dark:text-white"
            >
              <option value="all">All Districts ({districts.length - 1})</option>
              {districts.filter(d => d !== 'all').map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-slate-900 dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified Only</option>
              <option value="pending">Pending Audit</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-slate-900 dark:text-white"
            >
              <option value="all">All Levels</option>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="tertiary">Tertiary / Vocational</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schools Master Table */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              Institutional Master Registry
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredSchools.length} of {schools.length} registered schools
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">School & UNEB Code</th>
                <th className="py-3 px-4">District & Campus</th>
                <th className="py-3 px-4">Level & Type</th>
                <th className="py-3 px-4">Intake Capacity</th>
                <th className="py-3 px-4">Tuition Range</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                    No schools match your search or filter parameters.
                  </td>
                </tr>
              ) : (
                filteredSchools.map((school) => (
                  <tr key={school.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-800 flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4 text-[#6C3EF4]" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{school.name}</p>
                          <span className="text-[11px] text-slate-500 tabular-nums">{school.code} · Est. {school.establishedYear}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{school.district}</span>
                      <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{school.location}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{school.type}</span>
                      <p className="text-[11px] text-slate-400">{school.level}</p>
                    </td>

                    <td className="py-3.5 px-4 tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                      {school.intakeCapacity} seats
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-[11px]">
                      {school.tuitionRange}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        school.verificationStatus === 'verified'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : school.verificationStatus === 'pending'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}>
                        {school.verificationStatus === 'verified' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {school.verificationStatus === 'pending' && <AlertCircle className="w-3 h-3 text-amber-600" />}
                        {school.verificationStatus.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedSchool(school)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                          title="View Full Inspection Dossier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>

                        {school.verificationStatus === 'pending' ? (
                          <button
                            onClick={() => handleVerify(school.id, 'verified')}
                            className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerify(school.id, school.verificationStatus === 'verified' ? 'pending' : 'verified')}
                            className="px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
                          >
                            {school.verificationStatus === 'verified' ? 'Re-audit' : 'Verify'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* School Inspection Dossier Modal */}
      {selectedSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#111827] rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#6C3EF4]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {selectedSchool.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Center Code: {selectedSchool.code} · District: {selectedSchool.district}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSchool(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 text-[11px]">Accreditation Status</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 capitalize mt-0.5">{selectedSchool.verificationStatus}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 text-[11px]">Intake Capacity</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 tabular-nums mt-0.5">{selectedSchool.intakeCapacity} Students</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 text-[11px]">Tuition Range</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">{selectedSchool.tuitionRange}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white">Institution Profile Description</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                {selectedSchool.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1.5 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block">Official Contact</span>
                <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedSchool.contactPerson}</span>
                </p>
                <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedSchool.contactEmail}</span>
                </p>
                <p className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedSchool.contactPhone}</span>
                </p>
              </div>

              <div className="space-y-1.5 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block">Campus Facilities</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedSchool.facilities?.map((f, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-purple-50 dark:bg-purple-950/50 text-[#8B5CF6] dark:text-purple-300 rounded-md font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400">
                {selectedSchool.profileViews} views · {selectedSchool.inquiriesCount} direct inquiries
              </span>
              <div className="flex items-center gap-2">
                {selectedSchool.verificationStatus !== 'verified' && (
                  <button
                    onClick={() => handleVerify(selectedSchool.id, 'verified')}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify & Grant Clearance</span>
                  </button>
                )}
                {selectedSchool.verificationStatus !== 'rejected' && (
                  <button
                    onClick={() => handleVerify(selectedSchool.id, 'rejected')}
                    className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-rose-200 cursor-pointer"
                  >
                    Reject Registration
                  </button>
                )}
                <button
                  onClick={() => setSelectedSchool(null)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New School Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#111827] rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#6C3EF4]" />
                <span>Register Institution in National Index</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSchool} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  School Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Uganda Martyrs SS Namugongo"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Institution Level
                  </label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="Primary">Primary</option>
                    <option value="Secondary (O & A Level)">Secondary (O & A Level)</option>
                    <option value="Nursery">Nursery</option>
                    <option value="Tertiary / Vocational">Tertiary / Vocational</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Boarding / Day Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="Boarding">Boarding</option>
                    <option value="Day">Day</option>
                    <option value="Day & Boarding">Day & Boarding</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    required
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    placeholder="e.g. Wakiso"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={newContactPerson}
                    onChange={(e) => setNewContactPerson(e.target.value)}
                    placeholder="e.g. Rev. Fr. Principal"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    placeholder="admissions@school.sc.ug"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    placeholder="+256 700 123456"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Brief Description & Academic Highlights
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Summary of institution credentials, academic programs, and campus facilities..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-[#6C3EF4] hover:bg-[#5b32db] rounded-xl shadow-xs cursor-pointer"
                >
                  Save to National Index
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
