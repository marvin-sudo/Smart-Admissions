import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SchoolRecord, 
  ApplicantRecord, 
  ChildRecord, 
  SchoolUpdate, 
  Scholarship, 
  MessageThread, 
  NotificationItem, 
  PlatformActivityItem,
  ApplicationStatus,
  SchoolVerificationStatus,
  PortalType,
  ParentProfileRecord,
  SubscriptionRecord,
  SubscriptionTier,
  SubscriptionStatus,
  PlatformSettings,
  AuditLogEntry
} from '../types/admissions';

const DB_STORAGE_KEY = 'smart_admissions_db_v3';

// Initial pre-seeded authoritative records
const INITIAL_SCHOOLS: SchoolRecord[] = [
  {
    id: 'sch-gayaza-01',
    name: 'Gayaza High School',
    code: 'GHS-001',
    type: 'Boarding',
    level: 'Secondary (O & A Level)',
    district: 'Wakiso',
    location: 'Gayaza, Wakiso District',
    contactEmail: 'admissions@gayazahigh.sc.ug',
    contactPhone: '+256 414 567890',
    contactPerson: 'Sister Dr. Florence',
    verificationStatus: 'verified',
    profileViews: 1420,
    inquiriesCount: 168,
    rating: 4.9,
    badge: 'UNEB Center No. U0001',
    description: 'Uganda’s premier girls secondary boarding school committed to academic excellence, leadership development, and holistic Christian values since 1905.',
    tuitionRange: 'UGX 1,850,000 - 2,400,000 / Term',
    establishedYear: 1905,
    intakeCapacity: 280,
    facilities: ['Modern Science Laboratories', 'Olympic Swimming Pool', 'ICT Robotics Center', 'Agricultural Farm Lab', 'Sanatorium']
  },
  {
    id: 'sch-smack-02',
    name: 'St. Mary’s College Kisubi',
    code: 'SMACK-002',
    type: 'Boarding',
    level: 'Secondary (O & A Level)',
    district: 'Wakiso',
    location: 'Kisubi, Entebbe Road',
    contactEmail: 'admissions@smack.sc.ug',
    contactPhone: '+256 414 321456',
    contactPerson: 'Bro. Augustine Mugabo',
    verificationStatus: 'verified',
    profileViews: 1890,
    inquiriesCount: 215,
    rating: 4.9,
    badge: 'UNEB Center No. U0002',
    description: 'A distinguished Catholic boys boarding secondary school founded by the Brothers of Christian Instruction, fostering academic distinction and ethical leadership.',
    tuitionRange: 'UGX 2,100,000 - 2,650,000 / Term',
    establishedYear: 1906,
    intakeCapacity: 300,
    facilities: ['Digital Innovation Hub', 'Sports Complex', 'Multi-Purpose Auditorium', 'Specialist Physics Labs', 'Modern Chapel']
  },
  {
    id: 'sch-greenhill-03',
    name: 'Greenhill Academy',
    code: 'GHA-003',
    type: 'Day',
    level: 'Primary',
    district: 'Kampala',
    location: 'Kibuli & Buwaate Campuses, Kampala',
    contactEmail: 'info@greenhillacademy.ac.ug',
    contactPhone: '+256 414 234567',
    contactPerson: 'Mrs. Joy Veronica Maraka',
    verificationStatus: 'verified',
    profileViews: 1250,
    inquiriesCount: 142,
    rating: 4.8,
    badge: 'UNEB & Cambridge Certified',
    description: 'An outstanding private co-educational day academy delivering both UNEB and International curricula with rich co-curricular programs.',
    tuitionRange: 'UGX 1,500,000 - 2,200,000 / Term',
    establishedYear: 1989,
    intakeCapacity: 240,
    facilities: ['Heated Junior Pool', 'STEM Maker Space', 'Music & Performing Arts Wing', 'Junior Tennis Courts']
  },
  {
    id: 'sch-budo-04',
    name: 'King’s College Budo',
    code: 'KCB-004',
    type: 'Boarding',
    level: 'Secondary (O & A Level)',
    district: 'Wakiso',
    location: 'Budo Hill, Wakiso',
    contactEmail: 'admissions@kcbudo.sc.ug',
    contactPhone: '+256 414 789012',
    contactPerson: 'Mr. Patrick Bakka Male',
    verificationStatus: 'verified',
    profileViews: 1650,
    inquiriesCount: 198,
    rating: 4.9,
    badge: 'Historic National Center',
    description: 'Prestigious mixed boarding school on Budo Hill, renowned for producing national scholars, statesmen, and pioneering professionals.',
    tuitionRange: 'UGX 2,000,000 - 2,500,000 / Term',
    establishedYear: 1906,
    intakeCapacity: 260,
    facilities: ['Heritage Memorial Library', 'Athletics Oval', 'Computer Science Center', 'Biological Observatory']
  },
  {
    id: 'sch-namagunga-05',
    name: 'Mt. St. Mary’s College Namagunga',
    code: 'MSMN-005',
    type: 'Boarding',
    level: 'Secondary (O & A Level)',
    district: 'Mukono',
    location: 'Namagunga, Mukono District',
    contactEmail: 'admissions@msmnamagunga.sc.ug',
    contactPhone: '+256 414 678901',
    contactPerson: 'Sister Regina Nabawanuka',
    verificationStatus: 'verified',
    profileViews: 1120,
    inquiriesCount: 130,
    rating: 4.85,
    badge: 'National Academic Beacon',
    description: 'Dedicated to cultivating academically empowered, morally sound, and socially transformative young women in Uganda.',
    tuitionRange: 'UGX 1,950,000 - 2,450,000 / Term',
    establishedYear: 1942,
    intakeCapacity: 220,
    facilities: ['Advanced Chemistry Labs', 'Botanical Gardens', 'Indoor Gymnasium', 'Language Resource Center']
  },
  {
    id: 'sch-seeta-06',
    name: 'Seeta High School Green Campus',
    code: 'SHS-006',
    type: 'Boarding',
    level: 'Secondary (O & A Level)',
    district: 'Mukono',
    location: 'Seeta, Mukono',
    contactEmail: 'registrar@seetahigh.ac.ug',
    contactPhone: '+256 772 998877',
    contactPerson: 'Mr. Davis Byaruhanga',
    verificationStatus: 'pending', // Awaiting Super Admin verification approval!
    profileViews: 410,
    inquiriesCount: 39,
    rating: 4.5,
    badge: 'Applicant Under MoES Audit',
    description: 'Modern high school campus established with eco-friendly infrastructure and modern science and ICT learning hubs.',
    tuitionRange: 'UGX 1,600,000 - 2,100,000 / Term',
    establishedYear: 2018,
    intakeCapacity: 200,
    facilities: ['Solar Tech Lab', 'Standard Football Turf', 'Computer Wing']
  }
];

const INITIAL_CHILDREN: ChildRecord[] = [
  {
    id: 'ch-01',
    parentId: 'usr-parent-01',
    name: 'Trevor Mugisha',
    gender: 'Male',
    dateOfBirth: '2012-05-14',
    gradeApplyingFor: 'Senior 1 (S.1)',
    currentSchool: 'Kampala Parents’ School',
    pleAggregate: '4 Aggregates (Div 1)',
    notes: 'Excels in Mathematics and Science, passionate about junior coding and chess.'
  },
  {
    id: 'ch-02',
    parentId: 'usr-parent-01',
    name: 'Sarah Mugisha',
    gender: 'Female',
    dateOfBirth: '2014-08-22',
    gradeApplyingFor: 'Primary 5 (P.5)',
    currentSchool: 'Kampala Parents’ School',
    pleAggregate: 'Pre-Primary Assessment Distinction',
    notes: 'Active in choir and drama, outstanding English literacy scores.'
  }
];

const INITIAL_APPLICATIONS: ApplicantRecord[] = [
  {
    id: 'ADM-2026-0142',
    childId: 'ch-01',
    studentName: 'Trevor Mugisha',
    parentId: 'usr-parent-01',
    parentName: 'Grace Mugisha',
    parentEmail: 'grace.mugisha@gmail.com',
    parentPhone: '+256 772 123456',
    gradeLevel: 'Senior 1 (S.1)',
    schoolId: 'sch-smack-02',
    schoolName: 'St. Mary’s College Kisubi',
    submissionDate: 'Oct 24, 2026',
    status: 'Verified',
    pleAggregate: '4 Aggregates (Div 1)',
    documentsCount: 4,
    notes: 'PLE Result Slip, Birth Certificate, Baptism Card, and Recommendation Letter verified.',
    timeline: [
      { id: 'tl-1', date: 'Oct 24, 2026 09:15', title: 'Application Submitted', description: 'Application received and intake dossier logged.', status: 'Submitted' },
      { id: 'tl-2', date: 'Oct 25, 2026 14:30', title: 'Academic Slip Verified', description: 'PLE 4 Aggregates verified against UNEB registry.', status: 'Verified' }
    ],
    avatarColor: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'ADM-2026-0141',
    childId: 'ch-01',
    studentName: 'Trevor Mugisha',
    parentId: 'usr-parent-01',
    parentName: 'Grace Mugisha',
    parentEmail: 'grace.mugisha@gmail.com',
    parentPhone: '+256 772 123456',
    gradeLevel: 'Senior 1 (S.1)',
    schoolId: 'sch-gayaza-01',
    schoolName: 'Gayaza High School',
    submissionDate: 'Oct 22, 2026',
    status: 'Under Review',
    pleAggregate: '4 Aggregates (Div 1)',
    documentsCount: 5,
    notes: 'Submitted for cross-campus transfer program assessment.',
    timeline: [
      { id: 'tl-3', date: 'Oct 22, 2026 11:00', title: 'Application Submitted', description: 'Dossier uploaded via Smart Admissions.', status: 'Submitted' },
      { id: 'tl-4', date: 'Oct 23, 2026 16:45', title: 'Under Admissions Committee Review', description: 'Department head reviewing curriculum records.', status: 'Under Review' }
    ],
    avatarColor: 'bg-purple-100 text-[#0000B7]'
  },
  {
    id: 'ADM-2026-0140',
    studentName: 'Brian Okello',
    parentName: 'Agnes Okello',
    parentEmail: 'agnes.okello@gmail.com',
    parentPhone: '+256 782 554433',
    gradeLevel: 'Primary 1 (P.1)',
    schoolId: 'sch-greenhill-03',
    schoolName: 'Greenhill Academy',
    submissionDate: 'Oct 21, 2026',
    status: 'Admitted',
    pleAggregate: 'Pre-Primary Assessment A',
    documentsCount: 3,
    timeline: [
      { id: 'tl-5', date: 'Oct 21, 2026', title: 'Application Submitted', description: 'Application logged.', status: 'Submitted' },
      { id: 'tl-6', date: 'Oct 23, 2026', title: 'Admitted', description: 'Formal admission letter dispatched.', status: 'Admitted' }
    ],
    avatarColor: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'ADM-2026-0139',
    studentName: 'Sarah Nakato',
    parentName: 'Patrick Musoke',
    parentEmail: 'patrick.musoke@yahoo.com',
    parentPhone: '+256 701 443322',
    gradeLevel: 'Senior 5 (S.5)',
    schoolId: 'sch-namagunga-05',
    schoolName: 'Mt. St. Mary’s College Namagunga',
    submissionDate: 'Oct 20, 2026',
    status: 'Interview Scheduled',
    pleAggregate: 'UCE: 8 in 8 (Div 1)',
    documentsCount: 4,
    timeline: [
      { id: 'tl-7', date: 'Oct 20, 2026', title: 'Application Submitted', description: 'Application logged.', status: 'Submitted' },
      { id: 'tl-8', date: 'Oct 22, 2026', title: 'Interview Scheduled', description: 'Oral interview scheduled for Nov 04.', status: 'Interview Scheduled' }
    ],
    avatarColor: 'bg-amber-100 text-amber-800'
  },
  {
    id: 'ADM-2026-0138',
    studentName: 'Joan Namubiru',
    parentName: 'Edward Namubiru',
    parentEmail: 'edward.namubiru@gmail.com',
    parentPhone: '+256 752 987654',
    gradeLevel: 'Senior 1 (S.1)',
    schoolId: 'sch-gayaza-01',
    schoolName: 'Gayaza High School',
    submissionDate: 'Oct 19, 2026',
    status: 'Interview Scheduled',
    pleAggregate: '5 Aggregates (Div 1)',
    documentsCount: 5,
    timeline: [
      { id: 'tl-9', date: 'Oct 19, 2026', title: 'Application Submitted', description: 'Application logged.', status: 'Submitted' },
      { id: 'tl-10', date: 'Oct 21, 2026', title: 'Interview Scheduled', description: 'Entrance assessment set for Nov 02.', status: 'Interview Scheduled' }
    ],
    avatarColor: 'bg-purple-100 text-purple-800'
  }
];

const INITIAL_UPDATES: SchoolUpdate[] = [
  {
    id: 'upd-01',
    schoolId: 'sch-gayaza-01',
    schoolName: 'Gayaza High School',
    title: 'Senior One 2027 Admission Cycle Officially Open',
    content: 'We are pleased to invite online applications for the 2027 academic intake. Prospective students with Division 1 PLE results can submit applications, academic transcripts, and recommendation letters directly through Smart Admissions.',
    category: 'announcement',
    publishedAt: '2 hours ago',
    reach: 1240,
    likes: 86,
    ctaText: 'Apply to Gayaza'
  },
  {
    id: 'upd-02',
    schoolId: 'sch-smack-02',
    schoolName: 'St. Mary’s College Kisubi',
    title: 'Centenary STEM & Robotics Scholarship Applications Open',
    content: 'SMACK is offering five full-tuition STEM scholarships for exceptional Senior One entrants demonstrating remarkable innovation in science, mathematics, or junior computer programming.',
    category: 'scholarship',
    publishedAt: 'Yesterday',
    reach: 1680,
    likes: 132,
    ctaText: 'View Scholarship'
  },
  {
    id: 'upd-03',
    schoolId: 'sch-greenhill-03',
    schoolName: 'Greenhill Academy',
    title: 'Annual Open Day & Campus Discovery Tour Scheduled',
    content: 'Join our faculty and student leaders on Saturday, November 15 for guided tours of our science labs, swimming facility, and modern digital library. Pre-registration is open now.',
    category: 'event',
    publishedAt: '3 days ago',
    reach: 890,
    likes: 47,
    ctaText: 'Register for Open Day'
  }
];

const INITIAL_SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'sch-01',
    schoolId: 'sch-smack-02',
    schoolName: 'St. Mary’s College Kisubi',
    title: 'Centenary STEM & Robotics Excellence Scholarship',
    description: '100% full boarding tuition coverage for top-tier candidates who scored 4 or 5 in PLE and passed the national science olympiad assessment.',
    eligibility: 'Div 1 (4-5 aggregates) + STEM portfolio',
    coverage: '100% Tuition & Boarding',
    deadline: 'Nov 20, 2026',
    educationLevel: 'Senior 1 (S.1)',
    urgent: true,
    applicationsCount: 38,
    status: 'active'
  },
  {
    id: 'sch-02',
    schoolId: 'sch-gayaza-01',
    schoolName: 'Gayaza High School',
    title: 'Joan Cox All-Round Leadership Grant',
    description: '50% tuition waiver for brilliant girls showing outstanding academic performance coupled with demonstrated community or church service leadership.',
    eligibility: 'Girls applying for S.1 or S.5 with Div 1',
    coverage: '50% Tuition Waiver',
    deadline: 'Nov 30, 2026',
    educationLevel: 'Senior 1 & Senior 5',
    urgent: false,
    applicationsCount: 52,
    status: 'active'
  },
  {
    id: 'sch-03',
    schoolId: 'sch-greenhill-03',
    schoolName: 'Greenhill Academy',
    title: 'Junior Creative Arts & Music Bursary',
    description: 'Merit-based grant honoring musical or creative talent for students joining Primary 4 through Primary 6.',
    eligibility: 'Ages 9-11 with proven music/art grade certificates',
    coverage: 'UGX 1,000,000 / Term',
    deadline: 'Dec 05, 2026',
    educationLevel: 'Primary 4 - 6',
    urgent: false,
    applicationsCount: 19,
    status: 'active'
  }
];

const INITIAL_THREADS: MessageThread[] = [
  {
    id: 'th-01',
    schoolId: 'sch-smack-02',
    schoolName: 'St. Mary’s College Kisubi',
    parentId: 'usr-parent-01',
    parentName: 'Grace Mugisha',
    childName: 'Trevor Mugisha',
    lastMessage: 'Your PLE aggregate verification has been confirmed. The interview schedule will be sent via SMS shortly.',
    lastMessageTime: '10:45 AM',
    unreadCount: 1,
    messages: [
      { id: 'm1', senderRole: 'parent', senderName: 'Grace Mugisha', text: 'Good morning, please confirm if Trevor’s PLE slip was received clearly.', timestamp: 'Yesterday 09:20' },
      { id: 'm2', senderRole: 'school', senderName: 'Bro. Augustine (SMACK)', text: 'Hello Grace, yes we received it! Your PLE aggregate verification has been confirmed. The interview schedule will be sent via SMS shortly.', timestamp: '10:45 AM' }
    ]
  },
  {
    id: 'th-02',
    schoolId: 'sch-gayaza-01',
    schoolName: 'Gayaza High School',
    parentId: 'usr-parent-01',
    parentName: 'Grace Mugisha',
    childName: 'Sarah Mugisha',
    lastMessage: 'Thank you for your interest in Gayaza High School. Does Sarah have interest in the agricultural club?',
    lastMessageTime: '2 days ago',
    unreadCount: 0,
    messages: [
      { id: 'm3', senderRole: 'parent', senderName: 'Grace Mugisha', text: 'Hello Sister Florence, we have submitted Sarah’s inquiry for primary transition.', timestamp: '3 days ago' },
      { id: 'm4', senderRole: 'school', senderName: 'Sister Florence (Gayaza)', text: 'Thank you for your interest in Gayaza High School. Does Sarah have interest in the agricultural club?', timestamp: '2 days ago' }
    ]
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'nt-01',
    targetRole: 'parent',
    targetUserId: 'usr-parent-01',
    title: 'Academic Slip Verified',
    message: 'St. Mary’s College Kisubi verified Trevor Mugisha’s 4 Aggregates (Div 1).',
    time: '25 mins ago',
    read: false,
    type: 'application'
  },
  {
    id: 'nt-02',
    targetRole: 'school',
    targetSchoolId: 'sch-gayaza-01',
    title: 'New Application Received',
    message: 'Trevor Mugisha submitted an application for Senior 1 (S.1).',
    time: '2 hours ago',
    read: false,
    type: 'application'
  },
  {
    id: 'nt-03',
    targetRole: 'management',
    title: 'New School Registration',
    message: 'Seeta High School Green Campus registered and requested Super Admin verification audit.',
    time: '4 hours ago',
    read: false,
    type: 'verification'
  }
];

const INITIAL_ACTIVITY: PlatformActivityItem[] = [
  {
    id: 'act-1',
    title: 'New Application Submitted',
    description: 'Trevor Mugisha applied to St. Mary’s College Kisubi (S.1)',
    timestamp: '15 mins ago',
    type: 'application'
  },
  {
    id: 'act-2',
    title: 'Document Verified',
    description: 'Gayaza High School verified PLE result slip for Joan Namubiru',
    timestamp: '45 mins ago',
    type: 'status_change'
  },
  {
    id: 'act-3',
    title: 'School Verification Requested',
    description: 'Seeta High School Green Campus submitted registration documents',
    timestamp: '2 hours ago',
    type: 'school_reg'
  },
  {
    id: 'act-4',
    title: 'Parent Registered',
    description: 'Grace Mugisha joined Smart Admissions parent portal',
    timestamp: '5 hours ago',
    type: 'parent_reg'
  }
];

const INITIAL_PARENTS: ParentProfileRecord[] = [
  {
    id: 'usr-parent-01',
    name: 'Grace Mugisha',
    email: 'grace.mugisha@gmail.com',
    phone: '+256 772 123456',
    district: 'Kampala (Kololo)',
    ninNumber: 'CM84021102K8P',
    occupation: 'Financial Analyst, Bank of Uganda',
    registeredDate: 'Sep 12, 2026',
    status: 'verified',
    childrenCount: 2,
    activeApplicationsCount: 2
  },
  {
    id: 'usr-parent-02',
    name: 'Agnes Okello',
    email: 'agnes.okello@gmail.com',
    phone: '+256 782 554433',
    district: 'Wakiso (Kira)',
    ninNumber: 'CF87019231M1A',
    occupation: 'Senior Pediatrician, Mulago Hospital',
    registeredDate: 'Sep 28, 2026',
    status: 'verified',
    childrenCount: 1,
    activeApplicationsCount: 1
  },
  {
    id: 'usr-parent-03',
    name: 'Patrick Musoke',
    email: 'patrick.musoke@yahoo.com',
    phone: '+256 701 443322',
    district: 'Mukono (Central)',
    ninNumber: 'CM80091482R9Z',
    occupation: 'Civil Engineer, UNRA',
    registeredDate: 'Oct 04, 2026',
    status: 'verified',
    childrenCount: 2,
    activeApplicationsCount: 1
  },
  {
    id: 'usr-parent-04',
    name: 'Edward Namubiru',
    email: 'edward.namubiru@gmail.com',
    phone: '+256 752 987654',
    district: 'Jinja (Walukuba)',
    ninNumber: 'CM83051644J3D',
    occupation: 'Agronomist & Entrepreneur',
    registeredDate: 'Oct 10, 2026',
    status: 'verified',
    childrenCount: 1,
    activeApplicationsCount: 1
  },
  {
    id: 'usr-parent-05',
    name: 'Dr. Sarah Byanyima',
    email: 'sarah.byanyima@makerere.ac.ug',
    phone: '+256 772 881122',
    district: 'Kampala (Naguru)',
    ninNumber: 'CF79031201B4C',
    occupation: 'Associate Professor, Makerere University',
    registeredDate: 'Oct 15, 2026',
    status: 'verified',
    childrenCount: 2,
    activeApplicationsCount: 0
  },
  {
    id: 'usr-parent-06',
    name: 'David Kasumba',
    email: 'david.kasumba@stanbic.com',
    phone: '+256 700 332211',
    district: 'Wakiso (Entebbe)',
    ninNumber: 'CM86072199F7K',
    occupation: 'Commercial Banking Lead',
    registeredDate: 'Oct 19, 2026',
    status: 'unverified',
    childrenCount: 1,
    activeApplicationsCount: 0
  }
];

const INITIAL_SUBSCRIPTIONS: SubscriptionRecord[] = [
  {
    id: 'sub-01',
    schoolId: 'sch-gayaza-01',
    schoolName: 'Gayaza High School',
    plan: 'Institutional Premier',
    amountUgx: 4800000,
    billingCycle: 'Annual',
    nextBillingDate: 'Jan 15, 2027',
    status: 'Active',
    paymentMethod: 'Stanbic Bank Wire',
    lastPaymentDate: 'Jan 15, 2026',
    quotaUsed: 420,
    quotaLimit: 2500,
    contactEmail: 'admissions@gayazahigh.sc.ug'
  },
  {
    id: 'sub-02',
    schoolId: 'sch-smack-02',
    schoolName: 'St. Mary’s College Kisubi',
    plan: 'Institutional Premier',
    amountUgx: 4800000,
    billingCycle: 'Annual',
    nextBillingDate: 'Feb 01, 2027',
    status: 'Active',
    paymentMethod: 'Stanbic Bank Wire',
    lastPaymentDate: 'Feb 01, 2026',
    quotaUsed: 580,
    quotaLimit: 2500,
    contactEmail: 'admissions@smack.sc.ug'
  },
  {
    id: 'sub-03',
    schoolId: 'sch-greenhill-03',
    schoolName: 'Greenhill Academy',
    plan: 'Institutional Premier',
    amountUgx: 1750000,
    billingCycle: 'Termly',
    nextBillingDate: 'Dec 10, 2026',
    status: 'Active',
    paymentMethod: 'Visa / Mastercard',
    lastPaymentDate: 'Aug 10, 2026',
    quotaUsed: 310,
    quotaLimit: 1500,
    contactEmail: 'info@greenhillacademy.ac.ug'
  },
  {
    id: 'sub-04',
    schoolId: 'sch-budo-04',
    schoolName: 'King’s College Budo',
    plan: 'School Growth',
    amountUgx: 850000,
    billingCycle: 'Termly',
    nextBillingDate: 'Nov 30, 2026',
    status: 'Active',
    paymentMethod: 'MTN Mobile Money',
    lastPaymentDate: 'Jul 30, 2026',
    quotaUsed: 195,
    quotaLimit: 800,
    contactEmail: 'admissions@kcbudo.sc.ug'
  },
  {
    id: 'sub-05',
    schoolId: 'sch-namagunga-05',
    schoolName: 'Mt. St. Mary’s College Namagunga',
    plan: 'School Growth',
    amountUgx: 850000,
    billingCycle: 'Termly',
    nextBillingDate: 'Dec 01, 2026',
    status: 'Active',
    paymentMethod: 'Airtel Money',
    lastPaymentDate: 'Aug 01, 2026',
    quotaUsed: 180,
    quotaLimit: 800,
    contactEmail: 'admissions@msmnamagunga.sc.ug'
  },
  {
    id: 'sub-06',
    schoolId: 'sch-seeta-06',
    schoolName: 'Seeta High School Green Campus',
    plan: 'Free Starter',
    amountUgx: 0,
    billingCycle: 'Termly',
    nextBillingDate: 'Nov 15, 2026',
    status: 'Trial',
    paymentMethod: 'MTN Mobile Money',
    lastPaymentDate: 'Oct 15, 2026',
    quotaUsed: 22,
    quotaLimit: 50,
    contactEmail: 'registrar@seetahigh.ac.ug'
  }
];

const INITIAL_PLATFORM_SETTINGS: PlatformSettings = {
  unebGatewayEnabled: true,
  unebApiEndpoint: 'https://api.uneb.go.ug/v2/verification/results',
  unebLastSync: 'Today at 08:30 EAT',
  smsGatewayEnabled: true,
  smsSenderId: 'SMART-ADMIT',
  smsBalanceUgx: 1845000,
  emailGatewayEnabled: true,
  maintenanceMode: false,
  admissionsCycleName: '2027 Academic Intake (Primary & Secondary)',
  admissionsCycleActive: true,
  applicationFeeUgx: 35000,
  twoFactorEnforced: true,
  autoVerificationScoreThreshold: 12
};

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-01',
    timestamp: 'Today, 11:24 EAT',
    actorName: 'Dr. Ronald Mukasa',
    actorRole: 'Super Administrator',
    action: 'UNEB Center Verification',
    target: 'Gayaza High School (U0001)',
    details: 'Verified accreditation and updated annual intake ceiling to 280 seats.',
    ipAddress: '196.43.102.14',
    status: 'success'
  },
  {
    id: 'aud-02',
    timestamp: 'Today, 09:40 EAT',
    actorName: 'System Automated Worker',
    actorRole: 'System Daemon',
    action: 'UNEB API Index Synchronization',
    target: 'PLE 2025/2026 Candidates Database',
    details: 'Synchronized 4,892 verified student index numbers for automated slip matching.',
    ipAddress: '10.0.4.12',
    status: 'success'
  },
  {
    id: 'aud-03',
    timestamp: 'Yesterday, 16:15 EAT',
    actorName: 'Dr. Ronald Mukasa',
    actorRole: 'Super Administrator',
    action: 'Institutional Subscription Provisioned',
    target: 'Greenhill Academy',
    details: 'Approved Institutional Premier renewal via Visa/Mastercard gateway.',
    ipAddress: '196.43.102.14',
    status: 'success'
  },
  {
    id: 'aud-04',
    timestamp: 'Yesterday, 14:02 EAT',
    actorName: 'Security Firewall Guard',
    actorRole: 'Security Service',
    action: 'Failed Login Blocked',
    target: 'superadmin_portal_attempt',
    details: 'Rate-limited repeated invalid credential attempts from unauthorized subnet.',
    ipAddress: '41.210.154.88',
    status: 'warning'
  },
  {
    id: 'aud-05',
    timestamp: '2 days ago',
    actorName: 'Dr. Ronald Mukasa',
    actorRole: 'Super Administrator',
    action: 'New School Audited',
    target: 'Seeta High School Green Campus',
    details: 'Flagged registration for inspection of UNEB exam center license.',
    ipAddress: '196.43.102.14',
    status: 'success'
  }
];

interface AdmissionsDataContextType {
  schools: SchoolRecord[];
  applications: ApplicantRecord[];
  children: ChildRecord[];
  parents: ParentProfileRecord[];
  updates: SchoolUpdate[];
  scholarships: Scholarship[];
  subscriptions: SubscriptionRecord[];
  platformSettings: PlatformSettings;
  auditLogs: AuditLogEntry[];
  threads: MessageThread[];
  notifications: NotificationItem[];
  activities: PlatformActivityItem[];
  savedSchoolIds: string[];

  // Mutators connecting all roles
  submitApplication: (data: {
    childId: string;
    studentName: string;
    parentId: string;
    parentName: string;
    parentEmail: string;
    parentPhone?: string;
    schoolId: string;
    gradeLevel: string;
    pleAggregate?: string;
    notes?: string;
  }) => Promise<{ success: boolean; application: ApplicantRecord }>;

  updateApplicationStatus: (
    applicationId: string, 
    newStatus: ApplicationStatus, 
    note?: string
  ) => Promise<{ success: boolean; message: string }>;

  createSchoolUpdate: (data: {
    schoolId: string;
    schoolName: string;
    title: string;
    content: string;
    category: 'announcement' | 'scholarship' | 'event' | 'achievement' | 'discount';
    ctaText?: string;
  }) => Promise<{ success: boolean; update: SchoolUpdate }>;

  likeSchoolUpdate: (updateId: string) => void;

  createScholarship: (data: {
    schoolId: string;
    schoolName: string;
    title: string;
    description: string;
    eligibility: string;
    coverage: string;
    deadline: string;
    educationLevel: string;
  }) => Promise<{ success: boolean; scholarship: Scholarship }>;

  verifySchool: (
    schoolId: string, 
    status: SchoolVerificationStatus,
    reason?: string
  ) => Promise<{ success: boolean; message: string }>;

  sendMessage: (
    threadId: string | null,
    schoolId: string,
    parentId: string,
    senderRole: 'parent' | 'school' | 'admin',
    senderName: string,
    text: string,
    childName?: string
  ) => Promise<{ success: boolean; threadId: string }>;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (role: PortalType) => void;
  toggleSaveSchool: (schoolId: string) => void;
  addChild: (child: Omit<ChildRecord, 'id'>) => Promise<ChildRecord>;
  updateChild: (childId: string, updates: Partial<ChildRecord>) => void;
  deleteChild: (childId: string) => void;
  updateParentProfile: (parentId: string, updates: Partial<ParentProfileRecord>) => void;
  acceptOffer: (applicationId: string) => Promise<boolean>;
  declineOffer: (applicationId: string) => Promise<boolean>;
  withdrawApplication: (applicationId: string, reason?: string) => Promise<boolean>;
  updateSchoolProfile: (schoolId: string, updates: Partial<SchoolRecord>) => Promise<boolean>;
  registerNewSchoolInDb: (data: {
    name: string;
    type: 'Day' | 'Boarding' | 'Day & Boarding';
    level: 'Nursery' | 'Primary' | 'Secondary (O & A Level)' | 'Tertiary / Vocational';
    district: string;
    contactPerson: string;
    contactEmail: string;
    contactPhone: string;
    description?: string;
  }) => Promise<SchoolRecord>;

  // Super Admin Mutators & Actions
  updateSubscription: (schoolId: string, plan: SubscriptionTier, status?: SubscriptionStatus) => void;
  updatePlatformSettings: (settings: Partial<PlatformSettings>) => void;
  deleteUpdate: (updateId: string) => void;
  pinUpdate: (updateId: string) => void;
  createBroadcastAnnouncement: (title: string, content: string, ctaText?: string) => Promise<{ success: boolean; update: SchoolUpdate }>;
  toggleScholarshipStatus: (scholarshipId: string) => void;
  addScholarship: (scholarship: Omit<Scholarship, 'id' | 'applicationsCount'>) => Promise<Scholarship>;
  overrideApplicationStatus: (id: string, status: ApplicationStatus, auditNote?: string) => Promise<boolean>;
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
}

const AdmissionsDataContext = createContext<AdmissionsDataContextType | undefined>(undefined);

export const AdmissionsDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from local storage or defaults
  const [schools, setSchools] = useState<SchoolRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${DB_STORAGE_KEY}_schools`);
      return saved ? JSON.parse(saved) : INITIAL_SCHOOLS;
    } catch {
      return INITIAL_SCHOOLS;
    }
  });

  const [applications, setApplications] = useState<ApplicantRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${DB_STORAGE_KEY}_apps`);
      return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  const [registeredChildren, setRegisteredChildren] = useState<ChildRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${DB_STORAGE_KEY}_children`);
      return saved ? JSON.parse(saved) : INITIAL_CHILDREN;
    } catch {
      return INITIAL_CHILDREN;
    }
  });

  const [updates, setUpdates] = useState<SchoolUpdate[]>(() => {
    try {
      const saved = localStorage.getItem(`${DB_STORAGE_KEY}_updates`);
      return saved ? JSON.parse(saved) : INITIAL_UPDATES;
    } catch {
      return INITIAL_UPDATES;
    }
  });

  const [scholarships, setScholarships] = useState<Scholarship[]>(() => {
    try {
      const saved = localStorage.getItem(`${DB_STORAGE_KEY}_scholarships`);
      return saved ? JSON.parse(saved) : INITIAL_SCHOLARSHIPS;
    } catch {
      return INITIAL_SCHOLARSHIPS;
    }
  });

  const [threads, setThreads] = useState<MessageThread[]>(() => {
    try {
      const saved = localStorage.getItem(`${DB_STORAGE_KEY}_threads`);
      return saved ? JSON.parse(saved) : INITIAL_THREADS;
    } catch {
      return INITIAL_THREADS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${DB_STORAGE_KEY}_notifs`);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [activities, setActivities] = useState<PlatformActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${DB_STORAGE_KEY}_activity`);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITY;
    } catch {
      return INITIAL_ACTIVITY;
    }
  });

  const [savedSchoolIds, setSavedSchoolIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${DB_STORAGE_KEY}_saved_schools`);
      return saved ? JSON.parse(saved) : ['sch-gayaza-01', 'sch-smack-02'];
    } catch {
      return ['sch-gayaza-01', 'sch-smack-02'];
    }
  });

  const [parents, setParents] = useState<ParentProfileRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${DB_STORAGE_KEY}_parents`);
      return saved ? JSON.parse(saved) : INITIAL_PARENTS;
    } catch {
      return INITIAL_PARENTS;
    }
  });

  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${DB_STORAGE_KEY}_subscriptions`);
      return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
    } catch {
      return INITIAL_SUBSCRIPTIONS;
    }
  });

  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() => {
    try {
      const saved = localStorage.getItem(`${DB_STORAGE_KEY}_settings`);
      return saved ? JSON.parse(saved) : INITIAL_PLATFORM_SETTINGS;
    } catch {
      return INITIAL_PLATFORM_SETTINGS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`${DB_STORAGE_KEY}_audit`);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${DB_STORAGE_KEY}_schools`, JSON.stringify(schools));
    } catch {}
  }, [schools]);

  useEffect(() => {
    try {
      localStorage.setItem(`${DB_STORAGE_KEY}_apps`, JSON.stringify(applications));
    } catch {}
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(`${DB_STORAGE_KEY}_children`, JSON.stringify(registeredChildren));
    } catch {}
  }, [registeredChildren]);

  useEffect(() => {
    try {
      localStorage.setItem(`${DB_STORAGE_KEY}_updates`, JSON.stringify(updates));
    } catch {}
  }, [updates]);

  useEffect(() => {
    try {
      localStorage.setItem(`${DB_STORAGE_KEY}_scholarships`, JSON.stringify(scholarships));
    } catch {}
  }, [scholarships]);

  useEffect(() => {
    try {
      localStorage.setItem(`${DB_STORAGE_KEY}_threads`, JSON.stringify(threads));
    } catch {}
  }, [threads]);

  useEffect(() => {
    try {
      localStorage.setItem(`${DB_STORAGE_KEY}_notifs`, JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(`${DB_STORAGE_KEY}_activity`, JSON.stringify(activities));
    } catch {}
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(`${DB_STORAGE_KEY}_saved_schools`, JSON.stringify(savedSchoolIds));
    } catch {}
  }, [savedSchoolIds]);

  useEffect(() => {
    try {
      localStorage.setItem(`${DB_STORAGE_KEY}_parents`, JSON.stringify(parents));
    } catch {}
  }, [parents]);

  useEffect(() => {
    try {
      localStorage.setItem(`${DB_STORAGE_KEY}_subscriptions`, JSON.stringify(subscriptions));
    } catch {}
  }, [subscriptions]);

  useEffect(() => {
    try {
      localStorage.setItem(`${DB_STORAGE_KEY}_settings`, JSON.stringify(platformSettings));
    } catch {}
  }, [platformSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(`${DB_STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
    } catch {}
  }, [auditLogs]);

  // Action: Submit Application (Parent -> School)
  const submitApplication = async (data: {
    childId: string;
    studentName: string;
    parentId: string;
    parentName: string;
    parentEmail: string;
    parentPhone?: string;
    schoolId: string;
    gradeLevel: string;
    pleAggregate?: string;
    notes?: string;
  }): Promise<{ success: boolean; application: ApplicantRecord }> => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const targetSchool = schools.find(s => s.id === data.schoolId);
    const schoolName = targetSchool ? targetSchool.name : 'Participating School';

    const newApp: ApplicantRecord = {
      id: `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      childId: data.childId,
      studentName: data.studentName,
      parentId: data.parentId,
      parentName: data.parentName,
      parentEmail: data.parentEmail,
      parentPhone: data.parentPhone,
      gradeLevel: data.gradeLevel,
      schoolId: data.schoolId,
      schoolName: schoolName,
      submissionDate: 'Just now',
      status: 'Submitted',
      pleAggregate: data.pleAggregate || 'Under Verification',
      documentsCount: 4,
      notes: data.notes,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          date: 'Just now',
          title: 'Application Submitted Online',
          description: `Application dossier for ${data.studentName} was submitted to ${schoolName}.`,
          status: 'Submitted'
        }
      ],
      avatarColor: 'bg-purple-100 text-[#0000B7]'
    };

    setApplications(prev => [newApp, ...prev]);

    // Create Notification for the School Staff
    const schoolNotif: NotificationItem = {
      id: `nt-${Date.now()}-sch`,
      targetRole: 'school',
      targetSchoolId: data.schoolId,
      title: 'New Admission Application',
      message: `${data.parentName} submitted an application for ${data.studentName} (${data.gradeLevel}).`,
      time: 'Just now',
      read: false,
      type: 'application'
    };

    // Create Notification for the Parent
    const parentNotif: NotificationItem = {
      id: `nt-${Date.now()}-prt`,
      targetRole: 'parent',
      targetUserId: data.parentId,
      title: 'Application Successfully Received',
      message: `Your application for ${data.studentName} has been received by ${schoolName}.`,
      time: 'Just now',
      read: false,
      type: 'application'
    };

    setNotifications(prev => [schoolNotif, parentNotif, ...prev]);

    // Update School Inquiry & Application Counters
    setSchools(prev => prev.map(s => {
      if (s.id === data.schoolId) {
        return {
          ...s,
          inquiriesCount: s.inquiriesCount + 1,
          profileViews: s.profileViews + 3
        };
      }
      return s;
    }));

    // Log Activity for Platform Monitoring
    const newActivity: PlatformActivityItem = {
      id: `act-${Date.now()}`,
      title: 'New Application Submitted',
      description: `${data.studentName} applied to ${schoolName} (${data.gradeLevel})`,
      timestamp: 'Just now',
      type: 'application'
    };

    setActivities(prev => [newActivity, ...prev]);

    return { success: true, application: newApp };
  };

  // Action: Update Application Status (School Staff -> Parent)
  const updateApplicationStatus = async (
    applicationId: string, 
    newStatus: ApplicationStatus, 
    note?: string
  ): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 400));

    let updatedTargetApp: ApplicantRecord | null = null;

    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        const newTimelineItem = {
          id: `tl-${Date.now()}`,
          date: 'Just now',
          title: `Status: ${newStatus}`,
          description: note || `Application status changed to ${newStatus}.`,
          status: newStatus
        };

        const updated = {
          ...app,
          status: newStatus,
          timeline: [...(app.timeline || []), newTimelineItem]
        };
        updatedTargetApp = updated;
        return updated;
      }
      return app;
    }));

    if (updatedTargetApp) {
      const appRef: ApplicantRecord = updatedTargetApp;
      // Notify parent
      const parentNotif: NotificationItem = {
        id: `nt-${Date.now()}`,
        targetRole: 'parent',
        targetUserId: appRef.parentId,
        title: `Application Update: ${newStatus}`,
        message: `${appRef.schoolName} updated ${appRef.studentName}'s application status to "${newStatus}".`,
        time: 'Just now',
        read: false,
        type: 'application'
      };
      setNotifications(prev => [parentNotif, ...prev]);

      // Log activity
      const activityItem: PlatformActivityItem = {
        id: `act-${Date.now()}`,
        title: `Admission Status Updated: ${newStatus}`,
        description: `${appRef.schoolName} updated ${appRef.studentName} to ${newStatus}`,
        timestamp: 'Just now',
        type: 'status_change'
      };
      setActivities(prev => [activityItem, ...prev]);
    }

    return { success: true, message: `Application status updated to ${newStatus}` };
  };

  // Action: Create School Update (School Staff -> Parent Feed)
  const createSchoolUpdate = async (data: {
    schoolId: string;
    schoolName: string;
    title: string;
    content: string;
    category: 'announcement' | 'scholarship' | 'event' | 'achievement' | 'discount';
    ctaText?: string;
  }): Promise<{ success: boolean; update: SchoolUpdate }> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newUpdate: SchoolUpdate = {
      id: `upd-${Date.now()}`,
      schoolId: data.schoolId,
      schoolName: data.schoolName,
      title: data.title,
      content: data.content,
      category: data.category,
      publishedAt: 'Just now',
      reach: 1,
      likes: 0,
      ctaText: data.ctaText || 'Learn More'
    };

    setUpdates(prev => [newUpdate, ...prev]);

    // Notify parents
    const broadcastNotif: NotificationItem = {
      id: `nt-${Date.now()}-feed`,
      targetRole: 'parent',
      title: `New Post from ${data.schoolName}`,
      message: data.title,
      time: 'Just now',
      read: false,
      type: 'announcement'
    };
    setNotifications(prev => [broadcastNotif, ...prev]);

    return { success: true, update: newUpdate };
  };

  const likeSchoolUpdate = (updateId: string) => {
    setUpdates(prev => prev.map(u => {
      if (u.id === updateId) {
        const liked = !u.hasLiked;
        return {
          ...u,
          hasLiked: liked,
          likes: liked ? u.likes + 1 : Math.max(0, u.likes - 1)
        };
      }
      return u;
    }));
  };

  // Action: Create Scholarship Opportunity
  const createScholarship = async (data: {
    schoolId: string;
    schoolName: string;
    title: string;
    description: string;
    eligibility: string;
    coverage: string;
    deadline: string;
    educationLevel: string;
  }): Promise<{ success: boolean; scholarship: Scholarship }> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newSch: Scholarship = {
      id: `sch-${Date.now()}`,
      schoolId: data.schoolId,
      schoolName: data.schoolName,
      title: data.title,
      description: data.description,
      eligibility: data.eligibility,
      coverage: data.coverage,
      deadline: data.deadline,
      educationLevel: data.educationLevel,
      urgent: false,
      applicationsCount: 0,
      status: 'active'
    };

    setScholarships(prev => [newSch, ...prev]);

    return { success: true, scholarship: newSch };
  };

  // Action: Verify School (Super Admin -> Platform Wide)
  const verifySchool = async (
    schoolId: string, 
    status: SchoolVerificationStatus,
    reason?: string
  ): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    let updatedSchoolName = '';

    setSchools(prev => prev.map(sch => {
      if (sch.id === schoolId) {
        updatedSchoolName = sch.name;
        return {
          ...sch,
          verificationStatus: status,
          badge: status === 'verified' ? 'Ministry & Smart Verified' : sch.badge
        };
      }
      return sch;
    }));

    // Notify School
    const schoolNotif: NotificationItem = {
      id: `nt-${Date.now()}-vsch`,
      targetRole: 'school',
      targetSchoolId: schoolId,
      title: `Verification Status: ${status.toUpperCase()}`,
      message: status === 'verified' 
        ? 'Congratulations! Your institution has been formally verified by Smart Admissions Management.' 
        : `Your verification request has been updated to "${status}". ${reason || ''}`,
      time: 'Just now',
      read: false,
      type: 'verification'
    };

    setNotifications(prev => [schoolNotif, ...prev]);

    // Log Activity
    const actItem: PlatformActivityItem = {
      id: `act-${Date.now()}`,
      title: `School Verification: ${status.toUpperCase()}`,
      description: `Super Admin marked ${updatedSchoolName || 'School'} as ${status}`,
      timestamp: 'Just now',
      type: 'verification'
    };
    setActivities(prev => [actItem, ...prev]);

    return { 
      success: true, 
      message: `School ${updatedSchoolName} is now marked as ${status}.` 
    };
  };

  // Action: Send Message (Parent <-> School)
  const sendMessage = async (
    threadId: string | null,
    schoolId: string,
    parentId: string,
    senderRole: 'parent' | 'school' | 'admin',
    senderName: string,
    text: string,
    childName?: string
  ): Promise<{ success: boolean; threadId: string }> => {
    const newMsg: { id: string; senderRole: 'parent' | 'school' | 'admin'; senderName: string; text: string; timestamp: string } = {
      id: `m-${Date.now()}`,
      senderRole,
      senderName,
      text,
      timestamp: 'Just now'
    };

    let targetThreadId = threadId;

    if (targetThreadId) {
      setThreads(prev => prev.map(th => {
        if (th.id === targetThreadId) {
          return {
            ...th,
            lastMessage: text,
            lastMessageTime: 'Just now',
            messages: [...th.messages, newMsg]
          };
        }
        return th;
      }));
    } else {
      // Find school name
      const targetSchool = schools.find(s => s.id === schoolId);
      const schoolName = targetSchool ? targetSchool.name : 'Admissions Desk';

      const newThread: MessageThread = {
        id: `th-${Date.now()}`,
        schoolId,
        schoolName,
        parentId,
        parentName: senderRole === 'parent' ? senderName : 'Parent',
        childName,
        lastMessage: text,
        lastMessageTime: 'Just now',
        unreadCount: 0,
        messages: [newMsg]
      };

      setThreads(prev => [newThread, ...prev]);
      targetThreadId = newThread.id;
    }

    // Send notification to recipient
    const recipientNotif: NotificationItem = {
      id: `nt-${Date.now()}`,
      targetRole: senderRole === 'parent' ? 'school' : 'parent',
      targetSchoolId: schoolId,
      targetUserId: parentId,
      title: `New Message from ${senderName}`,
      message: text.length > 50 ? `${text.substring(0, 50)}...` : text,
      time: 'Just now',
      read: false,
      type: 'message'
    };
    setNotifications(prev => [recipientNotif, ...prev]);

    return { success: true, threadId: targetThreadId! };
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = (role: PortalType) => {
    setNotifications(prev => prev.map(n => n.targetRole === role ? { ...n, read: true } : n));
  };

  const toggleSaveSchool = (schoolId: string) => {
    setSavedSchoolIds(prev => 
      prev.includes(schoolId) 
        ? prev.filter(id => id !== schoolId) 
        : [...prev, schoolId]
    );
  };

  const addChild = async (childData: Omit<ChildRecord, 'id'>): Promise<ChildRecord> => {
    const newChild: ChildRecord = {
      ...childData,
      id: `ch-${Date.now()}`
    };
    setRegisteredChildren(prev => [...prev, newChild]);
    return newChild;
  };

  const updateChild = (childId: string, updates: Partial<ChildRecord>) => {
    setRegisteredChildren(prev => prev.map(c => c.id === childId ? { ...c, ...updates } : c));
  };

  const deleteChild = (childId: string) => {
    setRegisteredChildren(prev => prev.filter(c => c.id !== childId));
  };

  const updateParentProfile = (parentId: string, updates: Partial<ParentProfileRecord>) => {
    setParents(prev => prev.map(p => p.id === parentId ? { ...p, ...updates } : p));
  };

  const acceptOffer = async (applicationId: string): Promise<boolean> => {
    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        return {
          ...app,
          status: 'Admitted',
          timeline: [
            ...(app.timeline || []),
            {
              id: `tl-${Date.now()}`,
              date: 'Just now',
              title: 'Admission Offer Accepted by Parent',
              description: 'Official acceptance recorded. Placement secured for the upcoming academic year.',
              status: 'Admitted'
            }
          ]
        };
      }
      return app;
    }));
    return true;
  };

  const declineOffer = async (applicationId: string): Promise<boolean> => {
    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        return {
          ...app,
          status: 'Rejected',
          timeline: [
            ...(app.timeline || []),
            {
              id: `tl-${Date.now()}`,
              date: 'Just now',
              title: 'Admission Offer Declined',
              description: 'Parent declined the placement offer to release the slot.',
              status: 'Rejected'
            }
          ]
        };
      }
      return app;
    }));
    return true;
  };

  const withdrawApplication = async (applicationId: string, reason?: string): Promise<boolean> => {
    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        return {
          ...app,
          status: 'Rejected',
          timeline: [
            ...(app.timeline || []),
            {
              id: `tl-${Date.now()}`,
              date: 'Just now',
              title: 'Application Formally Withdrawn',
              description: reason ? `Reason provided: ${reason}` : 'Withdrawn by parent request.',
              status: 'Rejected'
            }
          ]
        };
      }
      return app;
    }));
    return true;
  };

  const updateSchoolProfile = async (schoolId: string, updates: Partial<SchoolRecord>): Promise<boolean> => {
    setSchools(prev => prev.map(s => s.id === schoolId ? { ...s, ...updates } : s));
    return true;
  };

  const registerNewSchoolInDb = async (data: {
    name: string;
    type: 'Day' | 'Boarding' | 'Day & Boarding';
    level: 'Nursery' | 'Primary' | 'Secondary (O & A Level)' | 'Tertiary / Vocational';
    district: string;
    contactPerson: string;
    contactEmail: string;
    contactPhone: string;
    description?: string;
  }): Promise<SchoolRecord> => {
    const newSchool: SchoolRecord = {
      id: `sch-${Date.now()}`,
      name: data.name,
      code: `SCH-${Math.floor(100 + Math.random() * 900)}`,
      type: data.type,
      level: data.level,
      district: data.district,
      location: `${data.district}, Uganda`,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      contactPerson: data.contactPerson,
      verificationStatus: 'pending', // Starts pending Super Admin approval
      profileViews: 12,
      inquiriesCount: 0,
      rating: 4.5,
      badge: 'Pending Verification',
      description: data.description || 'Newly registered educational institution.',
      tuitionRange: 'UGX 1,200,000 - 1,800,000 / Term',
      establishedYear: 2024,
      intakeCapacity: 150,
      facilities: ['Classrooms', 'Science Laboratory', 'Sports Ground']
    };

    setSchools(prev => [...prev, newSchool]);

    // Platform notification
    const regNotif: NotificationItem = {
      id: `nt-${Date.now()}-schreg`,
      targetRole: 'management',
      title: 'New School Registration Submitted',
      message: `${data.name} (${data.district}) submitted registration for verification.`,
      time: 'Just now',
      read: false,
      type: 'verification'
    };
    setNotifications(prev => [regNotif, ...prev]);

    return newSchool;
  };

  // Super Admin Action Handlers
  const updateSubscription = (schoolId: string, plan: SubscriptionTier, status?: SubscriptionStatus) => {
    setSubscriptions(prev => prev.map(s => {
      if (s.schoolId === schoolId) {
        let amount = s.amountUgx;
        if (plan === 'Free Starter') amount = 0;
        if (plan === 'School Growth') amount = s.billingCycle === 'Annual' ? 2200000 : 850000;
        if (plan === 'Institutional Premier') amount = s.billingCycle === 'Annual' ? 4800000 : 1750000;
        return {
          ...s,
          plan,
          amountUgx: amount,
          status: status || s.status
        };
      }
      return s;
    }));
  };

  const updatePlatformSettings = (newSettings: Partial<PlatformSettings>) => {
    setPlatformSettings(prev => ({ ...prev, ...newSettings }));
  };

  const deleteUpdate = (updateId: string) => {
    setUpdates(prev => prev.filter(u => u.id !== updateId));
  };

  const pinUpdate = (updateId: string) => {
    setUpdates(prev => {
      const target = prev.find(u => u.id === updateId);
      if (!target) return prev;
      return [target, ...prev.filter(u => u.id !== updateId)];
    });
  };

  const createBroadcastAnnouncement = async (title: string, content: string, ctaText?: string) => {
    const newBroadcast: SchoolUpdate = {
      id: `upd-nat-${Date.now()}`,
      schoolId: 'management',
      schoolName: 'Ministry of Education & Smart Admissions',
      title,
      content,
      category: 'announcement',
      publishedAt: 'Just now',
      reach: 3450,
      likes: 12,
      ctaText: ctaText || 'Learn More'
    };
    setUpdates(prev => [newBroadcast, ...prev]);
    return { success: true, update: newBroadcast };
  };

  const toggleScholarshipStatus = (scholarshipId: string) => {
    setScholarships(prev => prev.map(sch => {
      if (sch.id === scholarshipId) {
        return {
          ...sch,
          status: sch.status === 'active' ? 'closed' : 'active'
        };
      }
      return sch;
    }));
  };

  const addScholarship = async (data: Omit<Scholarship, 'id' | 'applicationsCount'>): Promise<Scholarship> => {
    const newSch: Scholarship = {
      ...data,
      id: `sch-admin-${Date.now()}`,
      applicationsCount: 0
    };
    setScholarships(prev => [newSch, ...prev]);
    return newSch;
  };

  const overrideApplicationStatus = async (id: string, status: ApplicationStatus, auditNote?: string): Promise<boolean> => {
    setApplications(prev => prev.map(app => {
      if (app.id === id) {
        const newTimeline = app.timeline || [];
        return {
          ...app,
          status,
          notes: auditNote ? `${app.notes ? app.notes + ' | ' : ''}Super Admin: ${auditNote}` : app.notes,
          timeline: [
            ...newTimeline,
            {
              id: `tl-${Date.now()}`,
              date: 'Just now',
              title: `Status set to ${status}`,
              description: auditNote || `Super Administrator verified and updated application to ${status}.`,
              status
            }
          ]
        };
      }
      return app;
    }));
    return true;
  };

  const addAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newLog: AuditLogEntry = {
      ...entry,
      id: `aud-${Date.now()}`,
      timestamp: 'Just now'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  return (
    <AdmissionsDataContext.Provider
      value={{
        schools,
        applications,
        children: registeredChildren,
        parents,
        updates,
        scholarships,
        subscriptions,
        platformSettings,
        auditLogs,
        threads,
        notifications,
        activities,
        savedSchoolIds,
        submitApplication,
        updateApplicationStatus,
        createSchoolUpdate,
        likeSchoolUpdate,
        createScholarship,
        verifySchool,
        sendMessage,
        markNotificationRead,
        markAllNotificationsRead,
        toggleSaveSchool,
        addChild,
        updateChild,
        deleteChild,
        updateParentProfile,
        acceptOffer,
        declineOffer,
        withdrawApplication,
        updateSchoolProfile,
        registerNewSchoolInDb,
        updateSubscription,
        updatePlatformSettings,
        deleteUpdate,
        pinUpdate,
        createBroadcastAnnouncement,
        toggleScholarshipStatus,
        addScholarship,
        overrideApplicationStatus,
        addAuditLog
      }}
    >
      {children}
    </AdmissionsDataContext.Provider>
  );
};

export const useAdmissionsData = () => {
  const context = useContext(AdmissionsDataContext);
  if (!context) {
    throw new Error('useAdmissionsData must be used within an AdmissionsDataProvider');
  }
  return context;
};
