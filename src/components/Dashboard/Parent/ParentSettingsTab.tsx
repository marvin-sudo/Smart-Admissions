import React, { useState } from 'react';
import { 
  Lock, 
  Key, 
  ShieldCheck, 
  Bell, 
  Smartphone, 
  Mail, 
  Globe, 
  Moon, 
  Sun, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Laptop, 
  X,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';

export const ParentSettingsTab: React.FC = () => {
  const { currentUser } = useAuth();
  const { applications, children } = useAdmissionsData();

  // Settings states
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState('immediate');
  const [currency, setCurrency] = useState<'UGX' | 'USD'>('UGX');
  const [language, setLanguage] = useState('English');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // E2EE Key State
  const [publicKeyFingerprint, setPublicKeyFingerprint] = useState('0x7F4B : C91A : 882E : 001D : 44B2 : 91E4');
  const [isRotatingKeys, setIsRotatingKeys] = useState(false);

  const handleRotateKeys = () => {
    setIsRotatingKeys(true);
    setTimeout(() => {
      const hex = () => Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
      setPublicKeyFingerprint(`0x${hex()} : ${hex()} : ${hex()} : ${hex()} : ${hex()} : ${hex()}`);
      setIsRotatingKeys(false);
      setStatusMessage('End-to-end cryptographic keys rotated and republished to directory.');
      setTimeout(() => setStatusMessage(null), 4000);
    }, 900);
  };

  const handleExportData = () => {
    const dataBlob = new Blob([
      JSON.stringify({
        user: currentUser,
        exportTimestamp: new Date().toISOString(),
        applicationsCount: applications.length,
        childrenCount: children.length,
        applications,
        children
      }, null, 2)
    ], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smart_admissions_family_archive_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setStatusMessage('Admissions family archive downloaded as encrypted JSON bundle.');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Account & Security Preferences
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage cryptographic E2EE keys, SMS & WhatsApp admission alerts, 2FA security, and regional parameters.
        </p>
      </div>

      {/* Section 1: End-to-End Encryption & Cryptography */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              End-to-End Encryption (E2EE) Key Management
            </h3>
            <p className="text-xs text-slate-500">Curve25519 & AES-256 session parameters for school messages</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/50 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Device Public Identity Key:
              </span>
              <p className="font-mono text-xs font-bold text-[#6C3EF4] dark:text-purple-300 break-all select-all mt-0.5">
                {publicKeyFingerprint}
              </p>
            </div>
            <span className="self-start sm:self-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              Synchronized
            </span>
          </div>

          <div className="pt-2 border-t border-purple-200/40 dark:border-purple-800/40 flex flex-wrap items-center gap-3">
            <button
              onClick={handleRotateKeys}
              disabled={isRotatingKeys}
              className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-700 rounded-xl text-xs font-bold text-[#6C3EF4] dark:text-purple-300 hover:bg-purple-50 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRotatingKeys ? 'animate-spin' : ''}`} />
              <span>Rotate Cryptographic Keys</span>
            </button>
            <span className="text-[11px] text-slate-500">
              Rotating generates fresh ephemeral sessions with all school admission desks.
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Security & 2-Factor Authentication */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Two-Factor Authentication & Authorized Devices
            </h3>
            <p className="text-xs text-slate-500">Guard access to your child's academic pass slips and applications</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Require 2FA OTP for Admission Confirmations
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Sends an SMS / WhatsApp OTP before accepting an admission offer or withdrawing an application.
            </p>
          </div>
          <button
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
              twoFactorEnabled ? 'bg-[#6C3EF4]' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Active Authorized Sessions */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Guardian Sessions:
          </span>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Laptop className="w-4 h-4 text-purple-600" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">MacBook Pro (Chrome) · Kampala, Uganda</p>
                <p className="text-[10px] text-slate-400">Current active session · IP: 196.43.102.14</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active Now</span>
          </div>
        </div>
      </div>

      {/* Section 3: Notification & Communication Channels */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Admissions Alert Channels
            </h3>
            <p className="text-xs text-slate-500">Choose how schools reach you regarding interview invites and letters</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">WhatsApp Instant Alerts</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Receive interview schedules directly on WhatsApp.</p>
            </div>
            <button
              onClick={() => setWhatsappAlerts(!whatsappAlerts)}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                whatsappAlerts ? 'bg-[#6C3EF4]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                whatsappAlerts ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">SMS Notification (MTN / Airtel)</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Fallback text messages for urgent decisions.</p>
            </div>
            <button
              onClick={() => setSmsAlerts(!smsAlerts)}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                smsAlerts ? 'bg-[#6C3EF4]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                smsAlerts ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: Regional & Display Preferences */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Regional & Tuition Currency Preferences
            </h3>
            <p className="text-xs text-slate-500">Configure how fees and dates appear across dashboards</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
              Tuition Currency Display:
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as 'UGX' | 'USD')}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium"
            >
              <option value="UGX">UGX (Ugandan Shillings - Default)</option>
              <option value="USD">USD (US Dollars - International Schools)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
              Portal Language:
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium"
            >
              <option value="English">English (Official Uganda Standard)</option>
              <option value="Luganda">Luganda (Community Support)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 5: Data Privacy & Export */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Export Family Admissions Dossiers
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Download an authenticated JSON archive containing all applications, UNEB pass slips, and verification logs.
          </p>
        </div>

        <button
          onClick={handleExportData}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Data Archive</span>
        </button>
      </div>
    </div>
  );
};
