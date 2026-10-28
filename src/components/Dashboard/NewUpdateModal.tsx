import React, { useState } from 'react';
import { X, Megaphone, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmissionsData } from '../../context/AdmissionsDataContext';

interface NewUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewUpdateModal: React.FC<NewUpdateModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentUser } = useAuth();
  const { createSchoolUpdate } = useAdmissionsData();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'announcement' | 'scholarship' | 'event' | 'achievement' | 'discount'>('announcement');
  const [ctaText, setCtaText] = useState('Apply Now');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsPublishing(true);

    await createSchoolUpdate({
      schoolId: currentUser.schoolId || 'sch-custom',
      schoolName: currentUser.schoolName || 'Our Educational Institution',
      title: title.trim(),
      content: content.trim(),
      category,
      ctaText
    });

    setIsPublishing(false);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setTitle('');
      setContent('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Update Published!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Your update has been published to all parent feeds and platform dashboards across Smart Admissions.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-[#6C3EF4] flex items-center justify-center shrink-0">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Publish School Update
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Broadcast announcements, open days, or intake updates directly to parents
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Update Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['announcement', 'scholarship', 'event', 'achievement', 'discount'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-2 px-2 text-xs font-medium rounded-xl capitalize border transition-all ${
                        category === cat 
                          ? 'border-[#6C3EF4] bg-purple-50 dark:bg-purple-950/50 text-[#6C3EF4] dark:text-purple-300 font-bold' 
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Headline / Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior One 2027 Admissions Open"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Update Content & Details
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share comprehensive details, cutoff criteria, dates, or guidelines for parents..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Call-to-Action Button Text
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="e.g. Apply Now, Register, View Bursary"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3EF4]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#6C3EF4] hover:bg-[#5B2FE3] rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {isPublishing ? 'Publishing...' : 'Publish Update'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
