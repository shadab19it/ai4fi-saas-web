import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../../services/authService";

const CTASection = () => {
  const navigate = useNavigate();
  return (
    <section className='py-20 relative overflow-hidden bg-background'>
      <div className='absolute inset-0 bg-primary/5' />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='text-center text-foreground'>
          <h2 className='text-4xl md:text-5xl font-bold mb-6'>Start Your AI Fashion Journey Today!</h2>
          <p className='text-xl text-muted-foreground mb-8 max-w-2xl mx-auto'>
            Join the future of fashion visualization and transform your brand's digital presence
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='flex flex-col md:flex-row gap-4 justify-center'>
            <button
              onClick={() => {
                if (authService.isAuthenticated()) {
                  navigate("/features");
                } else {
                  navigate("/login");
                }
              }}
              className='bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-lg transition duration-200 text-lg'>
              Virtual Try Room
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
