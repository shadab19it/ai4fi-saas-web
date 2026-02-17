
import { motion } from "framer-motion";
import SvgIcons from "../../../components/SvgIcons";

const partners = [
  SvgIcons.amazone,
  SvgIcons.google,
  SvgIcons.netflix,
  SvgIcons.shopify,
  SvgIcons.youtube,
];

const TrustedPartners = () => {
  return (
    <section className='py-12 md:py-20 relative overflow-hidden dark:bg-transparent bg-background dark:bg-gradient-to-t from-black to-cyan-950'>
      <div className='max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='text-center mb-8 md:mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 text-foreground'>Our Trusted Partners </h2>
        </motion.div>

        <div className="flex items-center justify-center">
          <div className='flex flex-wrap gap-6 md:gap-8'>
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className='group flex justify-center items-center'>
                <i className="leading-0 text-[7rem] flex items-center justify-center text-foreground "> {partner}</i>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedPartners;
