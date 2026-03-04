"use client";
import { Instagram, LinkedinIcon, Youtube, MapPin, FileText, Mail, Phone } from "lucide-react";
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

      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6'>
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

        <div>
          <h4 className='text-lg font-semibold mb-4 text-foreground'>Contact Us</h4>
          <div className='space-y-4 text-sm'>
            <div className='flex gap-3'>
              <MapPin className='h-5 w-5 shrink-0 text-sky-400' />
              <p className='text-muted-foreground text-sm'>Plot No.22, Kh No. 334 Mi, Faizullaganj, Triveni Nagar, Lucknow, Uttar Pradesh, India, 226020</p>
            </div>
            <div className='flex items-center gap-3'>
              <FileText className='h-5 w-5 shrink-0 text-sky-400' />
              <p className='text-muted-foreground text-sm'>CIN: U62011UP2026PTC242415</p>
            </div>
            <div className='flex items-center gap-3'>
              <Mail className='h-5 w-5 shrink-0 text-sky-400' />
              <a href='mailto:connect@seqtal.com' className='text-muted-foreground text-sm hover:text-foreground transition-colors'>
                connect@seqtal.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-12 border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center'>
        <div className='flex flex-col md:flex-row items-center gap-2 text-sm'>
          <p className='text-foreground'>© {new Date().getFullYear()} AI4FI. All rights reserved.</p>
          <span className='hidden md:block text-muted-foreground'>|</span>
          <span className='text-muted-foreground'>Powered by</span>
          <a href='https://www.t@seqtal.com' target='_blank' className='text-muted-foreground hover:text-foreground transition-colors'>
            SEQTAL AI PRIVATE LIMITED
          </a>
        </div>
        <div className='flex space-x-6 mt-4 md:mt-0'>
          <Link to='/terms-of-service' className='text-sm hover:text-foreground text-muted-foreground transition-colors duration-200'>
            Terms of Service
          </Link>
          <Link to='/privacy-policy' className='text-sm hover:text-foreground text-muted-foreground transition-colors duration-200'>
            Privacy Policy
          </Link>
          <Link to='/refund-policy' className='text-sm hover:text-foreground text-muted-foreground transition-colors duration-200'>
            Refund Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
