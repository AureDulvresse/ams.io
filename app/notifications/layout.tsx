"use client";
import React, { useState } from "react";
import Sidebar from "@/components/partials/Sidebar";
import Topbar from "@/components/partials/Topbar";

const _layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

  return (
    <div className="flex items-start min-h-screen w-full bg-slate-50 dark:bg-gray-800">
      <Sidebar />
      <main
        className={`transition-all duration-300 ml-64 py-1.5 w-full`}
      >
        <Topbar />
        <div className="p-1 mt-[75px] w-full">{children}</div>
      </main>
    </div>
  );
};

export default _layout;
