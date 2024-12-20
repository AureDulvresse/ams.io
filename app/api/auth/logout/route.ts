import { clearTokens } from "@/src/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  await clearTokens();
  return NextResponse.json({ success: true });
}
