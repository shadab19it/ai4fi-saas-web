import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";

import SectionHeader from "./SectionHeader";
import MasonryGallery from "./MasonryGallery";

const FeaturedGallery = () => {
	const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });

	const row1Images = [
		{
			id: 1,
			src: "https://ai4fi-bucket.s3.amazonaws.com/formal/male/male_model_007.png",
			alt: "AI Model 1",
		},
		{
			id: 2,
			src: "https://ai4fi-bucket.s3.amazonaws.com/formal/female/female_model_012.png",
			alt: "AI Model 2",
		},
		{
			id: 3,
			src: "https://ai4fi-bucket.s3.amazonaws.com/formal/male/male_model_012.png",
			alt: "AI Model 3",
		},
		{
			id: 4,
			src: "https://ai4fi-bucket.s3.amazonaws.com/formal/male/male_model_023.png",
			alt: "AI Model 4",
		},
		{
			id: 5,
			src: "https://ai4fi-bucket.s3.amazonaws.com/formal/male/male_model_035.png",
			alt: "AI Model 5",
		},
		{
			id: 6,
			src: "https://ai4fi-bucket.s3.amazonaws.com/formal/female/female_model_005.png",
			alt: "AI Model 6",
		},
	];

	const row2Images = [
		{
			id: 7,
			src: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/male/male_model_039.png",
			alt: "Plus-Size Model 1",
		},
		{
			id: 8,
			src: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/female/female_model_006.png",
			alt: "Plus-Size Model 2",
		},
		{
			id: 9,
			src: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/male/male_model_014.png",
			alt: "Plus-Size Model 3",
		},
		{
			id: 10,
			src: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/female/female_model_011.png",
			alt: "Plus-Size Model 4",
		},
		{
			id: 11,
			src: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/male/male_model_018.png",
			alt: "Plus-Size Model 5",
		},
		{
			id: 12,
			src: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/female/female_model_023.png",
			alt: "Plus-Size Model 6",
		},
	];

	return (
		<section
			id="gallery"
			className="py-12 md:py-20 relative overflow-hidden bg-background"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<SectionHeader
					title=" Featured AI Models"
					description="Discover our diverse range of AI-generated fashion models"
				/>
			</div>

			{/* First Row */}
			{/* <div className='relative w-full overflow-hidden mb-8 md:mb-12'>
        <div className='flex animate-marquee-left gap-4'>
          {duplicatedRow1.map((image, index) => (
            <div key={`${image.id}-${index}`} className='relative group flex-shrink-0'>
              <div className='w-48 h-72 md:w-72 md:h-96 overflow-hidden rounded-lg'>
                <img
                  src={image.src}
                  alt={image.alt}
                  className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <div className='absolute bottom-4 left-4 right-4'>
                    <div className='bg-black/30 backdrop-blur rounded-lg p-3'>
                      <p className='text-white text-sm font-medium'>{image.alt}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}
			{/* <ImageCarousel images={duplicatedRow1} rtl={false} /> */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-20">
				<MasonryGallery
					gallery={[
						{
							id: 1,
							span: "tall",
							images: [row1Images[0], row1Images[1]].map((img) => ({
								type: "real",
								src: img.src,
								label: img.alt,
							})),
						},
						{
							id: 2,
							span: "tall",
							images: [row1Images[2], row2Images[0]].map((img) => ({
								type: "real",
								src: img.src,
								label: img.alt,
							})),
						},
						{
							id: 3,
							span: "tall",
							images: [row1Images[3], row2Images[1]].map((img) => ({
								type: "real",
								src: img.src,
								label: img.alt,
							})),
						},
						{
							id: 4,
							span: "tall",
							images: [row1Images[4], row2Images[2]].map((img) => ({
								type: "real",
								src: img.src,
								label: img.alt,
							})),
						},
						{
							id: 5,
							span: "tall",
							images: [row1Images[5], row2Images[3]].map((img) => ({
								type: "real",
								src: img.src,
								label: img.alt,
							})),
						},
						{
							id: 6,
							span: "tall",
							images: [row2Images[4], row2Images[5]].map((img) => ({
								type: "real",
								src: img.src,
								label: img.alt,
							})),
						},
						{
							id: 7,
							span: "tall",
							images: [row1Images[0], row2Images[0]].map((img) => ({
								type: "real",
								src: img.src,
								label: img.alt,
							})),
						},
						{
							id: 8,
							span: "tall",
							images: [row1Images[1], row2Images[1]].map((img) => ({
								type: "real",
								src: img.src,
								label: img.alt,
							})),
						},
					]}
				/>
			</div>

			{/* Second Row Title */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center py-4">
				<SectionHeader
					title=" Obese Model Collection"
					description="Experience lifelike AI models, including plus-size, for a true-to-reality shopping experience. Instantly generate 4K visuals
            with customizable poses, lighting, and backgrounds—boosting sales and reducing returns."
				/>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
				<MasonryGallery
					gallery={[
						{
							id: 9,
							span: "tall",
							images: [row2Images[0], row2Images[1]].map((img) => ({
								type: "real",
								src: img.src,
								label: img.alt,
							})),
						},
						{
							id: 10,
							span: "tall",
							images: [row2Images[2], row2Images[3]].map((img) => ({
								type: "real",
								src: img.src,
								label: img.alt,
							})),
						},
						{
							id: 11,
							span: "tall",
							images: [row2Images[4], row1Images[0]].map((img) => ({
								type: "real",
								src: img.src,
								label: img.alt,
							})),
						},
						{
							id: 12,
							span: "tall",
							images: [row2Images[5], row1Images[1]].map((img) => ({
								type: "real",
								src: img.src,
								label: img.alt,
							})),
						},
					]}
				/>
			</div>

			{/* Gradient Overlays */}
			<div className="absolute top-0 left-0 w-40 h-full bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
			<div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
		</section>
	);
};

export default FeaturedGallery;
