import { motion } from "motion/react";
import { FC } from "react";




const SectionHeader: FC<{ title: string, description?: string, subtitle?: string, icon?: React.ReactNode }> = ({ title, description, subtitle, icon }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='text-center flex flex-col justify-center items-center mb-16'>
            {subtitle && <span className='inline-block px-3 text-center  border-border border glass-card flex items-center gap-2 py-1 bg-primary/10 backdrop-blur-sm text-muted-secondary rounded-full mb-3'>
                {typeof icon !== 'undefined' && icon}
                <span className="text-muted-foreground">{subtitle}</span>
            </span>}
            <h2 className='  mb-4'>
                {title}
            </h2>
            {description && <p className=' max-w-3xl mx-auto'>
                {description}
            </p>}
        </motion.div>
    );
};

export default SectionHeader;