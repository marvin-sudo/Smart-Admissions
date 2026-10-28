import React from 'react';
import { ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AccessDeniedProps {
  requiredRole: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ requiredRole }) => {
  const { currentUser, navigate, getAuthorizedDashboardRoute } = useAuth();

  const handleGoToMyDashboard = () => {
    if (currentUser) {
      navigate(getAuthorizedDashboardRoute(currentUser));
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mb-6 shadow-md">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <span className="text-xs font-bold tracking-wider uppercase text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-900 mb-3">
        Authorization Error 403
      </span>

      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight max-w-md">
        Access Denied to Restricted Workspace
      </h1>

      <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
        {currentUser ? (
          <>
            Your current account is authenticated as <strong className="text-slate-900 dark:text-white uppercase font-bold">{currentUser.role}</strong>. This section requires authoritative <strong className="text-rose-600 font-bold">{requiredRole}</strong> clearance.
          </>
        ) : (
          <>
            You must be signed in with verified credentials to view this protected dashboard.
          </>
        )}
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        {currentUser ? (
          <button
            onClick={handleGoToMyDashboard}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#6C3EF4] hover:bg-[#5B2FE3] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <span>Go to My Authorized Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#6C3EF4] hover:bg-[#5B2FE3] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <span>Go to Login / Homepage</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </button>
      </div>
    </div>
  );
};
