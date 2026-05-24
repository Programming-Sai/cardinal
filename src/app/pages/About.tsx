import { useEffect } from "react";
import { ImageWithFallback } from "../components/media/ImageWithFallback";
import BrandIcon from "../components/brand/BrandIcon";
import { BookOpen, Handshake, Target } from "lucide-react";

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
        className="pt-[120px] pb-20 bg-white relative overflow-hidden"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 0% 100%)" }}
      >
        {/* Animated Connectivity Background */}
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

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 reveal active">
            <span className="font-bold text-[#F71C56] uppercase tracking-[0.2em] text-sm">
              About Cardinal Immersions
            </span>
            <h1 className="font-extrabold text-[36px] sm:text-[48px] md:text-[64px] leading-[42px] sm:leading-[56px] md:leading-[72px] tracking-[-0.02em] text-[#0A1C3A]">
              Building Bridges Between{" "}
              <span className="text-[#F71C56]">Education and Experience</span>
            </h1>
            <p className="text-xl leading-8 text-[#737576] max-w-3xl mx-auto">
              We are an African-founded organization dedicated to reimagining
              international learning mobility as a rigorous, outcomes-driven
              practice that transforms students, professionals, and
              institutions.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section
        className="py-[120px] bg-[#0A1C3A] text-white relative -mt-16 z-20"
        style={{ clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 reveal">
              <span className="font-bold text-[#ffb2b8] uppercase tracking-[0.2em]">
                Our Story
              </span>
              <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em]">
                Founded on a Vision for Excellence
              </h2>
              <div className="space-y-4 text-lg leading-7 text-white/90">
                <p>
                  Cardinal Immersions was founded with a clear conviction:
                  international learning mobility should be distinguished by
                  academic rigor, measurable outcomes, and genuine
                  cross-cultural competence, not vacation itineraries disguised
                  as education.
                </p>
                <p>
                  We emerged from a recognition that African talent deserves
                  pathways to global learning that are built on institutional
                  credibility, not transactional tourism. At the same time, we
                  believe Africa must be positioned as a destination for
                  high-quality international exchange, not merely a source of
                  outbound participants.
                </p>
                <p>
                  Since our founding, we have designed programs that integrate
                  directly with university curricula, align with professional
                  development frameworks, and create institutional partnerships
                  rooted in mutual capacity building.
                </p>
              </div>
            </div>

            <div className="reveal">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1080&q=80"
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

      {/* Our Approach */}
      {/* Added slanted divider for section rhythm; remove the clipPath to revert. */}
      <section
        className="py-[120px] bg-[#f7fafd] relative -mt-20 pt-40"
        style={{ clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="text-center mb-16 reveal">
            <span className="font-bold text-[#F71C56] uppercase tracking-[0.2em] mb-4 block">
              Our Approach
            </span>
            <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em] text-[#0A1C3A]">
              How We Design for Impact
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Academic Integration",
                description:
                  "Every program aligns with formal learning outcomes, accreditation standards, and institutional curricula. We ensure that participation translates to tangible academic credit and recognized credentials.",
              },
              {
                icon: Target,
                title: "Outcomes-Driven Design",
                description:
                  "We measure success through pre-defined competencies, assessments, and post-program evaluations. Our participants leave with documented skills, not just travel memories.",
              },
              {
                icon: Handshake,
                title: "Institutional Partnerships",
                description:
                  "We build long-term relationships with universities and organizations, ensuring that programs are co-designed, mutually beneficial, and sustainable across cohorts.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 border border-[#e6bcbf] hover:border-[#F71C56] transition-all reveal"
                style={{
                  transitionDelay: `${index * 100}ms`,
                  clipPath:
                    "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                }}
              >
                <BrandIcon icon={item.icon} size="lg" className="mb-6" />
                <h3 className="font-bold text-[24px] mb-4 text-[#0A1C3A]">
                  {item.title}
                </h3>
                <p className="text-[#737576] leading-7">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team & Expertise */}
      <section
        className="py-[120px] bg-[#f1f4f7] relative z-10"
        style={{ clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)" }}
      >
        {/* Background decoration - teamwork */}
        <div className="absolute top-20 right-[3%] opacity-5 pointer-events-none">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1758691737492-48e8fdd336f7?w=600&q=80"
            alt="Teamwork"
            className="w-64 h-64 sm:w-80 sm:h-80 object-cover rounded-full"
          />
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="text-center mb-16 reveal">
            <span className="font-bold text-[#F71C56] uppercase tracking-[0.2em] mb-4 block">
              Our Team
            </span>
            <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em] text-[#0A1C3A]">
              Built by Experts in Education & Exchange
            </h2>
            <p className="text-lg text-[#737576] max-w-3xl mx-auto mt-6">
              Our team brings together expertise in curriculum design,
              international education policy, institutional partnerships, and
              cross-border program management.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
            {[
              {
                name: "Dr. Sarah Mensah",
                role: "Curriculum Design",
                image:
                  "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=400&q=80",
              },
              {
                name: "Prof. James Okonkwo",
                role: "International Policy",
                image:
                  "https://images.unsplash.com/photo-1739292774739-ee38cd9a5735?w=400&q=80",
              },
              {
                name: "Linda Adeyemi",
                role: "Partnership Strategy",
                image:
                  "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=80",
              },
              {
                name: "Dr. Michael Banda",
                role: "Program Management",
                image:
                  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80",
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
                    <h4 className="font-bold text-xl text-[#0A1C3A] mb-2">
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

      {/* Values */}
      {/* Added slanted divider for section rhythm; remove the clipPath to revert. */}
      <section
        className="py-[120px] bg-[#f7fafd] relative -mt-16 pt-40"
        style={{ clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="hidden md:block reveal">
              <div className="grid grid-cols-2 gap-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1530099486328-e021101a494a?w=1080&q=80"
                  alt="Team collaboration"
                  className="w-full h-72 object-cover shadow-lg"
                  style={{
                    clipPath:
                      "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                  }}
                />
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=1080&q=80"
                  alt="World map with connections"
                  className="w-full h-72 object-cover shadow-lg mt-12"
                  style={{
                    clipPath:
                      "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                  }}
                />
              </div>
            </div>

            <div className="space-y-8 reveal">
              <div>
                <span className="font-bold text-[#F71C56] uppercase tracking-[0.2em]">
                  Our Values
                </span>
                <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em] text-[#0A1C3A] mt-4">
                  Principles That Guide Us
                </h2>
              </div>

              <div className="space-y-6">
                {[
                  {
                    title: "Academic Rigor",
                    description:
                      "We refuse to compromise on learning outcomes, assessment standards, or institutional credibility.",
                  },
                  {
                    title: "Institutional Respect",
                    description:
                      "We treat our partners as equals, building relationships based on mutual capacity development.",
                  },
                  {
                    title: "Cultural Intelligence",
                    description:
                      "We design for genuine cross-cultural competence, not superficial exposure or tourism.",
                  },
                  {
                    title: "African Leadership",
                    description:
                      "We position Africa as both a source of talent and a destination for high-quality international learning.",
                  },
                  {
                    title: "Transparency",
                    description:
                      "We communicate clearly about costs, outcomes, and expectationsâ€”no hidden agendas or inflated promises.",
                  },
                ].map((value, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-2 h-2 bg-[#F71C56] rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-bold text-xl text-[#0A1C3A] mb-2">
                        {value.title}
                      </h4>
                      <p className="text-[#737576]">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        className="py-[120px] bg-[#0A1C3A] text-white relative z-10 -mb-10"
        style={{ clipPath: "polygon(0 10%, 100% 0, 100% 100%, 0 100%)" }}
      >
        {/* Background decoration - study workspace */}
        <div className="absolute bottom-10 right-[5%] opacity-20 pointer-events-none">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1581464647110-26e129ce2d02?w=500&q=80"
            alt="Study workspace"
            className="w-56 h-56 sm:w-72 sm:h-72 object-cover rounded-lg"
          />
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 text-center">
          <div className="max-w-3xl mx-auto space-y-8 reveal">
            <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em]">
              Ready to Build a Partnership?
            </h2>
            <p className="text-xl leading-8 text-white/90">
              Whether you're a university seeking to establish a mobility
              framework, an institution looking for credible exchange partners,
              or a professional organization designing international development
              programsâ€”we're here to collaborate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <button className="bg-[#F71C56] text-white font-bold px-8 py-4 rounded transition-all hover:brightness-110 uppercase tracking-widest text-sm">
                Contact Us
              </button>
              <button className="border-2 border-white text-white font-bold px-8 py-4 rounded hover:bg-white hover:text-[#0A1C3A] transition-all uppercase tracking-widest text-sm">
                View Programs
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}







