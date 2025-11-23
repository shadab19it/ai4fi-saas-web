import { useEffect, useState } from "react";
import ModelConfigForm, { LoadingSpinner } from "./ModelConfigForm/ModelConfigForm";
import { ArrowLeft, ArrowRight, Check, Copy, CopyIcon, Download, DownloadIcon, Home, Share2, Trash, ZoomIn } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import axios from "axios";
import Spinner from "../Spinner/Spinner";
import { Link, useNavigate } from "react-router-dom";
import modelService from "../../services/modelService";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { clearSelectedModel, setGeneratedModelList, setSelectedModel } from "../../store/modelSlice";
import { copySeed, createImgFileFromUrl } from "../../services/utils";
import clsx from "clsx";
import appConstant from "../../services/appConstant";
import { setUserRefresh } from "../../store/userReducer";
import commonService from "../../services/commonService";
import { useMediaQuery } from "../useMediaQuery";
import { fastGenFemaleHairStyle, fastGenFemalePoses, fastGenMaleHairStyle, fastGenMalePoses } from "./ModelConfigForm/optionInput";

export interface ModifiedModelData {
  url: string;
  seed: number;
}

export interface ModelConfig {
  gender: string;
  country: string;
  age: number;
  hair_color: string;
  hair_type: string;
  eye_color: string;
  skin_color: string;
  shot_type: string;
  body_type: string;
  dress: string;
  background: string;
  pose: string | string[];
  seed: number | null;
  auto_seed: boolean;
  num_images: number;
  customBackground: string;
  lighting_condition: string;
  requiredPoints: number;
}

export interface IFastGenModelGenerateConfig {
  poses: string[];
  gender: string;
  shootType: string;
  outfit: string;
  seed: any;
  requiredPoints: number;
  guidance: number;
  prompt: string;
  aspectRatio: string;
  hairstyle: string;
}

const ModelGeneratorUI: React.FC = () => {
  const { selectedModel } = useSelector((state: RootState) => state.modelList);
  const isMobile = useMediaQuery("(max-width: 440px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<string>("Male");
  const [hairColor, setHairColor] = useState<string>("Black");
  const [hairType, setHairType] = useState<string>("Straight & Sleek");
  const [eyeColor, setEyeColor] = useState<string>("Black");
  const [skinColor, setSkinColor] = useState<string>("Light-Medium & Warm Beige");
  const [dress, setDress] = useState<string>("");
  const [background, setBackground] = useState<string>("Plain White Studio");
  const [pose, setPose] = useState<string>("");
  const [multiPose, setMultiPose] = useState<string[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<any[]>([]);
  const [autoSeed] = useState<boolean>(true);
  const [country, setCountry] = useState<string>("India");
  const [loading, setLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [model, setModel] = useState<number>(1);
  const [shotType, setShotType] = useState<string>("Full Body");

  const [seedType, setSeedType] = useState<string>("Auto Generate");
  const [dnaNumber, setDnaNumber] = useState<number | null>(null);
  const [generatedImages, setGeneratedImages] = useState<ModifiedModelData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [zoomedImage, setZoomedImage] = useState<string>("");
  const [startTime, setStartTime] = useState<{ [key: string]: number }>({});
  const [endTime, setEndTime] = useState<{ [key: string]: number }>({});
  const [customBackground, setCustomBackground] = useState<string>("");
  const [lighting, setLighting] = useState<string>("Softbox Studio Lighting");
  const [bodyType, setBodyType] = useState<string>("Slim & Toned");
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);
  const [isModelGenerated, setModelGenerated] = useState<boolean>(false);

  const [repllicateModelInfo, setReplicateModelInfo] = useState({
    isReplicateModel: false,
    shootType: "full-length",
    gender: "male",
    poses: [],
    outfit: "designer black blazer",
    seedType: "Auto Generate",
    seed: "",
    noOfPoses: 4,
    prompt: "",
    spectRatio: "2:3",
    hairstyle: fastGenMaleHairStyle[0].value,
    guidance: 4,
  });

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
    const filterModel = generatedImages.filter((image, i) => selectedModel.includes(`${i}`));

    try {
      const result = await commonService.downloadFileFromAPI(
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

    if (!dress) {
      toast.error("Please enter dress description");
      return;
    }
    if (seedType === "Custom Generated" && !dnaNumber) {
      toast.error("Please enter DNA number for custom seed");
      return;
    }

    if (model > 1 && multiPose.length === 0) {
      toast.error("Please select poses");
      return;
    }
    if (model > 1 && multiPose.length !== model) {
      toast.error("No of model should be matched with no of posses");
      return;
    }

    if (isMobile) {
      setIsSidebarOpen(false);
    }

    setLoading(true);
    const placeholders = Array(model).fill(null);
    setGeneratedImages(placeholders);

    const payload: ModelConfig = {
      gender,
      country,
      age: Number(age),
      hair_color: hairColor,
      hair_type: hairType,
      eye_color: eyeColor,
      skin_color: skinColor,
      body_type: bodyType,
      shot_type: shotType,
      customBackground: customBackground,
      dress: dress || "",
      background: customBackground ? customBackground : background,
      pose: multiPose.length > 0 ? multiPose : pose,
      seed: Number(dnaNumber),
      auto_seed: dnaNumber ? false : true,
      num_images: Number(model),
      lighting_condition: lighting,
      requiredPoints: Number(model) * appConstant.MODEL_DEDUCT_POINT,
    };

    try {
      setStartTime((prev) => ({ ...prev, [`image_${0}`]: Date.now() }));
      const data = await modelService.generateModel(payload);

      if (data.image_urls.length) {
        let updatedImages: ModifiedModelData[] = [];
        data.image_urls.map((url) => {
          updatedImages.push({ url: url, seed: data.seed });
        });
        setGeneratedImages(updatedImages);
        dispatch(setGeneratedModelList(updatedImages));
      }
      setModelGenerated(true);
      dispatch(setUserRefresh());
    } catch (error: any) {
      console.error(`Error generating image ${0}:`, error);
      toast.error(error.message);
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
    if (gender === "Male") {
      setBodyType("Slim & Lean");
    } else {
      setBodyType("Slim & Toned");
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

  // Advanced Model Replicate Model
  const onClickAdwancedModel = () => {
    setReplicateModelInfo({ ...repllicateModelInfo, isReplicateModel: !repllicateModelInfo.isReplicateModel });
  };

  const onChangeReplicateInfo = (fieldName: string, vlaue: any) => {
    setReplicateModelInfo({ ...repllicateModelInfo, [fieldName]: vlaue });
  };

  const generateFastGenModel = async () => {
    resetState();
    if (!repllicateModelInfo.outfit) {
      toast.error("Please enter outfit description");
      return;
    }
    if (repllicateModelInfo.seedType === "Custom Generated" && !repllicateModelInfo.seed) {
      toast.error("Please enter DNA number for custom seed");
      return;
    }

    if (repllicateModelInfo.poses.length === 0) {
      toast.error("Please select poses");
      return;
    }

    if (isMobile) {
      setIsSidebarOpen(false);
    }

    setLoading(true);
    const placeholders = Array(repllicateModelInfo.poses.length).fill(null);
    setGeneratedImages(placeholders);

    const payload: IFastGenModelGenerateConfig = {
      gender,
      shootType: repllicateModelInfo.shootType,
      poses: repllicateModelInfo.poses,
      seed: repllicateModelInfo.seedType === "Custom Generated" ? Number(repllicateModelInfo.seed) : "None",
      outfit: repllicateModelInfo.outfit,
      requiredPoints: Number(repllicateModelInfo.poses.length) * appConstant.MODEL_DEDUCT_POINT,
      prompt: repllicateModelInfo.prompt,
      aspectRatio: repllicateModelInfo.spectRatio,
      hairstyle: repllicateModelInfo.hairstyle,
      guidance: repllicateModelInfo.guidance,
    };

    try {
      setStartTime((prev) => ({ ...prev, [`image_${0}`]: Date.now() }));
      const data = await modelService.generateFastGenModel(payload);

      if (data.image_urls.length) {
        let updatedImages: ModifiedModelData[] = [];
        data.image_urls.map((url) => {
          updatedImages.push({ url: url, seed: data.seed });
        });
        setGeneratedImages(updatedImages);
        dispatch(setGeneratedModelList(updatedImages));
      }
      setModelGenerated(true);
      dispatch(setUserRefresh());
    } catch (error: any) {
      console.error(`Error generating image ${0}:`, error);
      toast.error(error.message);
      resetState();
    } finally {
      setEndTime((prev) => ({ ...prev, [`image_${0}`]: Date.now() }));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (repllicateModelInfo.isReplicateModel) {
      setReplicateModelInfo({
        ...repllicateModelInfo,
        prompt: generatedPrompts(repllicateModelInfo),
      });
    }
  }, [
    repllicateModelInfo.shootType,
    repllicateModelInfo.gender,
    repllicateModelInfo.outfit,
    repllicateModelInfo?.poses.length,
    repllicateModelInfo.hairstyle,
    repllicateModelInfo.isReplicateModel,
  ]);

  useEffect(() => {
    if (repllicateModelInfo.gender) {
      setReplicateModelInfo({
        ...repllicateModelInfo,
        hairstyle: repllicateModelInfo.gender === "Male" ? fastGenMaleHairStyle[0].value : fastGenFemaleHairStyle[0].value,
      });
    }
  }, []);

  useEffect(() => {
    if (!repllicateModelInfo.isReplicateModel) {
      setPose(gender === "Male" ? fastGenMalePoses[1].value : fastGenFemalePoses[1].value);
      setHairType(gender === "Male" ? fastGenMaleHairStyle[0].value : fastGenFemaleHairStyle[0].value);
    }
  }, [gender]);

  let generatedPrompts = (repllicateModelInfo: any) => {
    return `Create realistic image of ${repllicateModelInfo.shootType} photo shoot of ${repllicateModelInfo.gender} fashion model with ${repllicateModelInfo.hairstyle} at paris street, wearing ${repllicateModelInfo.outfit}, In pose : {pose}`;
  };

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
            setGender={setGender}
            setHairColor={setHairColor}
            setHairType={setHairType}
            setEyeColor={setEyeColor}
            setSkinColor={setSkinColor}
            setDress={setDress}
            setBackground={setBackground}
            setPose={setPose}
            setSelectedPosts={setSelectedPosts}
            setCountry={setCountry}
            setShotType={setShotType}
            setSeedType={setSeedType}
            setDnaNumber={setDnaNumber}
            setModel={setModel}
            model={model}
            setAge={setAge}
            age={age}
            gender={gender}
            hairColor={hairColor}
            hairType={hairType}
            eyeColor={eyeColor}
            skinColor={skinColor}
            dress={dress}
            pose={pose}
            selectedPosts={selectedPosts}
            autoSeed={autoSeed}
            country={country}
            shotType={shotType}
            seedType={seedType}
            dnaNumber={dnaNumber}
            background={background}
            generateImage={generateImages}
            loading={loading}
            setCustomBackground={setCustomBackground}
            customBackground={customBackground}
            setLighting={setLighting}
            lighting={lighting}
            setMultiPose={setMultiPose}
            setBodyType={setBodyType}
            bodyType={bodyType}
            repllicateModelInfo={repllicateModelInfo}
            onChangeReplicateInfo={onChangeReplicateInfo}
            generateFastGenModel={generateFastGenModel}
            setIsSidebarOpen={setIsSidebarOpen}
            isSidebarOpen={isSidebarOpen}
            onClickAdwancedModel={onClickAdwancedModel}
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
            {!isMobile && (
              <button
                disabled={loading}
                className=' fast-gen-model-btn cursor-pointer text-[10px] py-2 px-4 sm:text-sm'
                onClick={onClickAdwancedModel}>
                {!repllicateModelInfo.isReplicateModel ? "Use FastGen Model" : "Use Custom Model"}
              </button>
            )}
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
              AI4FI - {repllicateModelInfo.isReplicateModel ? "FastGen" : "Custom"} Model Generation ✨
            </h1>
            <p className='text-[11px] md:text-sm font-bold text-gray-400 mb-4'>
              Create Photorealistic Fashion Model Images with Custom Attributes 🔮
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
        {generatedImages.length > 0 && (
          <div className='flex-grow w-full flex justify-center bg-gray-900 overflow-hidden'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 w-full'>
              {generatedImages.map((image, index) => (
                <div key={index}>
                  {startTime && endTime && startTime[`image_${0}`] && endTime[`image_${0}`] && (
                    <div className='flex justify-between'>
                      <p className='text-sm mb-2 '>
                        {calculateSecondsDifference(startTime[`image_${0}`], endTime[`image_${0}`])?.toFixed(2)}{" "}
                        <span className='ml-[2px]'>sec</span>
                      </p>
                      <p className='hover:text-blue-500 flex items-center gap-1 cursor-pointer' onClick={() => copySeed(image.seed)}>
                        <span className='text-[12px]'>DNA No - </span> <span>{image?.seed}</span> <CopyIcon size={16} />
                      </p>
                    </div>
                  )}

                  <div
                    className='relative group w-full h-78 lg:h-96 flex-shrink-0'
                    id={`image-${index}`}
                    onClick={() => dispatch(setSelectedModel(`${index}`))}>
                    {!image && startTime[`image_${0}`] && <Spinner startTime={startTime[`image_${0}`]} />}

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
