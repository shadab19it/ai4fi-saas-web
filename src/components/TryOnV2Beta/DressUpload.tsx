import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Upload, ZoomIn, X } from "lucide-react"
import { female_model_tryon_prompt, male_model_tryon_prompt } from "../../services/prompt"

interface DressUploadProps {
  onUploadComplete: (dressImage: string, gender: string, promptOverride?: string) => void
}

export default function DressUpload({ onUploadComplete }: DressUploadProps) {
  const [dressImage, setDressImage] = useState<string | null>(null)
  const [gender, setGender] = useState("female")
  const [promptOverride, setPromptOverride] = useState("")
  const [useCustomPrompt, setUseCustomPrompt] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const dressInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setDressImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleContinue = () => {
    if (dressImage) {
      onUploadComplete(dressImage, gender, useCustomPrompt && promptOverride ? promptOverride : undefined)
    }
  }

  useEffect(() => {
    if(gender === "female"){
      setPromptOverride(female_model_tryon_prompt)
    }else{
      setPromptOverride(male_model_tryon_prompt)
    }
  }, [gender])

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-900 px-4 pb-4 pt-0 md:p-2 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-4xl font-bold text-white mb-3">Try-On V2 Beta</h1>
          <p className="text-lg text-gray-500">Step 1: Upload a Dress</p>
        </div>

        {/* Upload Card */}
        <div className="bg-gray-800 border border-gray-800 rounded-xl p-8 md:p-12">
          {!dressImage ? (
            /* Upload Area (Single Column) */
            <div className="space-y-8">
              <button
                onClick={() => dressInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-700 rounded-xl p-12 hover:border-gray-300 hover:bg-gray-900/50 transition-all duration-200 flex flex-col items-center justify-center gap-4 cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full bg-gray-900/10 flex items-center justify-center group-hover:bg-gray-900/20 transition-colors">
                  <Upload className="w-8 h-8 text-gray-500 group-hover:text-gray-300 transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-500 group-hover:text-gray-300 transition-colors">
                    Click to upload dress image
                  </p>
                  <p className="text-sm text-gray-500 mt-2">or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-3">Supported: JPG, JPEG, PNG</p>
                </div>
              </button>
              <input ref={dressInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>
          ) : (
            /* Image & Options (Two Column Layout) */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Side - Image Card */}
              <div
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="relative"
              >
                <div className="bg-gray-700/20 border border-gray-700 rounded-lg overflow-hidden max-h-[440px] cursor-pointer"
                     onClick={() => setIsZoomOpen(true)}>
                  <img
                    src={dressImage || "/placeholder.svg"}
                    alt="Dress preview"
                    className="w-full h-auto max-h-[440px] object-contain"
                  />
                  {isHovering && (
                    <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center gap-3 transition-all duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          dressInputRef.current?.click()
                        }}
                        className=" text-white  border border-gray-200 font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Replace
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsZoomOpen(true)
                        }}
                        className=" text-white  border border-gray-200 font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <ZoomIn className="w-4 h-4" />
                        Zoom
                      </button>
                    </div>
                  )}
                </div>
                <input ref={dressInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>

              {/* Right Side - Options Card */}
              <div className="flex flex-col gap-6">
                <div className="flex-1 space-y-4 bg-gray-700/30 p-6 rounded-lg border border-gray-700">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-3">Prompt Settings</label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="promptType"
                          checked={!useCustomPrompt}
                          onChange={() => {
                            setUseCustomPrompt(false)
                            setPromptOverride("")
                          }}
                          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 focus:ring-purple-600 focus:ring-2"
                        />
                        <span className="text-white group-hover:text-purple-300 transition-colors">AI Recommended</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="promptType"
                          checked={useCustomPrompt}
                          onChange={() => setUseCustomPrompt(true)}
                          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 focus:ring-purple-600 focus:ring-2"
                        />
                        <span className="text-white group-hover:text-purple-300 transition-colors">Custom Prompt</span>
                      </label>
                    </div>
                    {useCustomPrompt && (
                      <div className="mt-3">
                        <textarea
                          rows={5}
                          value={promptOverride}
                          onChange={(e) => setPromptOverride(e.target.value)}
                          placeholder="e.g., 'wearing a red dress, professional look'"
                          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setDressImage(null)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-700 text-white hover:bg-gray-700/30 transition-colors font-medium"
                  >
                    Change Image
                  </button>
                  <button
                    onClick={handleContinue}
                    className="bg-gradient-to-r flex-1 from-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-800 text-white  px-4 py-2  rounded-lg shadow-lg transition-transform transform hover:scale-105"
                  >
                    Generate Model
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Upload a clear image of the dress you want to try on</p>
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomOpen && dressImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={dressImage}
              alt="Dress preview - zoomed"
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setIsZoomOpen(false)}
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
