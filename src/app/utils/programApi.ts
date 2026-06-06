import { apiRequest } from './api';
import { getProgramImage, type ProgramCategory } from './localImages';

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

function normalizeProgramImage(program: Program, seed: number | string = 0): Program {
  const category = program.category as ProgramCategory;
  const image = getProgramImage(category, seed);

  return {
    ...program,
    image,
    imageUrl: image,
  };
}

export const fetchPrograms = async (params?: Record<string, string>) => {
  const searchParams = new URLSearchParams(params);
  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : '';
  const programs = await apiRequest<Program[]>(`/programs${suffix}`);
  return programs.map((program, index) =>
    normalizeProgramImage(program, program.slug || index),
  );
};

export const fetchProgramBySlug = async (slug: string) => {
  const program = await apiRequest<Program>(`/programs/${encodeURIComponent(slug)}`);
  return normalizeProgramImage(program, slug);
};
