import React from "react";
import { Card, CardContent } from "../ui/card";
import { LucideProps } from "lucide-react";

interface StatCardProps {
  libelle: string;
  className?: string | null;
  data: string | number;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">> &
    React.ComponentType<React.SVGProps<SVGSVGElement>>;
  unity?: string;
  isLoading?: boolean; // Nouvelle prop pour gérer l'état de chargement
}

const StatCard: React.FC<StatCardProps> = ({
  libelle,
  className = null,
  data,
  icon: Icon,
  unity,
  isLoading = false, // Valeur par défaut à false
}) => {
  return (
    <Card className="py-2.5 hover:shadow-lg transition-shadow duration-200 ease-in-out bg-white dark:bg-gray-900">
      <CardContent>
        {isLoading ? (
          // Skeleton loader si les données sont en cours de chargement
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/3"></div> {/* Libellé */}
            <div className="flex items-center justify-between">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div> {/* Donnée */}
              <div className="h-10 w-10 bg-gray-300 rounded-full"></div> {/* Icône */}
            </div>
          </div>
        ) : (
          // Contenu réel une fois les données chargées
          <>
            <h3
              className={`text-md ${
                className ? className : "text-gray-500"
              } font-thin mb-2`}
            >
              {libelle}
            </h3>
            <div className="flex items-center justify-between">
              <p
                className={`${className ? className : "text-indigo-500"}`}
              >
                <span className="text-2xl font-semibold font-inter">{data} </span>
                {unity && (
                  <span className="text-gray-400 dark:text-gray-700 text-sm">
                    {unity}
                  </span>
                )}
              </p>
              <Icon
                className={`${className ? className : "text-indigo-500"}`}
                size={34}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
