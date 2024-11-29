"use client";
import React, { useState } from "react";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Archive } from "lucide-react";

const breadcrumbItems = [
  { href: "/", label: "Accueil" },
  { label: "Notifications", isCurrent: true },
];

// Exemple de données de notifications
const initialNotifications = [
  {
    id: 1,
    message: "Nouveau message de John Doe dans le chat",
    date: "2024-10-07",
    type: "chat",
    isRead: false,
  },
  {
    id: 2,
    message: "Votre facture est prête",
    date: "2024-10-06",
    type: "facture",
    isRead: false,
  },
  {
    id: 3,
    message: "Rappel de réunion demain",
    date: "2024-10-05",
    type: "rappel",
    isRead: false,
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all"); // Filtrer par "all", "chat", "facture", "rappel"

  // Fonction pour filtrer les notifications par type
  const filteredNotifications = notifications.filter((notification) =>
    filter === "all" ? true : notification.type === filter
  );

  // Fonction pour marquer une notification comme lue/archivée
  const handleArchiveNotification = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  return (
    <div className="mx-auto space-y-4">
      <DynamicBreadcrumb items={breadcrumbItems} />
      {/* Section Notifications */}
      <Card className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold font-fredoka text-indigo-500 mb-4 flex items-center">
          <Bell size={20} className="mr-2" /> Notifications
        </h2>

        {/* Filtres */}
        <div className="mb-4">
          <Button
            className={
              filter === "all" ? "bg-indigo-500 hover:bg-indigo-400" : ""
            }
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            Toutes
          </Button>
          <Button
            variant={filter === "chat" ? "default" : "outline"}
            onClick={() => setFilter("chat")}
            className={`ml-2 ${
              filter === "chat" ? "bg-indigo-500 hover:bg-indigo-400" : ""
            }`}
          >
            Chat
          </Button>
          <Button
            variant={filter === "facture" ? "default" : "outline"}
            onClick={() => setFilter("facture")}
            className={`ml-2 ${
              filter === "facture" ? "bg-indigo-500 hover:bg-indigo-400" : ""
            }`}
          >
            Factures
          </Button>
          <Button
            variant={filter === "rappel" ? "default" : "outline"}
            onClick={() => setFilter("rappel")}
            className={`ml-2 ${
              filter === "rappel" ? "bg-indigo-500 hover:bg-indigo-400" : ""
            }`}
          >
            Rappels
          </Button>
        </div>

        {/* Notifications list */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-md ${
                  notification.isRead
                    ? "bg-gray-300 dark:bg-gray-700"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {notification.date}
                </p>
                <div className="mt-2">
                  {!notification.isRead && (
                    <Button
                      variant="outline"
                      onClick={() => handleArchiveNotification(notification.id)}
                      className="flex items-center space-x-2"
                    >
                      <Archive size={16} />
                      <span>Archiver</span>
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Aucune notification pour le moment.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Notifications;
