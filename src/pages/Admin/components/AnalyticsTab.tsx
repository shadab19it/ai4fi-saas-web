import { FC, useEffect, useState } from 'react';
import { toast } from 'sonner';
import adminService from '../../../services/adminService';
import UsageChart from '../../../components/Dashboard/UsageChart';
import StatsCard from '../../../components/Dashboard/StatsCard';

const AnalyticsTab: FC = () => {
  const [loading, setLoading] = useState(true);
  const [usageData, setUsageData] = useState<any>(null);
  const [teamData, setTeamData] = useState<any>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usage, teams, subscriptions] = await Promise.all([
        adminService.getAnalyticsUsage(30),
        adminService.getAnalyticsTeams(),
        adminService.getSubscriptionAnalytics().catch(() => null), // Gracefully handle if endpoint doesn't exist yet
      ]);

      setUsageData(usage);
      setTeamData(teams);
      setSubscriptionData(subscriptions);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load analytics');
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
        {[1, 2, 3].map((i) => (
          <div key={i} className='h-64 animate-pulse rounded-xl bg-slate-900'></div>
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Subscription Analytics Section */}
      {subscriptionData && (
        <>
          <div className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
            <h2 className='mb-6 text-2xl font-bold text-white'>Subscription Analytics</h2>
            
            {/* Subscription Stats Cards */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-4 mb-6'>
              <StatsCard
                title='Total Subscriptions'
                value={subscriptionData?.totalSubscriptions || 0}
                description='All time'
              />
              <StatsCard
                title='Active Subscriptions'
                value={subscriptionData?.activeSubscriptions || 0}
                description='Currently active'
              />
              <StatsCard
                title='Total Earnings'
                value={`$${subscriptionData?.totalEarnings?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`}
                description='All time revenue'
              />
              <StatsCard
                title='Monthly Recurring Revenue'
                value={`$${subscriptionData?.monthlyRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`}
                description='Current month'
              />
            </div>

            {/* Additional Subscription Metrics */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3 mb-6'>
              <div className='rounded-lg border border-slate-800 bg-slate-950/50 p-4'>
                <p className='text-sm text-slate-400'>Expired Subscriptions</p>
                <p className='text-2xl font-semibold text-white'>{subscriptionData?.expiredSubscriptions || 0}</p>
              </div>
              <div className='rounded-lg border border-slate-800 bg-slate-950/50 p-4'>
                <p className='text-sm text-slate-400'>Average Subscription Value</p>
                <p className='text-2xl font-semibold text-white'>
                  ${subscriptionData?.averageSubscriptionValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                </p>
              </div>
              <div className='rounded-lg border border-slate-800 bg-slate-950/50 p-4'>
                <p className='text-sm text-slate-400'>Subscriptions This Month</p>
                <p className='text-2xl font-semibold text-white'>{subscriptionData?.subscriptionsThisMonth || 0}</p>
              </div>
            </div>

            {/* Subscription Charts */}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6'>
              {subscriptionData?.subscriptionsByPlan && subscriptionData.subscriptionsByPlan.length > 0 && (
                <UsageChart
                  data={subscriptionData.subscriptionsByPlan}
                  type='pie'
                  title='Subscriptions by Plan'
                  dataKey='count'
                  xAxisKey='planName'
                />
              )}
              {subscriptionData?.subscriptionsByStatus && subscriptionData.subscriptionsByStatus.length > 0 && (
                <UsageChart
                  data={subscriptionData.subscriptionsByStatus}
                  type='pie'
                  title='Subscriptions by Status'
                  dataKey='count'
                  xAxisKey='status'
                />
              )}
            </div>

            {/* Revenue Over Time */}
            {subscriptionData?.revenueOverTime && subscriptionData.revenueOverTime.length > 0 && (
              <div className='mb-6'>
                <UsageChart
                  data={subscriptionData.revenueOverTime}
                  type='bar'
                  title='Revenue Over Time (Last 12 Months)'
                  dataKey='revenue'
                  xAxisKey='month'
                />
              </div>
            )}

            {/* Subscription Breakdown Table */}
            {subscriptionData?.subscriptionsByPlan && subscriptionData.subscriptionsByPlan.length > 0 && (
              <div className='rounded-xl border border-slate-800 bg-slate-950/50 p-6'>
                <h3 className='mb-4 text-lg font-semibold text-white'>Subscription Breakdown by Plan</h3>
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead>
                      <tr className='border-b border-slate-800 text-left text-sm text-slate-400'>
                        <th className='pb-3'>Plan Name</th>
                        <th className='pb-3'>Subscriptions</th>
                        <th className='pb-3'>Total Revenue</th>
                        <th className='pb-3'>Average Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptionData.subscriptionsByPlan.map((plan: any, index: number) => (
                        <tr key={index} className='border-b border-slate-800/50 text-sm'>
                          <td className='py-3 text-white capitalize'>{plan.planName || 'Unknown'}</td>
                          <td className='py-3 text-slate-300'>{plan.count || 0}</td>
                          <td className='py-3 text-cyan-400'>
                            ${plan.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                          </td>
                          <td className='py-3 text-slate-300'>
                            ${plan.averagePrice?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Team Stats */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <StatsCard
          title='Total Teams'
          value={teamData?.totalTeams || 0}
          description='Active teams'
        />
        <StatsCard
          title='Average Team Size'
          value={teamData?.avgTeamSize || 0}
          description='Members per team'
        />
        <StatsCard
          title='Total Generations'
          value={usageData?.totalGenerations || 0}
          description='Last 30 days'
        />
      </div>

      {/* Usage Charts */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <UsageChart
          data={usageData?.generationsOverTime || []}
          type='bar'
          title='Generations Over Time (30 Days)'
          dataKey='count'
          xAxisKey='_id'
        />
        <UsageChart
          data={usageData?.generationsByType || []}
          type='pie'
          title='Generations by Type'
          dataKey='count'
          xAxisKey='_id'
        />
      </div>

      {/* Team Sizes Table */}
      <div className='rounded-xl border border-slate-800 bg-slate-900 p-6'>
        <h3 className='mb-4 text-lg font-semibold text-white'>Team Distribution</h3>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-slate-800 text-left text-sm text-slate-400'>
                <th className='pb-3'>Team Name</th>
                <th className='pb-3'>Members</th>
                <th className='pb-3'>Credits</th>
              </tr>
            </thead>
            <tbody>
              {(teamData?.teamSizes || []).slice(0, 10).map((team: any) => (
                <tr key={team.teamId} className='border-b border-slate-800/50 text-sm'>
                  <td className='py-3 text-white'>{team.teamName}</td>
                  <td className='py-3 text-slate-300'>{team.memberCount}</td>
                  <td className='py-3 text-cyan-400'>{team.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
