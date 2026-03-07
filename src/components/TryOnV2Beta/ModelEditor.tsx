"use client"
import { useState, useRef, useMemo } from "react"
import { Plus, X, Download, Upload, ZoomIn, Sparkles, Info, Lock, RefreshCw } from "lucide-react"
import axios from "axios"
import appConstant from "../../services/appConstant"
import { usePlanFeatures } from "../../hooks/usePlanFeatures"
import { dataURLtoFile } from "../../services/utils"
import commonService from "../../services/commonService"
import MultiSelect from "../common/MultiSelect"
import GroupedSelect from "../common/GroupedSelect"
import { IOption } from "../ModelGenerator/ModelConfigForm/ModelConfigForm"
import { toast } from "sonner"
import { downloadBlob, resizeImage } from "./resizeImage"
import JSZip from "jszip"
import {
  getGroupedFootwearOptions,
  getGroupedBackgroundOptions,
  getGroupedAccessoryOptions,
  getGroupedJewelryOptions
} from "./optionInputs"
import malePosesData from "../../data/poses/male_poses.json"
import femalePosesData from "../../data/poses/female_poses.json"
import CollapsibleSidebar from "./layout/CollapsibleSidebar"
import Button from "../ui/Button"
import ZoomImageModal from "../ui/ZoomImageModal"
import LoadingOverlay from "../CreateAds/LoadingOverlay"
import { useLocation, useSearchParams } from "react-router-dom"
import { RootState } from "../../store/store"
import { useSelector } from "react-redux"
import { setUserRefresh } from "../../store/userReducer"

interface ModelEditorProps {
  selectedModel: string
  dressImage: string
  onBack: () => void
  onComplete: () => void
  gender: string
  tier?: "basic" | "professional"
  aspectRatio?: string
  resolution?: string
  width?: number
  height?: number
  segment?: string
  garmentCategory?: string
  isCustomDimensions?: boolean
}

type PoseItem = { id: number; description: string }
type PosesData = { gender: string; poses: Record<string, PoseItem[]> }

const getAllPredefinedDescriptions = (gender: string): Set<string> => {
  const data = (gender === "female" ? femalePosesData : malePosesData) as PosesData
  const set = new Set<string>()
  Object.values(data.poses).forEach((group) => group.forEach((p) => set.add(p.description)))
  return set
}

export default function ModelEditor({ 
  selectedModel, 
  dressImage: _dressImage, 
  onBack, 
  onComplete: _onComplete, 
  gender:propGender,
  tier: propTier = "basic",
  aspectRatio: propAspectRatio,
  resolution: propResolution,
  width: propWidth,
  height: propHeight,
  segment: propSegment,
  garmentCategory: propGarmentCategory,
  isCustomDimensions
}: ModelEditorProps) {
  const user = useSelector((state: RootState) => state.user)
  const { poseLimit, isFeatureAllowed } = usePlanFeatures()
  const bgAllowed = user.user?.role === "admin" ? true : isFeatureAllowed("backgroundLibrary")
  const accAllowed = user.user?.role === "admin" ? true : isFeatureAllowed("accessoriesSupport")
  const jewAllowed = user.user?.role === "admin" ? true : isFeatureAllowed("jewellerySupport")
  const [searchParams] = useSearchParams();
  const isFromTool = searchParams.get("from")
  const genderFromUrl = searchParams.get("gender")
  const gender = genderFromUrl || propGender
  const [poses, setPoses] = useState<string[]>([])
  const [customPoseItems, setCustomPoseItems] = useState<string[]>([])
  const [footwear, setFootwear] = useState<string>("")
  const [background, setBackground] = useState<string>("")
  const [accessory, setAccessory] = useState<string>("")
  const [jewelry, setJewelry] = useState<string>("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [newPose, setNewPose] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [regenInfo, setRegenInfo] = useState<{ generationId: string; freeRegensRemaining: number } | null>(null)
  const is4kResolution = (propResolution || "").toUpperCase() === "4K"
  const canShowFreeRegen = !!regenInfo && !is4kResolution && regenInfo.freeRegensRemaining > 0
  const [isDownloading, setIsDownloading] = useState<{ index: number | undefined, isDownloading: boolean }>({ index: undefined, isDownloading: false })

  const [replacedModel, setReplacedModel] = useState<string | null>(null)
  const [isHoveringModel, setIsHoveringModel] = useState(false)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentModel = replacedModel || selectedModel


  const handleAddPose = () => {
    if (poses.length >= poseLimit) {
      toast.info(`Maximum ${poseLimit} poses reached on your plan`)
      return
    }
    if (!newPose.trim()) return
    const normalized = newPose.trim()
    if (poses.includes(normalized)) {
      toast.info("Pose already exists")
      return
    }
    setPoses([...poses, normalized])
    setCustomPoseItems((prev) => [...prev, normalized])
    setNewPose("")
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.info("Please select an image file")
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setReplacedModel(result)
      }
      reader.onerror = () => {
        toast.error("Failed to read image file")
      }
      reader.readAsDataURL(file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveReplacement = () => {
    setReplacedModel(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleGeneratePoses = async (parentId?: string) => {
    if (!currentModel) {
      toast.info("No model selected")
      return
    }

    setIsGenerating(true)
    try {
      let modelFile: File | Blob

      if (currentModel.startsWith("data:")) {
        modelFile = dataURLtoFile(currentModel, `model-${Date.now()}.jpg`)
      } else if (currentModel.startsWith("http://") || currentModel.startsWith("https://")) {
        const blob = await commonService.downloadSingleFile(currentModel)
        const filename = currentModel.split('/').pop()?.split('?')[0] || `model-${Date.now()}.jpg`
        modelFile = new File([blob], filename, { type: blob.type || "image/jpeg" })
      } else {
        modelFile = dataURLtoFile(currentModel, `model-${Date.now()}.jpg`)
      }

      const formData = new FormData()
      formData.append("file", modelFile)

      if (poses.length > 0) {
        formData.append("poses", poses.join(","))
      }
      if (footwear) formData.append("footwear", footwear)
      if (background) formData.append("background", background)
      if (accessory) formData.append("accessory", accessory)
      if (jewelry) formData.append("jewelry", jewelry)

      formData.append("tier", propTier)

      if (propTier === "professional") {
        if (propAspectRatio) formData.append("aspect_ratio", propAspectRatio)
        if (propResolution) formData.append("resolution", propResolution.toUpperCase())
        if (propWidth) formData.append("width", propWidth.toString())
        if (propHeight) formData.append("height", propHeight.toString())
        if (propSegment) formData.append("segment", propSegment)
        if (propGarmentCategory) formData.append("garment_category", propGarmentCategory)
      }

      if (parentId && typeof parentId === "string") {
        formData.append("parentGenerationId", parentId)
      }

      const token = localStorage.getItem(appConstant.JWT_AUTH_TOKEN)

      const response = await axios.post(
        `${appConstant.BACKEND_API_URL}/generate/generate-pose-variants-beta`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token && { Authorization: token }),
          },
        }
      )

      if (response.data && response.data.urls && response.data.urls.length > 0) {
        setGeneratedImages(response.data.urls)
      }
      if (response.data?.regeneration) {
        const r = response.data.regeneration
        setRegenInfo({ generationId: r.generationId, freeRegensRemaining: r.freeRegensRemaining })
      }
      setUserRefresh()
      if (!response.data?.urls?.length) {
        throw new Error("No image URLs returned from API")
      }
    } catch (error: any) {
      console.error("Error generating poses:", error)
      toast.error(error?.response?.data?.message || error?.message || "Failed to generate poses. Please try again.")
      setGeneratedImages([])
    } finally {
      setIsGenerating(false)
    }
  }


  const handleDownload = async (imageIndex: number) => {
    if (generatedImages.length === 0) {
      toast.info("No images to download")
      return
    }
    setIsDownloading({ index: imageIndex, isDownloading: true })
    try {
      const image = generatedImages[imageIndex]
      let blob = await commonService.downloadSingleFile(image)
      // Resize only when the user explicitly chose "Custom" dimensions in Step 1
      // Pass the already-downloaded blob — avoids a second S3 request that would be blocked by CORS
      if (isCustomDimensions && propWidth && propHeight) {
        blob = await resizeImage(blob, {
          width: propWidth,
          height: propHeight,
          fit: "contain",
          mimeType: "image/png",
        })
      }
      downloadBlob(blob, `ai4fi-pose-${imageIndex + 1}-${Date.now()}.png`)
    } catch (error: any) {
      console.error("Error downloading pose:", error)
      toast.error(error?.response?.data?.message || error?.message || "Failed to download. Please try again.")
    } finally {
      setIsDownloading({ index: undefined, isDownloading: false })
    }
  }

  const handleDownloadAll = async () => {
    if (generatedImages.length === 0) {
      toast.info("No images to download")
      return
    }
    setIsDownloading({ index: undefined, isDownloading: true })
    try {
      const zip = new JSZip()
      const allUrls = [
        ...(currentModel ? [{ url: currentModel, name: "ai4fi-source-model.png" }] : []),
        ...generatedImages.map((url, i) => ({ url, name: `ai4fi-pose-${i + 1}.png` })),
      ]
      const blobs = await Promise.all(
        allUrls.map(async ({ url }) => {
          const blob = await commonService.downloadSingleFile(url)
          // Resize only when the user explicitly chose "Custom" dimensions in Step 1
          // Pass the already-downloaded blob — avoids a second S3 request that would be blocked by CORS
          if (isCustomDimensions && propWidth && propHeight) {
            return await resizeImage(blob, {
              width: propWidth,
              height: propHeight,
              fit: "contain",
              mimeType: "image/png",
            })
          }
          return blob
        })
      )
      blobs.forEach((blob, index) => {
        zip.file(allUrls[index].name, blob)
      })
      const zipBlob = await zip.generateAsync({ type: "blob" })
      downloadBlob(zipBlob, `ai4fi-poses-${Date.now()}.zip`)
    } catch (error: any) {
      console.error("Error downloading all poses:", error)
      toast.error(error?.response?.data?.message || error?.message || "Failed to download. Please try again.")
    } finally {
      setIsDownloading({ index: undefined, isDownloading: false })
    }
  }

  const footwearOptionsList = useMemo(() => getGroupedFootwearOptions(gender), [gender])
  const backgroundOptionsList = useMemo(() => getGroupedBackgroundOptions(), [])
  const accessoryOptionsList = useMemo(() => getGroupedAccessoryOptions(gender), [gender])
  const jewelryOptionsList = useMemo(() => getGroupedJewelryOptions(gender), [gender])
  const predefinedDescriptions = useMemo(() => getAllPredefinedDescriptions(gender), [gender])
  const flatPosesOptions = useMemo((): IOption[] => {
    const data = (gender === "female" ? femalePosesData : malePosesData) as PosesData
    const result: IOption[] = []
    Object.entries(data.poses).forEach(([category, items]) => {
      result.push({ value: "divider", label: category.replace(/_/g, " ").toUpperCase() })
      items.forEach((p) => result.push({ value: p.description, label: p.description }))
    })
    if (customPoseItems.length > 0) {
      result.push({ value: "divider", label: "CUSTOM" })
      customPoseItems.forEach((desc) => result.push({ value: desc, label: desc }))
    }
    return result
  }, [gender, customPoseItems])

  const selectedPredefinedPoses = useMemo(
    () => poses.filter((p) => predefinedDescriptions.has(p)),
    [poses, predefinedDescriptions]
  )

  const labelClass = "flex items-center gap-2 text-[11.5px] font-semibold text-[#6B6560] mb-2"

  const GENERATING_MESSAGES = [
    "Analyzing pose configurations and garment details...",
    "Applying AI model to generate unique poses...",
    "Rendering lighting and shadow effects...",
    "Fine-tuning garment fit and drape on the model...",
    "Almost there — polishing the final outputs...",
  ]

  return (
    <>
      <LoadingOverlay isVisible={isGenerating} messages={GENERATING_MESSAGES} />
    <div className="min-h-[calc(100vh-180px)] px-4 pb-8 pt-6">
      <div className="w-full">
        {/* Main Content - Two Column Layout */}
        <div className="flex flex-col xl:flex-row gap-6 items-start">
          {/* Left - Selected Model Image */}
          <div className="flex flex-col w-full flex-1 order-2 xl:order-2">
            <div className="rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] p-5 lg:p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                    <Sparkles className="w-4.5 h-4.5 text-violet-500" />
                  </div>
                  <h3 className="text-[14px] font-bold text-stone-900">Selected Model with Dress</h3>
                </div>
                {replacedModel && (
                  <button
                    onClick={handleRemoveReplacement}
                    className="text-[11px] text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-50 font-semibold"
                  >
                    <X className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>
              <div className="flex-1 flex items-start justify-center">
                <div
                  className="relative rounded-xl overflow-hidden border border-[#E5E2DA] bg-[#F9F8F5] group cursor-pointer w-full flex items-center justify-center min-h-[400px]"
                  onMouseEnter={() => setIsHoveringModel(true)}
                  onMouseLeave={() => setIsHoveringModel(false)}
                >
                  <img
                    src={currentModel || "/placeholder.svg"}
                    alt="Selected model"
                    className="w-full h-full object-contain max-h-[500px] transition-opacity duration-300"
                    style={{ opacity: isHoveringModel ? 0.7 : 1 }}
                    onClick={() => {
                      if (currentModel) {
                        setZoomedImage(currentModel)
                        setIsZoomOpen(true)
                      }
                    }}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  {isHoveringModel && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-6 gap-3 transition-opacity duration-300">
                      <Button
                        variant="outline"
                        size="md"
                        icon={<Upload className="w-3.5 h-3.5" />}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUploadClick()
                        }}
                        className="bg-white/90 backdrop-blur-sm hover:bg-white"
                      >
                        {replacedModel ? "Replace" : "Upload"}
                      </Button>
                      <Button
                        variant="outline"
                        size="md"
                        icon={<ZoomIn className="w-3.5 h-3.5" />}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (currentModel) {
                            setZoomedImage(currentModel)
                            setIsZoomOpen(true)
                          }
                        }}
                        className="bg-white/90 backdrop-blur-sm hover:bg-white"
                      >
                        Zoom
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right - Configuration Cards */}
          <CollapsibleSidebar
            collapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
            expandedWidthClass="xl:w-[420px]"
          >
          <div className="flex flex-col gap-4">
            {/* Poses Configuration Card */}
            <div className="rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-violet-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[14px] font-bold text-stone-900">Poses Configuration</h3>
                  <p className="text-[11.5px] text-[#9E9893] mt-0.5 font-medium">Select up to {poseLimit} poses ({poses.length}/{poseLimit} selected)</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Predefined Poses Select */}
                <div className="relative">
                  <label className={labelClass}>
                    Select Predefined Poses
                  </label>
                  <MultiSelect
                    options={flatPosesOptions}
                    noOfposes={poseLimit - poses.filter((p) => !predefinedDescriptions.has(p)).length}
                    onChange={(selectedOptions: IOption[]) => {
                      const selectedPredefined = selectedOptions.map((o) => o.value)
                      const customPoses = poses.filter((p) => !predefinedDescriptions.has(p))
                      setPoses([...customPoses, ...selectedPredefined].slice(0, poseLimit))
                    }}
                    selectedPoses={selectedPredefinedPoses}
                  />
                </div>

                {/* Custom Pose Input */}
                <div>
                  <label className={labelClass}>Or Add Custom Pose</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPose}
                      onChange={(e) => setNewPose(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddPose()}
                      placeholder="Enter custom pose (e.g., stretching, leaning)"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E5E2DA] bg-white text-stone-900 text-[13px] placeholder-[#9E9893] focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                    />
                    <Button
                      variant="gradient"
                      size="md"
                      onClick={handleAddPose}
                      disabled={!newPose.trim() || poses.length >= poseLimit}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {customPoseItems.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {customPoseItems.map((pose) => (
                        <span
                          key={pose}
                          className="flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium bg-violet-50 text-violet-700 border border-violet-200 rounded-full"
                        >
                          {pose}
                          <button
                            onClick={() => {
                              setCustomPoseItems((prev) => prev.filter((p) => p !== pose))
                              setPoses((prev) => prev.filter((p) => p !== pose))
                            }}
                            className="text-violet-400 hover:text-violet-700 transition-colors"
                            aria-label={`Remove ${pose}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-violet-500" />
                </div>
                <h3 className="text-[14px] font-bold text-stone-900">Additional Options</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Footwear */}
              <div>
                <label className={labelClass}>
                  Footwear
                  <span className="text-[#9E9893] text-[10px] font-normal normal-case">(Optional)</span>
                  <div className="group relative">
                    <Info className="w-3.5 h-3.5 text-[#9E9893] cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-stone-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-10">
                      Select footwear style for the model
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-stone-900"></div>
                    </div>
                  </div>
                </label>
                <GroupedSelect
                  groupedOptions={footwearOptionsList}
                  value={footwear}
                  onChange={setFootwear}
                  placeholder="Select footwear..."
                />
              </div>

              {/* Background */}
              <div className="relative">
                <label className={labelClass}>
                  Background
                  <span className="text-[#9E9893] text-[10px] font-normal normal-case">
                    {bgAllowed ? "(Optional)" : ""}
                  </span>
                  {!bgAllowed && <Lock className="w-3 h-3 text-amber-500" />}
                  <div className="group relative">
                    <Info className="w-3.5 h-3.5 text-[#9E9893] cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-stone-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-10">
                      {bgAllowed ? "Choose background setting for the image" : "Upgrade to Gold or Platinum to unlock backgrounds"}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-stone-900"></div>
                    </div>
                  </div>
                </label>
                <GroupedSelect
                  groupedOptions={backgroundOptionsList}
                  value={bgAllowed ? background : ""}
                  onChange={(val) => bgAllowed && setBackground(val)}
                  disabled={!bgAllowed}
                  placeholder={bgAllowed ? "Select background..." : "Upgrade to unlock"}
                />
              </div>

              {/* Accessory */}
              <div className="relative">
                <label className={labelClass}>
                  Accessory
                  <span className="text-[#9E9893] text-[10px] font-normal normal-case">
                    {accAllowed ? "(Optional)" : ""}
                  </span>
                  {!accAllowed && <Lock className="w-3 h-3 text-amber-500" />}
                  <div className="group relative">
                    <Info className="w-3.5 h-3.5 text-[#9E9893] cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-stone-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-10">
                      {accAllowed ? "Select accessories to add to the model" : "Upgrade to Gold or Platinum to unlock accessories"}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-stone-900"></div>
                    </div>
                  </div>
                </label>
                <GroupedSelect
                  groupedOptions={accessoryOptionsList}
                  value={accAllowed ? accessory : ""}
                  onChange={(val) => accAllowed && setAccessory(val)}
                  disabled={!accAllowed}
                  placeholder={accAllowed ? "Select accessory..." : "Upgrade to unlock"}
                />
              </div>

              {/* Jewelry */}
              <div className="relative">
                <label className={labelClass}>
                  Jewelry
                  <span className="text-[#9E9893] text-[10px] font-normal normal-case">
                    {jewAllowed ? "(Optional)" : ""}
                  </span>
                  {!jewAllowed && <Lock className="w-3 h-3 text-amber-500" />}
                  <div className="group relative">
                    <Info className="w-3.5 h-3.5 text-[#9E9893] cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-stone-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-10">
                      {jewAllowed ? "Choose jewelry pieces for the model" : "Upgrade to Gold or Platinum to unlock jewelry"}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-stone-900"></div>
                    </div>
                  </div>
                </label>
                <GroupedSelect
                  groupedOptions={jewelryOptionsList}
                  value={jewAllowed ? jewelry : ""}
                  onChange={(val) => jewAllowed && setJewelry(val)}
                  disabled={!jewAllowed}
                  placeholder={jewAllowed ? "Select jewelry..." : "Upgrade to unlock"}
                />
              </div>
              </div>
            </div>

          </div>
          </CollapsibleSidebar>
        </div>

        {/* Generated Images Preview */}
        {generatedImages.length > 0 && (
          <div className="mt-8">
            <div className="rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-violet-500" />
                </div>
                <h3 className="text-[14px] font-bold text-stone-900">Generated Images</h3>
                <span className="ml-auto text-[12px] text-[#9E9893] font-medium">({generatedImages.length} images)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Source model card */}
                {currentModel && (
                  <div className="space-y-3">
                    <div
                      className="rounded-xl overflow-hidden border-2 border-violet-200 bg-violet-50/30 relative group cursor-pointer aspect-square"
                      onClick={() => { setZoomedImage(currentModel); setIsZoomOpen(true); }}
                    >
                      <img
                        src={currentModel}
                        alt="Source model"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">Source</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                        <div className="bg-white/90 backdrop-blur-sm border border-[#E5E2DA] text-stone-900 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                          <ZoomIn className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-semibold">Zoom</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {generatedImages.map((img, idx) => (
                  <div key={idx} className="space-y-3">
                    <div
                      className="rounded-xl overflow-hidden border border-[#E5E2DA] bg-[#F9F8F5] relative group cursor-pointer aspect-square"
                      onClick={() => {
                        setZoomedImage(img)
                        setIsZoomOpen(true)
                      }}
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Generated pose ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                        <div className="bg-white/90 backdrop-blur-sm border border-[#E5E2DA] text-stone-900 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                          <ZoomIn className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-semibold">Zoom</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => handleDownload(idx)}
                      loading={isDownloading.index === idx && isDownloading.isDownloading}
                      icon={!(isDownloading.index === idx && isDownloading.isDownloading) ? <Download className="w-3.5 h-3.5" /> : undefined}
                      className="w-full"
                    >
                      {isDownloading.index === idx && isDownloading.isDownloading ? "Downloading..." : "Download"}
                    </Button>
                  </div>
                ))}
              </div>
              {/* Download All */}
              <div className="mt-6 pt-5 border-t border-[#E5E2DA]">
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={handleDownloadAll}
                  loading={isDownloading.index === undefined && isDownloading.isDownloading}
                  icon={!(isDownloading.index === undefined && isDownloading.isDownloading) ? <Download className="w-4 h-4" /> : undefined}
                  className="w-full"
                >
                  {isDownloading.index === undefined && isDownloading.isDownloading
                    ? "Downloading All..."
                    : `Download All (${generatedImages.length + (currentModel ? 1 : 0)} images)`}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2">
          <div className="flex gap-3">
            <Button variant="outline" disabled={!!isFromTool} size="lg" onClick={onBack} className="flex-1">
              Back
            </Button>
            <Button
              variant="gradient"
              size="lg"
              onClick={() => handleGeneratePoses()}
              disabled={isGenerating || poses.length === 0}
              loading={isGenerating}
              icon={!isGenerating ? <Sparkles className="w-4 h-4" /> : undefined}
              className="flex-1"
            >
              {isGenerating ? "Generating..." : "Generate Poses"}
            </Button>
          </div>
          {regenInfo && !isGenerating && generatedImages.length > 0 && (
            <Button
              variant="outline"
              size="md"
              onClick={() => handleGeneratePoses(regenInfo.generationId)}
              disabled={isGenerating}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              className={canShowFreeRegen ? "!border-green-300 !text-green-700 hover:!bg-green-50 w-full" : "w-full"}
            >
              {canShowFreeRegen
                ? `Regenerate Free (${regenInfo.freeRegensRemaining} left)`
                : "Regenerate (1 credit)"}
            </Button>
          )}
        </div>
      </div>

      {/* Zoom Modal */}
      <ZoomImageModal
        open={isZoomOpen}
        onClose={() => {
          setIsZoomOpen(false)
          setZoomedImage(null)
        }}
        images={
          generatedImages.length > 0
            ? [currentModel, ...generatedImages].filter(Boolean) as string[]
            : currentModel
              ? [currentModel]
              : []
        }
        initialIndex={
          zoomedImage
            ? Math.max(
                0,
                (generatedImages.length > 0
                  ? [currentModel, ...generatedImages]
                  : [currentModel]
                ).indexOf(zoomedImage)
              )
            : 0
        }
        alt="Pose preview"
      />
    </div>
    </>
  )
}
