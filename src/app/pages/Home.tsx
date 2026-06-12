import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/media/ImageWithFallback";
import BrandIcon from "../components/brand/BrandIcon";
import {
  ArrowRight,
  Check,
  BookOpen,
  Sun,
  Briefcase,
  Map,
  Languages,
  Heart,
} from "lucide-react";
// import { fetchPrograms, type Program } from "../utils/programApi";
import { professionalImages, studentImages } from "../utils/localImages";
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
    const H = Math.round(Math.max(280, Math.min(W * 0.9, 480)));
    const globeScale = Math.max(0.72, Math.min(W / 520, 1));

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
    placeholder.scale.setScalar(globeScale);
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
      mesh.scale.setScalar(globeScale);
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
      mesh.scale.setScalar(globeScale);
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
      mesh.scale.setScalar(globeScale);
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
      const nextH = Math.round(Math.max(280, Math.min(w * 0.9, 480)));
      const nextScale = Math.max(0.72, Math.min(w / 520, 1));
      camera.aspect = w / nextH;
      camera.updateProjectionMatrix();
      renderer.setSize(w, nextH);
      const mesh = globeMesh ?? placeholder;
      mesh.scale.setScalar(nextScale);
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
      mesh.scale.setScalar(globeScale);
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
      style={{ height: "clamp(280px, 65vw, 480px)", cursor: "grab" }}
    />
  );
}

export default function Home() {
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
  }, []);

  const programPathways = [
    {
      icon: BookOpen,
      title: "Academic & Cultural Exchange",
      description:
        "For students who want to learn within new academic and cultural environments.",
      accent: "red" as const,
      image:
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80",
    },
    {
      icon: Sun,
      title: "Summer Schools & Camps",
      description:
        "Short-term programs built around study, personal growth, friendship, and shared experience.",
      accent: "blue" as const,
      image:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80",
    },
    {
      icon: Briefcase,
      title: "Internships & Career Exposure",
      description:
        "Opportunities that introduce participants to workplace culture and professional life in another country.",
      accent: "cyan" as const,
      image:
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80",
    },
    {
      icon: Heart,
      title: "Volunteer Abroad",
      description:
        "Service-based experiences that connect participants with communities, local initiatives, and practical contribution.",
      accent: "red" as const,
      image:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80",
    },
    {
      icon: Languages,
      title: "Language Study Programs",
      description:
        "Programs that help participants learn a language through classroom study and everyday use.",
      accent: "blue" as const,
      image:
        "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&q=80",
    },
    {
      icon: Map,
      title: "Study Tours",
      description:
        "Guided visits designed around a subject, sector, destination, or group learning objective.",
      accent: "cyan" as const,
      image:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80",
    },
  ];

  const accentHex: Record<string, string> = {
    red: "#F84272",
    blue: "#7635C8",
    cyan: "#9CF2F4",
  };

  const flagshipPrograms = [
    {
      tag: "For students aged 13–18",
      title: "Cardinal Global Edge",
      description:
        "A global exposure program for teenagers building confidence, cultural awareness, and a wider understanding of the world.",
      accent: "var(--brand-red)",
    },
    {
      tag: "For ages 18–25",
      title: "Cardinal VisionSprint",
      description:
        "A focused study abroad experience for students and young adults exploring innovation, entrepreneurship, academic exchange, and practical global learning.",
      accent: "var(--brand-blue)",
    },
    {
      tag: "For emerging leaders and professionals",
      title: "Cardinal Nexus",
      description:
        "A professional development experience for early-career and mid-career participants seeking international exposure, industry insight, and meaningful professional connection.",
      accent: "var(--brand-muted)",
    },
    {
      tag: "For institutions and organizations",
      title: "Cardinal InsightLab",
      description:
        "A custom international engagement program for schools, universities, companies, and organizations seeking group mobility, sector-based learning, partnerships, and institutional exposure.",
      accent: "var(--brand-navy)",
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

  return (
    <>
      {/* ─── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="pt-[120px] pb-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1440 800">
            <circle cx="100" cy="100" fill="var(--brand-blue)" r="3" />
            <circle cx="400" cy="300" fill="var(--brand-navy)" r="4" />
            <circle cx="900" cy="150" fill="var(--brand-cyan)" r="3" />
            <circle cx="1200" cy="400" fill="var(--brand-navy)" r="5" />
            <circle cx="600" cy="600" fill="var(--brand-cyan)" r="3" />
            <path
              d="M100 100 L400 300 M400 300 L900 150 M900 150 L1200 400 M1200 400 L600 600 M600 600 L100 100 M400 300 L600 600"
              fill="none"
              stroke="var(--brand-blue)"
              strokeWidth="1"
            />
          </svg>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 reveal active">
            <p className="font-bold text-[var(--brand-red)] uppercase tracking-[0.2em] text-xs">
              Study Abroad &amp; International Learning
            </p>
            <h1 className="font-extrabold text-[36px] md:text-[60px] leading-[44px] md:leading-[68px] tracking-[-0.02em] text-[var(--brand-navy)]">
              Study abroad programs for real-world learning.
            </h1>
            <p className="text-lg leading-7 text-[var(--brand-muted)] max-w-lg">
              Cardinal Immersions helps learners access meaningful educational
              experiences abroad through guided study, exchange, and
              cohort-based learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/programs"
                className="flex-1 bg-[var(--brand-red)] text-white font-bold px-8 py-4 rounded transition-all hover:brightness-110 tracking-widest text-sm inline-flex items-center justify-center gap-2"
              >
                Explore Our Programs <ArrowRight className="h-4 w-4" />
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

      {/* ─── 2. FEATURED PROGRAM ─────────────────────────────────────────── */}
      <section className="bg-[var(--brand-navy)] py-20 relative z-10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 reveal">
              <span className="inline-block font-bold text-[var(--brand-cyan)] uppercase tracking-[0.2em] text-xs border border-[var(--brand-cyan)] px-3 py-1">
                Featured Program
              </span>
              <h2 className="font-extrabold text-[36px] md:text-[52px] leading-[44px] md:leading-[60px] text-white">
                Cardinal VisionSprint
              </h2>
              <p className="text-[var(--brand-cyan)] font-semibold text-xl">
                Singapore Edition
              </p>
              <p className="text-white/75 text-lg leading-7">
                Cardinal VisionSprint is one of our flagship cohort programs for
                students seeking focused international exposure.
              </p>
              <p className="text-white/60 text-base leading-6">
                The Singapore Edition is a 7-day study abroad program built
                around innovation, entrepreneurship, academic exchange, and
                professional learning. Participants engage with institutions,
                organizations, and local learning environments while reflecting
                on how ideas and opportunities take shape in a different global
                context.
              </p>
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 border-2 border-white text-white font-bold px-8 py-4 rounded hover:bg-white hover:text-[var(--brand-navy)] transition-all tracking-widest text-sm"
              >
                View Program Details <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="hidden md:block reveal">
              <ImageWithFallback
                src={studentImages[0]}
                alt="Cardinal VisionSprint Singapore"
                className="w-full h-[420px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. STATS BAR ────────────────────────────────────────────────── */}
      <section className="py-16 bg-[var(--brand-surface)] relative z-10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 reveal">
            {[
              {
                value: "6",
                label: "Program Pathways",
                color: "var(--brand-red)",
              },
              {
                value: "4",
                label: "Flagship Programs",
                color: "var(--brand-navy)",
              },
              {
                value: "5+",
                label: "Destination Focus Areas",
                color: "var(--brand-red)",
              },
              {
                value: "4+",
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
        </div>
      </section>

      {/* ─── 4. ABOUT US (dark) ──────────────────────────────────────────── */}
      <section className="py-[100px] bg-[var(--brand-navy)] relative z-10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 reveal">
              <span className="font-bold text-[var(--brand-cyan)] uppercase tracking-[0.2em] text-xs">
                About Us
              </span>
              <h2 className="font-extrabold text-[32px] md:text-[52px] leading-[40px] md:leading-[60px] text-white">
                Learning becomes clearer when it is experienced.
              </h2>
              <p className="text-white/70 text-lg leading-7">
                Education should not only live in notes, lectures, or course
                materials. It should also be shaped by people, places,
                conversations, and the chance to see how the world works up
                close.
              </p>
              <p className="text-white/60 text-base leading-6">
                Cardinal Immersions creates opportunities for participants to
                observe, ask questions, join new communities, and return with a
                broader sense of what is possible.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 border-2 border-white text-white font-bold px-8 py-4 rounded hover:bg-white hover:text-[var(--brand-navy)] transition-all tracking-widest text-sm"
              >
                Learn More <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 reveal">
              <ImageWithFallback
                src={studentImages[17]}
                alt="Students collaborating"
                className="w-full h-64 object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <ImageWithFallback
                src={professionalImages[0]}
                alt="International learning"
                className="w-full h-64 object-cover grayscale hover:grayscale-0 transition-all duration-700 mt-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. WHAT WE DO (white) — images LEFT, text RIGHT ────────────── */}
      <section className="py-[100px] bg-white relative z-10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* LEFT: image grid */}
            <div className="grid grid-cols-2 gap-4 reveal">
              <ImageWithFallback
                src={professionalImages[0]}
                alt="Students arriving together"
                className="col-span-2 w-full h-52 object-cover"
              />
              <ImageWithFallback
                src={professionalImages[1]}
                alt="Facilitated discussion"
                className="w-full h-44 object-cover"
              />
              <ImageWithFallback
                src={professionalImages[3]}
                alt="Group learning"
                className="w-full h-44 object-cover"
              />
            </div>
            {/* RIGHT: text */}
            <div className="space-y-6 reveal">
              <span className="font-bold text-[var(--brand-red)] uppercase tracking-[0.2em] text-xs">
                What We Do
              </span>
              <h2 className="font-extrabold text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] tracking-[-0.01em] text-[var(--brand-navy)]">
                A home for students, schools, and institutions seeking global
                experience.
              </h2>
              <p className="text-[var(--brand-muted)] text-lg leading-7">
                Our work sits within the wider study abroad space, with a focus
                on helping learners access experiences abroad that are
                thoughtful, well-planned, and connected to growth.
              </p>
              <p className="text-[var(--brand-muted)] text-base leading-7">
                We support participants through exchange programs, summer
                schools, camps, internships, volunteer abroad, language study,
                study tours, and our own Cardinal-led cohort experiences.
              </p>
              <p className="font-semibold text-[var(--brand-navy)] text-base">
                Cardinal helps connect learners to the right experience abroad.
              </p>
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 bg-[var(--brand-navy)] text-white font-bold px-8 py-4 rounded hover:brightness-110 transition-all tracking-widest text-sm"
              >
                Explore Our Programs <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. OUR PROGRAMS — 6 pathways ──────────────────────────────── */}
      <section className="py-[100px] bg-gray-100 relative z-10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="text-center mb-16 reveal">
            <span className="font-bold text-[var(--brand-red)] uppercase tracking-[0.2em] mb-4 block text-xs">
              Our Programs
            </span>
            <h2 className="font-extrabold text-[28px] md:text-[48px] leading-[36px] md:leading-[56px] tracking-[-0.01em] text-[var(--brand-navy)]">
              Different pathways for different learning goals.
            </h2>
            <p className="text-[var(--brand-muted)] text-lg mt-4 max-w-2xl mx-auto">
              Cardinal helps connect learners to the right experience abroad.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {programPathways.map((program, index) => (
              <div
                key={program.title}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 reveal flex flex-col border border-[var(--brand-border)]"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/* Image */}
                <div className="w-full aspect-[16/9] overflow-hidden bg-[var(--brand-navy)]">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 px-6 py-8 pb-20 bg-white flex-1">
                  <h4 className="font-extrabold text-[18px] leading-snug tracking-[-0.01em] text-[var(--brand-navy)]">
                    {program.title}
                  </h4>
                  <p className="text-[var(--brand-muted)] text-base leading-7">
                    {program.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. CARDINAL FLAGSHIP PROGRAMS ──────────────────────────────── */}
      <section className="py-[100px] bg-white relative z-10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="text-center mb-16 reveal">
            <span className="font-bold text-[var(--brand-red)] uppercase tracking-[0.2em] mb-4 block text-sm">
              Cardinal Flagship Programs
            </span>
            <h2 className="font-extrabold text-[28px] md:text-[48px] leading-[36px] md:leading-[56px] tracking-[-0.01em] text-[var(--brand-navy)]">
              Cohort experiences shaped by age, stage, and ambition.
            </h2>
            <p className="text-[var(--brand-muted)] text-lg mt-4 max-w-3xl mx-auto">
              Cardinal flagship programs are designed for different stages of
              learning and professional growth. Each program brings participants
              together around a clear purpose, guided international exposure,
              and a shared sense of community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {flagshipPrograms.map((prog, index) => (
              <div
                key={prog.title}
                className="group p-8 border border-[var(--brand-border)] hover:shadow-xl transition-all duration-500 reveal flex flex-col"
                style={{
                  transitionDelay: `${index * 100}ms`,
                  borderTop: `6px solid ${prog.accent}`,
                }}
              >
                <p
                  className="font-bold uppercase tracking-widest text-xs mb-3"
                  style={{ color: prog.accent }}
                >
                  {prog.tag}
                </p>
                <h4 className="font-extrabold text-[22px] md:text-[26px] text-[var(--brand-navy)] mb-4">
                  {prog.title}
                </h4>
                <p className="text-[var(--brand-muted)] text-sm leading-6 flex-1">
                  {prog.description}
                </p>
                <div className="mt-6 pt-5 border-t border-[var(--brand-border)]">
                  <Link
                    to="/programs"
                    className="inline-flex items-center gap-2 font-bold text-xs uppercase tracking-widest transition-opacity hover:opacity-70"
                    style={{ color: prog.accent }}
                  >
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. OUR APPROACH (light surface) ────────────────────────────── */}
      <section className="py-[100px] bg-[var(--brand-surface)] relative z-10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 reveal">
              <span className="font-bold text-[var(--brand-red)] uppercase tracking-[0.2em] text-xs">
                Our Approach
              </span>
              <h2 className="font-extrabold text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] text-[var(--brand-navy)]">
                Built carefully, because going abroad requires trust.
              </h2>
              <p className="text-[var(--brand-muted)] text-lg leading-7">
                When a student, parent, school, or partner chooses Cardinal,
                they are trusting us with more than a destination. They are
                trusting us with preparation, safety, communication, and the
                quality of the experience itself.
              </p>
              <p className="text-[var(--brand-muted)] text-base leading-6">
                As a growing organization, we are building carefully from the
                beginning. We focus on clear information, practical schedules,
                responsible coordination, and support that helps participants
                feel prepared before they leave and guided while they are away.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  "Clear information at every stage of the process.",
                  "Practical schedules designed to maximise learning.",
                  "Responsible coordination and consistent support.",
                ].map((line) => (
                  <div key={line} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[var(--brand-red)] flex-shrink-0 mt-0.5" />
                    <p className="text-[var(--brand-navy)] text-sm leading-6">
                      {line}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-[var(--brand-navy)] text-white font-bold px-8 py-4 rounded hover:brightness-110 transition-all tracking-widest text-sm"
              >
                How We Work <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 reveal">
              <ImageWithFallback
                src={studentImages[0]}
                alt="Students prepared to travel"
                className="w-full h-64 object-cover"
              />
              <ImageWithFallback
                src={professionalImages[4]}
                alt="Professional briefing"
                className="w-full h-64 object-cover mt-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. DESTINATIONS ─────────────────────────────────────────────── */}
      <section className="py-[100px] bg-white relative z-10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="mb-12 reveal">
            <span className="font-bold text-[var(--brand-red)] uppercase tracking-[0.2em] text-xs block mb-4">
              Program Destinations
            </span>
            <h2 className="font-extrabold text-[28px] md:text-[48px] leading-[36px] md:leading-[56px] text-[var(--brand-navy)]">
              Places chosen for what they can teach.
            </h2>
            <p className="text-[var(--brand-muted)] text-lg mt-4 max-w-2xl">
              We look at destinations through a learning lens: their culture,
              academic environment, industries, institutions, and the
              opportunities they offer for meaningful engagement.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {destinations.map((dest, index) => (
              <div
                key={dest.name}
                className="group relative overflow-hidden cursor-pointer reveal"
                style={{ transitionDelay: `${index * 80}ms` }}
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
        </div>
      </section>

      {/* ─── 10. COMMUNITY ───────────────────────────────────────────────── */}
      <section className="py-[100px] bg-[var(--brand-surface)] relative z-10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-16">
          {/* Text centered on top */}
          <div className="text-center mb-12 reveal">
            <span className="font-bold text-[var(--brand-red)] uppercase tracking-[0.2em] text-xs block mb-4">
              Our Community
            </span>
            <h2 className="font-extrabold text-[28px] md:text-[48px] leading-[36px] md:leading-[56px] tracking-[-0.01em] text-[var(--brand-navy)] max-w-4xl mx-auto">
              A growing community of learners, families, educators, and
              partners.
            </h2>
            <p className="text-[var(--brand-muted)] text-lg leading-7 mt-4 max-w-2xl mx-auto">
              Cardinal is built around people: the students who take part, the
              families who support them, the educators who believe in global
              learning, and the partners who help make each experience
              meaningful.
            </p>
          </div>

          {/* 3 images side by side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 reveal">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
              alt="Students collaborating"
              className="w-full h-96 object-cover md:block"
            />
            <img
              src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80"
              alt="Networking event"
              className="hidden md:block w-full h-96 object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&q=80"
              alt="Student on program"
              className="hidden md:block w-full h-96 object-cover"
            />
          </div>
        </div>
      </section>

      {/* ─── 11. CTA ─────────────────────────────────────────────────────── */}
      <section className="py-28 bg-white border-t border-[var(--brand-border)] relative z-10 text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-16 reveal">
          <h2 className="font-extrabold text-[40px] md:text-[60px] leading-[48px] md:leading-[68px] tracking-[-0.02em] text-[var(--brand-navy)] mb-6">
            Start with the pathway that fits your goals.
          </h2>
          <p className="text-[var(--brand-muted)] text-lg mb-4 max-w-xl mx-auto">
            Whether you are a student, parent, educator, or institution,
            Cardinal Immersions can help you explore opportunities abroad that
            are thoughtful, guided, and aligned with your next step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              to="/programs"
              className="bg-[var(--brand-red)] text-white font-bold px-10 py-4 rounded hover:brightness-110 transition-all tracking-widest text-sm inline-flex items-center justify-center gap-2"
            >
              Explore Our Programs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
