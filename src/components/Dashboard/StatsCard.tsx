import { FC } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  onClick?: () => void;
  className?: string;
}

const StatsCard: FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  description,
  onClick,
  className = '',
}) => {
  return (
    <div
      className={`rounded-xl border border-slate-800 bg-slate-900 p-6 transition-all hover:border-slate-700 ${
        onClick ? 'cursor-pointer hover:bg-slate-800/50' : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <p className='text-sm font-medium text-slate-400'>{title}</p>
          <div className='mt-2 flex items-baseline gap-2'>
            <p className='text-3xl font-bold text-white'>{value}</p>
            {trend && (
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
            )}
          </div>
          {description && (
            <p className='mt-1 text-sm text-slate-500'>{description}</p>
          )}
        </div>
        {Icon && (
          <div className='rounded-lg bg-slate-800 p-3'>
            <Icon className='h-6 w-6 text-cyan-400' />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
