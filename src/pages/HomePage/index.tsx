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



const HomePage: FC = () => {
	return (
		<div>
			<AiFashionHero />
			{/* <HeroSection2 /> */}
			<SayGoodBySection />
			<KeyFeatures />
			<DemoSection />
			<Features />
			<FeaturedGallery />
			<TestimonialsStacked />
			<AboutUs />
			<CTASection />
		</div>
	);
};

export default HomePage;
