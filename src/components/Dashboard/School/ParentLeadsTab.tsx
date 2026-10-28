import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  Flame, 
  Calendar, 
  CheckCircle2, 
  Download, 
  ArrowRight, 
  UserCheck, 
  Clock, 
  Filter, 
  Sparkles,
  MapPin,
  X
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';

interface ParentLead {
  id: string;
  parentName: string;
  phone: string;
  email: string;
  district: string;
  childName: string;
  targetGrade: string;
  pleAggregate: string;
  temperature: 'hot' | 'warm' | 'new';
  source: string;
  lastContacted: string;
  status: 'new' | 'contacted' | 'applied';
}

const INITIAL_LEADS: ParentLead[] = [
  {
    id: 'lead-01',
    parentName: 'Grace Mugisha',
    phone: '+256 772 123456',
    email: 'grace.mugisha@gmail.com',
    district: 'Kampala (Kololo)',
    childName: 'Trevor Mugisha',
    targetGrade: 'Senior 1 (S.1)',
    pleAggregate: '4 Aggregates (Div 1)',
    temperature: 'hot',
    source: 'Saved School Shortlist',
    lastContacted: '2 days ago',
    status: 'applied'
  },
  {
    id: 'lead-02',
    parentName: 'Patrick Byaruhanga',
    phone: '+256 701 443322',
    email: 'patrick.byaruhanga@unra.go.ug',
    district: 'Mukono Central',
    childName: 'Joshua Byaruhanga',
    targetGrade: 'Senior 1 (S.1)',
    pleAggregate: '6 Aggregates (Div 1)',
    temperature: 'hot',
    source: 'Directory Profile Inquirer',
    lastContacted: 'Yesterday',
    status: 'contacted'
  },
  {
    id: 'lead-03',
    parentName: 'Dr. Sarah Byanyima',
    phone: '+256 772 881122',
    email: 'sarah.byanyima@makerere.ac.ug',
    district: 'Kampala (Naguru)',
    childName: 'Chloe Byanyima',
    targetGrade: 'Senior 1 (S.1)',
    pleAggregate: '5 Aggregates (Div 1)',
    temperature: 'warm',
    source: 'STEM Bursary Inquirer',
    lastContacted: '3 days ago',
    status: 'new'
  },
  {
    id: 'lead-04',
    parentName: 'David Kasumba',
    phone: '+256 700 332211',
    email: 'david.kasumba@stanbic.com',
    district: 'Wakiso (Entebbe)',
    childName: 'Brian Kasumba',
    targetGrade: 'Senior 1 (S.1)',
    pleAggregate: '7 Aggregates (Div 1)',
    temperature: 'warm',
    source: 'Open Day Bulletin Viewer',
    lastContacted: 'Oct 22, 2026',
    status: 'contacted'
  },
  {
    id: 'lead-05',
    parentName: 'Edward Namubiru',
    phone: '+256 752 987654',
    email: 'edward.namubiru@gmail.com',
    district: 'Jinja (Walukuba)',
    childName: 'Daniel Namubiru',
    targetGrade: 'Senior 5 (S.5 Physics/Chem/Math)',
    pleAggregate: 'Div 1 (UCE 12 Aggregates)',
    temperature: 'new',
    source: 'Directory Profile View',
    lastContacted: 'Oct 24, 2026',
    status: 'new'
  }
];

export const ParentLeadsTab: React.FC = () => {
  const { currentUser } = useAuth();
  const [leads, setLeads] = useState<ParentLead[]>(INITIAL_LEADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [temperatureFilter, setTemperatureFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery);

    const matchesTemp = temperatureFilter === 'all' || l.temperature === temperatureFilter;
    return matchesSearch && matchesTemp;
  });

  const handleUpdateStatus = (leadId: string, newStatus: 'new' | 'contacted' | 'applied') => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus, lastContacted: 'Just now' } : l));
    setToastMessage('Lead record status updated and contact logged.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportCSV = () => {
    const headers = 'ID,Parent Name,Phone,Email,District,Child Name,Grade,PLE Score,Temperature,Source,Status\n';
    const rows = leads.map(l => 
      `"${l.id}","${l.parentName}","${l.phone}","${l.email}","${l.district}","${l.childName}","${l.targetGrade}","${l.pleAggregate}","${l.temperature}","${l.source}","${l.status}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `parent_leads_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
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

      {/* Header and Export Tools */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Prospective Parent Leads CRM
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] dark:text-purple-300">
              {leads.length} Identified Leads
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Engage prospective families who saved your institution or inspected your admissions prospectus.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Leads CSV</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Leads</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 tabular-nums">{leads.length}</p>
          <span className="text-[10px] text-slate-500">From digital channels</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">High Interest (Hot)</span>
          <p className="text-2xl font-black text-rose-600 mt-2 tabular-nums">
            {leads.filter(l => l.temperature === 'hot').length}
          </p>
          <span className="text-[10px] text-slate-500">Shortlisted school</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Converted to Apps</span>
          <p className="text-2xl font-black text-emerald-600 mt-2 tabular-nums">
            {leads.filter(l => l.status === 'applied').length}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold">Official dossiers received</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Division 1 Learners</span>
          <p className="text-2xl font-black text-[#6C3EF4] mt-2 tabular-nums">100%</p>
          <span className="text-[10px] text-slate-500">4 to 7 Aggregates</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by parent, child, district, or phone..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6C3EF4]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
          <button
            onClick={() => setTemperatureFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
              temperatureFilter === 'all' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
            }`}
          >
            All Leads
          </button>
          <button
            onClick={() => setTemperatureFilter('hot')}
            className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
              temperatureFilter === 'hot' ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
            }`}
          >
            Hot (Ready to Apply)
          </button>
          <button
            onClick={() => setTemperatureFilter('warm')}
            className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
              temperatureFilter === 'warm' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
            }`}
          >
            Warm
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Parent Guardian</th>
                <th className="py-3.5 px-4">Candidate Child</th>
                <th className="py-3.5 px-4">District</th>
                <th className="py-3.5 px-4">Interest Level</th>
                <th className="py-3.5 px-4">Lead Source</th>
                <th className="py-3.5 px-4">Follow-Up Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 dark:text-white block">{lead.parentName}</span>
                    <span className="text-[11px] text-slate-500">{lead.phone}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">{lead.childName}</span>
                    <span className="text-[11px] text-[#6C3EF4] font-medium">{lead.targetGrade} · {lead.pleAggregate}</span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{lead.district}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      lead.temperature === 'hot'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        : lead.temperature === 'warm'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {lead.temperature === 'hot' && <Flame className="w-3 h-3 text-rose-600" />}
                      <span className="uppercase">{lead.temperature}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    {lead.source}
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateStatus(lead.id, e.target.value as any)}
                      className="text-[11px] font-bold py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    >
                      <option value="new">New Lead</option>
                      <option value="contacted">Contacted via Call/SMS</option>
                      <option value="applied">Application Submitted</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <a
                      href={`tel:${lead.phone}`}
                      className="px-2.5 py-1.5 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-[#6C3EF4] dark:text-purple-300 rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </a>
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
