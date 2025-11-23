import React, { useState } from 'react'
import RightGirlImg from '../../../assets/LandingPage/img1.png'
import { Link } from 'react-router-dom'
import HeroRightVideo from '../../../../public/hero-right-video.mp4'
import BorderBeamAnimation from '../../../components/common/AnimatedBorder'

const HeroSection2 = () => {
const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  return (
    <div className="h-screen bg-gradient-to-br from-sky-950 via-black to-black text-white overflow-hidden">
    {/* Animated starfield background */}
    <div className="fixed inset-0 z-0">
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

      {/* Gradient glows */}
      {/* <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r rounded-full blur-3xl opacity-15 animate-pulse"></div> */}
      {/* <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r  rounded-full blur-3xl opacity-15 animate-pulse"></div> */}
    </div>

    {/* Content */}
    <div className="relative z-10">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 mt-20">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="text-white">REVOLUTIONIZE</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                FASHION WITH AI.
              </span>
            </h1>

            <p className="text-lg text-gray-300">
              Create, Visualize & Advertise with Intelligent AI Models.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/features">
              <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg font-semibold transition transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50">
                EXPLORE FEATURES
              </button>
              </Link>

              <Link to="/contact">
              <button className="relative px-8 py-3 border-2 border-white/30 hover:border-white/60 rounded-lg font-semibold transition hover:bg-white/5">
              <BorderBeamAnimation />
                BOOK A DEMO
              </button>
              </Link>
            </div>
          </div>

          {/* Right - Digital Figure (Placeholder) */}
          <div className="relative flex items-start justify-center -mt-5">
           <video src={HeroRightVideo} autoPlay muted loop className="w-full  h-96 md:h-[620px]  object-contain " />
          </div>
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
      @keyframes bounce-smooth {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-20px);
        }
      }
      .animate-bounce-smooth {
        animation: bounce-smooth 3s ease-in-out infinite;
      }
    `}</style>
  </div>
  )
}

export default HeroSection2