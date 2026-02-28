// import { motion } from "framer-motion";
// import {
// 	Brain,
// 	Sparkles,
// 	Gauge,
// 	Paintbrush,
// 	Users,
// 	Zap,
// 	Globe,
// 	ShieldCheck,
// 	TrendingUp,
// } from "lucide-react";
// import SectionHeader from "./SectionHeader";

// const features = [
// 	{
// 		icon: <Brain className="w-6 h-6 text-white" />,
// 		title: "AI Model Generation",
// 		description:
// 			"Generate diverse, realistic virtual models using cutting-edge AI technology that adapts to your specific requirements.",
// 		gradient: "from-cyan-500 to-blue-500",
// 		delay: 0.1,
// 	},
// 	{
// 		icon: <Sparkles className="w-6 h-6 text-white" />,
// 		title: "Virtual Try-On Experience",
// 		description:
// 			"See how garments look on different body types and poses instantly with photorealistic rendering quality.",
// 		gradient: "from-sky-500 to-cyan-500",
// 		delay: 0.2,
// 	},
// 	{
// 		icon: <Gauge className="w-6 h-6 text-white" />,
// 		title: "Cost-Effective & Scalable",
// 		description:
// 			"Reduce photoshoot costs by up to 90% while increasing your product showcase capabilities without limits.",
// 		gradient: "from-blue-500 to-cyan-500",
// 		delay: 0.3,
// 	},
// 	{
// 		icon: <Paintbrush className="w-6 h-6 text-white" />,
// 		title: "Customization & Branding",
// 		description:
// 			"Tailor the virtual models to match your brand's unique identity with custom styling, poses, and environments.",
// 		gradient: "from-cyan-500 to-sky-500",
// 		delay: 0.4,
// 	},
// 	{
// 		icon: <Users className="w-6 h-6 text-white" />,
// 		title: "Diverse Representation",
// 		description:
// 			"Showcase your products on models of all ethnicities, body types, and ages to reach broader audiences.",
// 		gradient: "from-sky-500 to-cyan-500",
// 		delay: 0.5,
// 	},
// 	{
// 		icon: <Zap className="w-6 h-6 text-white" />,
// 		title: "Rapid Production",
// 		description:
// 			"Generate hundreds of product images in minutes instead of weeks, accelerating your go-to-market strategy.",
// 		gradient: "from-blue-500 to-sky-500",
// 		delay: 0.6,
// 	},
// 	{
// 		icon: <Globe className="w-6 h-6 text-white" />,
// 		title: "Global Marketplace Integration",
// 		description:
// 			"Seamlessly export AI-generated content to major e-commerce platforms with our one-click integration system.",
// 		gradient: "from-cyan-500 to-blue-500",
// 		delay: 0.7,
// 	},
// 	{
// 		icon: <ShieldCheck className="w-6 h-6 text-white" />,
// 		title: "Ethical AI Guarantee",
// 		description:
// 			"Our AI systems are built with ethical considerations in mind, ensuring fair representation and transparency.",
// 		gradient: "from-sky-500 to-blue-500",
// 		delay: 0.8,
// 	},
// ];

// const Features = () => {
// 	return (
// 		<section
// 			id="features"
// 			className="py-24 relative overflow-hidden bg-background"
// 		>
// 			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
// 				<SectionHeader
// 					title=" Cutting-Edge AI Feature"
// 					description="            Transform your fashion showcase with AI-powered innovation that delivers stunning results at a fraction of traditional costs
// "
// 					subtitle="Why Choose AI4FI"
// 					icon={<TrendingUp className="text-muted-foreground" size={18} />}
// 				/>

// 				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
// 					{features.map((feature, index) => (
// 						<motion.div
// 							key={index}
// 							initial={{ opacity: 0, y: 30 }}
// 							whileInView={{ opacity: 1, y: 0 }}
// 							viewport={{ once: true }}
// 							transition={{ duration: 0.6, delay: feature.delay }}
// 							whileHover={{ y: -8 }}
// 							className="group h-full relative"
// 						>
// 							{/* The Premium Glass Container */}
// 							<div className="h-full glass-card rounded-xl p-8 border border-border  shadow-xl transition-all duration-500 overflow-hidden group-hover:shadow-text-brand-color">
// 								{/* Animated background glow following the theme */}

// 								{/* Bouncing Gradient Icon Block */}
// 								<div className="relative inline-block mb-8">
// 									<div className="absolute inset-0 bg-brand-color/20 blur-xl rounded-full" />
// 									<motion.div
// 										animate={{ y: [0, -6, 0] }}
// 										transition={{
// 											duration: 3,
// 											repeat: Infinity,
// 											ease: "easeInOut",
// 										}}
// 										className="relative p-4 bg-brand-color rounded-2xl border border-border/40  shadow-sm"
// 									>
// 										{/* Using your custom brand gradient class on the icon */}
// 										<div className="text-whitet flex items-center justify-center">
// 											{feature.icon}
// 										</div>
// 									</motion.div>
// 								</div>

// 								{/* Title with Gradient Highlight */}
// 								<h3 className="text-2xl font-bold mb-4 tracking-tight leading-tight">
// 									{feature.title}
// 								</h3>

// 								{/* Animated Brand Line */}
// 								<motion.div
// 									initial={{ width: 0 }}
// 									whileInView={{ width: "2.5rem" }}
// 									viewport={{ once: true }}
// 									className="h-1 bg-brand-color mb-6 rounded-full"
// 								/>

// 								{/* Description with improved readability */}
// 								<p className="text-sm md:text-base leading-relaxed group-hover:text-foreground transition-colors duration-300">
// 									{feature.description}
// 								</p>

// 								{/* Premium Learn More CTA */}

// 								<div className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-color opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
// 									Learn more
// 									<svg
// 										className="w-4 h-4"
// 										fill="none"
// 										stroke="currentColor"
// 										viewBox="0 0 24 24"
// 									>
// 										<path
// 											strokeLinecap="round"
// 											strokeLinejoin="round"
// 											strokeWidth={2.5}
// 											d="M9 5l7 7-7 7"
// 										/>
// 									</svg>
// 								</div>
// 							</div>
// 						</motion.div>
// 					))}
// 				</div>

// 				<motion.div
// 					initial={{ opacity: 0, y: 30 }}
// 					whileInView={{ opacity: 1, y: 0 }}
// 					viewport={{ once: true }}
// 					transition={{ duration: 0.8, delay: 0.3 }}
// 					className="mt-20  glass-card g p-8 md:p-10 rounded-2xl border border-border"
// 				>
// 					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
// 						{[
// 							{ value: "90%", label: "Cost Reduction" },
// 							{ value: "24hr", label: "Turnaround Time" },
// 							{ value: "1000+", label: "Fashion Brands" },
// 							{ value: "10M+", label: "AI Models Generated" },
// 						].map((stat, index) => (
// 							<motion.div
// 								key={index}
// 								initial={{ opacity: 0, y: 20 }}
// 								whileInView={{ opacity: 1, y: 0 }}
// 								viewport={{ once: true }}
// 								transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
// 								className="text-center"
// 							>
// 								<h4 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
// 									{stat.value}
// 								</h4>
// 								<p className="text-muted-foreground text-sm md:text-base">
// 									{stat.label}
// 								</p>
// 							</motion.div>
// 						))}
// 					</div>
// 				</motion.div>
// 			</div>
// 		</section>
// 	);
// };

// export default Features;


import React from 'react';
import {
	BrainCircuit, Sparkles, TrendingUp, PenTool,
	Users, Zap, Globe2, ShieldCheck
} from 'lucide-react';
import SectionHeader from './SectionHeader';

interface FeatureCardProps {
	icon: React.ElementType;
	title: string;
	description: string;
	color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, color }) => (
	<div className="group relative p-8 glass-card rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
		{/* Hover Gradient Overlay (Subtle) */}
		<div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

		<div className="relative z-10">
			{/* Icon Container */}
			<div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
				<Icon size={28} strokeWidth={1.5} />
			</div>

			{/* Title with Animated Underline */}
			<div className="mb-3">
				<h3 className="text-xl font-bold text-foreground leading-tight">
					{title}
				</h3>
				<div className="h-1 w-12 bg-blue-500 rounded-full mt-3 group-hover:w-full transition-all duration-500 opacity-80"></div>
			</div>

			{/* Description */}
			<p className=" leading-relaxed text-sm font-medium">
				{description}
			</p>
		</div>
	</div>
);

const CuttingEdgeFeatures = () => {
	const features = [
		{
			icon: BrainCircuit,
			title: "AI Model Generation",
			description: "Create hyper-realistic, brand-ready fashion models powered by advanced generative AI — tailored to your exact requirements.",
			color: "bg-blue-600"
		},
		{
			icon: Sparkles,
			title: "Virtual Try-On",
			description: "Instantly visualizes garment on multiple body types and poses with true-to-life rendering quality.",
			color: "bg-cyan-500"
		},
		{
			icon: TrendingUp, // Using TrendingUp instead of Gauge for "Scalable/Cost"
			title: "Cost Optimization",
			description: "Cut photoshoot costs by up to 90% while expanding creative output without production limits.",
			color: "bg-indigo-500"
		},
		{
			icon: PenTool,
			title: "Custom Brand Identity",
			description: "Design AI models aligned with your brand DNA — including styling, poses, environments, and aesthetics.",
			color: "bg-blue-500"
		},
		{
			icon: Users,
			title: "Inclusive Representation",
			description: "Showcase collections on diverse models across ethnicities, age groups, and body types — authentically and at scale.",
			color: "bg-sky-500"
		},
		{
			icon: Zap,
			title: "High-Speed Production",
			description: "Generate hundreds of product visuals in hours, not weeks — accelerating time-to-market dramatically.",
			color: "bg-blue-600"
		},
		{
			icon: Globe2,
			title: "Seamless Platform Integration",
			description: "Export and deploy AI-generated assets directly to Shopify, Amazon, Instagram, and other global marketplaces.",
			color: "bg-indigo-600"
		},
		{
			icon: ShieldCheck,
			title: "Ethical & Secure AI",
			description: "Built with responsible AI standards — ensuring compliant, safe, and brand-protected digital identities",
			color: "bg-cyan-600"
		}
	];

	return (
		<section className="py-24 px-6 bg-background/20 relative overflow-hidden">

			{/* Decorative Background Elements */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-100/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>

			<div className="max-w-7xl mx-auto">
				<SectionHeader
					description="Transform your fashion showcase with AI-powered innovation that delivers stunning results at a fraction of traditional costs."
					title="Cutting-Edge Features"
					highlightedWord="Features"
				/>



				{/* Feature Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
					{features.map((feature, idx) => (
						<FeatureCard
							key={idx}
							{...feature}
						/>
					))}
				</div>

			</div>
		</section>
	);
};

export default CuttingEdgeFeatures;
