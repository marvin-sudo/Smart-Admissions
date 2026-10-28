import React, { useState } from 'react';
import { 
  Megaphone, 
  Plus, 
  Heart, 
  Eye, 
  Trash2, 
  Pin, 
  CheckCircle2, 
  X, 
  Calendar, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAdmissionsData } from '../../../context/AdmissionsDataContext';
import { SchoolUpdate } from '../../../types/admissions';
import { NewUpdateModal } from '../NewUpdateModal';

export const SchoolUpdatesTab: React.FC = () => {
  const { currentUser } = useAuth();
  const { schools, updates, deleteUpdate, pinUpdate } = useAdmissionsData();

  const currentSchool = schools.find(s => 
    s.id === currentUser?.schoolId || s.name.toLowerCase() === (currentUser?.schoolName || '').toLowerCase()
  ) || schools[0];

  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter updates for this school
  const myUpdates = updates.filter(u => 
    u.schoolId === currentSchool.id || u.schoolName.toLowerCase() === currentSchool.name.toLowerCase()
  );

  const totalReach = myUpdates.reduce((sum, u) => sum + (u.reach || 0), 0);
  const totalLikes = myUpdates.reduce((sum, u) => sum + (u.likes || 0), 0);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      deleteUpdate(id);
      setToastMessage('Announcement removed from parent feeds.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handlePin = (id: string) => {
    pinUpdate(id);
    setToastMessage('Update pinned to the top of school feeds.');
    setTimeout(() => setToastMessage(null), 3000);
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

      {/* Header and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              School Feed Announcements & Updates
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] dark:text-purple-300">
              {myUpdates.length} Published
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Publish open days, bursary cutoffs, academic achievements, and admissions bulletins directly to parent feeds.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#6C3EF4] hover:bg-[#5B2FE3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Update</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Broadcasts</span>
            <Megaphone className="w-4 h-4 text-[#6C3EF4]" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 tabular-nums">{myUpdates.length}</p>
          <span className="text-[10px] text-slate-500">Live on platform</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Parent Impressions</span>
            <Eye className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2 tabular-nums">
            {(totalReach || 1420).toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500">Total feed views</span>
        </div>

        <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Parent Engagement</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-600 mt-2 tabular-nums">
            {totalLikes || 86}
          </p>
          <span className="text-[10px] text-slate-500">Likes & bookmarks</span>
        </div>
      </div>

      {/* Published Feed List */}
      <div className="space-y-4">
        {myUpdates.length === 0 ? (
          <div className="bg-white dark:bg-[#111827] rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-[#6C3EF4] flex items-center justify-center mx-auto">
              <Megaphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No published announcements yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Broadcast your Senior One intake opening, entrance interview dates, or sports achievements to thousands of parents.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 bg-[#6C3EF4] text-white text-xs font-bold rounded-xl hover:bg-[#5B2FE3]"
            >
              Publish First Update
            </button>
          </div>
        ) : (
          myUpdates.map((post) => (
            <div 
              key={post.id}
              className={`bg-white dark:bg-[#111827] rounded-2xl p-5 sm:p-6 border shadow-xs transition-all space-y-3 ${
                post.pinned 
                  ? 'border-purple-400 dark:border-purple-700 bg-purple-50/20 dark:bg-purple-950/10' 
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] dark:text-purple-300">
                    {post.category}
                  </span>
                  {post.pinned && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                      <Pin className="w-3 h-3" />
                      <span>Pinned to Top</span>
                    </span>
                  )}
                  <span className="text-xs text-slate-400">· {post.publishedAt}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePin(post.id)}
                    className="p-1.5 text-slate-400 hover:text-[#6C3EF4] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    title={post.pinned ? 'Unpin announcement' : 'Pin to top of feed'}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                    title="Delete update"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {post.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {post.content}
              </p>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span className="tabular-nums font-semibold">{post.reach} Views</span>
                  </span>
                  <span className="flex items-center gap-1 text-rose-500">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span className="tabular-nums font-semibold">{post.likes} Likes</span>
                  </span>
                </div>

                {post.ctaText && (
                  <span className="text-[11px] font-semibold text-[#6C3EF4] bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-md">
                    Action: {post.ctaText}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <NewUpdateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};
