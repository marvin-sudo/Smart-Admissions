import React, { useState } from 'react';
import { 
  Quote, 
  CheckCircle2, 
  GraduationCap
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const SuccessStories: React.FC<{ onRegisterSchool?: () => void }> = () => {
  const [activeStory, setActiveStory] = useState<number>(0);

  const stories = [
    {
      id: 'gayaza',
      school: 'Gayaza High School',
      motto: 'Never Give Up',
      location: 'Wakiso District, Central Uganda',
      curriculum: 'UNEB (O & A Level Boarding)',
      author: 'Robinah Katongole Kizito',
      role: 'Headteacher & Admissions Committee Chair',
      avatarInitials: 'RK',
      avatarBg: 'bg-purple-100 dark:bg-purple-950 text-[#8B5CF6] dark:text-purple-300',
      metricValue: '1,290+',
      metricLabel: 'Applications Processed Digitally',
      secondaryMetric: '0 Physical Queues',
      headline: 'Eliminating the paper backlog during the Senior 1 intake rush',
      quote: 'Before Smart Admissions, our administration block was overwhelmed by thousands of physical PLE slips, recommendation letters, and long queues of anxious parents arriving from across Uganda. Moving our entire admissions cycle to Smart Admissions gave our committee an organized workspace to filter applicants by aggregates, verify academic slips, and issue digital interview passes in days instead of weeks.',
      beforeState: '3 weeks of manual folder sorting & congested campus gates',
      afterState: '100% digital submission, verified PLE documents, zero physical queues',
      intakeYear: 'Intake 2026/2027'
    },
    {
      id: 'kisubi',
      school: 'St. Mary’s College Kisubi (SMACK)',
      motto: 'Duc In Altum',
      location: 'Entebbe Road, Wakiso District',
      curriculum: 'UNEB (O & A Level Boys Boarding)',
      author: 'Bro. Simon Mpanga',
      role: 'Deputy Headteacher & Admissions Coordinator',
      avatarInitials: 'SM',
      avatarBg: 'bg-blue-100 dark:bg-blue-950 text-[#0000B7] dark:text-blue-300',
      metricValue: '4.2x',
      metricLabel: 'Faster Verification Speed',
      secondaryMetric: '100% Document Traceability',
      headline: 'Streamlining merit cutoffs and entrance interview scheduling',
      quote: 'With over 1,400 top-performing students competing for limited Senior 1 places, evaluating credentials objectively was our biggest challenge. Smart Admissions enabled our committee to instantly rank candidates according to our exact cutoff aggregates (Div 1, Agg 4–6), inspect uploaded examination slips with audit trails, and schedule interview cohorts without any duplicate entries.',
      beforeState: 'Risk of misplaced examination certificates and chaotic phone calls',
      afterState: 'Instant aggregate rankings, automated SMS interview invitations',
      intakeYear: 'Intake 2026/2027'
    },
    {
      id: 'greenhill',
      school: 'Greenhill Academy',
      motto: 'Extend Your Horizons',
      location: 'Kibuli & Buwaate Campuses, Kampala',
      curriculum: 'Primary & Secondary (Day)',
      author: 'Joy Veronica Maraka',
      role: 'Director of Enrolment & Academic Registrar',
      avatarInitials: 'JM',
      avatarBg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300',
      metricValue: '98.4%',
      metricLabel: 'Parent Satisfaction Score',
      secondaryMetric: '3 Campuses Synchronized',
      headline: 'Unifying admissions across multiple urban campuses in real time',
      quote: 'Coordinating student intake between our Kibuli and Buwaate campuses previously meant constant reconciliation and phone inquiries from parents. With Smart Admissions, our leadership team monitors capacity fill rates across Nursery, Primary, and High School streams live. Parents love the milestone tracker because they never have to guess whether their child’s application has been reviewed.',
      beforeState: 'Fragmented intake records between branch campuses',
      afterState: 'Consolidated network dashboard with real-time class quota monitoring',
      intakeYear: 'Intake 2026/2027'
    }
  ];

  const partnerSchools = [
    { name: 'Gayaza High School', type: 'Girls Boarding', loc: 'Wakiso' },
    { name: 'St. Mary’s College Kisubi', type: 'Boys Boarding', loc: 'Wakiso' },
    { name: 'Greenhill Academy', type: 'Day & Secondary', loc: 'Kampala' },
    { name: 'King’s College Budo', type: 'Co-Ed Boarding', loc: 'Wakiso' },
    { name: 'Uganda Martyrs S.S Namugongo', type: 'Boarding', loc: 'Wakiso' },
    { name: 'Mt. St. Mary’s Namagunga', type: 'Girls Boarding', loc: 'Mukono' },
    { name: 'Kampala Parents’ School', type: 'Primary Day', loc: 'Kampala' },
    { name: 'Aga Khan High School', type: 'International', loc: 'Kampala' }
  ];

  return (
    <section id="success-stories" className="py-20 lg:py-28 bg-gradient-to-b from-[#F5F3FF]/30 via-white to-white dark:from-[#0B0F19] dark:via-slate-900/60 dark:to-[#0B0F19] border-t border-slate-100 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#8B5CF6] dark:text-purple-300 bg-[#F5F3FF] dark:bg-purple-950/40 px-3.5 py-1 rounded-md border border-[#8B5CF6]/20 dark:border-purple-800/40 shadow-xs">
            Success Stories & Social Proof
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-4 text-balance">
            Trusted by East Africa’s Leading Educational Institutions.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-4 leading-relaxed font-normal">
            Discover how prestigious schools, registrars, and parents transformed their admissions workflow with Smart Admissions.
          </p>
        </ScrollReveal>

        {/* School Logos / Institutional Partner Strip */}
        <ScrollReveal delay={100} className="mb-16">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
            <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-6">
              Participating Schools & Educational Partners
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 items-center">
              {partnerSchools.map((school, idx) => (
                <div 
                  key={idx}
                  className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors text-center group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] dark:bg-slate-800 text-[#0000B7] dark:text-purple-300 group-hover:bg-[#8B5CF6] group-hover:text-white transition-all duration-200 flex items-center justify-center shadow-xs mb-2">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug line-clamp-2">
                    {school.name}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                    {school.loc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Interactive Story Tabs */}
        <ScrollReveal delay={150} className="mb-8">
          <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900/90 rounded-xl max-w-2xl mx-auto overflow-x-auto border border-transparent dark:border-slate-800">
            {stories.map((st, idx) => (
              <button
                key={st.id}
                onClick={() => setActiveStory(idx)}
                className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeStory === idx
                    ? 'bg-white dark:bg-slate-800 text-[#8B5CF6] dark:text-purple-300 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st.school}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Featured Case Study Card */}
        {stories.map((story, idx) => {
          if (idx !== activeStory) return null;

          return (
            <ScrollReveal key={story.id} delay={200}>
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-10 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  
                  {/* Left Column: Metrics & School Identity */}
                  <div className="lg:col-span-5 space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0000B7] dark:text-purple-300 bg-[#F5F3FF] dark:bg-purple-950/50 px-2.5 py-0.5 rounded border border-[#8B5CF6]/20 dark:border-purple-800/40">
                          {story.intakeYear}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{story.location}</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {story.school}
                      </h3>
                      <p className="text-xs font-semibold text-[#8B5CF6] dark:text-purple-400 italic mt-1">
                        "{story.motto}" · {story.curriculum}
                      </p>
                    </div>

                    {/* Stat High-Impact Badges */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-purple-50/60 dark:bg-purple-950/30 rounded-2xl border border-purple-100 dark:border-purple-900/40">
                        <p className="text-3xl sm:text-4xl font-extrabold text-[#8B5CF6] dark:text-purple-300 font-mono tabular-nums">
                          {story.metricValue}
                        </p>
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1">
                          {story.metricLabel}
                        </p>
                      </div>

                      <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 rounded-2xl border border-blue-100 dark:border-blue-900/40">
                        <p className="text-xl sm:text-2xl font-bold text-[#0000B7] dark:text-blue-300 font-mono mt-1">
                          {story.secondaryMetric}
                        </p>
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1.5">
                          Verified Admission Outcome
                        </p>
                      </div>
                    </div>

                    {/* Before / After Transformation */}
                    <div className="space-y-2.5 pt-2">
                      <div className="p-3 bg-rose-50/60 dark:bg-rose-950/30 rounded-xl border border-rose-100 dark:border-rose-900/40 text-xs">
                        <span className="font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wide text-[10px] block mb-0.5">
                          Previous Challenge:
                        </span>
                        <span className="text-slate-600 dark:text-slate-300">{story.beforeState}</span>
                      </div>

                      <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/40 text-xs">
                        <span className="font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wide text-[10px] block mb-0.5">
                          With Smart Admissions:
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{story.afterState}</span>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: In-depth Testimonial Quote & Authority */}
                  <div className="lg:col-span-7 bg-[#F5F3FF]/40 dark:bg-slate-800/40 rounded-2xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-[#8B5CF6] text-white flex items-center justify-center shadow-xs">
                        <Quote className="w-5 h-5" />
                      </div>

                      <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                        {story.headline}
                      </h4>

                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                        "{story.quote}"
                      </p>
                    </div>

                    {/* Attributable Author Info */}
                    <div className="pt-6 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs ${story.avatarBg}`}>
                          {story.avatarInitials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{story.author}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{story.role}</p>
                          <p className="text-[11px] text-[#0000B7] dark:text-purple-400 font-semibold">{story.school}</p>
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 font-semibold shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Verified Case Study</span>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </ScrollReveal>
          );
        })}

        {/* Quantitative Network Summary Bar */}
        <ScrollReveal delay={250} className="mt-12">
          <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
              <div className="p-2">
                <p className="text-2xl sm:text-3xl font-extrabold text-[#8B5CF6] dark:text-purple-400 font-mono tabular-nums">45,000+</p>
                <p className="text-xs text-slate-300 mt-1">Student Applications Handled</p>
              </div>

              <div className="p-2">
                <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">94%</p>
                <p className="text-xs text-slate-300 mt-1">Reduction in Paper Queues</p>
              </div>

              <div className="p-2">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">100%</p>
                <p className="text-xs text-slate-300 mt-1">UNEB Result Traceability</p>
              </div>

              <div className="p-2">
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono tabular-nums">48 Hours</p>
                <p className="text-xs text-slate-300 mt-1">Average Committee Turnaround</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
