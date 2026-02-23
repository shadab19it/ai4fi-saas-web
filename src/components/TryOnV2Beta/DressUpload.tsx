import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { Upload, ZoomIn, X, Image as ImageIcon, Info, Sparkles, Grid3x3, Link as LinkIcon, Unlink, ChevronDown } from "lucide-react"
import { usePlanFeatures } from "../../hooks/usePlanFeatures"
import { female_model_tryon_prompt, male_model_tryon_prompt } from "../../services/prompt"
import modelGalleryList from "../../services/ModelGallery"
import { MODEL_FACE_RETURN_URL_KEY } from "../../constants/modelFace"
import {
  ECOMMERCE_PLATFORM_OPTIONS,
  ECOMMERCE_PLATFORM_PRESETS,
  type EcommercePlatformKey,
} from "../../constants/ecommercePlatforms"
import CollapsibleSidebar from "./layout/CollapsibleSidebar"
import Button from "../ui/Button"
import ZoomImageModal from "../ui/ZoomImageModal"

interface DressUploadProps {
  onUploadComplete: (
    dressImage: string,
    gender: string,
    promptOverride?: string,
    modelImage?: string,
    tier?: "basic" | "professional",
    aspectRatio?: string,
    resolution?: string,
    width?: number,
    height?: number,
    segment?: string,
    garmentCategory?: string
  ) => void
}

export default function DressUpload({ onUploadComplete }: DressUploadProps) {
  const { isResolutionAllowed, maxUploadSizeBytes } = usePlanFeatures()
  const [dressImage, setDressImage] = useState<string | null>(null)
  const [gender, setGender] = useState("female")
  const [promptOverride, setPromptOverride] = useState("")
  const [useCustomPrompt, setUseCustomPrompt] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [fileSize, setFileSize] = useState<string>("")
  const [modelImage, setModelImage] = useState<string | null>(null)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>("formal")
  const [tier, setTier] = useState<"basic" | "professional">("basic")
  const [aspectRatio, setAspectRatio] = useState<string>("")
  const [resolution, setResolution] = useState<string>("")
  const [width, setWidth] = useState<string>("1024")
  const [height, setHeight] = useState<string>("1365")
  const [isLinked, setIsLinked] = useState(true)
  const [showProfessionalOptions, setShowProfessionalOptions] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [segment] = useState<string>("Women")
  const [garmentCategory] = useState<string>("Top wear")
  const [ecommercePlatform, setEcommercePlatform] = useState<EcommercePlatformKey | "">("")
  const dressInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return
    }

    if (file.size > maxUploadSizeBytes) {
      alert(`File too large. Maximum upload size is ${Math.round(maxUploadSizeBytes / (1024 * 1024))} MB.`)
      return
    }
    
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
    setFileSize(`${fileSizeMB} MB`)

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setDressImage(result)
    }
    reader.readAsDataURL(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleGalleryModelSelect = (imageUrl: string) => {
    setModelImage(imageUrl)
    setIsGalleryOpen(false)
  }

  const getGalleryImages = () => {
    const categoryData = modelGalleryList.find((c) => c.category === activeCategory)
    if (!categoryData) return []
    return gender === "male" ? categoryData.male : categoryData.female
  }

  const handleAspectRatioSelect = (ratio: string) => {
    if (ratio === "custom") {
      setAspectRatio("")
      setEcommercePlatform("")
      return
    }
    setAspectRatio(ratio)
    setEcommercePlatform("")
    const [w, h] = ratio.split(":").map(Number)
    const baseWidth = 1024
    const calculatedHeight = Math.round((baseWidth * h) / w)
    setWidth(baseWidth.toString())
    setHeight(calculatedHeight.toString())
  }

  const handlePlatformSelect = (platform: EcommercePlatformKey) => {
    const preset = ECOMMERCE_PLATFORM_PRESETS[platform]
    setEcommercePlatform(platform)
    setAspectRatio(preset.ratio)
    setResolution(preset.resolution)
    setWidth(preset.width.toString())
    setHeight(preset.height.toString())
  }

  const handleWidthChange = (value: string) => {
    setWidth(value)
    if (isLinked && aspectRatio) {
      const [w, h] = aspectRatio.split(":").map(Number)
      const calculatedHeight = Math.round((parseInt(value) * h) / w)
      setHeight(calculatedHeight.toString())
    }
  }

  const handleHeightChange = (value: string) => {
    setHeight(value)
    if (isLinked && aspectRatio) {
      const [w, h] = aspectRatio.split(":").map(Number)
      const calculatedWidth = Math.round((parseInt(value) * w) / h)
      setWidth(calculatedWidth.toString())
    }
  }

  const handleContinue = () => {
    if (dressImage) {
      onUploadComplete(
        dressImage,
        gender,
        useCustomPrompt && promptOverride ? promptOverride : undefined,
        modelImage || undefined,
        tier,
        tier === "professional" ? aspectRatio : undefined,
        tier === "professional" ? resolution : undefined,
        tier === "professional" && width ? parseInt(width) : undefined,
        tier === "professional" && height ? parseInt(height) : undefined,
        tier === "professional" ? segment : undefined,
        tier === "professional" ? garmentCategory : undefined
      )
    }
  }

  useEffect(() => {
    if(gender === "female"){
      setPromptOverride(female_model_tryon_prompt)
    }else{
      setPromptOverride(male_model_tryon_prompt)
    }
  }, [gender])

  useEffect(() => {
    const returnedModelFaceUrl = localStorage.getItem(MODEL_FACE_RETURN_URL_KEY)
    if (returnedModelFaceUrl) {
      setModelImage(returnedModelFaceUrl)
      localStorage.removeItem(MODEL_FACE_RETURN_URL_KEY)
    }
  }, [])

  return (
    <div className="min-h-[calc(100vh-180px)] px-4 pb-8 pt-6">
      <div className="w-full">
        <div>
          {!dressImage ? (
            /* Upload Area */
            <div className="max-w-3xl mx-auto">
              <div className="rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] p-6 md:p-8 space-y-6">
                <div
                  ref={dropZoneRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => dressInputRef.current?.click()}
                  className={`w-full border-2 border-dashed rounded-2xl p-16 transition-all duration-300 flex flex-col items-center justify-center gap-6 cursor-pointer group ${
                    isDragging
                      ? "border-violet-500 bg-violet-50 scale-[1.01] shadow-lg shadow-violet-500/10"
                      : "border-[#E5E2DA] hover:border-violet-400 hover:bg-[#F9F8F5]"
                  }`}
                >
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isDragging
                        ? "bg-gradient-to-br from-violet-600 to-indigo-600 scale-110"
                        : "bg-[#F9F8F5] group-hover:bg-violet-50"
                    }`}
                  >
                    {isDragging ? (
                      <Upload className="w-10 h-10 text-white animate-bounce" />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-[#9E9893] group-hover:text-violet-500 transition-colors" />
                    )}
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-lg font-bold text-stone-900">
                      {isDragging ? "Drop your image here" : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-[13px] text-[#9E9893]">
                      {isDragging ? "Release to upload" : "Supported formats: JPG, JPEG, PNG"}
                    </p>
                    <p className="text-[11.5px] text-[#9E9893] mt-2">Recommended: High-quality images work best</p>
                  </div>
                </div>
                <input ref={dressInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
                
                {/* Tips Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold text-blue-700 mb-1">Pro Tip</p>
                    <p className="text-blue-600/80 text-[13px]">For best results, use images with a plain background and good lighting. The dress should be clearly visible.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Image & Options (Two Column Layout) */
            <div className="flex flex-col xl:flex-row gap-6 items-start">
              {/* Left Side - Image Card */}
              <div
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="order-2 xl:order-2 w-full flex-1 flex flex-col gap-4"
              >
                <div className="relative h-[70vh] min-h-[460px] max-h-[760px] rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] overflow-hidden cursor-pointer group flex items-center justify-center"
                     onClick={() => setIsZoomOpen(true)}>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={dressImage || "/placeholder.svg"}
                      alt="Dress preview"
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    {isHovering && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-6 gap-3 transition-all duration-300">
                        <Button
                          variant="outline"
                          size="md"
                          icon={<Upload className="w-4 h-4" />}
                          onClick={(e) => {
                            e.stopPropagation()
                            dressInputRef.current?.click()
                          }}
                          className="bg-white/90 backdrop-blur-sm hover:bg-white"
                        >
                          Replace
                        </Button>
                        <Button
                          variant="outline"
                          size="md"
                          icon={<ZoomIn className="w-4 h-4" />}
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsZoomOpen(true)
                          }}
                          className="bg-white/90 backdrop-blur-sm hover:bg-white"
                        >
                          Zoom
                        </Button>
                      </div>
                    )}
                  </div>
                  {fileSize && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-stone-900 text-xs font-semibold px-3 py-1.5 rounded-full border border-[#E5E2DA]">
                      {fileSize}
                    </div>
                  )}
                </div>
                <input ref={dressInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={handleContinue}
                  className="w-full"
                >
                  Continue to Next Step
                </Button>
              </div>

              {/* Right Side - Options Card */}
              <CollapsibleSidebar
                collapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
                expandedWidthClass="xl:w-[360px]"
              >
                <div className="rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] p-5 flex flex-col gap-5">
                  {/* Gender */}
                  <div>
                    <label className="flex items-center gap-2 text-[11.5px] font-semibold text-[#6B6560] uppercase tracking-wider mb-2.5">
                      Gender
                      <div className="group relative">
                        <Info className="w-3.5 h-3.5 text-[#9E9893] cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-stone-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          Select the gender for the model
                        </div>
                      </div>
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5E2DA] text-stone-900 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all appearance-none cursor-pointer"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </select>
                  </div>

                  {/* Model Face Image Section */}
                  <div className="border-t border-[#E5E2DA] pt-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-4 h-4 text-violet-500" />
                      <label className="flex items-center gap-2 text-[11.5px] font-semibold text-[#6B6560] uppercase tracking-wider">
                        Model Face Image
                        <span className="text-[#9E9893] text-[10px] font-normal normal-case">(Optional)</span>
                        <div className="group relative">
                          <Info className="w-3.5 h-3.5 text-[#9E9893] cursor-help" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-stone-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-10">
                            Choose from gallery or generate a new face model
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-stone-900"></div>
                          </div>
                        </div>
                      </label>
                    </div>

                    {modelImage ? (
                      <div className="relative rounded-xl overflow-hidden border border-[#E5E2DA]">
                        <img
                          src={modelImage}
                          alt="Model face"
                          className="w-full h-32 object-cover"
                        />
                        <button
                          onClick={() => {
                            setModelImage(null)
                          }}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors shadow-sm"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setIsGalleryOpen(true)}
                          className="border-2 border-dashed border-[#E5E2DA] rounded-xl p-4 hover:border-violet-400 hover:bg-violet-50/50 transition-all flex flex-col items-center justify-center gap-2 group"
                        >
                          <Grid3x3 className="w-5 h-5 text-[#9E9893] group-hover:text-violet-500" />
                          <span className="text-[12px] font-medium text-[#9E9893] group-hover:text-violet-600">Choose from Gallery</span>
                        </button>
                        <Link
                          to="/model?mode=face"
                          className="border-2 border-dashed border-[#E5E2DA] rounded-xl p-4 hover:border-violet-400 hover:bg-violet-50/50 transition-all flex flex-col items-center justify-center gap-2 group"
                        >
                          <Sparkles className="w-5 h-5 text-[#9E9893] group-hover:text-violet-500" />
                          <span className="text-[12px] font-medium text-[#9E9893] group-hover:text-violet-600">Generate Face</span>
                        </Link>
                      </div>
                    )}
                  </div>


                       {/* Quality Tier Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-[11.5px] font-semibold text-[#6B6560] uppercase tracking-wider mb-2.5">
                      Quality Tier
                      <div className="group relative">
                        <Info className="w-3.5 h-3.5 text-[#9E9893] cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-stone-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          Choose between basic or professional quality settings
                        </div>
                      </div>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          setTier("basic")
                          setAspectRatio("")
                          setResolution("")
                          setShowProfessionalOptions(false)
                        }}
                        className={`px-4 py-3 rounded-xl border-2 transition-all text-left ${
                          tier === "basic"
                            ? "bg-gradient-to-r from-violet-600 to-indigo-600 border-violet-500 text-white shadow-[0_4px_12px_rgba(99,102,241,0.25)]"
                            : "bg-white border-[#E5E2DA] text-[#6B6560] hover:border-[#9E9893] hover:bg-[#F9F8F5]"
                        }`}
                      >
                        <div className="text-[13px] font-bold">Basic</div>
                        <div className="text-[11px] opacity-75 mt-0.5">Standard Quality</div>
                      </button>
                      <button
                        onClick={() => {
                          setTier("professional")
                          setShowProfessionalOptions(true)
                        }}
                        className={`px-4 py-3 rounded-xl border-2 transition-all text-left ${
                          tier === "professional"
                            ? "bg-gradient-to-r from-violet-600 to-indigo-600 border-violet-500 text-white shadow-[0_4px_12px_rgba(99,102,241,0.25)]"
                            : "bg-white border-[#E5E2DA] text-[#6B6560] hover:border-[#9E9893] hover:bg-[#F9F8F5]"
                        }`}
                      >
                        <div className="text-[13px] font-bold">Professional</div>
                        <div className="text-[11px] opacity-75 mt-0.5">High Quality</div>
                      </button>
                    </div>

                    {/* Professional Tier Options */}
                    {tier === "professional" && (
                      <div className="rounded-xl border border-violet-200 bg-violet-50/50 mt-4">
                        <button
                          onClick={() => setShowProfessionalOptions(!showProfessionalOptions)}
                          className="w-full px-4 py-3 flex items-center justify-between text-left"
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-violet-500" />
                            <span className="text-[13px] font-bold text-violet-700">Professional Options</span>
                            <span className="px-2 py-0.5 text-[10px] rounded-full bg-violet-100 text-violet-600 border border-violet-200 font-semibold">
                              Advanced
                            </span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-violet-500 transition-transform ${showProfessionalOptions ? "rotate-180" : ""}`}
                          />
                        </button>

                        {showProfessionalOptions && (
                          <div className="space-y-4 px-4 pb-4">
                            {/* Aspect Ratio Selection */}
                            <div>
                              <label className="block text-[11.5px] font-semibold text-[#6B6560] mb-2">Select Aspect Ratio</label>
                              <div className="grid grid-cols-5 gap-2">
                                {[
                                  { value: "1:1", label: "1:1" },
                                  { value: "3:4", label: "3:4" },
                                  { value: "4:3", label: "4:3" },
                                  { value: "2:3", label: "2:3" },
                                  { value: "3:2", label: "3:2" },
                                  { value: "4:5", label: "4:5" },
                                  { value: "16:9", label: "16:9" },
                                  { value: "9:16", label: "9:16" },
                                  { value: "custom", label: "Custom" },
                                ].map((ratio) => (
                                  <button
                                    key={ratio.value}
                                    onClick={() => handleAspectRatioSelect(ratio.value)}
                                    className={`px-2.5 py-2 rounded-lg text-[11.5px] font-semibold transition-all ${
                                      ratio.value === "custom" ? "col-span-2" : ""
                                    } ${
                                      aspectRatio === ratio.value
                                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border border-violet-400 shadow-[0_2px_8px_rgba(99,102,241,0.25)]"
                                        : "bg-white border border-[#E5E2DA] text-[#6B6560] hover:border-[#9E9893] hover:bg-[#F9F8F5]"
                                    }`}
                                  >
                                    {ratio.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Resolution Dropdown */}
                            <div>
                              <label className="block text-[11.5px] font-semibold text-[#6B6560] mb-2">Resolution</label>
                              <div className="relative">
                                <select
                                  value={resolution}
                                  onChange={(e) => {
                                    setResolution(e.target.value)
                                    if (e.target.value === "1K") {
                                      setWidth("1024")
                                      setHeight("1024")
                                    } else if (e.target.value === "2K") {
                                      setWidth("2048")
                                      setHeight("2048")
                                    } else if (e.target.value === "4K") {
                                      setWidth("4096")
                                      setHeight("4096")
                                    }
                                  }}
                                  className="w-full px-3 py-2.5 pr-10 rounded-xl bg-white border border-[#E5E2DA] text-stone-900 text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all appearance-none cursor-pointer"
                                >
                                  <option value="">Default</option>
                                  <option value="1K">1K</option>
                                  <option value="2K" disabled={!isResolutionAllowed("2K")}>2K{!isResolutionAllowed("2K") ? " (Upgrade)" : ""}</option>
                                  <option value="4K" disabled={!isResolutionAllowed("4K")}>4K{!isResolutionAllowed("4K") ? " (Upgrade)" : ""}</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9E9893] pointer-events-none" />
                              </div>
                            </div>

                            {/* Ecommerce Platform Presets */}
                            <div>
                              <label className="block text-[11.5px] font-semibold text-[#6B6560] mb-2">Ecommerce Platform</label>
                              <p className="text-[10.5px] text-[#9E9893] mb-3">Auto-sets optimal aspect ratio & dimensions for the selected marketplace</p>
                              <div className="grid grid-cols-2 gap-2">
                                {ECOMMERCE_PLATFORM_OPTIONS.map(({ value, label }) => {
                                  const preset = ECOMMERCE_PLATFORM_PRESETS[value]
                                  return (
                                  <button
                                    key={value}
                                    onClick={() => handlePlatformSelect(value)}
                                    className={`px-3 py-2.5 rounded-xl text-left transition-all ${
                                      ecommercePlatform === value
                                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border border-violet-400 shadow-[0_2px_8px_rgba(99,102,241,0.25)]"
                                        : "bg-white border border-[#E5E2DA] text-[#6B6560] hover:border-[#9E9893] hover:bg-[#F9F8F5]"
                                    }`}
                                  >
                                    <div className="text-[12px] font-bold">{label}</div>
                                    <div className={`text-[10px] mt-0.5 ${ecommercePlatform === value ? "text-white/75" : "text-[#9E9893]"}`}>{preset.description}</div>
                                  </button>
                                )})}
                              </div>
                            </div>

                            {/* Custom Dimensions */}
                            <div>
                              <label className="block text-[11.5px] font-semibold text-[#6B6560] mb-2">Custom Dimensions</label>
                              <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                                <div>
                                  <label className="block text-[11px] text-[#9E9893] mb-1">W</label>
                                  <input
                                    type="number"
                                    value={width}
                                    onChange={(e) => handleWidthChange(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5E2DA] text-stone-900 text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400"
                                    placeholder="1024"
                                  />
                                </div>
                                <button
                                  onClick={() => setIsLinked(!isLinked)}
                                  className={`mb-1 p-2 rounded-lg transition-all ${
                                    isLinked
                                      ? "bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200"
                                      : "bg-[#F9F8F5] text-[#9E9893] hover:bg-[#E5E2DA] border border-[#E5E2DA]"
                                  }`}
                                  title={isLinked ? "Unlink dimensions" : "Link dimensions"}
                                >
                                  {isLinked ? (
                                    <LinkIcon className="w-4 h-4" />
                                  ) : (
                                    <Unlink className="w-4 h-4" />
                                  )}
                                </button>
                                <div>
                                  <label className="block text-[11px] text-[#9E9893] mb-1">H</label>
                                  <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => handleHeightChange(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5E2DA] text-stone-900 text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400"
                                    placeholder="1365"
                                  />
                                </div>
                              </div>
                            </div>

                    
                          </div>
                        )}
                      </div>
                    )}
                  </div>


                  {/* Prompt Settings */}
                  <div>
                    <label className="flex items-center gap-2 text-[11.5px] font-semibold text-[#6B6560] uppercase tracking-wider mb-2.5">
                      Prompt Settings
                      <div className="group relative">
                        <Info className="w-3.5 h-3.5 text-[#9E9893] cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-stone-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          Choose between AI-recommended prompts or customize your own
                        </div>
                      </div>
                    </label>
                    <div className="space-y-2">
                      <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-colors ${
                        !useCustomPrompt
                          ? "border-violet-300 bg-violet-50"
                          : "border-[#E5E2DA] hover:bg-[#F9F8F5]"
                      }`}>
                        <input
                          type="radio"
                          name="promptType"
                          checked={!useCustomPrompt}
                          onChange={() => {
                            setUseCustomPrompt(false)
                            setPromptOverride("")
                          }}
                          className="w-4 h-4 text-violet-600 border-[#E5E2DA] focus:ring-violet-500 focus:ring-2"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="block text-[13px] font-semibold text-stone-900">AI Recommended</span>
                          <p className="text-[11.5px] text-[#9E9893] mt-0.5">Optimized prompts for best results</p>
                        </div>
                      </label>
                      <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-colors ${
                        useCustomPrompt
                          ? "border-violet-300 bg-violet-50"
                          : "border-[#E5E2DA] hover:bg-[#F9F8F5]"
                      }`}>
                        <input
                          type="radio"
                          name="promptType"
                          checked={useCustomPrompt}
                          onChange={() => setUseCustomPrompt(true)}
                          className="w-4 h-4 text-violet-600 border-[#E5E2DA] focus:ring-violet-500 focus:ring-2"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="block text-[13px] font-semibold text-stone-900">Custom Prompt</span>
                          <p className="text-[11.5px] text-[#9E9893] mt-0.5">Define your own styling preferences</p>
                        </div>
                      </label>
                    </div>
                    {useCustomPrompt && (
                      <div className="mt-3">
                        <textarea
                          rows={5}
                          value={promptOverride}
                          onChange={(e) => setPromptOverride(e.target.value)}
                          placeholder="e.g., 'wearing a red dress, professional look, studio lighting'"
                          className="w-full px-3.5 py-3 rounded-xl bg-white border border-[#E5E2DA] text-stone-900 text-[13px] placeholder-[#9E9893] focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all resize-none"
                        />
                      </div>
                    )}
                  </div>

             
            
                </div>
              </CollapsibleSidebar>
            </div>
          )}
        </div>
      </div>

      {/* Zoom Modal */}
      <ZoomImageModal
        open={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        images={dressImage ? [dressImage] : []}
        alt="Dress preview"
      />

      {/* Model Gallery Modal */}
      {isGalleryOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsGalleryOpen(false)}
        >
          <div
            className="rounded-2xl border border-[#E5E2DA] bg-white shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 pt-5 pb-4 border-b border-[#E5E2DA] flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-bold text-stone-900 mb-1">Choose Model from Gallery</h2>
                <p className="text-[13px] text-[#9E9893]">Select a model face image based on {gender === "male" ? "male" : "female"} gender</p>
              </div>
              <Button variant="outline" size="icon" onClick={() => setIsGalleryOpen(false)} aria-label="Close">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Category Tabs */}
            <div className="px-6 pt-3 pb-3 border-b border-[#E5E2DA] flex gap-2">
              {["formal", "casual", "lingerie", "PlusSize"].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                    activeCategory === category
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_2px_8px_rgba(99,102,241,0.25)]"
                      : "bg-[#F9F8F5] text-[#6B6560] hover:bg-[#E5E2DA]"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getGalleryImages().map((imageUrl, index) => (
                  <div
                    key={index}
                    onClick={() => handleGalleryModelSelect(imageUrl)}
                    className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#E5E2DA] hover:border-violet-400 cursor-pointer transition-all group shadow-[0_1px_3px_rgba(28,25,23,0.06)]"
                  >
                    <img
                      src={imageUrl}
                      alt={`Model ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-[13px] shadow-lg">
                        Select
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
