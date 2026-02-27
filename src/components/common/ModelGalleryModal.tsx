import { useState, useEffect, useCallback } from "react";
import { X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../ui/Button";
import galleryService, { GallerySource, GalleryGender } from "../../services/galleryService";

interface ModelGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  source?: GallerySource;
  initialCategory?: string;
  gender?: GalleryGender;
  showGenderFilter?: boolean;
  title?: string;
  subtitle?: string;
}

export default function ModelGalleryModal({
  isOpen,
  onClose,
  onSelect,
  source = "model_faces",
  initialCategory,
  gender: initialGender,
  showGenderFilter = false,
  title = "Select Model",
  subtitle,
}: ModelGalleryModalProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || "");
  const [activeGender, setActiveGender] = useState<GalleryGender | undefined>(initialGender);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const response = await galleryService.getCategories(source);
      if (response.success && response.categories.length > 0) {
        setCategories(response.categories);
        if (!activeCategory) {
          setActiveCategory(response.categories[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  }, [source, activeCategory]);

  const fetchImages = useCallback(async (categoryToFetch: string, pageNum: number, genderFilter?: GalleryGender) => {
    if (!categoryToFetch) return;
    setLoading(true);
    try {
      const response = await galleryService.getImages({
        source,
        category: categoryToFetch,
        gender: genderFilter,
        page: pageNum,
        limit: 20,
      });
      if (response.success) {
        setImages(response.images);
        setTotalPages(response.pagination.totalPages);
        setHasMore(response.pagination.hasMore);
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [source]);

  useEffect(() => {
    if (isOpen) {
      setActiveGender(initialGender);
      fetchCategories();
    }
  }, [isOpen, initialGender, fetchCategories]);

  useEffect(() => {
    if (isOpen && activeCategory) {
      setPage(1);
      fetchImages(activeCategory, 1, activeGender);
    }
  }, [isOpen, activeCategory, activeGender, fetchImages]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setPage(1);
  };

  const handleGenderChange = (gender: GalleryGender) => {
    setActiveGender(gender);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      fetchImages(activeCategory, newPage, activeGender);
    }
  };

  const handleSelect = (imageUrl: string) => {
    onSelect(imageUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="rounded-2xl border border-[#E5E2DA] bg-white shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-5 pb-4 border-b border-[#E5E2DA] flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-bold text-stone-900 mb-1">{title}</h2>
            <p className="text-[13px] text-[#9E9893]">
              {subtitle || `Select a model image${activeGender ? ` based on ${activeGender} gender` : ""}`}
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={onClose} aria-label="Close" icon={<X className="w-4 h-4" />} />
        </div>

        {showGenderFilter && (
          <div className="px-6 pt-3 pb-3 border-b border-[#E5E2DA] flex gap-2">
            {(["female", "male"] as const).map((g) => (
              <button
                key={g}
                onClick={() => handleGenderChange(g)}
                className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold capitalize transition-all ${
                  activeGender === g
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_2px_8px_rgba(99,102,241,0.25)]"
                    : "bg-[#F9F8F5] text-[#6B6560] hover:bg-[#E5E2DA]"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        )}

        <div className="px-6 pt-3 pb-3 border-b border-[#E5E2DA] flex gap-2 flex-wrap">
          {loadingCategories ? (
            <div className="flex items-center gap-2 text-[#9E9893] text-[12px]">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading categories...
            </div>
          ) : (
            categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold capitalize transition-all ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_2px_8px_rgba(99,102,241,0.25)]"
                    : "bg-[#F9F8F5] text-[#6B6560] hover:bg-[#E5E2DA]"
                }`}
              >
                {category.replace(/_/g, " ")}
              </button>
            ))
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
            </div>
          ) : images.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-[#9E9893] text-[13px]">
              No images found in this category
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((imageUrl, index) => (
                <div
                  key={`${imageUrl}-${index}`}
                  onClick={() => handleSelect(imageUrl)}
                  className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#E5E2DA] hover:border-violet-400 cursor-pointer transition-all group shadow-[0_1px_3px_rgba(28,25,23,0.06)]"
                >
                  <img
                    src={imageUrl}
                    alt={`Model ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-[13px] shadow-lg">
                      Select
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-[#E5E2DA] flex items-center justify-between">
            <span className="text-[12px] text-[#9E9893]">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                icon={<ChevronLeft className="w-4 h-4 mr-1" />}
                disabled={page === 1 || loading}
                className="h-8 w-20 flex items-center justify-center"
              >
              
                <span className="text-[12px]">Prev</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<ChevronRight className="w-4 h-4 ml-1" />}
                onClick={() => handlePageChange(page + 1)}
                disabled={!hasMore || loading}
                className="h-8 w-20 flex items-center justify-center"
              >
                <span className="text-[12px]">Next</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
