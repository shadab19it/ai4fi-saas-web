/* eslint-disable react/prop-types */
import { FC, ReactNode, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  User,
  Camera,
  Palette,
  Sparkles,
  Rocket,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {
  nationalityOptions,
  eyeColorOptions,
  genderOptions,
  modeOptions,
  ageRangeOptions,
  femaleHairColorOptions,
  maleHairColorOptions,
  femaleHairStyleOptions,
  maleHairStyleOptions,
  skinToneOptions,
  moodOptions,
  beardOptions,
  femaleBodyTypeOptions,
  maleBodyTypeOptions,
  poseTypeOptions,
  femaleDressTypeOptions,
  maleDressTypeOptions,
  femaleFootwearOptions,
  maleFootwearOptions,
  tierOptions,
  aspectRatioOptions,
  resolutionOptions,
} from "./optionInput";
import DarkLogo from "../../../../public/dark-logo.png";
import { Link } from "react-router-dom";
import { useMediaQuery } from "../../useMediaQuery";

const CollapsibleSection: FC<{ title: string; icon: ReactNode; children: any; defaultOpen?: boolean; isHeader?: boolean }> = ({
  title,
  icon,
  children,
  defaultOpen = true,
  isHeader = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className='border-b border-gray-700'>
      {isHeader && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='w-full flex items-center justify-between p-3 hover:bg-gray-700/50 transition-colors'>
          <div className='flex items-center gap-2'>
            {icon}
            <span className='font-medium'>{title}</span>
          </div>
          {isOpen ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
        </button>
      )}

      {isOpen && <div className='p-3 space-y-3'>{children}</div>}
    </div>
  );
};

// Removed Tooltip component - not used

export interface IOption {
  value: string;
  label: string;
}

const SegmentedControl: FC<{ options: IOption[]; value: string; onChange: (v: string) => void }> = ({ options, value, onChange }) => {
  return (
    <div className='flex rounded-lg bg-gray-900 p-1'>
      {options.map((option) => (
        <button
          key={option.value}
          className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
            value === option.value ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-transparent "
          }`}
          onClick={() => onChange(option.value)}>
          {option.label}
        </button>
      ))}
    </div>
  );
};

const ModelConfigForm: FC<any> = ({
  mode,
  setMode,
  gender,
  setGender,
  nationality,
  setNationality,
  ageRange,
  setAgeRange,
  // Face mode
  hairStyle,
  setHairStyle,
  eyeColor,
  setEyeColor,
  mood,
  setMood,
  beard,
  setBeard,
  // Fashion mode
  bodyType,
  setBodyType,
  skinTone,
  setSkinTone,
  hairColor,
  setHairColor,
  poseType,
  setPoseType,
  dress,
  setDress,
  footwear,
  setFootwear,
  // Quality
  tier,
  setTier,
  aspectRatio,
  setAspectRatio,
  resolution,
  setResolution,
  // Actions
  generateImage,
  loading,
  setIsSidebarOpen,
  isSidebarOpen,
}) => {
  const isMobile = useMediaQuery("(max-width: 440px)");

  return (
    <div className='w-full h-screen bg-gray-800 text-white flex flex-col'>
      {/* Header */}
      <div className='p-3 bg-gray-900 flex justify-between'>
        <h2 className='text-xl font-bold flex items-center gap-2'>
          <Link to={"/"}>
            <img src={DarkLogo} className='w-20 h-8' alt='AI4FI' />
          </Link>
          <Sparkles className='w-5 h-5' />
          {!isMobile && "Model Generator"}
          {/* Model Generator */}
        </h2>
        <div className='flex items-center gap-2'>
          <button
            className=' bg-white text-black p-2 rounded-full shadow-lg z-150 sm:hidden block'
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto overflow-x-hidden'>
            <CollapsibleSection title='Basic Info' icon={<User className='w-4 h-4' />}>
              <div className='space-y-3'>
                <div>
                  <label className='block text-sm mb-1'>Mode</label>
                  <SegmentedControl
                    options={modeOptions}
                    value={mode}
                    onChange={(value) => setMode(value)}
                  />
                </div>
                <div>
                  <label className='block text-sm mb-1'>Nationality</label>
                  <select
                    className='w-full bg-gray-900 rounded p-2 text-sm'
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}>
                    {nationalityOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='block text-sm mb-1'>Gender</label>
                    <select
                      className='w-full bg-gray-900 rounded p-2 text-sm'
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}>
                      {genderOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm mb-1'>Age Range</label>
                    <select
                      className='w-full bg-gray-900 rounded p-2 text-sm'
                      value={ageRange}
                      onChange={(e) => setAgeRange(e.target.value)}>
                      {ageRangeOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Face Mode Fields */}
            {mode === "face" && (
              <CollapsibleSection title='Face Details' icon={<Palette className='w-4 h-4' />}>
                <div className='space-y-3'>
                  <div className='grid grid-cols-2 gap-3'>
                    <div>
                      <label className='block text-sm mb-1'>Hair Style</label>
                      <select
                        value={hairStyle}
                        className='w-full bg-gray-900 rounded p-2 text-sm'
                        onChange={(e) => setHairStyle(e.target.value)}>
                        {(gender === "male" ? maleHairStyleOptions : femaleHairStyleOptions).map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className='block text-sm mb-1'>Eye Color</label>
                      <select
                        value={eyeColor}
                        className='w-full bg-gray-900 rounded p-2 text-sm'
                        onChange={(e) => setEyeColor(e.target.value)}>
                        {eyeColorOptions.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className='block text-sm mb-1'>Mood</label>
                      <select
                        value={mood}
                        className='w-full bg-gray-900 rounded p-2 text-sm'
                        onChange={(e) => setMood(e.target.value)}>
                        {moodOptions.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {gender === "male" && (
                      <div>
                        <label className='block text-sm mb-1'>Beard</label>
                        <select
                          value={beard}
                          className='w-full bg-gray-900 rounded p-2 text-sm'
                          onChange={(e) => setBeard(e.target.value)}>
                          {beardOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </CollapsibleSection>
            )}

            {/* Fashion Mode Fields */}
            {mode === "fashion" && (
              <>
                <CollapsibleSection title='Appearance' icon={<Palette className='w-4 h-4' />}>
                  <div className='space-y-3'>
                    <div className='grid grid-cols-2 gap-3'>
                      <div>
                        <label className='block text-sm mb-1'>Hair Color</label>
                        <select
                          value={hairColor}
                          className='w-full bg-gray-900 rounded p-2 text-sm'
                          onChange={(e) => setHairColor(e.target.value)}>
                          {(gender === "male" ? maleHairColorOptions : femaleHairColorOptions).map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className='block text-sm mb-1'>Skin Tone</label>
                        <select
                          value={skinTone}
                          className='w-full bg-gray-900 rounded p-2 text-sm'
                          onChange={(e) => setSkinTone(e.target.value)}>
                          {skinToneOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className='col-span-2'>
                        <label className='block text-sm mb-1'>Body Type</label>
                        <select
                          value={bodyType}
                          onChange={(e) => setBodyType(e.target.value)}
                          className='w-full bg-gray-900 rounded p-2 text-sm'>
                          {(gender === "male" ? maleBodyTypeOptions : femaleBodyTypeOptions).map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title='Fashion Settings' icon={<Camera className='w-4 h-4' />}>
                  <div className='space-y-3'>
                    <div>
                      <label className='block text-sm mb-1'>Pose Type</label>
                      <SegmentedControl
                        options={poseTypeOptions}
                        value={poseType}
                        onChange={(value) => setPoseType(value)}
                      />
                    </div>
                    <div>
                      <label className='block text-sm mb-1'>Dress</label>
                      <select
                        value={dress}
                        className='w-full bg-gray-900 rounded p-2 text-sm'
                        onChange={(e) => setDress(e.target.value)}>
                        <option value=''>Select or enter custom...</option>
                        {(gender === "male" ? maleDressTypeOptions : femaleDressTypeOptions).map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      {dress && !(gender === "male" ? maleDressTypeOptions : femaleDressTypeOptions).find(o => o.value === dress) && (
                        <input
                          type='text'
                          className='w-full bg-gray-900 rounded p-2 text-sm mt-2'
                          value={dress}
                          onChange={(e) => setDress(e.target.value)}
                          placeholder='Enter custom dress description'
                        />
                      )}
                    </div>
                    <div>
                      <label className='block text-sm mb-1'>Footwear</label>
                      <select
                        value={footwear}
                        className='w-full bg-gray-900 rounded p-2 text-sm'
                        onChange={(e) => setFootwear(e.target.value)}>
                        <option value=''>Select footwear...</option>
                        {(gender === "male" ? maleFootwearOptions : femaleFootwearOptions).map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CollapsibleSection>
              </>
            )}

            <CollapsibleSection title='Quality Settings' icon={<Sparkles className='w-4 h-4' />}>
              <div className='space-y-3'>
                <div>
                  <label className='block text-sm mb-1'>Tier</label>
                  <SegmentedControl
                    options={tierOptions}
                    value={tier}
                    onChange={(value) => setTier(value)}
                  />
                </div>
                {tier === "professional" && (
                  <>
                    <div>
                      <label className='block text-sm mb-1'>Aspect Ratio</label>
                      <select
                        value={aspectRatio}
                        className='w-full bg-gray-900 rounded p-2 text-sm'
                        onChange={(e) => setAspectRatio(e.target.value)}>
                        {aspectRatioOptions.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className='block text-sm mb-1'>Resolution</label>
                      <select
                        value={resolution}
                        className='w-full bg-gray-900 rounded p-2 text-sm'
                        onChange={(e) => setResolution(e.target.value)}>
                        {resolutionOptions.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
            </CollapsibleSection>
          </div>

      {/* Footer Actions */}
      <div className='p-4 border-t border-gray-700 bg-gray-900'>
        <div className='flex gap-2'>
          <button
            onClick={generateImage}
            disabled={loading}
            className='flex-1 flex justify-center gap-2 items-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:bg-gradient-to-r hover:from-purple-800 hover:to-indigo-800 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-transform disabled:opacity-50'>
            {loading ? <LoadingSpinner size={15} /> : <Rocket className=' h-4 w-4' />}
            <span>{loading ? "Generating..." : "Generate Model"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const LoadingSpinner: FC<{ className?: string; size?: number }> = ({ size = 24, className, ...props }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      {...props}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={`animate-spin ${className}`}>
      <path d='M21 12a9 9 0 1 1-6.219-8.56' />
    </svg>
  );
};

export default ModelConfigForm;
