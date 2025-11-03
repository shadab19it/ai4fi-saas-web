import { useState, useRef, useEffect } from "react";
import { IOption } from "../ModelGenerator/ModelConfigForm/ModelConfigForm";
import { toast } from "sonner";

interface MultiSelectProps {
  options: IOption[];
  onChange: (selectedOptions: IOption[]) => void;
  noOfposes?: number;
  selectedPoses?: string[];
}

export default function MultiSelect({ options, onChange, noOfposes = 10000, selectedPoses = [] }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<IOption[]>([]);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(query.toLowerCase()) && !selectedOptions.some((selected) => selected.value === option.value)
  );

  const handleSelect = (option: IOption) => {
    const updatedSelection = [...selectedOptions, option];
    if (updatedSelection.length > noOfposes) {
      return toast.info(`You can select only ${noOfposes} Poses`);
    }
    setSelectedOptions(updatedSelection);
    onChange(updatedSelection);
    setQuery("");
  };

  const removeOption = (value: string) => {
    const updatedSelection = selectedOptions.filter((item) => item.value !== value);
    setSelectedOptions(updatedSelection);
    onChange(updatedSelection);
  };

  useEffect(() => {
    if(selectedPoses.length > 0){
      setSelectedOptions(selectedPoses.map((pose) => ({
        value: pose.toLowerCase(),
        label: `${pose}`
      })));
    }
  }, [selectedPoses]);

  return (
    <div className='relative w-full' ref={dropdownRef}>
      <div
        className='flex flex-wrap items-center gap-2 p-2 border border-gray-600 rounded-md bg-gray-900 cursor-text'
        onClick={() => setIsOpen(true)}>
        {selectedOptions.map((option) => {
          if (option.value === "divider") {
            return <h3>{option.label}</h3>;
          } else {
            return (
              <span key={option.value} className='flex items-center gap-1 px-2 py-1 text-sm bg-blue-900 text-blue-200 rounded-full'>
                {option.label}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOption(option.value);
                  }}
                  className='text-blue-300 hover:text-blue-100'>
                  &#x2715;
                </button>
              </span>
            );
          }
        })}
        <input
          type='text'
          className='flex-grow bg-transparent text-white outline-none bg-gray-900 placeholder-gray-400'
          placeholder='Select options...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
      </div>
      {isOpen && (
        <ul className='absolute z-[1000] w-full py-1 mt-1 overflow-auto text-base bg-gray-900 rounded-md shadow-lg max-h-60 ring-1 ring-gray-600 focus:outline-none sm:text-sm'>
          {filteredOptions.length === 0 ? (
            <li className='relative cursor-default select-none py-2 px-4 text-gray-400'>Nothing found.</li>
          ) : (
            filteredOptions.map((option) => {
              if (option.value === "divider") {
                return <h3 className='pl-5 pt-2 text-blue-400'>{option.label}</h3>;
              } else {
                return (
                  <li
                    key={option.value}
                    className='relative cursor-default select-none py-2 pl-5 pr-4 text-gray-200 hover:bg-gray-700'
                    onClick={() => handleSelect(option)}>
                    {option.label}
                  </li>
                );
              }
            })
          )}
        </ul>
      )}
    </div>
  );
}
