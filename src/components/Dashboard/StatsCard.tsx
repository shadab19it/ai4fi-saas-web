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
  featured?: boolean;
  iconBgClass?: string;
  iconColorClass?: string;
}

const StatsCard: FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  description,
  onClick,
  className = '',
  featured = false,
  iconBgClass,
  iconColorClass,
}) => {
  if (featured) {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-[#0F62FE] to-[#0047B3] shadow-[0_8px_24px_rgba(15,98,254,0.22)] transition-all ${
          onClick ? 'cursor-pointer' : ''
        } ${className}`}
        onClick={onClick}
      >
        {/* Decorative circle */}
        <div className='absolute -top-5 -right-5 w-[70px] h-[70px] rounded-full bg-white/[0.07] pointer-events-none' />
        {Icon && (
          <div className='w-[34px] h-[34px] rounded-[9px] bg-white/20 flex items-center justify-center mb-3 shrink-0'>
            <Icon className='h-4 w-4 text-white' />
          </div>
        )}
        <p className='text-[10.5px] font-bold tracking-[0.9px] uppercase text-white/70 mb-1'>
          {title}
        </p>
        <div className='flex items-baseline gap-2'>
          <p className='text-[30px] font-bold tracking-tight text-white leading-none mb-1'>
            {value}
          </p>
          {trend && (
            <span
              className={`text-sm font-medium ${
                trend.isPositive ? 'text-green-300' : 'text-red-300'
              }`}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}%
            </span>
          )}
        </div>
        {description && (
          <p className='text-xs text-white/60'>{description}</p>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[#E5E2DA] bg-white p-5 shadow-[0_1px_3px_rgba(28,25,23,0.06)] transition-all hover:border-[#D0CBBF] hover:shadow-[0_4px_16px_rgba(28,25,23,0.09)] hover:-translate-y-0.5 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {/* Decorative circle */}
      <div className='absolute -top-5 -right-5 w-[70px] h-[70px] rounded-full bg-[#0F62FE]/[0.04] pointer-events-none' />
      {Icon && (
        <div className={`w-[34px] h-[34px] rounded-[9px] flex items-center justify-center mb-3 shrink-0 ${iconBgClass || 'bg-[#EEF3FF]'}`}>
          <Icon className={`h-4 w-4 ${iconColorClass || 'text-[#0F62FE]'}`} />
        </div>
      )}
      <p className='text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9E9893] mb-1'>
        {title}
      </p>
      <div className='flex items-baseline gap-2'>
        <p className='text-[30px] font-bold tracking-tight text-stone-900 leading-none mb-1'>
          {value}
        </p>
        {trend && (
          <span
            className={`text-sm font-medium ${
              trend.isPositive ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {trend.isPositive ? '+' : ''}
            {trend.value}%
          </span>
        )}
      </div>
      {description && (
        <p className='text-xs text-[#9E9893]'>{description}</p>
      )}
    </div>
  );
};

export default StatsCard;
