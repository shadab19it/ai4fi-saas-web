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
  const [isDragging, setIsDragging] = useState(false)

  // Store the original prompt when component mounts
  useEffect(() => {
    if (ad.step1Prompt && !originalPrompt) {
      setOriginalPrompt(ad.step1Prompt)
    }
  }, [ad.step1Prompt, originalPrompt])

  // Handle mouse drag for slider
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
    const container = e.currentTarget
    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderValue(100 - percentage)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Add event listeners for drag
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        const container = document.querySelector('.slider-container') as HTMLElement
        if (!container) return
        
        const rect = container.getBoundingClientRect()
        const x = e.clientX - rect.left
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
        setSliderValue(100 - percentage)
      }

      const handleGlobalMouseUp = () => {
        setIsDragging(false)
      }

      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove)
        document.removeEventListener('mouseup', handleGlobalMouseUp)
      }
    }
  }, [isDragging])

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
            {/* Image Slider Comparison Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-10 transition blur-xl"></div>
              <div className="relative bg-slate-900/50 border border-purple-500/30 rounded-xl p-6 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-300">Before & After Comparison</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-blue-500"></div>
                      Original
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-purple-500"></div>
                      Cleaned
                    </span>
                  </div>
                </div>

                {/* Slider Container */}
                <div 
                  className="slider-container relative h-[400px] bg-slate-800 rounded-lg overflow-hidden shadow-2xl cursor-col-resize select-none"
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  {/* Cleaned Image (Base - Right Side) */}
                  {ad.cleanedImageUrl && (
                    <div className="absolute inset-0">
                      <img
                        src={ad.cleanedImageUrl || "/placeholder.svg"}
                        alt="Cleaned"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-purple-900/20"></div>
                    </div>
                  )}

                  {/* Original Image (Overlay - Left Side) */}
                  {ad.originalImageUrl && (
                    <div 
                      className="absolute inset-0 overflow-hidden transition-all duration-150"
                      style={{ width: `${100 - sliderValue}%`, clipPath: `inset(0 ${100 - (100 - sliderValue)}% 0 0)` }}
                    >
                      <img
                        src={ad.originalImageUrl || "/placeholder.svg"}
                        alt="Original"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-transparent"></div>
                    </div>
                  )}

                  {/* Slider Handle */}
                  <div
                    className={`absolute top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 via-purple-500 to-blue-400 cursor-col-resize transition-all ${isDragging ? 'w-1.5 shadow-lg' : ''}`}
                    style={{ left: `${100 - sliderValue}%` }}
                  >
                    {/* Handle Circle */}
                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-2xl transition-all ${isDragging ? 'scale-110 ring-4 ring-purple-500/50' : 'hover:scale-105'}`}>
                      <div className="p-3 flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                      </div>
                    </div>

                    {/* Handle Line Extension */}
                    <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-white/30"></div>
                  </div>

                  {/* Labels with Icons */}
                  <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-blue-500/30 shadow-lg">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-semibold text-blue-300">Original</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-500/30 shadow-lg">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-semibold text-purple-300">Cleaned</span>
                    </div>
                  </div>

                  {/* Percentage Indicator */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-500/30 shadow-lg">
                    <span className="text-sm font-semibold text-purple-300">
                      {Math.round(100 - sliderValue)}% Original / {Math.round(sliderValue)}% Cleaned
                    </span>
                  </div>
                </div>

                {/* Slider Input (Alternative Control) */}
                <div className="mt-6">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderValue}
                    onChange={(e) => setSliderValue(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${100 - sliderValue}%, #a855f7 ${100 - sliderValue}%, #a855f7 100%)`
                    }}
                  />
                  <style>{`
                    .slider-thumb::-webkit-slider-thumb {
                      appearance: none;
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: white;
                      cursor: pointer;
                      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                      transition: all 0.2s;
                    }
                    .slider-thumb::-webkit-slider-thumb:hover {
                      transform: scale(1.2);
                      box-shadow: 0 4px 12px rgba(168, 85, 247, 0.5);
                    }
                    .slider-thumb::-moz-range-thumb {
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: white;
                      cursor: pointer;
                      border: none;
                      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                      transition: all 0.2s;
                    }
                    .slider-thumb::-moz-range-thumb:hover {
                      transform: scale(1.2);
                      box-shadow: 0 4px 12px rgba(168, 85, 247, 0.5);
                    }
                  `}</style>
                </div>
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
          </div>

          {/* Right Side: Generated Ad Preview */}
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-20 transition blur-xl"></div>
            <div className="relative bg-slate-900/50 border border-purple-500/30 rounded-xl p-8 h-full">
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
        </div>
      ) : (
        <>
          {/* Image Slider Comparison Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-10 transition blur-xl"></div>
            <div className="relative bg-slate-900/50 border border-purple-500/30 rounded-xl p-6 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-300">Before & After Comparison</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    Original
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-purple-500"></div>
                    Cleaned
                  </span>
                </div>
              </div>

              {/* Slider Container */}
              <div 
                className="slider-container relative h-[500px] bg-slate-800 rounded-lg overflow-hidden shadow-2xl cursor-col-resize select-none"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Cleaned Image (Base - Right Side) */}
                {ad.cleanedImageUrl && (
                  <div className="absolute inset-0">
                    <img
                      src={ad.cleanedImageUrl || "/placeholder.svg"}
                      alt="Cleaned"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-purple-900/20"></div>
                  </div>
                )}

                {/* Original Image (Overlay - Left Side) */}
                {ad.originalImageUrl && (
                  <div 
                    className="absolute inset-0 overflow-hidden transition-all duration-150"
                    style={{ width: `${100 - sliderValue}%`, clipPath: `inset(0 ${100 - (100 - sliderValue)}% 0 0)` }}
                  >
                    <img
                      src={ad.originalImageUrl || "/placeholder.svg"}
                      alt="Original"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-transparent"></div>
                  </div>
                )}

                {/* Slider Handle */}
                <div
                  className={`absolute top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 via-purple-500 to-blue-400 cursor-col-resize transition-all ${isDragging ? 'w-1.5 shadow-lg' : ''}`}
                  style={{ left: `${100 - sliderValue}%` }}
                >
                  {/* Handle Circle */}
                  <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-2xl transition-all ${isDragging ? 'scale-110 ring-4 ring-purple-500/50' : 'hover:scale-105'}`}>
                    <div className="p-3 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </div>

                  {/* Handle Line Extension */}
                  <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-white/30"></div>
                </div>

                {/* Labels with Icons */}
                <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-blue-500/30 shadow-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-semibold text-blue-300">Original</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-500/30 shadow-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-semibold text-purple-300">Cleaned</span>
                  </div>
                </div>

                {/* Percentage Indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-500/30 shadow-lg">
                  <span className="text-sm font-semibold text-purple-300">
                    {Math.round(100 - sliderValue)}% Original / {Math.round(sliderValue)}% Cleaned
                  </span>
                </div>
              </div>

              {/* Slider Input (Alternative Control) */}
              <div className="mt-6">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${100 - sliderValue}%, #a855f7 ${100 - sliderValue}%, #a855f7 100%)`
                  }}
                />
                <style>{`
                  .slider-thumb::-webkit-slider-thumb {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: white;
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                    transition: all 0.2s;
                  }
                  .slider-thumb::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.5);
                  }
                  .slider-thumb::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: white;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                    transition: all 0.2s;
                  }
                  .slider-thumb::-moz-range-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.5);
                  }
                `}</style>
              </div>
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
