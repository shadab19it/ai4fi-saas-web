

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
import SvgIcons from "../../../components/SvgIcons";

const AIFeatures = () => {
	const { theme } = useTheme();
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
