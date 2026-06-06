import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { ImageWithFallback } from "../components/media/ImageWithFallback";
import {
  FileText,
  Users,
  CheckCircle,
  Globe,
  ChevronDown,
  Check,
} from "lucide-react";
import { apiRequest } from "../utils/api";
import { fetchPrograms, type Program } from "../utils/programApi";
import { studentImages } from "../utils/localImages";

type TabType = "individual" | "institutional";
type ToastType = "success" | "error" | "warning";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const DRAFT_STORAGE_KEY = "andylcc-apply-draft";
const ACTIVE_TAB_KEY = "andylcc-apply-active-tab";

const defaultIndividualForm = {
  programInterest: "",
  specificProgram: "",
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  institution: "",
  country: "",
  motivation: "",
  heardAbout: "",
};

const defaultInstitutionalForm = {
  organizationName: "",
  organizationType: "",
  organizationCountry: "",
  website: "",
  contactName: "",
  contactTitle: "",
  contactEmail: "",
  contactPhone: "",
  interests: [] as string[],
  cohortSize: "",
  timeline: "",
  additionalInfo: "",
};

export default function Apply() {
  const currentYear = new Date().getFullYear();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>("individual");
  const [availablePrograms, setAvailablePrograms] = useState<Program[]>([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"individual" | "institutional">(
    "individual",
  );
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastIdCounter, setToastIdCounter] = useState(0);
  const [submissionRef, setSubmissionRef] = useState<string | null>(null);

  // Individual form state
  const [individualForm, setIndividualForm] = useState(defaultIndividualForm);

  // Institutional form state
  const [institutionalForm, setInstitutionalForm] = useState(
    defaultInstitutionalForm,
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

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
  }, [availablePrograms]);

  useEffect(() => {
    let cancelled = false;

    const loadPrograms = async () => {
      try {
        setIsLoadingPrograms(true);
        const data = await fetchPrograms();
        if (!cancelled) {
          setAvailablePrograms(data);
        }
      } catch (error) {
        console.error("Failed to load programs:", error);
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

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "individual" || tabParam === "institutional") {
      setActiveTab(tabParam);
      return;
    }

    const savedTab = window.localStorage.getItem(ACTIVE_TAB_KEY);
    if (savedTab === "individual" || savedTab === "institutional") {
      setActiveTab(savedTab);
    }
  }, [searchParams]);

  useEffect(() => {
    const draftValue = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!draftValue) return;

    try {
      const parsed = JSON.parse(draftValue) as {
        activeTab?: TabType;
        individualForm?: typeof defaultIndividualForm;
        institutionalForm?: typeof defaultInstitutionalForm;
      };

      if (
        parsed.activeTab === "individual" ||
        parsed.activeTab === "institutional"
      ) {
        setActiveTab(parsed.activeTab);
      }
      if (parsed.individualForm) {
        setIndividualForm((prev) => ({ ...prev, ...parsed.individualForm }));
      }
      if (parsed.institutionalForm) {
        setInstitutionalForm((prev) => ({
          ...prev,
          ...parsed.institutionalForm,
        }));
      }
    } catch {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(ACTIVE_TAB_KEY, activeTab);
    window.localStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({ activeTab, individualForm, institutionalForm }),
    );
  }, [activeTab, individualForm, institutionalForm]);

  useEffect(() => {
    const programSlug = searchParams.get("program");
    if (!programSlug || availablePrograms.length === 0) return;

    const matchedProgram = availablePrograms.find(
      (program) => program.slug === programSlug,
    );
    if (!matchedProgram) return;

    setActiveTab(
      matchedProgram.category === "institutional"
        ? "institutional"
        : "individual",
    );
    if (matchedProgram.category === "student") {
      setIndividualForm((prev) => ({
        ...prev,
        programInterest: "student",
        specificProgram: matchedProgram.slug,
      }));
    }
    if (matchedProgram.category === "professional") {
      setIndividualForm((prev) => ({
        ...prev,
        programInterest: "professional",
        specificProgram: matchedProgram.slug,
      }));
    }
  }, [searchParams, availablePrograms]);

  const showToast = (message: string, type: ToastType) => {
    const newToast: Toast = {
      id: toastIdCounter,
      message,
      type,
    };
    setToastIdCounter((prev) => prev + 1);
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  };

  const resetDraft = () => {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    window.localStorage.removeItem(ACTIVE_TAB_KEY);
  };

  const clearIndividualForm = () => {
    setIndividualForm(defaultIndividualForm);
    setErrors({});
    setSubmissionRef(null);
    resetDraft();
  };

  const clearInstitutionalForm = () => {
    setInstitutionalForm(defaultInstitutionalForm);
    setErrors({});
    setSubmissionRef(null);
    resetDraft();
  };

  const createSubmissionRef = (prefix: string) => {
    const stamp = new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, "")
      .slice(0, 12);
    return `${prefix}-${stamp}`;
  };

  const handleIndividualChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setIndividualForm((prev) => {
      const next = {
        ...prev,
        [e.target.name]: e.target.value,
      };

      if (e.target.name === "programInterest") {
        next.specificProgram = "";
      }

      return next;
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[e.target.name];
        return newErrors;
      });
    }
  };

  const handleInstitutionalChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setInstitutionalForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errors[e.target.name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[e.target.name];
        return newErrors;
      });
    }
  };

  const handleInterestChange = (interest: string) => {
    setInstitutionalForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const validateIndividualForm = () => {
    const newErrors: Record<string, string> = {};

    if (!individualForm.programInterest)
      newErrors.programInterest = "Please select a program interest";
    if (
      individualForm.programInterest !== "unsure" &&
      !individualForm.specificProgram
    )
      newErrors.specificProgram = "Please select a specific program";
    if (!individualForm.fullName) newErrors.fullName = "Full name is required";
    if (!individualForm.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(individualForm.email))
      newErrors.email = "Email is invalid";
    if (!individualForm.institution)
      newErrors.institution = "Institution/employer is required";
    if (!individualForm.country) newErrors.country = "Country is required";
    if (!individualForm.motivation)
      newErrors.motivation = "Motivation statement is required";
    else if (individualForm.motivation.length < 50)
      newErrors.motivation =
        "Motivation statement must be at least 50 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateInstitutionalForm = () => {
    const newErrors: Record<string, string> = {};

    if (!institutionalForm.organizationName)
      newErrors.organizationName = "Organization name is required";
    if (!institutionalForm.organizationType)
      newErrors.organizationType = "Organization type is required";
    if (!institutionalForm.organizationCountry)
      newErrors.organizationCountry = "Country is required";
    if (!institutionalForm.contactName)
      newErrors.contactName = "Contact name is required";
    if (!institutionalForm.contactEmail)
      newErrors.contactEmail = "Contact email is required";
    else if (!/\S+@\S+\.\S+/.test(institutionalForm.contactEmail))
      newErrors.contactEmail = "Email is invalid";
    if (institutionalForm.interests.length === 0)
      newErrors.interests = "Please select at least one interest";
    if (!institutionalForm.cohortSize)
      newErrors.cohortSize = "Cohort size is required";
    if (!institutionalForm.timeline)
      newErrors.timeline = "Timeline is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleIndividualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const duplicateKey = `andylcc-application-${individualForm.email.toLowerCase()}-${individualForm.specificProgram}`;
    if (window.localStorage.getItem(duplicateKey)) {
      showToast(
        "This application already exists in this browser. Please use a different email or contact the team.",
        "warning",
      );
      return;
    }

    if (validateIndividualForm()) {
      try {
        const result = await apiRequest<{ referenceNumber: string }>(
          "/applications",
          {
            method: "POST",
            body: JSON.stringify({
              programInterest: individualForm.programInterest,
              specificProgram: individualForm.specificProgram,
              fullName: individualForm.fullName,
              email: individualForm.email,
              phone: individualForm.phone,
              dateOfBirth: individualForm.dateOfBirth || null,
              institution: individualForm.institution,
              country: individualForm.country,
              motivationStatement: individualForm.motivation,
              heardFrom: individualForm.heardAbout,
            }),
          },
        );

        const ref = result.referenceNumber || createSubmissionRef("APP");
        setSubmissionRef(ref);
        window.localStorage.setItem(duplicateKey, ref);
        showToast(
          `Application submitted successfully. Reference ${ref}. We will respond within 3-5 business days.`,
          "success",
        );
        setModalType("individual");
        setShowModal(true);
        resetDraft();
        setIndividualForm(defaultIndividualForm);
      } catch (error) {
        showToast(
          error instanceof Error
            ? error.message
            : "Application submission failed.",
          "error",
        );
      }
    } else {
      showToast("Please fill in all required fields.", "error");
    }
  };

  const handleInstitutionalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateInstitutionalForm()) {
      try {
        const result = await apiRequest<{ referenceNumber: string }>(
          "/inquiries",
          {
            method: "POST",
            body: JSON.stringify({
              organizationName: institutionalForm.organizationName,
              organizationType: institutionalForm.organizationType,
              country: institutionalForm.organizationCountry,
              website: institutionalForm.website,
              contactName: institutionalForm.contactName,
              contactTitle: institutionalForm.contactTitle,
              contactEmail: institutionalForm.contactEmail,
              contactPhone: institutionalForm.contactPhone,
              interestTypes: institutionalForm.interests,
              cohortSize: institutionalForm.cohortSize,
              timeline: institutionalForm.timeline,
              additionalInfo: institutionalForm.additionalInfo,
            }),
          },
        );

        const ref = result.referenceNumber || createSubmissionRef("PART");
        setSubmissionRef(ref);
        showToast(
          `Inquiry sent successfully. Reference ${ref}. A partnerships team member will contact you within 5 business days.`,
          "success",
        );
        setModalType("institutional");
        setShowModal(true);
        resetDraft();
        setInstitutionalForm(defaultInstitutionalForm);
      } catch (error) {
        showToast(
          error instanceof Error ? error.message : "Inquiry submission failed.",
          "error",
        );
      }
    } else {
      showToast("Please fill in all required fields.", "error");
    }
  };

  const handleFileClick = () => {
    showToast(
      "CV upload is coming soon. For now, please email your CV to applications@andylcc.com",
      "warning",
    );
  };

  const getAvailablePrograms = () => {
    const filtered = availablePrograms.filter((program) => {
      if (individualForm.programInterest === "student")
        return program.category === "student";
      if (individualForm.programInterest === "professional")
        return program.category === "professional";
      return false;
    });

    return filtered.map((program) => ({
      id: program.slug,
      name: `${program.title} – ${program.location || ""}`.replace(
        /\s+–\s*$/,
        "",
      ),
    }));
  };

  return (
    <>
      {/* Toast Container */}
      <div className="fixed top-24 right-8 z-50 space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-6 py-4 rounded shadow-lg min-w-[300px] animate-slide-in ${
              toast.type === "success"
                ? "bg-[var(--brand-blue)] text-white"
                : toast.type === "error"
                  ? "bg-[var(--brand-red)] text-white"
                  : "bg-[var(--brand-cyan)] text-[var(--brand-navy)]"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--brand-navy)]/55 backdrop-blur-sm">
          <div className="bg-white max-w-2xl w-full mx-4 p-0 rounded-lg shadow-2xl overflow-hidden">
            <div
              className="bg-[var(--brand-navy)] text-white px-8 py-6"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 88%, 0 100%)" }}
            >
              <p className="font-bold uppercase tracking-[0.2em] text-[var(--brand-red-soft)] text-xs mb-3">
                Submission Confirmed
              </p>
              <h3 className="font-bold text-[32px] leading-[40px]">
                {modalType === "individual"
                  ? "Application Received"
                  : "Inquiry Received"}
              </h3>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-8">
                <div className="text-[var(--brand-muted)] leading-7 space-y-3">
                  {modalType === "individual" ? (
                    <>
                      <p>
                        Thank you for your application. We have received your
                        submission and will review it carefully.
                      </p>
                      {submissionRef && (
                        <p>
                          <strong>Reference:</strong> {submissionRef}
                        </p>
                      )}
                      <p>
                        You can expect to hear from us within{" "}
                        <strong>3-5 business days</strong> with next steps.
                      </p>
                      <p>
                        If you have any questions in the meantime, please
                        contact us at{" "}
                        <a
                          href="mailto:hello@andylcc.com"
                          className="text-[var(--brand-red)] hover:underline"
                        >
                          hello@andylcc.com
                        </a>
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        Thank you for your inquiry. A member of our partnerships
                        team will review your submission.
                      </p>
                      {submissionRef && (
                        <p>
                          <strong>Reference:</strong> {submissionRef}
                        </p>
                      )}
                      <p>
                        We will contact you within{" "}
                        <strong>5 business days</strong> to discuss next steps.
                      </p>
                      <p>
                        For urgent matters, please contact{" "}
                        <a
                          href="mailto:partnerships@andylcc.com"
                          className="text-[var(--brand-red)] hover:underline"
                        >
                          partnerships@andylcc.com
                        </a>
                      </p>
                    </>
                  )}
                </div>

                <div className="bg-[var(--brand-surface)] border border-[var(--brand-border)] p-6">
                  <p className="font-bold uppercase tracking-[0.2em] text-[var(--brand-red)] text-xs mb-4">
                    What happens next
                  </p>
                  <ul className="space-y-4 text-[var(--brand-muted)] leading-7">
                    <li className="flex gap-3">
                      <Check className="h-5 w-5 text-[var(--brand-red)] flex-shrink-0 mt-0.5" />
                      <span>
                        We review your submission against program fit and
                        timing.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <Check className="h-5 w-5 text-[var(--brand-red)] flex-shrink-0 mt-0.5" />

                      <span>
                        You receive a follow-up email with the next step or
                        clarification request.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <Check className="h-5 w-5 text-[var(--brand-red)] flex-shrink-0 mt-0.5" />

                      <span>
                        Keep your reference number handy if you need to follow
                        up.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link
                  to="/programs"
                  onClick={() => setShowModal(false)}
                  className="flex-1 text-center border-2 border-[var(--brand-navy)] text-[var(--brand-navy)] font-bold px-8 py-4 rounded hover:bg-[var(--brand-navy)] hover:text-white transition-all uppercase tracking-widest text-sm"
                >
                  Explore Programs
                </Link>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-[var(--brand-red)] text-white font-bold px-8 py-4 rounded hover:brightness-110 transition-all uppercase tracking-widest text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section
        className="pt-[120px] pb-20 bg-[var(--brand-navy)] text-white relative overflow-hidden"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 0% 100%)" }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none">
          <ImageWithFallback
            src={studentImages[12]}
            alt="World map"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 reveal active">
            <span className="font-bold text-[var(--brand-red-soft)] uppercase tracking-[0.2em] text-sm">
              Apply for a Program
            </span>
            <h1 className="font-extrabold text-[36px] sm:text-[48px] md:text-[64px] leading-[42px] sm:leading-[56px] md:leading-[72px] tracking-[-0.02em] text-white">
              Ready to{" "}
              <span className="text-[var(--brand-red)]">Learn Abroad?</span>
            </h1>
            <p className="text-xl leading-8 text-white/90 max-w-3xl mx-auto">
              Submit your application. If accepted, Cardinal Immersions handles
              your travel and logistics so you can focus on learning.
            </p>
            <p className="text-sm text-white/70">
              Programs take place in countries including Kenya, Ghana, the UK,
              and other global destinations.
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--brand-red-soft)]">
              Drafts save on this device. You can clear them anytime.
            </p>
          </div>
        </div>
      </section>

      <section className="relative -mt-12 z-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 reveal">
            {[
              {
                title: "Drafts stay local",
                description:
                  "Your progress saves on this device so you can come back later.",
              },
              {
                title: "Clear response window",
                description:
                  "We respond to individual and institutional submissions within 3-5 business days.",
              },
              {
                title: "Submission reference",
                description:
                  "Every completed form generates a reference number for easy follow-up.",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="bg-white border border-[var(--brand-border)] p-6 shadow-xl"
                style={{
                  clipPath:
                    "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <p className="font-bold text-[var(--brand-red)] uppercase tracking-[0.2em] text-xs mb-3">
                  Application Support
                </p>
                <h2 className="font-bold text-[24px] leading-[32px] text-[var(--brand-navy)] mb-3">
                  {item.title}
                </h2>
                <p className="text-[var(--brand-muted)] leading-7">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      {/* Added slanted divider for section rhythm; remove the clipPath to revert. */}
      <section
        className="py-[120px] bg-white relative -mt-16 pt-40"
        style={{ clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="text-center mb-16 reveal">
            <span className="font-bold text-[var(--brand-red)] uppercase tracking-[0.2em] mb-4 block">
              How It Works
            </span>
            <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em] text-[var(--brand-navy)]">
              Your Journey From Application to Learning
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-20">
            {[
              {
                step: "01",
                title: "Apply",
                icon: FileText,
                description: "Submit your application online",
              },
              {
                step: "02",
                title: "Review",
                icon: Users,
                description: "We review your submission",
              },
              {
                step: "03",
                title: "Accept",
                icon: CheckCircle,
                description: "Receive your acceptance letter",
              },
              {
                step: "04",
                title: "Go Abroad",
                icon: Globe,
                description: "We arrange travel and logistics",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center reveal"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="mb-6 flex justify-center">
                  <div className="w-24 h-24 bg-[var(--brand-red)]/10 flex items-center justify-center rounded-full">
                    <item.icon className="w-12 h-12 text-[var(--brand-red)]" />
                  </div>
                </div>
                <div className="font-bold text-[var(--brand-red)] text-3xl mb-2">
                  {item.step}
                </div>
                <h3 className="font-bold text-xl text-[var(--brand-navy)] mb-2">
                  {item.title}
                </h3>
                <p className="text-[var(--brand-muted)]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Tabs Section */}
      {/* Added slanted divider for section rhythm; remove the clipPath to revert. */}
      <section
        className="py-[120px] bg-[var(--brand-surface)] relative -mt-16 pt-40"
        style={{ clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-30">
          {/* Tab Buttons */}
          <div className="flex justify-center mb-12 reveal">
            <div className="inline-flex flex-col sm:flex-row bg-white border border-[var(--brand-border-strong)] rounded-lg overflow-hidden w-full sm:w-auto">
              <button
                onClick={() => setActiveTab("individual")}
                className={`px-6 sm:px-8 py-4 font-bold uppercase tracking-widest text-sm transition-all w-full sm:w-auto ${
                  activeTab === "individual"
                    ? "bg-[var(--brand-red)] text-white"
                    : "bg-white text-[var(--brand-navy)] hover:bg-[var(--brand-surface)]"
                }`}
              >
                Individual Application
              </button>
              <button
                onClick={() => setActiveTab("institutional")}
                className={`px-6 sm:px-8 py-4 font-bold uppercase tracking-widest text-sm transition-all w-full sm:w-auto ${
                  activeTab === "institutional"
                    ? "bg-[var(--brand-red)] text-white"
                    : "bg-white text-[var(--brand-navy)] hover:bg-[var(--brand-surface)]"
                }`}
              >
                Institutional Inquiry
              </button>
            </div>
          </div>

          {/* Individual Application Form */}
          {activeTab === "individual" && (
            <div className="max-w-4xl mx-auto">
              <div
                className="bg-white p-10 border border-[var(--brand-border)]"
                style={{
                  clipPath:
                    "polygon(0 0, 98% 0, 100% 2%, 100% 100%, 2% 100%, 0 98%)",
                }}
              >
                <h2 className="font-bold text-[32px] sm:text-[36px] md:text-[40px] leading-[40px] sm:leading-[44px] md:leading-[48px] tracking-[-0.01em] text-[var(--brand-navy)] mb-2">
                  Individual Application
                </h2>
                <p className="text-[var(--brand-muted)] mb-8">
                  For students and professionals seeking structured
                  international learning experiences.
                </p>

                <form onSubmit={handleIndividualSubmit} className="space-y-6">
                  {/* Program Selection */}
                  <div>
                    <h3 className="font-bold text-xl text-[var(--brand-navy)] mb-4">
                      Program Selection
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="programInterest"
                          className="block text-[var(--brand-navy)] mb-2"
                        >
                          Program Interest{" "}
                          <span className="text-[var(--brand-red)]">*</span>
                        </label>
                        <select
                          id="programInterest"
                          name="programInterest"
                          value={individualForm.programInterest}
                          onChange={handleIndividualChange}
                          className="w-full px-4 py-3 bg-white border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] transition-colors"
                        >
                          <option value="">Select program type</option>
                          <option value="student">
                            Student Mobility Program
                          </option>
                          <option value="professional">
                            Professional Fellowship
                          </option>
                          <option value="unsure">Not sure</option>
                        </select>
                        {errors.programInterest && (
                          <p className="text-[var(--brand-red)] text-sm mt-1">
                            {errors.programInterest}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="specificProgram"
                          className="block text-[var(--brand-navy)] mb-2"
                        >
                          Specific Program{" "}
                          <span className="text-[var(--brand-red)]">*</span>
                        </label>
                        <select
                          id="specificProgram"
                          name="specificProgram"
                          value={individualForm.specificProgram}
                          onChange={handleIndividualChange}
                          disabled={
                            !individualForm.programInterest ||
                            individualForm.programInterest === "unsure"
                          }
                          className="w-full px-4 py-3 bg-white border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] transition-colors disabled:bg-[var(--brand-surface-alt)]"
                        >
                          <option value="">Select specific program</option>
                          {getAvailablePrograms().length > 0 ? (
                            getAvailablePrograms().map((program) => (
                              <option key={program.id} value={program.id}>
                                {program.name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              No programs currently available
                            </option>
                          )}
                        </select>
                        {errors.specificProgram && (
                          <p className="text-[var(--brand-red)] text-sm mt-1">
                            {errors.specificProgram}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-[var(--brand-muted)] mt-3 italic">
                      {individualForm.programInterest === "unsure"
                        ? "Choose a program type first, or keep this open and we will guide you during review."
                        : "Travel and accommodation are arranged by Cardinal Immersions for accepted participants."}
                    </p>
                  </div>

                  {/* Personal Information */}
                  <div className="pt-6 border-t border-[var(--brand-border)]">
                    <h3 className="font-bold text-xl text-[var(--brand-navy)] mb-4">
                      Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-[var(--brand-navy)] mb-2"
                        >
                          Full Name{" "}
                          <span className="text-[var(--brand-red)]">*</span>
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={individualForm.fullName}
                          onChange={handleIndividualChange}
                          className="w-full px-4 py-3 bg-white border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] transition-colors"
                          placeholder="Your full name"
                        />
                        {errors.fullName && (
                          <p className="text-[var(--brand-red)] text-sm mt-1">
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-[var(--brand-navy)] mb-2"
                        >
                          Email Address{" "}
                          <span className="text-[var(--brand-red)]">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={individualForm.email}
                          onChange={handleIndividualChange}
                          className="w-full px-4 py-3 bg-white border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] transition-colors"
                          placeholder="you@example.com"
                        />
                        {errors.email && (
                          <p className="text-[var(--brand-red)] text-sm mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-[var(--brand-navy)] mb-2"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={individualForm.phone}
                          onChange={handleIndividualChange}
                          className="w-full px-4 py-3 bg-white border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] transition-colors"
                          placeholder="+1 234 567 8900"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="dateOfBirth"
                          className="block text-[var(--brand-navy)] mb-2"
                        >
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          id="dateOfBirth"
                          name="dateOfBirth"
                          value={individualForm.dateOfBirth}
                          onChange={handleIndividualChange}
                          className="w-full px-4 py-3 bg-white border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] transition-colors"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="institution"
                          className="block text-[var(--brand-navy)] mb-2"
                        >
                          Current Institution/Employer{" "}
                          <span className="text-[var(--brand-red)]">*</span>
                        </label>
                        <input
                          type="text"
                          id="institution"
                          name="institution"
                          value={individualForm.institution}
                          onChange={handleIndividualChange}
                          className="w-full px-4 py-3 bg-white border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] transition-colors"
                          placeholder="Your institution or employer"
                        />
                        {errors.institution && (
                          <p className="text-[var(--brand-red)] text-sm mt-1">
                            {errors.institution}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="country"
                          className="block text-[var(--brand-navy)] mb-2"
                        >
                          Country of Residence{" "}
                          <span className="text-[var(--brand-red)]">*</span>
                        </label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={individualForm.country}
                          onChange={handleIndividualChange}
                          className="w-full px-4 py-3 bg-white border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] transition-colors"
                          placeholder="Your country"
                        />
                        {errors.country && (
                          <p className="text-[var(--brand-red)] text-sm mt-1">
                            {errors.country}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Motivation Statement */}
                  <div className="pt-6 border-t border-[var(--brand-border)]">
                    <label
                      htmlFor="motivation"
                      className="block text-[var(--brand-navy)] mb-2"
                    >
                      Motivation Statement{" "}
                      <span className="text-[var(--brand-red)]">*</span>
                    </label>
                    <textarea
                      id="motivation"
                      name="motivation"
                      value={individualForm.motivation}
                      onChange={handleIndividualChange}
                      rows={6}
                      maxLength={500}
                      className="w-full px-4 py-3 bg-white border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] transition-colors resize-none"
                      placeholder="Tell us why you want to participate in this program (50-500 characters)"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <div>
                        {errors.motivation && (
                          <p className="text-[var(--brand-red)] text-sm">
                            {errors.motivation}
                          </p>
                        )}
                      </div>
                      <p
                        className={`text-sm ${individualForm.motivation.length < 50 ? "text-[var(--brand-red)]" : "text-[var(--brand-muted)]"}`}
                      >
                        {individualForm.motivation.length}/500 characters{" "}
                        {individualForm.motivation.length < 50 && "(min 50)"}
                      </p>
                    </div>
                  </div>

                  {/* CV Upload */}
                  <div className="pt-6 border-t border-[var(--brand-border)]">
                    <label
                      htmlFor="cv"
                      className="block text-[var(--brand-navy)] mb-2"
                    >
                      CV / Resume Upload
                    </label>
                    <input
                      type="file"
                      id="cv"
                      accept=".pdf,.docx"
                      onClick={handleFileClick}
                      className="w-full px-4 py-3 bg-white border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] transition-colors"
                    />
                    <p className="text-sm text-[var(--brand-muted)] mt-2 italic">
                      CV upload placeholder â€“ please email CV to
                      applications@andylcc.com after submitting.
                    </p>
                  </div>

                  {/* How did you hear about us */}
                  <div>
                    <label
                      htmlFor="heardAbout"
                      className="block text-[var(--brand-navy)] mb-2"
                    >
                      How did you hear about us?
                    </label>
                    <select
                      id="heardAbout"
                      name="heardAbout"
                      value={individualForm.heardAbout}
                      onChange={handleIndividualChange}
                      className="w-full px-4 py-3 bg-white border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] transition-colors"
                    >
                      <option value="">Select an option</option>
                      <option value="search">Search engine</option>
                      <option value="social">Social media</option>
                      <option value="university">University/Institution</option>
                      <option value="friend">Friend or colleague</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[var(--brand-red)] text-white font-bold px-8 py-4 rounded transition-all hover:brightness-110 uppercase tracking-widest text-sm"
                  >
                    Submit Application
                  </button>
                  <button
                    type="button"
                    onClick={clearIndividualForm}
                    className="w-full border-2 border-[var(--brand-navy)] text-[var(--brand-navy)] font-bold px-8 py-4 rounded transition-all hover:bg-[var(--brand-navy)] hover:text-white uppercase tracking-widest text-sm"
                  >
                    Clear Form
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Institutional Inquiry Form */}
          {activeTab === "institutional" && (
            <div className="max-w-4xl mx-auto">
              <div
                className="bg-white p-10 border border-[var(--brand-border)]"
                style={{
                  clipPath:
                    "polygon(0 0, 98% 0, 100% 2%, 100% 100%, 2% 100%, 0 98%)",
                }}
              >
                <h2 className="font-bold text-[32px] sm:text-[36px] md:text-[40px] leading-[40px] sm:leading-[44px] md:leading-[48px] tracking-[-0.01em] text-[var(--brand-navy)] mb-2">
                  Institutional Inquiry
                </h2>
                <p className="text-[var(--brand-muted)] mb-8">
                  For universities and organizations seeking partnership
                  opportunities.
                </p>

                <form
                  onSubmit={handleInstitutionalSubmit}
                  className="space-y-6"
                >
                  {/* Organization Details */}
                  <div>
                    <h3 className="font-bold text-xl text-[var(--brand-navy)] mb-4">
                      Organization Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="organizationName"
                          className="block text-[var(--brand-navy)] mb-2"
                        >
                          Organization Name{" "}
                          <span className="text-[var(--brand-red)]">*</span>
                        </label>
                        <input
                          type="text"
                          id="organizationName"
                          name="organizationName"
                          value={institutionalForm.organizationName}
                          onChange={handleInstitutionalChange}
                          className="w-full px-4 py-3 bg-white border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] transition-colors"
                          placeholder="Your organization name"
                        />
                        {errors.organizationName && (
                          <p className="text-[var(--brand-red)] text-sm mt-1">
                            {errors.organizationName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="organizationType"
                          className="block text-[var(--brand-navy)] mb-2"
                        >
                          Organization Type{" "}
                          <span className="text-[var(--brand-red)]">*</span>
                        </label>
                        <select
                          id="organizationType"
                          name="organizationType"
                          value={institutionalForm.organizationType}
                          onChange={handleInstitutionalChange}
                          className="w-full px-4 py-3 bg-white border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] transition-colors"
                        >
                          <option value="">Select type</option>
                          <option value="university">University</option>
                          <option value="college">College</option>
                          <option value="professional">
                            Professional Body
                          </option>
                          <option value="ngo">NGO</option>
                          <option value="government">Government Agency</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.organizationType && (
                          <p className="text-[var(--brand-red)] text-sm mt-1">
                            {errors.organizationType}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="organizationCountry"
                          className="block text-[var(--brand-navy)] mb-2"
                        >
                          Country{" "}
                          <span className="text-[var(--brand-red)]">*</span>
                        </label>
                        <input
                          type="text"
                          id="organizationCountry"
                          name="organizationCountry"
                          value={institutionalForm.organizationCountry}
                          onChange={handleInstitutionalChange}
                          className="w-full px-4 py-3 bg-white border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] transition-colors"
                          placeholder="Country"
                        />
                        {errors.organizationCountry && (
                          <p className="text-[var(--brand-red)] text-sm mt-1">
                            {errors.organizationCountry}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="website"
                          className="block text-[var(--brand-navy)] mb-2"
                        >
                          Website
                        </label>
                        <input
                          type="url"
                          id="website"
                          name="website"
                          value={institutionalForm.website}
                          onChange={handleInstitutionalChange}
                          className="w-full px-4 py-3 bg-white border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] transition-colors"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Person */}
                  <div className="pt-6 border-t border-[var(--brand-border)]">
                    <h3 className="font-bold text-xl text-[var(--brand-navy)] mb-4">
                      Contact Person
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="contactName"
                          className="block text-[var(--brand-navy)] mb-2"
                        >
                          Name{" "}
                          <span className="text-[var(--brand-red)]">*</span>
                        </label>
                        <input
                          type="text"
                          id="contactName"
                          name="contactName"
                          value={institutionalForm.contactName}
                          onChange={handleInstitutionalChange}
                          className="w-full px-4 py-3 bg-white border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] transition-colors"
                          placeholder="Contact person name"
                        />
                        {errors.contactName && (
                          <p className="text-[var(--brand-red)] text-sm mt-1">
                            {errors.contactName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="contactTitle"
                          className="block text-[var(--brand-navy)] mb-2"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          id="contactTitle"
                          name="contactTitle"
                          value={institutionalForm.contactTitle}
                          onChange={handleInstitutionalChange}
                          className="w-full px-4 py-3 bg-white border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] transition-colors"
                          placeholder="Job title"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contactEmail"
                          className="block text-[var(--brand-navy)] mb-2"
                        >
                          Email{" "}
                          <span className="text-[var(--brand-red)]">*</span>
                        </label>
                        <input
                          type="email"
                          id="contactEmail"
                          name="contactEmail"
                          value={institutionalForm.contactEmail}
                          onChange={handleInstitutionalChange}
                          className="w-full px-4 py-3 bg-white border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] transition-colors"
                          placeholder="you@organization.com"
                        />
                        {errors.contactEmail && (
                          <p className="text-[var(--brand-red)] text-sm mt-1">
                            {errors.contactEmail}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="contactPhone"
                          className="block text-[var(--brand-navy)] mb-2"
                        >
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="contactPhone"
                          name="contactPhone"
                          value={institutionalForm.contactPhone}
                          onChange={handleInstitutionalChange}
                          className="w-full px-4 py-3 bg-white border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] transition-colors"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Interest Type */}
                  <div className="pt-6 border-t border-[var(--brand-border)]">
                    <label className="block text-[var(--brand-navy)] mb-3">
                      Interest Type{" "}
                      <span className="text-[var(--brand-red)]">*</span>
                    </label>
                    <div className="space-y-3">
                      {[
                        {
                          id: "send",
                          label:
                            "Send participants to Cardinal Immersions programs",
                        },
                        { id: "codesign", label: "Co-design a custom program" },
                        {
                          id: "host",
                          label:
                            "Host Cardinal Immersions programs at our institution",
                        },
                        {
                          id: "faculty",
                          label: "Faculty exchange opportunities",
                        },
                        {
                          id: "other",
                          label: "Other partnership opportunities",
                        },
                      ].map((interest) => (
                        <label
                          key={interest.id}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={institutionalForm.interests.includes(
                              interest.id,
                            )}
                            onChange={() => handleInterestChange(interest.id)}
                            className="w-5 h-5 text-[var(--brand-red)] border-[var(--brand-border-strong)] rounded focus:ring-[var(--brand-red)]"
                          />
                          <span className="text-[var(--brand-navy)]">
                            {interest.label}
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.interests && (
                      <p className="text-[var(--brand-red)] text-sm mt-2">
                        {errors.interests}
                      </p>
                    )}
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[var(--brand-border)]">
                    <div>
                      <label
                        htmlFor="cohortSize"
                        className="block text-[var(--brand-navy)] mb-2"
                      >
                        Estimated Cohort Size{" "}
                        <span className="text-[var(--brand-red)]">*</span>
                      </label>
                      <select
                        id="cohortSize"
                        name="cohortSize"
                        value={institutionalForm.cohortSize}
                        onChange={handleInstitutionalChange}
                        className="w-full px-4 py-3 bg-white border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] transition-colors"
                      >
                        <option value="">Select size</option>
                        <option value="1-5">1-5 participants</option>
                        <option value="6-15">6-15 participants</option>
                        <option value="16-30">16-30 participants</option>
                        <option value="31+">31+ participants</option>
                      </select>
                      {errors.cohortSize && (
                        <p className="text-[var(--brand-red)] text-sm mt-1">
                          {errors.cohortSize}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="timeline"
                        className="block text-[var(--brand-navy)] mb-2"
                      >
                        Preferred Timeline{" "}
                        <span className="text-[var(--brand-red)]">*</span>
                      </label>
                      <select
                        id="timeline"
                        name="timeline"
                        value={institutionalForm.timeline}
                        onChange={handleInstitutionalChange}
                        className="w-full px-4 py-3 bg-white border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] transition-colors"
                      >
                        <option value="">Select timeline</option>
                        <option value="6months">Within 6 months</option>
                        <option value="6-12months">6-12 months</option>
                        <option value="12+months">12+ months</option>
                        <option value="exploring">
                          Just exploring options
                        </option>
                      </select>
                      {errors.timeline && (
                        <p className="text-[var(--brand-red)] text-sm mt-1">
                          {errors.timeline}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <label
                      htmlFor="additionalInfo"
                      className="block text-[var(--brand-navy)] mb-2"
                    >
                      Additional Information
                    </label>
                    <textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      value={institutionalForm.additionalInfo}
                      onChange={handleInstitutionalChange}
                      rows={6}
                      className="w-full px-4 py-3 bg-white border border-[var(--brand-border-strong)] rounded focus:outline-none focus:border-[var(--brand-red)] transition-colors resize-none"
                      placeholder="Tell us more about your partnership interests..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[var(--brand-red)] text-white font-bold px-8 py-4 rounded transition-all hover:brightness-110 uppercase tracking-widest text-sm"
                  >
                    Submit Inquiry
                  </button>
                  <button
                    type="button"
                    onClick={clearInstitutionalForm}
                    className="w-full border-2 border-[var(--brand-navy)] text-[var(--brand-navy)] font-bold px-8 py-4 rounded transition-all hover:bg-[var(--brand-navy)] hover:text-white uppercase tracking-widest text-sm"
                  >
                    Clear Form
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Programs Calendar */}
      {/* Added slanted divider for section rhythm; remove the clipPath to revert. */}
      <section
        className="py-[120px] bg-white relative -mt-16 pt-40"
        style={{ clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="text-center mb-16 reveal">
            <span className="font-bold text-[var(--brand-red)] uppercase tracking-[0.2em] mb-4 block">
              Upcoming Programs
            </span>
            <h2 className="font-bold text-[36px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-[48px] md:leading-[56px] tracking-[-0.01em] text-[var(--brand-navy)]">
              {currentYear} Program Calendar
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {isLoadingPrograms ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`upcoming-skeleton-${index}`}
                  className="bg-[var(--brand-surface)] p-6 border border-[var(--brand-border)] animate-pulse"
                  style={{
                    clipPath:
                      "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                  }}
                >
                  <div className="h-6 w-2/3 bg-[var(--brand-border)] mb-4" />
                  <div className="h-4 w-1/2 bg-[#eef1f4] mb-3" />
                  <div className="h-4 w-32 bg-[#eef1f4] mb-4" />
                  <div className="h-8 w-32 bg-[var(--brand-border)]" />
                </div>
              ))
            ) : availablePrograms.slice(0, 3).length > 0 ? (
              availablePrograms.slice(0, 3).map((program, index) => {
                const statusLabel =
                  program.status === "accepting"
                    ? "Accepting Applications"
                    : program.status === "coming_soon"
                      ? "Coming Soon"
                      : program.status === "full"
                        ? "Full"
                        : "Closed";

                return (
                  <div
                    key={program.slug}
                    className="bg-[var(--brand-surface)] p-6 border border-[var(--brand-border)] hover:border-[var(--brand-red)] transition-all reveal"
                    style={{
                      transitionDelay: `${index * 100}ms`,
                      clipPath:
                        "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                    }}
                  >
                    <h3 className="font-bold text-xl text-[var(--brand-navy)] mb-2">
                      {program.title}
                    </h3>
                    <p className="text-[var(--brand-red)] mb-3">
                      {program.location || "Location TBA"}
                    </p>
                    <p className="text-[var(--brand-muted)] text-sm mb-4">
                      Deadline: {program.deadline || "TBA"}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 text-sm font-bold uppercase tracking-widest ${
                        program.status === "accepting"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="md:col-span-3 bg-[var(--brand-surface)] border border-[var(--brand-border)] p-8 text-center text-[var(--brand-muted)]">
                No upcoming programs are currently available.
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
