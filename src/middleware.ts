import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeToken } from "./lib/jwt";

// 1. Auth routes where logged-in users are blocked from visiting
const AUTH_ROUTES = ["/login", "/register", "/verify-otp", "/forget-password", "/reset-password"];

// 2. Helper function to get default role-based dashboard URL
function getDashboardRedirectUrl(role: string, request: NextRequest) {
  const normalizedRole = role.toUpperCase();
  if (normalizedRole === "ADMIN") {
    return new URL("/admin/dashboard", request.url);
  } else if (normalizedRole === "ORGANIZER") {
    return new URL("/organizer/dashboard", request.url);
  } else {
    return new URL("/dashboard/overview", request.url);
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read accessToken from cookies
  const token = request.cookies.get("accessToken")?.value;

  // Decode user identity from token
  const identity = token ? decodeToken(token) : null;

  // --- Condition 1: Block logged-in users from visiting auth pages ---
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  if (isAuthRoute) {
    if (identity) {
      // If logged in, redirect them to their respective dashboard
      return NextResponse.redirect(getDashboardRedirectUrl(identity.role, request));
    }
    // Allow guest access if not logged in
    return NextResponse.next();
  }

  // --- Condition 2: Protected dashboard routes identification ---
  const isAdminRoute = pathname.startsWith("/admin");
  const isOrganizerRoute = pathname.startsWith("/organizer");
  const isUserRoute = pathname.startsWith("/dashboard");

  const isProtectedRoute = isAdminRoute || isOrganizerRoute || isUserRoute;

  if (isProtectedRoute) {
    // --- Condition 3: Redirect to login if user is not authenticated ---
    if (!identity) {
      const loginUrl = new URL("/login", request.url);
      // Append the attempted URL so we can redirect them back after logging in
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const userRole = identity.role.toUpperCase();

    // --- Condition 4: Role-based authorization check ---
    if (isAdminRoute && userRole !== "ADMIN") {
      return NextResponse.redirect(getDashboardRedirectUrl(identity.role, request));
    }

    if (isOrganizerRoute && userRole !== "ORGANIZER") {
      return NextResponse.redirect(getDashboardRedirectUrl(identity.role, request));
    }

    if (isUserRoute && userRole !== "USER") {
      return NextResponse.redirect(getDashboardRedirectUrl(identity.role, request));
    }
  }

  // Allow request to proceed if all conditions pass
  return NextResponse.next();
}

// 5. Config to match which routes this middleware will execute on
export const config = {
  matcher: [
    "/login",
    "/register",
    "/verify-otp",
    "/forget-password",
    "/reset-password",
    "/dashboard/:path*",
    "/admin/:path*",
    "/organizer/:path*",
  ],
};
