import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from '../config/database.js';
import { countAdmins, createAdmin } from '../models/Admin.js';
import { countPrograms, createProgram } from '../models/Program.js';
import { pathToFileURL } from 'node:url';

const demoPrograms = [
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
    deadline: null,
    fee: 'Fees shared after screening',
    availability: 'Limited spots available',
    status: 'accepting',
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
    colors: { accent: '#F71C56', ink: '#0A1C3A' },
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
    deadline: null,
    fee: 'Fee shared during enquiry',
    availability: 'Coming soon',
    status: 'coming_soon',
    outcome: 'Capability development + cross-border project experience',
    includes: [
      'Project-based learning',
      'Mentor and host engagement',
      'Professional networking sessions',
      'Post-program impact summary',
    ],
    excludes: ['Vacation-style scheduling', 'Open-ended travel', 'Programs without deliverables'],
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
    colors: { accent: '#0A1C3A', ink: '#0A1C3A' },
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1080&q=80',
  },
  {
    slug: 'institutional-partnerships',
    category: 'institutional',
    title: 'Institutional Partnerships',
    tagline: 'Capacity building for universities, teams, and organizations.',
    summary:
      'Partnerships are co-designed with institutions that want to host, send, or jointly build learning mobility frameworks with Cardinal Immersions.',
    target: 'Universities / Organizations',
    eligibility: 'Institutions, departments, and professional bodies with an interest in structured exchange.',
    duration: 'Custom',
    location: 'On-site or hybrid',
    deadline: null,
    fee: 'Custom pricing based on scope',
    availability: 'By request',
    status: 'closed',
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
    colors: { accent: '#F71C56', ink: '#0A1C3A' },
    image: 'https://images.unsplash.com/photo-1777202740019-5340f67184f8?w=1080&q=80',
  },
];

const seedSuperAdmin = async () => {
  const existingAdmins = await countAdmins();
  if (existingAdmins > 0) return;

  const isProduction = process.env.NODE_ENV === 'production';
  const email = process.env.FIRST_ADMIN_EMAIL || (isProduction ? '' : 'admin@example.com');
  const password = process.env.FIRST_ADMIN_PASSWORD || (isProduction ? '' : 'admin123');
  const fullName = process.env.FIRST_ADMIN_FULL_NAME || (isProduction ? '' : 'System Administrator');

  if (!email || !password || !fullName) {
    throw new Error(
      'No admins exist yet. Set FIRST_ADMIN_EMAIL, FIRST_ADMIN_PASSWORD, and FIRST_ADMIN_FULL_NAME before starting in production.'
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await createAdmin(
    {
      email,
      fullName,
      role: 'super_admin',
      passwordHash,
      isActive: true,
    },
    pool
  );

  console.log(`Seeded initial super admin: ${email}`);
};

const seedPrograms = async () => {
  if (String(process.env.SEED_DEMO_PROGRAMS || 'true').toLowerCase() !== 'true') {
    return;
  }

  const existingCount = await countPrograms();
  if (existingCount > 0) return;

  for (const program of demoPrograms) {
    await createProgram(program);
  }

  console.log(`Seeded ${demoPrograms.length} programs.`);
};

export const seedDatabase = async () => {
  await seedSuperAdmin();
  await seedPrograms();
};

const run = async () => {
  try {
    await seedDatabase();
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

const entryPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : '';

if (import.meta.url === entryPath) {
  run();
}
