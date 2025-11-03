import React, { FC } from "react";
import { LayoutDashboard, BarChart3, PieChart, LineChart, Settings, Menu, X, Upload, ImageIcon, RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import appConstant from "../../../services/appConstant";
import { RootState } from "../../../store/store";
import { toggleSidebar } from "../../../store/dashboardSlice";
import { UploadedImage } from "../VirtualTryon";

const TryonSider: FC<{
  onChangeCategory: (v: string) => void;
  removeImage: (id: string, type: string) => void;
  category: string;
  modelImages: UploadedImage[];
  garmentImage: UploadedImage | null;
  isGenerating: boolean;
  handleImageUpload: (e: any, type: string) => void;
  tryOn: () => void;
}> = ({ modelImages, isGenerating, handleImageUpload, garmentImage, category, onChangeCategory, tryOn, removeImage }) => {
  const dispatch = useDispatch();
  const isCollapsed = useSelector((state: RootState) => state.dashboard.isSidebarCollapsed);

  return (
    <div
      className={clsx(
        "bg-gray-900 h-screen  shadow-lg fixed left-0 top-0 transition-all duration-300 z-50",
        isCollapsed ? "w-20" : "w-[420px]"
      )}>
      <div className={clsx("p-4 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
        {!isCollapsed && <h1 className='text-2xl font-bold text-white'>Analytics</h1>}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className='p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors'>
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>
      <nav className='mt-8'>
        <div className='basis-4/12 p-4  h-[calc(100vh_-_72px)] overflow-x-auto'>
          <div>
            <div className='bg-gray-900 p-4 rounded-lg shadow-sm'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-md font-semibold text-gray-100'>Upload Model Photos</h2>
                <span className='text-white'>{modelImages.length > 0 && modelImages.length}</span>
              </div>
              <div className='border-2 border-dashed border-gray-500 rounded-lg p-4'>
                <label className='flex gap-2 items-center justify-center cursor-pointer'>
                  <Upload className='w-6 h-6 text-gray-400' />
                  <span className='mt-2 text-sm text-gray-500 text-center'>
                    Upload multiple model photos. Supported image .jpg and jpeg
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
              </div>
              <p className='text-gray-400 italic text-[12px] mt-1'>You can upload only {appConstant.NO_OF_TRYON_MODEL} model images</p>
            </div>
          </div>
          <div>
            {/* Garment Upload */}
            <div className='bg-gray-900 p-6 rounded-lg shadow-sm pb-10 mt-6'>
              <h2 className='text-lg font-semibold mb-4 text-gray-100'>Upload Garment</h2>
              <div className='border-2 border-dashed border-gray-500 rounded-lg p-4'>
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

            <div className='py-3 mb-3'>
              <label className='block text-sm font-medium mb-2 text-gray-100'>Category</label>
              <select
                value={category}
                onChange={(e) => onChangeCategory(e.target.value)}
                className='w-full border border-gray-700 text-gray-100 focus:border-gray-700 active:border-gray-700  bg-gray-900 rounded-lg px-4 py-2'>
                <option value='tops'>Tops</option>
                <option value='bottoms'>Bottoms</option>
                <option value='one-pieces'>One-Pieces</option>
              </select>
            </div>

            <button
              onClick={tryOn}
              className=' mt-6 w-full cursor-pointer justify-center gap-2 items-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:bg-gradient-to-r hover:from-purple-800 hover:to-indigo-800 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-transform'>
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
      </nav>
    </div>
  );
};

export default TryonSider;
