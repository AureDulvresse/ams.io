import React from "react";

const FecthLoader = () => {
   return (
      <div className="flex items-center justify-center flex-col min-h-full bg-muted">
         <div className="flex space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-200"></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-400"></div>
         </div>
         <p className="mt-4 text-base text-gray-500 dark:text-gray-400">Chargement...</p>
      </div>
   );
}

export default FecthLoader;