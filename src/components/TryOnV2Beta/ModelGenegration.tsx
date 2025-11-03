"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"

interface ModelGenerationProps {
  dressImage: string
  gender: string
  promptOverride?: string
  count: number
  onModelGenerated: (model: string, result: string, modelImage: string, poses: string[], posePrompt?: string) => void
  onBack: () => void
  onEditDress: () => void
}

export default function ModelGeneration({
  dressImage,
  gender,
  promptOverride,
  count,
  onModelGenerated,
  onBack,
  onEditDress,
}: ModelGenerationProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [modelWithDress, setModelWithDress] = useState<string | null>(null)
  const [generatedModel, setGeneratedModel] = useState<string | null>(null)

  const [modelImage, setModelImage] = useState<string | null>(null)
  const [poses, setPoses] = useState<string[]>([""])
  const [posePromptOverride, setPosePromptOverride] = useState("")
  const [useCustomPosePrompt, setUseCustomPosePrompt] = useState(false)

  const handleModelImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setModelImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addPose = () => {
    if (poses.length < 8) {
      setPoses([...poses, ""])
    }
  }

  const removePose = (index: number) => {
    setPoses(poses.filter((_, i) => i !== index))
  }

  const updatePose = (index: number, value: string) => {
    const newPoses = [...poses]
    newPoses[index] = value
    setPoses(newPoses)
  }

  const handleGenerateModel = async () => {
    if (!modelImage) {
      toast.info("Please upload a model image")
      return
    }

    setIsLoading(true)
    // Simulate API call to generate model with dress
    setTimeout(() => {
      // For demo, create a composite image
      const canvas = document.createElement("canvas")
      canvas.width = 400
      canvas.height = 600
      const ctx = canvas.getContext("2d")

      if (ctx) {
        // Create a placeholder model background
        ctx.fillStyle = "#f0f0f0"
        ctx.fillRect(0, 0, 400, 600)

        // Draw dress overlay
        const dressImg = new Image()
        dressImg.crossOrigin = "anonymous"
        dressImg.onload = () => {
          ctx.globalAlpha = 0.9
          ctx.drawImage(dressImg, 50, 150, 300, 350)
          ctx.globalAlpha = 1

          const result = canvas.toDataURL()
          setModelWithDress(result)
          setGeneratedModel(result) // In real app, this would be the actual model image
          setIsLoading(false)
        }
        dressImg.src = dressImage
      }
    }, 2500)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-background via-background to-secondary/5 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Step 2: Generate Model with Dress</h1>
            <p className="text-muted-foreground">Select or upload a model image and configure poses</p>
          </div>
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 px-4 py-2 bg-transparent border border-border hover:bg-secondary/20 rounded-lg text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left - Dress Image */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Dress Image</h3>
              <button 
                onClick={onEditDress} 
                className="px-3 py-1.5 text-sm bg-transparent text-primary hover:bg-primary/10 rounded-md transition-colors"
              >
                Edit
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden border border-border bg-secondary/20">
                <img
                  src={dressImage || "/placeholder.svg"}
                  alt="Dress"
                  className="w-full h-auto max-h-80 object-cover"
                />
              </div>

              <div className="bg-secondary/30 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Gender</p>
                <p className="text-foreground font-medium capitalize">{gender}</p>
              </div>

              <div className="bg-secondary/30 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Number of Models</p>
                <p className="text-foreground font-medium">{count}</p>
              </div>

              {promptOverride && (
                <div className="bg-secondary/30 p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Prompt Override</p>
                  <p className="text-foreground font-medium text-sm">{promptOverride}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right - Model Image Selection/Upload */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Model Image</h3>

            <div className="space-y-4">
              {modelImage ? (
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden border border-border bg-secondary/20">
                    <img
                      src={modelImage || "/placeholder.svg"}
                      alt="Model"
                      className="w-full h-auto max-h-80 object-cover"
                    />
                  </div>
                  <label htmlFor="model-upload-change" className="block">
                    <div className="w-full cursor-pointer px-4 py-2 bg-transparent border border-primary text-primary hover:bg-primary/10 rounded-lg transition-colors text-center">
                      <span>Change Model Image</span>
                    </div>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleModelImageUpload}
                    className="hidden"
                    id="model-upload-change"
                  />
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleModelImageUpload}
                    className="hidden"
                    id="model-upload"
                  />
                  <label
                    htmlFor="model-upload"
                    className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-secondary/20 transition-colors min-h-80"
                  >
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm font-medium text-foreground mb-1">Upload Model Photo</p>
                      <p className="text-xs text-muted-foreground">Click to upload from your computer</p>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pose Configuration */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Pose Configuration</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Poses */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-foreground">Poses (up to 8)</label>
                <span className="text-xs text-muted-foreground">{poses.length}/8</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {poses.map((pose, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={pose}
                      onChange={(e) => updatePose(index, e.target.value)}
                      placeholder={`Pose ${index + 1} (e.g., standing, walking)`}
                      className="flex-1 px-3 py-2 bg-secondary/30 border border-border rounded-lg text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {poses.length > 1 && (
                      <button
                        onClick={() => removePose(index)}
                        className="px-2 py-2 text-sm bg-transparent text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {poses.length < 8 && (
                <button
                  onClick={addPose}
                  className="w-full mt-2 text-primary border-primary hover:bg-primary/10 bg-transparent"
                >
                  + Add Pose
                </button>
              )}
            </div>

            {/* Pose Prompt Override */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Pose Prompt Settings</label>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="posePromptType"
                    checked={!useCustomPosePrompt}
                    onChange={() => {
                      setUseCustomPosePrompt(false)
                      setPosePromptOverride("")
                    }}
                    className="w-4 h-4 text-primary bg-secondary/30 border-border focus:ring-primary focus:ring-2"
                  />
                  <span className="text-foreground group-hover:text-primary transition-colors">AI Recommended</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="posePromptType"
                    checked={useCustomPosePrompt}
                    onChange={() => setUseCustomPosePrompt(true)}
                    className="w-4 h-4 text-primary bg-secondary/30 border-border focus:ring-primary focus:ring-2"
                  />
                  <span className="text-foreground group-hover:text-primary transition-colors">Custom Prompt</span>
                </label>
              </div>
              {useCustomPosePrompt && (
                <div className="mt-3">
                  <textarea
                    rows={3}
                    value={posePromptOverride}
                    onChange={(e) => setPosePromptOverride(e.target.value)}
                    placeholder="Optional: Custom prompt for pose generation"
                    className="w-full px-3 py-2 bg-secondary/30 border border-border rounded-lg text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right - Generated Result */}
        <div className="bg-card border border-border rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Model with Dress Preview</h3>
          <div className="rounded-lg overflow-hidden border border-border bg-secondary/20 flex items-center justify-center min-h-96">
            {modelWithDress ? (
              <img
                src={modelWithDress || "/placeholder.svg"}
                alt="Model with dress"
                className="w-full h-full object-cover"
              />
            ) : isLoading ? (
              <div className="flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-muted-foreground text-sm">Generating model...</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-muted-foreground text-sm">Click generate to create</p>
              </div>
            )}
          </div>
            </div>

        {/* Action Button */}
        <div className="mt-8">
          <button
            onClick={handleGenerateModel}
            disabled={isLoading || !!modelWithDress || !modelImage}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : modelWithDress ? (
              <>Generated! Proceed to Poses →</>
            ) : (
              "Generate Model with Dress"
            )}
        </button>
        </div>

        {/* Next Step */}
        {modelWithDress && (
          <div className="mt-6 text-center">
            <button
              onClick={() =>
                onModelGenerated(
                  generatedModel!,
                  modelWithDress,
                  modelImage!,
                  poses.filter((p) => p.trim()),
                  useCustomPosePrompt && posePromptOverride ? posePromptOverride : undefined,
                )
              }
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-8 py-3 rounded-lg"
            >
              Continue to Pose Selection →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
