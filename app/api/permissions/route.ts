import { db } from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import {
  createPermission,
  getUserPermissionsById,
} from "@/src/data/permission";
import { limiter } from "@/src/lib/rate-limit";
import { validateCsrfToken } from "@/src/lib/csrf";
import { isAuthenticated } from "@/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let permissions = null;

    // Vérification de l'authentification
    const session = await isAuthenticated(request);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Rate limiting
    try {
      await limiter.check(50, "PERMISSIONS_API_CACHE");
    } catch {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    if (userId) {
      permissions = await getUserPermissionsById(userId);
      return NextResponse.json(permissions);
    }

    permissions = await db.permission.findMany({
      orderBy: {
        updated_at: "desc",
      },
    });

    return NextResponse.json(permissions, {
      headers: {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("GET permissions error:", error);
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
      await limiter.check(5, "PERMISSIONS_CREATE_CACHE");
    } catch {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const formData = await request.json();

    const result = await createPermission(formData);

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
