"use client";
import React, { useState } from "react";
import { GraduationCapIcon, Users2, WalletIcon } from "lucide-react";
import ActivitySummary from "@/components/common/ActivitySummery";
import FiliereChart from "@/components/common/FiliereChart";
import FinancialChart from "@/components/common/FinancialChart";
import ScheduleCalendar from "@/components/common/ScheduleCalendar";
import StatCard from "@/components/common/StatCard";
import Sidebar from "@/components/partials/Sidebar";
import Topbar from "@/components/partials/Topbar";
import useFetchData from "@/hooks/useFetchData";

const Home = async () => {
  const {
    data: events,
    isLoading: isLoadingEvent,
    error,
  } = useFetchData<Event[]>("/api/events");

  return (
    <div className="flex items-start min-h-screen w-full bg-slate-50 dark:bg-gray-800">
      <Sidebar />
      <main
        className={`transition-all duration-300 ml-64 py-1.5 w-full`}
      >
        <Topbar />
        <div className="p-2 mt-[70px] w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Statistiques en haut */}
          <div className="lg:col-span-3 mb-4">
            <h2 className="text-2xl font-bold font-fredoka text-indigo-500 mb-6">
              Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <StatCard
                libelle={"Nombre total étudiant"}
                data={1200}
                icon={GraduationCapIcon}
              />
              <StatCard libelle={"Nombre personnel"} data={160} icon={Users2} />
              <StatCard
                libelle={"Revenu total"}
                data={230600}
                icon={WalletIcon}
                unity="XAF"
              />
              <StatCard
                libelle={"Dépense annuelle"}
                data={290600}
                icon={WalletIcon}
                unity="XAF"
              />
            </div>
          </div>
        </div>

        <div className="p-2 w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Graphiques en bas */}
          <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <FinancialChart />
            <FiliereChart />
          </div>
        </div>
        <div className="p-2 w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ScheduleCalendar
              className={"h-[450px]"}
              data={events || []}
              isLoading={isLoadingEvent}
            />
          </div>
          <div className="lg:col-span-1">
            <ActivitySummary />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
