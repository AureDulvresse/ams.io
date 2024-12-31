import { Notification } from "@/constants/notification-columns";

export const getNotifications = async (): Promise<Notification[]> => {
  // Fetch data from your API here.
  return [
    {
      id: "eh3467ft9",
      description: "Demande de congé de John Doe approuvée.",
      date: "2024-12-31",
    },
    {
      id: "eh14d7ft9",
      description: "Les paiements des salaires sont en cours pour ce mois.",
      date: "2024-01-04",
    },
    {
      id: "adn23n234",
      description:
        "Une nouvelle demande de recrutement pour un professeur est arrivée.",
      date: "2025-01-05",
    },
  ];
};
