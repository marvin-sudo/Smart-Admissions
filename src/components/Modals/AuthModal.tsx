import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  Building2, 
  ShieldAlert, 
  KeyRound, 
  BadgeCheck, 
  Briefcase,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { PortalType } from '../../types/admissions';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (portal: PortalType) => void;
  initialRole?: PortalType;
}

type AuthTab = 'signin' | 'register';

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose,
  onLoginSuccess,
  initialRole = 'school'
}) => {
  const { 
    login, 
    registerParent, 
    registerSchoolStaff, 
    registerManagement, 
    loginWithGoogle, 
    requestPasswordReset,
    getDemoCredentials 
  } = useAuth();

  const [selectedPortal, setSelectedPortal] = useState<PortalType>(initialRole);
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  
  // Sign-in state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password flow
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);

  // Parent registration state
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentPassword, setParentPassword] = useState('');
  const [parentConfirmPassword, setParentConfirmPassword] = useState('');
  const [parentTermsAgreed, setParentTermsAgreed] = useState(true);

  // School staff registration state
  const [schoolName, setSchoolName] = useState('');
  const [staffContactPerson, setStaffContactPerson] = useState('');
  const [staffWorkEmail, setStaffWorkEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffDesignation, setStaffDesignation] = useState('Admissions Director');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffConfirmPassword, setStaffConfirmPassword] = useState('');

  // Management registration state
  const [mgmtName, setMgmtName] = useState('');
  const [mgmtEmail, setMgmtEmail] = useState('');
  const [mgmtAccessKey, setMgmtAccessKey] = useState('');
  const [mgmtPassword, setMgmtPassword] = useState('');
  const [mgmtConfirmPassword, setMgmtConfirmPassword] = useState('');

  // Common UI states
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Synchronize initial demo credentials when switching role or opening
  useEffect(() => {
    if (isOpen) {
      const demo = getDemoCredentials(selectedPortal);
      setEmail(demo.email);
      setPassword(demo.password);
      setErrorMessage(null);
      setSuccessMsg(null);
      setIsForgotPassword(false);
    }
  }, [isOpen, selectedPortal]);

  if (!isOpen) return null;

  const handlePortalSwitch = (portal: PortalType) => {
    setSelectedPortal(portal);
    setErrorMessage(null);
    setSuccessMsg(null);
    setIsForgotPassword(false);
    const demo = getDemoCredentials(portal);
    setEmail(demo.email);
    setPassword(demo.password);
  };

  const handleFillDemo = () => {
    const demo = getDemoCredentials(selectedPortal);
    setEmail(demo.email);
    setPassword(demo.password);
    setErrorMessage(null);
  };

  // Sign In handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const result = await login(selectedPortal, email, password);
      setLoading(false);

      if (result.success && result.user) {
        setSuccessMsg(`Authenticated as ${result.user.name}. Redirecting to ${getRoleName(selectedPortal)}...`);
        setTimeout(() => {
          onLoginSuccess(selectedPortal);
          onClose();
        }, 1100);
      } else {
        setErrorMessage(result.message || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setLoading(false);
      setErrorMessage('A connection error occurred. Please try again.');
    }
  };

  // Google Auth handler
  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setGoogleLoading(true);

    try {
      const result = await loginWithGoogle(selectedPortal);
      setGoogleLoading(false);

      if (result.success && result.user) {
        setSuccessMsg(`Signed in with Google as ${result.user.name}. Entering ${getRoleName(selectedPortal)}...`);
        setTimeout(() => {
          onLoginSuccess(selectedPortal);
          onClose();
        }, 1100);
      } else {
        setErrorMessage(result.message || 'Google sign-in was interrupted.');
      }
    } catch {
      setGoogleLoading(false);
      setErrorMessage('Google Authentication service unreachable.');
    }
  };

  // Reset password handler
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setErrorMessage('Please enter your account email.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    const res = await requestPasswordReset(resetEmail);
    setLoading(false);
    setResetFeedback(res.message);
  };

  // Create Account handler
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Parent Registration
    if (selectedPortal === 'parent') {
      if (!parentName.trim() || !parentEmail.trim() || !parentPassword) {
        setErrorMessage('Please fill in your name, email, and password.');
        return;
      }
      if (parentPassword !== parentConfirmPassword) {
        setErrorMessage('Passwords do not match. Please verify your password entry.');
        return;
      }
      if (!parentTermsAgreed) {
        setErrorMessage('Please accept the Terms of Service to register your parent account.');
        return;
      }

      setLoading(true);
      const res = await registerParent({
        name: parentName,
        email: parentEmail,
        phone: parentPhone,
        password: parentPassword
      });
      setLoading(false);

      if (res.success && res.user) {
        setSuccessMsg(`Account created for ${res.user.name}! Redirecting to Parent Portal...`);
        setTimeout(() => {
          onLoginSuccess('parent');
          onClose();
        }, 1200);
      } else {
        setErrorMessage(res.message || 'Unable to register parent account.');
      }
    }

    // School Staff Registration
    else if (selectedPortal === 'school') {
      if (!schoolName.trim() || !staffContactPerson.trim() || !staffWorkEmail.trim() || !staffPhone.trim() || !staffPassword) {
        setErrorMessage('Please provide all official school registration details.');
        return;
      }
      if (staffPassword !== staffConfirmPassword) {
        setErrorMessage('Passwords do not match. Please verify your password entry.');
        return;
      }

      setLoading(true);
      const res = await registerSchoolStaff({
        schoolName,
        contactPerson: staffContactPerson,
        contactEmail: staffWorkEmail,
        phone: staffPhone,
        designation: staffDesignation,
        password: staffPassword
      });
      setLoading(false);

      if (res.success && res.user) {
        setSuccessMsg(`School staff account registered for ${res.user.name} (${res.user.schoolName})! Launching School Portal...`);
        setTimeout(() => {
          onLoginSuccess('school');
          onClose();
        }, 1200);
      } else {
        setErrorMessage(res.message || 'Unable to register school staff account.');
      }
    }

    // Management Registration
    else {
      if (!mgmtName.trim() || !mgmtEmail.trim() || !mgmtAccessKey.trim() || !mgmtPassword) {
        setErrorMessage('Administrative registration requires an authorized root security access key.');
        return;
      }
      if (mgmtPassword !== mgmtConfirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }

      setLoading(true);
      const res = await registerManagement({
        name: mgmtName,
        email: mgmtEmail,
        accessKey: mgmtAccessKey,
        password: mgmtPassword
      });
      setLoading(false);

      if (res.success && res.user) {
        setSuccessMsg(`Administrator credentials verified for ${res.user.name}! Granting Management Dashboard access...`);
        setTimeout(() => {
          onLoginSuccess('management');
          onClose();
        }, 1200);
      } else {
        setErrorMessage(res.message || 'Super administrator authorization failed.');
      }
    }
  };

  const getRoleName = (role: PortalType) => {
    switch (role) {
      case 'school': return 'School Portal';
      case 'parent': return 'Parent Portal';
      case 'management': return 'Management Dashboard';
    }
  };

  const getRoleButtonLabel = (role: PortalType) => {
    switch (role) {
      case 'school': return 'Enter School Portal';
      case 'parent': return 'Enter Parent Portal';
      case 'management': return 'Enter Management Dashboard';
    }
  };

  const getRoleDescription = (role: PortalType) => {
    switch (role) {
      case 'school':
        return 'For registered school administrators, headteachers, and authorized admissions staff.';
      case 'parent':
        return 'For parents discovering schools, communicating with schools, and managing admission applications.';
      case 'management':
        return 'For authorized Smart Admission Super Administrators & national education commissioners.';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer z-10"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header & Branding */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
          <div className="flex items-center justify-between mb-3">
            <img 
              src="https://i.postimg.cc/wvwHtwCq/Sm-App-Horizontal-with-tagline.png" 
              alt="Smart Admissions" 
              className="h-10 sm:h-12 w-auto max-w-[220px] sm:max-w-[260px] object-contain dark:brightness-110 dark:contrast-105"
              referrerPolicy="no-referrer"
            />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[#8B5CF6] dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 rounded-full border border-purple-200/60 dark:border-purple-800/60">
              <BadgeCheck className="w-3.5 h-3.5 text-[#8B5CF6]" />
              Secure Portal
            </span>
          </div>

          <h3 id="auth-modal-title" className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isForgotPassword 
              ? 'Reset Account Password' 
              : activeTab === 'signin' 
                ? 'Sign In to Your Workspace' 
                : 'Create Your Workspace Account'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isForgotPassword 
              ? 'Enter your verified account email to receive reset instructions.' 
              : getRoleDescription(selectedPortal)}
          </p>

          {/* 1. Role Selector (Three Options) */}
          {!isForgotPassword && (
            <div className="mt-4">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-800/90 rounded-xl">
                <button
                  type="button"
                  onClick={() => handlePortalSwitch('school')}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedPortal === 'school'
                      ? 'bg-white dark:bg-slate-900 text-[#8B5CF6] dark:text-purple-300 shadow-xs font-bold ring-1 ring-[#8B5CF6]/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  School Staff
                </button>
                <button
                  type="button"
                  onClick={() => handlePortalSwitch('parent')}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedPortal === 'parent'
                      ? 'bg-white dark:bg-slate-900 text-[#8B5CF6] dark:text-purple-300 shadow-xs font-bold ring-1 ring-[#8B5CF6]/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Parent Portal
                </button>
                <button
                  type="button"
                  onClick={() => handlePortalSwitch('management')}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedPortal === 'management'
                      ? 'bg-white dark:bg-slate-900 text-[#8B5CF6] dark:text-purple-300 shadow-xs font-bold ring-1 ring-[#8B5CF6]/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Management
                </button>
              </div>
            </div>
          )}

          {/* 2. Sign In | Create Account Tabs (Directly below role selector) */}
          {!isForgotPassword && (
            <div className="flex border-b border-slate-200 dark:border-slate-800 mt-4 -mb-4">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${
                  activeTab === 'signin'
                    ? 'border-[#8B5CF6] text-[#8B5CF6] dark:text-purple-300'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${
                  activeTab === 'register'
                    ? 'border-[#8B5CF6] text-[#8B5CF6] dark:text-purple-300'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>
          )}
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6 max-h-[calc(85vh-160px)] overflow-y-auto">
          
          {/* Success Banner */}
          {successMsg && (
            <div className="py-6 px-4 text-center space-y-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/50 mb-4 animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">Authenticated Successfully</h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed font-medium">
                {successMsg}
              </p>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 mb-4 text-xs font-medium text-rose-800 dark:text-rose-200 bg-rose-50 dark:bg-rose-950/50 rounded-xl border border-rose-200 dark:border-rose-900 flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {isForgotPassword ? (
            <div className="space-y-4">
              {resetFeedback ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    {resetFeedback}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setResetFeedback(null);
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#8B5CF6] hover:underline cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Account Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="e.g. name@gayazahigh.sc.ug"
                        required
                        className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 text-xs sm:text-sm font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-xl shadow-sm shadow-[#8B5CF6]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? 'Sending Instructions...' : 'Send Password Reset Link'}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Return to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : activeTab === 'signin' ? (
            /* TAB 1: SIGN IN MODE */
            <div className="space-y-4">
              
              {/* 4. Google Authentication Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={googleLoading}
                className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold shadow-xs flex items-center justify-center gap-3 transition-all cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 active:scale-[0.99]"
              >
                {/* Official Google 'G' icon */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
                <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">
                  Or continue with email
                </span>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4">
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@school.ug or parent@gmail.com"
                      required
                      className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                    />
                  </div>
                </div>

                {/* Password with Eye Toggle */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmail(email);
                        setIsForgotPassword(true);
                      }}
                      className="text-[#8B5CF6] dark:text-purple-400 hover:underline cursor-pointer font-medium"
                    >
                      Reset Password
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter account password"
                      className="w-full text-xs sm:text-sm pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Main Action Button with Dynamic Label */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 text-xs sm:text-sm font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-xl shadow-sm shadow-[#8B5CF6]/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-75"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Authenticating & verifying permissions...
                    </span>
                  ) : (
                    <>
                      <span>{getRoleButtonLabel(selectedPortal)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Demo Helper Switcher */}
                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 dark:text-slate-500">Need instant testing access?</span>
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="inline-flex items-center gap-1 font-semibold text-[#8B5CF6] dark:text-purple-300 hover:underline cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    Fill verified demo credentials
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* TAB 2: CREATE ACCOUNT MODE */
            <div className="space-y-4">
              
              {/* Google signup option */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={googleLoading}
                className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold shadow-xs flex items-center justify-center gap-3 transition-all cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 active:scale-[0.99]"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{googleLoading ? 'Registering with Google...' : 'Quick Sign Up with Google'}</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
                <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">
                  Or register with email
                </span>
              </div>

              <form onSubmit={handleCreateAccount} className="space-y-3.5">
                
                {/* ROLE FORM: PARENT PORTAL */}
                {selectedPortal === 'parent' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        <input
                          type="text"
                          value={parentName}
                          onChange={(e) => setParentName(e.target.value)}
                          placeholder="e.g. Grace Mugisha"
                          required
                          className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        <input
                          type="email"
                          value={parentEmail}
                          onChange={(e) => setParentEmail(e.target.value)}
                          placeholder="e.g. parent.name@gmail.com"
                          required
                          className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Phone Number <span className="text-slate-400 font-normal">(optional)</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        <input
                          type="tel"
                          value={parentPhone}
                          onChange={(e) => setParentPhone(e.target.value)}
                          placeholder="e.g. +256 772 123456"
                          className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={parentPassword}
                            onChange={(e) => setParentPassword(e.target.value)}
                            placeholder="Min. 8 characters"
                            required
                            className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={parentConfirmPassword}
                            onChange={(e) => setParentConfirmPassword(e.target.value)}
                            placeholder="Repeat password"
                            required
                            className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                          />
                        </div>
                      </div>
                    </div>

                    <label className="flex items-start gap-2 pt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={parentTermsAgreed}
                        onChange={(e) => setParentTermsAgreed(e.target.checked)}
                        className="mt-0.5 rounded-md border-slate-300 text-[#8B5CF6] focus:ring-[#8B5CF6]"
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                        I agree to the Smart Admissions Terms of Service, Application Guidelines & Privacy Notice.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 px-4 text-xs sm:text-sm font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-xl shadow-sm shadow-[#8B5CF6]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {loading ? 'Creating Parent Account...' : 'Create Parent Account'}
                    </button>
                  </>
                )}

                {/* ROLE FORM: SCHOOL STAFF */}
                {selectedPortal === 'school' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        School Name
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        <input
                          type="text"
                          value={schoolName}
                          onChange={(e) => setSchoolName(e.target.value)}
                          placeholder="e.g. Gayaza High School, King's College Budo"
                          required
                          className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Contact Person Full Name
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                          <input
                            type="text"
                            value={staffContactPerson}
                            onChange={(e) => setStaffContactPerson(e.target.value)}
                            placeholder="e.g. Patrick Kato"
                            required
                            className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Official Work Email
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                          <input
                            type="email"
                            value={staffWorkEmail}
                            onChange={(e) => setStaffWorkEmail(e.target.value)}
                            placeholder="e.g. admissions@school.ug"
                            required
                            className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                          <input
                            type="tel"
                            value={staffPhone}
                            onChange={(e) => setStaffPhone(e.target.value)}
                            placeholder="e.g. +256 414 123456"
                            required
                            className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Role / Designation
                        </label>
                        <div className="relative">
                          <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                          <select
                            value={staffDesignation}
                            onChange={(e) => setStaffDesignation(e.target.value)}
                            className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                          >
                            <option value="Admissions Director">Admissions Director</option>
                            <option value="Headteacher / Principal">Headteacher / Principal</option>
                            <option value="Deputy Head - Academics">Deputy Head - Academics</option>
                            <option value="Admissions Registrar">Admissions Registrar</option>
                            <option value="ICT / System Administrator">ICT / System Administrator</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={staffPassword}
                            onChange={(e) => setStaffPassword(e.target.value)}
                            placeholder="Min. 8 characters"
                            required
                            className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={staffConfirmPassword}
                            onChange={(e) => setStaffConfirmPassword(e.target.value)}
                            placeholder="Repeat password"
                            required
                            className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 px-4 text-xs sm:text-sm font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-xl shadow-sm shadow-[#8B5CF6]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {loading ? 'Registering School Staff Account...' : 'Register School Staff Account'}
                    </button>
                  </>
                )}

                {/* ROLE FORM: MANAGEMENT (SUPER ADMIN) */}
                {selectedPortal === 'management' && (
                  <>
                    <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-start gap-2.5">
                      <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                        <strong className="font-semibold block mb-0.5">Invite & Key-Restricted Interface:</strong>
                        Super Administrator registration is invite-only. Please provide an authorized root security key (e.g. <code className="px-1 py-0.5 bg-amber-100 dark:bg-amber-900 rounded font-mono text-[10px]">SMART-ADMIN-2026-ROOT</code>).
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Full Name & Title
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        <input
                          type="text"
                          value={mgmtName}
                          onChange={(e) => setMgmtName(e.target.value)}
                          placeholder="e.g. Dr. Arthur Tumwesigye"
                          required
                          className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Official Administration Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        <input
                          type="email"
                          value={mgmtEmail}
                          onChange={(e) => setMgmtEmail(e.target.value)}
                          placeholder="e.g. director@educationboard.org.ug"
                          required
                          className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Administrative Security Access Key
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        <input
                          type="text"
                          value={mgmtAccessKey}
                          onChange={(e) => setMgmtAccessKey(e.target.value)}
                          placeholder="SMART-ADMIN-2026-ROOT"
                          required
                          className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl font-mono uppercase tracking-wider border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Master Password
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={mgmtPassword}
                            onChange={(e) => setMgmtPassword(e.target.value)}
                            placeholder="Min. 8 characters"
                            required
                            className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={mgmtConfirmPassword}
                            onChange={(e) => setMgmtConfirmPassword(e.target.value)}
                            placeholder="Repeat password"
                            required
                            className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 px-4 text-xs sm:text-sm font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-xl shadow-sm shadow-[#8B5CF6]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {loading ? 'Verifying Authorization...' : 'Verify & Request Administrator Access'}
                    </button>
                  </>
                )}
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer Security Badge */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
          <span>Protected session · TLS 1.3 256-bit</span>
          <span>East African Admissions Network</span>
        </div>
      </div>
    </div>
  );
};
