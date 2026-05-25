import { apiRequest } from './api';

export type BackendProgramStatus = 'accepting' | 'coming_soon' | 'full' | 'closed';
export type BackendProgramCategory = 'student' | 'professional' | 'institutional';

export interface Program {
  id: string;
  slug: string;
  category: BackendProgramCategory;
  title: string;
  tagline?: string | null;
  summary?: string | null;
  target?: string | null;
  eligibility?: string | null;
  duration?: string | null;
  location?: string | null;
  deadline?: string | null;
  fee?: string | null;
  availability?: string | null;
  status: BackendProgramStatus;
  outcome?: string | null;
  includes?: string[];
  excludes?: string[];
  timeline?: { label: string; description: string }[] | string[];
  nextSteps?: string[];
  colors?: { accent: string; ink: string } | null;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  imageUrl?: string;
  description?: string | null;
}

export const fetchPrograms = async (params?: Record<string, string>) => {
  const searchParams = new URLSearchParams(params);
  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : '';
  return apiRequest<Program[]>(`/programs${suffix}`);
};

export const fetchProgramBySlug = async (slug: string) => {
  return apiRequest<Program>(`/programs/${encodeURIComponent(slug)}`);
};
