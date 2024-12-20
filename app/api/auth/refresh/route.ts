// app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken, generateAccessToken, setTokens } from "@/src/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = cookies().get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token provided" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Generate new access token
    const accessToken = await generateAccessToken({
      userId: payload.userId,
      email: payload.email,
    });

    // Set the new access token in cookies
    await setTokens(accessToken, refreshToken);

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

