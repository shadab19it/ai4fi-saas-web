"use client";
import React, { FC } from "react";
import { motion } from "framer-motion";
import { Upload, Paintbrush, ImageIcon } from "lucide-react";





const Challenges:FC<{challenges:string[],title:string ,direction:string}> = ({challenges,title,direction}) => {
  return (
    <section className='py-16 px-4 sm:px-8 lg:px-0 max-w-full mx-auto bg-background'>
      {/* Steps Section */}
     

      <div className={`grid md:grid-cols-2 gap-12 max-w-[90vw] mx-auto  items-center `}>
        {/* Challenges Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h5 className=' font-400 mb-6 text-foreground'>{title}</h5>
          <div className=' relative flex flex-col gap-4 '>
            {challenges.map((challenge, index) => (
              <div key={index} className='flex glass-card  rounded-sm p-4 items-start space-x-3 mb-4 last:mb-0'>
                <div className='h-8 w-8 flex items-center justify-center p-2 rounded-full bg-brand-color text-white font-bold text-xl'>
                  {index + 1}
                </div>
                <p className='text-muted-foreground text-md'>{challenge}</p>
                {index + 1 < challenges.length && (
  <div className="absolute left-[20px] top-full w-px h-10 border-l-2 border-dashed border-border -translate-x-1/2" />
)}
              </div>
            ))}
            
          </div>
          
        </motion.div>

        {/* Image Comparison Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='grid grid-cols-2 gap-4'>
          <div className='relative aspect-[3/4]  rounded-lg overflow-hidden'>
            <img src='/traditional.jpg' alt='Traditional fashion photoshoot' className='w-full h-full object-cover' />
            <div className='absolute top-2 bg-brand-color left-2 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-semibold'>
              Traditional
            </div>
          </div>
          <div className='relative aspect-[3/4] rounded-lg overflow-hidden'>
            <img src='/AI_gen.jpeg' alt='AI-generated fashion showcase' className='w-full h-full object-cover' />
            <div className='absolute top-2 left-2 bg-brand-color px-3 py-1 rounded-full text-white text-xs font-semibold'>
              AI Generated
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Challenges;
