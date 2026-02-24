

import React, { FC, useState } from "react";
import {
	Mail,
	MessageCircle,
	ChevronDown,
	Plus,
	Minus,
	HelpCircle,
	ArrowRight,
} from "lucide-react";

/* --- FAQ ITEM COMPONENT --- */
const FAQItem: FC<{ question: string, answer: string, isOpen: boolean, toggle: () => void }> = ({ question, answer, isOpen, toggle }) => {
	return (
		<div className="border-b border-border last:border-0">
			<button
				onClick={toggle}
				className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
			>
				<span
					className={`text-lg font-medium transition-colors duration-300 ${isOpen ? "text-brand" : "text-foreground group-hover:text-brand"}`}
				>
					{question}
				</span>
				<div
					className={`relative flex items-center justify-center min-w-8 min-h-8 rounded-full transition-colors duration-300 ${isOpen ? "bg-brand-color text-white" : "bg-secondary text-secondary-foreground group-hover:bg-background"}`}
				>
					{isOpen ? <Minus size={18} /> : <Plus size={18} />}
				</div>
			</button>

			<div
				className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0"}`}
			>
				<div className="overflow-hidden">
					<p className="text-foreground leading-relaxed text-base">{answer}</p>
				</div>
			</div>
		</div>
	);
};

/* --- SUPPORT SECTION --- */
const SupportSection = () => {
	// State to manage which FAQ is open (null = all closed)
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	const faqs = [
		{
			question: "How does your AI model technology work?",
			answer:
				"Our advanced AI technology uses state-of-the-art Generative Adversarial Networks (GANs) and diffusion models. We combine computer vision to analyze your garment and neural networks to map it onto realistic, AI-generated human figures, ensuring accurate drape, texture, and fit without a physical photoshoot.",
		},
		{
			question: "What types of clothing can be showcased?",
			answer:
				"We support a wide range of apparel including tops, bottoms, dresses, outerwear, and swimwear. Currently, complex multi-layered couture or highly transparent fabrics may require manual review, but our standard engine handles 95% of retail fashion categories instantly.",
		},
		{
			question: "Do I own the rights to the generated images?",
			answer:
				"Yes, absolutely. Once you generate and download an image from our platform, you hold the full commercial license to use it for your e-commerce store, social media ads, and marketing campaigns worldwide.",
		},
		{
			question: "Can I customize the model's ethnicity and body type?",
			answer:
				"Yes! Our platform prioritizes diversity. You can filter models by ethnicity, age range, and body type (including plus-size and petite) to perfectly match your brand's target audience.",
		},
	];

	return (
		<section className="relative py-24 px-6 bg-background/80 overflow-hidden">
			{/* Background Decor (Subtle Blur) */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10"></div>

			<div className="max-w-4xl mx-auto space-y-20">
				{/* --- PART 1: GET IN TOUCH (Redesigned) --- */}
				<div className="text-center space-y-8">
					<div className="space-y-4">
						<h2 className="text-4xl font-extrabold text-foreground">
							Get in Touch
						</h2>
						<p className="text-lg text-secondary-foreground max-w-2xl mx-auto">
							Ready to transform your fashion showcase? Our team is here to help
							you get started with AI-powered fashion photography.
						</p>
					</div>

					{/* Contact Card - Floating Glassmorphism Style */}
					<div className="relative group mx-auto max-w-3xl">
						<div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
						<div className="relative bg-secondary rounded-2xl p-8 md:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-white/50">
							{/* Left: Icon & Text */}
							<div className="flex items-center gap-6 text-left">
								<div className="w-16 h-16 bg-background text-brand rounded-2xl flex items-center justify-center shadow-inner">
									<Mail size={32} />
								</div>
								<div>
									<h3 className="text-xl font-bold text-foreground">
										Email Support
									</h3>
									<p className="text-slate-500">
										We typically respond within 24 hours.
									</p>
									<a
										href="mailto:support@ai4fi.com"
										className="text-sm font-semibold text-brand mt-1 hover:underline"
									>
										support@ai4fi.com
									</a>
								</div>
							</div>

							{/* Right: Action Button */}
							<button className="flex items-center gap-2 px-8 py-4 bg-brand-color  text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-transform hover:-translate-y-1 w-full md:w-auto justify-center">
								<MessageCircle size={20} />
								<span>Contact Us</span>
							</button>
						</div>
					</div>
				</div>

				{/* --- PART 2: FAQ (Redesigned) --- */}
				<div className="bg-background  rounded-3xl p-8 md:p-12 shadow-lg border border-border">
					<div className="text-center mb-12">
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-bold uppercase tracking-wider mb-4">
							<HelpCircle size={14} /> Help Center
						</div>
						<h2 className="text-3xl font-bold text-foreground">
							Frequently Asked Questions
						</h2>
						<p className="text-slate-500 mt-2">
							Everything you need to know about our AI fashion platform
						</p>
					</div>

					<div className="max-w-3xl mx-auto">
						{faqs.map((faq, index) => (
							<FAQItem
								key={index}
								question={faq.question}
								answer={faq.answer}
								isOpen={openIndex === index}
								toggle={() => setOpenIndex(openIndex === index ? null : index)}
							/>
						))}
					</div>

					<div className="mt-10 text-center">
						<a
							href="#"
							className="inline-flex items-center gap-1 text-sm font-bold text-foreground hover:text-brand transition-colors"
						>
							View all FAQs <ArrowRight size={16} />
						</a>
					</div>
				</div>
			</div>
		</section>
	);
};

export default SupportSection;
