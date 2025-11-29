import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";

import ImageCarousel from "../../../components/ImageCarosuel/ImageCarosuel";

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
    { id: 7, src: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/male/male_model_039.png", alt: "Plus-Size Model 1" },
    { id: 8, src: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/female/female_model_006.png", alt: "Plus-Size Model 2" },
    { id: 9, src: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/male/male_model_014.png", alt: "Plus-Size Model 3" },
    { id: 10, src: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/female/female_model_011.png", alt: "Plus-Size Model 4" },
    { id: 11, src: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/male/male_model_018.png", alt: "Plus-Size Model 5" },
    { id: 12, src: "https://ai4fi-bucket.s3.amazonaws.com/PlusSize/female/female_model_023.png", alt: "Plus-Size Model 6" },
  ];

  const duplicatedRow1 = [...row1Images, ...row1Images];
  const duplicatedRow2 = [...row2Images, ...row2Images];

  return (
    <section id='gallery' className='py-12 md:py-20 relative overflow-hidden bg-gradient-to-tl from-cyan-950 via-black to-sky-950'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='text-center mb-8 md:mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 text-white'>Featured AI Models</h2>
          <p className='text-gray-300 text-lg md:text-xl'>Discover our diverse range of AI-generated fashion models</p>
        </motion.div>
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
      <ImageCarousel images={duplicatedRow1} rtl={false} />

      {/* Second Row Title */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center py-4'>
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <h3 className='text-3xl md:text-4xl font-bold text-white mb-4'>Obese Model Collection</h3>
          <p className='text-gray-300 font-semibold mb-2'>
            Experience lifelike AI models, including plus-size, for a true-to-reality shopping experience. Instantly generate 4K visuals
            with customizable poses, lighting, and backgrounds—boosting sales and reducing returns.
          </p>
        </motion.div>
      </div>

      {/* Second Row */}
      {/* <div className='relative w-full overflow-hidden'>
        <div className='flex animate-marquee-right whitespace-nowrap gap-4'>
          {duplicatedRow2.map((image, index) => (
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

      <ImageCarousel images={duplicatedRow2} rtl={true} />

      {/* Gradient Overlays */}
      <div className='absolute top-0 left-0 w-40 h-full bg-gradient-to-r from-black to-transparent pointer-events-none z-10' />
      <div className='absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-black to-transparent pointer-events-none z-10' />
    </section>
  );
};

export default FeaturedGallery;
