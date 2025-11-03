import { motion } from "framer-motion";
import { Brain, Sparkles, Gauge, Paintbrush, Users, Zap, Globe, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: <Brain className='w-6 h-6 text-white' />,
    title: "AI Model Generation",
    description: "Generate diverse, realistic virtual models using cutting-edge AI technology that adapts to your specific requirements.",
    gradient: "from-cyan-500 to-blue-500",
    delay: 0.1,
  },
  {
    icon: <Sparkles className='w-6 h-6 text-white' />,
    title: "Virtual Try-On Experience",
    description: "See how garments look on different body types and poses instantly with photorealistic rendering quality.",
    gradient: "from-sky-500 to-cyan-500",
    delay: 0.2,
  },
  {
    icon: <Gauge className='w-6 h-6 text-white' />,
    title: "Cost-Effective & Scalable",
    description: "Reduce photoshoot costs by up to 90% while increasing your product showcase capabilities without limits.",
    gradient: "from-blue-500 to-cyan-500",
    delay: 0.3,
  },
  {
    icon: <Paintbrush className='w-6 h-6 text-white' />,
    title: "Customization & Branding",
    description: "Tailor the virtual models to match your brand's unique identity with custom styling, poses, and environments.",
    gradient: "from-cyan-500 to-sky-500",
    delay: 0.4,
  },
  {
    icon: <Users className='w-6 h-6 text-white' />,
    title: "Diverse Representation",
    description: "Showcase your products on models of all ethnicities, body types, and ages to reach broader audiences.",
    gradient: "from-sky-500 to-cyan-500",
    delay: 0.5,
  },
  {
    icon: <Zap className='w-6 h-6 text-white' />,
    title: "Rapid Production",
    description: "Generate hundreds of product images in minutes instead of weeks, accelerating your go-to-market strategy.",
    gradient: "from-blue-500 to-sky-500",
    delay: 0.6,
  },
  {
    icon: <Globe className='w-6 h-6 text-white' />,
    title: "Global Marketplace Integration",
    description: "Seamlessly export AI-generated content to major e-commerce platforms with our one-click integration system.",
    gradient: "from-cyan-500 to-blue-500",
    delay: 0.7,
  },
  {
    icon: <ShieldCheck className='w-6 h-6 text-white' />,
    title: "Ethical AI Guarantee",
    description: "Our AI systems are built with ethical considerations in mind, ensuring fair representation and transparency.",
    gradient: "from-sky-500 to-blue-500",
    delay: 0.8,
  },
];

const Features = () => {
  return (
    <section id='features' className='py-24 relative overflow-hidden bg-gradient-to-br from-black via-black to-sky-950'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className='text-center mb-16'>
          <span className='inline-block px-3 py-1 bg-cyan-900 bg-opacity-30 text-cyan-400 text-sm font-medium rounded-full mb-3 backdrop-blur-sm'>
            Why Choose AI4FI
          </span>
          <h2 className='text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400'>
            Cutting-Edge AI Features
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='h-1 bg-gradient-to-r from-cyan-500 to-sky-500 mx-auto mb-6 rounded-full'
          />
          <p className='text-gray-400 text-lg md:text-xl max-w-3xl mx-auto'>
            Transform your fashion showcase with AI-powered innovation that delivers stunning results at a fraction of traditional costs
          </p>
        </motion.div>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8'>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: feature.delay }}
              whileHover={{ y: -5 }}
              className='group h-full'>
              <div className='bg-slate-900 bg-opacity-50 backdrop-blur-xl rounded-xl p-6 h-full border border-slate-700 relative overflow-hidden shadow-lg'>
                <div className='absolute -top-10 -right-10 w-20 h-20 bg-cyan-500 bg-opacity-10 rounded-full blur-xl' />

                <div className={`bg-gradient-to-br ${feature.gradient} p-3 rounded-lg inline-block mb-5 shadow-lg`}>{feature.icon}</div>

                <h3 className='text-xl font-bold mb-3 text-white group-hover:text-cyan-300 transition-colors duration-300'>
                  {feature.title}
                </h3>

                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "40%" }}
                  className='h-0.5 bg-gradient-to-r from-cyan-400 to-transparent mb-4 rounded-full'
                />

                <p className='text-gray-400 group-hover:text-gray-300 transition-colors duration-300 text-sm leading-relaxed'>
                  {feature.description}
                </p>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className='mt-4 text-cyan-400 text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  Learn more
                  <svg className='w-4 h-4 ml-1' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className='mt-20 bg-slate-900 bg-opacity-30 backdrop-blur-lg p-8 md:p-10 rounded-2xl border border-slate-800'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            {[
              { value: "90%", label: "Cost Reduction" },
              { value: "24hr", label: "Turnaround Time" },
              { value: "1000+", label: "Fashion Brands" },
              { value: "10M+", label: "AI Models Generated" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className='text-center'>
                <h4 className='text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-cyan-300 mb-2'>
                  {stat.value}
                </h4>
                <p className='text-gray-400 text-sm md:text-base'>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
