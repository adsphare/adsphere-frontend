"use client";

export default function PaymentModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (method: "chapa" | "stripe") => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#0b1220] border border-white/10 rounded-2xl p-6 w-full max-w-md">

        <h2 className="text-xl font-bold text-white mb-4">
          Choose Payment Method
        </h2>

        <div className="space-y-3">

          <button
            onClick={() => onSelect("chapa")}
            className="w-full p-4 rounded-xl bg-green-600 hover:bg-green-500 text-white"
          >
            🇪🇹 Pay with Chapa
          </button>

          <button
            onClick={() => onSelect("stripe")}
            className="w-full p-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white"
          >
            🌍 Pay with Stripe
          </button>

        </div>

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-400"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}