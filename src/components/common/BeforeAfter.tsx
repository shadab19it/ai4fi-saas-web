import { useState, useRef, useEffect } from "react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = "Before image",
  afterAlt = "After image",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isAutoMoving, setIsAutoMoving] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const direction = useRef(1); // 1 for right, -1 for left

  useEffect(() => {
    if (!isAutoMoving) return;

    const autoMove = () => {
      setSliderPosition((prevPosition) => {
        const newPosition = prevPosition + direction.current;
        if (newPosition >= 100 || newPosition <= 0) {
          direction.current *= -1; // Reverse direction
        }
        return Math.max(0, Math.min(newPosition, 100));
      });
    };

    const intervalId = setInterval(autoMove, 50); // Adjust speed here

    return () => clearInterval(intervalId);
  }, [isAutoMoving]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isAutoMoving || e.buttons !== 1) return;
      const rect = container.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      setSliderPosition((x / rect.width) * 100);
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [isAutoMoving]);

  return (
    <div className=' '>
      <div
        ref={containerRef}
        className='relative md:max-w-[350px] max-w-full min-h-[300px] md:min-h-[470px] z-[100] rounded-md aspect-video cursor-col-resize overflow-hidden'>
        <img
          src={beforeImage || "/placeholder.svg"}
          alt={beforeAlt}
          className='absolute top-0 rounded-md left-0 w-full h-full object-fill'
        />
        <img
          src={afterImage || "/placeholder.svg"}
          alt={afterAlt}
          className='absolute top-0 left-0 w-full h-full object-fill transition-[clip-path] rounded-md duration-300 ease-linear'
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        />
        <div
          className='absolute top-0 bottom-0 w-0.5 bg-white transition-all duration-300 ease-linear'
          style={{ left: `${sliderPosition}%` }}>
          <div className='absolute top-1/2 left-1/2 w-8 h-8 -mt-4 -ml-4 bg-white rounded-full shadow-lg flex items-center justify-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-6 h-6 text-gray-800'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9' />
            </svg>
          </div>
        </div>
      </div>
      {/* <div className='flex items-center space-x-4'>
        <input
          type='range'
          min='0'
          max='100'
          value={sliderPosition}
          onChange={(e) => setSliderPosition(Number(e.target.value))}
          className='w-64 appearance-none bg-transparent [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-gray-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white'
          disabled={isAutoMoving}
        />
        <button
          onClick={() => setIsAutoMoving(!isAutoMoving)}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'>
          {isAutoMoving ? "Stop" : "Auto Move"}
        </button>
      </div> */}
    </div>
  );
}
