import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Upload, ZoomIn, X, Image as ImageIcon, Info, Sparkles, Grid3x3, Link as LinkIcon, Unlink, ChevronDown } from "lucide-react"
import { female_model_tryon_prompt, male_model_tryon_prompt } from "../../services/prompt"
import modelGalleryList from "../../services/ModelGallery"

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
  const [segment, setSegment] = useState<string>("Women")
  const [garmentCategory, setGarmentCategory] = useState<string>("Top wear")
  const dressInputRef = useRef<HTMLInputElement>(null)
  const modelImageInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
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

  const handleModelImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      setModelImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleModelFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleModelImageUpload(file)
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

  // Handle aspect ratio selection
  const handleAspectRatioSelect = (ratio: string) => {
    if (ratio === "custom") {
      setAspectRatio("")
      return
    }
    setAspectRatio(ratio)
    const [w, h] = ratio.split(":").map(Number)
    const baseWidth = 1024
    const calculatedHeight = Math.round((baseWidth * h) / w)
    setWidth(baseWidth.toString())
    setHeight(calculatedHeight.toString())
  }

  // Handle width change
  const handleWidthChange = (value: string) => {
    setWidth(value)
    if (isLinked && aspectRatio) {
      const [w, h] = aspectRatio.split(":").map(Number)
      const calculatedHeight = Math.round((parseInt(value) * h) / w)
      setHeight(calculatedHeight.toString())
    }
  }

  // Handle height change
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

  return (
    <div className="min-h-[calc(100vh-180px)] px-4 pb-8 pt-6 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <h1 className="text-2xl md:text-2xl font-bold text-white">Upload Your Dress</h1>
          </div>
          <p className="text-gray-400">Start by uploading a clear image of the garment you want to try on</p>
        </div>

        {/* Upload Card */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8 shadow-2xl">
          {!dressImage ? (
            /* Upload Area with Drag and Drop */
            <div className="space-y-6">
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => dressInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-2xl p-16 transition-all duration-300 flex flex-col items-center justify-center gap-6 cursor-pointer group ${
                  isDragging
                    ? "border-purple-500 bg-purple-500/10 scale-[1.02] shadow-lg shadow-purple-500/20"
                    : "border-gray-700 hover:border-purple-500/50 hover:bg-gray-800/30"
                }`}
              >
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isDragging
                      ? "bg-gradient-to-br from-purple-600 to-indigo-600 scale-110"
                      : "bg-gradient-to-br from-gray-800 to-gray-900 group-hover:from-purple-600/20 group-hover:to-indigo-600/20"
                  }`}
                >
                  {isDragging ? (
                    <Upload className="w-10 h-10 text-white animate-bounce" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-gray-400 group-hover:text-purple-400 transition-colors" />
                  )}
                </div>
                <div className="text-center space-y-2">
                  <p className="text-xl font-semibold text-white">
                    {isDragging ? "Drop your image here" : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {isDragging ? "Release to upload" : "Supported formats: JPG, JPEG, PNG"}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Recommended: High-quality images work best</p>
                </div>
              </div>
              <input ref={dressInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
              
              {/* Tips Card */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p className="font-medium text-blue-400 mb-1">Pro Tip</p>
                  <p className="text-gray-400">For best results, use images with a plain background and good lighting. The dress should be clearly visible.</p>
                </div>
              </div>
            </div>
          ) : (
            /* Image & Options (Two Column Layout) */
            <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_1fr] gap-6">
              {/* Left Side - Image Card */}
              <div
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="relative"
              >
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-xl cursor-pointer group"
                     onClick={() => setIsZoomOpen(true)}>
                  <div className="relative">
                    <img
                      src={dressImage || "/placeholder.svg"}
                      alt="Dress preview"
                      className="w-full h-auto max-h-[500px] object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    {isHovering && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-6 gap-3 transition-all duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            dressInputRef.current?.click()
                          }}
                          className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:bg-white/20 hover:scale-105"
                        >
                          <Upload className="w-4 h-4" />
                          Replace
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsZoomOpen(true)
                          }}
                          className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:bg-white/20 hover:scale-105"
                        >
                          <ZoomIn className="w-4 h-4" />
                          Zoom
                        </button>
                      </div>
                    )}
                  </div>
                  {fileSize && (
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                      {fileSize}
                    </div>
                  )}
                </div>
                <input ref={dressInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
              </div>

              {/* Right Side - Options Card */}
              <div className="flex flex-col gap-4">
                <div className="flex-1 space-y-5 bg-gradient-to-br from-gray-800/70 to-gray-900/80 backdrop-blur-sm border border-gray-700/60 p-5 rounded-2xl shadow-xl">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                      Gender
                      <div className="group relative">
                        <Info className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          Select the gender for the model
                        </div>
                      </div>
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                      Prompt Settings
                      <div className="group relative">
                        <Info className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          Choose between AI-recommended prompts or customize your own
                        </div>
                      </div>
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl hover:bg-gray-800/50 transition-colors">
                        <input
                          type="radio"
                          name="promptType"
                          checked={!useCustomPrompt}
                          onChange={() => {
                            setUseCustomPrompt(false)
                            setPromptOverride("")
                          }}
                          className="w-5 h-5 text-purple-600 bg-gray-800 border-gray-700 focus:ring-purple-600 focus:ring-2"
                        />
                        <div className="flex-1">
                          <span className="text-white font-medium group-hover:text-purple-300 transition-colors">AI Recommended</span>
                          <p className="text-xs text-gray-400 mt-0.5">Optimized prompts for best results</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl hover:bg-gray-800/50 transition-colors">
                        <input
                          type="radio"
                          name="promptType"
                          checked={useCustomPrompt}
                          onChange={() => setUseCustomPrompt(true)}
                          className="w-5 h-5 text-purple-600 bg-gray-800 border-gray-700 focus:ring-purple-600 focus:ring-2"
                        />
                        <div className="flex-1">
                          <span className="text-white font-medium group-hover:text-purple-300 transition-colors">Custom Prompt</span>
                          <p className="text-xs text-gray-400 mt-0.5">Define your own styling preferences</p>
                        </div>
                      </label>
                    </div>
                    {useCustomPrompt && (
                      <div className="mt-4">
                        <textarea
                          rows={5}
                          value={promptOverride}
                          onChange={(e) => setPromptOverride(e.target.value)}
                          placeholder="e.g., 'wearing a red dress, professional look, studio lighting'"
                          className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Quality Tier Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                      Quality Tier
                      <div className="group relative">
                        <Info className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
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
                        className={`px-4 py-3.5 rounded-xl border-2 transition-all ${
                          tier === "basic"
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-500 text-white shadow-lg shadow-purple-500/20"
                            : "bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600 hover:bg-gray-800"
                        }`}
                      >
                        <div className="text-sm font-semibold">Basic</div>
                        <div className="text-xs opacity-75 mt-1">Standard Quality</div>
                      </button>
                      <button
                        onClick={() => {
                          setTier("professional")
                          setShowProfessionalOptions(true)
                        }}
                        className={`px-4 py-3.5 rounded-xl border-2 transition-all ${
                          tier === "professional"
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-500 text-white shadow-lg shadow-purple-500/20"
                            : "bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600 hover:bg-gray-800"
                        }`}
                      >
                        <div className="text-sm font-semibold">Professional</div>
                        <div className="text-xs opacity-75 mt-1">High Quality</div>
                      </button>
                    </div>
                  </div>

                  {/* Professional Tier Options */}
                  {tier === "professional" && (
                    <div className="rounded-xl border border-purple-500/40 bg-gradient-to-br from-purple-900/30 to-indigo-900/20">
                      <button
                        onClick={() => setShowProfessionalOptions(!showProfessionalOptions)}
                        className="w-full px-4 py-3.5 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-300" />
                          <span className="text-sm font-semibold text-purple-200">Professional Options</span>
                          <span className="px-2 py-0.5 text-[10px] rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
                            Advanced
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-purple-300 transition-transform ${showProfessionalOptions ? "rotate-180" : ""}`}
                        />
                      </button>

                      {showProfessionalOptions && (
                        <div className="space-y-4 px-4 pb-4">
                          {/* Aspect Ratio Selection */}
                          <div>
                            <label className="block text-xs font-medium text-gray-300 mb-2">Select Aspect Ratio</label>
                            <div className="grid grid-cols-3 gap-2">
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
                                  className={`px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                                    aspectRatio === ratio.value
                                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-purple-400 shadow-lg shadow-purple-500/20"
                                      : "bg-gray-800/50 border border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800"
                                  }`}
                                >
                                  {ratio.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Resolution Dropdown */}
                          <div>
                            <label className="block text-xs font-medium text-gray-300 mb-2">Resolution</label>
                            <div className="relative">
                              <select
                                value={resolution}
                                onChange={(e) => {
                                  setResolution(e.target.value)
                                  // Set default dimensions based on resolution
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
                                className="w-full px-3 py-2.5 pr-10 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none cursor-pointer"
                              >
                                <option value="">Default</option>
                                <option value="1K">1K</option>
                                <option value="2K">2K</option>
                                <option value="4K">4K</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                          </div>

                          {/* Custom Dimensions */}
                          <div>
                            <label className="block text-xs font-medium text-gray-300 mb-2">Custom Dimensions</label>
                            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">W</label>
                                <input
                                  type="number"
                                  value={width}
                                  onChange={(e) => handleWidthChange(e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  placeholder="1024"
                                />
                              </div>
                              <button
                                onClick={() => setIsLinked(!isLinked)}
                                className={`mb-1 p-2 rounded-lg transition-all ${
                                  isLinked
                                    ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
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
                                <label className="block text-xs text-gray-400 mb-1">H</label>
                                <input
                                  type="number"
                                  value={height}
                                  onChange={(e) => handleHeightChange(e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  placeholder="1365"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Segment */}
                            <div>
                              <label className="block text-xs font-medium text-gray-300 mb-2">Segment</label>
                              <div className="relative">
                                <select
                                  value={segment}
                                  onChange={(e) => setSegment(e.target.value)}
                                  className="w-full px-3 py-2.5 pr-10 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none cursor-pointer"
                                >
                                  <option value="Women">Women</option>
                                  <option value="Men">Men</option>
                                  <option value="Kids">Kids</option>
                                  <option value="Unisex">Unisex</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                              </div>
                            </div>

                            {/* Garment Category */}
                            <div>
                              <label className="block text-xs font-medium text-gray-300 mb-2">Garment Category</label>
                              <div className="relative">
                                <select
                                  value={garmentCategory}
                                  onChange={(e) => setGarmentCategory(e.target.value)}
                                  className="w-full px-3 py-2.5 pr-10 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none cursor-pointer"
                                >
                                  <option value="Top wear">Top wear</option>
                                  <option value="Bottom wear">Bottom wear</option>
                                  <option value="Dress">Dress</option>
                                  <option value="Outerwear">Outerwear</option>
                                  <option value="Accessories">Accessories</option>
                                  <option value="Footwear">Footwear</option>
                                  <option value="Lingerie">Lingerie</option>
                                  <option value="Swimwear">Swimwear</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Model Face Image Section */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <label className="flex items-center gap-2 text-sm font-semibold text-white">
                      Model Face Image
                      <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                      <div className="group relative">
                        <Info className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-10">
                          Upload a face image or choose from gallery to preserve model identity
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </label>
                  </div>

                  {modelImage ? (
                    <div className="relative rounded-xl overflow-hidden border border-gray-700 bg-gray-800/20">
                      <img
                        src={modelImage}
                        alt="Model face"
                        className="w-full h-32 object-cover"
                      />
                      <button
                        onClick={() => {
                          setModelImage(null)
                          if (modelImageInputRef.current) {
                            modelImageInputRef.current.value = ""
                          }
                        }}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => modelImageInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-600 rounded-xl p-4 hover:border-purple-500 hover:bg-purple-500/10 transition-all flex flex-col items-center justify-center gap-2 group"
                      >
                        <Upload className="w-6 h-6 text-gray-400 group-hover:text-purple-400" />
                        <span className="text-sm text-gray-400 group-hover:text-purple-400">Upload Image</span>
                      </button>
                      <button
                        onClick={() => setIsGalleryOpen(true)}
                        className="border-2 border-dashed border-gray-600 rounded-xl p-4 hover:border-purple-500 hover:bg-purple-500/10 transition-all flex flex-col items-center justify-center gap-2 group"
                      >
                        <Grid3x3 className="w-6 h-6 text-gray-400 group-hover:text-purple-400" />
                        <span className="text-sm text-gray-400 group-hover:text-purple-400">Choose from Gallery</span>
                      </button>
                    </div>
                  )}
                  <input
                    ref={modelImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleModelFileInput}
                    className="hidden"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setDressImage(null)
                      setFileSize("")
                    }}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-700 text-white hover:bg-gray-800/50 transition-all font-medium"
                  >
                    Change Image
                  </button>
                  <button
                    onClick={handleContinue}
                    className="bg-gradient-to-r flex-1 from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-3 rounded-xl shadow-lg shadow-purple-500/20 transition-all font-semibold hover:scale-[1.02]"
                  >
                    Continue to Next Step →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomOpen && dressImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={dressImage}
              alt="Dress preview - zoomed"
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Model Gallery Modal */}
      {isGalleryOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setIsGalleryOpen(false)}
        >
          <div
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Choose Model from Gallery</h2>
                <p className="text-gray-400 text-sm">Select a model face image based on {gender === "male" ? "male" : "female"} gender</p>
              </div>
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="px-6 pt-4 border-b border-gray-700 flex gap-2">
              {["formal", "casual", "lingerie", "PlusSize"].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === category
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
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
                    className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-700 hover:border-purple-500 cursor-pointer transition-all group"
                  >
                    <img
                      src={imageUrl}
                      alt={`Model ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-purple-600 text-white px-4 py-2 rounded-lg font-medium">
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
