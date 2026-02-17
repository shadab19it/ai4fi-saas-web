


import { motion } from "framer-motion";
import { Paintbrush, Upload, ImageIcon } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import Challenges from "./Challenges";
import { FC, ReactNode } from "react";
import { cn } from "../../../services/utils";
const steps = [
  {
    icon: <Paintbrush className='w-6 h-6 text-white' />,
    title: "Choose AI Model",
    description: "Select from our diverse range of AI-generated models to showcase your fashion.",
  },
  {
    icon: <Upload className='w-6 h-6 text-white' />,
    title: "Upload Garment",
    description: "Simply upload your fashion item images through our intuitive interface.",
  },
  {
    icon: <ImageIcon className='w-6 h-6 text-white' />,
    title: "Get Preview",
    description: "Receive instant, photo-realistic previews of your garments on chosen models.",
  },
];
const challenges = [
  "High costs associated with professional photoshoots",
  "Time-consuming scheduling and coordination",
  "Limited diversity in model representation",
  "Inconsistent lighting and styling across shoots",
];
const KeyFeatureItems:FC<{steps:{icon:ReactNode,title:string,description:string}[],challengesTitle:string,challenges:string[],title:string,banner:string,direction:string}> = ( {steps,challengesTitle,challenges,title,banner,direction}) => {  
  return (
    <section className='py-12 md:py-20 relative overflow-hidden bg-background '>
      <div className='max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='text-center mb-8 md:mb-16'>
          <h5 className={cn(direction == 'rtl' ? "text-right":"text-left"," font-400 mb-4 text-foreground")}>{title}</h5>
        </motion.div>
        <div className={cn(direction == 'ltr' ? 'md:flex-row-reverse flex-col' : 'md:flex-row flex-col', `flex  gap-[20px]  items-center`)}>
        <div className='flex flex-col gap-10 items-center'>
        {steps.map((step, index) => (
                 <motion.div
                   key={index}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.8, delay: index * 0.2 }}
                   className='relative w-[80vw] md:w-[400px] group glass-card rounded-2xl p-6   transition-all  duration-300 border border-border'>
                   <div className='bg-brand-color text-white p-3 rounded-xl inline-block mb-4'>{step.icon}</div>
                   <h3 className='text-xl text-card-foreground font-bold mb-2'>{step.title}</h3>
                   <p className='text-muted-foreground text-sm'>{step.description}</p>

{index + 1 !== steps.length && (
  <div className="absolute left-1/2 top-full w-px h-10 border-l-2 border-dashed border-border -translate-x-1/2" />
)}

                 </motion.div>
               ))}
        </div>
        <div className="">
            <img src={banner} alt="" className="max-w-full  h-auto "/>
        </div>
        </div>
        <Challenges direction={direction} challenges={challenges} title={challengesTitle} />
      </div>
    </section>
  );
};

export default KeyFeatureItems;
