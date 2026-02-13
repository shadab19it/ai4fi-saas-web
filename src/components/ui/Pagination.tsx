import { FC } from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

const Pagination: FC<PaginationProps> = ({ page, totalPages, onPrev, onNext }) => {
  return (
    <div className='px-4 py-3 border-t border-[#E5E2DA] flex items-center justify-between'>
      <button
        disabled={page <= 1}
        onClick={onPrev}
        className='h-[30px] px-2.5 rounded-lg border border-[#E5E2DA] bg-white text-xs font-semibold text-[#6B6560] hover:bg-[#F9F8F5] disabled:opacity-50 disabled:cursor-not-allowed transition-all'
      >
        Previous
      </button>
      <span className='text-xs text-[#9E9893]'>
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={onNext}
        className='h-[30px] px-2.5 rounded-lg border border-[#E5E2DA] bg-white text-xs font-semibold text-[#6B6560] hover:bg-[#F9F8F5] disabled:opacity-50 disabled:cursor-not-allowed transition-all'
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
