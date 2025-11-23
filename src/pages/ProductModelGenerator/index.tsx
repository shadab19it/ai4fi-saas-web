
import { FC, useState } from "react"
import ProductUpload from "../../components/ProductModelGenerator/ProductUpload"
import GeneratedOutput from "../../components/ProductModelGenerator/GeneratedOutput"
import DownloadOptions from "../../components/ProductModelGenerator/DownloadOptions"
import { Link } from "react-router-dom"
import { Sparkles } from "lucide-react"
import DarkLogo from "../../../public/dark-logo.png"

type Step = "upload" | "generating" | "output"

const ProductGeneratorPage: FC = () => {
  const [step, setStep] = useState<Step>("upload")
  const [productImage, setProductImage] = useState<string | null>(null)
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [model3D, setModel3D] = useState<string | null>(null)
  const [video, setVideo] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setStep("generating")
    setIsGenerating(true)

    // Simulate API calls
    setTimeout(() => {
      setModel3D("/3d-model-product.jpg")
      setVideo("/product-promotional-video.jpg")
      setStep("output")
      setIsGenerating(false)
    }, 3000)
  }

  const handleReset = () => {
    setProductImage(null)
    setProductName("")
    setProductDescription("")
    setModel3D(null)
    setVideo(null)
    setStep("upload")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
       {/* Header */}
       <div className='p-3 flex justify-between'>
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

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-balance text-4xl font-bold text-white sm:text-5xl">Create Product Ads Image & Video Generator</h1>
          <p className="mt-4 text-lg text-slate-400">
          Transform your product photo into a stunning marketing ad with realistic backgrounds, lighting, and promotional videos.
          </p>
        </div>

        {step === "upload" && (
          <ProductUpload
            productImage={productImage}
            productName={productName}
            productDescription={productDescription}
            onImageChange={setProductImage}
            onNameChange={setProductName}
            onDescriptionChange={setProductDescription}
            onGenerate={handleGenerate}
            isDisabled={!productImage || !productName}
          />
        )}

        {step === "generating" && (
          <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-slate-600 bg-slate-800/50">
            <div className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-purple-500"></div>
              <p className="text-lg font-medium text-white">Generating 3D Model & Video...</p>
              <p className="mt-2 text-sm text-slate-400">This may take a few moments</p>
            </div>
          </div>
        )}

        {step === "output" && model3D && video && (
          <>
            <GeneratedOutput model3D={model3D} video={video} />
            <div className="mt-8">
              <DownloadOptions model3D={model3D} video={video} />
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-6 py-3 text-white hover:bg-slate-600 transition-colors font-medium"
              >
                Generate Another Product
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default ProductGeneratorPage;
