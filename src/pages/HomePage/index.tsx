import { FC, lazy, Suspense } from "react";
import AiFashionHero from "./sections/AiFashionHero";

// Below-fold sections — code-split so they don't block initial paint
const SayGoodBySection    = lazy(() => import("./sections/SayGoodBy"));
const KeyFeatures         = lazy(() => import("./sections/KeyFeatures"));
const DemoSection         = lazy(() => import("./sections/Demo"));
const Features            = lazy(() => import("./sections/Features"));
const FeaturedGallery     = lazy(() => import("./sections/FeaturedGallery"));
const TestimonialsStacked = lazy(() => import("./sections/Testimonial"));
const AboutUs             = lazy(() => import("./sections/AboutUs"));
const CTASection          = lazy(() => import("./sections/Cta"));

const HomePage: FC = () => {
	return (
		<div>
			{/* Hero is always eager-loaded (above the fold) */}
			<AiFashionHero />

			{/* Everything below is lazy — only fetched when the browser is idle / user scrolls */}
			<Suspense fallback={null}>
				<SayGoodBySection />
				<KeyFeatures />
				<DemoSection />
				<Features />
				<FeaturedGallery />
				<TestimonialsStacked />
				<AboutUs />
				<CTASection />
			</Suspense>
		</div>
	);
};

export default HomePage;
