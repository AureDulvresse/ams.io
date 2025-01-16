// @/lib/error-handler.ts
import { ZodError } from "zod";
import { logger } from "@/src/lib/logger";

export type ErrorType = 
  | "VALIDATION"
  | "AUTHENTICATION" 
  | "RATE_LIMIT"
  | "SERVER";

export class AuthError extends Error {
  constructor(
    message: string,
    public type: ErrorType,
    public originalError?: Error
  ) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Gestionnaire d'erreurs centralisé pour l'authentification
 */
export class ErrorHandler {
  private readonly errorMessages = {
    VALIDATION: "Les données fournies sont invalides",
    AUTHENTICATION: "Erreur d'authentification",
    RATE_LIMIT: "Trop de tentatives",
    SERVER: "Une erreur inattendue est survenue",
  };

  handle(error: unknown, type?: ErrorType): AuthError {
    // Gestion des erreurs de validation Zod
    if (error instanceof ZodError) {
      const message = this.formatZodError(error);
      logger.warn("Erreur de validation", { error: message });
      return new AuthError(message, "VALIDATION", error);
    }

    // Gestion des erreurs déjà traitées
    if (error instanceof AuthError) {
      return error;
    }

    // Gestion des erreurs standard
    if (error instanceof Error) {
      const errorType = type || "SERVER";
      logger.error("Erreur d'authentification", { 
        error: error.message,
        type: errorType,
        stack: error.stack
      });
      
      return new AuthError(
        error.message || this.errorMessages[errorType],
        errorType,
        error
      );
    }

    // Erreurs inconnues
    logger.error("Erreur inattendue", { error });
    return new AuthError(
      this.errorMessages.SERVER,
      "SERVER"
    );
  }

  private formatZodError(error: ZodError): string {
    return error.errors
      .map(err => `${err.path.join('.')}: ${err.message}`)
      .join(', ');
  }
}