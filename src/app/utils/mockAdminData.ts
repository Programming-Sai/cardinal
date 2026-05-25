export interface Application {
  id: string;
  name: string;
  email: string;
  program: string;
  programType: 'student' | 'professional' | 'institutional';
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
  status: 'new' | 'reviewed' | 'contacted' | 'partnered' | 'closed';
  notes?: string;
}

export interface Program {
  id: string;
  name: string;
  category: 'student' | 'professional' | 'institutional';
  location: string;
  startDate: string;
  endDate: string;
  status: 'accepting' | 'coming-soon' | 'full' | 'closed';
  deadline: string;
  description?: string;
  imageUrl?: string;
}
