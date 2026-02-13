"use client"

import { useState } from "react"
import DressUpload from "./DressUpload"
import ModelSelection from "./ModelSelection"
import ModelEditor from "./ModelEditor"
import { Link } from "react-router-dom"
import DarkLogo from "../../../public/dark-logo.png"
import { Sparkles, CheckCircle2 } from "lucide-react"

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

  const getCurrentStepIndex = () => {
    return steps.findIndex((s) => s.id === step)
  }

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
    // Store professional tier settings for later steps
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

  const handleBackToSelection = () => {
    setStep("selection")
  }

  const handleBackToDress = () => {
    setStep("dress")
    setDressImage(null)
    setSelectedModel(null)
  }

  const handleComplete = () => {
    console.log("[v0] Try-on complete!")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950">
      {/* Header */}
      <div className='p-4 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 flex justify-between items-center sticky top-0 z-40'>
        <h2 className='text-xl font-bold flex items-center gap-3'>
          <Link to={"/"} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src={DarkLogo} className='w-20 h-8' alt='AI4FI' />
          </Link>
          <div className="h-6 w-px bg-gray-700" />
          <span className='text-white font-semibold'>Trial Room</span>
        </h2>
        <div className='flex items-center gap-2'>
         <Link to={"/features"}>
          <button className='bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 hover:shadow-purple-500/20 font-medium'>
            Back
          </button>
         </Link>
       </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-gray-900/50 border-b border-gray-800/50 py-4 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {steps.map((stepItem, index) => {
              const isActive = step === stepItem.id
              const isCompleted = getCurrentStepIndex() > index
              const stepNumber = stepItem.number

              return (
                <div key={stepItem.id} className="flex items-center">
                  {/* Step Circle */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-500"
                          : isActive
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-500 ring-4 ring-purple-500/20"
                          : "bg-gray-800 border-gray-700"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <span
                          className={`text-sm font-semibold ${
                            isActive ? "text-white" : "text-gray-500"
                          }`}
                        >
                          {stepNumber}
                        </span>
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium whitespace-nowrap ${
                        isActive ? "text-white" : isCompleted ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {stepItem.label}
                    </span>
                  </div>
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 md:w-24 h-0.5 mx-2 md:mx-4 transition-all duration-300 ${
                        isCompleted ? "bg-gradient-to-r from-purple-600 to-indigo-600" : "bg-gray-800"
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
