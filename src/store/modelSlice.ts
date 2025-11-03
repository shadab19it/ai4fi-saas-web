// Please note that this gist follows the repo available at: https://github.com/delasign/react-redux-tutorial
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModifiedModelData } from "../components/ModelGenerator/ModelGenerateUI";

export interface IModelImage {
  image_urls: string[];
  seed: number;
  message: string;
}

export interface GeneratedModel {
  userId: string;
  generatedImages: any;
  _id: string;
}

interface InitialState {
  modelList: GeneratedModel[];
  selectedModel: string[];
  generatedModelList: ModifiedModelData[];
}

const initialState: InitialState = {
  modelList: [],
  selectedModel: [],
  generatedModelList: [],
};

export const modelSlice = createSlice({
  name: "modelList",
  initialState: initialState,
  reducers: {
    setModelList: (state, action) => {
      state.modelList = action.payload;
    },
    setSelectedModel: (state, action) => {
      if (state.selectedModel.includes(action.payload)) {
        state.selectedModel = state.selectedModel.filter((id: string) => id !== action.payload);
      } else {
        if (state.selectedModel.length === 4) {
          state.selectedModel = state.selectedModel;
        } else {
          state.selectedModel = [...state.selectedModel, action.payload];
        }
      }
    },

    setGeneratedModelList: (state, action: PayloadAction<ModifiedModelData[]>) => {
      state.generatedModelList = action.payload;
    },

    clearSelectedModel: (state) => {
      state.selectedModel = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { setModelList, setSelectedModel, setGeneratedModelList, clearSelectedModel } = modelSlice.actions;
// You must export the reducer as follows for it to be able to be read by the store.
export default modelSlice.reducer;
