import { FC, ReactNode, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  User,
  Camera,
  Palette,
  Sparkles,
  Rocket,
  PanelLeftClose,
  Loader2,
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
import Logo from "../../../../public/dark-logo2.png";
import { Link } from "react-router-dom";
import { useMediaQuery } from "../../useMediaQuery";

const CollapsibleSection: FC<{
  title: string;
  icon: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  isHeader?: boolean;
}> = ({ title, icon, children, defaultOpen = true, isHeader = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className='border-b border-[#E5E2DA]'>
      {isHeader && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='w-full flex items-center justify-between px-4 py-3 hover:bg-[#F9F8F5] transition-colors'
          aria-expanded={isOpen}
          aria-label={`Toggle ${title}`}
        >
          <div className='flex items-center gap-2'>
            <span className='text-[#6B6560]'>{icon}</span>
            <span className='text-[13px] font-bold text-stone-900 tracking-wide'>{title}</span>
          </div>
          {isOpen ? (
            <ChevronUp className='w-3.5 h-3.5 text-[#9E9893]' />
          ) : (
            <ChevronDown className='w-3.5 h-3.5 text-[#9E9893]' />
          )}
        </button>
      )}
      {isOpen && <div className='px-4 pb-4 pt-1 space-y-3'>{children}</div>}
    </div>
  );
};

export interface IOption {
  value: string;
  label: string;
}

const SegmentedControl: FC<{
  options: IOption[];
  value: string;
  onChange: (v: string) => void;
}> = ({ options, value, onChange }) => (
  <div className='flex rounded-xl bg-[#F4F3EF] p-1 border border-[#E5E2DA]'>
    {options.map((option) => (
      <button
        key={option.value}
        className={`flex-1 px-3 py-[7px] text-[13px] font-semibold rounded-lg transition-all ${
          value === option.value
            ? "bg-[#2563EB] text-white shadow-sm"
            : "text-[#6B6560] hover:text-stone-900 hover:bg-white/60"
        }`}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);

const SelectField: FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: IOption[];
  placeholder?: string;
}> = ({ label, value, onChange, options, placeholder }) => (
  <div>
    <label className='block text-[11.5px] font-semibold text-[#9E9893] mb-1.5'>{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='w-full h-9 px-2.5 rounded-lg border border-[#E5E2DA] bg-[#F9F8F5] text-[13px] font-medium text-stone-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all appearance-none cursor-pointer'
    >
      {placeholder && <option value=''>{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

const ModelConfigForm: FC<any> = ({
  mode,
  setMode,
  gender,
  setGender,
  nationality,
  setNationality,
  ageRange,
  setAgeRange,
  hairStyle,
  setHairStyle,
  eyeColor,
  setEyeColor,
  mood,
  setMood,
  beard,
  setBeard,
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
  tier,
  setTier,
  aspectRatio,
  setAspectRatio,
  resolution,
  setResolution,
  generateImage,
  loading,
  setIsSidebarOpen,
  isSidebarOpen,
}) => {
  const isMobile = useMediaQuery("(max-width: 440px)");

  return (
    <div className='w-full h-screen bg-white border-r border-[#E5E2DA] flex flex-col'>
      {/* Header */}
      <div className='px-4 py-3 border-b border-[#E5E2DA] flex items-center justify-between shrink-0'>
        <div className='flex items-center gap-2.5'>
          <Link to='/'>
            <img src={Logo} className='w-18 h-10 rounded-lg object-cover' alt='AI4FI' />
          </Link>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className='sm:hidden w-8 h-8 rounded-lg border border-[#E5E2DA] bg-white flex items-center justify-center text-[#6B6560] hover:bg-[#F9F8F5] hover:text-stone-900 transition-all'
          aria-label='Close sidebar'
        >
          <PanelLeftClose className='w-4 h-4' />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <CollapsibleSection title='Basic Info' icon={<User className='w-4 h-4' />}>
          <div className='space-y-3'>
            <div>
              <label className='block text-[11.5px] font-semibold text-[#9E9893] mb-1.5'>Mode</label>
              <SegmentedControl options={modeOptions} value={mode} onChange={setMode} />
            </div>
            <SelectField label='Nationality' value={nationality} onChange={setNationality} options={nationalityOptions} />
            <div className='grid grid-cols-2 gap-3'>
              <SelectField label='Gender' value={gender} onChange={setGender} options={genderOptions} />
              <SelectField label='Age Range' value={ageRange} onChange={setAgeRange} options={ageRangeOptions} />
            </div>
          </div>
        </CollapsibleSection>

        {mode === "face" && (
          <CollapsibleSection title='Face Details' icon={<Palette className='w-4 h-4' />}>
            <div className='grid grid-cols-2 gap-3'>
              <SelectField
                label='Hair Style'
                value={hairStyle}
                onChange={setHairStyle}
                options={gender === "male" ? maleHairStyleOptions : femaleHairStyleOptions}
              />
              <SelectField
                label='Hair Color'
                value={hairColor}
                onChange={setHairColor}
                options={gender === "male" ? maleHairColorOptions : femaleHairColorOptions}
              />
              <SelectField label='Eye Color' value={eyeColor} onChange={setEyeColor} options={eyeColorOptions} />
              <SelectField label='Mood' value={mood} onChange={setMood} options={moodOptions} />
              {gender === "male" && (
                <SelectField label='Beard' value={beard} onChange={setBeard} options={beardOptions} />
              )}
            </div>
          </CollapsibleSection>
        )}

        {mode === "fashion" && (
          <>
            <CollapsibleSection title='Appearance' icon={<Palette className='w-4 h-4' />}>
              <div className='grid grid-cols-2 gap-3'>
                <SelectField
                  label='Hair Color'
                  value={hairColor}
                  onChange={setHairColor}
                  options={gender === "male" ? maleHairColorOptions : femaleHairColorOptions}
                />
                <SelectField label='Skin Tone' value={skinTone} onChange={setSkinTone} options={skinToneOptions} />
                <div className='col-span-2'>
                  <SelectField
                    label='Body Type'
                    value={bodyType}
                    onChange={setBodyType}
                    options={gender === "male" ? maleBodyTypeOptions : femaleBodyTypeOptions}
                  />
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title='Fashion Settings' icon={<Camera className='w-4 h-4' />}>
              <div className='space-y-3'>
                <div>
                  <label className='block text-[11.5px] font-semibold text-[#9E9893] mb-1.5'>Pose Type</label>
                  <SegmentedControl options={poseTypeOptions} value={poseType} onChange={setPoseType} />
                </div>
                <SelectField
                  label='Dress'
                  value={dress}
                  onChange={setDress}
                  options={gender === "male" ? maleDressTypeOptions : femaleDressTypeOptions}
                  placeholder='Select or enter custom...'
                />
                {dress &&
                  !(gender === "male" ? maleDressTypeOptions : femaleDressTypeOptions).find(
                    (o) => o.value === dress
                  ) && (
                    <input
                      type='text'
                      className='w-full h-9 px-2.5 rounded-lg border border-[#E5E2DA] bg-[#F9F8F5] text-[13px] text-stone-900 placeholder:text-[#9E9893] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all'
                      value={dress}
                      onChange={(e) => setDress(e.target.value)}
                      placeholder='Enter custom dress description'
                    />
                  )}
                <SelectField
                  label='Footwear'
                  value={footwear}
                  onChange={setFootwear}
                  options={gender === "male" ? maleFootwearOptions : femaleFootwearOptions}
                  placeholder='Select footwear...'
                />
              </div>
            </CollapsibleSection>
          </>
        )}

        <CollapsibleSection title='Quality Settings' icon={<Sparkles className='w-4 h-4' />}>
          <div className='space-y-3'>
            <div>
              <label className='block text-[11.5px] font-semibold text-[#9E9893] mb-1.5'>Tier</label>
              <SegmentedControl options={tierOptions} value={tier} onChange={setTier} />
            </div>
            {tier === "professional" && (
              <>
                <SelectField
                  label='Aspect Ratio'
                  value={aspectRatio}
                  onChange={setAspectRatio}
                  options={aspectRatioOptions}
                />
                <SelectField
                  label='Resolution'
                  value={resolution}
                  onChange={setResolution}
                  options={resolutionOptions}
                />
              </>
            )}
          </div>
        </CollapsibleSection>
      </div>

      {/* Footer CTA */}
      <div className='p-4 border-t border-[#E5E2DA] bg-white shrink-0'>
        <button
          onClick={generateImage}
          disabled={loading}
          className='w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-[14px] px-6 py-3 rounded-xl shadow-[0_4px_12px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.45)] transition-all disabled:opacity-50 disabled:cursor-not-allowed'
          aria-label={loading ? "Generating model" : "Generate model"}
        >
          {loading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Rocket className='h-4 w-4' />}
          <span>{loading ? "Generating..." : "Generate Model"}</span>
        </button>
      </div>
    </div>
  );
};

export const LoadingSpinner: FC<{ className?: string; size?: number }> = ({ size = 24, className, ...props }) => (
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
    className={`animate-spin ${className}`}
  >
    <path d='M21 12a9 9 0 1 1-6.219-8.56' />
  </svg>
);

export default ModelConfigForm;
