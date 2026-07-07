import TrustBadge from "@/components/trust/TrustBadge";
import TrustMeter from "@/components/trust/TrustMeter";

export default function SellerCard({ userId }: { userId: string }) {
  return (
    <div className="p-4 border border-white/10 rounded-xl">
      <TrustBadge userId={userId} />
      <div className="mt-3">
        <TrustMeter userId={userId} />
      </div>
    </div>
  );
}

