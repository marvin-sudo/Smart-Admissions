import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Megaphone, 
  Award, 
  MessageSquare, 
  ShieldCheck, 
  AlertTriangle, 
  Building2, 
  ArrowRight, 
  Plus, 
  Search, 
  Eye, 
  Check, 
  Calendar, 
  Filter,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmissionsData } from '../../context/AdmissionsDataContext';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardTopNav } from './DashboardTopNav';
import { HeroBanner } from './HeroBanner';
import { MetricCard } from './MetricCard';
import { NewUpdateModal } from './NewUpdateModal';
import { MessageModal } from './MessageModal';
import { ApplicationStatus } from '../../types/admissions';
import { MySchoolProfileTab } from './School/MySchoolProfileTab';
import { SchoolApplicationsTab } from './School/SchoolApplicationsTab';
import { AdmissionsPipelineTab } from './School/AdmissionsPipelineTab';
import { SchoolUpdatesTab } from './School/SchoolUpdatesTab';
import { SchoolScholarshipsTab } from './School/SchoolScholarshipsTab';
import { ParentInquiriesTab } from './School/ParentInquiriesTab';
import { ParentLeadsTab } from './School/ParentLeadsTab';
import { SchoolSubscriptionTab } from './School/SchoolSubscriptionTab';
import { SchoolSettingsTab } from './School/SchoolSettingsTab';

export const SchoolDashboard: React.FC = () => {
  const { currentUser, navigate } = useAuth();
  const { 
    schools, 
    applications, 
    updates, 
    scholarships, 
    threads, 
    updateApplicationStatus,
    createScholarship
  } = useAdmissionsData();

  const [activeTab, setActiveTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pipelineFilter, setPipelineFilter] = useState<string>('all');
  const [selectedApplicationForStatus, setSelectedApplicationForStatus] = useState<string | null>(null);

  // Modals
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageTarget, setMessageTarget] = useState<{ id: string; name: string } | null>(null);
  const [statusChangeSuccess, setStatusChangeSuccess] = useState<string | null>(null);

  if (!currentUser) return null;

  // Retrieve authoritative school record
  const schoolRecord = schools.find(s => 
    s.id === currentUser.schoolId || s.name.toLowerCase() === (currentUser.schoolName || '').toLowerCase()
  ) || schools[0];

  const isVerified = schoolRecord.verificationStatus === 'verified';

  // Applications for this school
  const schoolApplications = applications.filter(app => 
    app.schoolId === schoolRecord.id || app.schoolName.toLowerCase() === schoolRecord.name.toLowerCase()
  );

  // Filter applications by pipeline stage & search
  const filteredApplications = schoolApplications.filter(app => {
    const matchesSearch = 
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.gradeLevel.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (pipelineFilter === 'all') return true;
    if (pipelineFilter === 'submitted') return app.status === 'Submitted';
    if (pipelineFilter === 'review') return app.status === 'Under Review' || app.status === 'Verified';
    if (pipelineFilter === 'interview') return app.status === 'Interview Scheduled';
    if (pipelineFilter === 'admitted') return app.status === 'Admitted';
    return true;
  });

  // Calculate metrics
  const acceptedCount = schoolApplications.filter(a => a.status === 'Admitted').length;
  const pendingCount = schoolApplications.filter(a => a.status === 'Submitted' || a.status === 'Under Review').length;
  const interviewCount = schoolApplications.filter(a => a.status === 'Interview Scheduled').length;

  // Filter updates for this school
  const myUpdates = updates.filter(u => u.schoolId === schoolRecord.id || u.schoolName === schoolRecord.name);
  const totalReach = myUpdates.reduce((acc, u) => acc + u.reach, 0) || 1420;

  // Handle application status change
  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    await updateApplicationStatus(applicationId, newStatus);
    setStatusChangeSuccess(`Application updated to "${newStatus}" — Parent notified.`);
    setTimeout(() => setStatusChangeSuccess(null), 3000);
    setSelectedApplicationForStatus(null);
  };

  const handleOpenMessage = (parentId: string, parentName: string) => {
    setMessageTarget({ id: parentId, name: parentName });
    setMessageModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      
      {/* 1. Left Vertical Sidebar */}
      <DashboardSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-68 flex flex-col min-w-0">
        
        {/* 2. Top Header Navigation */}
        <DashboardTopNav
          onToggleMobileMenu={() => setMobileSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search applicant names, PLE aggregates, or grades..."
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {activeTab === 'myschool' && <MySchoolProfileTab />}
          {activeTab === 'applications' && <SchoolApplicationsTab />}
          {activeTab === 'pipeline' && <AdmissionsPipelineTab />}
          {activeTab === 'updates' && <SchoolUpdatesTab />}
          {activeTab === 'scholarships' && <SchoolScholarshipsTab />}
          {activeTab === 'messages' && <ParentInquiriesTab />}
          {activeTab === 'leads' && <ParentLeadsTab />}
          {activeTab === 'subscription' && <SchoolSubscriptionTab />}
          {activeTab === 'settings' && <SchoolSettingsTab />}

          {activeTab === 'overview' && (
            <>
              {/* Verification Status Warning Banner if School is Pending */}
          {!isVerified ? (
            <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3 text-amber-900 dark:text-amber-200 shadow-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm">
                <div className="flex items-center gap-2 font-bold">
                  <span>School Verification Pending Platform Audit</span>
                  <span className="text-[10px] bg-amber-200/80 dark:bg-amber-900 px-2 py-0.5 rounded-full uppercase font-bold text-amber-900 dark:text-amber-100">
                    Audit Status: Under Review
                  </span>
                </div>
                <p className="mt-1 text-amber-800/90 dark:text-amber-300/90 leading-relaxed text-xs">
                  Your school dossier has been submitted. While our Super Admin verification team reviews your Ministry of Education credentials, you can configure your profile, set intake capacity, and draft announcements. Public parent applications open once approved.
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-3 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Educational Institution · {schoolRecord.badge || 'UNEB Center Active'}</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">Intake Capacity: {schoolRecord.intakeCapacity} Seats</span>
            </div>
          )}

          {statusChangeSuccess && (
            <div className="mb-6 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 text-purple-900 dark:text-purple-200 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-[#6C3EF4]" />
              <span>{statusChangeSuccess}</span>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Center Main Dashboard Area */}
            <div className="xl:col-span-8 space-y-8">
              
              {/* Header Greeting */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Good morning, {currentUser.name.split(' ')[0]}! 🏫
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    {schoolRecord.name} · School Control Center & Intake Operations
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setUpdateModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#6C3EF4] hover:bg-[#5B2FE3] rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Update</span>
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Public View</span>
                  </button>
                </div>
              </div>

              {/* 3. Hero Banner */}
              <HeroBanner
                badge="School Control Center"
                headline="Welcome to Your School Control Center"
                description="Manage your institution's digital presence, review student applications, publish open days, and communicate directly with prospective parents."
                primaryCtaText="Create School Update"
                onPrimaryCta={() => setUpdateModalOpen(true)}
                secondaryCtaText="Review Pipeline"
                onSecondaryCta={() => {
                  const el = document.getElementById('pipeline-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              {/* 4. School Performance Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <MetricCard
                  icon={Eye}
                  title="Profile Views"
                  value={schoolRecord.profileViews.toLocaleString()}
                  subtitle="Parent impressions"
                  badge="+18%"
                />
                <MetricCard
                  icon={MessageSquare}
                  title="Parent Inquiries"
                  value={schoolRecord.inquiriesCount}
                  subtitle="In-app chats"
                />
                <MetricCard
                  icon={FileText}
                  title="Applications"
                  value={schoolApplications.length}
                  subtitle="Total received"
                  iconBg="bg-purple-50 dark:bg-purple-950/40"
                  iconColor="text-[#6C3EF4]"
                />
                <MetricCard
                  icon={CheckCircle2}
                  title="Accepted"
                  value={acceptedCount}
                  subtitle="Enrolled students"
                  badge="Admitted"
                  badgeColor="text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40"
                  iconBg="bg-emerald-50 dark:bg-emerald-950/40"
                  iconColor="text-emerald-600"
                />
                <MetricCard
                  icon={Clock}
                  title="Pending Review"
                  value={pendingCount}
                  subtitle="Requires action"
                  badgeColor="text-amber-700 bg-amber-50"
                  iconBg="bg-amber-50 dark:bg-amber-950/40"
                  iconColor="text-amber-600"
                />
                <MetricCard
                  icon={TrendingUp}
                  title="Post Reach"
                  value={totalReach.toLocaleString()}
                  subtitle="Parents reached"
                />
              </div>

              {/* 5. Admission Pipeline Overview */}
              <div id="pipeline-section" className="bg-white dark:bg-[#111827] rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Admissions Pipeline
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Click any stage to filter candidate records
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    <button
                      onClick={() => setPipelineFilter('all')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        pipelineFilter === 'all' ? 'bg-[#6C3EF4] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      All ({schoolApplications.length})
                    </button>
                    <button
                      onClick={() => setPipelineFilter('submitted')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        pipelineFilter === 'submitted' ? 'bg-[#6C3EF4] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      New ({schoolApplications.filter(a => a.status === 'Submitted').length})
                    </button>
                    <button
                      onClick={() => setPipelineFilter('interview')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        pipelineFilter === 'interview' ? 'bg-[#6C3EF4] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Interview ({interviewCount})
                    </button>
                    <button
                      onClick={() => setPipelineFilter('admitted')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        pipelineFilter === 'admitted' ? 'bg-[#6C3EF4] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Accepted ({acceptedCount})
                    </button>
                  </div>
                </div>

                {/* Visual Pipeline Funnel Strips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div 
                    onClick={() => setPipelineFilter('submitted')}
                    className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/40 cursor-pointer hover:shadow-xs transition-all"
                  >
                    <span className="text-[11px] font-bold text-[#6C3EF4] dark:text-purple-300 uppercase tracking-wider">1. New Submissions</span>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                        {schoolApplications.filter(a => a.status === 'Submitted').length}
                      </span>
                      <span className="text-[10px] text-slate-500">To Verify</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setPipelineFilter('review')}
                    className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 cursor-pointer hover:shadow-xs transition-all"
                  >
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">2. Under Review</span>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                        {schoolApplications.filter(a => a.status === 'Under Review' || a.status === 'Verified').length}
                      </span>
                      <span className="text-[10px] text-slate-500">Academic Slip</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setPipelineFilter('interview')}
                    className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/40 cursor-pointer hover:shadow-xs transition-all"
                  >
                    <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">3. Oral Assessment</span>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                        {interviewCount}
                      </span>
                      <span className="text-[10px] text-slate-500">Scheduled</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setPipelineFilter('admitted')}
                    className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 cursor-pointer hover:shadow-xs transition-all"
                  >
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">4. Admitted</span>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                        {acceptedCount}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold">Enrolled</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Recent Applications Table */}
              <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                      Recent Candidate Applications
                    </h3>
                    <p className="text-xs text-slate-500">
                      Real-time applicant records received via Smart Admissions
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 tabular-nums">
                    Showing {filteredApplications.length} records
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100 dark:border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Applicant & Child</th>
                        <th className="py-3 px-4">Grade & Results</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {filteredApplications.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-10 text-center text-slate-400">
                            No applications match the current filter.
                          </td>
                        </tr>
                      ) : (
                        filteredApplications.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-slate-900 dark:text-white text-xs">{app.studentName}</p>
                              <p className="text-[11px] text-slate-500">{app.parentName} · {app.parentPhone || app.parentEmail}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-slate-800 dark:text-slate-200">{app.gradeLevel}</span>
                              <p className="text-[11px] text-[#6C3EF4] dark:text-purple-400 font-medium">{app.pleAggregate || 'Grade 1'}</p>
                            </td>
                            <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                              {app.submissionDate}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                app.status === 'Admitted'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                  : app.status === 'Interview Scheduled'
                                  ? 'bg-purple-100 text-[#6C3EF4] dark:bg-purple-950/60 dark:text-purple-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                {/* Status update selector */}
                                <select
                                  value={app.status}
                                  onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                                  className="text-[11px] font-semibold py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#6C3EF4]"
                                >
                                  <option value="Submitted">Submitted</option>
                                  <option value="Under Review">Under Review</option>
                                  <option value="Interview Scheduled">Interview Scheduled</option>
                                  <option value="Admitted">Admit Student</option>
                                  <option value="Rejected">Reject</option>
                                </select>

                                <button
                                  onClick={() => handleOpenMessage(app.parentId || 'parent-1', app.parentName)}
                                  className="p-1.5 text-slate-500 hover:text-[#6C3EF4] rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                                  title="Chat with Parent"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 7. School Updates Management */}
              <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Published Updates & Feed Announcements
                    </h3>
                    <p className="text-xs text-slate-500">
                      Live posts appearing on parent dashboard feeds
                    </p>
                  </div>
                  <button
                    onClick={() => setUpdateModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#6C3EF4] rounded-xl hover:bg-[#5B2FE3]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Update</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {myUpdates.map((post) => (
                    <div key={post.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6C3EF4]">
                            {post.category}
                          </span>
                          <span className="text-[10px] text-slate-400">{post.publishedAt}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                          {post.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {post.content}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{post.reach} Parents reached</span>
                        <span>{post.likes} Likes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Side Information Panel */}
            <div className="xl:col-span-4 space-y-6">
              
              {/* Institution Dossier Summary */}
              <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                  School Profile Snapshot
                </h4>
                <div className="mt-3 space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                    <span className="text-slate-500">Institution:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{schoolRecord.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                    <span className="text-slate-500">District:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">{schoolRecord.district}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                    <span className="text-slate-500">Type / Level:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">{schoolRecord.type} · {schoolRecord.level}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                    <span className="text-slate-500">Verification:</span>
                    <span className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded-full ${
                      isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {schoolRecord.verificationStatus}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Annual Intake Cap:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{schoolRecord.intakeCapacity} Students</span>
                  </div>
                </div>
              </div>

              {/* Recent Parent Inquiries */}
              <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#6C3EF4]" />
                    <span>Parent Inquiries</span>
                  </h4>
                  <span className="text-[11px] text-[#6C3EF4] font-semibold">{threads.length} active</span>
                </div>

                <div className="mt-3 space-y-3">
                  {threads.length === 0 ? (
                    <p className="py-4 text-center text-xs text-slate-400">No recent messages.</p>
                  ) : (
                    threads.map((th) => (
                      <div 
                        key={th.id}
                        onClick={() => handleOpenMessage(th.parentId, th.parentName)}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-purple-50/60 dark:hover:bg-purple-950/30 border border-slate-100 dark:border-slate-700 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{th.parentName}</span>
                          <span className="text-[10px] text-slate-400">{th.lastMessageTime}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                          {th.lastMessage}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-slate-900 rounded-2xl p-5 border border-purple-100 dark:border-purple-900/40 shadow-xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6C3EF4] dark:text-purple-300">
                  Admissions Quick Actions
                </h4>
                <div className="space-y-2">
                  <button 
                    onClick={() => setUpdateModalOpen(true)}
                    className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 shadow-xs hover:bg-purple-50 text-slate-800 dark:text-slate-200 flex items-center justify-between"
                  >
                    <span>Broadcast Intake Open Announcement</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button 
                    onClick={() => setPipelineFilter('submitted')}
                    className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 shadow-xs hover:bg-purple-50 text-slate-800 dark:text-slate-200 flex items-center justify-between"
                  >
                    <span>Review Unverified PLE Slips</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </>
      )}

    </main>
      </div>

      <NewUpdateModal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
      />

      <MessageModal
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        targetParentId={messageTarget?.id}
        targetParentName={messageTarget?.name}
      />

    </div>
  );
};
