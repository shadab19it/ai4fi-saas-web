import { FC } from 'react';

interface ManageCreditsPanelProps {
  title: string;
  /** Entity name/email to display */
  entityLabel: string;
  /** Current credit balance display */
  creditsDisplay: React.ReactNode;
  /** Optional subtitle for the info box */
  entitySubLabel?: string;
  amountInput: string;
  onAmountChange: (value: string) => void;
  reasonInput: string;
  onReasonChange: (value: string) => void;
  onAdd: () => void;
  onRemove: () => void;
  disabled?: boolean;
  /** Optional warning message shown above buttons */
  warning?: string;
  /** Placeholder when no entity is selected */
  emptyMessage?: string;
  /** Whether an entity is selected */
  hasSelection: boolean;
}

const ManageCreditsPanel: FC<ManageCreditsPanelProps> = ({
  title,
  entityLabel,
  creditsDisplay,
  entitySubLabel,
  amountInput,
  onAmountChange,
  reasonInput,
  onReasonChange,
  onAdd,
  onRemove,
  disabled = false,
  warning,
  emptyMessage = 'Select an item to manage credits.',
  hasSelection,
}) => {
  return (
    <div className='rounded-2xl border border-[#E5E2DA] bg-white p-5 shadow-[0_1px_3px_rgba(28,25,23,0.06)] self-stretch'>
      <h3 className='text-sm font-bold text-stone-900 mb-3.5'>{title}</h3>
      {!hasSelection ? (
        <p className='text-[13px] text-[#9E9893]'>{emptyMessage}</p>
      ) : (
        <>
          <div className='mb-3 p-3 bg-[#F9F8F5] rounded-[10px] border border-[#E5E2DA]'>
            <p className='text-[11px] text-[#9E9893] mb-1'>
              {entitySubLabel || 'Selected'}
            </p>
            <p className='text-[13.5px] font-bold text-[#0F62FE] font-mono'>{entityLabel}</p>
            <p className='text-xs text-[#6B6560] mt-1'>
              Current Credits: {creditsDisplay}
            </p>
          </div>
          <div className='mb-2.5'>
            <p className='text-[11px] font-bold text-[#6B6560] mb-1.5'>CREDITS</p>
            <input
              type='number'
              value={amountInput}
              onChange={(e) => onAmountChange(e.target.value)}
              placeholder='Enter amount...'
              className='w-full h-9 px-3 rounded-lg border border-[#E5E2DA] bg-[#F9F8F5] text-[13px] text-stone-900 placeholder:text-[#9E9893] outline-none focus:border-[#0F62FE] focus:ring-2 focus:ring-[#0F62FE]/10 transition-all'
            />
          </div>
          <div className='mb-3.5'>
            <p className='text-[11px] font-bold text-[#6B6560] mb-1.5'>REASON</p>
            <input
              value={reasonInput}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder='Reason for adjustment...'
              className='w-full h-9 px-3 rounded-lg border border-[#E5E2DA] bg-[#F9F8F5] text-[13px] text-stone-900 placeholder:text-[#9E9893] outline-none focus:border-[#0F62FE] focus:ring-2 focus:ring-[#0F62FE]/10 transition-all'
            />
          </div>
          {warning && (
            <div className='bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-700 mb-3'>
              {warning}
            </div>
          )}
          <div className='grid grid-cols-2 gap-2'>
            <button
              onClick={onAdd}
              disabled={disabled}
              className='h-9 rounded-lg bg-emerald-600 text-white text-[13px] font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1'
            >
              Add Credits
            </button>
            <button
              onClick={onRemove}
              disabled={disabled}
              className='h-9 rounded-lg bg-red-600 text-white text-[13px] font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1'
            >
              Remove
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageCreditsPanel;
