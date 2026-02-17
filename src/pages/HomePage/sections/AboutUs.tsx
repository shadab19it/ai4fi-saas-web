/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, ChevronDown, Building2, Users, Target } from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  const [openFaq, setOpenFaq] = React.useState(0);

  const features = [
    {
      icon: <Building2 className='w-6 h-6' />,
      title: "Innovation First",
      description: "Pioneering the future of fashion e-commerce through cutting-edge AI technology.",
    },
    {
      icon: <Users className='w-6 h-6' />,
      title: "Customer Focused",
      description: "Dedicated to providing an exceptional experience for both brands and shoppers.",
    },
    {
      icon: <Target className='w-6 h-6' />,
      title: "Sustainable Future",
      description: "Committed to reducing fashion's environmental impact through digital solutions.",
    },
  ];

  const faqs = [
    {
      question: "How does your AI model technology work?",
      answer:
        "Our advanced AI technology uses state-of-the-art machine learning algorithms to generate realistic fashion model images. We combine computer vision and neural networks to ensure high-quality, diverse representations of clothing items.",
    },
    {
      question: "What types of clothing can be showcased?",
      answer:
        "Our platform supports a wide range of fashion items including tops, bottoms, dresses, outerwear, and accessories. The AI models can accurately represent different styles, fits, and fabric types.",
    },
    {
      question: "How long does it take to generate AI model images?",
      answer:
        "Our system generates high-quality AI model images within minutes. The exact time depends on the complexity of the garment and the number of variations requested.",
    },
    {
      question: "Is the service suitable for small businesses?",
      answer:
        "Absolutely! We've designed our platform to be accessible for businesses of all sizes. Our pricing plans are flexible and scalable to meet your specific needs.",
    },
  ];

  return (
    <div id='about' className='min-h-screen bg-background'>
      {/* About Section */}
      <section className='py-20 relative overflow-hidden'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center mb-16'>
            <h1 className='text-5xl font-bold mb-6 text-foreground'>
              Revolutionizing Fashion Showcase
            </h1>
            <p className='text-muted-foreground text-xl max-w-3xl mx-auto'>
              We're transforming how fashion brands present their collections through innovative AI technology, making professional fashion
              photography accessible to everyone.
            </p>
          </motion.div>

          <div className='grid md:grid-cols-3 gap-8 mb-20'>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                
                className='glass-card p-8 hover:shadow-lg transition-all duration-300 border border-border'>
    <div className="absolute -top-4 -right-4 w-20 h-20 bg-brand-color rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

                <div className='bg-brand-color text-white p-3 rounded-xl inline-block mb-4'>{feature.icon}</div>
                <h3 className='text-xl font-bold mb-3 text-foreground'>{feature.title}</h3>
                <p className='text-muted-foreground'>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id='contact' className='py-20 relative'>
        <div className='absolute inset-0 bg-gradient-to-b from-[var(--background)] to-transparent bg-opacity-20 ' />
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center mb-12'>
            <h2 className='text-4xl font-bold mb-4 text-foreground'>Get in Touch</h2>
            <p className='text-muted-foreground text-xl max-w-2xl mx-auto'>
              Ready to transform your fashion showcase? Our team is here to help you get started with AI-powered fashion photography.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='bg-card backdrop-blur-xl rounded-2xl p-8 max-w-2xl mx-auto border border-border'>
            <div className='flex items-center justify-between mb-8 md:flex-row flex-col gap-4'>
              <div className='flex items-center space-x-4'>
                <div className='bg-gradient-to-br from-cyan-500 to-sky-500 p-3 rounded-xl'>
                  <Mail className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h3 className='text-xl font-bold text-card-foreground'>Email Support</h3>
                  <p className='text-muted-foreground'>Response within 24 hours</p>
                </div>
              </div>
              <Link to='/contact'>
                <button className='bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2'>
                  <MessageCircle className='w-5 h-5' />
                  <span>Contact Us</span>
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='pt-4 pb-20 relative'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center mb-16'>
            <h2 className='text-4xl font-bold mb-4 text-foreground'>Frequently Asked Questions</h2>
            <p className='text-muted-foreground text-xl'>Everything you need to know about our AI fashion platform</p>
          </motion.div>

          <div className='max-w-5xl mx-auto bg-muted/30 p-8 rounded-2xl border border-border'>
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className='mb-4 last:mb-0'>
                <button
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  className='w-full bg-card hover:bg-accent backdrop-blur-xl rounded-xl p-6 text-left transition-all duration-300 border border-border'>
                  <div className='flex justify-between items-center'>
                    <h3 className='text-lg font-semibold text-foreground'>{faq.question}</h3>
                    <ChevronDown
                      className={`w-5 h-5 text-foreground transform transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`}
                    />
                  </div>
                  <div
                    className={`mt-4 text-muted-foreground overflow-hidden transition-all duration-300 ${
                      openFaq === index ? "max-h-40" : "max-h-0"
                    }`}>
                    {faq.answer}
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
