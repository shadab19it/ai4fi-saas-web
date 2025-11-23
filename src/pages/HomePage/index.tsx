import { FC } from "react";
import CTASection from "./sections/Cta";
import DemoSection from "./sections/Demo";
import FeaturedGallery from "./sections/FeaturedGallery";
import Features from "./sections/Features";
import HeroSection from "./sections/HeroSection";
import HowItWorks from "./sections/HowItWorks";
import TestimonialsSection from "./sections/Testimonial";
import AboutUs from "./sections/AboutUs";
import HeroSection2 from "./sections/HeroSection2";

const HomePage: FC = () => {
  return (
    <div>
      <HeroSection2 />
      <HowItWorks />
      <DemoSection />
      <Features />
      <FeaturedGallery />
      <AboutUs />
      {/* <TestimonialsSection /> */}
      <CTASection />
    </div>
  );
};

export default HomePage;
