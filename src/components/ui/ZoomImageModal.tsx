import { FC, useState, useRef, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from "lucide-react";
import clsx from "clsx";
import Button from "./Button";

interface ZoomImageModalProps {
  open: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  onDownload?: (url: string) => void;
  alt?: string;
}

const ZOOM_LEVELS = [1, 1.5, 2, 3] as const;

const ZoomImageModal: FC<ZoomImageModalProps> = ({
  open,
  onClose,
  images,
  initialIndex = 0,
  onDownload,
  alt = "Preview",
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(0); // index into ZOOM_LEVELS
  const [isHovering, setIsHovering] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Reset when modal opens / images change
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
      setZoomLevel(0);
      setIsHovering(false);
    }
  }, [open, initialIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "+" || e.key === "=") handleZoomIn();
      if (e.key === "-") handleZoomOut();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentIndex, zoomLevel]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setZoomLevel(0);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setZoomLevel(0);
  }, [images.length]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 1, ZOOM_LEVELS.length - 1));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 1, 0));
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!imageContainerRef.current) return;
      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setLensPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    },
    []
  );

  const handleMouseEnter = () => {
    setIsHovering(true);
    // Auto-zoom to level 1 (1.5x) when hovering if not already zoomed
    if (zoomLevel === 0) setZoomLevel(1);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setZoomLevel(0);
  };

  if (!open || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const scale = ZOOM_LEVELS[zoomLevel];
  const isZoomed = zoomLevel > 0 && isHovering;

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-md flex flex-col"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Image zoom viewer"
    >
      {/* Top Bar */}
      <div className="shrink-0 flex items-center justify-between px-5 py-3 bg-white/95 backdrop-blur-sm border-b border-[#E5E2DA]">
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-bold text-stone-900">
            {images.length > 1 ? `${currentIndex + 1} / ${images.length}` : "Image Preview"}
          </span>
          {isZoomed && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-violet-600 border border-violet-200">
              {scale}x Zoom
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {/* Zoom Controls */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoomLevel === 0}
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-0.5 px-2">
            {ZOOM_LEVELS.map((level, idx) => (
              <button
                key={level}
                onClick={() => setZoomLevel(idx)}
                className={clsx(
                  "w-2 h-2 rounded-full transition-all",
                  idx === zoomLevel
                    ? "bg-violet-600 scale-125"
                    : "bg-[#E5E2DA] hover:bg-[#9E9893]"
                )}
                aria-label={`Zoom ${level}x`}
              />
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoomLevel === ZOOM_LEVELS.length - 1}
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>

          {onDownload && (
            <>
              <div className="w-px h-5 bg-[#E5E2DA] mx-1" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDownload(currentImage)}
                aria-label="Download image"
              >
                <Download className="w-4 h-4" />
              </Button>
            </>
          )}

          <div className="w-px h-5 bg-[#E5E2DA] mx-1" />
          <Button variant="outline" size="icon" onClick={onClose} aria-label="Close">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Image Area */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden px-4 py-4">
        {/* Prev Button */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-[#E5E2DA] shadow-lg flex items-center justify-center text-stone-900 hover:bg-white hover:scale-105 transition-all"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Image Container with Zoom */}
        <div
          ref={imageContainerRef}
          className={clsx(
            "relative max-w-[85vw] max-h-[calc(100vh-180px)] rounded-2xl overflow-hidden bg-white border border-[#E5E2DA] shadow-2xl",
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          )}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            if (isZoomed) {
              setZoomLevel(0);
            } else {
              setZoomLevel(1);
            }
          }}
        >
          <img
            src={currentImage}
            alt={`${alt} ${currentIndex + 1}`}
            className="block max-w-[85vw] max-h-[calc(100vh-180px)] object-contain transition-transform duration-100 ease-out select-none"
            style={
              isZoomed
                ? {
                    transform: `scale(${scale})`,
                    transformOrigin: `${lensPosition.x}% ${lensPosition.y}%`,
                  }
                : { transform: "scale(1)", transformOrigin: "center center" }
            }
            draggable={false}
          />

          {/* Hover hint overlay (only when not zoomed) */}
          {!isHovering && zoomLevel === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/5 transition-colors pointer-events-none">
              <div className="bg-white/90 backdrop-blur-sm border border-[#E5E2DA] rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4 text-violet-600" />
                <span className="text-[12px] font-semibold text-stone-900">Hover to zoom</span>
              </div>
            </div>
          )}

          {/* Crosshair indicator when zoomed */}
          {isZoomed && (
            <div
              className="absolute w-4 h-4 border-2 border-white/80 rounded-full shadow-lg pointer-events-none mix-blend-difference"
              style={{
                left: `${lensPosition.x}%`,
                top: `${lensPosition.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-[#E5E2DA] shadow-lg flex items-center justify-center text-stone-900 hover:bg-white hover:scale-105 transition-all"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Thumbnail Strip (for multiple images) */}
      {images.length > 1 && (
        <div className="shrink-0 bg-white/95 backdrop-blur-sm border-t border-[#E5E2DA] px-6 py-3">
          <div className="flex items-center justify-center gap-2 overflow-x-auto max-w-full">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setZoomLevel(0);
                }}
                className={clsx(
                  "w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0",
                  idx === currentIndex
                    ? "border-violet-500 ring-2 ring-violet-500/20 scale-105"
                    : "border-[#E5E2DA] hover:border-[#9E9893] opacity-70 hover:opacity-100"
                )}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom hint */}
      <div className="shrink-0 text-center py-2 bg-white/95 backdrop-blur-sm border-t border-[#E5E2DA]">
        <p className="text-[11px] text-[#9E9893] font-medium">
          Hover to zoom • Click to toggle zoom • {images.length > 1 ? "← → to navigate • " : ""}Esc to close
        </p>
      </div>
    </div>
  );
};

export default ZoomImageModal;
