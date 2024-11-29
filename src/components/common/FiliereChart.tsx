"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Description du graphique
export const description = "Répartition des étudiants par filière";

const chartData = [
  {
    filiere: "Informatique",
    etudiants: 275,
    fill: "var(--color-informatique)",
  },
  { filiere: "Gestion", etudiants: 200, fill: "var(--color-gestion)" },
  { filiere: "Droit", etudiants: 287, fill: "var(--color-droit)" },
  { filiere: "Médecine", etudiants: 173, fill: "var(--color-medecine)" },
  { filiere: "Autres", etudiants: 190, fill: "var(--color-autres)" },
];

const chartConfig = {
  etudiants: {
    label: "Étudiants",
  },
  informatique: {
    label: "Informatique",
    color: "hsl(var(--chart-1))",
  },
  gestion: {
    label: "Gestion",
    color: "hsl(var(--chart-2))",
  },
  droit: {
    label: "Droit",
    color: "hsl(var(--chart-3))",
  },
  medecine: {
    label: "Médecine",
    color: "hsl(var(--chart-4))",
  },
  autres: {
    label: "Autres",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const FiliereChart = () => {
  // Calcul du nombre total d'étudiants
  const totalEtudiants = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.etudiants, 0);
  }, []);

  return (
    <Card className="flex flex-col bg-white dark:bg-gray-900">
      <CardHeader className="items-center pb-0">
        <CardTitle>Répartition des Étudiants</CardTitle>
        <CardDescription>Semestre Janvier - Juin 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="etudiants"
              nameKey="filiere"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalEtudiants.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Étudiants
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Croissance de 3.4% ce semestre <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Total des étudiants par filière, Janvier - Juin 2024
        </div>
      </CardFooter>
    </Card>
  );
}

export default FiliereChart;