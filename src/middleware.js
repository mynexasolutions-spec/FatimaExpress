import { NextResponse } from "next/server";
import { verifyAdminSessionToken, COOKIE_NAME as ADMIN_COOKIE_NAME } from "@/lib/adminSession";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const isAdminPath = pathname.startsWith("/admin") && pathname !== "/admin/login";

  if (!isAdminPath) {
    return NextResponse.next();
  }

  const adminSession = await verifyAdminSessionToken(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
  if (!adminSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  response.headers.set("x-admin-email", encodeURIComponent(adminSession.email));
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
