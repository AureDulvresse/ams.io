import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Role } from "./role";

// Type étendu pour l'utilisateur dans la session
export type ExtendUser = DefaultSession["user"] & {
  id: string;
  first_name: string;
  last_name: string;
  role: Role;
  is_active: boolean;
  emailVerified?: Date;
  last_login?: Date;
};

// Déclaration de module pour étendre NextAuth
declare module "next-auth" {
  interface Session {
    user: ExtendUser;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    identity?: {
      first_name: string;
      last_name: string;
    };
  }
}
