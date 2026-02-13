"use client"
import { useEffect, useState } from "react"
import { ZoomIn, X, Sparkles, Download } from "lucide-react"
import axios from "axios"
import appConstant from "../../services/appConstant"
import { dataURLtoFile } from "../../services/utils"
import { toast } from "sonner"
import CollapsibleSidebar from "./layout/CollapsibleSidebar"

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
  onModelSelected: (selectedModel: string) => void
  onBack: () => void
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
  onModelSelected,
  onBack,
}: ModelSelectionProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedModel, setGeneratedModel] = useState<string | null>(null)
  const [isHoveringGenerated, setIsHoveringGenerated] = useState(false)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isDownloadingModel, setIsDownloadingModel] = useState(false)

  const handleGenerateModel = async () => {
    if (!dressImage) {
      toast.info("Please upload a dress image first")
      return
    }

    setIsGenerating(true)
    try {
      // Convert data URL to File
      const dressFile = dataURLtoFile(dressImage, "dress-image.jpg")
      
      // Create FormData
      const formData = new FormData()
      formData.append("file", dressFile)
      
      // Add optional model_image (face image) from prop
      if (propModelImage) {
        // Check if it's a URL or data URL
        if (propModelImage.startsWith("http://") || propModelImage.startsWith("https://")) {
          // It's a URL from gallery, fetch it
          const response = await fetch(propModelImage)
          const blob = await response.blob()
          const modelImageFile = new File([blob], "model-image.jpg", { type: blob.type })
          formData.append("model_image", modelImageFile)
        } else {
          // It's a data URL from upload
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

      // Add professional tier options only if tier is professional
      if (tier === "professional") {
        if (aspectRatio) {
          formData.append("aspect_ratio", aspectRatio)
        }
        if (resolution) {
          formData.append("resolution", resolution)
        }
        if (width) {
          formData.append("width", width.toString())
        }
        if (height) {
          formData.append("height", height.toString())
        }
        if (segment) {
          formData.append("segment", segment)
        }
        if (garmentCategory) {
          formData.append("garment_category", garmentCategory)
        }
      }

      // Get token from localStorage
      const token = localStorage.getItem(appConstant.JWT_AUTH_TOKEN)
      
      // Make API call
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

      // Handle response
      if (response.data && response.data.urls && response.data.urls.length > 0) {
        // Use the first URL from the response
        setGeneratedModel(response.data.urls[0])
      } else {
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
      // data URL can be downloaded directly
      if (generatedModel.startsWith("data:")) {
        const anchor = document.createElement("a")
        anchor.href = generatedModel
        anchor.download = `tryon-model-${Date.now()}.png`
        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)
      } else {
        const response = await fetch(generatedModel)
        if (!response.ok) {
          throw new Error("Unable to download generated model")
        }
        const blob = await response.blob()
        const blobUrl = URL.createObjectURL(blob)
        const ext = blob.type.includes("png") ? "png" : "jpg"
        const anchor = document.createElement("a")
        anchor.href = blobUrl
        anchor.download = `tryon-model-${Date.now()}.${ext}`
        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)
        URL.revokeObjectURL(blobUrl)
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
    if (dressImage && !generatedModel) {
      setGeneratedModel(null)
      handleGenerateModel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dressImage])

  return (
    <div className="min-h-[calc(100vh-180px)] px-4 pb-8 pt-6">
      <div className="w-full">
        {/* Header */}


        {/* Main Content - Two Column Layout with Equal Heights */}
        <div className="flex flex-col xl:flex-row gap-6 items-start">
          {/* Left - Dress Information */}
          <CollapsibleSidebar
            collapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
            expandedWidthClass="xl:w-[360px]"
          >
            <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/80 backdrop-blur-sm border border-gray-700/60 rounded-2xl p-5 lg:p-6 shadow-xl flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Dress Information</h3>
              </div>
              
              <div className="flex-1 flex flex-col gap-6">
                {/* Gender Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-xl border border-gray-700/50 w-fit">
                  <span className="text-gray-400 text-sm">Gender:</span>
                  <span className="text-white font-semibold capitalize">{gender}</span>
                </div>
                <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Generation Settings</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs bg-purple-500/20 text-purple-200 border border-purple-500/30 capitalize">
                      {tier} tier
                    </span>
                    {tier === "professional" && aspectRatio && (
                      <span className="px-2.5 py-1 rounded-lg text-xs bg-gray-700/50 text-gray-200 border border-gray-600/60">
                        Ratio {aspectRatio}
                      </span>
                    )}
                    {tier === "professional" && resolution && (
                      <span className="px-2.5 py-1 rounded-lg text-xs bg-gray-700/50 text-gray-200 border border-gray-600/60">
                        {resolution}
                      </span>
                    )}
                    {tier === "professional" && width && height && (
                      <span className="px-2.5 py-1 rounded-lg text-xs bg-gray-700/50 text-gray-200 border border-gray-600/60">
                        {width}x{height}
                      </span>
                    )}
                    {tier === "professional" && segment && (
                      <span className="px-2.5 py-1 rounded-lg text-xs bg-gray-700/50 text-gray-200 border border-gray-600/60">
                        {segment}
                      </span>
                    )}
                    {tier === "professional" && garmentCategory && (
                      <span className="px-2.5 py-1 rounded-lg text-xs bg-gray-700/50 text-gray-200 border border-gray-600/60">
                        {garmentCategory}
                      </span>
                    )}
                  </div>
                </div>

                {/* Model Face Image */}
                {propModelImage && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2 font-medium">Model Face</p>
                    <div className="relative rounded-xl overflow-hidden border border-gray-700/50 bg-gray-800/30">
                      <img
                        src={propModelImage}
                        alt="Model face"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Dress Preview */}
                <div className="flex-1 flex flex-col">
                  <p className="text-gray-400 text-sm mb-3 font-medium">Dress Preview</p>
                  <div 
                    className="flex-1 rounded-xl overflow-hidden border-2 border-gray-700/50 bg-gray-800/30 relative group cursor-pointer min-h-[300px] flex items-center justify-center"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                      <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <ZoomIn className="w-4 h-4" />
                        <span className="text-sm font-medium">Click to Zoom</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSidebar>

          {/* Right - Generated Model */}
          <div className="flex flex-col w-full flex-1">
            <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/80 backdrop-blur-sm border border-gray-700/60 rounded-2xl p-5 lg:p-6 shadow-xl flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Generated Model</h3>
              </div>

              <div className="flex-1 flex items-center justify-center">
                {!generatedModel && !isGenerating && (
                  <div className="text-center py-12 w-full">
                    <button
                      onClick={handleGenerateModel}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/20 hover:scale-105"
                    >
                      Generate Model
                    </button>
                  </div>
                )}

                {isGenerating && (
                  <div className="flex flex-col items-center justify-center py-12 gap-6 w-full">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600/20 to-indigo-600/20"></div>
                      </div>
                    </div>
                    <div className="text-center space-y-3">
                      <p className="text-white font-semibold text-lg">Generating your model...</p>
                      <p className="text-gray-400 text-sm">This may take a few moments</p>
                      <div className="w-72 h-2 bg-gray-800 rounded-full overflow-hidden mt-4">
                        <div className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                {generatedModel && (
                  <div className="w-full flex-1 flex flex-col">
                    <div
                      onMouseEnter={() => setIsHoveringGenerated(true)}
                      onMouseLeave={() => setIsHoveringGenerated(false)}
                      className="relative rounded-xl overflow-hidden border-2 border-gray-700/50 bg-gray-800/30 cursor-pointer flex-1 flex items-center justify-center min-h-[400px]"
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-6 gap-3 transition-all duration-300">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setGeneratedModel(null)
                              handleGenerateModel()
                            }}
                            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:bg-white/20 hover:scale-105"
                          >
                            Generate Again
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setZoomedImage(generatedModel)
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 px-6 py-3.5 rounded-xl border border-gray-700 text-white hover:bg-gray-800/50 transition-all font-medium"
          >
            Back
          </button>
          <button
            onClick={handleDownloadGeneratedModel}
            disabled={!generatedModel || isDownloadingModel}
            className="flex-1 px-6 py-3.5 rounded-xl border border-gray-700 text-white hover:bg-gray-800/50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="inline-flex items-center gap-2">
              <Download className="w-4 h-4" />
              {isDownloadingModel ? "Downloading..." : "Download Model"}
            </span>
          </button>
          <button
            onClick={handleContinue}
            disabled={!generatedModel}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3.5 rounded-xl shadow-lg shadow-purple-500/20 transition-all font-semibold hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Continue to Poses 
          </button>
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomOpen && zoomedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => {
            setIsZoomOpen(false)
            setZoomedImage(null)
          }}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={zoomedImage}
              alt="Zoomed preview"
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => {
                setIsZoomOpen(false)
                setZoomedImage(null)
              }}
              className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
