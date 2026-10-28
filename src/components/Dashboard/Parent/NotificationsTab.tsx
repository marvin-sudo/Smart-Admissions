import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  CheckCircle2, 
  FileText, 
  MessageSquare, 
  Award, 
  Clock, 
  ArrowRight, 
  Filter, 
  ShieldCheck, 
  Calendar,
  X
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';
import { NotificationItem } from '../../../types/admissions';

export const NotificationsTab: React.FC<{ 
  onSelectTab?: (tab: string) => void 
}> = ({ onSelectTab }) => {
  const { currentUser } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAdmissionsData();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'application' | 'message' | 'announcement'>('all');

  if (!currentUser) return null;

  // Filter notifications for parent
  const parentNotifications = notifications.filter(n => 
    !n.targetRole || n.targetRole === 'parent' || n.targetUserId === currentUser.id
  );

  const filteredNotifications = parentNotifications.filter(n => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !n.read;
    return n.type === activeFilter;
  });

  const unreadCount = parentNotifications.filter(n => !n.read).length;

  const getIcon = (type?: string) => {
    switch (type) {
      case 'application': return FileText;
      case 'message': return MessageSquare;
      case 'announcement': return Award;
      default: return Bell;
    }
  };

  const handleNotificationClick = (item: NotificationItem) => {
    markNotificationRead(item.id);
    if (item.type === 'application' && onSelectTab) {
      onSelectTab('applications');
    } else if (item.type === 'message' && onSelectTab) {
      onSelectTab('messages');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Admissions Notification Center
            </h2>
            {unreadCount > 0 && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time notifications regarding application reviews, entrance interview calls, and school bulletins.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllNotificationsRead('parent')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#6C3EF4] dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 rounded-xl border border-purple-200 dark:border-purple-800 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          All ({parentNotifications.length})
        </button>
        <button
          onClick={() => setActiveFilter('unread')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeFilter === 'unread'
              ? 'bg-[#6C3EF4] text-white'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setActiveFilter('application')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeFilter === 'application'
              ? 'bg-[#6C3EF4] text-white'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          Applications
        </button>
        <button
          onClick={() => setActiveFilter('message')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeFilter === 'message'
              ? 'bg-[#6C3EF4] text-white'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          Messages
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white dark:bg-[#111827] rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-[#6C3EF4] flex items-center justify-center mx-auto">
            <CheckCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">You're all caught up!</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No unread alerts in this category. We will notify you immediately whenever a school updates your application status.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-xs">
          {filteredNotifications.map((notif) => {
            const Icon = getIcon(notif.type);
            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 sm:p-5 flex items-start gap-4 transition-colors cursor-pointer ${
                  !notif.read
                    ? 'bg-purple-50/60 dark:bg-purple-950/25 border-l-4 border-l-[#6C3EF4]'
                    : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  !notif.read
                    ? 'bg-purple-100 dark:bg-purple-900/60 text-[#6C3EF4]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs sm:text-sm font-bold ${
                        !notif.read ? 'text-[#6C3EF4] dark:text-purple-300' : 'text-slate-900 dark:text-white'
                      }`}>
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-[#6C3EF4]" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="mt-2.5 flex items-center gap-3 text-[11px]">
                    <span className="text-[#6C3EF4] dark:text-purple-400 font-bold hover:underline flex items-center gap-1">
                      <span>View details</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>

                    {!notif.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markNotificationRead(notif.id);
                        }}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
