import { motion } from "motion/react";
import { FC, ReactNode } from "react";

interface SectionHeaderProps {
    title: string;
    description?: string;
    subtitle?: string;
    icon?: ReactNode;
    highlightedWord?: string;
}

const SectionHeader: FC<SectionHeaderProps> = ({
    title,
    description,
    subtitle,
    icon,
    highlightedWord,
}) => {
    const renderTitle = () => {
        if (!highlightedWord) return title;

        const escaped = highlightedWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const parts = title.split(new RegExp(`(${escaped})`, "gi"));

        return parts.map((part, index) => {
            if (part && part.toLowerCase() === highlightedWord.toLowerCase()) {
                return (
                    <span key={index} className="text-brand-gradient inline-block">
                        {part}
                    </span>
                );
            }
            return part;
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center flex font-serif flex-col justify-center items-center mb-16"
        >
            {subtitle && (
                <span className="inline-block px-3 text-center border-border border glass-card flex items-center gap-2 py-1 bg-primary/10 backdrop-blur-sm text-muted-secondary rounded-full mb-3">
                    {icon && icon}
                    <span className="text-muted-foreground">{subtitle}</span>
                </span>
            )}
            <h1 className="mb-4">{renderTitle()}</h1>
            {description && <p className="max-w-3xl mx-auto">{description}</p>}
        </motion.div>
    );
};

export default SectionHeader;
