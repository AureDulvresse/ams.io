"use server";

import * as z from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { db } from "@/src/lib/prisma";
import { getUserByEmail } from "@/src/data/user";
import { signInSchema, signUpSchema } from "@/src/schemas/auth.schema";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { hashPassword } from "../lib/hasher";
import { generateVerificationToken } from "../lib/tokens";
import { sendVerificationEmail } from "../lib/mail";

/**
 * Authenticates a user by validating their email and password.
 *
 * @param {object} credentials - The credentials of the user attempting to log in.
 * @throws {AuthError} Throws an error if the email or password is invalid.
 * @throws {Error} Throws a generic error if an unexpected issue occurs.
 */
export const login = async (credentials: z.infer<typeof signInSchema>) => {
  // Validate credentials
  const validatedFields = signInSchema.safeParse(credentials);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password)
    return { error: "Ce compte n'existe pas" };

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { error: "Un email de verification a été envoyer à votre compte" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
    return { success: "Connexion réussie ! Bienvenue !" };

  } catch (error) {
    // Propagate authentication errors
    if (error instanceof AuthError) {
      console.log(error.type);
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Identifiant ou mot de passe incorrect" };

        default:
          return { error: "Une erreur inconnue s'est produite" };
      }
    }
    // Handle other types of errors (e.g., database connection issues)
    throw new Error(
      "An error occurred while verifying the user's credentials."
    );
  }
};

export const register = async (data: z.infer<typeof signUpSchema>) => {
  // Validate data
  const validatedFields = signUpSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password, confirm_password, first_name, last_name, role_id } =
    validatedFields.data;

  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) return { error: "Cet email est déjà utiliser" };

    if (password != confirm_password)
      return { error: "Les mots de passe ne correspondent pas" };

    const hashedPassword = await hashPassword(password);

    await db.user.create({
      data: {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        role_id,
      },
    });

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Email de confirmation envoyé" };
  } catch (error) {
    throw new Error(
      "An error occurred while verifying the user's credentials."
    );
  }
};