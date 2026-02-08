import { FC, useEffect, useState } from 'react';
import { Users, Building2, TrendingUp, Activity } from 'lucide-react';
import { toast } from 'sonner';
import adminService from '../../../services/adminService';
import StatsCard from '../../../components/Dashboard/StatsCard';
import UsageChart from '../../../components/Dashboard/UsageChart';
import ActivityFeed from '../../../components/Dashboard/ActivityFeed';

const OverviewTab: FC = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);
  const [userGrowth, setUserGrowth] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [overviewData, usersData, activityData] = await Promise.all([
        adminService.getAnalyticsOverview(),
        adminService.getAnalyticsUsers(30),
        adminService.getActivityLog(1, 4),
      ]);

      setOverview(overviewData.overview);
      setUserGrowth(usersData.userGrowth || []);
      setActivities(activityData.activities || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load overview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className='space-y-6'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className='h-32 animate-pulse rounded-xl bg-slate-900'></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Stats Grid */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Total Users'
          value={overview?.totalUsers || 0}
          icon={Users}
          description='Registered users'
        />
        <StatsCard
          title='Total Teams'
          value={overview?.totalTeams || 0}
          icon={Building2}
          description='Active teams'
        />
        <StatsCard
          title='AI Generations'
          value={overview?.totalGenerations || 0}
          icon={TrendingUp}
          description='Total generations'
        />
        <StatsCard
          title='Active Users (30d)'
          value={overview?.activeUsersLast30Days || 0}
          icon={Activity}
          description='Active in last 30 days'
        />
      </div>

      {/* Charts and Activity */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <UsageChart
            data={userGrowth}
            type='line'
            title='User Growth (Last 30 Days)'
            dataKey='count'
            xAxisKey='_id'
          />
        </div>
        <div>
          <h3 className='mb-4 text-lg font-semibold text-white'>Recent Activity</h3>
          <ActivityFeed activities={activities} loading={false} />
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
