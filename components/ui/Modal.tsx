"use client";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-[#0b1020] p-6 rounded-xl w-full max-w-md">
        {children}

        <button
          onClick={onClose}
          className="mt-4 text-sm text-white/60"
        >
          Close
        </button>
      </div>
    </div>
  );
}




