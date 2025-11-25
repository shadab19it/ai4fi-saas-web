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
  const [flowsList, setFlowsList] = useState<any[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<any | null>(null);
  const [isFlowModalOpen, setIsFlowModalOpen] = useState<boolean>(false);
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

  const getFlowsList = async () => {
    setLoading(true);
    try {
      const res = await modelService.getFlowsList(pageSize, limit);
      setFlowsList(res.flows || []);
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
    if (activeTab === "ads") {
      getFlowsList();
    } else {
      getModelList();
    }
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
    if (imageType === "model" || imageType === "tryon_beta" || imageType === "pose_variants") {
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
    } else if (tab === "tryon_beta") {
      setImageType("tryon_beta");
    } else if (tab === "pose_variants") {
      setImageType("pose_variants");
    } else if (tab === "ads") {
      setImageType("ads");
    }
  };

  const handleFlowClick = (flow: any) => {
    setSelectedFlow(flow);
    setIsFlowModalOpen(true);
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
              onClick={() => navigate("/features")}
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
          <div className='flex flex-wrap space-x-8 mb-8'>
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
            <button
              className={`text-lg font-medium ${activeTab === "tryon_beta" ? "text-blue-500" : "text-white"}`}
              onClick={() => onChangeTab("tryon_beta")}>
              Try On Beta
            </button>
            <button
              className={`text-lg font-medium ${activeTab === "pose_variants" ? "text-blue-500" : "text-white"}`}
              onClick={() => onChangeTab("pose_variants")}>
              Pose Variants
            </button>
            <button
              className={`text-lg font-medium ${activeTab === "ads" ? "text-blue-500" : "text-white"}`}
              onClick={() => onChangeTab("ads")}>
              Ads
            </button>
          </div>
          {((activeTab === "ads" && flowsList.length > 0) || (activeTab !== "ads" && modelList.length > 0)) && (
            <div className='pt-2 flex gap-3 text-gray-100'>
              <h2 className='text-xl'>
                {pageSize * (activeTab === "ads" ? flowsList.length : modelList.length)}/{totalCount}
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
            (imageType === "model" || imageType === "tryon" || imageType === "tryon_beta" || imageType === "pose_variants") &&
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
          {!loading &&
            modelList.length > 0 &&
            imageType === "tryon_beta" &&
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
          {!loading &&
            modelList.length > 0 &&
            imageType === "pose_variants" &&
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
          {/* Flows/Ads Card List */}
          {!loading &&
            activeTab === "ads" &&
            flowsList.length > 0 &&
            flowsList.map((flow, index) => {
              const productName = flow?.step1_generatePrompt?.product_name || "Unknown Product";
              const flowStatus = flow?.flowStatus || "pending";
              const thumbnailUrl = flow?.step3_createAdFromProduct?.urls?.[0] || flow?.step2_productPreprocessing?.urls?.[0] || "";
              const createdAt = flow?.createdAt ? new Date(flow.createdAt).toLocaleDateString() : "";

              return (
                <div
                  key={index}
                  onClick={() => handleFlowClick(flow)}
                  className='bg-gray-800 rounded-xl p-4 cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700'>
                  {thumbnailUrl && (
                    <img
                      src={thumbnailUrl}
                      alt={productName}
                      className='w-full h-48 object-cover rounded-lg mb-3'
                    />
                  )}
                  <div>
                    <h3 className='text-white font-semibold text-lg mb-2'>{productName}</h3>
                    <div className='flex items-center gap-4 text-sm text-gray-400'>
                      <span className={`px-2 py-1 rounded ${
                        flowStatus === "completed" ? "bg-green-500/20 text-green-400" :
                        flowStatus === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-gray-500/20 text-gray-400"
                      }`}>
                        <span className="capitalize">{flowStatus}</span>
                      </span>
                      {createdAt && <span>Created: {createdAt}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
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

        {/* Flow Details Modal */}
        {isFlowModalOpen && selectedFlow && (
          <div
            className='fixed inset-0 bg-black bg-opacity-75 !ml-0 flex items-center justify-center z-50 p-4'
            onClick={() => setIsFlowModalOpen(false)}>
            <div
              className='bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'
              onClick={(e) => e.stopPropagation()}>
              <div className='sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center'>
                <h2 className='text-2xl font-bold text-white'>
                  {selectedFlow?.step1_generatePrompt?.product_name || "Flow Details"}
                </h2>
                <button
                  onClick={() => {
                    setIsFlowModalOpen(false);
                    setSelectedFlow(null);
                  }}
                  className='bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700'>
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

              <div className='p-6 space-y-6'>
                {/* Step 1: Generate Prompt */}
                {selectedFlow?.step1_generatePrompt && (
                  <div className='bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500'>
                    <h3 className='text-xl font-semibold text-white mb-3'>Step 1: Generate Prompt</h3>
                    <div className='space-y-2 text-gray-300'>
                      <p><span className='font-semibold'>Product:</span> {selectedFlow.step1_generatePrompt.product_name}</p>
                      <p><span className='font-semibold'>Description:</span> {selectedFlow.step1_generatePrompt.description}</p>
                      <p><span className='font-semibold'>Tagline:</span> {selectedFlow.step1_generatePrompt.product_tagline}</p>
                      <p><span className='font-semibold'>Model Gender:</span> {selectedFlow.step1_generatePrompt.model_gender}</p>
                      <p><span className='font-semibold'>Model Ethnicity:</span> {selectedFlow.step1_generatePrompt.model_ethnicity}</p>
                      <p><span className='font-semibold'>Tone:</span> {selectedFlow.step1_generatePrompt.tone}</p>
                      {/* <div className='mt-3'>
                        <p className='font-semibold mb-2'>Prompt:</p>
                        <p className='bg-gray-700 p-3 rounded text-sm'>{selectedFlow.step1_generatePrompt.prompt}</p>
                      </div> */}
                      <p className='text-green-400 text-sm mt-2'>
                        ✓ Completed at: {new Date(selectedFlow.step1_generatePrompt.completedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 2: Product Preprocessing */}
                {selectedFlow?.step2_productPreprocessing && (
                  <div className='bg-gray-800 rounded-lg p-4 border-l-4 border-purple-500'>
                    <h3 className='text-xl font-semibold text-white mb-3'>Step 2: Product Preprocessing</h3>
                    <div className='space-y-2 text-gray-300'>
                      <p><span className='font-semibold'>Mode:</span> {selectedFlow.step2_productPreprocessing.mode}</p>
                      <p><span className='font-semibold'>Requested Count:</span> {selectedFlow.step2_productPreprocessing.requested_count}</p>
                      {selectedFlow.step2_productPreprocessing.urls && selectedFlow.step2_productPreprocessing.urls.length > 0 && (
                        <div className='mt-3'>
                          <p className='font-semibold mb-2'>Processed Images:</p>
                          <div className='grid grid-cols-2 gap-4'>
                            {selectedFlow.step2_productPreprocessing.urls.map((url: string, idx: number) => (
                              <img key={idx} src={url} alt={`Preprocessed ${idx + 1}`} className='w-full rounded-lg' />
                            ))}
                          </div>
                        </div>
                      )}
                      <p className='text-green-400 text-sm mt-2'>
                        ✓ Completed at: {new Date(selectedFlow.step2_productPreprocessing.completedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3: Create Ad From Product */}
                {selectedFlow?.step3_createAdFromProduct && (
                  <div className='bg-gray-800 rounded-lg p-4 border-l-4 border-green-500'>
                    <h3 className='text-xl font-semibold text-white mb-3'>Step 3: Create Ad From Product</h3>
                    <div className='space-y-2 text-gray-300'>
                      <p><span className='font-semibold'>Mode:</span> {selectedFlow.step3_createAdFromProduct.mode}</p>
                      <p><span className='font-semibold'>Requested Count:</span> {selectedFlow.step3_createAdFromProduct.requested_count}</p>
                      {/* {selectedFlow.step3_createAdFromProduct.prompt && (
                        <div className='mt-3'>
                          <p className='font-semibold mb-2'>Prompt Used:</p>
                          <p className='bg-gray-700 p-3 rounded text-sm'>{selectedFlow.step3_createAdFromProduct.prompt}</p>
                        </div>
                      )} */}
                      {selectedFlow.step3_createAdFromProduct.urls && selectedFlow.step3_createAdFromProduct.urls.length > 0 && (
                        <div className='mt-3'>
                          <p className='font-semibold mb-2'>Generated Ad Images:</p>
                          <div className='grid grid-cols-2 gap-4'>
                            {selectedFlow.step3_createAdFromProduct.urls.map((url: string, idx: number) => (
                              <img key={idx} src={url} alt={`Ad ${idx + 1}`} className='w-full rounded-lg' />
                            ))}
                          </div>
                        </div>
                      )}
                      <p className='text-green-400 text-sm mt-2'>
                        ✓ Completed at: {new Date(selectedFlow.step3_createAdFromProduct.completedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 4: Generate Video Ad Prompt */}
                {selectedFlow?.step4_generateVideoAdPrompt && (
                  <div className='bg-gray-800 rounded-lg p-4 border-l-4 border-yellow-500'>
                    <h3 className='text-xl font-semibold text-white mb-3'>Step 4: Generate Video Ad Prompt</h3>
                    <div className='space-y-2 text-gray-300'>
                      <p><span className='font-semibold'>Product Name:</span> {selectedFlow.step4_generateVideoAdPrompt.product_name}</p>
                      {selectedFlow.step4_generateVideoAdPrompt.audio_script && (
                        <p><span className='font-semibold'>Audio Script:</span> {selectedFlow.step4_generateVideoAdPrompt.audio_script}</p>
                      )}
                      {/* {selectedFlow.step4_generateVideoAdPrompt.video_prompt && (
                        <div className='mt-3'>
                          <p className='font-semibold mb-2'>Video Prompt:</p>
                          <p className='bg-gray-700 p-3 rounded text-sm whitespace-pre-wrap'>{selectedFlow.step4_generateVideoAdPrompt.video_prompt}</p>
                        </div>
                      )} */}
                      <p className='text-green-400 text-sm mt-2'>
                        ✓ Completed at: {new Date(selectedFlow.step4_generateVideoAdPrompt.completedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 5: Generate Ad Video */}
                {selectedFlow?.step5_generateAdVideo && (
                  <div className='bg-gray-800 rounded-lg p-4 border-l-4 border-red-500'>
                    <h3 className='text-xl font-semibold text-white mb-3'>Step 5: Generate Ad Video</h3>
                    <div className='space-y-2 text-gray-300'>
                      {selectedFlow.step5_generateAdVideo.video_url && (
                        <div className='mt-3'>
                          <p className='font-semibold mb-2'>Video:</p>
                          <video
                            src={selectedFlow.step5_generateAdVideo.video_url}
                            controls
                            className='w-full rounded-lg'
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                      {/* {selectedFlow.step5_generateAdVideo.prompt && (
                        <div className='mt-3'>
                          <p className='font-semibold mb-2'>Prompt:</p>
                          <p className='bg-gray-700 p-3 rounded text-sm whitespace-pre-wrap'>{selectedFlow.step5_generateAdVideo.prompt}</p>
                        </div>
                      )} */}
                      {selectedFlow.step5_generateAdVideo.duration_seconds && (
                        <p><span className='font-semibold'>Duration:</span> {selectedFlow.step5_generateAdVideo.duration_seconds} seconds</p>
                      )}
                      <p className='text-green-400 text-sm mt-2'>
                        ✓ Completed at: {new Date(selectedFlow.step5_generateAdVideo.completedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelListPage;
