import { useState } from "react";

const CREDIT_STEPS = [10, 30, 50, 70, 90, 110, 130];

interface CreditSliderProps {
  value: number;
  onChange: (credits: number) => void;
}

export const CreditSlider = ({ value, onChange }: CreditSliderProps) => {
  const [isCustom, setIsCustom] = useState(false);
  const stepIndex = CREDIT_STEPS.indexOf(value);
  const sliderIndex = stepIndex >= 0 ? stepIndex : 0;
  const maxIdx = CREDIT_STEPS.length - 1;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCustom(false);
    onChange(CREDIT_STEPS[Number(e.target.value)]);
  };

  const fillPct = isCustom ? 0 : (sliderIndex / maxIdx) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center justify-center min-w-[40px] h-8 px-2 rounded-md bg-[#0891b2] text-white text-sm font-bold">
          {isCustom ? "?" : value}
        </span>
        <p className="text-sm text-gray-600">
          Adjust your plan based on your business needs.
        </p>
      </div>

      {/* Slider + ticks container — same width so they align */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          {/* Range input */}
          <input
            type="range"
            min={0}
            max={maxIdx}
            step={1}
            value={isCustom ? 0 : sliderIndex}
            onChange={handleSliderChange}
            className="w-full h-2 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2
              [&::-webkit-slider-thumb]:border-[#0891b2] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10
              [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#0891b2]
              [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full"
            style={{
              background: `linear-gradient(to right, #0891b2 ${fillPct}%, #e5e7eb ${fillPct}%)`,
            }}
          />

          {/* Tick labels — positioned at the same % as each slider step */}
          <div className="relative w-full mt-1.5 h-5">
            {CREDIT_STEPS.map((step, i) => (
              <button
                key={step}
                onClick={() => { setIsCustom(false); onChange(step); }}
                className={`absolute text-xs -translate-x-1/2 transition-colors ${
                  !isCustom && value === step
                    ? "text-[#0891b2] font-bold"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                style={{ left: `${(i / maxIdx) * 100}%` }}
              >
                {step}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Plan sits outside the slider track */}
        <button
          onClick={() => setIsCustom(true)}
          className={`text-xs whitespace-nowrap transition-colors mt-[-18px] ${
            isCustom
              ? "text-[#0891b2] font-bold"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Custom Plan
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 font-medium">
        1 image = 1 credits
      </p>
    </div>
  );
};

export { CREDIT_STEPS };
