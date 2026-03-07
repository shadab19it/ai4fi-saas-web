"use client"
import { useEffect, useState } from "react"
import { ZoomIn, Sparkles, Download, RefreshCw } from "lucide-react"
import axios from "axios"
import appConstant from "../../services/appConstant"
import commonService from "../../services/commonService"
import { dataURLtoFile } from "../../services/utils"
import { toast } from "sonner"
import CollapsibleSidebar from "./layout/CollapsibleSidebar"
import Button from "../ui/Button"
import ZoomImageModal from "../ui/ZoomImageModal"
import { resizeImage, downloadBlob } from "./resizeImage"
import { setUserRefresh } from "../../store/userReducer"
import { useDispatch } from "react-redux"

interface ModelSelectionProps {
  dressImage: string
  gender: string
  promptOverride?: string
  modelImage?: string | null
  tier?: "basic" | "professional"
  aspectRatio?: string
  resolution?: string
  width?: number
  height?: number
  segment?: string
  garmentCategory?: string
  isCustomDimensions?: boolean
  onModelSelected: (selectedModel: string) => void
  onBack: () => void,
  startGenerate:boolean
}


export default function ModelSelection({
  dressImage,
  gender,
  promptOverride,
  modelImage: propModelImage,
  tier = "basic",
  aspectRatio,
  resolution,
  width,
  height,
  segment,
  garmentCategory,
  isCustomDimensions,
  onModelSelected,
  onBack,
  startGenerate
}: ModelSelectionProps) {
  const dispatch = useDispatch();
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedModel, setGeneratedModel] = useState<string | null>(null)
  const [isHoveringGenerated, setIsHoveringGenerated] = useState(false)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isDownloadingModel, setIsDownloadingModel] = useState(false)
  const [regenInfo, setRegenInfo] = useState<{ generationId: string; freeRegensRemaining: number } | null>(null)
  const is4kResolution = (resolution || "").toUpperCase() === "4K"
  const canShowFreeRegen = !!regenInfo && !is4kResolution && regenInfo.freeRegensRemaining > 0

  const handleGenerateModel = async (parentId?: string) => {
    if (!dressImage) {
      toast.info("Please upload a dress image first")
      return
    }

    setIsGenerating(true)
    try {
      const dressFile = dataURLtoFile(dressImage, "dress-image.jpg")
      const formData = new FormData()
      formData.append("file", dressFile)
      
      if (propModelImage) {
        if (propModelImage.startsWith("http://") || propModelImage.startsWith("https://")) {
          const blob = await commonService.downloadSingleFile(propModelImage)
          const modelImageFile = new File([blob], "model-image.jpg", { type: blob.type })
          formData.append("model_image", modelImageFile)
        } else {
          const modelImageFile = dataURLtoFile(propModelImage, "model-image.jpg")
          formData.append("model_image", modelImageFile)
        }
      }
      
      formData.append("gender", gender)
      if (promptOverride) {
        formData.append("prompt_override", promptOverride)
      }
      formData.append("count", "1")
      formData.append("tier", tier)

      if (tier === "professional") {
        if (aspectRatio) formData.append("aspect_ratio", aspectRatio)
        if (resolution) formData.append("resolution", resolution)
        if (width) formData.append("width", width.toString())
        if (height) formData.append("height", height.toString())
        if (segment) formData.append("segment", segment)
        if (garmentCategory) formData.append("garment_category", garmentCategory)
      }

      if (parentId && typeof parentId === "string") {
        formData.append("parentGenerationId", parentId)
      }

      const token = localStorage.getItem(appConstant.JWT_AUTH_TOKEN)
      
      const response = await axios.post(
        `${appConstant.BACKEND_API_URL}/generate/generate-tryon-beta`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token && { Authorization: token }),
          },
        }
      )

      if (response.data && response.data.urls && response.data.urls.length > 0) {
        setGeneratedModel(response.data.urls[0])
      }
      if (response.data?.regeneration) {
        const r = response.data.regeneration
        setRegenInfo({ generationId: r.generationId, freeRegensRemaining: r.freeRegensRemaining })
      }
      dispatch(setUserRefresh());
      if (!response.data?.urls?.length) {
        throw new Error("No image URL returned from API")
      }
    } catch (error: any) {
      console.error("Error generating model:", error)
      toast.error(error?.response?.data?.message || error?.message || "Failed to generate model. Please try again.")
      setGeneratedModel(null)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleContinue = () => {
    if (generatedModel) {
      onModelSelected(generatedModel)
    }
  }

  const handleDownloadGeneratedModel = async () => {
    if (!generatedModel) return
    setIsDownloadingModel(true)
    try {
      if (generatedModel.startsWith("data:")) {
        // data URL: encode as blob then optionally resize
        const res = await fetch(generatedModel)
        let blob = await res.blob()
        if (isCustomDimensions && width && height) {
          // Pass blob directly — no S3 fetch, no CORS issue
          blob = await resizeImage(blob, { width, height, fit: "contain", mimeType: "image/png" })
        }
        downloadBlob(blob, `tryon-model-${Date.now()}.png`)
      } else {
        // Remote URL: download blob first, then optionally resize
        let blob = await commonService.downloadSingleFile(generatedModel)
        if (isCustomDimensions && width && height) {
          // Pass blob — avoids a second S3 request that would be blocked by CORS
          blob = await resizeImage(blob, { width, height, fit: "contain", mimeType: "image/png" })
        }
        const ext = blob.type.includes("png") ? "png" : "jpg"
        downloadBlob(blob, `tryon-model-${Date.now()}.${ext}`)
      }
      toast.success("Model downloaded")
    } catch (error: any) {
      console.error("Error downloading model:", error)
      toast.error(error?.message || "Failed to download model")
    } finally {
      setIsDownloadingModel(false)
    }
  }

  useEffect(() => {
    if (dressImage && !generatedModel && startGenerate) {
      setGeneratedModel(null)
      handleGenerateModel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dressImage,startGenerate])

  return (
    <div className="min-h-[calc(100vh-180px)] px-4 pb-8 pt-6">
      <div className="w-full">
        {/* Main Content - Two Column Layout */}
        <div className="flex flex-col xl:flex-row gap-6 items-start">
          {/* Left - Dress Information */}
          <CollapsibleSidebar
            collapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
            expandedWidthClass="xl:w-[360px]"
          >
            <div className="rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] p-5 lg:p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-violet-500" />
                </div>
                <h3 className="text-[14px] font-bold text-stone-900">Dress Information</h3>
              </div>
              
              <div className="flex-1 flex flex-col gap-4">
                {/* Gender Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#F9F8F5] rounded-xl border border-[#E5E2DA] w-fit">
                  <span className="text-[#9E9893] text-[12px] font-medium">Gender:</span>
                  <span className="text-stone-900 text-[13px] font-bold capitalize">{gender}</span>
                </div>

                {/* Generation Settings */}
                <div className="rounded-xl border border-[#E5E2DA] bg-[#F9F8F5] p-3">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-[#9E9893] mb-2">Generation Settings</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-violet-50 text-violet-600 border border-violet-200 capitalize">
                      {tier} tier
                    </span>
                    {tier === "professional" && aspectRatio && (
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white text-[#6B6560] border border-[#E5E2DA]">
                        Ratio {aspectRatio}
                      </span>
                    )}
                    {tier === "professional" && resolution && (
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white text-[#6B6560] border border-[#E5E2DA]">
                        {resolution}
                      </span>
                    )}
                    {tier === "professional" && width && height && (
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white text-[#6B6560] border border-[#E5E2DA]">
                        {width}x{height}
                      </span>
                    )}
                    {tier === "professional" && segment && (
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white text-[#6B6560] border border-[#E5E2DA]">
                        {segment}
                      </span>
                    )}

                  </div>
                </div>

                {/* Model Face Image */}
                {propModelImage && (
                  <div>
                    <p className="text-[11.5px] font-semibold text-[#6B6560] mb-2">Model Face</p>
                    <div className="relative rounded-xl overflow-hidden border border-[#E5E2DA]">
                      <img
                        src={propModelImage}
                        alt="Model face"
                        className="w-full h-32 object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* Dress Preview */}
                <div className="flex-1 flex flex-col">
                  <p className="text-[11.5px] font-semibold text-[#6B6560] mb-2">Dress Preview</p>
                  <div 
                    className="flex-1 rounded-xl overflow-hidden border border-[#E5E2DA] bg-[#F9F8F5] relative group cursor-pointer min-h-[300px] flex items-center justify-center"
                    onClick={() => {
                      setZoomedImage(dressImage)
                      setIsZoomOpen(true)
                    }}
                  >
                    <img
                      src={dressImage || "/placeholder.svg"}
                      alt="Dress"
                      className="w-full h-full object-contain max-h-[400px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                      <div className="bg-white/90 backdrop-blur-sm border border-[#E5E2DA] text-stone-900 px-3.5 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span className="text-[12px] font-semibold">Click to Zoom</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSidebar>

          {/* Right - Generated Model */}
          <div className="flex flex-col w-full flex-1">
            <div className="rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] p-5 lg:p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-violet-500" />
                </div>
                <h3 className="text-[14px] font-bold text-stone-900">Generated Model</h3>
              </div>

              <div className="flex-1 flex items-center justify-center">
                {!generatedModel && !isGenerating && (
                  <div className="text-center py-12 w-full">
                    <Button
                      variant="gradient"
                      size="lg"
                      onClick={() => handleGenerateModel()}
                      icon={<Sparkles className="w-4 h-4" />}
                    >
                      Generate Model
                    </Button>
                  </div>
                )}

                {isGenerating && (
                  <div className="flex flex-col items-center justify-center py-12 gap-6 w-full">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-violet-50"></div>
                      </div>
                    </div>
                    <div className="text-center space-y-3">
                      <p className="text-stone-900 font-bold text-lg">Generating your model...</p>
                      <p className="text-[#9E9893] text-[13px]">This may take a few moments</p>
                      <div className="w-72 h-2 bg-[#F9F8F5] rounded-full overflow-hidden mt-4 border border-[#E5E2DA]">
                        <div className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-600 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                {generatedModel && (
                  <div className="w-full flex-1 flex flex-col">
                    <div
                      onMouseEnter={() => setIsHoveringGenerated(true)}
                      onMouseLeave={() => setIsHoveringGenerated(false)}
                      className="relative rounded-xl overflow-hidden border border-[#E5E2DA] bg-[#F9F8F5] cursor-pointer flex-1 flex items-center justify-center min-h-[400px]"
                      onClick={() => {
                        setZoomedImage(generatedModel)
                        setIsZoomOpen(true)
                      }}
                    >
                      <img
                        src={generatedModel || "/placeholder.svg"}
                        alt="Generated model"
                        className="w-full h-full object-contain max-h-[500px]"
                      />
                      {isHoveringGenerated && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-6 gap-3 transition-all duration-300">
                          <Button
                            variant="outline"
                            size="md"
                            icon={<RefreshCw className="w-3.5 h-3.5" />}
                            onClick={(e) => {
                              e.stopPropagation()
                              setGeneratedModel(null)
                              handleGenerateModel(regenInfo?.generationId)
                            }}
                            className={`bg-white/90 backdrop-blur-sm hover:bg-white ${canShowFreeRegen ? "!border-green-400 !text-green-700" : ""}`}
                          >
                            {canShowFreeRegen
                              ? `Regenerate Free (${regenInfo.freeRegensRemaining} left)`
                              : "Generate Again"}
                          </Button>
                          <Button
                            variant="outline"
                            size="md"
                            icon={<ZoomIn className="w-3.5 h-3.5" />}
                            onClick={(e) => {
                              e.stopPropagation()
                              setZoomedImage(generatedModel)
                              setIsZoomOpen(true)
                            }}
                            className="bg-white/90 backdrop-blur-sm hover:bg-white"
                          >
                            Zoom
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <Button variant="outline" size="lg" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleDownloadGeneratedModel}
            disabled={!generatedModel}
            loading={isDownloadingModel}
            icon={<Download className="w-4 h-4" />}
            className="flex-1"
          >
            {isDownloadingModel ? "Downloading..." : "Download Model"}
          </Button>
          <Button
            variant="gradient"
            size="lg"
            onClick={handleContinue}
            disabled={!generatedModel}
            className="flex-1"
          >
            Continue to Poses
          </Button>
        </div>
      </div>

      {/* Zoom Modal */}
      <ZoomImageModal
        open={isZoomOpen}
        onClose={() => {
          setIsZoomOpen(false)
          setZoomedImage(null)
        }}
        images={[dressImage, ...(generatedModel ? [generatedModel] : [])].filter(Boolean)}
        initialIndex={zoomedImage === dressImage ? 0 : zoomedImage === generatedModel ? 1 : 0}
        alt="Model preview"
      />
    </div>
  )
}
