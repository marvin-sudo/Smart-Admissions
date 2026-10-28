import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Clock
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'School Representative',
    schoolOrOrg: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please provide a valid email address';
    }
    if (!formData.message.trim()) errs.message = 'Please provide a message or inquiry details';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#F5F3FF]/40 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#0000B7] dark:text-purple-300 bg-white dark:bg-slate-900 px-3 py-1 rounded-md border border-[#8B5CF6]/20 dark:border-purple-800/40 shadow-xs">
            Connect With Our Team
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-4 text-balance">
            Speak to an Admissions Specialist
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            Whether you are registering a new school intake, seeking multi-campus deployment, or need parent application guidance.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Verified Contact Information & Desk Details */}
          <ScrollReveal delay={0} className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-7 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Kampala Regional Desk
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                  Serving nursery, primary, and secondary institutions across Uganda and East Africa.
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <div className="w-9 h-9 rounded-lg bg-[#F5F3FF] dark:bg-purple-950/60 text-[#0000B7] dark:text-purple-300 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Regional Office</p>
                    <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">Plot 14 Lumumba Avenue, Nakasero, Kampala, Uganda</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <div className="w-9 h-9 rounded-lg bg-[#F5F3FF] dark:bg-purple-950/60 text-[#0000B7] dark:text-purple-300 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Email Inquiries</p>
                    <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5 font-mono">support@smartadmissions.ug</p>
                    <p className="text-slate-400 dark:text-slate-500 text-[11px]">Admissions & partner support</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <div className="w-9 h-9 rounded-lg bg-[#F5F3FF] dark:bg-purple-950/60 text-[#0000B7] dark:text-purple-300 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Direct Telephone Desk</p>
                    <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5 font-mono">+256 700 812 900 / +256 312 405 700</p>
                    <p className="text-slate-400 dark:text-slate-500 text-[11px]">Mon – Sat: 8:00 AM – 5:30 PM EAT</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <div className="w-9 h-9 rounded-lg bg-[#F5F3FF] dark:bg-purple-950/60 text-[#0000B7] dark:text-purple-300 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Response Window</p>
                    <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">Average reply time under 2 business hours during intake season.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <p className="font-semibold text-slate-900 dark:text-white mb-1">Direct School Onboarding</p>
                <p>New schools are paired with a dedicated onboarding specialist who helps configure grading formulas, aggregate cutoffs, and staff permissions.</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Inquiries Form */}
          <ScrollReveal delay={150} className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-7 sm:p-9 shadow-xs">
              
              {isSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Inquiry Received</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    Thank you, <strong>{formData.fullName}</strong>. Your message has been routed to our Kampala admissions support desk. A representative will contact you via <strong>{formData.email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        fullName: '',
                        email: '',
                        phone: '',
                        role: 'School Representative',
                        schoolOrOrg: '',
                        message: ''
                      });
                    }}
                    className="mt-4 px-5 py-2 text-xs font-semibold text-[#0000B7] dark:text-purple-300 bg-[#F5F3FF] dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4.5">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Send an Inquiry</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Fill out the brief form below and our team will respond promptly.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. David Musisi"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                      />
                      {errors.fullName && <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. d.musisi@school.ac.ug"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                      />
                      {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Phone Number (WhatsApp / Direct)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+256 700 000 000"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        I am inquiring as:
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] cursor-pointer"
                      >
                        <option value="School Representative" className="dark:bg-slate-800">School Headteacher / Administrator</option>
                        <option value="Parent or Guardian" className="dark:bg-slate-800">Parent or Guardian</option>
                        <option value="Education Board / Directorate" className="dark:bg-slate-800">School Group Director / Board Member</option>
                        <option value="General Partner" className="dark:bg-slate-800">Partner / General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      School or Organization Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.schoolOrOrg}
                      onChange={(e) => setFormData({ ...formData, schoolOrOrg: e.target.value })}
                      placeholder="e.g. St. Jude Secondary School, Masaka"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Message / Admissions Questions <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your upcoming admissions cycle, student intake volume, or any questions..."
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                    />
                    {errors.message && <p className="text-[11px] text-rose-500 mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 text-sm font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg shadow-sm shadow-[#8B5CF6]/20 transition-all cursor-pointer disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span>Sending inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Admissions Inquiry</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center">
                    Your details are securely kept and used solely to address your school admissions request.
                  </p>
                </form>
              )}

            </div>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
};
