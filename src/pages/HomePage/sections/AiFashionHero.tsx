import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from "react";
import SvgIcons from "../../../components/SvgIcons";
import BorderBeamAnimation from "../../../components/common/AnimatedBorder";
import { useTheme } from "../../../context/ThemeContext";
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

const FadingImageCard: React.FC<{
	images: string[];
	label: string;
	startDelay?: number;
}> = ({ images, label, startDelay = 0 }) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const timeout = setTimeout(() => {
			const interval = setInterval(() => {
				setCurrentIndex((prev) => (prev + 1) % images.length);
			}, 3000);
			// Store interval id for cleanup
			(timeout as any).__interval = interval;
		}, startDelay * 1000);

		return () => {
			clearTimeout(timeout);
			if ((timeout as any).__interval)
				clearInterval((timeout as any).__interval);
		};
	}, [images.length, startDelay]);

	return (
		<div className="glass-card relative z-40 overflow-hidden flex items-center justify-center text-center md:h-64 md:w-64 lg:h-68 lg:w-68 h-32 w-32 hover:glass-card-hover group shadow-2xl">
			{/* Image Stack */}
			{/* Image Stack */}
			<AnimatePresence>
				<motion.img
					key={currentIndex}
					src={images[currentIndex]}
					alt={`${label} ${currentIndex + 1}`}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1, transition: { duration: 2 } }}
					exit={{ opacity: 0, transition: { duration: 0, delay: 2 } }}
					className="absolute rounded-sm inset-0 w-full h-full object-cover object-top"
				/>
			</AnimatePresence>

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
	const { theme } = useTheme();
	const [currentTick, setCurrentTick] = useState(0);

	useEffect(() => {
		const timeout = setTimeout(() => {
			const interval = setInterval(() => {
				setCurrentTick((prev) => prev + 1);
			}, 2000);
			return () => clearInterval(interval);
		}, 2500);

		return () => clearTimeout(timeout);
	}, []);

	const partners = [
		"./partners/chand.png",
		"./partners/charkha_tales.webp",
		"./partners/dhaga.png",
		"./partners/mrignandani.png",
		"./partners/zuni.png",
		"./partners/novelty.png",
	];
	// const partners = [
	// 	SvgIcons.amazone,
	// 	SvgIcons.google,
	// 	SvgIcons.netflix,
	// 	SvgIcons.shopify,
	// 	SvgIcons.youtube,
	// ];
	const imageCards = [
		{
			id: 1,
			src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
			rotate: -6,
			className: "top-[5%] left-[5%] md:top-[8%] md:left-[8%]",
		},
		{
			id: 2,
			src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
			rotate: 3,
			className: "top-[2%] left-[30%] md:top-[0%] md:left-[40%]",
		},
		{
			id: 4,
			src: "./models/IMG_2553.JPG.jpeg",
			rotate: -8,
			className: "top-[30%] left-[8%] md:top-[40%] md:left-[10%]",
		},
		{
			id: 5,
			src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80",
			rotate: 4,
			className: "top-[25%] right-[10%] md:top-[30%] md:right-[40%]",
		},
		{
			id: 6,
			src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
			rotate: -2,
			className: "top-[45%] right-[5%] md:top-[50%] md:right-[30%]",
		},
		{
			id: 7,
			src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
			rotate: 5,
			className: "bottom-[5%] left-[10%] md:bottom-[10%] md:left-[20%]",
		},
		{
			id: 8,
			src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
			rotate: -4,
			className: "bottom-[8%] right-[8%] md:bottom-[10%] md:right-[15%]",
		},

		{
			id: 9,
			src: "./models/IMG_2472.JPG.jpeg",
			rotate: -10,
			className: "top-[10%] right-[0%] md:top-[20%] md:right-[12%]",
		},
		{
			id: 10,
			src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
			rotate: 6,
			className: "bottom-[2%] left-[2%] md:bottom-[4%] md:left-[4%]",
		},
	];

	const [cards, setCards] = useState(imageCards);
	const [direction, setDirection] = useState("idle");
	const [windowWidth, setWindowWidth] = useState(
		typeof window !== "undefined" ? window.innerWidth : 1200,
	);

	useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setDirection("out");

			setTimeout(() => {
				// Move first card to end while it's offscreen
				setCards((prev) => {
					if (prev.length === 0) return prev;
					const [first, ...rest] = prev;
					return [...rest, first];
				});

				setDirection("in");

				setTimeout(() => {
					setDirection("idle");
				}, 500);
			}, 250); // matches first animation duration
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="relative overflow-hidden w-full">
			{/* ────── Background Image ────── */}
			<div className="absolute inset-0 z-0 overflow-hidden rounded-xl">
				<img
					src={theme === "dark" ? "./hero_dark_4k.png" : "./hero_bg_4k.png"}
					alt=""
					className="w-full h-full object-cover"
				/>
				<div
					className="absolute inset-0"
					style={{
						background:
							theme === "dark"
								? "linear-gradient(to bottom, rgba(2,12,36,0.7), rgba(2,12,36,0.85))"
								: "linear-gradient(to bottom, rgba(255,255,255,0.75), rgba(255,255,255,0.85))",
					}}
				/>
			</div>
			{/* ================= HERO ================= */}
			<div className="max-w-[90vw] sm:max-w-[80vw]  pt-32 pb-16 md:pt-32  relative min-h-screen mx-auto  text-[var(--foreground)] transition-colors duration-300">
				<section className="px-6 md:px-0 relative z-[20] flex items-center justify-between lg:flex-row flex-col  lg:py-0">
					{/* LEFT */}
					<div className="space-y-8 lg:w-1/2">
						<motion.div
							initial={{ y: -40, opacity: 0 }}
							whileInView={{ y: 0, opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0, ease: "easeOut" }}
						>
							<div className="inline-flex relative items-center gap-2 px-4 py-2.5 border border-border bg-[var(--muted-secondary)] rounded-full text-[10px] md:text-xs uppercase tracking-widest text-brand-gradient shadow-sm">
								<BorderBeamAnimation />
								<span className="relative flex h-2 w-2">
									<span className="absolute inline-flex h-full w-full rounded-full bg-muted-foreground opacity-75"></span>
									<span className="relative inline-flex rounded-full h-2 w-2 bg-muted-foreground"></span>
								</span>
								{heroEyebrow}
							</div>
						</motion.div>

						<motion.div
							initial={{ y: -40, opacity: 0 }}
							whileInView={{ y: 0, opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
						>
							<h1 className="font-bold leading-tight">
								<span className="text-foreground">REVOLUTIONIZE</span>
								<br />
								<span className="text-brand-gradient">FASHION WITH AI.</span>
							</h1>
						</motion.div>

						<motion.div
							initial={{ y: -40, opacity: 0 }}
							whileInView={{ y: 0, opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
						>
							<p className="max-w-xl text-[var(--secondary-foreground)] text-lg">
								{heroDescription}
							</p>
						</motion.div>

						<motion.div
							initial={{ y: -40, opacity: 0 }}
							whileInView={{ y: 0, opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
						>
							<div className="flex flex-wrap gap-4">
								<Link to="/features">

								<button
									type="button"
									className="px-8 py-3 md:w-fit w-full rounded-md bg-brand-color text-white hover:opacity-90 transition shadow-lg shadow-brand/20"
								>
									{primaryCTA}
								</button>

								</Link>
								<Link to="/contact">
								<button
									type="button"
									className="px-8 py-3 md:w-fit w-full border border-[var(--border)] rounded-md hover:border-[var(--brand)] transition hover:bg-[var(--secondary)]"
								>
									{secondaryCTA}
								</button>

								</Link>
							</div>
						</motion.div>
					</div>

					{/* RIGHT — Card Shuffle */}
					<div className="w-full lg:w-1/2 relative h-[400px] md:h-[500px] mt-16 lg:mt-0 md:block max-w-full mx-auto">
						{cards.map((card, i) => {
							const isTop = i === 0;
							const isLeft = card.className.includes("left");
							// Responsive exit distance: about 35% of screen width, but at least 150px
							const exitDistance = Math.max(windowWidth * 0.15, 20);
							const exitX = isLeft ? -exitDistance : exitDistance;

							return (
								<motion.div
									key={card.id}
									className={`absolute bg-white p-2 pb-6 w-[35%] md:w-[30%] lg:w-[25%] h-auto rounded-lg shadow-xl ${card.className}`}
									animate={{
										x: isTop && direction === "out" ? exitX : 0,
										scale: isTop ? 1 : 0.95,
										opacity: isTop && direction === "out" ? 0 : 1,
										rotate: card.rotate,
									}}
									transition={{
										duration: direction === "in" ? 0.8 : 0.4,
										ease: [0.22, 1, 0.36, 1],
									}}
									style={{
										zIndex: cards.length - i,
									}}
								>
									<div className="overflow-hidden rounded bg-gray-100 aspect-[3/4]">
										<img
											src={card.src}
											alt="Model"
											className="w-full position-top h-full object-top object-cover"
										/>
									</div>
								</motion.div>
							);
						})}
					</div>
				</section>
				<div className=" px-4 sm:px-6 lg:px-8 relative z-10 py-8 md:pb-8 pt-16">
					<h4 className="text-center  mb-5 font-bold leading-tight">
						Our Trusted Partners
					</h4>
					<div className="md:grid flex flex-wrap items-center justify-between md:place-items-center md:grid-cols-6 gap-6 md:gap-8">
						{partners.map((partner, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 0 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: index * 0.2 }}
								className="group"
							>
								{/* <i className="leading-0 text-[7rem] text-muted-foreground">
									{" "}
									{partner}
								</i> */}
								<img alt={`partners_${index}`} src={partner} />
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AiFashionHero;
