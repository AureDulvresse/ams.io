import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { User } from "@/types";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                school: { label: "School", type: "text" },
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { school, email, password } = credentials as Record<string, string>;

                // Vérifie si l'utilisateur existe
                const user = await prisma.user.findFirst({
                    where: { email, related_id: parseInt(school, 10) }, // Vérifie selon l'école
                });

                // Vérifie le mot de passe
                if (user && (await bcrypt.compare(password, user.password))) {
                    return {
                        id: user.id.toString(), // Convertis l'id en string
                        email: user.email,
                        password: user.password,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        role_id: user.role_id,
                        related_id: user.related_id,
                    } as unknown as User; // Renvoie comme User
                }
                return null; // Authentification échouée
            },
        }),
    ],
    pages: {
        signIn: '/auth/signin', // Redirige vers ta page de connexion personnalisée
    },
    session: {
        strategy: "jwt", // Utiliser les JSON Web Tokens pour gérer les sessions
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id; // Ajoute l'ID de l'utilisateur au token
            }
            return token;
        },
        async session({ session, token }) {
            return session;
        },
    },
    secret: process.env.JWT_SECRET, // Assure-toi de définir cette variable d'environnement
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
