import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./src/lib/prisma";
import authConfig from "@/auth.config";
import { getUserById } from "./src/data/user";
import { Role } from "@prisma/client";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
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
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      const existingUser = await getUserById(
        typeof user.id == "string" ? user.id : ""
      );

      if (!existingUser || !existingUser.emailVerified) {
        return false;
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as Role;
      }

      if (token.identity && session.user) {
        session.user.first_name = token.identity.first_name as string;
        session.user.last_name = token.identity.last_name as string;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser.role;
      token.identity = {
        first_name: existingUser.first_name,
        last_name: existingUser.last_name,
      };

      return token;
    },
  },
  ...authConfig,
});
