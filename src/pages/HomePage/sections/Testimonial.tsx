"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Linkedin, Quote, MessageSquare } from "lucide-react";
import SectionHeader from "./SectionHeader";

const testimonials = [
  {
    id: 1,
    company: "SQUIRE",
    quote:
      "Seqtal's AI models consistently deliver clean, intuitive designs that strike the perfect balance between aesthetic and usability. Whether it's for a complex workflow or a lightweight self-service feature, the user experience always feels effortless and refined.",
    name: "Dave Salvant",
    role: "Co-founder of Squire",
    avatar: "https://i.pravatar.cc/80?img=12",
    linkedin: true,
  },
  {
    id: 2,
    company: "NOTION",
    quote:
      "Working with this team fundamentally changed how we think about onboarding. The designs are not only beautiful — they are deeply intentional. Every micro-interaction has a purpose and our activation rate reflected that immediately.",
    name: "Ivan Zhao",
    role: "Co-founder of Notion",
    avatar: "https://i.pravatar.cc/80?img=33",
    linkedin: true,
  },
  {
    id: 3,
    company: "LINEAR",
    quote:
      "The attention to detail is unlike anything we've encountered. From spacing to motion, every decision felt considered. Our team uses these interfaces daily and the quality keeps morale high — good design really does matter.",
    name: "Karri Saarinen",
    role: "Co-founder of Linear",
    avatar: "https://i.pravatar.cc/80?img=54",
    linkedin: true,
  },
  {
    id: 4,
    company: "VERCEL",
    quote:
      "Speed and elegance rarely coexist — but somehow the dashboard redesign nailed both. Deploy times feel instant, the visual hierarchy guides you naturally, and new developers ramp up in half the time. Remarkable work.",
    name: "Guillermo Rauch",
    role: "Founder & CEO of Vercel",
    avatar: "https://i.pravatar.cc/80?img=68",
    linkedin: true,
  },
];

export default function TestimonialsStacked() {
  const [cards, setCards] = useState(testimonials);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shiftCard = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // After animation duration, rotate the array
    setTimeout(() => {
      setCards((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
      setIsAnimating(false);
    }, 600);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      shiftCard();
    }, 2000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAnimating]);

  const handleManualShift = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    shiftCard();
  };

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-background overflow-hidden">
      {/* Background Decor */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        <SectionHeader
          title="Trusted by Founders Backed by Results"
          subtitle="Success Stories"
          description="Hear from the visionary leaders who are transforming fashion with Seqtal's AI infrastructure."
          highlightedWord="Backed by Results"
          icon={<MessageSquare className="w-4 h-4 text-brand" />}
        />

        {/* Card Stack Container */}
        <div className="relative w-full max-w-xl h-[450px] md:h-[400px] mt-8">
          <AnimatePresence mode="popLayout">
            {cards.map((t, i) => {
              const isTop = i === 0;
              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={false}
                  animate={{
                    x: isTop && isAnimating ? -550 : 0,
                    y: i * 14,
                    scale: 1 - i * 0.05,
                    rotate: i % 2 === 0 ? i * 3 : -i * 3,
                    zIndex: cards.length - i,
                    opacity: i > 2 ? 0 : 1 - i * 0.2,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  }}
                  className="absolute inset-0 h-full"
                >
                  <div className="bg-background border border-border shadow-2xl rounded-3xl p-8 md:p-10 min-h-[400px] flex flex-col">
                    {/* Header: Company & Action */}
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-2xl md:text-3xl font-black tracking-tighter text-foreground">
                        {t.company}
                      </span>
                      <button
                        onClick={handleManualShift}
                        className="p-2 rounded-full hover:bg-muted transition-colors"
                      >
                        <Quote className="w-6 h-6 text-foreground " />
                      </button>
                    </div>

                    {/* Quote */}
                    <div className="flex-1">
                      <p className="text-lg md:text-xl text-foreground font-medium leading-relaxed italic">
                        "{t.quote}"
                      </p>
                    </div>

                    {/* Footer: Profile */}
                    <div className="mt-8 pt-8 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={t.avatar}
                            alt={t.name}
                            className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-brand/20 shadow-lg"
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-brand rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-base md:text-lg leading-none mb-1">
                            {t.name}
                          </h4>
                          <p className="text-xs md:text-sm text-muted-foreground font-medium tracking-tight">
                            {t.role}
                          </p>
                        </div>
                      </div>

                      {t.linkedin && (
                        <a
                          href="#"
                          className="w-10 h-10 rounded-xl bg-[#0a66c2]/10 flex items-center justify-center text-[#0a66c2] hover:bg-[#0a66c2] hover:text-white transition-all duration-300 transform hover:scale-110"
                        >
                          <Linkedin className="w-5 h-5" fill="currentColor" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Progress Indicators
        <div className="flex gap-2.5 mt-16 md:mt-20">
          {testimonials.map((_, idx) => {
            const isActive = cards[0].id === testimonials[idx].id;
            return (
              <button
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-500 ease-out ${isActive ? "w-10 bg-brand" : "w-3 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            );
          })}
        </div> */}
      </div>
    </section>
  );
}



