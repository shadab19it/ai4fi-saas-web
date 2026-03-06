import { Link } from 'react-router-dom'
import { useRef, useEffect, useMemo } from 'react'

import BorderBeamAnimation from '../../../components/common/AnimatedBorder'
import { useTheme } from '../../../context/ThemeContext'
import { cn } from '../../../services/utils'
import TrustedPartners from './Partners'
import SvgIcons from '../../../components/SvgIcons'
import { motion } from 'motion/react'

const HeroSection2 = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { theme } = useTheme()
  const partners = useMemo(() => [
    SvgIcons.amazone,
    SvgIcons.google,
    SvgIcons.netflix,
    SvgIcons.shopify,
    SvgIcons.youtube,
  ], []);

  // Compute star positions once — Math.random() in render causes layout thrash on every re-render
  const stars = useMemo(
    () => [...Array(80)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2,
    })),
    []
  );

  // Play video only when it enters the viewport
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('playsinline', 'true');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            const handleUserInteraction = () => {
              video.play().catch(() => {});
              document.removeEventListener('touchstart', handleUserInteraction);
              document.removeEventListener('click', handleUserInteraction);
            };
            document.addEventListener('touchstart', handleUserInteraction, { once: true });
            document.addEventListener('click', handleUserInteraction, { once: true });
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [])

  return (
    <div className={` md:h-full min-h-screen ${theme === 'dark' ? ' bg-gradient-to-br from-black via-black to-black text-white overflow-hidden' : ' bg-background text-foreground overflow-hidden'}`}>
      {/* Animated starfield background */}

      {/* {theme === 'dark' && (
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent bg-opacity-20" />
      )} */}

      {theme == 'dark' &&
        <div className="absolute inset-0 z-0">
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                animation: `twinkle ${star.duration}s infinite`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}

          {/* Gradient glows */}
          {/* <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r rounded-full blur-3xl opacity-15 animate-pulse"></div> */}
          {/* <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r  rounded-full blur-3xl opacity-15 animate-pulse"></div> */}
        </div>
      }
      {/* Content */}
      <div className="relative z-10 ">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:pt-32 md:pb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 mt-0">
              <h1 className=" font-bold leading-tight">
                <span className="text-foreground">REVOLUTIONIZE</span>
                <br />
                <span className="text-brand-gradient bg-clip-text text-transparent">
                  FASHION WITH AI.
                </span>
              </h1>

              <p className="text-lg">
                Create, Visualize & Advertise with Intelligent AI Models.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/features">
                  <button className="px-8 py-3 w-full text-white sm:w-auto bg-brand-color rounded-lg font-semibold transition transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50">
                    EXPLORE FEATURES
                  </button>
                </Link>

                <Link to="/contact">
                  <button className="relative w-full glass-card  sm:w-auto px-8 py-3 border-2 border-red-500 hover:border-foreground/60 rounded-lg font-semibold transition hover:bg-foreground/5 text-foreground">
                    <BorderBeamAnimation />
                    BOOK A DEMO
                  </button>
                </Link>
              </div>
            </div>

            {/* Right - Digital Figure (Placeholder) */}
            <div className="relative flex items-start justify-center -mt-5">
              <video
                ref={videoRef}
                src="/herovideo.MP4"
                muted
                loop
                playsInline
                preload="none"
                className="w-full h-96 md:h-[620px] object-contain"
              />
            </div>
          </div>

        </section>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 md:py-16'>
          <h2 className='text-center  mb-5 font-bold leading-tight'>
            Our Trusted Partners
          </h2>
          <div className='grid grid-cols place-items-center md:grid-cols-5 gap-6 md:gap-8'>
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className='group'>
                <i className="leading-0 text-[7rem] text-muted-foreground"> {partner}</i>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
      @keyframes twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
      }
      @keyframes bounce-smooth {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-20px);
        }
      }
      .animate-bounce-smooth {
        animation: bounce-smooth 3s ease-in-out infinite;
      }
    `}</style>
    </div>
  )
}

export default HeroSection2