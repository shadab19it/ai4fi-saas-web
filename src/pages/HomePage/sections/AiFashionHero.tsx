import { motion } from "motion/react";
import React, { useState, useEffect } from "react";
import SvgIcons from "../../../components/SvgIcons";
import { Link } from "react-router-dom";

/* =======================
   Types
 ======================= */

export interface AiFashionHeroProps {
	heroEyebrow?: string;
	heroDescription?: string;
	primaryCTA?: string;
	secondaryCTA?: string;
}

/* =======================
   Sub-Components
 ======================= */

const FadingImageCard: React.FC<{ images: string[]; label: string }> = ({
	images,
	label,
}) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % images.length);
		}, 5000); // 5s visible + fade time

		return () => clearInterval(interval);
	}, [images.length]);

	return (
		<div className="glass-card relative overflow-hidden flex items-center justify-center text-center md:h-72 md:w-72 h-40 w-40 hover:glass-card-hover group shadow-2xl">
			{/* Image Stack */}
			{images.map((src, index) => (
				<img
					key={index}
					src={src}
					alt={`${label} ${index + 1}`}
					className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-2000 ease-in-out ${
						index === currentIndex ? "opacity-100" : "opacity-0"
					}`}
				/>
			))}

			{/* Label Overlay */}
			<div className="relative z-10 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 transform transition-transform group-hover:scale-110">
				<span className="text-xs md:text-sm font-bold text-white uppercase tracking-widest">
					{label}
				</span>
			</div>
		</div>
	);
};

/* =======================
   Component
 ======================= */

const AiFashionHero: React.FC<AiFashionHeroProps> = ({
	heroEyebrow = "AI-Powered Fashion Studio — Est. 2025",
	heroDescription = "Create, Visualize & Advertise with Intelligent AI Models.",
	primaryCTA = "Explore Features",
	secondaryCTA = "Book a Demo",
}) => {
	const categories = [
		{
			label: "Model",
			images: [
				// "https://images.unsplash.com/photo-1539008835154-33321da040c1?q=80&w=600&auto=format&fit=crop",
				// "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
				// "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
				"./AI_gen.jpeg",
				"./3.jpeg",
				"./2.jpeg",
			],
		},
		{
			label: "Product",
			images: [
				"https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
				"https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop",
				"https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
			],
		},
		{
			label: "Ad",
			images: [
				"https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=600&auto=format&fit=crop",
				"https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop",
				"https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop",
			],
		},
		{
			label: "Banner",
			images: [
				"https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop",
				"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop",
				"https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop",
			],
		},
	];
	const partners = [
		SvgIcons.amazone,
		SvgIcons.google,
		SvgIcons.netflix,
		SvgIcons.shopify,
		SvgIcons.youtube,
	];
	return (
		<div className="max-w-[90vw] py-32  min-h-screen mx-auto bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
			{/* ================= HERO ================= */}
			<section className="px-6 md:px-16 flex items-center justify-between lg:flex-row flex-col  lg:py-0">
				{/* LEFT */}
				<div className="space-y-8 lg:w-1/2">
					<div className="inline-flex items-center gap-2 px-4 py-1.5 border border-border bg-[var(--secondary)] rounded-full text-[10px] md:text-xs uppercase tracking-widest text-[var(--brand)] shadow-sm">
						<span className="relative flex h-2 w-2">
							<span className="absolute inline-flex h-full w-full rounded-full bg-[var(--brand)] opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--brand)]"></span>
						</span>
						{heroEyebrow}
					</div>

					<div>
						<h1 className="font-bold leading-tight">
							<span className="text-foreground">REVOLUTIONIZE</span>
							<br />
							<span className="text-muted-foreground">FASHION WITH AI.</span>
						</h1>
					</div>

					<p className="max-w-xl text-[var(--secondary-foreground)] text-lg">
						{heroDescription}
					</p>

					<div className="flex flex-wrap gap-4">
						<Link to="/features">
						<button
							type="button"
							className="px-8 py-3 rounded-md bg-brand-color text-white hover:opacity-90 transition shadow-lg shadow-brand/20"
						>
							{primaryCTA}
						</button>
						</Link>

						<button
							type="button"
							className="px-8 py-3 border border-[var(--border)] rounded-md hover:border-[var(--brand)] transition hover:bg-[var(--secondary)]"
						>
							{secondaryCTA}
						</button>
					</div>
				</div>

				{/* RIGHT */}
				<div className="lg:w-1/2 relative flex items-center justify-center mt-12 lg:mt-0">
					<div className="grid grid-cols-2 gap-4 md:gap-8 rotate-[-3deg]">
						{categories.map((cat, i) => (
							<FadingImageCard key={i} label={cat.label} images={cat.images} />
						))}
					</div>
				</div>
			</section>
			<div className=" px-4 sm:px-6 lg:px-8 relative z-10 md:py-16">
				{/* <h4 className="text-center  mb-5 font-bold leading-tight">
					Our Trusted Partners
				</h4> */}
				<div className="grid grid-cols place-items-center md:grid-cols-5 gap-6 md:gap-8">
					{partners.map((partner, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 0 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: index * 0.2 }}
							className="group"
						>
							<i className="leading-0 text-[7rem] text-muted-foreground">
								{" "}
								{partner}
							</i>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
};

export default AiFashionHero;
