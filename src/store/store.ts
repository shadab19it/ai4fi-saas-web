import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./dashboardSlice";
import userReducer from "./userReducer";
import modelSlice from "./modelSlice";
import teamReducer from "./teamSlice";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    user: userReducer,
    modelList: modelSlice,
    team: teamReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
