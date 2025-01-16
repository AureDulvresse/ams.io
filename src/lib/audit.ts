// @/lib/audit.ts
import { logger } from "@/src/lib/logger";
import { db } from "./prisma";

export type AuditLogData = {
  action: string;
  userId?: string;
  metadata?: Record<string, any>;
};

/**
 * Service de journalisation d'audit pour tracer les actions de sécurité
 */
export const createAuditLog = async (data: AuditLogData) => {
  try {
    const log = await db.auditLog.create({
      data: {
        user_id: data.userId,
        metadata: data.metadata,
        timestamp: new Date(),
      },
    });

    logger.info("Audit log créé", {
      action: data.action,
      userId: data.userId,
      metadata: data.metadata,
    });

    return log;
  } catch (error) {
    logger.error("Erreur lors de la création du log d'audit", {
      error,
      data,
    });

    // On ne propage pas l'erreur pour ne pas bloquer le flux principal
    return null;
  }
};
