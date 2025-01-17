import { db } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return new NextResponse("Token manquant", { status: 400 });
  }

  try {
    const verificationRequest = await db.verificationRequest.findUnique({
      where: { token },
    });

    if (!verificationRequest) {
      return new NextResponse("Token invalide", { status: 400 });
    }

    if (new Date() > verificationRequest.expires) {
      return new NextResponse("Token expiré", { status: 400 });
    }

    await db.user.update({
      where: { email: verificationRequest.identifier },
      data: { emailVerified: new Date() },
    });

    await db.verificationRequest.delete({
      where: { id: verificationRequest.id },
    });

    return new NextResponse("Email vérifié avec succès", { status: 200 });
  } catch (error) {
    return new NextResponse("Erreur lors de la vérification", { status: 500 });
  }
}
