import { FC, useEffect, useRef, useState } from "react";
import { Upload, Shirt as Tshirt, Image as ImageIcon, RefreshCw, X, ArrowLeft, Download, Camera } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { clearSelectedModel } from "../../store/modelSlice";
import { toast } from "sonner";
import { LoadingSpinner } from "../ModelGenerator/ModelConfigForm/ModelConfigForm";
import appConstant from "../../services/appConstant";
import modelService from "../../services/modelService";
import DarkLogo from "../../../public/dark-logo.png";
import clsx from "clsx";
import { setUserRefresh } from "../../store/userReducer";
import AnimatedCmp2 from "./AnimatedCmp2";
import commonService from "../../services/commonService";

export interface modelResult {
  url: string;
  id: string;
}

export interface UploadedImage {
  id: string;
  url: any;
  file: any;
  type: "model" | "result";
}

const VirtualTryon: FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { selectedModel, modelList, generatedModelList } = useSelector((state: RootState) => state.modelList);
  const { userRefresh } = useSelector((state: RootState) => state.user);
  const [modelImages, setModelImages] = useState<UploadedImage[]>([]);
  const [garmentImage, setGarmentImage] = useState<UploadedImage | null>(null);
  const [resultImage, setResultImage] = useState<any[]>([]);
  const [category, setCategory] = useState<string>("auto");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedResult, setSelectedResult] = useState<modelResult[]>([]);
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const [showCamera, setShowCamera] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [segmentationFree, setSegmentationFree] = useState<boolean>(true);
  const [garmentPhotoType, setGarmentPhotoType] = useState<string>("auto");
  const [mode, setMode] = useState<string>("performance");

  const handleImageUpload = (e: any, type: any) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: UploadedImage = {
          id: Math.random().toString(36).substring(7),
          url: e.target?.result,
          type,
          file: file,
        };

        if (type === "model") {
          setModelImages((prev: any) => {
            if (prev.length < appConstant.NO_OF_TRYON_MODEL) {
              return [...prev, newImage];
            } else {
              toast.info("You can only upload up to 4 model images");
              return prev;
            }
          });
        } else {
          setGarmentImage(newImage);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string, type: string) => {
    if (type === "model") {
      setModelImages((prev: any) => prev.filter((img: any) => img.id !== id));
    } else {
      setGarmentImage(null);
    }
  };

  // Handle generating try-on results
  const tryOn = async () => {
    resetState();
    if (modelImages.length === 0) {
      toast.error("Please upload atleast 1 model image");
      return;
    }
    if (garmentImage === null) {
      toast.error("Please upload a garment image");
      return;
    }
    try {
      setIsGenerating(true);
      const formData = new FormData();
      modelImages.forEach((file: any) => {
        formData.append("model_images", file.file);
      });
      formData.append("garment_image", garmentImage.file);
      formData.append("category", category);
      formData.append("requiredPoints", `${modelImages.length * appConstant.TRYON_DEDUCT_POINT}`);

      formData.append("segmentation_free", `${segmentationFree}`);
      formData.append("garment_photo_type", garmentPhotoType);
      formData.append("mode", mode);

      const response = await modelService.virtualTryon(formData);
      console.log("data", response.tryonResult);
      setResultImage(response.tryonResult); // Update results
      setIsGenerating(false);
      dispatch(setUserRefresh());
    } catch (error: any) {
      setIsGenerating(false);
      console.error("Error generating try-on:", error.response?.data || error.message);
      toast.error(error.message);
    }
  };

  const onSelectResult = (model: modelResult) => {
    if (resultImage.length === 0) return;
    if (selectedResult.find((m) => m.url === model.url)) {
      setSelectedResult((prev) => prev.filter((m, i) => m.url !== model.url));
    } else {
      setSelectedResult((prev) => [...prev, model]);
    }
  };

  const extractModelImages = () => {
    setUploading(true);
    if (location.state && location.state === "model") {
      const models = generatedModelList.filter((m, i) => selectedModel.includes(`${i}`));
      models.length = appConstant.NO_OF_TRYON_MODEL;
      models.forEach(async (m) => {
        const file = await commonService.downloadSingleFile(m.url);
        setModelImages((prev: any) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            url: m.url,
            type: "model",
            file: file,
          },
        ]);
      });
      setUploading(false);
    } else if (location.state && location.state === "gallery") {
      const models = selectedModel;
      models.forEach(async (m) => {
        const file = await commonService.downloadSingleFile(m);
        setModelImages((prev: any) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            url: m,
            type: "model",
            file: file,
          },
        ]);
      });
      setUploading(false);
    } else {
      selectedModel.forEach(async (key, i1) => {
        const [leftIndex, rightIndex] = key.split("_").map(Number);
        if (modelList[leftIndex]) {
          const element = modelList[leftIndex];
          const imageUrl = element.generatedImages.image_urls[rightIndex];

          // Add the image URL if it exists
          if (imageUrl) {
            const file = await commonService.downloadSingleFile(imageUrl);
            setModelImages((prev: any) => [
              ...prev,
              {
                id: Math.random().toString(36).substring(7),
                url: imageUrl,
                type: "model",
                file: file,
              },
            ]);
          }
        }
        setUploading(false);
      });
    }
  };

  useEffect(() => {
    if (selectedModel.length > 0) {
      setUploading(true);
      extractModelImages();
      setUploading(false);
    }
    return () => {
      resetState();
      setModelImages([]);
      setGarmentImage(null);
      dispatch(clearSelectedModel());
    };
  }, []);

  const handleDownloadAll = async (): Promise<void> => {
    if (selectedResult.length === 0) {
      toast.info("Please select atleast one model to download");
      return;
    }
    if (!resultImage || resultImage.length === 0) return;
    setDownloadLoading(true);

    try {
      const result = await commonService.downloadFileFromAPI(
        selectedResult.map((f) => f.url),
        "tryon"
      );
      setDownloadLoading(false);
    } catch (error: any) {
      setDownloadLoading(false);
      toast.error("Failed to download images");
    }
  };

  const resetState = () => {
    setResultImage([]);
    setIsGenerating(false);
    setDownloadLoading(false);
  };

  const onSelectAll = () => {
    if (selectedResult.length > 0 && selectedResult.length === resultImage.length) {
      setSelectedResult([]);
    } else {
      setSelectedResult(resultImage.map((r: any, i: number) => ({ url: r[0], id: i.toString() })));
    }
  };

  const stopCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Modify handleCameraCapture to use facingMode
  const handleCameraCapture = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast.error("Unable to access camera");
      console.error("Camera error:", error);
    }
  };

  // Add function to switch camera
  const switchCamera = async () => {
    stopCameraStream();
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode === "user" ? "environment" : "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast.error("Unable to switch camera");
      console.error("Camera switch error:", error);
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob: any) => {
          if (blob) {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            const reader = new FileReader();

            reader.onload = (e) => {
              const newImage: UploadedImage = {
                id: Math.random().toString(36).substring(7),
                url: e.target?.result,
                type: "model",
                file: file,
              };

              setModelImages((prev: any) => {
                if (prev.length < appConstant.NO_OF_TRYON_MODEL) {
                  return [...prev, newImage];
                } else {
                  toast.info("You can only upload up to 4 model images");
                  return prev;
                }
              });
            };
            reader.readAsDataURL(file);
          }
          stopCameraStream();
          setShowCamera(false);
        },
        "image/jpeg",
        0.8
      );
    }
  };

  // Add cleanup effect
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  return (
    <div className='h-screen bg-gray-800 overflow-hidden'>
      {/* Header */}
      <header className='bg-gray-900 text-white py-4 px-6 flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <Link to={"/"}>
            <img src={DarkLogo} className='w-20 h-8  top-3 left-3' alt='AI4FI' />
          </Link>
          <Tshirt className='h-6 w-6' />
          <h1 className=' font-bold md:text-xl text-md'>TryOn Room</h1>
        </div>
        <div className='flex gap-2 items-center'>
          <Link to='/features'>
            <button className='flex items-center text-white hover:text-gray-300 transition-colors'>
              <ArrowLeft className='w-5 h-5 mr-2' />
              Back
            </button>
          </Link>
          <Link to='/'>
            <button className='flex items-center text-white hover:text-gray-300 transition-colors'>Home</button>
          </Link>
        </div>
      </header>

      <div className='w-full h-[calc(100vh_-_65px)]  lg:overflow-hidden overflow-auto'>
        <div className='flex flex-col lg:flex-row'>
          {/* Model Images Upload */}
          <div className='lg:basis-4/12 p-4  lg:h-[calc(100vh_-_72px)] h-[650px] overflow-x-auto relative'>
            <div>
              <div className=' rounded-lg shadow-sm'>
                <div className='flex justify-between items-center mb-3'>
                  <h2 className='text-sm font-semibold text-gray-100'>Upload Model Photos</h2>
                  <span className='text-white'>{modelImages.length > 0 && modelImages.length}</span>
                </div>
                <div className='border-2 border-dashed border-gray-500/55 rounded-lg overflow-hidden'>
                  <div className='flex flex-col gap-4 bg-gray-900 '>
                    <label className=' flex gap-2 items-center justify-center cursor-pointer pt-2'>
                      <Upload className='w-6 h-6 text-gray-400' />
                      <span className='mt-2 text-sm text-gray-500 text-center'>
                        {modelImages.length > 0 ? `${modelImages.length} Uploaded model` : " Upload multiple model photos"}
                      </span>
                      <input
                        type='file'
                        multiple
                        accept='.jpg,.jpeg'
                        max={appConstant.NO_OF_TRYON_MODEL}
                        maxLength={appConstant.NO_OF_TRYON_MODEL}
                        className='hidden'
                        onChange={(e) => handleImageUpload(e, "model")}
                      />
                    </label>

                    <button
                      onClick={handleCameraCapture}
                      className='flex gap-2 items-center justify-center cursor-pointer border-t border-gray-700 pt-3 pb-4'>
                      <Camera className='w-6 h-6 text-gray-400' />
                      <span className='text-sm text-gray-500'>Take a photo with camera</span>
                    </button>
                  </div>
                </div>
                <p className='text-gray-400 italic text-[12px] mt-1'>You can upload only 4 model images</p>
              </div>
            </div>
            <div>
              {/* Garment Upload */}
              <div className='rounded-lg shadow-sm pb-6 mt-6'>
                <h2 className='text-sm font-semibold mb-4 text-gray-100'>Upload Garment</h2>
                <div className='border-2 border-dashed border-gray-500/55 rounded-lg px-4 py-6 bg-gray-900'>
                  <label className='flex justify-center gap-2 items-center cursor-pointer'>
                    <ImageIcon className='w-6 h-6 text-gray-400' />
                    <span className='mt-2 text-sm text-gray-500 text-center'>Upload garment photo. Supported image .jpg and jpeg</span>
                    <input type='file' accept='.jpg,.jpeg' className='hidden' onChange={(e) => handleImageUpload(e, "garment")} />
                  </label>
                </div>

                {/* Garment Preview */}
                {garmentImage && (
                  <div className='relative mt-4'>
                    <img src={garmentImage.url} alt='Garment' className='w-full h-36 object-contain rounded-lg' />
                    <button
                      onClick={() => removeImage(garmentImage.id, "garment")}
                      className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1'>
                      <X className='w-4 h-4' />
                    </button>
                  </div>
                )}
              </div>

              <div className='flex gap-3 items-center'>
                <div className='py-3 md:basis-9/12 basis-8/12'>
                  <label className='block text-sm font-medium mb-2 text-gray-100'>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className='w-full border border-gray-700 text-gray-100 focus:border-gray-700 active:border-gray-700  bg-gray-900 rounded-lg px-4 py-2'>
                    <option value='auto'>Auto</option>
                    <option value='tops'>Tops</option>
                    <option value='bottoms'>Bottoms</option>
                    <option value='one-pieces'>One-Pieces</option>
                  </select>
                </div>
                <div className='py-2 md:basis-3/6 basis-4/12 flex justify-end'>
                  <div>
                    <label className='block text-sm font-medium mb-2 text-gray-100'>Segmentation Free</label>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={segmentationFree}
                        onChange={(e) => setSegmentationFree(e.target.checked)}
                        className='sr-only peer focus:shadow-none focus:outline-none focus:border-none'
                      />
                      <div className="peer rounded-md outline-none duration-100 after:duration-500  w-28 h-10 bg-gray-900 peer-focus:outline-none peer-focus:ring-none peer-focus:ring-4   after:content-['No'] after:absolute after:outline-none after:h-[32px] after:w-12 after:rounded-md after:bg-white after:top-1 after:left-1 after:flex after:justify-center after:items-center  after:text-gray-900 after:font-bold peer-checked:after:translate-x-14 peer-checked:after:content-['Yes'] peer-checked:after:border-white"></div>
                    </label>
                  </div>
                </div>
              </div>
              <div className='flex justify-between gap-3'>
                <div className='py-2  w-full'>
                  <label className='block text-sm font-medium mb-2 text-gray-100'>Garment Photo Type</label>
                  <select
                    value={garmentPhotoType}
                    onChange={(e) => setGarmentPhotoType(e.target.value)}
                    className='w-full border border-gray-700 text-gray-100 focus:border-gray-700 active:border-gray-700 bg-gray-900 rounded-lg px-4 py-2'>
                    <option value='auto'>Auto</option>
                    <option value='flat-lay'>Flat-Lay</option>
                    <option value='model'>Model</option>
                  </select>
                </div>

                <div className='py-2 w-full'>
                  <label className='block text-sm font-medium mb-2 text-gray-100'>Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className='w-full border border-gray-700 text-gray-100 focus:border-gray-700 active:border-gray-700 bg-gray-900 rounded-lg px-4 py-2'>
                    <option value='performance'>Performance</option>
                    <option value='balanced'>Balanced</option>
                    <option value='quality'>Quality</option>
                  </select>
                </div>
              </div>
              <button
                onClick={tryOn}
                className=' mt-6 w-full  cursor-pointer justify-center gap-2 items-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:bg-gradient-to-r hover:from-purple-800 hover:to-indigo-800 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-transform'>
                {isGenerating ? (
                  <div className='flex items-center gap-2 justify-center'>
                    <RefreshCw className='h-5 w-5 animate-spin' />
                    <span>Generating...</span>
                  </div>
                ) : (
                  "Try on Garments"
                )}
              </button>
            </div>
          </div>

          <div className='bg-gray-900 p-6 shadow-sm w-full  lg:basis-8/8  h-[calc(100vh_-_72px)] overflow-y-auto'>
            <div>
              <div className='w-full'>
                <div className='flex items-center justify-between mb-8'>
                  <h2 className='text-xl font-semibold mb-4 text-gray-100'>Try-On Result</h2>

                  {resultImage.length > 0 && (
                    <div className='flex items-center gap-4'>
                      <p
                        className={clsx(
                          " cursor-pointer hover:text-blue-500",
                          selectedResult.length === resultImage.length && selectedResult.length > 0 ? "text-blue-500" : "text-gray-200"
                        )}
                        onClick={onSelectAll}>
                        Select All
                      </p>
                      <button
                        onClick={handleDownloadAll}
                        className=' flex items-center hover:text-blue-500 justify-center gap-2 text-white text-md px-4 py-1 border-none rounded-md shadow-lg transition-transform transform hover:scale-110 hover:bg'>
                        <Download /> {downloadLoading && <LoadingSpinner size={20} />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className='rounded-lg pb-10 flex w-full flex-col'>
              {modelImages.length > 0 ? (
                <AnimatedCmp2
                  isGenerating={isGenerating}
                  modelImages={modelImages}
                  garmentImage={garmentImage}
                  resultImage={resultImage}
                  removeImage={removeImage}
                  selectedResult={selectedResult}
                  onSelectResult={onSelectResult}
                />
              ) : (
                <div className='text-gray-400 text-center'>
                  <ImageIcon className='w-16 h-16 mx-auto mb-4' />
                  {uploading ? (
                    <div className='flex justify-center'>
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <p>Select a model and garment, then click "Try On Garment" to see the result</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showCamera && (
        <div className='w-full h-[calc(100vh_-_65px)] overflow-hidden'>
          <div className='fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center'>
            <div className='bg-gray-900 p-4 rounded-lg'>
              <div className='relative'>
                <video ref={videoRef} autoPlay playsInline className='rounded-lg max-w-sm w-full h-[450px]' />
                <canvas ref={canvasRef} className='hidden' />
              </div>
              <div className='flex justify-center gap-4 mt-4'>
                <button onClick={capturePhoto} className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
                  Take Photo
                </button>
                <button onClick={switchCamera} className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700'>
                  Switch Camera
                </button>
                <button
                  onClick={() => {
                    stopCameraStream();
                    setShowCamera(false);
                  }}
                  className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'>
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* ... rest of your existing JSX ... */}
        </div>
      )}
    </div>
  );
};

export default VirtualTryon;
