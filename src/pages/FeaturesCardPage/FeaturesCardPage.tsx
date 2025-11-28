
import { Sparkles } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import DarkLogo from "../../../public/dark-logo.png"
import CardImage1 from "../../assets/unnamed (1).jpg"
import CardImage5 from "../../assets/unnamed (5).jpg"
import CardImage6 from "../../assets/unnamed (6).jpg"
import CardImage7 from "../../assets/unnamed (7).jpg"
import CardImage3 from "../../assets/Gemini_Generated_Image_x1zejnx1zejnx1ze.png"
import bgImage from "../../assets/features-bg.png"


export default function FeaturesPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const navigate = useNavigate()

  const tools = [
    {
      id: 5,
      title: "AI FASHION STUDIO",
      description: "All-one platform for design & creation",
      icon: "✨",
      color: "from-cyan-400 to-purple-500",
      borderColor: "border-cyan-500/30 hover:border-cyan-400",
      path: "/try-on-v2-beta",
      image: CardImage6,
    },

    {
      id: 2,
      title: "VIRTUAL TRY-ON",
      description: "Real-time outfit visualization on user photos",
      icon: "👗",
      color: "from-purple-500 to-pink-500",
      borderColor: "border-purple-500/30 hover:border-purple-400",
      path: "/virtualtryon",
      image: CardImage7,
    },
    {
      id: 3,
      title: "AD CREATOR SUITE",
      description: "Generate AI powered fashion ads instantly",
      icon: "🎬",
      color: "from-blue-500 to-cyan-500",
      borderColor: "border-blue-500/30 hover:border-blue-400",
      path: "/ads-generator",
      image: CardImage3,
    },
    {
      id: 1,
      title: "AI MODEL GENERATOR",
      description: "Create custom virtual models for any need.",
      icon: "👤",
      color: "from-cyan-500 to-blue-500",
      borderColor: "border-cyan-500/30 hover:border-cyan-400",
      path: "/model",
      image: CardImage1,
    },
    {
      id: 4,
      title: "MODEL & ASSET GALLERY",
      description: "Access a vast collection of models & digital assets",
      icon: "🖼️",
      color: "from-pink-500 to-purple-500",
      borderColor: "border-pink-500/30 hover:border-pink-400",
      path: "/generated-model",
      image: CardImage5,
    },

  ]

  return (
    <div
      className="min-h-screen bg-gray-900 text-white overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >

      <div className='p-3 relative  flex justify-between z-[100]'>
        <h2 className='text-xl font-bold flex items-center gap-2'>
          <Link to={"/"}>
            <img src={DarkLogo} className='w-20 h-8' alt='AI4FI' />
          </Link>
          <Sparkles className='w-5 h-5 text-purple-600' />
        
          <span className='text-white'>Try On V2 (beta)</span>
          {/* Model Generator */}
        </h2>
        <div className='flex items-center gap-2'>
         <Link to={"/"}>
          <button className='bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-800 text-white  px-4 py-2  rounded-lg shadow-lg transition-transform transform hover:scale-105'>
            Back
          </button>
         </Link>
       </div>
      </div>



      {/* Animated starfield background */}
      {/* <div className="fixed inset-0 z-0">
        {[...Array(120)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
        <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(0, 229, 255, 0.1)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div> */}

      {/* Content */}
      <div className="relative">
        {/* Main Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Title */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-4xl font-bold mb-8">OUR POWERFUL AI TOOLS</h1>
          </div>

          {/* Tools Grid - Horizontal Scroll */}
          <div className="pb-6 mb-4">
            <div className="flex flex-wrap justify-center md:justify-center gap-6 ">
              {tools.map((tool, index) => (
                <div
                  key={tool.id}
                  className="w-[220px] flex-shrink-0 cursor-pointer"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => navigate(tool.path)}
                >
                  <div
                    className={`h-96  rounded-3xl border-2 ${tool.borderColor} bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl  flex flex-col justify-between transition-all duration-300 ${
                      hoveredCard === index ? "scale-105 shadow-2xl shadow-cyan-500/20" : ""
                    }`}
                  >
                    <img src={tool.image} alt={tool.title} className="w-full h-full object-cover rounded-3xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center mb-20">
            <a
              href="/model"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 rounded-full font-bold text-white transition transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
            >
              START BUILDING WITH AI
            </a>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
