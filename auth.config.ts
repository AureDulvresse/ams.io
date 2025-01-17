import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { signInSchema } from "./src/schemas/auth.schema";
import { getUserByEmail } from "./src/data/user";
import { validatePassword } from "./src/lib/hasher";
import { ZodError } from "zod";
import { UserStatus } from "@prisma/client";

// Types for better type safety
interface AuthCredentials {
  email: string;
  password: string;
}

interface AuthError {
  type: "credentials" | "validation" | "server" | "status" | "rate_limit";
  message: string;
  code?: string;
}

// Constants étendues
const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Identifiants invalides",
  USER_NOT_FOUND: "Utilisateur non trouvé",
  VALIDATION_ERROR: "Données d'authentification invalides",
  SERVER_ERROR: "Erreur serveur lors de l'authentification",
  RATE_LIMIT_EXCEEDED:
    "Trop de tentatives de connexion. Veuillez réessayer dans {minutes} minutes",
  EMAIL_NOT_VERIFIED: "Veuillez vérifier votre email avant de vous connecter",
  ACCOUNT_INACTIVE: "Votre compte est désactivé",
} as const;

// Configuration du rate limiting avec plus d'options
const RATE_LIMIT = {
  MAX_ATTEMPTS: 5,
  WINDOW_MS: 5 * 60 * 1000,
  LOCKOUT_MS: 30 * 60 * 1000, // 30 minutes de blocage
} as const;

// Amélioration de la gestion du rate limiting
class RateLimiter {
  private static attempts = new Map<string, { 
    count: number; 
    lastAttempt: number;
    lockedUntil?: number;
  }>();

  static isRateLimited(email: string): { limited: boolean; minutesLeft?: number } {
    const now = Date.now();
    const attempts = this.attempts.get(email);

    if (!attempts) {
      this.attempts.set(email, { count: 1, lastAttempt: now });
      return { limited: false };
    }

    // Vérifier si l'utilisateur est bloqué
    if (attempts.lockedUntil && now < attempts.lockedUntil) {
      const minutesLeft = Math.ceil((attempts.lockedUntil - now) / (60 * 1000));
      return { limited: true, minutesLeft };
    }

    // Réinitialiser si la fenêtre de temps est dépassée
    if (now - attempts.lastAttempt > RATE_LIMIT.WINDOW_MS) {
      this.attempts.set(email, { count: 1, lastAttempt: now });
      return { limited: false };
    }

    // Bloquer si trop de tentatives
    if (attempts.count >= RATE_LIMIT.MAX_ATTEMPTS) {
      const lockedUntil = now + RATE_LIMIT.LOCKOUT_MS;
      this.attempts.set(email, {
        ...attempts,
        lockedUntil,
      });
      return { limited: true, minutesLeft: RATE_LIMIT.LOCKOUT_MS / (60 * 1000) };
    }

    // Incrémenter le compteur
    this.attempts.set(email, {
      count: attempts.count + 1,
      lastAttempt: now,
    });

    return { limited: false };
  }

  static reset(email: string): void {
    this.attempts.delete(email);
  }
}

export default {
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "votre@email.com",
        },
        password: {
          label: "Mot de passe",
          type: "password",
        },
      },

      authorize: async (credentials): Promise<any> => {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);
          }

          const { email, password } = credentials as AuthCredentials;

          // Vérification du rate limiting améliorée
          const rateLimitStatus = RateLimiter.isRateLimited(email);
          if (rateLimitStatus.limited) {
            throw new Error(
              AUTH_ERRORS.RATE_LIMIT_EXCEEDED.replace(
                "{minutes}",
                String(rateLimitStatus.minutesLeft)
              )
            );
          }

          // Validation et récupération de l'utilisateur
          const validatedData = await signInSchema.parseAsync({ email, password });
          const user = await getUserByEmail(validatedData.email);

          if (!user || !user.password) {
            throw new Error(AUTH_ERRORS.USER_NOT_FOUND);
          }

          // Vérification du mot de passe
          const isPasswordValid = await validatePassword(
            validatedData.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);
          }

          // Vérifications du statut
          if (!user.emailVerified) {
            throw new Error(AUTH_ERRORS.EMAIL_NOT_VERIFIED);
          }

          if (user.status !== UserStatus.ACTIVE) {
            throw new Error(AUTH_ERRORS.ACCOUNT_INACTIVE);
          }

          // Réinitialiser le rate limiting en cas de succès
          RateLimiter.reset(email);

          // Retourner les données sans informations sensibles
          const { password: _, ...safeUserData } = user;
          return safeUserData;

        } catch (error) {
          if (error instanceof ZodError) {
            throw new Error(AUTH_ERRORS.VALIDATION_ERROR);
          }

          if (error instanceof Error) {
            throw new Error(error.message);
          }

          console.error(error);
          throw error;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
