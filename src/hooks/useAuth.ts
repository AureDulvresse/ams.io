// hooks/useAuth.ts
import { useSession, signIn, signOut } from "next-auth/react";

export const useAuth = () => {
    const { data: session, status } = useSession();

    const isLoading = status === "loading";

    let isAuthenticated = false;

    const login = async (email: string, password: string, school: string) => {
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
                school,
            });

            if (result?.error) {
                isAuthenticated = true
                throw new Error(result.error);
            }
        } catch (error) {
            console.error("Error during login:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            isAuthenticated = false;
            await signOut({ redirect: false });
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return { session, isLoading, login, logout, isAuthenticated };
};
