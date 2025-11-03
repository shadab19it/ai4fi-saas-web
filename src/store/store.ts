import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./dashboardSlice";
import userReducer from "./userReducer";
import modelSlice from "./modelSlice";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    user: userReducer,
    modelList: modelSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
