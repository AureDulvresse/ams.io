import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextRequest, NextResponse } from "next/server";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  privateRoutes,
  publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Vérification des types de routes
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.some(
    (route) =>
      nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`)
  );
  const isAuthRoute = authRoutes.some(
    (route) =>
      nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`)
  );
  const isPrivateRoute = privateRoutes.some(
    (route) =>
      nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`)
  );

  // 1. Permettre les routes d'API d'authentification
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // 2. Rediriger les utilisateurs connectés essayant d'accéder aux pages d'auth
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  // 3. Protéger les routes privées
  if (isPrivateRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    if (nextUrl.pathname !== "/login") {
      loginUrl.searchParams.set("from", nextUrl.pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 4. Permettre l'accès aux routes publiques
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 5. Par défaut, autoriser si connecté, sinon rediriger vers login
  if (!isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    if (nextUrl.pathname !== "/login") {
      loginUrl.searchParams.set("from", nextUrl.pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

// Configuration du matcher pour le middleware
export const config = {
  matcher: [
    // Matcher pour les routes protégées
    "/dashboard/:path*",
    // Matcher pour les routes d'authentification
    "/login",
    // Matcher pour les routes d'API
    "/api/:path*",
    // Matcher pour la page d'accueil
    "/",
  ],
};
