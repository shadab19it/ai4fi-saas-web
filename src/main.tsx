import { FC, StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider, useDispatch, useSelector } from "react-redux";
import { RootState, store } from "./store/store";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Toaster } from "sonner";
import "./index.css";
import authService from "./services/authService";
import teamService from "./services/teamService";
import { setUser } from "./store/userReducer";
import { setTeam } from "./store/teamSlice";
import { ThemeProvider } from "./context/ThemeContext";

const MainRoute: FC = () => {
  const dispatch = useDispatch();
  const { userRefresh } = useSelector((state: RootState) => state.user);

  const getUser = async () => {
    if (authService.isAuthenticated()) {
      const res = await authService.getUserInfo();
      dispatch(setUser(res.user));
      if (res.user?.teamId) {
        try {
          const teamData = await teamService.getTeam();
          dispatch(setTeam(teamData.team));
        } catch {
          dispatch(setTeam(null));
        }
      } else {
        dispatch(setTeam(null));
      }
    } else {
      dispatch(setUser(null));
      dispatch(setTeam(null));
    }
  };

  useEffect(() => {
    getUser();
  }, [userRefresh]);
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position='top-right' richColors />
    </>
  );
};

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <Provider store={store}>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <MainRoute />
    </ThemeProvider>
  </Provider>
  // </StrictMode>
);
