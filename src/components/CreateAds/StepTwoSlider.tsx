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
  const [originalPrompt, setOriginalPrompt] = useState<string>("")
  const [viewMode, setViewMode] = useState<"side-by-side" | "toggle">("side-by-side")
  const [showOriginal, setShowOriginal] = useState(true)

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

      {/* Conditional Layout: Two-column when ad is generated, single column otherwise */}
      {ad.generatedAdImage ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
          {/* Left Side: Image Slider and Prompt Editor */}
          <div className="space-y-8">
            {/* Image Comparison Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-10 transition blur-xl"></div>
              <div className="relative bg-slate-900/50 border border-purple-500/30 rounded-xl p-6 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Before & After Comparison</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setViewMode("side-by-side")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        viewMode === "side-by-side"
                          ? "bg-purple-600 text-white"
                          : "bg-slate-700/50 text-gray-300 hover:bg-slate-700"
                      }`}
                    >
                      Side by Side
                    </button>
                    <button
                      onClick={() => setViewMode("toggle")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        viewMode === "toggle"
                          ? "bg-purple-600 text-white"
                          : "bg-slate-700/50 text-gray-300 hover:bg-slate-700"
                      }`}
                    >
                      Toggle View
                    </button>
                  </div>
                </div>

                {/* Side by Side View */}
                {viewMode === "side-by-side" ? (
                  <div className="grid grid-cols-2 gap-4">
                    {/* Original Image */}
                    <div className="relative bg-slate-800 rounded-xl overflow-hidden shadow-xl">
                      <div className="absolute top-4 left-4 z-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-md px-4 py-2 rounded-lg border border-blue-400/40 shadow-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                          <span className="text-sm font-semibold text-blue-300">Before</span>
                        </div>
                      </div>
                      {ad.originalImageUrl ? (
                        <img
                          src={ad.originalImageUrl}
                          alt="Original"
                          className="w-full h-[450px] object-contain bg-slate-900"
                        />
                      ) : (
                        <div className="w-full h-[450px] flex items-center justify-center text-gray-500">
                          No original image
                        </div>
                      )}
                    </div>

                    {/* Cleaned Image */}
                    <div className="relative bg-slate-800 rounded-xl overflow-hidden shadow-xl">
                      <div className="absolute top-4 right-4 z-10 bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-md px-4 py-2 rounded-lg border border-purple-400/40 shadow-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                          <span className="text-sm font-semibold text-purple-300">After</span>
                        </div>
                      </div>
                      {ad.cleanedImageUrl ? (
                        <img
                          src={ad.cleanedImageUrl}
                          alt="Cleaned"
                          className="w-full h-[450px] object-contain bg-slate-900"
                        />
                      ) : (
                        <div className="w-full h-[450px] flex items-center justify-center text-gray-500">
                          No cleaned image
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Toggle View */
                  <div className="relative bg-slate-800 rounded-xl overflow-hidden shadow-xl">
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <button
                        onClick={() => setShowOriginal(!showOriginal)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        Switch to {showOriginal ? "After" : "Before"}
                      </button>
                    </div>
                    <div className="absolute top-4 left-4 z-10 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md px-4 py-2 rounded-lg border border-purple-400/40 shadow-lg">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${showOriginal ? 'bg-blue-400' : 'bg-purple-400'}`}></div>
                        <span className={`text-sm font-semibold ${showOriginal ? 'text-blue-300' : 'text-purple-300'}`}>
                          {showOriginal ? "Before - Original" : "After - Cleaned"}
                        </span>
                      </div>
                    </div>
                    {showOriginal ? (
                      ad.originalImageUrl ? (
                        <img
                          src={ad.originalImageUrl}
                          alt="Original"
                          className="w-full h-[450px] object-contain bg-slate-900"
                        />
                      ) : (
                        <div className="w-full h-[450px] flex items-center justify-center text-gray-500">
                          No original image
                        </div>
                      )
                    ) : (
                      ad.cleanedImageUrl ? (
                        <img
                          src={ad.cleanedImageUrl}
                          alt="Cleaned"
                          className="w-full h-[450px] object-contain bg-slate-900"
                        />
                      ) : (
                        <div className="w-full h-[450px] flex items-center justify-center text-gray-500">
                          No cleaned image
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Prompt Editor */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-10 transition blur-xl"></div>
              <div className="relative bg-slate-900/50 border border-purple-500/30 rounded-xl p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-gray-300">Product Description</label>
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
                    placeholder="Enter or edit the product description for generating your ad image..."
                    rows={5}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition resize-none text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Customize the product description to refine how the AI generates your ad image
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Generated Ad Preview */}
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-20 transition blur-xl"></div>
            <div className="relative bg-slate-900/50 border border-purple-500/30 rounded-xl p-8 h-full">
              <h3 className="text-lg font-semibold mb-4 text-purple-300">Generated Ad Image</h3>
              <img
                src={ad.generatedAdImage || "/placeholder.svg"}
                alt="Generated Ad"
                className="w-full  rounded-lg mb-4"
              />
              <button
                onClick={() => handleDownload(ad.generatedAdImage!, "ad-image.jpg")}
                className="w-full px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-lg font-semibold transition"
              >
                Download Ad Image
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Image Comparison Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-10 transition blur-xl"></div>
            <div className="relative bg-slate-900/50 border border-purple-500/30 rounded-xl p-6 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Before & After Comparison</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setViewMode("side-by-side")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      viewMode === "side-by-side"
                        ? "bg-purple-600 text-white"
                        : "bg-slate-700/50 text-gray-300 hover:bg-slate-700"
                    }`}
                  >
                    Side by Side
                  </button>
                  <button
                    onClick={() => setViewMode("toggle")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      viewMode === "toggle"
                        ? "bg-purple-600 text-white"
                        : "bg-slate-700/50 text-gray-300 hover:bg-slate-700"
                    }`}
                  >
                    Toggle View
                  </button>
                </div>
              </div>

              {/* Side by Side View */}
              {viewMode === "side-by-side" ? (
                <div className="grid grid-cols-2 gap-4">
                  {/* Original Image */}
                  <div className="relative bg-slate-800 rounded-xl overflow-hidden shadow-xl">
                    <div className="absolute top-4 left-4 z-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-md px-4 py-2 rounded-lg border border-blue-400/40 shadow-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        <span className="text-sm font-semibold text-blue-300">Before</span>
                      </div>
                    </div>
                    {ad.originalImageUrl ? (
                      <img
                        src={ad.originalImageUrl}
                        alt="Original"
                        className="w-full h-[500px] object-contain bg-slate-900"
                      />
                    ) : (
                      <div className="w-full h-[500px] flex items-center justify-center text-gray-500">
                        No original image
                      </div>
                    )}
                  </div>

                  {/* Cleaned Image */}
                  <div className="relative bg-slate-800 rounded-xl overflow-hidden shadow-xl">
                    <div className="absolute top-4 right-4 z-10 bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-md px-4 py-2 rounded-lg border border-purple-400/40 shadow-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                        <span className="text-sm font-semibold text-purple-300">After</span>
                      </div>
                    </div>
                    {ad.cleanedImageUrl ? (
                      <img
                        src={ad.cleanedImageUrl}
                        alt="Cleaned"
                        className="w-full h-[500px] object-contain bg-slate-900"
                      />
                    ) : (
                      <div className="w-full h-[500px] flex items-center justify-center text-gray-500">
                        No cleaned image
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Toggle View */
                <div className="relative bg-slate-800 rounded-xl overflow-hidden shadow-xl">
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <button
                      onClick={() => setShowOriginal(!showOriginal)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Switch to {showOriginal ? "After" : "Before"}
                    </button>
                  </div>
                  <div className="absolute top-4 left-4 z-10 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md px-4 py-2 rounded-lg border border-purple-400/40 shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${showOriginal ? 'bg-blue-400' : 'bg-purple-400'}`}></div>
                      <span className={`text-sm font-semibold ${showOriginal ? 'text-blue-300' : 'text-purple-300'}`}>
                        {showOriginal ? "Before - Original" : "After - Cleaned"}
                      </span>
                    </div>
                  </div>
                  {showOriginal ? (
                    ad.originalImageUrl ? (
                      <img
                        src={ad.originalImageUrl}
                        alt="Original"
                        className="w-full h-[500px] object-contain bg-slate-900"
                      />
                    ) : (
                      <div className="w-full h-[500px] flex items-center justify-center text-gray-500">
                        No original image
                      </div>
                    )
                  ) : (
                    ad.cleanedImageUrl ? (
                      <img
                        src={ad.cleanedImageUrl}
                        alt="Cleaned"
                        className="w-full h-[500px] object-contain bg-slate-900"
                      />
                    ) : (
                      <div className="w-full h-[500px] flex items-center justify-center text-gray-500">
                        No cleaned image
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Prompt Editor */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-10 transition blur-xl"></div>
            <div className="relative bg-slate-900/50 border border-purple-500/30 rounded-xl p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-300">Product Description</label>
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
                  placeholder="Enter or edit the product description for generating your ad image..."
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition resize-none text-sm"
                />
                <p className="text-xs text-gray-500">
                  Customize the product description to refine how the AI generates your ad image
                </p>
              </div>
            </div>
          </div>
        </>
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
          disabled={ad.isLoading || ad?.generatedAdImage !== null}
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
