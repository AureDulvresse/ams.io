"use client";

import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
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
   ChartTooltip,
   ChartTooltipContent,
} from "@/src/components/ui/chart";

// Définir le type des props pour le composant
interface RadarChartComponentProps {
   title: string;
   description: string;
   chartData: Record<string, number | string>[];
   chartConfig: ChartConfig;
   footerLabel: string;
   footerPeriod: string;
}

export function RadarChartComponent({
   title,
   description,
   chartData,
   chartConfig,
   footerLabel,
   footerPeriod,
}: RadarChartComponentProps) {
   return (
      <Card>
         <CardHeader className="items-center">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
         </CardHeader>
         <CardContent className="pb-0">
            <ChartContainer
               config={chartConfig}
               className="mx-auto aspect-square max-h-[250px]"
            >
               <RadarChart data={chartData}>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <PolarAngleAxis dataKey="month" />
                  <PolarGrid />
                  <Radar
                     dataKey={Object.keys(chartConfig)[0]} // Dynamique basé sur la config
                     fill={chartConfig[Object.keys(chartConfig)[0]].color}
                     fillOpacity={0.6}
                     dot={{
                        r: 4,
                        fillOpacity: 1,
                     }}
                  />
               </RadarChart>
            </ChartContainer>
         </CardContent>
         <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
               {footerLabel} <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
               {footerPeriod}
            </div>
         </CardFooter>
      </Card>
   );
}
