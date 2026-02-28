import { useState, useRef, useEffect, Fragment } from "react";
import { TrendingUp } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { motion } from "motion/react";
import SectionHeader from "./SectionHeader";
import {
	AdGeneratorSection,
	ProductPhotographySection,
	VirtualTrialHighlight,
} from "./TestFeature";
import { useMediaQuery } from "../../../components/useMediaQuery";

const KeyFeatures = () => {
	const { theme } = useTheme();
	const isMobile = useMediaQuery("(max-width: 768px)");

	const features = [
		{
			title: "Virtual Trial Room",
			children: <VirtualTrialHighlight />,
			accentColor: "from-blue-500 to-cyan-500",
		},
		{
			title: "Photo Studio",
			children: <ProductPhotographySection />,
			accentColor: "from-purple-500 to-pink-500",
		},
		{
			title: "Advertisement",
			children: <AdGeneratorSection />,
			accentColor: "from-orange-500 to-red-500",
		},
	];

	const [activeIndex, setActiveIndex] = useState(0);
	const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
	const isScrolling = useRef(false);

	// ✅ Fixed Scroll Sync Logic (Sticky Stack Behavior)
	useEffect(() => {
		if (isMobile) return;

		const handleScroll = () => {
			if (isScrolling.current) return;

			const STICKY_POINT = 120; // matches sticky top-[120px]
			let newActiveIndex = 0;

			sectionRefs.current.forEach((section, index) => {
				if (!section) return;

				const rect = section.getBoundingClientRect();

				// When section reaches sticky zone
				if (rect.top <= STICKY_POINT + 5) {
					newActiveIndex = index;
				}
			});

			// Lock to last section once fully visible
			const lastSection = sectionRefs.current[sectionRefs.current.length - 1];

			if (lastSection) {
				const lastRect = lastSection.getBoundingClientRect();

				if (lastRect.bottom <= window.innerHeight) {
					newActiveIndex = sectionRefs.current.length - 1;
				}
			}

			if (newActiveIndex !== activeIndex) {
				setActiveIndex(newActiveIndex);
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();

		return () => window.removeEventListener("scroll", handleScroll);
	}, [activeIndex, isMobile]);

	const handleTabClick = (index: number) => {
		const targetElement = sectionRefs.current[index];
		if (!targetElement) return;

		isScrolling.current = true;

		const STICKY_OFFSET = isMobile ? 80 : 120;

		const elementTop =
			targetElement.getBoundingClientRect().top + window.scrollY;

		const scrollToPosition = elementTop - STICKY_OFFSET;

		window.scrollTo({
			top: scrollToPosition,
			behavior: "smooth",
		});

		// Wait until scroll completes before re-enabling detection
		const scrollDuration = 800;

		setTimeout(() => {
			setActiveIndex(index);
			isScrolling.current = false;
		}, scrollDuration);
	};

	return (
		<div className="relative min-h-screen bg-background dark:bg-gradient-to-br from-slate-50 to-slate-100 overflow-clip">
			{theme === "dark" && (
				<div className="absolute inset-0 dark:bg-gradient-to-br from-cyan-950 via-black to-sky-950"></div>
			)}

			<div className="relative z-10 max-w-full mx-auto px-2 md:px-8 py-20 flex flex-col">
				<SectionHeader
					title="Key Features"
					description="Transform your operations with intelligent automation"
					subtitle="Why Choose Us"
					highlightedWord="Features"
					icon={<TrendingUp className="text-muted-foreground" size={18} />}
				/>

				<div className="flex relative flex-col md:flex-row gap-4 items-start">
					{/* Sidebar Tabs */}
					{!isMobile && (
						<aside
							className={`w-full md:w-[35%] lg:w-[25%] z-30 transition-all duration-300 ${isMobile
									? "mt-10 static"
									: "mt-[30vh] sticky top-[20vh] bg-background/5 md:bg-transparent backdrop-blur-md md:backdrop-blur-none py-6 md:py-0"
								}`}
						>
							<div className="flex items-center justify-center flex-row md:flex-col gap-6 md:gap-10 overflow-x-auto md:overflow-visible px-4 md:px-0 scrollbar-hide">
								{features.map((feature, index) => {
									const isActive = activeIndex === index;

									return (
										<button
											key={index}
											onClick={() => handleTabClick(index)}
											className="group relative flex items-center gap-4 py-2 flex-shrink-0 md:flex-shrink transition-all duration-500"
										>
											<motion.div
												className="hidden md:block absolute left-[-20px] w-1.5 rounded-full bg-gradient-to-b from-brand-color to-blue-600"
												initial={false}
												animate={{
													height: isActive ? "100%" : "0%",
													opacity: isActive ? 1 : 0,
												}}
												transition={{
													type: "spring",
													stiffness: 300,
													damping: 30,
												}}
											/>

											<div className="flex flex-col items-start gap-1">
												<motion.span
													animate={{
														scale: isActive ? 1.25 : 1,
														translateX: isActive && !isMobile ? 15 : 0,
														color: isActive
															? "var(--foreground)"
															: "var(--muted-foreground)",
													}}
													transition={{
														type: "spring",
														stiffness: 200,
														damping: 20,
													}}
													className={`text-lg md:text-xl lg:text-2xl font-extrabold whitespace-nowrap transition-colors duration-300 ${isActive
															? "text-foreground"
															: "text-muted-foreground/30 hover:text-muted-foreground/60"
														}`}
												>
													{feature.title}
												</motion.span>

												<motion.div
													initial={false}
													animate={{
														width: isActive ? "100%" : "0%",
														opacity: isActive ? 1 : 0,
													}}
													className={`h-1 mt-1 rounded-full bg-gradient-to-r ${feature.accentColor} md:hidden`}
												/>
											</div>
										</button>
									);
								})}
							</div>
						</aside>
					)}

					{/* Feature Sections */}
					<div className="w-full md:w-[65%] lg:w-[75%] relative pb-[20vh]">
						{features.map((feature, index) => (
							<Fragment key={index}>
								<div
									ref={(el) => {
										sectionRefs.current[index] = el;
									}}
									className={`w-full mb-12 md:mb-[0vh] last:mb-0 ${isMobile ? "" : "sticky top-[120px]"
										}`}
									style={{
										zIndex: isMobile ? 1 : index + 10,
									}}
								>
									<div className="rounded-3xl overflow-hidden glass-card-heavy border border-white/10 shadow-2xl backdrop-blur-xl bg-background/40">
										{feature.children}
									</div>
								</div>

								{index === features.length - 1 && (
									<div className="max-h-[20vh] "></div>
								)}
							</Fragment>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default KeyFeatures;
