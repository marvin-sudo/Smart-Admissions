import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ArrowRight,
  LogOut,
  User,
  ShieldCheck
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin, onOpenRegister }) => {
  const { currentUser, logout, navigate, getAuthorizedDashboardRoute } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Platform Overview', href: '#platform-overview' },
    { name: 'Features', href: '#features' },
    { name: 'Success Stories', href: '#success-stories' },
    { name: 'Contact', href: '#contact' },
  ];

  const getRoleBadgeLabel = (role: string) => {
    switch (role) {
      case 'school': return 'School Staff';
      case 'parent': return 'Parent';
      case 'management': return 'Super Admin';
      default: return role;
    }
  };

  return (
    <header 
      className={`sticky top-0 z-40 transition-all duration-200 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-md shadow-xs border-b border-gray-100 dark:border-slate-800 py-3.5' 
          : 'bg-white dark:bg-[#0B0F19] border-b border-gray-100/70 dark:border-slate-800/80 py-4.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-8">
          
          {/* Brand Zone: Full color Smart Admissions logo with dark mode contrast adaptation */}
          <a href="#home" className="flex items-center group shrink-0 py-1" aria-label="Smart Admissions Home">
            <img 
              src="https://i.postimg.cc/wvwHtwCq/Sm-App-Horizontal-with-tagline.png" 
              alt="Smart Admissions" 
              className="h-14 sm:h-16 md:h-18 w-auto max-w-[210px] sm:max-w-[270px] md:max-w-[300px] object-contain transition-all group-hover:scale-[1.02] dark:brightness-110 dark:contrast-105 dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.18)]"
              referrerPolicy="no-referrer"
            />
          </a>

          {/* Nav Links: 4-6 concise single-line text links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-[#0000B7] dark:hover:text-[#A78BFA] transition-colors whitespace-nowrap py-1 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#0000B7] dark:after:bg-[#8B5CF6] after:transition-all"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Actions: Dark Mode Toggle, Log In & Prominent Get Started button */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Active Dark Mode Button */}
            <ThemeToggle />

            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => navigate(getAuthorizedDashboardRoute(currentUser))}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-colors border border-slate-200/60 dark:border-slate-700 cursor-pointer text-left"
                  title="Open your authorized dashboard"
                >
                  {currentUser.avatarUrl ? (
                    <img 
                      src={currentUser.avatarUrl} 
                      alt={currentUser.name} 
                      className="w-6 h-6 rounded-full object-cover border border-purple-400"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center text-xs font-bold">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight max-w-[130px] truncate">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] font-semibold text-[#8B5CF6] dark:text-purple-300 leading-tight">
                      {getRoleBadgeLabel(currentUser.role)} · Dashboard
                    </span>
                  </div>
                </button>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onOpenLogin}
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0000B7] dark:hover:text-[#A78BFA] transition-colors whitespace-nowrap cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={onOpenRegister}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg shadow-sm shadow-[#8B5CF6]/25 transition-all hover:shadow-md hover:shadow-[#8B5CF6]/30 whitespace-nowrap cursor-pointer active:scale-[0.99]"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Right Controls: Dark Mode Toggle + Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-200 hover:text-[#0000B7] dark:hover:text-[#A78BFA] rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-[#0000B7] dark:hover:text-[#A78BFA] hover:bg-slate-50 dark:hover:bg-slate-800/70 rounded-md transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
            {/* Dark mode toggle with label in mobile drawer */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Appearance</span>
              <ThemeToggle showLabel />
            </div>

            {currentUser ? (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{currentUser.name}</div>
                    <div className="text-[11px] text-[#8B5CF6] dark:text-purple-300 font-semibold">{getRoleBadgeLabel(currentUser.role)}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(getAuthorizedDashboardRoute(currentUser));
                  }}
                  className="w-full text-center py-2 text-xs font-bold text-white bg-[#6C3EF4] rounded-lg hover:bg-[#5B2FE3] transition-colors"
                >
                  Enter My Dashboard
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-center py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 rounded-lg hover:bg-rose-100 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin();
                  }}
                  className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenRegister();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
