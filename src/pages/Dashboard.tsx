import React, { useEffect, useState } from "react";
import { TimeFilterSelect } from "../components/TimeFilterSelect";
import { RevenueChart } from "../components/charts/RevenueChart";
import { DemographicsChart } from "../components/charts/DemographicsChart";
import { PerformanceChart } from "../components/charts/PerformanceChart";
import { StatsCard } from "../components/StatsCard";
import { Users, DollarSign, ShoppingCart, TrendingUp, ArrowLeft, Shirt, Image } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setTimeFilter } from "../store/dashboardSlice";
import type { RootState } from "../store/store";
import { toast } from "sonner";
import commonService, { dashboardStats, Stats } from "../services/commonService";
import { Link } from "react-router-dom";

// Sample data - in a real app, this would come from an API
const revenueData = [
  { date: "Jan", revenue: 4000 },
  { date: "Feb", revenue: 3000 },
  { date: "Mar", revenue: 2000 },
  { date: "Apr", revenue: 2780 },
  { date: "May", revenue: 1890 },
  { date: "Jun", revenue: 2390 },
];

const demographicsData = [
  { name: "18-24", value: 400 },
  { name: "25-34", value: 300 },
  { name: "35-44", value: 300 },
  { name: "45+", value: 200 },
];

const performanceData = [
  { date: "Mon", performance: 65 },
  { date: "Tue", performance: 75 },
  { date: "Wed", performance: 70 },
  { date: "Thu", performance: 80 },
  { date: "Fri", performance: 85 },
  { date: "Sat", performance: 90 },
  { date: "Sun", performance: 95 },
];

export function Dashboard() {
  const dispatch = useDispatch();
  const timeFilter = useSelector((state: RootState) => state.dashboard.timeFilter);
  const user = useSelector((state: RootState) => state.user);
  const [stats, setStats] = useState<Stats>({ modelData: [], tryonData: [] });

  const getStats = async () => {
    try {
      const result = await commonService.getDashboardStat();
      console.log(
        result.tryonData[0].generatedImages.length,
        result.tryonData.reduce((prev, curr) => prev + curr?.generatedImages?.output_urls?.length, 0),
        "oo"
      );
      setStats({ modelData: result.modelData, tryonData: result.tryonData });
    } catch (error) {}
  };

  useEffect(() => {
    getStats();
  }, []);

  return (
    <>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-white'>Dashboard Overview</h1>
        {/* <TimeFilterSelect value={timeFilter} onChange={(value) => dispatch(setTimeFilter(value))} /> */}
        <div className='flex items-center gap-3'>
          {user?.user?.role === "admin" && (
            <Link to={"/admin"} className='flex text-gray-100 items-center gap-1'>
              Admin Dashboard
            </Link>
          )}
          <Link to={"/"} className='flex text-gray-100 items-center gap-1'>
            <ArrowLeft /> Back
          </Link>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <StatsCard
          title='Credits'
          value={user?.user?.role === "user" ? (user.user?.credits ?? 0) : "Admin"}
          icon={DollarSign}
        />
        <StatsCard
          title='No of Models'
          value={stats.modelData.reduce((prev, curr) => prev + curr.generatedImages.image_urls?.length, 0)}
          icon={Image}
        />
        <StatsCard title='No of Tryon' value={stats.tryonData.length} icon={Shirt} />
        <StatsCard
          title='Role'
          value={user?.user?.role || "user"}
          icon={DollarSign}
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className='bg-gray-800 p-6 rounded-xl shadow-lg'>
          <h2 className='text-xl font-semibold mb-4 text-white'>Revenue Overview</h2>
          <RevenueChart data={revenueData} />
        </div>

        <div className='bg-gray-800 p-6 rounded-xl shadow-lg'>
          <h2 className='text-xl font-semibold mb-4 text-white'>User Demographics</h2>
          <DemographicsChart data={demographicsData} />
        </div>

        <div className='bg-gray-800 p-6 rounded-xl shadow-lg lg:col-span-2'>
          <h2 className='text-xl font-semibold mb-4 text-white'>Performance Metrics</h2>
          <PerformanceChart data={performanceData} />
        </div>
      </div>
    </>
  );
}
