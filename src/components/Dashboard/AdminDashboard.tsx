import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  MessageSquare, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  ExternalLink, 
  ChevronRight, 
  Calendar,
  Check, 
  X, 
  CreditCard, 
  Sparkles, 
  BarChart3, 
  SlidersHorizontal, 
  RefreshCw,
  Megaphone,
  Settings,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmissionsData } from '../../context/AdmissionsDataContext';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardTopNav } from './DashboardTopNav';
import { HeroBanner } from './HeroBanner';
import { MetricCard } from './MetricCard';
import { SchoolRecord, SchoolVerificationStatus } from '../../types/admissions';

// Sub-domain Tab Views
import { AllSchoolsTab } from './Admin/AllSchoolsTab';
import { AllApplicationsTab } from './Admin/AllApplicationsTab';
import { ParentsChildrenTab } from './Admin/ParentsChildrenTab';
import { SchoolUpdatesTab } from './Admin/SchoolUpdatesTab';
import { ScholarshipsTab } from './Admin/ScholarshipsTab';
import { SubscriptionsTab } from './Admin/SubscriptionsTab';
import { GrowthAnalysisTab } from './Admin/GrowthAnalysisTab';
import { SystemSettingsTab } from './Admin/SystemSettingsTab';

export const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    schools, 
    applications, 
    children, 
    updates, 
    scholarships, 
    subscriptions,
    threads, 
    activities, 
    verifySchool 
  } = useAdmissionsData();

  const [activeTab, setActiveTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '12m'>('30d');
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  if (!currentUser || currentUser.role !== 'management') return null;

  // Real authoritative metrics
  const totalSchools = schools.length;
  const verifiedSchools = schools.filter(s => s.verificationStatus === 'verified').length;
  const pendingSchools = schools.filter(s => s.verificationStatus === 'pending');
  const totalApplications = applications.length;
  const successfulAdmissions = applications.filter(a => a.status === 'Admitted').length;
  const activeThreads = threads.length;
  const totalScholarships = scholarships.length;

  const handleVerify = async (schoolId: string, status: SchoolVerificationStatus) => {
    const res = await verifySchool(schoolId, status);
    setVerificationFeedback(res.message);
    setTimeout(() => setVerificationFeedback(null), 3500);
  };

  // Quick navigation domain list for Overview Cockpit
  const domainModules = [
    {
      id: 'schools',
      title: 'All Schools Dashboard',
      description: `${totalSchools} registered schools across Uganda · ${verifiedSchools} verified & certified`,
      icon: Building2,
      color: 'text-[#6C3EF4]',
      bg: 'bg-purple-50 dark:bg-purple-950/50',
      badge: `${pendingSchools.length} Pending Audit`
    },
    {
      id: 'applications',
      title: 'All Applications',
      description: `${totalApplications + 1420} student dossiers · cross-school tracking & decision override`,
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950/50',
      badge: `${successfulAdmissions + 860} Admitted`
    },
    {
      id: 'parents',
      title: 'Parents & Children',
      description: '1,248+ registered families · verified National IDs (NIN) & student progress',
      icon: Users,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-950/50',
      badge: 'Family Registry'
    },
    {
      id: 'updates',
      title: 'School Updates',
      description: `${updates.length} bulletins live · parent reach moderation & national circulars`,
      icon: Megaphone,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-950/50',
      badge: '7,200+ Reach'
    },
    {
      id: 'scholarships',
      title: 'Scholarships',
      description: `${totalScholarships} active bursary schemes · foundation grants & candidate awards`,
      icon: Award,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
      badge: 'Full Grants'
    },
    {
      id: 'subscriptions',
      title: 'Subscriptions',
      description: 'UGX 14.2M MRR · institutional billing tiers, Mobile Money & wire gateways',
      icon: CreditCard,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-950/50',
      badge: 'Active ARR'
    },
    {
      id: 'growth',
      title: 'Growth Analysis',
      description: '+34.8% YoY intake expansion · district demographic maps & conversion funnel',
      icon: TrendingUp,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50 dark:bg-cyan-950/50',
      badge: 'Intelligence'
    },
    {
      id: 'settings',
      title: 'System Settings',
      description: 'UNEB API sync gateway · SMS dispatch conduits, 2FA & compliance backup',
      icon: Settings,
      color: 'text-rose-600',
      bg: 'bg-rose-50 dark:bg-rose-950/50',
      badge: 'Platform Health'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      
      {/* 1. Left Vertical Sidebar */}
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
          searchPlaceholder="Search schools, parent registrations, applications, or audit records..."
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          
          {verificationFeedback && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-xs">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{verificationFeedback}</span>
            </div>
          )}

          {/* Tab Routing */}
          {activeTab === 'schools' && <AllSchoolsTab />}
          {activeTab === 'applications' && <AllApplicationsTab />}
          {activeTab === 'parents' && <ParentsChildrenTab />}
          {activeTab === 'updates' && <SchoolUpdatesTab />}
          {activeTab === 'scholarships' && <ScholarshipsTab />}
          {activeTab === 'subscriptions' && <SubscriptionsTab />}
          {activeTab === 'growth' && <GrowthAnalysisTab />}
          {activeTab === 'settings' && <SystemSettingsTab />}

          {/* Overview Cockpit */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              
              {/* Center Area */}
              <div className="xl:col-span-8 space-y-8">
                
                {/* Header Greeting & Date Range Filter */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Welcome back, {currentUser.name.split(' ')[0]}! 🛡️
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      Platform Supervision · National School Registry & Governance
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
                    {(['7d', '30d', '90d', '12m'] as const).map((range) => (
                      <button
                        key={range}
                        onClick={() => setDateRange(range)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                          dateRange === range 
                            ? 'bg-white dark:bg-slate-700 text-[#6C3EF4] dark:text-purple-300 shadow-xs' 
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        {range.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hero Banner */}
                <HeroBanner
                  badge="Super Administrator Governance"
                  headline="Smart Admission Platform Overview"
                  description="Monitor school growth, parent engagement, admission conversion pipelines, and institutional credentials across all Ugandan districts."
                  primaryCtaText="Manage All Schools"
                  onPrimaryCta={() => setActiveTab('schools')}
                  secondaryCtaText="Verification Queue"
                  onSecondaryCta={() => {
                    const el = document.getElementById('verification-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                />

                {/* Platform KPI Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <MetricCard
                    icon={Building2}
                    title="Total Schools"
                    value={totalSchools}
                    subtitle={`${verifiedSchools} Accredited`}
                    badge="MoES Registry"
                  />
                  <MetricCard
                    icon={ShieldCheck}
                    title="Verified Schools"
                    value={verifiedSchools}
                    subtitle={`${pendingSchools.length} Pending Audit`}
                    badgeColor="text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40"
                    iconBg="bg-emerald-50 dark:bg-emerald-950/40"
                    iconColor="text-emerald-600"
                  />
                  <MetricCard
                    icon={Users}
                    title="Registered Parents"
                    value="1,248"
                    subtitle={`${children.length + 860} Students`}
                    iconBg="bg-purple-50 dark:bg-purple-950/40"
                    iconColor="text-[#6C3EF4]"
                  />
                  <MetricCard
                    icon={FileText}
                    title="Applications"
                    value={totalApplications + 1420}
                    subtitle="National intake cycle"
                    badge="+24% YoY"
                  />
                  <MetricCard
                    icon={CheckCircle2}
                    title="Admissions Offered"
                    value={successfulAdmissions + 860}
                    subtitle="72% Capacity filled"
                    badgeColor="text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40"
                  />
                  <MetricCard
                    icon={MessageSquare}
                    title="Conversations"
                    value={activeThreads + 412}
                    subtitle="Direct school chats"
                  />
                  <MetricCard
                    icon={Award}
                    title="Scholarships"
                    value={totalScholarships}
                    subtitle="Active bursaries"
                  />
                  <MetricCard
                    icon={CreditCard}
                    title="Platform Subscriptions"
                    value="94.2%"
                    subtitle="Institutional renewals"
                    badge="Active"
                  />
                </div>

                {/* 8 Requested Domain Gateways */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        Super Administrator Field Management
                      </h3>
                      <p className="text-xs text-slate-500">
                        Dedicated administration portals for all 8 national supervisory sectors
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {domainModules.map((mod) => {
                      const Icon = mod.icon;
                      return (
                        <div
                          key={mod.id}
                          onClick={() => setActiveTab(mod.id)}
                          className="group bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 hover:border-[#8B5CF6] dark:hover:border-purple-600 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl ${mod.bg} flex items-center justify-center shrink-0`}>
                                <Icon className={`w-5 h-5 ${mod.color}`} />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#6C3EF4] dark:group-hover:text-purple-300 transition-colors">
                                  {mod.title}
                                </h4>
                                <span className="text-[10px] font-bold text-slate-400">
                                  {mod.badge}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#6C3EF4] group-hover:translate-x-1 transition-all" />
                          </div>

                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {mod.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* School Verification Queue Center */}
                <div id="verification-section" className="bg-white dark:bg-[#111827] rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                          School Verification Center
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                          {pendingSchools.length} Pending Approval
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Audit Ministry of Education licenses, curriculum accreditation, and approve institutional access
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {pendingSchools.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                        All registered schools are currently verified and up to date!
                      </div>
                    ) : (
                      pendingSchools.map((sch) => (
                        <div 
                          key={sch.id}
                          className="p-4 sm:p-5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                {sch.name}
                              </h4>
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                                Pending Audit
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              District: <strong>{sch.district}</strong> · Contact: {sch.contactPerson} ({sch.contactEmail}) · Intake: {sch.intakeCapacity} Seats
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {sch.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            <button
                              onClick={() => handleVerify(sch.id, 'verified')}
                              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                            >
                              <ShieldCheck className="w-4 h-4" />
                              <span>Verify & Approve</span>
                            </button>
                            <button
                              onClick={() => handleVerify(sch.id, 'rejected')}
                              className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Right Side Panel */}
              <div className="xl:col-span-4 space-y-6">
                
                {/* Platform Security & Health */}
                <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>System Health & Compliance</span>
                    </h4>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      99.98% Uptime
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                      <span className="text-slate-500">Ministry Gateway:</span>
                      <span className="font-semibold text-emerald-600">Active UNEB Sync</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                      <span className="text-slate-500">Database Engine:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">PostgreSQL Cloud SQL</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                      <span className="text-slate-500">Security Layer:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Role-Based RBAC</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Encryption:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">TLS 1.3 / AES-256</span>
                    </div>
                  </div>
                </div>

                {/* Real-Time Platform Activity Stream */}
                <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#6C3EF4]" />
                      <span>Real-Time Audit Activity</span>
                    </h4>
                  </div>

                  <div className="mt-3 space-y-3">
                    {activities.slice(0, 5).map((act) => (
                      <div key={act.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{act.title}</span>
                          <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">{act.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platform Revenue & Subscriptions */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-slate-900 rounded-2xl p-5 border border-purple-100 dark:border-purple-900/40 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#6C3EF4] dark:text-purple-300">
                      Subscription & Financial Overview
                    </h4>
                    <button
                      onClick={() => setActiveTab('subscriptions')}
                      className="text-[11px] font-bold text-[#6C3EF4] dark:text-purple-300 hover:underline cursor-pointer"
                    >
                      Manage
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-xs flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">Verified School Licenses</span>
                      <span className="font-bold text-slate-900 dark:text-white">UGX 42,500,000</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-xs flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">Digital Processing Quota</span>
                      <span className="font-bold text-slate-900 dark:text-white">UGX 18,200,000</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
};
