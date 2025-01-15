import { v4 as uuidv4 } from "uuid";
import { verifyTokenByEmail } from "@/src/data/verification-token";
import { db } from "@/src/lib/prisma";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await verifyTokenByEmail(email);

  if (existingToken) {
    await db.verificationRequest.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await db.verificationRequest.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return verificationToken;
};
