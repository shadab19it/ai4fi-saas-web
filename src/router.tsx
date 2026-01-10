import { createBrowserRouter } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Analytics } from "./pages/Analytics";
import RootLayout from "./layouts/RootLayout";
import LoginPage from "./pages/Login/Login";
import SignUpForm from "./pages/Login/SignUp";
import AboutUs from "./pages/About";
import ContactForm from "./pages/ContactUs";
import HomePageGallery from "./pages/HomePageGallery";
import ChooseModelOption from "./pages/ChooseModelOpt/ChooseModelOpt";
import ModelListPage from "./pages/ModelListPage/ModelListPage";
import GenerateModel from "./pages/GenerateModel";
import VirtualTryon from "./components/VirtualTryOn/VirtualTryon";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import HomeLayout from "./layouts/HomeLayout";
import HomePage from "./pages/HomePage";
import TryOnV2BetaPage from "./pages/TryOnV2Beta";
import ProductGeneratorPage from "./pages/ProductModelGenerator";
import AdsGenerator from "./pages/AdsGenerator";
import CreateAds from "./components/CreateAds";
import FeaturesPage from "./pages/FeaturesCardPage/FeaturesCardPage";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignUpForm />,
      },
      {
        path: "about",
        element: <AboutUs />,
      },
      {
        path: "contact",
        element: <ContactForm />,
      },
      {
        path: "model-gallery",
        element: <HomePageGallery />,
      },
      {
        path: "terms-of-service",
        element: <TermsOfService />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <ProtectedRoute component={Dashboard} />,
      },
      {
        path: "analytics",
        element: <ProtectedRoute component={Analytics} />,
      },
      {
        path: "*",
        element: <div className='text-white text-center mt-20'>Page not found</div>,
      },
    ],
  },
  {
    path: "/model",
    element: <ProtectedRoute component={GenerateModel} />,
  },
  {
    path: "/choose-option",
    element: <ProtectedRoute component={ChooseModelOption} />,
  },
  {
    path: "/generated-model",
    element: <ProtectedRoute component={ModelListPage} />,
  },
  {
    path: "/virtualtryon",
    element: <ProtectedRoute component={VirtualTryon} />,
  },
  {
    path: "*",
    element: <div className='text-white text-center mt-20'>Page not found</div>,
  },

  {
    path: "try-on-v2-beta",
    element: <ProtectedRoute component={TryOnV2BetaPage} />,
  },
  {
    path: "/product-model-generator",
    element: <ProtectedRoute component={ProductGeneratorPage} />,
  },
  {
    path: "/ads-generator",
    element: <ProtectedRoute component={AdsGenerator} />,
  },
  {
    path: "/create-ads",
    element: <ProtectedRoute component={CreateAds} />,
  },
  {
    path: "/features",
    element: <ProtectedRoute component={FeaturesPage} />,
  }
]);
