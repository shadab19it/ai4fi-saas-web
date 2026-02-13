import { FC, useState } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Download } from 'lucide-react';
import Pagination from './Pagination';

export interface CreditHistoryEntry {
  type: string;
  amount: number;
  balance: number;
  createdAt: string;
  reason?: string;
}

interface CreditHistoryListProps {
  title: string;
  subtitle?: string;
  entries: CreditHistoryEntry[];
  onExport?: () => void;
  /** 'detailed' shows icon boxes + arrow balance; 'compact' shows inline trending icon */
  variant?: 'detailed' | 'compact';
  pageSize?: number;
}

const CreditHistoryList: FC<CreditHistoryListProps> = ({
  title,
  subtitle,
  entries,
  onExport,
  variant = 'compact',
  pageSize = 5,
}) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(entries.length / pageSize);
  const paginatedEntries = entries.slice((page - 1) * pageSize, page * pageSize);
  return (
    <div className='rounded-2xl border border-[#E5E2DA] bg-white shadow-[0_1px_3px_rgba(28,25,23,0.06)] overflow-hidden'>
      {/* Header */}
      <div className='px-5 py-[18px] border-b border-[#E5E2DA] flex items-center justify-between'>
        <div>
          <span className='text-sm font-bold text-stone-900'>{title}</span>
          {subtitle && <p className='text-xs text-[#9E9893] mt-0.5'>{subtitle}</p>}
        </div>
        {onExport && (
          <button
            onClick={onExport}
            className='h-8 px-3 flex items-center gap-1.5 rounded-lg border border-[#E5E2DA] bg-white text-xs font-semibold text-[#6B6560] hover:bg-[#F9F8F5] hover:border-[#D0CBBF] hover:text-stone-900 transition-all'
          >
            <Download className='h-3 w-3' />
            Export
          </button>
        )}
      </div>

      {/* Content */}
      {entries.length === 0 ? (
        <div className='p-6 text-center text-[13px] text-[#9E9893]'>No credit history yet.</div>
      ) : variant === 'detailed' ? (
        <>
        {paginatedEntries.map((entry, index) => {
          const isPositive = entry.amount > 0;
          const iconBgClass = isPositive
            ? 'bg-emerald-50'
            : entry.type === 'adjustment'
              ? 'bg-amber-50'
              : 'bg-red-50';
          const iconColorClass = isPositive
            ? 'text-emerald-600'
            : entry.type === 'adjustment'
              ? 'text-amber-600'
              : 'text-red-600';
          const amountColor = isPositive
            ? 'text-emerald-600'
            : entry.type === 'adjustment'
              ? 'text-amber-600'
              : 'text-red-600';

          return (
            <div
              key={`${entry.createdAt}-${index}`}
              className={`flex items-center gap-3.5 px-5 py-3.5 hover:bg-[#F9F8F5] transition-colors ${
                index < paginatedEntries.length - 1 ? 'border-b border-[#E5E2DA]' : ''
              }`}
            >
              {/* Icon */}
              <div
                className={`w-[38px] h-[38px] rounded-[10px] ${iconBgClass} flex items-center justify-center shrink-0`}
              >
                {isPositive ? (
                  <TrendingUp className={`h-[15px] w-[15px] ${iconColorClass}`} />
                ) : entry.type === 'adjustment' ? (
                  <RefreshCw className={`h-[15px] w-[15px] ${iconColorClass}`} />
                ) : (
                  <TrendingDown className={`h-[15px] w-[15px] ${iconColorClass}`} />
                )}
              </div>

              {/* Info */}
              <div className='flex-1 min-w-0'>
                <p className='text-[13.5px] font-semibold text-stone-900 capitalize'>{entry.type}</p>
                <div className='flex items-center gap-1.5 mt-0.5'>
                  <span className='text-[11.5px] text-[#9E9893] font-mono'>Bal: {entry.balance}</span>
                  <span className='text-[#D0CBBF]'>·</span>
                  <span className='text-[11.5px] text-[#9E9893] font-mono'>
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </div>
                {entry.reason && (
                  <p className='text-xs text-[#6B6560] mt-0.5 truncate'>{entry.reason}</p>
                )}
              </div>

              {/* Amount */}
              <div className='text-right shrink-0'>
                <p className={`text-[15px] font-bold font-mono ${amountColor}`}>
                  {isPositive ? '+' : ''}
                  {entry.amount}
                </p>
                <p className='text-[11px] text-[#9E9893] font-mono mt-0.5'>→ {entry.balance}</p>
              </div>
            </div>
          );
        })}
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        )}
        </>
      ) : (
        <>
        {paginatedEntries.map((entry, index) => (
          <div
            key={`${entry.createdAt}-${index}`}
            className={`flex items-center justify-between px-5 py-3.5 ${
              index < paginatedEntries.length - 1 ? 'border-b border-[#E5E2DA]' : ''
            } hover:bg-[#F9F8F5] transition-colors`}
          >
            <div>
              <p className='text-[13.5px] font-semibold text-stone-900 capitalize'>{entry.type}</p>
              <p className='text-[11.5px] text-[#9E9893] font-mono mt-0.5'>
                Balance: {entry.balance} · {new Date(entry.createdAt).toLocaleString()}
              </p>
              {entry.reason && <p className='text-xs text-[#6B6560] mt-0.5'>{entry.reason}</p>}
            </div>
            <div className='flex items-center gap-1.5'>
              {entry.amount >= 0 ? (
                <TrendingUp className='h-3.5 w-3.5 text-emerald-600' />
              ) : (
                <TrendingDown className='h-3.5 w-3.5 text-red-600' />
              )}
              <span
                className={`text-sm font-bold font-mono ${
                  entry.amount >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {entry.amount >= 0 ? '+' : ''}
                {entry.amount}
              </span>
            </div>
          </div>
        ))}
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        )}
        </>
      )}
    </div>
  );
};

export default CreditHistoryList;
