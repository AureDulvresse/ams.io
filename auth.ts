import NextAuth, { Session, DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./src/lib/prisma";
import authConfig from "@/auth.config";
import { getUserById } from "./src/data/user";
import { Role } from "./src/types/role";
import { UserStatus } from "@prisma/client";
import { ExtendUser } from "./src/types/next-auth";
import { JWT } from "next-auth/jwt";

// Constantes
const AUTH_CONSTANTS = {
  SESSION: {
    MAX_AGE: 24 * 60 * 60, // 24 hours
    UPDATE_AGE: 12 * 60 * 60, // 12 hours
  },
  ERRORS: {
    SIGN_IN_NO_USER: "Sign-in attempt without user data",
    ALREADY_VERIFIED: "Sign-in attempt for already verified email",
    SESSION_ERROR: "Error during session callback",
    JWT_ERROR: "Error during JWT callback",
    AUTH_CHECK_ERROR: "Error checking authentication",
  },
} as const;

// Class pour la gestion des erreurs d'authentification
class AuthError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message);
    this.name = "AuthError";
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),

  session: {
    strategy: "jwt",
    maxAge: AUTH_CONSTANTS.SESSION.MAX_AGE,
    updateAge: AUTH_CONSTANTS.SESSION.UPDATE_AGE,
  },

  pages: {
    signIn: "/login",
    error: "/auth/error",
  },

  events: {
    async linkAccount({ user }) {
      try {
        await db.user.update({
          where: { id: user.id },
          data: {
            emailVerified: new Date(),
            last_login: new Date(),
          },
        });
      } catch (error) {
        throw new AuthError(
          "Failed to update user during account linking",
          "LINK_ACCOUNT_ERROR",
          error
        );
      }
    },
  },

  callbacks: {
    async signIn({ user, account }): Promise<boolean> {
      try {
        if (!user) {
          throw new AuthError(
            AUTH_CONSTANTS.ERRORS.SIGN_IN_NO_USER,
            "SIGN_IN_NO_USER"
          );
        }

        const existingUser = await getUserById(
          typeof user.id === "string" ? user.id : ""
        );

        if (!existingUser) {
          return false;
        }

        if (existingUser.emailVerified == null) {
          throw new AuthError(
            AUTH_CONSTANTS.ERRORS.ALREADY_VERIFIED,
            "EMAIL_ALREADY_VERIFIED"
          );
        }

        await db.user.update({
          where: { id: user.id },
          data: {
            last_login: new Date(),
            logins: {
              create: {
                login_time: new Date(),
                ip_address: account?.ip_address || "unknown",
                device: account?.user_agent || "unknown",
              },
            },
          },
        });

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },

    session: async ({ token, session }): Promise<Session> => {
      try {
        if (token.sub && session.user && token.email) {
          session.user = {
            ...session.user,
            id: token.sub,
            role: (token as JWT).role as Role,
            first_name: (token as JWT).identity?.first_name || "",
            last_name: (token as JWT).identity?.last_name || "",
            email: token.email,
            status: UserStatus.ACTIVE,
            emailVerified: (token as JWT).emailVerified || new Date(),
            last_login: (token as JWT).last_login,
          };
        }
        return session as Session;
      } catch (error) {
        throw new AuthError(
          AUTH_CONSTANTS.ERRORS.SESSION_ERROR,
          "SESSION_CALLBACK_ERROR",
          error
        );
      }
    },

    jwt: async ({ token }): Promise<JWT> => {
      try {
        if (!token.sub) return token;
        if (token.role && token.identity) return token as JWT;

        const user = await getUserById(token.sub);
        if (!user) return token;

        const extendedToken: JWT = {
          ...token,
          role: user.role,
          identity: {
            first_name: user.first_name,
            last_name: user.last_name,
          },
          email: user.email,
          emailVerified: user.emailVerified || undefined,
          last_login: user.last_login || undefined,
        };

        delete extendedToken.name;
        delete extendedToken.picture;

        return extendedToken;
      } catch (error) {
        throw new AuthError(
          AUTH_CONSTANTS.ERRORS.JWT_ERROR,
          "JWT_CALLBACK_ERROR",
          error
        );
      }
    },
  },

  ...authConfig,
});

// Fonction améliorée pour vérifier l'authentification
export async function isAuthenticated(
  request: Request
): Promise<Session | null> {
  try {
    const session = await auth();
    if (!isValidSession(session)) return null;
    return session as Session;
  } catch (error) {
    throw new AuthError(
      AUTH_CONSTANTS.ERRORS.AUTH_CHECK_ERROR,
      "AUTH_CHECK_ERROR",
      error
    );
  }
}

// Type guard amélioré
export function isValidSession(session: any): session is Session {
  return (
    session &&
    typeof session === "object" &&
    "user" in session &&
    typeof session.user === "object" &&
    "id" in session.user &&
    "role" in session.user &&
    "email" in session.user
  );
}
