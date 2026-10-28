import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Bookmark, 
  Award, 
  Building2, 
  ArrowRight, 
  Search, 
  Heart, 
  MessageSquare, 
  Calendar, 
  Check, 
  Plus, 
  Sparkles, 
  MapPin, 
  ChevronRight,
  Filter,
  GraduationCap,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmissionsData } from '../../context/AdmissionsDataContext';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardTopNav } from './DashboardTopNav';
import { HeroBanner } from './HeroBanner';
import { MetricCard } from './MetricCard';
import { QuickApplyModal } from './QuickApplyModal';
import { AddChildModal } from './AddChildModal';
import { MessageModal } from './MessageModal';
import { SchoolRecord, ApplicationStatus } from '../../types/admissions';
import { DiscoverSchoolsTab } from './Parent/DiscoverSchoolsTab';
import { MyApplicationsTab } from './Parent/MyApplicationsTab';
import { EncryptedMessagesTab } from './Parent/EncryptedMessagesTab';
import { ScholarshipsTab } from './Parent/ScholarshipsTab';
import { SavedSchoolsTab } from './Parent/SavedSchoolsTab';
import { MyChildrenTab } from './Parent/MyChildrenTab';
import { NotificationsTab } from './Parent/NotificationsTab';
import { ParentProfileTab } from './Parent/ParentProfileTab';
import { ParentSettingsTab } from './Parent/ParentSettingsTab';

export const ParentDashboard: React.FC = () => {
  const { currentUser, logout, navigate } = useAuth();
  const { 
    schools, 
    applications, 
    children, 
    updates, 
    scholarships, 
    threads, 
    savedSchoolIds, 
    toggleSaveSchool,
    likeSchoolUpdate
  } = useAdmissionsData();

  const [activeTab, setActiveTab] = useState('home');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Modals state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedSchoolForApply, setSelectedSchoolForApply] = useState<SchoolRecord | null>(null);
  const [addChildOpen, setAddChildOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageTarget, setMessageTarget] = useState<{ id: string; name: string } | null>(null);

  if (!currentUser) return null;

  // Filtered applications belonging to this parent
  const myApplications = applications.filter(app => 
    !app.parentId || app.parentId === currentUser.id || app.parentEmail === currentUser.email
  );

  const pendingApplications = myApplications.filter(app => 
    app.status === 'Submitted' || app.status === 'Under Review' || app.status === 'Interview Scheduled' || app.status === 'Pending Documents'
  );

  const admittedApplications = myApplications.filter(app => 
    app.status === 'Admitted'
  );

  // Filtered schools based on search query and level/type
  const filteredSchools = schools.filter(school => {
    const matchesSearch = 
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = filterLevel === 'all' || school.level.toLowerCase().includes(filterLevel.toLowerCase());
    const matchesType = filterType === 'all' || school.type.toLowerCase().includes(filterType.toLowerCase());

    return matchesSearch && matchesLevel && matchesType;
  });

  const handleOpenApply = (school: SchoolRecord) => {
    setSelectedSchoolForApply(school);
    setApplyModalOpen(true);
  };

  const handleOpenMessage = (schoolId: string, schoolName: string) => {
    setMessageTarget({ id: schoolId, name: schoolName });
    setMessageModalOpen(true);
  };

  const getApplicationStep = (status: ApplicationStatus) => {
    switch (status) {
      case 'Submitted': return 1;
      case 'Verified': return 2;
      case 'Under Review': return 2;
      case 'Interview Scheduled': return 3;
      case 'Admitted': return 4;
      default: return 1;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      
      {/* 1. Left Vertical Sidebar (Lingora style) */}
      <DashboardSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 lg:pl-68 flex flex-col min-w-0">
        
        {/* 2. Top Header Navigation */}
        <DashboardTopNav
          onToggleMobileMenu={() => setMobileSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search schools, scholarships, districts, or levels..."
        />

        {/* Content Area with 2-Column Split (Main Content + Right Side Panel) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {activeTab === 'discover' && <DiscoverSchoolsTab />}
          {activeTab === 'applications' && <MyApplicationsTab onNavigateToDiscover={() => setActiveTab('discover')} />}
          {activeTab === 'messages' && <EncryptedMessagesTab />}
          {activeTab === 'scholarships' && <ScholarshipsTab />}
          {activeTab === 'saved' && <SavedSchoolsTab onNavigateToDiscover={() => setActiveTab('discover')} />}
          {activeTab === 'children' && <MyChildrenTab onNavigateToDiscover={() => setActiveTab('discover')} />}
          {activeTab === 'notifications' && <NotificationsTab onSelectTab={setActiveTab} />}
          {activeTab === 'profile' && <ParentProfileTab />}
          {activeTab === 'settings' && <ParentSettingsTab />}

          {activeTab === 'home' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Main Center Column (Tabs / Feed / Discovery) */}
            <div className="xl:col-span-8 space-y-8">
              
              {/* Personalized Welcome Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Good morning, {currentUser.name.split(' ')[0]}! 👋
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Find the right school and unlock new opportunities for your children.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAddChildOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#6C3EF4] dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 rounded-xl border border-purple-200 dark:border-purple-800 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Child</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('discover')}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#6C3EF4] hover:bg-[#5B2FE3] rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Find Schools</span>
                  </button>
                </div>
              </div>

              {/* 3. Main Hero Banner */}
              <HeroBanner
                badge="Uganda National School Admissions"
                headline="Find the Right School for Your Child"
                description="Discover accredited day and boarding schools, explore merit scholarships, and submit applications directly online without physical queues."
                primaryCtaText="Explore Schools"
                onPrimaryCta={() => {
                  const el = document.getElementById('schools-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else setActiveTab('discover');
                }}
                secondaryCtaText="View My Applications"
                onSecondaryCta={() => {
                  const el = document.getElementById('applications-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else setActiveTab('applications');
                }}
              />

              {/* 4. Parent Summary KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <MetricCard
                  icon={Users}
                  title="My Children"
                  value={children.length}
                  subtitle="Registered in family"
                  onClick={() => setAddChildOpen(true)}
                />
                <MetricCard
                  icon={FileText}
                  title="Applications"
                  value={myApplications.length}
                  subtitle="Total dossiers submitted"
                  onClick={() => setActiveTab('applications')}
                />
                <MetricCard
                  icon={Clock}
                  title="Pending Review"
                  value={pendingApplications.length}
                  subtitle="Awaiting committee"
                  badge="In Progress"
                  badgeColor="text-amber-600 bg-amber-50 dark:bg-amber-950/40"
                />
                <MetricCard
                  icon={CheckCircle2}
                  title="Admission Offers"
                  value={admittedApplications.length}
                  subtitle="Official letters issued"
                  badge="Offers Ready"
                  badgeColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"
                  iconBg="bg-emerald-50 dark:bg-emerald-950/40"
                  iconColor="text-emerald-600 dark:text-emerald-400"
                />
              </div>

              {/* 5. Continue Your Admission Journey (Application Progress Cards) */}
              <div id="applications-section" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Continue Your Admission Journey
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Live milestone progress for each of your child's applications
                    </p>
                  </div>
                  {myApplications.length > 0 && (
                    <span className="text-xs font-semibold text-slate-400 tabular-nums">
                      {myApplications.length} active
                    </span>
                  )}
                </div>

                {myApplications.length === 0 ? (
                  <div className="bg-white dark:bg-[#111827] rounded-2xl p-8 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/50 text-[#6C3EF4] rounded-2xl flex items-center justify-center mx-auto">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">No applications submitted yet</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Discover participating secondary and primary schools below to start your child’s admission journey.
                    </p>
                    <button
                      onClick={() => setActiveTab('discover')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#6C3EF4] rounded-xl hover:bg-[#5B2FE3]"
                    >
                      <span>Explore Schools</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myApplications.map((app) => {
                      const currentStep = getApplicationStep(app.status);
                      return (
                        <div 
                          key={app.id}
                          className="bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-purple-300 dark:hover:border-purple-600 transition-all"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                  {app.studentName}'s Application
                                </h4>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  app.status === 'Admitted'
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : app.status === 'Interview Scheduled'
                                    ? 'bg-purple-100 text-[#6C3EF4] dark:bg-purple-950/60 dark:text-purple-300'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                }`}>
                                  {app.status}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                <strong className="text-slate-700 dark:text-slate-200 font-semibold">{app.schoolName}</strong> · Applying for: {app.gradeLevel} · Aggregate: {app.pleAggregate || 'Div 1'}
                              </p>
                            </div>

                            <button
                              onClick={() => handleOpenMessage(app.schoolId || 'sch-gayaza-01', app.schoolName)}
                              className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#6C3EF4] dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 rounded-xl transition-colors cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Message School</span>
                            </button>
                          </div>

                          {/* Progress Stepper Bar */}
                          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-medium text-slate-400 mb-1.5">
                              <span className={currentStep >= 1 ? 'text-[#6C3EF4] dark:text-purple-400 font-bold' : ''}>1. Submitted</span>
                              <span className={currentStep >= 2 ? 'text-[#6C3EF4] dark:text-purple-400 font-bold' : ''}>2. Review</span>
                              <span className={currentStep >= 3 ? 'text-[#6C3EF4] dark:text-purple-400 font-bold' : ''}>3. Assessment</span>
                              <span className={currentStep >= 4 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>4. Decision</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden flex">
                              <div 
                                className={`h-full transition-all duration-500 ${
                                  app.status === 'Admitted' ? 'bg-emerald-500' : 'bg-gradient-to-r from-[#6C3EF4] to-[#8B5CF6]'
                                }`}
                                style={{ width: `${(currentStep / 4) * 100}%` }}
                              />
                            </div>
                            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                              <span>Submitted on {app.submissionDate}</span>
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {app.timeline && app.timeline.length > 0
                                  ? app.timeline[app.timeline.length - 1]?.description
                                  : 'Under active committee evaluation'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 6. Featured Schools Discovery Grid */}
              <div id="schools-section" className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Featured Partner Schools
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Accredited educational institutions with verified intakes
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    <button
                      onClick={() => setFilterLevel('all')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        filterLevel === 'all' 
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' 
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      All Levels
                    </button>
                    <button
                      onClick={() => setFilterLevel('secondary')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        filterLevel === 'secondary' 
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' 
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Secondary
                    </button>
                    <button
                      onClick={() => setFilterLevel('primary')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        filterLevel === 'primary' 
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' 
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Primary
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredSchools.map((school) => {
                    const isSaved = savedSchoolIds.includes(school.id);
                    return (
                      <div 
                        key={school.id}
                        className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        {/* School Header Card */}
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-800/60 flex items-center justify-center font-bold text-[#6C3EF4] text-sm shrink-0">
                              {school.name.substring(0, 2).toUpperCase()}
                            </div>

                            <button
                              onClick={() => toggleSaveSchool(school.id)}
                              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                                isSaved 
                                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-600' 
                                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500'
                              }`}
                              title={isSaved ? 'Remove from Saved' : 'Save School'}
                            >
                              <Bookmark className="w-4 h-4 fill-current" />
                            </button>
                          </div>

                          <div className="mt-3">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                {school.name}
                              </h4>
                              {school.verificationStatus === 'verified' && (
                                <span title="Verified by MoES & Smart Admissions">
                                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {school.location}
                              </span>
                              <span>·</span>
                              <span>{school.type}</span>
                            </div>

                            <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                              {school.description}
                            </p>

                            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] flex items-center justify-between text-slate-500">
                              <span>Tuition Estimate:</span>
                              <span className="font-bold text-slate-900 dark:text-white">{school.tuitionRange.split('-')[0]}</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="px-5 pb-5 pt-1 flex items-center gap-2">
                          <button
                            onClick={() => handleOpenApply(school)}
                            className="flex-1 py-2.5 px-3 bg-[#6C3EF4] hover:bg-[#5B2FE3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>Apply Now</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenMessage(school.id, school.name)}
                            className="p-2.5 text-slate-600 dark:text-slate-300 hover:text-[#6C3EF4] bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
                            title="Message school admissions office"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 7. Opportunities for Your Child (Scholarships & Grants) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Opportunities & Scholarships
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Merit bursaries, STEM grants, and leadership discounts
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#6C3EF4] dark:text-purple-300">
                    {scholarships.length} Available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {scholarships.map((sch) => (
                    <div 
                      key={sch.id}
                      className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                            {sch.coverage}
                          </span>
                          <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                            Deadline: {sch.deadline}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                          {sch.title}
                        </h4>
                        <p className="text-xs text-[#6C3EF4] dark:text-purple-400 font-semibold mt-0.5">
                          {sch.schoolName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                          {sch.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">{sch.educationLevel}</span>
                        <button
                          onClick={() => {
                            const targetSchool = schools.find(s => s.id === sch.schoolId);
                            if (targetSchool) handleOpenApply(targetSchool);
                          }}
                          className="text-xs font-bold text-[#6C3EF4] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Apply for Opportunity</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8. School Updates Feed */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    School Updates & Announcements Feed
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Direct news, intake bulletins, and academic achievements from schools
                  </p>
                </div>

                <div className="space-y-4">
                  {updates.map((post) => (
                    <article 
                      key={post.id}
                      className="bg-white dark:bg-[#111827] rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] font-bold flex items-center justify-center text-xs">
                            {post.schoolName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                {post.schoolName}
                              </h4>
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <span className="text-[11px] text-slate-400">{post.publishedAt} · {post.category}</span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/50 text-[#6C3EF4] dark:text-purple-300">
                          {post.category}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {post.title}
                      </h4>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {post.content}
                      </p>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        <button
                          onClick={() => likeSchoolUpdate(post.id)}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                            post.hasLiked 
                              ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' 
                              : 'text-slate-500 hover:text-rose-600 hover:bg-slate-50'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${post.hasLiked ? 'fill-current' : ''}`} />
                          <span className="tabular-nums">{post.likes}</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenMessage(post.schoolId, post.schoolName)}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-lg"
                          >
                            Inquire
                          </button>
                          <button
                            onClick={() => {
                              const targetSchool = schools.find(s => s.id === post.schoolId);
                              if (targetSchool) handleOpenApply(targetSchool);
                            }}
                            className="px-4 py-1.5 text-xs font-bold text-white bg-[#6C3EF4] hover:bg-[#5B2FE3] rounded-lg shadow-xs"
                          >
                            {post.ctaText || 'Apply Now'}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

            </div>

            {/* 9. Parent Right-Side Panel on Large Screens (Lingora style) */}
            <div className="xl:col-span-4 space-y-6">
              
              {/* Upcoming Deadlines */}
              <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#6C3EF4]" />
                    <span>Upcoming Deadlines</span>
                  </h4>
                </div>

                <div className="mt-3 space-y-3">
                  <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">SMACK STEM Grant</span>
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">Nov 20</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Senior One intake cutoff for STEM candidates.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Gayaza Leadership Bursary</span>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">Nov 30</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Interviews for shortlisted all-round candidates.</p>
                  </div>
                </div>
              </div>

              {/* Recent Messages with Schools */}
              <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#6C3EF4]" />
                    <span>School Conversations</span>
                  </h4>
                  <span className="text-[11px] text-[#6C3EF4] font-semibold">{threads.length} chats</span>
                </div>

                <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800/80">
                  {threads.length === 0 ? (
                    <p className="py-4 text-center text-xs text-slate-400">No active messages yet.</p>
                  ) : (
                    threads.slice(0, 3).map((th) => (
                      <div 
                        key={th.id}
                        onClick={() => handleOpenMessage(th.schoolId, th.schoolName)}
                        className="py-3 flex items-start gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl px-2 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-[#6C3EF4] font-bold flex items-center justify-center text-xs shrink-0">
                          {th.schoolName.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {th.schoolName}
                            </span>
                            <span className="text-[10px] text-slate-400">{th.lastMessageTime}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {th.lastMessage}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* My Registered Children Summary */}
              <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#6C3EF4]" />
                    <span>My Registered Children</span>
                  </h4>
                  <button
                    onClick={() => setAddChildOpen(true)}
                    className="text-[11px] font-bold text-[#6C3EF4] hover:underline cursor-pointer"
                  >
                    + Add
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  {children.map((child) => (
                    <div key={child.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{child.name}</p>
                        <p className="text-[11px] text-slate-500">{child.gradeApplyingFor} · {child.pleAggregate || 'Grade Verified'}</p>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-[#6C3EF4]">
                        {child.gender}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admission Tips Card */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-slate-900 rounded-2xl p-5 border border-purple-100 dark:border-purple-900/40 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6C3EF4] dark:text-purple-300 flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Admissions Guide Tip</span>
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Schools with boarding facilities evaluate candidate behavioral references alongside UNEB scores. Keep digital copies of baptismal or recommendation letters ready for instant verification.
                </p>
              </div>

            </div>
          </div>
        )}

        </main>
      </div>

      {/* Interactive Modals */}
      <QuickApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        selectedSchool={selectedSchoolForApply}
      />

      <AddChildModal
        isOpen={addChildOpen}
        onClose={() => setAddChildOpen(false)}
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
