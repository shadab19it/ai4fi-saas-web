"use client"

import { FC, useState } from "react"
import ProductImage from "../assets/ads-product-img.png"
import ProductWithModel from "../assets/ads-with-model.jpeg"
import ProductWithModelVideo from "../assets/ads_generated_video.mp4"
import { Link, useNavigate } from "react-router-dom"
import DarkLogo from "../../public/dark-logo.png"
import { Sparkles } from "lucide-react"
import BorderBeamAnimation from "../components/common/AnimatedBorder"


const AdsGenerator: FC = () => {
  const [hoveredStep, setHoveredStep] = useState<any>(null)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Animated starfield background */}
      <div className="fixed inset-0 z-0">
        {/* Stars */}
        <div className="absolute inset-0 opacity-40">
          {[...Array(100)].map((_, i) => (
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
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className='p-3 flex justify-between'>
        <h2 className='text-xl font-bold flex items-center gap-2'>
          <Link to={"/"}>
            <img src={DarkLogo} className='w-20 h-8' alt='AI4FI' />
          </Link>
          <Sparkles className='w-5 h-5 text-purple-600' />
        
          <span className='text-white'>Try On V2 (beta)</span>
          {/* Model Generator */}
        </h2>
        <div className='flex items-center gap-2'>
         <Link to={"/features"}>
          <button className='bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-800 text-white  px-4 py-2  rounded-lg shadow-lg transition-transform transform hover:scale-105'>
            Back
          </button>
         </Link>
       </div>
      </div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-10">
          {/* 3/4 – 1/4 split on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="space-y-8 md:col-span-8 col-span-1">
              <h1 className="text-4xl md:text-[2.8rem] font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-300 to-blue-300 bg-clip-text text-transparent">
                  Turn Your Product Into a Professional Instantal Ad – Instantly with AI4FI
                </span>
              </h1>
              <p className="text-lg text-gray-300 max-w-xl">
                Upload, transform, and launch your product video commercial in just 3 steps — powered oi AI
              </p>
            </div>
            <div className="flex justify-center md:col-span-4 col-span-1 mt-8 md:mt-0">
              <button onClick={()=> navigate("/create-ads")} className="relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-full font-semibold text-lg shadow-lg hover:shadow-purple-500/50 transition transform hover:scale-105">
                <BorderBeamAnimation size={100} />
                Try Now – Create Your Ad in Minutes
              </button>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Step 1 */}
            <div
              className="group relative cursor-pointer"
              onMouseEnter={() => setHoveredStep(1)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-30 transition duration-500 blur-xl ${
                  hoveredStep === 1 ? "opacity-30" : ""
                }`}
              ></div>
              <div className="relative bg-slate-900/50 backdrop-blur-sm border border-blue-500/30 group-hover:border-blue-400/60 rounded-2xl p-8 transition">
                <h3 className="text-sm font-semibold text-blue-400 mb-4 tracking-wide">UPLOAD</h3>
                <div className="mb-4 mx-auto max-w-full overflow-hidden h-56 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl w-56 h-56 rounded-xl overflow-hidden">
                        <img src={ProductImage} alt="Product Image" className="w-full h-full object-cover mix-blend-normal" />
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 font-semibold">Step 1: Upload Your Product Image</p>
              </div>
            </div>

            {/* Step 2 */}
            <div
              className="group relative cursor-pointer"
              onMouseEnter={() => setHoveredStep(2)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-30 transition duration-500 blur-xl ${
                  hoveredStep === 2 ? "opacity-30" : ""
                }`}
              ></div>
              <div className="relative bg-slate-900/50 backdrop-blur-sm border border-purple-500/30 group-hover:border-purple-400/60 rounded-2xl p-8 transition">
                <h3 className="text-sm font-semibold text-purple-400 mb-6 tracking-wide">AI MODEL</h3>
                <div className="mb-2 h-56 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl overflow-hidden rounded-md  w-64 h-48">
                        <img src={ProductWithModel} alt="Product With Model" className="w-full h-full rounded-md object-cover" />
                    </div>
    
                  </div>
                </div>
                <p className="text-gray-300 font-semibold">Step 2: AI Model Presentation</p>
              </div>
            </div>
          </div>

          {/* Step 3 - Full Width */}
          <div
            className="group relative cursor-pointer"
            onMouseEnter={() => setHoveredStep(3)}
            onMouseLeave={() => setHoveredStep(null)}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-30 transition duration-500 blur-xl ${
                hoveredStep === 3 ? "opacity-30" : ""
              }`}
            ></div>
            <div className="relative bg-slate-900/50 backdrop-blur-sm border border-blue-500/30 group-hover:border-blue-400/60 rounded-2xl p-8 transition">
              <h3 className="text-sm font-semibold text-blue-400 mb-6 tracking-wide">READY TO GO LIVE</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-lg font-semibold mb-4 mt-10">Your Ad Is Ready to Go On Air</p>
                  <div className="space-y-3">
                    <p className="mt-4 text-gray-200 text-lg">
                      Get a professional-grade advertisement ready for social media, TV, or any platform. Download and share instantly.
                    </p>
                    <p className="text-gray-300 text-lg">
                      Experience the power of AI to create eye-catching ads that attract more customers and elevate your brand presence effortlessly.
                    </p>
                  </div>
                </div>
                <div className="h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20 flex items-center justify-center overflow-hidden relative group">
                  <div className="text-center w-full h-full flex items-center justify-center">
                    {/* Thumbnail, shown initially, fades when hovered */}
                    <img
                      src={ProductWithModel}
                      alt="Ad Thumbnail"
                      className={`w-full h-full object-cover rounded-xl transition-opacity duration-500 absolute top-0 left-0 z-10 ${hoveredStep === 3 ? "opacity-0" : "opacity-100"} group-hover:opacity-0`}
                      draggable={false}
                    />
                    {/* Video, fades in on hover */}
                    <video
                      src={ProductWithModelVideo}
                      className="w-full h-full object-cover rounded-xl transition-opacity duration-500 absolute top-0 left-0 z-20 opacity-0 group-hover:opacity-100"
                      
                      loop
                      playsInline
                      onMouseEnter={e => { e.currentTarget.currentTime = 0; e.currentTarget.play(); }}
                      onMouseLeave={e => { e.currentTarget.pause(); }}
                      preload="auto"
                    />
                    {/* Overlay Play icon and caption, hidden on hover */}
                    <div className={`z-30 transition-opacity duration-500 ${hoveredStep === 3 ? "opacity-0" : "opacity-100"} absolute inset-0 flex flex-col items-center justify-center pointer-events-none group-hover:opacity-0`}>
                      <div className="text-5xl mb-2">▶️</div>
                      <p className="text-sm text-gray-400">Final ad preview</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-purple-500/20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">AI4FI – Your Product. Your Ad. In Minutes</h2>
          <p className="text-center text-gray-400 mb-16">AI4FI.com</p>

          <div className="grid md:grid-cols-6 gap-6 text-center">
            {[
              { icon: "🔄", label: "Convert any Image" },
              { icon: "🤖", label: "AI models" },
              { icon: "🧠", label: "AI models" },
              { icon: "✏️", label: "Edit captions" },
              { icon: "📁", label: "Edit captions" },
              { icon: "⏱️", label: "Go from upload → ready-to-launch" },
            ].map((feature, i) => (
              <div key={i} className="group">
                <div className="text-3xl mb-3 group-hover:scale-110 transition">{feature.icon}</div>
                <p className="text-xs text-gray-400 group-hover:text-purple-300 transition">{feature.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-purple-500/20 bg-slate-950/50 backdrop-blur-sm py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
            <p>© 2025 AI4FI. All rights reserved.</p>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default AdsGenerator