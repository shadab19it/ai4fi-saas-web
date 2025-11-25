import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../../services/authService";
import Particles from "../../../components/common/Particles";
import { ShimmerButton } from "../../../components/common/ShinyButton";
import BeforeAfterSlider from "../../../components/common/BeforeAfter";

const HeroSection = () => {
  const navigate = useNavigate();
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Only run client-side code after component mounts
  useEffect(() => {
    setIsClient(true);
    setIsScanning(true);

    const startScan = () => {
      setIsScanning(true);
      setScanProgress(0);

      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsScanning(false);
            return 100;
          }
          return prev + 1;
        });
      }, 30);

      return interval;
    };

    const interval = startScan();

    const scanTimer = setInterval(() => {
      clearInterval(interval);
      const newInterval = startScan();
      return () => clearInterval(newInterval);
    }, 6000); // Restart scan every 6 seconds

    return () => {
      clearInterval(interval);
      clearInterval(scanTimer);
    };
  }, []);

  const onClickStarted = () => {
    if (authService.isAuthenticated()) {
      navigate("/features");
    } else {
      navigate("/login");
    }
  };

  return (
    <div id='home' className='relative md:h-screen h-auto overflow-hidden bg-black pt-16 lg:pt-10 md:pt-24'>
      <div className='absolute inset-0 bg-gradient-to-br from-cyan-950 via-black to-sky-950'>
        {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLCAyNTUsIDI1NSwgMC4wOCkiIHN0cm9rZS13aWR0aD0iMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-80" /> */}
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{
            backgroundImage: "url('/hero-bg.jpg')",
            backgroundSize: "cover",
          }}></div>


        {/* <div
          className='absolute inset-0 opacity-20'
          style={{
            backgroundImage: `linear-gradient(to right, rgba(6, 182, 212, 0.1) 1px, transparent 1px), 
                              linear-gradient(to bottom, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        /> */}
        {/* <Particles
          particleColors={["#fff", "#fff"]}
          particleCount={300}
          particleSpread={8}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        /> */}
      </div>

      {/* Main Content - Split Layout */}
      <div
        id='home'
        className='max-w-[1300px] mx-auto px-8  md:h-screen h-auto flex flex-col lg:flex-row items-center justify-center py-12 sm:py-12 md:py-16 '>
        {/* Left Section - Text Content */}
        <motion.div
          className='w-full lg:w-3/5 z-10 mb-12 lg:mb-0'
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}>
          <h2 className='text-cyan-400 font-mono uppercase tracking-widest text-xs sm:text-sm mb-2'>Next Generation</h2>
          <h1 className='text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-semibold text-white mb-4 leading-tight'>
            <span className='block'>Revolutionizing</span>
            <span className='relative'>
              <span className='bg-gradient-to-br from-cyan-400 to-sky-700 bg-clip-text text-transparent'>Fashion AI</span>
              <motion.span
                className='absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-sky-500 rounded-full'
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </span>
          </h1>

          <p className='text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed mb-6 mt-10 sm:mb-8 max-w-xl'>
            Boost your e-commerce sales with AI-generated fashion models—Customizable, and ready in seconds. Showcase outfits in 4K, dress
            models with AI try-on, and save 90% costs & 98% time—no more expensive photoshoots! Sell smarter, faster, and better.
          </p>

          <div className='flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4'>
            <motion.button
              onClick={onClickStarted}
              className='bg-gradient-to-r from-cyan-500 to-sky-500 text-white px-5 sm:px-5 py-2 sm:py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}>
              <span>Get Started</span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='sm:w-5 sm:h-5'>
                <path d='M5 12h14'></path>
                <path d='m12 5 7 7-7 7'></path>
              </svg>
            </motion.button>

            <a href='#demo'>
              <motion.button
                className='bg-white/5 backdrop-blur-lg border border-white/10 text-white px-5 sm:px-5 py-3 sm:py-3 rounded-xl font-medium hover:bg-white/10 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='18'
                  height='18'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='sm:w-5 sm:h-5'>
                  <circle cx='12' cy='12' r='10'></circle>
                  <polygon points='10 8 16 12 10 16 10 8'></polygon>
                </svg>
                <span>Watch Demo</span>
              </motion.button>
            </a>

            <Link to='/contact'>
              <motion.button
                className='bg-white/5 backdrop-blur-lg border border-white/10 text-white px-5 sm:px-5 py-3 sm:py-3 rounded-xl font-medium hover:bg-white/10 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}>
                {/* <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='18'
                  height='18'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='sm:w-5 sm:h-5'>
                  <circle cx='12' cy='12' r='10'></circle>
                  <polygon points='10 8 16 12 10 16 10 8'></polygon>
                </svg> */}
                <span>Book a Demo</span>
              </motion.button>
            </Link>
          </div>

          {/* <div className='mt-6 sm:mt-10 flex items-center gap-3 sm:gap-4'>
            <p className='text-gray-400 text-xs sm:text-sm'>
              <span className='text-cyan-400 font-medium'>500+ </span> models generated
            </p>
          </div> */}
        </motion.div>

        {/* Right Section - Interactive Image */}
        <motion.div
          className='w-full lg:w-2/5 flex justify-center lg:justify-end items-center z-10'
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}>
          <div className='relative w-60 xs:w-72 sm:w-80 md:w-96 lg:w-[26rem] h-[18rem] xs:h-[20rem] sm:h-[24rem] lg:h-[28rem]'>
            <BeforeAfterSlider beforeImage={"/sample-removebg-preview.png"} afterImage={"/result-removebg-preview.png"} />

            {/* <motion.div
              className='absolute bottom-4 right-4 bg-black/70 backdrop-blur-lg rounded-lg px-2 sm:px-3 py-1 sm:py-2 z-20 flex items-center gap-2'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}>
              <div className='w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-cyan-400 animate-pulse' />
              <span className='text-white text-xs font-medium'>AI Enhanced</span>
            </motion.div> */}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
