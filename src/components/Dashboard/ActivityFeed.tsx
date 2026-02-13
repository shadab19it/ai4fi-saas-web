import { FC } from 'react';
import { UserPlus, Users, Sparkles, Circle } from 'lucide-react';

interface Activity {
  type: string;
  description: string;
  timestamp: string;
  user?: { email: string; username?: string };
  team?: { name: string };
}

interface ActivityFeedProps {
  activities: Activity[];
  loading?: boolean;
}

const ActivityFeed: FC<ActivityFeedProps> = ({ activities, loading = false }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_signup':
        return <UserPlus className='h-4 w-4' />;
      case 'team_created':
        return <Users className='h-4 w-4' />;
      case 'generation':
        return <Sparkles className='h-4 w-4' />;
      default:
        return <Circle className='h-4 w-4' />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user_signup':
        return 'bg-emerald-50 text-emerald-600';
      case 'team_created':
        return 'bg-blue-50 text-blue-600';
      case 'generation':
        return 'bg-violet-50 text-violet-600';
      default:
        return 'bg-stone-100 text-stone-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className='space-y-3'>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className='animate-pulse rounded-xl border border-[#E5E2DA] bg-white p-4'
          >
            <div className='h-4 w-3/4 rounded bg-stone-100'></div>
            <div className='mt-2 h-3 w-1/2 rounded bg-stone-100'></div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className='rounded-xl border border-[#E5E2DA] bg-white p-8 text-center'>
        <p className='text-[#9E9893]'>No recent activity</p>
      </div>
    );
  }

  return (
    <div className='rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] overflow-hidden'>
      <div className='px-5 py-4 border-b border-[#E5E2DA]'>
        <h3 className='text-sm font-bold text-stone-900'>Recent Activity</h3>
      </div>
      <div>
        {activities.map((activity, index) => (
          <div
            key={`${activity.type}-${index}`}
            className={`flex items-start gap-3 px-5 py-3 transition-colors hover:bg-[#F9F8F5] ${
              index < activities.length - 1 ? 'border-b border-[#E5E2DA]' : ''
            }`}
          >
            <div
              className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500`}
            >
              <Sparkles className='h-3 w-3 text-white' />
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-[12.5px] font-medium text-stone-900 leading-snug'>
                {activity.description}
              </p>
              <p className='mt-0.5 text-[11px] text-[#9E9893] font-mono'>
                {formatTimestamp(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
