import type React from "react"
import { useState, useEffect } from "react"
import { useAd } from "../../store/AdsContext"
import appConstant from "../../services/appConstant"
import { toast } from "sonner"

interface Step1FormProps {
  onNext: () => void
}

export default function Step1Form({ onNext }: Step1FormProps) {
  const ad = useAd()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Reset flow when component mounts (new flow starts)
  useEffect(() => {
    ad.resetFlow()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {

      // Supported file types: png, jpeg, jpg, webp
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.info("Supported image types: PNG, JPEG, JPG, WEBP");
        return;
      }


      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.info("Please select an image file")
        return
      }

      // Read file as data URL and set as preview, also set as product image
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setPreviewUrl(result)
        ad.setProductImage(file)
      }
      reader.onerror = () => {
        toast.info("Failed to read image file")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(ad.productImage, ad.productName)
    if (!ad.productImage || !ad.productName) {
      ad.setStep1Error("Please fill all fields and upload an image")
      return
    }

    ad.setIsLoading(true)
    ad.setLoadingMessage("Gathering product information...")

    try {
      ad.setLoadingMessage("Generating AI prompt for your product...")

      const promptResponse = await fetch(`${appConstant.BACKEND_API_URL}/product-ad/generate-prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json",Authorization: `${localStorage.getItem(appConstant.JWT_AUTH_TOKEN)}` },
        body: JSON.stringify({
          product_name: ad.productName,
          description: ad.productDescription,
          product_tagline: ad.productTagline,
        }),
      })

      if (!promptResponse.ok) throw new Error("Failed to generate prompt")
      const promptData = await promptResponse.json()
      ad.setStep1Prompt(promptData.prompt)
      
      // Capture flowId from the first API response
      if (promptData.flowId) {
        ad.setFlowId(promptData.flowId)
      }

      ad.setLoadingMessage("Cleaning and optimizing your product image...")

      const formData = new FormData()
      formData.append("file", ad.productImage)
      formData.append("prompt_override", promptData.prompt)
      formData.append("flowId", ad.flowId || promptData?.flowId)
      
      // Do NOT set Content-Type for multipart/form-data; browser fills boundary
      const cleanResponse = await fetch(`${appConstant.BACKEND_API_URL}/product-ad/product-preprocessing`, {
        method: "POST",
        headers: { 
          Authorization: `${localStorage.getItem(appConstant.JWT_AUTH_TOKEN)}` 
        },
        body: formData,
      })

      if (!cleanResponse.ok) throw new Error("Failed to clean image")
      const cleanData = await cleanResponse.json()
      ad.setCleanedImageUrl(cleanData?.urls[0])
      ad.setOriginalImageUrl(previewUrl)
      
      // Update flowId if it comes in the response
      if (cleanData?.flowId) {
        ad.setFlowId(cleanData?.flowId)
      }
      
      ad.setStep1Error(null)

      ad.setIsLoading(false)
      onNext()
    } catch (err) {
      ad.setStep1Error(err instanceof Error ? err.message : "Something went wrong")
      ad.setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-white bg-clip-text text-transparent">
            Create Your Ad in 3 Steps
          </span>
        </h1>
        <p className="text-gray-300">Upload your product and let AI do the magic</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300">Product Image</label>
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-20 transition blur-xl"></div>
              <div className="relative bg-slate-900/50 border-2 border-dashed border-purple-500/50 group-hover:border-purple-400 rounded-xl p-8 text-center transition min-h-[425px] flex items-center justify-center">
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                  {previewUrl ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Product"
                        className="max-h-80 w-auto rounded-lg mb-4 object-contain"
                      />
                      <p className="text-purple-400">Click to change image</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-6xl mb-4">📸</div>
                      <p className="text-gray-300 mb-2 text-lg">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Right Side - Form Inputs */}
          <div className="space-y-5">
            {/* Product Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">Product Name</label>
              <input
                type="text"
                placeholder="e.g., Orange Juice"
                value={ad.productName}
                onChange={(e) => ad.setProductName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition"
              />
            </div>

            {/* Tagline */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">Tagline</label>
              <input
                type="text"
                placeholder="e.g., Pure Sunshine in Every Sip"
                value={ad.productTagline}
                onChange={(e) => ad.setProductTagline(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300">Description</label>
              <textarea
                placeholder="Describe your product..."
                value={ad.productDescription}
                onChange={(e) => ad.setProductDescription(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition resize-none"
              />
            </div>

            {/* Error */}
            {ad.step1Error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">{ad.step1Error}</div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={ad.isLoading}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-lg shadow-lg hover:shadow-purple-500/50 transition transform hover:scale-105"
            >
              {ad.isLoading ? "Processing..." : "Continue to Image Processing"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
