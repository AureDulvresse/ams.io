import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { signInSchema } from "@/src/schemas/auth.schema";
import { getUserByEmail } from "@/src/data/user";
import { validatePassword } from "@/src/lib/hasher";
import { ErrorHandler } from "@/src/lib/error-handler";
import { logger } from "@/src/lib/logger";
import { RateLimiter } from "@/src/lib/rate-limit";
import { createAuditLog } from "@/src/lib/audit";
import { ExtendUser } from "./src/types/next-auth";

// Types
interface AuthCredentials {
  email: string;
  password: string;
  ip?: string;
  userAgent?: string;
}

interface SafeUser extends Omit<ExtendUser, "password"> {}

// Constants
const AUTH_CONSTANTS = {
  RATE_LIMIT: {
    MAX_ATTEMPTS: 5,
    WINDOW_MS: 5 * 60 * 1000, // 5 minutes
    BLOCK_DURATION: 30 * 60 * 1000, // 30 minutes
  },
  MESSAGES: {
    ERRORS: {
      INVALID_CREDENTIALS: "Les identifiants fournis sont invalides",
      RATE_LIMIT_EXCEEDED: "Trop de tentatives. Veuillez patienter 30 minutes",
      EMAIL_NOT_VERIFIED: "Veuillez vérifier votre adresse email",
      ACCOUNT_DISABLED: "Ce compte est désactivé",
      ACCOUNT_LOCKED: "Ce compte est temporairement verrouillé",
      VALIDATION_ERROR: "Les données fournies sont invalides",
      SERVER_ERROR: "Une erreur inattendue est survenue",
      MISSING_CREDENTIALS: "Email et mot de passe requis",
    },
  },
} as const;

class AuthenticationService {
  private rateLimiter: RateLimiter;
  private errorHandler: ErrorHandler;

  constructor() {
    this.rateLimiter = new RateLimiter(AUTH_CONSTANTS.RATE_LIMIT);
    this.errorHandler = new ErrorHandler();
  }

  async validateCredentials(
    credentials: AuthCredentials
  ): Promise<AuthCredentials> {
    try {
      return await signInSchema.parseAsync(credentials);
    } catch (error) {
      throw this.errorHandler.handle(error, "VALIDATION");
    }
  }

  async verifyUser(email: string, password: string): Promise<User> {
    try {
      const user = await getUserByEmail(email);

      if (!user || !user.password) {
        logger.warn("Tentative de connexion échouée: utilisateur non trouvé", {
          email,
        });
        throw new Error(AUTH_CONSTANTS.MESSAGES.ERRORS.INVALID_CREDENTIALS);
      }

      const isPasswordValid = await validatePassword(password, user.password);
      if (!isPasswordValid) {
        logger.warn("Tentative de connexion échouée: mot de passe invalide", {
          email,
        });
        throw new Error(AUTH_CONSTANTS.MESSAGES.ERRORS.INVALID_CREDENTIALS);
      }

      return user;
    } catch (error) {
      throw this.errorHandler.handle(error, "AUTHENTICATION");
    }
  }

  async checkUserStatus(user: User): Promise<void> {
    try {
      if (!user.emailVerified) {
        throw new Error(AUTH_CONSTANTS.MESSAGES.ERRORS.EMAIL_NOT_VERIFIED);
      }

      if (user.status !== "ACTIVE") {
        throw new Error(AUTH_CONSTANTS.MESSAGES.ERRORS.ACCOUNT_DISABLED);
      }
    } catch (error) {
      throw this.errorHandler.handle(error, "AUTHENTICATION");
    }
  }

  sanitizeUser(user: User): SafeUser {
    const { password, ...safeUserData } = user;
    return safeUserData as SafeUser;
  }

  async createLoginAuditLog(
    success: boolean,
    userId: string | null,
    credentials: Partial<AuthCredentials>,
    error?: Error
  ): Promise<void> {
    try {
      await createAuditLog({
        action: success ? "LOGIN_SUCCESS" : "LOGIN_FAILURE",
        userId: userId || undefined,
        metadata: {
          email: credentials.email,
          error: error?.message,
          ip: credentials.ip,
          userAgent: credentials.userAgent,
        },
      });
    } catch (error) {
      logger.error("Erreur lors de la création du log d'audit", { error });
    }
  }
}

const authService = new AuthenticationService();

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

      authorize: async (credentials): Promise<SafeUser | null> => {
        if (!credentials?.email || !credentials?.password) {
          logger.warn("Tentative de connexion avec des identifiants manquants");
          throw new Error(AUTH_CONSTANTS.MESSAGES.ERRORS.MISSING_CREDENTIALS);
        }

        try {
          const { email, password, ...metadata } =
            credentials as AuthCredentials;

          // Vérification du rate limiting
          await authService.rateLimiter.checkRateLimit(email);

          // Validation des données
          const validatedData = await authService.validateCredentials({
            email,
            password,
          });

          // Vérification de l'utilisateur
          const user = await authService.verifyUser(
            validatedData.email,
            validatedData.password
          );

          // Vérification du statut
          await authService.checkUserStatus(user);

          // Création du log d'audit
          await authService.createLoginAuditLog(true, user.id, {
            email,
            ...metadata,
          });

          // Retour des données sécurisées
          return authService.sanitizeUser(user);
        } catch (error) {
          await authService.createLoginAuditLog(
            false,
            null,
            credentials as AuthCredentials,
            error as Error
          );
          throw error;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
