import { useState, useRef, useCallback, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  Upload,
  ImagePlus,
  Sparkles,
  ArrowLeft,
  X,
  ChevronDown,
  Download,
  Copy,
  Check,
  Package,
  ShoppingBag,
  Image as ImageIcon,
  LayoutGrid,
  Loader2,
  Info,
  Grid3x3,
  Ratio,
  Lock,
} from "lucide-react"
import { usePlanFeatures } from "../../hooks/usePlanFeatures"
import AppHeader from "../../components/Layout/AppHeader"
import Button from "../../components/ui/Button"
import commonService from "../../services/commonService"
import productListingService, {
  type BannerResponse,
  type LifestyleListingResponse,
} from "../../services/productListingService"
import { MODEL_FACE_RETURN_URL_KEY } from "../../constants/modelFace"
import ModelGalleryModal from "../../components/common/ModelGalleryModal"
import {
  PRODUCT_LISTING_MARKETPLACES,
  type ProductListingMarketplace,
} from "../../constants/ecommercePlatforms"
import { PRODUCT_LISTING_PERSIST_KEY } from "../../constants/modelFace"

// ─── Types ──────────────────────────────────────────
type GenerationMode = "banner" | "lifestyle"
type Tier = "basic" | "professional"

interface ListingData {
  title?: string
  bullets?: string[]
  description?: string
  specifications?: Record<string, string> | Array<{ Attribute?: string; Value?: string }>
  keywords?: string
  raw_text?: string
}

// ─── Constants ──────────────────────────────────────
const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Beauty & Personal Care",
  "Home & Kitchen",
  "Sports & Outdoors",
  "Food & Beverages",
  "Toys & Games",
  "Health & Wellness",
  "Automotive",
  "Books & Stationery",
  "Jewelry & Accessories",
  "Pet Supplies",
  "Baby Products",
  "Garden & Outdoor",
  "Other",
]

const ASPECT_RATIOS = ["1:1", "4:3", "3:4", "16:9", "9:16"]
const RESOLUTIONS = ["1K", "2K", "4K"]
export default function ProductListingStudioPage() {
    const location = useLocation();
  const fromSource = new URLSearchParams(location.search).get("from");
  const navigate = useNavigate()
  const { isResolutionAllowed } = usePlanFeatures()

  // ─── State ──────────────────────────────────────
  const [mode, setMode] = useState<GenerationMode>("lifestyle")
  const [isGenerating, setIsGenerating] = useState(false)

  // Form fields
  const [productImage, setProductImage] = useState<File | null>(null)
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null)
  const [modelImage, setModelImage] = useState<File | null>(null)
  const [modelImagePreview, setModelImagePreview] = useState<string | null>(null)
  const [modelImageUrl, setModelImageUrl] = useState<string | null>(null)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [productName, setProductName] = useState("")
  const [category, setCategory] = useState("Fashion")
  const [shortDescription, setShortDescription] = useState("")
  const [tagline, setTagline] = useState("")

  // Banner-specific
  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [resolution, setResolution] = useState("2K")

  // Lifestyle-specific
  const [count, setCount] = useState(4)
  const [modelImageCount, setModelImageCount] = useState(0)
  const [tier, setTier] = useState<Tier>("basic")
  const [marketplace, setMarketplace] = useState<ProductListingMarketplace>("amazon")

  // Results
  const [resultImages, setResultImages] = useState<string[]>([])
  const [resultTagline, setResultTagline] = useState("")
  const [listingData, setListingData] = useState<ListingData | null>(null)
  const [generationTime, setGenerationTime] = useState(0)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [downloadAllLoading, setDownloadAllLoading] = useState(false)

  // Refs
  const productInputRef = useRef<HTMLInputElement>(null)
  const modelInputRef = useRef<HTMLInputElement>(null)

  // ─── Persistence ──────────────────────────────────
  useEffect(() => {
    // Restore state from localStorage
    const savedData = localStorage.getItem(PRODUCT_LISTING_PERSIST_KEY)
    if (savedData && fromSource) {
      try {
        const data = JSON.parse(savedData)
        setMode(data.mode || "lifestyle")
        setProductName(data.productName || "")
        setCategory(data.category || "Fashion")
        setShortDescription(data.shortDescription || "")
        setTagline(data.tagline || "")
        setAspectRatio(data.aspectRatio || "1:1")
        setResolution(data.resolution || "2K")
        setCount(data.count || 4)
        setModelImageCount(data.modelImageCount || 0)
        setTier(data.tier || "basic")
        setMarketplace(data.marketplace || "amazon")
        if (data.resultImages) setResultImages(data.resultImages)
        if (data.resultTagline) setResultTagline(data.resultTagline)
        if (data.listingData) setListingData(data.listingData)
        if (data.productImagePreview) setProductImagePreview(data.productImagePreview)
        if (data.modelImagePreview) {
          setModelImagePreview(data.modelImagePreview)
          setModelImageUrl(null)
        }
        if (data.modelImageUrl) {
          setModelImageUrl(data.modelImageUrl)
          setModelImagePreview(null)
        }
      } catch (err) {
        console.error("Failed to restore Product Listing state", err)
      }
    }

  }, [])

  useEffect(() => {
    // Save state to localStorage
    const dataToSave = {
      mode,
      productName,
      category,
      shortDescription,
      tagline,
      aspectRatio,
      resolution,
      count,
      modelImageCount,
      tier,
      marketplace,
      productImagePreview,
      modelImagePreview,
      modelImageUrl,
      resultImages,
      resultTagline,
      listingData,
    }
    localStorage.setItem(PRODUCT_LISTING_PERSIST_KEY, JSON.stringify(dataToSave))
  }, [
    mode,
    productName,
    category,
    shortDescription,
    tagline,
    aspectRatio,
    resolution,
    count,
    modelImageCount,
    tier,
    marketplace,
    productImagePreview,
    modelImagePreview,
    modelImageUrl,
    resultImages,
    resultTagline,
    listingData,
  ])

  // ─── Handlers ─────────────────────────────────────
  const handleImageUpload = useCallback(
    (file: File, type: "product" | "model") => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const url = e.target?.result as string
        if (type === "product") {
          setProductImage(file)
          setProductImagePreview(url)
        } else {
          setModelImage(file)
          setModelImagePreview(url)
          setModelImageUrl(null)
          setModelImageCount((prev) => (prev === 0 ? Math.min(2, count - 1) : prev))
        }
      }
      reader.readAsDataURL(file)
    },
    []
  )

  const clearImage = (type: "product" | "model") => {
    if (type === "product") {
      setProductImage(null)
      setProductImagePreview(null)
    } else {
      setModelImage(null)
      setModelImagePreview(null)
      setModelImageUrl(null)
      setModelImageCount(0)
    }
  }

  const handleGalleryModelSelect = (imageUrl: string) => {
    setModelImageUrl(imageUrl)
    setModelImagePreview(imageUrl)
    setModelImageCount((prev) => (prev === 0 ? Math.min(2, count - 1) : prev))
  }

  useEffect(() => {
    const returnedModelFaceUrl = localStorage.getItem(MODEL_FACE_RETURN_URL_KEY)
    if (returnedModelFaceUrl) {
      setModelImage(null)
      setModelImageUrl(returnedModelFaceUrl)
      setModelImagePreview(returnedModelFaceUrl)
      setModelImageCount((prev) => (prev === 0 ? Math.min(2, count - 1) : prev))
      localStorage.removeItem(MODEL_FACE_RETURN_URL_KEY)
    }
  }, [count])

  const handleDrop = useCallback(
    (e: React.DragEvent, type: "product" | "model") => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith("image/")) {
        handleImageUpload(file, type)
      }
    },
    [handleImageUpload]
  )

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleGenerate = async () => {
    if (!productImage) {
      toast.error("Please upload a product image")
      return
    }
    if (!productName.trim()) {
      toast.error("Please enter a product name")
      return
    }
    if (!shortDescription.trim()) {
      toast.error("Please enter a short description")
      return
    }

    setIsGenerating(true)
    setResultImages([])
    setListingData(null)
    setResultTagline("")

    try {
      let resolvedModelImage: File | undefined = modelImage || undefined
      if (!resolvedModelImage && modelImageUrl) {
        const blob = await commonService.downloadSingleFile(modelImageUrl)
        const filename = modelImageUrl.split("/").pop()?.split("?")[0] || `model-face-${Date.now()}.jpg`
        resolvedModelImage = new File([blob], filename, { type: blob.type || "image/jpeg" })
      }

      if (mode === "banner") {
        const res: BannerResponse = await productListingService.generateBanner({
          product_image: productImage,
          model_image: resolvedModelImage,
          product_name: productName,
          category,
          short_description: shortDescription,
          tagline: tagline || undefined,
          aspect_ratio: aspectRatio,
          resolution,
        })
        setResultImages(res.image_urls)
        setResultTagline(res.tagline)
        setGenerationTime(res.generation_time_seconds)
        toast.success("Banner generated successfully!")
      } else {
        const res: LifestyleListingResponse =
          await productListingService.generateLifestyleListing({
            product_image: productImage,
            model_image: resolvedModelImage,
            product_name: productName,
            category,
            short_description: shortDescription,
            tagline: tagline || undefined,
            count,
            model_image_count: modelImagePreview ? modelImageCount : 0,
            tier,
            target_marketplace: marketplace === "other" ? "amazon" : marketplace,
            aspect_ratio: tier === "professional" ? aspectRatio : undefined,
            resolution: tier === "professional" ? resolution : undefined,
          })
        setResultImages(res.image_urls)
        setResultTagline(res.tagline)
        setListingData(res.listing_data)
        setGenerationTime(res.generation_time_seconds)
        toast.success("Lifestyle listing generated successfully!")
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Generation failed. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const handleDownloadImage = async (url: string, idx: number) => {
    try {
      const blob = await commonService.downloadSingleFile(url)
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = `product-listing-${idx + 1}-${new Date().getTime()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(blobUrl)
    } catch {
      toast.error("Failed to download image")
    }
  }

  const handleDownloadAll = async () => {
    if (resultImages.length === 0) return
    setDownloadAllLoading(true)
    try {
      if (resultImages.length === 1) {
        await handleDownloadImage(resultImages[0], 0)
      } else {
        await commonService.downloadFileFromAPI(
          resultImages,
          mode === "banner" ? "product_listing_banner" : "product_listing",
          `product-listing-${new Date().getTime()}.zip`
        )
      }
    } catch {
      toast.error("Failed to download images")
    } finally {
      setDownloadAllLoading(false)
    }
  }

  // ─── Render Helpers ───────────────────────────────
  const ImageUploadBox = ({
    type,
    image,
    onRemove,
    inputRef,
  }: {
    type: "product" | "model"
    image: string | null
    onRemove: () => void
    inputRef: React.RefObject<HTMLInputElement>
  }) => (
    <div
      className={`relative h-[120px] rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer group
        ${image ? "border-[#E5E2DA] bg-white" : "border-[#D5D2CC] bg-[#FAFAF8] hover:border-violet-400 hover:bg-violet-50/30"}`}
      onClick={() => !image && type === "product" && inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => type === "product" && handleDrop(e, type)}
    >
      {type === "product" && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleImageUpload(file, type)
          }}
        />
      )}
      {image ? (
        <div className="relative h-full">
          <img
            src={image}
            alt={type}
            className="w-full h-full object-contain rounded-xl p-1.5"
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-white/90 border border-[#E5E2DA] hover:bg-red-50 hover:border-red-200 transition-colors"
          >
            <X className="h-3 w-3 text-stone-500 hover:text-red-500" />
          </button>
        </div>
      ) : (
        type === "product" ? (
          <div className="h-full flex flex-col items-center justify-center gap-1 p-2">
            <Package className="h-6 w-6 text-[#B5B0AA] group-hover:text-violet-400 transition-colors" />
            <span className="text-[11px] font-medium text-[#9E9893] text-center leading-tight">
              Upload Product
            </span>
            <span className="text-[9px] text-[#C5C0BA]">Required</span>
          </div>
        ) : (
          <div className="h-full p-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsGalleryOpen(true)
              }}
              className="border border-dashed border-[#D5D2CC] rounded-lg hover:border-violet-400 hover:bg-violet-50/40 transition-all flex flex-col items-center justify-center gap-1.5"
            >
              <Grid3x3 className="h-4.5 w-4.5 text-[#9E9893]" />
              <span className="text-[10.5px] font-semibold text-[#7C7671] text-center">
                Select Model
              </span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                navigate("/model?mode=face&source=product-listing")
              }}
              className="border border-dashed border-[#D5D2CC] rounded-lg hover:border-violet-400 hover:bg-violet-50/40 transition-all flex flex-col items-center justify-center gap-1.5"
            >
              <Sparkles className="h-4.5 w-4.5 text-[#9E9893]" />
              <span className="text-[10.5px] font-semibold text-[#7C7671] text-center">
                Create Model
              </span>
            </button>
          </div>
        )
      )}
    </div>
  )

  const hasResults = resultImages.length > 0
  const specificationRows =
    listingData?.specifications &&
    (Array.isArray(listingData.specifications)
      ? listingData.specifications
          .map((item) => ({
            key: item.Attribute ?? "",
            val: item.Value ?? "",
          }))
          .filter((item) => item.key || item.val)
      : Object.entries(listingData.specifications).map(([key, val]) => ({ key, val })))

  return (
    <div className="min-h-screen bg-[#F4F2EE] flex flex-col">
      <AppHeader title="Product Studio" description=" AI-powered eCommerce photography & listing generator" />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5">
        {/* ─── TOP: Header Row ─── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
          </div>

          {/* Mode Toggle */}
          <div className="bg-white rounded-xl border border-[#E5E2DA] p-1 flex gap-0.5">
            <button
              onClick={() => setMode("banner")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                mode === "banner"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-[#6B6560] hover:bg-[#F9F8F5]"
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              Banner
            </button>
            <button
              onClick={() => setMode("lifestyle")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                mode === "lifestyle"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-[#6B6560] hover:bg-[#F9F8F5]"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Lifestyle + Listing
            </button>
          </div>
        </div>

        {/* ─── CONFIG STRIP: Horizontal layout ─── */}
        <div className="bg-white rounded-2xl border border-[#E5E2DA] shadow-[0_1px_3px_rgba(28,25,23,0.06)] mb-5">
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#E5E2DA]">
            {/* Col 1: Image Uploads */}
            <div className="md:col-span-3 p-4">
              <h3 className="text-[12px] font-bold text-stone-900 mb-2.5 flex items-center gap-1.5">
                <Upload className="h-3.5 w-3.5 text-violet-500" />
                Images
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <ImageUploadBox
                  type="product"
                  image={productImagePreview}
                  onRemove={() => clearImage("product")}
                  inputRef={productInputRef}
                />
                <ImageUploadBox
                  type="model"
                  image={modelImagePreview}
                  onRemove={() => clearImage("model")}
                  inputRef={modelInputRef}
                />
              </div>
            </div>

            {/* Col 2: Product Details */}
            <div className="md:col-span-4 p-4 space-y-2.5">
              <h3 className="text-[12px] font-bold text-stone-900 flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-blue-500" />
                Product Details
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-[#6B6560] uppercase tracking-wide mb-0.5 block">
                    Product Name *
                  </label>
                  <input
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Wireless Mouse"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E2DA] bg-[#FAFAF8] text-[12px] text-stone-900 placeholder:text-[#C5C0BA] focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-300 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-[#6B6560] uppercase tracking-wide mb-0.5 block">
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E2DA] bg-[#FAFAF8] text-[12px] text-stone-900 appearance-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-300 transition-all"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-[#9E9893] pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-[#6B6560] uppercase tracking-wide mb-0.5 block">
                  Short Description *
                </label>
                <textarea
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Describe your product briefly..."
                  rows={2}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E2DA] bg-[#FAFAF8] text-[12px] text-stone-900 placeholder:text-[#C5C0BA] resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-300 transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-[#6B6560] uppercase tracking-wide mb-0.5 block">
                  Tagline
                  <span className="text-[9px] font-normal text-[#B5B0AA] ml-1">(auto if empty)</span>
                </label>
                <input
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Comfort Meets Precision"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E2DA] bg-[#FAFAF8] text-[12px] text-stone-900 placeholder:text-[#C5C0BA] focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-300 transition-all"
                />
              </div>
            </div>

            {/* Col 3: Settings + Generate */}
            <div className="md:col-span-5 p-4 space-y-2.5">
              <h3 className="text-[12px] font-bold text-stone-900 flex items-center gap-1.5">
                <Ratio className="h-3.5 w-3.5 text-emerald-500" />
                {mode === "banner" ? "Banner Settings" : "Listing Settings"}
              </h3>

              {mode === "lifestyle" && (
                <div className="space-y-2.5">
                  {/* Row: Marketplace + Tier */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-semibold text-[#6B6560] uppercase tracking-wide mb-1 block">
                        Marketplace
                      </label>
                      <div className="flex gap-1">
                        {PRODUCT_LISTING_MARKETPLACES.map((mp) => (
                          <button
                            key={mp.value}
                            onClick={() => setMarketplace(mp.value)}
                            className={`flex-1 px-1.5 py-1 rounded-lg text-[10.5px] font-semibold border transition-all ${
                              marketplace === mp.value
                                ? "bg-blue-50 border-blue-200 text-blue-700"
                                : "bg-[#FAFAF8] border-[#E5E2DA] text-[#6B6560] hover:bg-[#F5F3F0]"
                            }`}
                          >
                            {mp.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#6B6560] uppercase tracking-wide mb-1 block">
                        Quality Tier
                      </label>
                      <div className="flex gap-1">
                        {(["basic", "professional"] as Tier[]).map((t) => (
                          <button
                            key={t}
                            onClick={() => setTier(t)}
                            className={`flex-1 px-1.5 py-1 rounded-lg text-[10.5px] font-semibold border transition-all capitalize ${
                              tier === t
                                ? "bg-violet-50 border-violet-200 text-violet-700"
                                : "bg-[#FAFAF8] border-[#E5E2DA] text-[#6B6560] hover:bg-[#F5F3F0]"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Row: Image count + Model count */}
                  <div className={`grid gap-2.5 ${modelImage ? "grid-cols-2" : "grid-cols-1"}`}>
                    <div>
                      <label className="text-[10px] font-semibold text-[#6B6560] uppercase tracking-wide mb-0.5 block">
                        Total Images: {count}
                      </label>
                      <input
                        type="range"
                        min={4}
                        max={8}
                        value={count}
                        onChange={(e) => {
                          const val = parseInt(e.target.value)
                          setCount(val)
                          if (modelImageCount > val - 1) setModelImageCount(val - 1)
                        }}
                        className="w-full accent-violet-600 h-1.5"
                      />
                      <div className="flex justify-between text-[9px] text-[#B5B0AA] -mt-0.5">
                        <span>4</span>
                        <span>8</span>
                      </div>
                    </div>
                    {modelImageUrl && (
                      <div>
                        <label className="text-[10px] font-semibold text-[#6B6560] uppercase tracking-wide mb-0.5 block">
                          With Model: {modelImageCount}
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={count - 1}
                          value={modelImageCount}
                          onChange={(e) => setModelImageCount(parseInt(e.target.value))}
                          className="w-full accent-rose-500 h-1.5"
                        />
                        <div className="flex justify-between text-[9px] text-[#B5B0AA] -mt-0.5">
                          <span>0</span>
                          <span>{count - 1}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Aspect Ratio + Resolution row */}
              {(mode === "banner" || tier === "professional") && (
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-semibold text-[#6B6560] uppercase tracking-wide mb-1 block">
                      Aspect Ratio
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {ASPECT_RATIOS.map((r) => (
                        <button
                          key={r}
                          onClick={() => setAspectRatio(r)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition-all ${
                            aspectRatio === r
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : "bg-[#FAFAF8] border-[#E5E2DA] text-[#6B6560] hover:bg-[#F5F3F0]"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-[#6B6560] uppercase tracking-wide mb-1 block">
                      Resolution
                    </label>
                    <div className="flex gap-1">
                      {RESOLUTIONS.map((r) => {
                        const allowed = isResolutionAllowed(r)
                        return (
                          <button
                            key={r}
                            onClick={() => allowed && setResolution(r)}
                            disabled={!allowed}
                            title={!allowed ? "Upgrade your plan to unlock" : undefined}
                            className={`flex-1 px-1.5 py-0.5 rounded-md text-[10.5px] font-semibold border transition-all ${
                              !allowed
                                ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                                : resolution === r
                                  ? "bg-amber-50 border-amber-200 text-amber-700"
                                  : "bg-[#FAFAF8] border-[#E5E2DA] text-[#6B6560] hover:bg-[#F5F3F0]"
                            }`}
                          >
                            {!allowed && <Lock className="inline w-2.5 h-2.5 mr-0.5" />}
                            {r}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Generate Button + Info */}
              <div className="flex items-center gap-3 pt-1">
                <Button
                  variant="gradient"
                  size="lg"
                  className="font-bold flex-shrink-0"
                  onClick={handleGenerate}
                  loading={isGenerating}
                  icon={
                    isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )
                  }
                >
                  {isGenerating
                    ? "Generating..."
                    : mode === "banner"
                    ? "Generate Banner"
                    : "Generate Listing"}
                </Button>

                <div className="flex items-start gap-1.5 flex-1 min-w-0">
                  <Info className="h-3 w-3 text-blue-400 mt-0.5 shrink-0" />
                  <p className="text-[10px] text-[#9E9893] leading-relaxed">
                    {mode === "banner"
                      ? "Generates 1 professional banner. AI auto-generates tagline if empty."
                      : "Generates 4–8 lifestyle images + listing copy. First image is white-background."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── BOTTOM: Results Area (full width) ─── */}
        {hasResults && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[13px] font-semibold text-stone-900">
                {resultImages.length} image{resultImages.length !== 1 ? "s" : ""} generated
              </span>
              <span className="text-[11px] text-[#9E9893]">
                in {generationTime.toFixed(1)}s
              </span>
            </div>
            <div className="flex items-center gap-2">
              {resultTagline && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#E5E2DA]">
                  <span className="text-[11px] text-[#9E9893]">Tagline:</span>
                  <span className="text-[11.5px] font-semibold text-stone-900 max-w-[200px] truncate">
                    "{resultTagline}"
                  </span>
                  <button
                    onClick={() => copyToClipboard(resultTagline, "tagline")}
                    className="p-0.5 hover:bg-[#F5F3F0] rounded"
                  >
                    {copiedField === "tagline" ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="h-3 w-3 text-[#B5B0AA]" />
                    )}
                  </button>
                </div>
              )}
              {resultImages.length > 1 && (
                <button
                  onClick={handleDownloadAll}
                  disabled={downloadAllLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-[11.5px] font-semibold transition-colors shadow-sm"
                >
                  {downloadAllLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  {downloadAllLoading ? "Downloading..." : "Download All"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Image Grid */}
        {hasResults ? (
          <div
            className={`grid gap-4 mb-5 ${
              resultImages.length === 1
                ? "grid-cols-1 max-w-lg mx-auto"
                : resultImages.length === 2
                ? "grid-cols-2 max-w-3xl mx-auto"
                : resultImages.length <= 4
                ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            }`}
          >
            {resultImages.map((url, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-xl border border-[#E5E2DA] overflow-hidden shadow-[0_1px_3px_rgba(28,25,23,0.06)] hover:shadow-[0_6px_20px_rgba(28,25,23,0.1)] transition-all duration-200 hover:-translate-y-0.5"
              >
                <img
                  src={url}
                  alt={`Generated ${idx + 1}`}
                  className="w-full aspect-square object-cover"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end justify-center p-3 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDownloadImage(url, idx)
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/95 border border-[#E5E2DA] text-[11px] font-semibold text-stone-900 hover:bg-white transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                </div>
                {/* Index badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/50 text-[10px] font-bold text-white">
                  {idx === 0 && mode === "lifestyle" ? "White BG" : `Image ${idx + 1}`}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-white rounded-2xl border border-[#E5E2DA] flex flex-col items-center justify-center py-16 px-8">
            <div className="w-14 h-14 rounded-2xl bg-[#F9F8F5] border border-[#E5E2DA] flex items-center justify-center mb-3">
              <ImagePlus className="h-6 w-6 text-[#C5C0BA]" />
            </div>
            <p className="text-[14px] font-semibold text-stone-900 mb-1">
              No images generated yet
            </p>
            <p className="text-[12px] text-[#9E9893] text-center max-w-md">
              Upload a product image, fill in the details above, and click Generate to create
              professional {mode === "banner" ? "banner images" : "lifestyle product photos and marketplace-ready listing copy"}.
            </p>
          </div>
        )}

        {/* Listing Data Section */}
        {listingData && mode === "lifestyle" && (
          <div className="bg-white rounded-2xl border border-[#E5E2DA] overflow-hidden mt-5">
            <div className="px-5 py-3 border-b border-[#E5E2DA] flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-stone-900 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-blue-500" />
                Auto-Generated Listing Copy
              </h3>
              <button
                onClick={() =>
                  copyToClipboard(JSON.stringify(listingData, null, 2), "listing")
                }
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E5E2DA] text-[11px] font-semibold text-[#6B6560] hover:bg-[#F9F8F5] transition-colors"
              >
                {copiedField === "listing" ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy All
                  </>
                )}
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left column */}
              <div className="space-y-4">
                {/* Title */}
                {listingData.title && (
                  <div>
                    <label className="text-[10px] font-semibold text-[#9E9893] uppercase tracking-wide mb-1 block">
                      Title
                    </label>
                    <div className="flex items-start justify-between gap-2 p-3 rounded-lg bg-[#FAFAF8] border border-[#E5E2DA]">
                      <p className="text-[13px] text-stone-900 leading-relaxed">
                        {listingData.title}
                      </p>
                      <button
                        onClick={() => copyToClipboard(listingData.title || "", "title")}
                        className="p-1 hover:bg-white rounded shrink-0"
                      >
                        {copiedField === "title" ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3 text-[#B5B0AA]" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Bullets */}
                {listingData.bullets && listingData.bullets.length > 0 && (
                  <div>
                    <label className="text-[10px] font-semibold text-[#9E9893] uppercase tracking-wide mb-1 block">
                      Key Features
                    </label>
                    <div className="p-3 rounded-lg bg-[#FAFAF8] border border-[#E5E2DA] space-y-1.5">
                      {listingData.bullets.map((b, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                          <span className="text-[12px] text-stone-800 leading-relaxed">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keywords */}
                {listingData.keywords && (
                  <div>
                    <label className="text-[10px] font-semibold text-[#9E9893] uppercase tracking-wide mb-1 block">
                      Keywords
                    </label>
                    <div className="flex items-start justify-between gap-2 p-3 rounded-lg bg-[#FAFAF8] border border-[#E5E2DA]">
                      <p className="text-[11.5px] text-[#6B6560] leading-relaxed">
                        {listingData.keywords}
                      </p>
                      <button
                        onClick={() => copyToClipboard(listingData.keywords || "", "keywords")}
                        className="p-1 hover:bg-white rounded shrink-0"
                      >
                        {copiedField === "keywords" ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3 text-[#B5B0AA]" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right column */}
              <div className="space-y-4">
                {/* Description */}
                {listingData.description && (
                  <div>
                    <label className="text-[10px] font-semibold text-[#9E9893] uppercase tracking-wide mb-1 block">
                      Description
                    </label>
                    <div className="p-3 rounded-lg bg-[#FAFAF8] border border-[#E5E2DA]">
                      <p className="text-[12px] text-stone-800 leading-relaxed whitespace-pre-wrap">
                        {listingData.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Specifications */}
                {specificationRows && specificationRows.length > 0 && (
                    <div>
                      <label className="text-[10px] font-semibold text-[#9E9893] uppercase tracking-wide mb-1 block">
                        Specifications
                      </label>
                      <div className="rounded-lg border border-[#E5E2DA] overflow-hidden">
                        {specificationRows.map(({ key, val }, i) => (
                          <div
                            key={`${key}-${i}`}
                            className={`flex items-center text-[11.5px] ${
                              i % 2 === 0 ? "bg-[#FAFAF8]" : "bg-white"
                            }`}
                          >
                            <span className="w-2/5 px-3 py-1.5 font-semibold text-[#6B6560] border-r border-[#E5E2DA]">
                              {key}
                            </span>
                            <span className="flex-1 px-3 py-1.5 text-stone-800">
                              {val}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Raw text fallback */}
            {listingData.raw_text && !listingData.title && (
              <div className="px-5 pb-5">
                <label className="text-[10px] font-semibold text-[#9E9893] uppercase tracking-wide mb-1 block">
                  Generated Listing
                </label>
                <div className="p-3 rounded-lg bg-[#FAFAF8] border border-[#E5E2DA]">
                  <pre className="text-[12px] text-stone-800 leading-relaxed whitespace-pre-wrap font-sans">
                    {listingData.raw_text}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ModelGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelect={handleGalleryModelSelect}
        source="model_faces"
        initialCategory="female"
      />
    </div>
  )
}
