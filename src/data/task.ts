import { Task } from "@/constants/task-columns";

export const getTasks = async (): Promise<Task[]> => {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      title: "Vérifier les demandes de congés en attente.",
      status: "pending",
      description: "Paiement des frais de scolarité",
    },
    {
      id: "749ed52f",
      title: "Mettre à jour les informations des employés dans le système.",
      status: "success",
      description: "Salaires du personnel mois décembre",
    },
    {
      id: "828ed52f",
      title: "Finaliser les paiements des primes de fin d'année.",
      status: "success",
      description: "Achat de matériel pédagogique",
    },
  ];
};
