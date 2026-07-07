import { cookies } from "next/headers";

export default function DebugPage() {
  const c = cookies();

  console.log("COOKIES:", c);

  return <div>Check terminal</div>;
}
