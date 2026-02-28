"use client";

import { useState, useEffect, useRef } from "react";
import BorderBeamAnimation from "../components/common/AnimatedBorder";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Feature {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

interface Stat {
  value: string;
  label: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const features: Feature[] = [
  {
    id: "01",
    title: "AI Trial Room",
    desc: "Upload garments and instantly visualize them on photorealistic AI fashion models across multiple poses, angles, and styling variations — ready for e-commerce deployment.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M12 2C8.5 2 6 4.5 6 7v1L3 10v10h18V10l-3-2V7c0-2.5-2.5-5-6-5z" />
        <path d="M9 10s1 2 3 2 3-2 3-2" />
      </svg>
    ),
  },
  {
    id: "02",
    title: "AI Product Shoot Studio",
    desc: "Replace traditional photoshoots with a virtual studio — generate high-quality catalog and lifestyle imagery without physical setups, locations, or reshoots.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <circle cx="12" cy="12" r="3" />
        <path d="M20.4 14.4A9 9 0 1 1 9.6 3.6" />
        <path d="M22 6l-3-3-3 3" />
        <path d="M19 3v6" />
      </svg>
    ),
  },
  {
    id: "03",
    title: "AI Model Generator",
    desc: "Create fashion models tailored to your brand — body type, gender, skin tone, posture, and styling — eliminating agency dependency and reducing production cycles.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <circle cx="12" cy="6" r="3" />
        <path d="M12 9v6m-3 3h6" />
        <path d="M7 21l2-6m6 6l-2-6" />
      </svg>
    ),
  },
  {
    id: "04",
    title: "Virtual Try-On",
    desc: "Enable customers to try products on their own body — improving purchase confidence, engagement, and conversion while reducing return rates dramatically.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M9 7h6M9 11h6M9 15h4" />
      </svg>
    ),
  },
  {
    id: "05",
    title: "AI Ad & Video Generator",
    desc: "Generate ready-to-use marketing creatives, ad assets, and short promotional videos for social media, marketplaces, and performance campaigns — powered entirely by AI.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
  {
    id: "06",
    title: "Lifestyle Visualization",
    desc: "Place your products in aspirational lifestyle contexts — beautiful scenes, curated environments, and on-brand visuals without ever leaving the platform.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    ),
  },
];

const stats: Stat[] = [
  { value: "6+", label: "AI Modules" },
  { value: "∞", label: "Catalog Scale" },
  { value: "0", label: "Physical Shoots" },
  { value: "DPIIT", label: "Recognized Startup" },
];

const workflowSteps = [
  "Product Upload",
  "AI Shoot Studio",
  "Model Generator",
  "Virtual Try-On",
  "Ad Generator",
  "Conversion",
];

const pills = ["Multi-brand ops", "High-volume catalogs", "E-commerce ready", "Enterprise-grade"];

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView] as const;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] tracking-[0.18em] uppercase font-medium mb-6 ${className}`}
      style={{ color: "var(--brand)" }}>
      — {children}
    </p>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AI4FIAboutUs() {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: -999, y: -999 });

  useEffect(() => {
    const handle = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  return (
    <>
      {/* ── Google Font ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        .ai4fi-root { font-family: 'DM Sans', sans-serif; }
        .ai4fi-serif { font-family: 'Cormorant Garamond', serif; }

        @keyframes ai4fi-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px var(--brand); }
          50% { opacity: 0.5; box-shadow: 0 0 3px var(--brand); }
        }
        .ai4fi-dot { animation: ai4fi-pulse 2s infinite; }

        @keyframes ai4fi-gradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .ai4fi-gradient-text {
          background: linear-gradient(90deg, var(--brand), #7c3aed, #db2777, #06b6d4, var(--brand));
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: ai4fi-gradient 10s linear infinite;
        }

        .ai4fi-feature-card {
          transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
        }
        .ai4fi-feature-card:hover {
          transform: translateY(-2px);
        }

        .ai4fi-cta-btn:hover { opacity: 0.88; }
        .ai4fi-footer-link:hover { opacity: 0.75; }
      `}</style>

      <div
        className="ai4fi-root relative  min-h-screen overflow-x-hidden"
        style={{ background: "var(--background)", color: "var(--foreground)" }}
      >
        {/* ── Ambient cursor glow (desktop only) ── */}
        <div
          className="pointer-events-none fixed w-[400px] h-[400px] rounded-full hidden md:block"
          style={{
            left: mousePos.x - 200,
            top: mousePos.y - 200,
            background: "radial-gradient(circle, color-mix(in srgb, var(--brand), transparent 88%) 0%, transparent 70%)",
            transition: "left 0.12s ease, top 0.12s ease",
            zIndex: 0,
          }}
        />

        {/* ── Subtle noise / grain overlay ── */}
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            zIndex: 1,
          }}
        />

        {/* ════════════════════════════════════════
            HERO
        ════════════════════════════════════════ */}
        <section className="relative z-10 min-h-[92vh] flex flex-col items-center justify-center
          px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32
          py-28 sm:py-32
          max-w-[1280px] mx-auto gap-6 sm:gap-7">

          {/* Grid lines decoration */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(color-mix(in srgb, var(--brand), transparent 94%) 1px, transparent 1px),
                linear-gradient(90deg, color-mix(in srgb, var(--brand), transparent 94%) 1px, transparent 1px)`,
              backgroundSize: "72px 72px",
            }}
          />

          {/* Orbs */}
          <div
            className="absolute right-[4%] top-[18%] w-[300px] h-[300px] md:w-[420px] md:h-[420px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--brand), transparent 88%) 0%, transparent 65%)" }}
          />
          <div
            className="absolute right-[18%] bottom-[12%] w-[200px] h-[200px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, color-mix(in srgb, #7c3aed, transparent 92%) 0%, transparent 65%)" }}
          />

          {/* Badge */}
          <AnimatedSection delay={0}>
            <div className="inline-flex relative items-center gap-2 px-4 py-2.5 border border-border bg-[var(--muted-secondary)] rounded-full text-[10px] md:text-xs uppercase tracking-widest text-brand-gradient shadow-sm">
              <BorderBeamAnimation />
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-muted-foreground opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-muted-foreground"></span>
              </span>
              DPIIT · Startup India · Seqtal AI Pvt Ltd

            </div>

          </AnimatedSection>

          {/* Headline */}
          <AnimatedSection delay={110}>
            <h1
              className="ai4fi-serif font-light text-center  leading-[1.06] tracking-tight
                text-[clamp(44px,8vw,96px)]"
              style={{ color: "var(--foreground)", fontWeight: 300 }}
            >
              Fashion Commerce,
              <br />
              <span className="ai4fi-gradient-text italic">Reimagined by AI.</span>
            </h1>
          </AnimatedSection>

          {/* Sub */}
          <AnimatedSection delay={230}>
            <p
              className="text-base sm:text-lg text-center leading-relaxed max-w-[560px] font-light"
              style={{ color: "var(--muted-foreground)" }}
            >
              AI4FI is the enterprise AI platform that collapses the entire fashion content and
              visualization workflow into a single intelligent system — from product upload to
              customer conversion.
            </p>
          </AnimatedSection>

          {/* CTA */}
          <AnimatedSection delay={350}>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-1">
              <a
                href="https://www.seqtal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-7 text-center py-3 bg-brand-color text-white w-full md:w-fit rounded-lg  font-semibold tracking-widest uppercase transition-opacity"

              >
                Visit Seqtal.com
              </a>
              <span
                className="hidden sm:block w-full text-center md:w-px h-8 opacity-30"
                style={{ background: "var(--border)" }}
              />
              <span className="text-xs tracking-[0.08em]  w-full text-center md:w-fit uppercase text-muted-foreground" >
                Enterprise SaaS Platform
              </span>
            </div>
          </AnimatedSection>
        </section>

        {/* ════════════════════════════════════════
            STATS BAND
        ════════════════════════════════════════ */}
        <section
          className="relative z-10 py-8 px-5"
          style={{
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
            background: "color-mix(in srgb, var(--brand), transparent 96%)",
          }}
        >
          <div className="max-w-[1040px] mx-auto grid grid-cols-2 sm:grid-cols-4">
            {stats.map((s, i) => (
              <AnimatedSection key={s.label} delay={i * 80}>
                <div
                  className="flex flex-col items-center gap-1 py-4 px-2"
                  style={{
                    borderRight: i < stats.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <span
                    className="ai4fi-serif text-[38px] sm:text-[44px] font-light leading-none"
                    style={{ color: "var(--brand)" }}
                  >
                    {s.value}
                  </span>
                  <span
                    className="text-[10px] tracking-[0.14em] uppercase font-medium"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {s.label}
                  </span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════
            ABOUT
        ════════════════════════════════════════ */}
        <section className="relative z-10 py-20 sm:py-28 px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32 max-w-[1280px] mx-auto">
          <AnimatedSection>
            <SectionLabel>About the Platform</SectionLabel>
          </AnimatedSection>

          <div className="grid  grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
            <AnimatedSection delay={80}>
              <h2
                className="ai4fi-serif font-light leading-[1.15] tracking-tight text-[clamp(30px,3.8vw,52px)]"
                style={{ color: "var(--foreground)", fontWeight: 300 }}
              >
                One Unified SaaS Platform for the Entire Fashion Workflow
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={180}>
              <div className="flex flex-col gap-5">
                <p className="text-[15px] leading-relaxed font-light" style={{ color: "var(--muted-foreground)" }}>
                  AI4FI replaces the fragmented, manual, and expensive processes behind fashion
                  content creation with intelligent, AI-driven workflows — built for large product
                  catalogs, multi-brand operations, and high-volume e-commerce environments.
                </p>
                <p className="text-[15px] leading-relaxed font-light" style={{ color: "var(--muted-foreground)" }}>
                  Whether you're a fast-growing fashion brand or an established enterprise, AI4FI
                  gives you the creative horsepower of an entire production studio — without the
                  overhead, timelines, or physical constraints.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {pills.map((p) => (
                    <span
                      key={p}
                      className="px-3 py-1 rounded-full text-xs tracking-wide font-medium"
                      style={{
                        border: "1px solid color-mix(in srgb, var(--brand), transparent 55%)",
                        color: "var(--brand)",
                        background: "color-mix(in srgb, var(--brand), transparent 93%)",
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ════════════════════════════════════════
            FEATURES
        ════════════════════════════════════════ */}
        <section className="relative z-10 py-20 sm:py-28 px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32 max-w-[1280px] mx-auto">
          <AnimatedSection>
            <SectionLabel>What AI4FI Enables</SectionLabel>
          </AnimatedSection>
          <AnimatedSection delay={80}>
            <h2
              className="ai4fi-serif font-light leading-[1.15] tracking-tight text-[clamp(30px,3.8vw,52px)] mb-12 sm:mb-16"
              style={{ color: "var(--foreground)", fontWeight: 300 }}
            >
              Every Capability Your Brand Needs
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[2px]"
            style={{ background: "var(--border)" }}>
            {features.map((f, i) => (
              <AnimatedSection key={f.id} delay={i * 60}>
                <div
                  className="ai4fi-feature-card flex flex-col gap-4 p-8 sm:p-10 h-full cursor-default"
                  style={{
                    background: hoveredFeature === f.id
                      ? "color-mix(in srgb, var(--brand), var(--background) 92%)"
                      : "var(--background)",
                    borderColor: hoveredFeature === f.id ? "var(--brand)" : "transparent",
                  }}
                  onMouseEnter={() => setHoveredFeature(f.id)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <span
                    className="ai4fi-serif text-xs tracking-[0.12em] font-light"
                    style={{ color: "color-mix(in srgb, var(--brand), transparent 40%)" }}
                  >
                    {f.id}
                  </span>
                  <div style={{ color: "var(--brand)", opacity: 0.85 }}>{f.icon}</div>
                  <h3
                    className="ai4fi-serif text-[22px] sm:text-[24px] font-normal leading-snug tracking-tight"
                    style={{ color: "var(--foreground)" }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="text-[13.5px] leading-[1.75] font-light flex-1"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {f.desc}
                  </p>
                  <span
                    className="text-lg mt-2 transition-transform group-hover:translate-x-1"
                    style={{ color: "color-mix(in srgb, var(--brand), transparent 45%)" }}
                  >
                    →
                  </span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════
            VISION
        ════════════════════════════════════════ */}
        <section
          className="relative z-10 py-20 sm:py-32 overflow-hidden"
          style={{
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
            background: "color-mix(in srgb, var(--brand), var(--background) 97%)",
          }}
        >
          <div className="px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32 max-w-[1280px] mx-auto">
            <AnimatedSection>
              <SectionLabel>Our Vision</SectionLabel>
            </AnimatedSection>
            <AnimatedSection delay={100}>
              <blockquote
                className="ai4fi-serif italic font-light leading-[1.5] max-w-[860px]
                  text-[clamp(20px,2.8vw,36px)]
                  border-l-2 pl-8 sm:pl-10 my-6"
                style={{
                  borderColor: "var(--brand)",
                  color: "var(--foreground)",
                }}
              >
                "To become the core AI infrastructure for global fashion commerce — empowering
                brands to operate with speed, creativity, and intelligence, without the constraints
                of traditional production models."
              </blockquote>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <p
                className="text-sm tracking-[0.1em] pl-8 sm:pl-10 font-medium uppercase"
                style={{ color: "var(--brand)" }}
              >
                We are re-engineering fashion technology using AI.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* ════════════════════════════════════════
            WORKFLOW
        ════════════════════════════════════════ */}
        <section className="relative z-10 py-20 sm:py-28 px-5 sm:px-10 md:px-16 lg:px-24 xl:px-32 max-w-[1280px] mx-auto">
          <AnimatedSection>
            <SectionLabel>End-to-End Coverage</SectionLabel>
          </AnimatedSection>
          <AnimatedSection delay={80}>
            <h2
              className="ai4fi-serif font-light leading-[1.15] tracking-tight text-[clamp(30px,3.8vw,52px)] mb-10"
              style={{ color: "var(--foreground)", fontWeight: 300 }}
            >
              From Unstitch to Stitch
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={160}>
            <div
              className="rounded-sm p-6 sm:p-8 glass-card"
              style={{ borderColor: "var(--border)" }}
            >
              {/* Mobile: vertical stack */}
              <div className="flex flex-col sm:hidden gap-3">
                {workflowSteps.map((step, i) => (
                  <div key={step} className="flex items-center gap-4">
                    <span
                      className="ai4fi-serif text-xs tracking-[0.1em] w-6 text-right flex-shrink-0"
                      style={{ color: "color-mix(in srgb, var(--brand), transparent 35%)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="text-xs tracking-[0.06em] font-medium uppercase flex-1"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {step}
                    </span>
                    {i < workflowSteps.length - 1 && (
                      <span style={{ color: "color-mix(in srgb, var(--brand), transparent 50%)" }}>↓</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop: horizontal strip */}
              <div className="hidden sm:flex items-center flex-wrap gap-y-3">
                {workflowSteps.map((step, i) => (
                  <div key={step} className="flex items-center gap-2.5">
                    <span
                      className="ai4fi-serif text-[10px] tracking-[0.1em]"
                      style={{ color: "color-mix(in srgb, var(--brand), transparent 35%)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="text-[12px] sm:text-[13px] tracking-[0.05em] font-medium whitespace-nowrap"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {step}
                    </span>
                    {i < workflowSteps.length - 1 && (
                      <span
                        className="text-xl mx-2 sm:mx-3"
                        style={{ color: "color-mix(in srgb, var(--brand), transparent 55%)" }}
                      >
                        ›
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </section>


      </div>
    </>
  );
}