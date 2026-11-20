import { Trash2, X } from 'lucide-react';
import Modal from './Modal';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  message = 'Are you sure you want to delete this record?',
  itemName,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="400px">
      <div className="relative flex flex-col items-center text-center pt-1 pb-1">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close confirmation"
          className="absolute -top-2 -right-2 w-8 h-8 rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-[#F3F6F4] hover:text-[#111827]"
        >
          <X size={18} />
        </button>

        <div className="w-12 h-12 rounded-xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center mb-4">
          <Trash2 size={22} />
        </div>

        <p className="text-[15px] font-medium text-[#111827] leading-snug max-w-[280px]">
          {message}
        </p>
        {itemName && (
          <p className="text-[13px] text-[#6B7280] mt-1.5 font-medium truncate max-w-full">
            {itemName}
          </p>
        )}

        <div className="flex items-center justify-center gap-3 mt-6 w-full">
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2.5 px-4 rounded-lg border border-[#E1E7E3] bg-[#F6F8F7] hover:bg-[#FEE2E2] hover:border-[#FCA5A5] hover:text-[#DC2626] text-[#111827] text-[13.5px] font-semibold transition-colors"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-lg border border-[#E1E7E3] bg-white hover:bg-[#F3F6F4] text-[#111827] text-[13.5px] font-semibold transition-colors"
          >
            No
          </button>
        </div>
      </div>
    </Modal>
  );
}
