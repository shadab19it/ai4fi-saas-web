import { FC, useEffect } from "react";

const AboutUs = () => {
  const features = [
    {
      icon: "🎨",
      title: "Customization",
      description: "Create models tailored to your brand’s vision with adjustable features like gender, skin tone, pose, and more.",
    },
    {
      icon: "⚡",
      title: "Efficiency",
      description: "Generate professional outputs in minutes, saving you months of effort.",
    },
    {
      icon: "💰",
      title: "Cost-Effective",
      description: "Eliminate the high costs of traditional shoots, models, and logistics.",
    },
    {
      icon: "🌎",
      title: "Global Appeal",
      description: "Showcase garments on models from various regions, styles, and cultures.",
    },
    {
      icon: "♻️",
      title: "Sustainability",
      description: "Reduce your environmental footprint by adopting a digital-first approach.",
    },
    {
      icon: "🚀",
      title: "Innovation",
      description: "Embrace the latest advancements in AI for a competitive edge.",
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <section className='bg-white text-gray-900'>
      {/* Hero Section */}
      <div className='relative bg-gradient-to-br min-h-[400px] from-sky-950 to-gray-800'>
        {/* <img
          src='https://resleeve.ai/wp-content/uploads/2023/05/imgpsh_fullsize_anim-2.jpg'
          alt='Fashion Banner'
          className='w-full h-[50vh] object-cover'
        /> */}
        <div className='absolute inset-0  bg-opacity-40 flex items-center justify-center'>
          <h1 className='text-4xl md:text-6xl font-bold text-white text-center px-4'>
            Revolutionizing Fashion with AI
            <br /> Smarter, Faster, Sustainable
          </h1>
        </div>
      </div>

      {/* About Content */}
      <div className='container mx-auto px-6 py-12 lg:py-20  bg-gradient-to-br from-sky-950 to-gray-950'>
        <div className='flex flex-col lg:flex-row items-center gap-12 px-6 md:px-12 lg:px-20 py-12 bg-gradient-to-r from-cyan-900/30 to-sky-900/30'>
          {/* Content Section */}
          <div className='lg:w-1/2 ' data-aos='fade-right' data-aos-duration='1000'>
            <h2 className='text-3xl md:text-4xl font-bold mb-6 text-gray-900 relative inline-block'>
              <span
                className='text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500'
                data-aos='zoom-in'
                data-aos-delay='500'
                data-aos-duration='800'>
                Welcome to AI4FI
              </span>
              <div className='absolute left-0 bottom-[-6px] h-1 w-16 bg-purple-500 rounded-md animate-pulse'></div>
            </h2>
            <p className='text-lg text-gray-200 leading-relaxed mb-4'>
              we are shaping the future of fashion with innovative, AI-powered solutions. Our mission is to help garment brands
              revolutionize the way they create, showcase, and market their collections.
            </p>
            <p className=' text-lg text-gray-200 leading-relaxed mb-6 '>
              At the heart of AI4FI is our advanced artificial intelligence platform that enables garment brands to generate lifelike
              virtual models and deliver immersive virtual try-on experiences. Whether you need professional-grade marketing images in
              minutes or aim to personalize your online storefront with diverse and customizable virtual models, AI4FI makes it all
              possible.
            </p>
          </div>

          {/* Image Section */}
          <div className='lg:w-1/2' data-aos='fade-left' data-aos-duration='1000'>
            <img
              src='https://uploads-ssl.webflow.com/6082f2094ccb2d6ff32eb5d8/6435384cbe80c37bc1786fc9_Blog%2022.jpg'
              alt='About AI4FI'
              className='rounded-lg shadow-lg object-cover w-full h-[40vh] transform transition-transform duration-500 hover:scale-105'
            />
          </div>
        </div>

        <div className='mt-16'>
          <h3 className='text-3xl font-bold mb-6 text-center text-gray-100'>Why Choose AI4FI?</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {features.map((feature, idx) => (
              <FeatureCard key={idx} icon={feature.icon} title={feature.title} description={feature.description} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Feature Card Component
const FeatureCard: FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
  <div className='p-6 bg-gradient-to-r from-cyan-900/30 to-sky-900/30 rounded-lg shadow-md text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl'>
    <div className='text-4xl'>{icon}</div>
    <h4 className='text-xl font-semibold mt-4 text-gray-200'>{title}</h4>
    <p className='text-gray-400 mt-2'>{description}</p>
  </div>
);

export default AboutUs;
