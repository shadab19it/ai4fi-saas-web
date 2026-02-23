import { FC, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { TrendingUp, Activity, Building2, Coins } from 'lucide-react';
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
        adminService.getSubscriptionAnalytics().catch(() => null),
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
          <div key={i} className='h-64 animate-pulse rounded-2xl bg-white border border-[#E5E2DA]'></div>
        ))}
      </div>
    );
  }

  const currencySymbol = subscriptionData?.currencySymbol || "₹";
  const formatMoney = (value: number) =>
    `${currencySymbol}${Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className='space-y-6'>
      {/* ─── Subscription Analytics ────────────────────────── */}
      {subscriptionData && (
        <div className='space-y-5'>
          <div className='flex items-center gap-2 mb-3.5'>
            <div className='w-1 h-[18px] bg-[#0F62FE] rounded-sm' />
            <span className='text-base font-bold text-stone-900'>Subscription Analytics</span>
          </div>

          {/* Subscription Stats Cards */}
          <div className='grid grid-cols-1 gap-3.5 md:grid-cols-4'>
            <StatsCard
              title='Total Subscriptions'
              value={subscriptionData?.totalSubscriptions || 0}
              description='All time'
              featured
              icon={Coins}
            />
            <StatsCard
              title='Active Subscriptions'
              value={subscriptionData?.activeSubscriptions || 0}
              description='Currently active'
              icon={TrendingUp}
              iconBgClass='bg-emerald-50'
              iconColorClass='text-emerald-600'
            />
            <StatsCard
              title='Total Earnings'
              value={formatMoney(subscriptionData?.totalEarnings || 0)}
              description='All-time revenue (INR)'
              icon={Coins}
              iconBgClass='bg-amber-50'
              iconColorClass='text-amber-600'
            />
            <StatsCard
              title='Monthly Recurring'
              value={formatMoney(subscriptionData?.monthlyRevenue || 0)}
              description='Current month (INR)'
              icon={Activity}
              iconBgClass='bg-cyan-50'
              iconColorClass='text-cyan-600'
            />
          </div>

          {/* Additional Subscription Metrics */}
          <div className='grid grid-cols-1 gap-3.5 md:grid-cols-3'>
            <StatsCard
              title='Expired Subscriptions'
              value={subscriptionData?.expiredSubscriptions || 0}
              description='Total expired'
              icon={TrendingUp}
              iconBgClass='bg-red-50'
              iconColorClass='text-red-600'
            />
            <StatsCard
              title='Avg Subscription Value'
              value={formatMoney(subscriptionData?.averageSubscriptionValue || 0)}
              description='Per payment (INR)'
              icon={Coins}
              iconBgClass='bg-violet-50'
              iconColorClass='text-violet-600'
            />
            <StatsCard
              title='Subscriptions This Month'
              value={subscriptionData?.subscriptionsThisMonth || 0}
              description='New this month'
              icon={Activity}
              iconBgClass='bg-[#EEF3FF]'
              iconColorClass='text-[#0F62FE]'
            />
          </div>

          {/* Revenue chart */}
          {subscriptionData?.revenueOverTime && subscriptionData.revenueOverTime.length > 0 && (
            <UsageChart
              data={subscriptionData.revenueOverTime}
              type='bar'
              title='Revenue Over Time'
              subtitle='Last 12 Months'
              dataKey='revenue'
              xAxisKey='month'
            />
          )}

          {/* Subscription Charts */}
          <div className='grid grid-cols-1 gap-[18px] lg:grid-cols-2'>
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

          {/* Subscription Breakdown Table */}
          {subscriptionData?.subscriptionsByPlan && subscriptionData.subscriptionsByPlan.length > 0 && (
            <div className='rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] overflow-hidden'>
              <div className='px-5 py-4 border-b border-[#E5E2DA]'>
                <h3 className='text-sm font-bold text-stone-900'>Subscription Breakdown by Plan</h3>
              </div>
              <div className='overflow-x-auto'>
                <table className='w-full border-collapse'>
                  <thead>
                    <tr className='bg-[#F9F8F5]'>
                      <th className='text-left text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA]'>Plan Name</th>
                      <th className='text-left text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA]'>Subscriptions</th>
                      <th className='text-left text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA]'>Total Revenue</th>
                      <th className='text-left text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA]'>Average Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptionData.subscriptionsByPlan.map((plan: any, index: number) => (
                      <tr key={index} className='border-b border-[#E5E2DA] hover:bg-[#F9F8F5] transition-colors'>
                        <td className='px-4 py-3.5 text-[13.5px] text-stone-900 capitalize font-medium'>{plan.planName || 'Unknown'}</td>
                        <td className='px-4 py-3.5 text-[13.5px] text-[#6B6560] font-mono'>{plan.count || 0}</td>
                        <td className='px-4 py-3.5 text-[13.5px] text-[#0F62FE] font-mono font-semibold'>
                          {formatMoney(plan.totalRevenue || 0)}
                        </td>
                        <td className='px-4 py-3.5 text-[13.5px] text-[#6B6560] font-mono'>
                          {formatMoney(plan.averagePrice || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Team Stats ────────────────────────────────── */}
      <div className='grid grid-cols-1 gap-3.5 md:grid-cols-3'>
        <StatsCard
          title='Total Teams'
          value={teamData?.totalTeams || 0}
          description='Active teams'
          icon={Building2}
          iconBgClass='bg-[#EEF3FF]'
          iconColorClass='text-[#0F62FE]'
        />
        <StatsCard
          title='Average Team Size'
          value={teamData?.avgTeamSize || 0}
          description='Members per team'
          icon={Building2}
          iconBgClass='bg-violet-50'
          iconColorClass='text-violet-600'
        />
        <StatsCard
          title='Total Generations'
          value={usageData?.totalGenerations || 0}
          description='Last 30 days'
          icon={Activity}
          iconBgClass='bg-cyan-50'
          iconColorClass='text-cyan-600'
        />
      </div>

      {/* ─── Usage Charts ──────────────────────────────── */}
      <div className='grid grid-cols-1 gap-[18px] lg:grid-cols-2'>
        <UsageChart
          data={usageData?.generationsOverTime || []}
          type='bar'
          title='Generations Over Time'
          subtitle='Last 30 Days'
          dataKey='count'
          xAxisKey='_id'
          colors={['#0891B2']}
        />
        <UsageChart
          data={usageData?.generationsByType || []}
          type='pie'
          title='Generations by Type'
          dataKey='count'
          xAxisKey='_id'
        />
      </div>

      {/* ─── Team Distribution ─────────────────────────── */}
      <div className='rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] overflow-hidden'>
        <div className='px-5 py-4 border-b border-[#E5E2DA]'>
          <h3 className='text-sm font-bold text-stone-900'>Team Distribution</h3>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='bg-[#F9F8F5]'>
                <th className='text-left text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA]'>Team Name</th>
                <th className='text-right text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA]'>Members</th>
                <th className='text-right text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9E9893] px-4 py-2.5 border-b border-[#E5E2DA]'>Credits</th>
              </tr>
            </thead>
            <tbody>
              {(teamData?.teamSizes || []).slice(0, 10).map((team: any, index: number) => {
                const dotColors = ['bg-[#0F62FE]', 'bg-violet-600', 'bg-cyan-600', 'bg-emerald-600', 'bg-amber-600'];
                return (
                  <tr key={team.teamId} className='border-b border-[#E5E2DA] hover:bg-[#F9F8F5] transition-colors'>
                    <td className='px-4 py-3.5 text-[13.5px]'>
                      <div className='flex items-center gap-2'>
                        <div className={`w-2 h-2 rounded-sm ${dotColors[index % dotColors.length]}`} />
                        <span className='font-semibold text-stone-900'>{team.teamName}</span>
                      </div>
                    </td>
                    <td className='px-4 py-3.5 text-right text-[13.5px] text-[#6B6560] font-mono'>{team.memberCount}</td>
                    <td className='px-4 py-3.5 text-right text-[13.5px] font-mono font-bold'>
                      <span className={team.credits > 100 ? 'text-emerald-600' : team.credits < 20 ? 'text-red-600' : 'text-amber-600'}>
                        {team.credits}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
