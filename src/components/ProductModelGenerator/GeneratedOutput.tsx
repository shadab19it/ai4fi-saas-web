interface GeneratedOutputProps {
  model3D: string
  video: string
}

export default function GeneratedOutput({ model3D, video }: GeneratedOutputProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Generated Results</h2>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 3D Model */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-900/20 to-slate-900/20 px-4 py-3">
            <h3 className="font-semibold text-white">3D Model</h3>
          </div>
          <div className="aspect-square flex items-center justify-center bg-slate-900/50">
            <img
              src={model3D || "/placeholder.svg"}
              alt="3D Model"
              className="max-h-full max-w-full object-contain p-4"
            />
          </div>
        </div>

        {/* Promotional Video */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-900/20 to-slate-900/20 px-4 py-3">
            <h3 className="font-semibold text-white">Promotional Video</h3>
          </div>
          <div className="aspect-square flex items-center justify-center bg-slate-900/50">
            <div className="text-center">
              <svg className="mx-auto mb-2 h-12 w-12 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <p className="text-sm text-slate-400">Video Preview</p>
              <img
                src={video || "/placeholder.svg"}
                alt="Video thumbnail"
                className="mt-2 max-h-32 max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
