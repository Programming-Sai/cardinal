import { Link, useParams } from 'react-router';
import { ImageWithFallback } from '../components/media/ImageWithFallback';
import BrandIcon from '../components/brand/BrandIcon';
import { ArrowRight, Check, Clock3, FileText, X } from 'lucide-react';
import { findProgramBySlug } from '../data/programs';

export default function ProgramDetail() {
  const { slug } = useParams();
  const program = slug ? findProgramBySlug(slug) : undefined;
  const categoryLabel =
    program?.category === 'student'
      ? 'Student Mobility'
      : program?.category === 'professional'
        ? 'Professional Fellowship'
        : 'Institutional Partnership';

  if (!program) {
    return (
      <section className="pt-[120px] pb-20 bg-[#f7fafd] min-h-screen">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="bg-white border border-[#e6bcbf] p-10 shadow-xl">
            <h1 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] text-[#0A1C3A] mb-4">Program not found</h1>
            <p className="text-[#737576] mb-8">The program you were looking for is not available yet.</p>
            <Link
              to="/programs"
              className="inline-block bg-[#F71C56] text-white font-bold px-8 py-4 rounded uppercase tracking-widest text-sm hover:brightness-110 transition-all"
            >
              Back to Programs
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const applyTarget =
    program.category === 'institutional' ? `/apply?tab=institutional&program=${program.slug}` : `/apply?tab=individual&program=${program.slug}`;

  const fitPoints = [
    'You want a structured experience with clear learning outcomes.',
    'You prefer a program that is more guided than a typical travel package.',
    'You are ready to commit to a schedule, reflection, and purposeful participation.',
  ];

  return (
    <>
      <section
        className="pt-[120px] pb-20 bg-[#0A1C3A] text-white relative overflow-hidden"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0% 100%)' }}
      >
        <div className="absolute inset-0 opacity-[0.24] pointer-events-none">
          <ImageWithFallback src={program.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1C3A]/30 via-[#0A1C3A]/35 to-[#F71C56]/15" />
        </div>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
          <div className="max-w-3xl space-y-6">
            <span className="font-bold text-[#ffb2b8] uppercase tracking-[0.2em] text-sm">{categoryLabel}</span>
            <h1 className="font-extrabold text-[36px] sm:text-[48px] md:text-[64px] leading-[42px] sm:leading-[56px] md:leading-[72px] tracking-[-0.02em]">
              {program.title}
            </h1>
            <p className="text-xl leading-8 text-white/90">{program.tagline}</p>
            <p className="text-lg text-white/80 max-w-2xl">{program.summary}</p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/programs"
                className="inline-flex items-center justify-center border border-white/30 text-white font-bold px-6 py-3 rounded uppercase tracking-widest text-xs hover:bg-white hover:text-[#0A1C3A] transition-all"
              >
                Back to Programs
              </Link>
              <Link
                to={applyTarget}
                className="inline-flex items-center justify-center bg-[#F71C56] text-white font-bold px-6 py-3 rounded uppercase tracking-widest text-xs hover:brightness-110 transition-all"
              >
                {program.category === 'institutional' ? 'Start Partnership Inquiry' : 'Apply Now'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-[120px] bg-[#f7fafd] relative -mt-16 pt-40"
        style={{ clipPath: 'polygon(0 10%, 100% 0, 100% 90%, 0 100%)' }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
            <div className="space-y-8">
              <div className="bg-white border border-[#e6bcbf] p-8 shadow-xl">
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-[#737576] uppercase tracking-widest mb-1">Target</p>
                    <p className="font-bold text-[#0A1C3A]">{program.target}</p>
                  </div>
                  <div>
                    <p className="text-[#737576] uppercase tracking-widest mb-1">Duration</p>
                    <p className="font-bold text-[#0A1C3A]">{program.duration}</p>
                  </div>
                  <div>
                    <p className="text-[#737576] uppercase tracking-widest mb-1">Location</p>
                    <p className="font-bold text-[#0A1C3A]">{program.location}</p>
                  </div>
                  <div>
                    <p className="text-[#737576] uppercase tracking-widest mb-1">Deadline</p>
                    <p className="font-bold text-[#0A1C3A]">{program.deadline}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#e6bcbf] p-8 shadow-xl">
                <h2 className="font-bold text-[32px] text-[#0A1C3A] mb-4">What students usually want to know</h2>
                <p className="text-[#737576] leading-7 mb-6">
                  This page is designed to answer the practical questions before application: what it costs, what you get, and whether the program fits your goals.
                </p>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-xl text-[#0A1C3A] mb-4 flex items-center gap-2">
                      <BrandIcon icon={Check} size="sm" />
                      What is included
                    </h3>
                    <ul className="space-y-3">
                      {program.includes.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-[#737576]">
                          <BrandIcon icon={Check} size="sm" className="flex-shrink-0 mt-1" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-[#0A1C3A] mb-4 flex items-center gap-2">
                      <BrandIcon icon={X} size="sm" tone="dark" />
                      What is not included
                    </h3>
                    <ul className="space-y-3">
                      {program.excludes.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-[#737576]">
                          <BrandIcon icon={X} size="sm" tone="dark" className="flex-shrink-0 mt-1" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="bg-[#0A1C3A] text-white p-8 shadow-2xl">
                <p className="font-bold uppercase tracking-[0.2em] text-[#ffb2b8] mb-4">Status</p>
                <h2 className="font-bold text-[32px] mb-3">{program.status}</h2>
                <p className="text-white/80 leading-7 mb-6">Ideal outcome: {program.outcome}</p>
                <Link
                  to={applyTarget}
                  className="block text-center bg-[#F71C56] text-white font-bold px-6 py-4 rounded uppercase tracking-widest text-sm hover:brightness-110 transition-all"
                >
                  {program.category === 'institutional' ? 'Start Partnership Inquiry' : 'Apply Now'}
                </Link>
              </div>

              <div className="bg-white border border-[#e6bcbf] p-8 shadow-xl">
                <p className="font-bold uppercase tracking-[0.2em] text-[#F71C56] mb-4">Quick fit check</p>
                <ul className="space-y-4">
                  {fitPoints.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-[#737576] leading-7">
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
        style={{ clipPath: 'polygon(0 10%, 100% 0, 100% 90%, 0 100%)' }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-[#f7fafd] border border-[#e6bcbf] p-8 shadow-xl">
              <p className="font-bold uppercase tracking-[0.2em] text-[#F71C56] mb-4">Program Snapshot</p>
              <div className="space-y-5 text-[#0A1C3A]">
                <div>
                  <p className="text-sm uppercase tracking-widest text-[#737576] mb-1">Eligibility</p>
                  <p className="font-bold leading-7">{program.eligibility}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-widest text-[#737576] mb-1">Fee</p>
                  <p className="font-bold leading-7">{program.fee}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-widest text-[#737576] mb-1">Availability</p>
                  <p className="font-bold leading-7">{program.availability}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e6bcbf] p-8 shadow-xl">
              <p className="font-bold uppercase tracking-[0.2em] text-[#F71C56] mb-4 flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                Learning Flow
              </p>
              <div className="space-y-5">
                {program.timeline.map((item, index) => (
                  <div key={item.label} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F71C56]/10 text-[#F71C56] flex items-center justify-center font-bold flex-shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0A1C3A] mb-1">{item.label}</h3>
                      <p className="text-[#737576] leading-7">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0A1C3A] text-white p-8 shadow-2xl">
              <p className="font-bold uppercase tracking-[0.2em] text-[#ffb2b8] mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Next Steps
              </p>
              <ul className="space-y-4 mb-8">
                {program.nextSteps.map((step) => (
                  <li key={step} className="flex items-start gap-3 text-white/85 leading-7">
                    <BrandIcon icon={Check} size="sm" tone="dark" className="flex-shrink-0 mt-1" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={applyTarget}
                className="block text-center bg-[#F71C56] text-white font-bold px-6 py-4 rounded uppercase tracking-widest text-sm hover:brightness-110 transition-all"
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





