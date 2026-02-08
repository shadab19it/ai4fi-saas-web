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
        return <UserPlus className='h-5 w-5' />;
      case 'team_created':
        return <Users className='h-5 w-5' />;
      case 'generation':
        return <Sparkles className='h-5 w-5' />;
      default:
        return <Circle className='h-5 w-5' />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user_signup':
        return 'bg-green-500/10 text-green-400';
      case 'team_created':
        return 'bg-blue-500/10 text-blue-400';
      case 'generation':
        return 'bg-purple-500/10 text-purple-400';
      default:
        return 'bg-slate-500/10 text-slate-400';
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
            className='animate-pulse rounded-lg border border-slate-800 bg-slate-900 p-4'
          >
            <div className='h-4 w-3/4 rounded bg-slate-800'></div>
            <div className='mt-2 h-3 w-1/2 rounded bg-slate-800'></div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className='rounded-lg border border-slate-800 bg-slate-900 p-8 text-center'>
        <p className='text-slate-400'>No recent activity</p>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {activities.map((activity, index) => (
        <div
          key={`${activity.type}-${index}`}
          className='group rounded-lg border border-slate-800 bg-slate-900 p-4 transition-all hover:border-slate-700 hover:bg-slate-800/50'
        >
          <div className='flex items-start gap-3'>
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${getActivityColor(
                activity.type
              )}`}
            >
              {getActivityIcon(activity.type)}
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-white'>
                {activity.description}
              </p>
              <p className='mt-1 text-xs text-slate-400'>
                {formatTimestamp(activity.timestamp)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
