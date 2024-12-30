import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { LucideProps } from 'lucide-react';
import React from 'react';

interface StatCardProps {
   libelle: string;
   data?: string | number | null;
   icon?: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'>> &
   React.ComponentType<React.SVGProps<SVGSVGElement>>;
   unity?: string;
   isLoading?: boolean;
   error?: string;
   className?: string;
   showComparison?: boolean;
   comparison?: number;
   intervalle?: string;
}

const StatCard: React.FC<StatCardProps> = ({
   libelle,
   data,
   icon: Icon,
   unity = '', // Par défaut, aucune unité
   isLoading = false,
   error,
   className = '',
   showComparison = true,
   comparison,
   intervalle = 'month',
}) => {
   // Placeholder pour les données manquantes
   const placeholder = 'N/A';

   // Déterminer la couleur de la comparaison
   const comparisonColor = comparison
      ? comparison > 0
         ? 'text-green-500'
         : 'text-red-500'
      : 'text-muted-foreground';

   return (
      <Card className={`py-1 hover:shadow-lg transition-shadow duration-200 ease-in-out ${className}`}>
         <CardHeader className="flex flex-row items-center justify-between pt-1.5 pb-2 text-muted-foreground">
            <CardTitle className="text-sm font-medium">{libelle}</CardTitle>
            {Icon ? (
               <Icon className="h-4 w-4 text-muted-foregrounde" size={34} />
            ) : null}
         </CardHeader>
         <CardContent>
            {isLoading ? (
               // Skeleton Loader
               <div className="h-8 w-20 bg-gray-200 animate-pulse rounded-md"></div>
            ) : error ? (
               // Gestion des erreurs
               <div className="text-red-500 text-sm">{error}</div>
            ) : (
               // Données affichées
               <div className="text-2xl font-bold">{`${unity} ${data ?? placeholder}`}</div>
            )}
            {showComparison && !isLoading && !error && comparison !== undefined && (
               <p className={`text-xs ${comparisonColor} mt-1.5`}>
                  {comparison > 0
                     ? `+${comparison.toFixed(1)}% from last ${intervalle}`
                     : `${comparison.toFixed(1)}% from last ${intervalle}`}
               </p>
            )}
         </CardContent>
      </Card>
   );
};

export default StatCard;
