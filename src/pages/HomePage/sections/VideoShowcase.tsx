import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    number: "Feature 01",
    title: "AI4FI - Single Pose Model Generator",
    description: "Real-time incident response with intelligent noise reduction. Correlates events across your Telemetry sources to surface only actionable incidents requiring human attention.",
    badge: "New",
    stats: [
      { value: "95%", label: "Accuracy" },
      { value: "3 Sec", label: "Processing" },
      { value: "50+", label: "Models" }
    ],
    videoUrl: 'https://youtube.com/embed/EYiOCLktwuo',
    poster: '/thumbnail-3.png'
  },
  {
    number: "Feature 02",
    title: "Smart Alerts",
    description: "GenAI-powered alert intelligence that suppresses massive daily alert volumes down to critical signals. Predictive alerting provides early warnings with automatic severity scoring.",
    badge: "Popular",
    stats: [
      { value: "10x", label: "Faster" },
      { value: "90%", label: "Noise Reduction" },
      { value: "Auto", label: "Routing" }
    ],

    videoUrl: 'https://youtube.com/embed/sxFmNNgnoXE',
    poster: '/thumbnail-2.png'
  },
  {
    number: "Feature 02",
    title: "Smart Alerts",
    description: "GenAI-powered alert intelligence that suppresses massive daily alert volumes down to critical signals. Predictive alerting provides early warnings with automatic severity scoring.",
    badge: "Popular",
    stats: [
      { value: "10x", label: "Faster" },
      { value: "90%", label: "Noise Reduction" },
      { value: "Auto", label: "Routing" }
    ],

    videoUrl: 'https://youtube.com/embed/MOamlPbz0OQ',
    poster: '/thumbnail-1.png'
  }
];

const VideoCard = ({ feature, index }: { feature: any; index: number }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleVideo = () => {
    if (videoRef.current?.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="relative group"
    >
      {/* Video Wrapper */}
      <div className="relative aspect-[16/10] bg-black rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
        <div className="absolute top-5 right-5 z-20 bg-gradient-to-r from-[#D4AF37] via-[#E84855] to-[#9B59B6] text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-lg">
          {feature.badge}
        </div>

        <video
          ref={videoRef}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          poster={feature.poster}
          muted loop playsInline
        />

        <div className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`} />

        <button
          onClick={toggleVideo}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center z-30 transition-all duration-300 hover:scale-110 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <Play fill="black" className="ml-1" />
        </button>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-2xl p-8 -mt-8 relative z-10 shadow-xl mx-4">
        <span className="text-xs font-bold tracking-[0.2em] uppercase bg-gradient-to-r from-[#D4AF37] to-[#9B59B6] bg-clip-text text-transparent">
          {feature.number}
        </span>
        <h3 className="text-2xl font-bold mt-2 mb-4 text-gray-900">{feature.title}</h3>
        <p className="text-gray-600 font-light leading-relaxed mb-6">
          {feature.description}
        </p>

        <div className="flex gap-6 pt-6 border-t border-gray-100">
          {feature.stats.map((stat: { value: string; label: string; }, i: number) => (
            <div key={i} className="flex-1">
              <span className="block text-xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#E84855] bg-clip-text text-transparent">
                {stat.value}
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function VideoShowcase() {
  return (
    <div className="relative min-h-screen bg-[#F8F6F3] py-24 px-6 overflow-hidden">
      {/* Background Mesh (Absolute) */}
      <div className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 10% 20%, rgba(212, 175, 55, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 90% 80%, rgba(232, 72, 85, 0.15) 0%, transparent 50%)'
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-xs font-bold tracking-[0.3em] uppercase bg-gradient-to-r from-[#D4AF37] via-[#E84855] to-[#9B59B6] bg-clip-text text-transparent"
          >
            Experience Innovation
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif italic font-bold mt-4 mb-6"
          >
            See AI in Action
          </motion.h1>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg font-light">
            Witness the future of AIOps and intelligent agents through our revolutionary GenAI solutions.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {FEATURES.map((feature, index) => (
            <VideoCard key={index} feature={feature} index={index} />
          ))}
        </div>

        <div className="mt-20 text-center">
          <button className="group relative bg-gradient-to-r from-[#D4AF37] via-[#E84855] to-[#9B59B6] text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm shadow-2xl transition-all hover:-translate-y-1">
            <span className="flex items-center gap-3">
              Start Your Free Trial
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

