import React, { FC, useRef, useState } from "react";
import {
	Play,
	Zap,
	CheckCircle2,
	Sliders,
	Infinity as InfinityIcon,
	X,
} from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import SectionHeader from "./SectionHeader";
import { useMediaQuery } from "../../../components/useMediaQuery";

const VideoModal: FC<{ isOpen: boolean; onClose: () => void }> = ({
	isOpen,
	onClose,
}) => {
	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
			onClick={onClose}
		>
			<div
				className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-10"
				>
					<X size={32} />
				</button>

				<div className="w-full h-full flex items-center justify-center text-white">
					<p className="text-xl font-mono">Video Player Embed Goes Here</p>
				</div>
			</div>
		</div>
	);
};

const DemoSection = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const isMobile = useMediaQuery("(max-width: 1024px)");

	const sectionRef = useRef<HTMLDivElement>(null);

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end end"],
	});

	// Animation finishes early (0 → 0.4)
	const contentX = useTransform(
		scrollYProgress,
		[0, 0.20, 0.5],
		["-100%", "-100%", "0%"]
	);

	const contentOpacity = useTransform(
		scrollYProgress,
		[0.2, 0.35],
		[0, 1]
	);

	const videoX = useTransform(
		scrollYProgress,
		[0, 0.20, 0.5],
		["100%", "100%", "0%"]
	);

	const videoOpacity = useTransform(
		scrollYProgress,
		[0.2, 0.35],
		[0, 1]
	);

	const features = [
		{
			icon: Zap,
			title: "Instant AI Models",
			desc: "Generate professional models in under 10 seconds.",
			color: "text-amber-500",
			bg: "bg-amber-50",
		},
		{
			icon: CheckCircle2,
			title: "4K Photorealism",
			desc: "High-quality, lifelike results.",
			color: "text-blue-500",
			bg: "bg-blue-50",
		},
		{
			icon: Sliders,
			title: "Fully Customizable",
			desc: "Control pose, body type, hairstyle, and ethnicity.",
			color: "text-purple-500",
			bg: "bg-purple-50",
		},
		{
			icon: InfinityIcon,
			title: "Unlimited Variations",
			desc: "Perfect for scaling e-commerce.",
			color: "text-pink-500",
			bg: "bg-pink-50",
		},
	];

	return (
		<section
			ref={sectionRef}
			className="relative lg:h-[180vh] h-auto bg-background overflow-hidden lg:overflow-clip py-20 lg:py-0"
		>
			<VideoModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>

			{/* Sticky Wrapper */}
			<div className="lg:sticky top-[40px] lg:h-screen flex items-center">
				<div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">

					{/* Header */}
					<div className="lg:mb-16  lg:mt-0">
						<SectionHeader
							title="See AI4FI in Action"
							description="Watch how our AI transforms fashion visualization"
							subtitle="Visual Demonstrations"
							icon={<Zap className="text-muted-foreground" size={18} />}
						/>
					</div>

					{/* Split Content */}
					<div className="flex flex-col lg:flex-row items-center gap-12   lg:gap-20">

						{/* LEFT SIDE */}
						<motion.div
							className="w-full lg:w-1/2"
							style={{
								x: isMobile ? 0 : contentX,
								opacity: isMobile ? 1 : contentOpacity
							}}
						>
							<div className="space-y-8">
								<h3 className="text-2xl font-bold">
									AI4FI – Single Pose Model Generator
								</h3>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{features.map((item, idx) => (
										<div
											key={idx}
											className="p-4 rounded-xl flex flex-row items-center md:flex-col border glass-card shadow-sm"
										>
											<div
												className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center mb-3`}
											>
												<item.icon
													size={20}
													className={item.color}
												/>
											</div>
											<h4 className="font-bold text-sm mb-1">
												{item.title}
											</h4>
											<p className="text-xs opacity-70">
												{item.desc}
											</p>
										</div>
									))}
								</div>
							</div>
						</motion.div>

						{/* RIGHT SIDE */}
						<motion.div
							className="w-full lg:w-1/2"
							style={{
								x: isMobile ? 0 : videoX,
								opacity: isMobile ? 1 : videoOpacity
							}}
						>
							<div
								className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 aspect-video cursor-pointer"
								onClick={() => setIsModalOpen(true)}
							>
								<img
									src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1000&q=80"
									alt="Demo"
									className="w-full h-full object-cover opacity-60"
								/>

								<div className="absolute inset-0 flex items-center justify-center">
									<div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50">
										<Play fill="white" className="ml-1" size={32} />
									</div>
								</div>
							</div>
						</motion.div>

					</div>
				</div>
			</div>
		</section>
	);
};

export default DemoSection;