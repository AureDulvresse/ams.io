// components/ProtectedRoute.tsx
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Ne rien faire pendant le chargement

    if (!session) {
      // Redirige l'utilisateur vers la page de connexion s'il n'est pas authentifié
      router.push("/login");
    }
  }, [session, status, router]);

  return <>{children}</>; // Rendre les enfants si la session est valide
};

export default ProtectedRoute;
