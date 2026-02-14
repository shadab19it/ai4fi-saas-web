import * as Slider from "@radix-ui/react-slider";

interface ImageSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  creditsPerImage?: number;
}

const generateMarks = (min: number, max: number, step: number): number[] => {
  const result: number[] = [];
  for (let v = min; v <= max; v += step) {
    result.push(v);
  }
  if (result[result.length - 1] !== max) {
    result.push(max);
  }
  return result;
};

const formatNumber = (n: number): string => {
  if (n >= 1_000_000) return `${n / 1_000_000}M`;
  if (n >= 1000) return `${n / 1000}K`;
  return n.toString();
};

export const ImageSlider = ({
  value,
  onChange,
  min = 10,
  max = 150,
  step = 30,
  creditsPerImage = 10,
}: ImageSliderProps) => {
  const marks = generateMarks(min, max, step);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <p className="text-center text-sm text-gray-400">Adjust your plan based on your business needs.</p>

      <div className="relative">
        <Slider.Root
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={([v]) => onChange(v)}
          className="relative flex w-full items-center touch-none select-none"
          aria-label="Image count slider"
        >
          <Slider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-[#eee]">
            <Slider.Range className="absolute h-full bg-purple-500 rounded-full" />
          </Slider.Track>

          <Slider.Thumb className="relative flex items-center justify-center cursor-pointer w-5 h-5 rounded-full border-2 border-purple-600 bg-white shadow">
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs bg-purple-600 text-white px-1.5 py-0.5 rounded">
              {formatNumber(value)}
            </div>
          </Slider.Thumb>
        </Slider.Root>

        <div className="flex justify-between mt-2 text-xs text-gray-400 px-1">
          {marks.map((m, i) => (
            <span key={m}>
              {formatNumber(m)} {i === marks.length - 1 ? "+" : ""}
            </span>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-gray-400">
        1 image = <span className="text-orange-500 font-semibold">{creditsPerImage} credits</span>
      </p>
    </div>
  );
};
