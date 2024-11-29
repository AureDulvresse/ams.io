"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";

const ConnectionLogs: React.FC = () => {
  const [logs, setLogs] = useState([
    { id: 1, user: "Admin", date: "2024-10-01", action: "Connexion réussie" },
    {
      id: 2,
      user: "John Doe",
      date: "2024-10-02",
      action: "Échec de connexion",
    },
  ]);

  return (
    <div>
      <Card className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4"> Logs de Connexion</h2>
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="flex justify-between">
              <p>
                {log.date} - {log.user}
              </p>
              <p>{log.action}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ConnectionLogs;
