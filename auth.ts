import NextAuth, { Session } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./src/lib/prisma";
import authConfig from "@/auth.config";
import { getUserById } from "./src/data/user";
import { Role } from "./src/types/role";
import { UserStatus } from "@prisma/client";
import { JWT } from "next-auth/jwt";
import { cookieConfig } from "./cookies.config";

// Constants
const SESSION_MAX_AGE = 24 * 60 * 60; // 24 hours
const SESSION_UPDATE_AGE = 12 * 60 * 60; // 12 hours

// NextAuth configuration
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),

  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
    updateAge: SESSION_UPDATE_AGE,
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
        console.error("Error updating user during account linking:", error);
      }
    },
  },

  callbacks: {
    async signIn({ user, account }) {
      try {
        if (!user) {
          console.warn("Sign-in attempt without user data");
          return false;
        }

        const existingUser = await getUserById(
          typeof user.id === "string" ? user.id : ""
        );

        if (existingUser?.emailVerified === null) {
          console.warn("Sign-in attempt for already verified email");
          return false;
        }

        // Update last login
        await db.user.update({
          where: { id: user.id },
          data: { last_login: new Date() },
        });

        return true;
      } catch (error) {
        console.error("Error during sign-in callback:", error);
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
        console.error("Error during session callback:", error);
        return session as Session;
      }
    },

    jwt: async ({ token }): Promise<JWT> => {
      try {
        if (!token.sub) return token;

        // Avoid repeated DB calls by checking if data is already present
        if (token.role && token.identity) return token as JWT;

        const user = await getUserById(token.sub);
        if (!user) return token;

        // Store only essential data in the token
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

        // Clean non-essential data
        delete extendedToken.name;
        delete extendedToken.picture;

        return extendedToken;
      } catch (error) {
        console.error("Error during JWT callback:", error);
        return token;
      }
    },
  },

  cookies: cookieConfig,

  ...authConfig,
});

/**
 * Checks if the current request is authenticated
 * @param request - The incoming request object
 * @returns The session object if authenticated, null otherwise
 */
export async function isAuthenticated(request: Request) {
  try {
    const session = await auth();
    return session;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return null;
  }
}

// Type guard for session
export function isValidSession(session: any): session is Session {
  return (
    session &&
    typeof session === "object" &&
    "user" in session &&
    typeof session.user === "object" &&
    "id" in session.user
  );
}
