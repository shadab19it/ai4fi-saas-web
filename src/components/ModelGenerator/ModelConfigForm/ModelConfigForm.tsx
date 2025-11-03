/* eslint-disable react/prop-types */
import { FC, ReactNode, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  User,
  Camera,
  Palette,
  Image as ImageIcon,
  Sparkles,
  Info,
  Rocket,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {
  backgroundOptions,
  countryOptions,
  eyeColorOptions,
  fastGenFemaleHairStyle,
  fastGenFemalePoses,
  fastGenMaleHairStyle,
  fastGenMalePoses,
  genderOptions,
  hairColorOptions,
  hairTypeOptions,
  poseOptions,
  skinColorOptions,
} from "./optionInput";
import MultiSelect from "../../common/MultiSelect";
import DarkLogo from "../../../../public/dark-logo.png";
import { Link } from "react-router-dom";
import { toast } from "sonner";
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

const Tooltip: FC<{ text: string; children: any }> = ({ text, children }) => {
  return (
    <div className='group relative inline-block'>
      {children}
      <div className='absolute left-full ml-2 px-2 py-1 bg-gray-800 text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap'>
        {text}
      </div>
    </div>
  );
};

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
  setGender,
  setAge,
  age,
  setHairColor,
  setHairType,
  setPose,
  setSkinColor,
  setEyeColor,
  setCountry,
  setBackground,
  setDnaNumber,
  background,
  setModel,
  setSeedType,
  setDress,
  setShotType,
  shotType,
  country,
  gender,
  hairType,
  skinColor,
  seedType,
  model,
  hairColor,
  eyeColor,
  pose,
  loading,
  generateImage,
  dress,
  dnaNumber,
  setCustomBackground,
  customBackground,
  setLighting,
  lighting,
  setMultiPose,
  setBodyType,
  bodyType,
  repllicateModelInfo,
  onChangeReplicateInfo,
  generateFastGenModel,
  setIsSidebarOpen,
  isSidebarOpen,
  onClickAdwancedModel,
}) => {
  const [activeTab, setActiveTab] = useState("basic");
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
          {isMobile && (
            <button
              disabled={loading}
              className=' fast-gen-model-btn cursor-pointer text-[10px] py-2 px-6 sm:text-sm'
              onClick={onClickAdwancedModel}>
              {!repllicateModelInfo.isReplicateModel ? "Use FastGen Model" : "Use Custom Model"}
            </button>
          )}
          <button
            className=' bg-white text-black p-2 rounded-full shadow-lg z-150 sm:hidden block'
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
          </button>
        </div>
      </div>

      {/* For Custom Model Generate */}
      {!repllicateModelInfo.isReplicateModel && (
        <>
          <div className='flex border-b border-gray-700'>
            <button
              className={`flex-1 p-2 ${activeTab === "basic" ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700/50"}`}
              onClick={() => setActiveTab("basic")}>
              Basic
            </button>
            <button
              className={`flex-1 p-2 ${activeTab === "advanced" ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700/50"}`}
              onClick={() => setActiveTab("advanced")}>
              Advanced
            </button>
          </div>
          {/* Scrollable Content */}
          <div className='flex-1 overflow-y-auto overflow-x-hidden'>
            {activeTab === "basic" && (
              <>
                <CollapsibleSection title='Basic Info' icon={<User className='w-4 h-4' />}>
                  <div className='space-y-3'>
                    <div>
                      <label className='block text-sm mb-1'>Country</label>
                      <select
                        className='w-full bg-gray-900 rounded p-2 text-sm'
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}>
                        {countryOptions.map((o) => (
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
                          {genderOptions.map((o, i) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className='block text-sm mb-1'>Age</label>
                        <input
                          type='number'
                          className='w-full bg-gray-900 rounded p-2 text-sm'
                          onChange={(e) => setAge(e.target.value)}
                          value={age}
                          min='18'
                          max='65'
                          defaultValue='25'
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title='Appearance' icon={<Palette className='w-4 h-4' />}>
                  <div className='space-y-3'>
                    <div className='grid grid-cols-2 gap-3'>
                      <div>
                        <label className='block text-sm mb-1'>Hair Color</label>
                        <select
                          value={hairColor}
                          className='w-full bg-gray-900 rounded p-2 text-sm'
                          onChange={(e) => setHairColor(e.target.value)}>
                          {hairColorOptions.map((o, i) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className='block text-sm mb-1'>Hair Style</label>
                        <select
                          value={hairType}
                          className='w-full bg-gray-900 rounded p-2 text-sm'
                          onChange={(e) => setHairType(e.target.value)}>
                          {gender === "Male"
                            ? fastGenMaleHairStyle.map((o, i) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))
                            : fastGenFemaleHairStyle.map((o, i) => (
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
                          {eyeColorOptions.map((o, i) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className='block text-sm mb-1'>Skin Color</label>
                        <select
                          value={skinColor}
                          className='w-full bg-gray-900 rounded p-2 text-sm'
                          onChange={(e) => setSkinColor(e.target.value)}>
                          {skinColorOptions.map((o, i) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className='col-span-2'>
                        {gender === "Male" ? (
                          <div>
                            <label className='block text-sm mb-1'>Body Type</label>
                            <select
                              value={bodyType}
                              onChange={(e) => setBodyType(e.target.value)}
                              className='w-full bg-gray-900 rounded p-2 text-sm'>
                              <option value='Slim & Toned'>Slim & Toned</option>
                              <option value='Curvy & Voluptuous'>Curvy & Voluptuous</option>
                              <option value='Athletic & Defined'>Athletic & Defined</option>
                              <option value='Petite & Delicate'> Petite & Delicate</option>
                              <option value='Plus-Size & Full-Figured'>Plus-Size & Full-Figured</option>
                            </select>
                          </div>
                        ) : (
                          <div>
                            <label className='block text-sm mb-1'>Body Type</label>
                            <select
                              value={bodyType}
                              onChange={(e) => setBodyType(e.target.value)}
                              className='w-full bg-gray-900 rounded p-2 text-sm'>
                              <option value='Slim & Lean'>Slim & Lean</option>
                              <option value=' Muscular & Athletic.'> Muscular & Athletic.</option>
                              <option value='Broad & Sturdy'>Broad & Sturdy</option>
                              <option value=' Tall & Lanky'> Tall & Lanky</option>
                              <option value='Obese & Heavyset'>Obese & Heavyset</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title='Shot Settings' icon={<Camera className='w-4 h-4' />}>
                  <div className='space-y-3'>
                    <div>
                      <label className='block text-sm mb-1'>Shot Type</label>
                      <SegmentedControl
                        options={[
                          { value: "Full Body", label: "Full Body" },
                          { value: "Half Body", label: "Half Body" },
                        ]}
                        value={shotType}
                        onChange={(value) => setShotType(value)}
                      />
                    </div>
                    <div>
                      <label className='block text-sm mb-1'>Dress Description</label>
                      <textarea
                        rows={1}
                        value={dress}
                        onChange={(e) => {
                          setDress(e.target.value); // Update dress state
                          console.log("Dress Input:", e.target.value); // Debugging
                        }}
                        className='w-full bg-gray-900 rounded p-2 text-sm'
                      />
                    </div>
                    {model === 1 && (
                      <div>
                        <label className='block text-sm mb-1'>Pose</label>
                        <select value={pose} className='w-full bg-gray-900 rounded p-2 text-sm' onChange={(e) => setPose(e.target.value)}>
                          {gender === "Male"
                            ? fastGenMalePoses.map((o, i) => (
                                <option key={o.value} value={o.value} disabled={o.value === "divider"}>
                                  {o.label}
                                </option>
                              ))
                            : fastGenFemalePoses.map((o, i) => (
                                <option key={o.value} value={o.value} disabled={o.value === "divider"}>
                                  {o.label}
                                </option>
                              ))}
                        </select>
                      </div>
                    )}
                  </div>
                </CollapsibleSection>
                <CollapsibleSection title='Generation Settings' icon={<Sparkles className='w-4 h-4' />}>
                  <div className='space-y-3'>
                    <div>
                      <label className='block text-sm mb-1'>Seed Type</label>
                      <SegmentedControl
                        options={[
                          { value: "Auto Generate", label: "Auto" },
                          { value: "Custom Generated", label: "Custom" },
                        ]}
                        value={seedType}
                        onChange={(value) => setSeedType(value)}
                      />
                    </div>

                    {seedType === "Custom Generated" && (
                      <div>
                        <label className='block text-sm mb-1'>Model DNA Number</label>
                        <input
                          type='number'
                          className='w-full bg-gray-900 rounded p-2 text-sm'
                          value={dnaNumber}
                          onChange={(e) => setDnaNumber(e.target.value)}
                        />
                      </div>
                    )}

                    {seedType === "Custom Generated" && (
                      <div>
                        <label className='block text-sm mb-1'>
                          Number of Models
                          <Tooltip text='Generate up to 4 models at once'>
                            <Info className='w-4 h-4 inline ml-1' />
                          </Tooltip>
                        </label>
                        <div className='flex  gap-2'>
                          <input
                            type='range'
                            min='1'
                            max='4'
                            value={model}
                            onChange={(e) => setModel(parseInt(e.target.value))}
                            className='w-full'
                          />
                          <div className='text-right text-sm'>{model}</div>
                        </div>
                      </div>
                    )}
                    {model > 1 && (
                      <div>
                        <label className='block text-sm mb-2'>Select {model} Poses</label>
                        <MultiSelect
                          options={gender === "Male" ? fastGenMalePoses : fastGenFemalePoses}
                          noOfposes={model}
                          onChange={(v) => {
                            if (v.length > model) {
                              toast.info(`You can select only ${model} Poses`);
                              setMultiPose(poseOptions);
                              return;
                            } else {
                              setMultiPose(v.map((o) => o.value));
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                </CollapsibleSection>
              </>
            )}

            {activeTab === "advanced" && (
              <>
                <CollapsibleSection title='Background' icon={<ImageIcon className='w-4 h-4' />}>
                  <div className='space-y-3'>
                    <div>
                      <label className='block text-sm mb-1'>Background</label>
                      <select
                        className='w-full bg-gray-900 rounded p-2 text-sm'
                        value={background}
                        onChange={(e) => setBackground(e.target.value)}>
                        {backgroundOptions.map((o, i) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className='block text-sm mb-2'>Custom Background</label>
                      <textarea
                        rows={1}
                        value={customBackground}
                        onChange={(e) => {
                          setCustomBackground(e.target.value); // Update Background State
                        }}
                        className='w-full bg-gray-900 rounded p-2 text-sm'
                      />
                    </div>
                    <div>
                      <label className='block text-sm mb-1'>Lighting</label>
                      <select
                        value={lighting}
                        onChange={(e) => setLighting(e.target.value)}
                        className='w-full bg-gray-900 rounded p-2 text-sm'>
                        <option value='Softbox Studio Lighting'>Softbox Studio Lighting</option>
                        <option value='High-Key Lighting'>High-Key Lighting</option>
                        <option value='Natural Daylight (Di used)'> Natural Daylight (Di used)</option>
                        <option value='Dramatic Low-Key Lighting'> Dramatic Low-Key Lighting</option>
                        <option value='Ring Light Setup'> Ring Light Setup</option>
                      </select>
                    </div>
                  </div>
                </CollapsibleSection>
              </>
            )}
          </div>
        </>
      )}

      {/* For FASTGEN Model Generate */}

      {repllicateModelInfo.isReplicateModel && (
        <div className='flex-1 overflow-y-auto overflow-x-hidden'>
          {activeTab === "basic" && (
            <>
              <CollapsibleSection isHeader={false} title='Basic Info' icon={<User className='w-4 h-4' />}>
                <div className='space-y-3'>
                  <div className='grid grid-cols-1 gap-3'>
                    <div>
                      <label className='block text-sm mb-1'>Gender</label>
                      <select
                        className='w-full bg-gray-900 rounded p-2 text-sm'
                        value={repllicateModelInfo.gender}
                        onChange={(e) => onChangeReplicateInfo("gender", e.target.value)}>
                        {genderOptions.map((o, i) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className='block text-sm mb-1'>Hair Style</label>
                      <select
                        className='w-full bg-gray-900 rounded p-2 text-sm'
                        value={repllicateModelInfo.hairstyle}
                        onChange={(e) => onChangeReplicateInfo("hairstyle", e.target.value)}>
                        {repllicateModelInfo.gender === "Male"
                          ? fastGenMaleHairStyle.map((o, i) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))
                          : fastGenFemaleHairStyle.map((o, i) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                      </select>
                    </div>

                    <div>
                      <label className='block text-sm mb-1'>Outfit</label>
                      <textarea
                        rows={1}
                        value={repllicateModelInfo.outfit}
                        onChange={(e) => {
                          onChangeReplicateInfo("outfit", e.target.value); // Update dress state
                        }}
                        className='w-full bg-gray-900 rounded p-2 text-sm'
                      />
                    </div>

                    <div>
                      <label className='block text-sm mb-1'>Shot Type</label>
                      <SegmentedControl
                        options={[
                          { value: "full-length", label: "Full Body" },
                          { value: "half-length", label: "Half Body" },
                        ]}
                        value={repllicateModelInfo.shootType}
                        onChange={(value) => onChangeReplicateInfo("shootType", value)}
                      />
                    </div>

                    <div>
                      <label className='block text-sm mb-2'>Select Poses (max {repllicateModelInfo.noOfPoses})</label>
                      <MultiSelect
                        options={repllicateModelInfo.gender === "Male" ? fastGenMalePoses : fastGenFemalePoses}
                        noOfposes={repllicateModelInfo.noOfPoses}
                        onChange={(v) => {
                          if (v.length > repllicateModelInfo.noOfPoses) {
                            toast.info(`You can select only ${repllicateModelInfo.noOfPoses} Poses`);
                            onChangeReplicateInfo("poses", repllicateModelInfo.poses);
                            return;
                          } else {
                            onChangeReplicateInfo(
                              "poses",
                              v.map((o) => o.value)
                            );
                          }
                        }}
                      />
                    </div>

                    <div>
                      <label className='block text-sm mb-1'>Seed Type</label>
                      <SegmentedControl
                        options={[
                          { value: "Auto Generate", label: "Auto" },
                          { value: "Custom Generated", label: "Custom" },
                        ]}
                        value={repllicateModelInfo.seedType}
                        onChange={(value) => onChangeReplicateInfo("seedType", value)}
                      />
                    </div>

                    {repllicateModelInfo.seedType === "Custom Generated" && (
                      <div>
                        <label className='block text-sm mb-1'>Model DNA Number</label>
                        <input
                          type='number'
                          className='w-full bg-gray-900 rounded p-2 text-sm'
                          value={dnaNumber}
                          onChange={(e) => onChangeReplicateInfo("seed", e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className='block text-sm mb-1'>Prompt</label>
                    <textarea
                      rows={4}
                      value={repllicateModelInfo?.prompt}
                      onChange={(e) => {
                        onChangeReplicateInfo("prompt", e.target.value);
                        console.log("Dress Input:", e.target.value); // Debugging
                      }}
                      className='w-full bg-gray-900 rounded p-2 text-sm'
                    />
                  </div>

                  <div>
                    <label className='block text-sm mb-1'>Aspect Ratio</label>
                    <input
                      type='string'
                      className='w-full bg-gray-900 rounded p-2 text-sm'
                      value={repllicateModelInfo?.spectRatio}
                      onChange={(e) => onChangeReplicateInfo("spectRatio", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className='block text-sm mb-1'>Guidance</label>
                    <input
                      type='number'
                      className='w-full bg-gray-900 rounded p-2 text-sm'
                      value={repllicateModelInfo?.guidance}
                      onChange={(e) => onChangeReplicateInfo("guidance", e.target.value)}
                    />
                  </div>
                </div>
              </CollapsibleSection>
            </>
          )}
        </div>
      )}

      {/* Footer Actions */}
      <div className='p-4 border-t border-gray-700 bg-gray-900'>
        <div className='flex gap-2'>
          <button
            onClick={repllicateModelInfo.isReplicateModel ? generateFastGenModel : generateImage}
            className='flex-1 flex justify-center gap-2 items-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:bg-gradient-to-r hover:from-purple-800 hover:to-indigo-800 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-transform'>
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
