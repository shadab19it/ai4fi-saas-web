// // import React, { useState } from 'react';
// // import {
// //     Activity, User, UploadCloud, Zap, ChevronRight,
// //     Settings, Monitor, MousePointer2, Shirt,
// //     BrainCircuit, Move, ShoppingBag, Image as ImageIcon,
// //     ScanLine
// // } from 'lucide-react';

// // /*
// //   Reusable Component for the Top Navigation Tabs
// // */
// // const TabButton = ({ active, label, color }) => (
// //     <button
// //         className={`
// //       flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm
// //       ${active
// //                 ? 'bg-blue-600 text-white shadow-blue-200'
// //                 : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
// //             }
// //     `}
// //     >
// //         <div className={`w-2 h-2 rounded-full ${active ? 'bg-white' : color}`}></div>
// //         {label}
// //     </button>
// // );

// // /*
// //   Component for the "Implementation Steps" cards on the left
// // */
// // const StepCard = ({ icon: Icon, title, description }) => (
// //     <div className="flex items-center p-4 bg-white border border-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group">
// //         <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
// //             <Icon size={24} strokeWidth={2.5} />
// //         </div>
// //         <div className="ml-4 flex-grow">
// //             <h4 className="text-gray-900 font-bold text-base">{title}</h4>
// //             <p className="text-gray-500 text-sm mt-0.5">{description}</p>
// //         </div>
// //         <ChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors" size={20} />
// //     </div>
// // );

// // /*
// //   Component for the Feature Icons at the bottom right
// // */
// // const FeatureIcon = ({ icon: Icon, title }) => (
// //     <div className="flex flex-col items-center justify-center text-center space-y-2 w-20 sm:w-24">
// //         <div className="text-gray-600 hover:text-blue-600 transition-colors">
// //             <Icon size={32} strokeWidth={1.5} />
// //         </div>
// //         <span className="text-xs font-medium text-gray-600 leading-tight">{title}</span>
// //     </div>
// // );

// // const VirtualTrialRoom = () => {
// //     return (
// //         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 font-sans relative overflow-hidden py-10 px-4 sm:px-8">

// //             {/* Background decoration (Subtle waves/blobs) */}
// //             <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
// //                 <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-[120px]"></div>
// //                 <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-cyan-50/60 rounded-full blur-[100px]"></div>
// //             </div>

// //             <div className="max-w-7xl mx-auto relative z-10">

// //                 {/* Top Tabs */}
// //                 <div className="flex flex-wrap justify-center gap-4 mb-16">
// //                     <TabButton active label="Virtual Trial Room" />
// //                     <TabButton label="Photo Studio" color="bg-blue-400" />
// //                     <TabButton label="Advertisement" color="bg-red-400" />
// //                 </div>

// //                 <div className="flex flex-col lg:flex-row items-start gap-16">

// //                     {/* LEFT COLUMN: Content & Steps */}
// //                     <div className="w-full lg:w-[45%] space-y-8 pt-4">

// //                         {/* Header Section */}
// //                         <div className="space-y-4">
// //                             <div className="flex items-center gap-4">
// //                                 <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-300 text-white transform -rotate-3">
// //                                     <Activity size={32} />
// //                                 </div>
// //                                 <div>
// //                                     <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Virtual Trial Room</h2>
// //                                     <p className="text-blue-500 font-bold text-xs tracking-[0.2em] mt-1 uppercase">AI-Powered Fashion Previews</p>
// //                                 </div>
// //                             </div>

// //                             <p className="text-gray-600 text-lg leading-relaxed">
// //                                 Generate instant, photo-realistic previews of your garments on diverse AI-generated models. Eliminate traditional photoshoot limitations and accelerate your fashion workflow.
// //                             </p>
// //                         </div>

// //                         {/* Implementation Steps */}
// //                         <div className="space-y-4 pt-2">
// //                             <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Implementation Steps</div>
// //                             <StepCard
// //                                 icon={User}
// //                                 title="Choose AI model representation"
// //                                 description="Select diverse AI-generated models"
// //                             />
// //                             <StepCard
// //                                 icon={UploadCloud}
// //                                 title="Upload garment images"
// //                                 description="Easily upload photos of your clothing"
// //                             />
// //                             <StepCard
// //                                 icon={Zap}
// //                                 title="Instant preview generation"
// //                                 description="Get photo-realistic previews in seconds"
// //                             />
// //                         </div>

// //                         {/* CTA Button */}
// //                         <button className="mt-4 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg rounded-xl shadow-xl shadow-blue-500/30 transition-transform hover:-translate-y-1 w-full sm:w-auto">
// //                             Get Started
// //                         </button>
// //                     </div>

// //                     {/* RIGHT COLUMN: Monitor & Visuals */}
// //                     <div className="w-full lg:w-[55%] relative mt-10 lg:mt-0">

// //                         {/* Monitor Frame */}
// //                         <div className="relative bg-white rounded-2xl shadow-2xl border-4 border-gray-100 overflow-hidden z-10">
// //                             {/* Browser/App Toolbar */}
// //                             <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-2">
// //                                 <div className="flex gap-1.5">
// //                                     <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
// //                                     <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
// //                                     <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
// //                                 </div>
// //                                 <div className="mx-auto bg-gray-200 rounded-full w-1/3 h-1.5 opacity-50"></div>
// //                             </div>

// //                             {/* App UI Simulation */}
// //                             <div className="flex h-[400px] bg-slate-50">
// //                                 {/* Sidebar */}
// //                                 <div className="w-1/3 bg-white border-r border-gray-100 p-4 space-y-4">
// //                                     <div className="h-2 w-20 bg-blue-100 rounded mb-4"></div>

// //                                     {/* Fake UI Elements */}
// //                                     <div className="space-y-2">
// //                                         <div className="text-[10px] font-bold text-gray-400 uppercase">Gender</div>
// //                                         <div className="flex gap-2">
// //                                             <div className="h-6 w-full bg-blue-500 rounded text-[10px] text-white flex items-center justify-center">Male</div>
// //                                             <div className="h-6 w-full bg-gray-100 rounded"></div>
// //                                         </div>
// //                                     </div>

// //                                     <div className="space-y-2">
// //                                         <div className="text-[10px] font-bold text-gray-400 uppercase">Skin Tone</div>
// //                                         <div className="flex gap-1">
// //                                             <div className="w-4 h-4 rounded-full bg-[#fdece2] border border-gray-200"></div>
// //                                             <div className="w-4 h-4 rounded-full bg-[#eabcac]"></div>
// //                                             <div className="w-4 h-4 rounded-full bg-[#d29b83]"></div>
// //                                             <div className="w-4 h-4 rounded-full bg-[#8d5524]"></div>
// //                                         </div>
// //                                     </div>

// //                                     <div className="pt-2">
// //                                         <div className="h-8 w-full bg-blue-500 rounded-lg text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-blue-200">
// //                                             Generate Preview
// //                                         </div>
// //                                         {/* Cursor Graphic */}
// //                                         <div className="absolute top-[200px] left-[25%] z-50 drop-shadow-xl">
// //                                             <MousePointer2 fill="white" className="text-gray-900 w-8 h-8" />
// //                                         </div>
// //                                     </div>
// //                                 </div>

// //                                 {/* Main Content Area */}
// //                                 <div className="w-2/3 p-4 bg-slate-50 relative overflow-hidden flex items-center justify-center">
// //                                     {/* We use an image here to simulate the generated models on screen */}
// //                                     <img
// //                                         src="https://images.unsplash.com/photo-1571513722275-4b41940f54b8?auto=format&fit=crop&w=600&q=80"
// //                                         className="object-cover w-full h-full rounded shadow-inner opacity-90"
// //                                         alt="Dashboard Interface"
// //                                     />
// //                                 </div>
// //                             </div>
// //                         </div>

// //                         {/* Monitor Stand Base */}
// //                         <div className="h-4 w-1/3 mx-auto bg-gray-200 rounded-b-xl shadow-inner mt-[-2px] relative z-0"></div>
// //                         <div className="h-1 w-1/2 mx-auto bg-gray-100 rounded-full blur-sm mt-1"></div>

// //                         {/* Floating Polaroid 1 (Top Left) */}
// //                         <div className="absolute top-[10%] -left-[10%] lg:-left-12 z-20 w-32 bg-white p-2 pb-6 shadow-xl transform -rotate-6 rounded-md">
// //                             <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200" className="rounded bg-gray-200 aspect-[3/4] object-cover" />
// //                         </div>

// //                         {/* Floating Polaroid 2 (Bottom Left) */}
// //                         <div className="absolute top-[45%] -left-[5%] lg:-left-8 z-20 w-36 bg-white p-2 pb-6 shadow-2xl transform rotate-3 rounded-md">
// //                             <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200" className="rounded bg-gray-200 aspect-[3/4] object-cover" />
// //                         </div>

// //                         {/* Bottom Feature Bar */}
// //                         <div className="absolute -bottom-16 sm:-bottom-20 left-1/2 transform -translate-x-1/2 w-[110%] sm:w-[100%] bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex justify-between items-start z-30">
// //                             <FeatureIcon icon={Shirt} title="200+ Styling Options" />

// //                             {/* Vertical Divider */}
// //                             <div className="h-10 w-px bg-gray-100 self-center"></div>

// //                             <FeatureIcon icon={BrainCircuit} title="Smart Dressing AI" />

// //                             <div className="h-10 w-px bg-gray-100 self-center"></div>

// //                             <FeatureIcon icon={Move} title="Pose Selection" />

// //                             <div className="hidden sm:block h-10 w-px bg-gray-100 self-center"></div>

// //                             <FeatureIcon icon={ShoppingBag} title="Accessories Try-On" />

// //                             <div className="hidden sm:block h-10 w-px bg-gray-100 self-center"></div>

// //                             <FeatureIcon icon={ImageIcon} title="Background Change" />

// //                             <div className="hidden sm:block h-10 w-px bg-gray-100 self-center"></div>

// //                             <FeatureIcon icon={ScanLine} title="Perfect Fit Preview" />
// //                         </div>

// //                     </div>
// //                 </div>

// //                 {/* Spacing for the bottom overlapping element */}
// //                 <div className="h-24"></div>

// //             </div>
// //         </div>
// //     );
// // };

// // export default VirtualTrialRoom;

// // import React, { useState } from 'react';
// // import {
// //     Camera, Upload, Wand2, Image as ImageIcon, ChevronRight,
// //     Sun, Palette, Sparkles, ShoppingCart, ArrowRight,
// //     Activity, User, UploadCloud, Zap, Settings, Monitor,
// //     MousePointer2, Shirt, BrainCircuit, Move, ShoppingBag, ScanLine
// // } from 'lucide-react';

// // /* --- SHARED COMPONENTS --- */

// // const TabButton = ({ active, label, theme = 'blue', onClick }) => {
// //     const styles = {
// //         blue: active ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50',
// //         pink: active ? 'bg-fuchsia-500 text-white shadow-fuchsia-200' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
// //     };

// //     const dotColor = {
// //         blue: 'bg-blue-400',
// //         pink: 'bg-pink-400',
// //         orange: 'bg-orange-400'
// //     };

// //     return (
// //         <button
// //             onClick={onClick}
// //             className={`
// //         flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm
// //         ${styles[theme]}
// //       `}
// //         >
// //             {!active && <div className={`w-2 h-2 rounded-full ${label === 'Photo Studio' ? dotColor.pink : label === 'Advertisement' ? dotColor.orange : dotColor.blue}`}></div>}
// //             {label}
// //         </button>
// //     );
// // };

// // const StepCard = ({ icon: Icon, title, description, colorClass = "bg-blue-500" }) => (
// //     <div className="flex items-center p-4 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group">
// //         <div className={`flex-shrink-0 w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}>
// //             <Icon size={24} strokeWidth={2.5} />
// //         </div>
// //         <div className="ml-4 flex-grow">
// //             <h4 className="text-gray-900 font-bold text-base">{title}</h4>
// //             <p className="text-gray-500 text-sm mt-0.5">{description}</p>
// //         </div>
// //         <ChevronRight className="text-gray-300 group-hover:text-gray-600 transition-colors" size={20} />
// //     </div>
// // );

// // /* --- SECTION 1: VIRTUAL TRIAL ROOM (Blue Theme) --- */
// // const VirtualTrialRoom = () => (
// //     <div className="flex flex-col lg:flex-row items-start gap-16 relative z-10">
// //         {/* Content */}
// //         <div className="w-full lg:w-[45%] space-y-8 pt-4">
// //             <div className="space-y-4">
// //                 <div className="flex items-center gap-4">
// //                     <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-300 text-white transform -rotate-3">
// //                         <Activity size={32} />
// //                     </div>
// //                     <div>
// //                         <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Virtual Trial Room</h2>
// //                         <p className="text-blue-500 font-bold text-xs tracking-[0.2em] mt-1 uppercase">AI-Powered Fashion Previews</p>
// //                     </div>
// //                 </div>
// //                 <p className="text-gray-600 text-lg leading-relaxed">
// //                     Generate instant, photo-realistic previews of your garments on diverse AI-generated models. Eliminate traditional photoshoot limitations.
// //                 </p>
// //             </div>

// //             <div className="space-y-4 pt-2">
// //                 <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Implementation Steps</div>
// //                 <StepCard icon={User} title="Choose AI model representation" description="Select diverse AI-generated models" colorClass="bg-blue-500" />
// //                 <StepCard icon={UploadCloud} title="Upload garment images" description="Easily upload photos of your clothing" colorClass="bg-blue-500" />
// //                 <StepCard icon={Zap} title="Instant preview generation" description="Get photo-realistic previews in seconds" colorClass="bg-blue-500" />
// //             </div>

// //             <button className="mt-4 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg rounded-xl shadow-xl shadow-blue-500/30 w-full sm:w-auto">
// //                 Get Started
// //             </button>
// //         </div>

// //         {/* Visuals */}
// //         <div className="w-full lg:w-[55%] relative mt-10 lg:mt-0">
// //             <div className="relative bg-white rounded-2xl shadow-2xl border-4 border-gray-100 overflow-hidden z-10 h-[400px]">
// //                 {/* Header */}
// //                 <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-2">
// //                     <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-400"></div><div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div><div className="w-2.5 h-2.5 rounded-full bg-green-400"></div></div>
// //                 </div>
// //                 {/* Body */}
// //                 <div className="flex h-full">
// //                     <div className="w-1/3 bg-white border-r border-gray-100 p-4 space-y-4">
// //                         <div className="h-2 w-20 bg-blue-100 rounded mb-4"></div>
// //                         <div className="h-8 w-full bg-blue-500 rounded text-white text-xs font-bold flex items-center justify-center">Generate</div>
// //                     </div>
// //                     <div className="w-2/3 bg-slate-50 relative">
// //                         <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover opacity-90" alt="Model" />
// //                     </div>
// //                 </div>
// //             </div>
// //             {/* Feature Icons Bottom */}
// //             <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex justify-between z-30">
// //                 <div className="flex flex-col items-center"><Shirt size={24} className="text-gray-600 mb-1" /><span className="text-[10px] font-bold">Styling</span></div>
// //                 <div className="flex flex-col items-center"><BrainCircuit size={24} className="text-gray-600 mb-1" /><span className="text-[10px] font-bold">AI</span></div>
// //                 <div className="flex flex-col items-center"><Move size={24} className="text-gray-600 mb-1" /><span className="text-[10px] font-bold">Pose</span></div>
// //                 <div className="flex flex-col items-center"><ShoppingBag size={24} className="text-gray-600 mb-1" /><span className="text-[10px] font-bold">Try-On</span></div>
// //             </div>
// //         </div>
// //     </div>
// // );

// // /* --- SECTION 2: PHOTO STUDIO (Pink/Purple Theme) --- */
// // const PhotoStudio = () => (
// //     <div className="flex flex-col lg:flex-row items-start gap-12 relative z-10">

// //         {/* LEFT COLUMN: Text & Content */}
// //         <div className="w-full lg:w-[45%] space-y-8 pt-4">
// //             {/* Header */}
// //             <div className="space-y-4">
// //                 <div className="flex items-center gap-4">
// //                     <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-300 text-white transform rotate-3">
// //                         <Camera size={32} />
// //                     </div>
// //                     <div>
// //                         <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Photo Studio</h2>
// //                         <p className="text-fuchsia-500 font-bold text-xs tracking-[0.2em] mt-1 uppercase">AI Product Enhancement</p>
// //                     </div>
// //                 </div>

// //                 <p className="text-gray-600 text-lg leading-relaxed">
// //                     Transform raw product photos into professional, listing-ready visuals with automated lighting correction, background styling, and marketplace optimization.
// //                 </p>
// //             </div>

// //             {/* Steps List */}
// //             <div className="space-y-4 pt-2">
// //                 <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Implementation Steps</div>
// //                 <StepCard
// //                     icon={Upload}
// //                     title="Upload raw product photos"
// //                     description="Simply drag and drop your photos"
// //                     colorClass="bg-gradient-to-br from-pink-400 to-fuchsia-500"
// //                 />
// //                 <StepCard
// //                     icon={Wand2}
// //                     title="Enhance lighting & backgrounds"
// //                     description="Improve lighting, background, and shadows"
// //                     colorClass="bg-gradient-to-br from-pink-400 to-fuchsia-500"
// //                 />
// //                 <StepCard
// //                     icon={ImageIcon}
// //                     title="Generate listing-ready visuals"
// //                     description="Create high-conversion photos for marketplace listings"
// //                     colorClass="bg-gradient-to-br from-pink-400 to-fuchsia-500"
// //                 />
// //             </div>

// //             {/* CTA Button */}
// //             <button className="mt-4 px-8 py-4 bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white font-bold text-lg rounded-xl shadow-xl shadow-fuchsia-500/30 transition-transform hover:-translate-y-1 w-full sm:w-auto">
// //                 Get Started
// //             </button>
// //         </div>

// //         {/* RIGHT COLUMN: Visuals */}
// //         <div className="w-full lg:w-[55%] relative mt-10 lg:mt-0">

// //             {/* Marketplace Logos */}
// //             <div className="absolute -top-12 right-0 flex gap-6 opacity-80 grayscale hover:grayscale-0 transition-all">
// //                 <span className="font-bold text-lg text-slate-700">amazon</span>
// //                 <span className="font-bold text-lg text-blue-600">Flipkart</span>
// //                 <div className="flex items-center gap-1 font-bold text-lg text-slate-700"><span className="text-green-500">🛍️</span>Shopify</div>
// //             </div>

// //             {/* Main Monitor Mockup */}
// //             <div className="relative z-10 mx-auto">
// //                 {/* Monitor Frame */}
// //                 <div className="bg-white rounded-t-2xl shadow-2xl border-[6px] border-gray-800 border-b-0 h-[320px] relative overflow-hidden">
// //                     {/* Screen Content */}
// //                     <img
// //                         src="https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=800&q=80"
// //                         alt="Product Studio"
// //                         className="w-full h-full object-cover"
// //                     />
// //                     {/* Play Button Overlay */}
// //                     <div className="absolute inset-0 flex items-center justify-center">
// //                         <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 shadow-lg">
// //                             <div className="ml-1 w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent"></div>
// //                         </div>
// //                     </div>
// //                 </div>
// //                 {/* Monitor Chin */}
// //                 <div className="bg-gray-200 h-8 w-full border-x-[6px] border-b-[6px] border-gray-800 rounded-b-xl flex items-center justify-center">
// //                     <div className="text-2xl"></div>
// //                 </div>
// //                 {/* Monitor Stand */}
// //                 <div className="bg-gray-300 h-16 w-32 mx-auto mt-[-2px] shadow-inner perspective-[500px] transform rotate-x-12"></div>
// //                 <div className="bg-gray-200 h-2 w-48 mx-auto rounded-full shadow-lg mt-[-5px]"></div>

// //                 {/* Floating Card 1: Upload Raw */}
// //                 <div className="absolute top-10 -left-6 lg:-left-12 bg-white p-2 rounded-xl shadow-xl w-40 animate-float-slow">
// //                     <div className="absolute -top-3 -left-3 w-8 h-8 bg-pink-500 text-white font-bold rounded-lg flex items-center justify-center shadow-lg transform -rotate-6">1</div>
// //                     <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80" className="rounded-lg mb-2 h-24 w-full object-cover" alt="Raw" />
// //                     <div className="text-[10px] font-bold text-center text-gray-700">Upload Raw Photos</div>
// //                 </div>

// //                 {/* Floating Card 2: Enhance */}
// //                 <div className="absolute bottom-32 -left-2 lg:-left-8 bg-white p-2 rounded-xl shadow-xl w-40 animate-float-slower">
// //                     <div className="absolute -top-3 -left-3 w-8 h-8 bg-fuchsia-500 text-white font-bold rounded-lg flex items-center justify-center shadow-lg transform rotate-3">2</div>
// //                     <img src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=200&q=80" className="rounded-lg mb-2 h-24 w-full object-cover" alt="Enhanced" />
// //                     <div className="text-[10px] font-bold text-center text-gray-700">Enhance Lighting</div>
// //                 </div>
// //             </div>

// //             {/* Bottom Flow Process */}
// //             <div className="mt-8 bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-lg flex justify-between items-center text-center relative overflow-hidden">
// //                 <div className="absolute inset-0 bg-gradient-to-r from-pink-50/50 to-purple-50/50 -z-10"></div>

// //                 <div className="flex flex-col items-center">
// //                     <Camera className="text-slate-700 mb-1" size={20} />
// //                     <span className="text-[10px] font-bold text-slate-600">1. Upload Photos</span>
// //                 </div>
// //                 <ArrowRight className="text-gray-300" size={16} />
// //                 <div className="flex flex-col items-center">
// //                     <Wand2 className="text-fuchsia-600 mb-1" size={20} />
// //                     <span className="text-[10px] font-bold text-slate-600">AI Enhancements</span>
// //                 </div>
// //                 <ArrowRight className="text-gray-300" size={16} />
// //                 <div className="flex flex-col items-center">
// //                     <Sparkles className="text-orange-400 mb-1" size={20} />
// //                     <span className="text-[10px] font-bold text-slate-600">3. Publish & Sell!</span>
// //                 </div>
// //                 <ArrowRight className="text-gray-300" size={16} />
// //                 <div className="flex flex-col items-center">
// //                     <ShoppingCart className="text-pink-600 mb-1" size={20} />
// //                     <span className="text-[10px] font-bold text-slate-600">Publish & Sell!</span>
// //                 </div>
// //             </div>

// //             {/* Bottom Features Grid */}
// //             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
// //                 {[
// //                     { icon: Sun, label: "Lighting Correction", color: "text-pink-500" },
// //                     { icon: Palette, label: "Background Styling", color: "text-purple-500" },
// //                     { icon: Sparkles, label: "Quality Enhancement", color: "text-fuchsia-500" },
// //                     { icon: ShoppingCart, label: "E-commerce Optimization", color: "text-slate-600" }
// //                 ].map((feature, idx) => (
// //                     <div key={idx} className="bg-white/70 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-white/60 flex flex-col items-center text-center gap-2 hover:bg-white transition-colors">
// //                         <feature.icon className={`${feature.color}`} size={24} />
// //                         <span className="text-xs font-bold text-gray-700 leading-tight">{feature.label}</span>
// //                     </div>
// //                 ))}
// //             </div>

// //         </div>
// //     </div>
// // );

// // /* --- MAIN APP WRAPPER --- */
// // const App = () => {
// //     const [activeTab, setActiveTab] = useState('Photo Studio');

// //     return (
// //         <div className={`min-h-screen font-sans relative overflow-hidden py-10 px-4 sm:px-8 transition-colors duration-700
// //       ${activeTab === 'Virtual Trial Room' ? 'bg-gradient-to-br from-blue-50 via-white to-cyan-50' : 'bg-[#fdf4ff]'}
// //     `}>

// //             {/* Background Magic/Blobs */}
// //             <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
// //                 {activeTab === 'Virtual Trial Room' ? (
// //                     <>
// //                         <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-[120px]"></div>
// //                         <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-cyan-50/60 rounded-full blur-[100px]"></div>
// //                     </>
// //                 ) : (
// //                     <>
// //                         {/* Dreamy Purple/Pink Background */}
// //                         <div className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] bg-purple-200/40 rounded-full blur-[130px] mix-blend-multiply"></div>
// //                         <div className="absolute top-[20%] right-[-20%] w-[800px] h-[800px] bg-pink-200/40 rounded-full blur-[130px] mix-blend-multiply"></div>
// //                         <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-fuchsia-100/60 rounded-full blur-[100px]"></div>

// //                         {/* Sparkles Overlay (simulated via CSS) */}
// //                         <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
// //                     </>
// //                 )}
// //             </div>

// //             <div className="max-w-7xl mx-auto relative z-10">

// //                 {/* Navigation Tabs */}
// //                 <div className="flex flex-wrap justify-center gap-4 mb-16">
// //                     <TabButton
// //                         active={activeTab === 'Virtual Trial Room'}
// //                         label="Virtual Trial Room"
// //                         theme="blue"
// //                         onClick={() => setActiveTab('Virtual Trial Room')}
// //                     />
// //                     <TabButton
// //                         active={activeTab === 'Photo Studio'}
// //                         label="Photo Studio"
// //                         theme="pink"
// //                         onClick={() => setActiveTab('Photo Studio')}
// //                     />
// //                     <TabButton
// //                         active={activeTab === 'Advertisement'}
// //                         label="Advertisement"
// //                         theme="blue"
// //                         onClick={() => setActiveTab('Advertisement')}
// //                     />
// //                 </div>

// //                 {/* Content Switcher */}
// //                 <div className="transition-opacity duration-500 ease-in-out">
// //                     {activeTab === 'Virtual Trial Room' && <VirtualTrialRoom />}
// //                     {activeTab === 'Photo Studio' && <PhotoStudio />}
// //                     {activeTab === 'Advertisement' && <div className="text-center text-gray-400 py-20">Advertisement Module Coming Soon</div>}
// //                 </div>

// //             </div>
// //         </div>
// //     );
// // };

// // export default App;

// import React, { useState } from 'react';
// import {
//     /* Icons for previous sections */
//     Camera, Upload, Wand2, Image as ImageIcon, ChevronRight,
//     Sun, Palette, Sparkles, ShoppingCart, ArrowRight,
//     Activity, User, UploadCloud, Zap, Settings, Monitor,
//     MousePointer2, Shirt, BrainCircuit, Move, ShoppingBag, ScanLine,
//     /* New Icons for Advertisement */
//     Megaphone, Eraser, Video, Clapperboard, Play, Youtube,
//     Facebook, Instagram, Twitter, Chrome
// } from 'lucide-react';

// /* --- SHARED COMPONENTS --- */

// const TabButton = ({ active, label, theme, onClick }) => {
//     const styles = {
//         blue: active ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-white/80 text-gray-600 border-gray-100 hover:bg-white',
//         pink: active ? 'bg-fuchsia-500 text-white shadow-fuchsia-200' : 'bg-white/80 text-gray-600 border-gray-100 hover:bg-white',
//         orange: active ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-orange-200' : 'bg-white/80 text-gray-600 border-gray-100 hover:bg-white'
//     };

//     return (
//         <button
//             onClick={onClick}
//             className={`
//         flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm backdrop-blur-sm
//         ${theme === 'blue' ? styles.blue : theme === 'pink' ? styles.pink : styles.orange}
//       `}
//         >
//             {/* Status Dot for inactive tabs */}
//             {!active && (
//                 <div className={`w-2 h-2 rounded-full
//           ${label === 'Photo Studio' ? 'bg-fuchsia-400' :
//                         label === 'Advertisement' ? 'bg-orange-400' : 'bg-blue-400'
//                     }`}
//                 ></div>
//             )}
//             {label}
//         </button>
//     );
// };

// const StepCard = ({ icon: Icon, title, description, colorClass }) => (
//     <div className="flex items-center p-4 bg-white/90 backdrop-blur-md border border-white/50 rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer group">
//         <div className={`flex-shrink-0 w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
//             <Icon size={24} strokeWidth={2.5} />
//         </div>
//         <div className="ml-4 flex-grow">
//             <h4 className="text-gray-900 font-bold text-base">{title}</h4>
//             <p className="text-gray-500 text-xs sm:text-sm mt-0.5 leading-tight">{description}</p>
//         </div>
//         <ChevronRight className="text-gray-300 group-hover:text-gray-600 transition-colors" size={20} />
//     </div>
// );

// /* --- SECTION 1: VIRTUAL TRIAL ROOM --- */
// const VirtualTrialRoom = () => (
//     <div className="flex flex-col lg:flex-row items-start gap-16 relative z-10 animate-fade-in">
//         <div className="w-full lg:w-[45%] space-y-8 pt-4">
//             <div className="space-y-4">
//                 <div className="flex items-center gap-4">
//                     <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-300 text-white transform -rotate-3">
//                         <Activity size={32} />
//                     </div>
//                     <div>
//                         <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Virtual Trial Room</h2>
//                         <p className="text-blue-500 font-bold text-xs tracking-[0.2em] mt-1 uppercase">AI-Powered Fashion Previews</p>
//                     </div>
//                 </div>
//                 <p className="text-gray-600 text-lg leading-relaxed">
//                     Generate instant, photo-realistic previews of your garments on diverse AI-generated models.
//                 </p>
//             </div>
//             <div className="space-y-4 pt-2">
//                 <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Implementation Steps</div>
//                 <StepCard icon={User} title="Choose AI model" description="Select diverse AI-generated models" colorClass="bg-blue-500" />
//                 <StepCard icon={UploadCloud} title="Upload garment" description="Easily upload photos of your clothing" colorClass="bg-blue-500" />
//                 <StepCard icon={Zap} title="Instant preview" description="Get photo-realistic previews in seconds" colorClass="bg-blue-500" />
//             </div>
//             <button className="mt-4 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg rounded-xl shadow-xl shadow-blue-500/30 w-full sm:w-auto transition-transform hover:-translate-y-1">
//                 Get Started
//             </button>
//         </div>
//         <div className="w-full lg:w-[55%] relative mt-10 lg:mt-0">
//             <div className="relative bg-white rounded-2xl shadow-2xl border-4 border-gray-100 overflow-hidden z-10 h-[400px]">
//                 <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-2">
//                     <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-400"></div><div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div><div className="w-2.5 h-2.5 rounded-full bg-green-400"></div></div>
//                 </div>
//                 <div className="flex h-full">
//                     <div className="w-1/3 bg-white border-r border-gray-100 p-4 space-y-4">
//                         <div className="h-2 w-20 bg-blue-100 rounded mb-4"></div>
//                         <div className="h-8 w-full bg-blue-500 rounded text-white text-xs font-bold flex items-center justify-center">Generate</div>
//                     </div>
//                     <div className="w-2/3 bg-slate-50 relative">
//                         <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover opacity-90" alt="Model" />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     </div>
// );

// /* --- SECTION 2: PHOTO STUDIO --- */
// const PhotoStudio = () => (
//     <div className="flex flex-col lg:flex-row items-start gap-12 relative z-10 animate-fade-in">
//         <div className="w-full lg:w-[45%] space-y-8 pt-4">
//             <div className="space-y-4">
//                 <div className="flex items-center gap-4">
//                     <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-300 text-white transform rotate-3">
//                         <Camera size={32} />
//                     </div>
//                     <div>
//                         <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Photo Studio</h2>
//                         <p className="text-fuchsia-500 font-bold text-xs tracking-[0.2em] mt-1 uppercase">AI Product Enhancement</p>
//                     </div>
//                 </div>
//                 <p className="text-gray-600 text-lg leading-relaxed">
//                     Transform raw product photos into professional, listing-ready visuals with automated lighting correction.
//                 </p>
//             </div>
//             <div className="space-y-4 pt-2">
//                 <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Implementation Steps</div>
//                 <StepCard icon={Upload} title="Upload raw photos" description="Simply drag and drop your photos" colorClass="bg-gradient-to-br from-pink-400 to-fuchsia-500" />
//                 <StepCard icon={Wand2} title="Enhance lighting" description="Improve lighting, background, and shadows" colorClass="bg-gradient-to-br from-pink-400 to-fuchsia-500" />
//                 <StepCard icon={ImageIcon} title="Generate visuals" description="Create high-conversion photos" colorClass="bg-gradient-to-br from-pink-400 to-fuchsia-500" />
//             </div>
//             <button className="mt-4 px-8 py-4 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white font-bold text-lg rounded-xl shadow-xl shadow-fuchsia-500/30 transition-transform hover:-translate-y-1 w-full sm:w-auto">
//                 Get Started
//             </button>
//         </div>
//         <div className="w-full lg:w-[55%] relative mt-10 lg:mt-0">
//             <div className="relative z-10 mx-auto">
//                 <div className="bg-white rounded-t-2xl shadow-2xl border-[6px] border-gray-800 border-b-0 h-[320px] relative overflow-hidden">
//                     <img src="https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=800&q=80" alt="Product Studio" className="w-full h-full object-cover" />
//                 </div>
//                 <div className="bg-gray-200 h-8 w-full border-x-[6px] border-b-[6px] border-gray-800 rounded-b-xl flex items-center justify-center"><div className="text-2xl"></div></div>
//                 <div className="bg-gray-300 h-16 w-32 mx-auto mt-[-2px] shadow-inner perspective-[500px] transform rotate-x-12"></div>
//             </div>
//         </div>
//     </div>
// );

// /* --- SECTION 3: ADVERTISEMENT (New Code) --- */
// const Advertisement = () => (
//     <div className="flex flex-col relative z-10 animate-fade-in">

//         <div className="flex flex-col lg:flex-row items-start gap-12">
//             {/* LEFT COLUMN */}
//             <div className="w-full lg:w-[40%] space-y-8 pt-4">
//                 {/* Header */}
//                 <div className="space-y-4">
//                     <div className="flex items-center gap-4">
//                         <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-300 text-white transform -rotate-6">
//                             <Megaphone size={30} fill="currentColor" className="text-white" />
//                         </div>
//                         <div>
//                             <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Advertisement</h2>
//                             <p className="text-orange-500 font-bold text-xs tracking-[0.2em] mt-1 uppercase">AI Ad Creative Generation</p>
//                         </div>
//                     </div>

//                     <p className="text-gray-700 text-lg leading-relaxed font-medium">
//                         Create high-converting marketing visuals and promotional videos using AI-generated models, environments, and automated creative production workflows.
//                     </p>
//                 </div>

//                 {/* Steps */}
//                 <div className="space-y-4 pt-2">
//                     <div className="text-xs font-bold text-orange-900/50 uppercase tracking-wider mb-2">Implementation Steps</div>
//                     <StepCard
//                         icon={UploadCloud}
//                         title="Upload product image"
//                         description="Simply upload your product photo"
//                         colorClass="bg-gradient-to-br from-orange-400 to-red-500"
//                     />
//                     <StepCard
//                         icon={Eraser}
//                         title="Clean & prepare visuals"
//                         description="Enhance, isolate & refresh your product"
//                         colorClass="bg-gradient-to-br from-orange-400 to-red-500"
//                     />
//                     <StepCard
//                         icon={Video}
//                         title="Generate AI ad creatives"
//                         description="Create stunning ads photos & videos"
//                         colorClass="bg-gradient-to-br from-orange-400 to-red-500"
//                     />
//                 </div>

//                 {/* CTA */}
//                 <button className="mt-4 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-lg rounded-xl shadow-xl shadow-orange-500/30 transition-transform hover:-translate-y-1 w-full sm:w-auto ring-4 ring-orange-200">
//                     Get Started
//                 </button>
//             </div>

//             {/* RIGHT COLUMN: Complex Visuals */}
//             <div className="w-full lg:w-[60%] relative mt-16 lg:mt-0">

//                 {/* Text Above Monitor */}
//                 <h3 className="text-center text-xl sm:text-2xl font-bold text-white mb-6 drop-shadow-md bg-black/20 backdrop-blur-sm rounded-full py-2 px-6 inline-block mx-auto w-full border border-white/10">
//                     Turn Products into High-Converting Ads with AI.
//                 </h3>

//                 <div className="relative flex items-end justify-center">

//                     {/* Floating Flow Cards (Left of Monitor) */}
//                     <div className="absolute top-10 left-[-20px] sm:left-0 z-30 flex flex-col gap-12 pointer-events-none hidden sm:flex">
//                         {/* Card 1: Input */}
//                         <div className="bg-white/95 p-2 rounded-lg shadow-xl w-32 transform -rotate-12 border-2 border-orange-100 animate-float-slow">
//                             <div className="relative">
//                                 <span className="absolute -top-2 -left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded">1. Upload</span>
//                                 <img src="https://images.unsplash.com/photo-1621460245217-37fb2778da5c?auto=format&fit=crop&w=150" className="rounded mb-1 h-20 w-full object-cover" alt="Can with fruit" />
//                             </div>
//                             <div className="text-[9px] font-bold text-center text-gray-600">Product Image</div>
//                         </div>

//                         {/* Arrow SVG connecting cards */}
//                         <svg className="absolute top-[90px] left-[40px] w-12 h-16 text-white drop-shadow-lg opacity-80" viewBox="0 0 50 50">
//                             <path d="M 10 10 Q 25 25 10 40" fill="none" stroke="currentColor" strokeWidth="3" markerEnd="url(#arrowhead)" />
//                         </svg>

//                         {/* Card 2: Processed */}
//                         <div className="bg-white/95 p-2 rounded-lg shadow-xl w-32 transform rotate-6 border-2 border-orange-100 animate-float-slower ml-8">
//                             <div className="relative">
//                                 <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded">2. Clean Up</span>
//                                 {/* Using a similar image but pretending it's isolated/clean */}
//                                 <img src="https://images.unsplash.com/photo-1621460245217-37fb2778da5c?auto=format&fit=crop&w=150" className="rounded mb-1 h-20 w-full object-cover scale-110" alt="Isolated Can" />
//                             </div>
//                             <div className="text-[9px] font-bold text-center text-gray-600">Isolate Product</div>
//                         </div>

//                         {/* Arrow into Monitor */}
//                         <svg className="absolute top-[210px] left-[90px] w-24 h-12 text-white drop-shadow-lg opacity-80" viewBox="0 0 100 50">
//                             <path d="M 0 25 Q 50 25 90 25" fill="none" stroke="currentColor" strokeWidth="3" />
//                             <path d="M 85 20 L 95 25 L 85 30" fill="currentColor" />
//                         </svg>
//                     </div>

//                     {/* Main Monitor */}
//                     <div className="relative z-20">
//                         <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-2xl shadow-2xl border-[4px] border-gray-700 border-b-0 w-full max-w-lg h-[280px] sm:h-[320px] relative overflow-hidden group">
//                             {/* Video Content */}
//                             <img
//                                 src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80"
//                                 className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
//                                 alt="Party Ad"
//                             />

//                             {/* Video UI Overlay */}
//                             <div className="absolute inset-0 bg-black/20 flex flex-col justify-between p-4">
//                                 <div className="flex justify-between text-white/80 text-xs">
//                                     <span>REC ●</span>
//                                     <span>00:15 / 00:30</span>
//                                 </div>
//                                 <div className="self-center">
//                                     <button className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 shadow-xl hover:bg-white/30 transition-all hover:scale-110">
//                                         <Play fill="white" className="ml-1 text-white" size={32} />
//                                         {/* Pulse effect */}
//                                         <div className="absolute inset-0 rounded-full border border-white/50 animate-ping opacity-50"></div>
//                                     </button>
//                                 </div>
//                                 <div className="h-1 bg-white/30 rounded-full overflow-hidden">
//                                     <div className="w-1/2 h-full bg-orange-500"></div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Monitor Chin */}
//                         <div className="bg-gray-300 h-10 w-full max-w-lg border-x-[4px] border-b-[4px] border-gray-700 rounded-b-xl flex items-center justify-center relative shadow-xl">
//                             <div className="text-xl text-gray-500"></div>

//                             {/* Social Icons Dock */}
//                             <div className="absolute -bottom-6 flex gap-3 bg-white px-4 py-2 rounded-2xl shadow-lg border border-gray-100 transform scale-90 sm:scale-100">
//                                 <div className="p-1.5 bg-gray-100 rounded-lg"><span className="font-bold text-gray-800 text-xs">a</span></div>
//                                 <div className="p-1.5 bg-blue-100 rounded-lg"><Facebook size={16} className="text-blue-600" fill="currentColor" /></div>
//                                 <div className="p-1.5 bg-white border border-gray-200 rounded-lg"><Chrome size={16} className="text-red-500" /></div>
//                                 <div className="p-1.5 bg-red-100 rounded-lg"><Youtube size={16} className="text-red-600" /></div>
//                             </div>
//                         </div>

//                         {/* Stand */}
//                         <div className="bg-gradient-to-b from-gray-400 to-gray-300 h-16 w-32 mx-auto mt-[-2px] shadow-inner perspective-[500px] transform rotate-x-12 relative z-0"></div>
//                         <div className="bg-gray-800/20 h-4 w-48 mx-auto rounded-[100%] blur-md mt-[-8px]"></div>
//                     </div>

//                 </div>
//             </div>
//         </div>

//         {/* Bottom Feature Cards (Glassmorphism) */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16 sm:mt-24">
//             {[
//                 { icon: User, title: "AI Models", desc: "Select AI-generated fashion models for ads", color: "text-red-500" },
//                 { icon: ImageIcon, title: "Ad Environments", desc: "Pick engaging backgrounds tailored for products", color: "text-orange-500" },
//                 { icon: Wand2, title: "Automated Editing", desc: "Clean up & enhance product visuals automatically", color: "text-pink-500" },
//                 { icon: Clapperboard, title: "Video Generation", desc: "Convert product ad creative into videos effortlessly", color: "text-rose-500" }
//             ].map((item, idx) => (
//                 <div key={idx} className="bg-white/40 backdrop-blur-md border border-white/40 p-4 rounded-xl flex items-start gap-3 hover:bg-white/60 transition-colors shadow-lg shadow-orange-900/5 group">
//                     <div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
//                         <item.icon className={item.color} size={24} />
//                     </div>
//                     <div>
//                         <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
//                         <p className="text-[11px] text-gray-700 font-medium leading-tight mt-1">{item.desc}</p>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     </div>
// );

// /* --- MAIN APP WRAPPER --- */
// const App = () => {
//     const [activeTab, setActiveTab] = useState('Advertisement');

//     /* Dynamic Background Logic */
//     const getBackground = () => {
//         switch (activeTab) {
//             case 'Virtual Trial Room': return 'bg-gradient-to-br from-blue-50 via-white to-cyan-50';
//             case 'Photo Studio': return 'bg-[#fdf4ff]';
//             case 'Advertisement': return 'bg-[#fff0e6]'; // Fallback color
//             default: return 'bg-white';
//         }
//     };

//     return (
//         <div className={`min-h-screen font-sans relative overflow-hidden py-10 px-4 sm:px-8 transition-colors duration-700 ${getBackground()}`}>

//             {/* Background Effects Layer */}
//             <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">

//                 {/* Advertisement Specific Background (Sunset/Party Vibe) */}
//                 {activeTab === 'Advertisement' && (
//                     <>
//                         {/* Main Gradient Mesh */}
//                         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-100 via-rose-100 to-indigo-100 opacity-80"></div>

//                         {/* Warm Blobs */}
//                         <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-orange-300/30 rounded-full blur-[100px] mix-blend-multiply"></div>
//                         <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-red-300/30 rounded-full blur-[100px] mix-blend-multiply"></div>
//                         <div className="absolute top-[40%] left-[30%] w-[500px] h-[500px] bg-yellow-200/20 rounded-full blur-[120px]"></div>

//                         {/* Bokeh/Sparkles Effect */}
//                         <div className="absolute inset-0" style={{
//                             backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
//                             backgroundSize: '40px 40px',
//                             opacity: 0.4
//                         }}></div>
//                     </>
//                 )}

//                 {/* Photo Studio Background */}
//                 {activeTab === 'Photo Studio' && (
//                     <>
//                         <div className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] bg-purple-200/40 rounded-full blur-[130px] mix-blend-multiply"></div>
//                         <div className="absolute top-[20%] right-[-20%] w-[800px] h-[800px] bg-pink-200/40 rounded-full blur-[130px] mix-blend-multiply"></div>
//                     </>
//                 )}

//                 {/* Virtual Trial Room Background */}
//                 {activeTab === 'Virtual Trial Room' && (
//                     <>
//                         <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-[120px]"></div>
//                         <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-cyan-50/60 rounded-full blur-[100px]"></div>
//                     </>
//                 )}
//             </div>

//             <div className="max-w-7xl mx-auto relative z-10">

//                 {/* Navigation Tabs */}
//                 <div className="flex flex-wrap justify-center gap-4 mb-12 sm:mb-16 bg-white/30 backdrop-blur-md p-2 rounded-full inline-flex mx-auto absolute left-1/2 transform -translate-x-1/2 shadow-sm border border-white/40 z-50">
//                     <TabButton
//                         active={activeTab === 'Virtual Trial Room'}
//                         label="Virtual Trial Room"
//                         theme="blue"
//                         onClick={() => setActiveTab('Virtual Trial Room')}
//                     />
//                     <TabButton
//                         active={activeTab === 'Photo Studio'}
//                         label="Photo Studio"
//                         theme="pink"
//                         onClick={() => setActiveTab('Photo Studio')}
//                     />
//                     <TabButton
//                         active={activeTab === 'Advertisement'}
//                         label="Advertisement"
//                         theme="orange"
//                         onClick={() => setActiveTab('Advertisement')}
//                     />
//                 </div>

//                 {/* Push content down to accommodate the centered tab bar */}
//                 <div className="mt-20 sm:mt-24 transition-all duration-500 ease-in-out">
//                     {activeTab === 'Virtual Trial Room' && <VirtualTrialRoom />}
//                     {activeTab === 'Photo Studio' && <PhotoStudio />}
//                     {activeTab === 'Advertisement' && <Advertisement />}
//                 </div>

//             </div>

//             <style jsx>{`
//         @keyframes float-slow {
//           0%, 100% { transform: translateY(0px) rotate(-12deg); }
//           50% { transform: translateY(-10px) rotate(-12deg); }
//         }
//         @keyframes float-slower {
//           0%, 100% { transform: translateY(0px) rotate(6deg); }
//           50% { transform: translateY(-15px) rotate(6deg); }
//         }
//         .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
//         .animate-float-slower { animation: float-slower 5s ease-in-out infinite; }
//         .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//       `}</style>
//         </div>
//     );
// };

// export default App;

import { useState, useEffect, useRef } from "react";
import { TrendingUp, ImageIcon, Paintbrush, Upload, Video } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { motion } from "motion/react";
import SectionHeader from "./SectionHeader";
import {
	Advertisement,
	PhotoStudio,
	VirtualTrialRoom,
} from "./KeyFeatureItems";

const AIFeatures = () => {
	const { theme } = useTheme();
	// const features = [
	// 	{
	// 		title: "Virtual Trial Room",
	// 		subtitle: "AI-Powered Fashion Previews",
	// 		description:
	// 			"Generate instant, photo-realistic previews of your garments on diverse AI-generated models. Eliminate traditional photoshoot limitations and accelerate your fashion workflow.",
	// 		steps: [
	// 			{ icon: Paintbrush, text: "Choose AI model representation" },
	// 			{ icon: Upload, text: "Upload garment images easily" },
	// 			{ icon: ImageIcon, text: "Instant preview generation" },
	// 		],
	// 		image: "./trial_room.jpeg",
	// 		accentColor: "from-blue-500 to-cyan-500",
	// 	},
	// 	{
	// 		title: "Photo Studio",
	// 		subtitle: "AI Product Enhancement",
	// 		description:
	// 			"Transform raw product photos into professional, listing-ready visuals with automated lighting correction, background styling, and marketplace optimization.",
	// 		steps: [
	// 			{ icon: Upload, text: "Upload raw product photos" },
	// 			{ icon: Paintbrush, text: "Enhance lighting & backgrounds" },
	// 			{ icon: ImageIcon, text: "Generate listing-ready visuals" },
	// 		],
	// 		image: "./photo_studio.jpeg",
	// 		accentColor: "from-purple-500 to-pink-500",
	// 	},
	// 	{
	// 		title: "Advertisement",
	// 		subtitle: "AI Ad Creative Generation",
	// 		description:
	// 			"Create high-converting marketing visuals and promotional videos using AI-generated models, environments, and automated creative production workflows.",
	// 		steps: [
	// 			{ icon: Upload, text: "Upload product image" },
	// 			{ icon: Paintbrush, text: "Clean & prepare product visuals" },
	// 			{ icon: ImageIcon, text: "Generate AI ad creatives" },
	// 			{ icon: Video, text: "Convert creatives into ad videos" },
	// 		],
	// 		image: "./ad.jpeg",
	// 		accentColor: "from-orange-500 to-red-500",
	// 	},
	// ];
	const features = [
		{
			title: "Virtual Trial Room",
			children: <VirtualTrialRoom />,
			accentColor: "from-blue-500 to-cyan-500",
		},
		{
			title: "Photo Studio",
			children: <PhotoStudio />,
			accentColor: "from-purple-500 to-pink-500",
		},
		{
			title: "Advertisement",
			children: <Advertisement />,
			accentColor: "from-orange-500 to-red-500",
		},
	];
	const [activeIndex, setActiveIndex] = useState(0);
	const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

	// Scroll-synced tab switching via IntersectionObserver
	useEffect(() => {
		const observers: IntersectionObserver[] = [];

		sectionRefs.current.forEach((section, index) => {
			if (!section) return;
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							setActiveIndex(index);
						}
					});
				},
				{
					// Adjust margin to trigger when the card hits the sticky position
					rootMargin: "-250px 0px -60% 0px",
					threshold: 0.1,
				},
			);
			observer.observe(section);
			observers.push(observer);
		});

		return () => observers.forEach((obs) => obs.disconnect());
	}, []);

	const handleTabClick = (index: number) => {
		setActiveIndex(index);
		sectionRefs.current[index]?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	};

	return (
		<div className="min-h-screen bg-background dark:bg-gradient-to-br from-slate-50 to-slate-100 p-8">
			{theme == "dark" && (
				<div className="absolute inset-0  dark:bg-gradient-to-br from-cyan-950 via-black to-sky-950"></div>
			)}
			<div className="max-w-[100vw] mx-auto ">
				{/* Scrollable Content Sections */}
				<div className="mt-8 relative z-[1] flex flex-col items-center max-w-[90vw] mx-auto pb-[10vh]">
					{features.map((feature, index) => (
						<div
							key={index}
							ref={(el) => {
								sectionRefs.current[index] = el;
							}}
							className="sticky top-[200px] w-full mb-[10vh] scroll-mt-[300px]"
							style={{
								zIndex: index + 10,
							}}
						>
							{feature.children}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default AIFeatures;
