"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import ScheduleCalendar from "@/components/common/ScheduleCalendar";
import ErrorCard from "@/components/partials/ErrorCard";
import useFetchData from "@/hooks/useFetchData";

const breadcrumbItems = [
  { href: "/", label: "Accueil" },
  { label: "Emploi du temps", isCurrent: true },
];

const SchedulePage: React.FC = () => {
  const navigate = useRouter(); 

  const {
    data: events,
    isLoading: isLoadingEvent,
    error: errorLoadEvent,
  } = useFetchData<Event[]>("/api/events");

  const {
      data: tasks,
      isLoading: isLoadingTask,
      error: errorLoadTask,
  } = useFetchData<Event[]>("/api/tasks");

  if (errorLoadEvent || errorLoadTask) {
    const error = errorLoadEvent || errorLoadTask || {message: ""};
    return <ErrorCard message={error.message} />;
  } 

  return (
    <div className="mx-auto space-y-4">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold font-fredoka text-indigo-500">
          Emploi du temps
        </h2>
        <Button
          className="font-inter flex items-center gap-1 bg-gradient-to-tr from-indigo-400 to-indigo-500 rounded-md shadow-sm text-white dark:text-gray-950 font-semibold hover:scale-[1.02] transition-all"
          onClick={() => navigate.push("/events/create")}
        >
          <Plus className="font-bold" size={18} />
          Planifier un événement
        </Button>
      </div>

      <ScheduleCalendar
        data={events || []}
        isLoading={isLoadingTask && isLoadingEvent}
      />
    </div>
  );
};

export default SchedulePage;
