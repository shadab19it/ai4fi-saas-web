"use client"
import { useState, useRef } from "react"
import { ArrowLeft, Plus, X, Download, Loader2, Upload, ZoomIn } from "lucide-react"
import axios from "axios"
import appConstant from "../../services/appConstant"
import { dataURLtoFile } from "../../services/utils"
import commonService from "../../services/commonService"
import MultiSelect from "../common/MultiSelect"
import { IOption } from "../ModelGenerator/ModelConfigForm/ModelConfigForm"
import { toast } from "sonner"
import { defaultExt, downloadBlob, resizeImage, ResizeOptions } from "./resizeImage"
import JSZip from "jszip"

interface ModelEditorProps {
  selectedModel: string
  dressImage: string
  onBack: () => void
  onComplete: () => void
  gender: string
}

let FEMALE_POSES = [
  // Female - Front Poses
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

  // Female - Side Profile Poses
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

  // Female - Back Poses
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
  // Male - Front Poses
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
  // Male - Side Profile Poses
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

  // Male - Back Poses
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

export default function ModelEditor({ selectedModel, dressImage, onBack, onComplete, gender }: ModelEditorProps) {
  const [poses, setPoses] = useState<string[]>([])
  const [posePromptOverride, setPosePromptOverride] = useState<string>("")
  const [useCustomPosePrompt, setUseCustomPosePrompt] = useState(false)
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

  // Use replaced model if available, otherwise use selectedModel prop
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

  console.log("new", newPose)


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
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.info("Please select an image file")
        return
      }

      // Read file as data URL
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
    // Reset input so same file can be selected again
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

      // Check if currentModel is a data URL or a regular URL
      if (currentModel.startsWith("data:")) {
        modelFile = dataURLtoFile(currentModel, `model-${Date.now()}.jpg`)
      } else if (currentModel.startsWith("http://") || currentModel.startsWith("https://")) {
        const blob = await commonService.downloadSingleFile(currentModel)
        // Convert Blob to File
        const filename = currentModel.split('/').pop()?.split('?')[0] || `model-${Date.now()}.jpg`
        modelFile = new File([blob], filename, { type: blob.type || "image/jpeg" })
      } else {
        // Fallback: treat as data URL
        modelFile = dataURLtoFile(currentModel, `model-${Date.now()}.jpg`)
      }

      // Create FormData
      const formData = new FormData()
      formData.append("file", modelFile)

      // Add poses array - can be added multiple times or as comma-separated values
      poses.forEach((pose) => {
        formData.append("poses", pose)
      })

      if (useCustomPosePrompt && posePromptOverride) {
        formData.append("pose_prompt_override", posePromptOverride)
      }

      // Get token from localStorage
      const token = localStorage.getItem(appConstant.JWT_AUTH_TOKEN)

      // Make API call
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

      // Handle response
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
      // Validate dimensions
      const width = Number(downloadWidth)
      const height = Number(downloadHeight)

      if (isNaN(width) || width <= 0 || !isFinite(width)) {
        toast.error("Invalid width. Please enter a valid positive number.")
        return
      }

      if (isNaN(height) || height <= 0 || !isFinite(height)) {
        toast.error("Invalid height. Please enter a valid positive number.")
        return
      }

      const opts: ResizeOptions = {
        width: Math.round(width),
        height: Math.round(height),
        keepAspect: false,
        fit: fitMode,
        mimeType: "image/png",
        quality: 0.92,
        background: fitMode === "contain" ? "#FFFFFF" : "#00000000",
      };

      // Download single image with custom size
      if (imageIndex !== undefined) {
        const image = generatedImages[imageIndex]
        const blob = await commonService.downloadSingleFile(image)
        const resizeBlob = await resizeImage(blob, opts);
        const ext = defaultExt(opts.mimeType || "image/png");
        downloadBlob(resizeBlob, `ai4fi-pose-${imageIndex + 1}-${Date.now()}.${ext}`);
        return
      }

      // Download all images with custom size
      const imageBlobs = await Promise.all(
        generatedImages.map(async (image) => {
          const blob = await commonService.downloadSingleFile(image)
          return await resizeImage(blob, opts)
        })
      )

      // Create a zip file from all resized images
      const zip = new JSZip()

      imageBlobs.forEach((blob, index) => {
        const ext = defaultExt(opts.mimeType || "image/png")
        zip.file(`ai4fi-pose-${index + 1}.${ext}`, blob)
      })

      const zipBlob = await zip.generateAsync({ type: "blob" })
      downloadBlob(zipBlob, `ai4fi-poses-${width}x${height}-${Date.now()}.zip`)
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

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-3xl font-bold text-white mb-2">Step 3: Generate Poses</h1>
            <p className="text-gray-500">Configure poses and generate multiple variations</p>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 text-white hover:bg-gray-700/30 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Selected Model Image */}
          <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Selected Model with Dress</h3>
                {replacedModel && (
                  <button
                    onClick={handleRemoveReplacement}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>
              <div
                className="relative rounded-lg overflow-hidden border border-gray-800 bg-gray-800/20 group cursor-pointer"
                onMouseEnter={() => setIsHoveringModel(true)}
                onMouseLeave={() => setIsHoveringModel(false)}
              >
                <img
                  src={currentModel || "/placeholder.svg"}
                  alt="Selected model"
                  className="w-full h-auto max-h-96 object-contain transition-opacity duration-300"
                  style={{ opacity: isHoveringModel ? 0.7 : 1 }}
                  onClick={() => {
                    if (currentModel) {
                      setZoomedImage(currentModel)
                      setIsZoomOpen(true)
                    }
                  }}
                />
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                {/* Hover overlay with upload and zoom options */}
                {isHoveringModel && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUploadClick()
                      }}
                      className="flex flex-col items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
                    >
                      <Upload className="w-5 h-5 text-white" />
                      <p className="text-white text-xs font-medium">
                        {replacedModel ? "Replace" : "Upload"}
                      </p>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (currentModel) {
                          setZoomedImage(currentModel)
                          setIsZoomOpen(true)
                        }
                      }}
                      className="flex flex-col items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
                    >
                      <ZoomIn className="w-5 h-5 text-white" />
                      <p className="text-white text-xs font-medium">Zoom</p>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right - Pose Configuration */}
          <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Poses Configuration</h3>

              <div className="space-y-4">
                {/* Selected Poses List
                {poses.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-white mb-3">
                      Selected Poses ({poses.length}/8)
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {poses.map((pose, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-700/30 rounded-lg p-3 border border-gray-700"
                        >
                          <span className="text-sm text-white capitalize">{pose}</span>
                          <button
                            onClick={() => handleRemovePose(index)}
                            className="text-red-400 hover:text-red-400/80 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}

                {/* Predefined Poses Select */}

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Select Predefined Poses (max {8 - poses.length} remaining)
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
                      // Combine custom poses with selected predefined poses
                      setPoses([...customPoses, ...selectedPredefinedPoses].slice(0, 8))
                    }}
                    selectedPoses={poses}
                  />
                </div>


                {/* Custom Pose Input */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Or Add Custom Pose</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPose}
                      onChange={(e) => setNewPose(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddPose()}
                      placeholder="Enter custom pose (e.g., stretching, leaning)"
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    />
                    <button
                      onClick={handleAddPose}
                      disabled={!newPose.trim()}
                      className="px-3 py-2 rounded-lg border border-white text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Pose Prompt Override */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <label className="block text-sm font-medium text-white mb-3">
                Pose Prompt Settings
              </label>
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
                    className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 focus:ring-purple-600 focus:ring-2"
                  />
                  <span className="text-white group-hover:text-purple-300 transition-colors">AI Recommended</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="posePromptType"
                    checked={useCustomPosePrompt}
                    onChange={() => setUseCustomPosePrompt(true)}
                    className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 focus:ring-purple-600 focus:ring-2"
                  />
                  <span className="text-white group-hover:text-purple-300 transition-colors">Custom Prompt</span>
                </label>
              </div>
              {useCustomPosePrompt && (
                <div className="mt-3">
                  <textarea
                    rows={3}
                    value={posePromptOverride}
                    onChange={(e) => setPosePromptOverride(e.target.value)}
                    placeholder="Enter custom pose description or prompt..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all resize-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Generated Images Preview */}
        {generatedImages.length > 0 && (
          <div className="mt-8">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Generated Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {generatedImages.map((img, idx) => (
                  <div key={idx} className="space-y-3">
                    <div
                      className="rounded-lg overflow-hidden border border-gray-700 bg-gray-700/20 relative group cursor-pointer"
                      onClick={() => {
                        setZoomedImage(img)
                        setIsZoomOpen(true)
                      }}
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Generated pose ${idx + 1}`}
                        className="w-full h-auto max-h-48 object-contain"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ZoomIn className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(idx)}
                      disabled={isDownloading.index === idx && isDownloading.isDownloading}
                      className="w-full border border-gray-500 text-white hover:bg-gray-900/50  font-semibold px-2 py-1 rounded-lg gap-2 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDownloading.index === idx && isDownloading.isDownloading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Download
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {generatedImages.length > 0 && (
          <div className="mt-8">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <h3 className="text-base font-semibold text-white mb-3">Download with Custom Size</h3>
              <div className="space-y-3">
                {/* Ratio Presets */}
                <div>
                  <label className="block text-xs font-medium text-white mb-2">Aspect Ratio</label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5">
                    {["1:1", "4:5", "9:16", "16:9", "3:4"].map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => handleRatioChange(ratio)}
                        className={`px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors ${downloadRatio === ratio
                          ? "text-white bg-gray-900/50 border border-gray-300"
                          : "border border-gray-700 text-white hover:bg-gray-700/30"
                          }`}
                      >
                        {ratio}
                      </button>
                    ))}
                    <button
                      onClick={() => setDownloadRatio("custom")}
                      className={`px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors ${downloadRatio === "custom"
                        ? "bg-white text-gray-800"
                        : "border border-gray-700 text-white hover:bg-gray-700/30"
                        }`}
                    >
                      Custom
                    </button>
                  </div>
                </div>

                {/* Fit Mode Selector */}
                <div>
                  <label className="block text-xs font-medium text-white mb-2">Resize Mode</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setFitMode("contain")}
                      className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${fitMode === "contain"
                        ? "bg-white text-gray-800 border border-gray-300"
                        : "border border-gray-700 text-white hover:bg-gray-700/30"
                        }`}
                      title="Fits entire image without cropping (may have padding)"
                    >
                      Contain
                    </button>
                    <button
                      onClick={() => setFitMode("cover")}
                      className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${fitMode === "cover"
                        ? "bg-white text-gray-800 border border-gray-300"
                        : "border border-gray-700 text-white hover:bg-gray-700/30"
                        }`}
                      title="Fills entire area (may crop image)"
                    >
                      Cover
                    </button>
                    <button
                      onClick={() => setFitMode("stretch")}
                      className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${fitMode === "stretch"
                        ? "bg-white text-gray-800 border border-gray-300"
                        : "border border-gray-700 text-white hover:bg-gray-700/30"
                        }`}
                      title="Stretches to exact dimensions (may distort)"
                    >
                      Stretch
                    </button>
                  </div>
                </div>

                {/* Custom Dimensions */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-white mb-1.5">Width (px)</label>
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
                      className="w-full px-2.5 py-1.5 text-sm rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white mb-1.5">Height (px)</label>
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
                      className="w-full px-2.5 py-1.5 text-sm rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                </div>

                {/* Download All Button */}
                <button
                  onClick={() => handleDownload(undefined)}
                  disabled={isDownloading.index === undefined && isDownloading.isDownloading}
                  className="w-full bg-white hover:bg-white/90 text-gray-800 font-semibold py-2.5 rounded-lg gap-2 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isDownloading.index === undefined && isDownloading.isDownloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Downloading All...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download All ({downloadWidth}x{downloadHeight})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-700 text-white hover:bg-gray-700/30 transition-colors font-medium"
          >
            Back
          </button>
          <button
            onClick={handleGeneratePoses}
            disabled={isGenerating}
            className="flex-1 bg-gradient-to-r flex items-center justify-center gap-2 from-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-800 text-white  px-4 py-2  rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Poses"
            )}
          </button>
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomOpen && zoomedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => {
            setIsZoomOpen(false)
            setZoomedImage(null)
          }}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={zoomedImage}
              alt="Zoomed preview"
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => {
                setIsZoomOpen(false)
                setZoomedImage(null)
              }}
              className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
