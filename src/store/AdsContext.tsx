"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export interface AdContextType {
  // Flow ID
  flowId: string | null
  setFlowId: (flowId: string | null) => void
  resetFlow: () => void

  // Step 1 Data
  productImage: File | null
  productName: string
  productDescription: string
  productTagline: string
  step1Prompt: string
  step1Error: string | null
  setProductImage: (file: File | null) => void
  setProductName: (name: string) => void
  setProductDescription: (desc: string) => void
  setProductTagline: (tagline: string) => void
  setStep1Prompt: (prompt: string) => void
  setStep1Error: (error: string | null) => void

  // Step 2 Data
  originalImageUrl: string | null
  cleanedImageUrl: string | null
  generatedAdImage: string | null
  step2Error: string | null
  setOriginalImageUrl: (url: string | null) => void
  setCleanedImageUrl: (url: string | null) => void
  setGeneratedAdImage: (url: string | null) => void
  setStep2Error: (error: string | null) => void

  // Step 3 Data
  audioScript: string
  generatedVideoPrompt: string
  generatedVideoUrl: string | null
  step3Error: string | null
  setAudioScript: (script: string) => void
  setGeneratedVideoPrompt: (prompt: string) => void
  setGeneratedVideoUrl: (url: string | null) => void
  setStep3Error: (error: string | null) => void

  // Step tracking
  currentStep: number
  setCurrentStep: (step: number) => void

  // Loading state
  isLoading: boolean
  loadingMessage: string[] | string
  setIsLoading: (loading: boolean) => void
  setLoadingMessage: (message: string) => void
}

const AdContext = createContext<AdContextType | undefined>(undefined)

const FLOW_ID_STORAGE_KEY = "ad_flow_id"

export function AdProvider({ children }: { children: React.ReactNode }) {
  // Flow ID - load from localStorage on mount
  const [flowId, setFlowIdState] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(FLOW_ID_STORAGE_KEY) || null
    }
    return null
  })

  const setFlowId = (id: string | null) => {
    setFlowIdState(id)
    if (typeof window !== "undefined") {
      if (id) {
        localStorage.setItem(FLOW_ID_STORAGE_KEY, id)
      } else {
        localStorage.removeItem(FLOW_ID_STORAGE_KEY)
      }
    }
  }

  const resetFlow = () => {
    setFlowId(null)
    setProductImage(null)
    setProductName("")
    setProductDescription("")
    setProductTagline("")
    setStep1Prompt("")
    setStep1Error(null)
    setOriginalImageUrl(null)
    setCleanedImageUrl(null)
    setGeneratedAdImage(null)
    setStep2Error(null)
    setAudioScript("")
    setGeneratedVideoPrompt("")
    setGeneratedVideoUrl(null)
    setStep3Error(null)
    setCurrentStep(1)
  }

  // Step 1
  const [productImage, setProductImage] = useState<File | null>(null)
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [productTagline, setProductTagline] = useState("")
  const [step1Prompt, setStep1Prompt] = useState("")
  const [step1Error, setStep1Error] = useState<string | null>(null)

  // Step 2
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  const [cleanedImageUrl, setCleanedImageUrl] = useState<string | null>(null)
  const [generatedAdImage, setGeneratedAdImage] = useState<string | null>(null)
  const [step2Error, setStep2Error] = useState<string | null>(null)

  // Step 3
  const [audioScript, setAudioScript] = useState("")
  const [generatedVideoPrompt, setGeneratedVideoPrompt] = useState("")
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null)
  const [step3Error, setStep3Error] = useState<string | null>(null)

  // Step tracking
  const [currentStep, setCurrentStep] = useState(1)

  // Loading state
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")

  const value: AdContextType = {
    flowId,
    setFlowId,
    resetFlow,

    productImage,
    productName,
    productDescription,
    productTagline,
    step1Prompt,
    step1Error,
    setProductImage,
    setProductName,
    setProductDescription,
    setProductTagline,
    setStep1Prompt,
    setStep1Error,

    originalImageUrl,
    cleanedImageUrl,
    generatedAdImage,
    step2Error,
    setOriginalImageUrl,
    setCleanedImageUrl,
    setGeneratedAdImage,
    setStep2Error,

    audioScript,
    generatedVideoPrompt,
    generatedVideoUrl,
    step3Error,
    setAudioScript,
    setGeneratedVideoPrompt,
    setGeneratedVideoUrl,
    setStep3Error,

    currentStep,
    setCurrentStep,

    isLoading,
    loadingMessage,
    setIsLoading,
    setLoadingMessage,
  }


  return (
    <AdContext.Provider value={value}>
      {children}
    </AdContext.Provider>
  )
}

export function useAd() {
  const context = useContext(AdContext)
  if (!context) {
    throw new Error("useAd must be used within AdProvider")
  }
  return context
}
