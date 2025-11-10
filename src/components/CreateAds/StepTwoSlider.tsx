import { useState, useEffect } from "react"
import { useAd } from "../../store/AdsContext"
import appConstant from "../../services/appConstant"
import commonService from "../../services/commonService"

interface Step2SliderProps {
  onNext: () => void
  onBack: () => void
}

export default function Step2Slider({ onNext, onBack }: Step2SliderProps) {
  const ad = useAd()
  const [sliderValue, setSliderValue] = useState(50)
  const [originalPrompt, setOriginalPrompt] = useState<string>("")

  // Store the original prompt when component mounts
  useEffect(() => {
    if (ad.step1Prompt && !originalPrompt) {
      setOriginalPrompt(ad.step1Prompt)
    }
  }, [ad.step1Prompt, originalPrompt])

  const handleGenerateAd = async () => {
    if (!ad.cleanedImageUrl) return

    ad.setIsLoading(true)
    ad.setLoadingMessage("Generating professional ad image...")

    try {
      const formData = new FormData()

      // Convert cleaned image URL to blob and append
      // downloadSingleFile already adds ?url= parameter, so just pass the raw URL
      const downloadUrl = ad.cleanedImageUrl;
      const blobImgRes = await commonService.downloadSingleFile(downloadUrl);
      const file = new File([blobImgRes], "product.jpg", { type: "image/jpeg" })
      formData.append("file", file)
      formData.append("prompt", ad.step1Prompt)
      
      // Include flowId if available
      if (ad.flowId) {
        formData.append("flowId", ad.flowId)
      }

      const adResponse = await fetch(`${appConstant.BACKEND_API_URL}/product-ad/create-ad-from-product`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `${localStorage.getItem(appConstant.JWT_AUTH_TOKEN)}` },
      })

      if (!adResponse.ok) throw new Error("Failed to generate ad image")
      const adData = await adResponse.json()
      ad.setGeneratedAdImage(adData?.urls[0])
      
      // Update flowId if it comes in the response
      if (adData.flowId) {
        ad.setFlowId(adData.flowId)
      }
      
      ad.setStep2Error(null)

      ad.setIsLoading(false)
    } catch (err) {
      ad.setStep2Error(err instanceof Error ? err.message : "Failed to generate ad")
      ad.setIsLoading(false)
    }
  }

  const handleDownload = async (url: string, filename: string) => {
   const imageRes = await commonService.downloadSingleFile(url);
   const blobUrl = URL.createObjectURL(imageRes);
   const link = document.createElement("a");
   link.href = blobUrl;
   link.download = filename;
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
   URL.revokeObjectURL(blobUrl);
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-white via-purple-300 to-blue-300 bg-clip-text text-transparent">
            Image Processing
          </span>
        </h1>
        <p className="text-gray-300">Compare original and cleaned images</p>
      </div>

      {/* Image Slider */}
      <div className="relative group cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-20 transition blur-xl"></div>
        <div className="relative bg-slate-900/50 border border-purple-500/30 rounded-xl p-8 overflow-hidden">
          <div className="relative h-96 bg-slate-800 rounded-lg overflow-hidden">
            {/* Cleaned Image (Base) */}
            {ad.cleanedImageUrl && (
              <img
                src={ad.cleanedImageUrl || "/placeholder.svg"}
                alt="Cleaned"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Original Image (Overlay) */}
            {ad.originalImageUrl && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${100 - sliderValue}%` }}>
                <img
                  src={ad.originalImageUrl || "/placeholder.svg"}
                  alt="Original"
                  className="absolute inset-0 w-full h-full object-fill"
                  style={{ width: `${100 / (1 - sliderValue / 100)}%` }}
                />
              </div>
            )}

            {/* Slider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-gradient-to-r from-purple-400 to-blue-400 cursor-col-resize"
              style={{ left: `${100 - sliderValue}%` }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg">
                <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.5 15a.5.5 0 01-.5-.5v-11a.5.5 0 011 0v11a.5.5 0 01-.5.5z" />
                  <path d="M11.5 15a.5.5 0 01-.5-.5v-11a.5.5 0 011 0v11a.5.5 0 01-.5.5z" />
                </svg>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 bg-slate-900/80 px-3 py-1 rounded text-sm text-blue-300">
              Original
            </div>
            <div className="absolute top-4 right-4 bg-slate-900/80 px-3 py-1 rounded text-sm text-purple-300">
              Cleaned
            </div>
          </div>

          {/* Slider Input */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            className="w-full mt-6 cursor-pointer"
          />
        </div>
      </div>

      {/* Prompt Editor */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-10 transition blur-xl"></div>
        <div className="relative bg-slate-900/50 border border-purple-500/30 rounded-xl p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-300">AI Prompt</label>
              {originalPrompt && ad.step1Prompt !== originalPrompt && (
                <button
                  type="button"
                  onClick={() => {
                    ad.setStep1Prompt(originalPrompt)
                  }}
                  className="text-xs text-purple-400 hover:text-purple-300 transition underline"
                >
                  Reset to Original
                </button>
              )}
            </div>
            <textarea
              value={ad.step1Prompt}
              onChange={(e) => ad.setStep1Prompt(e.target.value)}
              placeholder="Enter or edit the AI prompt for generating your ad image..."
              rows={5}
              className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition resize-none text-sm"
            />
            <p className="text-xs text-gray-500">
              Customize the prompt to refine how the AI generates your ad image
            </p>
          </div>
        </div>
      </div>

      {/* Generated Ad Preview */}
      {ad.generatedAdImage && (
        <div className="relative group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-20 transition blur-xl"></div>
          <div className="relative bg-slate-900/50 border border-purple-500/30 rounded-xl p-8">
            <h3 className="text-lg font-semibold mb-4 text-purple-300">Generated Ad Image</h3>
            <img
              src={ad.generatedAdImage || "/placeholder.svg"}
              alt="Generated Ad"
              className="w-full rounded-lg mb-4"
            />
            <button
              onClick={() => handleDownload(ad.generatedAdImage!, "ad-image.jpg")}
              className="w-full px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-lg font-semibold transition"
            >
              Download Ad Image
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {ad.step2Error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">{ad.step2Error}</div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 border border-gray-600 hover:border-gray-400 rounded-lg font-semibold transition"
        >
          Back
        </button>
        <button
          onClick={handleGenerateAd}
          disabled={ad.isLoading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 rounded-lg font-semibold transition"
        >
          {ad.isLoading ? "Generating..." : "Generate Ad Image"}
        </button>
        <button
          onClick={onNext}
          disabled={!ad.generatedAdImage}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 rounded-lg font-semibold transition"
        >
          Continue to Video
        </button>
      </div>
    </div>
  )
}
