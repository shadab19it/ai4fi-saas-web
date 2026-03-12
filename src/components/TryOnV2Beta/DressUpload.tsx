import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Upload, ZoomIn, X, Info, Sparkles, Grid3x3, Link as LinkIcon, Unlink, ChevronDown, ImagePlus, ArrowRight, SlidersHorizontal } from "lucide-react"
import axios from "axios"
import { usePlanFeatures } from "../../hooks/usePlanFeatures"
import { female_model_tryon_prompt, male_model_tryon_prompt } from "../../services/prompt"
import { MODEL_FACE_RETURN_URL_KEY, DRESS_IMAGE_PERSIST_KEY } from "../../constants/modelFace"
import appConstant from "../../services/appConstant"
import {
  ECOMMERCE_PLATFORM_OPTIONS,
  ECOMMERCE_PLATFORM_PRESETS,
  type EcommercePlatformKey,
} from "../../constants/ecommercePlatforms"
import CollapsibleSidebar from "./layout/CollapsibleSidebar"
import Button from "../ui/Button"
import ZoomImageModal from "../ui/ZoomImageModal"
import ModelGalleryModal from "../common/ModelGalleryModal"
import { toast } from "sonner"

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
    garmentCategory?: string,
    isCustomDimensions?: boolean,
    garmentView?: "front" | "back"
  ) => void
}

export default function DressUpload({ onUploadComplete }: DressUploadProps) {
    const location = useLocation();
    const fromSource = new URLSearchParams(location.search).get("from");
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
  const [error, setError] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
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
  const [garmentView, setGarmentView] = useState<"front" | "back">("front")
  const dressInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const handleImageUpload = async (file: File) => {
    if (!file) return

    const mime = file.type || ""
    const isImage = mime.startsWith("image/") || /\.(jpe?g|png|gif|webp|bmp|tiff|svg)$/i.test(file.name)

    if (!isImage) {
      setError("Unsupported file type. Please upload an image (jpg, png, webp...).")
      if (dressInputRef.current) dressInputRef.current.value = ""
      setTimeout(() => setError(null), 4000)
      return
    }

    if (file.size > maxUploadSizeBytes) {
      setError(`File too large. Maximum upload size is ${Math.round(maxUploadSizeBytes / (1024 * 1024))} MB.`)
      if (dressInputRef.current) dressInputRef.current.value = ""
      setTimeout(() => setError(null), 4000)
      return
    }

    setIsValidating(true)
    setError(null)

    try {
      const token = localStorage.getItem(appConstant.JWT_AUTH_TOKEN)
      const formData = new FormData()
      formData.append("file", file)
      const { data } = await axios.post(
        `${appConstant.BACKEND_API_URL}/generate/validate-garment`,
        formData,
        { headers: { "Content-Type": "multipart/form-data", ...(token && { Authorization: token }) } }
      )
      if (!data.valid) {
        const reason = data.reason || "Invalid garment image. Please upload a plain garment photo."
        toast.error(reason, {
          duration: 6000,
          position: "top-center",
        })
        setIsValidating(false)
        return
      }
    } catch (error) {
      toast.error("Failed to validate garment image. Please try again.", {
        duration: 6000,
        position: "top-center",
      })
      return
    }

    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
    setFileSize(`${fileSizeMB} MB`)

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setDressImage(result)
      localStorage.setItem(DRESS_IMAGE_PERSIST_KEY, result)
      setError(null)
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

  const handleAspectRatioSelect = (ratio: string) => {
    if (ratio === "custom") {
      setAspectRatio("custom")
      setEcommercePlatform("")
      // Keep existing width/height so user can freely edit them
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
    // Don't auto-calculate when in custom mode — user controls both dimensions freely
    if (isLinked && aspectRatio && aspectRatio !== "custom") {
      const [w, h] = aspectRatio.split(":").map(Number)
      const calculatedHeight = Math.round((parseInt(value) * h) / w)
      setHeight(calculatedHeight.toString())
    }
  }

  const handleHeightChange = (value: string) => {
    setHeight(value)
    // Don't auto-calculate when in custom mode — user controls both dimensions freely
    if (isLinked && aspectRatio && aspectRatio !== "custom") {
      const [w, h] = aspectRatio.split(":").map(Number)
      const calculatedWidth = Math.round((parseInt(value) * w) / h)
      setWidth(calculatedWidth.toString())
    }
  }

  const handleContinue = () => {

    if(tier === "professional" && !ecommercePlatform && !resolution){
      toast.error("Please select an ecommerce platform or resolution")
      return
    }

    if (dressImage) {
      localStorage.removeItem(DRESS_IMAGE_PERSIST_KEY)
      const isCustom = aspectRatio === "custom"
      const effectiveAspectRatio = isCustom ? "1:1" : aspectRatio
      onUploadComplete(
        dressImage,
        gender,
        useCustomPrompt && promptOverride ? promptOverride : undefined,
        modelImage || undefined,
        tier,
        tier === "professional" ? effectiveAspectRatio : undefined,
        tier === "professional" ? resolution : undefined,
        tier === "professional" && width ? parseInt(width) : undefined,
        tier === "professional" && height ? parseInt(height) : undefined,
        tier === "professional" ? segment : undefined,
        tier === "professional" ? garmentCategory : undefined,
        tier === "professional" ? isCustom : undefined,
        garmentView
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
    // Restore previously uploaded dress image if user navigated away (e.g. to Model Generator)
    const persistedDress = localStorage.getItem(DRESS_IMAGE_PERSIST_KEY)
    if (persistedDress) {
      setDressImage(persistedDress)
    }

    // Restore generated face model URL if user came back from Model Generator
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
            /* ── Upload Area (Premium Design) ── */
            <div className="relative bg-[#F8FAFC] overflow-x-hidden -mx-4 -mt-12 px-4 pt-0 selection:bg-zinc-200 selection:text-zinc-900">
              <style dangerouslySetInnerHTML={{ __html: `
               
                .bg-box {
                  background: rgba(255,255,255,0.4);
                  backdrop-filter: blur(12px);
                  -webkit-backdrop-filter: blur(12px);
                  border: 1px solid rgba(255,255,255,0.8);
                  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
             
                }
                .glass-surface {
                  background: rgba(255,255,255,0.85);
                  -webkit-backdrop-filter: blur(24px);
                  border: 1px solid rgba(255,255,255,1);

                }
                .animated-dashed-border {
                  background-image:
                    repeating-linear-gradient(0deg,   #D4D4D8, #D4D4D8 8px, transparent 8px, transparent 16px),
                    repeating-linear-gradient(90deg,  #D4D4D8, #D4D4D8 8px, transparent 8px, transparent 16px),
                    repeating-linear-gradient(180deg, #D4D4D8, #D4D4D8 8px, transparent 8px, transparent 16px),
                    repeating-linear-gradient(270deg, #D4D4D8, #D4D4D8 8px, transparent 8px, transparent 16px);
                  background-size: 2px 100%, 100% 2px, 2px 100%, 100% 2px;
                  background-position: 0 0, 0 0, 100% 0, 0 100%;
                  background-repeat: no-repeat;
                  border-radius: 1.75rem;
                }
                .upload-drop-zone:hover .animated-dashed-border {
                  background-image:
                    repeating-linear-gradient(0deg,   #A1A1AA, #A1A1AA 8px, transparent 8px, transparent 16px),
                    repeating-linear-gradient(90deg,  #A1A1AA, #A1A1AA 8px, transparent 8px, transparent 16px),
                    repeating-linear-gradient(180deg, #A1A1AA, #A1A1AA 8px, transparent 8px, transparent 16px),
                    repeating-linear-gradient(270deg, #A1A1AA, #A1A1AA 8px, transparent 8px, transparent 16px);
                }
                .btn-premium {
                  background: #18181B;
                  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2);
                  transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
                }
                .btn-premium:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 20px 35px -5px rgba(0,0,0,0.3);
                  background: #000000;
                }
              `}} />

              {/* Animated background columns */}
              <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full blur-[120px] z-10" />

                {/* Left column — floats up */}
                <div className="absolute left-[5%] md:left-[8%] top-0 bottom-0 w-48 md:w-64 z-0">
                  <div className="flex flex-col gap-8 animate-float-up pt-[20vh]">
                    <div className="bg-box p-3 rounded-3xl -rotate-2">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" className="w-full h-64 object-cover rounded-2xl" alt="" />
                    </div>
                    <div className="bg-box p-3 rounded-3xl rotate-3">
                      <img src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=400" className="w-full h-80 object-cover rounded-2xl" alt="" />
                    </div>
                    <div className="bg-box p-3 rounded-3xl -rotate-1">
                      <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400" className="w-full h-56 object-cover rounded-2xl object-top" alt="" />
                    </div>
                    <div className="bg-box p-3 rounded-3xl -rotate-2">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" className="w-full h-64 object-cover rounded-2xl" alt="" />
                    </div>
                    <div className="bg-box p-3 rounded-3xl rotate-3">
                      <img src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=400" className="w-full h-80 object-cover rounded-2xl" alt="" />
                    </div>
                  </div>
                </div>

                {/* Right column — floats down */}
                <div className="absolute right-[5%] md:right-[8%] top-0 bottom-0 w-48 md:w-64 z-0">
                  <div className="flex flex-col gap-8 animate-float-down">
                    <div className="bg-box p-3 rounded-3xl rotate-2">
                      <img src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=400" className="w-full h-72 object-cover rounded-2xl" alt="" />
                    </div>
                    <div className="bg-box p-3 rounded-3xl -rotate-3">
                      <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=400" className="w-full h-64 object-cover rounded-2xl object-top" alt="" />
                    </div>
                    <div className="bg-box p-3 rounded-3xl rotate-1">
                      <img src="https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?auto=format&fit=crop&q=80&w=400" className="w-full h-80 object-cover rounded-2xl" alt="" />
                    </div>
                    <div className="bg-box p-3 rounded-3xl rotate-2">
                      <img src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=400" className="w-full h-72 object-cover rounded-2xl" alt="" />
                    </div>
                    <div className="bg-box p-3 rounded-3xl -rotate-3">
                      <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=400" className="w-full h-64 object-cover rounded-2xl object-top" alt="" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Foreground content */}
              <div className="relative z-20 max-w-4xl mx-auto px-6 py-16 min-h-[calc(100vh-180px)] flex flex-col items-center justify-center">

                {/* Header */}
                <div className="text-center w-full mb-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 mb-4">
                    Create Your AI Photoshoot
                  </h1>
                  <p className="text-lg text-zinc-500 font-medium max-w-lg mx-auto mb-2">
                    Upload your garment to generate premium AI-powered model photos instantly.
                  </p>
                {error && (
                  <div className="mt-4 w-full max-w-2xl text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-center">
                    {error}
                  </div>
                )}
                </div>
                {/* Upload card */}
                <div className="w-[600px]  glass-surface rounded-[2rem] p-3 mb-6">
                  <div
                    ref={dropZoneRef}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !isValidating && dressInputRef.current?.click()}
                    className={`upload-drop-zone group relative w-full rounded-[1.75rem] p-16 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden ${
                      isDragging ? "bg-violet-50/80" : "bg-zinc-50/50 hover:bg-zinc-50/80"
                    }`}
                  >
                    <div className={`absolute inset-0 animated-dashed-border transition-all duration-300 ${isDragging ? "opacity-0" : ""}`} />
                    {isDragging && (
                      <div className="absolute inset-0 rounded-[1.75rem] border-2 border-violet-500 bg-violet-50/50" />
                    )}
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className={`w-20 h-20 rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center mb-6 transition-all duration-300 ${
                        isDragging
                          ? "bg-gradient-to-br from-violet-600 to-indigo-600 scale-110 border-transparent"
                          : "bg-white group-hover:-translate-y-1 group-hover:shadow-md"
                      }`}>
                        {isDragging
                          ? <Upload className="w-8 h-8 text-white animate-bounce" />
                          : <ImagePlus className="w-8 h-8 text-zinc-800" />
                        }
                      </div>
                      <h3 className="text-2xl font-bold text-zinc-900 mb-2">
                        {isDragging ? "Drop your image here" : "Drag & drop garment image"}
                      </h3>
                      <p className="text-zinc-500 text-sm mb-8">
                        {isDragging ? "Release to upload" : "or click to browse your files"}
                      </p>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-white px-5 py-2.5 rounded-full border border-zinc-100 shadow-sm">
                        <span>PNG</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-300" />
                        <span>JPG</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-300" />
                        <span>WEBP</span>
                      </div>
                    </div>
                  </div>
                </div>


                {/* CTA */}
                <button
                  onClick={() => !isValidating && dressInputRef.current?.click()}
                  disabled={isValidating}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white shadow-[0_4px_12px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.45)] group flex items-center justify-center gap-3 w-full sm:w-auto rounded-full px-12 py-4"
                >
                  {isValidating ? (
                    <>
                      <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span className="font-bold tracking-wide">Validating...</span>
                    </>
                  ) : (
                    <>
                      <span className="font-bold tracking-wide">Upload to Continue</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <input ref={dressInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
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
                  Generate Model
                </Button>
              </div>

              {/* Right Side - Options Card */}
              <CollapsibleSidebar
                collapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
                expandedWidthClass="xl:w-[360px]"
              >
                <div className="rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] p-5 flex flex-col gap-5">
             


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

                         {/* Gender */}
                  <div>
                    <label className="flex mt-5 items-center gap-2 text-[11.5px] font-semibold text-[#6B6560] uppercase tracking-wider mb-2.5">
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
                      <option value="baby">Baby</option>
                      <option value="boy">Boy</option>
                      <option value="female">Female</option>
                      <option value="girl">Girl</option>
                      <option value="male">Male</option>
                      <option value="obese">Obese</option>
                    </select>
                  </div>



                         {/* Garment View */}
                  <div>
                    <label className="flex mt-5 items-center gap-2 text-[11.5px] font-semibold text-[#6B6560] uppercase tracking-wider mb-2.5">
                      Garment View
                      <div className="group relative">
                        <Info className="w-3.5 h-3.5 text-[#9E9893] cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-stone-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          Select whether this image shows the front or back of the garment
                        </div>
                      </div>
                    </label>
                    <div className="flex items-center bg-[#F4F3EF] rounded-xl p-1 gap-1">
                      {(["front", "back"] as const).map((view) => (
                        <button
                          key={view}
                          onClick={() => setGarmentView(view)}
                          className={`flex-1 py-2 rounded-lg text-[12px] font-semibold capitalize transition-all ${
                            garmentView === view
                              ? "bg-white text-stone-900 shadow-sm border border-[#E5E2DA]"
                              : "text-[#9E9893] hover:text-[#6B6560]"
                          }`}
                        >
                          {view === "front" ? "Front" : "Back"}
                        </button>
                      ))}
                    </div>
                  </div>

                         {/* Model Face Image Section */}
                  <div className=" pt-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-4 h-4 text-violet-500" />
                      <label className="flex items-center gap-2 text-[11.5px] font-semibold text-[#6B6560] uppercase tracking-wider">
                       Select Model 
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
                          className="w-full h-32 object-contain"
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
                          <span className="text-[12px] font-medium text-[#9E9893] group-hover:text-violet-600">Select Model</span>
                        </button>
                        <Link
                          to={`/model?mode=face&gender=${gender}`}
                          className="border-2 border-dashed border-[#E5E2DA] rounded-xl p-4 hover:border-violet-400 hover:bg-violet-50/50 transition-all flex flex-col items-center justify-center gap-2 group"
                        >
                          <Sparkles className="w-5 h-5 text-[#9E9893] group-hover:text-violet-500" />
                          <span className="text-[12px] font-medium text-[#9E9893] group-hover:text-violet-600">Create Model</span>
                        </Link>
                      </div>
                    )}
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

                            {/* Resolution Dropdown */}
                            <div>
                              <label className="block text-[11.5px] font-semibold text-[#6B6560] mb-2">Resolution</label>
                              <div className="relative">
                                <select
                                  value={resolution}
                                  onChange={(e) => {
                                    setResolution(e.target.value)
                                    setEcommercePlatform("")
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

      <ModelGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelect={(imageUrl) => setModelImage(imageUrl)}
        source="model_faces"
        initialCategory={gender}
        gender={gender as import("../../services/galleryService").GalleryGender}
        showGenderFilter={true}
      />
    </div>
  )
}
