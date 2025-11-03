import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import clsx from "clsx";

export default function RootLayout() {
  const isSidebarCollapsed = useSelector((state: RootState) => state.dashboard.isSidebarCollapsed);

  return (
    <div className='min-h-screen bg-gray-900'>
      {/* <Sidebar /> */}
      {/* <main className={clsx("transition-all duration-300 p-8", isSidebarCollapsed ? "ml-20" : "ml-64")}>
        <Outlet />
      </main> */}
      <main className={clsx("transition-all duration-300 p-8")}>
        <Outlet />
      </main>
    </div>
  );
}
