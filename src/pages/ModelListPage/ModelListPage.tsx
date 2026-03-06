import { useState, useEffect, FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  DownloadIcon,
  ImageIcon,
  Trash2,
  ZoomIn,
} from "lucide-react";
import { toast } from "sonner";
import modelService from "../../services/modelService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  clearSelectedModel,
  setModelList,
  setSelectedModel,
  type GeneratedModel,
  type ProductListingData,
} from "../../store/modelSlice";

import commonService from "../../services/commonService";
import Button from "../../components/ui/Button";
import ZoomImageModal from "../../components/ui/ZoomImageModal";
import clsx from "clsx";

const ModelListPage: FC = () => {
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const { modelList, selectedModel } = useSelector((state: RootState) => state.modelList);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("existingModels");
  const [imageType, setImageType] = useState<string>("model");
  const [selectedResult, setSelectedResult] = useState<string[]>([]);
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  // Zoom Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [zoomedImage, setZoomedImage] = useState<string>("");
  
  // Flows / Ads
  const [flowsList, setFlowsList] = useState<any[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<any | null>(null);
  const [isFlowModalOpen, setIsFlowModalOpen] = useState<boolean>(false);
  const [selectedListingGeneration, setSelectedListingGeneration] = useState<GeneratedModel | null>(null);
  const [isListingModalOpen, setIsListingModalOpen] = useState<boolean>(false);
  
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
  }, [pageSize, imageType, activeTab, refresh]);

  useEffect(() => {
    dispatch(clearSelectedModel());
  }, []);

  const handleContinue = () => {
    navigate("/virtualtryon");
  };

  const handleDownloadAll = async (): Promise<void> => {
    if (selectedModel.length === 0) {
      toast.info("Please select at least one model to download");
      return;
    }

    if (!selectedResult || selectedResult.length === 0) return;
    setDownloadLoading(true);
    const filterModel: any[] = [];
    
    // Logic to extract URL based on imageType
    if (imageType === "model" || imageType === "tryon_beta" || imageType === "pose_variants" || imageType === "product_listing_banner" || imageType === "product_listing" || imageType === "unstitched_tryon") {
      selectedModel.forEach((key) => {
        const [leftIndex, rightIndex] = key.split("_").map(Number);
        if (modelList[leftIndex]) {
          const element = modelList[leftIndex];
          const imageUrl = element.generatedImages?.image_urls?.[rightIndex];
          if (imageUrl) {
            filterModel.push(imageUrl);
          }
        }
      });
    } else {
      selectedModel.forEach((key) => {
        const [leftIndex, rightIndex] = key.split("_").map(Number);
        if (modelList[leftIndex]) {
          const element = modelList[leftIndex];
           const imageUrl = element.generatedImages?.[rightIndex];
           if (imageUrl) {
             if (Array.isArray(imageUrl)) filterModel.push(imageUrl[0]);
             else filterModel.push(imageUrl);
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
        await commonService.downloadFileFromAPI(filterModel, imageType);
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
      setSelectedResult((prev) => [...prev, id]);
    }
  };

  const onChangeTab = (tab: string) => {
    setActiveTab(tab);
    dispatch(clearSelectedModel());
    setSelectedResult([]);
    setIsListingModalOpen(false);
    setSelectedListingGeneration(null);
    // Update imageType based on tab
    switch(tab) {
        case "existingModels": setImageType("model"); break;
        case "ownModels": navigate("/model-gallery"); break;
        case "tryon": setImageType("tryon"); break;
        case "tryon_beta": setImageType("tryon_beta"); break;
        case "pose_variants": setImageType("pose_variants"); break;
        case "product_listing_banner": setImageType("product_listing_banner"); break;
        case "product_listing": setImageType("product_listing"); break;
        case "unstitched_tryon": setImageType("unstitched_tryon"); break;
        case "ads": setImageType("ads"); break;
        default: setImageType("model");
    }
    setPageSize(1); // Reset to first page on tab change
  };

  const handleFlowClick = (flow: any) => {
    setSelectedFlow(flow);
    setIsFlowModalOpen(true);
  };

  const onPrev = () => {
    if (pageSize > 1) setPageSize(pageSize - 1);
  };

  const onNext = () => {
    if (totalPages > pageSize) setPageSize(pageSize + 1);
  };

  const onDeleteImage = async (id: string, url: string) => {
    toast("Delete this image?", {
        description: "This action cannot be undone.",
        action: {
            label: "Delete",
            onClick: async () => {
                try {
                    const res = await modelService.deleteGenerateImage(id, url);
                    toast.success(res.message);
                    setRefresh(!refresh);
                } catch (error: any) {
                    toast.error(error.message);
                }
            }
        },
        cancel: {
            label: "Cancel",
            onClick: () => {}
        }
    });
  };

  const isSelectionEnabled = activeTab !== "ads" && imageType !== "product_listing";

  const mapMarketplaceLabel = (marketplace?: string) => {
    if (!marketplace) return "Marketplace";
    if (marketplace === "amazon") return "Amazon";
    if (marketplace === "flipkart") return "Flipkart";
    if (marketplace === "myntra") return "Myntra";
    return marketplace;
  };

  const getSpecificationRows = (listingData?: ProductListingData) => {
    if (!listingData?.specifications) return [];
    if (Array.isArray(listingData.specifications)) {
      return listingData.specifications
        .map((item) => ({
          key: item.Attribute ?? "",
          val: item.Value ?? "",
        }))
        .filter((item) => item.key || item.val);
    }
    return Object.entries(listingData.specifications).map(([key, val]) => ({ key, val }));
  };

  const handleOpenListingDetails = (model: GeneratedModel) => {
    setSelectedListingGeneration(model);
    setIsListingModalOpen(true);
  };

  const handleCopyListingField = async (value: string, label: string) => {
    if (!value.trim()) {
      toast.info(`No ${label} available to copy`);
      return;
    }
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied`);
  };

  const handleCopyListingAll = async (listingData?: ProductListingData) => {
    if (!listingData) {
      toast.info("Listing copy is not available for this generation");
      return;
    }
    await navigator.clipboard.writeText(JSON.stringify(listingData, null, 2));
    toast.success("Listing data copied");
  };

  const handleDownloadListingImage = async (url: string, index: number) => {
    try {
      const result = await commonService.downloadSingleFile(url);
      const blobUrl = URL.createObjectURL(result);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `lifestyle-listing-${index + 1}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error("Failed to download image");
    }
  };

  // Helper to render image cards
  const renderImageCard = (model: any, url: string, i: number, index: number) => {
      const uniqueId = `${i}_${index}`;
      const isSelected = selectedModel.includes(uniqueId);

      return (
        <div 
            key={uniqueId} 
            className={clsx(
                "group relative rounded-2xl overflow-hidden bg-white border cursor-pointer transition-all duration-300",
                isSelected ? "border-violet-600 ring-2 ring-violet-600/20 shadow-md" : "border-[#E5E2DA] shadow-sm hover:shadow-[0_4px_12px_rgba(28,25,23,0.1)] hover:border-[#D0CBBF]"
            )}
            onClick={() => {
                dispatch(setSelectedModel(uniqueId));
                onSelectResult(uniqueId);
            }}
        >
            <div className="aspect-[3/4] overflow-hidden bg-gray-50">
                <img 
                    src={url} 
                    alt={`Model ${uniqueId}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
            </div>

            {/* Selection Badge */}
            <div className={clsx(
                "absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 z-10",
                isSelected ? "bg-violet-600 scale-100" : "bg-white/80 backdrop-blur-sm border border-[#E5E2DA] opacity-0 group-hover:opacity-100 scale-90"
            )}>
                 <Check className={clsx("w-4 h-4", isSelected ? "text-white" : "text-[#9E9893]")} />
            </div>

            {/* Hover Actions Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-2">
                 <Button 
                    size="icon" 
                    className="h-8 w-8 bg-white/95 backdrop-blur hover:bg-white border-0 rounded-full shadow-sm"
                    icon={<ZoomIn className="w-4 h-4" />}
                    onClick={(e) => {
                        e.stopPropagation();
                        setZoomedImage(url);
                        setIsModalOpen(true);
                    }}
                 >
                 </Button>
                 <Button 
                    size="icon" 
                    icon={<Trash2 className="w-4 h-4" />}
                    className="h-8 w-8 bg-white/95 backdrop-blur hover:!bg-red-50 hover:!text-red-700 border-0 rounded-full shadow-sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteImage(model._id, url);
                    }}
                 >
                 </Button>
            </div>
        </div>
      );
  };

  const selectedListingData = selectedListingGeneration?.configData?.listing_data as ProductListingData | undefined;
  const selectedListingImages = selectedListingGeneration?.generatedImages?.image_urls || [];
  const selectedListingSpecs = getSpecificationRows(selectedListingData);

  return (
    <div className="min-h-screen bg-[#F4F3EF] flex flex-col">
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E5E2DA] px-5 py-3">
            <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to='/' className='flex items-center gap-2'>
                     <img src={"/public/dark-logo2.png"} alt="AI4FI" className='w-18 h-12 object-contain' />
                    </Link>
                    <div className="h-6 w-px bg-[#E5E2DA] hidden sm:block" />
                    <nav className="hidden sm:flex items-center gap-1">
                        <Link to="/" className="text-[13px] font-medium text-[#9E9893] hover:text-stone-900 px-2 py-1 rounded-md hover:bg-[#F9F8F5] transition-colors">
                            Home
                        </Link>
                        <span className="text-[#E5E2DA]">/</span>
                        <span className="text-[13px] font-medium text-stone-900 px-2 py-1">
                            Gallery
                        </span>
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                     {isSelectionEnabled && selectedModel.length > 0 && (
                         <div className="hidden sm:flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300 mr-2">
                             <span className="text-xs font-medium text-[#9E9893] bg-[#F9F8F5] px-2 py-1 rounded-md border border-[#E5E2DA]">
                                 {selectedModel.length} Selected
                             </span>
                             <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleDownloadAll} 
                                loading={downloadLoading}
                                icon={<DownloadIcon className="w-3.5 h-3.5 text-stone-700" />}
                             >
                                 Download
                             </Button>
                             {imageType === "model" && (
                                <Button 
                                    variant="gradient" 
                                    size="sm" 
                                    onClick={handleContinue}
                                    icon={<ArrowRight className="w-3.5 h-3.5 text-white" />}
                                >
                                    Try Room
                                </Button>
                             )}
                         </div>
                     )}
                     <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate("/")}
                        icon={<ArrowLeft className="w-3.5 h-3.5" />}
                     >
                        Back
                     </Button>
                </div>
            </div>
        </header>

        {/* Filters / Tabs Bar */}
        <div className="bg-white border-b border-[#E5E2DA] px-5 py-1 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="max-w-[1600px] mx-auto w-full overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-6">
                    {[
                        { id: "existingModels", label: "Generated Models" },
                        { id: "ownModels", label: "Custom Models" },
                        // { id: "tryon", label: "Virtual Try On" }, // Removed as per user request
                        { id: "tryon_beta", label: "Try On Beta" },
                        { id: "pose_variants", label: "Pose Variants" },
                        { id: "product_listing_banner", label: "Banners" },
                        { id: "product_listing", label: "Lifestyle Listing" },
                        { id: "unstitched_tryon", label: "Stichify" },
                        { id: "ads", label: "Ads" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onChangeTab(tab.id)}
                            className={clsx(
                                "relative py-3 text-[13px] font-medium transition-colors whitespace-nowrap",
                                activeTab === tab.id 
                                    ? "text-violet-600" 
                                    : "text-[#9E9893] hover:text-stone-700"
                            )}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-violet-600 rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 max-w-[1600px] mx-auto w-full p-5 sm:p-6 lg:p-8">
            
            {/* Pagination / Info Top Bar */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-stone-900">
                    {activeTab === "ads" ? "Ad Campaigns" 
                     : activeTab === "product_listing_banner" ? "Product Banners" 
                     : activeTab === "product_listing" ? "Lifestyle Listings" 
                     : activeTab === "unstitched_tryon" ? "Stichify" 
                     : "Model Gallery"}
                </h2>
                
                {((activeTab === "ads" && flowsList.length > 0) || (activeTab !== "ads" && modelList.length > 0)) && (
                     <div className="flex items-center gap-3 bg-white border border-[#E5E2DA] rounded-lg p-1 pr-3 shadow-sm">
                         <div className="flex items-center">
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={onPrev} 
                                disabled={pageSize <= 1}
                                icon={<ChevronLeft className="w-4 h-4 text-stone-600" />}
                                className="h-8 w-8 rounded-md"
                             >
                             </Button>
                             <span className="text-[13px] font-mono font-medium text-stone-600 min-w-[3rem] text-center">
                                 {pageSize} / {totalPages}
                             </span>
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={onNext} 
                                disabled={pageSize >= totalPages}
                                icon={<ChevronRight className="w-4 h-4 text-stone-600" />}
                                className="h-8 w-8 rounded-md"
                             >
                             </Button>
                         </div>
                         <div className="h-4 w-px bg-[#E5E2DA]" />
                         <span className="text-[12px] font-medium text-[#9E9893]">
                             Total: {totalCount}
                         </span>
                     </div>
                )}
            </div>

            {/* Content Grid */}
            {!loading && (
                <>
                    {/* Models Grid */}
                    {activeTab !== "ads" && modelList.length > 0 && (
                        <>
                            {imageType === "product_listing" ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                    {modelList.map((model) => {
                                        const images = model.generatedImages?.image_urls || [];
                                        const cover = images[0];
                                        const listingData = model.configData?.listing_data as ProductListingData | undefined;
                                        const marketplace = mapMarketplaceLabel(model.configData?.target_marketplace as string | undefined);
                                        const productName = (model.configData?.product_name as string | undefined) || "Lifestyle Listing";

                                        return (
                                            <div
                                                key={model._id}
                                                onClick={() => handleOpenListingDetails(model)}
                                                className="group bg-white rounded-2xl border border-[#E5E2DA] overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                                            >
                                                <div className="aspect-[4/3] bg-gray-50 overflow-hidden relative">
                                                    {cover ? (
                                                        <img
                                                            src={cover}
                                                            alt={productName}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-[#D0CBBF]">
                                                            <ImageIcon className="w-10 h-10 opacity-50" />
                                                        </div>
                                                    )}
                                                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/90 text-[10px] font-bold text-stone-700 border border-[#E5E2DA]">
                                                        {images.length} image{images.length !== 1 ? "s" : ""}
                                                    </div>
                                                </div>

                                                <div className="p-4 space-y-1.5">
                                                    <h3 className="font-bold text-stone-900 truncate">{productName}</h3>
                                                    <p className="text-[12px] text-[#6B6560]">{marketplace}</p>
                                                    <p className="text-[12px] text-[#9E9893]">
                                                        {model.createdAt ? new Date(model.createdAt).toLocaleDateString() : "Unknown date"}
                                                    </p>
                                                    <p className="text-[11px] text-[#9E9893] line-clamp-2">
                                                        {listingData?.title || "Open to view and copy listing details."}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                                    {/* Types that store as { image_urls: [...] } */}
                                    {(imageType === "model" || imageType === "product_listing_banner" || imageType === "unstitched_tryon" || imageType === "tryon_beta" || imageType === "pose_variants") &&
                                        modelList.map((model, i) =>
                                            model.generatedImages?.image_urls?.map((url: string, index: number) =>
                                                renderImageCard(model, url, i, index)
                                            )
                                        )}

                                    {/* Legacy tryon which stores as a flat array */}
                                    {imageType === "tryon" &&
                                        modelList.map((model, i) => {
                                            const images = Array.isArray(model?.generatedImages)
                                                ? model.generatedImages
                                                : model?.generatedImages
                                                  ? [model.generatedImages]
                                                  : [];

                                            return images.map((urlOrArray: any, index: number) => {
                                                const url = Array.isArray(urlOrArray) ? urlOrArray[0] : urlOrArray;
                                                if (!url) return null;
                                                return renderImageCard(model, url, i, index);
                                            });
                                        })}
                                </div>
                            )}
                        </>
                    )}

                    {/* Ads List */}
                    {activeTab === "ads" && flowsList.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {flowsList.map((flow, index) => {
                                const productName = flow?.step1_generatePrompt?.product_name || "Unknown Product";
                                const flowStatus = flow?.flowStatus || "pending";
                                const statusColors = {
                                    completed: "bg-green-50 text-green-700 border-green-200",
                                    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
                                    failed: "bg-red-50 text-red-700 border-red-200"
                                } as any;
                                const thumbnailUrl = flow?.step3_createAdFromProduct?.urls?.[0] || flow?.step2_productPreprocessing?.urls?.[0];
                                
                                return (
                                    <div 
                                        key={index}
                                        onClick={() => handleFlowClick(flow)}
                                        className="bg-white rounded-2xl border border-[#E5E2DA] overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                                    >
                                        <div className="aspect-video bg-gray-50 overflow-hidden relative">
                                            {thumbnailUrl ? (
                                                <img src={thumbnailUrl} alt={productName} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-[#D0CBBF]">
                                                    <ImageIcon className="w-10 h-10 opacity-50" />
                                                </div>
                                            )}
                                            <div className="absolute top-3 right-3">
                                                <span className={clsx("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border", statusColors[flowStatus] || "bg-gray-100 text-gray-500")}>
                                                    {flowStatus}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-stone-900 truncate">{productName}</h3>
                                            <p className="text-[12px] text-[#9E9893] mt-1">
                                                {new Date(flow.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Empty State */}
                    {((activeTab !== "ads" && modelList.length === 0) || (activeTab === "ads" && flowsList.length === 0)) && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-24 h-24 rounded-3xl bg-white border border-[#E5E2DA] shadow-sm flex items-center justify-center mb-6">
                                <ImageIcon className="w-10 h-10 text-[#D0CBBF]" />
                            </div>
                            <h3 className="text-lg font-bold text-stone-900 mb-2">No items found</h3>
                            <p className="text-[#9E9893] max-w-md">
                                {activeTab === "ads" 
                                    ? "You haven't created any ad campaigns yet." 
                                    : "You haven't generated any models in this category yet."}
                            </p>
                            <div className="mt-8">
                                <Button onClick={() => navigate("/")}>Go to Generator</Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Loading State */}
            {loading && (
                 <div className="flex items-center justify-center py-32">
                     <div className="flex flex-col items-center gap-4">
                         <div className="w-10 h-10 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin" />
                         <p className="text-[13px] font-medium text-[#9E9893] animate-pulse">Loading gallery...</p>
                     </div>
                 </div>
            )}
        </main>

        {/* Floating Action Bar (Mobile Only) */}
        {isSelectionEnabled && selectedModel.length > 0 && (
            <div className="sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-stone-900/90 backdrop-blur-md text-white p-2 rounded-full shadow-xl border border-white/10 animate-in slide-in-from-bottom-6 px-4">
                <span className="text-xs font-bold mr-2">{selectedModel.length}</span>
                <div className="h-4 w-px bg-white/20" />
                <button onClick={handleDownloadAll} className="p-2 hover:text-blue-400"><Download className="w-4 h-4 text-white" /></button>
                {imageType === "model" && (
                    <button onClick={handleContinue} className="p-2 hover:text-violet-400"><ArrowRight className="w-4 h-4 text-white" /></button>
                )}
            </div>
        )}

        {/* Modals */}
        <ZoomImageModal 
            open={isModalOpen}
            onClose={() => {
                setIsModalOpen(false);
                setZoomedImage("");
            }}
            images={[zoomedImage]} // Simple single image zoom for now as array logic is complex with pagination
            initialIndex={0}
            alt="Expanded view"
            onDownload={(url) => {
                 // Re-use logic or simple download
                 const link = document.createElement("a");
                 link.href = url;
                 link.download = `image-${Date.now()}.jpg`;
                 document.body.appendChild(link);
                 link.click();
                 document.body.removeChild(link);
            }}
        />

        {/* Lifestyle Listing Details Modal */}
        {isListingModalOpen && selectedListingGeneration && (
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
                onClick={() => setIsListingModalOpen(false)}
            >
                <div
                    className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-5 border-b border-[#E5E2DA] flex justify-between items-center bg-gray-50/50">
                        <div>
                            <h2 className="text-xl font-bold text-stone-900">
                                {(selectedListingGeneration.configData?.product_name as string | undefined) || "Lifestyle Listing"}
                            </h2>
                            <p className="text-xs text-[#9E9893]">
                                {mapMarketplaceLabel(selectedListingGeneration.configData?.target_marketplace as string | undefined)}
                            </p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsListingModalOpen(false)} icon={<ChevronLeft className="w-5 h-5" />} />
                    </div>

                    <div className="p-6 overflow-y-auto space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-stone-900">Generated Images</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {selectedListingImages.map((url: string, idx: number) => (
                                    <div key={`${selectedListingGeneration._id}-${idx}`} className="rounded-xl overflow-hidden border border-[#E5E2DA] bg-white">
                                        <img src={url} alt={`Lifestyle listing ${idx + 1}`} className="w-full aspect-square object-cover" />
                                        <button
                                            onClick={() => handleDownloadListingImage(url, idx)}
                                            className="w-full text-[12px] font-semibold text-stone-700 py-2 border-t border-[#E5E2DA] hover:bg-[#F9F8F5] transition-colors"
                                        >
                                            Download
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-stone-900">Listing Copy</h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCopyListingAll(selectedListingData)}
                                    icon={<Copy className="w-3.5 h-3.5" />}
                                >
                                    Copy All
                                </Button>
                            </div>

                            {!selectedListingData ? (
                                <div className="p-4 rounded-xl border border-[#E5E2DA] bg-[#FAFAF8] text-sm text-[#6B6560]">
                                    Listing copy not available for this older generation.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {selectedListingData.title && (
                                        <div className="p-3 rounded-xl border border-[#E5E2DA] bg-[#FAFAF8]">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-[11px] font-semibold text-[#9E9893] uppercase tracking-wide">Title</p>
                                                <button
                                                    onClick={() => handleCopyListingField(selectedListingData.title || "", "Title")}
                                                    className="text-[#9E9893] hover:text-stone-900"
                                                >
                                                    <Copy className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <p className="text-[13px] text-stone-900 leading-relaxed">{selectedListingData.title}</p>
                                        </div>
                                    )}

                                    {selectedListingData.bullets && selectedListingData.bullets.length > 0 && (
                                        <div className="p-3 rounded-xl border border-[#E5E2DA] bg-[#FAFAF8]">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <p className="text-[11px] font-semibold text-[#9E9893] uppercase tracking-wide">Key Features</p>
                                                <button
                                                    onClick={() => handleCopyListingField(selectedListingData.bullets?.join("\n") || "", "Key features")}
                                                    className="text-[#9E9893] hover:text-stone-900"
                                                >
                                                    <Copy className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <div className="space-y-1.5">
                                                {selectedListingData.bullets.map((bullet, idx) => (
                                                    <div key={idx} className="text-[12px] text-stone-800 leading-relaxed flex gap-2">
                                                        <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                                                        <span>{bullet}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedListingData.description && (
                                        <div className="p-3 rounded-xl border border-[#E5E2DA] bg-[#FAFAF8]">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-[11px] font-semibold text-[#9E9893] uppercase tracking-wide">Description</p>
                                                <button
                                                    onClick={() => handleCopyListingField(selectedListingData.description || "", "Description")}
                                                    className="text-[#9E9893] hover:text-stone-900"
                                                >
                                                    <Copy className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <p className="text-[12px] text-stone-800 leading-relaxed whitespace-pre-wrap">{selectedListingData.description}</p>
                                        </div>
                                    )}

                                    {selectedListingSpecs.length > 0 && (
                                        <div className="p-3 rounded-xl border border-[#E5E2DA] bg-[#FAFAF8]">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <p className="text-[11px] font-semibold text-[#9E9893] uppercase tracking-wide">Specifications</p>
                                                <button
                                                    onClick={() =>
                                                        handleCopyListingField(
                                                            selectedListingSpecs.map((spec) => `${spec.key}: ${spec.val}`).join("\n"),
                                                            "Specifications"
                                                        )
                                                    }
                                                    className="text-[#9E9893] hover:text-stone-900"
                                                >
                                                    <Copy className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <div className="rounded-lg border border-[#E5E2DA] overflow-hidden">
                                                {selectedListingSpecs.map((spec, idx) => (
                                                    <div
                                                        key={`${spec.key}-${idx}`}
                                                        className={`flex text-[12px] ${idx % 2 === 0 ? "bg-white" : "bg-[#F9F8F5]"}`}
                                                    >
                                                        <span className="w-2/5 px-3 py-1.5 font-semibold text-[#6B6560] border-r border-[#E5E2DA]">
                                                            {spec.key}
                                                        </span>
                                                        <span className="flex-1 px-3 py-1.5 text-stone-800">{spec.val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedListingData.keywords && (
                                        <div className="p-3 rounded-xl border border-[#E5E2DA] bg-[#FAFAF8]">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-[11px] font-semibold text-[#9E9893] uppercase tracking-wide">Keywords</p>
                                                <button
                                                    onClick={() => handleCopyListingField(selectedListingData.keywords || "", "Keywords")}
                                                    className="text-[#9E9893] hover:text-stone-900"
                                                >
                                                    <Copy className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <p className="text-[12px] text-stone-800 leading-relaxed">{selectedListingData.keywords}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Ads Flow Details Modal */}
        {isFlowModalOpen && selectedFlow && (
          <div
            className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200'
            onClick={() => setIsFlowModalOpen(false)}>
            <div
              className='bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col'
              onClick={(e) => e.stopPropagation()}>
              
              <div className='p-5 border-b border-[#E5E2DA] flex justify-between items-center bg-gray-50/50'>
                <div>
                    <h2 className='text-xl font-bold text-stone-900'>
                    {selectedFlow?.step1_generatePrompt?.product_name || "Flow Details"}
                    </h2>
                    <p className="text-xs text-[#9E9893]">Campaign Details</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsFlowModalOpen(false)} icon={<ChevronLeft className="w-5 h-5" />} />
              </div>

              <div className='p-6 overflow-y-auto space-y-8'>
                {/* Step 1 */}
                {selectedFlow?.step1_generatePrompt && (
                  <div className="space-y-4">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
                          <h3 className="font-bold text-stone-900">Campaign Strategy</h3>
                      </div>
                      <div className="ml-11 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-[#E5E2DA]">
                          <div><span className="text-xs font-semibold text-[#9E9893] uppercase">Product</span><p className="font-medium">{selectedFlow.step1_generatePrompt.product_name}</p></div>
                          <div><span className="text-xs font-semibold text-[#9E9893] uppercase">Target Audience</span><p className="font-medium">{selectedFlow.step1_generatePrompt.model_gender} / {selectedFlow.step1_generatePrompt.model_ethnicity}</p></div>
                          <div className="md:col-span-2"><span className="text-xs font-semibold text-[#9E9893] uppercase">Description</span><p className="text-sm text-stone-600">{selectedFlow.step1_generatePrompt.description}</p></div>
                      </div>
                  </div>
                )}

                {/* Step 2 */}
                {selectedFlow?.step2_productPreprocessing && selectedFlow.step2_productPreprocessing.urls?.length > 0 && (
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">2</div>
                          <h3 className="font-bold text-stone-900">Product Assets</h3>
                      </div>
                      <div className="ml-11 grid grid-cols-2 md:grid-cols-4 gap-3">
                          {selectedFlow.step2_productPreprocessing.urls.map((url: string, idx: number) => (
                              <img key={idx} src={url} className="rounded-lg border border-[#E5E2DA] bg-white shadow-sm hover:scale-105 transition-transform" />
                          ))}
                      </div>
                   </div>
                )}
                
                {/* Step 3 */}
                {selectedFlow?.step3_createAdFromProduct && selectedFlow.step3_createAdFromProduct.urls?.length > 0 && (
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm">3</div>
                          <h3 className="font-bold text-stone-900">Generated Ads</h3>
                      </div>
                      <div className="ml-11 grid grid-cols-2 gap-4">
                          {selectedFlow.step3_createAdFromProduct.urls.map((url: string, idx: number) => (
                              <img key={idx} src={url} className="w-full rounded-xl border border-[#E5E2DA] shadow-sm" />
                          ))}
                      </div>
                   </div>
                )}

                 {/* Step 5 - Video */}
                 {selectedFlow?.step5_generateAdVideo?.video_url && (
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">V</div>
                          <h3 className="font-bold text-stone-900">Video Ad</h3>
                      </div>
                      <div className="ml-11">
                          <video src={selectedFlow.step5_generateAdVideo.video_url} controls className="w-full rounded-xl bg-black" />
                      </div>
                   </div>
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default ModelListPage;
