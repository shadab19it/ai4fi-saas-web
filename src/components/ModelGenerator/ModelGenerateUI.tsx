import { useEffect, useState } from "react";
import ModelConfigForm, { LoadingSpinner } from "./ModelConfigForm/ModelConfigForm";
import { ArrowLeft, ArrowRight, Check, Download, DownloadIcon, Share2, Trash, ZoomIn } from "lucide-react";
import Spinner from "../Spinner/Spinner";
import { Link, useNavigate } from "react-router-dom";
import modelService from "../../services/modelService";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { clearSelectedModel, setGeneratedModelList, setSelectedModel } from "../../store/modelSlice";
// Removed copySeed import - seed/DNA feature removed
import clsx from "clsx";
import appConstant from "../../services/appConstant";
import { setUserRefresh } from "../../store/userReducer";
import commonService from "../../services/commonService";
import { useMediaQuery } from "../useMediaQuery";
// Removed FastGen imports - feature removed

export interface ModifiedModelData {
  url: string;
}

export interface ModelConfig {
  mode: string; // "face" or "fashion"
  gender: string;
  nationality: string;
  age_range: string;
  // Face mode fields
  hair_style?: string;
  eye_color?: string;
  mood?: string;
  beard?: string;
  // Fashion mode fields
  body_type?: string;
  skin_tone?: string;
  hair_color?: string;
  pose_type?: string; // "half" or "full"
  dress?: string;
  footwear?: string;
  // Quality options
  tier: string; // "basic" or "professional"
  aspect_ratio?: string; // Only for professional
  resolution?: string; // Only for professional (1K, 2K, 4K)
  requiredCredits: number;
}

// Removed IFastGenModelGenerateConfig - FastGen feature removed

const ModelGeneratorUI: React.FC = () => {
  const { selectedModel } = useSelector((state: RootState) => state.modelList);
  const isMobile = useMediaQuery("(max-width: 440px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Mode and basic info
  const [mode, setMode] = useState<string>("fashion"); // "face" or "fashion"
  const [gender, setGender] = useState<string>("male");
  const [nationality, setNationality] = useState<string>("Indian");
  const [ageRange, setAgeRange] = useState<string>("23-27");
  
  // Face mode fields
  const [hairStyle, setHairStyle] = useState<string>("Straight Open Hair");
  const [eyeColor, setEyeColor] = useState<string>("Brown");
  const [mood, setMood] = useState<string>("Soft Smile");
  const [beard, setBeard] = useState<string>("clean-shaven");
  
  // Fashion mode fields
  const [bodyType, setBodyType] = useState<string>("Slim");
  const [skinTone, setSkinTone] = useState<string>("Fair");
  const [hairColor, setHairColor] = useState<string>("Black");
  const [poseType, setPoseType] = useState<string>("full"); // "half" or "full"
  const [dress, setDress] = useState<string>("");
  const [footwear, setFootwear] = useState<string>("");
  
  // Quality options
  const [tier, setTier] = useState<string>("basic"); // "basic" or "professional"
  const [aspectRatio, setAspectRatio] = useState<string>("1:1");
  const [resolution, setResolution] = useState<string>("2K");
  
  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [generatedImages, setGeneratedImages] = useState<ModifiedModelData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [zoomedImage, setZoomedImage] = useState<string>("");
  const [startTime, setStartTime] = useState<{ [key: string]: number }>({});
  const [endTime, setEndTime] = useState<{ [key: string]: number }>({});
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);
  const [isModelGenerated, setModelGenerated] = useState<boolean>(false);

  const calculateSecondsDifference = (time1: number, time2: number): number => {
    return (time2 - time1) / 1000;
  };

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
      setDownloadLoading(false);
    } catch (error: any) {
      setDownloadLoading(false);
      toast.error("Failed to download image");
    }
  };

  const handleDownloadAll = async (): Promise<void> => {
    if (selectedModel.length === 0) {
      toast.info("Please select atleast one model to download");
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
      setDownloadLoading(false);
    } catch (error: any) {
      setDownloadLoading(false);
      toast.error("Failed to download images");
    }
  };

  const generateImages = async (): Promise<void> => {
    resetState();

    // Validation based on mode
    if (mode === "fashion" && !dress) {
      toast.error("Please select or enter dress description");
      return;
    }

    if (isMobile) {
      setIsSidebarOpen(false);
    }

    setLoading(true);
    setGeneratedImages([]); // Will be populated when image is generated

    const payload: ModelConfig = {
      mode,
      gender: gender.toLowerCase(),
      nationality,
      age_range: ageRange,
      tier,
      requiredCredits: appConstant.MODEL_DEDUCT_POINT,
    };

    // Add mode-specific fields
    if (mode === "face") {
      payload.hair_style = hairStyle;
      payload.eye_color = eyeColor;
      payload.mood = mood;
      if (gender.toLowerCase() === "male") {
        payload.beard = beard;
      }
    } else {
      // Fashion mode
      payload.body_type = bodyType;
      payload.skin_tone = skinTone;
      payload.hair_color = hairColor;
      payload.pose_type = poseType;
      payload.dress = dress;
      payload.footwear = footwear;
    }

    // Add professional tier options
    if (tier === "professional") {
      payload.aspect_ratio = aspectRatio;
      payload.resolution = resolution;
    }

    try {
      setStartTime((prev) => ({ ...prev, [`image_${0}`]: Date.now() }));
      const data = await modelService.generateModel(payload);

      if (data.image_urls && data.image_urls.length) {
        let updatedImages: ModifiedModelData[] = [];
        data.image_urls.map((url: string) => {
          updatedImages.push({ url: url });
        });
        setGeneratedImages(updatedImages);
        dispatch(setGeneratedModelList(updatedImages));
      }
      setModelGenerated(true);
      dispatch(setUserRefresh());
    } catch (error: any) {
      console.error(`Error generating image:`, error);
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
    // Update default body type based on gender
    if (gender.toLowerCase() === "male") {
      setBodyType("Slim");
    } else {
      setBodyType("Slim");
    }
  }, [gender]);

  const onClickToVirtualTruOn = () => {
    if (selectedModel.length === 0) {
      toast.info("Please select atleast one model to proceed to Virtual Try On");
      return;
    }
    navigate("/virtualtryon", { state: "model" });
  };

  const onSelectAll = () => {
    if (selectedModel.length > 0 && selectedModel.length === generatedImages.length) {
      dispatch(clearSelectedModel());
    } else {
      generatedImages.forEach((_, i) => dispatch(setSelectedModel(`${i}`)));
    }
  };

  // Removed FastGen Model functions - feature removed

  return (
    <div className='flex  flex-row min-h-screen bg-gray-900 text-white'>
      <aside
        className={`${
          isSidebarOpen ? "w-full md:w-1/5" : "w-0 "
        } bg-gray-900 transition-all duration-300 overflow-hidden left-0 top-0  md:top-0 h-auto md:h-screen md:relative absolute z-[10000] `}
        style={{
          minWidth: isSidebarOpen ? (window.innerWidth >= 768 ? "22rem" : "100%") : "0",
          maxWidth: isSidebarOpen ? (window.innerWidth >= 768 ? "22rem" : "100%") : "0",
        }}>
        <div className='h-screen overflow-y-auto sider_scroll'>
          <ModelConfigForm
            mode={mode}
            setMode={setMode}
            gender={gender}
            setGender={setGender}
            nationality={nationality}
            setNationality={setNationality}
            ageRange={ageRange}
            setAgeRange={setAgeRange}
            // Face mode
            hairStyle={hairStyle}
            setHairStyle={setHairStyle}
            eyeColor={eyeColor}
            setEyeColor={setEyeColor}
            mood={mood}
            setMood={setMood}
            beard={beard}
            setBeard={setBeard}
            // Fashion mode
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
            // Quality
            tier={tier}
            setTier={setTier}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            resolution={resolution}
            setResolution={setResolution}
            // Actions
            generateImage={generateImages}
            loading={loading}
            setIsSidebarOpen={setIsSidebarOpen}
            isSidebarOpen={isSidebarOpen}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className='relative flex flex-col  w-full j lg:px-12 py-4 min-h-screen'>
        {/* Sidebar Toggle Button */}

        <button
          className='absolute left-4 top-4 bg-white text-black p-2 rounded-full shadow-lg z-150 block'
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
        </button>

        {/* Back to Home Button */}
        <div className='absolute top-4 right-4'>
          <div className='flex  gap-4 items-center'>
            <Link to='/features'>
              <button className='flex items-center text-white hover:text-gray-300 transition-colors'>
                <ArrowLeft className='w-5 h-5 mr-2' />
                Back
              </button>
            </Link>
            <Link to='/'>
              <button className='flex items-center text-white hover:text-gray-300 transition-colors'>Home</button>
            </Link>
            {generatedImages && generatedImages.length > 0 && (
              <div className='flex justify-center '>
                <button
                  onClick={onClickToVirtualTruOn}
                  className='bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-800 hover:to-indigo-800 text-white  px-4 py-2  rounded-lg shadow-lg transition-transform transform hover:scale-105'>
                  Virtual Try Room
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className='flex flex-wrap justify-between items-center w-full pt-8 pb-2 px-3 md:px-0'>
          <div>
            <h1 className='md:text-lg text-sm py-2 font-bold text-white '>
              AI4FI - Model Generation 
            </h1>
            <p className='text-[11px] md:text-sm font-bold text-gray-400 mb-4'>
              Create Photorealistic Fashion Model Images with Custom Attributes 
            </p>
          </div>
          {/* {isMobile && (
            <button
              disabled={loading}
              className=' fast-gen-model-btn cursor-pointer text-[10px] py-2 px-4 sm:text-sm'
              onClick={onClickAdwancedModel}>
              {!repllicateModelInfo.isReplicateModel ? "Use FastGen Model" : "Use Custom Model"}
            </button>
          )} */}

          {/* <hr className='border-gray-600 my-2' />
          <p className='text-lg text-gray-400'>Powered by ApricityTS💡AI-Driven Fashion Modeling ✨</p> */}
        </div>

        {!loading && isModelGenerated && (
          <div className='w-full'>
            <div className='flex items-center justify-between mb-8'>
              <h1 className='text-lg font-bold text-gray-300 px-4'>Generated Models</h1>
              <div className='flex items-center gap-4'>
                <p
                  className={clsx(
                    " cursor-pointer hover:text-blue-500",
                    selectedModel.length === generatedImages.length && selectedModel.length > 0 ? "text-blue-500" : "text-gray-200"
                  )}
                  onClick={onSelectAll}>
                  Select All
                </p>
                <button
                  onClick={handleDownloadAll}
                  className='border-none flex items-center justify-center gap-2 text-white text-md px-4 py-1 rounded-md shadow-lg transition-transform transform hover:scale-110 hover:bg'>
                  <Download /> {downloadLoading && <LoadingSpinner size={20} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Gallery */}
        {(generatedImages.length > 0 || loading) && (
          <div className='flex-grow w-full flex justify-center bg-gray-900 overflow-hidden'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 w-full'>
              {loading && generatedImages.length === 0 && (
                <div className='col-span-full flex justify-center items-center h-96'>
                  <Spinner startTime={startTime[`image_${0}`] || Date.now()} />
                </div>
              )}
              {generatedImages.map((image, index) => (
                <div key={index}>
                  {startTime && endTime && startTime[`image_${0}`] && endTime[`image_${0}`] && (
                    <div className='flex justify-start'>
                      <p className='text-sm mb-2 '>
                        {calculateSecondsDifference(startTime[`image_${0}`], endTime[`image_${0}`])?.toFixed(2)}{" "}
                        <span className='ml-[2px]'>sec</span>
                      </p>
                    </div>
                  )}

                  <div
                    className='relative group w-full h-78 lg:h-96 flex-shrink-0'
                    id={`image-${index}`}
                    onClick={() => dispatch(setSelectedModel(`${index}`))}>
                    {image && (
                      <img
                        src={image.url}
                        alt={`Generated Model ${index}`}
                        className='w-full h-full object-contain rounded-lg shadow-md transition-all duration-300 ease-in-out'
                      />
                    )}

                    <div
                      className={`absolute inset-0 bg-black/40 transition-opacity ${
                        selectedModel.includes(`${index}`) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}>
                      <div className='absolute top-4 right-4'>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            selectedModel.includes(`${index}`) ? "bg-blue-500" : "bg-white"
                          }`}>
                          <Check className={`w-5 h-5 ${selectedModel.includes(`${index}`) ? "text-white" : "text-gray-900"}`} />
                        </div>
                      </div>

                      {image && isModelGenerated && (
                        <div className='flex items-center h-full justify-center'>
                          <div className='flex space-x-4'>
                            <DownloadIcon
                              className='h-6 w-6 cursor-pointer hover:text-blue-400'
                              onClick={() => handleDownload(image.url)}
                            />

                            <Trash
                              className='h-6 w-6 cursor-pointer hover:text-red-600 '
                              onClick={() => {
                                const updatedImages = [...generatedImages];
                                updatedImages.splice(index, 1);
                                setGeneratedImages(updatedImages);
                              }}
                            />

                            <Share2
                              className='h-6 w-6 cursor-pointer hover:text-blue-400'
                              onClick={() =>
                                navigator
                                  .share({
                                    title: "Generated Image",
                                    text: "Check out this image!",
                                    url: image.url,
                                  })
                                  .catch((err) => console.error("Share failed:", err))
                              }
                            />

                            <ZoomIn
                              className='h-6 w-6 cursor-pointer hover:text-blue-400'
                              onClick={() => {
                                setZoomedImage(image.url);
                                setIsModalOpen(true);
                              }}
                            />

                            {isModalOpen && (
                              <div
                                className='fixed inset-0 bg-black bg-opacity-75  !ml-0 flex items-center justify-center z-50'
                                onClick={() => setIsModalOpen(false)}>
                                <div className='relative'>
                                  <img src={zoomedImage} alt='Zoomed' className='max-w-full max-h-screen' />
                                  <button
                                    onClick={() => setIsModalOpen(false)}
                                    className='absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full'>
                                    <svg
                                      xmlns='http://www.w3.org/2000/svg'
                                      fill='none'
                                      viewBox='0 0 24 24'
                                      strokeWidth={1.5}
                                      stroke='currentColor'
                                      className='w-6 h-6'>
                                      <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ModelGeneratorUI;
