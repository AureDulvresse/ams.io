import { db } from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import {
  createPermission,
  getUserPermissionsById,
} from "@/src/data/permission";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  let permissions = null;

  if (userId) {
    permissions = await getUserPermissionsById(userId);
    return NextResponse.json(permissions);
  }

  permissions = await db.permission.findMany({
    orderBy: {
      updated_at: "desc",
    },
  });

  return NextResponse.json(permissions);
}

export async function POST(request: Request) {
  const formData = await request.json();

  const result = await createPermission(formData);

  if (result?.error)
    return NextResponse.json({ error: result.error }, { status: 400 });

  return NextResponse.json(result.data, { status: 201 });
}
