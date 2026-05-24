export interface Application {
  id: string;
  name: string;
  email: string;
  program: string;
  programType: 'student' | 'professional';
  institution: string;
  country: string;
  motivation: string;
  phone?: string;
  dateOfBirth?: string;
  heardAbout?: string;
  submittedDate: string;
  status: 'new' | 'reviewed' | 'accepted' | 'rejected';
  notes?: string;
}

export interface Inquiry {
  id: string;
  organizationName: string;
  organizationType: string;
  organizationCountry: string;
  website?: string;
  contactName: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone?: string;
  interests: string[];
  cohortSize: string;
  timeline: string;
  additionalInfo?: string;
  submittedDate: string;
  status: 'new' | 'reviewed' | 'contacted' | 'partnership' | 'closed';
  notes?: string;
}

export interface Program {
  id: string;
  name: string;
  category: 'student' | 'professional';
  location: string;
  startDate: string;
  endDate: string;
  status: 'accepting' | 'coming-soon' | 'full' | 'closed';
  deadline: string;
  description?: string;
  imageUrl?: string;
}

const APPLICATIONS_KEY = 'adminApplications';
const INQUIRIES_KEY = 'adminInquiries';
const PROGRAMS_KEY = 'adminPrograms';

const safeLocalStorage = {
  getItem(key: string) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // noop
    }
  },
};

export const mockApplications: Application[] = [
  {
    id: '1',
    name: 'Amina Ochieng',
    email: 'amina.ochieng@university.edu',
    program: 'Urban Innovation Lab – Nairobi',
    programType: 'student',
    institution: 'University of Cape Town',
    country: 'South Africa',
    motivation:
      'I am passionate about urban development and want to learn innovative approaches to sustainable city planning in African contexts.',
    phone: '+27 11 234 5678',
    submittedDate: '2026-05-20',
    status: 'new',
  },
  {
    id: '2',
    name: 'James Mensah',
    email: 'j.mensah@company.com',
    program: 'Global Leadership Program – London',
    programType: 'professional',
    institution: 'Tech Innovations Ltd',
    country: 'Ghana',
    motivation:
      'As a mid-level manager, I seek to develop cross-cultural leadership competencies and expand my understanding of global business practices.',
    submittedDate: '2026-05-19',
    status: 'reviewed',
  },
  {
    id: '3',
    name: 'Sarah Thompson',
    email: 'sarah.t@college.ac.uk',
    program: 'Social Enterprise Fellowship – Cape Town',
    programType: 'student',
    institution: 'London School of Economics',
    country: 'United Kingdom',
    motivation:
      'I want to understand social entrepreneurship models in emerging markets and contribute to sustainable development initiatives.',
    submittedDate: '2026-05-18',
    status: 'accepted',
  },
  {
    id: '4',
    name: 'David Kamau',
    email: 'david.k@health.org',
    program: 'Public Health Innovation – Accra',
    programType: 'professional',
    institution: 'Kenya Medical Research Institute',
    country: 'Kenya',
    motivation:
      'My work in public health requires understanding innovative healthcare delivery models. This program aligns perfectly with my career goals.',
    submittedDate: '2026-05-17',
    status: 'reviewed',
  },
  {
    id: '5',
    name: 'Emily Chen',
    email: 'emily.chen@student.edu',
    program: 'Tech & Development – Accra',
    programType: 'student',
    institution: 'Stanford University',
    country: 'United States',
    motivation:
      'I am studying computer science with a focus on technology for social impact and want hands-on experience in the African tech ecosystem.',
    submittedDate: '2026-05-16',
    status: 'new',
  },
  {
    id: '6',
    name: 'Mohammed Ali',
    email: 'm.ali@university.edu.eg',
    program: 'Education Policy Fellowship – Nairobi',
    programType: 'professional',
    institution: 'Cairo University',
    country: 'Egypt',
    motivation:
      'As an education researcher, I aim to learn from African education policy innovations and bring insights back to my institution.',
    submittedDate: '2026-05-15',
    status: 'rejected',
  },
];

export const mockInquiries: Inquiry[] = [
  {
    id: '1',
    organizationName: 'University of Nairobi',
    organizationType: 'university',
    organizationCountry: 'Kenya',
    website: 'https://uonbi.ac.ke',
    contactName: 'Dr. Grace Wanjiru',
    contactTitle: 'Director of International Programs',
    contactEmail: 'g.wanjiru@uonbi.ac.ke',
    contactPhone: '+254 20 123 4567',
    interests: ['host', 'faculty'],
    cohortSize: '16-30',
    timeline: '6-12months',
    additionalInfo: 'We are interested in hosting andylcc programs and establishing a faculty exchange program.',
    submittedDate: '2026-05-21',
    status: 'new',
  },
  {
    id: '2',
    organizationName: 'Accra Technical University',
    organizationType: 'university',
    organizationCountry: 'Ghana',
    contactName: 'Prof. Kwame Asante',
    contactTitle: 'Dean of Global Engagement',
    contactEmail: 'k.asante@atu.edu.gh',
    interests: ['send', 'codesign'],
    cohortSize: '6-15',
    timeline: 'exploring',
    submittedDate: '2026-05-19',
    status: 'contacted',
  },
  {
    id: '3',
    organizationName: 'Global Education Network',
    organizationType: 'ngo',
    organizationCountry: 'United Kingdom',
    website: 'https://globaledu.org',
    contactName: 'Lisa Hamilton',
    contactTitle: 'Partnerships Manager',
    contactEmail: 'lisa@globaledu.org',
    interests: ['send', 'other'],
    cohortSize: '1-5',
    timeline: '6months',
    additionalInfo: 'We work with multiple universities and want to explore sending cohorts to your programs.',
    submittedDate: '2026-05-18',
    status: 'partnership',
  },
];

export const mockPrograms: Program[] = [
  {
    id: '1',
    name: 'Urban Innovation Lab',
    category: 'student',
    location: 'Nairobi, Kenya',
    startDate: '2026-05-12',
    endDate: '2026-05-26',
    status: 'accepting',
    deadline: '2026-04-30',
    description: 'Immersive program focused on urban development and innovation in East African cities.',
  },
  {
    id: '2',
    name: 'Social Enterprise Fellowship',
    category: 'student',
    location: 'Cape Town, South Africa',
    startDate: '2026-06-08',
    endDate: '2026-06-22',
    status: 'accepting',
    deadline: '2026-05-20',
    description: 'Learn about social entrepreneurship and sustainable business models.',
  },
  {
    id: '3',
    name: 'Tech & Development',
    category: 'student',
    location: 'Accra, Ghana',
    startDate: '2026-07-15',
    endDate: '2026-07-29',
    status: 'coming-soon',
    deadline: '2026-06-30',
    description: 'Explore the intersection of technology and economic development.',
  },
  {
    id: '4',
    name: 'Global Leadership Program',
    category: 'professional',
    location: 'London, UK',
    startDate: '2026-08-05',
    endDate: '2026-08-19',
    status: 'accepting',
    deadline: '2026-07-15',
    description: 'Advanced leadership training for mid-career professionals.',
  },
  {
    id: '5',
    name: 'Education Policy Fellowship',
    category: 'professional',
    location: 'Nairobi, Kenya',
    startDate: '2026-09-10',
    endDate: '2026-09-24',
    status: 'coming-soon',
    deadline: '2026-08-20',
    description: 'Policy innovation in education across African contexts.',
  },
  {
    id: '6',
    name: 'Public Health Innovation',
    category: 'professional',
    location: 'Accra, Ghana',
    startDate: '2026-10-05',
    endDate: '2026-10-19',
    status: 'accepting',
    deadline: '2026-09-15',
    description: 'Healthcare delivery models and public health systems.',
  },
];

export const initializeMockData = () => {
  if (!safeLocalStorage.getItem(APPLICATIONS_KEY)) {
    safeLocalStorage.setItem(APPLICATIONS_KEY, JSON.stringify(mockApplications));
  }
  if (!safeLocalStorage.getItem(INQUIRIES_KEY)) {
    safeLocalStorage.setItem(INQUIRIES_KEY, JSON.stringify(mockInquiries));
  }
  if (!safeLocalStorage.getItem(PROGRAMS_KEY)) {
    safeLocalStorage.setItem(PROGRAMS_KEY, JSON.stringify(mockPrograms));
  }
};

export const getApplications = (): Application[] => {
  const data = safeLocalStorage.getItem(APPLICATIONS_KEY);
  if (!data) return mockApplications;
  try {
    return JSON.parse(data) as Application[];
  } catch {
    return mockApplications;
  }
};

export const setApplications = (applications: Application[]) => {
  safeLocalStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
};

export const getInquiries = (): Inquiry[] => {
  const data = safeLocalStorage.getItem(INQUIRIES_KEY);
  if (!data) return mockInquiries;
  try {
    return JSON.parse(data) as Inquiry[];
  } catch {
    return mockInquiries;
  }
};

export const setInquiries = (inquiries: Inquiry[]) => {
  safeLocalStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
};

export const getPrograms = (): Program[] => {
  const data = safeLocalStorage.getItem(PROGRAMS_KEY);
  if (!data) return mockPrograms;
  try {
    return JSON.parse(data) as Program[];
  } catch {
    return mockPrograms;
  }
};

export const setPrograms = (programs: Program[]) => {
  safeLocalStorage.setItem(PROGRAMS_KEY, JSON.stringify(programs));
};
