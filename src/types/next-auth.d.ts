import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Role } from "./role";
import { UserStatus } from "@prisma/client";

// Type étendu pour l'utilisateur dans la session
export type ExtendUser = DefaultSession["user"] & {
  id: string;
  role: Role;
  first_name: string;
  last_name: string;
  email: string;
  status: UserStatus;
  emailVerified?: Date;
  last_login?: Date;
};

export interface UserIdentity {
  first_name: string;
  last_name: string;
}

// Déclaration de module pour étendre NextAuth
declare module "next-auth" {

  interface User extends ExtendUser {}

  interface Session {
    user: ExtendUser;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    role: Role;
    identity?: UserIdentity;
    emailVerified?: Date;
    last_login?: Date;
  }
}
