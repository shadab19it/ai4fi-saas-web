import { Outlet } from "react-router-dom";
import Navbar from "../pages/HomePage/layout/Navbar";
import Footer from "../pages/HomePage/layout/Footer";

export default function HomeLayout() {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
