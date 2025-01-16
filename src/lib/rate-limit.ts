import { LRUCache } from "lru-cache";
import { logger } from "@/src/lib/logger";

// Types
export interface RateLimitOptions {
  windowMs?: number;
  maxAttempts?: number;
  maxTokens?: number;
}

export interface RateLimitInfo {
  remaining: number;
  reset: number;
  total: number;
}

export class RateLimitExceededError extends Error {
  constructor(
    message: string,
    public readonly resetTime: Date,
    public readonly identifier: string
  ) {
    super(message);
    this.name = "RateLimitExceededError";
  }
}

// Constants
const DEFAULT_OPTIONS = {
  windowMs: 60 * 1000, // 1 minute
  maxAttempts: 5,
  maxTokens: 500,
} as const;

type TokenData = {
  attempts: number;
  startTime: number;
};

/**
 * Service de limitation de taux de requêtes
 */
export class RateLimiter {
  private readonly cache: LRUCache<string, TokenData>;
  private readonly options: Required<RateLimitOptions>;

  constructor(options: RateLimitOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.validateOptions();

    this.cache = new LRUCache<string, TokenData>({
      max: this.options.maxTokens,
      ttl: this.options.windowMs,
      updateAgeOnGet: false,
    });
  }

  /**
   * Vérifie si un identifiant a dépassé la limite de requêtes
   */
  async checkRateLimit(identifier: string): Promise<RateLimitInfo> {
    try {
      const now = Date.now();
      const tokenData = this.getOrCreateTokenData(identifier, now);

      if (tokenData.attempts >= this.options.maxAttempts) {
        const resetTime = new Date(tokenData.startTime + this.options.windowMs);
        logger.warn("Rate limit exceeded", {
          identifier,
          attempts: tokenData.attempts,
          resetTime,
        });

        throw new RateLimitExceededError(
          "Trop de tentatives. Veuillez patienter.",
          resetTime,
          identifier
        );
      }

      tokenData.attempts++;
      this.cache.set(identifier, tokenData);

      return this.getRateLimitInfo(tokenData);
    } catch (error) {
      if (error instanceof RateLimitExceededError) {
        throw error;
      }

      logger.error("Rate limiter error", {
        error,
        identifier,
        stack: error instanceof Error ? error.stack : undefined,
      });

      // En cas d'erreur technique, on laisse passer mais on log
      return {
        remaining: this.options.maxAttempts,
        reset: Date.now() + this.options.windowMs,
        total: this.options.maxAttempts,
      };
    }
  }

  /**
   * Réinitialise le compteur pour un identifiant
   */
  async reset(identifier: string): Promise<void> {
    this.cache.delete(identifier);
    logger.info("Rate limit reset", { identifier });
  }

  /**
   * Récupère les informations de limitation pour un identifiant
   */
  getRateLimitInfo(tokenData: TokenData): RateLimitInfo {
    return {
      remaining: Math.max(0, this.options.maxAttempts - tokenData.attempts),
      reset: tokenData.startTime + this.options.windowMs,
      total: this.options.maxAttempts,
    };
  }

  /**
   * Récupère ou crée les données pour un token
   */
  private getOrCreateTokenData(identifier: string, now: number): TokenData {
    const existing = this.cache.get(identifier);
    if (existing) {
      return existing;
    }

    const newData: TokenData = {
      attempts: 0,
      startTime: now,
    };
    this.cache.set(identifier, newData);
    return newData;
  }

  /**
   * Valide les options fournies
   */
  private validateOptions(): void {
    if (this.options.windowMs <= 0) {
      throw new Error("windowMs doit être supérieur à 0");
    }
    if (this.options.maxAttempts <= 0) {
      throw new Error("maxAttempts doit être supérieur à 0");
    }
    if (this.options.maxTokens <= 0) {
      throw new Error("maxTokens doit être supérieur à 0");
    }
  }
}

// Export d'une instance par défaut
export const defaultRateLimiter = new RateLimiter();

// Middleware pour Express/Next.js API Routes
export const createRateLimitMiddleware = (options?: RateLimitOptions) => {
  const limiter = new RateLimiter(options);

  return async (req: any, res: any, next: (error?: any) => void) => {
    try {
      const identifier = req.ip || "anonymous";
      const rateLimitInfo = await limiter.checkRateLimit(identifier);

      // Ajouter les headers de rate limit
      res.setHeader("X-RateLimit-Limit", rateLimitInfo.total);
      res.setHeader("X-RateLimit-Remaining", rateLimitInfo.remaining);
      res.setHeader("X-RateLimit-Reset", rateLimitInfo.reset);

      next();
    } catch (error) {
      if (error instanceof RateLimitExceededError) {
        res.setHeader("X-RateLimit-Reset", error.resetTime.getTime());
        res.status(429).json({
          error: "Too Many Requests",
          message: error.message,
          resetTime: error.resetTime,
        });
        return;
      }
      next(error);
    }
  };
};
