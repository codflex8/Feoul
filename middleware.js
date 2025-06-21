import { NextResponse } from "next/server";

export function middleware(req) {
  const authToken = req.cookies.get("authToken");

    if (req.nextUrl.pathname.startsWith("/ar/dashboard")) {
     if (!authToken) {
      return NextResponse.redirect(new URL("/ar/login", req.url));
    }
  }

   return NextResponse.next();
}

export const config = {
  matcher: ["/ar/dashboard/:path*"],  
};
