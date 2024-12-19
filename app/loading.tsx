import React from "react"

 const Loading: React.FC = () => {
  return (
    <div className="absolute z-50 flex items-center justify-center flex-col w-full min-h-screen bg-muted/50">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-400"></div>
      </div>
      <p className="mt-4 text-base text-gray-500 dark:text-gray-400">Chargement...</p>
    </div>
  );
}

export default Loading;