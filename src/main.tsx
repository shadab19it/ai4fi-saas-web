import { FC, StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider, useDispatch, useSelector } from "react-redux";
import { RootState, store } from "./store/store";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Toaster } from "sonner";
import "./index.css";
import authService from "./services/authService";
import { setUser } from "./store/userReducer";
import { ThemeProvider } from "./context/ThemeContext";

const MainRoute: FC = () => {
  const dispatch = useDispatch();
  const { userRefresh } = useSelector((state: RootState) => state.user);

  const getUser = async () => {
    if (authService.isAuthenticated()) {
      const res = await authService.getUserInfo();
      dispatch(setUser(res.user));
    } else {
      dispatch(setUser(null));
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
