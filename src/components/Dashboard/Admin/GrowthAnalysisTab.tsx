import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  MapPin, 
  Calendar, 
  ArrowUpRight, 
  Users, 
  Building2, 
  Award, 
  CheckCircle2, 
  Filter,
  Sparkles
} from 'lucide-react';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';

export const GrowthAnalysisTab: React.FC = () => {
  const { applications, schools, children } = useAdmissionsData();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '12m'>('30d');
  const [selectedRegion, setSelectedRegion] = useState<'Central' | 'Western' | 'Eastern' | 'Northern'>('Central');

  // Monthly data mockup for 2026 vs 2025
  const monthlyData = [
    { month: 'Jan', lastYear: 140, thisYear: 210 },
    { month: 'Feb', lastYear: 190, thisYear: 280 },
    { month: 'Mar', lastYear: 120, thisYear: 190 },
    { month: 'Apr', lastYear: 110, thisYear: 160 },
    { month: 'May', lastYear: 160, thisYear: 240 },
    { month: 'Jun', lastYear: 220, thisYear: 310 },
    { month: 'Jul', lastYear: 260, thisYear: 390 },
    { month: 'Aug', lastYear: 310, thisYear: 440 },
    { month: 'Sep', lastYear: 380, thisYear: 520 },
    { month: 'Oct', lastYear: 450, thisYear: 680 },
    { month: 'Nov', lastYear: 510, thisYear: 750 },
    { month: 'Dec', lastYear: 340, thisYear: 490 }
  ];

  const maxVal = Math.max(...monthlyData.map(d => d.thisYear));

  // Regional breakdown
  const regionalBreakdown = [
    { region: 'Central' as const, percentage: 54, color: 'bg-[#6C3EF4]', districts: ['Wakiso (38%)', 'Kampala (32%)', 'Mukono (18%)', 'Luweero (12%)'] },
    { region: 'Western' as const, percentage: 22, color: 'bg-indigo-500', districts: ['Mbarara (42%)', 'Kabale (28%)', 'Fort Portal (18%)', 'Kasese (12%)'] },
    { region: 'Eastern' as const, percentage: 14, color: 'bg-emerald-500', districts: ['Jinja (46%)', 'Mbale (30%)', 'Soroti (14%)', 'Tororo (10%)'] },
    { region: 'Northern' as const, percentage: 10, color: 'bg-amber-500', districts: ['Gulu (52%)', 'Lira (28%)', 'Arua (15%)', 'Kitgum (5%)'] }
  ];

  // Funnel steps
  const funnelSteps = [
    { label: 'Platform Profile Views', count: 24800, rate: '100%', color: 'bg-purple-200 dark:bg-purple-900/40 text-[#6C3EF4]' },
    { label: 'Parent School Inquiries', count: 6420, rate: '25.8%', color: 'bg-indigo-200 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' },
    { label: 'Applications Submitted', count: 2680, rate: '41.7%', color: 'bg-blue-200 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' },
    { label: 'Academic Slips Verified', count: 1920, rate: '71.6%', color: 'bg-emerald-200 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' },
    { label: 'Admissions Granted', count: 1480, rate: '77.0%', color: 'bg-emerald-500 text-white' }
  ];

  // Top School Demand Leaderboard
  const topSchools = [
    { name: 'Gayaza High School', district: 'Wakiso', apps: 420, capacity: 280, fillRate: 150 },
    { name: 'St. Mary’s College Kisubi', district: 'Wakiso', apps: 580, capacity: 300, fillRate: 193 },
    { name: 'King’s College Budo', district: 'Wakiso', apps: 390, capacity: 260, fillRate: 150 },
    { name: 'Greenhill Academy', district: 'Kampala', apps: 340, capacity: 240, fillRate: 141 },
    { name: 'Mt. St. Mary’s Namagunga', district: 'Mukono', apps: 290, capacity: 220, fillRate: 131 }
  ];

  return (
    <div className="space-y-6">

      {/* Header and Time Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#6C3EF4]" />
            <span>Growth Analysis & Intake Intelligence</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            National trends across school digital adoption, geographic applicant distribution & conversion efficiency
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
          {(['7d', '30d', '90d', '12m'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                timeRange === range 
                  ? 'bg-white dark:bg-slate-700 text-[#6C3EF4] dark:text-purple-300 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Applicants</span>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +34.8%
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">2,680</p>
          <span className="text-[11px] text-slate-400">YoY volume expansion</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Capacity Fill Rate</span>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +12.4%
            </span>
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 tabular-nums mt-1">78.4%</p>
          <span className="text-[11px] text-slate-400">Target seats reserved</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6C3EF4] uppercase tracking-wider">Conversion Ratio</span>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +8.1%
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">41.7%</p>
          <span className="text-[11px] text-slate-400">Inquiry to submission</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">Avg Placement Speed</span>
            <span className="text-[10px] font-bold text-blue-600">Fast Track</span>
          </div>
          <p className="text-2xl font-extrabold text-blue-600 tabular-nums mt-1">4.2 Days</p>
          <span className="text-[11px] text-slate-400">Review to admission letter</span>
        </div>
      </div>

      {/* Chart 1: Monthly Intake Trend (2025 vs 2026) */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              Nationwide Monthly Application Intake Trend
            </h3>
            <p className="text-xs text-slate-500">
              Comparative intake volume across Uganda's primary and secondary admission cycles
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-xs bg-slate-300 dark:bg-slate-700" />
              <span>2025 Cycle</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#6C3EF4] dark:text-purple-300">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#6C3EF4]" />
              <span>2026 Cycle (Current)</span>
            </span>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div className="pt-6 pb-2">
          <div className="h-52 flex items-end justify-between gap-2 sm:gap-4 px-2">
            {monthlyData.map((item) => {
              const heightPct = Math.round((item.thisYear / maxVal) * 100);
              const lastYearPct = Math.round((item.lastYear / maxVal) * 100);

              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-md">
                    <p className="font-bold">{item.month} 2026: {item.thisYear} Apps</p>
                    <p className="text-slate-300">2025: {item.lastYear} Apps</p>
                  </div>

                  <div className="w-full flex items-end justify-center gap-1 h-44">
                    {/* Last year bar */}
                    <div 
                      className="w-1/2 bg-slate-200 dark:bg-slate-800 rounded-t-sm transition-all duration-300"
                      style={{ height: `${lastYearPct}%` }}
                    />
                    {/* This year bar */}
                    <div 
                      className="w-1/2 bg-[#6C3EF4] hover:bg-[#5b32db] rounded-t-sm transition-all duration-300"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>

                  <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Regional Distribution & Admissions Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Regional Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#6C3EF4]" />
              <span>Regional Demographic Distribution</span>
            </h3>
            <p className="text-xs text-slate-500">
              Applicant volume grouped by Ugandan administrative regions
            </p>
          </div>

          {/* Regional Progress Bars */}
          <div className="space-y-3 pt-2">
            {regionalBreakdown.map((reg) => (
              <div 
                key={reg.region}
                onClick={() => setSelectedRegion(reg.region)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedRegion === reg.region 
                    ? 'border-[#8B5CF6] bg-purple-50/50 dark:bg-purple-950/30' 
                    : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex justify-between text-xs mb-1.5 font-bold">
                  <span className="text-slate-900 dark:text-white">{reg.region} Uganda</span>
                  <span className="text-[#6C3EF4] dark:text-purple-300 tabular-nums">{reg.percentage}%</span>
                </div>

                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${reg.color}`} style={{ width: `${reg.percentage}%` }} />
                </div>

                {selectedRegion === reg.region && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-purple-100 dark:border-purple-900/60">
                    {reg.districts.map((d, i) => (
                      <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs">
                        {d}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Admissions Conversion Funnel (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#6C3EF4]" />
              <span>Full Admissions Funnel Efficiency</span>
            </h3>
            <p className="text-xs text-slate-500">
              Progression from discovery impressions to formal school enrollment
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            {funnelSteps.map((step, index) => (
              <div 
                key={index} 
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {step.label}
                  </span>
                  <span className="text-[11px] text-slate-500 tabular-nums">
                    Step {index + 1} · {step.rate} stage conversion
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black tabular-nums text-slate-900 dark:text-white block">
                    {step.count.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600">
                    {Math.round((step.count / 24800) * 100)}% of total reach
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top 5 In-Demand Schools Leaderboard */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-[#6C3EF4]" />
            <span>Top In-Demand Institutions (Intake Pressure Index)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Schools with highest applicant-to-capacity subscription ratios
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Rank & School</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Total Applicants</th>
                <th className="py-3 px-4">Intake Ceiling</th>
                <th className="py-3 px-4">Demand Ratio</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {topSchools.map((sch, i) => (
                <tr key={i} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-[#6C3EF4] font-black text-[10px] flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span>{sch.name}</span>
                  </td>

                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {sch.district}
                  </td>

                  <td className="py-3 px-4 tabular-nums font-bold text-slate-900 dark:text-white">
                    {sch.apps}
                  </td>

                  <td className="py-3 px-4 tabular-nums text-slate-500">
                    {sch.capacity} seats
                  </td>

                  <td className="py-3 px-4 tabular-nums font-extrabold text-[#6C3EF4] dark:text-purple-300">
                    {sch.fillRate}% Capacity Pressure
                  </td>

                  <td className="py-3 px-4 text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      High Demand
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
