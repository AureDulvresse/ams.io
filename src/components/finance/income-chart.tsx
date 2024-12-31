"use client";

import FinancialChart, { ChartData, ChartSeriesConfig } from "../common/financial-chart";

// Données pour les revenus
const incomeData: ChartData[] = [
   { month: "January", scolarite: 5000, dons: 1500, travaux_dirigé: 1200 },
   { month: "February", scolarite: 5200, dons: 1800, travaux_dirigé: 1000 },
   { month: "March", scolarite: 5400, dons: 1700, travaux_dirigé: 1300 },
   { month: "April", scolarite: 5800, dons: 1600, travaux_dirigé: 1100 },
   { month: "May", scolarite: 6000, dons: 1900, travaux_dirigé: 1500 },
   { month: "June", scolarite: 6200, dons: 2000, travaux_dirigé: 1400 },
];

// Configuration des séries
const incomeConfig: Record<string, ChartSeriesConfig> = {
   scolarite: {
      label: "Frais de scolarité",
      color: "hsl(var(--chart-1))",
   },
   dons: {
      label: "Dons",
      color: "hsl(var(--chart-2))",
   },
   travaux_dirigé: {
      label: "Travaux dirigé",
      color: "hsl(var(--chart-3))",
   },
};

// Définition du composant ExpenseChart
interface IncomeChartProps {
   className?: string;
}

const IncomeChart: React.FC<IncomeChartProps> = ({ className }) => {
   return (
      <div className={className}>
         <FinancialChart
            title="Revenus Financiers - Derniers 6 Mois"
            description="Suivi des revenus par source (scolarité, dons, subventions)."
            data={incomeData}
            config={incomeConfig}
            footerText="Janvier - Juin 2024"
            growthRate={5.8}
            timePeriod="Janvier - Juin 2024"
         />
      </div>

   );
};

export default IncomeChart;
