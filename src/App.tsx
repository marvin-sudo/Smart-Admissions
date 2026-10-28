import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdmissionsDataProvider } from './context/AdmissionsDataContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PlatformOverview } from './components/PlatformOverview';
import { HowItWorks } from './components/HowItWorks';
import { FeaturesGrid } from './components/FeaturesGrid';
import { BenefitsSection } from './components/BenefitsSection';
import { DashboardShowcase } from './components/DashboardShowcase';
import { SuccessStories } from './components/SuccessStories';
import { TrustSection } from './components/TrustSection';
import { FaqSection } from './components/FaqSection';
import { CtaSection } from './components/CtaSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

import { AuthModal } from './components/Modals/AuthModal';
import { RegisterSchoolModal } from './components/Modals/RegisterSchoolModal';
import { ParentDemoModal } from './components/Modals/ParentDemoModal';
import { LegalModal } from './components/Modals/LegalModal';
import { PortalType } from './types/admissions';

// New Three Actual Dashboards & Onboarding screens
import { ParentDashboard } from './components/Dashboard/ParentDashboard';
import { SchoolDashboard } from './components/Dashboard/SchoolDashboard';
import { AdminDashboard } from './components/Dashboard/AdminDashboard';
import { ParentOnboarding } from './components/Dashboard/ParentOnboarding';
import { SchoolOnboarding } from './components/Dashboard/SchoolOnboarding';
import { AccessDenied } from './components/Dashboard/AccessDenied';

function AppContent() {
  const { currentUser, currentRoute, navigate, getAuthorizedDashboardRoute } = useAuth();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [parentDemoOpen, setParentDemoOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<PortalType>('school');
  const [authInitialRole, setAuthInitialRole] = useState<PortalType>('school');

  const handleOpenAuth = (role: PortalType = 'school') => {
    setAuthInitialRole(role);
    setAuthModalOpen(true);
  };

  const handlePortalDemoSelect = (portal: PortalType) => {
    setActiveShowcaseTab(portal);
    if (portal === 'parent') {
      setParentDemoOpen(true);
    } else {
      const showcase = document.getElementById('dashboard-showcase');
      if (showcase) {
        showcase.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLoginSuccess = (portal: PortalType) => {
    setAuthModalOpen(false);
    // Automatic redirection is handled by AuthContext via navigate(getAuthorizedDashboardRoute(user))
  };

  // -------------------------------------------------------------
  // CENTRALIZED ROLE-BASED ROUTING SYSTEM & PROTECTED GUARDS
  // -------------------------------------------------------------

  // 1. Parent Routes
  if (currentRoute === '/parent/onboarding') {
    if (!currentUser || currentUser.role !== 'parent') {
      return <AccessDenied requiredRole="Parent" />;
    }
    return <ParentOnboarding />;
  }

  if (currentRoute.startsWith('/parent')) {
    if (!currentUser || currentUser.role !== 'parent') {
      return <AccessDenied requiredRole="Parent" />;
    }
    if (!currentUser.onboardingCompleted) {
      return <ParentOnboarding />;
    }
    return <ParentDashboard />;
  }

  // 2. School Routes
  if (currentRoute === '/school/onboarding') {
    if (!currentUser || currentUser.role !== 'school') {
      return <AccessDenied requiredRole="School Staff" />;
    }
    return <SchoolOnboarding />;
  }

  if (currentRoute.startsWith('/school')) {
    if (!currentUser || currentUser.role !== 'school') {
      return <AccessDenied requiredRole="School Staff" />;
    }
    if (!currentUser.onboardingCompleted) {
      return <SchoolOnboarding />;
    }
    return <SchoolDashboard />;
  }

  // 3. Super Admin Routes
  if (currentRoute.startsWith('/admin')) {
    if (!currentUser || currentUser.role !== 'management') {
      return <AccessDenied requiredRole="Super Administrator" />;
    }
    return <AdminDashboard />;
  }

  // -------------------------------------------------------------
  // Default: Public Landing Page
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-250">
      
      {/* Sticky Navigation Bar with Active Dark Mode Toggle */}
      <Navbar 
        onOpenLogin={() => handleOpenAuth('school')}
        onOpenRegister={() => setRegisterModalOpen(true)}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <HeroSection 
          onGetStarted={() => setRegisterModalOpen(true)}
          onExplore={() => {
            const el = document.getElementById('platform-overview');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Platform Overview — One Platform, Three Experiences */}
        <PlatformOverview 
          onSelectPortalDemo={handlePortalDemoSelect}
          onOpenRegister={() => setRegisterModalOpen(true)}
        />

        {/* How Smart Admissions Works */}
        <HowItWorks />

        {/* Features Overview — 6 Grid Cards */}
        <FeaturesGrid />

        {/* Benefits for Every User */}
        <BenefitsSection 
          onOpenRegister={() => setRegisterModalOpen(true)}
          onOpenParentDemo={() => setParentDemoOpen(true)}
        />

        {/* Dashboard Showcase — Large Interactive Preview */}
        <DashboardShowcase 
          currentTab={activeShowcaseTab}
          onTabChange={setActiveShowcaseTab}
        />

        {/* Success Stories & Social Proof */}
        <SuccessStories 
          onRegisterSchool={() => setRegisterModalOpen(true)}
        />

        {/* Trust & Security Section */}
        <TrustSection />

        {/* Frequently Asked Questions */}
        <FaqSection />

        {/* Final Conversion Section */}
        <CtaSection 
          onGetStarted={() => setRegisterModalOpen(true)}
          onRegisterSchool={() => setRegisterModalOpen(true)}
        />

        {/* Contact Section */}
        <ContactSection />

      </main>

      {/* Footer */}
      <Footer 
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenTerms={() => setLegalModalType('terms')}
        onOpenRegister={() => setRegisterModalOpen(true)}
      />

      {/* Interactive Modals */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialRole={authInitialRole}
      />

      <RegisterSchoolModal 
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />

      <ParentDemoModal 
        isOpen={parentDemoOpen}
        onClose={() => setParentDemoOpen(false)}
      />

      <LegalModal 
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AdmissionsDataProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </AdmissionsDataProvider>
    </ThemeProvider>
  );
}
