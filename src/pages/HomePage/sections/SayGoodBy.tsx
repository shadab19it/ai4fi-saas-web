import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useRef } from "react";
import {
	Advertisement,
	PhotoStudio,
	VirtualTrialRoom,
} from "./KeyFeatureItems";

const IMAGES = [
	{
		id: 1,
		// src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
		src: "./good_bye_1.jpeg",
		alt: "Portrait Shoot",
		fromX: -60,
		fromY: -45,
		rotate: -9,
		bg: "from-amber-400 to-orange-700",
		size: 270,
		z: 4,
	},
	{
		id: 2,
		src: "./good_bye_4.png",

		// src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
		alt: "Studio Portrait",
		fromX: 60,
		fromY: -45,
		rotate: 7,
		bg: "from-indigo-400 to-purple-900",
		size: 255,
		z: 6,
	},
	{
		id: 3,
		src: "./good_bye_3.jpeg",
		// src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80",
		alt: "Fashion Shoot",
		fromX: -60,
		fromY: 45,
		rotate: 5,
		bg: "from-pink-400 to-red-700",
		size: 260,
		z: 5,
	},
	{
		id: 4,
		src: "./good_bye_02.png",

		// src: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80",
		alt: "Model Shoot",
		fromX: 60,
		fromY: 45,
		rotate: -6,
		bg: "from-emerald-400 to-teal-700",
		size: 248,
		z: 7,
	},
];
export default function SayGoodBySection() {
	const containerRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end end"],
	});

	// Smooth out the scroll progress
	const smoothProgress = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	// Transitions for Hero
	const heroOpacity = useTransform(
		smoothProgress,
		[0, 0.45, 0.55, 0.6],
		[1, 1, 0, 0],
	);
	const heroScale = useTransform(smoothProgress, [0, 0.45, 0.55], [1, 1, 0.9]);
	const heroY = useTransform(smoothProgress, [0.45, 0.55], ["0%", "-10%"]);

	// Transitions for Welcome Section
	const welcomeOpacity = useTransform(
		smoothProgress,
		[0.55, 0.65, 0.9, 1],
		[0, 1, 1, 0],
	);
	const welcomeScale = useTransform(smoothProgress, [0.55, 0.65], [0.95, 1]);
	const welcomeY = useTransform(smoothProgress, [0.55, 0.65], ["40px", "0px"]);

	// Transitions for Next Panels

	// Scroll indicator visibility
	const indicatorOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);
	return (
		<div
			ref={containerRef}
			className="relative bg-background"
			style={{
				fontFamily: "'Georgia', serif",
				height: `${6 * 100}vh`,
			}}
		>
			<div className="sticky top-0 h-screen w-full overflow-hidden">
				{/* ── HERO VIEW ── */}
				<motion.div
					className="absolute inset-0 flex flex-col items-center justify-center bg-background z-20"
					style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
				>
					{/* Glow blob */}
					<div
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
						style={{
							width: 700,
							height: 500,
							background:
								"radial-gradient(ellipse, rgba(251,191,36,0.06) 0%, transparent 70%)",
						}}
					/>

					{/* Hanging Thread */}
					<motion.div
						className="absolute top-0 w-[1px] bg-gradient-to-b from-transparent via-brand-color/50 to-brand-color/80"
						style={{
							height: "42vh", // Length of the thread to the title center
							opacity: heroOpacity,
							scaleY: useTransform(smoothProgress, [0, 0.2], [0, 1]),
							originY: 0,
						}}
					/>

					{/* Headline */}
					<div className="text-center whitespace-nowrap z-2 pointer-events-none select-none mt-20">
						<p
							className="text-foreground uppercase mb-6 opacity-100 tracking-[0.2em] md:tracking-[0.5em]"
							style={{
								fontSize: 13,
								fontFamily: "'Courier New', monospace",
							}}
						>
							Introducing AI Photography
						</p>
						<h1
							className=" md:text-[2.8rem] text-[2rem] font-[900] lg:text-[3.5rem] text-brand-gradient m-0 leading-[1.05]"
							style={{
								fontSize: "clamp(28px, 10vw, 100px)",
								letterSpacing: "-0.03em",
							}}
						>
							Say
							<br />
							Good Bye to Costly
							<br />
							Photo Shoots
						</h1>
						<div className="w-16 h-[2px] bg-brand-color/60 mx-auto mt-12 shadow-[0_0_15px_rgba(var(--brand-rgb),0.5)]" />
					</div>

					{/* Scattered Images */}
					{IMAGES.map((img, i) => {
						const stagger = i * 0.05;
						// Images start flying in as headline is focused
						const range = [0.1 + stagger, 0.35 + stagger];

						const x = useTransform(smoothProgress, range, [
							`${img.fromX}vw`,
							"0vw",
						]);
						const y = useTransform(smoothProgress, range, [
							`${img.fromY}vh`,
							"0vh",
						]);
						const rotate = useTransform(smoothProgress, range, [
							img.rotate * 2,
							img.rotate,
						]);
						const scale = useTransform(smoothProgress, range, [0.5, 1]);
						const opacity = useTransform(
							smoothProgress,
							[0.05 + stagger, 0.2 + stagger],
							[0, 1],
						);

						return (
							<motion.div
								key={img.id}
								className="absolute w-[160px] md:w-[200px] lg:w-[15%] rounded-xl overflow-hidden bg-background/50 backdrop-blur-sm"
								style={{
									// width: `clamp(120px, 18vw, ${img.size}px)`,

									aspectRatio: "3/4", // Common portrait ratio
									x,
									y,
									rotate,
									opacity,
									scale,
									zIndex: img.z,
									boxShadow:
										"0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)",
								}}
							>
								<div
									className={`absolute inset-0 bg-gradient-to-br ${img.bg} opacity-10`}
								/>
								<img
									src={img.src}
									alt={img.alt}
									className="w-full h-full object-cover block relative z-10"
									style={{ padding: "4px" }} // Padding ensures edges are never cut
								/>
								<div
									className={`absolute inset-0 bg-gradient-to-br ${img.bg} z-20 pointer-events-none`}
									style={{ opacity: 0.15, mixBlendMode: "overlay" }}
								/>
								<div
									className="absolute bottom-0 left-0 right-0 z-30 px-4 pb-4 pt-10"
									style={{
										background:
											"linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
									}}
								>
									<p
										className="text-white/80 uppercase tracking-[0.2em] m-0 font-medium"
										style={{
											fontSize: 10,
											fontFamily: "'Courier New', monospace",
										}}
									>
										{img.alt}
									</p>
								</div>
							</motion.div>
						);
					})}
				</motion.div>

				{/* ── WELCOME VIEW ── */}
				<motion.div
					className="absolute inset-0 flex flex-col items-center justify-center z-10"
					style={{
						opacity: welcomeOpacity,
						scale: welcomeScale,
						y: welcomeY,
					}}
				>
					<div className="text-center px-6">
						<div
							className="absolute inset-0 z-0 opacity-[0.03]"
							style={{
								backgroundImage:
									"linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
								backgroundSize: "40px 40px",
							}}
						></div>
						<motion.p
							className="text-brand-gradient uppercase mb-4 tracking-[0.5em] font-medium"
							style={{
								fontSize: 13,
								fontFamily: "'Courier New', monospace",
							}}
						>
							The Future of Fashion
						</motion.p>
						<h2
							className="text-foreground font-bold m-0 leading-[1.1]"
							style={{
								fontSize: "clamp(48px, 10vw, 120px)",
								letterSpacing: "-0.04em",
								fontFamily: "inherit",
							}}
						>
							Welcome to
							<br />
							<span className="text-brand-gradient">AI4FI</span>
						</h2>
						<div className="max-w-xl mx-auto mt-8 h-px bg-gradient-to-r from-transparent via-brand-color to-transparent opacity-30" />
						<p className="mt-8 text-secondary-foreground/70 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
							Transforming your vision into professional imagery
							<br className="hidden md:block" /> with the power of generative
							AI.
						</p>
					</div>

					{/* Decorative elements */}
					<div
						className="absolute -z-10 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
						style={{
							background:
								"radial-gradient(circle, var(--brand) 0%, transparent 70%)",
						}}
					/>
				</motion.div>
			</div>

			<style>{`
				@keyframes nudge {
					0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.4 }
					50%      { transform: translateX(-50%) translateY(7px); opacity: 0.9 }
				}
			`}</style>
		</div>
	);
}
