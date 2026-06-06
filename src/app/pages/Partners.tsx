import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/media/ImageWithFallback";
import BrandIcon from "../components/brand/BrandIcon";
import {
  institutionalImages,
  professionalImages,
  studentImages,
} from "../utils/localImages";
import {
  Compass,
  FileText,
  Globe,
  Handshake,
  MessageSquareQuote,
  Rocket,
  UsersRound,
} from "lucide-react";

export default function Partners() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.1 },
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const collaborationModels = [
    {
      icon: Handshake,
      title: "Institutional Partnership",
      description:
        "Co-design student or faculty mobility programs. We handle structure, logistics, and learning outcomes while your institution provides participants and academic alignment.",
      bullets: [
        "Custom scope and delivery plan",
        "Academic and operational support",
        "Best for long-term collaboration",
      ],
      cta: {
        label: "View partnership details",
        to: "/programs/institutional-partnerships",
      },
      image: institutionalImages[0],
      alt: "Business handshake partnership",
    },
    {
      icon: UsersRound,
      title: "Faculty Exchange & Capacity Building",
      description:
        "Enable faculty to lead or participate in cross-border teaching exchanges, research collaborations, and professional development programs.",
      bullets: [
        "Short discovery call and scope review",
        "Delivery model aligned to your calendar",
        "Best for staff development and exchange",
      ],
      cta: { label: "Start a conversation", to: "/contact?topic=partnerships" },
      image: professionalImages[1],
      alt: "Educators in workshop",
    },
    {
      icon: Globe,
      title: "Destination Partnership",
      description:
        "Position your institution as a host for international learners. We bring structured programs to your location and position Africa as a dynamic learning destination.",
      bullets: [
        "Host location and experience design",
        "Useful for visitor or cohort-based activations",
        "Best for institutions that want visibility",
      ],
      cta: { label: "Partner with us", to: "/apply?tab=institutional" },
      image: studentImages[18],
      alt: "Modern African cityscape",
    },
  ];

  const proofItems = [
    { label: "Result", value: "Higher confidence in the program" },
    { label: "Output", value: "Clear participant reflections" },
    { label: "Alignment", value: "Academic objectives first" },
    { label: "Support", value: "Logistics handled end-to-end" },
  ];

  const faqItems = [
    {
      question: "What kinds of institutions do you work with?",
      answer:
        "We work with universities, professional bodies, and organizations that want structured international learning experiences with clear outcomes.",
    },
    {
      question: "Do you support custom partnership models?",
      answer:
        "Yes. We can design institutional, faculty exchange, or destination-based models depending on your audience and objectives.",
    },
    {
      question: "Can we start with a small pilot?",
      answer:
        "Absolutely. A pilot is often the best way to align expectations, test logistics, and build confidence before a larger cohort.",
    },
    {
      question: "How do we begin?",
      answer:
        "Use the partnership inquiry flow or contact us directly. We will review your goals, scope, and timing, then recommend the right model.",
    },
  ];

  return (
    <>
      {/* I. Hero */}
      <section
        className="pt-[120px] pb-16 bg-[var(--brand-navy)] text-white relative overflow-hidden"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 0% 100%)" }}
      >
        <div className="absolute inset-0 z-0 opacity-[0.22] pointer-events-none">
          <ImageWithFallback
            src={institutionalImages[1]}
            alt="Abstract network connections"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-navy)]/35 via-[var(--brand-blue)]/10 to-[var(--brand-cyan)]/20" />
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
          <div className="max-w-4xl space-y-6 reveal active">
            <h1 className="font-extrabold text-[36px] sm:text-[48px] md:text-[64px] leading-[42px] sm:leading-[56px] md:leading-[72px] tracking-[-0.02em]">
              Partner With Cardinal Immersions
            </h1>
            <p className="text-2xl leading-relaxed text-white/90">
              Collaborate to design structured, cross-border learning
              experiences that build institutional capacity and enable knowledge
              exchange.
            </p>
            <p className="text-lg text-white/80 border-l-4 border-[var(--brand-red)] pl-6">
              We work with universities, professional bodies, and organizations
              worldwide, with a special focus on positioning Africa as a
              destination for high-quality international learning.
            </p>
          </div>
        </div>
      </section>

      {/* II. Why Partner With Us */}
      <section
        className="py-[120px] bg-[var(--brand-surface)] relative -mt-8 z-10"
        style={{ clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 reveal">
              <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em] text-[var(--brand-navy)]">
                Why Partner With Us
              </h2>
              <p className="text-xl leading-8 text-[var(--brand-muted)]">
                Cardinal Immersions enables meaningful international learning
                mobility that contributes to individual growth, institutional
                capacity, and cross-border knowledge exchange. By partnering
                with us, your institution gains structured programs, expert
                facilitation, and a platform that respects academic rigor and
                cultural intelligence.
              </p>
            </div>

            <div className="reveal">
              <ImageWithFallback
                src={professionalImages[2]}
                alt="Diverse educators in collaborative meeting"
                className="w-full h-[400px] object-cover shadow-2xl"
                style={{
                  clipPath:
                    "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* III. Partnership Models */}
      <section
        className="py-[120px] bg-white relative -mt-8 z-20"
        style={{ clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-30">
          <div className="text-center mb-16 reveal">
            <span className="font-bold text-[var(--brand-red)] uppercase tracking-[0.2em] mb-4 block">
              Partnership Models
            </span>
            <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em] text-[var(--brand-navy)]">
              How We Collaborate
            </h2>
            <p className="text-lg text-[var(--brand-muted)] max-w-3xl mx-auto mt-4">
              Choose the model that fits your institution, your audience, and
              the level of support you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {collaborationModels.map((model, index) => (
              <div
                key={model.title}
                className="group bg-white border border-[var(--brand-border)] overflow-hidden hover:shadow-2xl hover:border-[var(--brand-red)] transition-all duration-500 reveal"
                style={{
                  clipPath:
                    "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <ImageWithFallback
                  src={model.image}
                  alt={model.alt}
                  className="w-full h-48 object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="p-8 space-y-4">
                  <BrandIcon
                    icon={model.icon}
                    size="lg"
                    accent={index === 0 ? "blue" : index === 1 ? "cyan" : "red"}
                  />
                  <h3 className="font-bold text-[28px] text-[var(--brand-navy)]">
                    {model.title}
                  </h3>
                  <p className="text-[var(--brand-muted)] leading-7">
                    {model.description}
                  </p>
                  <ul className="space-y-2 text-sm text-[var(--brand-muted)]">
                    {model.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <Link
                    to={model.cta.to}
                    className="inline-flex items-center justify-center w-full bg-[var(--brand-red)] text-white font-bold px-6 py-3 rounded hover:brightness-110 transition-all uppercase tracking-widest text-sm"
                  >
                    {model.cta.label}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IV. Current Partners */}
      <section
        className="py-[120px] bg-[var(--brand-surface-alt)] relative -mt-16 pt-32"
        style={{ clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="text-center mb-12 reveal">
            <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em] text-[var(--brand-navy)] mb-6">
              Trusted by Organizations Worldwide
            </h2>
            <p className="text-lg text-[var(--brand-muted)] max-w-3xl mx-auto">
              We are building a network of forward-thinking institutions. Here
              are some of our current and past collaborators.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 reveal">
            {[
              "University of Nairobi",
              "Accra Technical University",
              "Global Education Network",
              "London School of Business",
              "Cape Town Institute",
              "East African Universities Alliance",
              "International Learning Consortium",
              "African Academic Exchange",
            ].map((partner) => (
              <div
                key={partner}
                className="bg-[var(--brand-neutral)] h-32 flex items-center justify-center text-center p-4 opacity-70 hover:opacity-100 hover:bg-white transition-all cursor-default border border-[var(--brand-border)]"
                style={{
                  clipPath:
                    "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                }}
              >
                <span className="font-bold text-sm text-[var(--brand-navy)] uppercase tracking-wider">
                  {partner}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* V. What Partners Say */}
      <section
        className="py-[120px] bg-[var(--brand-surface)] relative -mt-8"
        style={{ clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="text-center mb-16 reveal">
            <span className="font-bold text-[var(--brand-red)] uppercase tracking-[0.2em] mb-4 block">
              Testimonials
            </span>
            <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em] text-[var(--brand-navy)]">
              What Partners Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className="bg-white p-8 border border-[var(--brand-border)] hover:border-[var(--brand-red)] transition-all reveal"
              style={{
                maskImage:
                  "radial-gradient(circle 40px at 0 0, transparent 0, transparent 40px, black 41px)",
                WebkitMaskImage:
                  "radial-gradient(circle 40px at 0 0, transparent 0, transparent 40px, black 41px)",
              }}
            >
              <div className="flex items-start gap-6 mb-6">
                <ImageWithFallback
                  src={professionalImages[3]}
                  alt="Dr. Sarah Omondi"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-xl text-[var(--brand-navy)]">
                    Dr. Sarah Omondi
                  </h4>
                  <p className="text-sm text-[var(--brand-red)]">
                    Director of International Programs
                  </p>
                  <p className="text-sm text-[var(--brand-muted)]">
                    University of Nairobi
                  </p>
                </div>
              </div>
              <p className="text-lg italic text-[var(--brand-muted)] leading-7">
                Cardinal Immersions brought structure and intentionality to our
                student mobility program. Their focus on learning outcomes, not
                tourism, aligned perfectly with our university&apos;s mission.
              </p>
            </div>

            <div
              className="bg-white p-8 border border-[var(--brand-border)] hover:border-[var(--brand-red)] transition-all reveal"
              style={{
                transitionDelay: "100ms",
                maskImage:
                  "radial-gradient(circle 40px at 100% 100%, transparent 0, transparent 40px, black 41px)",
                WebkitMaskImage:
                  "radial-gradient(circle 40px at 100% 100%, transparent 0, transparent 40px, black 41px)",
              }}
            >
              <div className="flex items-start gap-6 mb-6">
                <ImageWithFallback
                  src={professionalImages[4]}
                  alt="Prof. James Mensah"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-xl text-[var(--brand-navy)]">
                    Prof. James Mensah
                  </h4>
                  <p className="text-sm text-[var(--brand-red)]">
                    Dean of Global Engagement
                  </p>
                  <p className="text-sm text-[var(--brand-muted)]">
                    Accra Technical University
                  </p>
                </div>
              </div>
              <p className="text-lg italic text-[var(--brand-muted)] leading-7">
                The faculty exchange program designed by Cardinal Immersions was
                rigorous and mutually beneficial. Our staff returned with new
                teaching methods and cross-cultural competencies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VI. Partnership Proof */}
      <section
        className="py-[120px] bg-white relative -mt-8 z-10"
        style={{ clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-30">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-12 items-start">
            <div className="bg-[var(--brand-navy)] text-white p-10 shadow-2xl">
              <p className="font-bold uppercase tracking-[0.2em] text-[var(--brand-red-soft)] mb-4">
                Case Study
              </p>
              <h2 className="font-bold text-[32px] sm:text-[36px] md:text-[40px] leading-[40px] sm:leading-[44px] md:leading-[48px] mb-6">
                A partnership should feel measurable.
              </h2>
              <p className="text-white/80 leading-8 mb-8">
                A university partner wanted a mobility experience that felt
                academically credible rather than tourist-led. We aligned the
                itinerary to learning objectives, built structured reflection,
                and coordinated logistics so the academic team could stay
                focused on outcomes.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {proofItems.map((item) => (
                  <div key={item.label} className="bg-white/10 p-4">
                    <p className="text-[var(--brand-red-soft)] text-sm uppercase tracking-widest mb-1">
                      {item.label}
                    </p>
                    <p className="font-bold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: Compass,
                    title: "Strategic Fit",
                    text: "Every partnership starts with clear goals and scope.",
                  },
                  {
                    icon: FileText,
                    title: "Tangible Outputs",
                    text: "Outcomes are documented and easy to share internally.",
                  },
                  {
                    icon: Rocket,
                    title: "Momentum",
                    text: "We help you launch without overcomplicating the process.",
                  },
                  {
                    icon: MessageSquareQuote,
                    title: "Clear Communication",
                    text: "Expect concise updates and a direct point of contact.",
                  },
                ].map((item, index) => (
                  <div
                    key={item.title}
                    className="bg-[var(--brand-surface)] border border-[var(--brand-border)] p-6"
                  >
                    <BrandIcon
                      icon={item.icon}
                      size="lg"
                      accent={index % 2 === 0 ? "blue" : "cyan"}
                      className="mb-4"
                    />
                    <h3 className="font-bold text-[var(--brand-navy)] text-xl mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[var(--brand-muted)] leading-7">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VII. FAQ */}
      <section
        className="py-[120px] bg-[var(--brand-surface-alt)] relative -mt-8 pt-32"
        style={{ clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="text-center mb-16 reveal">
            <span className="font-bold text-[var(--brand-blue)] uppercase tracking-[0.2em] mb-4 block">
              FAQ
            </span>
            <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em] text-[var(--brand-navy)]">
              Partnership Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4 reveal">
            {faqItems.map((faq, index) => (
              <div
                key={faq.question}
                className="bg-white border border-[var(--brand-border)] overflow-hidden transition-all"
                style={{
                  clipPath:
                    "polygon(0 0, 99% 0, 100% 1%, 100% 100%, 1% 100%, 0 99%)",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-8 py-6 flex justify-between items-center gap-6 hover:bg-[var(--brand-surface)] transition-colors"
                >
                  <span className="font-bold text-lg text-[var(--brand-navy)] text-left">
                    {faq.question}
                  </span>
                  <span className="text-[var(--brand-cyan)] text-2xl">
                    {openFaq === index ? "-" : "+"}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-8 pb-6">
                    <p className="text-[var(--brand-muted)] leading-7">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIII. Call to Action */}
      <section
        className="py-[120px] bg-[var(--brand-navy)] text-white relative z-10 -mb-10"
        style={{ clipPath: "polygon(0 10%, 100% 0, 100% 100%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 text-center">
          <div className="max-w-3xl mx-auto space-y-8 reveal">
            <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em]">
              Ready to design the right partnership?
            </h2>
            <p className="text-xl leading-8 text-white/90">
              Whether you are creating a pilot, a faculty exchange, or a
              destination partnership, we can help shape the structure and the
              experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link
                to="/contact"
                className="bg-[var(--brand-red)] text-white font-bold px-8 py-4 rounded transition-all hover:brightness-110 uppercase tracking-widest text-sm"
              >
                Contact Us
              </Link>
              <Link
                to="/apply?tab=institutional"
                className="border-2 border-white text-white font-bold px-8 py-4 rounded hover:bg-white hover:text-[var(--brand-navy)] transition-all uppercase tracking-widest text-sm"
              >
                Request Partnership Brief
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
