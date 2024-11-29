"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card, CardContent } from "@/components/ui/card";
import Modal from "./Modal";
import { Event, Task } from "@/types";
import { Input } from "../ui/input";
import useServerAction from "@/hooks/useServerAction";
import { Textarea } from "../ui/textarea";
import { taskSchema } from "@/schemas/taskSchema";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import ScheduleCalendarSkeleton from "../loaders/ScheduleCalendarSkeleton";

interface ScheduleCalendarProps {
  className?: string;
  data: any[];
  isLoading: boolean;
}

interface TaskData {
  title: string;
  description?: string;
  date: string;
  repeat?: number;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  className = "",
  data,
  isLoading,
}) => {
  const [isShowEvent, setIsShowEvent] = useState(false);
  const [isShowTaskForm, setIsShowTaskForm] = useState(false);
  const [task, setTask] = useState<TaskData>({
    title: "",
    description: "",
    date: "",
    repeat: 1,
  });
  const [event, setEvent] = useState<Event>();

  const {
    executeAction,
    isLoading: isLoadingCreate,
    validationErrors,
  } = useServerAction("/api/tasks", "create", taskSchema);

  const toggleEventDetailModal = () => {
    setIsShowEvent(!isShowEvent);
  };

  const toggleTaskForm = () => {
    setIsShowTaskForm(!isShowTaskForm);
    setTask({
      title: "",
      description: "",
      date: "",
      repeat: 1,
    });
  };

  const handleDateClick = (arg: any) => {
    setTask((prevData) => ({ ...prevData, date: arg.dateStr }));
    setIsShowTaskForm(!isShowTaskForm);
  };

  const handleClickEvent = (info: any) => {
    setEvent(info.event);
    setIsShowEvent(!isShowEvent);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const newValue = name === "repeat" ? Number(value) : value;
    setTask((prevData) => ({ ...prevData, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isSuccess, message } = await executeAction(task);

    if (!isSuccess) {
      toast.error(
        `${message ? message : "Oops ! Une erreur est survenue..."}`,
        {
          position: "bottom-right",
        }
      );
      return;
    }

    toast.success("Tâche enregistré avec succès !", {
      position: "bottom-right",
    });

    toggleTaskForm();
  };

  return (
    <div>
      <Card
        className={`${className} overflow-auto bg-white py-4 dark:bg-gray-800 scrollbar-custom`}
      >
        {isLoading ? (
          <ScheduleCalendarSkeleton />
        ) : (
          <CardContent>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={data}
              dateClick={handleDateClick}
              eventClick={(info) => handleClickEvent(info)}
              editable={true}
              contentHeight="auto"
            />
          </CardContent>
        )}
      </Card>

      <Modal
        isOpen={isShowEvent}
        onClose={toggleEventDetailModal}
        title="Détail évènement"
        content={
          <div>
            <h4 className="text-md text-indigo-500">{event?.title}</h4>
            <p className="text-gray-500">{event?.description}</p>
          </div>
        }
        footer={
          <p className="text-xs text-gray-400">
            Information évènement du{" "}
            {typeof event?.date === "string"
              ? event.date
              : event?.date?.toLocaleDateString()}
          </p>
        }
      />

      <Modal
        isOpen={isShowTaskForm}
        onClose={toggleTaskForm}
        title="Ajouter une tâche"
        content={
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="p-1.5 border border-indigo-500 rounded-lg">
              <h4 className="text-center font-semibold font-inter text-sm text-indigo-500">{`Date et heure:  ${new Date(
                task.date
              ).toLocaleString()}`}</h4>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Titre <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="title"
                placeholder="Titre"
                value={task.title}
                onChange={handleChange}
                aria-label="Titre"
              />
              {validationErrors.title && (
                <p className="text-red-500">{validationErrors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description (Facultatif)
              </label>
              <Textarea
                name="description"
                placeholder="Description de la tâche"
                className="w-full h-18 resize-none"
                value={task.description}
                onChange={handleChange}
                aria-label="Description de la tâche"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Répétition de la tâche
              </label>
              <Input
                type="number"
                name="repeat"
                className="w-full"
                placeholder="Répétition de la tâche"
                value={task.repeat}
                onChange={handleChange}
                aria-label="Répétition de la tâche"
                min={1}
              />
              {validationErrors.repeat && (
                <p className="text-red-500">{validationErrors.repeat}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-48 bg-gradient-to-tr from-indigo-400 to-indigo-500 px-3 py-2 rounded-md shadow-sm text-white dark:text-gray-950 font-semibold hover:scale-105 transition-transform"
              disabled={isLoadingCreate}
            >
              {isLoadingCreate ? (
                <div className="flex items-center gap-1">
                  <Loader2 className="animate-spin text-white" size={15} />
                  <span className="text-white">Traitement...</span>
                </div>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </form>
        }
        footer={
          <p className="text-xs text-gray-400">
            <span className="text-red-500">*</span> Champs obligatoire
          </p>
        }
      />
    </div>
  );
};

export default ScheduleCalendar;
