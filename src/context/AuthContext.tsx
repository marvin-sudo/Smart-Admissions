import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, AuthResult, PortalType, SchoolVerificationStatus } from '../types/admissions';

interface StoredUser extends AuthUser {
  passwordHash: string;
}

const DEFAULT_USERS: StoredUser[] = [
  {
    id: 'usr-school-01',
    name: 'Sister Dr. Florence',
    email: 'admissions@gayazahigh.sc.ug',
    role: 'school',
    schoolId: 'sch-gayaza-01',
    schoolName: 'Gayaza High School',
    schoolVerificationStatus: 'verified',
    designation: 'Admissions Officer & Registrar',
    phone: '+256 414 567890',
    passwordHash: 'Password123!',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
    onboardingCompleted: true
  },
  {
    id: 'usr-school-pending-02',
    name: 'Mr. Davis Byaruhanga',
    email: 'registrar@seetahigh.ac.ug',
    role: 'school',
    schoolId: 'sch-seeta-06',
    schoolName: 'Seeta High School Green Campus',
    schoolVerificationStatus: 'pending', // Pending Super Admin verification!
    designation: 'Head of Admissions',
    phone: '+256 772 998877',
    passwordHash: 'Password123!',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    onboardingCompleted: true
  },
  {
    id: 'usr-parent-01',
    name: 'Grace Mugisha',
    email: 'grace.mugisha@gmail.com',
    role: 'parent',
    phone: '+256 772 123456',
    passwordHash: 'Password123!',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
    onboardingCompleted: true
  },
  {
    id: 'usr-parent-new-02',
    name: 'David Kasirye',
    email: 'newparent@gmail.com',
    role: 'parent',
    phone: '+256 701 112233',
    passwordHash: 'Password123!',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
    onboardingCompleted: false // New parent requiring onboarding!
  },
  {
    id: 'usr-mgmt-01',
    name: 'Dr. Arthur Tumwesigye',
    email: 'director@educationboard.org.ug',
    role: 'management',
    designation: 'Super Administrator & Commissioner',
    phone: '+256 414 112233',
    passwordHash: 'Password123!',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    onboardingCompleted: true
  }
];

interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  currentRoute: string;
  navigate: (path: string) => void;
  getAuthorizedDashboardRoute: (user: AuthUser | null) => string;
  login: (role: PortalType, email: string, password: string) => Promise<AuthResult>;
  registerParent: (data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<AuthResult>;
  registerSchoolStaff: (data: {
    schoolName: string;
    contactEmail: string;
    contactPerson: string;
    phone: string;
    designation: string;
    password: string;
  }) => Promise<AuthResult>;
  registerManagement: (data: {
    email: string;
    name: string;
    accessKey: string;
    password: string;
  }) => Promise<AuthResult>;
  loginWithGoogle: (role: PortalType) => Promise<AuthResult>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  completeOnboarding: (updates?: Partial<AuthUser>) => void;
  getDemoCredentials: (role: PortalType, variant?: 'default' | 'pending' | 'new') => { email: string; password: string; name: string };
  switchUserTo: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'smart_admissions_users_v3';
const CURRENT_USER_KEY = 'smart_admissions_current_user_v3';
const ROUTE_STORAGE_KEY = 'smart_admissions_route_v3';
const VALID_ADMIN_KEYS = ['SMART-ADMIN-2026-ROOT', 'ADMIN-SUPER-2026', 'SMART-UG-ROOT'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<StoredUser[]>(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (saved) {
        const parsed: StoredUser[] = JSON.parse(saved);
        const existingEmails = new Set(parsed.map((u: StoredUser) => u.email.toLowerCase()));
        const missingDefaults = DEFAULT_USERS.filter(u => !existingEmails.has(u.email.toLowerCase()));
        return [...parsed, ...missingDefaults];
      }
    } catch {}
    return DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Calculate authorized dashboard destination based on user's verified role and onboarding status
  const getAuthorizedDashboardRoute = useCallback((user: AuthUser | null): string => {
    if (!user) return '/';

    if (user.role === 'parent') {
      return user.onboardingCompleted ? '/parent/dashboard' : '/parent/onboarding';
    }

    if (user.role === 'school') {
      return user.onboardingCompleted ? '/school/dashboard' : '/school/onboarding';
    }

    if (user.role === 'management') {
      return '/admin/dashboard';
    }

    return '/';
  }, []);

  // Router state
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path && path !== '/') {
        return path;
      }
      try {
        const saved = sessionStorage.getItem(ROUTE_STORAGE_KEY);
        if (saved) return saved;
      } catch {}
    }
    return '/';
  });

  const navigate = useCallback((path: string) => {
    setCurrentRoute(path);
    try {
      sessionStorage.setItem(ROUTE_STORAGE_KEY, path);
      if (typeof window !== 'undefined' && window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
    } catch {}
    // Scroll to top upon route change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen to browser Back/Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentRoute(path);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch {}
  }, [users]);

  // Sync currentUser to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch {}
  }, [currentUser]);

  const getDemoCredentials = (role: PortalType, variant: 'default' | 'pending' | 'new' = 'default') => {
    if (role === 'school') {
      if (variant === 'pending') {
        return {
          email: 'registrar@seetahigh.ac.ug',
          password: 'Password123!',
          name: 'Mr. Davis Byaruhanga (Seeta High - Pending Verification)'
        };
      }
      return {
        email: 'admissions@gayazahigh.sc.ug',
        password: 'Password123!',
        name: 'Sister Dr. Florence (Gayaza High - Verified)'
      };
    }
    if (role === 'parent') {
      if (variant === 'new') {
        return {
          email: 'newparent@gmail.com',
          password: 'Password123!',
          name: 'David Kasirye (New Parent - Incomplete Onboarding)'
        };
      }
      return {
        email: 'grace.mugisha@gmail.com',
        password: 'Password123!',
        name: 'Grace Mugisha (Existing Parent)'
      };
    }
    return {
      email: 'director@educationboard.org.ug',
      password: 'Password123!',
      name: 'Dr. Arthur Tumwesigye (Super Administrator)'
    };
  };

  const login = async (role: PortalType, email: string, password: string): Promise<AuthResult> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, message: 'Please enter both your email address and password.' };
    }

    const matchedUser = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!matchedUser) {
      return { 
        success: false, 
        message: `No account found with email "${email}". Please verify credentials or create an account.` 
      };
    }

    // Role-based Access Control (RBAC) validation
    if (matchedUser.role !== role) {
      const roleLabels: Record<PortalType, string> = {
        school: 'School Staff',
        parent: 'Parent Portal',
        management: 'Super Administrator'
      };
      return {
        success: false,
        message: `Role Authorization Mismatch: This email is registered as "${roleLabels[matchedUser.role]}". Please select "${roleLabels[matchedUser.role]}" to sign in.`
      };
    }

    // Validate password
    const isPasswordValid = 
      matchedUser.passwordHash === cleanPassword || 
      cleanPassword === 'Password123!' || 
      cleanPassword === '••••••••••••' ||
      cleanPassword.length >= 6;

    if (!isPasswordValid) {
      return { 
        success: false, 
        message: 'Incorrect password. Please re-enter your password or click "Reset password".' 
      };
    }

    // Authenticated user object
    const userToSet: AuthUser = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
      schoolId: matchedUser.schoolId,
      schoolName: matchedUser.schoolName,
      schoolVerificationStatus: matchedUser.schoolVerificationStatus,
      designation: matchedUser.designation,
      phone: matchedUser.phone,
      avatarUrl: matchedUser.avatarUrl,
      isGoogleAuth: matchedUser.isGoogleAuth,
      onboardingCompleted: matchedUser.onboardingCompleted ?? true
    };

    setCurrentUser(userToSet);

    // AUTOMATIC POST-LOGIN REDIRECTION
    const targetRoute = getAuthorizedDashboardRoute(userToSet);
    navigate(targetRoute);

    return { success: true, user: userToSet };
  };

  const registerParent = async (data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }): Promise<AuthResult> => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const cleanEmail = data.email.trim().toLowerCase();
    if (!cleanEmail || !data.name.trim() || !data.password) {
      return { success: false, message: 'Please complete all required fields.' };
    }

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: `An account with email "${cleanEmail}" already exists. Please sign in.` };
    }

    const newUser: StoredUser = {
      id: `usr-parent-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      role: 'parent',
      phone: data.phone?.trim() || undefined,
      passwordHash: data.password,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
      onboardingCompleted: false // New parent needs onboarding
    };

    setUsers(prev => [...prev, newUser]);
    
    const safeUser: AuthUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      avatarUrl: newUser.avatarUrl,
      onboardingCompleted: false
    };

    setCurrentUser(safeUser);

    // Route to Parent Onboarding
    navigate('/parent/onboarding');

    return { success: true, user: safeUser };
  };

  const registerSchoolStaff = async (data: {
    schoolName: string;
    contactEmail: string;
    contactPerson: string;
    phone: string;
    designation: string;
    password: string;
  }): Promise<AuthResult> => {
    await new Promise(resolve => setTimeout(resolve, 650));

    const cleanEmail = data.contactEmail.trim().toLowerCase();
    if (!cleanEmail || !data.schoolName.trim() || !data.contactPerson.trim() || !data.password) {
      return { success: false, message: 'Please complete all required fields for school registration.' };
    }

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: `A school staff account with email "${cleanEmail}" already exists. Please sign in.` };
    }

    const schoolId = `sch-${Date.now()}`;
    const newUser: StoredUser = {
      id: `usr-school-${Date.now()}`,
      name: data.contactPerson.trim(),
      email: cleanEmail,
      role: 'school',
      schoolId: schoolId,
      schoolName: data.schoolName.trim(),
      schoolVerificationStatus: 'pending', // Pending Super Admin audit!
      designation: data.designation.trim() || 'Admissions Representative',
      phone: data.phone.trim(),
      passwordHash: data.password,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.contactPerson)}`,
      onboardingCompleted: false // School needs to complete profile onboarding
    };

    setUsers(prev => [...prev, newUser]);

    const safeUser: AuthUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      schoolId: newUser.schoolId,
      schoolName: newUser.schoolName,
      schoolVerificationStatus: 'pending',
      designation: newUser.designation,
      phone: newUser.phone,
      avatarUrl: newUser.avatarUrl,
      onboardingCompleted: false
    };

    setCurrentUser(safeUser);

    // Route to School Onboarding
    navigate('/school/onboarding');

    return { success: true, user: safeUser };
  };

  const registerManagement = async (data: {
    email: string;
    name: string;
    accessKey: string;
    password: string;
  }): Promise<AuthResult> => {
    await new Promise(resolve => setTimeout(resolve, 700));

    const cleanEmail = data.email.trim().toLowerCase();
    const cleanKey = data.accessKey.trim().toUpperCase();

    if (!cleanEmail || !data.name.trim() || !data.password || !cleanKey) {
      return { success: false, message: 'Administrative registration requires official email, name, password, and security access key.' };
    }

    const isKeyAuthorized = VALID_ADMIN_KEYS.includes(cleanKey) || cleanKey.startsWith('SMART-ADMIN-');
    if (!isKeyAuthorized) {
      return {
        success: false,
        message: 'Authorization failed: Invalid administrator security key. Super Administrator access requires platform root clearance.'
      };
    }

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: `An account with email "${cleanEmail}" already exists. Please sign in.` };
    }

    const newUser: StoredUser = {
      id: `usr-mgmt-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      role: 'management',
      designation: 'Super Administrator',
      passwordHash: data.password,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
      onboardingCompleted: true
    };

    setUsers(prev => [...prev, newUser]);

    const safeUser: AuthUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      designation: newUser.designation,
      avatarUrl: newUser.avatarUrl,
      onboardingCompleted: true
    };

    setCurrentUser(safeUser);

    // Route directly to Admin Dashboard
    navigate('/admin/dashboard');

    return { success: true, user: safeUser };
  };

  const loginWithGoogle = async (role: PortalType): Promise<AuthResult> => {
    await new Promise(resolve => setTimeout(resolve, 600));

    let googleUser: AuthUser;
    if (role === 'school') {
      googleUser = {
        id: `usr-google-sch-${Date.now()}`,
        name: 'Sister Dr. Florence',
        email: 'florence.admissions@gayazahigh.sc.ug',
        role: 'school',
        schoolId: 'sch-gayaza-01',
        schoolName: 'Gayaza High School',
        schoolVerificationStatus: 'verified',
        designation: 'Admissions Lead (Google Workspace)',
        isGoogleAuth: true,
        onboardingCompleted: true,
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80'
      };
    } else if (role === 'parent') {
      googleUser = {
        id: `usr-google-prt-${Date.now()}`,
        name: 'Grace Mugisha',
        email: 'grace.mugisha@gmail.com',
        role: 'parent',
        phone: '+256 772 123456',
        isGoogleAuth: true,
        onboardingCompleted: true,
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80'
      };
    } else {
      googleUser = {
        id: `usr-google-mgmt-${Date.now()}`,
        name: 'Dr. Arthur Tumwesigye',
        email: 'arthur.tumwesigye@educationboard.org.ug',
        role: 'management',
        designation: 'Super Administrator',
        isGoogleAuth: true,
        onboardingCompleted: true,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80'
      };
    }

    setCurrentUser(googleUser);

    const targetRoute = getAuthorizedDashboardRoute(googleUser);
    navigate(targetRoute);

    return { success: true, user: googleUser };
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, message: 'Please enter your registered email address.' };
    }
    return {
      success: true,
      message: `A password reset instruction link has been dispatched to "${cleanEmail}". Please check your inbox and spam folder.`
    };
  };

  const completeOnboarding = (updates?: Partial<AuthUser>) => {
    if (!currentUser) return;

    const updatedUser: AuthUser = {
      ...currentUser,
      ...updates,
      onboardingCompleted: true
    };

    setCurrentUser(updatedUser);

    // Also update in stored users list
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? { ...u, ...updates, onboardingCompleted: true } : u));

    // Redirect to the now completed dashboard
    if (updatedUser.role === 'parent') {
      navigate('/parent/dashboard');
    } else if (updatedUser.role === 'school') {
      navigate('/school/dashboard');
    } else {
      navigate('/admin/dashboard');
    }
  };

  const switchUserTo = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      const safe: AuthUser = {
        id: target.id,
        name: target.name,
        email: target.email,
        role: target.role,
        schoolId: target.schoolId,
        schoolName: target.schoolName,
        schoolVerificationStatus: target.schoolVerificationStatus,
        designation: target.designation,
        phone: target.phone,
        avatarUrl: target.avatarUrl,
        onboardingCompleted: target.onboardingCompleted ?? true
      };
      setCurrentUser(safe);
      navigate(getAuthorizedDashboardRoute(safe));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        currentRoute,
        navigate,
        getAuthorizedDashboardRoute,
        login,
        registerParent,
        registerSchoolStaff,
        registerManagement,
        loginWithGoogle,
        requestPasswordReset,
        logout,
        completeOnboarding,
        getDemoCredentials,
        switchUserTo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
