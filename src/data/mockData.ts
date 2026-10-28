import { ApplicantRecord } from '../types/admissions';

export const RECENT_APPLICATIONS: ApplicantRecord[] = [
  {
    id: 'ADM-2026-0142',
    studentName: 'Trevor Mugisha',
    parentName: 'Grace Mugisha',
    gradeLevel: 'Senior 1 (S.1)',
    schoolName: 'St. Mary’s College Kisubi',
    submissionDate: '12 mins ago',
    status: 'Verified',
    pleAggregate: '4 Aggregates (Div 1)',
    documentsCount: 4,
    avatarColor: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'ADM-2026-0141',
    studentName: 'Joan Namubiru',
    parentName: 'Edward Namubiru',
    gradeLevel: 'Senior 1 (S.1)',
    schoolName: 'Gayaza High School',
    submissionDate: '38 mins ago',
    status: 'Interview Scheduled',
    pleAggregate: '5 Aggregates (Div 1)',
    documentsCount: 5,
    avatarColor: 'bg-purple-100 text-[#0000B7]'
  },
  {
    id: 'ADM-2026-0140',
    studentName: 'Brian Okello',
    parentName: 'Agnes Okello',
    gradeLevel: 'Primary 1 (P.1)',
    schoolName: 'Greenhill Academy',
    submissionDate: '1 hour ago',
    status: 'Admitted',
    pleAggregate: 'Pre-Primary Assessment A',
    documentsCount: 3,
    avatarColor: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'ADM-2026-0139',
    studentName: 'Sarah Nakato',
    parentName: 'Patrick Musoke',
    gradeLevel: 'Senior 5 (S.5)',
    schoolName: 'Mt. St. Mary’s Namagunga',
    submissionDate: '2 hours ago',
    status: 'Under Review',
    pleAggregate: 'UCE: 8 in 8 (Div 1)',
    documentsCount: 4,
    avatarColor: 'bg-amber-100 text-amber-800'
  },
  {
    id: 'ADM-2026-0138',
    studentName: 'Alvin Kigozi',
    parentName: 'Christine Kigozi',
    gradeLevel: 'Senior 1 (S.1)',
    schoolName: 'King’s College Budo',
    submissionDate: '3 hours ago',
    status: 'Pending Documents',
    pleAggregate: '6 Aggregates (Div 1)',
    documentsCount: 2,
    avatarColor: 'bg-slate-100 text-slate-800'
  }
];

export const STATS_SUMMARY = {
  totalApplications: '1,482',
  awaitingReview: '142',
  studentsAdmitted: '864',
  pendingApplications: '210',
  intakeProgressPercent: 74,
  completionRate: '98.4%'
};

export const FAQ_ITEMS = [
  {
    question: 'What is Smart Admissions?',
    answer: 'Smart Admissions is a unified digital school admissions platform tailored for African educational ecosystems. It brings schools, parents, students, and institutional administrators into one collaborative digital environment to manage school discovery, online applications, document verification, interview scheduling, and official admission decisions without physical paper queues.'
  },
  {
    question: 'Who can use the platform?',
    answer: 'The platform serves three key user groups: (1) Parents and guardians seeking seamless school discovery, online submissions, and real-time status updates; (2) School administrators, bursars, and headteachers managing admissions cycles, reviewing criteria, and verifying documents; and (3) Institutional leaders, diocesan boards, or school group directors requiring consolidated admissions intelligence across multiple campuses.'
  },
  {
    question: 'How do parents apply for admission?',
    answer: 'Parents create a secure parent profile, search for participating schools by curriculum (UNEB, Cambridge, IB) or location, review specific grade requirements, complete a guided digital application form, upload required files (such as PLE/UCE result slips, birth certificates, and passport photos), and submit directly from their mobile phone or computer.'
  },
  {
    question: 'How can schools manage applications?',
    answer: 'Schools receive incoming student applications in real time through a dedicated administration workspace. The admissions committee can filter applicants by grade, aggregates, or completion status, verify uploaded academic slips, message parents directly, schedule entrance assessments or interviews, and issue official digital admission letters.'
  },
  {
    question: 'Can parents track application progress?',
    answer: 'Yes. The Parent Portal includes an active milestone tracker that details every phase of the admissions journey: Submission Received, Document Verification, Committee Review, Assessment / Interview, and Final Admission Decision. Parents receive SMS and email notifications whenever their child’s application advances.'
  },
  {
    question: 'How does top management monitor admissions?',
    answer: 'Top management boards and multi-campus directors access a high-level analytics dashboard providing consolidated application numbers, capacity fill rates per school, demographic distributions, aggregate performance curves, and real-time enrolment progress across their entire network of institutions.'
  },
  {
    question: 'How do I register my school?',
    answer: 'Schools can register by clicking "Register Your School" or "Get Started" on this page. Our admissions specialist team verifies your school’s registration with the relevant Ministry of Education authorities, configures your custom application intake forms and cutoff criteria, and trains your admissions staff during a swift 48-hour onboarding process.'
  },
  {
    question: 'How can I contact the Smart Admissions team?',
    answer: 'You can reach our team via the interactive contact form on this website, email us at support@smartadmissions.ug, or speak directly with our Kampala regional desk at +256 700 812 900. Our support specialists are available Monday through Saturday to assist parents and educational institutions.'
  }
];

export const SCHOOL_PARTNERS = [
  'Greenhill Academy',
  'St. Mary’s College Kisubi',
  'Gayaza High School',
  'Kampala Parents’ School',
  'King’s College Budo',
  'Uganda Martyrs S.S Namugongo',
  'Mt. St. Mary’s Namagunga',
  'Aga Khan High School Kampala'
];
