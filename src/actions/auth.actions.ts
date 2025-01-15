"use server";

import * as z from "zod";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { db } from "@/src/lib/prisma";
import { getUserByEmail } from "@/src/data/user";
import { signInSchema, signUpSchema } from "@/src/schemas/auth.schema";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { hashPassword } from "../lib/hasher";
import { generateVerificationToken } from "../lib/tokens";
import { sendVerificationEmail } from "@/src/lib/mail";
import { logger } from "@/src/lib/logger"; // Assuming you have a logger utility

interface AuthResponse {
  success?: string;
  error?: string;
}

/**
 * Authenticates a user by validating their email and password.
 *
 * @param {z.infer<typeof signInSchema>} credentials - User login credentials
 * @returns {Promise<AuthResponse>} Result of the authentication attempt
 */
export async function login(
  credentials: z.infer<typeof signInSchema>
): Promise<AuthResponse> {
  try {
    // Validate input credentials
    const validatedFields = signInSchema.safeParse(credentials);
    if (!validatedFields.success) {
      logger.warn("Invalid login credentials format", {
        errors: validatedFields.error.errors,
      });
      return { error: "Données d'authentification invalides" };
    }

    const { email, password } = validatedFields.data;

    // Check if user exists
    const existingUser = await getUserByEmail(email);
    if (!existingUser?.email || !existingUser?.password) {
      logger.info("Login attempt for non-existent user", { email });
      return { error: "Identifiants incorrects" };
    }

    // Handle unverified email
    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(
        existingUser.email
      );
      const emailResult = await sendVerificationEmail(
        verificationToken.identifier,
        verificationToken.token
      );

      if (emailResult.error) {
        logger.error("Failed to send verification email", {
          error: emailResult.error,
        });
        return { error: "Échec de l'envoi de l'email de vérification" };
      }

      return {
        error:
          "Veuillez vérifier votre email. Un nouveau lien de vérification vous a été envoyé.",
      };
    }

    // Attempt sign in
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    logger.info("Successful login", { email });
    return { success: "Connexion réussie" };
  } catch (error) {
    if (error instanceof AuthError) {
      logger.warn("Authentication error", {
        type: error.type,
        email: credentials.email,
      });

      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Identifiants incorrects" };
        default:
          return {
            error: "Une erreur est survenue lors de l'authentification",
          };
      }
    }

    logger.error("Unexpected error during login", { error });
    return { error: "Une erreur inattendue est survenue" };
  }
}

/**
 * Logs out the current user
 */
export async function logout(): Promise<void> {
  try {
    await signOut();
    logger.info("User logged out successfully");
  } catch (error) {
    logger.error("Error during logout", { error });
    throw new Error("Échec de la déconnexion");
  }
}

/**
 * Registers a new user account
 *
 * @param {z.infer<typeof signUpSchema>} data - User registration data
 * @returns {Promise<AuthResponse>} Result of the registration attempt
 */
export async function register(
  data: z.infer<typeof signUpSchema>
): Promise<AuthResponse> {
  try {
    // Validate registration data
    const validatedFields = signUpSchema.safeParse(data);
    if (!validatedFields.success) {
      logger.warn("Invalid registration data", {
        errors: validatedFields.error.errors,
      });
      return { error: "Données d'inscription invalides" };
    }

    const { email, password, confirm_password, first_name, last_name, roleId } =
      validatedFields.data;

    // Check for existing user
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      logger.warn("Registration attempt with existing email", { email });
      return { error: "Cette adresse email est déjà utilisée" };
    }

    // Validate password match
    if (password !== confirm_password) {
      return { error: "Les mots de passe ne correspondent pas" };
    }

    // Create new user
    const hashedPassword = await hashPassword(password);
    const newUser = await db.user.create({
      data: {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        roleId,
      },
    });

    // Generate and send verification token
    const verificationToken = await generateVerificationToken(email);
    const emailResult = await sendVerificationEmail(
      verificationToken.identifier,
      verificationToken.token
    );

    if (emailResult.error) {
      logger.error("Failed to send verification email for new user", {
        userId: newUser.id,
        error: emailResult.error,
      });
      return {
        error: "Compte créé mais échec de l'envoi de l'email de vérification",
      };
    }

    logger.info("New user registered successfully", {
      userId: newUser.id,
      email: newUser.email,
    });
    return {
      success: "Compte créé avec succès. Veuillez vérifier votre email",
    };
  } catch (error) {
    logger.error("Error during user registration", { error });
    return { error: "Une erreur est survenue lors de l'inscription" };
  }
}
