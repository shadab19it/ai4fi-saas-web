import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Sparkles,
  ArrowRight,
  Wand2,
  Scissors,
  Film,
  UserRound,
  LayoutGrid,
  Zap,
  Star,
  TrendingUp,
  ShoppingBag,
} from "lucide-react"
import AppHeader from "../../components/Layout/AppHeader"
import Button from "../../components/ui/Button"

import CardImage1 from "../../assets/unnamed (1).jpg"
import CardImage5 from "../../assets/unnamed (5).jpg"
import CardImage6 from "../../assets/unnamed (6).jpg"
import CardImage7 from "../../assets/unnamed (7).jpg"
import CardImage3 from "../../assets/Gemini_Generated_Image_x1zejnx1zejnx1ze.png"
import CardImageProduct from "../../assets/ads-product-img.png"

interface FeatureTool {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  accentColor: string
  accentBg: string
  accentBorder: string
  accentShadow: string
  path: string
  image: string
  badge?: string
  badgeColor?: string
}

export default function FeaturesPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const navigate = useNavigate()

  const tools: FeatureTool[] = [
    {
      id: 1,
      title: "AI Fashion Studio",
      description:
        "All-in-one platform for AI-powered fashion design, creation, and visualization.",
      icon: <Wand2 className="h-5 w-5" />,
      accentColor: "text-violet-600",
      accentBg: "bg-violet-50",
      accentBorder: "border-violet-200",
      accentShadow: "shadow-violet-500/12",
      path: "/try-on-v2-beta",
      image: CardImage6,
      badge: "PRO",
      badgeColor: "bg-violet-600",
    },
    // {
    //   id: 2,
    //   title: "Virtual Try-On",
    //   description:
    //     "Real-time outfit visualization on user photos with AI-powered fitting.",
    //   icon: <Shirt className="h-5 w-5" />,
    //   accentColor: "text-rose-600",
    //   accentBg: "bg-rose-50",
    //   accentBorder: "border-rose-200",
    //   accentShadow: "shadow-rose-500/12",
    //   path: "/virtualtryon",
    //   image: CardImage7,
    //   badge: "POPULAR",
    //   badgeColor: "bg-rose-600",
    // },
    {
      id: 3,
      title: "Ad Creator Suite",
      description:
        "Generate high-converting, AI-powered fashion ad creatives instantly.",
      icon: <Film className="h-5 w-5" />,
      accentColor: "text-blue-600",
      accentBg: "bg-blue-50",
      accentBorder: "border-blue-200",
      accentShadow: "shadow-blue-500/12",
      path: "/ads-generator",
      image: CardImage3,
      badge: "NEW",
      badgeColor: "bg-blue-600",
    },
    {
      id: 4,
      title: "AI Model Generator",
      description:
        "Create custom photorealistic virtual fashion models for any campaign.",
      icon: <UserRound className="h-5 w-5" />,
      accentColor: "text-emerald-600",
      accentBg: "bg-emerald-50",
      accentBorder: "border-emerald-200",
      accentShadow: "shadow-emerald-500/12",
      path: "/model",
      image: CardImage1,
    },
    {
      id: 5,
      title: "Model & Asset Gallery",
      description:
        "Browse and manage your generated models, try-ons, and digital assets.",
      icon: <LayoutGrid className="h-5 w-5" />,
      accentColor: "text-amber-600",
      accentBg: "bg-amber-50",
      accentBorder: "border-amber-200",
      accentShadow: "shadow-amber-500/12",
      path: "/generated-model",
      image: CardImage5,
    },
    {
      id: 6,
      title: "Product Listing Studio",
      description:
        "Generate marketplace-ready product images and listing copy for eCommerce.",
      icon: <ShoppingBag className="h-5 w-5" />,
      accentColor: "text-teal-600",
      accentBg: "bg-teal-50",
      accentBorder: "border-teal-200",
      accentShadow: "shadow-teal-500/12",
      path: "/product-listing-studio",
      image: CardImageProduct,
      badge: "NEW",
      badgeColor: "bg-teal-600",
    },
    {
      id: 7,
      title: "Fabric Studio",
      description:
        "Transform unstitched fabric swatches into stitched garments on virtual models instantly.",
      icon: <Scissors className="h-5 w-5" />,
      accentColor: "text-orange-600",
      accentBg: "bg-orange-50",
      accentBorder: "border-orange-200",
      accentShadow: "shadow-orange-500/12",
      path: "/unstitched-studio",
      image: CardImage7,
      badge: "NEW",
      badgeColor: "bg-orange-600",
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-[#F4F2EE] flex flex-col">
      <AppHeader title="AI Tools" onLogout={handleLogout} />

      {/* ─── Tools Grid ─── */}
      <section className="relative flex-1 max-w-6xl mx-auto w-full px-5 sm:px-8 pt-8 sm:pt-10 pb-8">
        {/* Decorative gradient blobs */}
        <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-violet-200/40 via-indigo-100/30 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-[320px] h-[320px] rounded-full bg-gradient-to-tr from-blue-200/30 via-cyan-100/20 to-transparent blur-3xl pointer-events-none" />

        {/* Featured Card (First Tool) — includes hero headline */}
        <div
          className="relative mb-5 cursor-pointer group"
          onMouseEnter={() => setHoveredCard(tools[0].id)}
          onMouseLeave={() => setHoveredCard(null)}
          onClick={() => navigate(tools[0].path)}
        >
          <div
            className={`relative overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
              hoveredCard === tools[0].id
                ? `${tools[0].accentBorder} shadow-[0_12px_40px_rgba(99,102,241,0.12)]`
                : "border-[#E5E2DA] shadow-[0_1px_3px_rgba(28,25,23,0.06)]"
            }`}
          >
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="relative md:w-[40%] aspect-[16/10] md:aspect-auto md:max-h-[340px] overflow-hidden">
                <img
                  src={tools[0].image}
                  alt={tools[0].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-white pointer-events-none" />
              </div>

              {/* Content — Hero headline + tool info */}
              <div className="flex-1 p-5 sm:p-6 lg:p-8 flex flex-col justify-center">
                {/* Hero headline inside card */}
                <div className="mb-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F9F8F5] border border-[#E5E2DA] mb-3">
                    <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                    <span className="text-[11px] font-bold text-[#6B6560] tracking-wide uppercase">
                      AI-Powered Platform
                    </span>
                  </div>
                  <h1 className="text-[22px] sm:text-[26px] lg:text-[30px] font-extrabold text-stone-900 tracking-tight leading-[1.15] mb-2">
                    Powerful Tools to{" "}
                    <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                      Transform
                    </span>{" "}
                    Fashion
                  </h1>
                  <p className="text-[12.5px] sm:text-[13px] text-[#9E9893] leading-relaxed max-w-md">
                    From generating photorealistic models to creating ad campaigns — everything you need to build stunning fashion content.
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-[#E5E2DA] pt-3 mb-0">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg ${tools[0].accentBg} flex items-center justify-center ${tools[0].accentColor}`}
                    >
                      {tools[0].icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-[15px] font-bold text-stone-900 tracking-tight">
                          {tools[0].title}
                        </h2>
                        {tools[0].badge && (
                          <span
                            className={`px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider text-white ${tools[0].badgeColor}`}
                          >
                            {tools[0].badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-[#9E9893] leading-snug">
                        {tools[0].description}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Button
                    variant="gradient"
                    size="lg"
                    icon={<ArrowRight className="h-4 w-4" />}
                    className="font-bold"
                  >
                    Launch Studio
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Remaining Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.slice(1).map((tool) => (
            <div
              key={tool.id}
              className="cursor-pointer group"
              onMouseEnter={() => setHoveredCard(tool.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => navigate(tool.path)}
            >
              <div
                className={`relative overflow-hidden rounded-2xl border bg-white h-full flex flex-col transition-all duration-300 ${
                  hoveredCard === tool.id
                    ? `${tool.accentBorder} shadow-[0_8px_28px_rgba(28,25,23,0.1)] -translate-y-0.5`
                    : "border-[#E5E2DA] shadow-[0_1px_3px_rgba(28,25,23,0.06)]"
                }`}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={tool.image}
                    alt={tool.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />

                  {/* Badge */}
                  {tool.badge && (
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[9.5px] font-bold tracking-wider text-white ${tool.badgeColor} shadow-sm`}
                      >
                        {tool.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg ${tool.accentBg} flex items-center justify-center ${tool.accentColor} shrink-0`}
                    >
                      {tool.icon}
                    </div>
                    <h3 className="text-[14px] font-bold text-stone-900 tracking-tight leading-tight">
                      {tool.title}
                    </h3>
                  </div>
                  <p className="text-[12px] text-[#9E9893] leading-relaxed mb-4 flex-1">
                    {tool.description}
                  </p>
                  <div
                    className={`flex items-center gap-1 text-[12px] font-semibold ${tool.accentColor} transition-all group-hover:gap-2`}
                  >
                    <span>Open tool</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="border-t border-[#E5E2DA] bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left: CTA Content */}
            <div className="text-center lg:text-left">
              <h2 className="text-[20px] sm:text-[24px] font-bold text-stone-900 tracking-tight mb-2">
                Ready to build with AI?
              </h2>
              <p className="text-[13.5px] text-[#6B6560] max-w-md">
                Start generating photorealistic models, virtual try-ons, and
                ad creatives in minutes — no design skills required.
              </p>
            </div>

            {/* Right: Stats + Button */}
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Mini Stats */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F9F8F5] border border-[#E5E2DA]">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-[11.5px] font-bold text-stone-900">
                    7
                  </span>
                  <span className="text-[11.5px] text-[#9E9893]">
                    AI Tools
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F9F8F5] border border-[#E5E2DA]">
                  <Star className="h-3.5 w-3.5 text-violet-500" />
                  <span className="text-[11.5px] font-bold text-stone-900">
                    Pro
                  </span>
                  <span className="text-[11.5px] text-[#9E9893]">
                    Quality
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F9F8F5] border border-[#E5E2DA]">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-[11.5px] font-bold text-stone-900">
                    Fast
                  </span>
                  <span className="text-[11.5px] text-[#9E9893]">
                    Generate
                  </span>
                </div>
              </div>

              <Button
                variant="gradient"
                size="lg"
                onClick={() => navigate("/model")}
                icon={<ArrowRight className="h-4 w-4" />}
                className="font-bold whitespace-nowrap"
              >
                Start Building
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Subtle animated gradient bar at the very top */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}
