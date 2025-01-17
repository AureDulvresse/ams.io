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
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Vérification du type de route actuelle
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

  // 2. Gérer les routes d'authentification (login, etc.)
  if (routeType.isAuth) {
    // Si l'utilisateur est déjà connecté, rediriger vers le dashboard
    if (isLoggedIn) {
      // Récupérer le paramètre 'from' s'il existe
      const from = nextUrl.searchParams.get("from");
      const redirectUrl = from || DEFAULT_LOGIN_REDIRECT;
      return Response.redirect(new URL(redirectUrl, nextUrl));
    }
    return NextResponse.next();
  }

  // 3. Gérer les routes privées
  if (routeType.isPrivate) {
    // Si non connecté, rediriger vers la page de login
    if (!isLoggedIn) {
      return Response.redirect(
        createRedirectUrl("/login", nextUrl.toString(), nextUrl.pathname)
      );
    }
    return NextResponse.next();
  }

  // 4. Autoriser l'accès aux routes publiques
  if (routeType.isPublic) {
    return NextResponse.next();
  }

  // 5. Par défaut, autoriser l'accès
  return NextResponse.next();
});

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
