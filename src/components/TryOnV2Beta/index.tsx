"use client"

import { useState } from "react"
import DressUpload from "./DressUpload"
import ModelSelection from "./ModelSelection"
import ModelEditor from "./ModelEditor"
import { Link } from "react-router-dom"
import DarkLogo from "../../../public/dark-logo2.png"
import { CheckCircle2, ArrowLeft } from "lucide-react"
import Button from "../ui/Button"

export default function Home() {
  const [step, setStep] = useState<"dress" | "selection" | "editor">("dress")
  const [dressImage, setDressImage] = useState<string | null>(null)
  const [gender, setGender] = useState("female")
  const [promptOverride, setPromptOverride] = useState<string | undefined>()
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [tier, setTier] = useState<"basic" | "professional">("basic")
  const [aspectRatio, setAspectRatio] = useState<string | undefined>()
  const [resolution, setResolution] = useState<string | undefined>()
  const [width, setWidth] = useState<number | undefined>()
  const [height, setHeight] = useState<number | undefined>()
  const [segment, setSegment] = useState<string | undefined>()
  const [garmentCategory, setGarmentCategory] = useState<string | undefined>()

  const steps = [
    { id: "dress", label: "Upload Dress", number: 1 },
    { id: "selection", label: "Generate Model", number: 2 },
    { id: "editor", label: "Create Poses", number: 3 },
  ]

  const getCurrentStepIndex = () => steps.findIndex((s) => s.id === step)

  const [modelImage, setModelImage] = useState<string | null>(null)

  const handleDressUpload = (
    dress: string,
    selectedGender: string,
    prompt?: string,
    modelImg?: string,
    selectedTier?: "basic" | "professional",
    selectedAspectRatio?: string,
    selectedResolution?: string,
    selectedWidth?: number,
    selectedHeight?: number,
    selectedSegment?: string,
    selectedGarmentCategory?: string
  ) => {
    setDressImage(dress)
    setGender(selectedGender)
    setPromptOverride(prompt)
    setModelImage(modelImg || null)
    setTier(selectedTier || "basic")
    setAspectRatio(selectedAspectRatio)
    setResolution(selectedResolution)
    setWidth(selectedWidth)
    setHeight(selectedHeight)
    setSegment(selectedSegment)
    setGarmentCategory(selectedGarmentCategory)
    setStep("selection")
  }

  const handleModelSelected = (model: string) => {
    setSelectedModel(model)
    setStep("editor")
  }

  const handleBackToSelection = () => setStep("selection")

  const handleBackToDress = () => {
    setStep("dress")
    setDressImage(null)
    setSelectedModel(null)
  }

  const handleComplete = () => {
    console.log("[v0] Try-on complete!")
  }

  return (
    <main className="min-h-screen bg-[#F4F3EF]">
      {/* Header */}
      <div className="shrink-0 border-b border-[#E5E2DA] bg-white px-5 py-3 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img src={DarkLogo} className="w-18 h-10 rounded-lg object-cover" alt="AI4FI" />
          </Link>
          <div className="h-6 w-px bg-[#E5E2DA]" />
          <div>
            <h1 className="text-[14px] font-bold text-stone-900">Trial Room</h1>
            <p className="text-[11.5px] text-[#9E9893] font-medium">Virtual Try-On Studio</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/features">
            <Button variant="outline" size="md" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
              Back
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="md">Home</Button>
          </Link>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="border-b border-[#E5E2DA] bg-white py-4 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {steps.map((stepItem, index) => {
              const isActive = step === stepItem.id
              const isCompleted = getCurrentStepIndex() > index

              return (
                <div key={stepItem.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted
                          ? "bg-gradient-to-r from-violet-600 to-indigo-600 border-violet-500"
                          : isActive
                          ? "bg-gradient-to-r from-violet-600 to-indigo-600 border-violet-500 ring-4 ring-violet-500/15"
                          : "bg-[#F9F8F5] border-[#E5E2DA]"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <span className={`text-sm font-bold ${isActive ? "text-white" : "text-[#9E9893]"}`}>
                          {stepItem.number}
                        </span>
                      )}
                    </div>
                    <span
                      className={`mt-2 text-[11.5px] font-semibold whitespace-nowrap ${
                        isActive ? "text-stone-900" : isCompleted ? "text-[#6B6560]" : "text-[#9E9893]"
                      }`}
                    >
                      {stepItem.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 md:w-24 h-0.5 mx-2 md:mx-4 rounded-full transition-all duration-300 ${
                        isCompleted ? "bg-gradient-to-r from-violet-600 to-indigo-600" : "bg-[#E5E2DA]"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {step === "dress" && <DressUpload onUploadComplete={handleDressUpload} />}
      {step === "selection" && dressImage && (
        <ModelSelection
          dressImage={dressImage}
          gender={gender}
          promptOverride={promptOverride}
          modelImage={modelImage}
          tier={tier}
          aspectRatio={aspectRatio}
          resolution={resolution}
          width={width}
          height={height}
          segment={segment}
          garmentCategory={garmentCategory}
          onModelSelected={handleModelSelected}
          onBack={handleBackToDress}
        />
      )}
      {step === "editor" && selectedModel && dressImage && (
        <ModelEditor
          selectedModel={selectedModel}
          dressImage={dressImage}
          onBack={handleBackToSelection}
          onComplete={handleComplete}
          gender={gender}
          tier={tier}
          aspectRatio={aspectRatio}
          resolution={resolution}
          width={width}
          height={height}
          segment={segment}
          garmentCategory={garmentCategory}
        />
      )}
    </main>
  )
}
