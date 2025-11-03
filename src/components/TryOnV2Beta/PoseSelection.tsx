"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ArrowLeft, Loader2, Upload } from "lucide-react"

interface PoseSelectorProps {
  dressImage: string
  modelWithDress: string
  generatedModel: string
  onBack: () => void
}

const AVAILABLE_POSES = [
  { id: "standing", label: "Standing", description: "Neutral standing pose" },
  { id: "walking", label: "Walking", description: "Dynamic walking pose" },
  { id: "sitting", label: "Sitting", description: "Seated pose" },
  { id: "turning", label: "Turning", description: "Side profile turn" },
  { id: "dancing", label: "Dancing", description: "Dynamic dancing pose" },
  { id: "posing", label: "Posing", description: "Fashion pose" },
  { id: "running", label: "Running", description: "Active running pose" },
  { id: "jumping", label: "Jumping", description: "Jumping pose" },
]

export default function PoseSelector({ dressImage, modelWithDress, generatedModel, onBack }: PoseSelectorProps) {
  const [selectedPoses, setSelectedPoses] = useState<string[]>(["standing"])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPoses, setGeneratedPoses] = useState<{ pose: string; image: string }[]>([])
  const [useAlternateModel, setUseAlternateModel] = useState(false)
  const [alternateModel, setAlternateModel] = useState<string | null>(null)
  const alternateModelInputRef = useRef<HTMLInputElement>(null)

  const togglePose = (poseId: string) => {
    setSelectedPoses((prev) => {
      if (prev.includes(poseId)) {
        return prev.filter((p) => p !== poseId)
      } else if (prev.length < 8) {
        return [...prev, poseId]
      }
      return prev
    })
  }

  const handleAlternateModelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setAlternateModel(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGeneratePoses = async () => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      const poses = selectedPoses.map((pose) => ({
        pose,
        image: modelWithDress, // In real app, this would be different images for each pose
      }))
      setGeneratedPoses(poses)
      setIsGenerating(false)
    }, 3000)
  }

  const currentModel = useAlternateModel && alternateModel ? alternateModel : modelWithDress

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Step 3: Generate Poses</h1>
            <p className="text-gray-500">Select poses to generate the same model in different positions</p>
          </div>
          <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-transparent border border-gray-700 hover:bg-gray-700/20 rounded-lg text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Current Model Display */}
            <div className="bg-black border border-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Current Model</h3>
              <div className="rounded-lg overflow-hidden border border-gray-700 bg-gray-700/20">
                <img
                  src={currentModel || "/placeholder.svg"}
                  alt="Current model"
                  className="w-full h-40 object-cover"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {useAlternateModel ? "Alternate model" : "Generated model"}
              </p>
            </div>

            {/* Dress Display */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Dress</h3>
              <div className="rounded-lg overflow-hidden border border-gray-800 bg-gray-800/20">
                <img src={dressImage || "/placeholder.svg"} alt="Dress" className="w-full h-full max-h-96 object-contain" />
              </div>
            </div>

            {/* Model Selection */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Model Selection</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setUseAlternateModel(false)
                    setAlternateModel(null)
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 text-sm ${
                    !useAlternateModel
                      ? "bg-white/20 border-white text-white"
                      : "bg-gray-700/50 border-gray-700 text-gray-500 hover:border-white/50"
                  }`}
                >
                  <p className="font-medium">Use Current</p>
                  <p className="text-xs opacity-75">Generated model</p>
                </button>

                <button
                  onClick={() => setUseAlternateModel(true)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 text-sm ${
                    useAlternateModel && alternateModel
                      ? "bg-white/20 border-white text-white"
                      : "bg-gray-700/50 border-gray-700 text-gray-500 hover:border-white/50"
                  }`}
                >
                  <p className="font-medium">Upload Different</p>
                  <p className="text-xs opacity-75">{alternateModel ? "Model uploaded" : "Click to upload"}</p>
                </button>

                {useAlternateModel && !alternateModel && (
                  <button
                    onClick={() => alternateModelInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-700 rounded-lg p-4 hover:border-white/50 hover:bg-white/5 transition-all duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer group"
                  >
                    <Upload className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                    <span className="text-xs text-gray-500 group-hover:text-white transition-colors">
                      Upload model
                    </span>
                  </button>
                )}

                {alternateModel && (
                  <button
                    onClick={() => {
                      setAlternateModel(null)
                      setUseAlternateModel(false)
                    }}
             
                    className="w-full text-xs"
                  >
                    Clear Upload
                  </button>
                )}
              </div>

              <input
                ref={alternateModelInputRef}
                type="file"
                accept="image/*"
                onChange={handleAlternateModelUpload}
                className="hidden"
              />
            </div>

            {/* Pose Selection */}
            <div className="bg-black border-gray-700 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Select Poses</h3>
              <p className="text-xs text-gray-500 mb-3">
                Choose up to 8 poses ({selectedPoses.length} selected)
              </p>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {AVAILABLE_POSES.map((pose) => (
                  <button
                    key={pose.id}
                    onClick={() => togglePose(pose.id)}
                    className={`w-full text-left p-2 rounded-lg border transition-all duration-200 text-xs ${
                      selectedPoses.includes(pose.id)
                        ? "bg-white/20 border-white text-white"
                        : "bg-gray-700/50 border-gray-700 text-gray-500 hover:border-white/50"
                    }`}
                  >
                    <p className="font-medium">{pose.label}</p>
                    <p className="opacity-75">{pose.description}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={handleGeneratePoses}
                disabled={isGenerating || selectedPoses.length === 0}
                className="w-full mt-4 bg-white hover:bg-white/90 text-gray-800 font-semibold py-5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  `Generate ${selectedPoses.length} Pose${selectedPoses.length !== 1 ? "s" : ""}`
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Generated Results */}
          <div className="lg:col-span-3">
            {isGenerating ? (
              <div className="bg-black border-gray-700 p-12 flex flex-col items-center justify-center min-h-96">
                <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                <p className="text-gray-500">Generating poses for your model...</p>
              </div>
            ) : generatedPoses.length > 0 ? (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Generated Poses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedPoses.map((item, index) => (
                    <div
                      key={index}
                      className="bg-black border-gray-700 overflow-hidden hover:border-white/50 transition-all duration-200"
                    >
                      <div className="aspect-square overflow-hidden bg-gray-700/20">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={`Pose: ${item.pose}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <p className="font-semibold text-white capitalize">
                          {AVAILABLE_POSES.find((p) => p.id === item.pose)?.label}
                        </p>
                        <p className="text-sm text-gray-500">
                          {AVAILABLE_POSES.find((p) => p.id === item.pose)?.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-black border-gray-700 p-12 flex flex-col items-center justify-center min-h-96">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2 1m2-1l-2-1m2 1v2.5"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-center">Select poses and click generate to see results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
