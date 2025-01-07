import { db } from "../lib/prisma";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
      include: {
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Check if the user exists
    if (!user) {
      throw Error("User not found");
    }

    return user;
  } catch (error) {
    return null;
  }
};
export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true, // Inclut les détails des permissions
              },
            },
          },
        },
      },
    });

    // Vérifier si l'utilisateur existe
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return null;
  }
};


export const isSuperUser = (userRole: string) =>
  userRole.toLowerCase() == "superuser";
