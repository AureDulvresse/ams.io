"use client";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
   CardDescription,
} from "@/src/components/ui/card";

// Type pour les données du Pie Chart
export type PieChartData = {
   name: string;
   value: number;
   color?: string; // Optionnel : vous pouvez définir des couleurs spécifiques
};

// Props pour le composant PieChartComponent
interface PieChartProps {
   title: string;
   description: string;
   data: PieChartData[];
   footerText?: string;
}

const PieChartComponent: React.FC<PieChartProps> = ({
   title,
   description,
   data,
   footerText,
}) => {
   return (
      <Card className="bg-white dark:bg-gray-900">
         <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
         </CardHeader>
         <CardContent>
            <PieChart width={400} height={400}>
               <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  label={(entry) => `${entry.name} (${entry.value})`}
               >
                  {data.map((entry, index) => (
                     <Cell
                        key={`cell-${index}`}
                        fill={entry.color || `hsl(${(index * 60) % 360}, 70%, 50%)`}
                     />
                  ))}
               </Pie>
               <Tooltip />
               <Legend />
            </PieChart>
         </CardContent>
         {footerText && <div className="p-4 text-sm text-muted-foreground">{footerText}</div>}
      </Card>
   );
};

export default PieChartComponent;
