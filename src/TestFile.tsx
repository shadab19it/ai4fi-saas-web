import React from 'react';
import { 
  Camera, 
  Package, 
  Scissors, 
  Video, 
  Users, 
  ArrowRight, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

// --- Data Definition for Features ---
const features = [
  {
    id: 'stylelabs',
    title: 'StyleLabs',
    badge: 'Flagship',
    subtitle: 'AI Fashion Photoshoot Tool',
    description: 'Generate hyper-realistic, model-based ecommerce shoots instantly. Eliminate the need for physical studios, lighting, and styling teams.',
    // Using high-end fashion imagery
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
    icon: Camera,
    size: 'lg', // Spans 2 columns
  },
  {
    id: 'productstudio',
    title: 'Product Studio',
    badge: 'Updated',
    subtitle: 'Lifestyle Photography',
    description: 'Transform raw product shots into ecommerce-ready lifestyle images, with or without AI models.',
    image: 'https://images.unsplash.com/photo-1599643478514-4a4e09b52342?q=80&w=800&auto=format&fit=crop', // High end product shot
    icon: Package,
    size: 'sm',
  },
  {
    id: 'stichify',
    title: 'Stichify',
    badge: 'New',
    subtitle: 'Unstitched to Stitched',
    description: 'Drape raw fabrics and unstitched designs onto photorealistic virtual models in seconds.',
    image: 'https://images.unsplash.com/photo-1565084888279-aca607fccece?q=80&w=800&auto=format&fit=crop', // Flowing fabric
    icon: Scissors,
    size: 'sm',
  },
  {
    id: 'motionlab',
    title: 'MotionLab',
    badge: 'Beta',
    subtitle: 'Ad Video Generator',
    description: 'Turn static product uploads into dynamic, ready-to-publish marketing ad videos.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop', // Cinematic model shot
    icon: Video,
    size: 'sm',
  },
  {
    id: 'modelhub',
    title: 'ModelHub',
    badge: 'Pro',
    subtitle: 'AI Model Generator',
    description: 'Create and manage a diverse roster of custom virtual fashion models tailored to your brand identity.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop', // AI aesthetic wireframe/human
    icon: Users,
    size: 'md', // Spans 2 columns on bottom
  },
];

export default function EnterpriseFeaturePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 font-sans selection:bg-purple-500/30">
      
      {/* Top Navigation (Simplified High-End) */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-[#0a0a0f]/80">
        <div className="flex items-center space-x-2">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">AI4FI</span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-sm font-medium">1,600 <span className="text-slate-400">credits</span></span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-900 to-slate-800 border border-white/10 flex items-center justify-center">
            <span className="text-xs font-bold text-white">AD</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        
        {/* Header Section */}
        <div className="mb-16 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Fashion Platform</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            The Ultimate Toolkit to <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">
              Transform Fashion
            </span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
            From generating photorealistic virtual models to creating cinematic ad campaigns — everything your enterprise needs to scale fashion content instantly.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[320px]">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className={`group relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900 transition-all duration-500 hover:border-purple-500/50 hover:shadow-[0_0_40px_-15px_rgba(168,85,247,0.3)]
                ${feature.size === 'lg' ? 'md:col-span-2 lg:col-span-2 row-span-2' : ''}
                ${feature.size === 'md' ? 'md:col-span-2' : ''}
              `}
            >
              {/* Background Image with Parallax/Scale Effect */}
              <div className="absolute inset-0 w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent z-10" />
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-80"
                />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                {/* Top Badge & Icon */}
                <div className="absolute top-8 left-8 flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white">
                    <feature.icon className="w-5 h-5" />
                  </div>
                </div>
                {feature.badge && (
                   <div className="absolute top-8 right-8 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold uppercase tracking-wider text-white">
                     {feature.badge}
                   </div>
                )}

                {/* Text Content */}
                <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                  <p className="text-purple-400 font-medium text-sm mb-2">{feature.subtitle}</p>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  
                  {/* Description fades in and moves up on hover */}
                  <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                    <p className="text-slate-300 text-sm leading-relaxed max-w-md mb-6">
                      {feature.description}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <button className="flex items-center space-x-2 text-white font-medium group/btn">
                    <span>Launch Studio</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Global CTA Footer */}
      <footer className="border-t border-white/5 bg-[#0a0a0f] py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h4 className="text-2xl font-bold text-white mb-2">Ready to build with AI?</h4>
            <p className="text-slate-400 text-sm">No design skills required. Start generating in minutes.</p>
          </div>
          <div className="flex items-center space-x-4 mt-6 md:mt-0">
            <div className="hidden md:flex space-x-3 text-xs font-medium text-slate-400">
              <span className="flex items-center"><Sparkles className="w-3 h-3 mr-1 text-yellow-500"/> 5 AI Tools</span>
              <span className="flex items-center"><Camera className="w-3 h-3 mr-1 text-purple-500"/> Pro Quality</span>
            </div>
            <button className="bg-white text-black hover:bg-slate-200 px-6 py-3 rounded-full font-semibold transition-colors flex items-center space-x-2">
              <span>Start Building</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}