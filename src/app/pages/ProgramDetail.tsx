import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ImageWithFallback } from '../components/media/ImageWithFallback';
import BrandIcon from '../components/brand/BrandIcon';
import { ArrowRight, Check, Clock3, FileText, X } from 'lucide-react';
import { fetchProgramBySlug, type Program } from '../utils/programApi';
import { getProgramImage } from '../utils/localImages';

export default function ProgramDetail() {
  const { slug } = useParams();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadProgram = async () => {
      if (!slug) {
        setLoading(false);
        setProgram(null);
        return;
      }

      try {
        const data = await fetchProgramBySlug(slug);
        if (!cancelled) {
          setProgram(data);
        }
      } catch (error) {
        console.error('Failed to load program:', error);
        if (!cancelled) {
          setProgram(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProgram();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <section className="pt-[120px] pb-20 bg-[var(--brand-surface)] min-h-screen">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="bg-white border border-[var(--brand-border)] p-10 shadow-xl">
            <h1 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] text-[var(--brand-navy)] mb-4">Loading program</h1>
          </div>
        </div>
      </section>
    );
  }

  if (!program) {
    return (
      <section className="pt-[120px] pb-20 bg-[var(--brand-surface)] min-h-screen">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="bg-white border border-[var(--brand-border)] p-10 shadow-xl">
            <h1 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] text-[var(--brand-navy)] mb-4">Program not found</h1>
            <p className="text-[var(--brand-muted)] mb-8">The program you were looking for is not available yet.</p>
            <Link
              to="/programs"
              className="inline-block bg-[var(--brand-red)] text-white font-bold px-8 py-4 rounded uppercase tracking-widest text-sm hover:brightness-110 transition-all"
            >
              Back to Programs
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const categoryLabel =
    program.category === 'student'
      ? 'Student Mobility'
      : program.category === 'professional'
        ? 'Professional Fellowship'
        : 'Institutional Partnership';

  const applyTarget =
    program.category === 'institutional'
      ? `/apply?tab=institutional&program=${program.slug}`
      : `/apply?tab=individual&program=${program.slug}`;

  const fitPoints = [
    'You want a structured experience with clear learning outcomes.',
    'You prefer a program that is more guided than a typical travel package.',
    'You are ready to commit to a schedule, reflection, and purposeful participation.',
  ];

  const includes = program.includes || [];
  const excludes = program.excludes || [];
  const timeline = Array.isArray(program.timeline) ? program.timeline : [];
  const nextSteps = program.nextSteps || [];
  const heroImage = program.image || getProgramImage(program.category, program.slug);

  return (
    <>
      <section
        className="pt-[120px] pb-20 bg-[var(--brand-navy)] text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-[0.24] pointer-events-none">
          <ImageWithFallback src={heroImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-navy)]/30 via-[var(--brand-blue)]/18 to-[var(--brand-cyan)]/15" />
        </div>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
          <div className="max-w-3xl space-y-6">
            <span className="font-bold text-[var(--brand-red-soft)] uppercase tracking-[0.2em] text-sm">{categoryLabel}</span>
            <h1 className="font-extrabold text-[36px] sm:text-[48px] md:text-[64px] leading-[42px] sm:leading-[56px] md:leading-[72px] tracking-[-0.02em]">
              {program.title}
            </h1>
            <p className="text-xl leading-8 text-white/90">{program.tagline}</p>
            <p className="text-lg text-white/80 max-w-2xl">{program.summary}</p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/programs"
                className="inline-flex items-center justify-center border border-white/30 text-white font-bold px-6 py-3 rounded uppercase tracking-widest text-xs hover:bg-white hover:text-[var(--brand-navy)] transition-all"
              >
                Back to Programs
              </Link>
              <Link
                to={applyTarget}
                className="inline-flex items-center justify-center bg-[var(--brand-red)] text-white font-bold px-6 py-3 rounded uppercase tracking-widest text-xs hover:brightness-110 transition-all"
              >
                {program.category === 'institutional' ? 'Start Partnership Inquiry' : 'Apply Now'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-[120px] bg-[var(--brand-surface)] relative -mt-16 pt-40"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
            <div className="space-y-8">
              <div className="bg-white border border-[var(--brand-border)] p-8 shadow-xl">
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-[var(--brand-muted)] uppercase tracking-widest mb-1">Target</p>
                    <p className="font-bold text-[var(--brand-navy)]">{program.target}</p>
                  </div>
                  <div>
                    <p className="text-[var(--brand-muted)] uppercase tracking-widest mb-1">Duration</p>
                    <p className="font-bold text-[var(--brand-navy)]">{program.duration}</p>
                  </div>
                  <div>
                    <p className="text-[var(--brand-muted)] uppercase tracking-widest mb-1">Location</p>
                    <p className="font-bold text-[var(--brand-navy)]">{program.location}</p>
                  </div>
                  <div>
                    <p className="text-[var(--brand-muted)] uppercase tracking-widest mb-1">Deadline</p>
                    <p className="font-bold text-[var(--brand-navy)]">{program.deadline || 'Rolling'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[var(--brand-border)] p-8 shadow-xl">
                <h2 className="font-bold text-[32px] text-[var(--brand-navy)] mb-4">What students usually want to know</h2>
                <p className="text-[var(--brand-muted)] leading-7 mb-6">
                  This page is designed to answer the practical questions before application: what it costs, what you get, and whether the program fits your goals.
                </p>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-xl text-[var(--brand-navy)] mb-4 flex items-center gap-2">
                      <BrandIcon icon={Check} size="sm" />
                      What is included
                    </h3>
                    <ul className="space-y-3">
                      {includes.map((item) => (
                        <li key={typeof item === 'string' ? item : item.label} className="flex items-start gap-3 text-[var(--brand-muted)]">
                          <BrandIcon icon={Check} size="sm" className="flex-shrink-0 mt-1" />
                          <span>{typeof item === 'string' ? item : item.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-[var(--brand-navy)] mb-4 flex items-center gap-2">
                      <BrandIcon icon={X} size="sm" tone="dark" />
                      What is not included
                    </h3>
                    <ul className="space-y-3">
                      {excludes.map((item) => (
                        <li key={typeof item === 'string' ? item : item.label} className="flex items-start gap-3 text-[var(--brand-muted)]">
                          <BrandIcon icon={X} size="sm" tone="dark" className="flex-shrink-0 mt-1" />
                          <span>{typeof item === 'string' ? item : item.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="bg-[var(--brand-navy)] text-white p-8 shadow-2xl">
                <p className="font-bold uppercase tracking-[0.2em] text-[var(--brand-red-soft)] mb-4">Status</p>
                <h2 className="font-bold text-[32px] mb-3">{program.status.replace('_', ' ')}</h2>
                <p className="text-white/80 leading-7 mb-6">Ideal outcome: {program.outcome}</p>
                <Link
                  to={applyTarget}
                  className="block text-center bg-[var(--brand-red)] text-white font-bold px-6 py-4 rounded uppercase tracking-widest text-sm hover:brightness-110 transition-all"
                >
                  {program.category === 'institutional' ? 'Start Partnership Inquiry' : 'Apply Now'}
                </Link>
              </div>

              <div className="bg-white border border-[var(--brand-border)] p-8 shadow-xl">
                <p className="font-bold uppercase tracking-[0.2em] text-[var(--brand-red)] mb-4">Quick fit check</p>
                <ul className="space-y-4">
                  {fitPoints.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-[var(--brand-muted)] leading-7">
                      <BrandIcon icon={Check} size="sm" className="flex-shrink-0 mt-1" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section
        className="py-[120px] bg-white relative -mt-12"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-[var(--brand-surface)] border border-[var(--brand-border)] p-8 shadow-xl">
              <p className="font-bold uppercase tracking-[0.2em] text-[var(--brand-red)] mb-4">Program Snapshot</p>
              <div className="space-y-5 text-[var(--brand-navy)]">
                <div>
                  <p className="text-sm uppercase tracking-widest text-[var(--brand-muted)] mb-1">Eligibility</p>
                  <p className="font-bold leading-7">{program.eligibility}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-widest text-[var(--brand-muted)] mb-1">Fee</p>
                  <p className="font-bold leading-7">{program.fee}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-widest text-[var(--brand-muted)] mb-1">Availability</p>
                  <p className="font-bold leading-7">{program.availability}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[var(--brand-border)] p-8 shadow-xl">
              <p className="font-bold uppercase tracking-[0.2em] text-[var(--brand-red)] mb-4 flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                Learning Flow
              </p>
              <div className="space-y-5">
                {timeline.map((item, index) => {
                  const entry = typeof item === 'string' ? { label: item, description: item } : item;
                  return (
                    <div key={entry.label} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-[var(--brand-red)]/10 text-[var(--brand-red)] flex items-center justify-center font-bold flex-shrink-0">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <h3 className="font-bold text-[var(--brand-navy)] mb-1">{entry.label}</h3>
                        <p className="text-[var(--brand-muted)] leading-7">{entry.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[var(--brand-navy)] text-white p-8 shadow-2xl">
              <p className="font-bold uppercase tracking-[0.2em] text-[var(--brand-red-soft)] mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Next Steps
              </p>
              <ul className="space-y-4 mb-8">
                {nextSteps.map((step) => (
                  <li key={step} className="flex items-start gap-3 text-white/85 leading-7">
                    <BrandIcon icon={Check} size="sm" tone="dark" className="flex-shrink-0 mt-1" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={applyTarget}
                className="block text-center bg-[var(--brand-red)] text-white font-bold px-6 py-4 rounded uppercase tracking-widest text-sm hover:brightness-110 transition-all"
              >
                Continue
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

