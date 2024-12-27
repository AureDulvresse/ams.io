import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  privateRoutes,
  publicRoutes,
} from "@/routes";

/**
 * Vérifie si un chemin correspond à une route ou ses sous-routes
 */
const matchesRoute = (pathname: string, routes: string[]): boolean =>
  routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

/**
 * Crée une URL de redirection avec un paramètre optionnel
 */
const createRedirectUrl = (
  path: string,
  baseUrl: string,
  fromPath?: string
): URL => {
  const url = new URL(path, baseUrl);
  if (fromPath && !fromPath.startsWith(path)) {
    url.searchParams.set("from", fromPath);
  }
  return url;
};

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Vérification du type de route
  const routeType = {
    isApiAuth: nextUrl.pathname.startsWith(apiAuthPrefix),
    isPublic: matchesRoute(nextUrl.pathname, publicRoutes),
    isAuth: matchesRoute(nextUrl.pathname, authRoutes),
    isPrivate: matchesRoute(nextUrl.pathname, privateRoutes),
  };

  // 1. Autoriser toutes les requêtes API d'authentification
  if (routeType.isApiAuth) {
    return NextResponse.next();
  }

  // 2. Rediriger les utilisateurs connectés depuis les pages d'authentification
  if (routeType.isAuth && isLoggedIn) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  // 3. Protéger les routes privées et rediriger vers la connexion si nécessaire
  if (!isLoggedIn && routeType.isPrivate) {
    return NextResponse.redirect(
      createRedirectUrl("/auth/login", nextUrl.toString(), nextUrl.pathname)
    );
  }

  // 4. Autoriser l'accès aux routes publiques
  if (routeType.isPublic) {
    return NextResponse.next();
  }

  // 5. Rediriger vers la connexion si non authentifié
  if (!isLoggedIn) {
    return NextResponse.redirect(
      createRedirectUrl("/auth/login", nextUrl.toString(), nextUrl.pathname)
    );
  }

  return NextResponse.next();
});

/**
 * Configuration des routes à intercepter par le middleware
 */
export const config = {
  matcher: [
    /*
     * Correspond à toutes les routes sauf :
     * 1. Les fichiers statiques (images, etc.)
     * 2. Les routes API internes de Next.js
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
