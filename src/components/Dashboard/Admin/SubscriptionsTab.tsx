import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  DollarSign, 
  Download, 
  FileText, 
  Zap, 
  Building2, 
  Check, 
  X, 
  Receipt 
} from 'lucide-react';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';
import { SubscriptionRecord, SubscriptionTier, SubscriptionStatus } from '../../../types/admissions';

export const SubscriptionsTab: React.FC = () => {
  const { subscriptions, updateSubscription, addAuditLog } = useAdmissionsData();

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingSub, setEditingSub] = useState<SubscriptionRecord | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier>('School Growth');
  const [receiptSub, setReceiptSub] = useState<SubscriptionRecord | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Financial calculations
  const totalMRR = subscriptions.reduce((acc, s) => {
    if (s.status !== 'Active') return acc;
    const monthly = s.billingCycle === 'Annual' ? Math.round(s.amountUgx / 12) : Math.round(s.amountUgx / 3);
    return acc + monthly;
  }, 0);

  const totalARR = totalMRR * 12;
  const activeSubs = subscriptions.filter(s => s.status === 'Active').length;

  const filteredSubs = subscriptions.filter(sub => {
    const matchesSearch = 
      sub.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.contactEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTier = tierFilter === 'all' || sub.plan === tierFilter;
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;

    return matchesSearch && matchesTier && matchesStatus;
  });

  const handleUpdatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub) return;

    updateSubscription(editingSub.schoolId, selectedPlan);

    addAuditLog({
      actorName: 'Dr. Ronald Mukasa',
      actorRole: 'Super Administrator',
      action: 'Institutional Subscription Plan Altered',
      target: editingSub.schoolName,
      details: `Updated tier to ${selectedPlan}.`,
      ipAddress: '196.43.102.14',
      status: 'success'
    });

    setFeedback(`Subscription for ${editingSub.schoolName} updated to ${selectedPlan}.`);
    setEditingSub(null);
    setTimeout(() => setFeedback(null), 3500);
  };

  const getTierColor = (plan: SubscriptionTier) => {
    switch (plan) {
      case 'Institutional Premier':
        return 'bg-purple-100 text-[#6C3EF4] dark:bg-purple-950/60 dark:text-purple-300';
      case 'School Growth':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6">

      {/* Feedback banner */}
      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#6C3EF4]" />
            <span>Institutional Subscriptions & SaaS Billing</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage school SaaS tiers, Mobile Money / Bank gateways, MRR cash flows & billing licenses
          </p>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Estimated MRR</span>
          <p className="text-xl sm:text-2xl font-extrabold text-[#6C3EF4] tabular-nums mt-1">
            UGX {totalMRR.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400">Monthly recurring income</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Annualized ARR</span>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 tabular-nums mt-1">
            UGX {totalARR.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400">100% institutional retention</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">Active Schools</span>
          <p className="text-xl sm:text-2xl font-extrabold text-blue-600 tabular-nums mt-1">{activeSubs}</p>
          <span className="text-[11px] text-slate-400">Subscribed institutions</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">MoMo & Wire Gateways</span>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">99.9%</p>
          <span className="text-[11px] text-slate-400">Payment settlement uptime</span>
        </div>
      </div>

      {/* Plan Tier Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Free Starter
          </span>
          <h4 className="text-base font-black text-slate-900 dark:text-white">UGX 0 <span className="text-xs font-normal text-slate-400">/ forever</span></h4>
          <p className="text-xs text-slate-500">
            Basic institutional listing, cap of 50 student inquiries per year, community forum support.
          </p>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 border border-blue-200 dark:border-blue-900/60 shadow-xs space-y-2 bg-gradient-to-b from-blue-50/40 to-white dark:from-blue-950/20 dark:to-[#111827]">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
            School Growth
          </span>
          <h4 className="text-base font-black text-slate-900 dark:text-white">UGX 850,000 <span className="text-xs font-normal text-slate-400">/ term</span></h4>
          <p className="text-xs text-slate-500">
            Unlimited applications, parent SMS push notifications, online entrance tests, verified school badge.
          </p>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 border border-purple-200 dark:border-purple-900/60 shadow-xs space-y-2 bg-gradient-to-b from-purple-50/40 to-white dark:from-purple-950/20 dark:to-[#111827]">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] dark:text-purple-300">
            Institutional Premier
          </span>
          <h4 className="text-base font-black text-slate-900 dark:text-white">UGX 1,750,000 <span className="text-xs font-normal text-slate-400">/ term</span></h4>
          <p className="text-xs text-slate-500">
            Dedicated UNEB API sync gateway, multi-campus governance, custom brand portal, 24/7 VIP priority support.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search school name, payment method, or contact email..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-slate-900 dark:text-white"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-slate-900 dark:text-white"
            >
              <option value="all">All SaaS Tiers</option>
              <option value="Institutional Premier">Institutional Premier</option>
              <option value="School Growth">School Growth</option>
              <option value="Free Starter">Free Starter</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-slate-900 dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Trial">Trial Period</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Master Subscriptions Table */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              Institutional Billing Master Register
            </h3>
            <p className="text-xs text-slate-500">
              Active licensing contracts across participating institutions
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">School & Contact</th>
                <th className="py-3 px-4">Subscribed Tier</th>
                <th className="py-3 px-4">Billing Rate & Cycle</th>
                <th className="py-3 px-4">Next Renewal</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Intake Quota</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredSubs.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900 dark:text-white">{sub.schoolName}</p>
                    <span className="text-[11px] text-slate-500">{sub.contactEmail}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${getTierColor(sub.plan)}`}>
                      {sub.plan}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold tabular-nums text-slate-900 dark:text-white">
                      {sub.amountUgx === 0 ? 'Free' : `UGX ${sub.amountUgx.toLocaleString()}`}
                    </span>
                    <p className="text-[11px] text-slate-400">{sub.billingCycle} Cycle</p>
                  </td>

                  <td className="py-3.5 px-4 tabular-nums text-slate-600 dark:text-slate-300">
                    {sub.nextBillingDate}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{sub.paymentMethod}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="w-24">
                      <div className="flex justify-between text-[10px] text-slate-500 tabular-nums mb-1">
                        <span>{sub.quotaUsed}</span>
                        <span>{sub.quotaLimit}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#6C3EF4] rounded-full" 
                          style={{ width: `${Math.min(100, (sub.quotaUsed / (sub.quotaLimit || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      sub.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}>
                      {sub.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setReceiptSub(sub)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="View Billing Invoice / Receipt"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          setEditingSub(sub);
                          setSelectedPlan(sub.plan);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-[#6C3EF4] dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
                      >
                        Change Tier
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Change Tier Modal */}
      {editingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#111827] rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#6C3EF4]" />
                <span>Adjust School SaaS Tier</span>
              </h3>
              <button 
                onClick={() => setEditingSub(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePlan} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">School Institution</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{editingSub.schoolName}</p>
                <p className="text-[11px] text-slate-500">Current Plan: {editingSub.plan} ({editingSub.billingCycle})</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select New SaaS Plan Tier
                </label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value as SubscriptionTier)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold"
                >
                  <option value="Free Starter">Free Starter (UGX 0 / 50 inquiry cap)</option>
                  <option value="School Growth">School Growth (UGX 850,000 / term)</option>
                  <option value="Institutional Premier">Institutional Premier (UGX 1,750,000 / term)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSub(null)}
                  className="px-3 py-2 font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-[#6C3EF4] hover:bg-[#5b32db] rounded-xl shadow-xs cursor-pointer"
                >
                  Save Tier Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Receipt Modal */}
      {receiptSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#111827] rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#6C3EF4]" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  MoES Platform Billing Receipt
                </h3>
              </div>
              <button 
                onClick={() => setReceiptSub(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Billed To</span>
                  <p className="font-bold text-slate-900 dark:text-white">{receiptSub.schoolName}</p>
                  <p className="text-[11px] text-slate-500">{receiptSub.contactEmail}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Invoice Ref</span>
                  <p className="font-mono font-bold text-slate-900 dark:text-white">INV-{receiptSub.id.toUpperCase()}-2026</p>
                  <p className="text-[11px] text-slate-500">Issued: {receiptSub.lastPaymentDate}</p>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-2 space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-600 dark:text-slate-300">Plan License: {receiptSub.plan}</span>
                  <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                    UGX {receiptSub.amountUgx.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Billing Cycle</span>
                  <span>{receiptSub.billingCycle} Pre-paid</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Payment Gateway</span>
                  <span>{receiptSub.paymentMethod}</span>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-bold text-sm">
                <span>Total Amount Settled</span>
                <span className="text-[#6C3EF4] tabular-nums">UGX {receiptSub.amountUgx.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setFeedback('Invoice PDF prepared for download.');
                  setReceiptSub(null);
                  setTimeout(() => setFeedback(null), 3000);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#6C3EF4] hover:bg-[#5b32db] rounded-xl shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Official Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
