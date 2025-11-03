"use client"
import { useEffect, useState } from "react"
import { ArrowLeft, Loader2, Upload, ZoomIn, X } from "lucide-react"
import type React from "react"
import { useRef } from "react"
import axios from "axios"
import appConstant from "../../services/appConstant"
import { dataURLtoFile } from "../../services/utils"
import { toast } from "sonner"

interface ModelSelectionProps {
  dressImage: string
  gender: string
  promptOverride?: string
  onModelSelected: (selectedModel: string) => void
  onBack: () => void
}


export default function ModelSelection({
  dressImage,
  gender,
  promptOverride,
  onModelSelected,
  onBack,
}: ModelSelectionProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedModel, setGeneratedModel] = useState<string | null>(null)
  const [uploadedModel, setUploadedModel] = useState<string | null>(null)
  const [isHoveringGenerated, setIsHoveringGenerated] = useState(false)
  const [isHoveringUploaded, setIsHoveringUploaded] = useState(false)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      formData.append("gender", gender)
      if (promptOverride) {
        formData.append("prompt_override", promptOverride)
      }
      formData.append("count", "1")

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedModel(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleContinue = () => {
    const modelToUse = uploadedModel || generatedModel
    if (modelToUse) {
      onModelSelected(modelToUse)
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
    <div className="min-h-[calc(100vh-64px)] bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-white mb-2">Step 2: Model with Dress</h1>
            <p className="text-gray-500">Use the generated model or upload your own</p>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 text-white hover:bg-gray-700/30 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

               {/* Left - Upload Different Model */}
          <div className="space-y-6 min-h-[200px]">
            {/* <div className="bg-black border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Or Upload Your Own Model</h3>

              <div
                onMouseEnter={() => setIsHoveringUploaded(true)}
                onMouseLeave={() => setIsHoveringUploaded(false)}
                className="relative"
              >
                {uploadedModel ? (
                  <div className="relative rounded-lg overflow-hidden border border-gray-700 bg-gray-700/20">
                    <img
                      src={uploadedModel || "/placeholder.svg"}
                      alt="Uploaded model"
                      className="w-full h-auto max-h-96 object-cover"
                    />
                    {isHoveringUploaded && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 transition-all duration-200">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-white hover:bg-white/90 text-gray-800 font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          Replace
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-700 rounded-lg p-8 hover:border-white/50 hover:bg-white/5 transition-all duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer group"
                  >
                    <Upload className="w-8 h-8 text-gray-500 group-hover:text-white transition-colors" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-white group-hover:text-white transition-colors">
                        Click to upload model image
                      </p>
                      <p className="text-xs text-gray-500 mt-2">JPG, JPEG, PNG</p>
                    </div>
                  </button>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </div> */}

            {/* Dress Info */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 min-h-[200px] ">
              <h3 className="text-lg font-semibold text-white mb-4">Dress Information</h3>
              <div className="space-y-3">
                <div 
                  className="rounded-lg overflow-hidden border border-gray-800 bg-gray-800/20 relative group cursor-pointer"
                  onClick={() => {
                    setZoomedImage(dressImage)
                    setIsZoomOpen(true)
                  }}
                >
                  <img
                    src={dressImage || "/placeholder.svg"}
                    alt="Dress"
                    className="w-full h-full max-h-96 object-contain"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500 mb-1">Gender</p>
                  <p className="text-white font-medium capitalize">{gender}</p>
                </div>
                {/* {promptOverride && (
                  <div className="text-sm">
                    <p className="text-gray-500 mb-1">Prompt</p>
                    <p className="text-white font-medium text-sm">{promptOverride}</p>
                  </div>
                )} */}
              </div>
            </div>
          </div>


          {/* Right - Generated Model */}
          <div className="space-y-6 ">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Generated Model</h3>

              {!generatedModel && !isGenerating && (
                <div className="text-center py-12">
                  <button
                    onClick={handleGenerateModel}
                    className="bg-white hover:bg-white/90 text-gray-800 font-semibold px-8 py-6 text-lg rounded-lg transition-all duration-200"
                  >
                    Generate Model
                  </button>
                </div>
              )}

              {isGenerating && (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                  <p className="text-gray-500">Generating model wearing your dress...</p>
                </div>
              )}

              {generatedModel && (
                <div className="space-y-4">
                  <div
                    onMouseEnter={() => setIsHoveringGenerated(true)}
                    onMouseLeave={() => setIsHoveringGenerated(false)}
                    className="relative rounded-lg overflow-hidden border border-gray-700 bg-gray-700/20 cursor-pointer"
                    onClick={() => {
                      setZoomedImage(generatedModel)
                      setIsZoomOpen(true)
                    }}
                  >
                    <img
                      src={generatedModel || "/placeholder.svg"}
                      alt="Generated model"
                      className="w-full h-auto max-h-[440px]  object-contain"
                    />
                    {isHoveringGenerated && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 transition-all duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setGeneratedModel(null)
                            setUploadedModel(null)
                            handleGenerateModel()
                          }}
                          className="text-white  border border-gray-200 font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                          Generate Again
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setZoomedImage(generatedModel)
                            setIsZoomOpen(true)
                          }}
                          className="text-white  border border-gray-200 font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
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

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-700 text-white hover:bg-gray-700/30 transition-colors font-medium"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!generatedModel && !uploadedModel}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-800 text-white  px-4 py-2  rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            Continue to Poses →
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
