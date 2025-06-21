import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/ar/dashboard"];

export function middleware(req: NextRequest) {
  const authToken = req.cookies.get("authToken");

  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    if (!authToken) {
      return NextResponse.redirect(new URL("/ar/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ar/dashboard:path*"],
};
