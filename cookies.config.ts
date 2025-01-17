import { DEFAULT_LOGIN_REDIRECT } from "./routes";

const COOKIE_SECURE = process.env.NODE_ENV === "production";
const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;
const SESSION_MAX_AGE = 24 * 60 * 60; // 24 hours


// Cookie configuration
export const cookieConfig = {
  sessionToken: {
    name: `__Secure-next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      secure: COOKIE_SECURE,
      maxAge:SESSION_MAX_AGE,
      domain: COOKIE_DOMAIN,
    },
  },
  callbackUrl: {
    name: `__Secure-next-auth.callback-url`,
    options: {
      sameSite: "lax" as const,
      path: "/",
      secure: COOKIE_SECURE,
    },
  },
  csrfToken: {
    name: `__Host-next-auth.csrf-token`,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      secure: COOKIE_SECURE,
    },
  },
};
