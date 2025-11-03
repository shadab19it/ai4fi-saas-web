import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TimeFilterSelect } from "./components/TimeFilterSelect";
import { RevenueChart } from "./components/charts/RevenueChart";
import { DemographicsChart } from "./components/charts/DemographicsChart";
import { PerformanceChart } from "./components/charts/PerformanceChart";
import { StatsCard } from "./components/StatsCard";
import { Users, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import type { TimeFilter } from "./types/dashboard";
import clsx from "clsx";

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

const statsCards = [
  {
    title: "Total Revenue",
    value: "$54,234",
    change: "12%",
    isPositive: true,
    icon: DollarSign,
  },
  {
    title: "Active Users",
    value: "2,345",
    change: "8.5%",
    isPositive: true,
    icon: Users,
  },
  {
    title: "Sales",
    value: "1,234",
    change: "5.6%",
    isPositive: false,
    icon: ShoppingCart,
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "2.1%",
    isPositive: true,
    icon: TrendingUp,
  },
];

function App() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("30d");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  return (
    <div className='min-h-screen bg-gray-900'>
      <Sidebar />
      <main className={clsx("transition-all duration-300 p-8", isSidebarCollapsed ? "ml-20" : "ml-64")}>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold text-white'>Dashboard Overview</h1>
          <TimeFilterSelect value={timeFilter} onChange={setTimeFilter} />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          {statsCards.map((card) => (
            <StatsCard key={card.title} {...card} />
          ))}
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
      </main>
    </div>
  );
}

export default App;
