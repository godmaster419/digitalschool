import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Check for admin session cookie
  const adminCookie = request.cookies.get("ds_admin_session")?.value;
  // Also check for standard Supabase auth token cookies if configured
  const hasSupabaseAuthCookie = request.cookies.getAll().some(
    (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
  );

  const isAuthenticated = Boolean(adminCookie || hasSupabaseAuthCookie);

  // If user visits /admin/login while already logged in
  if (pathname === "/admin/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // If user visits any other /admin route without an active session
  if (!isAuthenticated) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
