import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";
import {
  apiAuthPrefix,
  authRoutes,
  createRedirectUrl,
  DEFAULT_LOGIN_REDIRECT,
  matchesRoute,
  privateRoutes,
  publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // Extract necessary information from the request
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Define route types using a more concise object structure
  const routeType = {
    isApiAuth: nextUrl.pathname.startsWith(apiAuthPrefix),
    isPublic: matchesRoute(nextUrl.pathname, publicRoutes),
    isAuth: matchesRoute(nextUrl.pathname, authRoutes),
    isPrivate: matchesRoute(nextUrl.pathname, privateRoutes),
  };

  // Early return for API authentication routes
  if (routeType.isApiAuth) {
    return NextResponse.next();
  }

  // Handle authentication routes (login, register, etc.)
  if (routeType.isAuth) {
    if (isLoggedIn) {
      const callbackUrl = nextUrl.searchParams.get("callbackUrl");
      const redirectUrl = callbackUrl || DEFAULT_LOGIN_REDIRECT;
      return Response.redirect(new URL(redirectUrl, nextUrl));
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (routeType.isPrivate) {
    if (!isLoggedIn) {
      const redirectUrl = createRedirectUrl(
        "/auth/login",
        nextUrl.toString(),
        nextUrl.pathname
      );
      return Response.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  // Handle public routes and default case
  return NextResponse.next();
});

// Matcher configuration for Next.js
export const config = {
  matcher: [
    // Match all paths except Next.js static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
