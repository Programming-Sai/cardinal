CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'viewer')),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('student', 'professional', 'institutional')),
  title TEXT NOT NULL,
  tagline TEXT,
  summary TEXT,
  target TEXT,
  eligibility TEXT,
  duration TEXT,
  location TEXT,
  deadline DATE,
  fee TEXT,
  availability TEXT,
  status TEXT DEFAULT 'coming_soon' CHECK (status IN ('accepting', 'coming_soon', 'full', 'closed')),
  outcome TEXT,
  includes TEXT[],
  excludes TEXT[],
  timeline TEXT[],
  next_steps TEXT[],
  colors JSONB,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'accepted', 'rejected')),
  program_interest TEXT NOT NULL,
  specific_program TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  institution TEXT NOT NULL,
  country TEXT NOT NULL,
  language TEXT,
  motivation_statement TEXT NOT NULL,
  heard_from TEXT,
  cv_url TEXT,
  internal_notes TEXT,
  reviewed_by UUID REFERENCES admins(id),
  reviewed_at TIMESTAMPTZ,
  reference_number TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'partnered', 'closed')),
  organization_name TEXT NOT NULL,
  organization_type TEXT NOT NULL,
  country TEXT NOT NULL,
  website TEXT,
  contact_name TEXT NOT NULL,
  contact_title TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  interest_types JSONB NOT NULL,
  cohort_size TEXT,
  timeline TEXT,
  additional_info TEXT,
  internal_notes TEXT,
  reviewed_by UUID REFERENCES admins(id),
  reviewed_at TIMESTAMPTZ,
  reference_number TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admins(id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  details JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reference_counters (
  entity TEXT NOT NULL,
  year INTEGER NOT NULL,
  last_number INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (entity, year)
);

CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_contact_email ON inquiries(contact_email);
CREATE INDEX IF NOT EXISTS idx_programs_slug ON programs(slug);
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON admin_actions(admin_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_applications_duplicate_guard
  ON applications (LOWER(email), program_interest, COALESCE(specific_program, ''));

CREATE UNIQUE INDEX IF NOT EXISTS idx_inquiries_duplicate_guard
  ON inquiries (LOWER(contact_email), organization_name);
