import React from "react";
import { UsersIcon, SchoolIcon, LayersIcon, CableIcon } from "lucide-react";
import StatCard from "@/src/components/common/stat-card";
import { Card } from "@/src/components/ui/card";
import NoDataState from "@/src/components/common/no-data-state";

const AdminDashboard = () => {
   return (
      <div className="space-y-4">
         {/* Statistiques principales */}
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
               libelle="Utilisateurs totaux"
               data={3254}
               icon={UsersIcon}
               comparison={12.4}
            />
            <StatCard
               libelle="Départements"
               data={34}
               icon={SchoolIcon}
               comparison={5.2}
            />
            <StatCard
               libelle="Rôles définis"
               data={8}
               icon={LayersIcon}
               comparison={0.0}
            />
            <StatCard
               libelle="Active Now"
               data={15}
               icon={CableIcon}
               comparison={-3.8}
               intervalle="hours"
            />
         </div>

<div className="grid grid-cols-3 gap-2">

</div>
         {/* Section supplémentaire */}
         <Card className="p-2">
            <h2 className="text-lg font-semibold">Activités récentes</h2>
            <NoDataState message="Aucune activité récente pour le moment." />
         </Card>
      </div>
   );
};

export default AdminDashboard;
