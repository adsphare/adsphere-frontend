export default function ListingSkeleton() {
  return (
    <div className="border border-white/10 bg-white/5 rounded-xl overflow-hidden animate-pulse">

      <div className="h-44 bg-white/10" />

      <div className="p-4 space-y-3">

        <div className="h-4 w-2/3 bg-white/10 rounded" />

        <div className="h-3 w-full bg-white/10 rounded" />

        <div className="flex justify-between">
          <div className="h-3 w-20 bg-white/10 rounded" />
          <div className="h-3 w-16 bg-white/10 rounded" />
        </div>

        <div className="flex gap-3 pt-2">
          <div className="h-8 w-20 bg-white/10 rounded-full" />
          <div className="h-8 w-20 bg-white/10 rounded-full" />
        </div>

      </div>

    </div>
  );
}