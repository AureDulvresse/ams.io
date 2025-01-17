import { isAuthenticated } from "@/auth";
import { NextResponse } from "next/server";
import { validateCsrfToken } from "@/src/lib/csrf";
import { createSubject } from "@/src/actions/subject.actions";
import { getSubjects } from "@/src/data/subject";
import { RateLimiter } from "@/src/lib/rate-limit";

const limiter = new RateLimiter();

export async function GET(request: Request) {
  try {
    // Vérification de l'authentification
    const session = await isAuthenticated(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    try {
      await limiter.checkRateLimit("SUBJECTS_API_CACHE");
    } catch {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    // Récupération des rôles
    const roles = await getSubjects();

    // Réponse avec des headers de cache
    return NextResponse.json(roles, {
      headers: {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("GET subjects error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Vérification de l'authentification
    const session = await isAuthenticated(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Vérification CSRF
    const isCsrfValid = await validateCsrfToken(request);
    if (!isCsrfValid) {
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 }
      );
    }

    // Rate limiting
    try {
      await limiter.checkRateLimit("SUBJECTS_CREATE_CACHE");
    } catch {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    // Récupération des données de la requête
    const formData = await request.json();

    // Vérification de la structure des données
    if (!formData || !formData.data) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Création du rôle
    const result = await createSubject(formData.data);

    // Gestion des erreurs renvoyées par `createSubject`
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Réponse en cas de succès
    return NextResponse.json(result.data, {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        "Content-Security-Policy": "default-src 'self'",
      },
    });
  } catch (error: any) {
    // Log de l'erreur pour le debugging
    console.error("POST role error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
