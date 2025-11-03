"use client";
import React from "react";
import { Twitter, Instagram, LinkedinIcon, GithubIcon, Mail, Phone, MapPin, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerSections = {
    company: ["About", "Careers", "Press", "Blog"],
    product: ["Features", "Pricing", "Case Studies", "Documentation"],
    resources: ["Help Center", "API Docs", "Terms of Service", "Privacy Policy"],
    social: [
      // { name: "Twitter", icon: Twitter, link: "" },
      { name: "Instagram", icon: Instagram, link: "https://www.instagram.com/ai4fi.in?igsh=cTlvYmlhYmNpeWts&utm_source=qr" },
      { name: "LinkedIn", icon: LinkedinIcon, link: "https://www.linkedin.com/showcase/ai4fi/" },
      { name: "Youtube", icon: Youtube, link: "https://www.youtube.com/@welcome_to_ai4fi" },
    ],
  };

  return (
    <footer className='bg-gradient-to-tr to-black from-cyan-950 text-gray-400 pt-20 pb-8 px-6'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
        <div>
          <h3 className=' text-sky-400 mb-4'>
            <img src='./dark-logo.png' className='w-20 h-10' />
          </h3>
          <p className='mb-6'>Revolutionizing fashion visualization with AI-powered virtual models.</p>
          <div className='flex space-x-4'>
            {footerSections.social.map((item) => (
              <a key={item.name} href={item.link} target='_blank' className='p-2 bg-gray-800 rounded-lg hover:bg-gray-700'>
                <item.icon className='w-5 h-5 text-gray-400' />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className='text-lg font-semibold mb-4 text-white'>Company</h4>
          <ul className='space-y-2'>
            {footerSections.company.map((item) => (
              <li key={item}>
                <Link to='#' className='hover:text-white'>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className='text-lg font-semibold mb-4 text-white'>Resources</h4>
          <ul className='space-y-2'>
            {footerSections.resources.map((item) => (
              <li key={item}>
                <Link to='#' className='hover:text-white'>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className='text-lg font-semibold mb-4 text-white'>Blog</h4>
          <div className='space-y-3'>
            <div className='flex items-center space-x-3'>
              <a
                target='_blank'
                href='https://medium.com/@ahmadshoeb.ai/ai4fi-revolutionizing-fashion-with-ai-generated-models-virtual-try-on-acfa94a97669'
                className='hover:text-white'>
                AI4FI: Revolutionizing Fashion with AI-Generated Models & Virtual Try-On
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-12 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-center items-center'>
        <p className='text-sm'>© {new Date().getFullYear()} AI4FI. All rights reserved.</p>
        {/* <div className='flex space-x-6 mt-4 md:mt-0'>
          <a href='#' className='text-sm hover:text-white'>
            Terms of Service
          </a>
          <a href='#' className='text-sm hover:text-white'>
            Privacy Policy
          </a>
          <a href='#' className='text-sm hover:text-white'>
            Cookie Policy
          </a>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
