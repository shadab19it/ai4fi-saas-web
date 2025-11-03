// import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ImagePlus, Images, PersonStanding } from "lucide-react";
import DarkLogo from "../../../public/dark-logo.png";
import { FC } from "react";

const ChooseModelOption: FC = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-gray-900 relative flex items-center  justify-center p-4'>
      <Link to={"/"}>
        <img src={DarkLogo} className='w-20 h-8 absolute top-3 left-3' alt='AI4FI' />
      </Link>
      <div className='max-w-7xl w-full space-y-8'>
        <h1 className='text-4xl font-bold text-center text-white mb-12'>Choose Your Option</h1>
        <div className='grid md:grid-cols-3 gap-8'>
          <div
            onClick={() => navigate("/model")}
            className='bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors cursor-pointer group'>
            <div className='flex flex-col items-center space-y-4'>
              <div className='p-4 bg-blue-600 rounded-full group-hover:bg-blue-500 transition-colors'>
                <ImagePlus className='w-8 h-8 text-white' />
              </div>
              <h2 className='text-xl font-semibold text-white'>Generate Model Image</h2>
              <p className='text-gray-400 text-center'>Create new AI-generated model images based on your specifications</p>
            </div>
          </div>

          <div
            onClick={() => navigate("/generated-model")}
            className='bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors cursor-pointer group'>
            <div className='flex flex-col items-center space-y-4'>
              <div className='p-4 bg-purple-600 rounded-full group-hover:bg-purple-500 transition-colors'>
                <Images className='w-8 h-8 text-white' />
              </div>
              <h2 className='text-xl font-semibold text-white'>Use Existing Models</h2>
              <p className='text-gray-400 text-center'>Select from our collection of pre-existing model images</p>
            </div>
          </div>
          <div
            onClick={() => navigate("/virtualtryon")}
            className='bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors cursor-pointer group'>
            <div className='flex flex-col items-center space-y-4'>
              <div className='p-4 bg-green-600 rounded-full group-hover:bg-green-500 transition-colors'>
                <PersonStanding className='w-8 h-8 text-white' />
              </div>
              <h2 className='text-xl font-semibold text-white'>Direct Use Virtual-Try-On</h2>
              <p className='text-gray-400 text-center'>
                Try garments directly on pre-existing model images with our virtual try-on feature.
              </p>
            </div>
          </div>
        </div>
        <div className='flex items-center justify-center'>
          <button onClick={() => navigate("/")} className='flex items-center text-white hover:text-blue-300 transition-colors'>
            <ArrowLeft className='w-5 h-5 mr-2' />
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChooseModelOption;
