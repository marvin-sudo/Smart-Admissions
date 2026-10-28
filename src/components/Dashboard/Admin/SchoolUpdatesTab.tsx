import React, { useState } from 'react';
import { 
  Megaphone, 
  Search, 
  Filter, 
  Plus, 
  Heart, 
  Eye, 
  Trash2, 
  Pin, 
  Check, 
  X, 
  Building2, 
  Sparkles, 
  Radio, 
  AlertTriangle 
} from 'lucide-react';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';
import { SchoolUpdate } from '../../../types/admissions';

export const SchoolUpdatesTab: React.FC = () => {
  const { 
    updates, 
    schools, 
    deleteUpdate, 
    pinUpdate, 
    createBroadcastAnnouncement, 
    addAuditLog 
  } = useAdmissionsData();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastCta, setBroadcastCta] = useState('View Guidelines');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Metrics
  const totalUpdates = updates.length;
  const totalReach = updates.reduce((acc, u) => acc + (u.reach || 0), 0) + 4200;
  const totalLikes = updates.reduce((acc, u) => acc + (u.likes || 0), 0) + 180;

  const filteredUpdates = updates.filter(u => {
    const matchesSearch = 
      u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.schoolName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCat = categoryFilter === 'all' || u.category === categoryFilter;
    const matchesSchool = selectedSchool === 'all' || u.schoolId === selectedSchool || u.schoolName.toLowerCase().includes(selectedSchool.toLowerCase());

    return matchesSearch && matchesCat && matchesSchool;
  });

  const handlePin = (updateId: string) => {
    pinUpdate(updateId);
    setFeedback('Update pinned to the top of national parent discovery feed.');
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleDelete = (updateId: string, title: string) => {
    deleteUpdate(updateId);
    addAuditLog({
      actorName: 'Dr. Ronald Mukasa',
      actorRole: 'Super Administrator',
      action: 'School Update Moderation Takedown',
      target: title,
      details: `Removed post '${title}' from public platform visibility.`,
      ipAddress: '196.43.102.14',
      status: 'warning'
    });
    setFeedback(`Announcement "${title}" was removed from the live feed.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastContent.trim()) return;

    await createBroadcastAnnouncement(broadcastTitle, broadcastContent, broadcastCta);

    addAuditLog({
      actorName: 'Dr. Ronald Mukasa',
      actorRole: 'Super Administrator',
      action: 'National Ministerial Broadcast Published',
      target: broadcastTitle,
      details: `Dispatched national platform circular to all schools and parents.`,
      ipAddress: '196.43.102.14',
      status: 'success'
    });

    setFeedback('National ministerial broadcast published successfully.');
    setShowBroadcastModal(false);
    setBroadcastTitle('');
    setBroadcastContent('');
    setTimeout(() => setFeedback(null), 4000);
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

      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-[#6C3EF4]" />
            <span>School Updates & Announcements Moderation</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Supervise school communications, circulars, admission deadlines & broadcast official MoES notices
          </p>
        </div>

        <button
          onClick={() => setShowBroadcastModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#6C3EF4] hover:bg-[#5b32db] rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Radio className="w-4 h-4" />
          <span>Publish National Circular</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Bulletins</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">{totalUpdates}</p>
          <span className="text-[11px] text-slate-400">Live on platform</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Parent Reach</span>
          <p className="text-2xl font-extrabold text-emerald-600 tabular-nums mt-1">{totalReach.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">Impressions delivered</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-rose-500 uppercase tracking-wider">Parent Applauds</span>
          <p className="text-2xl font-extrabold text-rose-500 tabular-nums mt-1">{totalLikes}</p>
          <span className="text-[11px] text-slate-400">Verified reactions</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-[#6C3EF4] uppercase tracking-wider">Participating Schools</span>
          <p className="text-2xl font-extrabold text-[#6C3EF4] tabular-nums mt-1">{schools.length}</p>
          <span className="text-[11px] text-slate-400">Active broadcasting nodes</span>
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
              placeholder="Search headline, announcement content, or school..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-slate-900 dark:text-white"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-slate-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="announcement">Official Announcements</option>
              <option value="scholarship">Scholarship Alerts</option>
              <option value="event">Open Days & Tours</option>
              <option value="achievement">Academic Achievements</option>
              <option value="discount">Fee Discounts</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-slate-900 dark:text-white"
            >
              <option value="all">All Issuing Sources</option>
              {schools.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Updates Stream Grid */}
      <div className="space-y-4">
        {filteredUpdates.length === 0 ? (
          <div className="bg-white dark:bg-[#111827] rounded-2xl p-12 text-center text-xs text-slate-400 border border-slate-200/80 dark:border-slate-800">
            No updates match your search criteria.
          </div>
        ) : (
          filteredUpdates.map((update) => (
            <div 
              key={update.id}
              className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/60 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-[#6C3EF4]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {update.schoolName}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#8B5CF6] dark:text-purple-300">
                        {update.category}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Dispatched {update.publishedAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handlePin(update.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                    title="Pin this update to top of feed"
                  >
                    <Pin className="w-3.5 h-3.5 text-[#6C3EF4]" />
                    <span>Pin to Top</span>
                  </button>

                  <button
                    onClick={() => handleDelete(update.id, update.title)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                    title="Take down post"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Take Down</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
                  {update.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                  {update.content}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-4 text-slate-500">
                  <span className="flex items-center gap-1 tabular-nums">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>{update.reach.toLocaleString()} views</span>
                  </span>
                  <span className="flex items-center gap-1 tabular-nums">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>{update.likes} applauds</span>
                  </span>
                </div>

                {update.ctaText && (
                  <span className="text-[11px] font-bold text-[#6C3EF4] dark:text-purple-300">
                    CTA Action: "{update.ctaText}"
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#111827] rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#6C3EF4]" />
                <span>Publish National Education Circular</span>
              </h3>
              <button 
                onClick={() => setShowBroadcastModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Circular Headline *
                </label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Official Ministry Admissions Timeline for Senior 1 Intake 2027"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Circular Content & Directives *
                </label>
                <textarea
                  required
                  rows={4}
                  value={broadcastContent}
                  onChange={(e) => setBroadcastContent(e.target.value)}
                  placeholder="Detailed guidelines, ministerial requirements, and deadline dates for all participating schools and parents..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Call-to-Action Label
                </label>
                <input
                  type="text"
                  value={broadcastCta}
                  onChange={(e) => setBroadcastCta(e.target.value)}
                  placeholder="e.g. Read Guidelines or View Schedule"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-3 py-2 font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-[#6C3EF4] hover:bg-[#5b32db] rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Broadcast to All Users</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
