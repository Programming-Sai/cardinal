import { useEffect } from "react";
import { ImageWithFallback } from "../components/media/ImageWithFallback";
import BrandIcon from "../components/brand/BrandIcon";
import { professionalImages, studentImages } from "../utils/localImages";
import {
  BookOpen,
  Compass,
  Globe,
  Handshake,
  Lightbulb,
  Shield,
  Target,
  Users,
} from "lucide-react";

export default function About() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".reveal").forEach((el) => {
      revealObserver.observe(el);
    });

    return () => revealObserver.disconnect();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section
        className="pt-[120px] pb-20 bg-white relative overflow-hidden py-20"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 0% 100%)" }}
      >
        {/* Animated Connectivity Background */}
        <div className="absolute inset-0 z-0 opacity-[0.18] pointer-events-none">
          <svg className="w-full h-full animate-drift" viewBox="0 0 1440 800">
            <circle cx="100" cy="100" fill="#F71C56" r="3" />
            <circle cx="400" cy="300" fill="#0C0F3F" r="4" />
            <circle cx="900" cy="150" fill="#88EFF2" r="3" />
            <circle cx="1200" cy="400" fill="#0C0F3F" r="5" />
            <circle cx="600" cy="600" fill="#5A0DBD" r="3" />
            <path
              className="animate-pulse-slow"
              d="M100 100 L400 300 M400 300 L900 150 M900 150 L1200 400 M1200 400 L600 600 M600 600 L100 100 M400 300 L600 600"
              fill="none"
              stroke="#0C0F3F"
              strokeWidth="1"
            />
          </svg>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-3xl space-y-6 sm:space-y-8 reveal active">
              <span className="font-bold text-[#F71C56] uppercase tracking-[0.2em] text-sm">
                About Us
              </span>
              <h1 className="font-extrabold text-[36px] sm:text-[48px] md:text-[64px] leading-[42px] sm:leading-[56px] md:leading-[72px] tracking-[-0.02em] text-[#0C0F3F]">
                Every Experience is a{" "}
                <span className="text-[#F71C56]">Cardinal Moment</span>
              </h1>
              <p className="text-lg leading-8 text-[var(--brand-muted)]">
                Cardinal Immersions designs structured international learning
                experiences that connect students, professionals, and
                institutions to academic, cultural, and industry environments
                around the world.
              </p>
              <p className="text-lg leading-8 text-[var(--brand-muted)]">
                We believe meaningful learning extends beyond classrooms,
                workplaces, and national borders. Through carefully designed
                programmes and trusted international partnerships, we create
                opportunities for individuals to engage with new perspectives,
                cultures, and ideas while developing the confidence and
                capabilities needed to thrive in an interconnected world.
              </p>
              <p className="text-lg leading-8 text-[var(--brand-muted)]">
                Our programmes are built around a simple belief: the most
                valuable international experiences are not defined by where
                people travel, but by how they are transformed along the way.
              </p>
            </div>

            {/* Hero image */}
            <div className="hidden lg:block reveal">
              <ImageWithFallback
                src={studentImages[0]}
                alt="Students learning internationally"
                className="w-full h-[560px] object-cover shadow-2xl"
                style={{
                  clipPath:
                    "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section
        className="bg-[#0C0F3F] text-white relative -mt-16 z-20 "
        style={{ clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 reveal">
              <span className="font-bold text-[#F71C56] uppercase tracking-[0.2em]">
                Our Story
              </span>
              <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em]">
                The Meaning Behind the Name
              </h2>
              <div className="space-y-4 text-lg leading-7 text-white/90">
                <p>
                  The word <strong>Cardinal</strong> carries two meanings that
                  sit at the heart of our work. First, it describes something of
                  fundamental importance — something essential, something deeply
                  valuable. Second, it evokes direction and orientation, much
                  like the cardinal points of a compass that help us navigate
                  the world.
                </p>
                <p>
                  Together, these meanings form the foundation of Cardinal
                  Immersions. We believe that certain experiences have the power
                  to influence how people think about their future, understand
                  their place in the world, and discover new possibilities for
                  themselves. These experiences provide both significance and
                  direction. They become moments that stay with us long after
                  the journey ends.
                </p>
                <p>
                  The word <strong>Immersion</strong> reflects our belief that
                  meaningful learning happens through direct engagement — going
                  beyond observation and participating fully in new
                  environments, cultures, communities, and ideas.
                </p>
              </div>
            </div>

            <div className="reveal">
              <ImageWithFallback
                src={studentImages[1]}
                alt="Globe representing global education"
                className="w-full h-[320px] sm:h-[400px] lg:h-[500px] object-cover shadow-2xl"
                style={{
                  clipPath:
                    "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section
        className=" bg-[var(--brand-surface)] relative -mt-20 pt-40 "
        style={{ clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-25">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Vision - LEFT */}
            <div
              className="bg-[#0C0F3F] text-white overflow-hidden hover:brightness-110 transition-all reveal"
              style={{
                clipPath:
                  "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
              }}
            >
              <ImageWithFallback
                src={studentImages[2]}
                alt="Students collaborating globally"
                className="w-full h-48 object-cover opacity-60"
              />
              <div className="p-10">
                <BrandIcon
                  icon={Compass}
                  size="lg"
                  accent="cyan"
                  className="mb-6"
                />
                <span className="font-bold text-[#88EFF2] uppercase tracking-[0.2em] text-sm block mb-4">
                  Our Vision
                </span>
                <h3 className="font-bold text-[28px] leading-[34px] text-white mb-6">
                  A World of Accessible, Transformative Learning
                </h3>
                <div className="space-y-4 text-white/85 leading-7">
                  <p>
                    We envision a world where meaningful international learning
                    is accessible, structured, and transformative.
                  </p>
                  <p>
                    A world where students, professionals, and institutions can
                    engage confidently across cultures, contribute to global
                    communities, and navigate an increasingly interconnected
                    future with understanding and purpose.
                  </p>
                  <p>
                    We believe that exposure to different perspectives has the
                    power to broaden horizons, inspire innovation, and foster
                    greater understanding between people and communities around
                    the world.
                  </p>
                </div>
              </div>
            </div>

            {/* Mission - RIGHT */}
            <div
              className="bg-white overflow-hidden border border-[var(--brand-border)] hover:border-[#F71C56] transition-all reveal"
              style={{
                clipPath:
                  "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
              }}
            >
              <div className="p-10">
                <BrandIcon
                  icon={Target}
                  size="lg"
                  accent="red"
                  className="mb-6"
                />
                <span className="font-bold text-[#F71C56] uppercase tracking-[0.2em] text-sm block mb-4">
                  Our Mission
                </span>
                <h3 className="font-bold text-[28px] leading-[34px] text-[#0C0F3F] mb-6">
                  Creating Structured International Learning
                </h3>
                <div className="space-y-4 text-[var(--brand-muted)] leading-7">
                  <p>
                    Our mission is to create structured international learning
                    opportunities that expand perspective, strengthen
                    capability, and prepare individuals for success in an
                    increasingly interconnected world.
                  </p>
                  <p>
                    We design programmes that combine academic enrichment,
                    cultural immersion, professional development, and global
                    engagement to ensure participants gain experiences that
                    extend far beyond travel.
                  </p>
                  <p>
                    By connecting people to diverse educational systems,
                    industries, and communities, we help cultivate the global
                    awareness and cross-cultural competence required for the
                    future.
                  </p>
                </div>
              </div>
              <ImageWithFallback
                src={studentImages[3]}
                alt="University campus and academic environment"
                className="w-full h-48 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What We Believe */}
      <section
        className="py-[120px] bg-[var(--brand-surface-alt)] relative z-10 -mt-20"
        style={{ clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-80">
          <div className="text-center mb-16 reveal">
            <span className="font-bold text-[#F71C56] uppercase tracking-[0.2em] mb-4 block">
              What We Believe
            </span>
            <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em] text-[#0C0F3F]">
              The Principles That Drive Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Learning Beyond Borders",
                description:
                  "Some of the most meaningful learning happens outside familiar environments. Exposure to different cultures, systems, and perspectives helps individuals develop a deeper understanding of themselves and the world around them.",
                accent: "blue" as const,
                image: studentImages[4],
                imageAlt: "World map and travel",
              },
              {
                icon: Lightbulb,
                title: "Exposure Builds Capability",
                description:
                  "Real growth often occurs when people encounter new challenges, unfamiliar environments, and different ways of thinking. These experiences build adaptability, resilience, and confidence.",
                accent: "cyan" as const,
                image: studentImages[5],
                imageAlt: "Students collaborating and learning",
              },
              {
                icon: Handshake,
                title: "Cultural Understanding Matters",
                description:
                  "Meaningful engagement across cultures strengthens relationships, encourages empathy, and creates opportunities for mutual learning and collaboration.",
                accent: "red" as const,
                image: studentImages[6],
                imageAlt: "People from diverse cultures connecting",
              },
              {
                icon: BookOpen,
                title: "Structure Creates Impact",
                description:
                  "International experiences are most effective when thoughtfully designed. Clear objectives, intentional learning outcomes, and strong support systems help transform experiences into meaningful development.",
                accent: "blue" as const,
                image: studentImages[7],
                imageAlt: "Structured academic programme",
              },
              {
                icon: Shield,
                title: "Trust Is Essential",
                description:
                  "Families, institutions, and participants place significant trust in the organisations they choose. We are committed to operating with professionalism, transparency, accountability, and integrity in everything we do.",
                accent: "cyan" as const,
                image: studentImages[8],
                imageAlt: "Professional trust and partnership",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white overflow-hidden border border-[var(--brand-border)] hover:border-[#F71C56] transition-all reveal"
                style={{
                  transitionDelay: `${index * 100}ms`,
                  clipPath:
                    "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                }}
              >
                <ImageWithFallback
                  src={item.image}
                  alt={item.imageAlt}
                  className="w-full h-40 object-cover"
                />
                <div className="p-8">
                  <BrandIcon
                    icon={item.icon}
                    size="lg"
                    accent={item.accent}
                    className="mb-6"
                  />
                  <h3 className="font-bold text-[20px] mb-4 text-[#0C0F3F]">
                    {item.title}
                  </h3>
                  <p className="text-[var(--brand-muted)] leading-7 text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Proverb callout */}
          <div
            className="mt-16 bg-[#0C0F3F] text-white p-12 text-center reveal mb-15no"
            style={{
              clipPath:
                "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
            }}
          >
            <p className="text-2xl sm:text-3xl font-bold italic leading-relaxed mb-4 text-white/95">
              "The person who has not traveled widely thinks their mother is the
              best cook."
            </p>
            <p className="text-[#88EFF2] uppercase tracking-[0.2em] text-sm font-bold mb-8">
              — Traditional African Proverb
            </p>
            <div className="inline-flex items-start gap-4 bg-[#F71C56] px-8 py-5 max-w-2xl text-left">
              <span className="text-2xl mt-0.5">💡</span>
              <div>
                <p className="font-bold text-white mb-1">The Truth</p>
                <p className="text-white/90 leading-6 text-sm">
                  True growth begins at the edge of your comfort zone. At
                  Cardinal Immersions, we take our participants beyond the
                  familiar to discover a world of diverse perspectives,
                  cultures, and life-changing insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section
        className="py-[120px] bg-[var(--brand-surface)] relative -mt-120 pt-40"
        style={{ clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-80">
          <div className="text-center mb-16 reveal">
            <span className="font-bold text-[#F71C56] uppercase tracking-[0.2em] mb-4 block">
              What We Do
            </span>
            <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em] text-[#0C0F3F]">
              Programmes for Every Journey
            </h2>
            <p className="text-lg text-[var(--brand-muted)] max-w-3xl mx-auto mt-6">
              Cardinal Immersions designs and coordinates structured
              international learning programmes for students, professionals, and
              institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                audience: "For Students",
                icon: BookOpen,
                accent: "red" as const,
                image: studentImages[9],
                imageAlt: "University students on campus abroad",
                tagline:
                  "Transformative global learning and cultural immersion experiences that expand academic and personal horizons.",
                programmes: [
                  "Academic and cultural exchange programmes",
                  "Study abroad programmes",
                  "Internships and volunteer placements abroad",
                  "Gap year programmes",
                  "Host family immersion programmes",
                  "Study tours and educational trips",
                  "Language immersion programmes",
                  "Cultural immersion journeys",
                  "Global exposure programmes",
                ],
                footer:
                  "These experiences help students develop international awareness, independence, and clarity about their future pathways.",
              },
              {
                audience: "For Professionals",
                icon: Target,
                accent: "blue" as const,
                image: studentImages[10],
                imageAlt: "Professionals in an international workshop",
                tagline:
                  "Career-focused international exposure programmes that connect professionals to global industry practices and leadership opportunities.",
                programmes: [
                  "Professional development immersions",
                  "Industry-focused international learning tours",
                  "Leadership development experiences",
                  "Executive exposure programmes",
                  "Cross-border knowledge exchange visits",
                  "Conference and sector immersion programmes",
                ],
                footer:
                  "These programmes are designed to sharpen expertise, broaden perspective, and strengthen global career positioning.",
              },
              {
                audience: "For Institutions",
                icon: Users,
                accent: "cyan" as const,
                image: studentImages[11],
                imageAlt: "University institution building",
                tagline:
                  "Supporting schools, universities, and organizations in building structured international mobility for their communities.",
                programmes: [
                  "Institutional exchange partnerships",
                  "Student and staff mobility initiatives",
                  "International study tours and delegations",
                  "Academic collaboration programmes",
                  "Cultural and educational exchange frameworks",
                  "Custom-designed global exposure programmes",
                ],
                footer:
                  "We work with institutions to design safe, structured, and outcome-driven international learning pathways aligned with their goals.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white border border-[var(--brand-border)] hover:border-[#F71C56] transition-all flex flex-col overflow-hidden reveal"
                style={{
                  transitionDelay: `${index * 100}ms`,
                  clipPath:
                    "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                }}
              >
                <ImageWithFallback
                  src={item.image}
                  alt={item.imageAlt}
                  className="w-full h-52 object-cover"
                />
                <div className="p-8 border-b border-[var(--brand-border)]">
                  <BrandIcon
                    icon={item.icon}
                    size="lg"
                    accent={item.accent}
                    className="mb-5"
                  />
                  <h3 className="font-bold text-[22px] text-[#0C0F3F] mb-3">
                    {item.audience}
                  </h3>
                  <p className="text-[var(--brand-muted)] leading-6 text-sm">
                    {item.tagline}
                  </p>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <p className="text-xs font-bold text-[#F71C56] uppercase tracking-[0.15em] mb-4">
                    Programmes Include
                  </p>
                  <ul className="space-y-2 flex-1">
                    {item.programmes.map((prog, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F71C56] flex-shrink-0 mt-2" />
                        <span className="text-[var(--brand-muted)] text-sm leading-6">
                          {prog}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[var(--brand-muted)] text-sm leading-6 mt-6 pt-6 border-t border-[var(--brand-border)] italic">
                    {item.footer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section
        className="py-[120px] bg-[var(--brand-surface-alt)] relative z-10"
        style={{ clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="hidden md:block reveal">
              <div className="grid grid-cols-2 gap-4 auto-rows-[120px]">
                {[
                  {
                    src: professionalImages[0],
                    alt: "Team collaboration",
                    className: "col-span-2 row-span-2",
                  },
                  {
                    src: professionalImages[1],
                    alt: "World map with connections",
                    className: "",
                  },
                  {
                    src: professionalImages[3],
                    alt: "Facilitated discussion",
                    className: "",
                  },
                  {
                    src: professionalImages[4],
                    alt: "Group planning session",
                    className: "col-span-2",
                  },
                ].map((image, index) => (
                  <div
                    key={image.alt}
                    className={`overflow-hidden shadow-lg ${image.className}`}
                    style={{
                      transitionDelay: `${index * 80}ms`,
                      clipPath:
                        "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                    }}
                  >
                    <ImageWithFallback
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8 reveal">
              <div>
                <span className="font-bold text-[#F71C56] uppercase tracking-[0.2em]">
                  Our Commitment
                </span>
                <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em] text-[#0C0F3F] mt-4">
                  Meaningful, Responsible, Transformative
                </h2>
              </div>

              <div className="space-y-6 text-[var(--brand-muted)] leading-7">
                <p>
                  We operate through a carefully selected network of educational
                  institutions, programme providers, industry organisations, and
                  local partners across multiple countries. This collaborative
                  model enables us to design experiences that are globally
                  connected, locally relevant, and consistently delivered.
                </p>
                <p>
                  From programme planning and participant preparation to
                  on-the-ground coordination and ongoing support, every stage of
                  the experience is managed with attention to quality,
                  communication, and participant wellbeing.
                </p>
                <p className="font-semibold text-[#0C0F3F]">
                  Our role is not simply to facilitate travel. Our role is to
                  design learning experiences that create lasting impact.
                </p>
                <p>
                  We continuously seek opportunities to strengthen programme
                  quality, expand access to international learning, and create
                  experiences that contribute to long-term personal, academic,
                  and professional growth.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                {[
                  { label: "Trust Is Essential", color: "bg-[#F71C56]" },
                  { label: "Professionalism", color: "bg-[#5A0DBD]" },
                  {
                    label: "Transparency & Accountability",
                    color: "bg-[#88EFF2]",
                  },
                  { label: "Integrity in Everything", color: "bg-[#F71C56]" },
                ].map((val, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${val.color}`}
                    />
                    <span className="font-bold text-[#0C0F3F]">
                      {val.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section
        className="py-[120px] bg-[var(--brand-surface)] relative -mt-16 pt-40"
        style={{ clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="text-center mb-16 reveal">
            <span className="font-bold text-[#F71C56] uppercase tracking-[0.2em] mb-4 block">
              Our Team
            </span>
            <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em] text-[#0C0F3F]">
              Meet the Team
            </h2>
            <p className="text-lg text-[var(--brand-muted)] max-w-3xl mx-auto mt-6">
              Our team brings together expertise in curriculum design,
              international education policy, institutional partnerships, and
              cross-border programme management.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {[
              {
                name: "Dr. Sarah Mensah",
                role: "Curriculum Design",
                image: professionalImages[2],
              },
              {
                name: "Prof. James Okonkwo",
                role: "International Policy",
                image: professionalImages[3],
              },
              {
                name: "Linda Adeyemi",
                role: "Partnership Strategy",
                image: professionalImages[4],
              },
              {
                name: "Dr. Michael Banda",
                role: "Programme Management",
                image: professionalImages[5],
              },
            ].map((member, index) => (
              <div
                key={index}
                className="reveal"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
                    }}
                  />
                  <div className="p-6">
                    <h4 className="font-bold text-xl text-[#0C0F3F] mb-2">
                      {member.name}
                    </h4>
                    <p className="text-[#F71C56] text-sm uppercase tracking-widest">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        className="py-[120px] bg-[#0C0F3F] text-white relative z-10 -mb-10"
        style={{ clipPath: "polygon(0 10%, 100% 0, 100% 100%, 0 100%)" }}
      >
        {/* Background decoration */}
        <div className="absolute bottom-10 right-[5%] opacity-20 pointer-events-none">
          <ImageWithFallback
            src={professionalImages[6]}
            alt="Study workspace"
            className="w-56 h-56 sm:w-72 sm:h-72 object-cover rounded-lg"
          />
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 text-center">
          <div className="max-w-3xl mx-auto space-y-8 reveal">
            <span className="font-bold text-[#88EFF2] uppercase tracking-[0.2em] text-sm block">
              Your Cardinal Moment
            </span>
            <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[56px] leading-[42px] sm:leading-[48px] md:leading-[64px] tracking-[-0.01em]">
              Your Cardinal Moment Begins Here
            </h2>
            <p className="text-xl leading-8 text-white/90">
              Every meaningful shift in direction begins with a decision to
              engage the world differently. Join structured international
              experiences designed to create those moments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <button className="bg-[#F71C56] text-white font-bold px-8 py-4 rounded transition-all hover:brightness-110 uppercase tracking-widest text-sm">
                View Programs
              </button>
              <button className="border-2 border-white text-white font-bold px-8 py-4 rounded hover:bg-white hover:text-[#0C0F3F] transition-all uppercase tracking-widest text-sm">
                Start Your Application
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
