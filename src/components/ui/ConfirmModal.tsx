import { FC, ReactNode } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

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
        <div className='flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#E5E2DA]'>
          <h3 className='text-[15px] font-bold text-stone-900'>{title}</h3>
          <Button
            variant='ghost'
            size='icon'
            onClick={onClose}
            icon={<X className='h-3.5 w-3.5' />}
            className='w-7 h-7 bg-[#F9F8F5] hover:bg-[#E5E2DA]'
            aria-label='Close modal'
          />
        </div>

        <div className='px-6 py-5'>{children}</div>

        <div className='flex items-center justify-end gap-2 px-6 py-3.5 border-t border-[#E5E2DA] bg-[#F9F8F5] rounded-b-2xl'>
          <Button variant='outline' size='md' onClick={onClose} className='h-9 px-4'>
            Cancel
          </Button>
          <Button
            variant={confirmVariant}
            size='md'
            onClick={onConfirm}
            className={`h-9 px-4 ${
              confirmVariant === 'danger' ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' : ''
            }`}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
