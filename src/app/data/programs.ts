export type ProgramCategory = 'student' | 'professional' | 'institutional';

export interface ProgramData {
  slug: string;
  category: ProgramCategory;
  title: string;
  tagline: string;
  summary: string;
  target: string;
  eligibility: string;
  duration: string;
  location: string;
  deadline: string;
  fee: string;
  availability: string;
  status: 'Accepting Applications' | 'Coming Soon' | 'Details TBA';
  outcome: string;
  includes: string[];
  excludes: string[];
  timeline: {
    label: string;
    description: string;
  }[];
  nextSteps: string[];
  colors: {
    accent: string;
    ink: string;
  };
  image: string;
}

export const programs: ProgramData[] = [
  {
    slug: 'student-mobility',
    category: 'student',
    title: 'Student Mobility Programs',
    tagline: 'Structured international semesters and short-term academic immersions.',
    summary:
      'These programs are built for university students who want credible learning experiences with clear outcomes, curriculum alignment, and guided reflection.',
    target: 'University students',
    eligibility: 'Current undergraduate or postgraduate students in good academic standing.',
    duration: '2-6 weeks',
    location: 'Multi-country placements',
    deadline: 'Rolling applications',
    fee: 'Fees shared after screening',
    availability: 'Limited spots available',
    status: 'Accepting Applications',
    outcome: 'Cultural intelligence + academic credit pathways',
    includes: [
      'Pre-departure orientation',
      'Academic site visits and seminars',
      'Structured reflection and evaluation',
      'Accommodation and in-country coordination',
    ],
    excludes: [
      'Tourism-led itineraries',
      'Unstructured leisure travel',
      'Placement without learning outcomes',
    ],
    timeline: [
      { label: 'Apply', description: 'Submit your interest and tell us what you want to learn.' },
      { label: 'Review', description: 'We check fit, readiness, and academic alignment.' },
      { label: 'Prepare', description: 'Selected participants receive orientation and logistics.' },
      { label: 'Travel', description: 'You join the cohort and complete the structured experience.' },
    ],
    nextSteps: [
      'Select the program that best fits your academic goals.',
      'Submit your application with a clear motivation statement.',
      'Wait for our review and next-step email.',
    ],
    colors: {
      accent: '#F71C56',
      ink: '#0A1C3A',
    },
    image: 'https://images.unsplash.com/photo-1758270705290-62b6294dd044?w=1080&q=80',
  },
  {
    slug: 'professional-fellowships',
    category: 'professional',
    title: 'Professional Fellowships',
    tagline: 'Capability-building exchange for mid-career professionals.',
    summary:
      'Designed for professionals who want global perspective, cross-border project exposure, and practical insight they can bring back to their teams and institutions.',
    target: 'Working professionals',
    eligibility: 'Mid-career professionals seeking practical international exposure and network building.',
    duration: '1-3 months',
    location: 'Cross-border cohorts',
    deadline: 'Seasonal intake',
    fee: 'Fee shared during enquiry',
    availability: 'Coming soon',
    status: 'Coming Soon',
    outcome: 'Capability development + cross-border project experience',
    includes: [
      'Project-based learning',
      'Mentor and host engagement',
      'Professional networking sessions',
      'Post-program impact summary',
    ],
    excludes: [
      'Vacation-style scheduling',
      'Open-ended travel',
      'Programs without deliverables',
    ],
    timeline: [
      { label: 'Enquire', description: 'Tell us the capability area you want to develop.' },
      { label: 'Scope', description: 'We shape the fellowship around your team and goals.' },
      { label: 'Match', description: 'We align participants, hosts, and learning outcomes.' },
      { label: 'Deliver', description: 'You complete the fellowship with measurable outputs.' },
    ],
    nextSteps: [
      'Use the inquiry form to describe your fellowship goals.',
      'We will suggest a suitable cohort or custom pathway.',
      'We will follow up with scheduling and scope details.',
    ],
    colors: {
      accent: '#0A1C3A',
      ink: '#0A1C3A',
    },
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1080&q=80',
  },
  {
    slug: 'institutional-partnerships',
    category: 'institutional',
    title: 'Institutional Partnerships',
    tagline: 'Capacity building for universities, teams, and organizations.',
    summary:
      'Partnerships are co-designed with institutions that want to host, send, or jointly build learning mobility frameworks with andylcc.',
    target: 'Universities / Organizations',
    eligibility: 'Institutions, departments, and professional bodies with an interest in structured exchange.',
    duration: 'Custom',
    location: 'On-site or hybrid',
    deadline: 'By arrangement',
    fee: 'Custom pricing based on scope',
    availability: 'By request',
    status: 'Details TBA',
    outcome: 'Capacity building + faculty exchange + program design',
    includes: [
      'Co-design workshops',
      'Program structure planning',
      'Partner alignment sessions',
      'Delivery and evaluation guidance',
    ],
    excludes: [
      'Off-the-shelf travel products',
      'One-size-fits-all packages',
      'Low-touch transactional booking',
    ],
    timeline: [
      { label: 'Consult', description: 'We understand your institution and priorities.' },
      { label: 'Design', description: 'Together we shape the partnership model and scope.' },
      { label: 'Plan', description: 'We confirm logistics, outcomes, and delivery owners.' },
      { label: 'Launch', description: 'The partnership moves into delivery and review.' },
    ],
    nextSteps: [
      'Send an institutional inquiry with your priorities and timing.',
      'We will respond with a partnership conversation.',
      'Together we define scope, participants, and delivery approach.',
    ],
    colors: {
      accent: '#F71C56',
      ink: '#0A1C3A',
    },
    image: 'https://images.unsplash.com/photo-1777202740019-5340f67184f8?w=1080&q=80',
  },
];

export const findProgramBySlug = (slug: string) => programs.find((program) => program.slug === slug);
