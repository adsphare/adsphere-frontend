import { createServerSupabase } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("boost_analytics")
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">
      <h1 className="text-3xl font-bold">
        Boost Analytics
      </h1>

      <p className="text-white/50 mt-2">
        Total records: {data?.length ?? 0}
      </p>
    </div>
  );
}