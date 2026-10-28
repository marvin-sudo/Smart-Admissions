import React, { useState } from 'react';
import { ChevronDown, MessageSquare } from 'lucide-react';
import { FAQ_ITEMS } from '../data/mockData';
import { ScrollReveal } from './ScrollReveal';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-white dark:bg-[#0B0F19] border-t border-slate-100 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#0000B7] dark:text-purple-300 bg-[#F5F3FF] dark:bg-purple-950/40 px-3 py-1 rounded-md border border-[#8B5CF6]/20 dark:border-purple-800/40">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-4 text-balance">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            Everything you need to know about Smart Admissions for parents, schools, and institutional management.
          </p>
        </ScrollReveal>

        {/* Accordion Container */}
        <div className="space-y-3.5">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <ScrollReveal key={index} delay={(index % 4) * 60}>
                <div 
                  className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                    isOpen 
                      ? 'border-[#8B5CF6]/50 bg-[#F5F3FF]/40 dark:bg-slate-900/90 shadow-xs' 
                      : 'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(index)}
                    className="w-full text-left py-4.5 px-5 sm:px-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {item.question}
                    </span>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen 
                        ? 'bg-[#8B5CF6] text-white rotate-180' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100/70 dark:border-slate-800">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Support callout */}
        <ScrollReveal delay={150} className="mt-12">
          <div className="text-center p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Have a specific question about your school?</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Our admissions advisory team in Kampala is ready to assist you.</p>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#8B5CF6] dark:text-purple-300 bg-white dark:bg-slate-800 border border-[#8B5CF6]/30 dark:border-purple-500/40 hover:border-[#8B5CF6] rounded-lg shadow-xs hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contact Support Desk</span>
            </a>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
