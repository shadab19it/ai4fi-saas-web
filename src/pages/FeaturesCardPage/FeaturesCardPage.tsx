import type { LucideIcon } from "lucide-react";
import {
  Camera,
  Box,
  Scissors,
  Video,
  UserSquare2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import AppHeader from "../../components/Layout/AppHeader";
import { Link } from "react-router-dom";
import ProductStudioImg from "../../assets/ai-tool/product-studio.jpeg";
import stitchifyImg from "../../assets/ai-tool/unstiched.jpeg";
import MotionLabImg from "../../assets/ai-tool/motion-lab.jpeg";
import ModelHubImg from "../../assets/ai-tool/model-hub.jpeg";
import StyleLabsImg from "../../assets/ai-tool/style-lab.jpeg";

/* ─── Reusable FeatureCard ─────────────────────────────────────────────── */

interface FeatureCardProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  icon: LucideIcon;
  /** React Router path — use this OR href, not both. */
  to?: string;
  /** External / hash href — used when there's no route yet. */
  href?: string;
  badge?: string;
  /** Tailwind classes for the badge e.g. "bg-emerald-100 text-emerald-700" */
  badgeClassName?: string;
  /** Extra Tailwind object-position class, e.g. "object-top". Defaults to "object-center". */
  imagePosition?: string;
  /** When true: disables click, desaturates image, shows "Launching Soon" overlay. */
  comingSoon?: boolean;
}

function FeatureCard({
  title,
  subtitle,
  description,
  image,
  icon: Icon,
  to,
  href,
  badge,
  badgeClassName = "bg-slate-100 text-slate-700",
  imagePosition = "object-center",
  comingSoon = false,
}: FeatureCardProps) {
  const cardClasses = comingSoon
    ? "flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden cursor-not-allowed select-none"
    : "group flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden";

  const inner = (
    <>
      {/* Image */}
      <div className="h-66 relative overflow-hidden bg-slate-100 border-b border-slate-200">
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover ${imagePosition} group-hover:scale-105 transition-transform duration-700 ${comingSoon ? "grayscale opacity-50" : ""}`}
        />
        {/* "Launching Soon" overlay */}
        {comingSoon && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/40 backdrop-blur-[2px]">
            <span className="px-4 py-1.5 rounded-full bg-slate-800 text-white text-xs font-bold uppercase tracking-widest shadow-lg">
              Launching Soon
            </span>
          </div>
        )}
        {badge && !comingSoon && (
          <div
            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badgeClassName}`}
          >
            {badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-3">
          <Icon className="w-4 h-4" />
          {subtitle}
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>
        <p className="text-slate-600  leading-relaxed mb-4 flex-grow">{description}</p>
        {comingSoon ? (
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl w-fit cursor-not-allowed">
            Launching Soon
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl group-hover:bg-slate-100 transition-colors w-fit">
            Open Tool
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </div>
    </>
  );

  if (comingSoon) return <div className={cardClasses}>{inner}</div>;
  if (to) return <Link to={to} className={cardClasses}>{inner}</Link>;
  return <a href={href ?? "#"} className={cardClasses}>{inner}</a>;
}

/* ─── Page ─────────────────────────────────────────────────────────────── */

export default function FeaturePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-24">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 lg:pt-12">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Enterprise AI Fashion Platform
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Powerful Tools to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Transform
            </span>{" "}
            Fashion
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
            From generating photorealistic virtual models to creating hyper-converting ad
            campaigns — everything you need to scale fashion content effortlessly.
          </p>
        </div>

        {/* Featured: StyleLabs */}
        <Link
          to="/trial-room"
          className="block group mb-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Image */}
            <div className="lg:w-1/2 h-64 lg:h-auto relative overflow-hidden bg-slate-100 border-b lg:border-b-0 lg:border-r border-slate-200">
              <img
                src={StyleLabsImg}
                alt="StyleLabs AI Fashion Photoshoot"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-700 uppercase tracking-wider border border-white shadow-sm">
                Flagship Tool
              </div>
            </div>

            {/* Content */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider mb-4">
                <Camera className="w-5 h-5" />
                AI Fashion Photoshoot
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                StyleLabs
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Generate high-converting, photorealistic model-based ecommerce shoots
                without physical samples. Upload flat-lays or mannequins and instantly
                place them on diverse virtual models.
              </p>
              <div>
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
                  Launch StyleLabs
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </Link>

        {/* 2×2 Feature Grid — uses the reusable FeatureCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard
            title="Product Studio"
            subtitle="Product Lifestyle Photography"
            description="Turn raw product shots into stunning ecommerce-ready lifestyle images. Add professional lighting, shadows, and studio-grade backgrounds instantly."
            image={ProductStudioImg}
            icon={Box}
            to="/product-listing-studio"
          />

          <FeatureCard
            title="Stitchify"
            subtitle="Unstitched to Stitched"
            description="Transform flat fabrics, swatches, or unstitched designs into ready-to-wear looks perfectly draped on virtual models in seconds."
            image={stitchifyImg}
            icon={Scissors}
            to="/unstitched-studio"
            badge="New"
            badgeClassName="bg-emerald-100 text-emerald-700"
          />

          <FeatureCard
            title="MotionLabs"
            subtitle="Ad Video Generator"
            description="Upload static product images and generate dynamic, scroll-stopping video ads optimized for TikTok, Instagram, and social media marketing."
            image={MotionLabImg}
            icon={Video}
            to="/ads-generator"
            imagePosition="object-top"
            comingSoon
          />

          <FeatureCard
            title="ModelHub"
            subtitle="AI Model Generator"
            description="Create diverse, custom virtual fashion models tailored to your brand's specific demographic. Control ethnicity, age, size, and aesthetic easily."
            image={ModelHubImg}
            icon={UserSquare2}
            to="/model"
            imagePosition="object-top"
          />
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 bg-white border border-slate-200 rounded-3xl p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Ready to transform your catalog?
            </h2>
            <p className="text-slate-600 text-lg">
              Start generating creatives in minutes — no design skills required.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> 5 Pro AI Tools
            </div>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-bold transition-all ml-2 shadow-md">
              Start Building Free
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}