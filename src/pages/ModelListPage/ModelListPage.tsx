import { useState, useEffect, FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlignLeft,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CopyIcon,
  Delete,
  DownloadCloud,
  DownloadIcon,
  Trash,
  ZoomIn,
} from "lucide-react";
import { toast } from "sonner";
import modelService from "../../services/modelService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { clearSelectedModel, setModelList, setSelectedModel } from "../../store/modelSlice";

import DarkLogo from "../../../public/dark-logo.png";
import { copySeed } from "../../services/utils";
import commonService from "../../services/commonService";
import authService from "../../services/authService";

const ModelListPage: FC = () => {
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const { modelList, selectedModel } = useSelector((state: RootState) => state.modelList);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("existingModels"); // Default to show Existing Models
  const [imageType, setImageType] = useState<string>("model");
  const [selectedResult, setSelectedResult] = useState<string[]>([]);
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);
  const [refreh, setRefresh] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [zoomedImage, setZoomedImage] = useState<string>("");
  const navigate = useNavigate();

  const getModelList = async () => {
    setLoading(true);
    try {
      const res = await modelService.getModelList(pageSize, limit, imageType);
      dispatch(setModelList(res.history));
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
      setPageSize(res.currentPage);
      setLoading(false);
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getModelList();
  }, [pageSize, imageType, activeTab, refreh]);
  useEffect(() => {
    dispatch(clearSelectedModel());
  }, []);

  const handleContinue = () => {
    navigate("/virtualtryon");
  };

  const handleDownloadAll = async (): Promise<void> => {
    if (selectedModel.length === 0) {
      toast.info("Please select atleast one model to download");
      return;
    }

    if (!selectedResult || selectedResult.length === 0) return;
    setDownloadLoading(true);
    const filterModel: any[] = [];
    let fileExt: string = ".png";
    if (imageType === "model") {
      fileExt = ".jpeg";
      selectedModel.forEach((key, i1) => {
        const [leftIndex, rightIndex] = key.split("_").map(Number);
        if (modelList[leftIndex]) {
          const element = modelList[leftIndex];
          const imageUrl = element.generatedImages.image_urls[rightIndex];
          if (imageUrl) {
            filterModel.push(imageUrl);
          }
        }
      });
    } else {
      fileExt = ".png";
      selectedModel.forEach((key, i1) => {
        const [leftIndex, rightIndex] = key.split("_").map(Number);
        if (modelList[leftIndex]) {
          const element = modelList[leftIndex];
          const imageUrl = element.generatedImages[rightIndex];
          if (imageUrl) {
            filterModel.push(imageUrl[0]);
          }
        }
      });
    }

    try {
      if (filterModel.length === 1) {
        const result = await commonService.downloadSingleFile(filterModel[0]);
        const blobUrl = URL.createObjectURL(result);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `image-${new Date().getTime()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      } else {
        const result = await commonService.downloadFileFromAPI(filterModel, imageType);
      }
      setDownloadLoading(false);
    } catch (error: any) {
      setDownloadLoading(false);
      toast.error("Failed to download images");
    }
  };

  const onSelectResult = (id: string) => {
    if (modelList.length === 0) return;
    if (selectedResult.includes(id)) {
      setSelectedResult((prev) => prev.filter((pId) => pId !== id));
    } else {
      if (selectedModel.length === 4 || selectedResult.length === 4) {
        return toast.info("You can select only 4 images at a time ");
      }
      setSelectedResult((prev) => [...prev, id]);
    }
  };

  const onChangeTab = (tab: string) => {
    setActiveTab(tab);
    dispatch(clearSelectedModel());
    if (tab === "existingModels") {
      setImageType("model");
    } else if (tab === "ownModels") {
      navigate("/model-gallery");
    } else if (tab === "tryon") {
      setImageType("tryon");
    }
  };

  const onPrv = () => {
    if (pageSize > 1) {
      setPageSize(pageSize - 1);
    }
  };

  const onNext = () => {
    if (totalPages > pageSize) {
      setPageSize(pageSize + 1);
    }
  };

  const onDeleteImage = async (id: string, url: string) => {
    try {
      const res = await modelService.deleteGenerateImage(id, url);
      toast.success(res.message);
      setRefresh(!refreh);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className='min-h-screen bg-gray-900 p-6 relative'>
      <div className='max-w-6xl mx-auto'>
        {/* Navigation & Header */}
        <div className='flex items-center justify-between mb-8'>
          <Link to={"/"}>
            <img src={DarkLogo} className='w-20 h-8  top-3 left-3' alt='AI4FI' />
          </Link>
          <h1 className='text-2xl font-bold text-white'>Select model images</h1>
          <div className='flex  items-center gap-2 '>
            <button
              onClick={() => navigate("/choose-option")}
              className='flex items-center text-white hover:text-gray-300 transition-colors'>
              <ArrowLeft className='w-5 h-5 mr-2' />
              Back
            </button>
            <Link to={"/"} className='text-white hover:text-gray-300'>
              Home
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className='flex justify-between items-start'>
          <div className='flex space-x-8 mb-8'>
            <button
              className={`text-lg font-medium ${activeTab === "existingModels" ? "text-blue-500" : "text-white"}`}
              onClick={() => onChangeTab("existingModels")}>
              Generated Models
            </button>
            <button
              className={`text-lg font-medium ${activeTab === "ownModels" ? "text-blue-500" : "text-white"}`}
              onClick={() => onChangeTab("ownModels")}>
              Custom Models
            </button>
            <button
              className={`text-lg font-medium ${activeTab === "tryon" ? "text-blue-500" : "text-white"}`}
              onClick={() => onChangeTab("tryon")}>
              Virtual Try On
            </button>
          </div>
          {modelList.length > 0 && (
            <div className='pt-2 flex gap-3 text-gray-100'>
              <h2 className='text-xl'>
                {pageSize * modelList.length}/{totalCount}
              </h2>
              <div className='flex items-center'>
                <ChevronLeft className='cursor-pointer hover:text-blue-400' onClick={onPrv} />
                <ChevronRight className='cursor-pointer hover:text-blue-400' onClick={onNext} />
              </div>
            </div>
          )}
        </div>

        {/* Models Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-24'>
          {!loading &&
            modelList.length > 0 &&
            imageType === "model" &&
            modelList.map(
              (model, i) =>
                model?.generatedImages?.image_urls?.length > 0 &&
                model?.generatedImages?.image_urls.map((url: string, index: number) => (
                  <div key={model._id} className='relative cursor-pointer group'>
                    <p
                      className='hover:text-blue-500 text-gray-200 flex items-center gap-1 cursor-pointer'
                      onClick={() => copySeed(model?.generatedImages?.seed)}>
                      <span className='text-[12px]'>DNA No - </span> <span>{model?.generatedImages?.seed}</span> <CopyIcon size={16} />
                    </p>
                    <div
                      className='relative aspect-square overflow-hidden rounded-xl'
                      onClick={() => {
                        dispatch(setSelectedModel(`${i}_${index}`));
                        onSelectResult(`${i}_${index}`);
                      }}>
                      <img
                        key={index}
                        src={url}
                        alt={`Model ${model._id} - Image ${index + 1}`}
                        className='w-auto h-auto max-w-full max-h-[500px] mx-auto object-cover rounded-xl transition-transform duration-300 group-hover:scale-105'
                      />

                      <div
                        className={`absolute inset-0 bg-black/40 transition-opacity ${
                          zoomedImage.includes(`${url}`) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}>
                        <div className='flex items-center h-full justify-center'>
                          <div className='flex space-x-4'>
                            <ZoomIn
                              className='h-6 w-6 z-[10] cursor-pointer text-gray-100 hover:text-blue-400'
                              onClick={() => {
                                setZoomedImage(url);
                                setIsModalOpen(true);
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Delete Image */}
                      <div
                        className={`absolute inset-0 bg-black/40 transition-opacity ${
                          zoomedImage.includes(`${url}`) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}>
                        <div className='absolute top-4 left-4'>
                          <div className='flex space-x-4'>
                            <Trash
                              className='h-6 w-6 z-[10] cursor-pointer text-red-400 hover:text-red-700'
                              onClick={() => {
                                onDeleteImage(model._id, url);
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div
                        className={`absolute inset-0 bg-black/40 transition-opacity ${
                          selectedModel.includes(`${i}_${index}`) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}>
                        <div className='absolute top-4 right-4'>
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              selectedModel.includes(`${i}_${index}`) ? "bg-blue-500" : "bg-white"
                            }`}>
                            <Check className={`w-5 h-5 ${selectedModel.includes(`${i}_${index}`) ? "text-white" : "text-gray-900"}`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          {!loading &&
            modelList.length > 0 &&
            imageType === "tryon" &&
            modelList.map(
              (model, i) =>
                model?.generatedImages?.length > 0 &&
                model?.generatedImages?.map((url: string, index: number) => (
                  <div
                    key={`${i}_${index}`}
                    className='relative cursor-pointer group'
                    onClick={() => {
                      dispatch(setSelectedModel(`${i}_${index}`));
                      onSelectResult(`${i}_${index}`);
                    }}>
                    <div className='relative aspect-square overflow-hidden rounded-xl'>
                      <img
                        src={url && url}
                        alt={`Model ${i}_${index}`}
                        className='w-auto h-auto max-w-full max-h-[500px] mx-auto object-contain rounded-xl transition-transform duration-300 group-hover:scale-105'
                      />
                      <div
                        className={`absolute inset-0 bg-black/40 transition-opacity ${
                          selectedModel.includes(`${i}_${index}`) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}>
                        <div className='absolute top-4 right-4'>
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              selectedModel.includes(`${i}_${index}`) ? "bg-blue-500" : "bg-white"
                            }`}>
                            <Check className={`w-5 h-5 ${selectedModel.includes(`${i}_${index}`) ? "text-white" : "text-gray-900"}`} />
                          </div>
                        </div>

                        {/* Delete Image */}
                        <div
                          className={`absolute inset-0 bg-black/40 transition-opacity ${
                            zoomedImage.includes(`${url}`) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}>
                          <div className='absolute top-4 left-4'>
                            <div className='flex space-x-4'>
                              <Trash
                                className='h-6 w-6 z-[10] cursor-pointer text-red-400 hover:text-red-700'
                                onClick={() => {
                                  onDeleteImage(model._id, url);
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div
                          className={`absolute inset-0 bg-black/40 transition-opacity ${
                            zoomedImage.includes(`${url}`) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}>
                          <div className='flex items-center h-full justify-center'>
                            <div className='flex space-x-4'>
                              <ZoomIn
                                className='h-6 w-6 z-[10] cursor-pointer text-gray-100 hover:text-blue-400'
                                onClick={() => {
                                  setZoomedImage(url);
                                  setIsModalOpen(true);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
        </div>

        {/* Continue Button */}
        <div className='fixed bottom-0 left-0 right-0 bg-gray-800 p-4'>
          <div className='max-w-6xl h-6  mx-auto flex items-center justify-between'>
            {imageType === "model" && selectedModel.length > 0 ? (
              <p className='text-white'>Selected: {selectedModel.length}</p>
            ) : (
              <div></div>
            )}
            <div className='space-x-2 flex'>
              {selectedModel.length > 0 && (
                <button
                  onClick={handleDownloadAll}
                  className='flex text-sm justify-center gap-2 items-center hover:bg-gradient-to-r hover:from-purple-800 hover:to-indigo-800 text-white font-bold px-8 py-2 rounded-lg shadow-lg transition-transform'>
                  <span>{downloadLoading ? "Downloading... " : "Download"}</span> <DownloadIcon size={20} />
                </button>
              )}
              {imageType === "model" && selectedModel.length > 0 && (
                <button
                  onClick={handleContinue}
                  className='flex text-sm justify-center gap-2 items-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:bg-gradient-to-r hover:from-purple-800 hover:to-indigo-800 text-white font-bold px-8 py-2 rounded-lg shadow-lg transition-transform'>
                  <span>Virtual Try Room</span> <ArrowRight size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div
            className='fixed inset-0 bg-black bg-opacity-75  !ml-0 flex items-center justify-center z-50'
            onClick={() => setIsModalOpen(false)}>
            <div className='relative'>
              <img src={zoomedImage} alt='Zoomed' className='max-w-full max-h-screen' />
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setZoomedImage("");
                }}
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
  );
};

export default ModelListPage;
