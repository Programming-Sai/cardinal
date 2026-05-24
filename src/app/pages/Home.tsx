import { useEffect } from 'react';
import { Link } from 'react-router';
import { ImageWithFallback } from '../components/media/ImageWithFallback';
import BrandIcon from '../components/brand/BrandIcon';
import { ArrowRight, BriefcaseBusiness, Check, GraduationCap, Landmark, X } from 'lucide-react';

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const programCards = [
    {
      icon: GraduationCap,
      title: 'Student Mobility Programs',
      description:
        'Immersive academic experiences for university students seeking structured international exposure and clear learning outcomes.',
      href: '/programs/student-mobility',
      accent: '#F71C56',
    },
    {
      icon: BriefcaseBusiness,
      title: 'Professional Fellowships',
      description:
        'Targeted exchange for mid-career professionals looking to gain global industry insight and cross-border networks.',
      href: '/programs/professional-fellowships',
      accent: '#0A1C3A',
    },
    {
      icon: Landmark,
      title: 'Institutional Partnerships',
      description:
        'Capacity building for educational institutions that want to design and manage their own mobility frameworks.',
      href: '/programs/institutional-partnerships',
      accent: '#F71C56',
    },
  ];

  const distinction = {
    are: [
      'Learning outcomes defined by academic standards.',
      'Capability development focused on professional growth.',
      'Institutional partnerships built on mutual growth.',
      'Cultural intelligence and global adaptability.',
      'Tangible learning gains measured through assessment.',
    ],
    areNot: [
      'Tourism-focused itineraries or casual travel.',
      'Sightseeing excursions without educational context.',
      'Leisure travel disguised as education.',
      'Study abroad recruitment or placement services.',
      'Standard travel agency ticketing or booking.',
    ],
  };

  return (
    <>
      {/* 2. Hero Section */}
      <section
        className="pt-[120px] pb-20 bg-white relative overflow-hidden"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0% 100%)' }}
      >
        <div className="absolute inset-0 z-0 opacity-[0.18] pointer-events-none">
          <svg className="w-full h-full animate-drift" viewBox="0 0 1440 800">
            <circle cx="100" cy="100" fill="#F71C56" r="3" />
            <circle cx="400" cy="300" fill="#0A1C3A" r="4" />
            <circle cx="900" cy="150" fill="#F71C56" r="3" />
            <circle cx="1200" cy="400" fill="#0A1C3A" r="5" />
            <circle cx="600" cy="600" fill="#F71C56" r="3" />
            <path
              className="animate-pulse-slow"
              d="M100 100 L400 300 M400 300 L900 150 M900 150 L1200 400 M1200 400 L600 600 M600 600 L100 100 M400 300 L600 600"
              fill="none"
              stroke="#0A1C3A"
              strokeWidth="1"
            />
          </svg>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-6 items-center relative z-10">
          <div className="space-y-8 reveal active">
            <h1 className="font-extrabold text-[32px] md:text-[64px] leading-[40px] md:leading-[72px] tracking-[-0.02em] text-[#181c1e]">
              Structured International Learning. <span className="text-[#F71C56]">Not Tourism.</span>
            </h1>
            <p className="text-lg leading-7 text-[#737576] max-w-lg">
              Cardinal Immersions designs cross-border educational programs for students,
              professionals, and institutions, fostering real-world expertise and global competence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/programs"
                className="bg-[#F71C56] text-white font-bold px-8 py-4 rounded transition-all hover:brightness-110 uppercase tracking-widest text-sm inline-flex items-center justify-center"
              >
                Explore Programs
              </Link>
              <Link
                to="/partners"
                className="border-2 border-[#0A1C3A] text-[#0A1C3A] font-bold px-8 py-4 rounded hover:bg-[#0A1C3A] hover:text-white transition-all uppercase tracking-widest text-sm inline-flex items-center justify-center"
              >
                View Partnerships
              </Link>
            </div>
          </div>

          <div className="flex justify-center items-center reveal active">
            <div className="w-full max-w-[500px] h-[320px] sm:h-[400px] lg:h-[500px] relative">
              <svg viewBox="0 0 500 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <circle cx="250" cy="250" r="120" fill="none" stroke="#0A1C3A" strokeWidth="3" opacity="0.2" />
                <circle cx="250" cy="250" r="100" fill="#f7fafd" stroke="#0A1C3A" strokeWidth="2" />
                <ellipse cx="250" cy="250" rx="100" ry="30" fill="none" stroke="#0A1C3A" strokeWidth="1" opacity="0.3" />
                <ellipse cx="250" cy="250" rx="100" ry="60" fill="none" stroke="#0A1C3A" strokeWidth="1" opacity="0.3" />
                <ellipse cx="250" cy="250" rx="30" ry="100" fill="none" stroke="#0A1C3A" strokeWidth="1" opacity="0.3" />
                <ellipse cx="250" cy="250" rx="60" ry="100" fill="none" stroke="#0A1C3A" strokeWidth="1" opacity="0.3" />
                <path d="M 230 220 Q 240 210 250 220 Q 260 210 270 220 L 265 240 L 235 240 Z" fill="#F71C56" opacity="0.3" />
                <path d="M 220 260 Q 230 250 240 260 L 235 280 L 225 280 Z" fill="#F71C56" opacity="0.3" />
                <path d="M 260 265 Q 270 255 280 265 L 275 285 L 265 285 Z" fill="#F71C56" opacity="0.3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Purpose */}
      <section className="py-[120px] bg-[#f7fafd] relative -mt-20 z-10" style={{ clipPath: 'polygon(0 10%, 100% 0, 100% 90%, 0 100%)' }}>
        <div className="absolute bottom-10 left-[5%] opacity-[0.18] pointer-events-none">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1080&q=80"
            alt="Books"
            className="w-56 h-56 sm:w-72 sm:h-72 object-cover rounded-lg"
          />
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 text-center relative z-10 py-12">
          <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6 reveal">
            <span className="font-bold text-[#ffb2b8] uppercase tracking-[0.2em]">Our Core Purpose</span>
            <p className="text-[32px] leading-relaxed font-semibold text-[#0A1C3A]">
              We sit at the intersection of education, professional development, and international
              exchange. International mobility is a tool for learning, capability development, and
              institutional collaboration - one that shapes perspective, builds competence, and
              deepens understanding.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Our Distinction */}
      <section className="py-[120px] bg-[#f7fafd] relative -mt-20 pt-40 pb-40 overflow-hidden" style={{ clipPath: 'polygon(0 10%, 100% 0, 100% 90%, 0 100%)' }}>
        <div className="absolute top-32 right-[8%] opacity-[0.18] pointer-events-none">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1080&q=80"
            alt="Bookshelf"
            className="w-72 h-72 object-cover rounded-lg"
          />
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[#e6bcbf] bg-white overflow-hidden shadow-2xl">
            <div className="p-12 md:p-16 border-b md:border-b-0 md:border-r border-[#e6bcbf]" style={{ maskImage: 'radial-gradient(circle 40px at 0 0, transparent 0, transparent 40px, black 41px)', WebkitMaskImage: 'radial-gradient(circle 40px at 0 0, transparent 0, transparent 40px, black 41px)' }}>
              <h3 className="font-semibold text-[32px] leading-[40px] mb-8 text-[#0A1C3A]">
                What we <span className="text-[#F71C56] font-extrabold italic">ARE</span>
              </h3>
              <ul className="space-y-6 reveal">
                {distinction.are.map((item) => (
                  <li key={item} className="flex items-start gap-4">
                    <BrandIcon icon={Check} size="sm" className="flex-shrink-0 mt-1" />
                    <span className="text-lg leading-7">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-12 md:p-16 bg-[#f1f4f7]" style={{ maskImage: 'radial-gradient(circle 40px at 100% 100%, transparent 0, transparent 40px, black 41px)', WebkitMaskImage: 'radial-gradient(circle 40px at 100% 100%, transparent 0, transparent 40px, black 41px)' }}>
              <h3 className="font-semibold text-[32px] leading-[40px] mb-8 text-[#0A1C3A]">
                What we <span className="font-extrabold italic">ARE NOT</span>
              </h3>
              <ul className="space-y-6 reveal" style={{ transitionDelay: '100ms' }}>
                {distinction.areNot.map((item) => (
                  <li key={item} className="flex items-start gap-4">
                    <BrandIcon icon={X} size="sm" tone="dark" className="flex-shrink-0 mt-1" />
                    <span className="text-lg leading-7">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Our Programs */}
      <section className="py-[120px] bg-[#f1f4f7] relative z-10" style={{ clipPath: 'polygon(0 10%, 100% 0, 100% 90%, 0 100%)' }}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 reveal">
            <div className="max-w-2xl">
              <span className="font-bold text-[#F71C56] uppercase tracking-[0.2em] mb-4 block">Academic & Professional Tracks</span>
              <h2 className="font-bold text-[24px] sm:text-[28px] md:text-[36px] lg:text-[48px] leading-[32px] sm:leading-[36px] md:leading-[44px] lg:leading-[56px] tracking-[-0.01em] text-[#0A1C3A]">
                Designed for rigorous development.
              </h2>
            </div>
            <div className="mt-8 md:mt-0">
              <Link className="font-bold text-[#F71C56] underline underline-offset-8 decoration-2 hover:opacity-70 transition-all" to="/programs">
                View all programs
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {programCards.map((program, index) => (
              <div
                key={program.title}
                className="group bg-white p-8 hover:shadow-xl transition-all duration-500 reveal"
                style={{
                  transitionDelay: `${index * 100}ms`,
                  borderTop: `6px solid ${program.accent}`,
                  clipPath: 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)',
                }}
              >
                <BrandIcon icon={program.icon} size="lg" className="mb-6" />
                <h4 className="font-semibold text-[24px] mb-4 text-[#0A1C3A]">{program.title}</h4>
                <p className="text-[#737576] mb-8">{program.description}</p>
                <Link
                  to={program.href}
                  className="inline-flex items-center gap-2 font-bold text-[#F71C56] uppercase text-xs tracking-widest group-hover:gap-4 transition-all"
                >
                  Learn More <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Mission & Vision */}
      <section className="py-[120px] overflow-hidden bg-[#f7fafd] relative -mt-16 z-0 pt-40" style={{ clipPath: 'polygon(0 10%, 100% 0, 100% 90%, 0 100%)' }}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#F71C56]/5 rounded-full z-0 animate-pulse-slow" />
              <div className="relative z-10 space-y-12">
                <div className="reveal">
                  <span className="font-bold text-[#F71C56] uppercase tracking-[0.2em] mb-4 block">Our Mission</span>
                  <p className="font-semibold text-[32px] leading-[40px] text-[#0A1C3A] italic border-l-4 border-[#F71C56] pl-8">
                    To design and deliver immersive international programs that integrate education,
                    professional practice, and cultural intelligence, ensuring participants gain
                    tangible learning outcomes and globally relevant perspectives.
                  </p>
                </div>
                <div className="reveal">
                  <span className="font-bold text-[#F71C56] uppercase tracking-[0.2em] mb-4 block">Our Vision</span>
                  <p className="font-semibold text-[32px] leading-[40px] text-[#0A1C3A] italic border-l-4 border-[#0A1C3A] pl-8">
                    Become a globally respected, African-founded learning platform that positions
                    Africa as both a source of talent and a destination for high-quality learning.
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="grid grid-cols-2 gap-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1080&q=80"
                  alt="Diverse students collaborating"
                  className="w-full h-80 object-cover grayscale hover:grayscale-0 transition-all duration-700 reveal"
                  style={{ clipPath: 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)' }}
                />
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1080&q=80"
                  alt="International partnership meeting"
                  className="w-full h-80 object-cover grayscale hover:grayscale-0 transition-all duration-700 mt-12 reveal"
                  style={{ clipPath: 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Trust Signals */}
      <section className="py-[120px] bg-[#f1f4f7] border-b border-[#e6bcbf] relative z-10" style={{ clipPath: 'polygon(0 10%, 100% 0, 100% 90%, 0 100%)' }}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-12">
          <div className="text-center mb-16 reveal">
            <span className="font-semibold text-[24px] sm:text-[28px] md:text-[32px] leading-[32px] sm:leading-[36px] md:leading-[40px] text-[#0A1C3A] block mb-4">
              Founded in Africa | Global Reach
            </span>
            <div className="w-24 h-1 bg-[#F71C56] mx-auto" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-20">
            <div className="text-center reveal">
              <p className="font-extrabold text-[40px] sm:text-[56px] md:text-[64px] leading-[48px] sm:leading-[64px] md:leading-[72px] tracking-[-0.02em] text-[#F71C56] mb-1">10+</p>
              <p className="font-bold text-[#0A1C3A] uppercase tracking-widest text-sm">Countries</p>
            </div>
            <div className="text-center reveal" style={{ transitionDelay: '100ms' }}>
              <p className="font-extrabold text-[40px] sm:text-[56px] md:text-[64px] leading-[48px] sm:leading-[64px] md:leading-[72px] tracking-[-0.02em] text-[#0A1C3A] mb-1">500+</p>
              <p className="font-bold text-[#0A1C3A] uppercase tracking-widest text-sm">Participants</p>
            </div>
            <div className="text-center reveal" style={{ transitionDelay: '200ms' }}>
              <p className="font-extrabold text-[40px] sm:text-[56px] md:text-[64px] leading-[48px] sm:leading-[64px] md:leading-[72px] tracking-[-0.02em] text-[#F71C56] mb-1">45+</p>
              <p className="font-bold text-[#0A1C3A] uppercase tracking-widest text-sm">Institutions</p>
            </div>
            <div className="text-center reveal" style={{ transitionDelay: '300ms' }}>
              <p className="font-extrabold text-[40px] sm:text-[56px] md:text-[64px] leading-[48px] sm:leading-[64px] md:leading-[72px] tracking-[-0.02em] text-[#0A1C3A] mb-1">100%</p>
              <p className="font-bold text-[#0A1C3A] uppercase tracking-widest text-sm">Educational Focus</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-center reveal">
            <div className="col-span-1">
              <div
                className="bg-white p-8 border border-[#e6bcbf] hover:border-[#F71C56] transition-colors"
                style={{
                  maskImage: 'radial-gradient(circle 40px at 0 0, transparent 0, transparent 40px, black 41px)',
                  WebkitMaskImage: 'radial-gradient(circle 40px at 0 0, transparent 0, transparent 40px, black 41px)',
                }}
              >
                <p className="text-base italic mb-6">
                  Cardinal Immersions provided a level of rigor we hadn&apos;t seen in other exchange
                  programs. This was truly about learning, not a vacation.
                </p>
                <p className="font-bold text-[#0A1C3A]">Director of International Programs, University of Lagos</p>
              </div>
            </div>
            <div className="col-span-1 md:col-span-2">
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-[#d7dadd] opacity-75 flex items-center justify-center grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default text-xs text-center p-2 border border-[#e6bcbf]"
                    style={{ clipPath: 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)' }}
                  >
                    Partner Logo
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}







