/**
 * Vérifie si un chemin correspond à une route ou ses sous-routes
 */
export const matchesRoute = (pathname: string, routes: string[]): boolean =>
  routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

/**
 * Crée une URL de redirection avec un paramètre optionnel
 */
export const createRedirectUrl = (
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

// Configuration des routes
export const publicRoutes = ["/"];
export const authRoutes = ["/auth/login"];
export const privateRoutes = ["/dashboard"];
export const apiAuthPrefix = "/api/auth";
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
