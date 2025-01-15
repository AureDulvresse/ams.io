import { db } from "../lib/prisma";

export const verifyTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationRequest.findFirst({
      where: {
        identifier: email,
      },
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const verifyTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationRequest.findUnique({
      where: {
        token,
      },
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};
