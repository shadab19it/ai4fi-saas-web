import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  Upload,
  ZoomIn,
  X,
  Image as ImageIcon,
  Info,
  Sparkles,
  Grid3x3,
  ChevronDown,
  ArrowLeft,
  Download,
  RotateCcw,
  Scissors,
  Layers,
  Palette,
  Crown,
  Check,
  AlertCircle,
} from "lucide-react"
import Button from "../../components/ui/Button"
import ZoomImageModal from "../../components/ui/ZoomImageModal"
import ModelGalleryModal from "../../components/common/ModelGalleryModal"
import LoadingOverlay from "../../components/CreateAds/LoadingOverlay"
import modelService from "../../services/modelService"
import commonService from "../../services/commonService"
import { usePlanFeatures } from "../../hooks/usePlanFeatures"
import {
  ECOMMERCE_PLATFORM_OPTIONS,
  ECOMMERCE_PLATFORM_PRESETS,
  type EcommercePlatformKey,
} from "../../constants/ecommercePlatforms"
import { MODEL_FACE_RETURN_URL_KEY, FABRIC_STUDIO_PERSIST_KEY, TRIAL_ROOM_HANDOFF_KEY } from "../../constants/modelFace"
import AppHeader from "../../components/Layout/AppHeader"
import { toast } from "sonner"
import { setUserRefresh } from "../../store/userReducer"
import { useDispatch } from "react-redux"

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

interface FabricSlot {
  id: "top_fabric" | "bottom_fabric" | "dupatta_fabric"
  label: string
  sublabel: string
  required: boolean
  icon: React.ReactNode
  image: string | null
}

type DressType = {
  value: string
  label: string
  description: string
  icon: React.ReactNode
}

type FitType = {
  value: string
  label: string
}

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────

const FEMALE_DRESS_TYPES: DressType[] = [
  { value: "salwar_kameez", label: "Salwar Kameez", description: "Classic Indo-Western", icon: <Scissors className="w-4 h-4" /> },
  { value: "anarkali", label: "Anarkali", description: "Flowing elegance", icon: <Layers className="w-4 h-4" /> },
  { value: "lehenga", label: "Lehenga", description: "Bridal & Festive", icon: <Crown className="w-4 h-4" /> },
  { value: "kurti", label: "Kurti", description: "Everyday chic", icon: <Palette className="w-4 h-4" /> },
  { value: "saree_blouse", label: "Saree Blouse", description: "Traditional drape", icon: <Sparkles className="w-4 h-4" /> },
  { value: "sharara", label: "Sharara", description: "Festive flare", icon: <Layers className="w-4 h-4" /> },
  { value: "other", label: "Other", description: "Custom style", icon: <Layers className="w-4 h-4" /> },
]

const MALE_DRESS_TYPES: DressType[] = [
  { value: "kurta_pajama", label: "Kurta Pajama", description: "Classic Ethnic", icon: <Scissors className="w-4 h-4" /> },
  { value: "sherwani", label: "Sherwani", description: "Royal & Festive", icon: <Crown className="w-4 h-4" /> },
  { value: "nehru_jacket", label: "Nehru Jacket", description: "Sophisticated", icon: <Layers className="w-4 h-4" /> },
  { value: "pathani_suit", label: "Pathani Suit", description: "Traditional Bold", icon: <Palette className="w-4 h-4" /> },
  { value: "jodhpuri", label: "Jodhpuri", description: "Premium Formal", icon: <Sparkles className="w-4 h-4" /> },
  { value: "blazer", label: "Blazer", description: "Indo-Western", icon: <Scissors className="w-4 h-4" /> },
  { value: "other", label: "Other", description: "Custom style", icon: <Layers className="w-4 h-4" /> },
]

const FIT_TYPES: FitType[] = [
  { value: "regular", label: "Regular" },
  { value: "slim", label: "Slim Fit" },
  { value: "relaxed", label: "Relaxed" },
  { value: "flared", label: "Flared" },
]

const GENERATING_MESSAGES = [
  "Analyzing your fabric texture and pattern...",
  "Designing the garment silhouette...",
  "Draping fabric onto the virtual model...",
  "Applying stitching details and finishing...",
  "Rendering high-quality output image...",
  "Almost done — polishing the final look...",
]

// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────

export default function UnstitchedStudioPage() {
  const { isResolutionAllowed } = usePlanFeatures()
  const location = useLocation();
  const fromSource = new URLSearchParams(location.search).get("from");
  const navigate = useNavigate()
  const dispatch = useDispatch();
  // Fabric slots
  const [fabrics, setFabrics] = useState<FabricSlot[]>([
    {
      id: "top_fabric",
      label: "Top Fabric",
      sublabel: "Main body fabric — required",
      required: true,
      icon: <Layers className="w-5 h-5" />,
      image: null,
    },
    {
      id: "bottom_fabric",
      label: "Bottom Fabric",
      sublabel: "Pants / Lehenga fabric",
      required: false,
      icon: <Palette className="w-5 h-5" />,
      image: null,
    },
    {
      id: "dupatta_fabric",
      label: "Dupatta / Drape",
      sublabel: "Scarf or drape fabric",
      required: false,
      icon: <Sparkles className="w-5 h-5" />,
      image: null,
    },
  ])

  // File refs for each slot
  const fabricRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // Config
  const [gender, setGender] = useState("female")
  const [dressName, setDressName] = useState("salwar_kameez")
  const [customDressName, setCustomDressName] = useState("")
  const [fitType, setFitType] = useState("regular")
  const [tier, setTier] = useState<"basic" | "professional">("basic")
  const [aspectRatio, setAspectRatio] = useState("")
  const [resolution, setResolution] = useState("")
  const [ecommercePlatform, setEcommercePlatform] = useState<EcommercePlatformKey | "">("")

  const dressTypes = gender === "male" ? MALE_DRESS_TYPES : FEMALE_DRESS_TYPES

  const handleGenderChange = (newGender: string) => {
    setGender(newGender)
    setCustomDressName("")
    if (newGender === "male" || newGender === "boy") {
      setDressName("kurta_pajama")
      handleFabricRemove("dupatta_fabric")
    } else {
      setDressName("salwar_kameez")
    }
  }

  const handlePlatformSelect = (platform: EcommercePlatformKey) => {
    const preset = ECOMMERCE_PLATFORM_PRESETS[platform]
    setEcommercePlatform(platform)
    setAspectRatio(preset.ratio)
    setResolution(preset.resolution)
  }

  // Model face
  const [modelFace, setModelFace] = useState<string | null>(null)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  // Dragging state per slot
  const [draggingSlot, setDraggingSlot] = useState<string | null>(null)

  // Generation
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [regenInfo, setRegenInfo] = useState<{ generationId: string; freeRegensRemaining: number } | null>(null)
  const is4kResolution = (resolution || "").toUpperCase() === "4K"
  const canShowFreeRegen = !!regenInfo && !is4kResolution && regenInfo.freeRegensRemaining > 0
 const [isDesignConfigOpen, setIsDesignConfigOpen] = useState(true)
  // Zoom modal
  const [zoomOpen, setZoomOpen] = useState(false)
  const [zoomImages, setZoomImages] = useState<string[]>([])
  const [zoomIndex, setZoomIndex] = useState(0)

  // File blobs for sending
  const [fabricFiles, setFabricFiles] = useState<Record<string, File | null>>({
    top_fabric: null,
    bottom_fabric: null,
    dupatta_fabric: null,
  })

  // ─── Handlers ───

  const handleFabricUpload = useCallback((slotId: string, file: File) => {
    if (!file) return

    const mime = file.type || ""
    const isImage =
      mime.startsWith("image/") || /\.(jpe?g|png|gif|webp|bmp|tiff|svg)$/i.test(file.name)

    if (!isImage) {
      setError("Unsupported file type. Please upload an image (jpg, png, webp...).")
      // Clear the file input so it doesn't remain selected
      const input = fabricRefs.current[slotId]
      if (input) input.value = ""
      toast.info("Please upload an image file (jpg, png, webp, etc.)")
      setTimeout(() => setError(null), 4000)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setFabrics((prev) =>
        prev.map((f) => (f.id === slotId ? { ...f, image: e.target?.result as string } : f))
      )
    }
    reader.readAsDataURL(file)
    setFabricFiles((prev) => ({ ...prev, [slotId]: file }))
  }, [])

  const handleFabricRemove = useCallback((slotId: string) => {
    setFabrics((prev) => prev.map((f) => (f.id === slotId ? { ...f, image: null } : f)))
    setFabricFiles((prev) => ({ ...prev, [slotId]: null }))
    const input = fabricRefs.current[slotId]
    if (input) input.value = ""
  }, [])

  const handleDragOver = (e: React.DragEvent, slotId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDraggingSlot(slotId)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDraggingSlot(null)
  }

  const handleDrop = (e: React.DragEvent, slotId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDraggingSlot(null)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFabricUpload(slotId, file)
  }

  useEffect(() => {
    // Restore state from localStorage
    const savedData = localStorage.getItem(FABRIC_STUDIO_PERSIST_KEY)
    if (savedData && fromSource) {
      try {
        const data = JSON.parse(savedData)
        setGender(data.gender || "female")
        setDressName(data.dressName || "salwar_kameez")
        setCustomDressName(data.customDressName || "")
        setFitType(data.fitType || "regular")
        setTier(data.tier || "basic")
        setAspectRatio(data.aspectRatio || "")
        setResolution(data.resolution || "")
        setEcommercePlatform(data.ecommercePlatform || "")
        if (data.fabrics && Array.isArray(data.fabrics)) {
            setFabrics((prev) =>
              prev.map((slot) => {
                const savedSlot = data.fabrics.find((s: any) => s.id === slot.id)
                return savedSlot ? { ...slot, image: savedSlot.image } : slot
              })
            )
        }
        if (data.modelFace) setModelFace(data.modelFace)
        if (data.generatedImages) setGeneratedImages(data.generatedImages)
      } catch (err) {
        console.error("Failed to restore Stichify state", err)
      }
    }

    // Check for returned model face
    const returnedModelFaceUrl = localStorage.getItem(MODEL_FACE_RETURN_URL_KEY)
    if (returnedModelFaceUrl) {
      setModelFace(returnedModelFaceUrl)
      localStorage.removeItem(MODEL_FACE_RETURN_URL_KEY)
    }
  }, [])

  useEffect(() => {
    // Save state to localStorage
    const dataToSave = {
      gender,
      dressName,
      customDressName,
      fitType,
      tier,
      aspectRatio,
      resolution,
      ecommercePlatform,
      // Only save the ID and image to avoid circular references from React icons
      fabrics: fabrics.map(f => ({ id: f.id, image: f.image })),
      modelFace,
      generatedImages
    }
    localStorage.setItem(FABRIC_STUDIO_PERSIST_KEY, JSON.stringify(dataToSave))
  }, [
    gender,
    dressName,
    customDressName,
    fitType,
    tier,
    aspectRatio,
    resolution,
    ecommercePlatform,
    fabrics,
    modelFace,
    generatedImages
  ])

  // ─── Generate ───
  const resolvedDressName =
    dressName === "other"
      ? customDressName.trim().toLowerCase().replace(/\s+/g, "_")
      : dressName
  const canGenerate = fabrics[0].image !== null && resolvedDressName !== ""

  const handleGenerate = async (parentId?: string) => {
    if (!canGenerate) return
    if(tier === "professional" && !ecommercePlatform){
      toast.error("Please select an ecommerce platform")
      return
    }
    setIsGenerating(true)
    setError(null)
    setGeneratedImages([])

    try {
      const formData = new FormData()

      // Required top fabric
      if (fabricFiles.top_fabric) {
        formData.append("top_fabric", fabricFiles.top_fabric)
      } else if (fabrics[0].image) {
        const resp = await fetch(fabrics[0].image)
        const blob = await resp.blob()
        formData.append("top_fabric", blob, "top_fabric.jpg")
      }

      // Optional bottom fabric
      if (fabricFiles.bottom_fabric) {
        formData.append("bottom_fabric", fabricFiles.bottom_fabric)
      } else if (fabrics[1].image) {
        const resp = await fetch(fabrics[1].image)
        const blob = await resp.blob()
        formData.append("bottom_fabric", blob, "bottom_fabric.jpg")
      }

      // Optional dupatta fabric
      if (fabricFiles.dupatta_fabric) {
        formData.append("dupatta_fabric", fabricFiles.dupatta_fabric)
      } else if (fabrics[2].image) {
        const resp = await fetch(fabrics[2].image)
        const blob = await resp.blob()
        formData.append("dupatta_fabric", blob, "dupatta_fabric.jpg")
      }

      // Optional model face (always convert URL to binary for API)
      if (modelFace && modelFace.startsWith("http")) {
        try {
          const blob = await commonService.downloadSingleFile(modelFace)
          formData.append("model_face", blob, "model_face.jpg")
        } catch {
          // Skip if cannot fetch
        }
      } else if (modelFace && modelFace.startsWith("data:")) {
        const resp = await fetch(modelFace)
        const blob = await resp.blob()
        formData.append("model_face", blob, "model_face.jpg")
      }

      formData.append("gender", gender)
      formData.append("dress_name", resolvedDressName)
      formData.append("fit_type", fitType)
      formData.append("tier", tier)
      if (aspectRatio) formData.append("aspect_ratio", aspectRatio)
      if (resolution) formData.append("resolution", resolution)
      if (parentId && typeof parentId === "string") formData.append("parentGenerationId", parentId)

      if(tier === "basic"){
        formData.append("aspect_ratio", "1:1")
        formData.append("resolution", "1K")
      }

      const result = await modelService.generateUnstitchedTryon(formData)
      if (result.urls && result.urls.length > 0) {
        setGeneratedImages(result.urls)
        setIsDesignConfigOpen(true)
        localStorage.removeItem(FABRIC_STUDIO_PERSIST_KEY) // Clear any old handoff data
      } else {
        setError("No images were generated. Please try again.")
      }
      if (result.regeneration) {
        setRegenInfo({
          generationId: result.regeneration.generationId,
          freeRegensRemaining: result.regeneration.freeRegensRemaining,
        })
      }
      dispatch(setUserRefresh());
    } catch (err: any) {
      setError(err.message || "Failed to generate. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGeneratePoses = (imageUrl: string) => {
    const handoff = {
      dressImage: imageUrl,
      selectedModel: modelFace || imageUrl,
      gender,
      tier,
      ...(aspectRatio && { aspectRatio }),
      ...(resolution && { resolution }),
    }
    localStorage.setItem(TRIAL_ROOM_HANDOFF_KEY, JSON.stringify(handoff))
    navigate("/trial-room?from=tool&context=unstitched-studio&gender=" + gender)
  }

  const handleReset = () => {
    setFabrics((prev) => prev.map((f) => ({ ...f, image: null })))
    setFabricFiles({ top_fabric: null, bottom_fabric: null, dupatta_fabric: null })
    setModelFace(null)
    setGeneratedImages([])
    setError(null)
  }

  const handleDownload = async (url: string) => {
    try {
      const blob = await commonService.downloadSingleFile(url)
      const downloadUrl = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = downloadUrl
      a.download = `unstitched-tryon-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(downloadUrl)
    } catch {
      setError("Failed to download image")
    }
  }

  // Filter fabric slots based on gender (no dupatta for male)
  const visibleFabrics = gender === "male"
    ? fabrics.filter((f) => f.id !== "dupatta_fabric")
    : fabrics

  const hasResults = generatedImages.length > 0
 

  return (
    <div className="min-h-screen bg-[#F4F3EF]">
      {/* ─── Header ─── */}
      <AppHeader title="Stichify" description="Unstitched → Stitched Try-On" />
      {/* ─── Main Content ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Banner */}
        <div className="relative mb-6 rounded-2xl overflow-hidden bg-gradient-to-r from-[#1e40af] via-[#2563EB] to-[#3b82f6] p-6 sm:p-8">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-60" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-1">
                Transform Raw Fabric into Fashion
              </h2>
            </div>
            {hasResults && (
              <Button
                variant="outline"
                size="md"
                onClick={handleReset}
                icon={<RotateCcw className="w-3.5 h-3.5" />}
                className="bg-white/15 backdrop-blur-sm border-white/20 text-white hover:bg-white/25 hover:text-white"
              >
                New Generation
              </Button>
            )}
          </div>
        </div>

        {/* ─── Two-Column Layout ─── */}
        <div className="flex flex-col xl:flex-row gap-6 items-start">
          {/* ─── LEFT: Main Area ─── */}
          <div className="flex-1 w-full space-y-5">
            {/* Fabric Upload Zone */}
            {!hasResults ? (
              <>
                <div className={`grid grid-cols-1 gap-4 ${visibleFabrics.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
                  {visibleFabrics.map((slot) => (
                    <div key={slot.id} className="group">
                      <div
                        onDragOver={(e) => handleDragOver(e, slot.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, slot.id)}
                        className={`relative rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                          slot.image
                            ? "border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)]"
                            : draggingSlot === slot.id
                            ? "border-[#2563EB] bg-blue-50/50 shadow-lg shadow-blue-500/10 scale-[1.01]"
                            : "border-dashed border-[#D0CBBF] bg-white hover:border-[#2563EB] hover:bg-[#f0f5ff] shadow-[0_1px_3px_rgba(28,25,23,0.04)]"
                        }`}
                      >
                        {slot.image ? (
                          /* ── Uploaded Preview ── */
                          <div className="relative">
                            <div className="aspect-[4/5] relative overflow-hidden">
                              <img
                                src={slot.image}
                                alt={slot.label}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                                onClick={() => {
                                  setZoomImages([slot.image!])
                                  setZoomIndex(0)
                                  setZoomOpen(true)
                                }}
                              />
                              {/* Hover overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-2">
                                <button
                                  onClick={() => fabricRefs.current[slot.id]?.click()}
                                  className="bg-white/90 backdrop-blur-sm text-stone-900 px-3 py-1.5 rounded-lg text-[12px] font-semibold hover:bg-white transition-colors flex items-center gap-1.5"
                                >
                                  <Upload className="w-3.5 h-3.5" /> Replace
                                </button>
                                <button
                                  onClick={() => {
                                    setZoomImages([slot.image!])
                                    setZoomIndex(0)
                                    setZoomOpen(true)
                                  }}
                                  className="bg-white/90 backdrop-blur-sm text-stone-900 px-3 py-1.5 rounded-lg text-[12px] font-semibold hover:bg-white transition-colors flex items-center gap-1.5"
                                >
                                  <ZoomIn className="w-3.5 h-3.5" /> Zoom
                                </button>
                              </div>
                            </div>
                            {/* Remove button */}
                            <button
                              onClick={() => handleFabricRemove(slot.id)}
                              className="absolute top-2.5 right-2.5 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors shadow-md z-10"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            {/* Label badge */}
                            <div className="absolute top-2.5 left-2.5 z-10">
                              <div className="inline-flex items-center gap-1 bg-[#2563EB] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                {slot.icon}
                                {slot.label}
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* ── Empty Upload Area ── */
                          <div
                            onClick={() => fabricRefs.current[slot.id]?.click()}
                            className="aspect-[4/5] flex flex-col items-center justify-center gap-3 cursor-pointer p-4"
                          >
                            <div className={`w-14 h-14 rounded-2xl bg-[#2563EB] flex items-center justify-center text-white shadow-lg transition-transform duration-300 ${draggingSlot === slot.id ? "scale-110 animate-bounce" : "group-hover:scale-105"}`}>
                              {draggingSlot === slot.id ? (
                                <Upload className="w-7 h-7 animate-bounce" />
                              ) : (
                                <ImageIcon className="w-7 h-7" />
                              )}
                            </div>
                            <div className="text-center">
                              <p className="text-[13px] font-bold text-stone-900 mb-0.5">{slot.label}</p>
                              <p className="text-[11px] text-[#9E9893]">{slot.sublabel}</p>
                              {slot.required && (
                                <span className="inline-block mt-1 text-[9px] font-bold text-[#2563EB] bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-200">
                                  REQUIRED
                                </span>
                              )}
                              {!slot.required && (
                                <span className="inline-block mt-1 text-[9px] font-medium text-[#9E9893]">
                                  Optional
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-[#B5B0AB]">
                              {draggingSlot === slot.id ? "Drop to upload" : "Click or drag & drop"}
                            </p>
                          </div>
                        )}
                      </div>
                      <input
                        ref={(el) => { fabricRefs.current[slot.id] = el }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFabricUpload(slot.id, file)
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Pro Tips */}
                <div className="bg-blue-50/60 border border-blue-200/60 rounded-xl p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Info className="w-4 h-4 text-[#2563EB]" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-800 text-[13px] mb-1">Tips for best results</p>
                    <ul className="text-[12px] text-blue-700/80 space-y-0.5">
                      <li>• Use high-resolution fabric photos with even lighting</li>
                      <li>• Lay fabric flat for the most accurate texture capture</li>
                      <li>• Include pattern details — the AI will replicate them on the garment</li>
                    </ul>
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={() => handleGenerate()}
                  disabled={!canGenerate || isGenerating}
                  loading={isGenerating}
                  className="w-full !h-12 text-[15px] !rounded-xl"
                >
                  {isGenerating ? "Generating your design..." : "Generate Stitched Design"}
                </Button>
              </>
            ) : (
              /* ─── Results View ─── */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-bold text-stone-900 flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-500" />
                    Generated Result
                  </h3>
                  <div className="flex items-center gap-2">
                    {regenInfo && (
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => handleGenerate(regenInfo.generationId)}
                        disabled={isGenerating}
                        icon={<RotateCcw className="w-3.5 h-3.5" />}
                        className={canShowFreeRegen ? "!border-green-300 !text-green-700 hover:!bg-green-50" : ""}
                      >
                        {canShowFreeRegen
                          ? `Regenerate Free (${regenInfo.freeRegensRemaining} left)`
                          : "Regenerate (1 credit)"}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="md"
                      onClick={handleReset}
                      icon={<RotateCcw className="w-3.5 h-3.5" />}
                    >
                      Start New
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {generatedImages.map((url, i) => (
                    <div
                      key={i}
                      className="relative rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_2px_8px_rgba(28,25,23,0.08)] overflow-hidden group flex flex-col"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <img
                          src={url}
                          alt={`Generated design ${i + 1}`}
                          className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                          onClick={() => {
                            setZoomImages(generatedImages)
                            setZoomIndex(i)
                            setZoomOpen(true)
                          }}
                        />
                        {/* Actions overlay — scoped inside image container */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => {
                              setZoomImages(generatedImages)
                              setZoomIndex(i)
                              setZoomOpen(true)
                            }}
                            className="bg-white/90 backdrop-blur-sm text-stone-900 p-2 rounded-lg hover:bg-white transition-colors"
                          >
                            <ZoomIn className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(url)}
                            className="bg-white/90 backdrop-blur-sm text-stone-900 p-2 rounded-lg hover:bg-white transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="p-2 border-t border-[#E5E2DA]">
                        <Button
                          variant="gradient"
                          size="md"
                          onClick={() => handleGeneratePoses(url)}
                          icon={<Sparkles className="w-3.5 h-3.5" />}
                          className="w-full"
                        >
                          Generate Poses
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Uploaded fabrics thumbnails */}
                <div className="rounded-xl border border-[#E5E2DA] bg-white p-4">
                  <p className="text-[11.5px] font-semibold text-[#6B6560] uppercase tracking-wider mb-3">
                    Source Fabrics
                  </p>
                  <div className="flex gap-3">
                    {fabrics
                      .filter((f) => f.image)
                      .map((f) => (
                        <div key={f.id} className="relative">
                          <img
                            src={f.image!}
                            alt={f.label}
                            className="w-16 h-16 rounded-lg object-cover border border-[#E5E2DA]"
                          />
                          <span className="absolute -top-1.5 -left-1.5 text-[8px] font-bold bg-[#2563EB] text-white px-1.5 py-0.5 rounded-full">
                            {f.label.split(" ")[0]}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-semibold text-red-700">Generation Failed</p>
                  <p className="text-[12px] text-red-600/80 mt-0.5">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* ─── RIGHT: Configuration Sidebar ─── */}
          <div className="w-full xl:w-[380px] xl:flex-none space-y-4">
            {/* ── Dress Configuration Card ── */}
            <div className="rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] overflow-hidden">
              <button
                type="button"
                onClick={() => setIsDesignConfigOpen((v) => !v)}
                className="w-full flex items-center gap-2 p-5 hover:bg-[#F9F8F5] transition-colors text-left"
                aria-expanded={isDesignConfigOpen}
              >
                <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center flex-shrink-0">
                  <Scissors className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-bold text-stone-900">Design Configuration</h3>
                  <p className="text-[11px] text-[#9E9893]">Customize your garment style</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#9E9893] transition-transform duration-200 flex-shrink-0 ${isDesignConfigOpen ? "rotate-180" : ""}`} />
              </button>

              {isDesignConfigOpen && (
              <div className="px-5 pb-5 space-y-5 border-t border-[#E5E2DA]">
              <div className="pt-0" />
              {/* Gender */}
              <div>
                <label className="flex items-center gap-2 text-[11.5px] font-semibold text-[#6B6560] uppercase tracking-wider mb-2.5">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["female", "male"].map((g) => (
                    <button
                      key={g}
                      onClick={() => handleGenderChange(g)}
                      className={`px-3 py-2.5 rounded-xl border-2 text-[13px] font-semibold transition-all ${
                        gender === g
                          ? "bg-[#2563EB] border-[#2563EB] text-white shadow-sm"
                          : "bg-white border-[#E5E2DA] text-[#6B6560] hover:border-[#9E9893] hover:bg-[#F9F8F5]"
                      }`}
                    >
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dress Type */}
              <div>
                <label className="flex items-center gap-2 text-[11.5px] font-semibold text-[#6B6560] uppercase tracking-wider mb-2.5">
                  Dress Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {dressTypes.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => {
                        setDressName(d.value)
                        if (d.value !== "other") setCustomDressName("")
                      }}
                      className={`px-2 py-2.5 rounded-xl border-2 text-left transition-all ${
                        dressName === d.value
                          ? "bg-[#2563EB] border-[#2563EB] text-white shadow-sm"
                          : "bg-white border-[#E5E2DA] text-[#6B6560] hover:border-[#9E9893] hover:bg-[#F9F8F5]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {/* <span className={dressName === d.value ? "text-white" : "text-[#9E9893]"}>{d.icon}</span> */}
                        <div>
                          <div className="text-[12px] font-bold">{d.label}</div>
                          <div className={`text-[10px] mt-0.5 ${dressName === d.value ? "text-white/75" : "text-[#9E9893]"}`}>
                            {d.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {dressName === "other" && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      value={customDressName}
                      onChange={(e) => setCustomDressName(e.target.value)}
                      placeholder="Enter custom dress style (e.g. Indo-western co-ord set)"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5E2DA] text-stone-900 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                    />
                  </div>
                )}
              </div>

              {/* Fit Type */}
              <div>
                <label className="flex items-center gap-2 text-[11.5px] font-semibold text-[#6B6560] uppercase tracking-wider mb-2.5">
                  Fit Type
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {FIT_TYPES.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFitType(f.value)}
                      className={`px-2 py-2 rounded-lg text-[11px] font-semibold transition-all ${
                        fitType === f.value
                          ? "bg-[#2563EB] text-white border border-[#2563EB] shadow-sm"
                          : "bg-white border border-[#E5E2DA] text-[#6B6560] hover:border-[#9E9893] hover:bg-[#F9F8F5]"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              </div>
              )}
            </div>
                    {/* ── Professional Options ── */}
            <div className="rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] overflow-hidden">
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <label className="text-[11.5px] font-semibold text-[#6B6560] uppercase tracking-wider">
                    Quality Tier
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTier("basic")}
                    className={`px-4 py-3 rounded-xl border-2 transition-all text-left ${
                      tier === "basic"
                        ? "bg-[#2563EB] border-[#2563EB] text-white shadow-sm"
                        : "bg-white border-[#E5E2DA] text-[#6B6560] hover:border-[#9E9893] hover:bg-[#F9F8F5]"
                    }`}
                  >
                    <div className="text-[13px] font-bold">Basic</div>
                    <div className="text-[11px] opacity-75 mt-0.5">Standard</div>
                  </button>
                  <button
                    onClick={() => setTier("professional")}
                    className={`px-4 py-3 rounded-xl border-2 transition-all text-left ${
                      tier === "professional"
                        ? "bg-[#2563EB] border-[#2563EB] text-white shadow-sm"
                        : "bg-white border-[#E5E2DA] text-[#6B6560] hover:border-[#9E9893] hover:bg-[#F9F8F5]"
                    }`}
                  >
                    <div className="text-[13px] font-bold">Professional</div>
                    <div className="text-[11px] opacity-75 mt-0.5">High Quality</div>
                  </button>
                </div>


                        {/* ── Model Face Card ── */}
            <div className="rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] p-5 space-y-4">
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-[11.5px] font-semibold text-[#6B6560] uppercase tracking-wider">
                  Model Face
                  <span className="text-[#9E9893] text-[10px] font-normal normal-case">(Optional)</span>
                </label>
              </div>

              {modelFace ? (
                <div className="relative rounded-xl overflow-hidden border border-[#E5E2DA]">
                  <img src={modelFace} alt="Model face" className="w-full h-32 object-contain" />
                  <button
                    onClick={() => {
                      setModelFace(null)
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
                    className="border-2 border-dashed border-[#E5E2DA] rounded-xl p-4 hover:border-[#2563EB] hover:bg-blue-50/40 transition-all flex flex-col items-center justify-center gap-2 group"
                  >
                    <Grid3x3 className="w-5 h-5 text-[#9E9893] group-hover:text-[#2563EB] transition-colors" />
                    <span className="text-[12px] font-medium text-[#9E9893] group-hover:text-[#2563EB] transition-colors">
                      From Gallery
                    </span>
                  </button>
                  <Link
                    to={`/model?mode=face&source=fabric-studio&gender=${gender}`}
                    className="border-2 border-dashed border-[#E5E2DA] rounded-xl p-4 hover:border-[#2563EB] hover:bg-blue-50/40 transition-all flex flex-col items-center justify-center gap-2 group"
                  >
                    <Sparkles className="w-5 h-5 text-[#9E9893] group-hover:text-[#2563EB] transition-colors" />
                    <span className="text-[12px] font-medium text-[#9E9893] group-hover:text-[#2563EB] transition-colors">
                      Generate Face
                    </span>
                  </Link>
                </div>
              )}
            </div>

                {tier === "professional" && (
                  <div className="space-y-3 pt-2 border-t border-[#E5E2DA]">


                    {/* Ecommerce Platform Presets */}
                    <div>
                      <label className="block text-[11.5px] font-semibold text-[#6B6560] mb-2">Ecommerce Platform</label>
                      <p className="text-[10.5px] text-[#9E9893] mb-3">
                        Auto-sets marketplace-friendly aspect ratio and resolution
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {ECOMMERCE_PLATFORM_OPTIONS.map(({ value, label }) => {
                          const preset = ECOMMERCE_PLATFORM_PRESETS[value]
                          return (
                            <button
                              key={value}
                              onClick={() => handlePlatformSelect(value)}
                              className={`px-3 py-2.5 rounded-xl text-left transition-all ${
                                ecommercePlatform === value
                                  ? "bg-[#2563EB] border-[#2563EB] text-white shadow-sm"
                                  : "bg-white border border-[#E5E2DA] text-[#6B6560] hover:border-[#9E9893] hover:bg-[#F9F8F5]"
                              }`}
                            >
                              <div className="text-[12px] font-bold">{label}</div>
                              <div className={`text-[10px] mt-0.5 ${ecommercePlatform === value ? "text-white/75" : "text-[#9E9893]"}`}>
                                {preset.description}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>



                    {/* Aspect Ratio */}
                    <div>
                      <label className="block text-[11.5px] font-semibold text-[#6B6560] mb-2">Aspect Ratio</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {["", "1:1", "3:4", "4:3", "2:3", "3:2", "4:5", "9:16"].map((r) => (
                          <button
                            key={r}
                            onClick={() => {
                              setAspectRatio(r)
                              setEcommercePlatform("")
                            }}
                            className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                              aspectRatio === r
                                ? "bg-[#2563EB] text-white border border-[#2563EB]"
                                : "bg-white border border-[#E5E2DA] text-[#6B6560] hover:border-[#9E9893]"
                            }`}
                          >
                            {r || "Auto"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Resolution */}
                    <div>
                      <label className="block text-[11.5px] font-semibold text-[#6B6560] mb-2">Resolution</label>
                      <div className="relative">
                        <select
                          value={resolution}
                          onChange={(e) => {
                            setResolution(e.target.value)
                            setEcommercePlatform("")
                          }}
                          className="w-full px-3 py-2.5 pr-10 rounded-xl bg-[#F9F8F5] border border-[#E5E2DA] text-stone-900 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Default</option>
                          <option value="1K">1K</option>
                          <option value="2K" disabled={!isResolutionAllowed("2K")}>2K{!isResolutionAllowed("2K") ? " (Upgrade)" : ""}</option>
                          <option value="4K" disabled={!isResolutionAllowed("4K")}>4K{!isResolutionAllowed("4K") ? " (Upgrade)" : ""}</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9E9893] pointer-events-none" />
                      </div>
                    </div>

        
                  </div>
                )}
              </div>
            </div>

      

    
          </div>
        </div>
      </div>

      <ModelGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelect={(imageUrl) => setModelFace(imageUrl)}
        source="model_faces"
        initialCategory={gender}
        gender={gender as import("../../services/galleryService").GalleryGender}
        showGenderFilter={true}
      />

      {/* ─── Zoom Modal ─── */}
      <ZoomImageModal
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        images={zoomImages}
        initialIndex={zoomIndex}
        alt="Fabric preview"
      />

      <LoadingOverlay isVisible={isGenerating} messages={GENERATING_MESSAGES} />
    </div>
  )
}
