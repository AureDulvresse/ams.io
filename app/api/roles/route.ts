import { isAuthenticated } from "@/auth";
import { NextResponse } from "next/server";
import { db } from "@/src/lib/prisma";
import { createRole } from "@/src/data/role";
import { limiter } from "@/src/lib/rate-limit";
import { validateCsrfToken } from "@/src/lib/csrf";

export async function GET(request: Request) {
  try {
    // Vérification de l'authentification
    const session = await isAuthenticated(request);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });;

    // Rate limiting
    try {
      await limiter.check(10, "ROLES_API_CACHE");
    } catch {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const roles = await db.role.findMany({
      orderBy: { updated_at: "desc" },
    });

    return NextResponse.json(roles, {
      headers: {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("GET roles error:", error);
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
    if (!session) return;

    // Vérification CSRF
    if (!(await validateCsrfToken(request))) {
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 }
      );
    }

    // Rate limiting
    try {
      await limiter.check(5, "ROLES_CREATE_CACHE");
    } catch {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const formData = await request.json();

    const result = await createRole(formData.data);

    if (result?.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        "Content-Security-Policy": "default-src 'self'",
      },
    });
  } catch (error) {
    console.error("POST role error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
