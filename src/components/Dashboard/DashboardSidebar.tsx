import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  FileText, 
  MessageSquare, 
  Award, 
  Bookmark, 
  Users, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  School, 
  BarChart3, 
  Megaphone, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ArrowLeft,
  ShieldCheck,
  Building2,
  TrendingUp,
  Sparkles,
  CreditCard,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmissionsData } from '../../context/AdmissionsDataContext';
import { PortalType } from '../../types/admissions';

interface DashboardSidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  onSelectTab,
  mobileOpen = false,
  onCloseMobile
}) => {
  const { currentUser, logout, navigate, switchUserTo } = useAuth();
  const { schools } = useAdmissionsData();
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);

  if (!currentUser) return null;

  // Navigation items based on role
  const getNavItems = () => {
    if (currentUser.role === 'parent') {
      return [
        { id: 'home', label: 'Home Feed', icon: Home },
        { id: 'discover', label: 'Discover Schools', icon: Search },
        { id: 'applications', label: 'My Applications', icon: FileText },
        { id: 'messages', label: 'Messages (E2EE)', icon: MessageSquare },
        { id: 'scholarships', label: 'Scholarships', icon: Award },
        { id: 'saved', label: 'Saved Schools', icon: Bookmark },
        { id: 'children', label: 'My Children', icon: Users },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'profile', label: 'Parent Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];
    }

    if (currentUser.role === 'school') {
      return [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'myschool', label: 'My School Profile', icon: School },
        { id: 'applications', label: 'Applications', icon: FileText },
        { id: 'pipeline', label: 'Admissions Pipeline', icon: TrendingUp },
        { id: 'updates', label: 'School Updates', icon: Megaphone },
        { id: 'scholarships', label: 'Scholarships', icon: Award },
        { id: 'messages', label: 'Parent Inquiries', icon: MessageSquare },
        { id: 'leads', label: 'Parent Leads', icon: Users },
        { id: 'subscription', label: 'Subscription', icon: CreditCard, badge: 'Free' },
        { id: 'settings', label: 'School Settings', icon: Settings },
      ];
    }

    // Management / Super Admin
    return [
      { id: 'overview', label: 'Platform Overview', icon: BarChart3 },
      { id: 'schools', label: 'All Schools', icon: Building2 },
      { id: 'applications', label: 'All Applications', icon: FileText },
      { id: 'parents', label: 'Parents & Children', icon: Users },
      { id: 'updates', label: 'School Updates', icon: Megaphone },
      { id: 'scholarships', label: 'Scholarships', icon: Award },
      { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
      { id: 'growth', label: 'Growth Analysis', icon: TrendingUp },
      { id: 'settings', label: 'System Settings', icon: Settings },
    ];
  };

  const navItems = getNavItems();

  const getRoleHeader = () => {
    switch (currentUser.role) {
      case 'parent':
        return {
          title: 'Parent Portal',
          badge: 'Family Workspace',
          badgeColor: 'bg-purple-100 dark:bg-purple-950/60 text-[#8B5CF6] dark:text-purple-300'
        };
      case 'school':
        return {
          title: currentUser.schoolName || 'School Control Center',
          badge: currentUser.schoolVerificationStatus === 'verified' ? 'Verified School' : 'Pending Verification',
          badgeColor: currentUser.schoolVerificationStatus === 'verified' 
            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' 
            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
        };
      case 'management':
        return {
          title: 'Super Administrator',
          badge: 'Root Clearance',
          badgeColor: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
        };
    }
  };

  const roleInfo = getRoleHeader();

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    onCloseMobile?.();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50
        w-68 bg-white dark:bg-[#0F1422]
        border-r border-slate-200/80 dark:border-slate-800
        flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Branding Section */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 group text-left cursor-pointer"
              title="Return to Public Homepage"
            >
              <img 
                src="https://i.postimg.cc/wvwHtwCq/Sm-App-Horizontal-with-tagline.png" 
                alt="Smart Admissions" 
                className="h-10 w-auto object-contain dark:brightness-110"
              />
            </button>
            {mobileOpen && (
              <button 
                onClick={onCloseMobile}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg lg:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* User & Role Badge Card */}
          <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center gap-2.5">
              {currentUser.avatarUrl ? (
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.name} 
                  className="w-9 h-9 rounded-full object-cover border border-purple-300 dark:border-purple-600 shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#8B5CF6] text-white font-bold flex items-center justify-center text-sm shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {currentUser.designation || currentUser.email}
                </p>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleInfo.badgeColor}`}>
                {roleInfo.badge}
              </span>

              {/* Fast switch demo button for testing requirements */}
              <button
                onClick={() => setShowAccountSwitcher(!showAccountSwitcher)}
                className="text-[10px] text-[#8B5CF6] dark:text-purple-400 hover:underline flex items-center gap-0.5 font-medium cursor-pointer"
              >
                <span>Switch Role</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Test Account Switcher Dropdown */}
            {showAccountSwitcher && (
              <div className="mt-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md space-y-1 text-left text-xs">
                <p className="text-[10px] uppercase font-bold text-slate-400 px-1 py-0.5">Quick Switch Account:</p>
                <button
                  onClick={() => {
                    switchUserTo('usr-parent-01');
                    setShowAccountSwitcher(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-200"
                >
                  Parent (Grace Mugisha)
                </button>
                <button
                  onClick={() => {
                    switchUserTo('usr-school-01');
                    setShowAccountSwitcher(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-200"
                >
                  Verified School (Gayaza High)
                </button>
                <button
                  onClick={() => {
                    switchUserTo('usr-school-pending-02');
                    setShowAccountSwitcher(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-200"
                >
                  Pending School (Seeta High)
                </button>
                <button
                  onClick={() => {
                    switchUserTo('usr-mgmt-01');
                    setShowAccountSwitcher(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-200"
                >
                  Super Admin (Dr. Arthur)
                </button>
                <button
                  onClick={() => {
                    switchUserTo('usr-parent-new-02');
                    setShowAccountSwitcher(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-200"
                >
                  New Parent (Needs Onboarding)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Middle Navigation Links with Soft Lavender Active State */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold
                  transition-all text-left cursor-pointer
                  ${isActive 
                    ? 'bg-[#F3E8FF] dark:bg-purple-950/50 text-[#6C3EF4] dark:text-purple-300 shadow-xs' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }
                `}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#6C3EF4] dark:text-purple-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto mr-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                    {item.badge}
                  </span>
                )}
                {isActive && !item.badge && (
                  <div className="ml-auto w-1.5 h-4 bg-[#6C3EF4] dark:bg-purple-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Public Website</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
