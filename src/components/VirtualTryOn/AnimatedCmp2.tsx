import React, { FC, forwardRef, useRef, useState } from "react";
import { Check, DownloadIcon, ImageIcon, Share2, Trash, Trash2, ZoomIn } from "lucide-react";
import { RefreshCw } from "lucide-react";
import { AnimatedBeam } from "./AnimatesBeam";
import { modelResult, UploadedImage } from "./VirtualTryon";
import commonService from "../../services/commonService";
import { toast } from "sonner";

const Model = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    removeImage: (id: string, type: string) => void;
    onSelectResult: (model: modelResult) => void;
    id: any;
    type: string;
    imageUrl: string;
    selectedResult: modelResult[];
    isGenerating: boolean;
  }
>(({ className, removeImage, id, type, selectedResult, onSelectResult, imageUrl, isGenerating }, ref) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [zoomedImage, setZoomedImage] = useState<string>("");

  const handleDownload = async (imageUrl: string) => {
    try {
      const result = await commonService.downloadSingleFile(imageUrl);
      const blobUrl = URL.createObjectURL(result);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `tryon-result-${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error: any) {
      toast.error("Failed to download image");
    }
  };

  return (
    <div
      ref={ref}
      onClick={() => onSelectResult({ url: imageUrl, id })}
      className={`group z-[50] flex h-64 w-48 rounded-md relative  items-center justify-center border-2 bg-gray-800 p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        ${className} 
       `}>
      {imageUrl && <img src={imageUrl} className='h-full w-full object-cover' alt={type} />}

      {type === "model" && (
        <Trash2
          className='text-red-500 absolute right-3 top-3 hidden group-hover:block cursor-pointer z-[100] '
          onClick={() => removeImage(id, type)}
        />
      )}

      {!imageUrl && !isGenerating && <ImageIcon className='w-8 h-8 text-gray-400' />}
      {!imageUrl && isGenerating && <RefreshCw className='h-5 w-5 animate-spin text-gray-400' />}

      {imageUrl && (
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            selectedResult.some((result) => result.url === imageUrl) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}>
          {type === "result" && (
            <div className='absolute top-4 right-4'>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  selectedResult.some((result) => result.url === imageUrl) ? "bg-blue-500" : "bg-white"
                }`}>
                <Check className={`w-5 h-5 ${selectedResult.some((result) => result.url === imageUrl) ? "text-white" : "text-gray-900"}`} />
              </div>
            </div>
          )}

          {imageUrl && (
            <div className='flex items-center h-full justify-center'>
              <div className='flex space-x-4'>
                {type === "result" && (
                  <DownloadIcon
                    className='h-6 w-6 cursor-pointer text-gray-100 hover:text-blue-400'
                    onClick={() => handleDownload(imageUrl)}
                  />
                )}
                {type === "result" && (
                  <Share2
                    className='h-6 w-6 cursor-pointer text-gray-100 hover:text-blue-400'
                    onClick={() =>
                      navigator
                        .share({
                          title: "Generated Image",
                          text: "Check out this image!",
                          url: imageUrl,
                        })
                        .catch((err) => console.error("Share failed:", err))
                    }
                  />
                )}

                <ZoomIn
                  className='h-6 w-6 cursor-pointer text-gray-100 hover:text-blue-400'
                  onClick={() => {
                    setZoomedImage(imageUrl);
                    setIsModalOpen(true);
                  }}
                />

                {isModalOpen && (
                  <div
                    className='fixed inset-0 bg-black bg-opacity-75  !ml-0 flex items-center justify-center z-[100]'
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
      )}
    </div>
  );
});

const Garment = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode; imageUrl: string }>(
  ({ className, children, imageUrl }, ref) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [zoomedImage, setZoomedImage] = useState<string>("");
    return (
      <div
        ref={ref}
        className={`z-10 group flex h-48 w-36 relative items-center rounded-md justify-center border-2 bg-gray-800 p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        ${className} 
       `}>
        {children}

        {imageUrl && (
          <div className={`absolute inset-0 bg-black/40 transition-opacity  ${"opacity-0 group-hover:opacity-100"}`}>
            {imageUrl && (
              <div className='flex items-center h-full justify-center'>
                <div className='flex space-x-4'>
                  <ZoomIn
                    className='h-6 w-6 cursor-pointer text-gray-100 hover:text-blue-400'
                    onClick={() => {
                      setZoomedImage(imageUrl);
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
        )}
      </div>
    );
  }
);

const AnimatedCmp2: FC<{
  garmentImage: any;
  resultImage: any[];
  isGenerating: boolean;
  removeImage: (id: string, type: string) => void;
  onSelectResult: (model: modelResult) => void;
  selectedResult: modelResult[];
  modelImages: UploadedImage[];
}> = ({ garmentImage, resultImage, isGenerating, removeImage, selectedResult, onSelectResult, modelImages }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);
  const div8Ref = useRef<HTMLDivElement>(null);
  const div9Ref = useRef<HTMLDivElement>(null);

  return (
    <div className='relative flex w-full  justify-center  py-4' ref={containerRef}>
      <div className='flex w-full flex-col max-w-[1200px]  min-h-[200px]  items-stretch justify-between gap-10'>
        {modelImages[0]?.url && (
          <div className='flex flex-row items-center justify-between'>
            <Model
              ref={modelImages.length === 1 ? div2Ref : div1Ref}
              removeImage={removeImage}
              id={modelImages[0].id}
              type={modelImages[0].type}
              selectedResult={selectedResult}
              imageUrl={modelImages[0]?.url}
              onSelectResult={onSelectResult}
              isGenerating={isGenerating}
            />

            {modelImages.length === 1 && (
              <Garment ref={div4Ref} imageUrl={garmentImage?.url}>
                {garmentImage ? (
                  <img src={garmentImage?.url} className='h-full w-full object-cover' alt={garmentImage.type} />
                ) : (
                  <ImageIcon className='w-8 h-8 text-gray-400' />
                )}
              </Garment>
            )}
            <Model
              ref={modelImages.length === 1 ? div6Ref : div5Ref}
              removeImage={removeImage}
              id={modelImages[0].id}
              type='result'
              selectedResult={selectedResult}
              imageUrl={
                resultImage && Array.isArray(resultImage) && resultImage[0] && Array.isArray(resultImage[0]) && resultImage[0][0]
                  ? resultImage[0][0]
                  : ""
              }
              onSelectResult={onSelectResult}
              isGenerating={isGenerating}
            />
          </div>
        )}

        <div className='flex flex-row items-center justify-between'>
          {modelImages[1]?.url && (
            <Model
              ref={div2Ref}
              removeImage={removeImage}
              id={modelImages[1].id}
              type={modelImages[1].type}
              selectedResult={selectedResult}
              imageUrl={modelImages[1]?.url}
              onSelectResult={onSelectResult}
              isGenerating={isGenerating}
            />
          )}

          {modelImages.length > 1 && (
            <Garment ref={div4Ref} imageUrl={garmentImage?.url}>
              {garmentImage ? (
                <img src={garmentImage?.url} className='h-full w-full object-cover' alt={garmentImage.type} />
              ) : (
                <ImageIcon className='w-8 h-8 text-gray-400' />
              )}
            </Garment>
          )}

          {modelImages[1]?.url && (
            <Model
              ref={div6Ref}
              removeImage={removeImage}
              id={modelImages[1].id}
              type='result'
              selectedResult={selectedResult}
              isGenerating={isGenerating}
              imageUrl={
                resultImage && Array.isArray(resultImage) && resultImage[1] && Array.isArray(resultImage[1]) && resultImage[1][0]
                  ? resultImage[1][0]
                  : ""
              }
              onSelectResult={onSelectResult}
            />
          )}
        </div>

        {modelImages[2]?.url && (
          <div className='flex flex-row items-center justify-between'>
            <Model
              ref={div3Ref}
              removeImage={removeImage}
              id={modelImages[2].id}
              type={modelImages[2].type}
              selectedResult={selectedResult}
              imageUrl={modelImages[2]?.url}
              onSelectResult={onSelectResult}
              isGenerating={isGenerating}
            />
            <Model
              ref={div7Ref}
              removeImage={removeImage}
              id={modelImages[2].id}
              type='result'
              selectedResult={selectedResult}
              imageUrl={
                resultImage && Array.isArray(resultImage) && resultImage[2] && Array.isArray(resultImage[2]) && resultImage[2][0]
                  ? resultImage[2][0]
                  : ""
              }
              onSelectResult={onSelectResult}
              isGenerating={isGenerating}
            />
          </div>
        )}
        {modelImages[3]?.url && (
          <div className='flex flex-row items-center justify-between'>
            <Model
              ref={div8Ref}
              removeImage={removeImage}
              id={modelImages[3].id}
              type={modelImages[3].type}
              selectedResult={selectedResult}
              imageUrl={modelImages[3]?.url}
              onSelectResult={onSelectResult}
              isGenerating={isGenerating}
            />
            <Model
              ref={div9Ref}
              removeImage={removeImage}
              id={modelImages[3].id}
              type='result'
              selectedResult={selectedResult}
              imageUrl={
                resultImage && Array.isArray(resultImage) && resultImage[3] && Array.isArray(resultImage[3]) && resultImage[3][0]
                  ? resultImage[3][0]
                  : ""
              }
              onSelectResult={onSelectResult}
              isGenerating={isGenerating}
            />
          </div>
        )}
      </div>
      {modelImages[0]?.url && (
        <>
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={modelImages.length === 1 ? div2Ref : div1Ref}
            toRef={div4Ref}
            curvature={modelImages.length === 1 ? 0 : -75}
            endYOffset={modelImages.length === 1 ? 0 : -10}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={modelImages.length === 1 ? div6Ref : div5Ref}
            toRef={div4Ref}
            curvature={modelImages.length === 1 ? 0 : -75}
            endYOffset={modelImages.length === 1 ? 0 : -10}
          />
        </>
      )}
      {modelImages[1]?.url && (
        <>
          <AnimatedBeam containerRef={containerRef} fromRef={div2Ref} toRef={div4Ref} />
          <AnimatedBeam containerRef={containerRef} fromRef={div6Ref} toRef={div4Ref} />
        </>
      )}
      {modelImages[2]?.url && (
        <>
          <AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={div4Ref} curvature={75} endYOffset={10} />
          <AnimatedBeam containerRef={containerRef} fromRef={div7Ref} toRef={div4Ref} curvature={75} endYOffset={10} />
        </>
      )}
      {modelImages[3]?.url && (
        <>
          <AnimatedBeam containerRef={containerRef} fromRef={div8Ref} toRef={div4Ref} curvature={75} endYOffset={10} />
          <AnimatedBeam containerRef={containerRef} fromRef={div9Ref} toRef={div4Ref} curvature={75} endYOffset={10} />
        </>
      )}
    </div>
  );
};

export default AnimatedCmp2;
