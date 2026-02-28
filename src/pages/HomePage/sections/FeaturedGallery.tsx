
// /* 2. The Luxury Feature Card (Plus Size) */
const InclusiveCard: FC<{ model: any }> = ({ model }) => (
	<div className="relative flex-shrink-0 w-[300px] md:w-[350px] snap-center group">
		<div className="relative h-[450px] rounded-xl overflow-hidden shadow-2xl border border-white/10">
			<img
				src={model.img}
				alt={model.name}
				className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
			/>

			{/* Permanent Overlay for Readability */}
			<div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90"></div>

			<div className="absolute bottom-6 left-6 right-6">
				<div className="flex justify-between items-end border-b border-white/20 pb-4 mb-4">
					<div>
						<p className="text-purple-400 text-xs font-bold uppercase tracking-[0.2em] mb-1">
							{model.category}
						</p>
						<h4 className="text-2xl font-serif text-white">{model.name}</h4>
					</div>
					<Sparkles className="text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
				</div>

				<div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
					<div className="flex items-center gap-2">
						<ScanFace size={16} /> {model.stats}
					</div>
					<div className="flex items-center gap-2">
						<Palette size={16} /> {model.vibe}
					</div>
				</div>
			</div>
		</div>
	</div>
);



import React, { FC, useRef, useEffect, useState } from "react";
import {
	ArrowUpRight,
	Sparkles,
	User,
	Info,
	ChevronLeft,
	ChevronRight,
	Heart,
	ScanFace,
	Palette,
} from "lucide-react";
import SectionHeader from "./SectionHeader";

/* --- MOCK DATA GENERATOR --- */
// Generating 15 standard models

const GallerySetOne = [
	{ id: 1, img: "./gallery/gallery_1.png", alt: "AI Model 1", type: "Commercial" },
	{ id: 2, img: "./gallery/gallery_2.png", alt: "AI Model 2", type: "Commercial" },
	{ id: 3, img: "./gallery/gallery_3.png", alt: "AI Model 3", type: "Commercial" },
	{ id: 4, img: "./gallery/gallery_4.png", alt: "AI Model 4", type: "Commercial" },
	{ id: 5, img: "./gallery/gallery_5.jpeg", alt: "AI Model 5", type: "Commercial" },
	{ id: 6, img: "./gallery/gallery_6.jpeg", alt: "AI Model 6", type: "Commercial" },
	{ id: 7, img: "./gallery/gallery_7.jpeg", alt: "AI Model 7", type: "Commercial" },
	{ id: 8, img: "./gallery/gallery_8.jpeg", alt: "AI Model 8", type: "Commercial" },
	{ id: 9, img: "./gallery/gallery_9.jpeg", alt: "AI Model 9", type: "Commercial" },
	{ id: 10, img: "./gallery/gallery_10.jpeg", alt: "AI Model 10", type: "Commercial" },
	{ id: 11, img: "./gallery/gallery_11.jpeg", alt: "AI Model 11", type: "Commercial" },
	{ id: 12, img: "./gallery/gallery_12.jpeg", alt: "AI Model 12", type: "Commercial" },
	{ id: 13, img: "./gallery/gallery_13.jpeg", alt: "AI Model 13", type: "Commercial" },
	{ id: 14, img: "./gallery/gallery_14.jpeg", alt: "AI Model 14", type: "Commercial" },
	{ id: 15, img: "./gallery/gallery_15.jpeg", alt: "AI Model 15", type: "Commercial" },
	{ id: 16, img: "./gallery/gallery_16.jpeg", alt: "AI Model 16", type: "Commercial" },
	{ id: 17, img: "./gallery/gallery_39.jpeg", alt: "AI Model 16", type: "Commercial" },
	{ id: 18, img: "./gallery/gallery_40.jpeg", alt: "AI Model 16", type: "Commercial" },
	{ id: 19, img: "./gallery/gallery_41.jpeg", alt: "AI Model 16", type: "Commercial" },
	{ id: 20, img: "./gallery/gallery_42.jpeg", alt: "AI Model 16", type: "Commercial" },
];

const GallerySetTwo = [
	{ id: 17, img: "./gallery/gallery_17.jpeg", alt: "AI Model 17", type: "Commercial" },
	{ id: 32, img: "./gallery/gallery_32.png", alt: "AI Model 32", type: "Commercial" },

	{ id: 18, img: "./gallery/gallery_18.jpeg", alt: "AI Model 18", type: "Commercial" },
	{ id: 19, img: "./gallery/gallery_19.png", alt: "AI Model 19", type: "Commercial" },
	{ id: 20, img: "./gallery/gallery_20.png", alt: "AI Model 20", type: "Commercial" },
	{ id: 26, img: "./gallery/gallery_26.png", alt: "AI Model 26", type: "Commercial" },

	{ id: 21, img: "./gallery/gallery_21.png", alt: "AI Model 21", type: "Commercial" },
	{ id: 30, img: "./gallery/gallery_30.jpeg", alt: "AI Model 30", type: "Commercial" },
	{ id: 29, img: "./gallery/gallery_29.png", alt: "AI Model 29", type: "Commercial" },

	{ id: 22, img: "./gallery/gallery_22.png", alt: "AI Model 22", type: "Commercial" },
	{ id: 23, img: "./gallery/gallery_23.png", alt: "AI Model 23", type: "Commercial" },
	{ id: 24, img: "./gallery/gallery_24.png", alt: "AI Model 24", type: "Commercial" },
	{ id: 25, img: "./gallery/gallery_25.png", alt: "AI Model 25", type: "Commercial" },
	{ id: 27, img: "./gallery/gallery_27.png", alt: "AI Model 27", type: "Commercial" },
	{ id: 28, img: "./gallery/gallery_28.png", alt: "AI Model 28", type: "Commercial" },
	{ id: 31, img: "./gallery/gallery_31.jpeg", alt: "AI Model 31", type: "Commercial" },
	{ id: 33, img: "./gallery/gallery_33.jpeg", alt: "AI Model 33", type: "Commercial" },
	{ id: 34, img: "./gallery/gallery_34.jpeg", alt: "AI Model 33", type: "Commercial" },
	{ id: 35, img: "./gallery/gallery_35.jpeg", alt: "AI Model 33", type: "Commercial" },
	{ id: 36, img: "./gallery/gallery_36.jpeg", alt: "AI Model 33", type: "Commercial" },
	{ id: 37, img: "./gallery/gallery_37.jpeg", alt: "AI Model 33", type: "Commercial" },
	{ id: 38, img: "./gallery/gallery_38.jpeg", alt: "AI Model 33", type: "Commercial" },
];
const ObeseModels = [
	{
		id: 24,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/male/male_model_008.png",
		alt: "AI Model 24",
		type: "Editorial",
	},
	{
		id: 3,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/female/female_model_023.png",
		alt: "AI Model 3",
		type: "Commercial",
	},
	{
		id: 18,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/male/male_model_002.png",
		alt: "AI Model 18",
		type: "Editorial",
	},
	{
		id: 10,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/female/female_model_030.png",
		alt: "AI Model 10",
		type: "Editorial",
	},
	{
		id: 29,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/male/male_model_013.png",
		alt: "AI Model 29",
		type: "Commercial",
	},
	{
		id: 5,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/female/female_model_025.png",
		alt: "AI Model 5",
		type: "Commercial",
	},
	{
		id: 21,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/male/male_model_005.png",
		alt: "AI Model 21",
		type: "Commercial",
	},
	{
		id: 14,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/female/female_model_034.png",
		alt: "AI Model 14",
		type: "Editorial",
	},
	{
		id: 31,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/male/male_model_015.png",
		alt: "AI Model 31",
		type: "Commercial",
	},
	{
		id: 1,
		name: "Aria V.",
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/female/female_model_021.png",
		alt: "AI Model 1",
		type: "Commercial",
	},
	{
		id: 27,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/male/male_model_011.png",
		alt: "AI Model 27",
		type: "Commercial",
	},
	{
		id: 12,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/female/female_model_032.png",
		alt: "AI Model 12",
		type: "Editorial",
	},
	{
		id: 8,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/female/female_model_028.png",
		alt: "AI Model 8",
		type: "Editorial",
	},
	{
		id: 22,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/male/male_model_006.png",
		alt: "AI Model 22",
		type: "Editorial",
	},
	{
		id: 16,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/female/female_model_036.png",
		alt: "AI Model 16",
		type: "Editorial",
	},
	{
		id: 25,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/male/male_model_009.png",
		alt: "AI Model 25",
		type: "Commercial",
	},
	{
		id: 9,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/female/female_model_029.png",
		alt: "AI Model 9",
		type: "Commercial",
	},
	{
		id: 30,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/male/male_model_014.png",
		alt: "AI Model 30",
		type: "Editorial",
	},
	{
		id: 6,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/female/female_model_026.png",
		alt: "AI Model 6",
		type: "Editorial",
	},
	{
		id: 19,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/male/male_model_003.png",
		alt: "AI Model 19",
		type: "Commercial",
	},
	{
		id: 15,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/female/female_model_035.png",
		alt: "AI Model 15",
		type: "Commercial",
	},
	{
		id: 28,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/male/male_model_012.png",
		alt: "AI Model 28",
		type: "Editorial",
	},
	{
		id: 4,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/female/female_model_024.png",
		alt: "AI Model 4",
		type: "Editorial",
	},
	{
		id: 23,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/male/male_model_007.png",
		alt: "AI Model 23",
		type: "Commercial",
	},
	{
		id: 2,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/female/female_model_022.png",
		alt: "AI Model 2",
		type: "Editorial",
	},
	{
		id: 20,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/male/male_model_004.png",
		alt: "AI Model 20",
		type: "Editorial",
	},
	{
		id: 13,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/female/female_model_033.png",
		alt: "AI Model 13",
		type: "Commercial",
	},
	{
		id: 32,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/male/male_model_016.png",
		alt: "AI Model 32",
		type: "Commercial",
	},
	{
		id: 11,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/female/female_model_031.png",
		alt: "AI Model 11",
		type: "Commercial",
	},
	{
		id: 26,
		img: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/male/male_model_010.png",
		alt: "AI Model 26",
		type: "Editorial",
	},
];
const standardModels = Array.from({ length: 15 }).map((_, i) => ({
	id: i,
	name: `Model ${String.fromCharCode(65 + i)}`,
	img: `https://source.unsplash.com/random/400x600?fashion,model,portrait&sig=${i}`, // Using Unsplash Random for demo
	type: i % 2 === 0 ? "Editorial" : "Commercial",
}));

// Generating 10 plus-size models
const plusSizeModels = Array.from({ length: 10 }).map((_, i) => ({
	id: i + 20,
	name: `Curvy Model ${i + 1}`,
	img: `https://source.unsplash.com/random/400x600?plus-size,fashion,woman&sig=${i + 20}`,
	tag: "Body Positive",
}));

/* --- STYLES FOR ANIMATION --- */
// You can add this to your CSS file or use a <style> tag
const marqueeStyle = `
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes marquee-reverse {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
  .animate-marquee {
    animation: marquee 40s linear infinite;
  }
  .animate-marquee-reverse {
    animation: marquee-reverse 40s linear infinite;
  }
  .group:hover .pause-hover {
    animation-play-state: paused;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const ModelCard: FC<{ model: any; isDark?: boolean }> = ({ model, isDark = false }) => (
	<div
		className={`
    relative flex-shrink-0 w-auto h-[250px] md:h-[280px] lg:h-[320px] rounded-2xl overflow-hidden cursor-pointer group mx-3
    ${isDark ? "shadow-[0_0_30px_rgba(168,85,247,0.15)]" : "shadow-xl"}
  `}
	>
		<img
			src={model.img}
			alt={model.name}
			className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
			loading="lazy"
		/>

		{/* Gradient Overlay */}
		<div
			className={`absolute inset-0 bg-gradient-to-t ${isDark ? "from-purple-900/90" : "from-black/80"} via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300`}
		></div>

		{/* Content */}
		<div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
			<div className="flex justify-between items-end">
				<div>
					<span
						className={`text-[10px] font-bold uppercase tracking-widest mb-1 block ${isDark ? "text-purple-300" : "text-gray-300"}`}
					>
						{model.type || model.tag}
					</span>
					<h3 className="text-2xl font-serif text-white italic">
						{model.name}
					</h3>
				</div>
				<div
					className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? "bg-purple-500 text-white" : "bg-white text-black"} opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100`}
				>
					<ArrowUpRight size={20} />
				</div>
			</div>
		</div>
	</div>
);

const InfiniteShowcase = () => {
	const scrollRef = useRef<HTMLDivElement>(null);
	const marquee1Ref = useRef<HTMLDivElement>(null);
	const marquee2Ref = useRef<HTMLDivElement>(null);
	const [isPaused, setIsPaused] = useState(false);

	const scroll = (direction: "left" | "right", ref?: React.RefObject<HTMLDivElement>) => {
		const targetRef = ref || scrollRef;
		if (targetRef.current) {
			const { scrollLeft, clientWidth, scrollWidth } = targetRef.current;
			const scrollAmount = clientWidth * 0.8;
			let scrollTo =
				direction === "left"
					? scrollLeft - scrollAmount
					: scrollLeft + scrollAmount;

			// Handle boundaries for a better user experience
			if (scrollTo < 0) scrollTo = 0;
			if (scrollTo > scrollWidth - clientWidth) scrollTo = scrollWidth - clientWidth;

			targetRef.current.scrollTo({
				left: scrollTo,
				behavior: "smooth",
			});
		}
	};

	// Auto-scroll logic
	useEffect(() => {
		if (isPaused) return;

		const interval = setInterval(() => {
			if (scrollRef.current) {
				const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;

				// If we're at the end, scroll back to the beginning
				if (scrollLeft + clientWidth >= scrollWidth - 50) {
					scrollRef.current.scrollTo({
						left: 0,
						behavior: "smooth",
					});
				} else {
					scroll("right");
				}
			}
		}, 4000); // Auto-slide every 4 seconds

		return () => clearInterval(interval);
	}, [isPaused]);

	return (
		<div className="bg-background min-h-screen overflow-hidden font-sans selection:bg-purple-200">
			<style>{marqueeStyle}</style>

			{/* --- HEADER --- */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 lg:px-8">
				<SectionHeader
					subtitle="Featured AI Model"
					title="Diverse Identities"
					description="Discover our diverse range of AI-generated fashion models"
					highlightedWord="Identities"
				/>
			</div>

			{/* --- MARQUEE 1: Standard Models (Row 1 - Left) --- */}
			<div className="relative w-full mb-8 group overflow-hidden">
				<div
					ref={marquee1Ref}
					className="flex overflow-x-auto scrollbar-hide snap-none"
				>
					<div className="flex w-max animate-marquee pause-hover">
						{/* Double the array to create seamless loop */}
						{[...GallerySetOne, ...GallerySetTwo].map((model, idx) => (
							<ModelCard key={`row1-${idx}`} model={model} />
						))}
					</div>
				</div>

				{/* Navigation Buttons for Marquee Row 1 */}
				<button
					onClick={() => scroll("left", marquee1Ref)}
					className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full text-black bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center  opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 z-20 shadow-xl"
					aria-label="Scroll Left"
				>
					<ChevronLeft size={24} />
				</button>
				<button
					onClick={() => scroll("right", marquee1Ref)}
					className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 z-20 shadow-xl"
					aria-label="Scroll Right"
				>
					<ChevronRight size={24} />
				</button>

				{/* Fog Fade Effect on Edges */}
				<div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
				<div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
			</div>

			{/* --- MARQUEE 1: Standard Models (Row 2 - Right) --- */}
			<div className="relative w-full mb-24 group overflow-hidden">
				<div
					ref={marquee2Ref}
					className="flex overflow-x-auto scrollbar-hide snap-none"
				>
					<div className="flex w-max animate-marquee-reverse pause-hover">
						{[...[...GallerySetTwo].reverse(), ...GallerySetTwo].map(
							(model, idx) => (
								<ModelCard key={`row2-${idx}`} model={model} />
							),
						)}
					</div>
				</div>

				{/* Navigation Buttons for Marquee Row 2 */}
				<button
					onClick={() => scroll("left", marquee2Ref)}
					className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 z-20 shadow-xl"
					aria-label="Scroll Left"
				>
					<ChevronLeft size={24} />
				</button>
				<button
					onClick={() => scroll("right", marquee2Ref)}
					className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 z-20 shadow-xl"
					aria-label="Scroll Right"
				>
					<ChevronRight size={24} />
				</button>

				<div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
				<div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
			</div>

			{/* --- SECTION: SPECIAL CATEGORY (Dark Mode) --- */}
			<section className="bg-background py-24 relative overflow-hidden">
				{/* Decorative Background Elements */}
				<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none"></div>
				<div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"></div>

				<div className="max-w-7xl mx-auto px-6 relative z-10">
					<div className="flex flex-col lg:flex-row gap-12 lg:items-center">
						{/* Sticky Text Info */}
						<div className="lg:w-1/3 space-y-6">
							<span className="inline-block px-3 w-fit text-center  border-border border glass-card flex items-center gap-2 py-1 bg-primary/10 backdrop-blur-sm text-muted-secondary rounded-full mb-3">
								<Heart size={12} stroke="none" fill="var(--muted-foreground)" />
								<span className="text-muted-foreground">Body Positivity</span>
							</span>
							<h2 className="text-4xl md:text-5xl font-serif text-foreground leading-tight">
								Celebrating  <br />
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
									Real Curves
								</span>
							</h2>

							<p className="text-slate-400 text-lg leading-relaxed">
								Our platform generates confident, beautifully styled plus-size and curvy models that reflect real-world body diversity. Designed with proportion accuracy and natural posture, these visuals help your brand connect authentically with every customer.
							</p>

							<button className="group flex items-center gap-2 text-brand border-b border-brand pb-1 hover:text-brand hover:border-brand transition-all">
								View Full Collection{" "}
								<ChevronRight
									size={16}
									className="group-hover:translate-x-1 transition-transform"
								/>
							</button>
						</div>

						{/* Horizontal Scroll Gallery */}
						<div
							className="lg:w-2/3 relative group/carousel"
							onMouseEnter={() => setIsPaused(true)}
							onMouseLeave={() => setIsPaused(false)}
						>
							<div
								ref={scrollRef}
								className="flex gap-6 overflow-x-auto pb-4 snap-x scrollbar-hide scroll-smooth"
							>
								{ObeseModels.map((model) => (
									<InclusiveCard key={model.id} model={model} />
								))}

								{/* "See More" Card placeholder */}
								<div className="flex-shrink-0 w-[200px] h-[450px] flex items-center justify-center border border-dashed border-slate-700 rounded-xl text-slate-500 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer snap-center">
									<div className="text-center">
										<span className="text-3xl font-serif block mb-2">+ 50</span>
										<span className="text-sm">More Models</span>
									</div>
								</div>
							</div>

							{/* Navigation Arrows */}
							<button
								onClick={() => scroll("left")}
								className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-black opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-white/20 z-20"
								aria-label="Scroll Left"
							>
								<ChevronLeft size={24} />
							</button>
							<button
								onClick={() => scroll("right")}
								className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-black opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-white/20 z-20"
								aria-label="Scroll Right"
							>
								<ChevronRight size={24} />
							</button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default InfiniteShowcase;
