import { useState, useEffect } from "react";
import { ImageWithFallback } from "../components/media/ImageWithFallback";
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  Linkedin,
  Twitter,
  Instagram,
  ChevronDown,
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    organization: "",
    inquiryType: "",
    message: "",
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted (placeholder):", formData);
    alert(
      "Thank you for your message. We will respond within 2-3 business days.",
    );
    setFormData({
      fullName: "",
      email: "",
      organization: "",
      inquiryType: "",
      message: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className="pt-[120px] pb-20 bg-[#0A1C3A] text-white relative overflow-hidden"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 78%, 0% 100%)" }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 opacity-[0.22] pointer-events-none">
          <svg className="w-full h-full animate-drift" viewBox="0 0 1440 800">
            <circle cx="200" cy="150" fill="#F71C56" r="4" />
            <circle cx="500" cy="250" fill="white" r="3" />
            <circle cx="800" cy="180" fill="#F71C56" r="3" />
            <circle cx="1100" cy="320" fill="white" r="4" />
            <circle cx="700" cy="500" fill="#F71C56" r="3" />
            <path
              className="animate-pulse-slow"
              d="M200 150 L500 250 M500 250 L800 180 M800 180 L1100 320 M1100 320 L700 500 M700 500 L200 150"
              fill="none"
              stroke="white"
              strokeWidth="1"
            />
          </svg>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 reveal active">
            <span className="font-bold text-[#ffb2b8] uppercase tracking-[0.2em] text-sm">
              Get in Touch
            </span>
            <h1 className="font-extrabold text-[36px] sm:text-[48px] md:text-[64px] leading-[42px] sm:leading-[56px] md:leading-[72px] tracking-[-0.02em] text-white">
              Contact <span className="text-[#F71C56]">Cardinal Immersions</span>
            </h1>
            <p className="text-xl leading-8 text-white/90 max-w-3xl mx-auto">
              Reach out with questions about our programs, partnership
              opportunities, or general inquiries.
            </p>
            <p className="text-sm text-white/70">
              We aim to respond to all messages within 2-3 business days.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form + Info Section */}
      {/* Added slanted divider for section rhythm; remove the clipPath to revert. */}
      <section
        className="py-[120px] bg-white relative -mt-16 pt-40"
        style={{ clipPath: "polygon(0 14%, 100% 0, 100% 86%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column: Contact Form */}
            <div className="reveal">
              <div
                className="bg-[#f7fafd] p-6 sm:p-8 lg:p-10 border border-[#e6bcbf]"
                style={{
                  clipPath:
                    "polygon(0 0, 98% 0, 100% 2%, 100% 100%, 2% 100%, 0 98%)",
                }}
              >
                <h2 className="font-bold text-[32px] sm:text-[36px] md:text-[40px] leading-[40px] sm:leading-[44px] md:leading-[48px] tracking-[-0.01em] text-[#0A1C3A] mb-8">
                  Send Us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-[#0A1C3A] mb-2"
                    >
                      Full Name <span className="text-[#F71C56]">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56] transition-colors"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[#0A1C3A] mb-2"
                    >
                      Email Address <span className="text-[#F71C56]">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56] transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="organization"
                      className="block text-[#0A1C3A] mb-2"
                    >
                      Organization / Institution
                    </label>
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56] transition-colors"
                      placeholder="Your institution (optional)"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="inquiryType"
                      className="block text-[#0A1C3A] mb-2"
                    >
                      Inquiry Type <span className="text-[#F71C56]">*</span>
                    </label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56] transition-colors"
                    >
                      <option value="">Select an option</option>
                      <option value="programs">
                        Programs for Students or Professionals
                      </option>
                      <option value="partnership">
                        Institutional Partnership
                      </option>
                      <option value="general">General Question</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-[#0A1C3A] mb-2"
                    >
                      Message <span className="text-[#F71C56]">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-white border border-[#cbcdd1] rounded focus:outline-none focus:border-[#F71C56] transition-colors resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#F71C56] text-white font-bold px-8 py-4 rounded transition-all hover:brightness-110 uppercase tracking-widest text-sm"
                  >
                    Send Message
                  </button>

                  <p className="text-xs text-[#737576] leading-5">
                    We do not share your information with third parties. By
                    submitting, you agree to our privacy policy (placeholder).
                  </p>
                </form>
              </div>
            </div>

            {/* Right Column: Contact Information */}
            <div
              className="space-y-8 reveal"
              style={{ transitionDelay: "200ms" }}
            >
              <div>
                <h2 className="font-bold text-[32px] leading-[40px] tracking-[-0.01em] text-[#0A1C3A] mb-8">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#F71C56] bg-opacity-10 flex items-center justify-center rounded">
                      <Mail className="w-5 h-5 text-[#F71C56]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#0A1C3A] mb-2">
                        General Inquiries
                      </h4>
                      <a
                        href="mailto:hello@andylcc.com"
                        className="text-[#F71C56] hover:underline"
                      >
                        hello@andylcc.com
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#F71C56] bg-opacity-10 flex items-center justify-center rounded">
                      <Mail className="w-5 h-5 text-[#F71C56]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#0A1C3A] mb-2">
                        Partnerships Team
                      </h4>
                      <a
                        href="mailto:partnerships@andylcc.com"
                        className="text-[#F71C56] hover:underline"
                      >
                        partnerships@andylcc.com
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#F71C56] bg-opacity-10 flex items-center justify-center rounded">
                      <Mail className="w-5 h-5 text-[#F71C56]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#0A1C3A] mb-2">
                        Programs Team
                      </h4>
                      <a
                        href="mailto:programs@andylcc.com"
                        className="text-[#F71C56] hover:underline"
                      >
                        programs@andylcc.com
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#F71C56] bg-opacity-10 flex items-center justify-center rounded">
                      <Phone className="w-5 h-5 text-[#F71C56]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#0A1C3A] mb-2">
                        Phone
                      </h4>
                      <a href="tel:+442012345678" className="text-[#737576]">
                        +44 (0) 20 1234 5678
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#F71C56] bg-opacity-10 flex items-center justify-center rounded">
                      <Clock className="w-5 h-5 text-[#F71C56]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#0A1C3A] mb-2">
                        Office Hours
                      </h4>
                      <p className="text-[#737576]">
                        Monday-Friday, 9:00-17:00 GMT
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#F71C56] bg-opacity-10 flex items-center justify-center rounded">
                      <MapPin className="w-5 h-5 text-[#F71C56]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#0A1C3A] mb-2">
                        Physical Address
                      </h4>
                      <p className="text-[#737576] leading-7">
                        Cardinal Immersions
                        <br />
                        International Learning Mobility
                        <br />
                        Accra, Ghana / London, UK
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-[#f7fafd] border-l-4 border-[#F71C56]">
                  <p className="text-sm text-[#737576] italic">
                    We are an African-founded organization with a global reach.
                  </p>
                </div>
              </div>

              {/* Professional Image */}
              <div className="hidden lg:block">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1622675363311-3e1904dc1885?w=1080&q=80"
                  alt="Professional team collaboration"
                  className="w-full h-64 object-cover shadow-lg grayscale hover:grayscale-0 transition-all duration-700"
                  style={{
                    clipPath:
                      "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {/* Added slanted divider for section rhythm; remove the clipPath to revert. */}
      <section
        className="py-[120px] bg-[#f7fafd] relative -mt-16 pt-40"
        style={{ clipPath: "polygon(0 14%, 100% 0, 100% 86%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="reveal">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <span className="font-bold text-[#F71C56] uppercase tracking-[0.2em] mb-2 block text-sm">
                  Location
                </span>
                <h2 className="font-bold text-[32px] sm:text-[40px] leading-[40px] sm:leading-[48px] tracking-[-0.01em] text-[#0A1C3A]">
                  Primary Coordination Hub
                </h2>
              </div>
              <p className="text-[#737576] max-w-xl">
                We are not publishing a street-level office address yet. This map shows our current
                coordination base in Accra, Ghana.
              </p>
            </div>

            <div
              className="bg-white border border-[#cbcdd1] overflow-hidden shadow-lg"
              style={{ clipPath: "polygon(0 0, 98% 0, 100% 2%, 100% 100%, 2% 100%, 0 98%)" }}
            >
              <iframe
                title="Accra, Ghana map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-0.235%2C5.55%2C-0.14%2C5.66&layer=mapnik&marker=5.6037%2C-0.1870"
                className="w-full h-[320px] md:h-[420px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="flex items-center justify-between gap-4 px-5 py-4 bg-[#f7fafd] border-t border-[#e6bcbf]">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#F71C56]" />
                  <p className="text-sm text-[#0A1C3A] font-bold">Accra, Ghana</p>
                </div>
                <p className="text-xs text-[#737576]">
                  Map shown for the current coordination hub.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      {/* Added slanted divider for section rhythm; remove the clipPath to revert. */}
      <section
        className="py-[120px] bg-white relative -mt-16 pt-40"
        style={{ clipPath: "polygon(0 14%, 100% 0, 100% 86%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 text-center">
          <div className="reveal">
            <h2 className="font-bold text-[32px] leading-[40px] tracking-[-0.01em] text-[#0A1C3A] mb-4">
              Follow Us for Updates
            </h2>
            <p className="text-lg text-[#737576] mb-8">
              Stay connected for updates on programs and partnerships.
            </p>

            <div className="flex gap-6 justify-center">
              <a
                href="#"
                className="w-14 h-14 bg-[#0A1C3A] flex items-center justify-center rounded-full hover:bg-[#F71C56] transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6 text-white" />
              </a>
              <a
                href="#"
                className="w-14 h-14 bg-[#0A1C3A] flex items-center justify-center rounded-full hover:bg-[#F71C56] transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-6 h-6 text-white" />
              </a>
              <a
                href="#"
                className="w-14 h-14 bg-[#0A1C3A] flex items-center justify-center rounded-full hover:bg-[#F71C56] transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6 text-white" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {/* Added slanted divider for section rhythm; remove the clipPath to revert. */}
      <section
        className="py-[120px] bg-[#f7fafd] relative -mt-16 pt-40"
        style={{ clipPath: "polygon(0 14%, 100% 0, 100% 86%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="text-center mb-16 reveal">
            <span className="font-bold text-[#F71C56] uppercase tracking-[0.2em] mb-4 block">
              Frequently Asked Questions
            </span>
            <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em] text-[#0A1C3A]">
              Common Questions About Contacting Us
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "How quickly can I expect a response?",
                answer:
                  "We aim to reply within 2-3 business days. For partnership inquiries, we may take a little longer to prepare a thoughtful response.",
              },
              {
                question: "Can I schedule a call with the team?",
                answer:
                  "Yes. After you submit an inquiry, a team member will reach out to schedule a brief call if needed.",
              },
              {
                question: "Do you have offices in multiple countries?",
                answer:
                  "Our team works across time zones. Our primary coordination hubs are in Accra, Ghana and London, UK (placeholders).",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-[#e6bcbf] overflow-hidden reveal"
                style={{
                  transitionDelay: `${index * 100}ms`,
                  clipPath:
                    "polygon(0 0, 98% 0, 100% 2%, 100% 100%, 2% 100%, 0 98%)",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-8 py-6 flex justify-between items-center text-left hover:bg-[#f7fafd] transition-colors"
                >
                  <span className="font-bold text-lg text-[#0A1C3A]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#F71C56] transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
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

    </>
  );
}





