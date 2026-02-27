import { useEffect, useState } from "react";
import ModelConfigForm from "./ModelConfigForm/ModelConfigForm";
import {
  ArrowLeft,
  Check,
  Download,
  DownloadIcon,
  Share2,
  Trash2,
  ZoomIn,
  PanelLeftOpen,
  PanelLeftClose,
  ImageIcon,
  RefreshCw,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import modelService from "../../services/modelService";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { clearSelectedModel, setGeneratedModelList, setSelectedModel } from "../../store/modelSlice";
import clsx from "clsx";
import { setUserRefresh } from "../../store/userReducer";
import commonService from "../../services/commonService";
import { useMediaQuery } from "../useMediaQuery";
import Button from "../ui/Button";
import ZoomImageModal from "../ui/ZoomImageModal";
import { MODEL_FACE_RETURN_URL_KEY } from "../../constants/modelFace";

export interface ModifiedModelData {
  url: string;
}

export interface ModelConfig {
  mode: string;
  gender: string;
  nationality: string;
  age_range: string;
  hair_style?: string;
  eye_color?: string;
  mood?: string;
  beard?: string;
  body_type?: string;
  skin_tone?: string;
  hair_color?: string;
  pose_type?: string;
  dress?: string;
  footwear?: string;
  tier: string;
  aspect_ratio?: string;
  resolution?: string;
  parentGenerationId?: string;
}

export interface RegenInfo {
  generationId: string;
  regenerationCount: number;
  maxFreeRegenerations: number;
  freeRegensRemaining: number;
  wasFree: boolean;
}

export interface IFastGenModelGenerateConfig {
  seed?: string | number;
  poses: string[];
  gender: string;
  shootType: string;
  outfit: string;
  prompt?: string;
  aspectRatio?: string;
  hairstyle?: string;
  guidance?: string | number;
  requiredCredits?: number;
}

const ModelGeneratorUI: React.FC = () => {
  const { selectedModel } = useSelector((state: RootState) => state.modelList);
  const isMobile = useMediaQuery("(max-width: 440px)");
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [mode, setMode] = useState<string>("fashion");
  const [gender, setGender] = useState<string>("male");
  const [nationality, setNationality] = useState<string>("Indian");
  const [ageRange, setAgeRange] = useState<string>("23-27");

  const [hairStyle, setHairStyle] = useState<string>("Straight Open Hair");
  const [eyeColor, setEyeColor] = useState<string>("Brown");
  const [mood, setMood] = useState<string>("Soft Smile");
  const [beard, setBeard] = useState<string>("clean-shaven");

  const [bodyType, setBodyType] = useState<string>("Slim");
  const [skinTone, setSkinTone] = useState<string>("Fair");
  const [hairColor, setHairColor] = useState<string>("Black");
  const [poseType, setPoseType] = useState<string>("full");
  const [dress, setDress] = useState<string>("");
  const [footwear, setFootwear] = useState<string>("");

  const [tier, setTier] = useState<string>("basic");
  const [aspectRatio, setAspectRatio] = useState<string>("1:1");
  const [resolution, setResolution] = useState<string>("1K");

  const [loading, setLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [generatedImages, setGeneratedImages] = useState<ModifiedModelData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [zoomedImage, setZoomedImage] = useState<string>("");
  const [startTime, setStartTime] = useState<{ [key: string]: number }>({});
  const [endTime, setEndTime] = useState<{ [key: string]: number }>({});
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);
  const [isModelGenerated, setModelGenerated] = useState<boolean>(false);
  const [regenInfo, setRegenInfo] = useState<RegenInfo | null>(null);
  const [isModeLocked, setIsModeLocked] = useState<boolean>(false);
  const is4kResolution = (resolution || "").toUpperCase() === "4K";
  const canShowFreeRegen = !!regenInfo && !is4kResolution && regenInfo.freeRegensRemaining > 0;

  const calculateSecondsDifference = (time1: number, time2: number): number =>
    (time2 - time1) / 1000;

  const handleDownload = async (imageUrl: string) => {
    try {
      setDownloadLoading(true);
      const result = await commonService.downloadSingleFile(imageUrl);
      const blobUrl = URL.createObjectURL(result);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `model-image-${new Date().getTime()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error("Failed to download image");
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleDownloadAll = async (): Promise<void> => {
    if (selectedModel.length === 0) {
      toast.info("Please select at least one model to download");
      return;
    }
    if (!generatedImages || generatedImages.length === 0) return;

    setDownloadLoading(true);
    const filterModel = generatedImages.filter((_, i) => selectedModel.includes(`${i}`));
    try {
      await commonService.downloadFileFromAPI(
        filterModel.map((f) => f.url),
        "model"
      );
    } catch {
      toast.error("Failed to download images");
    } finally {
      setDownloadLoading(false);
    }
  };

  const generateImages = async (parentId?: string): Promise<void> => {
    resetState();

    if (mode === "fashion" && !dress) {
      toast.error("Please select or enter dress description");
      return;
    }

    if (isMobile) setIsSidebarOpen(false);

    setLoading(true);
    setGeneratedImages([]);

    const payload: ModelConfig = {
      mode,
      gender: gender.toLowerCase(),
      nationality,
      age_range: ageRange,
      tier,
    };

    if (mode === "face") {
      payload.hair_style = hairStyle;
      payload.hair_color = hairColor;
      payload.eye_color = eyeColor;
      payload.mood = mood;
      if (gender.toLowerCase() === "male") payload.beard = beard;
    } else {
      payload.body_type = bodyType;
      payload.skin_tone = skinTone;
      payload.hair_color = hairColor;
      payload.pose_type = poseType;
      payload.dress = dress;
      payload.footwear = footwear;
    }

    if (tier === "professional") {
      payload.aspect_ratio = aspectRatio;
      payload.resolution = resolution;
    }

    if (parentId && typeof parentId === "string") {
      payload.parentGenerationId = parentId;
    }

    try {
      setStartTime((prev) => ({ ...prev, [`image_${0}`]: Date.now() }));
      const data = await modelService.generateModel(payload);

      if (data.image_urls && data.image_urls.length) {
        const updatedImages: ModifiedModelData[] = data.image_urls.map((url: string) => ({ url }));
        setGeneratedImages(updatedImages);
        dispatch(setGeneratedModelList(updatedImages));
        // Save latest generated face/model URL so tool pages can auto-prefill Model Face on return.
        localStorage.setItem(MODEL_FACE_RETURN_URL_KEY, data.image_urls[0]);
      }
      if ((data as any).regeneration) {
        setRegenInfo((data as any).regeneration);
      }
      setModelGenerated(true);
      dispatch(setUserRefresh());
    } catch (error: any) {
      console.error("Error generating image:", error);
      toast.error(error.message || "Failed to generate model");
      resetState();
    } finally {
      setEndTime((prev) => ({ ...prev, [`image_${0}`]: Date.now() }));
    }
    setLoading(false);
  };

  const resetState = () => {
    setEndTime({});
    setStartTime({});
    setModelGenerated(false);
    dispatch(clearSelectedModel());
    setGeneratedImages([]);
  };

  useEffect(() => {
    if (gender.toLowerCase() === "male") {
      setBodyType("Slim");
    } else {
      setBodyType("Slim");
    }
  }, [gender]);


  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const requestedMode = (searchParams.get("mode") || "").toLowerCase();
    const requestedGender = (searchParams.get("gender") || "").toLowerCase();
    if (requestedMode === "face" || requestedMode === "fashion") {
      setMode(requestedMode);
      setIsModeLocked(true);
    }
    if (requestedGender) {
      setGender(requestedGender);
    }
  }, [location.search]);

  const handleSelectAll = () => {
    if (selectedModel.length > 0 && selectedModel.length === generatedImages.length) {
      dispatch(clearSelectedModel());
    } else {
      generatedImages.forEach((_, i) => dispatch(setSelectedModel(`${i}`)));
    }
  };

  const handleDeleteImage = (index: number) => {
    const updatedImages = [...generatedImages];
    updatedImages.splice(index, 1);
    setGeneratedImages(updatedImages);
  };

  const handleShareImage = (url: string) => {
    navigator
      .share({ title: "Generated Image", text: "Check out this AI-generated model!", url })
      .catch(() => {});
  };

  return (
    <div className='flex flex-row h-screen bg-[#F4F3EF]'>
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-full md:w-[22rem]" : "w-0"
        } shrink-0 transition-all duration-300 overflow-hidden md:relative absolute z-[100] h-full`}
        style={{
          minWidth: isSidebarOpen ? (window.innerWidth >= 768 ? "22rem" : "100%") : "0",
          maxWidth: isSidebarOpen ? (window.innerWidth >= 768 ? "22rem" : "100%") : "0",
        }}
      >
        <ModelConfigForm
          mode={mode}
          setMode={setMode}
          gender={gender}
          setGender={setGender}
          nationality={nationality}
          setNationality={setNationality}
          ageRange={ageRange}
          setAgeRange={setAgeRange}
          hairStyle={hairStyle}
          setHairStyle={setHairStyle}
          eyeColor={eyeColor}
          setEyeColor={setEyeColor}
          mood={mood}
          setMood={setMood}
          beard={beard}
          setBeard={setBeard}
          bodyType={bodyType}
          setBodyType={setBodyType}
          skinTone={skinTone}
          setSkinTone={setSkinTone}
          hairColor={hairColor}
          setHairColor={setHairColor}
          poseType={poseType}
          setPoseType={setPoseType}
          dress={dress}
          setDress={setDress}
          footwear={footwear}
          setFootwear={setFootwear}
          tier={tier}
          setTier={setTier}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          resolution={resolution}
          setResolution={setResolution}
          generateImage={generateImages}
          loading={loading}
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
          isModeLocked={isModeLocked}
        />
      </aside>

      {/* Main Content */}
      <main className='flex-1 flex flex-col h-screen overflow-hidden'>
        {/* Top Bar */}
        <div className='shrink-0 border-b border-[#E5E2DA] bg-white px-5 py-3 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              icon={isSidebarOpen ? <PanelLeftClose className='w-4 h-4' /> : <PanelLeftOpen className='w-4 h-4' />}
            />
            <div>
              <h1 className='text-[14px] font-bold text-stone-900'>AI4FI — Model Generation</h1>
              <p className='text-[11.5px] text-[#9E9893] font-medium'>
                Create Photorealistic Fashion Model Images with Custom Attributes
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Link
              to='/features'
              className='hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[#E5E2DA] bg-white text-[12px] font-semibold text-[#6B6560] hover:bg-[#F9F8F5] hover:text-stone-900 transition-all'
            >
              <ArrowLeft className='w-3.5 h-3.5' />
              Back
            </Link>
            <Link
              to='/'
              className='hidden sm:flex items-center h-8 px-3 rounded-lg border border-[#E5E2DA] bg-white text-[12px] font-semibold text-[#6B6560] hover:bg-[#F9F8F5] hover:text-stone-900 transition-all'
            >
              Home
            </Link>
            {isModeLocked && mode === "face" && isModelGenerated && generatedImages.length > 0 && (
              <Button
                variant='gradient'
                size='md'
                icon={<ArrowLeft className='w-4 h-4 rotate-180' />}
                onClick={() => {
                  if (generatedImages[0]?.url) {
                    localStorage.setItem(MODEL_FACE_RETURN_URL_KEY, generatedImages[0].url);
                  }
                  const source = new URLSearchParams(location.search).get("source");
                  if (source === "product-listing") {
                    navigate("/product-listing-studio");
                  } else if (source === "fabric-studio") {
                    navigate("/unstitched-studio");
                  } else {
                    navigate("/trial-room");
                  }
                }}
                className='font-bold animate-pulse'
              >
                {(() => {
                  const source = new URLSearchParams(location.search).get("source");
                  if (source === "product-listing") return "Next Step → Product Studio";
                  if (source === "fabric-studio") return "Next Step → Fabric Studio";
                  return "Next Step → Trial Room";
                })()}
              </Button>
            )}
          </div>
        </div>

        {/* Gallery Toolbar */}
        {!loading && isModelGenerated && generatedImages.length > 0 && (
          <div className='shrink-0 px-5 py-3 border-b border-[#E5E2DA] bg-white flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <h2 className='text-[13px] font-bold text-stone-900'>
                Generated Models
                <span className='ml-2 text-[11px] font-medium text-[#9E9893]'>
                  {generatedImages.length} image{generatedImages.length !== 1 ? "s" : ""}
                </span>
              </h2>
              {regenInfo && (
                <Button
                  variant={canShowFreeRegen ? "outline" : "ghost"}
                  size='sm'
                  onClick={() => generateImages(regenInfo.generationId)}
                  disabled={loading}
                  icon={<RefreshCw className='w-3.5 h-3.5' />}
                  className={canShowFreeRegen ? "!border-green-300 !text-green-700 hover:!bg-green-50" : ""}
                >
                  {canShowFreeRegen
                    ? `Regenerate Free (${regenInfo.freeRegensRemaining} left)`
                    : "Regenerate (1 credit)"}
                </Button>
              )}
            </div>
            <div className='flex items-center gap-3'>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleSelectAll}
                className={clsx(
                  selectedModel.length === generatedImages.length && selectedModel.length > 0
                    ? "!text-[#2563EB]"
                    : ""
                )}
              >
                {selectedModel.length === generatedImages.length && selectedModel.length > 0
                  ? "Deselect All"
                  : "Select All"}
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={handleDownloadAll}
                loading={downloadLoading}
                icon={<Download className='w-4 h-4' />}
                aria-label='Download selected'
              />
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className='flex-1 overflow-y-auto p-5'>
          {/* Loading State */}
          {loading && generatedImages.length === 0 && (
            <div className='flex flex-col items-center justify-center h-full'>
              <Button variant='outline' size='icon' loading className='w-16 h-16 rounded-2xl mb-4' />
              <p className='text-[14px] font-bold text-stone-900'>Generating your model...</p>
              <p className='text-[12px] text-[#9E9893] mt-1'>
                {startTime[`image_${0}`] && <TimerDisplay startTime={startTime[`image_${0}`]} />}
              </p>
            </div>
          )}

          {/* Empty State */}
          {!loading && generatedImages.length === 0 && (
            <div className='flex flex-col items-center justify-center h-full text-center'>
              <div className='w-20 h-20 rounded-2xl bg-white border border-[#E5E2DA] shadow-sm flex items-center justify-center mb-5'>
                <ImageIcon className='w-8 h-8 text-[#D0CBBF]' />
              </div>
              <h3 className='text-[16px] font-bold text-stone-900 mb-1'>No models generated yet</h3>
              <p className='text-[13px] text-[#9E9893] max-w-sm'>
                Configure your model settings in the sidebar and click{" "}
                <span className='font-semibold text-violet-600'>Generate Model</span> to create
                photorealistic fashion images.
              </p>
            </div>
          )}

          {/* Image Grid */}
          {generatedImages.length > 0 && (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
              {generatedImages.map((image, index) => (
                <div key={index} className='group'>
                  {startTime[`image_${0}`] && endTime[`image_${0}`] && (
                    <div className='mb-1.5'>
                      <span className='inline-flex items-center px-2 py-0.5 rounded-md bg-white border border-[#E5E2DA] text-[11px] font-mono text-[#9E9893]'>
                        {calculateSecondsDifference(startTime[`image_${0}`], endTime[`image_${0}`])?.toFixed(2)}s
                      </span>
                    </div>
                  )}

                  <div
                    className='relative rounded-2xl overflow-hidden bg-white border border-[#E5E2DA] shadow-[0_1px_3px_rgba(28,25,23,0.06)] cursor-pointer transition-all hover:shadow-[0_4px_12px_rgba(28,25,23,0.1)]'
                    onClick={() => dispatch(setSelectedModel(`${index}`))}
                    role='button'
                    tabIndex={0}
                    aria-label={`Select model ${index + 1}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") dispatch(setSelectedModel(`${index}`));
                    }}
                  >
                    <div className='aspect-[3/4] overflow-hidden'>
                      <img
                        src={image.url}
                        alt={`Generated Model ${index + 1}`}
                        className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]'
                      />
                    </div>

                    <div
                      className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        selectedModel.includes(`${index}`)
                          ? "bg-[#2563EB] shadow-md"
                          : "bg-white/80 backdrop-blur-sm border border-[#E5E2DA] opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <Check
                        className={`w-4 h-4 ${
                          selectedModel.includes(`${index}`) ? "text-white" : "text-[#9E9893]"
                        }`}
                      />
                    </div>

                    {isModelGenerated && (
                      <div className='absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'>
                        <div className='flex items-center justify-center gap-2'>
                          <Button
                            size='icon'
                            className='bg-white/90 backdrop-blur-sm text-stone-700 hover:bg-white border-0'
                            onClick={(e) => { e.stopPropagation(); handleDownload(image.url); }}
                            icon={<DownloadIcon className='w-4 h-4' />}
                            aria-label='Download image'
                          />
                          <Button
                            size='icon'
                            className='bg-white/90 backdrop-blur-sm text-stone-700 hover:bg-red-50 hover:text-red-600 border-0'
                            onClick={(e) => { e.stopPropagation(); handleDeleteImage(index); }}
                            icon={<Trash2 className='w-4 h-4' />}
                            aria-label='Delete image'
                          />
                          <Button
                            size='icon'
                            className='bg-white/90 backdrop-blur-sm text-stone-700 hover:bg-blue-50 hover:text-blue-600 border-0'
                            onClick={(e) => { e.stopPropagation(); handleShareImage(image.url); }}
                            icon={<Share2 className='w-4 h-4' />}
                            aria-label='Share image'
                          />
                          <Button
                            size='icon'
                            className='bg-white/90 backdrop-blur-sm text-stone-700 hover:bg-violet-50 hover:text-violet-600 border-0'
                            onClick={(e) => {
                              e.stopPropagation();
                              setZoomedImage(image.url);
                              setIsModalOpen(true);
                            }}
                            icon={<ZoomIn className='w-4 h-4' />}
                            aria-label='Zoom image'
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Zoom Modal */}
      <ZoomImageModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setZoomedImage("");
        }}
        images={generatedImages.map((img) => img.url)}
        initialIndex={Math.max(0, generatedImages.findIndex((img) => img.url === zoomedImage))}
        alt='Generated model'
      />
    </div>
  );
};

const TimerDisplay: React.FC<{ startTime: number }> = ({ startTime }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((Date.now() - startTime) / 1000);
    }, 100);
    return () => clearInterval(timer);
  }, [startTime]);

  return <span className='font-mono'>{elapsed.toFixed(1)}s elapsed</span>;
};

export default ModelGeneratorUI;
