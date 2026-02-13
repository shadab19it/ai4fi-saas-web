import { FC, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'primary';
  onConfirm: () => void;
}

const ConfirmModal: FC<ConfirmModalProps> = ({
  open,
  onClose,
  title,
  children,
  confirmLabel = 'Confirm',
  confirmVariant = 'danger',
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div
      className='fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm'
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className='w-[440px] max-w-[calc(100vw-32px)] rounded-2xl bg-white border border-[#E5E2DA] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#E5E2DA]'>
          <h3 className='text-[15px] font-bold text-stone-900'>{title}</h3>
          <button
            onClick={onClose}
            className='w-7 h-7 rounded-md bg-[#F9F8F5] flex items-center justify-center text-[#6B6560] hover:bg-[#E5E2DA] transition-colors'
          >
            <X className='h-3.5 w-3.5' />
          </button>
        </div>

        {/* Body */}
        <div className='px-6 py-5'>{children}</div>

        {/* Footer */}
        <div className='flex items-center justify-end gap-2 px-6 py-3.5 border-t border-[#E5E2DA] bg-[#F9F8F5] rounded-b-2xl'>
          <button
            onClick={onClose}
            className='h-9 px-4 rounded-lg border border-[#E5E2DA] bg-white text-[13px] font-semibold text-[#6B6560] hover:bg-[#F9F8F5] transition-all'
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`h-9 px-4 rounded-lg text-[13px] font-semibold transition-all ${
              confirmVariant === 'danger'
                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                : 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] shadow-[0_1px_3px_rgba(37,99,235,0.3)]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
