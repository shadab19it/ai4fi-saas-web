import { useCallback, useEffect, useState } from "react";
import modelService from "../services/modelService";
import modelGalleryList from "../services/ModelGallery";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { ArrowRight, Check, ZoomIn } from "lucide-react";
import { setSelectedModel } from "../store/modelSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import authService from "../services/authService";

interface Image {
  src: string;
  alt: string;
}

interface Categories {
  [key: string]: Image[];
}

interface ListImages {
  category: string;
  female: string[];
  male: string[];
}

function mergeAndShuffle(arr1: string[], arr2: string[], gender: string) {
  let merged = []; // Combine arrays

  if (gender === "male") {
    merged.push(...arr2);
  } else if (gender === "female") {
    merged.push(...arr1);
  } else {
    merged.push(...[...arr2, ...arr1]);
  }

  // for (let i = merged.length - 1; i > 0; i--) {
  //   let j = Math.floor(Math.random() * (i + 1));
  //   [merged[i], merged[j]] = [merged[j], merged[i]];
  // }
  return merged;
}

const HomePageGallery: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [zoomedImage, setZoomedImage] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>("formal");
  const [gender, setGender] = useState<string>("all");
  const [images, setImages] = useState<ListImages>({ category: "", female: [], male: [] });
  const [renderImages, setRenderImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { selectedModel } = useSelector((state: RootState) => state.modelList);
  const categories: Categories = {
    formal: [],
    casual: [],
    lingerie: [],
    PlusSize:[]
  };

  useEffect(() => {
    setIsLoading(true);
    // Small delay to ensure smooth transition
    setTimeout(() => {
      const imageDataList: ListImages = modelGalleryList.find((c) => c.category === activeCategory) as ListImages;
      const data = mergeAndShuffle(imageDataList?.female, imageDataList.male, gender);
      setRenderImages(data);
      setImages(() => imageDataList as ListImages);
      setIsLoading(false);
    }, 300);
  }, [modelGalleryList, activeCategory, gender]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='min-h-screen px-10 py-32 bg-background dark:bg-transparent dark:bg-gradient-to-br from-sky-950 to-gray-950'>
      {/* Fixed Buttons */}
      <div className='flex justify-center md:justify-between gap-3 flex-wrap'>
        <div className=' flex space-x-4'>
          {Object.keys(categories).map((category) => (
            <button
              key={category}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform shadow-md ${
                activeCategory === category
                  ? "bg-brand-color text-white scale-105 shadow-lg"

                  : "text-foreground bg-card hover:bg-brand-color dark:border-0 border-border border hover:text-white"

              }`}
              onClick={() => setActiveCategory(category)}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
          {authService.isAuthenticated() && selectedModel.length > 0 && (
            <button
              onClick={() => navigate("/virtualtryon", { state: "gallery" })}
              className='flex text-sm justify-center gap-2 items-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:bg-gradient-to-r hover:from-purple-800 hover:to-indigo-800 text-white font-bold px-8 py-2 rounded-lg shadow-lg transition-transform'>
              <span>Use try on</span> <ArrowRight size={20} />
            </button>
          )}
        </div>
        <div className='flex items-center gap-2 text-white'>
          <span>Filter : </span>
          <button
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform shadow-md ${
              gender === "male"
                ? "bg-brand-color text-white scale-105 shadow-lg"
                : "text-foreground  bg-card hover:bg-brand-color dark:border-0 border-border border hover:text-white"
            }`}
            onClick={() => (gender === "male" ? setGender("") : setGender("male"))}>
            Male
          </button>
          <button
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform shadow-md ${
              gender === "female"
                ? "bg-brand-color text-white scale-105 shadow-lg"
                : "text-foreground  bg-card hover:bg-brand-color dark:border-0 border-border border hover:text-white"
            }`}
            onClick={() => (gender === "female" ? setGender("") : setGender("female"))}>
            Female
          </button>
        </div>
      </div>

      {/* Loader Overlay */}
      {isLoading && (
        <div className='fixed inset-0 bg-background bg-opacity-75 flex items-center justify-center z-50 !ml-0'>
          <div className='flex flex-col items-center gap-4'>
            <div className='w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
            <p className='text-foreground text-lg font-semibold'>Loading category...</p>
          </div>
        </div>
      )}

      {/* Image Grid */}
      <div className='pt-5'>
        <section className={`transition-all duration-300 block min-h-screen ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
          {/* Image Grid */}
          <div className='flex gap-3 flex-wrap items-start justify-around'>
            {renderImages.map((image, index) => (
              <div
                key={index}
                onClick={() => {
                  if (authService.isAuthenticated()) {
                    if (selectedModel.length < 4 || selectedModel.includes(`${image}`)) {
                      dispatch(setSelectedModel(`${image}`));
                    } else {
                      return toast.info("You can select only 4 images at a time ");
                    }
                  }
                }}
                className='relative bg-gray-800 w-[275px] h-[413px] rounded-xl overflow-hidden group shadow-lg hover:shadow-2xl transition duration-300'>
                <img
                  src={image}
                  alt={`model_${index}`}
                  className='w-full h-full object-cover transform transition duration-300 group-hover:scale-105'
                />

                {authService.isAuthenticated() && (
                  <div
                    className={`absolute inset-0 bg-black/40 transition-opacity ${
                      selectedModel.includes(`${image}`) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}>
                    <div className='absolute top-4 right-4'>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          selectedModel.includes(`${image}`) ? "bg-blue-500" : "bg-white"
                        }`}>
                        <Check className={`w-5 h-5 ${selectedModel.includes(`${image}`) ? "text-white" : "text-gray-900"}`} />
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className={`absolute inset-0 bg-black/40 transition-opacity ${
                    zoomedImage.includes(`${image}`) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}>
                  <div className='flex items-center h-full justify-center'>
                    <div className='flex space-x-4'>
                      <ZoomIn
                        className='h-6 w-6 cursor-pointer text-gray-100 hover:text-blue-400'
                        onClick={() => {
                          setZoomedImage(image);
                          setIsModalOpen(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
        </section>
      </div>
    </div>
  );
};

export default HomePageGallery;
