"use client";

import FinancialChart, { ChartData, ChartSeriesConfig } from "../common/financial-chart";

// Données pour les dépenses
const expenseData: ChartData[] = [
   { month: "January", salaire: 4000, materiel: 2000, travaux: 1000 },
   { month: "February", salaire: 4200, materiel: 2500, travaux: 1200 },
   { month: "March", salaire: 4300, materiel: 2400, travaux: 1100 },
   { month: "April", salaire: 4500, materiel: 2300, travaux: 1300 },
   { month: "May", salaire: 4600, materiel: 2600, travaux: 1500 },
   { month: "June", salaire: 4700, materiel: 2700, travaux: 1400 },
];

// Configuration des séries
const expenseConfig: Record<string, ChartSeriesConfig> = {
   salaire: {
      label: "Salaire",
      color: "hsl(var(--chart-4))",
   },
   materiel: {
      label: "Achat matériel",
      color: "hsl(var(--chart-5))",
   },
   travaux: {
      label: "Travaux",
      color: "hsl(var(--chart-6))",
   },
};

const ExpenseChart = () => {
   return (
      <FinancialChart
         title="Dépenses Financières - Derniers 6 Mois"
         description="Suivi des dépenses par source (salaire, achat matériel, travaux)."
         data={expenseData}
         config={expenseConfig}
         footerText="Janvier - Juin 2024"
         growthRate={4.2}
         timePeriod="Janvier - Juin 2024"
      />
   );
};

export default ExpenseChart;
