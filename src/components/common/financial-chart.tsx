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

// Définition du type pour les données du graphique
export type ChartData = Record<string, number | string>;

// Définition du type pour la configuration des séries
export interface ChartSeriesConfig {
   label: string;
   color: string;
}

// Définition des props du composant
interface FinancialChartProps {
   title: string;
   description: string;
   data: ChartData[];
   config: Record<string, ChartSeriesConfig>;
   footerText?: string;
   growthRate?: number;
   timePeriod?: string;
}

const FinancialChart: React.FC<FinancialChartProps> = ({
   title,
   description,
   data,
   config,
   footerText,
   growthRate,
   timePeriod,
}) => {
   return (
      <Card className="bg-white dark:bg-gray-900">
         <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
         </CardHeader>
         <CardContent>
            <ChartContainer config={config}>
               <AreaChart
                  data={data}
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
                  {Object.keys(config).map((key) => (
                     <Area
                        key={key}
                        dataKey={key}
                        type="monotone"
                        stackId="1"
                        stroke={config[key].color}
                        fillOpacity={0.4}
                        fill={config[key].color}
                     />
                  ))}
               </AreaChart>
            </ChartContainer>
         </CardContent>
         {footerText || growthRate || timePeriod ? (
            <CardFooter>
               <div className="flex w-full items-start gap-2 text-sm">
                  <div className="grid gap-2">
                     {growthRate && (
                        <div className="flex items-center gap-2 font-medium leading-none">
                           Croissance de {growthRate}% ce mois-ci <TrendingUp className="h-4 w-4" />
                        </div>
                     )}
                     {timePeriod && (
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                           {timePeriod}
                        </div>
                     )}
                  </div>
               </div>
            </CardFooter>
         ) : null}
      </Card>
   );
};

export default FinancialChart;
