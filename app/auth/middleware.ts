import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const protectedRoutes = ["/dashboard", "/list-space"];

  const isProtected = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  // 🔥 Supabase stores session in multiple cookies
  const hasSession =
    req.cookies.has("sb-access-token") ||
    req.cookies.has("sb-refresh-token");

  if (isProtected && !hasSession) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/list-space/:path*"],
};