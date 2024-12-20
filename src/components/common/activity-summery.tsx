import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

interface Activity {
  date: string;
  description: string;
}

const activities: Activity[] = [
  { date: "2024-09-10", description: "New student registration: John Doe" },
  { date: "2024-09-09", description: "Course material updated for Math 101" },
  { date: "2024-09-08", description: "Student Jane Smith graduated" },
  { date: "2024-09-07", description: "New feedback received on Science 202" },
  { date: "2024-09-06", description: "New teacher added: Dr. Alice Johnson" },
    { date: "2024-09-08", description: "Student Jane Smith graduated" }
];

const ActivitySummary: React.FC = () => {
  return (
    <Card className="bg-white h-[450px] dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md scrollbar-custom">
      <CardHeader>
        <CardTitle className="text-gray-800 dark:text-gray-200">
          Latest Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start flex-col py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {activity.description}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {activity.date}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivitySummary;
