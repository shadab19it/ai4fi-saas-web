"use client";

import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useMediaQuery } from "../useMediaQuery";
import { ZoomIn } from "lucide-react";
function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return <div className={`${className} right-10 z-10`} style={{ ...style, display: "block" }} onClick={onClick} />;
}

function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return <div className={`${className} left-10 z-10`} style={{ ...style, display: "block" }} onClick={onClick} />;
}

export default function ImageCarousel({ images, rtl }: { images: any[]; rtl: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [zoomedImage, setZoomedImage] = useState<string>("");

  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    rtl: rtl,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className='w-full max-w-8xl mx-auto mb-12 '>
      <Slider {...settings}>
        {images.map((item) => (
          <div key={item} className='px-2 group'>
            <div className='bg-gray-200 rounded-lg overflow-hidden w-full h-[430px] relative '>
              <img src={`${item.src}`} alt={`Gallery image ${item.alt}`} className='w-full h-full object-fit ' />

              <div
                className={`absolute inset-0 bg-black/40 transition-opacity ${
                  zoomedImage.includes(`${item.src}`) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}>
                <div className='flex items-center h-full justify-center'>
                  <div className='flex space-x-4'>
                    <ZoomIn
                      className='h-6 w-6 z-[10] cursor-pointer text-gray-100 hover:text-blue-400'
                      onClick={() => {
                        setZoomedImage(item.src);
                        setIsModalOpen(true);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {isModalOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-75  !ml-0 flex items-center justify-center z-50'
          onClick={() => setIsModalOpen(false)}>
          <div className='relative'>
            <img src={zoomedImage} alt='Zoomed' className='max-w-full max-h-screen' />
            <button
              onClick={() => {
                setIsModalOpen(false);
                setZoomedImage("");
              }}
              className='absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
