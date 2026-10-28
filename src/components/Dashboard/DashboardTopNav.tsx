import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  Check, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  ExternalLink,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmissionsData } from '../../context/AdmissionsDataContext';
import { ThemeToggle } from '../ThemeToggle';

interface DashboardTopNavProps {
  onToggleMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
}

export const DashboardTopNav: React.FC<DashboardTopNavProps> = ({
  onToggleMobileMenu,
  searchQuery,
  onSearchChange,
  searchPlaceholder
}) => {
  const { currentUser, logout, navigate } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAdmissionsData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  if (!currentUser) return null;

  // Filter notifications for current user's role/id
  const userNotifications = notifications.filter(n => {
    if (currentUser.role === 'parent') {
      return n.targetRole === 'parent' && (!n.targetUserId || n.targetUserId === currentUser.id);
    }
    if (currentUser.role === 'school') {
      return n.targetRole === 'school' && (!n.targetSchoolId || n.targetSchoolId === currentUser.schoolId);
    }
    return n.targetRole === 'management';
  });

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const defaultPlaceholder = 
    currentUser.role === 'parent'
      ? 'Search schools, scholarships, districts, or levels...'
      : currentUser.role === 'school'
      ? 'Search applicant names, PLE aggregates, or grades...'
      : 'Search all schools, parents, applications, or audit records...';

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0F1422]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle & Live Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onToggleMobileMenu}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg lg:hidden"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Box with icon */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder || defaultPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-200/80 dark:border-slate-700/80 focus:outline-none focus:border-[#6C3EF4] dark:focus:border-purple-400 focus:ring-2 focus:ring-[#6C3EF4]/15 transition-all"
            />
          </div>
        </div>

        {/* Right Actions: Verification Pill, Theme Toggle, Notifications, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          
          {/* Status Badge */}
          {currentUser.role === 'school' && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-700">
              {currentUser.schoolVerificationStatus === 'verified' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-300">Verified School</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 animate-spin" />
                  <span className="text-amber-700 dark:text-amber-300">Pending Verification</span>
                </>
              )}
            </div>
          )}

          {/* Theme Mode Toggle */}
          <ThemeToggle />

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#6C3EF4] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-50 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Notifications
                    </h4>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-[#6C3EF4] dark:text-purple-300 font-bold px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllNotificationsRead(currentUser.role)}
                      className="text-[11px] font-semibold text-[#6C3EF4] dark:text-purple-400 hover:underline cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 my-2">
                  {userNotifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      No notifications yet.
                    </div>
                  ) : (
                    userNotifications.slice(0, 6).map((notif) => (
                      <div 
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`py-2.5 px-1.5 cursor-pointer rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                          !notif.read ? 'bg-purple-50/50 dark:bg-purple-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {currentUser.avatarUrl ? (
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.name} 
                  className="w-8 h-8 rounded-full object-cover border border-purple-300 dark:border-purple-600"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#6C3EF4] text-white font-bold flex items-center justify-center text-xs">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-none truncate max-w-[120px]">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-400 capitalize mt-0.5">
                  {currentUser.role === 'management' ? 'Super Admin' : currentUser.role}
                </p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-left">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {currentUser.email}
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-left"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>View Public Website</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
