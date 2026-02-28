import React, { FC, ReactNode, useEffect, useRef } from "react";
import {
	Camera,
	Image as ImageIcon,
	Download,
	ShoppingBag,
	Maximize2,
	Upload,
	Mic,
	Clapperboard,
	Sparkles,
	Play,
	Pause,
	Music,
	Wand2,
	ArrowRight,
	Video,
	MoreHorizontal,
	Layers,
	CheckCircle2,
} from "lucide-react";

/* --- SUB-COMPONENT: PROCESS STEP --- */
const ProcessStep: FC<{
	icon: any;
	title: string;
	desc: string;
	stepNum: number;
}> = ({ icon: Icon, title, desc, stepNum }) => (
	<div className="flex items-start gap-4 group cursor-default">
		{/* Icon/Number Container */}
		<div className="relative flex-shrink-0">
			<div className="w-10 h-10 rounded-xl bg-white border border-brand shadow-sm flex items-center justify-center text-brand  transition-all duration-300">
				<Icon size={18} color={"var(--brand)"} strokeWidth={2} />
			</div>
			{/* Connecting Line (except for last item) */}
			{stepNum !== 3 && (
				<div className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-16 bg-brand-color transition-colors delay-100"></div>
			)}
		</div>

		{/* Text Content */}
		<div className="pt-1 pb-4">
			<h4 className="text-base font-bold text-foreground group-hover:text-brand-color transition-colors">
				{title}
			</h4>
			<p className="text-sm text-muted-foreground leading-relaxed mt-1 max-w-xs">
				{desc}
			</p>
		</div>
	</div>
);

/* --- MAIN COMPONENT --- */
export const VirtualTrialHighlight = () => {
	return (
		<section className="py-10 h-full md:h-[85vh] flex flex-col justify-center items-center px-6 bg-background">
			<div className="max-w-full mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center place-items-center">
					{/* --- LEFT: CONTEXT & STEPS --- */}
					<div className="flex flex-col justify-between gap-2">
						{/* Header */}
						<div className="space-y-3">
							<div className="inline-flex w-fit items-center gap-2  px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 shadow-sm">
								<Sparkles size={14} className="text-pink-600" />
								<span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
									AI Video Generator
								</span>
							</div>

							<h2 className="text-3xl md:text-4xl font-extrabold  tracking-tight">
								From Raw Sketch to <br />
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
									Marketplace Ready
								</span>
							</h2>
							<p className=" text-base leading-relaxed max-w-md">
								Experience the fastest workflow in fashion e-commerce. Upload a
								garment and get photorealistic model shoots instantly.
							</p>
						</div>

						{/* Steps Flow */}
						<div className="mt-0">
							<ProcessStep
								stepNum={1}
								icon={Upload}
								title="Upload Garment"
								desc="Simply drag & drop your flat lay or ghost mannequin photo."
							/>
							<ProcessStep
								stepNum={2}
								icon={Sparkles}
								title="AI Model Try-On"
								desc="Our engine maps the fabric to AI models with perfect physics."
							/>
							<ProcessStep
								stepNum={3}
								icon={ShoppingBag}
								title="Export for Sales"
								desc="Download high-res assets optimized for Amazon, Myntra & Shopify."
							/>
						</div>

						{/* CTA */}
						<div>
							<button className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-lg shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5">
								Try Virtual Studio <ArrowRight size={16} />
							</button>
						</div>
					</div>

					{/* --- RIGHT: FRAMED VIDEO / VISUAL --- */}
					<div className="relative lg:h-[500px] flex items-center justify-center">
						{/* Abstract Background Blob */}
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/30 rounded-full blur-3xl pointer-events-none"></div>

						{/* The "Video" Frame Card */}
						<div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 transform rotate-1 hover:rotate-0 transition-transform duration-500 ease-out">
							{/* Browser/App Header */}
							<div className="flex items-center gap-2 px-3 py-2 border-b border-slate-50 mb-1">
								<div className="flex gap-1.5">
									<div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
									<div className="w-2.5 h-2.5 rounded-full bg-amber-400/80"></div>
									<div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
								</div>
								<div className="text-[10px] text-slate-400 font-medium ml-2">
									AI Studio Preview
								</div>
							</div>

							{/* Video Placeholder Content */}
							<div className="relative aspect-[4/5] bg-slate-100 rounded-xl overflow-hidden group cursor-pointer">
								<img
									src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
									alt="Virtual Try On Demo"
									className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
								/>

								{/* Play Button Overlay */}
								<div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
									<div className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
										<Play className="text-white fill-white ml-1" size={24} />
									</div>
								</div>

								{/* Floating "Processing" UI Elements */}
								<div className="absolute top-4 left-4 right-4 flex justify-between items-center">
									<div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
										<span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
										<span className="text-[10px] font-bold text-white tracking-wide">
											AI RENDERING
										</span>
									</div>
								</div>
							</div>

							{/* Floating "Marketplace Ready" Badge */}
							<div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex flex-col gap-2 animate-bounce-slow">
								<div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
									<CheckCircle2 size={14} className="text-green-500" />
									Listing Ready
								</div>
								<div className="flex items-center gap-2 opacity-60 grayscale hover:grayscale-0 transition-all">
									{/* Simple text representation of logos for stability */}
									<span className="text-[10px] font-bold text-slate-800">
										Amazon
									</span>
									<span className="w-px h-3 bg-slate-300"></span>
									<span className="text-[10px] font-bold text-blue-600">
										Flipkart
									</span>
									<span className="w-px h-3 bg-slate-300"></span>
									<span className="text-[10px] font-bold text-pink-600">
										Myntra
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

// // /* --- MOCK DATA FOR GENERATED ASSETS --- */
const generatedAssets = [
	{
		type: "Model - Studio",
		tag: "Amazon Ready",
		img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80", // Woman holding bag studio
		span: "col-span-2 row-span-2",
	},
	{
		type: "Lifestyle - Urban",
		tag: "Social",
		img: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=400&q=80", // Bag on street/table
		span: "col-span-1 row-span-1",
	},
	{
		type: "Detail Shot",
		tag: "Zoom",
		img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80", // Close up texture
		span: "col-span-1 row-span-1",
	},
];

export const ProductPhotographySection = () => {
	return (
		<section className="py-10 h-full md:h-[85vh] flex flex-col justify-center items-center  px-6 bg-background border-b border-border font-sans">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-2 place-items-center gap-16 lg:gap-10 items-center ">
					{/* --- LEFT: VALUE PROPOSITION --- */}
					<div className="flex flex-col gap-6 w-fit  justify-between">
						<div className="inline-flex w-fit items-center gap-2  px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
							<Layers size={14} className="text-blue-600" />
							<span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
								Automated Photoshoot
							</span>
						</div>

						<h2 className="text-3xl md:text-4xl font-extrabold   leading-tight tracking-tight">
							One Raw Shot. <br />
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
								A Full Campaign.
							</span>
						</h2>

						<p className=" leading-relaxed max-w-lg text-base">
							Stop booking models for every SKU. Upload a single ghost-mannequin
							photo and our AI generates a complete gallery: studio shots,
							lifestyle scenes, and detail views—instantly marketplace ready.
						</p>

						<div className="space-y-2">
							{/* Feature 1 */}
							<div className="flex gap-4">
								<div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
									<Upload size={20} />
								</div>
								<div>
									<h4 className="text-base font-bold">Upload Raw Product</h4>
									<p className="text-sm text-slate-500 mt-1">
										Accepts flat lays, ghost mannequins, or simple phone photos.
									</p>
								</div>
							</div>

							{/* Feature 2 */}
							<div className="flex gap-4">
								<div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
									<Sparkles size={20} />
								</div>
								<div>
									<h4 className="text-base font-bold ">AI Model Generation</h4>
									<p className="text-sm text-slate-500 mt-1">
										Context-aware AI places your product on diverse, realistic
										models.
									</p>
								</div>
							</div>
						</div>

						<button className=" px-8 w-fit py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-200/50 transition-all hover:-translate-y-1 flex items-center gap-2">
							Start Generating <ArrowRight size={18} />
						</button>
					</div>

					{/* --- RIGHT: THE "ASSET MANAGER" UI --- */}
					<div className="relative">
						{/* Background Decor */}
						<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl -z-10"></div>

						{/* The Interface Card */}
						<div className="bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
							{/* Toolbar */}
							<div className="h-12 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between px-4">
								<div className="flex items-center gap-3">
									<div className="flex gap-1.5">
										<div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
										<div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
									</div>
									<div className="h-4 w-px bg-slate-200 mx-1"></div>
									<span className="text-xs font-bold text-slate-500">
										Project: Summer_Collection_Bag_04
									</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
										Status: Ready
									</span>
									<div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
								</div>
							</div>

							{/* Workspace Area */}
							<div className="flex h-[450px]">
								{/* SIDEBAR: INPUT (Raw Image) */}
								<div className="w-1/3 border-r border-slate-100 bg-slate-50/30 p-4 flex flex-col">
									<div className="flex justify-between items-center mb-3">
										<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
											Input Asset
										</span>
										<MoreHorizontal size={14} className="text-slate-400" />
									</div>

									{/* The Raw Input Card */}
									<div className="flex-1 bg-white rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 relative group hover:border-blue-400 transition-colors cursor-pointer">
										<div className="relative w-full h-32 mb-2">
											{/* Mock Raw Image (Transparent BG) */}
											<img
												src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80"
												className="w-full h-full object-contain mix-blend-multiply opacity-80"
												alt="Raw Bag"
											/>
										</div>
										<span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
											raw_bag_01.png
										</span>

										{/* Processing Indicator line */}
										<div className="absolute -right-[17px] top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border border-slate-100 shadow-sm flex items-center justify-center z-20">
											<ArrowRight size={14} className="text-slate-400" />
										</div>
									</div>

									<div className="mt-4 space-y-2">
										<div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
											<div className="h-full w-full bg-blue-500"></div>
										</div>
										<p className="text-[10px] text-center text-slate-400">
											Processing Complete
										</p>
									</div>
								</div>

								{/* MAIN AREA: OUTPUT (Generated Assets) */}
								<div className="w-2/3 p-4 bg-white">
									<div className="flex justify-between items-center mb-3">
										<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
											Generated Assets (3)
										</span>
										<button className="text-[10px] font-bold text-blue-600 hover:underline">
											Download All
										</button>
									</div>

									{/* Masonry / Grid Layout */}
									<div className="grid grid-cols-2 grid-rows-2 gap-3 h-[calc(100%-2rem)]">
										{generatedAssets.map((asset, idx) => (
											<div
												key={idx}
												className={`relative group rounded-xl overflow-hidden bg-slate-100 cursor-pointer ${asset.span}`}
											>
												<img
													src={asset.img}
													alt={asset.type}
													className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
												/>

												{/* Overlay on Hover */}
												<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>

												{/* Top Badge */}
												<div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-bold text-slate-700 shadow-sm border border-white/50">
													{asset.type}
												</div>

												{/* Bottom Actions */}
												<div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
													<div className="w-6 h-6 bg-white rounded flex items-center justify-center shadow-sm hover:text-blue-600">
														<Maximize2 size={12} />
													</div>
													<div className="w-6 h-6 bg-slate-900 text-white rounded flex items-center justify-center shadow-sm hover:bg-slate-800">
														<Download size={12} />
													</div>
												</div>

												{/* Marketplace Compliance Check */}
												{idx === 0 && (
													<div className="absolute bottom-3 left-3 bg-emerald-500/90 text-white px-2 py-1 rounded flex items-center gap-1 backdrop-blur-sm shadow-sm animate-in fade-in zoom-in duration-500 delay-100">
														<CheckCircle2 size={10} />
														<span className="text-[9px] font-bold">
															{asset.tag}
														</span>
													</div>
												)}
											</div>
										))}
									</div>
								</div>
							</div>
						</div>

						{/* Decor: Floating Elements */}
						<div className="absolute -right-6 top-20 bg-white p-3 rounded-lg shadow-xl border border-slate-100 animate-bounce-slow hidden lg:block">
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 rounded-full bg-emerald-500"></div>
								<span className="text-xs font-bold text-slate-700">
									Generation: 1.2s
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

// /* --- CUSTOM CSS FOR ANIMATIONS --- */
const style = `
  @keyframes playhead {
    0% { left: 0%; }
    100% { left: 100%; }
  }
  .animate-playhead {
    animation: playhead 4s linear infinite;
  }
  @keyframes wave {
    0%, 100% { height: 4px; }
    50% { height: 16px; }
  }
  .animate-wave {
    animation: wave 1s ease-in-out infinite;
  }
`;

// /* --- SUB-COMPONENT: FLOW STEP --- */
const AdStep: FC<{
	icon: any;
	title: string;
	desc: string;
	stepNum: string;
	isLast?: boolean;
}> = ({ icon: Icon, title, desc, stepNum, isLast }) => (
	<div className="flex gap-4 group">
		<div className="flex flex-col items-center">
			<div className="min-w-8 min-h-8 rounded-lg bg-white border border-border flex items-center justify-center text-xs font-bold  shadow-sm group-hover:border-purple-500 transition-all duration-300 z-10 relative">
				{stepNum}
				{/* Glow effect on hover */}
				<div className="absolute inset-0 bg-brand-400 blur-md opacity-0 group-hover:opacity-20 transition-opacity"></div>
			</div>
			{!isLast && (
				<div className="w-px h-full bg-brand   transition-colors"></div>
			)}
		</div>
		<div className=" ">
			<h4 className=" font-bold text-xl  flex items-center gap-2">
				{title}
				<Icon
					size={20}
					className="text-slate-400 group-hover:text-purple-500 transition-colors"
				/>
			</h4>
			<p className="text-xs text-slate-500 leading-relaxed max-w-xs font-medium">
				{desc}
			</p>
		</div>
	</div>
);

export const AdGeneratorSection = () => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.play().catch(error => {
				console.log("Video autoplay failed:", error);
			});
		}
	}, []);

	return (
		<section className="py-10  h-full md:h-[85vh] flex flex-col items-center justify-center  px-6 bg-background border-b border-border font-sans relative overflow-hidden">
			<style>{style}</style>

			{/* Background Ambience */}
			<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-50 to-pink-50 rounded-full blur-3xl -z-10 opacity-60"></div>

			<div className="max-w-full flex justify-center flex-col items-center h-full mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-2 place-items-center  gap-16 lg:gap-20 items-center">
					{/* --- LEFT: NARRATIVE FLOW --- */}
					<div className="flex flex-col gap-6  justify-between">
						{/* Badge */}
						<div className="inline-flex w-fit items-center gap-2  px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 shadow-sm">
							<Clapperboard size={14} className="text-pink-600" />
							<span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
								AI Video Generator
							</span>
						</div>

						<h2 className="text-3xl md:text-4xl font-extrabold  leading-tight">
							Static Photos to <br />
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
								Viral Video Ads.
							</span>
						</h2>

						<p className="text-base  leading-relaxed max-w-md">
							Don't just show products; tell stories. Upload a single image,
							write a script, and let our AI direct a full commercial with
							models, voiceover, and motion.
						</p>

						{/* Steps Timeline */}
						<div className="space-y-1">
							<AdStep
								stepNum="1"
								icon={Upload}
								title="Upload Product Image"
								desc="Start with a simple product shot. No transparent background needed."
							/>
							<AdStep
								stepNum="2"
								icon={Mic}
								title="Script & Voiceover"
								desc="Type a script or upload audio. Our AI syncs lip movements perfectly."
							/>
							<AdStep
								stepNum="3"
								icon={Wand2}
								title="Select Model & Generate"
								desc="Choose a model persona and generate a 4K video ad instantly."
								isLast={true}
							/>
						</div>

						<button className="w-fit px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-lg shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5 flex items-center gap-2 group">
							<Sparkles
								size={16}
								className="group-hover:text-yellow-300 transition-colors"
							/>
							Create Video Ad
						</button>
					</div>

					{/* --- RIGHT: THE "VIDEO EDITOR" MOCKUP --- */}
					<div className="relative flex h-fit justify-center lg:justify-end">
						{/* Main Interface Card */}
						<div className="relative h-full w-full max-w-md bg-background rounded-xl shadow-2xl shadow-lg border border-border overflow-hidden transform transition-all duration-500 hover:shadow-purple-100/50 group cursor-default">
							{/* 1. App Header */}
							<div className="h-10 border-b border-border flex items-center justify-between px-4 bg-muted">
								<div className="flex items-center gap-2">
									<div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
									<div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
									<span className="text-[10px] font-bold text-foreground ml-2 uppercase tracking-wide">
										Ad_Studio_Pro
									</span>
								</div>
								<div className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded text-[9px] font-bold">
									00:15s
								</div>
							</div>

							{/* 2. Main Viewport (The Ad) */}
							<div className="relative aspect-[4/5] w-[75vw] md:w-[20vw] bg-card overflow-hidden">
								{/* Simulated Video Content */}
								<video
									ref={videoRef}
									src="/Archive/ad/1/generated_video (5).mp4"
									className="w-full h-full object-cover opacity-90"
									autoPlay
									loop
									muted
									playsInline
								/>

								{/* Floating "Raw Input" Card */}
								<div className="absolute top-4 left-4 w-16 h-16 bg-white rounded-lg p-1 shadow-lg border border-slate-100 transform -rotate-6 z-20 animate-bounce-slow">
									<img
										src="./Archive/ad/1/ads-product-img-B-Z9QbSE.png"
										className="w-full h-full object-contain"
										alt="Shoe Input"
									/>
									<div className="absolute -bottom-2 -right-2 bg-slate-800 text-white text-[8px] px-1 rounded">
										RAW
									</div>
								</div>

								{/* Subtitles Overlay (Simulating Video) */}
								<div className="absolute bottom-16 left-0 w-full text-center px-6">
									<span className="bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded">
										"Step into the future of comfort."
									</span>
								</div>

								{/* Pulse effect for implied action */}
								<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
									<div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-xl">
										<div className="absolute inset-0 rounded-full border border-white/50 animate-ping opacity-30"></div>
									</div>
								</div>
							</div>

							{/* 3. Timeline / Editor Footer */}
							<div className="h-24 bg-background border-t border-slate-100 p-3 flex flex-col gap-2 relative">
								{/* Timeline Header */}
								<div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase">
									<div className="flex items-center gap-1">
										<Video size={10} /> Video Track
									</div>
									<div className="flex items-center gap-1">
										<Music size={10} /> Audio Track
									</div>
								</div>

								{/* Video Track Visual */}
								<div className="h-6 bg-purple-50 rounded border border-purple-100 flex overflow-hidden opacity-80">
									{[...Array(6)].map((_, i) => (
										<div
											key={i}
											className="flex-1 border-r border-white/50 bg-purple-200/50"
										></div>
									))}
								</div>

								{/* Audio Track Visual (Waveform Animation) */}
								<div className="h-6 bg-pink-50 rounded border border-pink-100 flex items-center justify-center gap-0.5 px-2 overflow-hidden">
									{[...Array(30)].map((_, i) => (
										<div
											key={i}
											className="w-1 bg-pink-400 rounded-full animate-wave"
											style={{
												height: `${Math.random() * 100}%`,
												animationDelay: `${i * 0.05}s`,
											}}
										></div>
									))}
								</div>

								{/* The Moving Playhead */}
								<div className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-30 animate-playhead shadow-[0_0_10px_rgba(239,68,68,0.5)]">
									<div className="absolute top-0 -left-[3px] w-2 h-2 bg-red-500 transform rotate-45"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
