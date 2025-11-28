"use client"

import { FC, useState } from "react"
import { AdProvider, useAd } from "../../store/AdsContext"
import Step1Form from "./StepOneForm"
import Step2Slider from "./StepTwoSlider"
import Step3Video from "./StepThreeVideo"
import ProgressBar from "./ProgressBar"
import LoadingOverlay from "./LoadingOverlay"
import { Link } from "react-router-dom"
import { Sparkles } from "lucide-react"
import DarkLogo from "../../../public/dark-logo.png"

function CreateAdContent() {
  const ad = useAd()
  const [step, setStep] = useState(1)

  return (
    <>
      <LoadingOverlay isVisible={ad.isLoading} messages={ad.loadingMessage} />

      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 text-white overflow-hidden">
        {/* Animated starfield background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 opacity-40">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `twinkle ${2 + Math.random() * 3}s infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
          {/* <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div> */}
        </div>

        {/* Content */}
        <div className="relative z-10">
        <div className='p-3 flex justify-between'>
        <h2 className='text-xl font-bold flex items-center gap-2'>
          <Link to={"/"}>
            <img src={DarkLogo} className='w-20 h-8' alt='AI4FI' />
          </Link>
          <Sparkles className='w-5 h-5 text-purple-600' />
        
          <span className='text-white'>Create Ads</span>
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

          {/* Progress Bar */}
          {/* <ProgressBar currentStep={step} totalSteps={3} /> */}

          {/* Main Content */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {step === 1 && <Step1Form onNext={() => setStep(2)} />}
            {step === 2 && <Step2Slider onNext={() => setStep(3)} onBack={() => setStep(1)} />}
            {step === 3 && <Step3Video onBack={() => setStep(2)} />}
          </section>
        </div>

        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    </>
  )
}

const CreateAds:FC = () => {
  return (
    <AdProvider>
      <CreateAdContent />
    </AdProvider>
  )
}


export default CreateAds;
