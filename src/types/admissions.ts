export type PortalType = 'school' | 'parent' | 'management';

export type ApplicationStatus = 
  | 'Submitted'
  | 'Verified' 
  | 'Under Review' 
  | 'Interview Scheduled' 
  | 'Admitted' 
  | 'Pending Documents'
  | 'Rejected';

export type SchoolVerificationStatus = 'verified' | 'pending' | 'rejected' | 'suspended';

export interface ChildRecord {
  id: string;
  parentId: string;
  name: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  gradeApplyingFor: string;
  currentSchool?: string;
  pleAggregate?: string;
  notes?: string;
}

export interface SchoolRecord {
  id: string;
  name: string;
  code: string;
  type: 'Day' | 'Boarding' | 'Day & Boarding';
  level: 'Nursery' | 'Primary' | 'Secondary (O & A Level)' | 'Tertiary / Vocational';
  district: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  contactPerson: string;
  verificationStatus: SchoolVerificationStatus;
  profileViews: number;
  inquiriesCount: number;
  rating: number;
  badge?: string;
  description: string;
  tuitionRange: string;
  establishedYear: number;
  intakeCapacity: number;
  facilities: string[];
}

export interface ApplicationTimelineItem {
  id: string;
  date: string;
  title: string;
  description: string;
  status: ApplicationStatus;
}

export interface ApplicantRecord {
  id: string;
  childId?: string;
  studentName: string;
  parentId?: string;
  parentName: string;
  parentEmail?: string;
  parentPhone?: string;
  gradeLevel: string;
  schoolId?: string;
  schoolName: string;
  submissionDate: string;
  status: ApplicationStatus;
  pleAggregate?: string;
  documentsCount: number;
  notes?: string;
  timeline?: ApplicationTimelineItem[];
  avatarColor?: string;
}

export interface SchoolUpdate {
  id: string;
  schoolId: string;
  schoolName: string;
  schoolLogo?: string;
  title: string;
  content: string;
  category: 'announcement' | 'scholarship' | 'event' | 'achievement' | 'discount';
  publishedAt: string;
  reach: number;
  likes: number;
  hasLiked?: boolean;
  ctaText?: string;
  ctaAction?: string;
  pinned?: boolean;
}

export interface Scholarship {
  id: string;
  schoolId: string;
  schoolName: string;
  title: string;
  description: string;
  eligibility: string;
  coverage: string;
  deadline: string;
  educationLevel: string;
  urgent?: boolean;
  applicationsCount: number;
  status: 'active' | 'closed';
}

export interface MessageBubble {
  id: string;
  senderRole: 'parent' | 'school' | 'admin';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface MessageThread {
  id: string;
  schoolId: string;
  schoolName: string;
  parentId: string;
  parentName: string;
  childName?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: MessageBubble[];
}

export interface NotificationItem {
  id: string;
  targetRole: PortalType;
  targetUserId?: string;
  targetSchoolId?: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'application' | 'verification' | 'message' | 'announcement';
}

export interface PlatformActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'school_reg' | 'verification' | 'parent_reg' | 'application' | 'status_change';
}

export interface SchoolRegistrationData {
  schoolName: string;
  schoolType: 'Day' | 'Boarding' | 'Day & Boarding';
  level: 'Nursery' | 'Primary' | 'Secondary (O & A Level)' | 'Tertiary / Vocational';
  district: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  estimatedIntake: string;
  notes?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: PortalType;
  schoolId?: string;
  schoolName?: string;
  schoolVerificationStatus?: SchoolVerificationStatus;
  designation?: string;
  phone?: string;
  avatarUrl?: string;
  isGoogleAuth?: boolean;
  onboardingCompleted?: boolean;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: AuthUser;
}

export interface ParentProfileRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  ninNumber: string; // National ID
  occupation?: string;
  registeredDate: string;
  status: 'verified' | 'unverified';
  childrenCount: number;
  activeApplicationsCount: number;
}

export type SubscriptionTier = 'Free Starter' | 'School Growth' | 'Institutional Premier';
export type SubscriptionStatus = 'Active' | 'Trial' | 'Overdue' | 'Canceled';
export type PaymentGateway = 'MTN Mobile Money' | 'Airtel Money' | 'Stanbic Bank Wire' | 'Visa / Mastercard';

export interface SubscriptionRecord {
  id: string;
  schoolId: string;
  schoolName: string;
  plan: SubscriptionTier;
  amountUgx: number;
  billingCycle: 'Termly' | 'Annual';
  nextBillingDate: string;
  status: SubscriptionStatus;
  paymentMethod: PaymentGateway;
  lastPaymentDate: string;
  quotaUsed: number;
  quotaLimit: number;
  contactEmail: string;
}

export interface PlatformSettings {
  unebGatewayEnabled: boolean;
  unebApiEndpoint: string;
  unebLastSync: string;
  smsGatewayEnabled: boolean;
  smsSenderId: string;
  smsBalanceUgx: number;
  emailGatewayEnabled: boolean;
  maintenanceMode: boolean;
  admissionsCycleName: string;
  admissionsCycleActive: boolean;
  applicationFeeUgx: number;
  twoFactorEnforced: boolean;
  autoVerificationScoreThreshold: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  target: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'error';
}



