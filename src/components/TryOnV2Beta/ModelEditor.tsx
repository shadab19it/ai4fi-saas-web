"use client"
import { useState, useRef, useMemo } from "react"
import { Plus, X, Download, Upload, ZoomIn, Sparkles, ChevronDown, Info } from "lucide-react"
import axios from "axios"
import appConstant from "../../services/appConstant"
import { dataURLtoFile } from "../../services/utils"
import commonService from "../../services/commonService"
import MultiSelect from "../common/MultiSelect"
import { IOption } from "../ModelGenerator/ModelConfigForm/ModelConfigForm"
import { toast } from "sonner"
import { defaultExt, downloadBlob, resizeImage, ResizeOptions } from "./resizeImage"
import JSZip from "jszip"
import {
  getAllFootwearOptions,
  getAllBackgroundOptions,
  getAllAccessoryOptions,
  getAllJewelryOptions
} from "./optionInputs"
import CollapsibleSidebar from "./layout/CollapsibleSidebar"
import Button from "../ui/Button"
import ZoomImageModal from "../ui/ZoomImageModal"

interface ModelEditorProps {
  selectedModel: string
  dressImage: string
  onBack: () => void
  onComplete: () => void
  gender: string
  tier?: "basic" | "professional"
  aspectRatio?: string
  resolution?: string
  width?: number
  height?: number
  segment?: string
  garmentCategory?: string
}

let FEMALE_POSES = [
  { id: "female-front-straight-arms", label: "Straight-On Arms Relaxed", description: "Female - Neutral and clean" },
  { id: "female-front-hands-hips", label: "Hands on Hips", description: "Female - Showcase garment fit" },
  { id: "female-front-crossed-arms", label: "Crossed Arms", description: "Female - Confident, structured look" },
  { id: "female-front-arms-lean", label: "Arms Down Slight Lean Forward", description: "Female - Focus on fabric and posture" },
  { id: "female-front-hand-waist-arm", label: "One Hand on Waist One Arm Relaxed", description: "Female - Gently angled pose" },
  { id: "female-front-smile-neutral", label: "Soft Smile Neutral Hands by Side", description: "Female - Subtle elegance" },
  { id: "female-front-hands-pockets", label: "Hands in Pockets", description: "Female - Casual, relaxed vibe" },
  { id: "female-front-leg-crossed", label: "Straight-On with One Leg Crossed", description: "Female - Dynamic stance" },
  { id: "female-front-hands-thighs", label: "Hands Resting on Thighs", description: "Female - Showcase lower garments like pants or skirts" },
  { id: "female-front-arm-across-chest", label: "One Arm Across Chest Other Arm Relaxed", description: "Female - Soft contrast" },
  { id: "female-front-lifting-leg", label: "Lifting One Leg Slightly", description: "Female - Focus on shoes or pants" },
  { id: "female-front-hip-shift", label: "Subtle Hip Shift", description: "Female - Slightly relaxed posture to emphasize clothing flow" },
  { id: "female-front-lean-side", label: "Slight Lean to One Side", description: "Female - Elegance with movement" },
  { id: "female-front-foot-forward", label: "Standing with One Foot Forward", description: "Female - Creates depth" },
  { id: "female-front-head-tilt", label: "Arms Hanging Slight Head Tilt", description: "Female - Casual, soft look" },
  { id: "female-front-hand-hair", label: "Hand in Hair Head Slightly Turned", description: "Female - Gives a feminine touch" },
  { id: "female-front-hands-thighs-legs", label: "Hands on Thighs Legs Together", description: "Female - Classic fashion model pose" },
  { id: "female-front-hand-hat-glasses", label: "Playful Hand on Hat or Glasses", description: "Female - Stylish accessory highlight" },
  { id: "female-front-smile-hands-waist", label: "Soft Smile with Hands Resting on Waist", description: "Female - Casual elegance" },
  { id: "female-front-arms-behind-head", label: "Arms Behind Head Relaxed", description: "Female - For showing dress or top length" },
  { id: "female-side-leg-forward", label: "Straight-On to Side One Leg Forward", description: "Female - Lean into the side, perfect for dresses" },
  { id: "female-side-hand-waist", label: "Profile with Hand on Waist", description: "Female - Emphasize silhouette" },
  { id: "female-side-arms-crossed", label: "Profile with Arms Crossed", description: "Female - Structured and confident" },
  { id: "female-side-hand-hip-shoulder", label: "Hand on Hip Look Over Shoulder", description: "Female - Creates depth and shape" },
  { id: "female-side-foot-forward", label: "Side Lean with One Foot Forward", description: "Female - Creates lines in pants/skirts" },
  { id: "female-side-hand-hair-shoulder", label: "One Hand in Hair Looking Over Shoulder", description: "Female - Feminine, soft look" },
  { id: "female-side-tilted-head-forward", label: "Body Slightly Tilted Head Facing Forward", description: "Female - Emphasizes garment details" },
  { id: "female-side-hand-neck-tilt", label: "Hand on Neck Head Slightly Tilted", description: "Female - Creates graceful posture" },
  { id: "female-side-lean-back-hands", label: "Lean Back Hands on Lower Back", description: "Female - Bold, strong silhouette" },
  { id: "female-side-leg-crossed", label: "Leg Crossed Over the Other", description: "Female - Gives posture and emphasizes dress length" },
  { id: "female-side-arm-raised", label: "One Arm Raised Over Head Looking Away", description: "Female - Power pose" },
  { id: "female-side-leg-forward-pocket", label: "Profile One Leg Forward with Arm in Pocket", description: "Female - Casual chic look" },
  { id: "female-side-crossed-arms-tilt", label: "Crossed Arms with Slight Head Tilt", description: "Female - Relaxed, confident stance" },
  { id: "female-side-full-side-hands", label: "Full Side Both Hands Relaxed by Sides", description: "Female - Straightforward, relaxed" },
  { id: "female-side-arm-waist-hip", label: "Side Profile One Arm Resting on Waist Slight Hip Out", description: "Female - Dynamic, bold" },
  { id: "female-side-hands-behind-shoulder", label: "Hands Resting Behind Looking Over Shoulder", description: "Female - Relaxed yet refined" },
  { id: "female-side-leaning-wall", label: "Leaning on Wall or Surface Looking Forward", description: "Female - Casual and stylish" },
  { id: "female-side-hand-chest-tilt", label: "Hand Resting on Chest Head Tilted", description: "Female - Graceful pose" },
  { id: "female-side-hand-hip-tilt", label: "One Hand on Hip Slight Tilt to the Side", description: "Female - Dynamic, accentuating shape" },
  { id: "female-side-hand-face", label: "Side Profile with Soft Hand on Face", description: "Female - Subtle elegance" },
  { id: "female-back-full-arms", label: "Full Back Arms Relaxed by Sides", description: "Female - Neutral, minimalist" },
  { id: "female-back-hands-hips-tall", label: "Hands on Hips Standing Tall", description: "Female - Emphasize back details, like dress/train" },
  { id: "female-back-head-over-shoulder", label: "Back to Camera Looking Over Shoulder", description: "Female - Adds a soft allure" },
  { id: "female-back-hands-behind-head", label: "Straight Back Hands Behind Head", description: "Female - Powerful and structured" },
  { id: "female-back-arms-behind-tilt", label: "Arms Behind Back Head Slightly Tilted", description: "Female - Graceful and poised" },
  { id: "female-back-arms-sides", label: "Back View Arms Resting by Sides", description: "Female - Simple, highlights garment flow" },
  { id: "female-back-foot-forward", label: "Standing Tall with One Foot Slightly Forward", description: "Female - Creates shape and flow" },
  { id: "female-back-shoulder-hands-behind", label: "Looking Over Shoulder with Hands Resting Behind", description: "Female - Gentle movement" },
  { id: "female-back-arm-raised", label: "Back View with One Arm Raised", description: "Female - For showing sleeve or shoulder detail" },
  { id: "female-back-hands-hips", label: "Full Back with Hands on Hips", description: "Female - Bold and powerful posture" },
]


let MALE_POSES = [
  { id: "male-front-straight-hands-sides", label: "Straight-On Hands by Sides", description: "Male - Clean and neutral" },
  { id: "male-front-hands-pockets-lean", label: "Hands in Pockets Slight Lean", description: "Male - Casual yet structured" },
  { id: "male-front-crossed-arms", label: "Crossed Arms", description: "Male - Confident, strong look" },
  { id: "male-front-hand-hip-relaxed", label: "One Hand on Hip Other Relaxed", description: "Male - Shows fit and silhouette" },
  { id: "male-front-standing-tall", label: "Standing Tall Shoulders Back", description: "Male - Bold and confident" },
  { id: "male-front-legs-apart-pockets", label: "Legs Slightly Apart Hands in Pockets", description: "Male - Relaxed stance" },
  { id: "male-front-hand-chest-tilt", label: "Hand on Chest Slight Head Tilt", description: "Male - Soft, introspective look" },
  { id: "male-front-leg-forward-hands", label: "One Leg Slightly Forward Hands by Sides", description: "Male - Dynamic, flattering angle" },
  { id: "male-front-arms-relaxed-lean", label: "Arms Relaxed Slight Lean Forward", description: "Male - Casual, approachable vibe" },
  { id: "male-front-straight-hip-out", label: "Straight-On with Slight Hip Out", description: "Male - Casual and confident" },
  { id: "male-front-hands-thighs", label: "Hands Resting on Thighs", description: "Male - Showcase lower garment details" },
  { id: "male-front-relaxed-hip-shift", label: "Relaxed Pose with Slight Hip Shift", description: "Male - Emphasizes fit and flow" },
  { id: "male-front-hand-collar-smile", label: "One Hand on Shirt Collar Soft Smile", description: "Male - Chic and relaxed" },
  { id: "male-front-arm-across-chest", label: "One Arm Across Chest Other Hanging", description: "Male - Balanced, relaxed posture" },
  { id: "male-front-hand-hair-tilt", label: "One Hand in Hair Slight Head Tilt", description: "Male - Stylish, relaxed vibe" },
  { id: "male-front-lean-forward", label: "Lean Forward Slightly Hands by Sides", description: "Male - Active and dynamic" },
  { id: "male-front-pockets-lean-side", label: "Hands in Pockets Slight Lean to One Side", description: "Male - Chill yet polished" },
  { id: "male-front-arms-relaxed-side", label: "Arms Relaxed Looking to the Side", description: "Male - Slightly neutral but confident" },
  { id: "male-front-arms-behind-lean", label: "Arms Behind Back Slightly Leaned", description: "Male - Elegant and composed" },
  { id: "male-front-hands-thighs-shoulders", label: "Hands Resting on Thighs Shoulders Back", description: "Male - Strong stance" },
  { id: "male-side-full-pockets", label: "Full Side Hands in Pockets", description: "Male - Casual, sleek look" },
  { id: "male-side-lean-leg-forward", label: "Side Lean with One Leg Forward", description: "Male - Stylized, focus on fit" },
  { id: "male-side-arm-across-chest", label: "One Arm Across Chest Other Relaxed", description: "Male - Strong yet balanced" },
  { id: "male-side-hand-hair", label: "Side Profile with Hand in Hair", description: "Male - Stylish and youthful" },
  { id: "male-side-foot-forward", label: "Side View One Foot Forward", description: "Male - Dynamic, emphasizing lines" },
  { id: "male-side-hand-neck-tilt", label: "Hand on Neck Head Tilted", description: "Male - Soft, natural vibe" },
  { id: "male-side-hand-waist-lean", label: "One Hand on Waist Side Lean", description: "Male - Powerful and confident" },
  { id: "male-side-head-turned", label: "Side Profile Head Slightly Turned Looking Forward", description: "Male - Gives a clean, polished feel" },
  { id: "male-side-relaxed-hands", label: "Relaxed Side Hands by Sides", description: "Male - Simple, clean lines" },
  { id: "male-side-hand-pocket", label: "One Hand Resting on Pocket Other Relaxed", description: "Male - Casual and approachable" },
  { id: "male-side-head-turned-smile", label: "Side Head Slightly Turned with Soft Smile", description: "Male - Friendly, approachable look" },
  { id: "male-side-hand-lower-back", label: "Hand Resting on Lower Back Slight Lean", description: "Male - Elegant, flowing pose" },
  { id: "male-side-crossed-arms", label: "Side Profile with Softly Crossed Arms", description: "Male - Structured and calm" },
  { id: "male-side-legs-crossed", label: "Legs Crossed at the Ankle Hands Relaxed", description: "Male - Casual and strong" },
  { id: "male-side-head-forward-hands", label: "Head Facing Forward Hands Relaxed by Sides", description: "Male - Neutral, balanced stance" },
  { id: "male-side-pocket-lean-back", label: "Hand Resting on Pocket Lean Back Slightly", description: "Male - Relaxed, confident stance" },
  { id: "male-side-foot-forward-arms-back", label: "One Foot Forward Arms Behind Back", description: "Male - Elegant, structured" },
  { id: "male-side-arched-back", label: "Relaxed Side Slightly Arched Back", description: "Male - Creates an appealing silhouette" },
  { id: "male-side-hands-waist", label: "Side Profile with Hands Resting on Waist", description: "Male - Strong, confident stance" },
  { id: "male-side-lean-distance", label: "Slight Lean Looking Off into Distance", description: "Male - Contemplative, stylish" },
  { id: "male-back-full-arms-relaxed", label: "Full Back Arms Relaxed by Sides", description: "Male - Neutral and clean" },
  { id: "male-back-hand-waist", label: "Back to Camera One Hand on Waist", description: "Male - Emphasizes body shape" },
  { id: "male-back-arms-behind", label: "Standing Tall with Arms Behind Back", description: "Male - Strong and composed" },
  { id: "male-back-leg-forward", label: "One Leg Slightly Forward Hands Relaxed by Sides", description: "Male - Dynamic and bold" },
  { id: "male-back-hands-lower-back", label: "Back View Hands on Lower Back", description: "Male - Elegant and poised" },
  { id: "male-back-head-over-shoulder", label: "Back to Camera Head Over Shoulder", description: "Male - Gives a soft yet confident look" },
  { id: "male-back-hands-pockets", label: "Full Back with Hands in Pockets", description: "Male - Relaxed yet confident" },
  { id: "male-back-arms-behind-head", label: "Arms Behind Head Slight Lean", description: "Male - Powerful, showcasing garment details" },
  { id: "male-back-arm-raised", label: "Back to Camera One Arm Raised", description: "Male - For showing jacket sleeve or detailing" },
  { id: "male-back-hand-collar", label: "Straight Back One Hand Resting on Collar or Neck", description: "Male - Casual elegance" },
]

export default function ModelEditor({ 
  selectedModel, 
  dressImage: _dressImage, 
  onBack, 
  onComplete: _onComplete, 
  gender,
  tier: propTier = "basic",
  aspectRatio: propAspectRatio,
  resolution: propResolution,
  width: propWidth,
  height: propHeight,
  segment: propSegment,
  garmentCategory: propGarmentCategory
}: ModelEditorProps) {
  const [poses, setPoses] = useState<string[]>([])
  const [footwear, setFootwear] = useState<string>("")
  const [background, setBackground] = useState<string>("")
  const [accessory, setAccessory] = useState<string>("")
  const [jewelry, setJewelry] = useState<string>("")
  const [tier, setTier] = useState<"basic" | "professional">(propTier)
  const [aspectRatio, setAspectRatio] = useState<string>(propAspectRatio || "")
  const [resolution, setResolution] = useState<string>(propResolution || "")
  const [showQualityAdvanced, setShowQualityAdvanced] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [newPose, setNewPose] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])

  const [downloadWidth, setDownloadWidth] = useState<string>("1024")
  const [downloadHeight, setDownloadHeight] = useState<string>("1280")
  const [downloadRatio, setDownloadRatio] = useState<string>("custom")
  const [fitMode, setFitMode] = useState<"contain" | "cover" | "stretch">("contain")
  const [isDownloading, setIsDownloading] = useState<{ index: number | undefined, isDownloading: boolean }>({ index: undefined, isDownloading: false })

  const [replacedModel, setReplacedModel] = useState<string | null>(null)
  const [isHoveringModel, setIsHoveringModel] = useState(false)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentModel = replacedModel || selectedModel


  const handleAddPose = () => {
    if (poses.length >= 8) {
      toast.info("Maximum 8 poses reached")
      return
    }
    if (newPose.trim()) {
      const normalized = newPose.trim().toLowerCase()
      if (!poses.includes(normalized)) {
        setPoses([...poses, normalized])
        setNewPose("")
      } else {
        toast.info("Pose already exists")
      }
    }

    if (gender === "female") {
      FEMALE_POSES.push({ id: `${new Date().getTime()}`, label: newPose, description: newPose })
    } else {
      MALE_POSES.push({ id: `${new Date().getTime()}`, label: newPose, description: newPose })
    }
  }

  const handleRatioChange = (ratio: string) => {
    setDownloadRatio(ratio)
    const ratios: Record<string, [number, number]> = {
      "1:1": [1024, 1024],
      "4:5": [1024, 1280],
      "9:16": [1080, 1920],
      "16:9": [1920, 1080],
      "3:4": [768, 1024],
    }
    if (ratio !== "custom" && ratios[ratio]) {
      const [w, h] = ratios[ratio]
      setDownloadWidth(w.toString())
      setDownloadHeight(h.toString())
    }
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.info("Please select an image file")
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setReplacedModel(result)
      }
      reader.onerror = () => {
        toast.error("Failed to read image file")
      }
      reader.readAsDataURL(file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveReplacement = () => {
    setReplacedModel(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleGeneratePoses = async () => {
    if (!currentModel) {
      toast.info("No model selected")
      return
    }

    setIsGenerating(true)
    try {
      let modelFile: File | Blob

      if (currentModel.startsWith("data:")) {
        modelFile = dataURLtoFile(currentModel, `model-${Date.now()}.jpg`)
      } else if (currentModel.startsWith("http://") || currentModel.startsWith("https://")) {
        const blob = await commonService.downloadSingleFile(currentModel)
        const filename = currentModel.split('/').pop()?.split('?')[0] || `model-${Date.now()}.jpg`
        modelFile = new File([blob], filename, { type: blob.type || "image/jpeg" })
      } else {
        modelFile = dataURLtoFile(currentModel, `model-${Date.now()}.jpg`)
      }

      const formData = new FormData()
      formData.append("file", modelFile)

      if (poses.length > 0) {
        formData.append("poses", poses.join(","))
      }
      if (footwear) formData.append("footwear", footwear)
      if (background) formData.append("background", background)
      if (accessory) formData.append("accessory", accessory)
      if (jewelry) formData.append("jewelry", jewelry)

      formData.append("tier", tier)

      if (tier === "professional") {
        if (aspectRatio) formData.append("aspect_ratio", aspectRatio)
        if (resolution) formData.append("resolution", resolution.toUpperCase())
        if (propWidth) formData.append("width", propWidth.toString())
        if (propHeight) formData.append("height", propHeight.toString())
        if (propSegment) formData.append("segment", propSegment)
        if (propGarmentCategory) formData.append("garment_category", propGarmentCategory)
      }

      const token = localStorage.getItem(appConstant.JWT_AUTH_TOKEN)

      const response = await axios.post(
        `${appConstant.BACKEND_API_URL}/generate/generate-pose-variants-beta`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token && { Authorization: token }),
          },
        }
      )

      if (response.data && response.data.urls && response.data.urls.length > 0) {
        setGeneratedImages(response.data.urls)
      } else {
        throw new Error("No image URLs returned from API")
      }
    } catch (error: any) {
      console.error("Error generating poses:", error)
      toast.error(error?.response?.data?.message || error?.message || "Failed to generate poses. Please try again.")
      setGeneratedImages([])
    } finally {
      setIsGenerating(false)
    }
  }


  const handleDownload = async (imageIndex?: number) => {
    if (generatedImages.length === 0) {
      toast.info("No images to download")
      return
    }
    setIsDownloading({ index: imageIndex, isDownloading: true })
    try {
      const w = Number(downloadWidth)
      const h = Number(downloadHeight)

      if (isNaN(w) || w <= 0 || !isFinite(w)) {
        toast.error("Invalid width. Please enter a valid positive number.")
        return
      }
      if (isNaN(h) || h <= 0 || !isFinite(h)) {
        toast.error("Invalid height. Please enter a valid positive number.")
        return
      }

      const opts: ResizeOptions = {
        width: Math.round(w),
        height: Math.round(h),
        keepAspect: false,
        fit: fitMode,
        mimeType: "image/png",
        quality: 0.92,
        background: fitMode === "contain" ? "#FFFFFF" : "#00000000",
      };

      if (imageIndex !== undefined) {
        const image = generatedImages[imageIndex]
        const blob = await commonService.downloadSingleFile(image)
        const resizeBlob = await resizeImage(blob, opts);
        const ext = defaultExt(opts.mimeType || "image/png");
        downloadBlob(resizeBlob, `ai4fi-pose-${imageIndex + 1}-${Date.now()}.${ext}`);
        return
      }

      const imageBlobs = await Promise.all(
        generatedImages.map(async (image) => {
          const blob = await commonService.downloadSingleFile(image)
          return await resizeImage(blob, opts)
        })
      )

      const zip = new JSZip()
      imageBlobs.forEach((blob, index) => {
        const ext = defaultExt(opts.mimeType || "image/png")
        zip.file(`ai4fi-pose-${index + 1}.${ext}`, blob)
      })

      const zipBlob = await zip.generateAsync({ type: "blob" })
      downloadBlob(zipBlob, `ai4fi-poses-${w}x${h}-${Date.now()}.zip`)
    } catch (error: any) {
      console.error("Error downloading poses:", error)
      toast.error(error?.response?.data?.message || error?.message || "Failed to download poses. Please try again.")
    } finally {
      setIsDownloading({ index: undefined, isDownloading: false })
    }
  }

  const getPoses = () => {
    return gender === "female" ? FEMALE_POSES : MALE_POSES
  }

  const footwearOptionsList = useMemo(() => getAllFootwearOptions(gender), [gender])
  const backgroundOptionsList = useMemo(() => getAllBackgroundOptions(), [])
  const accessoryOptionsList = useMemo(() => getAllAccessoryOptions(gender), [gender])
  const jewelryOptionsList = useMemo(() => getAllJewelryOptions(gender), [gender])

  // Helper for select styling
  const selectClass = "w-full px-3 py-2.5 pr-10 rounded-xl bg-white border border-[#E5E2DA] text-stone-900 text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all appearance-none cursor-pointer"
  const labelClass = "flex items-center gap-2 text-[11.5px] font-semibold text-[#6B6560] mb-2"

  return (
    <div className="min-h-[calc(100vh-180px)] px-4 pb-8 pt-6">
      <div className="w-full">
        {/* Main Content - Two Column Layout */}
        <div className="flex flex-col xl:flex-row gap-6 items-start">
          {/* Left - Selected Model Image */}
          <div className="flex flex-col w-full flex-1 order-2 xl:order-2">
            <div className="rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] p-5 lg:p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                    <Sparkles className="w-4.5 h-4.5 text-violet-500" />
                  </div>
                  <h3 className="text-[14px] font-bold text-stone-900">Selected Model with Dress</h3>
                </div>
                {replacedModel && (
                  <button
                    onClick={handleRemoveReplacement}
                    className="text-[11px] text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-50 font-semibold"
                  >
                    <X className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>
              <div className="flex-1 flex items-start justify-center">
                <div
                  className="relative rounded-xl overflow-hidden border border-[#E5E2DA] bg-[#F9F8F5] group cursor-pointer w-full flex items-center justify-center min-h-[400px]"
                  onMouseEnter={() => setIsHoveringModel(true)}
                  onMouseLeave={() => setIsHoveringModel(false)}
                >
                  <img
                    src={currentModel || "/placeholder.svg"}
                    alt="Selected model"
                    className="w-full h-full object-contain max-h-[500px] transition-opacity duration-300"
                    style={{ opacity: isHoveringModel ? 0.7 : 1 }}
                    onClick={() => {
                      if (currentModel) {
                        setZoomedImage(currentModel)
                        setIsZoomOpen(true)
                      }
                    }}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  {isHoveringModel && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-6 gap-3 transition-opacity duration-300">
                      <Button
                        variant="outline"
                        size="md"
                        icon={<Upload className="w-3.5 h-3.5" />}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUploadClick()
                        }}
                        className="bg-white/90 backdrop-blur-sm hover:bg-white"
                      >
                        {replacedModel ? "Replace" : "Upload"}
                      </Button>
                      <Button
                        variant="outline"
                        size="md"
                        icon={<ZoomIn className="w-3.5 h-3.5" />}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (currentModel) {
                            setZoomedImage(currentModel)
                            setIsZoomOpen(true)
                          }
                        }}
                        className="bg-white/90 backdrop-blur-sm hover:bg-white"
                      >
                        Zoom
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right - Configuration Cards */}
          <CollapsibleSidebar
            collapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
            expandedWidthClass="xl:w-[380px]"
          >
          <div className="flex flex-col gap-4">
            {/* Poses Configuration Card */}
            <div className="rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-violet-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[14px] font-bold text-stone-900">Poses Configuration</h3>
                  <p className="text-[11.5px] text-[#9E9893] mt-0.5 font-medium">Select up to 8 poses ({poses.length}/8 selected)</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Predefined Poses Select */}
                <div className="relative">
                  <label className={labelClass}>
                    Select Predefined Poses
                  </label>
                  <MultiSelect
                    options={[...getPoses().map((pose) => ({
                      value: pose.label.toLowerCase(),
                      label: `${pose.label}`
                    }))]}
                    noOfposes={8 - poses.filter((pose) =>
                      !getPoses().some((p) => p.label.toLowerCase() === pose)
                    ).length}
                    onChange={(selectedOptions: IOption[]) => {
                      const selectedPredefinedPoses = selectedOptions.map((option: IOption) => option.value)
                      const customPoses = poses.filter((pose) =>
                        !getPoses().some((p) => p.label.toLowerCase() === pose)
                      )
                      setPoses([...customPoses, ...selectedPredefinedPoses].slice(0, 8))
                    }}
                    selectedPoses={poses}
                  />
                </div>

                {/* Custom Pose Input */}
                <div>
                  <label className={labelClass}>Or Add Custom Pose</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPose}
                      onChange={(e) => setNewPose(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddPose()}
                      placeholder="Enter custom pose (e.g., stretching, leaning)"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E5E2DA] bg-white text-stone-900 text-[13px] placeholder-[#9E9893] focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                    />
                    <Button
                      variant="gradient"
                      size="md"
                      onClick={handleAddPose}
                      disabled={!newPose.trim() || poses.length >= 8}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-violet-500" />
                </div>
                <h3 className="text-[14px] font-bold text-stone-900">Additional Options</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Footwear */}
              <div>
                <label className={labelClass}>
                  Footwear
                  <span className="text-[#9E9893] text-[10px] font-normal normal-case">(Optional)</span>
                  <div className="group relative">
                    <Info className="w-3.5 h-3.5 text-[#9E9893] cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-stone-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-10">
                      Select footwear style for the model
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-stone-900"></div>
                    </div>
                  </div>
                </label>
                <div className="relative">
                  <select
                    value={footwear}
                    onChange={(e) => setFootwear(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select footwear...</option>
                    {footwearOptionsList.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9E9893] pointer-events-none" />
                </div>
              </div>

              {/* Background */}
              <div>
                <label className={labelClass}>
                  Background
                  <span className="text-[#9E9893] text-[10px] font-normal normal-case">(Optional)</span>
                  <div className="group relative">
                    <Info className="w-3.5 h-3.5 text-[#9E9893] cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-stone-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-10">
                      Choose background setting for the image
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-stone-900"></div>
                    </div>
                  </div>
                </label>
                <div className="relative">
                  <select
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select background...</option>
                    {backgroundOptionsList.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9E9893] pointer-events-none" />
                </div>
              </div>

              {/* Accessory */}
              <div>
                <label className={labelClass}>
                  Accessory
                  <span className="text-[#9E9893] text-[10px] font-normal normal-case">(Optional)</span>
                  <div className="group relative">
                    <Info className="w-3.5 h-3.5 text-[#9E9893] cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-stone-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-10">
                      Select accessories to add to the model
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-stone-900"></div>
                    </div>
                  </div>
                </label>
                <div className="relative">
                  <select
                    value={accessory}
                    onChange={(e) => setAccessory(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select accessory...</option>
                    {accessoryOptionsList.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9E9893] pointer-events-none" />
                </div>
              </div>

              {/* Jewelry */}
              <div>
                <label className={labelClass}>
                  Jewelry
                  <span className="text-[#9E9893] text-[10px] font-normal normal-case">(Optional)</span>
                  <div className="group relative">
                    <Info className="w-3.5 h-3.5 text-[#9E9893] cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-stone-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-10">
                      Choose jewelry pieces for the model
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-stone-900"></div>
                    </div>
                  </div>
                </label>
                <div className="relative">
                  <select
                    value={jewelry}
                    onChange={(e) => setJewelry(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select jewelry...</option>
                    {jewelryOptionsList.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9E9893] pointer-events-none" />
                </div>
              </div>
              </div>
            </div>

            {/* Quality Tier */}
            <div className="rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-violet-500" />
                </div>
                <h3 className="text-[14px] font-bold text-stone-900">Quality Settings</h3>
              </div>

              <div className="mb-4">
                <label className="block text-[11.5px] font-semibold text-[#6B6560] mb-3">Quality Tier</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setTier("basic")
                      setAspectRatio("")
                      setResolution("")
                      setShowQualityAdvanced(false)
                    }}
                    className={`px-4 py-3 rounded-xl border-2 transition-all text-left ${
                      tier === "basic"
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 border-violet-500 text-white shadow-[0_4px_12px_rgba(99,102,241,0.25)]"
                        : "bg-white border-[#E5E2DA] text-[#6B6560] hover:border-[#9E9893] hover:bg-[#F9F8F5]"
                    }`}
                  >
                    <div className="text-[13px] font-bold">Basic</div>
                    <div className="text-[11px] opacity-75 mt-0.5">Standard Quality</div>
                  </button>
                  <button
                    onClick={() => {
                      setTier("professional")
                      setShowQualityAdvanced(true)
                    }}
                    className={`px-4 py-3 rounded-xl border-2 transition-all text-left ${
                      tier === "professional"
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 border-violet-500 text-white shadow-[0_4px_12px_rgba(99,102,241,0.25)]"
                        : "bg-white border-[#E5E2DA] text-[#6B6560] hover:border-[#9E9893] hover:bg-[#F9F8F5]"
                    }`}
                  >
                    <div className="text-[13px] font-bold">Professional</div>
                    <div className="text-[11px] opacity-75 mt-0.5">High Quality</div>
                  </button>
                </div>
              </div>

              {/* Professional Tier Options */}
              {tier === "professional" && (
                <div className="rounded-xl border border-violet-200 bg-violet-50/50">
                  <button
                    onClick={() => setShowQualityAdvanced(!showQualityAdvanced)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-violet-500" />
                      <span className="text-[13px] font-bold text-violet-700">Professional Options</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-violet-500 transition-transform ${showQualityAdvanced ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showQualityAdvanced && (
                    <div className="space-y-4 px-4 pb-4">
                      <div>
                        <label className="block text-[11.5px] font-semibold text-[#6B6560] mb-2">Aspect Ratio</label>
                        <div className="relative">
                          <select
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value)}
                            className={selectClass}
                          >
                            <option value="">Default</option>
                            <option value="1:1">1:1 (Square)</option>
                            <option value="4:5">4:5 (Portrait)</option>
                            <option value="9:16">9:16 (Vertical)</option>
                            <option value="16:9">16:9 (Landscape)</option>
                            <option value="3:4">3:4 (Portrait)</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9E9893] pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11.5px] font-semibold text-[#6B6560] mb-2">Resolution</label>
                        <div className="relative">
                          <select
                            value={resolution}
                            onChange={(e) => setResolution(e.target.value)}
                            className={selectClass}
                          >
                            <option value="">Default</option>
                            <option value="1K">1K</option>
                            <option value="2K">2K</option>
                            <option value="4K">4K</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9E9893] pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          </CollapsibleSidebar>
        </div>

        {/* Generated Images Preview */}
        {generatedImages.length > 0 && (
          <div className="mt-8">
            <div className="rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-violet-500" />
                </div>
                <h3 className="text-[14px] font-bold text-stone-900">Generated Images</h3>
                <span className="ml-auto text-[12px] text-[#9E9893] font-medium">({generatedImages.length} images)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {generatedImages.map((img, idx) => (
                  <div key={idx} className="space-y-3">
                    <div
                      className="rounded-xl overflow-hidden border border-[#E5E2DA] bg-[#F9F8F5] relative group cursor-pointer aspect-square"
                      onClick={() => {
                        setZoomedImage(img)
                        setIsZoomOpen(true)
                      }}
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Generated pose ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                        <div className="bg-white/90 backdrop-blur-sm border border-[#E5E2DA] text-stone-900 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                          <ZoomIn className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-semibold">Zoom</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => handleDownload(idx)}
                      loading={isDownloading.index === idx && isDownloading.isDownloading}
                      icon={!(isDownloading.index === idx && isDownloading.isDownloading) ? <Download className="w-3.5 h-3.5" /> : undefined}
                      className="w-full"
                    >
                      {isDownloading.index === idx && isDownloading.isDownloading ? "Downloading..." : "Download"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Download with Custom Size */}
        {generatedImages.length > 0 && (
          <div className="mt-6">
            <div className="rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Download className="w-4.5 h-4.5 text-violet-500" />
                </div>
                <h3 className="text-[14px] font-bold text-stone-900">Download with Custom Size</h3>
              </div>
              <div className="space-y-4">
                {/* Ratio Presets */}
                <div>
                  <label className="block text-[11.5px] font-semibold text-[#6B6560] mb-3">Aspect Ratio</label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {["1:1", "4:5", "9:16", "16:9", "3:4"].map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => handleRatioChange(ratio)}
                        className={`px-3 py-2 rounded-xl text-[12px] font-semibold transition-all ${
                          downloadRatio === ratio
                            ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-2 border-violet-500 shadow-[0_2px_8px_rgba(99,102,241,0.25)]"
                            : "border-2 border-[#E5E2DA] bg-white text-[#6B6560] hover:border-[#9E9893] hover:bg-[#F9F8F5]"
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                    <button
                      onClick={() => setDownloadRatio("custom")}
                      className={`px-3 py-2 rounded-xl text-[12px] font-semibold transition-all ${
                        downloadRatio === "custom"
                          ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-2 border-violet-500 shadow-[0_2px_8px_rgba(99,102,241,0.25)]"
                          : "border-2 border-[#E5E2DA] bg-white text-[#6B6560] hover:border-[#9E9893] hover:bg-[#F9F8F5]"
                      }`}
                    >
                      Custom
                    </button>
                  </div>
                </div>

                {/* Fit Mode Selector */}
                <div>
                  <label className="block text-[11.5px] font-semibold text-[#6B6560] mb-3">Resize Mode</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["contain", "cover", "stretch"] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setFitMode(mode)}
                        className={`px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-all capitalize ${
                          fitMode === mode
                            ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-2 border-violet-500 shadow-[0_2px_8px_rgba(99,102,241,0.25)]"
                            : "border-2 border-[#E5E2DA] bg-white text-[#6B6560] hover:border-[#9E9893] hover:bg-[#F9F8F5]"
                        }`}
                        title={
                          mode === "contain" ? "Fits entire image without cropping (may have padding)" :
                          mode === "cover" ? "Fills entire area (may crop image)" :
                          "Stretches to exact dimensions (may distort)"
                        }
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Dimensions */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11.5px] font-semibold text-[#6B6560] mb-2">Width (px)</label>
                    <input
                      type="number"
                      value={downloadWidth}
                      onChange={(e) => {
                        setDownloadWidth(e.target.value)
                        setDownloadRatio("custom")
                      }}
                      min="256"
                      max="4096"
                      step="256"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E2DA] bg-white text-stone-900 text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11.5px] font-semibold text-[#6B6560] mb-2">Height (px)</label>
                    <input
                      type="number"
                      value={downloadHeight}
                      onChange={(e) => {
                        setDownloadHeight(e.target.value)
                        setDownloadRatio("custom")
                      }}
                      min="256"
                      max="4096"
                      step="256"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E2DA] bg-white text-stone-900 text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                    />
                  </div>
                </div>

                {/* Download All Button */}
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={() => handleDownload(undefined)}
                  loading={isDownloading.index === undefined && isDownloading.isDownloading}
                  icon={!(isDownloading.index === undefined && isDownloading.isDownloading) ? <Download className="w-4 h-4" /> : undefined}
                  className="w-full"
                >
                  {isDownloading.index === undefined && isDownloading.isDownloading
                    ? "Downloading All..."
                    : `Download All (${downloadWidth}x${downloadHeight})`
                  }
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <Button variant="outline" size="lg" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button
            variant="gradient"
            size="lg"
            onClick={handleGeneratePoses}
            disabled={isGenerating || poses.length === 0}
            loading={isGenerating}
            icon={!isGenerating ? <Sparkles className="w-4 h-4" /> : undefined}
            className="flex-1"
          >
            {isGenerating ? "Generating..." : "Generate Poses"}
          </Button>
        </div>
      </div>

      {/* Zoom Modal */}
      <ZoomImageModal
        open={isZoomOpen}
        onClose={() => {
          setIsZoomOpen(false)
          setZoomedImage(null)
        }}
        images={
          generatedImages.length > 0
            ? [currentModel, ...generatedImages].filter(Boolean) as string[]
            : currentModel
              ? [currentModel]
              : []
        }
        initialIndex={
          zoomedImage
            ? Math.max(
                0,
                (generatedImages.length > 0
                  ? [currentModel, ...generatedImages]
                  : [currentModel]
                ).indexOf(zoomedImage)
              )
            : 0
        }
        alt="Pose preview"
      />
    </div>
  )
}
