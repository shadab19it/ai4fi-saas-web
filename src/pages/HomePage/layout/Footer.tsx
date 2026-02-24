"use client";
import { Instagram, LinkedinIcon, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../../services/utils";
import { useTheme } from "../../../context/ThemeContext";

const Footer = () => {
  const { theme } = useTheme()
  const footerSections = {
    company: [
      { name: "About", link: "/about" },
      { name: "Contact", link: "/contact" },
      { name: "Model Gallery", link: "/model-gallery" },
    ],
    resources: [
      { name: "Terms of Service", link: "/terms-of-service" },
      { name: "Privacy Policy", link: "/privacy-policy" },
    ],
    social: [
      { name: "Instagram", icon: Instagram, link: "https://www.instagram.com/ai4fi.in?igsh=cTlvYmlhYmNpeWts&utm_source=qr" },
      { name: "LinkedIn", icon: LinkedinIcon, link: "https://www.linkedin.com/showcase/ai4fi/" },
      { name: "Youtube", icon: Youtube, link: "https://www.youtube.com/@welcome_to_ai4fi" },
    ],
  };

  return (
    <footer className={cn("relative bg-secondary text-gray-400 pt-20 pb-8 px-6 z-[10]", theme == 'dark' && "bg-gradient-to-tr to-black from-cyan-950")}>

      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
        <div>
          <h3 className=' text-sky-400 mb-4'>
            <img src='./light-logo.png' className='w-auto h-[80px]' />
          </h3>
          <p className='mb-6'>Revolutionizing fashion visualization with AI-powered virtual models.</p>
          <div className='flex space-x-4'>
            {footerSections.social.map((item) => (
              <a key={item.name} href={item.link} target='_blank' className='p-2 bg-gray-800 rounded-lg hover:bg-gray-700'>
                <item.icon className='w-5 h-5 text-white' />

              </a>

            ))}
          </div>
        </div>

        <div>
          <h4 className='text-lg font-semibold mb-4 text-foreground'>Company</h4>
          <ul className='space-y-2'>
            {footerSections.company.map((item) => (
              <li key={item.name}>
                <Link to={item.link} className='hover:text-foreground transition-colors duration-200 text-muted-foreground'>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className='text-lg font-semibold mb-4 text-foreground'>Legal</h4>
          <ul className='space-y-2'>
            {footerSections.resources.map((item) => (
              <li key={item.name}>
                <Link to={item.link} className='hover:text-foreground transition-colors duration-200 text-muted-foreground'>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className='text-lg font-semibold mb-4 text-foreground'>Blog</h4>
          <div className='space-y-3'>
            <div className='flex items-center space-x-3'>
              <a
                target='_blank'
                href='https://medium.com/@ahmadshoeb.ai/ai4fi-revolutionizing-fashion-with-ai-generated-models-virtual-try-on-acfa94a97669'
                className='hover:text-foreground text-muted-foreground'>
                AI4FI: Revolutionizing Fashion with AI-Generated Models & Virtual Try-On
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-12 border-t border-border text-foreground pt-6 flex flex-col md:flex-row justify-between items-center'>
        <p className='text-sm'>© {new Date().getFullYear()} AI4FI. All rights reserved.</p>
        <div>
          Powered bY SECTAL
        </div>
        <div className='flex space-x-6 mt-4 md:mt-0'>
          <Link to='/terms-of-service' className='text-sm hover:text-primary text-foreground transition-colors duration-200'>
            Terms of Service
          </Link>

          <Link to='/privacy-policy' className='text-sm hover:text-primary text-foreground transition-colors duration-200'>
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
