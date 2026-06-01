import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/media/ImageWithFallback";
import BrandIcon from "../components/brand/BrandIcon";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  GraduationCap,
  Landmark,
  Globe,
  Shield,
  MessageCircle,
  Star,
  Award,
  Users,
} from "lucide-react";
import { fetchPrograms, type Program } from "../utils/programApi";
import * as THREE from "three";
import { geoEquirectangular, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";

const BRAND = {
  navy: "#0C0F3F",
  landFill: "#F84272",
  cyan: "#9CF2F4",
  red: "#F84272",
  blue: "#7635C8",
  gridLine: "#35375F",
} as const;

function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

async function buildGlobeTexture(): Promise<THREE.CanvasTexture> {
  const W = 4096;
  const H = 2048;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = BRAND.navy;
  ctx.fillRect(0, 0, W, H);

  const ll = (lat: number, lng: number): [number, number] => [
    ((lng + 180) / 360) * W,
    ((90 - lat) / 180) * H,
  ];
  ctx.strokeStyle = BRAND.gridLine;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.2;
  for (let lat = -75; lat <= 75; lat += 15) {
    ctx.beginPath();
    for (let lng = -180; lng <= 180; lng += 2) {
      const [x, y] = ll(lat, lng);
      lng === -180 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  for (let lng = -180; lng <= 180; lng += 20) {
    ctx.beginPath();
    for (let lat = -90; lat <= 90; lat += 2) {
      const [x, y] = ll(lat, lng);
      lat === -90 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const world = (await fetch(
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
  ).then((r) => r.json())) as Topology;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const land = feature(world, (world.objects as any).land);

  const projection = geoEquirectangular()
    .scale(W / (2 * Math.PI))
    .translate([W / 2, H / 2]);

  const pathGenerator = geoPath(projection, ctx);

  ctx.beginPath();
  pathGenerator(land);
  ctx.fillStyle = BRAND.landFill;
  ctx.fill();

  ctx.beginPath();
  pathGenerator(land);
  ctx.strokeStyle = BRAND.cyan;
  ctx.lineWidth = 2.5;
  ctx.globalAlpha = 0.25;
  ctx.stroke();
  ctx.globalAlpha = 1;

  return new THREE.CanvasTexture(canvas);
}

function GlobeCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth || 480;
    const H = 480;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, 2.8);

    scene.add(new THREE.AmbientLight(0xffffff, 1.0));

    const R = 1;
    let frameId: number;
    let globeMesh: THREE.Mesh | null = null;
    let globeTex: THREE.CanvasTexture | null = null;

    const placeholder = new THREE.Mesh(
      new THREE.SphereGeometry(R, 80, 80),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(BRAND.navy) }),
    );
    placeholder.rotation.y = Math.PI;
    scene.add(placeholder);

    scene.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(R + 0.04, 32, 32),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(BRAND.cyan),
          transparent: true,
          opacity: 0.05,
          side: THREE.FrontSide,
        }),
      ),
    );

    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let rotY = Math.PI;
    let rotX = 0;
    let velocityX = 0;
    let velocityY = 0;
    let isHovered = false;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      velocityX = 0;
      velocityY = 0;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      velocityX = dx * 0.005;
      velocityY = dy * 0.005;
      const mesh = globeMesh ?? placeholder;
      mesh.rotation.y += velocityX;
      rotX = Math.max(-1.4, Math.min(1.4, rotX + velocityY));
      mesh.rotation.x = rotX;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMouseUp = () => {
      isDragging = false;
    };
    const onMouseEnter = () => {
      isHovered = true;
    };
    const onMouseLeave = () => {
      isHovered = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      prevX = e.touches[0].clientX;
      prevY = e.touches[0].clientY;
      velocityX = 0;
      velocityY = 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - prevX;
      const dy = e.touches[0].clientY - prevY;
      velocityX = dx * 0.004;
      velocityY = dy * 0.004;
      const mesh = globeMesh ?? placeholder;
      mesh.rotation.y += velocityX;
      rotX = Math.max(-1.4, Math.min(1.4, rotX + velocityY));
      mesh.rotation.x = rotX;
      prevX = e.touches[0].clientX;
      prevY = e.touches[0].clientY;
    };

    renderer.domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("mouseenter", onMouseEnter);
    renderer.domElement.addEventListener("mouseleave", onMouseLeave);
    renderer.domElement.addEventListener("touchstart", onTouchStart, {
      passive: true,
    });
    renderer.domElement.addEventListener("touchmove", onTouchMove, {
      passive: true,
    });

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const mesh = globeMesh ?? placeholder;
      if (!isDragging) {
        velocityX *= 0.92;
        velocityY *= 0.92;
        if (!isHovered) rotY += 0.003;
        mesh.rotation.y = rotY + velocityX;
        rotX += velocityY;
        rotX = Math.max(-1.4, Math.min(1.4, rotX));
        mesh.rotation.x = rotX;
      } else {
        rotY = mesh.rotation.y - velocityX;
      }
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!el) return;
      const w = el.clientWidth;
      camera.aspect = w / H;
      camera.updateProjectionMatrix();
      renderer.setSize(w, H);
    };
    window.addEventListener("resize", onResize);

    buildGlobeTexture().then((tex) => {
      globeTex = tex;
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(R, 80, 80),
        new THREE.MeshBasicMaterial({ map: tex }),
      );
      mesh.rotation.y = placeholder.rotation.y;
      mesh.rotation.x = placeholder.rotation.x;
      scene.remove(placeholder);
      scene.add(mesh);
      globeMesh = mesh;
    });

    return () => {
      cancelAnimationFrame(frameId);
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      renderer.domElement.removeEventListener("mouseenter", onMouseEnter);
      renderer.domElement.removeEventListener("mouseleave", onMouseLeave);
      renderer.domElement.removeEventListener("touchstart", onTouchStart);
      renderer.domElement.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      globeTex?.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full"
      style={{ height: "480px", cursor: "grab" }}
    />
  );
}

// Accent config centralised so both borderTop and BrandIcon stay in sync
const ACCENT_CONFIG = {
  red: { var: "var(--brand-red)", hoverText: "white" },
  blue: { var: "var(--brand-blue)", hoverText: "white" },
  navyBlue: { var: "var(--brand-navy)", hoverText: "white" },
  cyan: { var: "var(--brand-cyan)", hoverText: "var(--brand-navy)" },
} as const;

type AccentTone = keyof typeof ACCENT_CONFIG;

// Hover-safe CTA button — uses CSS classes so colour is never lost on re-render
function ProgramCTA({
  href,
  accentTone,
}: {
  href: string;
  accentTone: AccentTone;
}) {
  const { var: color, hoverText } = ACCENT_CONFIG[accentTone];

  // Inject a one-off class the first time each tone is rendered
  const cls = `prog-btn-${accentTone}`;

  if (
    typeof document !== "undefined" &&
    !document.getElementById(`style-${cls}`)
  ) {
    const tag = document.createElement("style");
    tag.id = `style-${cls}`;
    tag.textContent = `
      .${cls} {
        border-color: ${color};
        color: ${color};
        background-color: transparent;
      }
      .${cls}:hover {
        background-color: ${color};
        color: ${hoverText};
      }
    `;
    document.head.appendChild(tag);
  }

  return (
    <Link
      to={href}
      className={`${cls} inline-flex items-center justify-center w-full gap-2 font-bold uppercase text-xs tracking-widest px-6 py-3 border-2 transition-all duration-300`}
    >
      Learn More <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export default function Home() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.1 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [programs]);

  useEffect(() => {
    let cancelled = false;
    const loadPrograms = async () => {
      try {
        setIsLoadingPrograms(true);
        const data = await fetchPrograms();
        if (!cancelled) setPrograms(data);
      } catch (error) {
        console.error("Failed to load homepage programs:", error);
      } finally {
        if (!cancelled) setIsLoadingPrograms(false);
      }
    };
    void loadPrograms();
    return () => {
      cancelled = true;
    };
  }, []);

  const programCards = programs.slice(0, 3).map((program, index) => ({
    icon:
      program.category === "student"
        ? GraduationCap
        : program.category === "professional"
          ? BriefcaseBusiness
          : Landmark,
    title: program.title,
    description:
      program.summary ||
      program.tagline ||
      program.description ||
      "Learn more about this program.",
    href: `/programs/${program.slug}`,
    bullets: null as string[] | null,
    accentTone: (program.category === "professional"
      ? "blue"
      : index % 3 === 0
        ? "red"
        : index % 3 === 1
          ? "blue"
          : "cyan") as AccentTone,
  }));

  const staticPrograms: {
    icon: typeof GraduationCap;
    title: string;
    description: string;
    bullets: string[];
    href: string;
    accentTone: AccentTone;
  }[] = [
    {
      icon: GraduationCap,
      title: "Students & Youth Programs",
      description:
        "Structured international learning experiences for students combining academic development with global exposure.",
      bullets: [
        "Summer Camps Abroad",
        "Study Abroad Semesters",
        "Language Immersion Courses",
        "Academic & Cultural Exchange",
        "International Study Tours",
      ],
      href: "/programs",
      accentTone: "red",
    },
    {
      icon: BriefcaseBusiness,
      title: "Professional Development Programs",
      description:
        "Immersive international programmes that build global insight, cross-cultural competence, and leadership skills for working professionals.",
      bullets: [
        "Global Leadership Immersions",
        "Industry Conference Delegations",
        "Corporate Learning Expeditions",
        "Executive Study Tours",
        "Cross-Cultural Competence Programs",
      ],
      href: "/programs",
      accentTone: "blue",
    },
    {
      icon: Landmark,
      title: "Institutional & Group Programs",
      description:
        "Bespoke institutional partnership programmes and corporate learning immersions strengthening global collaboration and capacity building.",
      bullets: [
        "Institutional Study Tours",
        "Academic Exchange Programs",
        "Faculty Development Immersions",
        "Student Group Learning Expeditions",
        "International Partnership Programmes",
      ],
      href: "/programs",
      accentTone: "navyBlue", // ← cyan for the third card
    },
  ];

  // const displayPrograms = programCards.length > 0 ? programCards : staticPrograms;
  const displayPrograms = staticPrograms;

  const trustPillars = [
    {
      icon: Shield,
      title: "Verified Partner Network",
      description:
        "Every host institution and programme partner is rigorously vetted before any student is placed.",
    },
    {
      icon: Shield,
      title: "Safety-First Design",
      description:
        "Every host institution and programme partner is rigorously vetted before any student is placed.",
    },
    {
      icon: MessageCircle,
      title: "Transparent Communication",
      description:
        "Regular updates to parents and institutions throughout every stage of the journey.",
    },
    {
      icon: Star,
      title: "Professional Execution",
      description:
        "From application to completion, each journey is managed with structure, clarity, and accountability.",
    },
    {
      icon: Award,
      title: "Accredited Programmes",
      description:
        "Programmes aligned with international standards and clearly defined learning outcomes.",
    },
    {
      icon: Users,
      title: "Designed for African Students",
      description:
        "Structured programmes supporting students from Ghana and across Africa accessing global opportunities.",
    },
  ];

  const destinations = [
    {
      name: "Singapore",
      img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80",
    },
    {
      name: "Dubai",
      img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
    },
    {
      name: "Turkey",
      img: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&q=80",
    },
    {
      name: "United States",
      img: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=600&q=80",
    },
    {
      name: "United Kingdom",
      img: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=600&q=80",
    },
    {
      name: "France",
      img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80",
    },
  ];

  const testimonials = [
    {
      quote:
        "The entire experience was very well structured and professionally managed. I felt supported at every stage from application to completion.",
      name: "Kofi Manu",
      role: "High School Student",
    },
    {
      quote:
        "This was more than just a global exchange. It gave me real exposure to my field internationally and helped me make clearer decisions about my academic path.",
      name: "Ama Mansah",
      role: "University Student",
    },
    {
      quote:
        "Communication was clear and the programme was well coordinated throughout. As a parent, I felt confident my child was in safe hands.",
      name: "Mr Yaw",
      role: "Parent",
    },
  ];

  return (
    <>
      {/* 1. Hero */}
      <section
        className="pt-[120px] pb-32 bg-white relative overflow-hidden"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 88%, 0% 100%)" }}
      >
        <div className="absolute inset-0 z-0 opacity-[0.18] pointer-events-none">
          <svg className="w-full h-full animate-drift" viewBox="0 0 1440 800">
            <circle cx="100" cy="100" fill="var(--brand-blue)" r="3" />
            <circle cx="400" cy="300" fill="var(--brand-navy)" r="4" />
            <circle cx="900" cy="150" fill="var(--brand-cyan)" r="3" />
            <circle cx="1200" cy="400" fill="var(--brand-navy)" r="5" />
            <circle cx="600" cy="600" fill="var(--brand-cyan)" r="3" />
            <path
              className="animate-pulse-slow"
              d="M100 100 L400 300 M400 300 L900 150 M900 150 L1200 400 M1200 400 L600 600 M600 600 L100 100 M400 300 L600 600"
              fill="none"
              stroke="var(--brand-blue)"
              strokeWidth="1"
            />
          </svg>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 reveal active">
            <h1 className="font-extrabold text-[36px] md:text-[64px] leading-[44px] md:leading-[72px] tracking-[-0.02em] text-[var(--brand-ink)]">
              <span className="text-[var(--brand-red)]">Discover</span> the
              World through Purposeful Learning.
            </h1>
            <p className="text-lg leading-7 text-[var(--brand-muted)] max-w-lg">
              Transformative international learning programs designed for
              students and young leaders. Immerse yourself in new cultures, gain
              global perspectives, and build skills that last a lifetime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/programs"
                className="flex-1 bg-[var(--brand-red)] text-white font-bold px-8 py-4 rounded transition-all hover:brightness-110 tracking-widest text-sm inline-flex items-center justify-center gap-2"
              >
                Explore our Programs <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="flex-1 border-2 border-[var(--brand-navy)] text-[var(--brand-navy)] font-bold px-8 py-4 rounded hover:bg-[var(--brand-navy)] hover:text-white transition-all tracking-widest text-sm inline-flex items-center justify-center"
              >
                Learn About Us
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center reveal active">
            <GlobeCanvas />
          </div>
        </div>
      </section>

      {/* 2. Upcoming Program */}
      <section
        className="bg-[var(--brand-navy)] relative z-10 -mt-10 py-20"
        style={{ clipPath: "polygon(0 8%, 100% 0, 100% 92%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 reveal">
              <span className="inline-block font-bold text-[var(--brand-cyan)] uppercase tracking-[0.2em] text-xs border border-[var(--brand-cyan)] px-3 py-1">
                Upcoming Program
              </span>
              <h2 className="font-extrabold text-[36px] md:text-[52px] leading-[44px] md:leading-[60px] text-white">
                Cardinal Vision Sprint 1.0
              </h2>
              <p className="text-[var(--brand-cyan)] font-semibold text-2xl">
                Singapore — Edition
              </p>
              <p className="text-white/75 text-lg leading-7">
                A high-impact international learning experience designed for
                university students to gain real-world exposure through curated
                industry visits, expert-led sessions, and meaningful networking
                opportunities in Singapore.
              </p>
              <p className="text-white/60 text-base leading-6">
                This program bridges academic learning with global practice —
                helping students understand how industries operate in one of the
                world's most innovative economies.
              </p>
              <p className="text-[var(--brand-red)] font-bold uppercase tracking-widest text-sm">
                Applications opening soon.
              </p>
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 border-2 border-white text-white font-bold px-8 py-4 rounded hover:bg-white hover:text-[var(--brand-navy)] transition-all tracking-widest text-sm"
              >
                Join the waitlist to be the first to apply{" "}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="hidden md:block reveal">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=900&q=80"
                alt="Singapore skyline"
                className="w-full h-[400px] object-cover"
                style={{
                  clipPath:
                    "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stats + Trust Pillars */}
      <section
        className="py-[100px] bg-[var(--brand-surface)] relative z-10"
        style={{ clipPath: "polygon(0 6%, 100% 0, 100% 94%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20 reveal">
            {[
              {
                value: "50+",
                label: "Students Placed Globally",
                color: "var(--brand-red)",
              },
              {
                value: "5+",
                label: "Destination Countries",
                color: "var(--brand-navy)",
              },
              {
                value: "10+",
                label: "Program Tracks",
                color: "var(--brand-red)",
              },
              {
                value: "3+",
                label: "Years of Experience",
                color: "var(--brand-navy)",
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  className="font-extrabold text-[56px] md:text-[72px] leading-[64px] md:leading-[80px] tracking-[-0.02em] mb-1"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </p>
                <p className="font-bold text-[var(--brand-navy)] uppercase tracking-widest text-xs">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trustPillars.map((pillar, index) => (
              <div
                key={pillar.title}
                className="bg-white p-8 border border-[var(--brand-border)] hover:border-[var(--brand-blue)] hover:shadow-lg transition-all reveal"
                style={{
                  transitionDelay: `${index * 60}ms`,
                  clipPath:
                    "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                }}
              >
                <BrandIcon
                  icon={pillar.icon}
                  size="sm"
                  accent={
                    index % 3 === 0 ? "red" : index % 3 === 1 ? "blue" : "cyan"
                  }
                  className="mb-4"
                />
                <h4 className="font-bold text-[var(--brand-navy)] text-lg mb-2">
                  {pillar.title}
                </h4>
                <p className="text-[var(--brand-muted)] text-sm leading-6">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Building Trust */}
      <section
        className="py-[100px] bg-[var(--brand-navy)] relative z-10 -mt-16 pt-32"
        style={{ clipPath: "polygon(0 8%, 100% 0, 100% 92%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 reveal">
              <h2 className="font-extrabold text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] text-white">
                Building Global Citizens Through Structured International
                Learning Experiences
              </h2>
              <p className="text-white/70 text-lg leading-7">
                We design immersive international learning programs delivered
                through a carefully selected network of trusted global partners
              </p>
              <p className="text-white/70 text-base leading-7">
                Every programme is built on strong standards of safety, quality,
                and consistency across all host institutions, ensuring seamless,
                well-coordinated global immersion frameworks that are
                professionally executed from start to finish
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 reveal">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80"
                alt="Students collaborating"
                className="w-full h-64 object-cover grayscale hover:grayscale-0 transition-all duration-700"
                style={{
                  clipPath:
                    "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                }}
              />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                alt="International meeting"
                className="w-full h-64 object-cover grayscale hover:grayscale-0 transition-all duration-700 mt-10"
                style={{
                  clipPath:
                    "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. About Us */}
      <section
        className="py-[100px] bg-white relative -mt-16 z-0 pt-32 overflow-hidden"
        style={{ clipPath: "polygon(0 8%, 100% 0, 100% 92%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 reveal">
              <span className="font-extrabold text-[var(--brand-red)] uppercase tracking-[0.2em] text-sm">
                About Us
              </span>
              <h2 className="font-extrabold text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] tracking-[-0.01em] text-[var(--brand-navy)]">
                We believe global exposure is a defining advantage in a rapidly
                changing world.
              </h2>
              <p className="text-[var(--brand-muted)] text-lg leading-7">
                Cardinal Immersions exists to open access to international
                learning environments that shape perspective, build capability,
                and expand opportunity for students and professionals across
                Ghana and Africa.
              </p>
              <p className="text-[var(--brand-muted)] text-base leading-7">
                We design and deliver immersive international experiences
                through a carefully selected network of trusted global partners,
                ensuring strong standards of quality, safety, and consistency
                across every programme.
              </p>
              <p className="text-[var(--brand-muted)] text-base leading-7">
                Every experience is designed and delivered through trusted
                partners, with a focus on quality, safety, and meaningful
                educational outcomes.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-[var(--brand-navy)] text-white font-bold px-8 py-4 rounded hover:brightness-110 transition-all tracking-widest text-sm"
              >
                Learn More <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6 reveal">
              {[
                {
                  icon: Globe,
                  label: "Access",
                  desc: "Opening doors to international learning for ambitious students and professionals",
                  accent: "cyan",
                },
                {
                  icon: Award,
                  label: "Quality",
                  desc: "Uncompromising standards across all programmes, partners, and experiences",
                  accent: "blue",
                },
                {
                  icon: Star,
                  label: "Impact",
                  desc: "Experiences designed to create lasting change in perspective and capability",
                  accent: "red",
                },
                {
                  icon: Shield,
                  label: "Trust",
                  desc: "Delivered through carefully selected global partners with proven credibility and consistency",
                  accent: "blue",
                },
              ].map((val, i) => (
                <div
                  key={val.label}
                  className="bg-[var(--brand-surface)] p-6 border border-[var(--brand-border)]"
                  style={{
                    transitionDelay: `${i * 80}ms`,
                    clipPath:
                      "polygon(0 0, 92% 0, 100% 8%, 100% 100%, 8% 100%, 0 92%)",
                  }}
                >
                  <BrandIcon
                    icon={val.icon}
                    size="sm"
                    accent={val.accent}
                    className="mb-3"
                  />
                  <h4 className="font-bold text-[var(--brand-navy)] mb-1">
                    {val.label}
                  </h4>
                  <p className="text-[var(--brand-muted)] text-sm leading-5">
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Programs */}
      <section
        className="py-[100px] bg-[var(--brand-surface-alt)] relative z-10 -mt-16 pt-32"
        style={{ clipPath: "polygon(0 8%, 100% 0, 100% 92%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-10">
          <div className="text-center mb-16 reveal">
            <span className="font-bold text-[var(--brand-red)] uppercase tracking-[0.2em] mb-4 block text-sm">
              Our Programs
            </span>
            <h2 className="font-extrabold text-[28px] md:text-[48px] leading-[36px] md:leading-[56px] tracking-[-0.01em] text-[var(--brand-navy)] mb-4">
              Purposefully designed international experiences
              <br className="hidden md:block" /> for those ready to grow
              globally.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoadingPrograms
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`program-skeleton-${index}`}
                    className="bg-white p-8 border border-[var(--brand-border)] animate-pulse"
                    style={{
                      borderTop: "6px solid var(--brand-border)",
                      clipPath:
                        "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                    }}
                  >
                    <div className="w-12 h-12 bg-[var(--brand-blue-soft)] mb-6" />
                    <div className="h-7 w-2/3 bg-[var(--brand-border)] mb-4" />
                    <div className="h-4 w-full bg-[var(--brand-cyan-soft)] mb-2" />
                    <div className="h-4 w-5/6 bg-[var(--brand-blue-soft)] mb-8" />
                    <div className="h-4 w-28 bg-[var(--brand-cyan)]" />
                  </div>
                ))
              : displayPrograms.map((program, index) => {
                  const accentVar = ACCENT_CONFIG[program.accentTone].var;
                  return (
                    <div
                      key={program.title}
                      className="group bg-white p-8 hover:shadow-xl transition-all duration-500 reveal flex flex-col"
                      style={{
                        transitionDelay: `${index * 100}ms`,
                        borderTop: `6px solid ${accentVar}`,
                        clipPath:
                          "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                      }}
                    >
                      {/* Icon */}
                      <BrandIcon
                        icon={program.icon}
                        size="lg"
                        accent={program.accentTone}
                        className="mb-6"
                      />

                      {/* Title */}
                      <h4 className="font-semibold text-[22px] mb-3 text-[var(--brand-navy)]">
                        {program.title}
                      </h4>

                      {/* Description */}
                      <p className="text-[var(--brand-muted)] mb-6 text-sm leading-6">
                        {program.description}
                      </p>

                      {/* Bullet list */}
                      {program.bullets && program.bullets.length > 0 && (
                        <ul className="space-y-2 mb-6 flex-1">
                          {program.bullets.map((b) => (
                            <li
                              key={b}
                              className="flex items-center gap-2 text-sm text-[var(--brand-muted)]"
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: accentVar }}
                              />
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Learn More CTA — uses injected CSS class to avoid inline hover flicker */}
                      <div className="mt-auto pt-6 border-t border-[var(--brand-border)]">
                        <ProgramCTA
                          href={program.href}
                          accentTone={program.accentTone}
                        />
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </section>

      {/* 6. Building Trust */}
      <section
        className="py-[100px] bg-[var(--brand-navy)] relative z-10 -mt-16 pt-32"
        style={{ clipPath: "polygon(0 8%, 100% 0, 100% 92%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 reveal">
              {/* <span className="font-bold text-[var(--brand-cyan)] uppercase tracking-[0.2em] text-sm">
                Our Commitment
              </span> */}
              <h2 className="font-extrabold text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] text-white">
                Building Trust, Delivering Excellence
              </h2>
              <p className="text-white/70 text-lg leading-7">
                We understand that participating in an international learning
                program is a significant commitment for students, families, and
                institutions that requires confidence in both process and
                delivery.
              </p>
              <p className="text-white/70 text-base leading-7">
                That is why every experience we design is built with careful
                attention to safety, structure, and consistency, supported by a
                network of verified international partners.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  "For families, it means reassurance that every detail is considered.",
                  "For institutions, it means a reliable partner in delivering meaningful global exposure.",
                  "For participants, it means the freedom to focus fully on learning, growth, and experience.",
                ].map((line) => (
                  <div key={line} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[var(--brand-cyan)] flex-shrink-0 mt-0.5" />
                    <p className="text-white/80 text-sm leading-6">{line}</p>
                  </div>
                ))}
              </div>
              <p className="text-white font-semibold italic border-l-4 border-[var(--brand-red)] pl-4 text-base">
                At Cardinal Immersions, trust is not a claim. It is a standard
                we operate by in every programme we deliver.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border-2 border-white text-white font-bold px-8 py-4 rounded hover:bg-white hover:text-[var(--brand-navy)] transition-all tracking-widest text-sm"
              >
                Enquire Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 reveal">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80"
                alt="Students collaborating"
                className="w-full h-64 object-cover grayscale hover:grayscale-0 transition-all duration-700"
                style={{
                  clipPath:
                    "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                }}
              />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                alt="International meeting"
                className="w-full h-64 object-cover grayscale hover:grayscale-0 transition-all duration-700 mt-10"
                style={{
                  clipPath:
                    "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Destinations */}
      <section
        className="py-[100px] bg-[var(--brand-surface)] relative z-10 -mt-16 pt-32"
        style={{ clipPath: "polygon(0 8%, 100% 0, 100% 92%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 reveal">
            <div>
              <span className="font-extrabold text-[28px] md:text-[40px] leading-[36px] md:leading-[48px] text-[var(--brand-navy)]">
                Where will you Go?
              </span>
              <h2 className="font-bold text-[var(--brand-red)]  mb-3 block text-md mt-[1rem]">
                Our programs span several destinations across multiple countries
                and regions worldwide.
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {destinations.map((dest, index) => (
              <div
                key={dest.name}
                className="group relative overflow-hidden cursor-pointer reveal"
                style={{
                  transitionDelay: `${index * 80}ms`,
                  clipPath:
                    "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)",
                }}
              >
                <ImageWithFallback
                  src={dest.img}
                  alt={dest.name}
                  className="w-full h-48 md:h-56 object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[var(--brand-navy)]/40 group-hover:bg-[var(--brand-navy)]/20 transition-all duration-500" />
                <div className="absolute bottom-4 left-4">
                  <p className="font-bold text-white text-lg tracking-wide">
                    {dest.name}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/programs"
            className="inline-flex items-center gap-2 border-2 border-[var(--brand-navy)] text-[var(--brand-navy)] font-bold px-8 py-4 rounded hover:bg-[var(--brand-navy)] hover:text-[white] transition-all tracking-widest text-sm mt-[2rem]"
          >
            View All
          </Link>
        </div>
      </section>

      {/* 8. Testimonials */}
      <section
        className="py-[100px] bg-white relative z-10 -mt-16 pt-32"
        style={{ clipPath: "polygon(0 8%, 100% 0, 100% 92%, 0 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 py-10">
          <div className="text-center mb-16 reveal">
            <h2 className="font-extrabold text-[28px] md:text-[40px] text-[var(--brand-navy)]">
              Experiences That Speak for Themselves
            </h2>
            <span className="font-bold text-[var(--brand-red)] uppercase tracking-[0.2em] mb-3 block text-sm mt-2">
              Hear from students, parents, and professionals
              <br className="hidden md:block" /> who have experienced Cardinal
              Immersions firsthand.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <div
                key={t.name}
                className="bg-[var(--brand-surface)] p-8 border border-[var(--brand-border)] hover:border-[var(--brand-blue)] transition-colors reveal"
                style={{
                  transitionDelay: `${index * 100}ms`,
                  maskImage:
                    "radial-gradient(circle 40px at 0 0, transparent 0, transparent 40px, black 41px)",
                  WebkitMaskImage:
                    "radial-gradient(circle 40px at 0 0, transparent 0, transparent 40px, black 41px)",
                }}
              >
                <p className="text-base italic text-[var(--brand-ink)] leading-7 mb-8">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--brand-blue-soft)] border-2 border-[var(--brand-blue)] flex-shrink-0" />
                  <div>
                    <p className="font-bold text-[var(--brand-navy)]">
                      {t.name}
                    </p>
                    <p className="text-sm text-[var(--brand-muted)]">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CTA */}
      <section
        style={{ clipPath: "polygon(0 8%, 100% 0, 100% 92%, 0 100%)" }}
        className="py-28 bg-[var(--brand-surface-alt)] border-t border-[var(--brand-border)] relative z-10 -mt-16 text-center mb-[10%]"
      >
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-16 reveal">
          <h2 className="font-extrabold text-[40px] md:text-[64px] leading-[48px] md:leading-[72px] tracking-[-0.02em] text-[var(--brand-navy)] mb-4">
            Ready to Go Global?
          </h2>
          <p className="font-semibold text-[var(--brand-navy)] text-xl mb-2">
            Your international journey starts here.
          </p>
          <p className="text-[var(--brand-muted)] text-base mb-2">
            Applications for our 2025 cohorts are now open. Spaces are limited.
          </p>
          <p className="font-bold text-[var(--brand-red)] uppercase tracking-widest text-sm mb-10">
            Early-bird pricing available for applications
            <br className="hidden md:block" /> submitted by 30 June 2025.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            <Link
              to="/programs"
              className="bg-[var(--brand-red)] text-white font-bold px-10 py-4 rounded hover:brightness-110 transition-all tracking-widest text-sm inline-flex items-center justify-center gap-2"
            >
              View Upcoming Programs <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-[var(--brand-navy)] text-[var(--brand-navy)] font-bold px-10 py-4 rounded hover:bg-[var(--brand-navy)] hover:text-white transition-all tracking-widest text-sm inline-flex items-center justify-center"
            >
              Speak to an Advisor
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
