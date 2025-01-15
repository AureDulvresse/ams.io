import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./src/lib/prisma";
import authConfig from "@/auth.config";
import { getUserById } from "./src/data/user";
import { Role } from "./src/types/role";
import { ExtendUser } from "./src/types/next-auth";
import { UserStatus } from "@prisma/client";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 heures
    updateAge: 12 * 60 * 60, // 12 heures
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
          last_login: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({ user }) {
      const existingUser = await getUserById(
        typeof user.id === "string" ? user.id : ""
      );

      if (!existingUser?.emailVerified) {
        return false;
      }

      // Mettre à jour last_login
      await db.user.update({
        where: { id: user.id },
        data: { last_login: new Date() },
      });

      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user && token.email) {
        session.user = {
          ...session.user,
          id: token.sub,
          role: token.role as Role,
          first_name: token.identity?.first_name || "",
          last_name: token.identity?.last_name || "",
          email: token.email,
          status: UserStatus.ACTIVE,
          emailVerified: token.emailVerified || new Date(),
          last_login: token.last_login,
        };
      }
      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      // Éviter les appels DB répétés en vérifiant si les données sont déjà présentes
      if (token.role && token.identity) return token;

      const user = await getUserById(token.sub);
      if (!user) return token;

      // Stocker seulement les données essentielles dans le token
      token.role = user.role;
      token.identity = {
        first_name: user.first_name,
        last_name: user.last_name,
      };
      token.email = user.email;
      token.emailVerified = user.emailVerified || undefined;
      token.last_login = user.last_login || undefined;

      // Nettoyer les données non essentielles
      delete token.name;
      delete token.picture;

      return token;
    },
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.NEXT_PUBLIC_DOMAIN,
        maxAge: 24 * 60 * 60,
      },
    },
    callbackUrl: {
      name: `__Secure-next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `__Host-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  ...authConfig,
});

export async function isAuthenticated(request: Request) {
  const session = await auth();
  return session || null;
}
