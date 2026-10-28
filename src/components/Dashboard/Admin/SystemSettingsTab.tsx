import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  RefreshCw, 
  Database, 
  MessageSquare, 
  Lock, 
  Download, 
  Check, 
  AlertTriangle, 
  Radio, 
  Server, 
  Key, 
  FileSpreadsheet,
  Clock
} from 'lucide-react';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';

export const SystemSettingsTab: React.FC = () => {
  const { 
    platformSettings, 
    updatePlatformSettings, 
    auditLogs, 
    schools, 
    applications, 
    parents, 
    addAuditLog 
  } = useAdmissionsData();

  const [settings, setSettings] = useState(platformSettings);
  const [syncingUneb, setSyncingUneb] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showConfirmMaintenance, setShowConfirmMaintenance] = useState(false);

  const handleToggle = (key: keyof typeof platformSettings) => {
    if (key === 'maintenanceMode') {
      setShowConfirmMaintenance(true);
      return;
    }

    const updatedVal = !settings[key];
    const newSettings = { ...settings, [key]: updatedVal };
    setSettings(newSettings);
    updatePlatformSettings({ [key]: updatedVal });

    addAuditLog({
      actorName: 'Dr. Ronald Mukasa',
      actorRole: 'Super Administrator',
      action: 'System Configuration Changed',
      target: String(key),
      details: `Toggled ${String(key)} to ${updatedVal}.`,
      ipAddress: '196.43.102.14',
      status: 'success'
    });

    setFeedback(`System configuration for ${String(key)} updated.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleConfirmMaintenance = () => {
    const updated = !settings.maintenanceMode;
    setSettings(prev => ({ ...prev, maintenanceMode: updated }));
    updatePlatformSettings({ maintenanceMode: updated });
    setShowConfirmMaintenance(false);

    addAuditLog({
      actorName: 'Dr. Ronald Mukasa',
      actorRole: 'Super Administrator',
      action: 'Maintenance Mode Toggled',
      target: 'Platform Core Services',
      details: `Maintenance mode switched to ${updated ? 'ENABLED' : 'DISABLED'}.`,
      ipAddress: '196.43.102.14',
      status: updated ? 'warning' : 'success'
    });

    setFeedback(`Platform maintenance mode is now ${updated ? 'ENABLED' : 'DISABLED'}.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleSyncUneb = () => {
    setSyncingUneb(true);
    setTimeout(() => {
      setSyncingUneb(false);
      const syncTime = `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} EAT`;
      setSettings(prev => ({ ...prev, unebLastSync: syncTime }));
      updatePlatformSettings({ unebLastSync: syncTime });

      addAuditLog({
        actorName: 'Dr. Ronald Mukasa',
        actorRole: 'Super Administrator',
        action: 'Manual UNEB Verification Sync',
        target: 'UNEB Primary & Secondary Database API',
        details: 'Manual refresh executed; 4,892 candidate indexes reconciled.',
        ipAddress: '196.43.102.14',
        status: 'success'
      });

      setFeedback('UNEB API Synchronization complete! Candidate indexes validated.');
      setTimeout(() => setFeedback(null), 3500);
    }, 1200);
  };

  const handleExportAuditLogs = () => {
    const headers = ['Timestamp', 'Actor Name', 'Role', 'Action', 'Target', 'Details', 'IP Address', 'Status'];
    const rows = auditLogs.map(l => [
      `"${l.timestamp}"`,
      `"${l.actorName}"`,
      `"${l.actorRole}"`,
      `"${l.action}"`,
      `"${l.target}"`,
      `"${l.details}"`,
      l.ipAddress,
      l.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartAdmissions_AuditTrail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setFeedback('Exported Security Audit Trail successfully.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleExportSchoolsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(schools, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `SmartAdmissions_Schools_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setFeedback('Exported Schools Registry JSON backup.');
    setTimeout(() => setFeedback(null), 3000);
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
            <Settings className="w-6 h-6 text-[#6C3EF4]" />
            <span>National System Settings & Technical Governance</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure UNEB verification gateways, SMS conduits, security RBAC policies & compliance backups
          </p>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Card 1: UNEB Verification Gateway */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/60 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5 text-[#6C3EF4]" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Uganda National Examinations Board (UNEB) API Gateway
                </h3>
                <p className="text-xs text-slate-500">
                  Automated PLE & UCE result slip verification against UNEB candidate registers
                </p>
              </div>
            </div>

            <button
              onClick={() => handleToggle('unebGatewayEnabled')}
              className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 shrink-0 ${
                settings.unebGatewayEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.unebGatewayEnabled ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Live Endpoint</span>
              <p className="font-mono text-slate-700 dark:text-slate-300 text-[11px] truncate">
                {settings.unebApiEndpoint}
              </p>
            </div>

            <div className="flex items-center justify-between py-1 text-slate-500">
              <span>Last Reconciled:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                {settings.unebLastSync}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 text-slate-500">
              <span>Auto-Approval Aggregate Threshold:</span>
              <span className="font-bold text-[#6C3EF4]">
                Div 1 (≤ {settings.autoVerificationScoreThreshold} Aggregates)
              </span>
            </div>
          </div>

          <button
            onClick={handleSyncUneb}
            disabled={syncingUneb}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#6C3EF4] hover:bg-[#5b32db] rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${syncingUneb ? 'animate-spin' : ''}`} />
            <span>{syncingUneb ? 'Reconciling with UNEB Servers...' : 'Trigger Manual Candidate Re-sync'}</span>
          </button>
        </div>

        {/* Card 2: SMS & Communication Gateway */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/60 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-[#6C3EF4]" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Uganda Telecom SMS Gateway
                </h3>
                <p className="text-xs text-slate-500">
                  Transmits admissions alerts, parent reminders & entrance interview dates via SMS
                </p>
              </div>
            </div>

            <button
              onClick={() => handleToggle('smsGatewayEnabled')}
              className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 shrink-0 ${
                settings.smsGatewayEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.smsGatewayEnabled ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Sender Mask ID</span>
              <p className="font-mono font-bold text-slate-900 dark:text-white">
                {settings.smsSenderId}
              </p>
            </div>

            <div className="flex items-center justify-between py-1 text-slate-500">
              <span>Account Credit Balance:</span>
              <span className="font-extrabold text-emerald-600 tabular-nums">
                UGX {settings.smsBalanceUgx.toLocaleString()} (~36,900 SMS remaining)
              </span>
            </div>

            <div className="flex items-center justify-between py-1 text-slate-500">
              <span>Delivery Status:</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Operational (MTN & Airtel)</span>
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setFeedback('SMS gateway credit top-up simulated via Stanbic wire.');
                setTimeout(() => setFeedback(null), 3000);
              }}
              className="w-full px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              Top Up SMS Credit Quota
            </button>
          </div>
        </div>

        {/* Card 3: Security & Access Control */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/60 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#6C3EF4]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Security & RBAC Enforcement
              </h3>
              <p className="text-xs text-slate-500">
                Institutional credential validation, two-factor authentication & maintenance lock
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Mandatory Two-Factor Authentication (2FA)</p>
                <span className="text-[11px] text-slate-500">Required for school bursars, headteachers & super admins</span>
              </div>
              <button
                onClick={() => handleToggle('twoFactorEnforced')}
                className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 shrink-0 ${
                  settings.twoFactorEnforced ? 'bg-[#6C3EF4]' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.twoFactorEnforced ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50">
              <div>
                <p className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Platform Maintenance Mode</span>
                </p>
                <span className="text-[11px] text-rose-700 dark:text-rose-300">
                  Suspends external public applications and freezes intake portals
                </span>
              </div>
              <button
                onClick={() => handleToggle('maintenanceMode')}
                className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 shrink-0 ${
                  settings.maintenanceMode ? 'bg-rose-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Card 4: Backup & Data Export Center */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/60 flex items-center justify-center shrink-0">
              <Download className="w-5 h-5 text-[#6C3EF4]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Platform Data Export & Backup Center
              </h3>
              <p className="text-xs text-slate-500">
                Official ministerial snapshots of schools, admissions registers and compliance trails
              </p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <button
              onClick={handleExportSchoolsJSON}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Server className="w-4 h-4 text-[#6C3EF4]" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Export Full Schools Directory (JSON)
                </span>
              </div>
              <Download className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={handleExportAuditLogs}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Export Security Audit Trail (CSV)
                </span>
              </div>
              <Download className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

      </div>

      {/* Security Audit Trail Table */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#6C3EF4]" />
              <span>Real-Time Platform Governance & Security Audit Trail</span>
            </h3>
            <p className="text-xs text-slate-500">
              Immutable log of administrative events, decision overrides & system configuration changes
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400 tabular-nums">
            {auditLogs.length} events logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Administrative Actor</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Audit Details</th>
                <th className="py-3 px-4">IP Node</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-500 tabular-nums whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900 dark:text-white">{log.actorName}</p>
                    <span className="text-[11px] text-slate-400">{log.actorRole}</span>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {log.action}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#6C3EF4] dark:text-purple-300">
                    {log.target}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-[280px] truncate">
                    {log.details}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                    {log.ipAddress}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.status === 'success'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : log.status === 'warning'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}>
                      {log.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Maintenance Mode Confirmation Modal */}
      {showConfirmMaintenance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#111827] rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Confirm Platform Maintenance Mode
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to toggle maintenance mode? When active, parent applications and public school discovery will be temporarily paused.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setShowConfirmMaintenance(false)}
                className="px-3 py-2 font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmMaintenance}
                className="px-4 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs cursor-pointer"
              >
                Proceed & Toggle
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
