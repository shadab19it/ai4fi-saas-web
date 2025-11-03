import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Fashion Director",
    company: "",
    image: "/test1.jpg",
    quote: "AI4FI has revolutionized our product photography process. We've cut costs by 70% while increasing our content output.",
    stars: 5,
  },
  {
    name: "Michael Chen",
    role: "E-commerce Manager",
    company: "",
    image: "/test2.jpg",
    quote: "The quality of AI-generated models is incredible. Our customers can't tell the difference from traditional photography.",
    stars: 5,
  },
  {
    name: "Emma Williams",
    role: "Creative Director",
    company: "",
    image: "/test3.jpg",
    quote: "The platform's ease of use and quick turnaround time has transformed our workflow. Highly recommended!",
    stars: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className='py-12 md:py-20 relative overflow-hidden bg-gradient-to-t from-black to-cyan-950'>
      <div className='absolute inset-0 bg-gradient-to-tl from-black to-cyan-950' />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='text-center mb-8 md:mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 text-white'>Success Stories</h2>
          <p className='text-gray-300 text-lg md:text-xl'>See what our clients say about AI4FI</p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8'>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className='group'>
              <div className='bg-cyan-900 backdrop-blur rounded-xl p-6 md:p-8 h-full transition-all duration-300 hover:bg-cyan-800'>
                <div className='flex gap-1 mb-4 md:mb-6'>
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} className='w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-yellow-400' />
                  ))}
                </div>
                <p className='text-gray-300 text-sm md:text-base mb-4 md:mb-6'>{testimonial.quote}</p>
                <div className='flex items-center gap-3 md:gap-4'>
                  <div className='relative w-10 h-10 md:w-12 md:h-12'>
                    <img src={testimonial.image} alt={testimonial.name} className='rounded-full object-cover' />
                  </div>
                  <div>
                    <h4 className='font-semibold text-white text-sm md:text-base'>{testimonial.name}</h4>
                    <p className='text-gray-400 text-xs md:text-sm'>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
