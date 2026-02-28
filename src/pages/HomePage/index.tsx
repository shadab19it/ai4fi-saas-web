import { FC } from "react";
import CTASection from "./sections/Cta";
import DemoSection from "./sections/Demo";
import FeaturedGallery from "./sections/FeaturedGallery";
import Features from "./sections/Features";

import AboutUs from "./sections/AboutUs";
// import HeroSection2 from "./sections/HeroSection2";
import KeyFeatures from "./sections/KeyFeatures";
import AiFashionHero from "./sections/AiFashionHero";
import SayGoodBySection from "./sections/SayGoodBy";
import TestimonialsStacked from "./sections/Testimonial";

import { motion } from "motion/react";
import SvgIcons from "../../components/SvgIcons";



const HomePage: FC = () => {
	const partners = [
		SvgIcons.amazone,
		SvgIcons.google,
		SvgIcons.netflix,
		SvgIcons.shopify,
		SvgIcons.youtube,
	];

	return (
		<div>
			<AiFashionHero />
			<SayGoodBySection />
			<KeyFeatures />
			<DemoSection />
			<Features />
			<div className="max-w-[100vw] mx-auto">
				<div className=" px-4 sm:px-6 lg:px-8  z-10 py-8 md:pb-8 pt-16">
					<h4 className="text-center  mb-5 font-bold leading-tight">
						Our Technology Partners
					</h4>
					<div className="md:grid flex flex-wrap items-center justify-between md:place-items-center md:grid-cols-5 gap-6 md:gap-8">
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
			<FeaturedGallery />
			<TestimonialsStacked />
			<AboutUs />
			<CTASection />
		</div>
	);
};

export default HomePage;
