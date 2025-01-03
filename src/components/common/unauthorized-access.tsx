import { ShieldOff } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const UnauthorizedAccess = () => {
   const router = useRouter();
   return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-4">
         <div className="bg-red-50 rounded-full p-4 mb-4">
            <ShieldOff className="h-12 w-12 text-red-500" />
         </div>
         <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès non autorisé</h2>
         <p className="text-gray-500 text-center max-w-md">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            Veuillez contacter votre administrateur si vous pensez que c'est une erreur.
         </p>
         <Button
            variant="default"
            className="mt-4"
            onClick={() => router.back()}
         >
            Retour
         </Button>
      </div>
   );
}

export default UnauthorizedAccess;