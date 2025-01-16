import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { signInSchema } from "./src/schemas/auth.schema";
import { getUserByEmail } from "./src/data/user";
import { validatePassword } from "./src/lib/hasher";
import { ZodError } from "zod";

// Types for better type safety
interface AuthCredentials {
  email: string;
  password: string;
}

interface AuthError {
  type: "credentials" | "validation" | "server";
  message: string;
}

// Constants for error messages
const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Identifiants invalides",
  USER_NOT_FOUND: "Utilisateur non trouvé",
  VALIDATION_ERROR: "Données d'authentification invalides",
  SERVER_ERROR: "Erreur serveur lors de l'authentification",
} as const;

// Rate limiting configuration
const RATE_LIMIT = {
  MAX_ATTEMPTS: 5,
  WINDOW_MS: 5 * 60 * 1000, // 5 minutes
} as const;

// In-memory store for rate limiting (consider using Redis in production)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

/**
 * Rate limiting utility
 */
const rateLimit = (email: string): boolean => {
  const now = Date.now();
  const attempts = loginAttempts.get(email);

  if (!attempts) {
    loginAttempts.set(email, { count: 1, lastAttempt: now });
    return false;
  }

  if (now - attempts.lastAttempt > RATE_LIMIT.WINDOW_MS) {
    loginAttempts.set(email, { count: 1, lastAttempt: now });
    return false;
  }

  if (attempts.count >= RATE_LIMIT.MAX_ATTEMPTS) {
    return true;
  }

  loginAttempts.set(email, {
    count: attempts.count + 1,
    lastAttempt: now,
  });

  return false;
};

/**
 * Enhanced NextAuth configuration with security features and proper error handling
 */
export default {
  providers: [
    Credentials({
      // Define the required credentials
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

          let user = null;
          // Type check and validate credentials
          if (!credentials?.email || !credentials?.password) {
            console.warn("Missing credentials");
            return null;
          }

          const { email, password } = credentials as AuthCredentials;

          // Check rate limiting
          if (rateLimit(email)) {
            console.warn(`Rate limit exceeded for email: ${email}`);
            throw new Error(
              "Trop de tentatives de connexion. Veuillez réessayer plus tard."
            );
          }

          // Validate input format
          const validatedData = await signInSchema.parseAsync({
            email,
            password,
          });

          // Get user from database
          user = await getUserByEmail(validatedData.email);

          if (!user || !user.password) {
            console.warn(`Failed login attempt for email: ${email}`);
            return null;
          }

          // Verify password using constant-time comparison
          const isPasswordValid = await validatePassword(
            validatedData.password,
            user.password
          );

          if (!isPasswordValid) {
            console.warn(`Invalid password for email: ${email}`);
            return null;
          }

          // Check if email is verified
          if (!user.emailVerified) {
            throw new Error(
              "Veuillez vérifier votre email avant de vous connecter"
            );
          }

          // Check if user is active
          if (user.status !== "ACTIVE") {
            throw new Error("Votre compte est désactivé");
          }

          // Return user data without sensitive information
          const { password: _, ...safeUserData } = user;

          return safeUserData;
          
        } catch (error) {
          // Handle different types of errors
          if (error instanceof ZodError) {
            console.error("Validation error:", error.errors);
            throw new Error(AUTH_ERRORS.VALIDATION_ERROR);
          }

          if (error instanceof Error) {
            console.error("Authentication error:", error.message);
            throw error;
          }

          console.error("Unexpected error during authentication:", error);
          throw new Error(AUTH_ERRORS.SERVER_ERROR);
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
