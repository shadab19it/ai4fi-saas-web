import { createBrowserRouter } from "react-router-dom";
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
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminRoute from "./ProtectedRoute/AdminRoute";
import CreditsPage from "./pages/Credits";
import InviteAcceptPage from "./pages/InviteAccept";
import TeamSettings from "./pages/TeamSettings";
import SeedPage from "./pages/Seed/SeedPage";
import ProductListingStudioPage from "./pages/ProductListingStudio/ProductListingStudioPage";
import UnstitchedStudioPage from "./pages/UnstitchedStudio/UnstitchedStudioPage";
import PricingPage from "./pages/Pricing/PricingPage";
import BillingPage from "./pages/Billing/BillingPage";
import ClientShowcase from "./pages/client-showcase";

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
        path: "seed",
        element: <SeedPage />,
      },
      {
        path: "pricing",
        element: <PricingPage />,
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
      {
        path: "invite/:token",
        element: <InviteAcceptPage />,
      },
    ],
  },
  {
		path: "/client-showcase",
		element: <HomeLayout />,
		children: [
			{
				index: true,
				element: <ClientShowcase />,
			},
		],
	},
	{
		path: "/model-gallery",
		element: <HomeLayout />,
		children: [
			{
				index: true,
				element: <HomePageGallery />,
			},
		],
	},
  {
    path: "/login",
    element: <LoginPage />,
  
  },
  {
    path: "/signup",
    element: <SignUpForm />,
  
  },
  {
    path: "/admin",
    element: <AdminRoute component={AdminDashboard} />,
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
    path: "trial-room",
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
  },
  {
    path: "/credits",
    element: <ProtectedRoute component={CreditsPage} />,
  },
  {
    path: "/team-settings",
    element: <ProtectedRoute component={TeamSettings} />,
  },
  {
    path: "/product-listing-studio",
    element: <ProtectedRoute component={ProductListingStudioPage} />,
  },
  {
    path: "/unstitched-studio",
    element: <ProtectedRoute component={UnstitchedStudioPage} />,
  },
  {
    path: "/billing",
    element: <ProtectedRoute component={BillingPage} />,
  },
]);
