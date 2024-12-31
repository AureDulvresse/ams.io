import { Payment } from "../components/finance/colums";

export const getTransaction = async (): Promise<Payment[]> => {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 15000,
      status: "pending",
      description: "Paiement des frais de scolarité",
    },
    {
      id: "749ed52f",
      amount: 130000,
      status: "success",
      description: "Salaires du personnel mois décembre",
    },
    {
      id: "828ed52f",
      amount: 600,
      status: "success",
      description: "Achat de matériel pédagogique",
    },
    {
      id: "828as52f",
      amount: 700,
      status: "processing",
      description: "Achat livre pour la biblothèque",
    },

    // ...
  ];
};
