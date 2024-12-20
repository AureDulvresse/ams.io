"use client";

import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/src/components/ui/chart";

// Données financières pour chaque mois
const chartData = [
  { month: "January", scolarite: 5000, dons: 1500, subventions: 1200 },
  { month: "February", scolarite: 5200, dons: 1800, subventions: 1000 },
  { month: "March", scolarite: 5400, dons: 1700, subventions: 1300 },
  { month: "April", scolarite: 5800, dons: 1600, subventions: 1100 },
  { month: "May", scolarite: 6000, dons: 1900, subventions: 1500 },
  { month: "June", scolarite: 6200, dons: 2000, subventions: 1400 },
];

// Configuration des courbes de données
const chartConfig = {
  scolarite: {
    label: "Frais de scolarité",
    color: "hsl(var(--chart-1))",
  },
  dons: {
    label: "Dons",
    color: "hsl(var(--chart-2))",
  },
  subventions: {
    label: "Subventions",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const FinancialChart = () => {
  return (
    <Card className="bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle>Revenus Financiers - Derniers 6 Mois</CardTitle>
        <CardDescription>
          Suivi des revenus par source (scolarité, dons, subventions).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="scolarite"
              type="monotone"
              stackId="1"
              stroke={chartConfig.scolarite.color}
              fillOpacity={0.4}
              fill={chartConfig.scolarite.color}
            />
            <Area
              dataKey="dons"
              type="monotone"
              stackId="1"
              stroke={chartConfig.dons.color}
              fillOpacity={0.4}
              fill={chartConfig.dons.color}
            />
            <Area
              dataKey="subventions"
              type="monotone"
              stackId="1"
              stroke={chartConfig.subventions.color}
              fillOpacity={0.4}
              fill={chartConfig.subventions.color}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Croissance de 5.8% ce mois-ci <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Janvier - Juin 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default FinancialChart;
