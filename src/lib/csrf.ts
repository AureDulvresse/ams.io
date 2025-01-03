import { auth } from "@/auth";
import { createHash } from "crypto";

export async function validateCsrfToken(request: Request): Promise<boolean> {
  try {
    // Récupérer la session de l'utilisateur
    const session = await auth();
    if (!session?.user?.email) return false;

    // Récupérer le token CSRF de l'en-tête
    const csrfToken = request.headers.get("x-csrf-token");
    if (!csrfToken) return false;

    // Générer le hash attendu basé sur l'email de l'utilisateur et le timestamp
    const [timestamp, providedHash] = csrfToken.split(".");
    const timestampNum = parseInt(timestamp);

    // Vérifier si le token n'a pas expiré (1 heure)
    if (Date.now() - timestampNum > 3600000) return false;

    // Recréer le hash pour validation
    const expectedHash = createSecureHash(session.user.email, timestampNum);

    return expectedHash === providedHash;
  } catch (error) {
    console.error("CSRF validation error:", error);
    return false;
  }
}

export function createSecureHash(email: string, timestamp: number): string {
  return createHash("sha256")
    .update(`${email}-${timestamp}-${process.env.NEXTAUTH_SECRET}`)
    .digest("hex");
}
