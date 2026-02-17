import { FC } from "react";
import CTASection from "./sections/Cta";
import DemoSection from "./sections/Demo";
import FeaturedGallery from "./sections/FeaturedGallery";
import Features from "./sections/Features";

import AboutUs from "./sections/AboutUs";
// import HeroSection2 from "./sections/HeroSection2";
import TrialRoom from "./sections/KeyFeatureItems";
import KeyFeatures from "./sections/KeyFeatures";
import VideoShowcase from "./sections/VideoShowcase";
import AiFashionHero from "./sections/AiFashionHero";

const HomePage: FC = () => {
	return (
		<div>
			<AiFashionHero />
			{/* <HeroSection2 /> */}
			<KeyFeatures />
			<DemoSection />
			{/* <VideoShowcase /> */}
			<Features />
			<FeaturedGallery />
			<AboutUs />
			{/* <TestimonialsSection /> */}
			<CTASection />
		</div>
	);
};

export default HomePage;
