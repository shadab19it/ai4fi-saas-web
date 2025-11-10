import type React from "react"
import { useRef } from "react"

interface ProductUploadProps {
  productImage: string | null
  productName: string
  productDescription: string
  onImageChange: (image: string) => void
  onNameChange: (name: string) => void
  onDescriptionChange: (description: string) => void
  onGenerate: () => void
  isDisabled: boolean
}

export default function ProductUpload({
  productImage,
  productName,
  productDescription,
  onImageChange,
  onNameChange,
  onDescriptionChange,
  onGenerate,
  isDisabled,
}: ProductUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        onImageChange(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add("border-purple-500", "bg-purple-500/10")
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("border-purple-500", "bg-purple-500/10")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove("border-purple-500", "bg-purple-500/10")

    const file = e.dataTransfer.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        onImageChange(result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Image Upload */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Step 1: Upload Product Image</h2>
        <p className="text-slate-400">Supported formats: JPG, JPEG, PNG</p>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-600 bg-slate-800/50 p-8 transition-all hover:border-purple-500 hover:bg-purple-500/10 ${
            productImage ? "border-purple-500" : ""
          }`}
        >
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

          {productImage ? (
            <>
              <img
                src={productImage || "/placeholder.svg"}
                alt="Product preview"
                className="max-h-64 max-w-full rounded-lg object-contain"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <button className="rounded-lg bg-purple-600 px-4 py-2 text-white font-medium hover:bg-purple-700">
                  Replace Image
                </button>
              </div>
            </>
          ) : (
            <>
              <svg className="mb-4 h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-center">
                <span className="block text-lg font-medium text-white">Click to upload or drag and drop</span>
                <span className="block text-sm text-slate-400">PNG, JPG, GIF up to 10MB</span>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Step 2: Enter Product Details</h2>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Product Name *</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="E.g., Premium Leather Handbag"
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Product Description</label>
          <textarea
            value={productDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Describe your product in detail... (Optional)"
            rows={5}
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all resize-none"
          />
        </div>

        <button
          onClick={onGenerate}
          disabled={isDisabled}
          className={`w-full rounded-lg px-6 py-3 font-medium text-white transition-all ${
            isDisabled
              ? "cursor-not-allowed bg-slate-700 text-slate-500"
              : "bg-purple-600 hover:bg-purple-700 active:scale-95"
          }`}
        >
          Generate 3D Model & Video
        </button>
      </div>
    </div>
  )
}
