import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Role } from "@prisma/client";

// Interface pour le modèle User complet
interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id: number;
  emailVerified?: Date;
  is_active: boolean;
  last_login?: Date;
  image?: string;
  created_at: Date;
  updated_at: Date;
  role: Role;
}

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

  interface User {
    id: string;
    first_name: string;
    last_name: string;
    role: Role;
    is_active: boolean;
    emailVerified?: Date;
    last_login?: Date;
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
