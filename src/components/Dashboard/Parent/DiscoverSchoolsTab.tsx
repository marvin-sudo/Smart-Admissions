import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Bookmark, 
  ArrowRight, 
  MessageSquare, 
  SlidersHorizontal, 
  Sparkles, 
  Building2, 
  GraduationCap, 
  Users, 
  Star, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Calendar, 
  X,
  FileText,
  DollarSign,
  Grid,
  List
} from 'lucide-react';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';
import { SchoolRecord } from '../../../types/admissions';
import { QuickApplyModal } from '../QuickApplyModal';
import { MessageModal } from '../MessageModal';

export const DiscoverSchoolsTab: React.FC = () => {
  const { schools, savedSchoolIds, toggleSaveSchool } = useAdmissionsData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals
  const [selectedSchoolForApply, setSelectedSchoolForApply] = useState<SchoolRecord | null>(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [messageTarget, setMessageTarget] = useState<{ id: string; name: string } | null>(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [detailModalSchool, setDetailModalSchool] = useState<SchoolRecord | null>(null);

  // Extract unique districts
  const districts = Array.from(new Set(schools.map(s => s.district))).filter(Boolean);

  // Filtered Schools
  const filteredSchools = schools.filter(school => {
    const matchesSearch = 
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.facilities.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDistrict = selectedDistrict === 'all' || school.district.toLowerCase() === selectedDistrict.toLowerCase();
    const matchesLevel = selectedLevel === 'all' || school.level.toLowerCase().includes(selectedLevel.toLowerCase());
    const matchesType = selectedType === 'all' || school.type.toLowerCase().includes(selectedType.toLowerCase());

    return matchesSearch && matchesDistrict && matchesLevel && matchesType;
  });

  const handleOpenApply = (school: SchoolRecord) => {
    setSelectedSchoolForApply(school);
    setApplyModalOpen(true);
  };

  const handleOpenMessage = (school: SchoolRecord) => {
    setMessageTarget({ id: school.id, name: school.name });
    setMessageModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#6C3EF4] to-[#4F28C9] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/15 backdrop-blur-xs text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>National Verified Directory · Uganda MoES Accredited</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Discover Top Schools in Uganda
          </h1>
          <p className="mt-2 text-sm text-purple-100 leading-relaxed">
            Compare premier boarding and day institutions, review UNEB performance credentials, inspect school tuition structures, and submit digital admissions directly.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by school name, district, facilities, or curriculum..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C3EF4]/30 focus:border-[#6C3EF4]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-end md:self-auto shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-[#1F2937] text-[#6C3EF4] dark:text-purple-300 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'list' 
                  ? 'bg-white dark:bg-[#1F2937] text-[#6C3EF4] dark:text-purple-300 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Multi-facet dropdown filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#6C3EF4]"
            >
              <option value="all">All Districts</option>
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">Education Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#6C3EF4]"
            >
              <option value="all">All Levels</option>
              <option value="secondary">Secondary (O & A Level)</option>
              <option value="primary">Primary</option>
              <option value="nursery">Nursery / Kindergarten</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">Boarding / Day</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#6C3EF4]"
            >
              <option value="all">All School Types</option>
              <option value="boarding">Boarding Only</option>
              <option value="day">Day Only</option>
              <option value="day & boarding">Day & Boarding</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">Status</label>
            <div className="flex items-center h-9 px-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs text-[#6C3EF4] dark:text-purple-300 font-semibold justify-between">
              <span>{filteredSchools.length} Institutions</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Schools Results */}
      {filteredSchools.length === 0 ? (
        <div className="bg-white dark:bg-[#111827] rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-[#6C3EF4] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No schools match your search filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your district or curriculum filters, or search using broader school names.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDistrict('all');
              setSelectedLevel('all');
              setSelectedType('all');
            }}
            className="px-4 py-2 bg-[#6C3EF4] text-white text-xs font-bold rounded-xl hover:bg-[#5B2FE3] transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSchools.map((school) => {
            const isSaved = savedSchoolIds.includes(school.id);
            return (
              <div 
                key={school.id}
                className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700/70 transition-all flex flex-col justify-between group"
              >
                <div className="p-5">
                  {/* Top Row: Initial Crest & Bookmark */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] dark:text-purple-300 font-black text-sm flex items-center justify-center border border-purple-200 dark:border-purple-800 shrink-0">
                        {school.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                          {school.badge || `Code: ${school.code}`}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#6C3EF4] dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                            {school.name}
                          </h3>
                          {school.verificationStatus === 'verified' && (
                            <span title="MoES & Smart Admissions Verified">
                              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSaveSchool(school.id)}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        isSaved 
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-600' 
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500'
                      }`}
                      title={isSaved ? 'Remove from Saved' : 'Save School to Shortlist'}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Location & Meta */}
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {school.location}
                    </span>
                    <span>·</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 shrink-0">{school.type}</span>
                  </div>

                  {/* Description snippet */}
                  <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {school.description}
                  </p>

                  {/* Facilities list */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {school.facilities.slice(0, 3).map((f, i) => (
                      <span 
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                      >
                        {f}
                      </span>
                    ))}
                    {school.facilities.length > 3 && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md text-slate-400">
                        +{school.facilities.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Fee Estimate Row */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Estimated Tuition:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white tabular-nums">
                      {school.tuitionRange}
                    </span>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="px-5 pb-5 pt-1 flex items-center gap-2 border-t border-slate-50 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
                  <button
                    onClick={() => setDetailModalSchool(school)}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    View Dossier
                  </button>

                  <button
                    onClick={() => handleOpenApply(school)}
                    className="flex-1 py-2 px-3 bg-[#6C3EF4] hover:bg-[#5B2FE3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleOpenMessage(school)}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:text-[#6C3EF4] bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
                    title="Encrypted Inquiry with School"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredSchools.map((school) => {
            const isSaved = savedSchoolIds.includes(school.id);
            return (
              <div key={school.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] font-black text-sm flex items-center justify-center shrink-0">
                    {school.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {school.name}
                      </h3>
                      {school.verificationStatus === 'verified' && (
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-[#6C3EF4] dark:text-purple-300">
                        {school.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {school.location} · {school.level}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl line-clamp-1">
                      {school.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-[11px] text-slate-400">Tuition</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{school.tuitionRange.split('-')[0]}</p>
                  </div>

                  <button
                    onClick={() => toggleSaveSchool(school.id)}
                    className={`p-2 rounded-xl border cursor-pointer ${
                      isSaved ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 text-slate-400 hover:text-rose-500'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>

                  <button
                    onClick={() => setDetailModalSchool(school)}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl cursor-pointer"
                  >
                    Dossier
                  </button>

                  <button
                    onClick={() => handleOpenApply(school)}
                    className="px-4 py-2 bg-[#6C3EF4] hover:bg-[#5B2FE3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* School Full Dossier Modal */}
      {detailModalSchool && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] font-black text-lg flex items-center justify-center">
                  {detailModalSchool.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{detailModalSchool.name}</h3>
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500">{detailModalSchool.location} · {detailModalSchool.badge}</p>
                </div>
              </div>

              <button
                onClick={() => setDetailModalSchool(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block font-bold">ESTABLISHED</span>
                <span className="font-bold text-slate-900 dark:text-white">{detailModalSchool.establishedYear || 1905}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-bold">TYPE</span>
                <span className="font-bold text-slate-900 dark:text-white">{detailModalSchool.type}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-bold">ANNUAL INTAKE</span>
                <span className="font-bold text-slate-900 dark:text-white">{detailModalSchool.intakeCapacity || 280} Students</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-bold">VERIFICATION</span>
                <span className="font-bold text-emerald-600">MoES Certified</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">About Institution</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {detailModalSchool.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Campus Facilities & Infrastructure</h4>
              <div className="grid grid-cols-2 gap-2">
                {detailModalSchool.facilities.map((fac, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-purple-50/60 dark:bg-purple-950/30 text-xs text-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6C3EF4] shrink-0" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Admissions Desk Direct Contacts</h4>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {detailModalSchool.contactPhone}</span>
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {detailModalSchool.contactEmail}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setDetailModalSchool(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const target = detailModalSchool;
                  setDetailModalSchool(null);
                  handleOpenMessage(target);
                }}
                className="px-4 py-2 text-xs font-bold text-[#6C3EF4] bg-purple-50 dark:bg-purple-950/60 rounded-xl hover:bg-purple-100"
              >
                Inquire via Encrypted Message
              </button>
              <button
                onClick={() => {
                  const target = detailModalSchool;
                  setDetailModalSchool(null);
                  handleOpenApply(target);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-[#6C3EF4] hover:bg-[#5B2FE3] rounded-xl shadow-xs"
              >
                Start Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <QuickApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        selectedSchool={selectedSchoolForApply}
      />

      <MessageModal
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        targetSchoolId={messageTarget?.id}
        targetSchoolName={messageTarget?.name}
      />
    </div>
  );
};
