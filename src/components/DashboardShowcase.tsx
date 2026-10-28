import React, { useState, useEffect } from 'react';
import { 
  School, 
  Users, 
  BarChart3, 
  Calendar, 
  Download, 
  CheckCircle, 
  Clock, 
  Plus,
  RefreshCw
} from 'lucide-react';
import { RECENT_APPLICATIONS } from '../data/mockData';
import { PortalType, ApplicationStatus } from '../types/admissions';
import { ScrollReveal } from './ScrollReveal';
import { useAuth } from '../context/AuthContext';

interface DashboardShowcaseProps {
  currentTab?: PortalType;
  onTabChange?: (tab: PortalType) => void;
}

export const DashboardShowcase: React.FC<DashboardShowcaseProps> = ({ currentTab, onTabChange }) => {
  const { currentUser, logout } = useAuth();
  const [internalTab, setInternalTab] = useState<PortalType>('school');
  const activeTab = currentTab ?? internalTab;

  const setActiveTab = (tab: PortalType) => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };

  useEffect(() => {
    if (currentUser?.role) {
      setActiveTab(currentUser.role);
    }
  }, [currentUser]);

  const [selectedYear, setSelectedYear] = useState<string>('2026/2027');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Admitted':
        return 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/50';
      case 'Verified':
        return 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/50';
      case 'Interview Scheduled':
        return 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 border border-purple-200/80 dark:border-purple-800/50';
      case 'Under Review':
        return 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/50';
      case 'Pending Documents':
        return 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-800/50';
      default:
        return 'text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <section id="dashboard-showcase" className="py-20 lg:py-28 bg-white dark:bg-[#0B0F19] border-t border-slate-100 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#0000B7] dark:text-purple-300 bg-[#F5F3FF] dark:bg-purple-950/40 px-3 py-1 rounded-md border border-[#8B5CF6]/20 dark:border-purple-800/40">
            Interactive Product Preview
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-4 text-balance">
            See Your Admissions Process at a Glance.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            Switch between views below to explore how Smart Admissions transforms operations for every stakeholder.
          </p>

          {/* Interactive Portal Tabs */}
          <div className="inline-flex p-1.5 bg-slate-100/90 dark:bg-slate-900/90 rounded-xl mt-8 max-w-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <button
              onClick={() => setActiveTab('school')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'school'
                  ? 'bg-white dark:bg-slate-800 text-[#0000B7] dark:text-purple-300 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <School className="w-4 h-4 text-[#0000B7] dark:text-purple-400" />
              <span>School Portal</span>
            </button>

            <button
              onClick={() => setActiveTab('parent')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'parent'
                  ? 'bg-white dark:bg-slate-800 text-[#8B5CF6] dark:text-purple-300 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-[#8B5CF6]" />
              <span>Parent Portal</span>
            </button>

            <button
              onClick={() => setActiveTab('management')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'management'
                  ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
              <span>Management Dashboard</span>
            </button>
          </div>
        </ScrollReveal>

        {/* Action feedback banner if triggered */}
        {actionNotice && (
          <div className="mb-4 max-w-md mx-auto p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-medium flex items-center justify-between shadow-xs">
            <span>{actionNotice}</span>
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
          </div>
        )}

        {/* Main Interactive Product Frame */}
        <ScrollReveal delay={150}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden">
          
          {/* Top Browser / App chrome */}
          <div className="bg-slate-950 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono text-slate-300">
                https://portal.smartadmissions.ug/{activeTab}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs bg-slate-900 px-3 py-1 rounded-md border border-slate-800 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Academic Cycle:</span>
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-transparent font-semibold text-white focus:outline-hidden cursor-pointer"
                >
                  <option value="2026/2027" className="bg-slate-900">2026/2027 (Current)</option>
                  <option value="2025/2026" className="bg-slate-900">2025/2026 (Archived)</option>
                </select>
              </div>

              <button 
                onClick={() => handleAction('Refreshed latest application synchronization')}
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                title="Refresh feed"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sub-layout: Sidebar + Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
            
            {/* Left Sidebar Navigation */}
            <div className="lg:col-span-3 bg-slate-50 dark:bg-slate-950/70 border-r border-slate-200/80 dark:border-slate-800 p-5 flex flex-col justify-between">
              <div className="space-y-6">
                
                {/* Organization Label */}
                <div className="flex items-center gap-2.5 px-2 py-1">
                  <div className="w-8 h-8 rounded-lg bg-[#0000B7] dark:bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                    {activeTab === 'school' ? 'GHS' : activeTab === 'parent' ? 'PAR' : 'DIR'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {activeTab === 'school' 
                        ? 'Gayaza High School' 
                        : activeTab === 'parent' 
                        ? 'Family Portal (Mugisha)' 
                        : 'Uganda Education Directorate'}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {activeTab === 'school' ? 'School Registrar Desk' : activeTab === 'parent' ? 'Parent / Guardian ID #8821' : 'Multi-Campus Executive'}
                    </p>
                  </div>
                </div>

                {/* Sidebar Menu Links */}
                <div className="space-y-1 text-xs font-medium">
                  <p className="px-3 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-2">
                    {activeTab === 'school' ? 'Admissions Workspace' : activeTab === 'parent' ? 'Student Dashboard' : 'Consolidated Governance'}
                  </p>

                  {activeTab === 'school' && (
                    <>
                      <div className="px-3 py-2 rounded-lg bg-[#0000B7] text-white font-semibold flex items-center justify-between">
                        <span>All Applications</span>
                        <span className="font-mono text-[11px] bg-white/20 px-1.5 py-0.2 rounded">1,482</span>
                      </div>
                      <div className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between">
                        <span>Awaiting Verification</span>
                        <span className="font-mono text-[11px] text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.2 rounded">142</span>
                      </div>
                      <div className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between">
                        <span>Interview Cohorts</span>
                        <span className="font-mono text-[11px] text-[#8B5CF6] dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 px-1.5 py-0.2 rounded">3</span>
                      </div>
                      <div className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer">
                        <span>Admitted Register</span>
                      </div>
                      <div className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer">
                        <span>Fee Requirements</span>
                      </div>
                    </>
                  )}

                  {activeTab === 'parent' && (
                    <>
                      <div className="px-3 py-2 rounded-lg bg-[#8B5CF6] text-white font-semibold flex items-center justify-between">
                        <span>Active Applications</span>
                        <span className="font-mono text-[11px] bg-white/20 px-1.5 py-0.2 rounded">2</span>
                      </div>
                      <div className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between">
                        <span>Document Vault</span>
                        <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">5 Files</span>
                      </div>
                      <div className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer">
                        <span>Admission Letters</span>
                      </div>
                      <div className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer">
                        <span>Messages from Schools</span>
                      </div>
                      <div className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer">
                        <span>School Directory Search</span>
                      </div>
                    </>
                  )}

                  {activeTab === 'management' && (
                    <>
                      <div className="px-3 py-2 rounded-lg bg-indigo-700 text-white font-semibold flex items-center justify-between">
                        <span>Network Analytics</span>
                        <span className="font-mono text-[11px] bg-white/20 px-1.5 py-0.2 rounded">8 Schools</span>
                      </div>
                      <div className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between">
                        <span>Capacity vs Fill Ratio</span>
                        <span className="font-mono text-[11px] text-[#0000B7] dark:text-purple-300 bg-blue-100 dark:bg-purple-950/60 px-1.5 py-0.2 rounded">86%</span>
                      </div>
                      <div className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer">
                        <span>Quota Compliance</span>
                      </div>
                      <div className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer">
                        <span>Executive Board Reports</span>
                      </div>
                      <div className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer">
                        <span>Staff Access Control</span>
                      </div>
                    </>
                  )}
                </div>

              </div>

              {/* Sidebar Footer info */}
              <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                <p className="font-medium text-slate-700 dark:text-slate-300">Official Portal Session</p>
                <p>Data encrypted & verified</p>
              </div>
            </div>

            {/* Right Main Content Area */}
            <div className="lg:col-span-9 p-5 sm:p-7 flex flex-col justify-between space-y-6">
              
              {/* VIEW 1: SCHOOL PORTAL */}
              {activeTab === 'school' && (
                <div className="space-y-6">
                  
                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        Senior 1 & Senior 5 Admissions Queue
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Gayaza High School · Intake 2026/2027
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button 
                        onClick={() => handleAction('Exported 1,482 applicant records to CSV')}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                        <span>Export CSV</span>
                      </button>

                      <button 
                        onClick={() => handleAction('Opened candidate manual entry modal')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Applicant</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Total Inflow</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5">1,482</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Target capacity: 320</p>
                    </div>
                    <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/30">
                      <p className="text-[11px] font-medium text-amber-800 dark:text-amber-300">Pending Review</p>
                      <p className="text-lg font-bold text-amber-900 dark:text-amber-200 font-mono mt-0.5">142</p>
                      <p className="text-[10px] text-amber-700 dark:text-amber-400">Needs staff check</p>
                    </div>
                    <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/30">
                      <p className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300">Admitted</p>
                      <p className="text-lg font-bold text-emerald-900 dark:text-emerald-200 font-mono mt-0.5">280</p>
                      <p className="text-[10px] text-emerald-700 dark:text-emerald-400">87.5% of quota filled</p>
                    </div>
                    <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/30">
                      <p className="text-[11px] font-medium text-purple-800 dark:text-purple-300">Interviews</p>
                      <p className="text-lg font-bold text-purple-900 dark:text-purple-200 font-mono mt-0.5">85</p>
                      <p className="text-[10px] text-purple-700 dark:text-purple-400">Session: Saturday</p>
                    </div>
                  </div>

                  {/* Admissions Trend Chart Simulator */}
                  <div className="p-4 bg-slate-50/60 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">Weekly Application Volume by Class</span>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0000B7] dark:bg-[#8B5CF6]" /> S.1
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] dark:bg-purple-400" /> S.5
                        </span>
                      </div>
                    </div>

                    {/* CSS Bar Chart */}
                    <div className="h-28 flex items-end gap-3 sm:gap-6 pt-2 pb-1 px-2 border-b border-slate-200 dark:border-slate-800">
                      {[
                        { label: 'Week 1', s1: 45, s5: 20 },
                        { label: 'Week 2', s1: 78, s5: 42 },
                        { label: 'Week 3', s1: 160, s5: 85 },
                        { label: 'Week 4 (PLE)', s1: 290, s5: 140 },
                        { label: 'Week 5', s1: 340, s5: 180 },
                        { label: 'Current', s1: 210, s5: 95 },
                      ].map((bar, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                          <div className="w-full flex items-end justify-center gap-1">
                            <div 
                              className="w-1/2 bg-[#0000B7] dark:bg-[#8B5CF6] rounded-t-sm transition-all group-hover:brightness-110" 
                              style={{ height: `${(bar.s1 / 340) * 85}%` }}
                              title={`S.1: ${bar.s1}`}
                            />
                            <div 
                              className="w-1/2 bg-[#8B5CF6] dark:bg-purple-400 rounded-t-sm transition-all group-hover:brightness-110" 
                              style={{ height: `${(bar.s5 / 340) * 85}%` }}
                              title={`S.5: ${bar.s5}`}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-full text-center">
                            {bar.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Applicants Table */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3">Applicant Name</th>
                          <th className="py-2.5 px-3">Class</th>
                          <th className="py-2.5 px-3">UNEB Aggregates</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Quick Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {RECENT_APPLICATIONS.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-2.5 px-3">
                              <p className="font-bold text-slate-900 dark:text-white">{app.studentName}</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{app.id}</p>
                            </td>
                            <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">{app.gradeLevel}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400">{app.pleAggregate}</td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getStatusBadge(app.status)}`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button 
                                onClick={() => handleAction(`Triggered review for ${app.studentName}`)}
                                className="text-[#0000B7] dark:text-purple-400 hover:underline font-semibold cursor-pointer"
                              >
                                Review File
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* VIEW 2: PARENT PORTAL */}
              {activeTab === 'parent' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Welcome, Grace Mugisha
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Tracking active applications for child: Trevor Mugisha
                    </p>
                  </div>

                  {/* Active Application Card */}
                  <div className="bg-[#F5F3FF]/50 dark:bg-slate-800/40 border border-[#8B5CF6]/30 dark:border-[#8B5CF6]/40 rounded-2xl p-5 sm:p-6 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/70 dark:border-slate-800">
                      <div>
                        <span className="text-[11px] font-semibold text-[#0000B7] dark:text-purple-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-[#0000B7]/20 dark:border-purple-800/40">
                          Senior 1 (S.1 Intake 2026)
                        </span>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                          St. Mary’s College Kisubi
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Application Reference: #ADM-2026-0142 · Submitted 12 mins ago</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-950/60 text-[#0000B7] dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                          Status: Verified
                        </span>
                      </div>
                    </div>

                    {/* Milestone Progress Bar */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Application Milestones</p>
                      <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                        <div className="p-2 bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-lg font-medium border border-emerald-300 dark:border-emerald-800">
                          <CheckCircle className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-700 dark:text-emerald-400" />
                          1. Submitted
                        </div>
                        <div className="p-2 bg-blue-100 dark:bg-blue-950/60 text-[#0000B7] dark:text-blue-300 rounded-lg font-semibold border border-blue-300 dark:border-blue-800">
                          <CheckCircle className="w-3.5 h-3.5 mx-auto mb-1 text-[#0000B7] dark:text-blue-400" />
                          2. Verified
                        </div>
                        <div className="p-2 bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 rounded-lg">
                          <Clock className="w-3.5 h-3.5 mx-auto mb-1 text-slate-400" />
                          3. Interview
                        </div>
                        <div className="p-2 bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 rounded-lg">
                          <Clock className="w-3.5 h-3.5 mx-auto mb-1 text-slate-400" />
                          4. Official Letter
                        </div>
                      </div>
                    </div>

                    {/* Uploaded Documents List */}
                    <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <span>Submitted Documents (4/4)</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-normal">All clear</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 flex items-center justify-between">
                          <span className="text-slate-700 dark:text-slate-300 font-medium">PLE Examination Slip (4 Agg)</span>
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">Verified</span>
                        </div>
                        <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 flex items-center justify-between">
                          <span className="text-slate-700 dark:text-slate-300 font-medium">National Birth Certificate</span>
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">Verified</span>
                        </div>
                        <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 flex items-center justify-between">
                          <span className="text-slate-700 dark:text-slate-300 font-medium">Passport Photo (Trevor)</span>
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">Accepted</span>
                        </div>
                        <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 flex items-center justify-between">
                          <span className="text-slate-700 dark:text-slate-300 font-medium">Primary Leaving Testimonial</span>
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">Attached</span>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps Card */}
                    <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 rounded-xl flex items-center justify-between text-xs text-[#0000B7] dark:text-blue-300">
                      <div>
                        <p className="font-bold">Next Milestone: Entrance Oral Interview</p>
                        <p className="text-slate-600 dark:text-slate-400 mt-0.5">Date scheduled: Saturday 28th October, 9:00 AM at St. Mary's Kisubi Hall.</p>
                      </div>
                      <button 
                        onClick={() => handleAction('Downloaded Interview Pass slip')}
                        className="px-3 py-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg font-semibold cursor-pointer shrink-0 transition-colors"
                      >
                        Download Pass
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* VIEW 3: MANAGEMENT DASHBOARD */}
              {activeTab === 'management' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        Multi-School Admissions Intelligence
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Central Directorate Oversight · 8 Participating Institutions
                      </p>
                    </div>
                    <button 
                      onClick={() => handleAction('Compiled Executive Admissions Digest (PDF)')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg shadow-xs cursor-pointer self-start transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Executive Digest</span>
                    </button>
                  </div>

                  {/* Multi-School Comparison Table */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3">School Name</th>
                          <th className="py-2.5 px-3">District</th>
                          <th className="py-2.5 px-3">Applications</th>
                          <th className="py-2.5 px-3">Capacity Target</th>
                          <th className="py-2.5 px-3">Fill Rate</th>
                          <th className="py-2.5 px-3 text-right">Oversight Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {[
                          { name: 'St. Mary’s College Kisubi', district: 'Wakiso', apps: '1,482', cap: '320', rate: '88%', status: 'Optimal' },
                          { name: 'Gayaza High School', district: 'Wakiso', apps: '1,290', cap: '300', rate: '92%', status: 'Optimal' },
                          { name: 'King’s College Budo', district: 'Wakiso', apps: '1,340', cap: '320', rate: '85%', status: 'Optimal' },
                          { name: 'Greenhill Academy (Kibuli & Buwaate)', district: 'Kampala', apps: '980', cap: '280', rate: '79%', status: 'In Review' },
                          { name: 'Uganda Martyrs S.S Namugongo', district: 'Wakiso', apps: '1,650', cap: '350', rate: '94%', status: 'Optimal' }
                        ].map((sch, i) => (
                          <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                            <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{sch.name}</td>
                            <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{sch.district}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-900 dark:text-slate-200">{sch.apps}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400">{sch.cap}</td>
                            <td className="py-2.5 px-3 font-mono font-semibold text-[#0000B7] dark:text-purple-400">{sch.rate}</td>
                            <td className="py-2.5 px-3 text-right">
                              <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                                {sch.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Strategic demographic insight */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Aggregate Cut-off Distribution</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">68% of candidates present with Aggregate 4 to 8 in UNEB Primary Leaving Examinations.</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Regional Coverage</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Central (Kampala, Wakiso, Mukono) represents 64% of applicants; Western, Eastern, and Northern regions represent 36%.</p>
                    </div>
                  </div>

                </div>
              )}

              {/* Bottom Quick Action Bar */}
              <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Showing real synchronized mock data
                </span>
                <span className="font-mono text-slate-400 dark:text-slate-500">
                  Smart Admissions v2.4 · All African Curriculums Supported
                </span>
              </div>

            </div>
          </div>
        </div>
      </ScrollReveal>

      </div>
    </section>
  );
};
