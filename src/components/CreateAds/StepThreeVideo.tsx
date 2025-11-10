import type React from "react"
import { useAd } from "../../store/AdsContext"
import appConstant from "../../services/appConstant"

interface Step3VideoProps {
  onBack: () => void
}

export default function Step3Video({ onBack }: Step3VideoProps) {
  const ad = useAd()

  const handleGenerateVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ad.audioScript) {
      ad.setStep3Error("Please enter an audio script")
      return
    }

    ad.setIsLoading(true)
    ad.setLoadingMessage("Analyzing audio script and generating video prompt...")

    try {
      const promptResponse = await fetch(`${appConstant.BACKEND_API_URL}/product-ad/generate-image-video-ad-prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json",Authorization: `${localStorage.getItem(appConstant.JWT_AUTH_TOKEN)}` },
        body: JSON.stringify({
          product_name: ad.productName,
          audio_script: ad.audioScript,
          ...(ad.flowId && { flowId: ad.flowId }),
        }),
      })

      if (!promptResponse.ok) throw new Error("Failed to generate video prompt")
      const promptData = await promptResponse.json()
      ad.setGeneratedVideoPrompt(promptData.video_prompt)
      
      // Update flowId if it comes in the response
      if (promptData.flowId) {
        ad.setFlowId(promptData.flowId)
      }

      ad.setLoadingMessage("Creating your video advertisement with AI models...")

      const formData = new FormData()

      // Convert ad image URL to blob
      const response = await fetch(ad.generatedAdImage!)
      const blob = await response.blob()
      const file = new File([blob], "ad-image.jpg", { type: "image/jpeg" })
      formData.append("file", file)
      formData.append("prompt", promptData.video_prompt)
      formData.append("audio_script", ad.audioScript)
      
      // Include flowId if available
      if (ad.flowId) {
        formData.append("flowId", ad.flowId)
      }

      const videoResponse = await fetch(`${appConstant.BACKEND_API_URL}/product-ad/generate-video`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data",Authorization: `${localStorage.getItem(appConstant.JWT_AUTH_TOKEN)}` },
      })

      if (!videoResponse.ok) throw new Error("Failed to generate video")
      const videoData = await videoResponse.json()
      ad.setGeneratedVideoUrl(videoData.video_url)
      
      // Update flowId if it comes in the response
      if (videoData.flowId) {
        ad.setFlowId(videoData.flowId)
      }
      
      ad.setStep3Error(null)

      ad.setIsLoading(false)
    } catch (err) {
      ad.setStep3Error(err instanceof Error ? err.message : "Failed to generate video")
      ad.setIsLoading(false)
    }
  }

  const handleDownload = (url: string, filename: string) => {
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-white via-purple-300 to-blue-300 bg-clip-text text-transparent">
            Generate Video Ad
          </span>
        </h1>
        <p className="text-gray-300">Create your final video advertisement</p>
      </div>

      <form onSubmit={handleGenerateVideo} className="space-y-6">
        {/* Audio Script */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300">Audio Script</label>
          <textarea
            placeholder="e.g., Refreshing orange burst—pure energy in every sip."
            value={ad.audioScript}
            onChange={(e) => ad.setAudioScript(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition"
          />
        </div>

        {/* Current Ad Image Preview */}
        {ad.generatedAdImage && (
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-20 transition blur-xl"></div>
            <div className="relative bg-slate-900/50 border border-purple-500/30 rounded-xl p-8">
              <h3 className="text-sm font-semibold text-purple-300 mb-4">Current Ad Image</h3>
              <img
                src={ad.generatedAdImage || "/placeholder.svg"}
                alt="Current Ad"
                className="w-full max-h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Error */}
        {ad.step3Error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">{ad.step3Error}</div>
        )}

        {/* Generate Button */}
        <button
          type="submit"
          disabled={ad.isLoading}
          className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-lg shadow-lg hover:shadow-purple-500/50 transition"
        >
          {ad.isLoading ? "Generating Video..." : "Generate Video"}
        </button>
      </form>

      {/* Video Preview */}
      {ad.generatedVideoUrl && (
        <div className="relative group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-20 transition blur-xl"></div>
          <div className="relative bg-slate-900/50 border border-purple-500/30 rounded-xl p-8">
            <h3 className="text-lg font-semibold mb-4 text-purple-300">Your Generated Video</h3>
            <video src={ad.generatedVideoUrl} controls className="w-full rounded-lg mb-4" />
            <button
              onClick={() => handleDownload(ad.generatedVideoUrl!, "ad-video.mp4")}
              className="w-full px-4 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-lg font-semibold transition"
            >
              Download Video
            </button>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 border border-gray-600 hover:border-gray-400 rounded-lg font-semibold transition"
        >
          Back
        </button>
        <a
          href="/"
          className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg font-semibold text-center transition"
        >
          Back to Home
        </a>
      </div>
    </div>
  )
}
