"use client"

import { useState } from "react"
import DressUpload from "./DressUpload"
import ModelSelection from "./ModelSelection"
import ModelEditor from "./ModelEditor"
import { Link } from "react-router-dom"
import DarkLogo from "../../../public/dark-logo.png"
import { Sparkles } from "lucide-react"

export default function Home() {
  const [step, setStep] = useState<"dress" | "selection" | "editor">("dress")
  const [dressImage, setDressImage] = useState<string | null>(null)
  const [gender, setGender] = useState("female")
  const [promptOverride, setPromptOverride] = useState<string | undefined>()
  const [selectedModel, setSelectedModel] = useState<string | null>(null)

  const handleDressUpload = (dress: string, selectedGender: string, prompt?: string) => {
    setDressImage(dress)
    setGender(selectedGender)
    setPromptOverride(prompt)
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
    <main className="min-h-screen bg-background">
      <div className='p-3 bg-gray-900 flex justify-between'>
        <h2 className='text-xl font-bold flex items-center gap-2'>
          <Link to={"/"}>
            <img src={DarkLogo} className='w-20 h-8' alt='AI4FI' />
          </Link>
          <Sparkles className='w-5 h-5 text-purple-600' />
        
          <span className='text-white'>Try On V2 (beta)</span>
          {/* Model Generator */}
        </h2>
        <div className='flex items-center gap-2'>
         <Link to={"/features"}>
          <button className='bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-800 text-white  px-4 py-2  rounded-lg shadow-lg transition-transform transform hover:scale-105'>
            Back
          </button>
         </Link>
       </div>
      </div>
      {step === "dress" && <DressUpload onUploadComplete={handleDressUpload} />}
      {step === "selection" && dressImage && (
        <ModelSelection
          dressImage={dressImage}
          gender={gender}
          promptOverride={promptOverride}
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
        />
      )}
    </main>
  )
}
