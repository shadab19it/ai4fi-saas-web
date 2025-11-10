import { useState } from "react"

interface DownloadOptionsProps {
  model3D: string
  video: string
}

type AspectRatio = "1:1" | "4:5" | "9:16" | "16:9" | "3:4" | "custom"

export default function DownloadOptions({ model3D, video }: DownloadOptionsProps) {
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>("1:1")
  const [customWidth, setCustomWidth] = useState("1024")
  const [customHeight, setCustomHeight] = useState("1024")
  const [downloadType, setDownloadType] = useState<"model" | "video" | "both">("both")

  const ratios: Record<AspectRatio, { width: number; height: number }> = {
    "1:1": { width: 1024, height: 1024 },
    "4:5": { width: 800, height: 1000 },
    "9:16": { width: 720, height: 1280 },
    "16:9": { width: 1280, height: 720 },
    "3:4": { width: 768, height: 1024 },
    custom: { width: Number.parseInt(customWidth), height: Number.parseInt(customHeight) },
  }

  const handleDownload = async () => {
    const ratio = ratios[selectedRatio]

    // Simulate API call with custom size parameters
    console.log("Downloading with:", {
      type: downloadType,
      width: ratio.width,
      height: ratio.height,
      aspectRatio: selectedRatio,
    })

    // In real implementation, call your API here
    const response = await fetch('/api/download', {
      method: 'POST',
      body: JSON.stringify({
        model3D,
        video,
        width: ratio.width,
        height: ratio.height,
        type: downloadType,
      }),
    });
  }

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
      <h2 className="mb-6 text-2xl font-bold text-white">Download Options</h2>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Download Type Selection */}
        <div>
          <h3 className="mb-3 font-semibold text-white">What to Download?</h3>
          <div className="space-y-2">
            {["model", "video", "both"].map((type) => (
              <label
                key={type}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-600 p-3 hover:border-purple-500 hover:bg-purple-500/5 transition-all"
              >
                <input
                  type="radio"
                  name="download-type"
                  value={type}
                  checked={downloadType === type}
                  onChange={(e) => setDownloadType(e.target.value as typeof downloadType)}
                  className="h-4 w-4 accent-purple-600"
                />
                <span className="text-sm font-medium text-white capitalize">
                  {type === "both" ? "3D Model + Video" : `${type.charAt(0).toUpperCase() + type.slice(1)} Only`}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Aspect Ratio Selection */}
        <div>
          <h3 className="mb-3 font-semibold text-white">Aspect Ratio</h3>
          <div className="space-y-2">
            {(["1:1", "4:5", "9:16", "16:9", "3:4", "custom"] as const).map((ratio) => (
              <label
                key={ratio}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-600 p-3 hover:border-purple-500 hover:bg-purple-500/5 transition-all"
              >
                <input
                  type="radio"
                  name="aspect-ratio"
                  value={ratio}
                  checked={selectedRatio === ratio}
                  onChange={(e) => setSelectedRatio(e.target.value as AspectRatio)}
                  className="h-4 w-4 accent-purple-600"
                />
                <span className="text-sm font-medium text-white">{ratio}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Size Input */}
        <div>
          <h3 className="mb-3 font-semibold text-white">{selectedRatio === "custom" ? "Custom Size" : "Resolution"}</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Width (px)</label>
              <input
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(e.target.value)}
                disabled={selectedRatio !== "custom"}
                className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:border-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Height (px)</label>
              <input
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(e.target.value)}
                disabled={selectedRatio !== "custom"}
                className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:border-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="mt-6">
        <button
          onClick={handleDownload}
          className="w-full rounded-lg bg-purple-600 px-6 py-3 font-medium text-white hover:bg-purple-700 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v4a2 2 0 002 2h12a2 2 0 002-2v-4m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download {downloadType === "both" ? "All Files" : downloadType === "model" ? "3D Model" : "Video"}
        </button>
      </div>
    </div>
  )
}
