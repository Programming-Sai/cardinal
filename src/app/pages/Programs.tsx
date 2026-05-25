import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ImageWithFallback } from '../components/media/ImageWithFallback';
import BrandIcon from '../components/brand/BrandIcon';
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Compass,
  Globe,
  GraduationCap,
  Landmark,
  MapPin,
  ScrollText,
  X,
} from 'lucide-react';
import { fetchPrograms, type Program } from '../utils/programApi';

export default function Programs() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(true);
  const currentYear = new Date().getFullYear();

  const getProgramCategoryLabel = (category: Program['category']) => {
    if (category === 'student') return 'Student Mobility';
    if (category === 'professional') return 'Professional Fellowship';
    return 'Institutional Partnership';
  };

  const getProgramStatusLabel = (status: Program['status']) => {
    if (status === 'accepting') return 'Accepting Applications';
    if (status === 'coming_soon') return 'Coming Soon';
    if (status === 'full') return 'Full';
    return 'Closed';
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach((el) => {
      revealObserver.observe(el);
    });

    return () => revealObserver.disconnect();
  }, [programs]);

  useEffect(() => {
    let cancelled = false;

    const loadPrograms = async () => {
      try {
        setIsLoadingPrograms(true);
        const data = await fetchPrograms();
        if (!cancelled) {
          setPrograms(data);
        }
      } catch (error) {
        console.error('Failed to load programs:', error);
      } finally {
        if (!cancelled) {
          setIsLoadingPrograms(false);
        }
      }
    };

    loadPrograms();

    return () => {
      cancelled = true;
    };
  }, []);

  const compareItems = {
    include: [
      'Learning outcomes and structured modules',
      'Daily schedules with purposeful rhythm',
      'Professional development and skill building',
    ],
    exclude: [
      'Sightseeing itineraries or landmark tours',
      'Leisure activities or vacation packages',
      'Tour packages or travel agency services',
    ],
  };

  const studentGuidance = [
    {
      title: 'Choose based on your goal',
      description:
        'If you want academic exposure, start with Student Mobility. If you want skill-building and cross-border practice, look at Professional Fellowships. If you represent a school or department, start with Institutional Partnerships.',
      icon: Compass,
    },
    {
      title: 'Know what you will need',
      description:
        'Have your motivation statement, availability window, and a realistic budget in mind before you apply. That makes the review process easier and helps us match you correctly.',
      icon: ScrollText,
    },
    {
      title: 'Expect a response window',
      description:
        'Once you apply, you should receive a confirmation reference and a next-step response window so you know what happens next.',
      icon: Check,
    },
  ];

  const studentChecklist = [
    'A short motivation statement about what you want to learn',
    'A realistic view of your budget and travel timing',
    'Your current institution or organization details, if relevant',
    'Passport or travel document readiness, if the program involves travel',
  ];

  const differentFeatures = [
    {
      icon: Compass,
      title: 'Intentional Design',
      description: 'Every program has clear learning objectives and measurable outcomes.',
    },
    {
      icon: Globe,
      title: 'Cross-Border Exchange',
      description: 'Participants engage with local experts, institutions, and communities.',
    },
    {
      icon: ScrollText,
      title: 'Tangible Credentials',
      description: 'Certificates, portfolios, or academic credit where applicable.',
    },
    {
      icon: BriefcaseBusiness,
      title: 'Institutional Collaboration',
      description: 'Programs built with partner universities and organizations.',
    },
  ];

  const faqItems = [
    {
      question: 'Do you offer scholarships or financial aid?',
      answer:
        'Information on scholarships and financial aid options is currently being finalized. Please check back soon or contact us directly for updates on funding opportunities for our programs.',
    },
    {
      question: 'What is included in each program?',
      answer:
        'Each program includes pre-departure orientation, on-site learning modules, and post-program reflection or assessment. All activities are designed around clear learning outcomes and competency development.',
    },
    {
      question: 'Who leads the programs?',
      answer:
        'Cardinal Immersions program leads work alongside local institutional partners and subject matter experts to deliver each program. This ensures both academic rigor and authentic cross-cultural exchange.',
    },
    {
      question: 'Do you arrange travel and accommodation?',
      answer:
        'Yes. Flights, accommodation, and in-country logistics are coordinated to support the learning experience. All travel arrangements serve the educational objectives of the program.',
    },
  ];

  return (
    <>
      {/* I. Hero Section */}
      <section
        className="pt-[120px] pb-16 bg-[#0A1C3A] text-white relative overflow-hidden"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0% 100%)' }}
      >
        <div className="absolute inset-0 z-0 opacity-[0.22] pointer-events-none">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1674027444485-cec3da58eef4?w=1080&q=80"
            alt="Abstract network connections"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1C3A]/35 via-transparent to-[#F71C56]/15" />
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
          <div className="max-w-3xl space-y-6 reveal active">
            <h1 className="font-extrabold text-[36px] sm:text-[48px] md:text-[64px] leading-[42px] sm:leading-[56px] md:leading-[72px] tracking-[-0.02em]">
              Our Programs
            </h1>
            <p className="text-2xl leading-relaxed text-white/90">
              Structured, cross-border learning experiences designed for tangible outcomes.
            </p>
            <p className="text-lg text-white/80 border-l-4 border-[#F71C56] pl-6">
              Travel and logistics exist to support learning, not the other way around.
            </p>
          </div>
        </div>
      </section>

      {/* II. Core Program Categories */}
      <section
        className="py-[120px] bg-[#f7fafd] relative -mt-8 z-10"
        style={{ clipPath: 'polygon(0 10%, 100% 0, 100% 90%, 0 100%)' }}
      >
        <div className="absolute bottom-16 left-[3%] opacity-[0.18] pointer-events-none">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1080&q=80"
            alt="Library shelves"
            className="w-64 h-64 sm:w-80 sm:h-80 object-cover rounded-lg"
          />
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {isLoadingPrograms ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`category-skeleton-${index}`}
                  className="bg-white overflow-hidden border border-[#e6bcbf] animate-pulse"
                  style={{
                    borderTop: '6px solid #e6bcbf',
                    clipPath: 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)',
                  }}
                >
                  <div className="w-full h-52 bg-[#eef1f4]" />
                  <div className="p-8 space-y-5">
                    <div className="h-4 w-28 bg-[#e6bcbf]" />
                    <div className="h-8 w-2/3 bg-[#e6bcbf]" />
                    <div className="h-4 w-full bg-[#eef1f4]" />
                    <div className="h-4 w-4/5 bg-[#eef1f4]" />
                  </div>
                </div>
              ))
            ) : programs.length > 0 ? (
              programs.map((program, index) => {
                const accentColor = program.colors?.accent || '#F71C56';
                const programImage = program.image || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1080&q=80';

                return (
                  <div
                    key={program.slug}
                    className="group bg-white overflow-hidden border border-[#e6bcbf] hover:shadow-2xl transition-all duration-500 reveal"
                    style={{
                      borderTop: `6px solid ${accentColor}`,
                      clipPath: 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)',
                      transitionDelay: `${index * 120}ms`,
                    }}
                  >
                    <ImageWithFallback
                      src={programImage}
                      alt={program.title}
                      className="w-full h-52 object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="p-8 space-y-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F71C56] mb-2">
                            {getProgramStatusLabel(program.status)}
                          </p>
                          <h3 className="font-bold text-[28px] leading-[34px] text-[#0A1C3A]">
                            {program.title}
                          </h3>
                        </div>
                        <BrandIcon
                          icon={
                            program.category === 'student'
                              ? GraduationCap
                              : program.category === 'professional'
                                ? BriefcaseBusiness
                                : Landmark
                          }
                          size="md"
                        />
                      </div>

                      <p className="text-[#737576] leading-7">{program.summary || program.description || ''}</p>

                      <div className="space-y-3 text-[#737576]">
                        <p>
                          <span className="font-bold text-[#0A1C3A]">Target:</span> {program.target}
                        </p>
                        <p>
                          <span className="font-bold text-[#0A1C3A]">Duration:</span> {program.duration}
                        </p>
                        <p>
                          <span className="font-bold text-[#0A1C3A]">Outcome:</span> {program.outcome}
                        </p>
                      </div>

                      <Link
                        to={`/programs/${program.slug}`}
                        className="inline-flex items-center gap-2 font-bold text-[#F71C56] uppercase text-xs tracking-widest group-hover:gap-4 transition-all"
                      >
                        View details <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="md:col-span-3 bg-white border border-[#e6bcbf] p-8 text-center text-[#737576]">
                No programs are currently available. Please check back soon.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* III. What Makes Our Programs Different */}
      <section
        className="py-[120px] bg-white relative -mt-8 z-20"
        style={{ clipPath: 'polygon(0 10%, 100% 0, 100% 90%, 0 100%)' }}
      >
        <div className="absolute top-20 right-[5%] opacity-[0.18] pointer-events-none">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1080&q=80"
            alt="Compass"
            className="w-56 h-56 sm:w-72 sm:h-72 object-cover"
          />
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="text-center mb-16 reveal">
            <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em] text-[#0A1C3A] mb-8">
              What Makes Our Programs Different
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {differentFeatures.map((item, index) => (
              <div
                key={item.title}
                className="flex gap-6 items-start reveal"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <BrandIcon icon={item.icon} size="lg" className="flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-[24px] mb-3 text-[#0A1C3A]">{item.title}</h3>
                  <p className="text-lg text-[#737576] leading-7">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IV. Find Your Fit */}
      <section
        className="py-[120px] bg-[#f7fafd] relative -mt-8 z-10"
        style={{ clipPath: 'polygon(0 10%, 100% 0, 100% 90%, 0 100%)' }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 items-stretch">
            <div className="bg-white border border-[#e6bcbf] shadow-xl p-8 md:p-10 reveal">
              <p className="font-bold uppercase tracking-[0.2em] text-[#F71C56] mb-4">
                Find your fit
              </p>
              <h2 className="font-bold text-[32px] sm:text-[36px] md:text-[40px] leading-[40px] sm:leading-[44px] md:leading-[48px] tracking-[-0.01em] text-[#0A1C3A] mb-6">
                A quick guide before you choose a program
              </h2>
              <div className="space-y-5">
                {studentGuidance.map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-4 items-start p-4 bg-[#f7fafd] border border-[#e6bcbf]"
                    style={{ clipPath: 'polygon(0 0, 99% 0, 100% 1%, 100% 100%, 1% 100%, 0 99%)' }}
                  >
                    <BrandIcon icon={item.icon} size="md" className="flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-[#0A1C3A] text-xl mb-2">{item.title}</h3>
                      <p className="text-[#737576] leading-7">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0A1C3A] text-white shadow-2xl p-8 md:p-10 reveal">
              <p className="font-bold uppercase tracking-[0.2em] text-[#ffb2b8] mb-4">
                Before you apply
              </p>
              <h2 className="font-bold text-[32px] sm:text-[36px] md:text-[40px] leading-[40px] sm:leading-[44px] md:leading-[48px] tracking-[-0.01em] mb-6">
                What students usually want to know first
              </h2>
              <ul className="space-y-4 mb-8">
                {studentChecklist.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/85 leading-7">
                    <BrandIcon icon={Check} size="sm" tone="dark" className="flex-shrink-0 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/10 p-4">
                  <p className="text-[#ffb2b8] text-sm uppercase tracking-widest mb-1">Need help</p>
                  <p className="font-bold">Ask for the brochure or contact our team directly.</p>
                </div>
                <div className="bg-white/10 p-4">
                  <p className="text-[#ffb2b8] text-sm uppercase tracking-widest mb-1">Good to know</p>
                  <p className="font-bold">You can save your application draft while deciding.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* V. We Are Not a Travel Agency */}
      <section
        className="py-[120px] bg-[#f1f4f7] relative -mt-16 pt-32"
        style={{ clipPath: 'polygon(0 10%, 100% 0, 100% 90%, 0 100%)' }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="bg-white border-2 border-[#e6bcbf] p-12 shadow-xl reveal">
            <p className="text-2xl leading-relaxed text-[#0A1C3A] italic mb-12 text-center max-w-4xl mx-auto border-l-4 border-[#F71C56] pl-8">
              Cardinal Immersions programs include travel logistics only as a support function.
              You will not find sightseeing itineraries, leisure activities, or tour packages here.
              Every day of a program is structured around learning outcomes.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-4">
                <h3 className="font-bold text-[24px] text-[#0A1C3A] mb-6 flex items-center gap-3">
                  <BrandIcon icon={Check} size="sm" />
                  What We Include
                </h3>
                <ul className="space-y-4">
                  {compareItems.include.map((item) => (
                    <li key={item} className="flex items-start gap-4">
                      <BrandIcon icon={Check} size="sm" className="flex-shrink-0 mt-1" />
                      <span className="text-lg leading-7 text-[#737576]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-[24px] text-[#0A1C3A] mb-6 flex items-center gap-3">
                  <BrandIcon icon={X} size="sm" tone="dark" />
                  What We Do Not Include
                </h3>
                <ul className="space-y-4">
                  {compareItems.exclude.map((item) => (
                    <li key={item} className="flex items-start gap-4">
                      <BrandIcon icon={X} size="sm" tone="dark" className="flex-shrink-0 mt-1" />
                      <span className="text-lg leading-7 text-[#737576]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VI. Program Openings */}
      <section
        className="py-[120px] bg-[#f7fafd] relative -mt-8"
        style={{ clipPath: 'polygon(0 10%, 100% 0, 100% 90%, 0 100%)' }}
      >
        <div className="absolute top-32 right-[5%] opacity-[0.18] pointer-events-none">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1080&q=80"
            alt="Workspace"
            className="w-72 h-72 object-cover rounded-lg"
          />
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="text-center mb-16 reveal">
            <span className="font-bold text-[#F71C56] uppercase tracking-[0.2em] mb-4 block">
              Program Openings
            </span>
            <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em] text-[#0A1C3A]">
              {currentYear} Program Calendar
            </h2>
            <p className="text-[#737576] mt-4 max-w-2xl mx-auto">
              These openings update as cohorts are confirmed. Each listing shows the current
              status, location, duration, fee guidance, and next step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 reveal">
            {isLoadingPrograms ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`opening-skeleton-${index}`}
                  className="bg-white border border-[#e6bcbf] p-6 animate-pulse"
                  style={{
                    clipPath: 'polygon(0 0, 99% 0, 100% 1%, 100% 100%, 1% 100%, 0 99%)',
                  }}
                >
                  <div className="h-56 w-full bg-[#eef1f4] mb-5" />
                  <div className="h-4 w-28 bg-[#e6bcbf] mb-3" />
                  <div className="h-7 w-3/4 bg-[#e6bcbf] mb-5" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-16 bg-[#f7fafd] border border-[#e6bcbf]" />
                    <div className="h-16 bg-[#f7fafd] border border-[#e6bcbf]" />
                    <div className="h-16 bg-[#f7fafd] border border-[#e6bcbf]" />
                    <div className="h-16 bg-[#f7fafd] border border-[#e6bcbf]" />
                  </div>
                </div>
              ))
            ) : programs.length > 0 ? (
              programs.map((program, index) => {
              const isOpen = program.status === 'accepting';
              const ctaLabel = isOpen ? 'Apply now' : 'View details';
              const programImage = program.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1080&q=80';

              return (
                <div
                  key={program.slug}
                  className="bg-white border border-[#e6bcbf] hover:border-[#F71C56] hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col"
                  style={{
                    clipPath: 'polygon(0 0, 99% 0, 100% 1%, 100% 100%, 1% 100%, 0 99%)',
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  <ImageWithFallback
                    src={programImage}
                    alt={program.title}
                    className="w-full h-56 object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="p-6 space-y-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F71C56] mb-2">
                          {getProgramCategoryLabel(program.category)}
                        </p>
                        <h3 className="font-bold text-[24px] leading-[30px] text-[#0A1C3A]">
                          {program.title}
                        </h3>
                      </div>
                      <BrandIcon
                        icon={
                          program.category === 'student'
                            ? GraduationCap
                            : program.category === 'professional'
                              ? BriefcaseBusiness
                              : Landmark
                        }
                        size="md"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#737576] text-sm">
                      <div className="rounded-xl bg-[#f7fafd] p-3 border border-[#e6bcbf]">
                        <p className="uppercase tracking-widest text-[11px] text-[#F71C56] mb-1">
                          Deadline
                        </p>
                        <p className="font-bold text-[#0A1C3A]">{program.deadline}</p>
                      </div>
                      <div className="rounded-xl bg-[#f7fafd] p-3 border border-[#e6bcbf]">
                        <p className="uppercase tracking-widest text-[11px] text-[#F71C56] mb-1">
                          Availability
                        </p>
                        <p className="font-bold text-[#0A1C3A]">{program.availability}</p>
                      </div>
                      <div className="rounded-xl bg-[#f7fafd] p-3 border border-[#e6bcbf]">
                        <p className="uppercase tracking-widest text-[11px] text-[#F71C56] mb-1">
                          Fee
                        </p>
                        <p className="font-bold text-[#0A1C3A]">{program.fee}</p>
                      </div>
                      <div className="rounded-xl bg-[#f7fafd] p-3 border border-[#e6bcbf]">
                        <p className="uppercase tracking-widest text-[11px] text-[#F71C56] mb-1">
                          Duration
                        </p>
                        <p className="font-bold text-[#0A1C3A]">{program.duration}</p>
                      </div>
                    </div>

                    <p className="text-[#737576] leading-7">{program.summary || ''}</p>

                    <div className="space-y-2">
                      <p className="text-sm font-bold uppercase tracking-widest text-[#0A1C3A] flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#F71C56]" />
                        Location
                      </p>
                      <p className="text-[#737576]">{program.location}</p>
                    </div>

                    <Link
                      to={isOpen ? `/apply?program=${program.slug}` : `/programs/${program.slug}`}
                      className="inline-flex w-full items-center justify-center gap-2 bg-[#F71C56] text-white font-bold px-5 py-3 rounded transition-all hover:brightness-110 uppercase tracking-widest text-sm"
                    >
                      {ctaLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
              })
            ) : (
              <div className="md:col-span-3 bg-white border border-[#e6bcbf] p-8 text-center text-[#737576]">
                No program openings are published yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* VII. Compare At A Glance */}
      <section
        className="py-[120px] bg-white relative -mt-8 z-10"
        style={{ clipPath: 'polygon(0 10%, 100% 0, 100% 90%, 0 100%)' }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="text-center mb-16 reveal">
            <span className="font-bold text-[#F71C56] uppercase tracking-[0.2em] mb-4 block">
              Compare at a glance
            </span>
            <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em] text-[#0A1C3A]">
              See which program matches your situation
            </h2>
            <p className="text-[#737576] mt-4 max-w-2xl mx-auto">
              These quick comparisons help you decide by budget, time commitment, and outcome.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 reveal">
            {programs.map((program) => (
              <div
                key={`compare-${program.slug}`}
                className="bg-[#f7fafd] border border-[#e6bcbf] p-7 shadow-lg h-full flex flex-col justify-between"
                style={{ clipPath: 'polygon(0 0, 99% 0, 100% 1%, 100% 100%, 1% 100%, 0 99%)' }}
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F71C56] mb-2">
                      {getProgramCategoryLabel(program.category)}
                    </p>
                    <h3 className="font-bold text-[26px] leading-[32px] text-[#0A1C3A]">
                      {program.title}
                    </h3>
                  </div>
                  <BrandIcon
                    icon={
                      program.category === 'student'
                        ? GraduationCap
                        : program.category === 'professional'
                          ? BriefcaseBusiness
                          : Landmark
                    }
                    size="md"
                  />
                </div>

                <div className="space-y-4 text-[#737576]">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#F71C56] mb-1">Best for</p>
                    <p className="font-bold text-[#0A1C3A]">{program.target}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#F71C56] mb-1">Timeframe</p>
                    <p className="font-bold text-[#0A1C3A]">{program.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#F71C56] mb-1">Cost signal</p>
                    <p className="font-bold text-[#0A1C3A]">{program.fee}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#F71C56] mb-1">What you get</p>
                    <p className="leading-7">{program.outcome || program.summary || ''}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIII. For Institutions */}
      <section
        className="py-[120px] bg-white relative -mt-8 z-10"
        style={{ clipPath: 'polygon(0 10%, 100% 0, 100% 90%, 0 100%)' }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 reveal">
              <span className="font-bold text-[#F71C56] uppercase tracking-[0.2em]">
                For Institutions
              </span>
              <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em] text-[#0A1C3A]">
                Partner with Cardinal Immersions
              </h2>
              <p className="text-xl leading-8 text-[#737576]">
                Design custom mobility programs for your students or staff. We handle program
                structure, logistics, and learning outcomes, while you bring the participants.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#737576]">
                <div className="rounded-2xl border border-[#e6bcbf] bg-[#f7fafd] p-4">
                  <p className="font-bold text-[#0A1C3A] mb-1">Custom cohorts</p>
                  <p className="text-sm leading-6">
                    Designed around your academic calendar, audience, and learning goals.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#e6bcbf] bg-[#f7fafd] p-4">
                  <p className="font-bold text-[#0A1C3A] mb-1">Program support</p>
                  <p className="text-sm leading-6">
                    We coordinate logistics so your team can focus on outcomes.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/partners"
                  className="inline-flex items-center justify-center gap-2 bg-[#F71C56] text-white font-bold px-8 py-4 rounded transition-all hover:brightness-110 uppercase tracking-widest text-sm"
                >
                  Explore partnerships
                </Link>
                <Link
                  to="/apply?tab=institutional"
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#0A1C3A] text-[#0A1C3A] font-bold px-8 py-4 rounded hover:bg-[#0A1C3A] hover:text-white transition-all uppercase tracking-widest text-sm"
                >
                  Start inquiry
                </Link>
              </div>
            </div>

            <div className="reveal">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1080&q=80"
                alt="Educators in professional meeting"
                className="w-full h-[420px] object-cover shadow-2xl"
                style={{
                  clipPath: 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* IX. FAQ Section */}
      <section
        className="py-[120px] bg-[#f1f4f7] relative -mt-16 pt-32"
        style={{ clipPath: 'polygon(0 10%, 100% 0, 100% 90%, 0 100%)' }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="text-center mb-16 reveal">
            <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em] text-[#0A1C3A]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4 reveal">
            {faqItems.map((faq, index) => (
              <div
                key={faq.question}
                className="bg-white border border-[#e6bcbf] overflow-hidden transition-all"
                style={{
                  clipPath: 'polygon(0 0, 99% 0, 100% 1%, 100% 100%, 1% 100%, 0 99%)',
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-8 py-6 flex justify-between items-center gap-6 hover:bg-[#f7fafd] transition-colors"
                >
                  <span className="font-bold text-lg text-[#0A1C3A] text-left">{faq.question}</span>
                  <span className="text-[#F71C56] text-2xl">
                    {openFaq === index ? '−' : '+'}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-8 pb-6">
                    <p className="text-[#737576] leading-7">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* X. Call to Action */}
      <section
        className="py-[120px] bg-[#0A1C3A] text-white relative z-10 -mb-10"
        style={{ clipPath: 'polygon(0 10%, 100% 0, 100% 100%, 0 100%)' }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 text-center">
          <div className="max-w-3xl mx-auto space-y-8 reveal">
            <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em]">
              Ready to design the right program?
            </h2>
            <p className="text-xl leading-8 text-white/90">
              Whether you are a student seeking international academic experience, a professional
              looking to expand global competence, or an institution building partnerships, we
              are ready to collaborate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link
                to="/contact"
                className="bg-[#F71C56] text-white font-bold px-8 py-4 rounded transition-all hover:brightness-110 uppercase tracking-widest text-sm"
              >
                Contact Us
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white font-bold px-8 py-4 rounded hover:bg-white hover:text-[#0A1C3A] transition-all uppercase tracking-widest text-sm"
              >
                Request Program Brochure
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}







