import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./src/schemas/auth.schema";
import type { NextAuthConfig } from "next-auth";
import { getUserByEmail } from "./src/data/user";
import { validatePassword, validatePasswordStrength } from "./src/lib/hasher";

export default {
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;

        const { email, password } = await signInSchema.parseAsync(credentials);

        // logic to verify if the user exists
        user = await getUserByEmail(email);

        if (!user || !user.password) return null;

        if (user.password && !validatePasswordStrength(user.password))
          return null;

        const isPasswordValid = await validatePassword(password, user.password);

        if (isPasswordValid) {
          // If everything is valid, return the user object excluding the password
          const { password: _, ...userData } = user; // Exclude the password from the returned data
          return userData;
        }

        return null; // Return `null` to indicate that the credentials are invalid
      },
    }),
  ],
} satisfies NextAuthConfig;
